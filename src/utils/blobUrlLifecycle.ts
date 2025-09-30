/**
 * Blob URL Lifecycle Management for UXP Environment
 *
 * Handles the creation, validation, and refresh of blob URLs in Adobe UXP,
 * where blob URLs have limited lifespans and need to be converted to
 * persistent base64 data URLs for reliable display.
 */

import { storage } from 'uxp'

/**
 * Checks if a blob URL is still valid and accessible
 */
export async function isBlobUrlValid(blobUrl: string): Promise<boolean> {
  if (!blobUrl || !blobUrl.startsWith('blob:')) {
    return false
  }

  try {
    const response = await fetch(blobUrl, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    console.warn('[BlobLifecycle] Blob URL validation failed:', error)
    return false
  }
}

/**
 * Converts a blob URL to a base64 data URL for persistent storage
 */
export async function convertBlobUrlToDataUrl(blobUrl: string): Promise<string | null> {
  if (!blobUrl || !blobUrl.startsWith('blob:')) {
    return null
  }

  try {
    console.log('[BlobLifecycle] Converting blob URL to data URL...')
    const response = await fetch(blobUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.status}`)
    }

    const blob = await response.blob()
    const dataUrl = await blobToDataUrl(blob)
    console.log('[BlobLifecycle] Successfully converted blob to data URL')
    return dataUrl
  } catch (error) {
    console.error('[BlobLifecycle] Failed to convert blob URL to data URL:', error)
    return null
  }
}

/**
 * Converts a Blob to a base64 data URL
 */
export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert blob to data URL'))
      }
    }
    reader.onerror = () => reject(new Error('FileReader error'))
    reader.readAsDataURL(blob)
  })
}

/**
 * Loads a local file and converts it to a data URL
 */
export async function loadLocalFileAsDataUrl(
  folderToken: string,
  relativePath: string,
  mimeType?: string
): Promise<string | null> {
  try {
    console.log('[BlobLifecycle] Loading local file as data URL:', relativePath)

    const fs = storage.localFileSystem
    const folder = await fs.getEntryForPersistentToken(folderToken)
    const file = await folder.getEntry(relativePath)

    const arrayBuffer = await file.read()
    const blob = new Blob([arrayBuffer], { type: mimeType })
    const dataUrl = await blobToDataUrl(blob)

    console.log('[BlobLifecycle] Successfully loaded local file as data URL')
    return dataUrl
  } catch (error) {
    console.error('[BlobLifecycle] Failed to load local file as data URL:', error)
    return null
  }
}

/**
 * Creates a temporary blob URL from a local file path (fallback method)
 */
export async function createTempBlobUrlFromLocalPath(
  localPath: string,
  mimeType?: string
): Promise<string | null> {
  try {
    console.log('[BlobLifecycle] Creating temp blob URL from local path:', localPath)

    // This is a fallback method that may not work reliably in UXP
    // Use loadLocalFileAsDataUrl whenever possible instead
    const fs = storage.localFileSystem

    // Try to find the file by path - this is unreliable in UXP
    // as we don't have direct filesystem access
    console.warn('[BlobLifecycle] Temp blob URL creation from local path is unreliable in UXP')
    return null
  } catch (error) {
    console.error('[BlobLifecycle] Failed to create temp blob URL from local path:', error)
    return null
  }
}

/**
 * Refreshes a URL if it's a blob URL, converting it to a persistent data URL
 */
export async function refreshUrlIfNeeded(url: string): Promise<string> {
  if (!url || !url.startsWith('blob:')) {
    return url // Return as-is if not a blob URL
  }

  console.log('[BlobLifecycle] Refreshing blob URL...')

  // Check if blob URL is still valid
  const isValid = await isBlobUrlValid(url)
  if (isValid) {
    console.log('[BlobLifecycle] Blob URL is still valid')
    return url
  }

  console.log('[BlobLifecycle] Blob URL expired, attempting conversion to data URL')

  // Convert to data URL for persistence
  const dataUrl = await convertBlobUrlToDataUrl(url)
  if (dataUrl) {
    console.log('[BlobLifecycle] Successfully refreshed blob URL to data URL')
    return dataUrl
  }

  console.error('[BlobLifecycle] Failed to refresh blob URL')
  return url // Return original URL as fallback
}

/**
 * Batch refreshes multiple URLs, prioritizing blob URLs
 */
export async function refreshUrlsIfNeeded(urls: string[]): Promise<string[]> {
  const refreshPromises = urls.map(url => refreshUrlIfNeeded(url))
  return Promise.all(refreshPromises)
}

/**
 * ContentItem URL refresh utility
 */
export interface UrlRefreshOptions {
  displayUrl?: string
  thumbnailUrl?: string
  blobUrl?: string
  folderToken?: string
  relativePath?: string
  localPath?: string
  mimeType?: string
}

/**
 * Refreshes URLs for a ContentItem, ensuring they remain accessible
 */
export async function refreshContentItemUrls(options: UrlRefreshOptions): Promise<{
  displayUrl?: string
  thumbnailUrl?: string
}> {
  const { displayUrl, thumbnailUrl, blobUrl, folderToken, relativePath, localPath, mimeType } = options

  let refreshedDisplayUrl = displayUrl
  let refreshedThumbnailUrl = thumbnailUrl

  // Refresh display URL if it's a blob URL
  if (displayUrl?.startsWith('blob:')) {
    refreshedDisplayUrl = await refreshUrlIfNeeded(displayUrl)
  }

  // Refresh thumbnail URL if it's a blob URL
  if (thumbnailUrl?.startsWith('blob:')) {
    refreshedThumbnailUrl = await refreshUrlIfNeeded(thumbnailUrl)
  }

  // If URLs are still blob URLs after refresh, try loading from local storage
  if (folderToken && relativePath) {
    if (refreshedDisplayUrl?.startsWith('blob:') || !refreshedDisplayUrl) {
      const localDataUrl = await loadLocalFileAsDataUrl(folderToken, relativePath, mimeType)
      if (localDataUrl) {
        refreshedDisplayUrl = localDataUrl
      }
    }

    if (refreshedThumbnailUrl?.startsWith('blob:') || !refreshedThumbnailUrl) {
      const localDataUrl = await loadLocalFileAsDataUrl(folderToken, relativePath, mimeType)
      if (localDataUrl) {
        refreshedThumbnailUrl = localDataUrl
      }
    }
  }

  // Fallback to blob URL if available and other methods failed
  if (!refreshedDisplayUrl && blobUrl) {
    refreshedDisplayUrl = blobUrl
  }

  if (!refreshedThumbnailUrl && blobUrl) {
    refreshedThumbnailUrl = blobUrl
  }

  return {
    displayUrl: refreshedDisplayUrl,
    thumbnailUrl: refreshedThumbnailUrl
  }
}