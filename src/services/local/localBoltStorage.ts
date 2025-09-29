import type { GenerationMetadata } from '../../types/firefly'
import { isLocalMode } from '../storageMode'

const LOCAL_MODE = isLocalMode()

let addonCache: any | undefined

function getBoltAddon(): any | null {
  if (addonCache !== undefined) {
    return addonCache
  }

  try {
    const requireFn = (globalThis as unknown as { require?: (moduleId: string) => any }).require
    if (!requireFn) {
      addonCache = null
      return addonCache
    }

  const uxp = requireFn('uxp') as any
    if (!uxp?.addon?.get) {
      addonCache = null
      return addonCache
    }

    const addon = uxp.addon.get('bolt-uxp-hybrid.uxpaddon')
    addonCache = addon ?? null
    return addonCache
  } catch (error) {
    console.warn('[BoltStorage] Unable to load hybrid addon:', error)
    addonCache = null
    return addonCache
  }
}

function sanitizeSegment(segment: string, fallback: string): string {
  const sanitized = segment
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()

  return sanitized.length > 0 ? sanitized : fallback
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)

  if (typeof btoa === 'function') {
    const chunkSize = 0x8000
    let binary = ''

    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      const chunk = bytes.subarray(offset, offset + chunkSize)
      binary += String.fromCharCode(...chunk)
    }

    return btoa(binary)
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64')
  }

  // Fallback manual encoder (should rarely execute)
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let output = ''
  let i = 0

  while (i < bytes.length) {
    const byte1 = bytes[i++]
    const byte2 = i < bytes.length ? bytes[i++] : NaN
    const byte3 = i < bytes.length ? bytes[i++] : NaN

    const enc1 = byte1 >> 2
    const enc2 = ((byte1 & 3) << 4) | (isNaN(byte2) ? 0 : byte2 >> 4)
    const enc3 = isNaN(byte2) ? 64 : ((byte2 & 15) << 2) | (isNaN(byte3) ? 0 : byte3 >> 6)
    const enc4 = isNaN(byte3) ? 64 : byte3 & 63

    output += base64Chars.charAt(enc1)
    output += base64Chars.charAt(enc2)
    output += enc3 === 64 ? '=' : base64Chars.charAt(enc3)
    output += enc4 === 64 ? '=' : base64Chars.charAt(enc4)
  }

  return output
}

interface SaveGenerationOptions {
  blob: Blob
  metadata: GenerationMetadata
  filename?: string
  subfolder?: string
}

export interface LocalSaveResult {
  filePath: string
  metadataPath: string
  relativePath: string
}

class LocalBoltStorage {
  private addon: any | null
  private cachedBasePath: Promise<{ path: string; separator: string }> | null = null

  constructor() {
    this.addon = getBoltAddon()
  }

  isAvailable(): boolean {
    this.addon = this.addon ?? getBoltAddon()
    return Boolean(this.addon)
  }

  async saveGenerationAsset(options: SaveGenerationOptions): Promise<LocalSaveResult> {
    const addon = await this.ensureAddon()
    const { path: basePath, separator } = await this.resolveBasePath(addon)

    const dateFolder = sanitizeSegment(
      options.subfolder ?? new Date().toISOString().slice(0, 10),
      'unsorted'
    )
    const safeFilename = sanitizeSegment(
      options.filename ?? `firefly-${Date.now()}.png`,
      `firefly-${Date.now()}.png`
    )

    const directory = this.joinPath(separator, basePath, dateFolder)
    this.ensureDirectory(addon, directory)

    const filePath = this.joinPath(separator, directory, safeFilename)

    const arrayBuffer = await options.blob.arrayBuffer()
    const base64Payload = arrayBufferToBase64(arrayBuffer)

    const writeSuccess = addon.writeFile?.(filePath, base64Payload, true)
    if (writeSuccess === false) {
      throw new Error(`[BoltStorage] Failed to write binary file: ${filePath}`)
    }

    const metadataPayload = {
      ...options.metadata,
      storageMode: 'local' as const,
      persistenceMethod: 'local' as const,
      savedAt: new Date().toISOString(),
      filename: safeFilename,
      filePath
    }

    const metadataPath = this.joinPath(separator, directory, `${safeFilename}.json`)
    addon.writeFile?.(metadataPath, JSON.stringify(metadataPayload, null, 2), false)

    return {
      filePath,
      metadataPath,
      relativePath: this.joinPath(separator, dateFolder, safeFilename)
    }
  }

  private async ensureAddon(): Promise<any> {
    if (this.addon) {
      return this.addon
    }

    this.addon = getBoltAddon()
    if (!this.addon) {
      throw new Error('[BoltStorage] Bolt hybrid addon is not available in this environment.')
    }

    return this.addon
  }

  private ensureDirectory(addon: any, path: string): void {
    const result = addon.ensureDirectory?.(path)
    if (result === false) {
      throw new Error(`[BoltStorage] Failed to ensure directory: ${path}`)
    }
  }

  private async resolveBasePath(addon: any): Promise<{ path: string; separator: string }> {
    if (!this.cachedBasePath) {
      this.cachedBasePath = (async () => {
        let basePath: string | undefined
        try {
          basePath = addon.getDefaultStoragePath?.()
        } catch (error) {
          console.warn('[BoltStorage] Failed to retrieve default storage path from addon:', error)
        }

        if (!basePath || typeof basePath !== 'string') {
          basePath = this.getFallbackBasePath()
        }

        const separator = basePath.includes('\\') ? '\\' : '/'
        this.ensureDirectory(addon, basePath)

        return { path: basePath, separator }
      })()
    }

    return this.cachedBasePath
  }

  private getFallbackBasePath(): string {
    const isWindows = typeof navigator !== 'undefined' && navigator.userAgent?.includes('Windows')

    if (isWindows && typeof process !== 'undefined' && process?.env?.USERPROFILE) {
      return `${process.env.USERPROFILE}\\Documents\\BoltUXP\\Generations`
    }

    if (typeof process !== 'undefined' && process?.env?.HOME) {
      return `${process.env.HOME}/Documents/BoltUXP/Generations`
    }

    return './BoltUXP/Generations'
  }

  private joinPath(separator: string, ...segments: string[]): string {
    if (!segments.length) return ''

    const normalized = segments
      .filter(Boolean)
      .map((segment, index) => {
        const trimmed = segment.replace(/^[\\/]+|[\\/]+$/g, '')
        if (index === 0) {
          return segment.replace(/[\\/]+$/g, '')
        }
        return trimmed
      })
      .filter(Boolean)

    return normalized.join(separator)
  }
}

export const localBoltStorage = LOCAL_MODE ? new LocalBoltStorage() : null

export function isLocalStorageMode(): boolean {
  return LOCAL_MODE
}

export async function saveGenerationLocally(
  options: SaveGenerationOptions
): Promise<LocalSaveResult | null> {
  if (!LOCAL_MODE || !localBoltStorage?.isAvailable()) {
    return null
  }

  return localBoltStorage.saveGenerationAsset(options)
}
