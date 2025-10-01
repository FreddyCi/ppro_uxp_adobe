// @ts-ignore
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useGalleryStore } from '../../store/galleryStore'
import type { ContentItem, VideoData } from '../../types/content'
import type { GenerationMetadata } from '../../types/firefly'
import {
  PremiereIngestError,
  PremiereIngestService,
  TimelinePlacementOptions,
  MarkerTemplate,
  IngestResult,
} from '../../services/premiere'
import {
  getConfiguredLocalFolderInfo,
  promptForLocalFolderSelection,
} from '../../services/local/localBoltStorage'
import { useToastHelpers } from '../../hooks/useToast'
import './LocalIngestPanel.scss'

export interface LocalClip {
  id: string
  source: 'generated' | 'manual'
  displayName: string
  filePath: string
  metadata?: GenerationMetadata | Record<string, unknown>
  metadataPath?: string | null
  durationSeconds?: number
  prompt?: string
  model?: string
  seed?: number
  createdAt?: number
}

interface ClipStatusMap {
  [clipId: string]: {
    state: 'idle' | 'ingesting' | 'success' | 'error'
    message?: string
    result?: IngestResult
  }
}

const MARKER_BASE_NAME = 'Bolt Timeline Marker'

export function extractMetadataComment(clip: LocalClip): string {
  const metadata = clip.metadata as GenerationMetadata | undefined
  const lines: string[] = []

  lines.push(`Prompt: ${clip.prompt ?? metadata?.prompt ?? 'N/A'}`)

  if (metadata?.model) {
    lines.push(`Model: ${metadata.model}`)
  }

  if (typeof metadata?.seed === 'number') {
    lines.push(`Seed: ${metadata.seed}`)
  } else if (typeof clip.seed === 'number') {
    lines.push(`Seed: ${clip.seed}`)
  }

  if (typeof clip.durationSeconds === 'number') {
    lines.push(`Duration: ${clip.durationSeconds.toFixed(2)}s`)
  } else if (typeof metadata?.duration === 'number') {
    lines.push(`Duration: ${metadata.duration.toFixed(2)}s`)
  }

  if (metadata?.version) {
    lines.push(`Version: ${metadata.version}`)
  }

  if (metadata?.timestamp) {
    const d = new Date(metadata.timestamp)
    lines.push(`Generated: ${d.toLocaleString()}`)
  }

  if (metadata?.persistenceMethod === 'local' && metadata.localPersistenceProvider) {
    lines.push(`Stored via: ${metadata.localPersistenceProvider.toUpperCase()}`)
  }

  return lines.join('\n')
}

