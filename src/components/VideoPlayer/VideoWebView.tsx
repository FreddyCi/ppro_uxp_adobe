import React, { useEffect, useRef, useState } from 'react';

// Helper function to encode bytes to base64 (UXP-compatible)
function encodeBase64(bytes: Uint8Array): string {
  if (typeof btoa === 'function') {
    let binary = ''
    const chunkSize = 0x8000
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize)
      binary += Array.from(chunk, byte => String.fromCharCode(byte)).join('')
    }
    return btoa(binary)
  }

  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let result = ''
  let i = 0

  for (; i + 3 <= bytes.length; i += 3) {
    const triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
    result += base64Chars[(triplet >> 18) & 63]
    result += base64Chars[(triplet >> 12) & 63]
    result += base64Chars[(triplet >> 6) & 63]
    result += base64Chars[triplet & 63]
  }

  if (i < bytes.length) {
    const remaining = bytes.length - i
    const chunk = (bytes[i] << 16) | ((remaining > 1 ? bytes[i + 1] : 0) << 8)
    result += base64Chars[(chunk >> 18) & 63]
    result += base64Chars[(chunk >> 12) & 63]
    if (remaining === 2) {
      result += base64Chars[(chunk >> 6) & 63]
    }
    result += '='.repeat(3 - remaining)
  }

  return result
}

// Utility function to convert ArrayBuffer to base64 data URL (UXP-compatible)
async function arrayBufferToDataUrl(arrayBuffer: ArrayBuffer, mimeType: string): Promise<string> {
  try {
    const bytes = new Uint8Array(arrayBuffer)
    const base64 = encodeBase64(bytes)
    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error('Failed to convert ArrayBuffer to data URL:', error)
    throw error
  }
}

// Utility function to convert blob to base64 data URL (UXP-compatible, no FileReader)
async function blobToDataUrl(blob: Blob): Promise<string> {
  try {
    const arrayBuffer = await blob.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    const base64 = encodeBase64(bytes)
    const mimeType = blob.type || 'application/octet-stream'

    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error('Failed to convert blob to data URL:', error)
    throw error
  }
}

interface VideoWebViewProps {
  videoUrl?: string;
  videoBlob?: Blob;
  videoArrayBuffer?: ArrayBuffer;
  videoMimeType?: string;
  videoDataUrl?: string;
  poster?: string;
  width?: string | number;
  height?: string | number;
  onError?: (error: any) => void;
  onLoadedMetadata?: () => void;
  controls?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
}

/**
 * Video player component using UXP WebView for full HTML5 video support
 * WebView provides a real browser environment (Edge/Safari) that supports video playback
 * Accepts video data as blob, data URL, or regular URL
 */
