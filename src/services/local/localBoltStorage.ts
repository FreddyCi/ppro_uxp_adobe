import type { GenerationMetadata } from '../../types/firefly'
import { isLocalMode } from '../storageMode'
import { generateAndSaveVideoThumbnail } from './thumbnailGenerator'

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
  thumbnailUrl?: string
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
    console.log('[BoltStorage] Creating directory:', {
      basePath,
      dateFolder,
      directory,
      separator,
      optionsSubfolder: options.subfolder
    })
    this.ensureDirectory(addon, directory)

    const filePath = joinPath(separator, directory, safeFilename)

    const arrayBuffer = await options.blob.arrayBuffer()
    const base64Payload = arrayBufferToBase64(arrayBuffer)

    const writeSuccess = addon.writeFile?.(filePath, base64Payload, true)
    if (writeSuccess === false) {
      throw new Error(`[BoltStorage] Failed to write binary file: ${filePath}`)
    }

    // Generate and save thumbnail for video content
    let thumbnailUrl: string | undefined
    let thumbnailFilePath: string | undefined
    let firstFrameImagePath: string | undefined
    let firstFrameImageRelativePath: string | undefined
    
    if (options.metadata.contentType === 'video') {
      // For Luma videos, try to use the first frame image as thumbnail
      if (options.metadata.firstImageId) {
        console.log('[BoltStorage] Looking for first frame image:', options.metadata.firstImageId)
        // Import gallery store to get the first frame image
        const { useGalleryStore } = await import('../../store/galleryStore')
        const galleryState = useGalleryStore.getState()
        const firstFrameItem = galleryState.contentItems.find(item => item.id === options.metadata.firstImageId)
        
        if (firstFrameItem) {
          // Save the first frame image paths for reference
          firstFrameImagePath = firstFrameItem.localPath
          // Extract relative path if available
          if (firstFrameItem.localPath) {
            const pathParts = firstFrameItem.localPath.split('/')
            const dateFolder = pathParts[pathParts.length - 2] // e.g., "2025-10-06"
            const filename = pathParts[pathParts.length - 1]   // e.g., "image.jpeg"
            firstFrameImageRelativePath = `${dateFolder}/${filename}`
          }
          
          // Use the first frame image's thumbnail or displayUrl
          if (firstFrameItem.thumbnailUrl && firstFrameItem.thumbnailUrl.startsWith('data:image/')) {
            thumbnailUrl = firstFrameItem.thumbnailUrl
            console.log('[BoltStorage] Using first frame thumbnailUrl as video thumbnail')
          } else if (firstFrameItem.displayUrl && firstFrameItem.displayUrl.startsWith('data:image/')) {
            thumbnailUrl = firstFrameItem.displayUrl
            console.log('[BoltStorage] Using first frame displayUrl as video thumbnail')
          } else {
            console.log('[BoltStorage] First frame image found but no valid thumbnail data')
          }
          
          // Try to copy the first frame image to the video folder for easy access
          if (firstFrameItem.localPath && addon.readFile) {
            try {
              const imageData = addon.readFile(firstFrameItem.localPath, true) // Read as base64
              if (imageData) {
                const thumbnailFileName = safeFilename.replace(/\.(mp4|mov|avi|webm)$/i, '_firstframe.jpeg')
                const thumbnailFilePath = joinPath(separator, directory, thumbnailFileName)
                const writeSuccess = addon.writeFile?.(thumbnailFilePath, imageData, true)
                if (writeSuccess !== false) {
                  console.log('[BoltStorage] Copied first frame image to video folder:', thumbnailFileName)
                }
              }
            } catch (error) {
              console.warn('[BoltStorage] Failed to copy first frame image:', error)
            }
          }
        } else {
          console.log('[BoltStorage] First frame image not found in gallery, generating from video')
          thumbnailUrl = await generateAndSaveVideoThumbnail(options.blob, filePath, addon) || undefined
        }
      } else {
        // Fallback to generating thumbnail from video
        console.log('[BoltStorage] No firstImageId provided, generating thumbnail from video')
        thumbnailUrl = await generateAndSaveVideoThumbnail(options.blob, filePath, addon) || undefined
      }
      
      if (thumbnailUrl) {
        // Also save the thumbnail file path (relative to base path)
        thumbnailFilePath = filePath.replace(/\.(mp4|mov|avi|webm)$/i, '_thumbnail.jpg')
      }
    }

    const metadataPayload = {
      ...options.metadata,
      storageMode: 'local' as const,
      persistenceMethod: 'local' as const,
      localPersistenceProvider: 'bolt' as const,
      savedAt: new Date().toISOString(),
      filename: safeFilename,
      filePath,
      relativePath: joinPath('/', dateFolder, safeFilename),
      thumbnailUrl, // Include generated thumbnail (base64 data URL for fallback)
      thumbnailFilePath, // Include thumbnail file path for UXP loading
      firstFrameImagePath, // Path to the original first frame image
      firstFrameImageRelativePath // Relative path to the first frame image
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
      displayPath: filePath,
      thumbnailUrl // Return thumbnail URL in result
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
          console.log('[BoltStorage] Raw basePath from addon.getDefaultStoragePath():', basePath)
        } catch (error) {
          console.warn('[BoltStorage] Failed to retrieve default storage path from addon:', error)
        }

        if (!basePath || typeof basePath !== 'string') {
          basePath = this.getFallbackBasePath()
          console.log('[BoltStorage] Using fallback basePath:', basePath)
        }

        const separator = basePath.includes('\\') ? '\\' : '/'
        console.log('[BoltStorage] Initial basePath before normalization:', basePath)
        
        // Strip trailing date folders to ensure basePath is the root storage folder
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        const pathParts = basePath.split(separator).filter(part => part.length > 0)
        console.log('[BoltStorage] Path parts:', pathParts)
        const normalizedParts = []
        for (let i = pathParts.length - 1; i >= 0; i--) {
          if (!dateRegex.test(pathParts[i])) {
            normalizedParts.unshift(...pathParts.slice(0, i + 1))
            break
          }
        }
        if (normalizedParts.length > 0) {
          basePath = normalizedParts.join(separator)
        } else if (pathParts.length > 0) {
          // If all parts were dates, keep the last non-date part or the first part
          basePath = pathParts[0]
        }
        console.log('[BoltStorage] Final normalized basePath:', basePath)
        
        this.ensureDirectory(addon, basePath)

        return { path: basePath, separator }
      })()
    }

    return this.cachedBasePath
  }

  private getFallbackBasePath(): string {
    // Check for custom local content path from environment variable
    if (typeof process !== 'undefined' && process?.env?.LOCAL_CONTENT_PATH) {
      return process.env.LOCAL_CONTENT_PATH
    }

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

  async promptForFolderSelection(): Promise<{
    folderToken: string | null
    folderPath: string | null
  } | null> {
    if (!this.isAvailable()) {
      return null
    }

    // Reset cached promise to force folder selection dialog
    this.folderPromise = null

    const folder = await this.promptForFolder()
    if (!folder) {
      return null
    }

    const folderPath = this.getFolderPath(folder)
    const token = this.getStoredToken()

    // Cache the selected folder for subsequent read/write operations
    this.folderPromise = Promise.resolve(folder)

    return {
      folderToken: token,
      folderPath,
    }
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
    let folder = await this.ensureFolder()
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
    console.log('[UXPLocalStorage] Creating target folder:', {
      folderPath,
      dateFolder,
      targetFolderPath: this.getFolderPath(targetFolder),
      optionsSubfolder: options.subfolder
    })
    await this.ensurePermission(targetFolder)

    const arrayBuffer = await options.blob.arrayBuffer()

    const file = await targetFolder.createFile?.(safeFilename, { overwrite: true })
    if (!file) {
      throw new Error('[UXPLocalStorage] Failed to create output file.')
    }
    await file.write(arrayBuffer)

    // Generate thumbnail for video content
    let thumbnailUrl: string | undefined
    let firstFrameImagePath: string | undefined
    let firstFrameImageRelativePath: string | undefined
    
    if (options.metadata.contentType === 'video' || options.metadata.contentType === 'video/mp4') {
      // For Luma videos, try to use the first frame image as thumbnail
      if (options.metadata.firstImageId) {
        console.log('[UXPLocalStorage] Looking for first frame image:', options.metadata.firstImageId)
        // Import gallery store to get the first frame image
        const { useGalleryStore } = await import('../../store/galleryStore')
        const galleryState = useGalleryStore.getState()
        
        // Debug: log all available content items
        console.log('[UXPLocalStorage] Gallery items available:', {
          count: galleryState.contentItems.length,
          itemIds: galleryState.contentItems.map(item => item.id)
        })
        
        const firstFrameItem = galleryState.contentItems.find(item => item.id === options.metadata.firstImageId)
        
        if (firstFrameItem) {
          console.log('[UXPLocalStorage] Found first frame item:', {
            id: firstFrameItem.id,
            filename: firstFrameItem.filename,
            localPath: firstFrameItem.localPath,
            hasThumbnailUrl: !!firstFrameItem.thumbnailUrl,
            hasDisplayUrl: !!firstFrameItem.displayUrl,
            thumbnailUrlPrefix: firstFrameItem.thumbnailUrl?.substring(0, 50),
            displayUrlPrefix: firstFrameItem.displayUrl?.substring(0, 50)
          })
          
          // Copy the first frame image to the video folder
          try {
            if (firstFrameItem.localPath && this.localFileSystem) {
              const sourceFile = await this.localFileSystem.getFileForPath(firstFrameItem.localPath)
              if (sourceFile && sourceFile.isFile) {
                // Create thumbnail filename based on video name
                const imageExtension = firstFrameItem.localPath.split('.').pop() || 'jpeg'
                const thumbnailFileName = `${safeFilename.replace(/\.mp4$/, '')}_thumbnail.${imageExtension}`
                
                // Copy the image file to the video folder
                const copiedFile = await targetFolder.createFile?.(thumbnailFileName, { overwrite: true })
                if (copiedFile) {
                  const sourceData = await sourceFile.read({ format: this.localFileSystem.formats.binary })
                  await copiedFile.write(sourceData, { format: this.localFileSystem.formats.binary })
                  
                  // Update paths to point to copied file
                  firstFrameImagePath = copiedFile.nativePath
                  firstFrameImageRelativePath = joinPath('/', dateFolder, thumbnailFileName)
                  
                  console.log('[UXPLocalStorage] Successfully copied first frame image:', {
                    originalPath: firstFrameItem.localPath,
                    copiedPath: firstFrameImagePath,
                    relativePath: firstFrameImageRelativePath
                  })
                  
                  // Read the copied file as base64 for immediate use
                  const imageData = await copiedFile.read({ format: this.localFileSystem.formats.binary })
                  const base64String = btoa(String.fromCharCode(...new Uint8Array(imageData)))
                  thumbnailUrl = `data:image/${imageExtension};base64,${base64String}`
                  console.log('[UXPLocalStorage] Generated base64 thumbnail from copied image')
                } else {
                  console.log('[UXPLocalStorage] Failed to create copied image file')
                }
              } else {
                console.log('[UXPLocalStorage] Source image file not found or not accessible')
              }
            }
          } catch (error) {
            console.log('[UXPLocalStorage] Error copying first frame image:', error)
          }
          
          // Fallback: Use original image data if copying failed
          if (!thumbnailUrl) {
            // Save the first frame image paths for reference
            firstFrameImagePath = firstFrameItem.localPath
            // Extract relative path if available
            if (firstFrameItem.localPath) {
              const pathParts = firstFrameItem.localPath.split('/')
              const dateFolder = pathParts[pathParts.length - 2] // e.g., "2025-10-06"
              const filename = pathParts[pathParts.length - 1]   // e.g., "image.jpeg"
              firstFrameImageRelativePath = `${dateFolder}/${filename}`
              console.log('[UXPLocalStorage] Extracted paths:', {
                firstFrameImagePath,
                firstFrameImageRelativePath
              })
            }
            
            // Use the first frame image's thumbnail or displayUrl
            if (firstFrameItem.thumbnailUrl && firstFrameItem.thumbnailUrl.startsWith('data:image/')) {
              thumbnailUrl = firstFrameItem.thumbnailUrl
              console.log('[UXPLocalStorage] Using first frame thumbnailUrl as video thumbnail')
            } else if (firstFrameItem.displayUrl && firstFrameItem.displayUrl.startsWith('data:image/')) {
              thumbnailUrl = firstFrameItem.displayUrl
              console.log('[UXPLocalStorage] Using first frame displayUrl as video thumbnail')
            } else {
              console.log('[UXPLocalStorage] First frame image found but no valid thumbnail data:', {
                thumbnailUrlType: typeof firstFrameItem.thumbnailUrl,
                displayUrlType: typeof firstFrameItem.displayUrl,
                thumbnailUrlPrefix: firstFrameItem.thumbnailUrl?.substring(0, 20),
                displayUrlPrefix: firstFrameItem.displayUrl?.substring(0, 20)
              })
            }
          }
        } else {
          console.log('[UXPLocalStorage] First frame image not found in gallery. Available IDs:', 
            galleryState.contentItems.map(item => item.id).join(', '))
          thumbnailUrl = await generateAndSaveVideoThumbnail(options.blob, file.nativePath) || undefined
        }
      } else {
        // Fallback to generating thumbnail from video
        console.log('[UXPLocalStorage] No firstImageId provided, generating thumbnail from video')
        thumbnailUrl = await generateAndSaveVideoThumbnail(options.blob, file.nativePath) || undefined
      }
    }

    const metadataPayload = {
      ...options.metadata,
      storageMode: 'local' as const,
      persistenceMethod: 'local' as const,
      localPersistenceProvider: 'uxp' as const,
      savedAt: new Date().toISOString(),
      filename: safeFilename,
      filePath: this.buildDisplayPath(separator, folderPath, dateFolder, safeFilename),
      folderToken: this.getStoredToken(),
      relativePath: joinPath('/', dateFolder, safeFilename),
      thumbnailUrl, // Include generated thumbnail
      firstFrameImagePath, // Path to the original first frame image
      firstFrameImageRelativePath // Relative path to the first frame image
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
      displayPath: filePath,
      thumbnailUrl // Return thumbnail URL in result
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
              // Check if the entry is a date folder
              const entryPath = this.getFolderPath(entry)
              if (entryPath) {
                const separator = entryPath.includes('\\') ? '\\' : '/'
                const pathParts = entryPath.split(separator).filter(part => part.length > 0)
                const lastPart = pathParts[pathParts.length - 1]
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/
                if (dateRegex.test(lastPart)) {
                  console.warn('[UXPLocalStorage] Stored folder token points to a date folder, clearing token and prompting for base folder')
                  this.clearStoredToken()
                  return this.promptForFolder()
                }
              }
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

      const folderPath = this.getFolderPath(folder)
      if (folderPath) {
        const separator = folderPath.includes('\\') ? '\\' : '/'
        const pathParts = folderPath.split(separator).filter(part => part.length > 0)
        const lastPart = pathParts[pathParts.length - 1]
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (dateRegex.test(lastPart)) {
          console.warn('[UXPLocalStorage] Selected folder appears to be a date folder, prompting user to select base folder')
          // Prompt again
          return this.promptForFolder()
        }

        writePersistentValue(FOLDER_PATH_STORAGE_KEY, folderPath)
      }

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

export function getConfiguredLocalFolderInfo(): {
  folderToken: string | null
  folderPath: string | null
} {
  return {
    folderToken: readPersistentValue(FOLDER_TOKEN_STORAGE_KEY),
    folderPath: readPersistentValue(FOLDER_PATH_STORAGE_KEY),
  }
}

export async function promptForLocalFolderSelection(): Promise<{
  folderToken: string | null
  folderPath: string | null
} | null> {
  if (!localUxpStorage?.isAvailable()) {
    console.warn('[LocalStorage] UXP filesystem unavailable; cannot prompt for folder selection')
    return null
  }

  try {
    return await localUxpStorage.promptForFolderSelection()
  } catch (error) {
    console.warn('[LocalStorage] Failed to prompt for local folder selection:', error)
    return null
  }
}
