import type {
  Action,
  ClipProjectItem,
  FolderItem,
  Markers,
  Project,
  ProjectItem,
  Sequence,
  TickTime,
  premierepro,
} from '../../types'

export type TimelineInsertMode = 'insert' | 'overwrite'

export interface MarkerTemplate {
  name?: string
  comment?: string
  type?: string
  startOffsetSeconds?: number
  durationSeconds?: number
}

export interface MarkerDefaults {
  name?: string
  comment?: string
  type?: string
}

export interface TimelinePlacementOptions {
  mode?: TimelineInsertMode
  timeSeconds?: number
  usePlayhead?: boolean
  useSequenceEnd?: boolean
  videoTrackIndex?: number
  audioTrackIndex?: number
  limitShift?: boolean
}

export interface IngestOptions {
  clipPath: string
  displayName?: string
  metadata?: Record<string, unknown>
  placement?: TimelinePlacementOptions
  markers?: MarkerTemplate[]
  markerDefaults?: MarkerDefaults
  reuseExisting?: boolean
  waitForImportMs?: number
  undoLabel?: string
}

export interface IngestResult {
  imported: boolean
  projectItemName: string
  projectItemPath: string
  placement: {
    mode: TimelineInsertMode
    timeSeconds: number
    videoTrackIndex: number
    audioTrackIndex: number
  }
  markersAdded: number
  warnings: string[]
}

export class PremiereServiceUnavailableError extends Error {
  constructor(message = 'Premiere Pro APIs are not available in this environment.') {
    super(message)
    this.name = 'PremiereServiceUnavailableError'
  }
}

export class PremiereIngestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PremiereIngestError'
  }
}

export class PremiereIngestService {
  private readonly ppro: premierepro | null

  constructor(pproInstance?: premierepro | null) {
    this.ppro = pproInstance ?? safeRequirePremiere()
  }

  isAvailable(): boolean {
    return Boolean(this.ppro)
  }

  async ingestLocalClip(options: IngestOptions): Promise<IngestResult> {
    const warnings: string[] = []
    const ppro = this.requirePremiere()

    const normalizedPath = this.normalizePath(options.clipPath)
    const project = await this.getActiveProject(ppro)
    const sequence = await this.getActiveSequence(project)

    const placementState = await this.resolvePlacement(ppro, sequence, options.placement)
    const trackInfo = this.resolveTrackIndexes(options.placement)

    let projectItem = options.reuseExisting === false
      ? null
      : await this.findProjectItemByMediaPath(ppro, project, normalizedPath)

    let imported = false

    if (!projectItem) {
      const importSuccess = await this.importIntoProject(project, normalizedPath)
      if (!importSuccess) {
        throw new PremiereIngestError(`Failed to import clip into project: ${normalizedPath}`)
      }

      imported = true

      projectItem = await this.waitForProjectItem(ppro, project, normalizedPath, options.waitForImportMs)
      if (!projectItem) {
        throw new PremiereIngestError(
          `Imported clip was not found in project bins after ${options.waitForImportMs ?? 1500}ms`
        )
      }
    }

    const markerTemplates = this.resolveMarkerTemplates(options, projectItem.name)
    const markerActions = await this.buildMarkerActions(
      ppro,
      sequence,
      placementState.tickTime,
      markerTemplates
    )
    const renameAction = this.buildRenameAction(projectItem as ProjectItem, options.displayName)
    const metadataActionResult = await this.buildProjectMetadataAction(
      ppro,
      projectItem as ProjectItem,
      options.metadata,
      options.displayName ?? projectItem.name
    )

    if (metadataActionResult.warning) {
      warnings.push(metadataActionResult.warning)
    }

    const sequenceEditor = ppro.SequenceEditor.getEditor(sequence)
    const mode: TimelineInsertMode = options.placement?.mode ?? 'insert'

    let transactionSuccess = false
    project.lockedAccess(() => {
      transactionSuccess = project.executeTransaction(compoundAction => {
        const action = mode === 'overwrite'
          ? sequenceEditor.createOverwriteItemAction(
              projectItem as ProjectItem,
              placementState.tickTime,
              trackInfo.videoTrackIndex,
              trackInfo.audioTrackIndex
            )
          : sequenceEditor.createInsertProjectItemAction(
              projectItem as ProjectItem,
              placementState.tickTime,
              trackInfo.videoTrackIndex,
              trackInfo.audioTrackIndex,
              trackInfo.limitShift
            )

        compoundAction.addAction(action)
        if (renameAction) {
          compoundAction.addAction(renameAction)
        }
        markerActions.forEach(markerAction => compoundAction.addAction(markerAction))
        if (metadataActionResult.action) {
          compoundAction.addAction(metadataActionResult.action)
        }
      }, options.undoLabel ?? 'Bolt: Insert Local Clip')
    })

    if (!transactionSuccess) {
      throw new PremiereIngestError('Premiere Pro could not complete the ingest transaction.')
    }

    return {
      imported,
      projectItemName: projectItem.name,
      projectItemPath: normalizedPath,
      placement: {
        mode,
        timeSeconds: placementState.seconds,
        videoTrackIndex: trackInfo.videoTrackIndex,
        audioTrackIndex: trackInfo.audioTrackIndex,
      },
      markersAdded: markerActions.length,
      warnings,
    }
  }

