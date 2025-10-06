import type {
  LumaImageGenerationRequest,
  LumaImageGenerationResponse,
  LumaImageGenerationResult,
  LumaImageModel,
  LumaAspectRatio,
  LumaImageReference,
  LumaCharacterReference,
  LumaModifyImageReference,
} from '../../types/luma'

export class LumaImageServiceError extends Error {
  constructor(
    message: string,
    public status?: number,
    public body?: unknown,
    public details?: string
  ) {
    super(message)
    this.name = 'LumaImageServiceError'
  }
}

export interface LumaImageServiceConfig {
  apiKey?: string
  baseUrl?: string
  requestTimeoutMs?: number
  pollIntervalMs?: number
  maxPollAttempts?: number
  pollTimeoutMs?: number
  defaultRequest?: Partial<LumaImageGenerationRequest>
}

export interface LumaImageGenerationOptions {
  signal?: AbortSignal
  filename?: string
}

export class LumaImageService {
  private apiKey: string
  private baseUrl: string
  private requestTimeoutMs: number
  private pollIntervalMs: number
  private maxPollAttempts: number
  private pollTimeoutMs: number
  private defaultRequest: Partial<LumaImageGenerationRequest>

  constructor(config: LumaImageServiceConfig = {}) {
    this.apiKey = config.apiKey || import.meta.env.VITE_LUMA_API_KEY || ''
    this.baseUrl = config.baseUrl || 'https://api.lumalabs.ai/dream-machine/v1'
    this.requestTimeoutMs = config.requestTimeoutMs || 60000
    this.pollIntervalMs = config.pollIntervalMs || 5000
    this.maxPollAttempts = config.maxPollAttempts || 120
    this.pollTimeoutMs = config.pollTimeoutMs || 600000
    this.defaultRequest = config.defaultRequest || {}

    if (!this.apiKey) {
      throw new LumaImageServiceError(
        'Luma API key is required. Set VITE_LUMA_API_KEY in environment or pass apiKey in config.'
      )
    }
  }

  /**
   * Generate an image from text prompt with optional references
   */
  async generateImage(
    request: LumaImageGenerationRequest,
    options?: LumaImageGenerationOptions
  ): Promise<LumaImageGenerationResult> {
    const mergedRequest = { ...this.defaultRequest, ...request }

    // Initiate generation
    const response = await this.fetch('/generations/image', {
      method: 'POST',
      body: JSON.stringify(mergedRequest),
      signal: options?.signal,
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new LumaImageServiceError(
        `Failed to create image generation: ${response.statusText}`,
        response.status,
        errorBody,
        `Request failed with status ${response.status}`
      )
    }

    const generation = (await response.json()) as LumaImageGenerationResponse

    // Poll until complete
    const completedGeneration = await this.pollGeneration(generation.id, options?.signal)

    // Download the image
    return await this.downloadImage(completedGeneration, options?.filename)
  }

  /**
   * Generate image with image references (up to 4)
   */
  async generateImageWithReference(
    prompt: string,
    imageReferences: LumaImageReference[],
    model?: LumaImageModel,
    aspectRatio?: LumaAspectRatio,
    options?: LumaImageGenerationOptions
  ): Promise<LumaImageGenerationResult> {
    return this.generateImage(
      {
        prompt,
        model,
        aspect_ratio: aspectRatio,
        image_ref: imageReferences,
      },
      options
    )
  }

  /**
   * Generate image with style reference
   */
  async generateImageWithStyle(
    prompt: string,
    styleReferences: LumaImageReference[],
    model?: LumaImageModel,
    aspectRatio?: LumaAspectRatio,
    options?: LumaImageGenerationOptions
  ): Promise<LumaImageGenerationResult> {
    return this.generateImage(
      {
        prompt,
        model,
        aspect_ratio: aspectRatio,
        style_ref: styleReferences,
      },
      options
    )
  }

  /**
   * Generate image with character reference (up to 4 identities, each with up to 4 images)
   */
  async generateImageWithCharacter(
    prompt: string,
    characterReference: LumaCharacterReference,
    model?: LumaImageModel,
    aspectRatio?: LumaAspectRatio,
    options?: LumaImageGenerationOptions
  ): Promise<LumaImageGenerationResult> {
    return this.generateImage(
      {
        prompt,
        model,
        aspect_ratio: aspectRatio,
        character_ref: characterReference,
      },
      options
    )
  }

  /**
   * Modify an existing image based on prompt
   * Note: Works well for objects/shapes. For colors, use lower weight (0.0-0.1)
   */
  async modifyImage(
    prompt: string,
    modifyReference: LumaModifyImageReference,
    model?: LumaImageModel,
    aspectRatio?: LumaAspectRatio,
    options?: LumaImageGenerationOptions
  ): Promise<LumaImageGenerationResult> {
    return this.generateImage(
      {
        prompt,
        model,
        aspect_ratio: aspectRatio,
        modify_image_ref: modifyReference,
      },
      options
    )
  }

  /**
   * Get a specific generation by ID
   */
  async getGeneration(id: string, signal?: AbortSignal): Promise<LumaImageGenerationResponse> {
    const response = await this.fetch(`/generations/${id}`, { signal })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new LumaImageServiceError(
        `Failed to get generation: ${response.statusText}`,
        response.status,
        errorBody
      )
    }

    return (await response.json()) as LumaImageGenerationResponse
  }

