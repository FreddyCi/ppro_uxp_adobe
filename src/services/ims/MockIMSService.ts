/**
 * Mock IMS Service for Development
 * Provides fake authentication for UI testing without real Adobe credentials
 */

import type { IMSTokenValidation } from '../../types/index.js'
import type { IMSServiceConfig, IIMSService } from './IMSService'

interface TokenCache {
  accessToken: string
  expiresAt: Date
}

export class MockIMSService implements IIMSService {
  private config: IMSServiceConfig
  private tokenCache: TokenCache | null = null

  constructor(config: IMSServiceConfig) {
    this.config = config
  }

  /**
   * Mock authentication - always succeeds in development
   */
  async getAccessToken(): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Return cached token if still valid
    if (this.tokenCache && this.isTokenValid()) {
      return this.tokenCache.accessToken
    }

    // Generate a fake token
    const fakeToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Cache for 1 hour
    this.tokenCache = {
      accessToken: fakeToken,
      expiresAt: new Date(Date.now() + (3600 * 1000))
    }

    console.warn('🔓 Using mock IMS authentication for development')
    return this.tokenCache.accessToken
  }

  /**
   * Mock token validation - always returns valid
   */
  async validateToken(token: string): Promise<IMSTokenValidation> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200))

    return {
      valid: token.startsWith('mock_token_'),
      user_id: 'mock_user_123',
      client_id: this.config.clientId,
      scope: Array.isArray(this.config.scopes) ? this.config.scopes : [this.config.scopes],
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'Bearer'
    }
  }

  /**
   * Mock refresh - generates new fake token
   */
  async refreshToken(): Promise<string> {
    this.tokenCache = null
    return this.getAccessToken()
  }

  /**
   * Clear token cache
   */
  clearTokenCache(): void {
    this.tokenCache = null
  }

  /**
   * Check if cached token is still valid
   */
  private isTokenValid(): boolean {
    if (!this.tokenCache) return false
    return new Date() < this.tokenCache.expiresAt
  }

  /**
   * Get token info for debugging
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

export default MockIMSService