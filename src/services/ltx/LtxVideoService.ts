/**
 * LTX Video API Service
 * Wraps the https://api.ltx.video/v1/text-to-video endpoint.
 */

import type {
  LtxTextToVideoRequest,
  LtxVideoGenerationMetadata,
  LtxVideoGenerationOptions,
  LtxVideoGenerationResult,
  LtxApiErrorPayload,
} from '../../types/ltx'

export interface LtxVideoServiceConfig {
  /** API key used to authenticate requests against LTX */
  apiKey?: string
  /** Optional override for the API base URL */
  baseUrl?: string
  /** Default request payload values merged into every call */
  defaultRequest?: Partial<LtxTextToVideoRequest>
  /** Request timeout in milliseconds */
  timeout?: number
}

export class LtxVideoServiceError extends Error {
  public readonly status: number
  public readonly details?: unknown
  public readonly body?: string | LtxApiErrorPayload

  constructor(message: string, status: number, details?: unknown, body?: string | LtxApiErrorPayload) {
    super(message)
    this.name = 'LtxVideoServiceError'
    this.status = status
    this.details = details
    this.body = body
  }
}

export class LtxVideoService {
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly defaultRequest: Partial<LtxTextToVideoRequest>
  private readonly timeout?: number

  constructor(config: LtxVideoServiceConfig = {}) {
    const fallbackApiKey = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_LTX_API_KEY : undefined

    this.apiKey = config.apiKey || fallbackApiKey || ''
    this.baseUrl = (config.baseUrl || 'https://api.ltx.video/v1').replace(/\/$/, '')
    this.defaultRequest = config.defaultRequest ?? {}
    this.timeout = config.timeout
  }

  /** Ensure the API key is configured */
  validateConfig(): boolean {
    return Boolean(this.apiKey)
  }

  /**
   * Generate a video from a text prompt. Returns the binary response as a Blob
   * along with metadata describing the request.
   */
  async generateVideo(
    request: LtxTextToVideoRequest,
    options: LtxVideoGenerationOptions = {}
  ): Promise<LtxVideoGenerationResult> {
    if (!this.validateConfig()) {
      throw new LtxVideoServiceError('LTX Video API key is missing', 401)
    }

    const payload: LtxTextToVideoRequest = {
      ...this.defaultRequest,
      ...request,
    }

    const url = `${this.baseUrl}/text-to-video`
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'video/mp4',
    }

    const controller = new AbortController()
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let signal: AbortSignal | undefined = options.signal

    if (!signal && this.timeout && typeof AbortController !== 'undefined') {
      timeoutId = setTimeout(() => controller.abort(), this.timeout)
      signal = controller.signal
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal,
      })

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      const contentType = response.headers.get('content-type') || 'application/octet-stream'

      if (!response.ok) {
        const errorBody = await this.parseErrorBody(response, contentType)
        const message = this.extractErrorMessage(errorBody) || `LTX request failed with status ${response.status}`
        throw new LtxVideoServiceError(message, response.status, undefined, errorBody)
      }

      const blob = await response.blob()
      const filename = options.filename || this.buildFilename(payload)
      const metadata: LtxVideoGenerationMetadata = {
        requestId: response.headers.get('x-request-id') || this.generateRequestId(),
        prompt: payload.prompt,
        durationSeconds: payload.duration_seconds,
        fps: payload.fps,
        resolution: {
          width: payload.width,
          height: payload.height,
        },
        seed: payload.seed,
        receivedAt: new Date(),
      }

      return {
        blob,
        contentType,
        filename,
        metadata,
      }
    } catch (error) {
      if (error instanceof LtxVideoServiceError) {
        throw error
      }

      if ((error as Error).name === 'AbortError') {
        throw new LtxVideoServiceError('LTX request aborted', 408)
      }

      throw new LtxVideoServiceError(
        (error as Error)?.message || 'Unexpected error calling LTX API',
        500,
        error
      )
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }

  private async parseErrorBody(response: Response, contentType: string): Promise<string | LtxApiErrorPayload | undefined> {
    try {
      if (contentType.includes('application/json')) {
        return await response.json()
      }

      const text = await response.text()
      return text || undefined
    } catch (parseError) {
      console.warn('Failed to parse LTX error body:', parseError)
      return undefined
    }
  }

  private extractErrorMessage(body?: string | LtxApiErrorPayload): string | undefined {
    if (!body) return undefined
    if (typeof body === 'string') return body

    return body.message || body.error || (typeof body.code === 'string' ? body.code : undefined)
  }

  private buildFilename(request: LtxTextToVideoRequest): string {
    const safePrompt = request.prompt
      .replace(/[^a-z0-9-_]+/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const base = safePrompt ? safePrompt.slice(0, 50) : 'ltx-video'

    return `${base || 'ltx-video'}-${timestamp}.mp4`
  }

  private generateRequestId(): string {
    const globalCrypto = typeof globalThis !== 'undefined' ? (globalThis as { crypto?: Crypto }).crypto : undefined

    if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
      return globalCrypto.randomUUID()
    }

    return `ltx_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  }
}