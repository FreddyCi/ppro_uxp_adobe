import React, { useEffect, useRef, useState } from 'react';

const storage = require('uxp').storage;
const fs = storage.localFileSystem;

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

  const [webviewSrc, setWebviewSrc] = useState<string>('');

  useEffect(() => {
    if (!videoSrc) return;

    const createWebViewFile = async () => {
      try {
        console.log('🎬 [VideoWebView] Creating webview HTML file with video');
        
        // Escape video src for HTML attribute
        const escapedVideoSrc = videoSrc.replace(/"/g, '&quot;');
        
        const videoHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 100%; height: 100vh; overflow: hidden; background: #000; display: flex; flex-direction: column; }
    video { width: 100%; flex: 1; object-fit: contain; background: #000; }
    #status { color: #0f0; background: rgba(0,0,0,0.8); padding: 5px; font-family: monospace; font-size: 10px; max-height: 50px; overflow-y: auto; }
  </style>
</head>
<body>
  <div id="status">Loading video...</div>
  <video id="videoElement" ${controls ? 'controls' : ''} ${muted ? 'muted' : ''} ${autoPlay ? 'autoplay' : ''} ${poster ? `poster="${poster}"` : ''} preload="metadata" src="${escapedVideoSrc}">
    Your browser does not support the video tag.
  </video>
  <script>
    const video = document.getElementById('videoElement');
    const status = document.getElementById('status');
    
    function log(msg) {
      console.log(msg);
      status.innerHTML += '<br>' + msg;
      status.scrollTop = status.scrollHeight;
    }
    
    log('Video src: ' + video.src.length + ' bytes');
    
    video.addEventListener('loadstart', () => log('✅ loadstart'));
    video.addEventListener('loadedmetadata', () => log('✅ metadata - ' + video.duration + 's'));
    video.addEventListener('loadeddata', () => log('✅ loadeddata'));
    video.addEventListener('canplay', () => log('✅ canplay'));
    video.addEventListener('canplaythrough', () => log('✅ canplaythrough'));
    video.addEventListener('playing', () => log('▶️ playing'));
    video.addEventListener('error', (e) => {
      const err = video.error;
      log('❌ ERROR ' + err.code + ': ' + err.message);
    });
  </script>
</body>
</html>`;

        // Get temp folder
        const tempFolder = await fs.getTemporaryFolder();
        
        // Create unique filename
        const filename = `webview-${Date.now()}.html`;
        const file = await tempFolder.createFile(filename, { overwrite: true });
        
        // Write HTML content
        await file.write(videoHTML);
        
        // Get file URL
        const fileUrl = `file://${file.nativePath}`;
        console.log('✅ [VideoWebView] Video HTML file created:', { 
          fileUrl, 
          nativePath: file.nativePath,
          videoSrcLength: videoSrc.length
        });
        
        setWebviewSrc(fileUrl);
      } catch (error) {
        console.error('❌ [VideoWebView] Error creating webview file:', error);
      }
    };

    createWebViewFile();
  }, [videoSrc]);

  // Don't render until we have videoSrc
  if (!videoSrc) {
    return (
      <div style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        backgroundColor: '#333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '12px'
      }}>
        Loading video...
      </div>
    );
  }

  return (
    <div style={{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      backgroundColor: '#ff0000', // RED background to see if container renders
      border: '2px solid yellow',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        color: 'white',
        background: 'blue',
        padding: '5px',
        fontSize: '10px',
        zIndex: 1000
      }}>
        WEBVIEW CONTAINER (data URL: {videoSrc?.substring(0, 30)}...)
      </div>
      <webview
        key={`webview-${videoSrc.substring(0, 50)}`}
        ref={webviewRef}
        src={webviewSrc}
        style={{
          width: '100%',
          height: '100%',
          border: '3px solid cyan',
          backgroundColor: '#00ff00', // GREEN background for webview itself
        }}
      />
    </div>
  );
};
