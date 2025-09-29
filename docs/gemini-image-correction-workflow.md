# Gemini API Image Correction and Local Storage Workflow

## Overview

This document describes the complete workflow for correcting images using Google Gemini API, converting between blob and base64 formats, and storing corrected images locally within the Premiere Pro UXP panel.

## Workflow Steps

### 1. Image Correction Request

**Location**: `src/services/gemini/GeminiService.ts`

- User provides an image blob and correction parameters (line cleanup, color correction, etc.)
- `GeminiService.correctImage()` validates inputs and processes the request
- Input validation ensures image size < 10MB and valid image type

### 2. Input Blob to Base64 Conversion

**Location**: `src/services/gemini/GeminiService.ts` - `blobToBase64()` method

Converts the input image blob to base64 for Gemini API:

```typescript
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
```

### 3. Gemini API Request

**Location**: `src/services/gemini/GeminiService.ts` - `makeGeminiRequest()` method

- Creates correction prompt based on parameters (lineCleanup, enhanceDetails, etc.)
- Sends base64 image + text prompt to Gemini API
- Receives base64-encoded corrected image in response

**API Request Structure**:
```json
{
  "contents": [{
    "parts": [
      {
        "inlineData": {
          "mimeType": "image/png",
          "data": "<base64-image-data>"
        }
      },
      {
        "text": "Please improve this image by applying the following corrections..."
      }
    ]
  }]
}
```

### 4. Base64 Response to Blob Conversion

**Location**: `src/services/gemini/GeminiService.ts` - `transformToCorrectImage()` method

Converts Gemini's base64 response back to a blob:

```typescript
// Convert base64 to blob for storage
const base64Data = responseData.data
const mimeType = 'image/png' // Gemini typically returns PNG
const byteCharacters = atob(base64Data)
const byteNumbers = new Array(byteCharacters.length)

for (let i = 0; i < byteCharacters.length; i++) {
  byteNumbers[i] = byteCharacters.charCodeAt(i)
}

const byteArray = new Uint8Array(byteNumbers)
const blob = new Blob([byteArray], { type: mimeType })
```

### 5. Local Storage Process

**Location**: `src/services/local/localBoltStorage.ts`

When `isLocalStorageMode()` returns true:

- Creates blob URL for immediate display: `URL.createObjectURL(blob)`
- Calls `saveGenerationLocally()` to persist to disk
- Saves with metadata including correction parameters
- Uses same storage providers as Firefly (Bolt addon or UXP fallback)

### 6. UXP UI Display

**Location**: `src/utils/uxpFs.ts` - `toTempUrl()` function

For locally stored corrected images:

```typescript
// Creates temporary filesystem URLs for local files
export async function toTempUrl(folderToken: string, relativePath: string): Promise<string> {
  const folder = await fs.getEntryForPersistentToken(folderToken)
  const file = await folder.getEntry(relativePath)
  return file.createTemporaryUrl()
}
```

**Called from**: Gallery hydration in `src/store/galleryStore.ts`

#### Gallery Loading Fallback Mechanism

When temporary URL creation fails (common in UXP environments), the gallery falls back to blob URLs:

```typescript
// In loadGalleryItems() - fallback to blob URL when temp URL fails
if ('blobUrl' in it && it.blobUrl) {
  console.warn('Using blob URL fallback for corrected image', it.relativePath)
  return { ...it, correctedUrl: it.blobUrl, thumbnailUrl: it.blobUrl }
}
```

This ensures corrected images display properly even when UXP filesystem APIs are unavailable.

## Code Locations Summary

| Component | File | Purpose |
|-----------|------|---------|
| Gemini API Integration | `src/services/gemini/GeminiService.ts` | API calls, blob conversions |
| Input Base64 Conversion | `src/services/gemini/GeminiService.ts::blobToBase64()` | Blob → base64 for API |
| API Request | `src/services/gemini/GeminiService.ts::makeGeminiRequest()` | Gemini API interaction |
| Response Processing | `src/services/gemini/GeminiService.ts::transformToCorrectImage()` | Base64 → blob conversion |
| Local Storage | `src/services/local/localBoltStorage.ts` | File persistence |
| Folder Dialog | `src/services/local/localBoltStorage.ts::promptForFolder()` | User folder selection |
| Temp URL Creation | `src/utils/uxpFs.ts::toTempUrl()` | Local file URL generation |

## Data Flow

```
Input Image Blob → Base64 → Gemini API → Base64 Response → Blob → Local Storage → Temp URL
       ↓              ↓          ↓            ↓            ↓         ↓            ↓
   Validation    API Request  Correction  Response Parse  Display   Persistence  UXP Display
```

## Key Differences from Firefly Workflow

| Aspect | Firefly Generation | Gemini Correction |
|--------|-------------------|-------------------|
| **Input** | Text prompt | Image blob + correction params |
| **API Response** | Signed S3 URL | Base64 image data |
| **Primary Conversion** | URL → Blob → Base64 (fallback) | Blob → Base64 → Blob |
| **Use Case** | Image creation | Image editing/improvement |
| **Storage Trigger** | Post-download | Post-API response |

## Configuration

- **Local Storage**: Controlled by `isLocalStorageMode()` from `storageMode.ts`
- **API Model**: Configurable via `VITE_GEMINI_MODEL` (default: `gemini-2.5-flash-image-preview`)
- **Correction Types**: Line cleanup, color correction, perspective adjustment, etc.
- **Size Limits**: 10MB input image limit

## Error Handling

- **Input Validation**: Image size, type, and correction parameters
- **API Errors**: Rate limiting, authentication, server errors
- **Conversion Failures**: Blob ↔ base64 conversion errors
- **Storage Failures**: Graceful fallback to memory-only storage
- **UXP Compatibility**: Automatic fallback mechanisms for different environments
- **Gallery Loading**: Blob URL fallback when temporary URL creation fails
- **Missing Metadata**: `relativePath` and `folderToken` now saved in metadata files for proper gallery reloading

## Performance Considerations

- **Base64 Overhead**: Larger memory footprint than blob URLs
- **API Latency**: Synchronous correction (no polling needed)
- **Local Storage**: Better for large correction workflows
- **Memory Management**: Blob URLs cleaned up automatically

## Integration Points

- **IMS Service**: Authentication for API access
- **Gallery Store**: Displays corrected images with before/after comparison
- **UXP Panel**: Provides correction parameter UI
- **Local Storage**: Persists corrections for gallery access</content>
<parameter name="filePath">/Users/christopherkruger/Projects/adobe/ppro_uxp_adobe/docs/gemini-image-correction-workflow.md