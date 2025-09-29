/**
 * Google Gemini API Service
 * Implements image correction workflow with comprehensive error handling
 */

import type {
  CorrectionParams,
  CorrectedImage,
  CorrectionStatus,
  GeminiConfig,
  CorrectionMetadata,
  BeforeAfterComparison,
} from '../../types/gemini'
import type { IMSService } from '../ims/IMSService'

/**
 * Service response wrapper for consistent error handling
 */
export interface GeminiServiceResponse<T> {
  success: boolean
  data?: T
  error?: GeminiServiceError
  rateLimitInfo?: RateLimitInfo
}

export interface GeminiServiceError {
  code: string
  message: string
  type: 'validation' | 'processing' | 'api' | 'network' | 'authentication'
  retryable: boolean
  details?: unknown
  timestamp: Date
}

export interface RateLimitInfo {
  limit: number
  remaining: number
  resetTime: Date
  retryAfter?: number
}

/**
 * GeminiService handles Google Gemini image correction API interactions
 * Implements correction workflow: upload -> correct -> download
 */
export class GeminiService {
  private readonly config: GeminiConfig
  private readonly imsService: IMSService
  private activeCorrections = new Map<string, CorrectionStatus>()
  private rateLimitInfo: RateLimitInfo | null = null

  constructor(imsService: IMSService, config: Partial<GeminiConfig> = {}) {
    this.imsService = imsService
    this.config = {
      apiUrl:
        import.meta.env.VITE_GEMINI_API_URL ||
        'https://generativelanguage.googleapis.com',
      apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
      model:
        import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-image-preview',
      timeout: 60000, // 60 seconds for image processing
      maxRetries: 3,
      defaultQuality: 0.8,
      ...config,
    }
  }

  /**
   * Correct an image with specified parameters using Gemini's image editing capabilities
   */
  async correctImage(
    imageBlob: Blob,
    corrections: CorrectionParams
  ): Promise<GeminiServiceResponse<CorrectedImage>> {
    try {
      // Validate inputs
      const validationError = this.validateCorrectionRequest(
        imageBlob,
        corrections
      )
      if (validationError) {
        return {
          success: false,
          error: validationError,
        }
      }

      // Convert image to base64
      const imageBase64 = await this.blobToBase64(imageBlob)

      // Create correction prompt based on parameters
      const correctionPrompt = this.createCorrectionPrompt(corrections)

      // Make request to Gemini API
      const response = await this.makeGeminiRequest(
        imageBase64,
        imageBlob.type,
        correctionPrompt
      )

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error,
        }
      }

      // Transform response to CorrectedImage format
      const correctedImage = await this.transformToCorrectImage(
        response.data,
        corrections
      )

