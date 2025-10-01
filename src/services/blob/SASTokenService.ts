/**
 * SAS Token Service
 * Handles secure SAS token generation using Azure User Delegation Keys
 * Generates SAS tokens client-side without backend service dependency
 */

import {
  BlobServiceClient,
} from '@azure/storage-blob'
import type { IIMSService } from '../ims/IMSService'

// SAS Token Request/Response Types
export interface SASTokenRequest {
  containerName: string
  blobName?: string
  operation: 'upload' | 'download' | 'list' | 'delete'
  expirationMinutes?: number
  permissions?: ('read' | 'write' | 'delete' | 'list')[]
}

export interface SASTokenResponse {
  success: true
  sasUrl: string
  sasToken: string
  expiresAt: string
  permissions: string[]
  containerName: string
  blobName?: string
}

export interface SASTokenError {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
  timestamp: string
}

export interface SASTokenServiceConfig {
  storageAccountName: string
  defaultExpirationMinutes: number
  maxExpirationMinutes: number
  timeout: number
}

/**
 * SAS Token Service for secure Azure Storage access
 */
export class SASTokenService {
  private config: SASTokenServiceConfig
  private imsService: IIMSService
  private blobServiceClient: BlobServiceClient | null = null

  constructor(config: SASTokenServiceConfig, imsService: IIMSService) {
    this.config = config
    this.imsService = imsService
    this.validateConfig()
    this.initializeBlobServiceClient()
  }

  /**
   * Validate service configuration
   */
  private validateConfig(): void {
    if (!this.config.storageAccountName) {
      throw new Error('Storage account name is required for SAS token service')
    }

    if (
      !this.config.defaultExpirationMinutes ||
      this.config.defaultExpirationMinutes <= 0
    ) {
      throw new Error('Default expiration minutes must be positive')
    }

    if (
      !this.config.maxExpirationMinutes ||
      this.config.maxExpirationMinutes <= 0
    ) {
      throw new Error('Max expiration minutes must be positive')
    }

    if (
      this.config.defaultExpirationMinutes > this.config.maxExpirationMinutes
    ) {
      throw new Error('Default expiration cannot exceed maximum expiration')
    }
  }

  /**
   * Initialize Azure Blob Service Client
   */
  private initializeBlobServiceClient(): void {
    try {
      const accountUrl = `https://${this.config.storageAccountName}.blob.core.windows.net`
      // We'll use anonymous credential initially and get user delegation key when needed
      this.blobServiceClient = new BlobServiceClient(accountUrl)
      console.warn('🔐 SAS Token Service: Blob service client initialized for user delegation')
    } catch (error) {
      console.error('🔐 SAS Token Service: Failed to initialize blob service client:', error)
      throw new Error('Failed to initialize Azure Blob Service client')
    }
  }

