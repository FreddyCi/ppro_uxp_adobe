// Premiere Pro UXP API Types
// For integration with Premiere Pro through UXP

// Project Management Types
export interface PremiereProject {
  id: string
  name: string
  path?: string
  created: Date
  modified: Date
  settings: ProjectSettings
  rootItem: ProjectItem
  sequences: Sequence[]
  isOpen: boolean
}

export interface ProjectSettings {
  scratchDiskPath?: string
  captureFormat?: string
  videoDisplayFormat: 'frames' | 'timecode'
  defaultSequenceSettings: SequenceSettings
}

// Project Items (Media and Bins)
export interface ProjectItem {
  id: string
  name: string
  type: 'video' | 'audio' | 'image' | 'sequence' | 'bin' | 'title' | 'color-matte'
  path?: string
  duration?: number
  frameRate?: number
  width?: number
  height?: number
  aspectRatio?: number
  hasVideo: boolean
  hasAudio: boolean
  
  // Hierarchy and organization
  parentBin?: ProjectItem
  children?: ProjectItem[]
  
  // Media properties
  mediaPath?: string
  inPoint?: number
  outPoint?: number
  
  // Metadata and markers
  metadata: Metadata
  markers: Marker[]
  
  // Import information
  importedAt?: Date
  fileSize?: number
  createdBy?: 'user' | 'firefly' | 'gemini' | 'video-builder'
}

// Sequence and Timeline Types
export interface Sequence {
  id: string
  name: string
  settings: SequenceSettings
  duration: number
  tracks: Track[]
  markers: Marker[]
  workAreaInPoint?: number
  workAreaOutPoint?: number
  currentTime: number
}

export interface SequenceSettings {
  frameRate: number
  width: number
  height: number
  pixelAspectRatio: number
  fieldType: 'progressive' | 'interlaced-upper' | 'interlaced-lower'
  audioChannels: number
  audioSampleRate: number
  videoTimebase: number
  audioTimebase: number
  maxBitDepth: number
  maximumRenderQuality: boolean
}

// Track and Clip Types
export interface Track {
  id: string
  type: 'video' | 'audio'
  index: number
  name?: string
  enabled: boolean
  locked: boolean
  clips: Clip[]
  transitions: Transition[]
  effects: Effect[]
}

export interface Clip {
  id: string
  name: string
  projectItem: ProjectItem
  
  // Timeline position
  inPoint: number
  outPoint: number
  start: number
  end: number
  duration: number
  
  // Media timing
  mediaInPoint?: number
  mediaOutPoint?: number
  
  // Properties
  enabled: boolean
  selected: boolean
  speed: number
  reversed: boolean
  
  // Effects and adjustments
  effects: Effect[]
  keyframes: Keyframe[]
  
  // Metadata
  metadata: Record<string, unknown>
  customLabel?: string
}

// Effects and Transitions
export interface Effect {
  id: string
  name: string
  category: string
  enabled: boolean
  properties: EffectProperty[]
}

export interface EffectProperty {
  name: string
  value: unknown
  keyframed: boolean
  keyframes?: Keyframe[]
}

export interface Transition {
  id: string
  name: string
  duration: number
  alignment: 'start' | 'center' | 'end'
  cutPoint?: number
}

export interface Keyframe {
  time: number
  value: unknown
  interpolationType?: 'linear' | 'bezier' | 'hold'
}

// Markers and Metadata
export interface Marker {
  id: string
  name: string
  comment?: string
  start: number
  duration?: number
  type: 'comment' | 'chapter' | 'segmentation' | 'weblink' | 'flash-cue'
  
  // Custom marker types for our application
  customType?: 'GEN_START' | 'GEN_END' | 'REVIEW' | 'CORRECTION' | 'EXPORT'
  customData?: {
    generationId?: string
    correctionId?: string
    blobUrl?: string
    originalPrompt?: string
  }
}

export interface Metadata {
  [key: string]: unknown
  
  // Standard metadata
  xmp?: XMPMetadata
  exif?: EXIFMetadata
  dublin_core?: DublinCoreMetadata
  