  private requirePremiere(): premierepro {
    if (!this.ppro) {
      throw new PremiereServiceUnavailableError()
    }
    return this.ppro
  }

  private async getActiveProject(ppro: premierepro): Promise<Project> {
    const project = await ppro.Project.getActiveProject()
    if (!project) {
      throw new PremiereIngestError('No active Premiere Pro project is open.')
    }
    return project
  }

  private async getActiveSequence(project: Project): Promise<Sequence> {
    const sequence = await project.getActiveSequence()
    if (!sequence) {
      throw new PremiereIngestError('No active sequence available. Please open a timeline before ingesting clips.')
    }
    return sequence
  }

  private async resolvePlacement(
    ppro: premierepro,
    sequence: Sequence,
    placement?: TimelinePlacementOptions
  ): Promise<{ seconds: number; tickTime: TickTime }> {
    if (typeof placement?.timeSeconds === 'number') {
      return {
        seconds: placement.timeSeconds,
        tickTime: ppro.TickTime.createWithSeconds(placement.timeSeconds),
      }
    }

    if (placement?.useSequenceEnd) {
      const endTime = await sequence.getEndTime()
      return {
        seconds: endTime.seconds,
        tickTime: endTime,
      }
    }

    if (placement?.usePlayhead !== false) {
      const playhead = await sequence.getPlayerPosition()
      if (playhead) {
        return {
          seconds: playhead.seconds,
          tickTime: playhead,
        }
      }
    }

    return {
      seconds: 0,
      tickTime: ppro.TickTime.TIME_ZERO,
    }
  }

  private resolveTrackIndexes(placement?: TimelinePlacementOptions): {
    videoTrackIndex: number
    audioTrackIndex: number
    limitShift: boolean
  } {
    return {
      videoTrackIndex: Math.max(0, placement?.videoTrackIndex ?? 0),
      audioTrackIndex: Math.max(0, placement?.audioTrackIndex ?? 0),
      limitShift: placement?.limitShift ?? true,
    }
  }

  private resolveMarkerTemplates(options: IngestOptions, fallbackName: string): MarkerTemplate[] {
    if (options.markers && options.markers.length > 0) {
      return options.markers
    }

    const defaultName = options.markerDefaults?.name ?? `Bolt Clip · ${options.displayName ?? fallbackName}`
    const defaultComment = options.markerDefaults?.comment ?? this.stringifyMetadata(options.metadata)
    const defaultType = options.markerDefaults?.type

    return [
      {
        name: defaultName,
        comment: defaultComment,
        type: defaultType,
        startOffsetSeconds: 0,
      },
    ]
  }

  private stringifyMetadata(metadata?: Record<string, unknown>): string | undefined {
    if (!metadata || Object.keys(metadata).length === 0) {
      return undefined
    }

    try {
      return JSON.stringify(metadata, null, 2)
    } catch (error) {
      console.warn('[PremiereIngestService] Unable to stringify metadata for marker comment:', error)
      return undefined
    }
  }