export const VideoWebView: React.FC<VideoWebViewProps> = ({
  videoUrl,
  videoBlob,
  videoArrayBuffer,
  videoMimeType = 'video/mp4',
  videoDataUrl,
  poster,
  width = '100%',
  height = '200px',
  onError,
  onLoadedMetadata,
  controls = true,
  muted = true,
  autoPlay = false,
}) => {
  const webviewRef = useRef<any>(null);
  const [videoSrc, setVideoSrc] = useState<string>('');

    // Convert blob/arrayBuffer/dataUrl to videoSrc for the WebView
  useEffect(() => {
    console.log('🎬 [VideoWebView] Props received:', {
      hasVideoArrayBuffer: !!videoArrayBuffer,
      hasVideoBlob: !!videoBlob,
      hasVideoDataUrl: !!videoDataUrl,
      hasVideoUrl: !!videoUrl,
      videoArrayBufferSize: videoArrayBuffer?.byteLength,
      videoArrayBufferType: typeof videoArrayBuffer,
      videoArrayBufferConstructor: videoArrayBuffer?.constructor?.name,
      videoBlobType: videoBlob?.type,
      videoBlobSize: videoBlob?.size,
      videoMimeType
    })

    if (videoDataUrl) {
      console.log('✅ [VideoWebView] Using pre-converted data URL')
      setVideoSrc(videoDataUrl)
    } else if (videoArrayBuffer && videoArrayBuffer.byteLength > 0) {
      console.log('🔄 [VideoWebView] Converting ArrayBuffer to data URL...')
      arrayBufferToDataUrl(videoArrayBuffer, videoMimeType)
        .then((dataUrl) => {
          console.log('✅ [VideoWebView] ArrayBuffer converted to data URL:', {
            dataUrlLength: dataUrl.length,
            dataUrlPrefix: dataUrl.substring(0, 50)
          })
          setVideoSrc(dataUrl)
        })
        .catch((error) => {
          console.error('❌ [VideoWebView] Failed to convert ArrayBuffer to data URL:', error)
          if (onError) {
            onError(error)
          }
        })
    } else if (videoBlob) {
      console.log('🔄 [VideoWebView] Converting blob to data URL...')
      blobToDataUrl(videoBlob)
        .then((dataUrl) => {
          console.log('✅ [VideoWebView] Blob converted to data URL:', {
            dataUrlLength: dataUrl.length,
            dataUrlPrefix: dataUrl.substring(0, 50)
          })
          setVideoSrc(dataUrl)
        })
        .catch((error) => {
          console.error('❌ [VideoWebView] Failed to convert blob to data URL:', error)
          if (onError) {
            onError(error)
          }
        })
    } else if (videoUrl) {
      console.log('⚠️ [VideoWebView] Falling back to videoUrl (may not work in WebView):', videoUrl?.substring(0, 30))
      setVideoSrc(videoUrl)
    }
  }, [videoUrl, videoBlob, videoArrayBuffer, videoDataUrl, videoMimeType])

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview || !videoSrc) return;

    console.log('🎬 [VideoWebView] Creating WebView HTML with videoSrc:', {
      videoSrcLength: videoSrc.length,
      videoSrcPrefix: videoSrc.substring(0, 50),
      isDataUrl: videoSrc.startsWith('data:'),
      mimeType: videoSrc.match(/^data:([^;]+)/)?.[1]
    })

    // Generate the HTML content for the webview
    const videoHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            width: 100%;
            height: 100vh;
            overflow: hidden;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        </style>
      </head>
      <body>
        <video
          id="videoElement"
          ${controls ? 'controls' : ''}
          ${muted ? 'muted' : ''}
          ${autoPlay ? 'autoplay' : ''}
          ${poster ? `poster="${poster}"` : ''}
          src="${videoSrc}"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
        <script>
          const video = document.getElementById('videoElement');
          
          console.log('📺 [WebView Internal] Video element created:', {
            src: video.src.substring(0, 50),
            srcLength: video.src.length,
            readyState: video.readyState,
            networkState: video.networkState
          });
          
          video.addEventListener('loadedmetadata', () => {
            window.parent.postMessage({ type: 'loadedmetadata' }, '*');
          });
          
          video.addEventListener('error', (e) => {
            window.parent.postMessage({ 
              type: 'error',
              error: {
                code: video.error?.code,
                message: video.error?.message
              }
            }, '*');
          });
          
          video.addEventListener('canplay', () => {
            window.parent.postMessage({ type: 'canplay' }, '*');
          });
        </script>
      </body>
      </html>
    `;

    // Set the HTML content
    // Note: UXP webview uses 'src' with a data URI or you can use srcdoc
    const dataUri = `data:text/html;charset=utf-8,${encodeURIComponent(videoHTML)}`;
    webview.setAttribute('src', dataUri);

    // Listen for messages from the webview
    const handleMessage = (event: any) => {
      if (event.data.type === 'error' && onError) {
        onError(event.data.error);
      } else if (event.data.type === 'loadedmetadata' && onLoadedMetadata) {
        onLoadedMetadata();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [videoUrl, poster, controls, muted, autoPlay, onError, onLoadedMetadata]);

  return (
    <webview
      ref={webviewRef}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        border: 'none',
        backgroundColor: '#000',
      }}
    />
  );
};
