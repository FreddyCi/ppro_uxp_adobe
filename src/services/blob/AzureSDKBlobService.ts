/**
 * Azure SDK Blob Storage Service
 * Production-ready blob storage service using @azure/storage-blob SDK v12
 * Supports Azure Blob Storage for cloud-native storage
 */

import {
  BlobServiceClient,
  ContainerClient,
  AnonymousCredential,
  RestError,
} from '@azure/storage-blob'

import type {
  PublicAccessType,
  BlobUploadCommonResponse,
  BlobDownloadResponseParsed,
} from '@azure/storage-blob'

import type {
  AzureSDKBlobConfig,
  AzureBlobUploadResponse,
  AzureBlobDownloadResponse,
  AzureBlobInfo,
  ContainerCreateRequest,
  BlobMetadata,
  AzureBlobError,
  StorageAccountStats,
} from '../../types/azureBlob.js'

import type { IMSService } from '../ims/IMSService.js'
import { SASTokenService, createSASTokenService } from './SASTokenService.js'
import { isAzureEnabled } from '../storageMode.js'

// UXP environment detection
declare const uxp: any

export class AzureSDKBlobService {
  private config: AzureSDKBlobConfig
  private blobServiceClient: BlobServiceClient | null = null
  private credential: AnonymousCredential | null = null
  private imsService?: IMSService
  private sasTokenService?: SASTokenService

  /**
   * Retry policy configuration for Azure operations
   */
  private retryOptions = {
    retryDelayInMs: 1000,
    maxRetryDelayInMs: 64000,
    maxTries: 3,
    retryPolicyType: 'exponential' as const,
  }

  /**
   * Request timeout configuration
   */
  private requestOptions = {
    timeoutInMs: 30000,
  }

  /**
   * Error types that should trigger retry attempts
   */
  private retryableErrorCodes = new Set([
    'ECONNRESET',
    'ENOTFOUND',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'NETWORK_ERROR',
    'TooManyRequests',
    'InternalServerError',
    'ServiceUnavailable',
    'ServerTimeout',
    'RequestTimeout',
  ])

  /**
   * Authentication error codes that require re-authentication
   */
  private authenticationErrorCodes = new Set([
    'AuthenticationFailed',
    'Unauthorized',
    'InvalidAuthenticationInfo',
    'MissingRequiredHeader',
    'ExpiredAuthenticationToken',
  ])
  private containerClients: Map<string, ContainerClient> = new Map()

  /**
   * Circuit breaker state for handling cascading failures
   */
  private circuitBreaker = {
    failureCount: 0,
    lastFailureTime: 0,
    state: 'CLOSED' as 'CLOSED' | 'OPEN' | 'HALF_OPEN',
    threshold: 5,
    timeout: 60000, // 1 minute
  }

  constructor(config: AzureSDKBlobConfig, imsService?: IMSService) {
    this.config = config
    this.imsService = imsService

    // Initialize SAS token service if IMS service is provided
    if (this.imsService) {
      this.sasTokenService = createSASTokenService(this.imsService)
      console.warn(
        '🔐 Azure SDK: Initialized with SAS token service for secure authentication'
      )
    } else {
      console.warn(
        '⚠️ Azure SDK: No IMS service provided - limited functionality available'
      )
    }

    this.validateConfig()
  }

  /**
   * Validate service configuration
   */
  private validateConfig(): void {
    const { storageAccountName, defaultContainer } = this.config

    if (!storageAccountName) {
      throw new Error('Azure Storage Account name is required')
    }

    if (!defaultContainer) {
      throw new Error('Default container name is required')
    }

    // Validate container names
    Object.values(this.config.containers).forEach(containerName => {
      if (!this.isValidContainerName(containerName)) {
        throw new Error(`Invalid container name: ${containerName}`)
      }
    })

    // Validate storage configuration
    if (this.config.environment === 'production') {
      if (!this.config.storageAccountKey && !this.config.connectionString) {
        throw new Error(
          'Storage account key or connection string required for production'
        )
      }
    }
  }

  /**
   * Validate Azure container naming rules
   */
  private isValidContainerName(name: string): boolean {
    return (
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(name) &&
      name.length >= 3 &&
      name.length <= 63
    )
  }

