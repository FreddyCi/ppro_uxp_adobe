/**
 * IMS OAuth Service for Adobe Identity Management System
 * Handles server-to-server authentication using client credentials flow
 * Based on: https://developer.adobe.com/developer-console/docs/guides/authentication/ServerToServerAuthentication/
 */

import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { IMSTokenResponse, IMSTokenValidation } from '../../types/index.js'
import { MockIMSService } from './MockIMSService'
import { setAuthFromToken } from '../../store/authStore'

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

      // Publish token to authStore to keep it authoritative
      setAuthFromToken(this.tokenCache.accessToken)
      
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
      const responseData = await this.requestTokenValidationViaGet(token)
      return this.mapValidationResponse(responseData)

    } catch (error) {
      const errorDetails: Record<string, unknown> = {
        message: error instanceof Error ? error.message : 'Unknown error',
        config: {
          clientId: this.config.clientId,
          orgId: this.config.orgId,
          imsUrl: this.config.imsUrl,
        },
      }

      if (axios.isAxiosError(error)) {
        errorDetails.status = error.response?.status
        errorDetails.statusText = error.response?.statusText
        errorDetails.responseData = error.response?.data
        errorDetails.requestConfig = {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }

        if (error.response?.status === 400) {
          try {
            console.warn('Token validation GET returned 400. Retrying with POST payload...')
            const postResponse = await this.requestTokenValidationViaPost(token)
            console.warn('Token validation POST fallback succeeded.')
            return this.mapValidationResponse(postResponse)
          } catch (postError) {
            errorDetails.postAttempt = this.extractAxiosErrorDetails(postError)
          }
        }
      }

      console.error('Token validation failed:', errorDetails)

      const fallback = this.decodeTokenLocally(token)
      if (fallback) {
        console.warn('Token validation endpoint unavailable; using local JWT decode fallback for diagnostics.')
        return fallback
      }

      return {
        valid: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: error instanceof Error ? error.message : 'Token validation failed'
        }
      }
    }
  }

  private async requestTokenValidationViaGet(token: string): Promise<Record<string, unknown>> {
    const introspectUrl = new URL(`${this.config.imsUrl}/ims/validate_token/v1`)

    introspectUrl.searchParams.set('token', token)
    introspectUrl.searchParams.set('client_id', this.config.clientId)

    if (this.config.clientSecret) {
      introspectUrl.searchParams.set('client_secret', this.config.clientSecret)
    }

    const response = await axios.get(introspectUrl.toString(), {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'UXP-Panel/1.0.0',
      },
      timeout: 10000,
    })

    return (response.data ?? {}) as Record<string, unknown>
  }

  private async requestTokenValidationViaPost(token: string): Promise<Record<string, unknown>> {
    const introspectUrl = `${this.config.imsUrl}/ims/validate_token/v1`

    const params = new URLSearchParams({
      token,
      client_id: this.config.clientId,
      token_type_hint: 'access_token',
    })

    if (this.config.clientSecret) {
      params.append('client_secret', this.config.clientSecret)
    }

    if (this.config.orgId) {
      params.append('org_id', this.config.orgId)
    }

    const response = await axios.post(introspectUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'User-Agent': 'UXP-Panel/1.0.0',
      },
      timeout: 10000,
    })

    return (response.data ?? {}) as Record<string, unknown>
  }

  private mapValidationResponse(data: Record<string, unknown>): IMSTokenValidation {
    const toBoolean = (value: unknown): boolean | undefined => {
      if (typeof value === 'boolean') {
        return value
      }
      if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase()
        if (normalized === 'true') return true
        if (normalized === 'false') return false
      }
      return undefined
    }

    const toNumber = (value: unknown): number | undefined => {
      if (typeof value === 'number' && Number.isFinite(value)) {
        return value
      }
      if (typeof value === 'string') {
        const parsed = Number.parseInt(value, 10)
        return Number.isFinite(parsed) ? parsed : undefined
      }
      return undefined
    }

    const scope = this.parseScope((data['scope'] ?? data['scopes']) as unknown)

    const expiresAt = toNumber(data['exp'])
      ?? toNumber(data['expires_at'])
      ?? toNumber(data['expiresAt'])

    const activeFlag = toBoolean(data['active'])
    const validFlag = toBoolean(data['valid'])
    const checkResult = typeof data['check_result'] === 'string'
      ? (data['check_result'] as string).toUpperCase() === 'SUCCESS'
      : undefined
    const statusFlag = typeof data['status'] === 'string'
      ? (data['status'] as string).toUpperCase() === 'ACTIVE'
      : undefined

    const tokenType = typeof data['token_type'] === 'string'
      ? (data['token_type'] as string)
      : typeof data['tokenType'] === 'string'
        ? (data['tokenType'] as string)
        : typeof data['typ'] === 'string'
          ? (data['typ'] as string)
          : 'Bearer'

    const clientId = typeof data['client_id'] === 'string'
      ? (data['client_id'] as string)
      : typeof data['clientId'] === 'string'
        ? (data['clientId'] as string)
        : undefined

    const userId = typeof data['sub'] === 'string'
      ? (data['sub'] as string)
      : typeof data['user_id'] === 'string'
        ? (data['user_id'] as string)
        : typeof data['userId'] === 'string'
          ? (data['userId'] as string)
          : typeof data['aud'] === 'string'
            ? (data['aud'] as string)
          : undefined

    return {
      valid: activeFlag ?? validFlag ?? checkResult ?? statusFlag ?? true,
      user_id: userId,
      client_id: clientId,
      scope,
      expires_at: expiresAt,
      token_type: tokenType,
    }
  }

  private parseScope(scope: unknown): string[] | undefined {
    if (Array.isArray(scope)) {
      return scope.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    }

    if (typeof scope === 'string') {
      return scope
        .split(/[,\s]+/)
        .map(entry => entry.trim())
        .filter(Boolean)
    }

    return undefined
  }

  private decodeTokenLocally(token: string): IMSTokenValidation | null {
    try {
      const parts = token.split('.')
      if (parts.length < 2) {
        return null
      }

      const base64Url = parts[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const padding = '='.repeat((4 - (base64.length % 4)) % 4)
      const padded = `${base64}${padding}`

      if (typeof globalThis.atob !== 'function') {
        return null
      }

      const binary = globalThis.atob(padded)

      let jsonPayload: string
      if (typeof TextDecoder !== 'undefined') {
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i += 1) {
          bytes[i] = binary.charCodeAt(i)
        }
        jsonPayload = new TextDecoder('utf-8').decode(bytes)
      } else {
        jsonPayload = decodeURIComponent(
          Array.prototype.map
            .call(binary, (char: string) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
            .join('')
        )
      }

      const payload = JSON.parse(jsonPayload) as Record<string, unknown>

      return this.mapValidationResponse({ ...payload, valid: true })
    } catch (decodeError) {
      console.warn('Local token decode failed:', decodeError)
      return null
    }
  }

  private extractAxiosErrorDetails(error: unknown): Record<string, unknown> {
    if (!axios.isAxiosError(error)) {
      return {
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }

    return {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      requestConfig: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      },
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