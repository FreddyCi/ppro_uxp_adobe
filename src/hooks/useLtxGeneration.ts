import { LtxVideoService } from '../services/ltx';
import { saveGenerationLocally } from '../services/local/localBoltStorage';

interface ToastHelpers {
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
}

interface LtxGenerationParams {
  ltxPrompt: string;
  ltxDuration: number;
  ltxFps: number;
  ltxWidth: number;
  ltxHeight: number;
  ltxSeed: number;
  setIsGeneratingLtx: (value: boolean) => void;
  addGeneration: (result: any) => void;
  toastHelpers: ToastHelpers;
}

export function useLtxGeneration(params: LtxGenerationParams) {
  const {
    ltxPrompt,
    ltxDuration,
    ltxFps,
    ltxWidth,
    ltxHeight,
    ltxSeed,
    setIsGeneratingLtx,
    addGeneration,
    toastHelpers
  } = params;

  const { showSuccess, showError, showWarning, showInfo } = toastHelpers;

  const handleGenerateLtxVideo = async () => {
    if (!ltxPrompt.trim()) {
      showWarning('Missing Prompt', 'Please enter a description for your video.');
      return;
    }

    setIsGeneratingLtx(true);

    try {
      showInfo('Generating Video', `Creating "${ltxPrompt.substring(0, 50)}${ltxPrompt.length > 50 ? '...' : ''}"`);
      
      console.log('🎬 Starting LTX video generation...');
      console.log('📝 LTX generation parameters:', {
        prompt: ltxPrompt,
        duration_seconds: ltxDuration,
        fps: ltxFps,
        width: ltxWidth,
        height: ltxHeight,
        seed: ltxSeed > 0 ? ltxSeed : undefined
      });
      
      // Import LTX service
      // const { LtxVideoService } = await import('./services/ltx');
      
      // Create LTX service instance
      const ltxService = new LtxVideoService({
        timeout: 240_000, // 4 minutes for video generation
      });
      
      // Build LTX request
      const ltxRequest = {
        prompt: ltxPrompt,
        duration_seconds: ltxDuration,
        fps: ltxFps,
        width: ltxWidth,
        height: ltxHeight,
        seed: ltxSeed > 0 ? ltxSeed : undefined
      };
      
      console.log('🚀 Sending LTX generation request:', ltxRequest);
      
      // Call LTX API
      const result = await ltxService.generateVideo(ltxRequest);
      console.log('✅ LTX video generation completed:', result);
      
      // Save video to local storage
      console.log('💾 Saving LTX video to local storage...');
      const localSaveResult = await saveGenerationLocally({
        blob: result.blob,
        metadata: {
          prompt: ltxPrompt,
          seed: ltxSeed > 0 ? ltxSeed : Math.floor(Math.random() * 999999),
          jobId: result.metadata.requestId,
          model: 'LTX Video',
          version: '1.0',
          timestamp: Date.now(),
          filename: result.filename,
          contentType: result.contentType,
          fileSize: result.blob.size,
          duration: ltxDuration,
          fps: ltxFps,
          resolution: { width: ltxWidth, height: ltxHeight },
          persistenceMethod: 'local' as const,
          storageMode: 'local' as const,
        },
        filename: result.filename,
      });
      
      if (!localSaveResult) {
        console.warn('⚠️ Local save failed, falling back to data URL');
        // Fallback to data URL if local save fails
        const arrayBuffer = await result.blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const base64 = btoa(String.fromCharCode(...bytes));
        const videoUrl = `data:${result.contentType};base64,${base64}`;
        
        // Create generation result for the video
        const videoGenerationResult = {
          id: result.filename,
          imageUrl: videoUrl,
          videoUrl: videoUrl,
          videoBlob: result.blob,
          seed: ltxSeed > 0 ? ltxSeed : Math.floor(Math.random() * 999999),
          contentType: 'video' as const,
          duration: ltxDuration,
          fps: ltxFps,
          resolution: { width: ltxWidth, height: ltxHeight },
          metadata: {
            prompt: ltxPrompt,
            seed: ltxSeed > 0 ? ltxSeed : Math.floor(Math.random() * 999999),
            jobId: result.metadata.requestId,
            model: 'LTX Video',
            version: '1.0',
            timestamp: Date.now(),
            filename: result.filename,
            contentType: result.contentType,
            fileSize: result.blob.size,
            duration: ltxDuration,
            fps: ltxFps,
            resolution: { width: ltxWidth, height: ltxHeight },
            persistenceMethod: 'dataUrl' as const,
            storageMode: 'local' as const,
          },
          timestamp: Date.now(),
          status: 'generated' as const,
          blobUrl: videoUrl,
          localPath: result.filename,
        };
        
        // Add video to generation store
        addGeneration(videoGenerationResult);
        
        showSuccess('Video Generated', `Generated "${result.filename}" (${(result.blob.size / 1024 / 1024).toFixed(2)} MB) - saved in memory only`);
        
        console.log('🎥 Video added to gallery store (data URL fallback):', {
          id: videoGenerationResult.id,
          videoUrl,
          filename: result.filename,
          size: result.blob.size
        });
      } else {
        console.log('✅ LTX video saved locally:', localSaveResult);
        
        // Create generation result for the video with local file reference
        const videoGenerationResult = {
          id: result.filename, // Use filename as ID to match synced files
          imageUrl: '', // Will be set by toTempUrl in gallery
          videoUrl: '', // Will be set by toTempUrl in gallery
          videoBlob: result.blob,
          seed: ltxSeed > 0 ? ltxSeed : Math.floor(Math.random() * 999999),
          contentType: 'video' as const,
          duration: ltxDuration,
          fps: ltxFps,
          resolution: { width: ltxWidth, height: ltxHeight },
          metadata: {
            prompt: ltxPrompt,
            seed: ltxSeed > 0 ? ltxSeed : Math.floor(Math.random() * 999999),
            jobId: result.metadata.requestId,
            model: 'LTX Video',
            version: '1.0',
            timestamp: Date.now(),
            filename: result.filename,
            contentType: result.contentType,
            fileSize: result.blob.size,
            duration: ltxDuration,
            fps: ltxFps,
            resolution: { width: ltxWidth, height: ltxHeight },
            persistenceMethod: 'local' as const,
            storageMode: 'local' as const,
            folderToken: localSaveResult.folderToken,
            relativePath: localSaveResult.relativePath,
            localFilePath: localSaveResult.filePath,
          },
          timestamp: Date.now(),
          status: 'generated' as const,
          localPath: localSaveResult.filePath,
        };
        
        // Add video to generation store
        addGeneration(videoGenerationResult);
        
        showSuccess('Video Generated', `Generated "${result.filename}" (${(result.blob.size / 1024 / 1024).toFixed(2)} MB) - saved to ${localSaveResult.displayPath || localSaveResult.filePath}`);
        
        console.log('🎥 Video added to gallery store (local file):', {
          id: videoGenerationResult.id,
          localPath: localSaveResult.filePath,
          relativePath: localSaveResult.relativePath,
          filename: result.filename,
          size: result.blob.size
        });
      }
      
    } catch (error: any) {
      console.error('❌ LTX video generation failed:', error);
      console.error('🔍 Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        status: error.status,
        errorBody: error.errorBody,
        stack: error.stack
      });
      
      // Extract meaningful error message
      let errorMessage = 'An unexpected error occurred.';
      let errorTitle = 'Video Generation Failed';
      
      if (error.errorBody) {
        // Try to extract error from the error body
        if (typeof error.errorBody === 'string') {
          errorMessage = error.errorBody;
        } else if (error.errorBody.error) {
          errorMessage = error.errorBody.error;
        } else if (error.errorBody.message) {
          errorMessage = error.errorBody.message;
        } else if (error.errorBody.detail) {
          errorMessage = error.errorBody.detail;
        } else {
          errorMessage = JSON.stringify(error.errorBody);
        }
      } else if (error.message && error.message !== '[object Object]') {
        errorMessage = error.message;
      }
      
      // Provide user-friendly messages for common errors
      if (error.status === 422) {
        errorTitle = 'Invalid Request';
        if (errorMessage.includes('prompt')) {
          errorMessage = 'The video prompt is invalid. Please try a different description.';
        } else if (errorMessage.includes('duration') || errorMessage.includes('length')) {
          errorMessage = 'The video duration is invalid. Please adjust the duration.';
        } else if (errorMessage.includes('resolution') || errorMessage.includes('width') || errorMessage.includes('height')) {
          errorMessage = 'The video resolution is invalid. Please select a different resolution.';
        }
      } else if (error.status === 429) {
        errorTitle = 'Rate Limit Exceeded';
        errorMessage = 'Too many requests. Please wait a moment before generating again.';
      } else if (error.status === 503 || error.status === 502) {
        errorTitle = 'Service Unavailable';
        errorMessage = 'The LTX API is temporarily unavailable. Please try again shortly.';
      }
      
      showError(errorTitle, errorMessage);
    } finally {
      setIsGeneratingLtx(false);
    }
  };

  return { handleGenerateLtxVideo };
}