export function formatSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0s'
  }

  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds.toFixed(0)}s`
}

export function parseNumericArray(value: unknown): number[] {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value
      .map(entry => {
        if (typeof entry === 'number') {
          return entry
        }

        if (typeof entry === 'string') {
          const parsed = parseFloat(entry)
          return Number.isFinite(parsed) ? parsed : null
        }

        return null
      })
      .filter((entry): entry is number => entry !== null && Number.isFinite(entry))
  }

  return []
}

export const LocalIngestPanel: React.FC = () => {
  const contentItems = useGalleryStore(state => state.contentItems)
  const serviceRef = useRef<PremiereIngestService | null>(null)
  const [videoTrackIndex, setVideoTrackIndex] = useState(1)
  const [audioTrackIndex, setAudioTrackIndex] = useState(1)
  const [placementMode, setPlacementMode] = useState<'append' | 'playhead' | 'custom'>('append')
  const [editMode, setEditMode] = useState<'insert' | 'overwrite'>('insert')
  const [customSeconds, setCustomSeconds] = useState(0)
  const [limitShift, setLimitShift] = useState(true)
  const [manualClips, setManualClips] = useState<LocalClip[]>([])
  const [statusMap, setStatusMap] = useState<ClipStatusMap>({})
  const [folderInfo, setFolderInfo] = useState(getConfiguredLocalFolderInfo())
  const { showError, showInfo, showSuccess, showWarning } = useToastHelpers()
  const hasConfiguredFolder = Boolean(folderInfo.folderPath && folderInfo.folderToken)

  const detectedClips = useMemo<LocalClip[]>(() => {
    // Filter for video content items that have local file paths
    return contentItems
      .filter(item => {
        const isVideo = item.contentType === 'video' || item.contentType === 'uploaded-video'
        return isVideo && item.localPath
      })
      .map(item => {
        const videoContent = item.content as VideoData
        const prompt = item.filename || 'Video clip'
        const durationSeconds = videoContent?.duration

        // Handle timestamp conversion - it might be a Date, number, or undefined
        let createdAt: number
        if (item.timestamp instanceof Date) {
          createdAt = item.timestamp.getTime()
        } else if (typeof item.timestamp === 'number') {
          createdAt = item.timestamp
        } else {
          createdAt = Date.now()
        }

        return {
          id: item.id,
          source: 'generated' as const,
          displayName: item.filename || item.localPath?.split(/[/\\]/).pop() || 'Video clip',
          filePath: item.localPath || '',
          metadata: {} as GenerationMetadata,
          metadataPath: item.localMetadataPath || null,
          durationSeconds,
          prompt,
          model: undefined,
          seed: undefined,
          createdAt,
        }
      })
      .filter(clip => clip.filePath.length > 0)
  }, [contentItems])

  const clips = useMemo<LocalClip[]>(() => {
    const combined = [...detectedClips]

    manualClips.forEach(clip => {
      const existingIndex = combined.findIndex(existing => existing.filePath === clip.filePath)
      if (existingIndex >= 0) {
        combined[existingIndex] = clip
      } else {
        combined.unshift(clip)
      }
    })

    return combined.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
  }, [detectedClips, manualClips])

  const resolveService = useCallback(() => {
    if (!serviceRef.current) {
      serviceRef.current = new PremiereIngestService()
    }
    return serviceRef.current
  }, [])

  const buildPlacement = useCallback((): TimelinePlacementOptions => {
    const placement: TimelinePlacementOptions = {
      mode: editMode,
      videoTrackIndex: Math.max(0, videoTrackIndex - 1),
      audioTrackIndex: Math.max(0, audioTrackIndex - 1),
      limitShift,
    }

    if (placementMode === 'append') {
      placement.useSequenceEnd = true
    } else if (placementMode === 'playhead') {
      placement.usePlayhead = true
    } else {
      placement.timeSeconds = Math.max(0, customSeconds || 0)
      placement.usePlayhead = false
    }

    return placement
  }, [audioTrackIndex, customSeconds, editMode, limitShift, placementMode, videoTrackIndex])

  const buildMarkerTemplates = useCallback((clip: LocalClip): MarkerTemplate[] => {
    const templates: MarkerTemplate[] = []
    const comment = extractMetadataComment(clip)

    templates.push({
      name: `${MARKER_BASE_NAME} • Start`,
      startOffsetSeconds: 0,
      comment: 'Clip starts',
    })

    templates.push({
      name: `${MARKER_BASE_NAME} • Metadata`,
      startOffsetSeconds: 0,
      comment,
    })

    const duration = clip.durationSeconds
    if (typeof duration === 'number' && duration > 0.01) {
      templates.push({
        name: `${MARKER_BASE_NAME} • End`,
        startOffsetSeconds: duration,
        comment: 'Clip ends',
      })
    }

    const beatMarkers = parseNumericArray((clip.metadata as Record<string, unknown> | undefined)?.beatMarkers)
    beatMarkers.forEach((beat, index) => {
      templates.push({
        name: `${MARKER_BASE_NAME} • Beat ${index + 1}`,
        startOffsetSeconds: beat,
        comment: `Beat marker ${index + 1} at ${beat.toFixed(2)}s`,
      })
    })

    return templates
  }, [])

  const updateStatus = useCallback((clipId: string, status: ClipStatusMap[string]) => {
    setStatusMap(prev => ({
      ...prev,
      [clipId]: status,
    }))
  }, [])

  const handleRemoveManualClip = useCallback((clipId: string) => {
    setManualClips(prev => prev.filter(clip => clip.id !== clipId))
    setStatusMap(prev => {
      const { [clipId]: _removed, ...rest } = prev
      return rest
    })
    showInfo('Clip removed', 'Manual clip removed from the ingest queue.')
  }, [showInfo])

  const handleIngestClip = useCallback(
    async (clip: LocalClip) => {
      console.log('Send to Premiere button clicked for clip:', clip.displayName, clip.filePath)
      const service = resolveService()

      if (!service.isAvailable()) {
        showError('Premiere unavailable', 'This action only works inside Premiere Pro.')
        return
      }

      // Check for active sequence before attempting ingest
      const hasSequence = await service.hasActiveSequence()
      if (!hasSequence) {
        showError('No timeline open', 'Please open a sequence/timeline in Premiere Pro before ingesting clips.')
        return
      }

      if (!clip.filePath) {
        showError('Missing file path', 'The selected clip does not have a local file path.')
        return
      }

      updateStatus(clip.id, { state: 'ingesting', message: 'Sending to Premiere…' })

      const placement = buildPlacement()
      const markers = buildMarkerTemplates(clip)

      try {
        const result = await service.ingestLocalClip({
          clipPath: clip.filePath,
          displayName: clip.displayName,
          metadata: clip.metadata as Record<string, unknown> | undefined,
          placement,
          markers,
          markerDefaults: {
            name: `${MARKER_BASE_NAME} • ${clip.displayName}`,
            comment: extractMetadataComment(clip),
          },
          reuseExisting: true,
          undoLabel: `Bolt: Import ${clip.displayName}`,
        })

        const timecode = formatSeconds(result.placement.timeSeconds)
        showSuccess('Clip placed on timeline', `${clip.displayName} at ${timecode} (V${result.placement.videoTrackIndex + 1})`)
        updateStatus(clip.id, {
          state: 'success',
          message: `Timeline ${result.placement.mode} at ${timecode}`,
          result,
        })
      } catch (error) {
        const message =
          error instanceof PremiereIngestError
            ? error.message
            : error instanceof Error
              ? error.message
              : 'An unknown error occurred.'

        updateStatus(clip.id, { state: 'error', message })
        showError('Ingest failed', message)
      }
    },
    [buildMarkerTemplates, buildPlacement, resolveService, showError, showSuccess, updateStatus]
  )

  const handlePickManualClip = useCallback(async () => {
    try {
      const requireFn = (globalThis as unknown as { require?: (moduleId: string) => any }).require
      if (!requireFn) {
        showWarning('Unavailable', 'File dialog is not available in this environment.')
        return
      }

      const uxp = requireFn('uxp') as any
      const localFs = uxp?.storage?.localFileSystem

      if (!localFs?.getFileForOpening) {
        showWarning('Unavailable', 'File picker is not supported in this host.')
        return
      }

      const file = await localFs.getFileForOpening({ types: ['mp4', 'mov', 'm4v'], allowMultiple: false })
      if (!file) {
        return
      }

      const nativePath = file.nativePath || file.nativeFsPath || file.fsName || file.name
      if (!nativePath) {
        showWarning('Missing path', 'Unable to resolve the selected file path.')
        return
      }

      const clip: LocalClip = {
        id: `manual-${uuidv4()}`,
        source: 'manual',
        displayName: file.name || nativePath.split(/[/\\]/).pop() || 'Selected Clip',
        filePath: nativePath,
        metadata: {
          prompt: 'Manual ingest',
          model: 'Unknown',
          seed: undefined,
          jobId: 'manual',
          version: 'manual',
          timestamp: Date.now(),
          contentType: 'video/mp4',
          persistenceMethod: 'local',
          storageMode: 'local',
        } as unknown as GenerationMetadata,
        durationSeconds: undefined,
        prompt: 'Manual ingest',
        model: 'Unknown',
        createdAt: Date.now(),
      }

      setManualClips(prev => [clip, ...prev])
      showInfo('Clip added', `${clip.displayName} is ready for ingest.`)
    } catch (error) {
      console.error('Manual clip selection failed:', error)
      showError('File selection failed', error instanceof Error ? error.message : 'Unknown error occurred')
    }
  }, [setManualClips, showError, showInfo, showWarning])

  const handleChooseFolder = useCallback(async () => {
    const selection = await promptForLocalFolderSelection()
    if (!selection) {
      showInfo('No folder selected', 'The watch folder was not changed.')
      return
    }

    setFolderInfo(selection)
    showSuccess('Watch folder updated', selection.folderPath || 'Folder configured')
  }, [showInfo, showSuccess])

  return (
    <article className="card">
      <header className="card-header">
        <h2 className="card-title">Local Ingest</h2>
        <div className="text-detail">Import MP4s into Premiere Pro with timeline placement and markers</div>
      </header>
      <div className="card-body">
        <section className="local-ingest-panel__section">
          <header className="local-ingest-panel__section-header">
            <div>
              <h2 className="text-heading-medium">Local MP4 Watch Folder</h2>
              <p className="text-detail">
                Clips saved through the Bolt hybrid storage flow appear here for quick ingest into Premiere.
              </p>
            </div>
            {/* @ts-ignore */}
            <sp-button variant="primary" onClick={handleChooseFolder} size="s">
              Choose folder
            {/* @ts-ignore */}
            </sp-button>
          </header>
          <div className="local-ingest-panel__folder-info">
            <div className="folder-path">
              <span className="label">Current folder:</span>
              <span className="value">{folderInfo.folderPath ?? 'Not configured (using defaults)'}</span>
            </div>
            <div className="folder-token">
              <span className="label">Folder token:</span>
              <span className="value">{folderInfo.folderToken ?? 'Not available'}</span>
            </div>
          </div>
          {!hasConfiguredFolder && (
            <div className="local-ingest-panel__folder-warning">
              {/* @ts-ignore */}
              <sp-banner variant="warning" open>
                Grant folder access to enable automatic clip discovery.
              {/* @ts-ignore */}
              </sp-banner>
            </div>
          )}
        </section>

        <section className="local-ingest-panel__section">
          <header className="local-ingest-panel__section-header">
            <div>
              <h2 className="text-heading-medium">Timeline placement</h2>
              <p className="text-detail">Configure how clips are added to the active sequence.</p>
            </div>
          </header>
          <div className="local-ingest-panel__controls">
            <div className="control-group">
              <span className="control-label">Placement mode</span>
              <div className="control-input">
                {/* @ts-ignore */}
                <sp-radio-group onChange={(e: any) => setPlacementMode(e.target.value)} orientation="horizontal">
                  {/* @ts-ignore */}
                  <sp-radio value="append" checked={placementMode === 'append'}>Sequence end</sp-radio>
                  {/* @ts-ignore */}
                  <sp-radio value="playhead" checked={placementMode === 'playhead'}>Playhead</sp-radio>
                  {/* @ts-ignore */}
                  <sp-radio value="custom" checked={placementMode === 'custom'}>Custom time (s)</sp-radio>
                {/* @ts-ignore */}
                </sp-radio-group>
              </div>
              {placementMode === 'custom' && (
                <div className="control-input">
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={customSeconds}
                    onChange={event => setCustomSeconds(parseFloat(event.target.value) || 0)}
                  />
                </div>
              )}
            </div>

            <div className="control-group">
              <span className="control-label">Edit mode</span>
              <div className="control-input">
                {/* @ts-ignore */}
                <sp-radio-group onChange={(e: any) => setEditMode(e.target.value)} orientation="horizontal">
                  {/* @ts-ignore */}
                  <sp-radio value="insert" checked={editMode === 'insert'}>Insert</sp-radio>
                  {/* @ts-ignore */}
                  <sp-radio value="overwrite" checked={editMode === 'overwrite'}>Overwrite</sp-radio>
                {/* @ts-ignore */}
                </sp-radio-group>
              </div>
            </div>

            {editMode === 'insert' && (
              <div className="control-group">
                <span className="control-label">Limit ripple shift</span>
                <div className="control-input">
                  {/* @ts-ignore */}
                  <sp-checkbox checked={limitShift} onChange={(e: any) => setLimitShift(Boolean(e.target.checked))}>
                    Prevent downstream clips from shifting when inserting.
                  {/* @ts-ignore */}
                  </sp-checkbox>
                </div>
              </div>
            )}

            <div className="control-row">
              <div className="control-group">
                <span className="control-label">Video track</span>
                <div className="control-input">
                  <input
                    type="number"
                    min={1}
                    value={videoTrackIndex}
                    onChange={event => setVideoTrackIndex(Math.max(1, parseInt(event.target.value, 10) || 1))}
                  />
                </div>
              </div>
              <div className="control-group">
                <span className="control-label">Audio track</span>
                <div className="control-input">
                  <input
                    type="number"
                    min={1}
                    value={audioTrackIndex}
                    onChange={event => setAudioTrackIndex(Math.max(1, parseInt(event.target.value, 10) || 1))}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="local-ingest-panel__section">
          <header className="local-ingest-panel__section-header">
            <div>
              <h2 className="text-heading-medium">Available clips</h2>
              <p className="text-detail">
                {clips.length > 0
                  ? 'Select a clip to place on the timeline. Metadata markers will be generated automatically.'
                  : 'No local MP4s detected yet. Generate a video or add one manually.'}
              </p>
            </div>
            {/* @ts-ignore */}
            <sp-button variant="secondary" size="s" onClick={handlePickManualClip}>
              Add MP4 manually
            {/* @ts-ignore */}
            </sp-button>
          </header>

          <div className="local-ingest-panel__clip-grid">
            {clips.length === 0 && (
              <div className="local-ingest-panel__empty">
                <p>No local MP4s detected yet. Generate a video or add one manually.</p>
                {/* @ts-ignore */}
                <sp-button variant="primary" size="s" onClick={handlePickManualClip}>
                  Add MP4 manually
                {/* @ts-ignore */}
                </sp-button>
              </div>
            )}

            {clips.map(clip => {
              const status = statusMap[clip.id]
              return (
                <article key={clip.id} className="clip-card">
                  <div className="clip-card__preview">
                    <div className="clip-card__placeholder">
                      {/* @ts-ignore */}
                      <sp-icon name="ui:FileVideo" size="l" />
                      <div className="text-detail">MP4</div>
                    </div>
                  </div>
                  <div className="clip-card__body">
                    <div className="clip-card__header">
                      <div className="clip-card__title">{clip.displayName}</div>
                      <div className="clip-card__badges">
                        {clip.source === 'manual' && (
                          <span className={`clip-card__badge clip-card__badge--${clip.source}`}>
                            Manual upload
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="clip-card__meta">
                      <div className="clip-card__meta-row">
                        <span className="label">Prompt:</span>
                        <span className="value">{clip.prompt ?? 'Unknown prompt'}</span>
                      </div>
                      <div className="clip-card__meta-row">
                        <span className="label">Model:</span>
                        <span className="value">{clip.model ?? 'N/A'}</span>
                      </div>
                      {clip.durationSeconds && (
                        <div className="clip-card__meta-row">
                          <span className="label">Duration:</span>
                          <span className="value">{formatSeconds(clip.durationSeconds)}</span>
                        </div>
                      )}
                      <div className="clip-card__meta-row">
                        <span className="label">Path:</span>
                        <span className="value clip-card__path">{clip.filePath}</span>
                      </div>
                    </div>
                    <div className="clip-card__actions">
                      {/* @ts-ignore */}
                      <sp-button
                        variant="cta"
                        size="s"
                        onClick={() => handleIngestClip(clip)}
                        disabled={status?.state === 'ingesting'}
                      >
                        {status?.state === 'ingesting' ? 'Ingesting…' : 'Send to Premiere'}
                      {/* @ts-ignore */}
                      </sp-button>
                      {clip.source === 'manual' && (
                        // @ts-ignore
                        <sp-button
                          variant="secondary"
                          size="s"
                          onClick={() => handleRemoveManualClip(clip.id)}
                          disabled={status?.state === 'ingesting'}
                        >
                          Remove from list
                        {/* @ts-ignore */}
                        </sp-button>
                      )}
                      {status && (
                        <div className={`clip-card__status clip-card__status--${status.state}`}>
                          {status.message}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </article>
  )
}

export default LocalIngestPanel
