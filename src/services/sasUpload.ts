/**
 * Azure SAS Upload Service
 * Simple blob upload using pre-generated container-level SAS tokens
 * 
 * This service bypasses the need for:
 * - Backend SAS token generation
 * - Azure AD authentication
 * - Storage account keys in client code
 * 
 * Configuration via environment variables:
 * - VITE_AZURE_CONTAINER_SAS_URL (easiest - full container URL with SAS)
 * - OR VITE_AZURE_ACCOUNT_NAME + VITE_AZURE_CONTAINER_NAME + VITE_AZURE_SAS_TOKEN
 */

import { BlockBlobClient } from '@azure/storage-blob'

/**
 * Get a BlockBlobClient for uploading to Azure Storage using SAS token
 * @param blobName - Name/path of the blob (e.g., "luma/video-123.mp4")
 * @returns BlockBlobClient configured with SAS URL
 * @throws Error if SAS environment variables are not configured
 */
export function getBlobClient(blobName: string): BlockBlobClient {
  // Option 1: Full container SAS URL (easiest)
  const containerSasUrl = import.meta.env
    .VITE_AZURE_CONTAINER_SAS_URL as string | undefined

  if (containerSasUrl) {
    // Split container URL and query string
    const [baseUrl, queryString] = containerSasUrl.split('?')

    // Construct blob URL: container URL + blob name + SAS query string
    const blobUrl = `${baseUrl.replace(/\/?$/, '/')}${encodeURIComponent(blobName)}?${queryString}`

    console.warn('🔐 [SAS Upload] Using container SAS URL for blob:', blobName)

    return new BlockBlobClient(blobUrl)
  }

  // Option 2: Parts-based configuration
  const accountName = import.meta.env.VITE_AZURE_ACCOUNT_NAME as string
  const containerName = import.meta.env.VITE_AZURE_CONTAINER_NAME as string
  const sasToken = import.meta.env.VITE_AZURE_SAS_TOKEN as string

  if (!accountName || !containerName || !sasToken) {
    throw new Error(
      'Azure SAS configuration missing. Set either VITE_AZURE_CONTAINER_SAS_URL or ' +
        '(VITE_AZURE_ACCOUNT_NAME + VITE_AZURE_CONTAINER_NAME + VITE_AZURE_SAS_TOKEN)'
    )
  }

  // Construct blob URL from parts
  const blobUrl = `https://${accountName}.blob.core.windows.net/${encodeURIComponent(containerName)}/${encodeURIComponent(blobName)}?${sasToken}`

  console.warn('🔐 [SAS Upload] Using parts-based SAS configuration for blob:', blobName)

  return new BlockBlobClient(blobUrl)
}

/**
 * Upload bytes to Azure Blob Storage using pre-generated SAS token
 * @param blobName - Name/path of the blob (e.g., "luma/video-123.mp4")
 * @param data - Data to upload (ArrayBuffer or Uint8Array)
 * @param contentType - MIME type (default: "application/octet-stream")
 * @param onProgress - Optional progress callback receiving loaded bytes
 * @returns The blob URL (may not be publicly readable if SAS lacks 'r' permission)
 * @throws Error if upload fails or SAS is invalid/expired
 */
export async function uploadBytes(
  blobName: string,
  data: ArrayBuffer | Uint8Array,
  contentType?: string,
  onProgress?: (loadedBytes: number) => void
): Promise<string> {
  try {
    const client = getBlobClient(blobName)

    console.warn('☁️ [SAS Upload] Starting upload:', {
      blobName,
      size: data.byteLength,
      contentType: contentType ?? 'application/octet-stream',
    })

    // Upload data with progress tracking
    await client.uploadData(data, {
      blobHTTPHeaders: {
        blobContentType: contentType ?? 'application/octet-stream',
      },
      onProgress: (progress) => {
        if (onProgress && progress.loadedBytes !== undefined) {
          onProgress(progress.loadedBytes)
        }
      },
    })

    console.warn('✅ [SAS Upload] Upload successful:', client.url)

    // Return the blob URL (note: may not be publicly readable without 'r' in SAS)
    return client.url
  } catch (error: any) {
    // Handle SAS-specific errors
    if (error?.statusCode === 403 || error?.code === 'AuthenticationFailed') {
      console.error('❌ [SAS Upload] Authentication failed - SAS token may be expired or invalid:', error)
      throw new Error(
        'Azure SAS token expired or invalid. Please update VITE_AZURE_* environment variables and rebuild. ' +
          `Original error: ${error.message}`
      )
    }

    if (error?.statusCode === 404) {
      console.error('❌ [SAS Upload] Container not found:', error)
      throw new Error(
        'Azure container not found. Check VITE_AZURE_CONTAINER_NAME or SAS URL. ' +
          `Original error: ${error.message}`
      )
    }

    console.error('❌ [SAS Upload] Upload failed:', error)
    throw new Error(`Azure blob upload failed: ${error.message}`)
  }
}

/**
 * Check if SAS upload is configured
 * @returns true if SAS environment variables are set
 */
export function hasSASConfigured(): boolean {
  const containerSasUrl = import.meta.env.VITE_AZURE_CONTAINER_SAS_URL

  if (containerSasUrl) {
    return true
  }

  const accountName = import.meta.env.VITE_AZURE_ACCOUNT_NAME
  const containerName = import.meta.env.VITE_AZURE_CONTAINER_NAME
  const sasToken = import.meta.env.VITE_AZURE_SAS_TOKEN

  return !!(accountName && containerName && sasToken)
}

/**
 * Get SAS configuration status for UI display
 * @returns Object with configuration status and helpful messages
 */
export function getSASStatus(): {
  configured: boolean
  method: 'container-url' | 'parts' | 'none'
  message: string
} {
  const containerSasUrl = import.meta.env.VITE_AZURE_CONTAINER_SAS_URL

  if (containerSasUrl) {
    return {
      configured: true,
      method: 'container-url',
      message: 'Azure SAS configured via VITE_AZURE_CONTAINER_SAS_URL',
    }
  }

  const accountName = import.meta.env.VITE_AZURE_ACCOUNT_NAME
  const containerName = import.meta.env.VITE_AZURE_CONTAINER_NAME
  const sasToken = import.meta.env.VITE_AZURE_SAS_TOKEN

  if (accountName && containerName && sasToken) {
    return {
      configured: true,
      method: 'parts',
      message: 'Azure SAS configured via parts (account + container + token)',
    }
  }

  return {
    configured: false,
    method: 'none',
    message:
      'Azure SAS not configured. Set VITE_AZURE_CONTAINER_SAS_URL or ' +
      '(VITE_AZURE_ACCOUNT_NAME + VITE_AZURE_CONTAINER_NAME + VITE_AZURE_SAS_TOKEN) in .env',
  }
}