  /**
   * Initialize blob service client with SAS token authentication
   */
  private async initializeClient(): Promise<void> {
    if (this.blobServiceClient) return

    try {
      const accountUrl = this.getAccountUrl()

      // For browser environments with SAS token backend service
      if (this.sasTokenService) {
        console.warn(
          '🔐 Azure Storage: Using SAS token service for secure authentication'
        )

        // Create service client with anonymous credential
        // SAS tokens will be obtained per-operation from backend service
        this.credential = new AnonymousCredential()
        this.blobServiceClient = new BlobServiceClient(
          accountUrl,
          this.credential
        )

        console.warn(
          '🔐 Azure Storage: Client initialized successfully with SAS token backend'
        )
        return
      }

      // Fallback: Check for account key (development only)
      if (this.config.storageAccountKey) {
        console.warn(
          '⚠️ Azure Storage: Using account key for authentication. This should only be used in development!'
        )

        this.credential = new AnonymousCredential()
        this.blobServiceClient = new BlobServiceClient(
          accountUrl,
          this.credential
        )

        console.warn(
          '⚠️ Azure Storage: Client initialized with account key fallback'
        )
        return
      }

      throw new Error(
        'Azure Storage: No authentication method available. SAS token service or account key required.'
      )
    } catch (error) {
      const azureError = this.createAzureError(
        'CLIENT_INIT_FAILED',
        `Failed to initialize Azure Blob Service client: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500,
        true
      )
      throw azureError
    }
  }

  /**
   * Get Azure Storage Account URL
   */
  private getAccountUrl(): string {
    return `https://${this.config.storageAccountName}.blob.core.windows.net`
  }

  /**
   * Get or create container client
   */
  private getContainerClient(containerName: string): ContainerClient {
    if (!this.blobServiceClient) {
      throw new Error('Blob service client not initialized')
    }

    let containerClient = this.containerClients.get(containerName)
    if (!containerClient) {
      containerClient = this.blobServiceClient.getContainerClient(containerName)
      this.containerClients.set(containerName, containerClient)
    }

    return containerClient
  }

  // ===== CORE STORAGE OPERATIONS =====

  /**
   * Upload blob using SAS token + fetch (browser/UXP safe)
   */
  private async uploadBlobWithSASFetch(
    file: File | Blob | Uint8Array | ArrayBuffer | string,
    containerName: string,
    blobName: string,
    metadata?: Record<string, string>
  ): Promise<AzureBlobUploadResponse> {
    // Request SAS token with read+write permissions
    const sasResponse = await this.sasTokenService!.requestUploadToken(
      containerName,
      blobName,
      60 // 1 hour expiration
    )

    const contentType = this.getContentType(file as any, blobName)
    const putUrl = sasResponse.sasUrl

    const bytes = await this.toUint8Array(file)
    const headers: Record<string, string> = {
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': contentType,
      'x-ms-version': '2020-04-08',
    }
    if (metadata) {
      for (const [k, v] of Object.entries(metadata)) headers[`x-ms-meta-${k}`] = v
    }

    const resp = await fetch(putUrl, {
      method: 'PUT',
      headers: new Headers(headers),
      body: bytes
    })

    if (!resp.ok) {
      throw new Error(`Azure PUT via SAS failed: ${resp.status} ${await resp.text()}`)
    }

    return {
      success: true,
      blobUrl: sasResponse.sasUrl, // Return SAS URL with read permission for Luma
      etag: resp.headers.get('etag') || '',
      lastModified: resp.headers.get('last-modified') ? new Date(resp.headers.get('last-modified')!) : new Date(),
      contentMD5: '',
      requestId: resp.headers.get('x-ms-request-id') || '',
      version: '2020-04-08',
      date: new Date(),
    }
  }

  /**
   * Upload blob using Shared Key + fetch (development fallback)
   */
  private async uploadBlobWithFetch(
    file: File | Blob | Uint8Array | ArrayBuffer | string,
    containerName: string,
    blobName: string,
    metadata?: Record<string, string>
  ): Promise<AzureBlobUploadResponse> {
    const accountName = this.config.storageAccountName
    const accountKey = this.config.storageAccountKey!
    const contentType = this.getContentType(file as any, blobName)

    const data = await this.toUint8Array(file)

    const date = new Date().toUTCString()
    const canonicalHeaders = `x-ms-blob-type:BlockBlob\nx-ms-date:${date}\nx-ms-version:2020-04-08`
    const canonicalResource = `/${accountName}/${containerName}/${blobName}`
    const stringToSign = `PUT\n\n\n${data.length}\n\n${contentType}\n\n\n\n\n\n\n${canonicalHeaders}\n${canonicalResource}`
    const signature = await this.createSharedKeySignature(stringToSign, accountKey)

    const uploadUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`
    const headers: Record<string, string> = {
      'Authorization': `SharedKey ${accountName}:${signature}`,
      'Content-Type': contentType,
      'x-ms-blob-type': 'BlockBlob',
      'x-ms-date': date,
      'x-ms-version': '2020-04-08',
    }
    if (metadata) {
      for (const [k, v] of Object.entries(metadata)) headers[`x-ms-meta-${k}`] = v
    }

    const resp = await fetch(uploadUrl, { method: 'PUT', headers: new Headers(headers), body: data })
    if (!resp.ok) {
      throw new Error(`Azure upload failed: ${resp.status} ${resp.statusText} - ${await resp.text()}`)
    }

    // NOTE: this URL is only public if your container access is 'blob'
    const publicUrl = uploadUrl

    return {
      success: true,
      blobUrl: publicUrl, // if container is private, switch to SAS approach above
      etag: resp.headers.get('etag') || '',
      lastModified: resp.headers.get('last-modified') ? new Date(resp.headers.get('last-modified')!) : new Date(),
      contentMD5: '',
      requestId: resp.headers.get('x-ms-request-id') || '',
      version: '2020-04-08',
      date: new Date(),
    }
  }

  /**
   * Create Shared Key signature for Azure Storage authentication
   */
  private async createSharedKeySignature(stringToSign: string, accountKey: string): Promise<string> {
    // Decode base64 account key
    const keyBytes = Uint8Array.from(atob(accountKey), c => c.charCodeAt(0))

    // Use Web Crypto API for HMAC-SHA256
    const encoder = new TextEncoder()
    const data = encoder.encode(stringToSign)
    const key = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', key, data)

    // Convert to base64
    return btoa(String.fromCharCode(...new Uint8Array(signature)))
  }

  /**
   * Upload blob to Azure Storage using SAS token authentication
   */
  async uploadBlob(
    file: File | Blob | Uint8Array | ArrayBuffer | string,
    containerName: string,
    blobName: string,
    metadata?: Record<string, string>
  ): Promise<AzureBlobUploadResponse> {
    return this.withRetry(async () => {
      await this.initializeClient()

      // Prefer SAS + fetch (browser/UXP safe, returns public URL)
      if (this.sasTokenService) {
        console.warn('🔐 Azure Upload: Using SAS + fetch')
        return this.uploadBlobWithSASFetch(file, containerName, blobName, metadata)
      }

      // UXP fallback: Shared Key + fetch (dev only)
      if (typeof uxp !== 'undefined') {
        if (!this.config.storageAccountKey) {
          throw this.createAzureError(
            'NO_AUTH_METHOD',
            'Shared Key required in UXP fallback',
            401,
            false
          )
        }
        console.warn('⚠️ Azure Upload: Shared Key + fetch fallback')
        return this.uploadBlobWithFetch(file, containerName, blobName, metadata)
      }

      // Last resort: (avoid SDK path in panel to prevent Buffer)
      throw this.createAzureError(
        'NO_AUTH_METHOD',
        'No supported auth method available for upload',
        401,
        false
      )
    })
  }  /**
   * Download blob from Azure Storage using SAS token authentication
   */
  async downloadBlob(
    containerName: string,
    blobName: string
  ): Promise<AzureBlobDownloadResponse> {
    return this.withRetry(async () => {
      await this.initializeClient()

      // Use SAS token service for secure download
      if (this.sasTokenService) {
        try {
          console.warn('🔐 Azure Download: Requesting SAS token for download', {
            containerName,
            blobName,
          })

          // Request download SAS token from backend
          const sasResponse = await this.sasTokenService.requestDownloadToken(
            containerName,
            blobName,
            60 // 1 hour expiration
          )

          // Create blob client using SAS URL
          const blobClient = new (
            await import('@azure/storage-blob')
          ).BlobClient(sasResponse.sasUrl)

          const downloadResponse: BlobDownloadResponseParsed =
            await blobClient.download()

          if (!downloadResponse.readableStreamBody) {
            throw new Error('No data received from blob download')
          }

          // Convert stream to blob
          const buffer = await this.streamToBuffer(
            downloadResponse.readableStreamBody
          )
          const blob = new Blob([new Uint8Array(buffer)], {
            type: downloadResponse.contentType || 'application/octet-stream',
          })

          console.warn(
            '🔐 Azure Download: Successfully downloaded using SAS token',
            {
              containerName,
              blobName,
              contentLength: buffer.byteLength,
            }
          )

          return {
            success: true,
            blob,
            metadata: downloadResponse.metadata || {},
            contentType:
              downloadResponse.contentType || 'application/octet-stream',
            contentLength: downloadResponse.contentLength || buffer.byteLength,
            etag: downloadResponse.etag!,
            lastModified: downloadResponse.lastModified!,
            blobType: downloadResponse.blobType!,
          }
        } catch (sasError) {
          console.error(
            '🔐 Azure Download: SAS token download failed:',
            sasError
          )
          throw this.createAzureError(
            'SAS_DOWNLOAD_FAILED',
            `SAS token download failed: ${sasError instanceof Error ? sasError.message : 'Unknown error'}`,
            500,
            true
          )
        }
      }

      // Fallback: Account key method (development only)
      if (this.config.storageAccountKey) {
        console.warn(
          '⚠️ Azure Download: Using account key fallback (development only)'
        )

        const containerClient = this.getContainerClient(containerName)
        const blobClient = containerClient.getBlobClient(blobName)

        const downloadResponse: BlobDownloadResponseParsed =
          await blobClient.download()

        if (!downloadResponse.readableStreamBody) {
          throw new Error('No data received from blob download')
        }

        // Convert stream to blob
        const buffer = await this.streamToBuffer(
          downloadResponse.readableStreamBody
        )
        const blob = new Blob([new Uint8Array(buffer)], {
          type: downloadResponse.contentType || 'application/octet-stream',
        })

        return {
          success: true,
          blob,
          metadata: downloadResponse.metadata || {},
          contentType:
            downloadResponse.contentType || 'application/octet-stream',
          contentLength: downloadResponse.contentLength || buffer.byteLength,
          etag: downloadResponse.etag!,
          lastModified: downloadResponse.lastModified!,
          blobType: downloadResponse.blobType!,
        }
      }

      // No authentication method available
      throw this.createAzureError(
        'NO_AUTH_METHOD',
        'No authentication method available for Azure Storage download',
        401,
        false
      )
    })
  }

  /**
   * Delete blob from Azure Storage
   */
  async deleteBlob(containerName: string, blobName: string): Promise<void> {
    return this.withRetry(async () => {
      await this.initializeClient()

      const containerClient = this.getContainerClient(containerName)
      const blobClient = containerClient.getBlobClient(blobName)

      await blobClient.deleteIfExists()
    })
  }

  /**
   * List blobs in container
   */
  async listBlobs(
    containerName: string,
    prefix?: string
  ): Promise<AzureBlobInfo[]> {
    return this.withRetry(async () => {
      await this.initializeClient()

      const containerClient = this.getContainerClient(containerName)
      const blobs: AzureBlobInfo[] = []

      const listOptions = {
        prefix,
        includeMetadata: true,
        includeTags: true,
      }

      for await (const blob of containerClient.listBlobsFlat(listOptions)) {
        blobs.push({
          ...blob,
          customMetadata: blob.metadata
            ? this.parseCustomMetadata(blob.metadata)
            : undefined,
        } as AzureBlobInfo)
      }

      return blobs
    })
  }

  // ===== CONTAINER MANAGEMENT =====

  /**
   * Create container
   */
  async createContainer(
    containerName: string,
    options?: ContainerCreateRequest
  ): Promise<void> {
    return this.withRetry(async () => {
      await this.initializeClient()

      const containerClient = this.getContainerClient(containerName)

      await containerClient.create({
        access: options?.publicAccess || 'blob',
        metadata: {
          ...options?.metadata,
          createdAt: new Date().toISOString(),
          createdBy: 'AzureSDKBlobService',
        },
      })
    })
  }

  /**
   * Ensure container exists
   */
  async ensureContainer(containerName: string): Promise<void> {
    return this.withRetry(async () => {
      await this.initializeClient()

      const containerClient = this.getContainerClient(containerName)

      try {
        await containerClient.createIfNotExists({
          access: 'blob',
          metadata: {
            createdAt: new Date().toISOString(),
            purpose: 'UXP Panel Asset Storage',
          },
        })
      } catch (error) {
        // Handle common errors gracefully
        if (error && typeof error === 'object') {
          const restError = error as RestError
          
          // Container already exists (409 conflict)
          if (restError.statusCode === 409 || restError.code === 'ContainerAlreadyExists') {
            console.warn('ℹ️ Azure Storage: Container already exists:', containerName)
            return
          }
          
          // Insufficient permissions (403/401) - container might exist but we can't verify
          if (restError.statusCode === 403 || restError.statusCode === 401) {
            console.warn('⚠️ Azure Storage: Insufficient permissions to verify container, assuming it exists:', containerName)
            return
          }
        }
        
        // Re-throw other errors
        throw error
      }
    })
  }

  /**
   * Set container permissions
   */
  async setContainerPermissions(
    containerName: string,
    access: PublicAccessType
  ): Promise<void> {
    return this.withRetry(async () => {
      await this.initializeClient()

      const containerClient = this.getContainerClient(containerName)

      await containerClient.setAccessPolicy(access)
    })
  }

  // ===== SAS TOKEN GENERATION =====

  /**
   * Generate blob SAS URL
   */
  async generateBlobSasUrl(
    _blobName: string,
    _expiryHours = 24,
    _permissions: unknown // Not used in browser environment
  ): Promise<string> {
    await this.initializeClient()

    // In browser environments, SAS token generation requires a backend service
    // that has access to the storage account key for security reasons
    if (!this.credential || this.credential instanceof AnonymousCredential) {
      throw this.createAzureError(
        'SAS_AUTH_FAILED',
        'SAS token generation not available in browser environment. Use backend service for SAS token generation.',
        401,
        false
      )
    }

    // This code path won't be reached in browser environments due to the check above
    // But keeping it for reference/future backend integration
    throw this.createAzureError(
      'SAS_GENERATION_UNAVAILABLE',
      'SAS token generation requires backend service integration for browser security',
      501,
      false
    )
  }

  /**
   * Generate container SAS URL
   */
  async generateContainerSasUrl(
    _expiryHours = 24,
    _permissions: unknown // Not used in browser environment
  ): Promise<string> {
    await this.initializeClient()

    // In browser environments, SAS token generation requires a backend service
    // that has access to the storage account key for security reasons
    if (!this.credential || this.credential instanceof AnonymousCredential) {
      throw this.createAzureError(
        'SAS_AUTH_FAILED',
        'SAS token generation not available in browser environment. Use backend service for SAS token generation.',
        401,
        false
      )
    }

    // This code path won't be reached in browser environments due to the check above
    // But keeping it for reference/future backend integration
    throw this.createAzureError(
      'SAS_GENERATION_UNAVAILABLE',
      'SAS token generation requires backend service integration for browser security',
      501,
      false
    )
  }

  // ===== METADATA AND PROPERTIES MANAGEMENT =====

  /**
   * Set blob metadata
   */
  async setBlobMetadata(
    containerName: string,
    blobName: string,
    metadata: Record<string, string>
  ): Promise<void> {
    return this.withRetry(async () => {
      await this.initializeClient()

      const containerClient = this.getContainerClient(containerName)
      const blobClient = containerClient.getBlobClient(blobName)

      await blobClient.setMetadata({
        ...metadata,
        lastUpdated: new Date().toISOString(),
      })
    })
  }

  /**
   * Get blob metadata
   */
  async getBlobMetadata(
    containerName: string,
    blobName: string
  ): Promise<Record<string, string>> {
    return this.withRetry(async () => {
      await this.initializeClient()

      const containerClient = this.getContainerClient(containerName)
      const blobClient = containerClient.getBlobClient(blobName)

      const properties = await blobClient.getProperties()
      return properties.metadata || {}
    })
  }

  /**
   * Set blob properties
   */
  async setBlobProperties(
    containerName: string,
    blobName: string,
    properties: import('@azure/storage-blob').BlobHTTPHeaders
  ): Promise<void> {
    return this.withRetry(async () => {
      await this.initializeClient()

      const containerClient = this.getContainerClient(containerName)
      const blobClient = containerClient.getBlobClient(blobName)

      await blobClient.setHTTPHeaders(properties)
    })
  }

  // ===== HEALTH AND DIAGNOSTICS =====

  /**
   * Test Azure Storage credentials and connectivity
   */
  async testCredentials(): Promise<{
    accountName: string;
    containerName: string;
    connectionTest: boolean;
    containerExists: boolean;
    permissions: string[];
    error?: string;
  }> {
    const result = {
      accountName: this.config.storageAccountName,
      containerName: this.config.defaultContainer,
      connectionTest: false,
      containerExists: false,
      permissions: [] as string[],
      error: undefined as string | undefined,
    };

    try {
      console.warn('🔍 Testing Azure Storage credentials...');

      // Test 1: Basic client initialization
      await this.initializeClient();
      result.connectionTest = true;
      console.warn('✅ Azure client initialized successfully');

      // Test 2: Check if container exists
      const containerClient = this.getContainerClient(this.config.defaultContainer);
      const containerExists = await containerClient.exists();
      result.containerExists = containerExists;
      console.warn(`📦 Container '${this.config.defaultContainer}' exists: ${containerExists}`);

      // Test 3: Try to get container properties (tests permissions)
      if (containerExists) {
        try {
          const properties = await containerClient.getProperties();
          result.permissions.push('read');
          console.warn('✅ Container read permissions: OK');

          // Try to list blobs (tests list permission)
          try {
            const blobs = containerClient.listBlobsFlat();
            // Just get the first result to test permissions
            const firstBlob = await blobs.next();
            if (!firstBlob.done) {
              result.permissions.push('list');
              console.warn('✅ Container list permissions: OK');
            } else {
              console.warn('ℹ️ Container list permissions: OK (empty container)');
              result.permissions.push('list');
            }
          } catch (listError) {
            console.warn('⚠️ Container list permissions: Failed (may be expected)');
          }

        } catch (propsError) {
          console.warn('❌ Container permissions test failed:', propsError);
          result.error = `Container access failed: ${propsError instanceof Error ? propsError.message : 'Unknown error'}`;
        }
      } else {
        result.error = `Container '${this.config.defaultContainer}' does not exist`;
      }

    } catch (error) {
      result.connectionTest = false;
      result.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Azure credentials test failed:', error);
    }

    console.warn('🔍 Azure credentials test result:', result);
    return result;
  }

  /**
   * Get storage account statistics
   */
  async getStorageStats(): Promise<StorageAccountStats> {
    await this.initializeClient()

    if (!this.blobServiceClient) {
      throw new Error('Blob service client not initialized')
    }

    const stats = await this.blobServiceClient.getStatistics()
    return {
      geoReplication: stats.geoReplication
        ? {
            status: stats.geoReplication.status,
            lastSyncTime: stats.geoReplication.lastSyncOn,
          }
        : undefined,
    }
  }

  /**
   * Get service properties
   */
  async getServiceProperties(): Promise<
    import('@azure/storage-blob').BlobServiceProperties
  > {
    await this.initializeClient()

    if (!this.blobServiceClient) {
      throw new Error('Blob service client not initialized')
    }

    const response = await this.blobServiceClient.getProperties()
    return response
  }

  // ===== UTILITY METHODS =====

  /**
   * Get content type from file or filename
   */
  private getContentType(
    file: File | Blob | Uint8Array | ArrayBuffer | string,
    filename: string
  ): string {
    // Check if file has a type property (Blob-like objects)
    if (file && typeof file === 'object' && 'type' in file && typeof file.type === 'string') {
      return file.type || this.getContentTypeFromExtension(filename)
    }

    return this.getContentTypeFromExtension(filename)
  }

  /**
   * Get content type from file extension
   */
  private getContentTypeFromExtension(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase()

    const contentTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      avi: 'video/x-msvideo',
      webm: 'video/webm',
      pdf: 'application/pdf',
      json: 'application/json',
      txt: 'text/plain',
    }

    return contentTypes[ext || ''] || 'application/octet-stream'
  }

  /**
   * Create default tags for blob
   */
  private createDefaultTags(
    metadata?: Record<string, string>
  ): Record<string, string> {
    return {
      service: 'uxp-panel',
      environment: this.config.environment,
      timestamp: new Date().toISOString().split('T')[0], // YYYY-MM-DD format for tags
      ...(metadata?.userId && { userId: metadata.userId }),
      ...(metadata?.sessionId && { sessionId: metadata.sessionId }),
    }
  }

  /**
   * Parse custom metadata from blob metadata
   */
  private parseCustomMetadata(
    metadata: Record<string, string>
  ): BlobMetadata | undefined {
    try {
      // Check if this looks like our custom metadata
      if (metadata.originalName && metadata.mimeType) {
        return metadata as BlobMetadata
      }
    } catch {
      // Ignore parsing errors
    }
    return undefined
  }

  /**
   * Convert ReadableStream to Uint8Array (UXP compatible)
   */
  private async streamToBuffer(stream: any): Promise<Uint8Array> {
    const chunks: Uint8Array[] = []
    return new Promise((resolve, reject) => {
      stream.on?.('data', (chunk: any) => {
        if (chunk instanceof Uint8Array) chunks.push(chunk)
        else if (chunk instanceof ArrayBuffer) chunks.push(new Uint8Array(chunk))
        else if (typeof chunk === 'string') chunks.push(new TextEncoder().encode(chunk))
        else if (chunk && typeof chunk === 'object' && 'buffer' in chunk) chunks.push(new Uint8Array(chunk.buffer))
        else reject(new Error('Unsupported stream chunk type'))
      })
      stream.on?.('end', () => {
        const len = chunks.reduce((s, c) => s + c.length, 0)
        const out = new Uint8Array(len)
        let off = 0
        for (const c of chunks) { out.set(c, off); off += c.length }
        resolve(out)
      })
      stream.on?.('error', reject)
    })
  }

  /**
   * Normalize any input to Uint8Array without Buffer usage
   */
  private async toUint8Array(input: File | Blob | Uint8Array | ArrayBuffer | string): Promise<Uint8Array> {
    if (input instanceof Uint8Array) return input
    if (input instanceof ArrayBuffer) return new Uint8Array(input)
    if (typeof Blob !== 'undefined' && input instanceof Blob) {
      return new Uint8Array(await input.arrayBuffer())
    }
    if (typeof input === 'string') {
      // http(s) URL
      if (/^https?:\/\//i.test(input)) {
        const resp = await fetch(input)
        const buf = await resp.arrayBuffer()
        return new Uint8Array(buf)
      }
      // data URL
      if (/^data:/.test(input)) {
        const base64 = input.split(',')[1] ?? ''
        const bin = atob(base64)
        const out = new Uint8Array(bin.length)
        for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
        return out
      }
      throw new Error('Unsupported string source (must be http(s) or data URL)')
    }
    throw new Error('Unsupported file type')
  }



  /**
   * Create user-friendly error messages for common issues
   */
  private createUserFriendlyErrorMessage(error: Error): string {
    const errorMessage = error.message.toLowerCase()

    // CORS-related errors
    if (
      errorMessage.includes('cors') ||
      errorMessage.includes('blocked by cors policy') ||
      errorMessage.includes('access-control-allow-origin')
    ) {
      return 'Azure Storage upload blocked due to CORS policy. Please configure CORS settings in your Azure Storage account to allow requests from this domain. See docs/AZURE_CORS_SETUP.md for detailed instructions.'
    }

    // Network/connectivity errors
    if (
      errorMessage.includes('failed to fetch') ||
      errorMessage.includes('network error') ||
      errorMessage.includes('net::err_failed')
    ) {
      return 'Network error occurred while uploading to Azure Storage. This may be due to CORS configuration issues, network connectivity problems, or firewall restrictions.'
    }

    // Authorization errors - check for 401 status or auth-related messages
    if (
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('access denied') ||
      errorMessage.includes('forbidden') ||
      errorMessage.includes('authenticationfailed') ||
      errorMessage.includes('invalid authentication') ||
      errorMessage.includes('401')
    ) {
      return 'Azure Storage authentication failed. Please check your storage account name and key in the environment variables. Make sure VITE_AZURE_STORAGE_ACCOUNT_NAME and VITE_AZURE_STORAGE_ACCOUNT_KEY are set correctly.'
    }

    // Quota/storage errors
    if (
      errorMessage.includes('quota') ||
      errorMessage.includes('storage limit') ||
      errorMessage.includes('insufficient storage')
    ) {
      return 'Azure Storage quota exceeded. Please check your storage account limits and usage.'
    }

    // Timeout errors
    if (
      errorMessage.includes('timeout') ||
      errorMessage.includes('request timeout')
    ) {
      return 'Azure Storage upload timed out. Please try again or check your network connection.'
    }

    // DOMParser errors (UXP doesn't have DOMParser)
    if (
      errorMessage.includes('dom.getelementsbytagname') ||
      errorMessage.includes('domparser') ||
      errorMessage.includes('xml parsing')
    ) {
      return 'Azure Storage error response parsing failed. This may indicate authentication issues or network problems. Please check your Azure credentials.'
    }

    // Fall back to original message if no specific pattern matches
    return error.message
  }

  /**
   * Create standardized Azure blob error
   */
  private createAzureError(
    code: string,
    message: string,
    statusCode: number,
    retryable: boolean,
    azureError?: RestError
  ): AzureBlobError {
    return {
      code,
      message,
      statusCode,
      timestamp: new Date(),
      requestId:
        azureError?.request?.requestId ||
        `azure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      azureErrorCode: azureError?.code,
      azureErrorMessage: azureError?.message,
      clientRequestId: azureError?.request?.headers?.get(
        'x-ms-client-request-id'
      ),
      date: azureError?.response?.headers?.get('date')
        ? new Date(azureError.response.headers.get('date')!)
        : undefined,
      serviceVersion: azureError?.response?.headers?.get('x-ms-version'),
      retryable,
    }
  }

  /**
   * Execute operation with retry logic
   */
  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined

    for (let attempt = 0; attempt <= this.retryOptions.maxTries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error

        // Check if error is retryable
        if (
          attempt === this.retryOptions.maxTries ||
          !this.isRetryableError(error)
        ) {
          break
        }

        // Calculate delay with exponential backoff and jitter
        const baseDelay =
          this.retryOptions.retryDelayInMs * Math.pow(2, attempt)
        const jitter = Math.random() * 100 // 100ms jitter
        const delay = Math.min(
          baseDelay + jitter,
          this.retryOptions.maxRetryDelayInMs
        )

        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    // Convert to Azure blob error if not already
    if (lastError && lastError instanceof RestError) {
      throw this.createAzureError(
        'AZURE_OPERATION_FAILED',
        this.createUserFriendlyErrorMessage(lastError),
        lastError.statusCode || 500,
        this.isRetryableError(lastError),
        lastError
      )
    }

    if (lastError) {
      // Check for common browser/network errors and provide better messages
      const userFriendlyMessage = this.createUserFriendlyErrorMessage(lastError)
      throw this.createAzureError(
        'OPERATION_FAILED',
        userFriendlyMessage,
        500,
        false
      )
    }

    throw this.createAzureError(
      'UNKNOWN_ERROR',
      'Operation failed with unknown error',
      500,
      false
    )
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof RestError) {
      // Azure-specific retryable errors
      const retryableStatusCodes = [408, 429, 500, 502, 503, 504]
      return retryableStatusCodes.includes(error.statusCode || 0)
    }

    if (error instanceof Error) {
      return (
        this.retryableErrorCodes.has(error.name) ||
        this.retryableErrorCodes.has(error.message) ||
        Array.from(this.retryableErrorCodes).some(code =>
          error.message.includes(code)
        )
      )
    }

    return false
  }