      return {
        success: true,
        data: correctedImage,
        rateLimitInfo: this.rateLimitInfo || undefined,
      }
    } catch (error) {
      console.error('Error in correctImage:', error)
      return {
        success: false,
        error: this.createError(
          'CORRECTION_FAILED',
          'Image correction failed',
          'processing',
          false,
          error
        ),
      }
    }
  }

  /**
   * Get correction status by ID
   * Note: Gemini API is synchronous, so this is mainly for compatibility
   */
  async getCorrectionStatus(
    id: string
  ): Promise<GeminiServiceResponse<CorrectionStatus>> {
    // Since Gemini API is synchronous, we can only return status for active corrections
    const activeCorrection = this.activeCorrections.get(id)

    if (!activeCorrection) {
      return {
        success: false,
        error: this.createError(
          'CORRECTION_NOT_FOUND',
          'Correction not found',
          'validation',
          false
        ),
      }
    }

    return {
      success: true,
      data: activeCorrection,
      rateLimitInfo: this.rateLimitInfo || undefined,
    }
  }

  /**
   * Download corrected image as blob
   */
  async downloadImage(imageUrl: string): Promise<GeminiServiceResponse<Blob>> {
    try {
      const response = await this.makeRequest(
        imageUrl,
        {
          method: 'GET',
        },
        true
      ) // isExternalUrl = true

      if (!response.ok) {
        return {
          success: false,
          error: this.createError(
            'DOWNLOAD_FAILED',
            `Failed to download image: ${response.status}`,
            'network',
            true
          ),
        }
      }

      const imageBlob = await response.blob()

      return {
        success: true,
        data: imageBlob,
      }
    } catch (error) {
      console.error('Error downloading image:', error)
      return {
        success: false,
        error: this.createError(
          'DOWNLOAD_ERROR',
          'Error downloading corrected image',
          'network',
          true,
          error
        ),
      }
    }
  }

  /**
   * Get rate limit information
   */
  getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimitInfo
  }

  /**
   * Get active corrections
   */
  getActiveCorrections(): Map<string, CorrectionStatus> {
    return new Map(this.activeCorrections)
  }

  /**
   * Cancel active correction
   */
  async cancelCorrection(
    correctionId: string
  ): Promise<GeminiServiceResponse<boolean>> {
    try {
      const accessToken = await this.imsService.getAccessToken()

      const response = await this.makeRequest(
        `/v1/image/cancel/${correctionId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const error = await this.handleErrorResponse(response)
        return { success: false, error }
      }

      // Remove from active corrections
      this.activeCorrections.delete(correctionId)

      return {
        success: true,
        data: true,
      }
    } catch (error) {
      console.error('Error canceling correction:', error)
      return {
        success: false,
        error: this.createError(
          'CANCEL_FAILED',
          'Failed to cancel correction',
          'api',
          true,
          error
        ),
      }
    }
  }

  /**
   * Create before/after comparison
   */
  createComparison(
    original: string,
    corrected: string,
    corrections: CorrectionParams,
    metadata: CorrectionMetadata
  ): BeforeAfterComparison {
    return {
      id: `comparison_${Date.now()}`,
      beforeUrl: original,
      afterUrl: corrected,
      beforeSize: metadata.originalSize,
      afterSize: metadata.correctedSize,
      corrections,
      metadata,
      accepted: false,
    }
  }

  // Private utility methods

  /**
   * Convert Blob to base64 string
   */
  private async blobToBase64(blob: Blob): Promise<string> {
    try {
      const arrayBuffer = await blob.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      const chunkSize = 0x8000
      let binary = ''

      for (let offset = 0; offset < bytes.length; offset += chunkSize) {
        const chunk = bytes.subarray(offset, offset + chunkSize)
        binary += String.fromCharCode(...chunk)
      }

      return btoa(binary)
    } catch (error) {
      console.error('Failed to convert blob to base64:', error)
      throw this.createError(
        'BLOB_CONVERSION_FAILED',
        'Unable to prepare image for Gemini API',
        'processing',
        false,
        error
      )
    }
  }

  /**
   * Create correction prompt based on correction parameters
   */
  private createCorrectionPrompt(corrections: CorrectionParams): string {
    // If custom prompt is provided, use it directly
    if (corrections.customPrompt) {
      return corrections.customPrompt
    }

    const correctionTypes = []

    if (corrections.lineCleanup) {
      correctionTypes.push('clean up any rough or jagged lines')
    }
    if (corrections.colorCorrection) {
      correctionTypes.push('improve color balance and saturation')
    }
    if (corrections.perspectiveAdjustment) {
      correctionTypes.push('correct perspective distortion')
    }
    if (corrections.artifactRemoval) {
      correctionTypes.push('remove visual artifacts and noise')
    }
    if (corrections.enhanceDetails) {
      correctionTypes.push('enhance fine details and sharpness')
    }
    if (corrections.noiseReduction) {
      correctionTypes.push('reduce image noise')
    }
    if (corrections.sharpenEdges) {
      correctionTypes.push('sharpen edges for better definition')
    }

    let prompt = `Please improve this image by applying the following corrections: ${correctionTypes.join(', ')}.`

    // Add specific adjustment values if provided
    if (corrections.exposureCorrection !== undefined) {
      prompt += ` Adjust exposure by ${corrections.exposureCorrection > 0 ? 'increasing' : 'decreasing'} ${Math.abs(corrections.exposureCorrection)} stops.`
    }
    if (corrections.contrastAdjustment !== undefined) {
      prompt += ` ${corrections.contrastAdjustment > 0 ? 'Increase' : 'Decrease'} contrast by ${Math.abs(corrections.contrastAdjustment * 100)}%.`
    }
    if (
      corrections.saturationBoost !== undefined &&
      corrections.saturationBoost !== 1.0
    ) {
      prompt += ` Adjust saturation to ${corrections.saturationBoost * 100}% of original.`
    }
    if (corrections.warmthAdjustment !== undefined) {
      prompt += ` Make the image ${corrections.warmthAdjustment > 0 ? 'warmer' : 'cooler'} by ${Math.abs(corrections.warmthAdjustment * 100)}%.`
    }

    prompt +=
      ' Maintain the original composition and subject matter while improving image quality.'

    return prompt
  }

  /**
   * Make request to Gemini API
   */
  private async makeGeminiRequest(
    imageBase64: string,
    mimeType: string,
    prompt: string
  ): Promise<GeminiServiceResponse<{ data: string }>> {
    try {
      const endpoint = `/v1beta/models/${this.config.model}:generateContent`

      const requestBody = {
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: imageBase64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
      }

      const response = await this.makeRequest(endpoint, {
        method: 'POST',
        headers: {
          'x-goog-api-key': this.config.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const error = await this.handleErrorResponse(response)
        return { success: false, error }
      }

      const responseData = await response.json()

      // Extract base64 image data from response
      const candidate = responseData.candidates?.[0]
      const part = candidate?.content?.parts?.[0]

      if (!part?.inlineData?.data) {
        return {
          success: false,
          error: this.createError(
            'NO_IMAGE_DATA',
            'No image data in response',
            'api',
            false
          ),
        }
      }

      return {
        success: true,
        data: { data: part.inlineData.data },
        rateLimitInfo: this.rateLimitInfo || undefined,
      }
    } catch (error) {
      console.error('Error making Gemini request:', error)
      return {
        success: false,
        error: this.createError(
          'REQUEST_FAILED',
          'Failed to make Gemini API request',
          'network',
          true,
          error
        ),
      }
    }
  }

  /**
   * Transform Gemini response to CorrectedImage with memory-based storage
   */
  private async transformToCorrectImage(
    responseData: { data: string },
    corrections: CorrectionParams
  ): Promise<CorrectedImage> {
    // Convert base64 to blob for memory storage
    const base64Data = responseData.data
    const mimeType = 'image/png' // Gemini typically returns PNG
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: mimeType })

    // Create memory-based blob URL for the corrected image
    const blobUrl = URL.createObjectURL(blob)
    const imageId = crypto.randomUUID()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `gemini-corrected-${timestamp}.png`

    console.warn(
      '📁 Gemini: Created memory-based blob URL for corrected image',
      {
        id: imageId,
        filename: filename,
        size: blob.size,
        blobUrl: blobUrl,
        location: 'memory',
      }
    )

    const correctedImage: CorrectedImage = {
      id: imageId,
      originalUrl: '', // Will be set by calling code
      correctedUrl: blobUrl, // Use blob URL for immediate display
      thumbnailUrl: blobUrl, // Use same URL for thumbnail
      corrections,
      metadata: {
        corrections,
        originalSize: { width: 0, height: 0, aspectRatio: 1 }, // Will be updated by calling code
        correctedSize: { width: 0, height: 0, aspectRatio: 1 }, // Could be extracted from image
        model: this.config.model,
        version: 'v1beta',
        processingTime: 0, // Not available from Gemini API
        timestamp: new Date(),
        operationsApplied: Object.keys(corrections).filter(
          key => corrections[key as keyof CorrectionParams]
        ),
        resourceUsage: {
          computeTime: 0,
          memoryUsed: 0,
        },
      },
      timestamp: new Date(),
      blobUrl: blobUrl, // Store blob URL for persistence and download
    }

    return correctedImage
  }

  /**
   * Convert base64 string back to Blob
   */
  private validateCorrectionRequest(
    imageBlob: Blob,
    corrections: CorrectionParams
  ): GeminiServiceError | null {
    if (!imageBlob || imageBlob.size === 0) {
      return this.createError(
        'INVALID_IMAGE',
        'Image blob is required and cannot be empty',
        'validation',
        false
      )
    }

    if (imageBlob.size > 10 * 1024 * 1024) {
      // 10MB limit
      return this.createError(
        'IMAGE_TOO_LARGE',
        'Image size exceeds 10MB limit',
        'validation',
        false
      )
    }

    if (!imageBlob.type.startsWith('image/')) {
      return this.createError(
        'INVALID_IMAGE_TYPE',
        'File must be an image',
        'validation',
        false
      )
    }

    if (!corrections || Object.keys(corrections).length === 0) {
      return this.createError(
        'NO_CORRECTIONS',
        'At least one correction parameter must be specified',
        'validation',
        false
      )
    }

    return null
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit,
    isExternalUrl: boolean = false
  ): Promise<Response> {
    const url = isExternalUrl ? endpoint : `${this.config.apiUrl}${endpoint}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })

      // Parse rate limit headers
      this.updateRateLimitInfo(response)

      return response
    } finally {
      clearTimeout(timeoutId)
    }
  }

  private updateRateLimitInfo(response: Response): void {
    const limit = response.headers.get('X-RateLimit-Limit')
    const remaining = response.headers.get('X-RateLimit-Remaining')
    const reset = response.headers.get('X-RateLimit-Reset')
    const retryAfter = response.headers.get('Retry-After')

    if (limit && remaining && reset) {
      this.rateLimitInfo = {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        resetTime: new Date(parseInt(reset) * 1000),
        retryAfter: retryAfter ? parseInt(retryAfter) : undefined,
      }
    }
  }

  private async handleErrorResponse(
    response: Response
  ): Promise<GeminiServiceError> {
    try {
      const errorData = await response.json()

      if (response.status === 429) {
        return this.createError(
          'RATE_LIMIT_EXCEEDED',
          'Rate limit exceeded',
          'api',
          true,
          errorData
        )
      }

      if (response.status === 401) {
        return this.createError(
          'AUTHENTICATION_FAILED',
          'Authentication failed',
          'authentication',
          true,
          errorData
        )
      }

      if (response.status >= 500) {
        return this.createError(
          'SERVER_ERROR',
          'Server error occurred',
          'api',
          true,
          errorData
        )
      }

      return this.createError(
        errorData.code || 'API_ERROR',
        errorData.message || 'API request failed',
        'api',
        response.status >= 500,
        errorData
      )
    } catch {
      return this.createError(
        'PARSE_ERROR',
        `HTTP ${response.status}: ${response.statusText}`,
        'api',
        response.status >= 500
      )
    }
  }

  private createError(
    code: string,
    message: string,
    type: 'validation' | 'processing' | 'api' | 'network' | 'authentication',
    retryable: boolean,
    details?: unknown
  ): GeminiServiceError {
    return {
      code,
      message,
      type,
      retryable,
      details,
      timestamp: new Date(),
    }
  }
}

/**
 * Factory function to create GeminiService instance
 */
export function createGeminiService(
  imsService: IMSService,
  config?: Partial<GeminiConfig>
): GeminiService {
  return new GeminiService(imsService, config)
}
