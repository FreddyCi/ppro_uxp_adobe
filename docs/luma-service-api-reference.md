# Luma Video Service API Reference

Complete reference for all Luma Dream Machine API methods available in `LumaVideoService`.

## Table of Contents

- [Core Video Generation](#core-video-generation)
- [Video Management](#video-management)
- [Video Extension & Interpolation](#video-extension--interpolation)
- [Utility Methods](#utility-methods)
- [Error Handling](#error-handling)

---

## Core Video Generation

### `generateVideo()`

Generate a new video from text prompt with optional keyframes.

```typescript
async generateVideo(
  request: LumaGenerationRequest,
  options?: LumaVideoGenerationOptions
): Promise<LumaVideoGenerationResult>
```

**Parameters:**
- `request.prompt` - Text description of the video
- `request.model` - Model to use: `'ray-2'`, `'ray-flash-2'`, or `'ray-1-6'`
- `request.aspect_ratio` - Optional: `'16:9'`, `'9:16'`, `'1:1'`, `'21:9'`, `'4:3'`, `'3:4'`, `'9:21'`
- `request.resolution` - Optional: `'540p'`, `'720p'`, `'1080p'`, `'4k'`
- `request.duration` - Optional: `'5s'` or `'9s'`
- `request.loop` - Optional: Enable seamless looping
- `request.keyframes` - Optional: Start/end frames (images or previous generations)
- `request.concepts` - Optional: Array of concept keys (get from `getConcepts()`)
- `options.signal` - Optional: AbortSignal for cancellation
- `options.filename` - Optional: Custom filename for the video

**Example - Text to Video:**
```typescript
const service = new LumaVideoService()

const result = await service.generateVideo({
  prompt: 'A majestic tiger walking through snow-covered mountains',
  model: 'ray-2',
  resolution: '1080p',
  duration: '5s',
  aspect_ratio: '16:9'
})

console.log('Video URL:', result.generation.assets.video)
```

**Example - Image to Video:**
```typescript
const result = await service.generateVideo({
  prompt: 'The tiger starts walking forward',
  model: 'ray-2',
  keyframes: {
    frame0: {
      type: 'image',
      url: 'https://example.com/tiger.jpg'
    }
  }
})
```

**Example - With Concepts:**
```typescript
const result = await service.generateVideo({
  prompt: 'A sports car driving on a highway',
  model: 'ray-2',
  concepts: [
    { key: 'dolly_zoom' }
  ]
})
```

---

### `reframeVideo()`

Change the aspect ratio of an existing video.

```typescript
async reframeVideo(
  request: LumaReframeVideoRequest,
  options?: LumaVideoGenerationOptions
): Promise<LumaReframeVideoResult>
```

**Parameters:**
- `request.media.url` - URL of the video to reframe
- `request.model` - Model: `'ray-2'` or `'ray-flash-2'`
- `request.aspect_ratio` - Target aspect ratio
- `request.prompt` - Optional: Description for the reframe
- `options` - Same as `generateVideo()`

**Example:**
```typescript
const result = await service.reframeVideo({
  media: { url: 'https://example.com/video.mp4' },
  model: 'ray-2',
  aspect_ratio: '1:1',
  prompt: 'Keep the subject centered'
})
```

---

## Video Management

### `getGeneration()`

Get details of a specific generation by ID.

```typescript
async getGeneration(
  id: string,
  signal?: AbortSignal
): Promise<LumaGenerationResponse>
```

**Example:**
```typescript
const generation = await service.getGeneration('123e4567-e89b-12d3-a456-426614174000')

console.log('Status:', generation.state) // 'queued' | 'dreaming' | 'completed' | 'failed'
console.log('Video URL:', generation.assets?.video)
```

---

### `listGenerations()`

List all your generations with pagination.

```typescript
async listGenerations(
  params?: { limit?: number; offset?: number },
  signal?: AbortSignal
): Promise<{ generations: LumaGenerationResponse[]; has_more: boolean }>
```

**Example:**
```typescript
const response = await service.listGenerations({
  limit: 10,
  offset: 0
})

console.log('Total:', response.generations.length)
console.log('Has more:', response.has_more)

response.generations.forEach(gen => {
  console.log(`${gen.id}: ${gen.state}`)
})
```

---

### `deleteGeneration()`

Delete a generation by ID.

```typescript
async deleteGeneration(
  id: string,
  signal?: AbortSignal
): Promise<void>
```

**Example:**
```typescript
await service.deleteGeneration('123e4567-e89b-12d3-a456-426614174000')
console.log('Generation deleted')
```

---

## Video Extension & Interpolation

### `extendVideo()`

Extend a video forward (generate continuation).

```typescript
async extendVideo(
  generationId: string,
  prompt: string,
  model?: LumaVideoModel,
  options?: LumaVideoGenerationOptions
): Promise<LumaVideoGenerationResult>
```

**Example:**
```typescript
// First, generate a video
const initial = await service.generateVideo({
  prompt: 'A tiger walking in the forest',
  model: 'ray-2'
})

// Then extend it
const extended = await service.extendVideo(
  initial.metadata.id,
  'The tiger starts running faster',
  'ray-2'
)
```

---

### `reverseExtendVideo()`

Generate video leading up to an existing video.

```typescript
async reverseExtendVideo(
  generationId: string,
  prompt: string,
  model?: LumaVideoModel,
  options?: LumaVideoGenerationOptions
): Promise<LumaVideoGenerationResult>
```

**Example:**
```typescript
const prequel = await service.reverseExtendVideo(
  existingVideoId,
  'The tiger emerges from the trees',
  'ray-2'
)
```

---

### `interpolateVideos()`

Generate smooth transition between two videos.

```typescript
async interpolateVideos(
  startGenerationId: string,
  endGenerationId: string,
  prompt: string,
  model?: LumaVideoModel,
  options?: LumaVideoGenerationOptions
): Promise<LumaVideoGenerationResult>
```

**Example:**
```typescript
const transition = await service.interpolateVideos(
  firstVideoId,
  secondVideoId,
  'Smooth transition from day to night',
  'ray-2'
)
```

---

### `extendVideoWithEndFrame()`

Extend a video with a custom end frame image.

```typescript
async extendVideoWithEndFrame(
  generationId: string,
  endFrameUrl: string,
  prompt: string,
  model?: LumaVideoModel,
  options?: LumaVideoGenerationOptions
): Promise<LumaVideoGenerationResult>
```

**Example:**
```typescript
const extended = await service.extendVideoWithEndFrame(
  videoId,
  'https://example.com/target-frame.jpg',
  'The tiger reaches the clearing',
  'ray-2'
)
```

---

### `reverseExtendVideoWithStartFrame()`

Reverse extend with custom start frame image.

```typescript
async reverseExtendVideoWithStartFrame(
  generationId: string,
  startFrameUrl: string,
  prompt: string,
  model?: LumaVideoModel,
  options?: LumaVideoGenerationOptions
): Promise<LumaVideoGenerationResult>
```

**Example:**
```typescript
const prequel = await service.reverseExtendVideoWithStartFrame(
  videoId,
  'https://example.com/start-frame.jpg',
  'The journey begins',
  'ray-2'
)
```

---

## Utility Methods

### `getCameraMotions()`

Get list of available camera motion strings for prompts.

```typescript
async getCameraMotions(
  signal?: AbortSignal
): Promise<string[]>
```

**Example:**
```typescript
const motions = await service.getCameraMotions()

console.log('Available camera motions:', motions)
// ['camera orbit left', 'camera zoom in', 'camera pan right', ...]

// Use in prompt
await service.generateVideo({
  prompt: `A cityscape with camera orbit left`,
  model: 'ray-2'
})
```

---

### `getConcepts()`

Get list of available concept keys and descriptions.

```typescript
async getConcepts(
  signal?: AbortSignal
): Promise<Array<{ key: string; name?: string; description?: string }>>
```

**Example:**
```typescript
const concepts = await service.getConcepts()

concepts.forEach(concept => {
  console.log(`${concept.key}: ${concept.description}`)
})

// Use in generation
await service.generateVideo({
  prompt: 'A dramatic scene',
  model: 'ray-2',
  concepts: [
    { key: 'dolly_zoom' }
  ]
})
```

---

## Error Handling

All methods throw `LumaVideoServiceError` on failure.

```typescript
try {
  const result = await service.generateVideo({
    prompt: 'A beautiful landscape',
    model: 'ray-2'
  })
} catch (error) {
  if (error instanceof LumaVideoServiceError) {
    console.error('Status:', error.status)
    console.error('Message:', error.message)
    console.error('Details:', error.details)
    console.error('Response:', error.body)
  }
}
```

**Common Error Codes:**
- `401` - Missing or invalid API key
- `400` - Invalid request parameters
- `408` - Generation timed out
- `429` - Rate limit exceeded
- `499` - Request aborted
- `500` - Server error
- `502` - Bad gateway (service unavailable)
- `504` - Polling exceeded max attempts

---

## Complete Example: Video Extension Pipeline

```typescript
import { LumaVideoService } from './services/luma'

const service = new LumaVideoService({
  apiKey: 'your-api-key',
  pollIntervalMs: 5000,
  maxPollAttempts: 120
})

// 1. Generate initial video
const scene1 = await service.generateVideo({
  prompt: 'A tiger walking through a snowy forest',
  model: 'ray-2',
  duration: '5s',
  resolution: '1080p'
})

console.log('Scene 1 generated:', scene1.metadata.id)

// 2. Extend the video
const scene2 = await service.extendVideo(
  scene1.metadata.id,
  'The tiger starts running through the trees',
  'ray-2'
)

console.log('Scene 2 generated:', scene2.metadata.id)

// 3. Add transition with custom end frame
const scene3 = await service.extendVideoWithEndFrame(
  scene2.metadata.id,
  'https://example.com/clearing.jpg',
  'The tiger reaches a sunlit clearing',
  'ray-2'
)

console.log('Scene 3 generated:', scene3.metadata.id)

// 4. Clean up old generations
await service.deleteGeneration(scene1.metadata.id)
console.log('Cleanup complete')
```

---

## Configuration Options

```typescript
const service = new LumaVideoService({
  apiKey: 'luma-xxxx',                // API key (or use VITE_LUMA_API_KEY env var)
  baseUrl: 'https://api.lumalabs.ai/dream-machine/v1', // Custom API URL
  requestTimeoutMs: 60000,            // Request timeout (60s default)
  pollIntervalMs: 5000,               // Polling interval (5s default)
  maxPollAttempts: 120,               // Max polling attempts (120 default)
  pollTimeoutMs: 600000,              // Overall polling timeout (10min default)
  defaultRequest: {                   // Default parameters for all requests
    resolution: '1080p',
    duration: '5s'
  }
})
```

---

## Type Definitions

### `LumaGenerationRequest`
```typescript
interface LumaGenerationRequest {
  generation_type?: 'video'
  prompt?: string
  model: LumaVideoModel
  aspect_ratio?: LumaAspectRatio
  resolution?: LumaVideoResolution
  duration?: LumaVideoDuration
  loop?: boolean
  keyframes?: LumaKeyframes
  concepts?: LumaConcept[]
  callback_url?: string
}
```

### `LumaVideoGenerationResult`
```typescript
interface LumaVideoGenerationResult {
  blob: Blob                          // Video file as Blob
  contentType: string                 // MIME type (e.g., 'video/mp4')
  filename: string                    // Generated filename
  generation: LumaGenerationResponse  // Full API response
  metadata: LumaVideoGenerationMetadata // Parsed metadata
}
```

### `LumaGenerationResponse`
```typescript
interface LumaGenerationResponse {
  id: string
  generation_type?: 'video' | 'image' | 'reframe_video'
  state: 'queued' | 'dreaming' | 'completed' | 'failed'
  failure_reason?: string | null
  created_at?: string
  updated_at?: string
  assets?: {
    video?: string
    image?: string
    progress_video?: string
  }
  model?: string
  request?: Record<string, unknown>
}
```

---

## Notes

- All video generation methods automatically poll until completion
- Extend operations require the source generation to be in `completed` state
- Camera motions and concepts are controlled via prompt text
- Callbacks are supported via `callback_url` parameter (receives POST with generation updates)
- All methods support `AbortSignal` for cancellation
- Video downloads are automatic and return a `Blob` for easy storage

For the latest API documentation, visit: https://docs.lumalabs.ai/