  private async buildMarkerActions(
    ppro: premierepro,
    sequence: Sequence,
    baseTickTime: TickTime,
    markers: MarkerTemplate[]
  ): Promise<Action[]> {
    if (!markers.length) {
      return []
    }

    const markerCollection: Markers = await ppro.Markers.getMarkers(sequence)
    const actions: Action[] = []

    for (const marker of markers) {
      const startTime = typeof marker.startOffsetSeconds === 'number'
        ? baseTickTime.add(ppro.TickTime.createWithSeconds(marker.startOffsetSeconds))
        : baseTickTime

      const duration = typeof marker.durationSeconds === 'number'
        ? ppro.TickTime.createWithSeconds(marker.durationSeconds)
        : undefined

      const action = markerCollection.createAddMarkerAction(
        marker.name ?? 'Bolt Marker',
        marker.type ?? ppro.Marker.MARKER_TYPE_COMMENT,
        startTime,
        duration,
        marker.comment
      )

      actions.push(action)
    }

    return actions
  }

  private buildRenameAction(projectItem: ProjectItem, displayName?: string | null): Action | null {
    if (!displayName || displayName.trim().length === 0) {
      return null
    }

    if (projectItem.name === displayName) {
      return null
    }

    try {
      if (typeof projectItem.createSetNameAction === 'function') {
        return projectItem.createSetNameAction(displayName)
      }
    } catch (error) {
      console.warn('[PremiereIngestService] Unable to create rename action:', error)
    }

    return null
  }

  private async buildProjectMetadataAction(
    ppro: premierepro,
    projectItem: ProjectItem,
    metadata: Record<string, unknown> | undefined,
    displayName?: string
  ): Promise<{ action: Action | null; warning?: string }> {
    if (!metadata || Object.keys(metadata).length === 0) {
      return { action: null }
    }

    const comment = this.buildProjectMetadataComment(metadata, displayName)
    if (!comment) {
      return { action: null }
    }

    try {
      const xml = this.buildProjectMetadataXml(comment)
      const action = await ppro.Metadata.createSetProjectMetadataAction(projectItem, xml, [
        'Column.Intrinsic.Comment',
        'Column.PropertyText.Comment',
      ])

      return { action }
    } catch (error) {
      const warning = '[PremiereIngestService] Unable to prepare project metadata action: ' + (error instanceof Error ? error.message : String(error))
      console.warn(warning)
      return { action: null, warning }
    }
  }

  private buildProjectMetadataComment(metadata: Record<string, unknown>, displayName?: string): string | null {
    const parts: string[] = []

    if (displayName) {
      parts.push(`Clip: ${displayName}`)
    }

    const promptRaw = metadata['prompt']
    const prompt = typeof promptRaw === 'string' ? promptRaw : undefined
    if (prompt) {
      parts.push(`Prompt: ${prompt}`)
    }

    const modelRaw = metadata['model']
    const model = typeof modelRaw === 'string' ? modelRaw : undefined
    if (model) {
      parts.push(`Model: ${model}`)
    }

    const seedValue = metadata['seed']
    if (typeof seedValue === 'number') {
      parts.push(`Seed: ${seedValue}`)
    } else if (Array.isArray(seedValue) && seedValue.length > 0 && typeof seedValue[0] === 'number') {
      parts.push(`Seeds: ${(seedValue as number[]).join(', ')}`)
    }

    const duration = metadata['duration']
    if (typeof duration === 'number' && Number.isFinite(duration)) {
      parts.push(`Duration: ${duration.toFixed(2)}s`)
    }

    const timestamp = metadata['timestamp']
    if (typeof timestamp === 'number') {
      parts.push(`Generated: ${new Date(timestamp).toLocaleString()}`)
    }

    const persistenceRaw = metadata['persistenceMethod']
    const persistence = typeof persistenceRaw === 'string' ? persistenceRaw : undefined
    if (persistence) {
      parts.push(`Persistence: ${persistence}`)
    }

    const storageModeRaw = metadata['storageMode']
    const storageMode = typeof storageModeRaw === 'string' ? storageModeRaw : undefined
    if (storageMode) {
      parts.push(`Storage: ${storageMode}`)
    }

    if (parts.length === 0) {
      return this.stringifyMetadata(metadata) ?? null
    }

    return parts.join('\n')
  }