  /**
   * Check if an error requires authentication refresh
   */
  private isAuthenticationError(error: unknown): boolean {
    if (error instanceof RestError) {
      return (
        this.authenticationErrorCodes.has(error.code || '') ||
        this.authenticationErrorCodes.has(error.name)
      )
    }

    if (error instanceof Error) {
      return Array.from(this.authenticationErrorCodes).some(code =>
        error.message.includes(code)
      )
    }

    return false
  }

  /**
   * Handle authentication errors by refreshing credentials
   */
  private async handleAuthenticationError(): Promise<void> {
    try {
      // Re-initialize the client with fresh credentials
      await this.initializeClient()
    } catch (refreshError) {
      throw this.createAzureError(
        'AUTH_REFRESH_FAILED',
        `Failed to refresh authentication: ${refreshError instanceof Error ? refreshError.message : 'Unknown error'}`,
        401,
        false
      )
    }
  }

  /**
   * Check if circuit breaker allows operation
   */
  private isCircuitBreakerOpen(): boolean {
    const now = Date.now()

    if (this.circuitBreaker.state === 'OPEN') {
      if (
        now - this.circuitBreaker.lastFailureTime >
        this.circuitBreaker.timeout
      ) {
        this.circuitBreaker.state = 'HALF_OPEN'
        return false
      }
      return true
    }

    return false
  }

