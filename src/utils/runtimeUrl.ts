/**
 * Runtime URL utilities for converting persisted data URLs to blob URLs
 * Used to hydrate data: URLs into playable blob: URLs for video playback in UXP
 */

/**
 * Converts a data URL to a runtime blob URL for video playback
 * This is needed because UXP video elements cannot play large data: URLs directly
 * 
 * @param dataUrl - The data URL to convert (e.g., "data:video/mp4;base64,...")
 * @returns A blob URL (e.g., "blob:uxp-internal://...") or empty string if invalid
 */
export function dataUrlToObjectUrl(dataUrl: string): string {
  const i = dataUrl.indexOf(',')
  if (i < 0) return ''
  
  const meta = dataUrl.slice(5, i)      // e.g. "video/mp4;base64"
  const mime = meta.split(';')[0] || 'application/octet-stream'
  const b64  = dataUrl.slice(i + 1)

  const bin = atob(b64)
  const len = bin.length
  const bytes = new Uint8Array(len)
  for (let j = 0; j < len; j++) bytes[j] = bin.charCodeAt(j)

  const blob = new Blob([bytes], { type: mime })
  return URL.createObjectURL(blob)
}
