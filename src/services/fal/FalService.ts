/**
 * FAL.ai Video Generation Service
 * Handles video generation using FAL.ai's Wan-2.1 First-Last-Frame-to-Video model
 * Documentation: https://fal.run/fal-ai/wan-flf2v
 */

import { fal } from '@fal-ai/client'
import type {
  FalVideoRequest,
  FalVideoResponse,
  VideoGenerationResult,
  VideoGenerationSettings,
  FalJobStatus,
  FalVideoFile,
  FalVideoMetadata
} from '../../types/index.js'
import type { BlobService } from '../blob/BlobService'
import type { VideoMetadata, ImageMetadata } from '../../types/blob'

export interface FalServiceConfig {
  apiKey: string
  baseUrl?: string
  modelId: string
  endpoint: string
  maxRetries?: number
  retryDelay?: number
  timeout?: number
}

export interface IFalService {
  generateVideo(request: FalVideoRequest): Promise<VideoGenerationResult>
  uploadImage(file: File): Promise<string>
  getJobStatus(jobId: string): Promise<FalJobStatus>
  cancelJob(jobId: string): Promise<boolean>
  validateConfig(): boolean
}

export class FalService implements IFalService {
  private config: FalServiceConfig
  private initialized = false
  private blobService?: BlobService

  constructor(config: FalServiceConfig, blobService?: BlobService) {
    this.config = {
      maxRetries: 3,
      retryDelay: 2000,
      timeout: 300000, // 5 minutes
      ...config
    }
    this.blobService = blobService
  }

  /**
   * Initialize the FAL.ai client with authentication
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // Configure FAL client
      fal.config({
        credentials: this.config.apiKey,
        ...(this.config.baseUrl && { endpoint: this.config.baseUrl })
      })

      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize FAL.ai service:', error)
      throw new Error(`FAL.ai initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Validate service configuration
   */
  validateConfig(): boolean {
    return !!(
      this.config.apiKey &&
      this.config.modelId &&
      this.config.endpoint
    )
  }

