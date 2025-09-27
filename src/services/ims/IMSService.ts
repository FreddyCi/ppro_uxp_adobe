/**
 * IMS OAuth Service for Adobe Identity Management System
 * Handles server-to-server authentication using client credentials flow
 * Based on: https://developer.adobe.com/developer-console/docs/guides/authentication/ServerToServerAuthentication/
 */

import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { IMSTokenResponse, IMSTokenValidation } from '../../types/index.js'
import { MockIMSService } from './MockIMSService'

export interface IMSServiceConfig {
  clientId: string
  clientSecret: string
  orgId: string
  scopes: string
  imsUrl: string
}

interface TokenCache {
  accessToken: string
  expiresAt: Date
}

// Common interface for IMS services
export interface IIMSService {
  getAccessToken(): Promise<string>
  validateToken(token: string): Promise<IMSTokenValidation>
  refreshToken(): Promise<string>
  clearTokenCache(): void
  getTokenInfo(): {
    hasToken: boolean
    expiresAt: Date | null
    isExpired: boolean
    secondsUntilExpiry: number
  }
}

export class IMSService implements IIMSService {
  private config: IMSServiceConfig
  private tokenCache: TokenCache | null = null

  constructor(config: IMSServiceConfig) {
    this.config = config
    this.validateConfig()
  }

  /**
   * Validate required configuration
   */
  private validateConfig(): void {
    const { clientId, clientSecret, orgId } = this.config
    
    if (!clientId || !clientSecret || !orgId) {
      throw new Error('Missing required IMS configuration: clientId, clientSecret, and orgId are required')
    }
  }

  /**
   * Get access token using client credentials flow
   * Returns cached token if still valid, otherwise requests new token
   */
  async getAccessToken(): Promise<string> {
    try {
      // Return cached token if still valid (with 5 minute buffer)
      if (this.tokenCache && this.isTokenValid(5 * 60 * 1000)) {
        return this.tokenCache.accessToken
      }

      // In UXP environment, always use direct HTTPS URLs
      const tokenUrl = `${this.config.imsUrl}/ims/token/v3`
      
      console.warn(`🔐 Requesting IMS token from: ${tokenUrl}`)
      
      const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        scope: this.config.scopes
      })

      // Add org_id for Adobe enterprise organizations if available
      if (this.config.orgId) {
        params.append('org_id', this.config.orgId)
      }

      // Debug: Log the exact parameters being sent
      console.warn('📝 Request parameters:', {
        grant_type: params.get('grant_type'),
        client_id: params.get('client_id'),
        client_secret: params.get('client_secret') ? '[REDACTED]' : 'MISSING',
        scope: params.get('scope'),
        org_id: params.get('org_id')
      })

      const response: AxiosResponse<IMSTokenResponse> = await axios.post(
        tokenUrl,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'User-Agent': 'UXP-Panel/1.0.0'
          },
          timeout: 15000 // 15 second timeout for UXP network requests
        }
      )

      if (!response.data.access_token) {
        throw new Error('No access token received from IMS')
      }

      console.warn('✅ IMS token received successfully')

      // Cache the token with expiration
      const expiresIn = response.data.expires_in || 3600 // Default 1 hour
      this.tokenCache = {
        accessToken: response.data.access_token,
        expiresAt: new Date(Date.now() + (expiresIn * 1000))
      }
      
      return this.tokenCache.accessToken

    } catch (error) {
      // Enhanced error logging for debugging
      const errorDetails: Record<string, unknown> = {
        message: error instanceof Error ? error.message : 'Unknown error',
        config: {
          clientId: this.config.clientId,
          orgId: this.config.orgId,
          scopes: this.config.scopes,
          imsUrl: this.config.imsUrl
        }
      }
      
      if (axios.isAxiosError(error)) {
        errorDetails.status = error.response?.status
        errorDetails.statusText = error.response?.statusText
        errorDetails.responseData = error.response?.data
        errorDetails.requestConfig = {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      }

      console.error('Failed to get IMS access token:', errorDetails)

      // Clear cache on error
      this.tokenCache = null
      
      throw new Error(`IMS authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Validate an access token
   */
  async validateToken(token: string): Promise<IMSTokenValidation> {
    try {
      // In UXP environment, always use direct HTTPS URLs
      const introspectUrl = `${this.config.imsUrl}/ims/validate_token/v1`
      
      const response = await axios.post(
        introspectUrl,
        new URLSearchParams({
          token,
          client_id: this.config.clientId
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      )

      return {
        valid: response.data.active === true,
        user_id: response.data.sub,
        client_id: response.data.client_id,
        scope: response.data.scope?.split(' '),
        expires_at: response.data.exp,
        token_type: response.data.token_type
      }

    } catch (error) {
      console.error('Token validation failed:', error instanceof Error ? error.message : 'Unknown error')
      return {
        valid: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: error instanceof Error ? error.message : 'Token validation failed'
        }
      }
    }
  }

  /**
   * Force refresh the access token
   */
  async refreshToken(): Promise<string> {
    this.tokenCache = null
    return this.getAccessToken()
  }

  /**
   * Clear cached token
   */
  clearTokenCache(): void {
    this.tokenCache = null
  }

  /**
   * Check if cached token is still valid
   */
  private isTokenValid(bufferMs: number = 0): boolean {
    if (!this.tokenCache) return false
    
    const now = new Date()
    const bufferTime = new Date(this.tokenCache.expiresAt.getTime() - bufferMs)
    
    return now < bufferTime
  }

  /**
   * Get token expiration info
   */
  getTokenInfo(): { 
    hasToken: boolean
    expiresAt: Date | null
    isExpired: boolean
    secondsUntilExpiry: number
  } {
    if (!this.tokenCache) {
      return {
        hasToken: false,
        expiresAt: null,
        isExpired: true,
        secondsUntilExpiry: 0
      }
    }

    const now = new Date()
    const isExpired = now >= this.tokenCache.expiresAt
    const secondsUntilExpiry = Math.max(0, Math.floor((this.tokenCache.expiresAt.getTime() - now.getTime()) / 1000))

    return {
      hasToken: true,
      expiresAt: this.tokenCache.expiresAt,
      isExpired,
      secondsUntilExpiry
    }
  }
}

// Factory function to create IMS service from environment variables
export function createIMSService(): IIMSService {
  const config: IMSServiceConfig = {
    clientId: import.meta.env.VITE_IMS_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_IMS_CLIENT_SECRET || '',
    orgId: import.meta.env.VITE_IMS_ORG_ID || '',
    scopes: import.meta.env.VITE_IMS_SCOPES || 'openid,creative_sdk',
    imsUrl: import.meta.env.VITE_IMS_URL || 'https://ims-na1.adobelogin.com'
  }

  // Check if we have credentials configured
  const hasCredentials = config.clientId && config.clientSecret && config.orgId
  
  if (!hasCredentials) {
    console.warn('🔓 Missing IMS credentials - using mock authentication')
    return new MockIMSService(config)
  }

  console.warn('🔐 Using real IMS authentication with credentials')
  return new IMSService(config)
}

export default IMSService