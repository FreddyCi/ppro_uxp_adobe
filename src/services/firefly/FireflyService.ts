/**
 * Adobe Firefly API Service
 * Implements async image generation workflow with comprehensive error handling
 */

import type {
  FireflyGenerationRequest,
  FireflyGenerationJob,
  GenerationResult,
  AsyncAcceptResponseV3,
  AsyncTaskResponseV3,
  OutputImageV3,
  FireflyServiceConfig,
  FireflyServiceError,
  FireflyServiceResponse,
  RateLimitInfo,
  GenerateImagesRequestV3
} from '../../types/firefly'
import type { IIMSService } from '../ims/IMSService'

/**
 * FireflyService handles Adobe Firefly v3 API interactions
 * Implements async job workflow: submit -> poll -> download
 */
export class FireflyService {
  private readonly config: FireflyServiceConfig
  private readonly imsService: IIMSService
  private activeJobs = new Map<string, FireflyGenerationJob>()
  private rateLimitInfo: RateLimitInfo | null = null

  constructor(imsService: IIMSService, config: Partial<FireflyServiceConfig> = {}) {
    this.imsService = imsService
    this.config = {
      apiUrl: 'https://firefly-api.adobe.io',
      clientId: import.meta.env.VITE_IMS_CLIENT_ID || '',
      version: 'v3',
      timeout: 30000, // 30 seconds
      maxRetries: 3,
      retryDelay: 1000, // 1 second
      maxRetryDelay: 30000, // 30 seconds
      pollInterval: 2000, // 2 seconds
      maxPollTime: 300000, // 5 minutes
      ...config
    }
  }

  /**
   * Generate images from text prompt (async workflow)
   */
  async generateImage(request: FireflyGenerationRequest): Promise<FireflyServiceResponse<FireflyGenerationJob>> {
    const startTime = Date.now()
    
    try {
      console.warn('Starting Firefly image generation:', {
        prompt: request.prompt.substring(0, 100),
        contentClass: request.contentClass,
        numVariations: request.numVariations || 1
      })

      // Create job record
      const job: FireflyGenerationJob = {
        jobId: '', // Will be set from API response
        status: 'pending',
        request,
        createdAt: new Date(),
        retryCount: 0
      }

      // Submit generation request
      const submitResponse = await this.submitGenerationJob(request)
      
      // Update job with API response
      job.jobId = submitResponse.jobId
      this.activeJobs.set(job.jobId, job)

      console.warn('Firefly generation job submitted:', {
        jobId: job.jobId,
        statusUrl: submitResponse.statusUrl
      })

      return {
        data: job,
        rateLimitInfo: this.rateLimitInfo || undefined,
        processingTime: Date.now() - startTime
      }
    } catch (error) {
      console.error('Failed to submit Firefly generation job:', error)
      throw this.createServiceError(
        'GENERATION_SUBMIT_FAILED',
        'Failed to submit image generation request',
        error as Error
      )
    }
  }

  /**
   * Get generation job status and results
   */
  async getGenerationStatus(jobId: string): Promise<FireflyServiceResponse<FireflyGenerationJob>> {
    const startTime = Date.now()
    
    try {
      const job = this.activeJobs.get(jobId)
      if (!job) {
        throw this.createServiceError(
          'JOB_NOT_FOUND',
          `Generation job ${jobId} not found`,
          null,
          false
        )
      }

      // Poll job status from API
      const statusResponse = await this.pollJobStatus(jobId)
      
      // Update job with latest status
      job.status = this.mapApiStatus(statusResponse.status)
      job.updatedAt = new Date()
      
      if (statusResponse.completedAt) {
        job.completedAt = new Date(statusResponse.completedAt)
      }
      
      if (statusResponse.error) {
        job.error = statusResponse.error
      }

      // Process outputs if job completed successfully
      const outputs = statusResponse.result?.outputs || statusResponse.outputs
      if (outputs && job.status === 'succeeded') {
        // Use presigned URLs directly for immediate viewing (they expire in ~1 hour but show instantly)
        job.outputs = await this.processGenerationOutputs(outputs, job.request, true)
      }

      console.warn('Firefly job status updated:', {
        jobId,
        status: job.status,
        outputCount: job.outputs?.length || 0
      })

      return {
        data: job,
        rateLimitInfo: this.rateLimitInfo || undefined,
        processingTime: Date.now() - startTime
      }
    } catch (error) {
      console.error('Failed to get Firefly job status:', error)
      throw this.createServiceError(
        'STATUS_CHECK_FAILED',
        'Failed to check generation job status',
        error as Error
      )
    }
  }