  /**
   * Upload an image to FAL.ai and get a URL
   */
  async uploadImage(file: File): Promise<string> {
    await this.initialize()

    try {
      const url = await fal.storage.upload(file)
      return url
    } catch (error) {
      console.error('Failed to upload image to FAL.ai:', error)
      throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate a video using FAL.ai's Wan-2.1 model
   */
  async generateVideo(request: FalVideoRequest): Promise<VideoGenerationResult> {
    await this.initialize()

    if (!this.validateConfig()) {
      throw new Error('FAL.ai service configuration is invalid')
    }

    const startTime = Date.now()
    
    try {

      // Submit the video generation request
      const response = await fal.subscribe(this.config.endpoint, {
        input: request,
        logs: true,
        onQueueUpdate: (_update) => {
          // Queue update logging could be added here
        }
      }) as unknown as FalVideoResponse

      const processingTime = Date.now() - startTime

      // Download the generated video
      const videoFile = await this.downloadVideo(response.video.url)
      
      // Try to upload to Azure Blob Storage if available
      let finalVideoFile = videoFile
      if (this.blobService) {
        try {
          console.warn('Uploading video to Azure Blob Storage...')
          
          // Create File from Blob for upload
          const filename = `fal-video-${crypto.randomUUID()}.mp4`
          const videoFileForUpload = new File([videoFile.blob], filename, {
            type: 'video/mp4'
          })
          
          // Create metadata for Azure storage
          const azureVideoMetadata: VideoMetadata = {
            id: crypto.randomUUID(),
            filename: filename,
            originalName: filename,
            mimeType: 'video/mp4',
            size: videoFile.blob.size,
            tags: ['fal-ai', 'generated', 'video'],
            timestamp: new Date(),
            duration: this.calculateDuration(request.num_frames || 81, request.frames_per_second || 16),
            frameRate: request.frames_per_second || 16,
            userId: 'anonymous',
            sessionId: 'fal-generation'
          }
          
          // Upload to Azure and get the blob URL
          const azureBlobUrl = await this.blobService.uploadImage(videoFileForUpload, azureVideoMetadata as ImageMetadata)
          
          // Update video file with Azure URL
          finalVideoFile = {
            ...videoFile,
            url: azureBlobUrl,
            filename: filename
          }
          
          console.warn('✅ Video uploaded to Azure Blob Storage:', {
            originalUrl: videoFile.url,
            azureUrl: azureBlobUrl,
            size: videoFile.blob.size
          })
          
        } catch (azureError) {
          console.error('Failed to upload video to Azure Blob Storage, using original:', azureError)
          // Keep original video file if Azure upload fails
        }
      } else {
        console.warn('BlobService not available, using original video URL')
      }

      // Create metadata
      const metadata: FalVideoMetadata = {
        prompt: request.prompt,
        model: this.config.modelId,
        resolution: request.resolution || '720p',
        duration: this.calculateDuration(request.num_frames || 81, request.frames_per_second || 16),
        frameCount: request.num_frames || 81,
        frameRate: request.frames_per_second || 16,
        aspectRatio: request.aspect_ratio || 'auto',
        fileSize: finalVideoFile.blob.size,
        contentType: 'video/mp4',
        seed: response.seed,
        processingTime,
        timestamp: new Date(),
        version: '1.0.0',
        jobId: this.generateJobId(),
        startImageMetadata: {
          id: 'start_image',
          filename: 'start_frame.jpg',
          prompt: `Start frame for: ${request.prompt}`
        },
        endImageMetadata: {
          id: 'end_image', 
          filename: 'end_frame.jpg',
          prompt: `End frame for: ${request.prompt}`
        }
      }

      const result: VideoGenerationResult = {
        video: finalVideoFile,
        metadata,
        generatedAt: new Date().toISOString(),
        jobId: metadata.jobId,
        status: 'completed'
      }

      return result

    } catch (error) {
      console.error('FAL.ai video generation failed:', error)
      
      throw new Error(`Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Download video file from FAL.ai URL
   */
  private async downloadVideo(url: string): Promise<FalVideoFile> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to download video: ${response.status} ${response.statusText}`)
      }

      const blob = await response.blob()
      const filename = this.generateVideoFilename()

      return {
        url,
        filename,
        blob
      }
    } catch (error) {
      console.error('Failed to download video:', error)
      throw new Error(`Video download failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get job status (placeholder for potential async job monitoring)
   */
  async getJobStatus(_jobId: string): Promise<FalJobStatus> {
    // FAL.ai subscribe method handles job monitoring internally
    // This is a placeholder for potential future async job status checking
    return 'completed'
  }

  /**
   * Cancel a running job (placeholder)
   */
  async cancelJob(_jobId: string): Promise<boolean> {
    // FAL.ai doesn't currently support job cancellation in the subscribe method
    // This is a placeholder for potential future cancellation support
    return false
  }

  /**
   * Helper methods
   */
  private calculateDuration(frames: number, fps: number): number {
    return Math.round((frames / fps) * 100) / 100
  }

  private generateJobId(): string {
    return `fal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateVideoFilename(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    return `fal_video_${timestamp}.mp4`
  }
}

/**
 * Helper function to create VideoGenerationSettings from common parameters
 */
export function createVideoSettings(
  resolution: '480p' | '720p' = '720p',
  frames: number = 81,
  fps: number = 16,
  steps: number = 30,
  guidance: number = 5
): VideoGenerationSettings {
  return {
    resolution,
    frameCount: frames,
    frameRate: fps,
    inferenceSteps: steps,
    guidanceScale: guidance,
    aspectRatio: 'auto',
    enableSafetyChecker: true,
    acceleration: 'regular'
  }
}

/**
 * Helper function to convert gallery images to FAL.ai request URLs
 */
export async function prepareImageUrls(
  startImageFile: File,
  endImageFile: File,
  falService: FalService
): Promise<{ start_image_url: string; end_image_url: string }> {
  const [startUrl, endUrl] = await Promise.all([
    falService.uploadImage(startImageFile),
    falService.uploadImage(endImageFile)
  ])

  return {
    start_image_url: startUrl,
    end_image_url: endUrl
  }
}