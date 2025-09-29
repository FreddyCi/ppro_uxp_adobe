/**
 * Luma Labs Dream Machine video generation service.
 * Implements the core flow described in docs/lumalabsai.yaml
 * to create a generation, poll for completion, and download
 * the resulting video asset.
 */

import type {
  LumaGenerationRequest,
  LumaGenerationResponse,
  LumaVideoGenerationOptions,
  LumaVideoGenerationResult,
  LumaVideoModel,
  LumaVideoGenerationMetadata,
  LumaGenerationState,
} from '../../types/luma'

export interface LumaVideoServiceConfig {
  /** API key for Dream Machine */
  apiKey?: string
  /** Override the default API base URL */
  baseUrl?: string
  /** Default request payload values merged into every call */
  defaultRequest?: Partial<LumaGenerationRequest>
  /** Timeout (ms) for individual HTTP requests */
  requestTimeoutMs?: number
  /** Interval (ms) between polling attempts */
  pollIntervalMs?: number
  /** Maximum number of polling attempts */
  maxPollAttempts?: number
  /** Optional overall polling timeout (ms). Defaults to interval * attempts. */
  pollTimeoutMs?: number
}

export class LumaVideoServiceError extends Error {
  public readonly status: number
  public readonly details?: unknown
  public readonly body?: unknown

  constructor(message: string, status: number, details?: unknown, body?: unknown, cause?: unknown) {
    super(message)
    this.name = 'LumaVideoServiceError'
    this.status = status
    this.details = details
    this.body = body
    if (cause) {
      this.cause = cause
    }
  }
}

interface WaitForCompletionResult {
  generation: LumaGenerationResponse
  attempts: number
  elapsedMs: number
}

interface ParsedErrorBody {
  message: string
  body?: unknown
}

export class LumaVideoService {
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly defaultRequest: Partial<LumaGenerationRequest>
  private readonly requestTimeoutMs: number
  private readonly pollIntervalMs: number
  private readonly maxPollAttempts: number
  private readonly pollTimeoutMs?: number

  constructor(config: LumaVideoServiceConfig = {}) {
    const fallbackApiKey = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_LUMA_API_KEY : undefined

    this.apiKey = config.apiKey || fallbackApiKey || ''
    this.baseUrl = (config.baseUrl || 'https://api.lumalabs.ai/dream-machine/v1').replace(/\/$/, '')
    this.defaultRequest = config.defaultRequest ?? {}
    this.requestTimeoutMs = config.requestTimeoutMs ?? 60_000
    this.pollIntervalMs = config.pollIntervalMs ?? 5_000
    this.maxPollAttempts = config.maxPollAttempts ?? 120
    this.pollTimeoutMs = config.pollTimeoutMs ?? (this.maxPollAttempts > 0 ? this.pollIntervalMs * this.maxPollAttempts : undefined)
  }

  /** Ensure configuration is usable */
  validateConfig(): boolean {
    return Boolean(this.apiKey)
  }

  /**
   * Complete Dream Machine flow for a single video generation request.
   */
  async generateVideo(
    request: LumaGenerationRequest,
    options: LumaVideoGenerationOptions = {}
  ): Promise<LumaVideoGenerationResult> {
    if (!this.validateConfig()) {
      throw new LumaVideoServiceError('Luma Dream Machine API key is missing', 401)
    }

    const payload: LumaGenerationRequest = {
      generation_type: 'video',
      ...this.defaultRequest,
      ...request,
    }

    if (!payload.model) {
      throw new LumaVideoServiceError('Luma Dream Machine model is required', 400)
    }

    const startedAt = Date.now()
    const creation = await this.createGeneration(payload, options.signal)
    const waited = await this.waitForCompletion(creation.id, options.signal)

    const videoUrl = waited.generation.assets?.video
    if (!videoUrl) {
      throw new LumaVideoServiceError('Luma Dream Machine generation did not include a video asset', 502, waited.generation)
    }

    const download = await this.downloadVideoAsset(videoUrl, options.signal)
    const filename = options.filename ?? this.buildFilename(payload.prompt, waited.generation, download.contentType)

    const metadata: LumaVideoGenerationMetadata = {
      id: waited.generation.id,
      state: waited.generation.state as LumaGenerationState,
      prompt: payload.prompt ?? this.extractPrompt(waited.generation),
      model: waited.generation.model ?? payload.model,
      aspectRatio: this.extractString(waited.generation.request, 'aspect_ratio') ?? payload.aspect_ratio,
      duration: this.extractString(waited.generation.request, 'duration') ?? payload.duration,
      createdAt: waited.generation.created_at,
      completedAt: new Date().toISOString(),
      failureReason: waited.generation.failure_reason ?? null,
      request: waited.generation.request ?? payload,
      pollingAttempts: waited.attempts,
      pollingIntervalMs: this.pollIntervalMs,
      totalElapsedMs: Date.now() - startedAt,
    }

    return {
      blob: download.blob,
      contentType: download.contentType,
      filename,
      generation: waited.generation,
      metadata,
    }
  }

