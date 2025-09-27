// Gemini API Service - Google Gemini Image Correction
// Service exports for image correction and enhancement

export { GeminiService, createGeminiService } from './GeminiService'
export type { 
  GeminiServiceResponse, 
  GeminiServiceError, 
  RateLimitInfo 
} from './GeminiService'

// Re-export types from gemini types for convenience
export type {
  GeminiCorrectionResponse,
  CorrectionParams,
  CorrectedImage,
  CorrectionStatus,
  GeminiConfig,
  CorrectionMetadata,
  BeforeAfterComparison
} from '../../types/gemini'