  /**
   * List all generations with pagination
   */
  async listGenerations(
    params?: { limit?: number; offset?: number },
    signal?: AbortSignal
  ): Promise<{ generations: LumaImageGenerationResponse[]; has_more: boolean }> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.offset) queryParams.set('offset', params.offset.toString())

    const url = `/generations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await this.fetch(url, { signal })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new LumaImageServiceError(
        `Failed to list generations: ${response.statusText}`,
        response.status,
        errorBody
      )
    }

    const data = (await response.json()) as {
      generations: LumaImageGenerationResponse[]
      has_more: boolean
    }

    // Filter to only image generations
    return {
      generations: data.generations.filter((g) => g.type === 'image'),
      has_more: data.has_more,
    }
  }

  /**
   * Delete a generation by ID
   */
  async deleteGeneration(id: string, signal?: AbortSignal): Promise<void> {
    const response = await this.fetch(`/generations/${id}`, {
      method: 'DELETE',
      signal,
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new LumaImageServiceError(
        `Failed to delete generation: ${response.statusText}`,
        response.status,
        errorBody
      )
    }
  }

  /**
   * Poll generation until it completes or fails
   */
  private async pollGeneration(
    id: string,
    signal?: AbortSignal
  ): Promise<LumaImageGenerationResponse> {
    const startTime = Date.now()
    let attempts = 0

    while (attempts < this.maxPollAttempts) {
      if (signal?.aborted) {
        throw new LumaImageServiceError('Request aborted', 499)
      }

      if (Date.now() - startTime > this.pollTimeoutMs) {
        throw new LumaImageServiceError(
          'Image generation timed out',
          408,
          undefined,
          `Exceeded ${this.pollTimeoutMs}ms timeout`
        )
      }

      const generation = await this.getGeneration(id, signal)

      if (generation.state === 'completed') {
        return generation
      }

      if (generation.state === 'failed') {
        throw new LumaImageServiceError(
          `Image generation failed: ${generation.failure_reason || 'Unknown error'}`,
          500,
          generation
        )
      }

      // Wait before next poll
      await this.sleep(this.pollIntervalMs, signal)
      attempts++
    }

    throw new LumaImageServiceError(
      'Max polling attempts exceeded',
      504,
      undefined,
      `Generation did not complete after ${this.maxPollAttempts} attempts`
    )
  }

  /**
   * Download the generated image
   */
  private async downloadImage(
    generation: LumaImageGenerationResponse,
    customFilename?: string
  ): Promise<LumaImageGenerationResult> {
    const imageUrl = generation.assets?.image

    if (!imageUrl) {
      throw new LumaImageServiceError(
        'No image URL in completed generation',
        500,
        generation,
        'Generation completed but assets.image is missing'
      )
    }

    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new LumaImageServiceError(
        `Failed to download image: ${response.statusText}`,
        response.status
      )
    }

    const blob = await response.blob()
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const extension = contentType.split('/')[1] || 'jpg'
    const filename =
      customFilename || `${generation.model}-${generation.id}-${Date.now()}.${extension}`

    return {
      blob,
      contentType,
      filename,
      generation,
      metadata: {
        id: generation.id,
        state: generation.state,
        createdAt: generation.created_at,
        imageUrl,
        model: generation.model,
        prompt: generation.request?.prompt,
      },
    }
  }

  /**
   * Sleep with abort support
   */
  private sleep(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new LumaImageServiceError('Request aborted', 499))
        return
      }

      const timeout = setTimeout(resolve, ms)

      const abortHandler = () => {
        clearTimeout(timeout)
        reject(new LumaImageServiceError('Request aborted', 499))
      }

      signal?.addEventListener('abort', abortHandler, { once: true })
    })
  }

  /**
   * Fetch wrapper with timeout and auth
   */
  private async fetch(
    path: string,
    options: RequestInit & { signal?: AbortSignal } = {}
  ): Promise<Response> {
    const url = `${this.baseUrl}${path}`
    const controller = new AbortController()
    const signal = options.signal

    // Combine timeout with user's abort signal
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeoutMs)

    const abortHandler = () => controller.abort()
    signal?.addEventListener('abort', abortHandler)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          ...options.headers,
        },
      })

      return response
    } catch (error) {
      if (controller.signal.aborted) {
        if (signal?.aborted) {
          throw new LumaImageServiceError('Request aborted by user', 499)
        }
        throw new LumaImageServiceError('Request timeout', 408)
      }
      throw error
    } finally {
      clearTimeout(timeoutId)
      signal?.removeEventListener('abort', abortHandler)
    }
  }
}