  private async createGeneration(payload: LumaGenerationRequest, signal?: AbortSignal): Promise<LumaGenerationResponse> {
    return this.request<LumaGenerationResponse>(
      '/generations/video',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      signal
    )
  }

  private async getGeneration(id: string, signal?: AbortSignal): Promise<LumaGenerationResponse> {
    const encodedId = encodeURIComponent(id)
    return this.request<LumaGenerationResponse>(`/generations/${encodedId}`, { method: 'GET' }, signal)
  }

  private async waitForCompletion(id: string, signal?: AbortSignal): Promise<WaitForCompletionResult> {
    const startTime = Date.now()

    for (let attempt = 1; attempt <= this.maxPollAttempts; attempt++) {
      if (attempt > 1) {
        await this.delay(this.pollIntervalMs, signal)
      }

      const generation = await this.getGeneration(id, signal)

      if (generation.state === 'completed') {
        return {
          generation,
          attempts: attempt,
          elapsedMs: Date.now() - startTime,
        }
      }

      if (generation.state === 'failed') {
        throw new LumaVideoServiceError(
          generation.failure_reason || 'Luma Dream Machine generation failed',
          500,
          generation
        )
      }

      if (this.pollTimeoutMs && Date.now() - startTime > this.pollTimeoutMs) {
        throw new LumaVideoServiceError('Luma Dream Machine generation timed out', 408, generation)
      }
    }

    throw new LumaVideoServiceError('Luma Dream Machine polling exceeded maximum attempts', 504)
  }

