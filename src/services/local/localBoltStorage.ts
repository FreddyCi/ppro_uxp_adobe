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

type LocalPersistenceProvider = 'bolt' | 'uxp'

const FOLDER_TOKEN_STORAGE_KEY = 'boltuxp.localFolderToken'
const FOLDER_PATH_STORAGE_KEY = 'boltuxp.localFolderPath'

function readPersistentValue(key: string): string | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }

  try {
    return window.localStorage.getItem(key)
  } catch (error) {
    console.warn('[UXPLocalStorage] Unable to read persistent value:', { key, error })
    return null
  }
}

function writePersistentValue(key: string, value: string): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  try {
    window.localStorage.setItem(key, value)
  } catch (error) {
    console.warn('[UXPLocalStorage] Unable to store persistent value:', { key, error })
  }
}

function clearPersistentValue(key: string): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn('[UXPLocalStorage] Unable to clear persistent value:', { key, error })
  }
}

function joinPath(separator: string, ...segments: (string | undefined | null)[]): string {
  const normalized = segments
    .filter((segment): segment is string => typeof segment === 'string' && segment.length > 0)
    .map((segment, index) => {
      if (index === 0) {
        return segment.replace(/[\\/]+$/g, '')
      }
      return segment.replace(/^[\\/]+|[\\/]+$/g, '')
    })

  if (!normalized.length) {
    return ''
  }

  const sep = separator || '/'
  return normalized.join(sep)
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
  provider: LocalPersistenceProvider
  baseFolder?: string
  folderToken?: string | null
  displayPath?: string
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

    const directory = joinPath(separator, basePath, dateFolder)
    this.ensureDirectory(addon, directory)

    const filePath = joinPath(separator, directory, safeFilename)

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
      localPersistenceProvider: 'bolt' as const,
      savedAt: new Date().toISOString(),
      filename: safeFilename,
      filePath
    }

    const metadataPath = joinPath(separator, directory, `${safeFilename}.json`)
    addon.writeFile?.(metadataPath, JSON.stringify(metadataPayload, null, 2), false)

    return {
      filePath,
      metadataPath,
      relativePath: joinPath('/', dateFolder, safeFilename),
      provider: 'bolt',
      baseFolder: directory,
      folderToken: null,
      displayPath: filePath
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
}

class UxpLocalStorage {
  private localFileSystem: any | null
  private folderPromise: Promise<any | null> | null = null

  constructor() {
    this.localFileSystem = this.resolveLocalFileSystem()
  }

  private resolveLocalFileSystem(): any | null {
    try {
      const requireFn = (globalThis as unknown as { require?: (moduleId: string) => any }).require
      if (!requireFn) {
        return null
      }

      const uxp = requireFn('uxp') as any
      return uxp?.storage?.localFileSystem ?? null
    } catch (error) {
      console.warn('[UXPLocalStorage] Unable to access UXP storage APIs:', error)
      return null
    }
  }

  isAvailable(): boolean {
    if (!this.localFileSystem) {
      this.localFileSystem = this.resolveLocalFileSystem()
    }
    return Boolean(this.localFileSystem)
  }

  async saveGenerationAsset(options: SaveGenerationOptions): Promise<LocalSaveResult | null> {
    const folder = await this.ensureFolder()
    if (!folder) {
      return null
    }

    await this.ensurePermission(folder)

    const folderPath = this.getFolderPath(folder)
    if (folderPath) {
      writePersistentValue(FOLDER_PATH_STORAGE_KEY, folderPath)
    }

    const separator = folderPath && folderPath.includes('\\') ? '\\' : '/'
    const dateFolder = sanitizeSegment(
      options.subfolder ?? new Date().toISOString().slice(0, 10),
      'unsorted'
    )
    const safeFilename = sanitizeSegment(
      options.filename ?? `firefly-${Date.now()}.png`,
      `firefly-${Date.now()}.png`
    )

    const targetFolder = await this.ensureSubfolder(folder, dateFolder)
    await this.ensurePermission(targetFolder)

    const arrayBuffer = await options.blob.arrayBuffer()

    const file = await targetFolder.createFile?.(safeFilename, { overwrite: true })
    if (!file) {
      throw new Error('[UXPLocalStorage] Failed to create output file.')
    }
    await file.write(arrayBuffer)

    const metadataPayload = {
      ...options.metadata,
      storageMode: 'local' as const,
      persistenceMethod: 'local' as const,
      localPersistenceProvider: 'uxp' as const,
      savedAt: new Date().toISOString(),
      filename: safeFilename,
      filePath: this.buildDisplayPath(separator, folderPath, dateFolder, safeFilename),
      folderToken: this.getStoredToken()
    }

    const metadataFile = await targetFolder.createFile?.(`${safeFilename}.json`, { overwrite: true })
    if (!metadataFile) {
      throw new Error('[UXPLocalStorage] Failed to create metadata file.')
    }
    await metadataFile.write(JSON.stringify(metadataPayload, null, 2))

    const filePath = this.buildDisplayPath(separator, folderPath, dateFolder, safeFilename)
    const metadataPath = this.buildDisplayPath(separator, folderPath, dateFolder, `${safeFilename}.json`)
    const relativePath = joinPath('/', dateFolder, safeFilename)

    console.warn('[UXPLocalStorage] Persisted generation via UXP filesystem:', {
      filePath,
      folderPath: folderPath ?? 'unknown',
      relativePath
    })

    return {
      filePath,
      metadataPath,
      relativePath,
      provider: 'uxp',
      baseFolder: folderPath ?? undefined,
      folderToken: this.getStoredToken(),
      displayPath: filePath
    }
  }

