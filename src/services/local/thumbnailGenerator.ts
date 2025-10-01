/**
 * Video Thumbnail Generation Service
 * Generates and saves video thumbnails at the time of video generation/upload
 */

import { extractThumbnailFromBlob } from '../../utils/videoThumbnails';

/**
 * Generate a thumbnail from a video blob and save it locally
 * @param videoBlob - The video blob to generate thumbnail from
 * @param videoFilePath - Path where the video is saved
 * @param addon - Bolt addon instance (if available)
 * @returns Thumbnail data URL or null if generation fails
 */
export async function generateAndSaveVideoThumbnail(
  videoBlob: Blob,
  videoFilePath: string,
  addon?: any
): Promise<string | null> {
  try {
    console.log('[ThumbnailGenerator] Generating thumbnail for video:', videoFilePath);
    
    // Generate thumbnail at 1 second mark
    const thumbnailDataUrl = await extractThumbnailFromBlob(
      videoBlob,
      1.0, // 1 second into video
      640, // Higher resolution for better quality
      360
    );
    
    if (!thumbnailDataUrl) {
      console.warn('[ThumbnailGenerator] Failed to generate thumbnail - no data URL returned');
      return null;
    }
    
    console.log('[ThumbnailGenerator] Thumbnail generated successfully');
    
    // Save thumbnail to disk if Bolt addon is available
    if (addon && videoFilePath) {
      try {
        const thumbnailPath = videoFilePath.replace(/\.(mp4|mov|avi|webm)$/i, '_thumbnail.jpg');
        
        // Extract base64 data from data URL
        const base64Data = thumbnailDataUrl.split(',')[1];
        if (base64Data) {
          const writeSuccess = addon.writeFile?.(thumbnailPath, base64Data, true);
          if (writeSuccess !== false) {
            console.log('[ThumbnailGenerator] Thumbnail saved to disk:', thumbnailPath);
          } else {
            console.warn('[ThumbnailGenerator] Failed to write thumbnail to disk');
          }
        }
      } catch (error) {
        console.warn('[ThumbnailGenerator] Error saving thumbnail to disk:', error);
        // Continue with in-memory thumbnail even if disk save fails
      }
    }
    
    return thumbnailDataUrl;
  } catch (error) {
    console.error('[ThumbnailGenerator] Failed to generate thumbnail:', error);
    return null;
  }
}

/**
 * Load a saved thumbnail from disk
 * @param videoFilePath - Path to the video file
 * @param addon - Bolt addon instance
 * @returns Thumbnail data URL or null if not found
 */
export async function loadSavedThumbnail(
  videoFilePath: string,
  addon: any
): Promise<string | null> {
  if (!addon || !videoFilePath) {
    return null;
  }
  
  try {
    const thumbnailPath = videoFilePath.replace(/\.(mp4|mov|avi|webm)$/i, '_thumbnail.jpg');
    const base64Data = addon.readFile?.(thumbnailPath, true);
    
    if (base64Data && typeof base64Data === 'string') {
      console.log('[ThumbnailGenerator] Loaded thumbnail from disk:', thumbnailPath);
      return `data:image/jpeg;base64,${base64Data}`;
    }
    
    return null;
  } catch (error) {
    console.warn('[ThumbnailGenerator] Error loading thumbnail from disk:', error);
    return null;
  }
}