  private async downloadVideoAsset(url: string, signal?: AbortSignal): Promise<{ blob: Blob; contentType: string }> {
    const { controller, cleanup, timeoutId } = this.createAbortController(signal)

    let response: Response
    try {
      response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      })
    } catch (error) {
      cleanup()
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new LumaVideoServiceError('Luma Dream Machine video download aborted', 499, undefined, undefined, error)
      }
      throw new LumaVideoServiceError(
        error instanceof Error ? error.message : 'Failed to download Luma Dream Machine asset',
        500,
        undefined,
        undefined,
        error
      )
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }

    cleanup()

    if (!response.ok) {
      throw new LumaVideoServiceError(
        `Failed to download Luma Dream Machine asset (HTTP ${response.status})`,
        response.status
      )
    }

    const blob = await response.blob()
    const contentType = response.headers.get('content-type') || 'video/mp4'

    return { blob, contentType }
  }

  private async request<T>(path: string, init: RequestInit, signal?: AbortSignal): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const mergedHeaders = this.mergeHeaders(init.headers)
    const { controller, cleanup, timeoutId } = this.createAbortController(signal)

    let response: Response

    try {
      response = await fetch(url, {
        ...init,
        headers: mergedHeaders,
        signal: controller.signal,
      })
    } catch (error) {
      cleanup()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new LumaVideoServiceError('Luma Dream Machine request aborted', 499, undefined, undefined, error)
      }

      throw new LumaVideoServiceError(
        error instanceof Error ? error.message : 'Unexpected Luma Dream Machine error',
        500,
        undefined,
        undefined,
        error
      )
    }

    cleanup()
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    if (!response.ok) {
      const parsed = await this.parseErrorBody(response)
      throw new LumaVideoServiceError(parsed.message, response.status, undefined, parsed.body)
    }

    // Handle empty responses (e.g., 204)
    if (response.status === 204) {
      return undefined as T
    }

    const text = await response.text()
    if (!text) {
      return undefined as T
    }

    try {
      return JSON.parse(text) as T
    } catch (error) {
      throw new LumaVideoServiceError(
        'Failed to parse Luma Dream Machine response body as JSON',
        500,
        undefined,
        text,
        error
      )
    }
  }

  private mergeHeaders(extra?: HeadersInit): Headers {
    const base = new Headers({
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json',
    })

    if (extra) {
      const extras = new Headers(extra as HeadersInit)
      extras.forEach((value, key) => {
        base.set(key, value)
      })
    }

    if (!base.has('Content-Type') && base.get('Accept') === 'application/json') {
      // leave content-type unset for GET requests
    }

    return base
  }

  private createAbortController(signal?: AbortSignal): {
    controller: AbortController
    cleanup: () => void
    timeoutId?: ReturnType<typeof setTimeout>
  } {
    const controller = new AbortController()
    const abortHandlers: Array<{ signal: AbortSignal; handler: () => void }> = []

    if (signal) {
      if (signal.aborted) {
        controller.abort(signal.reason)
      } else {
        const handler = () => controller.abort(signal.reason)
        signal.addEventListener('abort', handler, { once: true })
        abortHandlers.push({ signal, handler })
      }
    }

    const timeoutId = this.requestTimeoutMs
      ? setTimeout(() => {
          controller.abort(new DOMException('Luma Dream Machine request timed out', 'TimeoutError'))
        }, this.requestTimeoutMs)
      : undefined

    const cleanup = () => {
      abortHandlers.forEach(({ signal: s, handler }) => {
        s.removeEventListener('abort', handler)
      })
    }

    return { controller, cleanup, timeoutId }
  }

  private async parseErrorBody(response: Response): Promise<ParsedErrorBody> {
    const contentType = response.headers.get('content-type') || ''

    try {
      if (contentType.includes('application/json')) {
        const body = await response.json()
        if (body && typeof body === 'object' && 'detail' in body && typeof (body as any).detail === 'string') {
          return { message: (body as any).detail, body }
        }
        return { message: `Luma Dream Machine request failed (HTTP ${response.status})`, body }
      }

      const text = await response.text()
      if (text) {
        return { message: text, body: text }
      }
    } catch (error) {
      return { message: `Luma Dream Machine request failed (HTTP ${response.status})`, body: undefined }
    }

    return { message: `Luma Dream Machine request failed (HTTP ${response.status})`, body: undefined }
  }

  private async delay(ms: number, signal?: AbortSignal): Promise<void> {
    if (ms <= 0) return
    await new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        cleanup()
        resolve()
      }, ms)

      const cleanup = () => {
        if (signal) {
          signal.removeEventListener('abort', onAbort)
        }
        clearTimeout(timeoutId)
      }

      const onAbort = () => {
        cleanup()
        reject(new DOMException('Operation aborted', 'AbortError'))
      }

      if (signal) {
        if (signal.aborted) {
          cleanup()
          reject(new DOMException('Operation aborted', 'AbortError'))
        } else {
          signal.addEventListener('abort', onAbort, { once: true })
        }
      }
    })
  }

  private buildFilename(prompt: string | undefined, generation: LumaGenerationResponse, contentType: string): string {
    const extension = this.deriveExtension(contentType)
    const basePrompt = (prompt || this.extractPrompt(generation) || 'luma-video')
      .replace(/[^a-z0-9-_]+/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const idFragment = generation.id.slice(0, 8)

    return `${basePrompt || 'luma-video'}-${idFragment}-${timestamp}.${extension}`
  }

  private deriveExtension(contentType: string): string {
    if (contentType.includes('quicktime')) return 'mov'
    if (contentType.includes('webm')) return 'webm'
    if (contentType.includes('gif')) return 'gif'
    return 'mp4'
  }

  private extractPrompt(generation: LumaGenerationResponse): string | undefined {
    const request = generation.request
    if (request && typeof request === 'object' && 'prompt' in request) {
      const value = (request as Record<string, unknown>).prompt
      if (typeof value === 'string') {
        return value
      }
    }
    return undefined
  }

  private extractString(source: Record<string, unknown> | undefined | null, key: string): string | undefined {
    if (!source || typeof source !== 'object') {
      return undefined
    }

    const value = source[key]
    return typeof value === 'string' ? value : undefined
  }
}
