import { LumaVideoService, LumaImageService } from '../services/luma';
import type { ContentItem } from '../types/content';
import type { LumaGenerationRequest, LumaVideoModel, LumaReframeVideoRequest, ReframeVideoModel, LumaImageModel, LumaImageGenerationRequest } from '../types/luma';
import type { GenerationResult } from '../types/firefly';
import { uploadBlobWithSAS } from '../utils/azureUpload';
import { encodeBase64, convertBlobToDataUrl } from '../utils/base64';
import { createSASTokenService } from '../services/blob/SASTokenService';
import { ensureAuthenticated } from '../store/authStore';
import { saveGenerationLocally } from '../services/local/localBoltStorage';
import { selectHasSAS } from '../store/uiStore';
import { uploadBytes } from '../services/sasUpload';
import { uxp } from '../globals';

interface ToastHelpers {
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
}

interface LumaGenerationParams {
  // Video generation params
  lumaPrompt: string;
  lumaModel: string;
  lumaAspectRatio: string;
  lumaDuration: string;
  lumaResolution: string;
  lumaLoop: boolean;
  lumaFirstFrameItem: ContentItem | null;
  lumaLastFrameItem: ContentItem | null;
  lumaMode: 'keyframes' | 'reframe';
  lumaReframeVideoItem: ContentItem | null;
  
  // Image generation params
  lumaImageReferences: Array<{file: File | null, weight: number}>;
  lumaStyleReference: {file: any | null, weight: number};
  lumaCharacterReferences: Array<Array<File | ContentItem | null>>;
  lumaModifyImage: {file: File | ContentItem | null, weight: number};
  
  // State setters and auth
  isAuthed: boolean;
  setIsGeneratingLuma: (value: boolean) => void;
  addGeneration: (result: any) => void;
  toastHelpers: ToastHelpers;
}