  /**
   * Record operation success for circuit breaker
   */
  private recordSuccess(): void {
    this.circuitBreaker.failureCount = 0
    this.circuitBreaker.state = 'CLOSED'
  }

  /**
   * Record operation failure for circuit breaker
   */
  private recordFailure(): void {
    this.circuitBreaker.failureCount++
    this.circuitBreaker.lastFailureTime = Date.now()

    if (this.circuitBreaker.failureCount >= this.circuitBreaker.threshold) {
      this.circuitBreaker.state = 'OPEN'
    }
  }

  /**
   * Execute operation with comprehensive error handling and resilience
   */
  private async executeWithResilience<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    // Check circuit breaker
    if (this.isCircuitBreakerOpen()) {
      throw this.createAzureError(
        'CIRCUIT_BREAKER_OPEN',
        `Circuit breaker is open for ${operationName}. Service may be experiencing issues.`,
        503,
        true
      )
    }

    return this.withRetry(async () => {
      try {
        const result = await Promise.race([
          operation(),
          new Promise<T>((_, reject) => {
            setTimeout(() => {
              reject(
                new Error(
                  `Operation ${operationName} timed out after ${this.requestOptions.timeoutInMs}ms`
                )
              )
            }, this.requestOptions.timeoutInMs)
          }),
        ])

        // Record success for circuit breaker
        this.recordSuccess()
        return result
      } catch (error) {
        // Record failure for circuit breaker
        this.recordFailure()

        // Handle authentication errors
        if (this.isAuthenticationError(error)) {
          await this.handleAuthenticationError()
          // Retry the operation once with fresh credentials
          const retryResult = await operation()
          this.recordSuccess() // Reset circuit breaker on successful retry
          return retryResult
        }

        // Re-throw other errors for retry logic to handle
        throw error
      }
    })
  }

  /**
   * Enhanced blob upload with comprehensive error handling
   */
  async uploadBlobWithResilience(
    file: File | Blob | Uint8Array | ArrayBuffer | string,
    containerName: string,
    blobName: string,
    metadata?: Record<string, string>
  ): Promise<AzureBlobUploadResponse> {
    return this.executeWithResilience(
      () => this.uploadBlob(file, containerName, blobName, metadata),
      `uploadBlob(${containerName}/${blobName})`
    )
  }

  /**
   * Enhanced blob download with comprehensive error handling
   */
  async downloadBlobWithResilience(
    containerName: string,
    blobName: string
  ): Promise<AzureBlobDownloadResponse> {
    return this.executeWithResilience(
      () => this.downloadBlob(containerName, blobName),
      `downloadBlob(${containerName}/${blobName})`
    )
  }

  /**
   * Enhanced blob deletion with comprehensive error handling
   */
  async deleteBlobWithResilience(
    containerName: string,
    blobName: string
  ): Promise<void> {
    return this.executeWithResilience(
      () => this.deleteBlob(containerName, blobName),
      `deleteBlob(${containerName}/${blobName})`
    )
  }

  /**
   * Enhanced container creation with comprehensive error handling
   */
  async createContainerWithResilience(
    containerName: string,
    options?: { publicAccess?: PublicAccessType; metadata?: BlobMetadata }
  ): Promise<void> {
    return this.executeWithResilience(
      () =>
        this.createContainer(containerName, {
          name: containerName,
          publicAccess: options?.publicAccess,
          metadata: options?.metadata,
        }),
      `createContainer(${containerName})`
    )
  }

  /**
   * Check storage account health and quotas
   */
  async checkStorageHealth(): Promise<{
    healthy: boolean
    issues: string[]
    quotaUsage?: {
      used: number
      limit: number
      percentage: number
    }
  }> {
    const issues: string[] = []
    let healthy = true

    try {
      // Test basic connectivity
      await this.executeWithResilience(async () => {
        const containerClient = this.getContainerClient(
          this.config.defaultContainer
        )
        await containerClient.getProperties()
      }, 'healthCheck')
    } catch (error) {
      healthy = false
      issues.push(
        `Connectivity check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }

    try {
      // Check storage account stats if available
      const stats = await this.getStorageStats()

      if (stats && stats.geoReplication?.status !== 'live') {
        issues.push('Geo-replication is not in live state')
      }
    } catch (error) {
      // Stats check is optional, don't mark as unhealthy
      issues.push(
        `Stats check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }

    return {
      healthy,
      issues,
      // Note: Azure doesn't provide quota information through standard APIs
      // This would need to be implemented with Azure Resource Manager APIs
    }
  }

  /**
   * Enhanced batch upload with comprehensive error handling
   */
  async batchUploadWithResilience(
    files: Array<{
      file: File | Blob | Uint8Array | ArrayBuffer | string
      containerName: string
      blobName: string
      metadata?: Record<string, string>
    }>,
    options?: {
      concurrency?: number
      continueOnError?: boolean
    }
  ): Promise<{
    successful: AzureBlobUploadResponse[]
    failed: Array<{
      error: AzureBlobError
      index: number
      request: (typeof files)[0]
    }>
  }> {
    const concurrency = options?.continueOnError ? 3 : 1
    const continueOnError = options?.continueOnError ?? false

    const successful: AzureBlobUploadResponse[] = []
    const failed: Array<{
      error: AzureBlobError
      index: number
      request: (typeof files)[0]
    }> = []

    // Process files in batches to control concurrency
    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency)
      const batchPromises = batch.map(async (request, batchIndex) => {
        const globalIndex = i + batchIndex
        try {
          const result = await this.uploadBlobWithResilience(
            request.file,
            request.containerName,
            request.blobName,
            request.metadata
          )
          return { success: true as const, result, index: globalIndex, request }
        } catch (error) {
          const azureError =
            error instanceof Error && 'code' in error
              ? (error as unknown as AzureBlobError)
              : this.createAzureError(
                  'BATCH_UPLOAD_FAILED',
                  error instanceof Error ? error.message : 'Unknown error',
                  500,
                  false
                )
          return {
            success: false as const,
            error: azureError,
            index: globalIndex,
            request,
          }
        }
      })

      const batchResults = await Promise.all(batchPromises)

      for (const result of batchResults) {
        if (result.success) {
          successful.push(result.result)
        } else {
          failed.push({
            error: result.error,
            index: result.index,
            request: result.request,
          })

          // Stop on first error if continueOnError is false
          if (!continueOnError) {
            return { successful, failed }
          }
        }
      }
    }

    return { successful, failed }
  }

  /**
   * Enhanced batch delete with comprehensive error handling
   */
  async batchDeleteWithResilience(
    requests: Array<{ containerName: string; blobName: string }>,
    options?: {
      concurrency?: number
      continueOnError?: boolean
    }
  ): Promise<{
    successful: number
    failed: Array<{
      error: AzureBlobError
      index: number
      request: (typeof requests)[0]
    }>
  }> {
    const concurrency = options?.continueOnError ? 5 : 1
    const continueOnError = options?.continueOnError ?? false

    let successful = 0
    const failed: Array<{
      error: AzureBlobError
      index: number
      request: (typeof requests)[0]
    }> = []

    // Process requests in batches to control concurrency
    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency)
      const batchPromises = batch.map(async (request, batchIndex) => {
        const globalIndex = i + batchIndex
        try {
          await this.deleteBlobWithResilience(
            request.containerName,
            request.blobName
          )
          return { success: true as const, index: globalIndex, request }
        } catch (error) {
          const azureError =
            error instanceof Error && 'code' in error
              ? (error as unknown as AzureBlobError)
              : this.createAzureError(
                  'BATCH_DELETE_FAILED',
                  error instanceof Error ? error.message : 'Unknown error',
                  500,
                  false
                )
          return {
            success: false as const,
            error: azureError,
            index: globalIndex,
            request,
          }
        }
      })

      const batchResults = await Promise.all(batchPromises)

      for (const result of batchResults) {
        if (result.success) {
          successful++
        } else {
          failed.push({
            error: result.error,
            index: result.index,
            request: result.request,
          })

          // Stop on first error if continueOnError is false
          if (!continueOnError) {
            return { successful, failed }
          }
        }
      }
    }

    return { successful, failed }
  }
}