  private buildProjectMetadataXml(comment: string): string {
    const escapedComment = this.escapeXml(comment)

    return `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>` +
      `<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core">` +
      `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">` +
      `<rdf:Description rdf:about="" xmlns:premierePrivateProjectMetaData="http://ns.adobe.com/premierePrivateProjectMetaData/1.0/">` +
      `<premierePrivateProjectMetaData:Column.Intrinsic.Comment>${escapedComment}</premierePrivateProjectMetaData:Column.Intrinsic.Comment>` +
      `<premierePrivateProjectMetaData:Column.PropertyText.Comment>${escapedComment}</premierePrivateProjectMetaData:Column.PropertyText.Comment>` +
      `</rdf:Description>` +
      `</rdf:RDF>` +
      `</x:xmpmeta>` +
      `<?xpacket end="w"?>`
  }

  private escapeXml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  private async importIntoProject(project: Project, clipPath: string): Promise<boolean> {
    try {
      return await project.importFiles([clipPath], true)
    } catch (error) {
      console.error('[PremiereIngestService] Import failed:', error)
      return false
    }
  }

  private async waitForProjectItem(
    ppro: premierepro,
    project: Project,
    clipPath: string,
    timeoutMs = 1500
  ): Promise<ClipProjectItem | null> {
    const start = Date.now()
    const interval = 100
    let attempt = 0

    while (Date.now() - start < timeoutMs) {
      const item = await this.findProjectItemByMediaPath(ppro, project, clipPath)
      if (item) {
        return item
      }

      attempt += 1
      await delay(interval)

      if (attempt === Math.floor(timeoutMs / interval / 2)) {
        console.warn('[PremiereIngestService] Still waiting for imported clip to appear in project bins...')
      }
    }

    return null
  }

  private async findProjectItemByMediaPath(
    ppro: premierepro,
    project: Project,
    clipPath: string
  ): Promise<ClipProjectItem | null> {
    const normalizedTarget = this.normalizePath(clipPath, true)
    const rootItem = await project.getRootItem()
    const queue: ProjectItem[] = await this.getFolderItems(ppro, rootItem)

    while (queue.length > 0) {
      const current = queue.shift()
      if (!current) {
        break
      }

      const folder = this.tryCastFolder(ppro, current)
      if (folder) {
        const children = await folder.getItems()
        queue.push(...children)
        continue
      }

      const clip = this.tryCastClip(ppro, current)
      if (clip) {
        try {
          const mediaPath = await clip.getMediaFilePath()
          if (mediaPath && this.normalizePath(mediaPath, true) === normalizedTarget) {
            return clip
          }
        } catch (error) {
          console.warn('[PremiereIngestService] Unable to read media file path for project item:', error)
        }
      }
    }

    return null
  }

  private async getFolderItems(ppro: premierepro, root: ProjectItem): Promise<ProjectItem[]> {
    const folder = this.tryCastFolder(ppro, root)
    if (!folder) {
      return []
    }

    try {
      return await folder.getItems()
    } catch (error) {
      console.warn('[PremiereIngestService] Failed to enumerate folder items:', error)
      return []
    }
  }

  private tryCastFolder(ppro: premierepro, item: ProjectItem): FolderItem | null {
    try {
      return ppro.FolderItem.cast(item)
    } catch {
      return null
    }
  }

  private tryCastClip(ppro: premierepro, item: ProjectItem): ClipProjectItem | null {
    try {
      return ppro.ClipProjectItem.cast(item)
    } catch {
      return null
    }
  }

  private normalizePath(input: string, forComparison = false): string {
    const trimmed = input.trim()
    const replaced = trimmed.replace(/\\+/g, '/').replace(/\/{2,}/g, '/').replace(/\/+$/, '')
    return forComparison ? replaced.toLowerCase() : replaced
  }
}

function safeRequirePremiere(): premierepro | null {
  const requireFn = (globalThis as unknown as { require?: (moduleId: string) => unknown }).require
  if (!requireFn) {
    return null
  }

  try {
    return requireFn('premierepro') as premierepro
  } catch (error) {
    console.warn('[PremiereIngestService] Premiere Pro module is not available:', error)
    return null
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
