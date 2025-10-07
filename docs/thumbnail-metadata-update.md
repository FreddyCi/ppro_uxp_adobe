# Video Thumbnail Metadata Update

## Summary
Updated the video thumbnail system to properly save thumbnail files to disk and store their paths in the metadata JSON files. This ensures thumbnails persist and can be loaded from the saved files instead of regenerating.

## Changes Made

### 1. Thumbnail Generator Service (`src/services/local/thumbnailGenerator.ts`)

**Added `ThumbnailResult` Interface:**
```typescript
export interface ThumbnailResult {
  blobUrl: string;          // Blob URL for immediate display
  filePath?: string;        // Full disk path to thumbnail file
  relativePath?: string;    // Relative path within folder (for UXP)
}
```

**Updated `generateAndSaveVideoThumbnail` Function:**
- Now accepts an options object with:
  - `addon`: Bolt addon instance (for non-UXP environments)
  - `uxpFolder`: UXP folder entry for saving thumbnail
  - `thumbnailFilename`: Optional custom filename
  - `baseFolder`: Base folder path for building full paths
  - `relativePath`: Video's relative path for calculating thumbnail relative path

- Returns `ThumbnailResult` instead of just a string URL
- Properly saves thumbnail files via UXP filesystem using `uxpFolder.createFile()`
- Calculates and returns both full path and relative path for metadata storage

### 2. Local Storage Services

**UXP Storage (`src/services/local/localBoltStorage.ts` - `saveGenerationAsset`):**
```typescript
// Generate thumbnail for video content
let thumbnailUrl: string | undefined
let thumbnailFilePath: string | undefined
let thumbnailRelativePath: string | undefined

if (options.metadata.contentType === 'video') {
  const thumbnailResult = await generateAndSaveVideoThumbnail(options.blob, file.nativePath, {
    uxpFolder: targetFolder,
    baseFolder: folderPath || undefined,
    relativePath: joinPath('/', dateFolder, safeFilename)
  })
  
  if (thumbnailResult) {
    thumbnailUrl = thumbnailResult.blobUrl
    thumbnailFilePath = thumbnailResult.filePath
    thumbnailRelativePath = thumbnailResult.relativePath
  }
}

// Add to metadata payload
const metadataPayload = {
  ...options.metadata,
  // ... other fields
  thumbnailUrl,           // Blob URL for immediate display
  thumbnailFilePath,      // Full disk path to _thumbnail.jpg
  thumbnailRelativePath   // Relative path: "2025-10-06/video_thumbnail.jpg"
}
```

**Bolt Storage (same file - Bolt addon path):**
- Updated similarly to call new signature and store all three fields

### 3. Content Types (`src/types/content.ts`)

**Updated `ContentItem` Interface:**
```typescript
export interface ContentItem extends BaseMetadata {
  // ... existing fields
  
  // Common display properties
  thumbnailUrl?: string           // Thumbnail blob URL or data URL
  thumbnailFilePath?: string      // Local filesystem path to thumbnail file
  thumbnailRelativePath?: string  // Relative path to thumbnail within UXP storage
  
  // ... other fields
}
```

### 4. Local Ingest Panel (`src/components/LocalIngest/LocalIngestPanel.tsx`)

**Updated `LocalClip` Interface:**
- Added `thumbnailFilePath?: string`
- Added `thumbnailRelativePath?: string`

**Updated Clip Detection:**
- Now extracts and includes thumbnail paths from content items:
```typescript
thumbnailUrl: item.thumbnailUrl || undefined,
thumbnailFilePath: item.thumbnailFilePath || undefined,
thumbnailRelativePath: item.thumbnailRelativePath || undefined,
```

**Enhanced Thumbnail Loading Logic:**
1. **First**: Check for existing `thumbnailUrl` (blob/data URL) - use if present
2. **Second**: Try to load from saved file using `thumbnailRelativePath`:
   ```typescript
   if (clip.thumbnailRelativePath && clip.folderToken) {
     const { toTempUrl } = await import('../../utils/uxpFs')
     const thumbnailUrl = await toTempUrl(
       clip.folderToken,
       clip.thumbnailRelativePath,
       'image/jpeg'
     )
     // Cache and use loaded thumbnail
   }
   ```
3. **Fallback**: Generate thumbnail from video if neither exists

## Metadata JSON Structure

### Before (Old Videos):
```json
{
  "filename": "video.mp4",
  "filePath": "/path/to/video.mp4",
  "relativePath": "2025-10-06/video.mp4",
  "thumbnailUrl": "blob:http://..."  // Only blob URL, lost on reload
}
```

### After (New Videos):
```json
{
  "filename": "video.mp4",
  "filePath": "/path/to/2025-10-06/video.mp4",
  "relativePath": "2025-10-06/video.mp4",
  "thumbnailUrl": "blob:http://...",                           // For immediate use
  "thumbnailFilePath": "/path/to/2025-10-06/video_thumbnail.jpg",  // Disk path
  "thumbnailRelativePath": "2025-10-06/video_thumbnail.jpg"    // Relative path
}
```

## Benefits

1. **Persistence**: Thumbnails are now saved to disk alongside videos
2. **Fast Loading**: Thumbnails can be loaded from saved files instead of regenerating
3. **Reliability**: Works even when blob URLs are lost or expired
4. **Correct Paths**: All paths are properly stored in metadata without blob:// prefixes
5. **Backward Compatible**: Old videos with `thumbnailUrl` still work; new feature adds extra fields

## File Naming Convention

For a video file: `my-video-2025-10-06.mp4`
- Thumbnail file: `my-video-2025-10-06_thumbnail.jpg`
- Saved in same folder as video
- Referenced in metadata JSON with both full and relative paths

## Example Flow

### When Saving a Video:
1. Video saved as `2025-10-06/video.mp4`
2. Thumbnail generated from first frame
3. Thumbnail saved as `2025-10-06/video_thumbnail.jpg`
4. Metadata JSON saved with:
   - `filePath`: Full path to video
   - `relativePath`: `2025-10-06/video.mp4`
   - `thumbnailUrl`: Blob URL (temporary)
   - `thumbnailFilePath`: Full path to thumbnail
   - `thumbnailRelativePath`: `2025-10-06/video_thumbnail.jpg`

### When Loading Clips:
1. Read metadata JSON
2. Check for `thumbnailUrl` (blob/data) → use if present
3. Else check for `thumbnailRelativePath` → load file from disk
4. Else generate thumbnail from video (last resort)

## Testing

After rebuild:
1. Generate a new video → Check metadata JSON has all three thumbnail fields
2. Verify `_thumbnail.jpg` file exists alongside video
3. Reload panel → Thumbnail should load from saved file
4. Old videos with `thumbnailUrl` should still work
5. Old videos without thumbnails will generate them and save properly

## Date: October 6, 2025