  // Custom application metadata
  custom?: {
    generatedBy?: 'firefly' | 'gemini' | 'video-builder'
    originalPrompt?: string
    generationId?: string
    correctionId?: string
    blobUrl?: string
    processedAt?: Date
    version?: string
  }
}

export interface XMPMetadata {
  creator?: string
  created?: Date
  modified?: Date
  title?: string
  description?: string
  keywords?: string[]
  rating?: number
  label?: string
}

export interface EXIFMetadata {
  make?: string
  model?: string
  dateTime?: Date
  exposureTime?: string
  fNumber?: number
  iso?: number
  focalLength?: number
  orientation?: number
}

export interface DublinCoreMetadata {
  title?: string
  creator?: string
  subject?: string[]
  description?: string
  publisher?: string
  contributor?: string[]
  date?: Date
  type?: string
  format?: string
  identifier?: string
  source?: string
  language?: string
  relation?: string
  coverage?: string
  rights?: string
}

// Import and Export Types
export interface ImportOptions {
  targetBin?: ProjectItem
  createProxy?: boolean
  importAudio?: boolean
  importMetadata?: boolean
  autoAddToSequence?: boolean
  sequenceTarget?: Sequence
  insertionTime?: number
}

export interface ImportResult {
  success: boolean
  projectItem?: ProjectItem
  error?: string
  duration?: number
}

export interface ExportSettings {
  format: 'h264' | 'h265' | 'prores' | 'dnxhd' | 'avi' | 'mov'
  preset: 'web' | 'archive' | 'review' | 'broadcast' | 'custom'
  outputPath: string
  filename?: string
  
  // Video settings
  videoCodec?: string
  videoBitrate?: number
  width?: number
  height?: number
  frameRate?: number
  quality?: 'low' | 'medium' | 'high' | 'ultra'
  
  // Audio settings
  audioCodec?: string
  audioBitrate?: number
  audioChannels?: number
  audioSampleRate?: number
  
  // Range settings
  exportRange?: 'sequence' | 'workArea' | 'inOut' | 'custom'
  inPoint?: number
  outPoint?: number
  
  // Post-export actions
  uploadToBlob?: boolean
  addToProject?: boolean
  openAfterExport?: boolean
}

export interface ExportProgress {
  percentage: number
  currentFrame: number
  totalFrames: number
  timeRemaining?: number
  currentPass?: number
  totalPasses?: number
  phase: 'analyzing' | 'encoding' | 'finalizing' | 'uploading'
}

export interface ExportResult {
  success: boolean
  outputPath?: string
  blobUrl?: string
  error?: string
  duration: number
  fileSize?: number
}

// UXP API Integration Types
export interface UXPHostInfo {
  hostName: 'PPRO' | 'AEFT' | 'AUDT'
  hostVersion: string
  uxpVersion: string
  platform: 'win' | 'mac'
}

export interface UXPFileSystemAccess {
  canRead: boolean
  canWrite: boolean
  allowedPaths: string[]
  tempDirectory: string
}

// Application State Types
export interface PremiereApplicationState {
  activeProject?: PremiereProject
  activeSequence?: Sequence
  currentTime: number
  playing: boolean
  selectedClips: Clip[]
  selectedProjectItems: ProjectItem[]
  panelVisible: boolean
}

// Command and Action Types
export type PremiereCommand = 
  | 'app.project.openDocument'
  | 'app.project.save'
  | 'app.project.import'
  | 'app.project.exportFrame'
  | 'app.project.exportSequence'
  | 'app.sequence.createNew'
  | 'app.sequence.addClip'
  | 'app.sequence.addMarker'
  | 'app.timeline.play'
  | 'app.timeline.stop'
  | 'app.timeline.setCurrentTime'

export interface CommandOptions {
  [key: string]: unknown
}

export interface CommandResult {
  success: boolean
  result?: unknown
  error?: string
}

// Event Types for UXP Panel Communication
export interface PremiereEvent {
  type: 'project.opened' | 'project.closed' | 'sequence.changed' | 'time.changed' | 'selection.changed'
  data?: unknown
  timestamp: Date
}