  /**
   * Download generated image as Blob
   */
  async downloadImage(imageUrl: string): Promise<Blob> {
    try {
      const accessToken = await this.imsService.getAccessToken()
      
      const response = await this.makeApiRequest(imageUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-api-key': this.config.clientId
        }
      })

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`)
      }

      const blob = await response.blob()
      console.warn('Image downloaded successfully:', {
        url: imageUrl,
        size: blob.size,
        type: blob.type
      })

      return blob
    } catch (error) {
      console.error('Failed to download image:', error)
      throw this.createServiceError(
        'DOWNLOAD_FAILED',
        'Failed to download generated image',
        error as Error
      )
    }
  }

  /**
   * Download image from authenticated Adobe URL using IMS token
   */
  async downloadImageWithAuth(authenticatedUrl: string): Promise<Blob> {
    try {
      console.warn('Downloading image from authenticated Adobe endpoint:', authenticatedUrl)
      
      // Get access token for authenticated request
      const accessToken = await this.imsService.getAccessToken()
      
      const response = await fetch(authenticatedUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-api-key': this.config.clientId,
        }
      })

      if (!response.ok) {
        throw new Error(`Authenticated download failed: ${response.status} ${response.statusText}`)
      }

      const blob = await response.blob()
      console.warn('Image blob downloaded successfully via authenticated endpoint:', {
        url: authenticatedUrl,
        size: blob.size,
        type: blob.type
      })

      return blob
    } catch (error) {
      console.error('Failed to download image from authenticated endpoint:', error)
      throw this.createServiceError(
        'DOWNLOAD_FAILED',
        'Failed to download image from authenticated Adobe endpoint',
        error as Error
      )
    }
  }

  /**
   * Download image from presigned URL as Blob (no auth required)
   * @deprecated Use downloadImageWithAuth for UXP compatibility
   */
  async downloadImageAsBlob(presignedUrl: string): Promise<Blob> {
    try {
      console.warn('Downloading image from presigned URL:', presignedUrl)
      
      const response = await fetch(presignedUrl, {
        method: 'GET',
        // No auth headers needed for presigned URLs
      })

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`)
      }

      const blob = await response.blob()
      console.warn('Image blob downloaded successfully:', {
        url: presignedUrl,
        size: blob.size,
        type: blob.type
      })

      return blob
    } catch (error) {
      console.error('Failed to download image from presigned URL:', error)
      throw this.createServiceError(
        'DOWNLOAD_FAILED',
        'Failed to download image from presigned URL',
        error as Error
      )
    }
  }

  /**
   * Cancel a generation job
   */
  async cancelJob(jobId: string): Promise<void> {
    try {
      const accessToken = await this.imsService.getAccessToken()
      
      const response = await this.makeApiRequest(`${this.config.apiUrl}/v3/cancel/${jobId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-api-key': this.config.clientId,
          'x-request-id': crypto.randomUUID()
        }
      })

      if (!response.ok) {
        throw new Error(`Cancel failed: ${response.status} ${response.statusText}`)
      }

      const job = this.activeJobs.get(jobId)
      if (job) {
        job.status = 'cancelled'
        job.updatedAt = new Date()
      }

      console.warn('Firefly job cancelled:', { jobId })
    } catch (error) {
      console.error('Failed to cancel Firefly job:', error)
      throw this.createServiceError(
        'CANCEL_FAILED',
        'Failed to cancel generation job',
        error as Error
      )
    }
  }

  /**
   * Poll job until completion or timeout
   */
  async pollUntilComplete(jobId: string): Promise<FireflyGenerationJob> {
    const startTime = Date.now()
    let attempts = 0
    const maxAttempts = Math.floor(this.config.maxPollTime / this.config.pollInterval)

    while (attempts < maxAttempts) {
      const response = await this.getGenerationStatus(jobId)
      const job = response.data

      if (job.status === 'succeeded' || job.status === 'failed' || job.status === 'cancelled') {
        console.warn('Firefly job completed:', {
          jobId,
          status: job.status,
          duration: Date.now() - startTime,
          attempts
        })
        return job
      }

      attempts++
      await this.delay(this.config.pollInterval)
    }

    throw this.createServiceError(
      'POLL_TIMEOUT',
      `Job ${jobId} did not complete within ${this.config.maxPollTime}ms`,
      null,
      false
    )
  }

  /**
   * Get all active jobs
   */
  getActiveJobs(): FireflyGenerationJob[] {
    return Array.from(this.activeJobs.values())
  }

  /**
   * Fetch and refresh all active job statuses from Firefly API
   * This will get the latest status and outputs for all jobs in memory
   */
  async refreshActiveJobs(): Promise<FireflyServiceResponse<FireflyGenerationJob[]>> {
    const startTime = Date.now()
    
    try {
      const activeJobs = this.getActiveJobs()
      console.warn('Refreshing active Firefly jobs:', {
        jobCount: activeJobs.length,
        jobIds: activeJobs.map(job => job.jobId)
      })

      if (activeJobs.length === 0) {
        return {
          data: [],
          rateLimitInfo: this.rateLimitInfo || undefined,
          processingTime: Date.now() - startTime
        }
      }

      // Refresh each job status
      const refreshedJobs: FireflyGenerationJob[] = []
      for (const job of activeJobs) {
        try {
          const response = await this.getGenerationStatus(job.jobId)
          refreshedJobs.push(response.data)
        } catch (error) {
          console.error(`Failed to refresh job ${job.jobId}:`, error)
          // Keep the original job data if refresh fails
          refreshedJobs.push(job)
        }
      }

      console.warn('Firefly job refresh completed:', {
        totalJobs: refreshedJobs.length,
        succeededJobs: refreshedJobs.filter(job => job.status === 'succeeded').length,
        runningJobs: refreshedJobs.filter(job => job.status === 'running').length,
        failedJobs: refreshedJobs.filter(job => job.status === 'failed').length
      })

      return {
        data: refreshedJobs,
        rateLimitInfo: this.rateLimitInfo || undefined,
        processingTime: Date.now() - startTime
      }
    } catch (error) {
      console.error('Failed to refresh active jobs:', error)
      throw this.createServiceError(
        'REFRESH_JOBS_FAILED',
        'Failed to refresh active job statuses',
        error as Error
      )
    }
  }

  /**
   * Clear completed jobs from memory
   */
  clearCompletedJobs(): void {
    for (const [jobId, job] of this.activeJobs.entries()) {
      if (job.status === 'succeeded' || job.status === 'failed' || job.status === 'cancelled') {
        this.activeJobs.delete(jobId)
      }
    }
  }

  // Private helper methods

  private async submitGenerationJob(request: FireflyGenerationRequest): Promise<AsyncAcceptResponseV3> {
    const accessToken = await this.imsService.getAccessToken()
    
    // Build API request payload
    const payload: GenerateImagesRequestV3 = {
      prompt: request.prompt,
      contentClass: request.contentClass,
      size: request.size,
      numVariations: request.numVariations || 1
    }

    // Add optional fields only if they exist
    if (request.style) payload.style = request.style
    if (request.structure) payload.structure = request.structure
    if (request.seeds) payload.seeds = request.seeds
    if (request.customModelId) payload.customModelId = request.customModelId

    console.warn('Firefly API Request:', {
      url: `${this.config.apiUrl}/v3/images/generate-async`,
      payload: JSON.stringify(payload, null, 2),
      clientId: this.config.clientId
    })

    const response = await this.makeApiRequest(`${this.config.apiUrl}/v3/images/generate-async`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': this.config.clientId,
        'x-request-id': crypto.randomUUID(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    this.updateRateLimitInfo(response)

    return data
  }

  private async pollJobStatus(jobId: string): Promise<AsyncTaskResponseV3> {
    const accessToken = await this.imsService.getAccessToken()
    
    const response = await this.makeApiRequest(`${this.config.apiUrl}/v3/status/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': this.config.clientId,
        'x-request-id': crypto.randomUUID()
      }
    })

    const data = await response.json()
    this.updateRateLimitInfo(response)

    // Debug: Log the actual API response structure
    console.warn('Firefly API Status Response:', {
      jobId,
      status: data.status,
      hasResult: !!data.result,
      result: data.result,
      outputs: data.result?.outputs,
      rawData: JSON.stringify(data, null, 2)
    })

    return data
  }

  private async processGenerationOutputs(
    outputs: OutputImageV3[],
    request: FireflyGenerationRequest,
    usePresignedUrls = false // Option to use presigned URLs directly
  ): Promise<GenerationResult[]> {
    console.warn('Processing generation outputs with presigned URLs:', {
      outputCount: outputs.length,
      usePresignedUrls,
      outputs: outputs.map(output => ({
        image: {
          url: output.image?.url,
          presignedUrl: output.image?.presignedUrl,
          filename: output.image?.filename,
          contentType: output.image?.contentType,
          size: output.image?.size
        },
        seed: output.seed
      }))
    })

    const results = await Promise.all(outputs.map(async (output) => {
      const presignedUrl = output.image.presignedUrl || output.image.url
      const filename = output.image.filename || `firefly-${crypto.randomUUID()}.jpg`
      
      // Create base result with presigned URL
      const result: GenerationResult = {
        id: crypto.randomUUID(),
        imageUrl: presignedUrl, // Start with presigned URL
        downloadUrl: presignedUrl, // Keep original for download
        seed: output.seed,
        metadata: {
          prompt: request.prompt,
          contentClass: request.contentClass,
          style: request.style,
          size: request.size,
          seed: output.seed,
          jobId: '',
          model: 'firefly-v3',
          version: 'v3',
          filename: filename,
          contentType: output.image.contentType,
          fileSize: output.image.size,
          userId: request.userId,
          sessionId: request.sessionId,
          timestamp: Date.now(),
          persistenceMethod: 'presigned' // Default to presigned
        },
        timestamp: Date.now(),
        status: 'generated' as const
      }

      // If using presigned URLs directly, return without processing
      if (usePresignedUrls) {
        console.warn('🔗 Using presigned URL directly for immediate viewing:', {
          presignedUrl: presignedUrl.substring(0, 100) + '...',
          filename
        })
        return result
      }

      // Otherwise, download and create UXP-compatible URL (blob URL with data URL fallback)
      try {
        console.warn('📥 Downloading image for UXP compatibility:', result.imageUrl)
        const response = await fetch(result.imageUrl)
        if (response.ok) {
          const blob = await response.blob()
          
          // Try to create blob URL first
          let persistentUrl: string
          let persistenceMethod: 'blob' | 'dataUrl' | 'presigned' = 'presigned'
          
          try {
            const blobUrl = URL.createObjectURL(blob)
            console.warn('✅ Created blob URL:', blobUrl)
            
            // Check if UXP created a malformed blob URL (like "blob:/blob-1")
            if (blobUrl.startsWith('blob:/') && !blobUrl.includes('http')) {
              console.warn('⚠️ UXP created malformed blob URL, falling back to data URL:', blobUrl)
              throw new Error('Malformed UXP blob URL detected')
            }
            
            persistentUrl = blobUrl
            persistenceMethod = 'blob'
          } catch (blobError) {
            console.warn('⚠️ Blob URL creation failed, falling back to data URL:', blobError)
            
            // Fallback to data URL for UXP compatibility
            const reader = new FileReader()
            const dataUrl = await new Promise<string>((resolve, reject) => {
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = () => reject(reader.error)
              reader.readAsDataURL(blob)
            })
            
            persistentUrl = dataUrl
            persistenceMethod = 'dataUrl'
            console.warn('✅ Created data URL fallback:', dataUrl.substring(0, 50) + '...')
          }
          
          // Replace the S3 URL with the persistent URL
          result.imageUrl = persistentUrl
          result.blobUrl = persistentUrl
          result.metadata.persistenceMethod = persistenceMethod
          
          console.warn('✅ Image URL processed:', {
            method: persistenceMethod,
            urlPreview: persistentUrl.substring(0, 50) + '...'
          })
        } else {
          console.error('❌ Failed to download image:', response.status, response.statusText)
          console.warn('⚠️ Keeping presigned URL as fallback')
        }
      } catch (error) {
        console.error('❌ Error downloading image:', error)
        console.warn('⚠️ Keeping presigned URL as fallback')
      }

      return result
    }))

    console.warn('✅ All outputs processed:', {
      resultCount: results.length,
      processingMode: usePresignedUrls ? 'presigned-direct' : 'blob-with-fallback'
    })

    return results
  }

  private mapApiStatus(apiStatus: string): FireflyGenerationJob['status'] {
    switch (apiStatus) {
      case 'running': return 'running'
      case 'succeeded': return 'succeeded'
      case 'failed': return 'failed'
      case 'cancelled': return 'cancelled'
      default: return 'pending'
    }
  }

  private async makeApiRequest(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after')
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : this.config.retryDelay
        
        throw this.createServiceError(
          'RATE_LIMITED',
          `Rate limited. Retry after ${delay}ms`,
          null,
          true
        )
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw this.createServiceError(
          errorData.code || 'API_ERROR',
          errorData.message || `API error: ${response.status} ${response.statusText}`,
          null,
          response.status >= 500
        )
      }

      return response
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw this.createServiceError(
          'TIMEOUT',
          `Request timeout after ${this.config.timeout}ms`,
          error,
          true
        )
      }
      
      throw error
    }
  }

  private updateRateLimitInfo(response: Response): void {
    const remaining = response.headers.get('x-ratelimit-remaining')
    const reset = response.headers.get('x-ratelimit-reset')
    const limit = response.headers.get('x-ratelimit-limit')
    const retryAfter = response.headers.get('retry-after')

    if (remaining && reset && limit) {
      this.rateLimitInfo = {
        remaining: parseInt(remaining),
        reset: new Date(parseInt(reset) * 1000),
        limit: parseInt(limit),
        retryAfter: retryAfter ? parseInt(retryAfter) : undefined
      }
    }
  }

  private createServiceError(
    code: string,
    message: string,
    originalError: Error | null,
    retryable = false
  ): FireflyServiceError {
    const error = new Error(message) as FireflyServiceError
    error.name = 'FireflyServiceError'
    error.code = code
    error.retryable = retryable
    error.originalError = originalError || undefined
    
    return error
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}