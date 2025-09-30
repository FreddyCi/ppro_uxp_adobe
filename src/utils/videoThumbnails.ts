// Video thumbnail generation utilities
// For extracting thumbnails from video files in UXP environment

/**
 * Extract a thumbnail from a video file at a specific time
 * @param videoUrl - URL or blob URL of the video file
 * @param timeSeconds - Time in seconds to capture thumbnail (default: 1.0)
 * @param maxWidth - Maximum width of thumbnail (default: 320)
 * @param maxHeight - Maximum height of thumbnail (default: 180)
 * @returns Promise resolving to base64 data URL of the thumbnail
 */
export async function extractVideoThumbnail(
  videoUrl: string,
  timeSeconds: number = 1.0,
  maxWidth: number = 320,
  maxHeight: number = 180
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Create video element
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';

      // Create canvas for thumbnail extraction
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Set up video event handlers
      video.addEventListener('loadedmetadata', () => {
        // Seek to the desired time
        video.currentTime = Math.min(timeSeconds, video.duration * 0.1); // Use 10% of video duration if time is too long
      });

      video.addEventListener('seeked', () => {
        try {
          // Calculate canvas size maintaining aspect ratio
          const videoAspectRatio = video.videoWidth / video.videoHeight;
          let canvasWidth = maxWidth;
          let canvasHeight = maxHeight;

          if (videoAspectRatio > maxWidth / maxHeight) {
            // Video is wider than canvas aspect ratio
            canvasHeight = maxWidth / videoAspectRatio;
          } else {
            // Video is taller than canvas aspect ratio
            canvasWidth = maxHeight * videoAspectRatio;
          }

          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);

          // Convert to base64 data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

          // Clean up
          video.remove();
          canvas.remove();

          resolve(dataUrl);
        } catch (error) {
          // Clean up
          video.remove();
          canvas.remove();
          reject(error);
        }
      });

      video.addEventListener('error', (e) => {
        // Clean up
        video.remove();
        canvas.remove();
        reject(new Error(`Video loading failed: ${e.message || 'Unknown error'}`));
      });

      // Set timeout for loading
      const timeout = setTimeout(() => {
        video.remove();
        canvas.remove();
        reject(new Error('Video thumbnail extraction timed out'));
      }, 10000); // 10 second timeout

      // Start loading video
      video.src = videoUrl;

      // Clear timeout on success
      video.addEventListener('seeked', () => clearTimeout(timeout), { once: true });
      video.addEventListener('error', () => clearTimeout(timeout), { once: true });

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Extract thumbnail from video blob
 * @param videoBlob - Video blob
 * @param timeSeconds - Time in seconds to capture thumbnail
 * @param maxWidth - Maximum width of thumbnail
 * @param maxHeight - Maximum height of thumbnail
 * @returns Promise resolving to base64 data URL of the thumbnail
 */
export async function extractThumbnailFromBlob(
  videoBlob: Blob,
  timeSeconds: number = 1.0,
  maxWidth: number = 320,
  maxHeight: number = 180
): Promise<string> {
  // Create object URL from blob
  const videoUrl = URL.createObjectURL(videoBlob);

  try {
    const thumbnail = await extractVideoThumbnail(videoUrl, timeSeconds, maxWidth, maxHeight);
    return thumbnail;
  } finally {
    // Clean up object URL
    URL.revokeObjectURL(videoUrl);
  }
}

/**
 * Generate video metadata including thumbnail
 * @param videoUrl - URL of the video file
 * @param options - Options for thumbnail generation
 * @returns Promise resolving to video metadata with thumbnail
 */
export async function generateVideoMetadataWithThumbnail(
  videoUrl: string,
  options: {
    thumbnailTime?: number;
    maxThumbnailWidth?: number;
    maxThumbnailHeight?: number;
  } = {}
): Promise<{
  thumbnailUrl: string;
  duration?: number;
  width?: number;
  height?: number;
}> {
  const {
    thumbnailTime = 1.0,
    maxThumbnailWidth = 320,
    maxThumbnailHeight = 180
  } = options;

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';

    video.addEventListener('loadedmetadata', async () => {
      try {
        const duration = video.duration;
        const width = video.videoWidth;
        const height = video.videoHeight;

        // Extract thumbnail
        const thumbnailUrl = await extractVideoThumbnail(
          videoUrl,
          thumbnailTime,
          maxThumbnailWidth,
          maxThumbnailHeight
        );

        video.remove();

        resolve({
          thumbnailUrl,
          duration,
          width,
          height
        });
      } catch (error) {
        video.remove();
        reject(error);
      }
    });

    video.addEventListener('error', (e) => {
      video.remove();
      reject(new Error(`Video metadata extraction failed: ${e.message || 'Unknown error'}`));
    });

    video.src = videoUrl;
  });
}