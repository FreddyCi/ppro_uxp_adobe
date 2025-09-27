/**
 * SAS Token Service
 * Handles secure SAS token requests for Azure Storage operations
 * Validates IMS authentication and communicates with backend service
 */

import axios from 'axios'
import type { AxiosResponse } from 'axios'
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
  backendUrl: string
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

  constructor(config: SASTokenServiceConfig, imsService: IIMSService) {
    this.config = config
    this.imsService = imsService
    this.validateConfig()
  }

  /**
   * Validate service configuration
   */
  private validateConfig(): void {
    if (!this.config.backendUrl) {
      throw new Error('Backend URL is required for SAS token service')
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
   * Request SAS token from backend service
   */
  async requestSASToken(request: SASTokenRequest): Promise<SASTokenResponse> {
    try {
      // Validate IMS authentication first
      const imsToken = await this.imsService.getAccessToken()

      if (!imsToken) {
        throw new Error('IMS authentication required for SAS token request')
      }

      // Validate token is still valid
      const tokenValidation = await this.imsService.validateToken(imsToken)
      if (!tokenValidation.valid) {
        throw new Error('IMS token is invalid or expired')
      }

      // Prepare request with validated parameters
      const validatedRequest = this.validateRequest(request)

      // Make authenticated request to backend
      const backendUrl = `${this.config.backendUrl}/api/azure/sas-token`

      console.warn('🔐 SAS Token Service: Requesting SAS token from backend', {
        containerName: validatedRequest.containerName,
        operation: validatedRequest.operation,
        blobName: validatedRequest.blobName,
        expirationMinutes: validatedRequest.expirationMinutes,
        backendUrl,
      })

      const response: AxiosResponse<SASTokenResponse | SASTokenError> =
        await axios.post(backendUrl, validatedRequest, {
          headers: {
            Authorization: `Bearer ${imsToken}`,
            'Content-Type': 'application/json',
            'X-Adobe-IMS-Org': this.imsService.getTokenInfo().expiresAt
              ? 'validated'
              : 'unknown',
          },
          timeout: this.config.timeout,
        })

      // Handle response
      if (!response.data.success) {
        const errorResponse = response.data as SASTokenError
        throw new Error(
          `Backend SAS token request failed: ${errorResponse.error.message}`
        )
      }

      const sasResponse = response.data as SASTokenResponse

      console.warn('🔐 SAS Token Service: Successfully received SAS token', {
        containerName: sasResponse.containerName,
        blobName: sasResponse.blobName,
        expiresAt: sasResponse.expiresAt,
        permissions: sasResponse.permissions,
        hasToken: !!sasResponse.sasToken,
        hasUrl: !!sasResponse.sasUrl,
      })

      return sasResponse
    } catch (error) {
      console.error('🔐 SAS Token Service: Failed to request SAS token:', error)

      // Handle specific error types
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error(
            'IMS authentication failed or expired. Please re-authenticate.'
          )
        }
        if (error.response?.status === 403) {
          throw new Error('Insufficient permissions for Azure Storage access')
        }
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.')
        }
        if (error.response?.status && error.response.status >= 500) {
          throw new Error(
            'Backend service temporarily unavailable. Please try again.'
          )
        }

        throw new Error(
          `SAS token request failed: ${error.response?.data?.message || error.message}`
        )
      }

      if (error instanceof Error) {
        throw error
      }

      throw new Error('Failed to request SAS token: Unknown error')
    }
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
      permissions: ['write'],
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
   * Check backend service health
   */
  async checkBackendHealth(): Promise<{
    healthy: boolean
    latencyMs?: number
    error?: string
  }> {
    try {
      const startTime = Date.now()

      const healthUrl = `${this.config.backendUrl}/api/health`
      const response = await axios.get(healthUrl, {
        timeout: this.config.timeout,
      })

      const latencyMs = Date.now() - startTime

      return {
        healthy: response.status === 200,
        latencyMs,
      }
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Test full authentication flow
   */
  async testAuthenticationFlow(): Promise<{
    imsValid: boolean
    backendReachable: boolean
    canRequestToken: boolean
    error?: string
  }> {
    try {
      // Test IMS authentication
      const imsToken = await this.imsService.getAccessToken()
      const tokenValidation = await this.imsService.validateToken(imsToken)

      if (!tokenValidation.valid) {
        return {
          imsValid: false,
          backendReachable: false,
          canRequestToken: false,
          error: 'IMS token validation failed',
        }
      }

      // Test backend connectivity
      const healthCheck = await this.checkBackendHealth()

      if (!healthCheck.healthy) {
        return {
          imsValid: true,
          backendReachable: false,
          canRequestToken: false,
          error: `Backend health check failed: ${healthCheck.error}`,
        }
      }

      // Test minimal SAS token request (list operation for default container)
      try {
        await this.requestListToken('uxp-images', 1) // 1 minute expiration for test

        return {
          imsValid: true,
          backendReachable: true,
          canRequestToken: true,
        }
      } catch (tokenError) {
        return {
          imsValid: true,
          backendReachable: true,
          canRequestToken: false,
          error: `SAS token request failed: ${tokenError instanceof Error ? tokenError.message : 'Unknown error'}`,
        }
      }
    } catch (error) {
      return {
        imsValid: false,
        backendReachable: false,
        canRequestToken: false,
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
    backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
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
