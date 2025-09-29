/**
 * Azure Blob Storage Service for UXP Panel
 * Handles image and vide      this.containerClient = this.blobServiceClient.getContainerClient(
        this.config.defaultContainer
      )

      // Note: Credential extraction not supported in UXP/browser environment
      // SAS generation will require pre-signed URLs or backend delegation
      console.warn('BlobService initialized for UXP environment - SAS generation not available')

      // Ensure container exists
      await this.ensureContainer()ith SAS URL generation

 */

import {
  BlobServiceClient,
  ContainerClient,
} from '@azure/storage-blob'
import type {
  ImageMetadata,
  VideoMetadata,
  BlobDownloadOptions,
  BlobAccessInfo,
  SasUrlOptions,
  BlobPermissions,
  BlobStorageError,
  EnvironmentAwareBlobConfig,
} from '../../types/blob.js'
import type { IMSService } from '../ims/IMSService.js'
import { isAzureEnabled } from '../storageMode.js'

export interface BlobServiceConfig extends EnvironmentAwareBlobConfig {
  defaultContainer: string
  maxFileSize: number // bytes
  allowedMimeTypes: string[]
  sasExpirationMinutes: number
}

export class BlobService {
  private config: BlobServiceConfig
  private blobServiceClient: BlobServiceClient | null = null
  private containerClient: ContainerClient | null = null
  // Note: StorageSharedKeyCredential not available in UXP/browser environment
  // SAS generation will be handled differently or delegated to backend
  // private imsService?: IMSService // Reserved for future Azure AD authentication integration

  constructor(config: BlobServiceConfig, _imsService?: IMSService) {
    this.config = config
    // this.imsService = imsService
    this.validateConfig()
  }

  private ensureAzureEnabled(): void {
    if (!isAzureEnabled()) {
      throw new Error('Azure Blob operations are disabled in local storage mode')
    }
  }

  /**
   * Validate configuration and initialize clients
   */
  private validateConfig(): void {
    if (!isAzureEnabled()) {
      console.warn('BlobService initialized while Azure storage is disabled')
      return
    }

    const { accountName, containerName, defaultContainer } = this.config

    if (!accountName || !containerName || !defaultContainer) {
      throw new Error('Missing required blob storage configuration')
    }

    // Validate Azure cloud connection string is available
    if (!this.config.connectionString) {
      console.warn('Azure connection string not configured - blob operations may fail')
    }
  }