  /**
   * Get user delegation key from Azure Storage
   */
  private async getUserDelegationKey(): Promise<any> {
    if (!this.blobServiceClient) {
      throw new Error('Blob service client not initialized')
    }

    try {
      // Validate IMS authentication first
      const imsToken = await this.imsService.getAccessToken()
      if (!imsToken) {
        throw new Error('IMS authentication required for user delegation key request')
      }

      // Validate token is still valid
      const tokenValidation = await this.imsService.validateToken(imsToken)
      if (!tokenValidation.valid) {
        throw new Error('IMS token is invalid or expired')
      }

      // Calculate start and expiry times
      const now = new Date()
      const expiryTime = new Date(now.getTime() + (this.config.maxExpirationMinutes * 60 * 1000))

      console.warn('🔐 SAS Token Service: Requesting user delegation key', {
        accountName: this.config.storageAccountName,
        expiryTime: expiryTime.toISOString(),
      })

      // Get user delegation key using Azure SDK
      const userDelegationKey = await this.blobServiceClient.getUserDelegationKey(now, expiryTime)

      console.warn('🔐 SAS Token Service: Successfully obtained user delegation key')

      return userDelegationKey
    } catch (error) {
      console.error('🔐 SAS Token Service: Failed to get user delegation key:', error)
      throw new Error(`Failed to obtain user delegation key: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Request SAS token using user delegation key
   */
  async requestSASToken(request: SASTokenRequest): Promise<SASTokenResponse> {
    try {
      // Validate request
      const validatedRequest = this.validateRequest(request)

      // Get user delegation key
      const userDelegationKey = await this.getUserDelegationKey()

      // Calculate expiry time
      const expiryTime = new Date(Date.now() + (validatedRequest.expirationMinutes! * 60 * 1000))

      let sasUrl: string

      if (validatedRequest.blobName) {
        // Generate blob SAS token using BlobClient
        const containerClient = this.blobServiceClient!.getContainerClient(validatedRequest.containerName)
        const blobClient = containerClient.getBlobClient(validatedRequest.blobName)
        
        const permissions = this.mapPermissionsToString(validatedRequest.permissions!)
        sasUrl = await blobClient.generateUserDelegationSasUrl({
          permissions: permissions as any, // Browser SDK expects permission object
          expiresOn: expiryTime,
        }, userDelegationKey)
      } else {
        // Generate container SAS token using ContainerClient
        const containerClient = this.blobServiceClient!.getContainerClient(validatedRequest.containerName)
        
        const permissions = this.mapPermissionsToString(validatedRequest.permissions!)
        sasUrl = await containerClient.generateSasUrl({
          permissions: permissions as any, // Browser SDK expects permission object
          expiresOn: expiryTime,
        })
      }

      // Extract SAS token from URL (everything after the '?')
      const sasToken = sasUrl.split('?')[1] || ''

      const response: SASTokenResponse = {
        success: true,
        sasUrl,
        sasToken,
        expiresAt: expiryTime.toISOString(),
        permissions: validatedRequest.permissions!,
        containerName: validatedRequest.containerName,
        blobName: validatedRequest.blobName,
      }

      console.warn('🔐 SAS Token Service: Successfully generated SAS token', {
        containerName: response.containerName,
        blobName: response.blobName,
        expiresAt: response.expiresAt,
        permissions: response.permissions,
        hasToken: !!response.sasToken,
        hasUrl: !!response.sasUrl,
      })

      return response
    } catch (error) {
      console.error('🔐 SAS Token Service: Failed to generate SAS token:', error)

      if (error instanceof Error) {
        throw error
      }

      throw new Error('Failed to generate SAS token: Unknown error')
    }
  }

  /**
   * Map permission strings to SAS permission string
   */
  private mapPermissionsToString(permissions: string[]): string {
    const permissionMap: Record<string, string> = {
      'read': 'r',
      'write': 'w',
      'delete': 'd',
      'list': 'l',
      'create': 'c',
      'add': 'a',
    }

    let permissionString = ''
    for (const permission of permissions) {
      const sasChar = permissionMap[permission]
      if (sasChar && !permissionString.includes(sasChar)) {
        permissionString += sasChar
      }
    }

    return permissionString
  }

  /**
   * Request upload SAS token for specific blob
   */
  async requestUploadToken(
    containerName: string,
    blobName: string,
    expirationMinutes?: number
  ): Promise<SASTokenResponse> {
    return this.requestSASToken({
      containerName,
      blobName,
      operation: 'upload',
      expirationMinutes:
        expirationMinutes || this.config.defaultExpirationMinutes,
      permissions: ['read', 'write'], // Include read permission for UXP to use the URL directly
    })
  }

  /**
   * Request download SAS token for specific blob
   */
  async requestDownloadToken(
    containerName: string,
    blobName: string,
    expirationMinutes?: number
  ): Promise<SASTokenResponse> {
    return this.requestSASToken({
      containerName,
      blobName,
      operation: 'download',
      expirationMinutes:
        expirationMinutes || this.config.defaultExpirationMinutes,
      permissions: ['read'],
    })
  }

  /**
   * Request list SAS token for container
   */
  async requestListToken(
    containerName: string,
    expirationMinutes?: number
  ): Promise<SASTokenResponse> {
    return this.requestSASToken({
      containerName,
      operation: 'list',
      expirationMinutes:
        expirationMinutes || this.config.defaultExpirationMinutes,
      permissions: ['list'],
    })
  }

  /**
   * Request delete SAS token for specific blob
   */
  async requestDeleteToken(
    containerName: string,
    blobName: string,
    expirationMinutes?: number
  ): Promise<SASTokenResponse> {
    return this.requestSASToken({
      containerName,
      blobName,
      operation: 'delete',
      expirationMinutes:
        expirationMinutes || this.config.defaultExpirationMinutes,
      permissions: ['delete'],
    })
  }

  /**
   * Validate and normalize SAS token request
   */
  private validateRequest(request: SASTokenRequest): SASTokenRequest {
    // Validate container name
    if (!request.containerName || typeof request.containerName !== 'string') {
      throw new Error('Container name is required and must be a string')
    }

    // Validate container name format (Azure naming rules)
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(request.containerName)) {
      throw new Error(
        'Invalid container name format. Must be lowercase alphanumeric with hyphens.'
      )
    }

    if (request.containerName.length < 3 || request.containerName.length > 63) {
      throw new Error('Container name must be between 3 and 63 characters')
    }

    // Validate blob name if provided
    if (request.blobName !== undefined) {
      if (
        typeof request.blobName !== 'string' ||
        request.blobName.length === 0
      ) {
        throw new Error('Blob name must be a non-empty string when provided')
      }

      if (request.blobName.length > 1024) {
        throw new Error('Blob name cannot exceed 1024 characters')
      }

      // Check for invalid characters
      if (/[<>:"|?*]/.test(request.blobName)) {
        throw new Error('Blob name contains invalid characters')
      }
    }

    // Validate operation
    const validOperations = ['upload', 'download', 'list', 'delete'] as const
    if (!validOperations.includes(request.operation)) {
      throw new Error(
        `Invalid operation. Must be one of: ${validOperations.join(', ')}`
      )
    }

    // Validate expiration
    const expirationMinutes =
      request.expirationMinutes || this.config.defaultExpirationMinutes
    if (expirationMinutes <= 0) {
      throw new Error('Expiration minutes must be positive')
    }

    if (expirationMinutes > this.config.maxExpirationMinutes) {
      throw new Error(
        `Expiration cannot exceed ${this.config.maxExpirationMinutes} minutes`
      )
    }

    // Validate permissions
    const validPermissions = ['read', 'write', 'delete', 'list'] as const
    const permissions =
      request.permissions || this.getDefaultPermissions(request.operation)

    for (const permission of permissions) {
      if (!validPermissions.includes(permission)) {
        throw new Error(
          `Invalid permission: ${permission}. Must be one of: ${validPermissions.join(', ')}`
        )
      }
    }

    return {
      containerName: request.containerName,
      blobName: request.blobName,
      operation: request.operation,
      expirationMinutes,
      permissions,
    }
  }

  /**
   * Get default permissions for operation
   */
  private getDefaultPermissions(
    operation: string
  ): ('read' | 'write' | 'delete' | 'list')[] {
    switch (operation) {
      case 'upload':
        return ['write']
      case 'download':
        return ['read']
      case 'list':
        return ['list']
      case 'delete':
        return ['delete']
      default:
        return ['read']
    }
  }

  /**
   * Test user delegation SAS token generation
   */
  async testUserDelegation(): Promise<{
    canGenerateToken: boolean
    hasValidCredentials: boolean
    error?: string
  }> {
    try {
      // Test IMS authentication
      const imsToken = await this.imsService.getAccessToken()
      const tokenValidation = await this.imsService.validateToken(imsToken)

      if (!tokenValidation.valid) {
        return {
          canGenerateToken: false,
          hasValidCredentials: false,
          error: 'IMS token validation failed',
        }
      }

      // Test user delegation key retrieval
      try {
        await this.getUserDelegationKey()

        return {
          canGenerateToken: true,
          hasValidCredentials: true,
        }
      } catch (delegationError) {
        return {
          canGenerateToken: false,
          hasValidCredentials: true,
          error: `User delegation key retrieval failed: ${delegationError instanceof Error ? delegationError.message : 'Unknown error'}`,
        }
      }
    } catch (error) {
      return {
        canGenerateToken: false,
        hasValidCredentials: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

/**
 * Factory function to create SAS Token Service from environment variables
 */
export function createSASTokenService(
  imsService: IIMSService
): SASTokenService {
  const config: SASTokenServiceConfig = {
    storageAccountName: import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME || '',
    defaultExpirationMinutes: parseInt(
      import.meta.env.VITE_SAS_DEFAULT_EXPIRATION_MINUTES || '60',
      10
    ),
    maxExpirationMinutes: parseInt(
      import.meta.env.VITE_SAS_MAX_EXPIRATION_MINUTES || '1440',
      10
    ), // 24 hours
    timeout: parseInt(import.meta.env.VITE_SAS_REQUEST_TIMEOUT || '10000', 10), // 10 seconds
  }

  return new SASTokenService(config, imsService)
}

export default SASTokenService
