/**
 * Adobe IMS (Identity Management System) Types
 * For authentication and authorization with Adobe services
 */

// ========================= IMS Authentication Types =========================

export interface IMSTokenResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in: number
  scope?: string
  user_id?: string
  client_id?: string
  state?: string
}

export interface IMSTokenValidation {
  valid: boolean
  user_id?: string
  client_id?: string
  scope?: string[]
  expires_at?: number
  token_type?: string
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export interface IMSConfig {
  clientId: string
  clientSecret?: string
  redirectUri: string
  scopes: string[]
  environment: 'production' | 'stage'
  baseUrl?: string
}

export interface IMSError {
  error: string
  error_description: string
  error_code?: number
}

// ========================= IMS Service Interface =========================

export interface IMSServiceInterface {
  authenticate(): Promise<IMSTokenResponse>
  refreshToken(refreshToken: string): Promise<IMSTokenResponse>
  validateToken(token: string): Promise<IMSTokenValidation>
  logout(): Promise<void>
}