  /**
   * Initialize blob service client based on environment
   */
  private async initializeClient(): Promise<void> {
    this.ensureAzureEnabled()

    if (this.blobServiceClient) return

    try {
      const connectionString = this.getConnectionString()

      this.blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString)
      this.containerClient = this.blobServiceClient.getContainerClient(
        this.config.defaultContainer
      )

      // Note: Credential extraction not supported in UXP/browser environment
      // SAS generation will require pre-signed URLs or backend delegation
      console.warn('BlobService initialized for UXP environment - SAS generation not available')

      // Ensure container exists
      await this.ensureContainer()
    } catch (error) {
      console.error('Failed to initialize blob service client:', error)
      throw new Error(
        `Blob service initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Get Azure cloud connection string
   */
  private getConnectionString(): string {
    // Use Azure cloud connection string
    if (this.config.connectionString) {
      return this.config.connectionString
    }

    throw new Error(
      'Azure Storage connection string not configured - please set AZURE_STORAGE_CONNECTION_STRING environment variable'
    )
  }

  /**
   * Ensure container exists
   */
  private async ensureContainer(): Promise<void> {
    if (!this.containerClient) {
      throw new Error('Container client not initialized')
    }

    try {
      const exists = await this.containerClient.exists()
      if (!exists) {
        await this.containerClient.createIfNotExists({
          access: 'blob', // Allow blob-level access for SAS URLs
          metadata: {
            created: new Date().toISOString(),
            purpose: 'UXP Panel Asset Storage',
          },
        })
      }
    } catch (error) {
      console.error('Failed to ensure container exists:', error)
      throw new Error(
        `Container creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Upload image file to blob storage
   */
  async uploadImage(file: File, metadata: ImageMetadata): Promise<string> {
    try {
      this.ensureAzureEnabled()
      await this.initializeClient()

      if (!this.containerClient) {
        throw new Error('Container client not initialized')
      }

      // Validate file
      this.validateFile(file)

      // Generate unique blob name
      const blobName = this.generateBlobName(file.name, metadata.id)
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName)

      // Prepare blob metadata
      const blobMetadata = this.prepareBlobMetadata(metadata)

      // Upload file with metadata
      await blockBlobClient.uploadData(file, {
        blobHTTPHeaders: {
          blobContentType: file.type,
          blobContentDisposition: `inline; filename="${file.name}"`,
        },
        metadata: blobMetadata,
        tags: {
          type: 'image',
          generationId: metadata.generationId || '',
          userId: metadata.userId || '',
          sessionId: metadata.sessionId || '',
        },
      })

      // Return the blob URL
      return blockBlobClient.url
    } catch (error) {
      console.error('Failed to upload image:', error)
      throw this.createBlobError(
        'UPLOAD_FAILED',
        `Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      )
    }
  }

  /**
   * Generate SAS URL for blob access
   * Note: In UXP environment, SAS generation requires backend service or pre-signed URLs
   */
  async generateSasUrl(
    blobName: string,
    _permissions: 'read' | 'write' = 'read',
    _options?: SasUrlOptions
  ): Promise<string> {
    try {
      this.ensureAzureEnabled()
      await this.initializeClient()

      if (!this.blobServiceClient) {
        throw new Error('Blob service client not available')
      }

      // In UXP environment, we'll return the direct blob URL
      // In production, you would typically have a backend service generate SAS URLs
      console.warn('SAS generation not available in UXP environment, returning direct blob URL')
      
      const containerClient = this.blobServiceClient.getContainerClient(
        this.config.defaultContainer
      )
      const blobClient = containerClient.getBlobClient(blobName)

      // Return direct blob URL (note: this requires container to have public read access)
      // In production, implement proper SAS generation via backend service
      return blobClient.url
    } catch (error) {
      console.error('Failed to generate SAS URL:', error)
      throw this.createBlobError(
        'SAS_GENERATION_FAILED',
        `SAS URL generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      )
    }
  }

  /**
   * Download file from blob URL
   */
  async downloadFile(
    blobUrl: string,
    options?: BlobDownloadOptions
  ): Promise<Blob> {
    try {
      this.ensureAzureEnabled()
      // Extract blob name from URL
      const url = new URL(blobUrl)
      const pathParts = url.pathname.split('/')
      const blobName = pathParts[pathParts.length - 1]

      await this.initializeClient()

      if (!this.containerClient) {
        throw new Error('Container client not initialized')
      }

      const blobClient = this.containerClient.getBlobClient(blobName)

      // Download blob
      const downloadResponse = await blobClient.download(
        options?.range?.start,
        options?.range ? options.range.end - options.range.start + 1 : undefined
      )

      if (!downloadResponse.readableStreamBody) {
        throw new Error('No data received from blob download')
      }

      // Convert stream to blob
      const buffer = await this.streamToBuffer(
        downloadResponse.readableStreamBody as unknown as ReadableStream<Uint8Array>
      )
      return new Blob([buffer], {
        type: downloadResponse.contentType || 'application/octet-stream',
      })
    } catch (error) {
      console.error('Failed to download file:', error)
      throw this.createBlobError(
        'DOWNLOAD_FAILED',
        `File download failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      )
    }
  }

  /**
   * Get blob access information including SAS URL
   */
  async getBlobAccessInfo(
    blobName: string,
    permissions: BlobPermissions = 'r'
  ): Promise<BlobAccessInfo> {
    try {
      this.ensureAzureEnabled()
      await this.initializeClient()

      if (!this.containerClient) {
        throw new Error('Container client not initialized')
      }

      const blobClient = this.containerClient.getBlobClient(blobName)
      const sasUrl = await this.generateSasUrl(
        blobName,
        permissions === 'r' ? 'read' : 'write'
      )

      return {
        url: blobClient.url,
        sasUrl,
        expiresAt: new Date(
          Date.now() + this.config.sasExpirationMinutes * 60 * 1000
        ),
        permissions,
        containerName: this.config.defaultContainer,
        blobName,
      }
    } catch (error) {
      console.error('Failed to get blob access info:', error)
      throw this.createBlobError(
        'ACCESS_INFO_FAILED',
        `Failed to get blob access info: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      )
    }
  }

  /**
   * List all blobs in the container
   */
  async listBlobs(): Promise<Array<{
    name: string
    url: string
    properties?: {
      lastModified?: Date
      contentLength?: number
      contentType?: string
    }
  }>> {
    try {
      this.ensureAzureEnabled()
      await this.initializeClient()

      if (!this.containerClient) {
        throw new Error('Container client not initialized')
      }

      const blobs: Array<{
        name: string
        url: string
        properties?: {
          lastModified?: Date
          contentLength?: number
          contentType?: string
        }
      }> = []

      // List all blobs in the container
      for await (const blob of this.containerClient.listBlobsFlat({
        includeMetadata: true
      })) {
        const blobClient = this.containerClient.getBlobClient(blob.name)
        blobs.push({
          name: blob.name,
          url: blobClient.url,
          properties: {
            lastModified: blob.properties.lastModified,
            contentLength: blob.properties.contentLength,
            contentType: blob.properties.contentType
          }
        })
      }

      console.warn(`BlobService: Listed ${blobs.length} blobs from container`)
      return blobs
    } catch (error) {
      console.error('Failed to list blobs:', error)
      throw this.createBlobError(
        'LIST_BLOBS_FAILED',
        `Failed to list blobs: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      )
    }
  }

  /**
   * Check if blob exists
   */
  async blobExists(blobName: string): Promise<boolean> {
    try {
      this.ensureAzureEnabled()
      await this.initializeClient()

      if (!this.containerClient) {
        throw new Error('Container client not initialized')
      }

      const blobClient = this.containerClient.getBlobClient(blobName)
      return await blobClient.exists()
    } catch (error) {
      console.error('Failed to check blob existence:', error)
      return false
    }
  }

  /**
   * Delete blob
   */
  async deleteBlob(blobName: string): Promise<void> {
    try {
      this.ensureAzureEnabled()
      await this.initializeClient()

      if (!this.containerClient) {
        throw new Error('Container client not initialized')
      }

      const blobClient = this.containerClient.getBlobClient(blobName)
      await blobClient.deleteIfExists()
    } catch (error) {
      console.error('Failed to delete blob:', error)
      throw this.createBlobError(
        'DELETE_FAILED',
        `Blob deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      )
    }
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: File): void {
    // Check file size
    if (file.size > this.config.maxFileSize) {
      throw new Error(
        `File size ${file.size} exceeds maximum allowed size ${this.config.maxFileSize}`
      )
    }

    // Check MIME type
    if (
      this.config.allowedMimeTypes.length > 0 &&
      !this.config.allowedMimeTypes.includes(file.type)
    ) {
      throw new Error(`File type ${file.type} is not allowed`)
    }
  }

  /**
   * Generate unique blob name
   */
  private generateBlobName(originalName: string, id: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const extension = originalName.split('.').pop() || 'bin'
    return `${id}-${timestamp}.${extension}`
  }

  /**
   * Prepare blob metadata for storage
   */
  private prepareBlobMetadata(
    metadata: ImageMetadata | VideoMetadata
  ): Record<string, string> {
    return {
      id: metadata.id,
      filename: metadata.filename,
      originalName: metadata.originalName,
      mimeType: metadata.mimeType,
      size: metadata.size.toString(),
      timestamp: metadata.timestamp.toISOString(),
      userId: metadata.userId || '',
      sessionId: metadata.sessionId || '',
      tags: metadata.tags.join(','),
    }
  }

  /**
   * Convert ReadableStream to Buffer
   */
  private async streamToBuffer(
    stream: ReadableStream<Uint8Array>
  ): Promise<ArrayBuffer> {
    const reader = stream.getReader()
    const chunks: Uint8Array[] = []

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) chunks.push(value)
      }
    } finally {
      reader.releaseLock()
    }

    // Combine chunks into single ArrayBuffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0

    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }

    return result.buffer
  }

  /**
   * Create standardized blob error
   */
  private createBlobError(
    code: string,
    message: string,
    statusCode: number
  ): BlobStorageError {
    return {
      code,
      message,
      statusCode,
      timestamp: new Date(),
      requestId: `blob-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
  }

  /**
   * Get service health status
   */
  async getServiceHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    environment: string
    containerExists: boolean
    lastChecked: Date
  }> {
    try {
      if (!isAzureEnabled()) {
        return {
          status: 'healthy',
          environment: this.config.environment,
          containerExists: false,
          lastChecked: new Date(),
        }
      }

      await this.initializeClient()

      const containerExists = this.containerClient
        ? await this.containerClient.exists()
        : false

      return {
        status: containerExists ? 'healthy' : 'degraded',
        environment: this.config.environment,
        containerExists,
        lastChecked: new Date(),
      }
    } catch {
      return {
        status: 'unhealthy',
        environment: this.config.environment,
        containerExists: false,
        lastChecked: new Date(),
      }
    }
  }
}

/**
 * Factory function to create BlobService from environment variables
 */
export function createBlobService(imsService?: IMSService): BlobService {
  if (!isAzureEnabled()) {
    throw new Error('BlobService cannot be created when Azure storage is disabled')
  }

  const config: BlobServiceConfig = {
    accountName:
      import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME || 'devstoreaccount1',
    containerName: import.meta.env.VITE_AZURE_CONTAINER_IMAGES || 'uxp-images',
    defaultContainer:
      import.meta.env.VITE_AZURE_CONTAINER_IMAGES || 'uxp-images',
    connectionString: import.meta.env.VITE_AZURE_STORAGE_CONNECTION_STRING,
    environment:
      (import.meta.env.NODE_ENV as 'development' | 'staging' | 'production') ||
      'development',
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/mov',
      'video/webm',
    ],
    sasExpirationMinutes: 60,
    timeout: 30000,
    retryOptions: {
      maxRetries: 3,
      retryDelayMs: 1000,
      maxRetryDelayMs: 5000,
    },
  }

  return new BlobService(config, imsService)
}

export default BlobService