/**
 * Factory function to create AzureSDKBlobService from environment variables
 * Uses IMS for user authentication and Azure Storage Account Key for blob access
 */
export function createAzureSDKBlobService(
  imsService?: IMSService
): AzureSDKBlobService {
  // For Luma keyframes, we need Azure even in local mode
  // Check if we have Azure credentials available
  const accountName = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_KEY;
  const containerName = import.meta.env.VITE_AZURE_STORAGE_CONTAINER_NAME || 'uxp-images';

  // Debug logging for credentials
  console.warn('🔍 Azure Credentials Debug:', {
    accountName: accountName ? `${accountName.substring(0, 4)}...` : 'NOT SET',
    accountKey: accountKey ? `${accountKey.substring(0, 10)}...` : 'NOT SET',
    containerName,
    hasIMS: !!imsService
  });

  if (!accountName) {
    throw new Error('Azure storage account name is required')
  }
  // If imsService exists we can operate with SAS only (no key in the panel).
  // Keep `accountKey` optional; only needed for SharedKey dev fallback.

  const config: AzureSDKBlobConfig = {
    // Storage account configuration
    storageAccountName: accountName,
    storageAccountKey: accountKey,
    connectionString: import.meta.env.VITE_AZURE_STORAGE_CONNECTION_STRING,

    // Environment settings
    environment:
      (import.meta.env.VITE_ENVIRONMENT as 'development' | 'production') ||
      'development',

    // Base configuration compatibility
    accountName: accountName,
    containerName: containerName,
    timeout: 30000,
    retryOptions: {
      maxRetries: 3,
      retryDelayMs: 1000,
      maxRetryDelayMs: 30000,
    },

    // Container configuration
    defaultContainer: containerName,
    containers: {
      images: containerName,
      videos: 'uxp-videos',
      temp: 'uxp-temp',
      exports: 'uxp-exports',
    },

    // SAS token configuration
    defaultSasExpirationMinutes: 60,
    maxSasExpirationMinutes: 24 * 60, // 24 hours
    allowedSasPermissions: [], // Will be populated as needed

    // Performance and limits
    maxFileSize: 500 * 1024 * 1024, // 500MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/mov',
      'video/webm',
      'application/pdf',
    ],
    parallelUploads: 4,
    chunkSize: 4 * 1024 * 1024, // 4MB chunks
  }

  return new AzureSDKBlobService(config, imsService)
}

export default AzureSDKBlobService
