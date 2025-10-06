# Luma Image Service API Reference

Complete reference for all Luma Dream Machine Image Generation API methods available in `LumaImageService`.

## Table of Contents

- [Overview](#overview)
- [Models](#models)
- [Core Image Generation](#core-image-generation)
- [Image Reference Methods](#image-reference-methods)
- [Image Management](#image-management)
- [Error Handling](#error-handling)

---

## Overview

The Luma Image Service provides AI-powered image generation with support for:
- **Text-to-Image** - Generate images from text descriptions
- **Image References** - Guide generation with reference images
- **Style Transfer** - Apply artistic styles to generations
- **Character Consistency** - Maintain character identity across images
- **Image Modification** - Edit existing images with prompts

---

## Models

| Model Name | Model Parameter | Description |
|------------|-----------------|-------------|
| Photon 1 | `photon-1` | Default model, high quality |
| Photon Flash 1 | `photon-flash-1` | Faster generation |

**Supported Aspect Ratios:**
- `1:1` - Square
- `16:9` - Widescreen (default)
- `9:16` - Portrait
- `4:3` - Standard
- `3:4` - Portrait standard
- `21:9` - Ultra-wide
- `9:21` - Ultra-tall

---

## Core Image Generation

### `generateImage()`

Generate an image from a text prompt with optional references.

```typescript
async generateImage(
  request: LumaImageGenerationRequest,
  options?: LumaImageGenerationOptions
): Promise<LumaImageGenerationResult>
```

**Parameters:**
- `request.prompt` - Text description of the image
- `request.model` - Model to use: `'photon-1'` or `'photon-flash-1'`
- `request.aspect_ratio` - Optional: Target aspect ratio
- `request.image_ref` - Optional: Array of image references (up to 4)
- `request.style_ref` - Optional: Array of style references
- `request.character_ref` - Optional: Character consistency references
- `request.modify_image_ref` - Optional: Image to modify
- `options.signal` - Optional: AbortSignal for cancellation
- `options.filename` - Optional: Custom filename for the image

**Example - Text to Image:**
```typescript
import { LumaImageService } from './services/luma'

const service = new LumaImageService()

const result = await service.generateImage({
  prompt: 'A teddy bear in sunglasses playing electric guitar and dancing',
  model: 'photon-1',
  aspect_ratio: '16:9'
})

console.log('Image URL:', result.generation.assets.image)
console.log('Filename:', result.filename)
```

**Example - With Custom Aspect Ratio:**
```typescript
const result = await service.generateImage({
  prompt: 'A majestic mountain landscape at sunset',
  model: 'photon-flash-1',
  aspect_ratio: '21:9'
})
```

---

## Image Reference Methods

### `generateImageWithReference()`

Generate an image using up to 4 reference images to guide the generation. Perfect for creating variations or when you have a concept that's easier to visualize than describe.

```typescript
async generateImageWithReference(
  prompt: string,
  imageReferences: Array<{ url: string; weight?: number }>,
  model?: LumaImageModel,
  aspectRatio?: LumaAspectRatio,
  options?: LumaImageGenerationOptions
): Promise<LumaImageGenerationResult>
```

**Weight Parameter:**
- Range: `0.0` to `1.0`
- Higher weight = stronger influence of reference image
- Default: `0.85` (recommended)

**Example:**
```typescript
const result = await service.generateImageWithReference(
  'sunglasses',
  [
    {
      url: 'https://example.com/reference-sunglasses.jpg',
      weight: 0.85
    }
  ],
  'photon-1',
  '1:1'
)
```

**Example - Multiple References:**
```typescript
const result = await service.generateImageWithReference(
  'a futuristic sports car',
  [
    { url: 'https://example.com/car1.jpg', weight: 0.7 },
    { url: 'https://example.com/car2.jpg', weight: 0.6 },
    { url: 'https://example.com/car3.jpg', weight: 0.5 }
  ],
  'photon-1'
)
```

---

### `generateImageWithStyle()`

Apply a specific artistic style to your generation using style reference images.

```typescript
async generateImageWithStyle(
  prompt: string,
  styleReferences: Array<{ url: string; weight?: number }>,
  model?: LumaImageModel,
  aspectRatio?: LumaAspectRatio,
  options?: LumaImageGenerationOptions
): Promise<LumaImageGenerationResult>
```

**Example:**
```typescript
const result = await service.generateImageWithStyle(
  'a dog playing in the park',
  [
    {
      url: 'https://example.com/watercolor-style.jpg',
      weight: 0.8
    }
  ],
  'photon-1',
  '4:3'
)
```

---

### `generateImageWithCharacter()`

Maintain character consistency across multiple images. Upload up to 4 images per identity to build a character profile.

```typescript
async generateImageWithCharacter(
  prompt: string,
  characterReference: {
    identity0?: { images: string[] }, // Up to 4 images
    identity1?: { images: string[] },
    identity2?: { images: string[] },
    identity3?: { images: string[] }
  },
  model?: LumaImageModel,
  aspectRatio?: LumaAspectRatio,
  options?: LumaImageGenerationOptions
): Promise<LumaImageGenerationResult>
```

**Example - Single Character:**
```typescript
const result = await service.generateImageWithCharacter(
  'man as a warrior in medieval armor',
  {
    identity0: {
      images: [
        'https://example.com/person-front.jpg',
        'https://example.com/person-side.jpg',
        'https://example.com/person-smile.jpg'
      ]
    }
  },
  'photon-1',
  '3:4'
)
```

**Example - Multiple Characters:**
```typescript
const result = await service.generateImageWithCharacter(
  'two friends hiking in the mountains',
  {
    identity0: {
      images: ['https://example.com/person1.jpg']
    },
    identity1: {
      images: ['https://example.com/person2.jpg']
    }
  },
  'photon-1'
)
```

**💡 Tip:** More reference images = better character representation. Use 2-4 images per identity for best results.

---

### `modifyImage()`

Refine or edit an existing image by prompting what changes you want to make.

```typescript
async modifyImage(
  prompt: string,
  modifyReference: { url: string; weight?: number },
  model?: LumaImageModel,
  aspectRatio?: LumaAspectRatio,
  options?: LumaImageGenerationOptions
): Promise<LumaImageGenerationResult>
```

**Weight Guidelines:**
- `0.8 - 1.0` - Minimal changes, stay very close to input
- `0.5 - 0.7` - Moderate changes
- `0.0 - 0.1` - **For color changes** (recommended)

**⚠️ Important:** This feature works best for changing objects and shapes. When changing colors, use a lower weight (0.0-0.1) for better results.

**Example - Object Modification:**
```typescript
const result = await service.modifyImage(
  'transform all the flowers to sunflowers',
  {
    url: 'https://example.com/garden.jpg',
    weight: 1.0
  },
  'photon-1'
)
```

**Example - Color Change:**
```typescript
const result = await service.modifyImage(
  'change the car color to red',
  {
    url: 'https://example.com/blue-car.jpg',
    weight: 0.05 // Low weight for color changes
  },
  'photon-1'
)
```

---

## Image Management

### `getGeneration()`

Get details of a specific generation by ID.

```typescript
async getGeneration(
  id: string,
  signal?: AbortSignal
): Promise<LumaImageGenerationResponse>
```

**Example:**
```typescript
const generation = await service.getGeneration('123e4567-e89b-12d3-a456-426614174000')

console.log('Status:', generation.state) // 'queued' | 'dreaming' | 'completed' | 'failed'
console.log('Image URL:', generation.assets?.image)
console.log('Model:', generation.model)
```

---

### `listGenerations()`

List all your image generations with pagination.

```typescript
async listGenerations(
  params?: { limit?: number; offset?: number },
  signal?: AbortSignal
): Promise<{ generations: LumaImageGenerationResponse[]; has_more: boolean }>
```

**Example:**
```typescript
const response = await service.listGenerations({
  limit: 20,
  offset: 0
})

console.log('Images:', response.generations.length)
console.log('Has more:', response.has_more)

response.generations.forEach(gen => {
  console.log(`${gen.id}: ${gen.state}`)
  if (gen.assets?.image) {
    console.log(`  Image: ${gen.assets.image}`)
  }
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

## Error Handling

All methods throw `LumaImageServiceError` on failure.

```typescript
import { LumaImageServiceError } from './services/luma'

try {
  const result = await service.generateImage({
    prompt: 'A beautiful sunset over the ocean',
    model: 'photon-1'
  })
} catch (error) {
  if (error instanceof LumaImageServiceError) {
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
- `500` - Server error / generation failed
- `502` - Bad gateway (service unavailable)
- `504` - Polling exceeded max attempts

---

## Complete Examples

### Example 1: Text-to-Image Generation

```typescript
import { LumaImageService } from './services/luma'

const service = new LumaImageService({
  apiKey: 'your-api-key'
})

const result = await service.generateImage({
  prompt: 'A cyberpunk cityscape at night with neon lights',
  model: 'photon-1',
  aspect_ratio: '21:9'
})

// Save or display the image
console.log('Generated:', result.filename)
console.log('Image URL:', result.metadata.imageUrl)
```

### Example 2: Style Transfer

```typescript
const artworkResult = await service.generateImageWithStyle(
  'a portrait of a woman',
  [
    {
      url: 'https://example.com/van-gogh-style.jpg',
      weight: 0.8
    }
  ],
  'photon-1',
  '3:4'
)

console.log('Stylized image:', artworkResult.metadata.imageUrl)
```

### Example 3: Character Consistency Pipeline

```typescript
// Step 1: Create character in one scene
const scene1 = await service.generateImageWithCharacter(
  'astronaut floating in space',
  {
    identity0: {
      images: [
        'https://example.com/person-1.jpg',
        'https://example.com/person-2.jpg'
      ]
    }
  },
  'photon-1',
  '16:9'
)

// Step 2: Same character in different scene
const scene2 = await service.generateImageWithCharacter(
  'astronaut walking on the moon surface',
  {
    identity0: {
      images: [
        'https://example.com/person-1.jpg',
        'https://example.com/person-2.jpg'
      ]
    }
  },
  'photon-1',
  '16:9'
)

console.log('Scene 1:', scene1.metadata.imageUrl)
console.log('Scene 2:', scene2.metadata.imageUrl)
```

### Example 4: Image Modification Workflow

```typescript
// Step 1: Generate base image
const base = await service.generateImage({
  prompt: 'a modern living room with minimalist furniture',
  model: 'photon-1',
  aspect_ratio: '16:9'
})

// Step 2: Modify the image
const modified = await service.modifyImage(
  'add plants and artwork to the walls',
  {
    url: base.metadata.imageUrl!,
    weight: 0.9
  },
  'photon-1',
  '16:9'
)

console.log('Base image:', base.metadata.imageUrl)
console.log('Modified image:', modified.metadata.imageUrl)
```

### Example 5: Batch Generation with Cleanup

```typescript
const controller = new AbortController()

try {
  // Generate multiple variations
  const variations = await Promise.all([
    service.generateImageWithReference(
      'sports car in red',
      [{ url: 'https://example.com/car.jpg', weight: 0.8 }],
      'photon-flash-1',
      '16:9',
      { signal: controller.signal }
    ),
    service.generateImageWithReference(
      'sports car in blue',
      [{ url: 'https://example.com/car.jpg', weight: 0.8 }],
      'photon-flash-1',
      '16:9',
      { signal: controller.signal }
    ),
    service.generateImageWithReference(
      'sports car in black',
      [{ url: 'https://example.com/car.jpg', weight: 0.8 }],
      'photon-flash-1',
      '16:9',
      { signal: controller.signal }
    )
  ])

  variations.forEach((v, i) => {
    console.log(`Variation ${i + 1}:`, v.metadata.imageUrl)
  })

  // Cleanup: delete old generations
  const allGens = await service.listGenerations({ limit: 100 })
  const oldGens = allGens.generations.slice(10) // Keep only 10 most recent

  for (const gen of oldGens) {
    await service.deleteGeneration(gen.id)
  }

} catch (error) {
  if (error instanceof LumaImageServiceError && error.status === 499) {
    console.log('Generation aborted by user')
  } else {
    throw error
  }
}
```

---

## Configuration Options

```typescript
const service = new LumaImageService({
  apiKey: 'luma-xxxx',                      // API key (or use VITE_LUMA_API_KEY env var)
  baseUrl: 'https://api.lumalabs.ai/dream-machine/v1', // Custom API URL
  requestTimeoutMs: 60000,                  // Request timeout (60s default)
  pollIntervalMs: 5000,                     // Polling interval (5s default)
  maxPollAttempts: 120,                     // Max polling attempts (120 default)
  pollTimeoutMs: 600000,                    // Overall polling timeout (10min default)
  defaultRequest: {                         // Default parameters for all requests
    model: 'photon-1',
    aspect_ratio: '16:9'
  }
})
```

---

## Type Definitions

### `LumaImageGenerationRequest`
```typescript
interface LumaImageGenerationRequest {
  generation_type?: 'image'
  prompt: string
  model?: 'photon-1' | 'photon-flash-1'
  aspect_ratio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | '9:21' | '21:9'
  image_ref?: Array<{ url: string; weight?: number }> // Up to 4
  style_ref?: Array<{ url: string; weight?: number }>
  character_ref?: {
    identity0?: { images: string[] } // Up to 4 images per identity
    identity1?: { images: string[] }
    identity2?: { images: string[] }
    identity3?: { images: string[] }
  }
  modify_image_ref?: { url: string; weight?: number }
  callback_url?: string
}
```

### `LumaImageGenerationResult`
```typescript
interface LumaImageGenerationResult {
  blob: Blob                                // Image file as Blob
  contentType: string                       // MIME type (e.g., 'image/jpeg')
  filename: string                          // Generated filename
  generation: LumaImageGenerationResponse   // Full API response
  metadata: {
    id: string
    state: string
    createdAt?: string
    imageUrl?: string
    model?: string
    prompt?: string
  }
}
```

### `LumaImageGenerationResponse`
```typescript
interface LumaImageGenerationResponse {
  id: string
  type: 'image'
  state: 'queued' | 'dreaming' | 'completed' | 'failed'
  failure_reason?: string | null
  created_at?: string
  assets?: {
    image?: string
    video?: null
  }
  model?: string
  request?: LumaImageGenerationRequest
}
```

---

## Best Practices

### Image References
- Use **2-4 reference images** for best results with character consistency
- **Higher weights** (0.7-0.9) maintain stronger similarity to reference
- **Lower weights** (0.3-0.5) allow more creative freedom

### Style Transfer
- Use **clear style references** with distinct visual characteristics
- Weight of **0.8** works well for most style transfers
- Combine with descriptive prompts for better results

### Image Modification
- For **object changes**: Use weight 0.8-1.0
- For **color changes**: Use weight 0.0-0.1
- Be specific in prompts about what to change

### Model Selection
- Use **photon-1** for highest quality
- Use **photon-flash-1** when speed is priority
- Test both models to see which works best for your use case

---

## Notes

- All image generation methods automatically poll until completion
- Image downloads are automatic and return a `Blob` for easy storage
- All methods support `AbortSignal` for cancellation
- Character references work best with multiple images of the same person
- Callbacks are supported via `callback_url` parameter (receives POST with generation updates)
- The service automatically filters to only return image generations when listing

For the latest API documentation, visit: https://docs.lumalabs.ai/
