# Firefly Service Image Generation and Local Storage Workflow

## Overview

This document describes the complete workflow for generating images using Adobe Firefly Service (FFS) API, converting signed URLs to base64 for UXP compatibility, and storing images locally within the Premiere Pro UXP panel.

## Workflow Steps

### 1. Firefly API Call and Image Generation

**Location**: `src/services/firefly/FireflyService.ts`

- User initiates image generation through the UXP panel UI
- `FireflyService.generateImages()` method calls the FFS API
- API returns a signed S3 URL for the generated image
- Code downloads the image from the signed URL as a `Blob`

### 2. Signed URL to Base64 Conversion

**Location**: `src/services/firefly/FireflyService.ts` - `convertBlobToDataUrl()` method

When the downloaded blob needs to be converted to a format compatible with UXP:

```typescript
private async convertBlobToDataUrl(blob: Blob): Promise<string> {
  try {
    const arrayBuffer = await blob.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    const base64 = this.encodeBase64(bytes)
    const mimeType = blob.type || 'application/octet-stream'

    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error('Failed to convert blob to data URL:', error)
    throw error
  }
}
```

**Purpose**: Creates base64 data URLs as fallback when blob URLs fail in UXP environment.

**Flow**:
1. Try to create `blob:` URL first (preferred for performance)
2. If blob URLs fail → fallback to `convertBlobToDataUrl()`
3. Result: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`

### 3. Local Storage Process

**Location**: `src/services/local/localBoltStorage.ts`

When `useLocalStorage` is enabled, images are saved locally:

#### Bolt Hybrid Addon (Preferred)
- Uses native filesystem APIs through the Bolt UXP hybrid addon
- Converts blob to base64 using `arrayBufferToBase64()` for file writing
- Saves to user-selected directory structure

#### UXP Fallback
- Uses UXP filesystem APIs directly
- Shows folder picker dialog on first use via `promptForFolder()`
- Stores persistent folder tokens for subsequent saves

**Key Methods**:
- `saveGenerationLocally()` - Main entry point
- `promptForFolder()` - Shows folder selection dialog
- `ensureFolder()` - Manages folder tokens and permissions

### 4. UXP UI Display

**Location**: `src/store/galleryStore.ts` - `loadGalleryItems()` function

For displaying stored local images in the UXP panel:

#### Cloud Images
- Use signed URLs directly (durable URLs)

#### Local Images
- Use temporary UXP URLs created by `toTempUrl()` in `src/utils/uxpFs.ts`
- Better performance than base64 for large files

```typescript
// Creates temporary filesystem URLs for local files
export async function toTempUrl(folderToken: string, relativePath: string): Promise<string> {
  const folder = await fs.getEntryForPersistentToken(folderToken)
  const file = await folder.getEntry(relativePath)
  return file.createTemporaryUrl()
}
```

## Code Locations Summary

| Component | File | Purpose |
|-----------|------|---------|
| FFS API Integration | `src/services/firefly/FireflyService.ts` | API calls, blob downloads |
| Base64 Conversion | `src/services/firefly/FireflyService.ts::convertBlobToDataUrl()` | Signed URL → base64 data URL |
| Local Storage (Bolt) | `src/services/local/localBoltStorage.ts` | Hybrid addon storage |
| Local Storage (UXP) | `src/services/local/localBoltStorage.ts::UxpLocalStorage` | Fallback UXP storage |
| Folder Dialog | `src/services/local/localBoltStorage.ts::promptForFolder()` | User folder selection |
| Gallery Display | `src/store/galleryStore.ts::loadGalleryItems()` | Image URL hydration |
| Temp URL Creation | `src/utils/uxpFs.ts::toTempUrl()` | Local file URL generation |

## Data Flow

```
FFS API → Signed URL → Blob Download → Base64 Data URL (fallback)
                                      ↓
                               Local Storage (Bolt/UXP)
                                      ↓
                            Gallery Display (Temp URLs)
```

## Configuration

- **Local Storage**: Controlled by `useLocalStorage` property in FireflyService
- **Storage Mode**: `azure` (cloud) vs `local` (filesystem)
- **Folder Tokens**: Persisted in localStorage for UXP filesystem access
- **Base64 Fallback**: Used when blob URLs fail in UXP environment

## Error Handling

- Blob URL creation failures → automatic fallback to base64
- Invalid folder tokens → re-prompt user for folder selection
- Storage failures → graceful degradation to cloud-only mode
- File read errors → mark items as "broken" in gallery
- **Missing Metadata**: `relativePath` and `folderToken` now saved in metadata files for proper gallery reloading

## Performance Considerations

- **Blob URLs**: Preferred for better performance and memory usage
- **Base64**: Used only as fallback (larger memory footprint)
- **Temp URLs**: Best for local files (filesystem-native access)
- **Caching**: Folder tokens prevent repeated dialog prompts</content>
<parameter name="filePath">/Users/christopherkruger/Projects/adobe/ppro_uxp_adobe/docs/firefly-image-generation-workflow.md