# LTX Video Service Reference

The LTX video service provides text-to-video generation via the `https://api.ltx.video/v1/text-to-video` endpoint. This document explains how to configure and use the `LtxVideoService` wrapper.

## Configuration

Create a `.env` (or update your existing configuration) with the LTX API key supplied by the team:

```
VITE_LTX_API_KEY=your_ltx_api_key_here
```

> **Security note:** Never commit the raw key to source control. Store it in local environment files or the Adobe UXP secure storage.

Alternatively, you can pass the key directly when instantiating the service:

```ts
import { LtxVideoService } from '@/services'

const ltx = new LtxVideoService({
  apiKey: '<your-api-key>',
  timeout: 240_000, // 4 minutes
  defaultRequest: {
    fps: 24,
    width: 1280,
    height: 720,
  },
})
```

## Generating a Video

```ts
import type { LtxTextToVideoRequest } from '@/types'

const request: LtxTextToVideoRequest = {
  prompt: 'A cinematic shot of a futuristic city skyline at sunset, camera dolly-in with warm golden light',
  duration_seconds: 6,
  fps: 24,
  width: 1280,
  height: 720,
  seed: 42,
}

const result = await ltx.generateVideo(request)

console.log('Video filename', result.filename)
console.log('MIME type', result.contentType)
console.log('Metadata', result.metadata)

// Save or preview the blob as needed
const objectUrl = URL.createObjectURL(result.blob)
```

If the request fails, the service throws an `LtxVideoServiceError` with the HTTP status, message, and parsed error body (if provided by the API).

```ts
try {
  await ltx.generateVideo(request)
} catch (error) {
  if (error instanceof LtxVideoServiceError) {
    console.error('LTX error', error.status, error.body)
  }
}
```

## Curl Equivalent

```
curl -i -X POST "https://api.ltx.video/v1/text-to-video" \
  -H "Authorization: Bearer $VITE_LTX_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: video/mp4" \
  --fail-with-body --output result.mp4 \
  -d '{
    "prompt": "A cinematic shot of a futuristic city skyline at sunset, camera slowly dolly-in with warm golden light",
    "duration_seconds": 6,
    "fps": 24,
    "width": 1280,
    "height": 720,
    "seed": 42
  }'
```

## Handling Timeouts and Cancellation

You can forward an `AbortSignal` to cancel a long-running request:

```ts
const controller = new AbortController()
const promise = ltx.generateVideo(request, { signal: controller.signal })

// Cancel after 10 seconds
setTimeout(() => controller.abort(), 10_000)

await promise
```