export function useLumaGeneration(params: LumaGenerationParams) {
  const {
    lumaPrompt,
    lumaModel,
    lumaAspectRatio,
    lumaDuration,
    lumaResolution,
    lumaLoop,
    lumaFirstFrameItem,
    lumaLastFrameItem,
    lumaMode,
    lumaReframeVideoItem,
    lumaImageReferences,
    lumaStyleReference,
    lumaCharacterReferences,
    lumaModifyImage,
    isAuthed,
    setIsGeneratingLuma,
    addGeneration,
    toastHelpers
  } = params;

  const { showSuccess, showError, showWarning, showInfo } = toastHelpers;

  const handleGenerateLumaVideo = async () => {
    console.log('🎬 Luma generate button clicked - keyframes mode');
    console.log('📝 Current state:', {
      lumaPrompt: lumaPrompt?.substring(0, 50) + '...',
      lumaMode,
      isAuthed,
      lumaFirstFrameItem: !!lumaFirstFrameItem,
      lumaLastFrameItem: !!lumaLastFrameItem
    });

    if (!lumaPrompt.trim()) {
      showWarning('Missing Prompt', 'Please enter a description for your video.');
      return;
    }

    // Ensure user is authenticated before proceeding
    await ensureAuthenticated();
    if (!isAuthed) {
      return; // ensureAuthenticated handles the error toast
    }

    // Input validation
    if (lumaPrompt.length > 1000) {
      showWarning('Prompt Too Long', 'Please keep your prompt under 1000 characters.');
      return;
    }

    // Validate model selection
    const validModels = ['ray-3', 'ray-2', 'ray-flash-2', 'ray-1-6'];
    if (!validModels.includes(lumaModel)) {
      showWarning('Invalid Model', 'Please select a valid Dream Machine model.');
      return;
    }

    // Validate aspect ratio
    const validAspectRatios = ['16:9', '9:16', '1:1', '21:9'];
    if (!validAspectRatios.includes(lumaAspectRatio)) {
      showWarning('Invalid Aspect Ratio', 'Please select a valid aspect ratio.');
      return;
    }

    // Validate duration
    const validDurations = ['5s', '9s'];
    if (!validDurations.includes(lumaDuration)) {
      showWarning('Invalid Duration', 'Please select a valid duration.');
      return;
    }

    // Validate resolution
    const validResolutions = ['540p', '720p', '1080p', '4k'];
    if (!validResolutions.includes(lumaResolution)) {
      showWarning('Invalid Resolution', 'Please select a valid resolution.');
      return;
    }

    setIsGeneratingLuma(true);

    const resolutionLookup: Record<string, { width: number; height: number }> = {
      '540p': { width: 960, height: 540 },
      '720p': { width: 1280, height: 720 },
      '1080p': { width: 1920, height: 1080 },
      '1440p': { width: 2560, height: 1440 },
      '4k': { width: 3840, height: 2160 },
    }

    try {
      const generationSessionId = `luma-gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      showInfo('Generating Video', `Dreaming up "${lumaPrompt.substring(0, 50)}${lumaPrompt.length > 50 ? '...' : ''}"`);

      console.log(`🎞️ [${generationSessionId}] Starting Luma Dream Machine video generation...`);
      console.log(`📝 [${generationSessionId}] Luma generation parameters:`, {
        prompt: lumaPrompt,
        model: lumaModel,
        aspect_ratio: lumaAspectRatio,
        duration: lumaDuration,
        resolution: lumaResolution,
        loop: lumaLoop,
        frame0: lumaFirstFrameItem ? lumaFirstFrameItem.filename : undefined,
        frame1: lumaLastFrameItem ? lumaLastFrameItem.filename : undefined,
      });

      // Preflight check: Validate keyframe URLs if provided
      const validateKeyframeUrl = async (url: string | undefined, frameName: string): Promise<boolean> => {
        if (!url) return true; // Optional keyframes are OK

        try {
          console.log(`🔍 Preflight check: Testing ${frameName} URL accessibility...`);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

          const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            console.warn(`⚠️ ${frameName} URL returned ${response.status}: ${url}`);
            showWarning(`${frameName} URL Issue`, `The ${frameName.toLowerCase()} may not be accessible (${response.status}). Generation may fail.`);
            return false;
          }
          console.log(`✅ ${frameName} URL is accessible`);
          return true;
        } catch (error) {
          console.warn(`⚠️ ${frameName} URL preflight failed:`, error);
          showWarning(`${frameName} URL Issue`, `Cannot verify ${frameName.toLowerCase()} accessibility. Generation may fail.`);
          return false;
        }
      };

      // Helper function to prepare keyframe URLs for Luma API
      const prepareKeyframeUrl = async (contentItem: ContentItem | null): Promise<string | undefined> => {
        if (!contentItem) return undefined;

        // Reuse any existing HTTPS URL before attempting upload
        const existingUrl = [
          (contentItem as any)?.azureMetadata?.blobUrl,
          contentItem.displayUrl,
          contentItem.thumbnailUrl,
          contentItem.blobUrl
        ].find((url): url is string => typeof url === 'string' && url.startsWith('https://'));

        if (existingUrl) {
          return existingUrl;
        }

        // Check if SAS is configured (separate from IMS auth)
        if (!selectHasSAS()) {
          const message = 'Azure SAS token not configured. Set VITE_AZURE_CONTAINER_SAS_URL or SAS parts in .env and rebuild.';
          showError('Azure SAS Missing', message);
          throw new Error(message);
        }

        if (!contentItem.folderToken || !contentItem.relativePath) {
          const message = 'Missing local file reference for the selected keyframe. Please resync your gallery.';
          showError('Keyframe Unavailable', message);
          throw new Error(message);
        }

        try {
          console.log('☁️ Preparing keyframe URL for Azure SAS upload:', contentItem.filename);

          // Read the file from UXP file system
          const fs = uxp.storage.localFileSystem;
          const folder = await fs.getEntryForPersistentToken(contentItem.folderToken);
          const file = await folder.getEntry(contentItem.relativePath);
          const binaryFormat = uxp.storage.formats?.binary;
          const readOptions = binaryFormat ? { format: binaryFormat } : undefined;
          const fileData = await file.read(readOptions);

          // Generate unique blob name
          const sanitizedFilename = contentItem.filename || `keyframe-${Date.now()}.jpg`;
          const blobName = `luma/${new Date().toISOString().split('T')[0]}/${Date.now()}-${sanitizedFilename}`;
          const contentType = contentItem.mimeType || 'image/jpeg';

          // Upload using SAS token (no IMS auth required for Azure)
          const uploadedUrl = await uploadBytes(blobName, fileData, contentType);

          if (!uploadedUrl || !uploadedUrl.startsWith('https://')) {
            throw new Error('Azure SAS upload did not return a secure HTTPS URL');
          }

          console.log('✅ Keyframe uploaded to Azure via SAS:', uploadedUrl);
          return uploadedUrl;
        } catch (error: any) {
          // Handle SAS-specific errors
          if (error?.message?.includes('SAS token expired') || error?.message?.includes('AuthenticationFailed')) {
            const message = 'Azure SAS token expired or invalid. Update VITE_AZURE_* env vars and rebuild.';
            showError('SAS Token Expired', message);
            throw new Error(message);
          }

          const message = error instanceof Error ? error.message : 'Unknown error while uploading keyframe to Azure.';
          showError('Azure Upload Failed', message);
          console.error('❌ Failed to upload keyframe to Azure:', error);
          throw error instanceof Error ? error : new Error(message);
        }
      };

      const lumaService = new LumaVideoService({
        pollIntervalMs: 5_000,
        maxPollAttempts: 120,
      });

      // Prepare keyframe URLs
      const [frame0Url, frame1Url] = await Promise.all([
        prepareKeyframeUrl(lumaFirstFrameItem),
        prepareKeyframeUrl(lumaLastFrameItem)
      ]);

      const lumaRequest: LumaGenerationRequest = {
        prompt: lumaPrompt,
        model: lumaModel as LumaVideoModel,
        aspect_ratio: lumaAspectRatio,
        duration: lumaDuration,
        resolution: lumaResolution,
        loop: lumaLoop,
        keyframes: {
          ...(frame0Url && {
            frame0: {
              type: 'image' as const,
              url: frame0Url
            }
          }),
          ...(frame1Url && {
            frame1: {
              type: 'image' as const,
              url: frame1Url
            }
          }),
        },
      };

      console.log(`🚀 [${generationSessionId}] Sending Luma Dream Machine request:`, {
        ...lumaRequest,
        frame0_url: frame0Url,
        frame1_url: frame1Url,
        frame0_type: lumaFirstFrameItem?.blobUrl ? 'blobUrl' : 'displayUrl',
        frame1_type: lumaLastFrameItem?.blobUrl ? 'blobUrl' : 'displayUrl',
      });

      const result = await lumaService.generateVideo(lumaRequest);
      const jobId = result.metadata?.id;
      console.log(`✅ [${generationSessionId}] Luma Dream Machine generation completed - Job ID: ${jobId}`, result);

      const durationSeconds = parseInt(lumaDuration.replace(/[^0-9]/g, ''), 10) || undefined;
      const computedSeed = Math.floor(Math.random() * 999999);
      const resolutionKey = typeof lumaResolution === 'string' ? lumaResolution.toLowerCase() : '';
      const resolutionSize = resolutionLookup[resolutionKey] ?? undefined;

      console.log(`💾 [${generationSessionId}] Saving Luma Dream Machine video to local storage - Job ID: ${jobId}...`);
      const localSaveResult = await saveGenerationLocally({
        blob: result.blob,
        metadata: {
          prompt: result.metadata.prompt || lumaPrompt,
          seed: computedSeed,
          jobId: result.metadata.id,
          model: result.metadata.model || lumaModel,
          version: 'Dream Machine 1.1.0',
          timestamp: Date.now(),
          filename: result.filename,
          contentType: result.contentType,
          fileSize: result.blob.size,
          duration: durationSeconds,
          fps: undefined,
          resolution: resolutionSize,
          persistenceMethod: 'local' as const,
          storageMode: 'local' as const,
        },
        filename: result.filename,
      });

      if (!localSaveResult) {
        console.warn('⚠️ Local save failed, falling back to data URL');

        const arrayBuffer = await result.blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const base64 = btoa(String.fromCharCode(...bytes));
        const videoUrl = `data:${result.contentType};base64,${base64}`;

        const videoGenerationResult = {
          id: result.filename,
          imageUrl: '',
          videoUrl,
          videoBlob: result.blob,
          seed: computedSeed,
          contentType: 'video' as const,
          duration: durationSeconds,
          fps: undefined,
          resolution: resolutionSize,
          metadata: {
            prompt: result.metadata.prompt || lumaPrompt,
            seed: computedSeed,
            jobId: result.metadata.id,
            model: result.metadata.model || lumaModel,
            version: 'Dream Machine 1.1.0',
            timestamp: Date.now(),
            filename: result.filename,
            contentType: result.contentType,
            fileSize: result.blob.size,
            duration: durationSeconds,
            fps: undefined,
            resolution: resolutionSize,
            persistenceMethod: 'dataUrl' as const,
            storageMode: 'local' as const,
          },
          timestamp: Date.now(),
          status: 'generated' as const,
          blobUrl: videoUrl,
          localPath: result.filename,
        };

        addGeneration(videoGenerationResult);

        showSuccess(
          'Video Generated',
          `Generated "${result.filename}" (${(result.blob.size / 1024 / 1024).toFixed(2)} MB) - saved in memory only`
        );

        console.log(`🎥 [${generationSessionId}] Video added to gallery store (data URL fallback) - Job ID: ${jobId}:`, {
          id: videoGenerationResult.id,
          videoUrl,
          filename: result.filename,
          size: result.blob.size,
        });
      } else {
        console.log(`✅ [${generationSessionId}] Luma Dream Machine video saved locally - Job ID: ${jobId}`, localSaveResult);

        // Generate displayable video URL from local file
        let videoUrl = '';
        try {
          if (localSaveResult.folderToken && localSaveResult.relativePath) {
            const { toTempUrl } = await import('../utils/uxpFs');
            videoUrl = await toTempUrl(
              localSaveResult.folderToken,
              localSaveResult.relativePath,
              result.contentType
            );
            console.log(`🎬 [${generationSessionId}] Created displayable video URL:`, videoUrl.substring(0, 50) + '...');
          }
        } catch (urlError) {
          console.warn(`⚠️ [${generationSessionId}] Failed to create displayable video URL:`, urlError);
        }

        // Note: Thumbnail generation is skipped here for performance
        // The gallery auto-refresh will generate thumbnails asynchronously
        const thumbnailUrl = '';

        const videoGenerationResult = {
          id: result.filename,
          imageUrl: thumbnailUrl || videoUrl || '', // Use thumbnail if available, fallback to video URL
          videoUrl: videoUrl || '',
          videoBlob: result.blob,
          seed: computedSeed,
          contentType: 'video' as const,
          duration: durationSeconds,
          fps: undefined,
          resolution: resolutionSize,
          metadata: {
            prompt: result.metadata.prompt || lumaPrompt,
            seed: computedSeed,
            jobId: result.metadata.id,
            model: result.metadata.model || lumaModel,
            version: 'Dream Machine 1.1.0',
            timestamp: Date.now(),
            filename: result.filename,
            contentType: result.contentType,
            fileSize: result.blob.size,
            duration: durationSeconds,
            fps: undefined,
            resolution: resolutionSize,
            persistenceMethod: 'local' as const,
            storageMode: 'local' as const,
            folderToken: localSaveResult.folderToken ?? null,
            localFilePath: localSaveResult.filePath,
            localMetadataPath: localSaveResult.metadataPath,
            savedAt: new Date().toISOString(),
            localPersistenceProvider: localSaveResult.provider,
            localBaseFolder: localSaveResult.baseFolder,
            relativePath: localSaveResult.relativePath,
          },
          timestamp: Date.now(),
          status: 'generated' as const,
          localPath: localSaveResult.filePath,
        };

        // Add to generation store if we have at least a video URL
        // Thumbnail will be generated asynchronously by the gallery auto-refresh
        if (videoUrl) {
          addGeneration(videoGenerationResult);
          console.log(`✅ [${generationSessionId}] Video added to generation store (thumbnail will be generated by gallery)`);
          
          // Show success toast notification
          showSuccess(
            'Video Generated',
            `Generated "${result.filename}" (${(result.blob.size / 1024 / 1024).toFixed(2)} MB) - saved to ${localSaveResult.displayPath || localSaveResult.filePath}`
          );
        } else {
          console.warn(`⚠️ [${generationSessionId}] Video saved but could not generate video URL - skipping generation store`);
        }

        showSuccess(
          'Video Generated',
          `Generated "${result.filename}" (${(result.blob.size / 1024 / 1024).toFixed(2)} MB) - saved to ${localSaveResult.displayPath || localSaveResult.filePath}`
        );

        console.log(`🎥 [${generationSessionId}] Video added to gallery store (local file) - Job ID: ${jobId}:`, {
          id: videoGenerationResult.id,
          localPath: localSaveResult.filePath,
          relativePath: localSaveResult.relativePath,
          filename: result.filename,
          size: result.blob.size,
        });
      }

    } catch (error: any) {
      console.error('❌ Luma Dream Machine video generation failed:', error);
      
      // Provide more user-friendly error messages for common issues
      let errorMessage = error?.message || 'An unexpected error occurred.';
      let errorTitle = 'Video Generation Failed';
      
      // Check for specific error patterns
      if (error?.message?.includes('502') || error?.message?.includes('Bad Gateway')) {
        errorTitle = 'Service Temporarily Unavailable';
        errorMessage = 'The Luma API is currently experiencing issues. Please try again in a few minutes.';
      } else if (error?.message?.includes('503') || error?.message?.includes('Service Unavailable')) {
        errorTitle = 'Service Temporarily Unavailable';
        errorMessage = 'The Luma API is temporarily unavailable. Please try again shortly.';
      } else if (error?.message?.includes('429') || error?.message?.includes('rate limit')) {
        errorTitle = 'Rate Limit Exceeded';
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (error?.message?.includes('401') || error?.message?.includes('unauthorized')) {
        errorTitle = 'Authentication Failed';
        errorMessage = 'Authentication with Luma failed. Please check your API credentials.';
      }
      
      showError(errorTitle, errorMessage);
    } finally {
      setIsGeneratingLuma(false);
    }
  };

  const handleReframeLumaVideo = async () => {
    console.log('🎬 Luma reframe button clicked - reframe mode');
    console.log('📝 Current state:', {
      lumaPrompt: lumaPrompt?.substring(0, 50) + '...',
      lumaMode,
      isAuthed,
      lumaReframeVideoItem: !!lumaReframeVideoItem
    });

    if (!lumaPrompt.trim()) {
      showWarning('Missing Prompt', 'Please enter a description for the reframed video.');
      return;
    }

    if (!lumaReframeVideoItem) {
      showWarning('Missing Video', 'Please select a video to reframe.');
      return;
    }

    // Ensure user is authenticated before proceeding
    await ensureAuthenticated();
    if (!isAuthed) {
      return; // ensureAuthenticated handles the error toast
    }

    setIsGeneratingLuma(true);

    try {
      const generationSessionId = `luma-gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      showInfo('Reframming Video', `Changing aspect ratio of "${lumaReframeVideoItem.filename}" to ${lumaAspectRatio}`);

      console.log(`🎞️ [${generationSessionId}] Starting Luma Dream Machine video reframing...`);
      console.log(`📝 [${generationSessionId}] Luma reframe parameters:`, {
        prompt: lumaPrompt,
        model: lumaModel,
        aspect_ratio: lumaAspectRatio,
        sourceVideo: lumaReframeVideoItem.filename,
        sourceUrl: lumaReframeVideoItem.displayUrl,
      });

      const lumaService = new LumaVideoService({
        pollIntervalMs: 5_000,
        maxPollAttempts: 120,
      });

      const reframeRequest: LumaReframeVideoRequest = {
        generation_type: 'reframe_video',
        media: {
          url: lumaReframeVideoItem.displayUrl || lumaReframeVideoItem.blobUrl || ''
        },
        model: lumaModel as ReframeVideoModel,
        prompt: lumaPrompt,
        aspect_ratio: lumaAspectRatio,
      };

      console.log(`🚀 [${generationSessionId}] Sending Luma Dream Machine reframe request:`, reframeRequest);

      const result = await lumaService.reframeVideo(reframeRequest);
      const jobId = result.metadata?.id;
      console.log(`✅ [${generationSessionId}] Luma Dream Machine reframe completed - Job ID: ${jobId}`, result);

      const computedSeed = Math.floor(Math.random() * 999999);

      console.log(`💾 [${generationSessionId}] Saving Luma Dream Machine reframed video to local storage - Job ID: ${jobId}...`);
      const localSaveResult = await saveGenerationLocally({
        blob: result.blob,
        metadata: {
          prompt: result.metadata.prompt || lumaPrompt,
          seed: computedSeed,
          jobId: result.metadata.id,
          model: result.metadata.model || lumaModel,
          version: 'Dream Machine 1.1.0',
          timestamp: Date.now(),
          filename: result.filename,
          contentType: result.contentType,
          fileSize: result.blob.size,
          duration: undefined, // Will be determined from original video
          fps: undefined,
          resolution: undefined, // Will be determined from aspect ratio
          persistenceMethod: 'local' as const,
          storageMode: 'local' as const,
        },
        filename: result.filename,
      });

      if (!localSaveResult) {
        console.warn('⚠️ Local save failed, falling back to data URL');

        const arrayBuffer = await result.blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const base64 = btoa(String.fromCharCode(...bytes));
        const videoUrl = `data:${result.contentType};base64,${base64}`;

        const videoGenerationResult = {
          id: result.filename,
          imageUrl: '',
          videoUrl,
          videoBlob: result.blob,
          seed: computedSeed,
          contentType: 'video' as const,
          duration: undefined,
          fps: undefined,
          resolution: undefined,
          metadata: {
            prompt: result.metadata.prompt || lumaPrompt,
            seed: computedSeed,
            jobId: result.metadata.id,
            model: result.metadata.model || lumaModel,
            version: 'Dream Machine 1.1.0',
            timestamp: Date.now(),
            filename: result.filename,
            contentType: result.contentType,
            fileSize: result.blob.size,
            duration: undefined,
            fps: undefined,
            resolution: undefined,
            persistenceMethod: 'dataUrl' as const,
            storageMode: 'local' as const,
          },
          timestamp: Date.now(),
          status: 'generated' as const,
          blobUrl: videoUrl,
          localPath: result.filename,
        };

        addGeneration(videoGenerationResult);

        showSuccess(
          'Video Reframed',
          `Reframed "${result.filename}" (${(result.blob.size / 1024 / 1024).toFixed(2)} MB) - saved in memory only`
        );

        console.log(`🎥 [${generationSessionId}] Reframed video added to gallery store (data URL fallback) - Job ID: ${jobId}:`, {
          id: videoGenerationResult.id,
          videoUrl,
          filename: result.filename,
          size: result.blob.size,
        });
      } else {
        console.log(`✅ [${generationSessionId}] Luma Dream Machine reframed video saved locally - Job ID: ${jobId}`, localSaveResult);

        const videoGenerationResult = {
          id: result.filename,
          imageUrl: '',
          videoUrl: '',
          videoBlob: result.blob,
          seed: computedSeed,
          contentType: 'video' as const,
          duration: undefined,
          fps: undefined,
          resolution: undefined,
          metadata: {
            prompt: result.metadata.prompt || lumaPrompt,
            seed: computedSeed,
            jobId: result.metadata.id,
            model: result.metadata.model || lumaModel,
            version: 'Dream Machine 1.1.0',
            timestamp: Date.now(),
            filename: result.filename,
            contentType: result.contentType,
            fileSize: result.blob.size,
            duration: undefined,
            fps: undefined,
            resolution: undefined,
            persistenceMethod: 'local' as const,
            storageMode: 'local' as const,
            folderToken: localSaveResult.folderToken ?? null,
            localFilePath: localSaveResult.filePath,
            localMetadataPath: localSaveResult.metadataPath,
            savedAt: new Date().toISOString(),
            localPersistenceProvider: localSaveResult.provider,
            localBaseFolder: localSaveResult.baseFolder,
            relativePath: localSaveResult.relativePath,
          },
          timestamp: Date.now(),
          status: 'generated' as const,
          localPath: localSaveResult.filePath,
        };

        addGeneration(videoGenerationResult);

        showSuccess(
          'Video Reframed',
          `Reframed "${result.filename}" (${(result.blob.size / 1024 / 1024).toFixed(2)} MB) - saved to ${localSaveResult.displayPath || localSaveResult.filePath}`
        );

        console.log(`🎥 [${generationSessionId}] Reframed video added to gallery store (local file) - Job ID: ${jobId}:`, {
          id: videoGenerationResult.id,
          localPath: localSaveResult.filePath,
          relativePath: localSaveResult.relativePath,
          filename: result.filename,
          size: result.blob.size,
        });
      }

    } catch (error: any) {
      console.error('❌ Luma Dream Machine video reframing failed:', error);
      
      // Provide more user-friendly error messages for common issues
      let errorMessage = error?.message || 'An unexpected error occurred.';
      let errorTitle = 'Video Reframing Failed';
      
      // Check for specific error patterns
      if (error?.message?.includes('502') || error?.message?.includes('Bad Gateway')) {
        errorTitle = 'Service Temporarily Unavailable';
        errorMessage = 'The Luma API is currently experiencing issues. Please try again in a few minutes.';
      } else if (error?.message?.includes('503') || error?.message?.includes('Service Unavailable')) {
        errorTitle = 'Service Temporarily Unavailable';
        errorMessage = 'The Luma API is temporarily unavailable. Please try again shortly.';
      } else if (error?.message?.includes('429') || error?.message?.includes('rate limit')) {
        errorTitle = 'Rate Limit Exceeded';
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (error?.message?.includes('401') || error?.message?.includes('unauthorized')) {
        errorTitle = 'Authentication Failed';
        errorMessage = 'Authentication with Luma failed. Please check your API credentials.';
      }
      
      showError(errorTitle, errorMessage);
    } finally {
      setIsGeneratingLuma(false);
    }
  };

  const handleGenerateLumaImage = async () => {
    console.log('🎨 Luma image generate button clicked');
    console.log('📝 Current state:', {
      lumaPrompt: lumaPrompt?.substring(0, 50) + '...',
      lumaModel,
      lumaAspectRatio,
      isAuthed
    });

    if (!lumaPrompt.trim()) {
      showWarning('Missing Prompt', 'Please enter a description for your image.');
      return;
    }

    // Ensure user is authenticated before proceeding
    await ensureAuthenticated();
    if (!isAuthed) {
      return; // ensureAuthenticated handles the error toast
    }

    // Input validation
    if (lumaPrompt.length > 1000) {
      showWarning('Prompt Too Long', 'Please keep your prompt under 1000 characters.');
      return;
    }

    // Validate model selection
    const validModels = ['photon-1', 'photon-flash-1'];
    if (!validModels.includes(lumaModel)) {
      showWarning('Invalid Model', 'Please select a valid Photon model.');
      return;
    }

    // Validate aspect ratio
    const validAspectRatios = ['16:9', '9:16', '1:1', '21:9', '9:21', '3:4', '4:3'];
    if (!validAspectRatios.includes(lumaAspectRatio)) {
      showWarning('Invalid Aspect Ratio', 'Please select a valid aspect ratio.');
      return;
    }

    setIsGeneratingLuma(true);

    try {
      const generationSessionId = `luma-img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      showInfo('Generating Image', `Dreaming up "${lumaPrompt.substring(0, 50)}${lumaPrompt.length > 50 ? '...' : ''}"}`);

      console.log(`🎨 [${generationSessionId}] Starting Luma Dream Machine image generation...`);
      console.log(`📝 [${generationSessionId}] Luma image generation parameters:`, {
        prompt: lumaPrompt,
        model: lumaModel,
        aspect_ratio: lumaAspectRatio,
      });

      const lumaImageService = new LumaImageService({
        pollIntervalMs: 5_000,
        maxPollAttempts: 120,
      });

      // Helper function to upload reference image to Azure
      const uploadReferenceImage = async (fileOrItem: any, index: number): Promise<string> => {
        // Check if SAS is configured
        if (!selectHasSAS()) {
          const message = 'Azure SAS token not configured. Set VITE_AZURE_CONTAINER_SAS_URL or SAS parts in .env and rebuild.';
          showError('Azure SAS Missing', message);
          throw new Error(message);
        }

        try {
          let fileData: any;
          let filename: string;

          // Check if it's a ContentItem (from gallery) or a File (from file picker)
          if (fileOrItem.folderToken && fileOrItem.relativePath) {
            // It's a ContentItem from gallery - read from UXP filesystem
            console.log(`☁️ [${generationSessionId}] Uploading reference image ${index + 1} from gallery:`, fileOrItem.filename);
            
            const fs = uxp.storage.localFileSystem;
            const folder = await fs.getEntryForPersistentToken(fileOrItem.folderToken);
            const file = await folder.getEntry(fileOrItem.relativePath);
            const binaryFormat = uxp.storage.formats?.binary;
            const readOptions = binaryFormat ? { format: binaryFormat } : undefined;
            fileData = await file.read(readOptions);
            filename = fileOrItem.filename || 'reference.jpg';
          } else {
            // It's a File object from file picker - read directly
            console.log(`☁️ [${generationSessionId}] Uploading reference image ${index + 1}:`, fileOrItem.name);
            
            const binaryFormat = uxp.storage.formats?.binary;
            const readOptions = binaryFormat ? { format: binaryFormat } : undefined;
            fileData = await fileOrItem.read(readOptions);
            filename = fileOrItem.name || 'reference.jpg';
          }

          // Generate unique blob name
          const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
          const blobName = `luma/references/${new Date().toISOString().split('T')[0]}/${Date.now()}-ref${index}-${sanitizedFilename}`;
          
          // Determine content type from file extension
          const ext = filename.split('.').pop()?.toLowerCase();
          const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';

          // Upload using SAS token
          const uploadedUrl = await uploadBytes(blobName, fileData, contentType);

          if (!uploadedUrl || !uploadedUrl.startsWith('https://')) {
            throw new Error('Azure SAS upload did not return a secure HTTPS URL');
          }

          console.log(`✅ [${generationSessionId}] Reference image ${index + 1} uploaded:`, uploadedUrl);
          return uploadedUrl;
        } catch (error: any) {
          // Handle SAS-specific errors
          if (error?.message?.includes('SAS token expired') || error?.message?.includes('AuthenticationFailed')) {
            const message = 'Azure SAS token expired or invalid. Update VITE_AZURE_* env vars and rebuild.';
            showError('SAS Token Expired', message);
            throw new Error(message);
          }

          const message = error instanceof Error ? error.message : 'Unknown error while uploading reference image to Azure.';
          showError('Azure Upload Failed', message);
          console.error(`❌ [${generationSessionId}] Failed to upload reference image ${index + 1}:`, error);
          throw error instanceof Error ? error : new Error(message);
        }
      };

      // Check if we're using image references or style reference
      let result;
      if (lumaImageReferences && lumaImageReferences.some(ref => ref.file)) {
        // Filter out empty references
        const activeReferences = lumaImageReferences.filter(ref => ref.file !== null);
        
        if (activeReferences.length === 0) {
          showWarning('No References Selected', 'Please select at least one reference image or disable "Use Image References".');
          setIsGeneratingLuma(false);
          return;
        }

        console.log(`🖼️ [${generationSessionId}] Uploading ${activeReferences.length} reference images...`);
        
        // Upload all reference images to Azure
        const uploadedReferences = await Promise.all(
          activeReferences.map(async (ref, index) => {
            const url = await uploadReferenceImage(ref.file!, index);
            return {
              url,
              weight: ref.weight
            };
          })
        );

        console.log(`✅ [${generationSessionId}] All reference images uploaded`);
        console.log(`🚀 [${generationSessionId}] Sending Luma image request with ${uploadedReferences.length} references`);

        result = await lumaImageService.generateImageWithReference(
          lumaPrompt,
          uploadedReferences,
          lumaModel as LumaImageModel,
          lumaAspectRatio
        );
      } else if (lumaStyleReference && lumaStyleReference.file) {
        // Style reference generation
        if (!lumaStyleReference.file) {
          showWarning('No Style Reference', 'Please select a style reference image or disable "Use Style Reference".');
          setIsGeneratingLuma(false);
          return;
        }

        console.log(`🎨 [${generationSessionId}] Uploading style reference image...`);
        
        // Upload style reference to Azure
        const styleUrl = await uploadReferenceImage(lumaStyleReference.file, 0);
        const styleReferences = [{
          url: styleUrl,
          weight: lumaStyleReference.weight
        }];

        console.log(`✅ [${generationSessionId}] Style reference uploaded`);
        console.log(`🚀 [${generationSessionId}] Sending Luma image request with style reference`);

        result = await lumaImageService.generateImageWithStyle(
          lumaPrompt,
          styleReferences,
          lumaModel as LumaImageModel,
          lumaAspectRatio
        );
      } else if (lumaCharacterReferences && lumaCharacterReferences.some(group => group.some(ref => ref))) {
        // Character reference generation
        // Check if at least one identity has images
        const hasAnyCharacterImages = lumaCharacterReferences.some(identity => 
          identity.some(img => img !== null)
        );

        if (!hasAnyCharacterImages) {
          showWarning('No Character References', 'Please select at least one character reference image or disable "Use Character Reference".');
          setIsGeneratingLuma(false);
          return;
        }

        console.log(`👤 [${generationSessionId}] Uploading character reference images...`);
        
        // Build character reference object
        const characterRef: any = {};
        let totalImages = 0;

        for (let identityIndex = 0; identityIndex < lumaCharacterReferences.length; identityIndex++) {
          const identity = lumaCharacterReferences[identityIndex];
          const activeImages = identity.filter(img => img !== null);
          
          if (activeImages.length > 0) {
            // Upload all images for this identity
            const uploadedUrls = await Promise.all(
              activeImages.map(async (fileOrItem, imgIndex) => {
                const url = await uploadReferenceImage(fileOrItem, totalImages++);
                return url;
              })
            );

            // Add to character reference (identity0, identity1, identity2, identity3)
            characterRef[`identity${identityIndex}`] = {
              images: uploadedUrls
            };
          }
        }

        console.log(`✅ [${generationSessionId}] Character references uploaded:`, Object.keys(characterRef));
        console.log(`� [${generationSessionId}] Character reference object:`, JSON.stringify(characterRef, null, 2));
        console.log(`�🚀 [${generationSessionId}] Sending Luma image request with character references`);

        result = await lumaImageService.generateImageWithCharacter(
          lumaPrompt,
          characterRef,
          lumaModel as LumaImageModel,
          lumaAspectRatio
        );
      } else if (lumaModifyImage && lumaModifyImage.file) {
        // Modify existing image
        if (!lumaModifyImage.file) {
          showWarning('No Image Selected', 'Please select an image to modify or disable "Use Modify Image".');
          setIsGeneratingLuma(false);
          return;
        }

        console.log(`🖼️ [${generationSessionId}] Uploading image to modify...`);
        
        // Upload the modify image to Azure
        const modifyUrl = await uploadReferenceImage(lumaModifyImage.file, 0);
        const modifyReference = {
          url: modifyUrl,
          weight: lumaModifyImage.weight
        };

        console.log(`✅ [${generationSessionId}] Modify image uploaded:`, modifyUrl);
        console.log(`🚀 [${generationSessionId}] Sending Luma modify image request`);

        result = await lumaImageService.modifyImage(
          lumaPrompt,
          modifyReference,
          lumaModel as LumaImageModel,
          lumaAspectRatio
        );
      } else {
        // Basic text-to-image generation
        const lumaRequest: LumaImageGenerationRequest = {
          prompt: lumaPrompt,
          model: lumaModel as LumaImageModel,
          aspect_ratio: lumaAspectRatio,
        };

        console.log(`🚀 [${generationSessionId}] Sending basic Luma image request:`, lumaRequest);

        result = await lumaImageService.generateImage(lumaRequest);
      }

      const jobId = result.metadata?.id;
      console.log(`✅ [${generationSessionId}] Luma Dream Machine image generation completed - Job ID: ${jobId}`, result);

      const computedSeed = Math.floor(Math.random() * 999999);

      console.log(`💾 [${generationSessionId}] Saving Luma Dream Machine image to local storage - Job ID: ${jobId}...`);
      const localSaveResult = await saveGenerationLocally({
        blob: result.blob,
        metadata: {
          prompt: result.metadata.prompt || lumaPrompt,
          seed: computedSeed,
          jobId: result.metadata.id,
          model: result.metadata.model || lumaModel,
          version: 'Photon 1.0.0',
          timestamp: Date.now(),
          filename: result.filename,
          contentType: result.contentType,
          fileSize: result.blob.size,
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
        const imageUrl = `data:${result.contentType};base64,${base64}`;
        
        // Create generation result for the image (using same structure as LTX/Luma video)
        const generationResult = {
          id: result.filename,
          imageUrl: imageUrl,
          seed: computedSeed,
          contentType: 'image' as const,
          metadata: {
            prompt: lumaPrompt,
            seed: computedSeed,
            model: lumaModel,
            aspectRatio: lumaAspectRatio,
            jobId: result.metadata.id,
            version: 'Photon 1.0.0',
            timestamp: Date.now(),
            filename: result.filename,
            contentType: result.contentType,
            fileSize: result.blob.size,
            persistenceMethod: 'dataUrl' as const,
          },
          timestamp: Date.now(),
          status: 'generated' as const,
        };

        // Add to generation store
        addGeneration(generationResult);

        console.log(`✅ [${generationSessionId}] Luma image added to gallery (data URL fallback):`, generationResult.id);
        showSuccess('Image Generated', `Your Luma image has been created! (${result.filename})`);
      } else {
        console.log(`✅ [${generationSessionId}] Luma image saved to local storage:`, localSaveResult);
        
        // Convert blob to base64 data URL (matching Firefly pattern)
        let imageUrl = '';
        try {
          const dataUrl = await convertBlobToDataUrl(result.blob);
          imageUrl = dataUrl;
          console.log(`🖼️ [${generationSessionId}] Converted image to base64 data URL:`, dataUrl.substring(0, 50) + '...');
        } catch (conversionError) {
          console.warn(`⚠️ [${generationSessionId}] Failed to convert to data URL, falling back to file path:`, conversionError);
          imageUrl = localSaveResult.filePath;
        }
        
        // Create generation result matching Firefly's structure exactly
        const generationResult: GenerationResult = {
          id: result.filename,
          imageUrl: imageUrl, // Use base64 data URL (or file path as fallback)
          downloadUrl: localSaveResult.filePath, // File path for download
          seed: computedSeed,
          metadata: {
            prompt: lumaPrompt,
            seed: computedSeed,
            model: lumaModel,
            jobId: result.metadata.id,
            version: 'Photon 1.0.0',
            timestamp: Date.now(),
            filename: result.filename,
            contentType: result.contentType,
            fileSize: result.blob.size,
            storageMode: 'local' as const,
            persistenceMethod: 'dataUrl' as const, // We're using data URL
            folderToken: localSaveResult.folderToken,
            relativePath: localSaveResult.relativePath,
            localFilePath: localSaveResult.filePath,
            localMetadataPath: localSaveResult.metadataPath,
          },
          timestamp: Date.now(),
          status: 'generated' as const,
          localPath: localSaveResult.filePath,
          blobUrl: imageUrl, // Also set blobUrl for clarity (even though it's a data URL)
          // DO NOT set contentType, videoUrl, or videoBlob for images
        };

        // Add to generation store
        addGeneration(generationResult);

        console.log(`✅ [${generationSessionId}] Luma image added to gallery:`, generationResult.id);
        showSuccess('Image Generated', `Your Luma image has been created and saved locally! (${result.filename})`);
      }

    } catch (error: any) {
      console.error('❌ Luma Dream Machine image generation failed:', error);
      
      // Provide more user-friendly error messages for common issues
      let errorMessage = error?.message || 'An unexpected error occurred.';
      let errorTitle = 'Image Generation Failed';
      
      // Check for specific error patterns
      if (error?.message?.includes('502') || error?.message?.includes('Bad Gateway')) {
        errorMessage = 'The Luma API is temporarily unavailable. Please try again in a moment.';
        errorTitle = 'Service Unavailable';
      } else if (error?.message?.includes('503') || error?.message?.includes('Service Unavailable')) {
        errorMessage = 'Luma servers are experiencing high demand. Please try again shortly.';
        errorTitle = 'Service Busy';
      } else if (error?.message?.includes('429') || error?.message?.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment before generating again.';
        errorTitle = 'Rate Limited';
      } else if (error?.message?.includes('401') || error?.message?.includes('unauthorized')) {
        errorMessage = 'Invalid API key. Please check your Luma API configuration.';
        errorTitle = 'Authentication Error';
      }
      
      showError(errorTitle, errorMessage);
    } finally {
      setIsGeneratingLuma(false);
    }
  };

  return { 
    handleGenerateLumaVideo,
    handleReframeLumaVideo,
    handleGenerateLumaImage
  };
}
