import type { IMSService } from '../ims/IMSService'

export interface CustomModel {
  assetId: string
  assetName: string
  displayName: string
  trainingMode: 'subject' | 'style'
  conceptId?: string
  samplePrompt?: string
  publishedState: 'never' | 'published' | 'unpublished'
  baseModel: {
    name: string
    version: string
  }
}

export interface CustomModelsResponse {
  custom_models: CustomModel[]
  total_count: number
  _links?: {
    page?: { href: string; rel: string }
    next?: { href: string; rel: string }
  }
}

export class CustomModelsService {
  private imsService: IMSService
  private baseUrl: string

  constructor(imsService: IMSService, baseUrl = 'https://firefly-api.adobe.io') {
    this.imsService = imsService
    this.baseUrl = baseUrl
  }

  async getCustomModels(options: {
    sortBy?: 'assetName' | 'createdDate' | 'modifiedDate'
    start?: string
    limit?: number
    publishedState?: 'all' | 'ready' | 'published' | 'unpublished' | 'queued' | 'training' | 'failed' | 'cancelled'
  } = {}): Promise<CustomModelsResponse> {
    try {
      const accessToken = await this.imsService.getAccessToken()
      
      const queryParams = new URLSearchParams()
      if (options.sortBy) queryParams.append('sortBy', options.sortBy)
      if (options.start) queryParams.append('start', options.start)
      if (options.limit) queryParams.append('limit', options.limit.toString())
      if (options.publishedState) queryParams.append('publishedState', options.publishedState)

      const url = `${this.baseUrl}/v3/custom-models${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      console.warn('🎨 CustomModelsService: Fetching custom models from:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-API-Key': import.meta.env.VITE_FIREFLY_CLIENT_ID || '',
          'X-Request-Id': `custom-models-${Date.now()}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('CustomModelsService: API Response Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })

        if (response.status === 403) {
          throw new Error(`Custom models access forbidden. This might be an enterprise-only feature or your API key/token may not have the required permissions.`)
        }
        
        throw new Error(`Failed to fetch custom models: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.warn('🎨 CustomModelsService: Successfully fetched models:', data)
      return data as CustomModelsResponse

    } catch (error) {
      console.error('CustomModelsService: Error fetching custom models:', error)
      throw error
    }
  }

  async getPublishedModels(): Promise<CustomModel[]> {
    try {
      const response = await this.getCustomModels({
        publishedState: 'published',
        sortBy: 'modifiedDate',
        limit: 50
      })
      return response.custom_models || []
    } catch (error) {
      console.warn('CustomModelsService: Failed to fetch published models:', error)
      return []
    }
  }
}