  private buildDisplayPath(
    separator: string,
    basePath: string | null,
    dateFolder: string,
    filename: string
  ): string {
    return basePath
      ? joinPath(separator, basePath, dateFolder, filename)
      : joinPath('/', dateFolder, filename)
  }

  private async ensureFolder(): Promise<any | null> {
    if (!this.isAvailable()) {
      return null
    }

    if (!this.folderPromise) {
      this.folderPromise = (async () => {
        const token = this.getStoredToken()
        if (token) {
          try {
            const entry = await this.getEntryForToken(token)
            if (entry) {
              return entry
            }
          } catch (error) {
            console.warn('[UXPLocalStorage] Failed to reuse folder token; prompting user again:', error)
            this.clearStoredToken()
          }
        }

        return this.promptForFolder()
      })()
    }

    const folder = await this.folderPromise
    if (!folder) {
      this.folderPromise = null
    }
    return folder
  }

  private async ensureSubfolder(folder: any, name: string): Promise<any> {
    if (!name || !folder) {
      return folder
    }

    if (typeof folder.getEntry === 'function') {
      try {
        const entry = await folder.getEntry(name)
        if (entry) {
          return entry
        }
      } catch {
        // Swallow and attempt to create folder
      }
    }

    if (typeof folder.createFolder === 'function') {
      try {
        return await folder.createFolder(name, { overwrite: false })
      } catch (error) {
        console.warn('[UXPLocalStorage] createFolder failed, attempting to reuse existing folder:', error)
        if (typeof folder.getEntry === 'function') {
          try {
            const entry = await folder.getEntry(name)
            if (entry) {
              return entry
            }
          } catch {
            // Ignore and fall back to base folder
          }
        }
      }
    }

    return folder
  }

  private async ensurePermission(entry: any): Promise<void> {
    if (entry && typeof entry.requestPermission === 'function') {
      const permission = await entry.requestPermission({ mode: 'readwrite' })
      if (permission === 'denied') {
        throw new Error('[UXPLocalStorage] Permission denied for selected folder.')
      }
    }
  }

  private getStoredToken(): string | null {
    return readPersistentValue(FOLDER_TOKEN_STORAGE_KEY)
  }

  private storeToken(token: string): void {
    writePersistentValue(FOLDER_TOKEN_STORAGE_KEY, token)
  }

  private clearStoredToken(): void {
    clearPersistentValue(FOLDER_TOKEN_STORAGE_KEY)
    clearPersistentValue(FOLDER_PATH_STORAGE_KEY)
  }

  private async getEntryForToken(token: string): Promise<any | null> {
    if (!this.localFileSystem) {
      return null
    }

    try {
      if (typeof this.localFileSystem.getEntryWithToken === 'function') {
        return await this.localFileSystem.getEntryWithToken(token)
      }

      if (typeof this.localFileSystem.getEntryForPersistentToken === 'function') {
        return await this.localFileSystem.getEntryForPersistentToken(token)
      }

      console.warn('[UXPLocalStorage] Persistent tokens not supported in this environment.')
    } catch (error) {
      console.warn('[UXPLocalStorage] Error retrieving entry for token:', error)
      throw error
    }

    return null
  }

  private async promptForFolder(): Promise<any | null> {
    if (!this.localFileSystem) {
      return null
    }

    try {
      const folder = await this.localFileSystem.getFolder()
      if (!folder) {
        console.warn('[UXPLocalStorage] User cancelled folder selection dialog.')
        return null
      }

      await this.ensurePermission(folder)

      if (typeof this.localFileSystem.createPersistentToken === 'function') {
        try {
          const token = await this.localFileSystem.createPersistentToken(folder)
          if (token) {
            this.storeToken(token)
          }
        } catch (error) {
          console.warn('[UXPLocalStorage] Unable to create persistent token for folder:', error)
        }
      } else {
        console.warn('[UXPLocalStorage] createPersistentToken not available; folder will prompt on restart.')
      }

      const folderPath = this.getFolderPath(folder)
      if (folderPath) {
        writePersistentValue(FOLDER_PATH_STORAGE_KEY, folderPath)
      }

      return folder
    } catch (error) {
      console.warn('[UXPLocalStorage] Failed to select output folder:', error)
      return null
    }
  }

  private getFolderPath(folder: any): string | null {
    if (!folder) {
      return null
    }

    return (
      folder.nativePath ??
      folder.nativeFsPath ??
      folder.fsName ??
      (typeof folder.toString === 'function' ? folder.toString() : null)
    )
  }
}

const boltStorageInstance = LOCAL_MODE ? new LocalBoltStorage() : null
const uxpStorageInstance = LOCAL_MODE ? new UxpLocalStorage() : null

export const localBoltStorage = boltStorageInstance
export const localUxpStorage = uxpStorageInstance

export function isLocalStorageMode(): boolean {
  return LOCAL_MODE
}

export async function saveGenerationLocally(
  options: SaveGenerationOptions
): Promise<LocalSaveResult | null> {
  if (!LOCAL_MODE) {
    return null
  }

  if (localBoltStorage?.isAvailable()) {
    try {
      return await localBoltStorage.saveGenerationAsset(options)
    } catch (error) {
      console.error('[LocalStorage] Bolt hybrid save failed, attempting UXP fallback:', error)
    }
  } else {
    console.warn('[LocalStorage] Bolt hybrid addon unavailable; attempting UXP fallback')
  }

  if (localUxpStorage?.isAvailable()) {
    try {
      const result = await localUxpStorage.saveGenerationAsset(options)
      if (result) {
        return result
      }
    } catch (error) {
      console.error('[LocalStorage] UXP filesystem save failed:', error)
    }
  } else {
    console.warn('[LocalStorage] UXP filesystem APIs unavailable; cannot persist locally')
  }

  return null
}
