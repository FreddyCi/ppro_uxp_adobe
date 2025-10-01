// must be the first import
import "./shims/domparser";

import { useGalleryStore } from './store'
import { useShallow } from 'zustand/react/shallow'
import { ContentItem, isVideo } from './types/content'
import React, { useState, useEffect, useRef } from "react";

import { uxp, premierepro } from "./globals";
import { api } from "./api/api";
import { createIMSService } from "./services/ims/IMSService";
import { FireflyService } from "./services/firefly";
import { useGenerationStore } from "./store/generationStore";
import { useAuthStore } from "./store/authStore";
import "./layout.scss";
import { saveGenerationLocally } from './services/local/localBoltStorage';
import { LtxVideoService } from './services/ltx';
import { LumaVideoService } from './services/luma';
import type { LumaGenerationRequest, LumaVideoModel, LumaReframeVideoRequest, ReframeVideoModel } from './types/luma';
import { createAzureSDKBlobService } from './services/blob/AzureSDKBlobService';
import { createSASTokenService } from './services/blob/SASTokenService';
import { uploadBytes } from './services/sasUpload';
import axios from 'axios';
import { useIsAuthenticated, getIMSServiceInstance, getSharedIMSService, ensureAuthenticated, setAuthFromToken, selectStatus, selectToken, selectIsAuthed, selectHydrated } from './store/authStore';
import { selectHasSAS, selectSASStatus } from './store/uiStore';

// Import components
import { MoonIcon, RefreshIcon, SunIcon, ToastProvider, useToastHelpers, Gallery, LocalIngestPanel } from "./components";

// Import utilities
import { v4 as uuidv4 } from 'uuid';

// Helper function to upload blob using SAS token (bypasses Azure SDK issues)
async function uploadBlobWithSAS(
  sasService: ReturnType<typeof createSASTokenService>,
  accountName: string,
  containerName: string,
  blobName: string,
  file: File | Blob | Uint8Array | ArrayBuffer,
  cacheControl?: string
): Promise<{ publicUrl: string; signedUrl: string }> {
  // Request upload SAS token from backend
  const sasResponse = await sasService.requestUploadToken(containerName, blobName, 15); // 15 minutes

  // Build the PUT URL
  const baseUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${encodeURIComponent(blobName)}`;
  const sasToken = sasResponse.sasToken.startsWith('?') ? sasResponse.sasToken.slice(1) : sasResponse.sasToken;
  const putUrl = `${baseUrl}?${sasToken}`;

  // Prepare file data
  let arrayBuffer: ArrayBuffer;
  if (file instanceof ArrayBuffer) {
    arrayBuffer = file;
  } else if (file instanceof Uint8Array) {
    arrayBuffer = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
  } else if (file instanceof Blob) {
    arrayBuffer = await file.arrayBuffer();
  } else if (typeof file === 'object' && 'arrayBuffer' in file && typeof (file as any).arrayBuffer === 'function') {
    // Handle File objects (which extend Blob but TypeScript doesn't know that)
    arrayBuffer = await (file as any).arrayBuffer();
  } else {
    throw new Error('Unsupported file type for upload');
  }

  // Infer content type
  const contentType = file instanceof Blob && file.type ? file.type :
    blobName.toLowerCase().endsWith('.jpg') || blobName.toLowerCase().endsWith('.jpeg') ? 'image/jpeg' :
    blobName.toLowerCase().endsWith('.png') ? 'image/png' :
    'application/octet-stream';

  // Upload with axios
  const headers: Record<string, string> = {
    'x-ms-blob-type': 'BlockBlob',
    'Content-Type': contentType,
    'x-ms-version': '2021-08-06',
  };
  if (cacheControl) headers['x-ms-blob-cache-control'] = cacheControl;

  const response = await axios.put(putUrl, arrayBuffer, { headers });

  if (response.status >= 200 && response.status < 300) {
    return {
      publicUrl: baseUrl,
      signedUrl: sasResponse.sasUrl || putUrl
    };
  } else {
    throw new Error(`Upload failed with status ${response.status}: ${response.statusText}`);
  }
}
import { refreshContentItemUrls } from './utils/blobUrlLifecycle';

const AppContent = () => {
  const [imsToken, setImsToken] = useState<string | null>(null);
  const [imsStatus, setImsStatus] = useState<string>('Not authenticated');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'gallery' | 'ingest'>('generate');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Default to dark mode for UXP
  
  // Image generation form state
  const [prompt, setPrompt] = useState<string>('');
  const [stylePreset, setStylePreset] = useState<string>('art');
  const [contentType, setContentType] = useState<'art' | 'photo'>('art');
  const [aspectRatio, setAspectRatio] = useState<string>('square');
  const [seedValue, setSeedValue] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Generation mode state
  const [generationMode, setGenerationMode] = useState<'firefly' | 'ltx' | 'luma'>('firefly');
  
  // LTX video generation form state
  const [ltxPrompt, setLtxPrompt] = useState<string>('');
  const [ltxDuration, setLtxDuration] = useState<number>(6);
  const [ltxFps, setLtxFps] = useState<number>(24);
  const [ltxWidth, setLtxWidth] = useState<number>(1280);
  const [ltxHeight, setLtxHeight] = useState<number>(720);
  const [ltxSeed, setLtxSeed] = useState<number>(0);
  const [isGeneratingLtx, setIsGeneratingLtx] = useState<boolean>(false);

  // Luma Dream Machine generation form state
  const [lumaPrompt, setLumaPrompt] = useState<string>('');
  const [lumaModel, setLumaModel] = useState<string>('ray-2');
  const [lumaAspectRatio, setLumaAspectRatio] = useState<string>('16:9');
  const [lumaDuration, setLumaDuration] = useState<string>('5s');
  const [lumaResolution, setLumaResolution] = useState<string>('1080p');
  const [lumaLoop, setLumaLoop] = useState<boolean>(false);
  const [lumaFirstFrameItem, setLumaFirstFrameItem] = useState<ContentItem | null>(null);
  const [lumaLastFrameItem, setLumaLastFrameItem] = useState<ContentItem | null>(null);
  const [lumaMode, setLumaMode] = useState<'keyframes' | 'reframe'>('keyframes');
  const [lumaReframeVideoItem, setLumaReframeVideoItem] = useState<ContentItem | null>(null);
  const [showGalleryPicker, setShowGalleryPicker] = useState<boolean>(false);
  const [galleryPickerTarget, setGalleryPickerTarget] = useState<'first' | 'last' | 'both' | 'reframe-video' | null>(null);
  const [isGeneratingLuma, setIsGeneratingLuma] = useState<boolean>(false);
  
  // Get toast helpers
  const { showSuccess, showError, showInfo, showWarning } = useToastHelpers();
  
  // Get generation store actions
  const { actions: { addGeneration } } = useGenerationStore();

  // Get authentication status using selectors
  const authStatus = useAuthStore(selectStatus);
  const isAuthed = useAuthStore(selectIsAuthed);
  const isHydrated = useAuthStore(selectHydrated);

  const azureBlobServiceRef = useRef<ReturnType<typeof createAzureSDKBlobService> | null>(null);
  const azureContainerName = import.meta.env.VITE_AZURE_STORAGE_CONTAINER_NAME || 'uxp-images';

  const getAzureBlobService = () => {
    if (!azureBlobServiceRef.current) {
      const imsService = getSharedIMSService();
      azureBlobServiceRef.current = createAzureSDKBlobService(imsService);
    }
    return azureBlobServiceRef.current;
  };

  useEffect(() => {
    const checkAuthAndClearService = async () => {
      await ensureAuthenticated();
      if (!isAuthed) {
        azureBlobServiceRef.current = null;
      }
    };
    checkAuthAndClearService();
  }, []);

  useEffect(() => {
    const checkAuthAndCreateService = async () => {
      await ensureAuthenticated();
      if (isAuthed && !azureBlobServiceRef.current) {
        // Recreate Azure service with authenticated IMS service
        azureBlobServiceRef.current = createAzureSDKBlobService(getSharedIMSService());
      }
    };
    checkAuthAndCreateService();
  }, []);

  const hostName = (uxp.host.name as string).toLowerCase();

  //* Call Functions Conditionally by App
  useEffect(() => {
    if (hostName === "premierepro") {
      console.log("Hello from Premiere Pro", premierepro);
    }
  }, [hostName]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Apply theme to the root element
    document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
  };



  // Handle image generation
  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      showWarning('Missing Prompt', 'Please enter a description for your image.');
      return;
    }

    if (!imsToken) {
      showError('Authentication Required', 'Please log in first to generate images.');
      return;
    }

    setIsGenerating(true);

    try {
      showInfo('Generating Image', `Creating "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`);
      
      console.log('🎨 Starting Firefly image generation...');
      console.log('📝 Generation parameters:', {
        prompt: prompt,
        stylePreset: stylePreset,
        contentType: contentType,
        aspectRatio: aspectRatio,
        seed: seedValue > 0 ? seedValue : undefined
      });
      
      // Create Firefly service with IMS token
      const imsService = createIMSService();
      const fireflyService = new FireflyService(imsService);
      
      // Build generation request
      const generationRequest = {
        prompt: prompt,
        contentClass: contentType as 'photo' | 'art',
        size: aspectRatio === '1:1' ? { width: 1024, height: 1024 } :
              aspectRatio === '16:9' ? { width: 1920, height: 1080 } :
              aspectRatio === '9:16' ? { width: 1080, height: 1920 } :
              { width: 1024, height: 1024 }, // default to square
        numVariations: 1,
        seeds: seedValue > 0 ? [seedValue] : undefined
      };
      
      console.log('🚀 Sending generation request:', generationRequest);
      
      // Call Firefly API
      const response = await fireflyService.generateImage(generationRequest);
      console.log('✅ Firefly API response received:', response);
      
      // Poll for completion
      const completedJob = await fireflyService.pollUntilComplete(response.data.jobId);
      console.log('🎉 Generation completed:', completedJob);
      
      if (completedJob.outputs && completedJob.outputs.length > 0) {
        const generationResult = completedJob.outputs[0];
        console.log('🖼️ Generated image result:', generationResult);
        
        // Add to generation store
        addGeneration(generationResult);
        
        showSuccess('Image Generated', 'Your image has been created successfully!');
      } else {
        throw new Error('No images were generated');
      }
      
    } catch (error: any) {
      console.error('❌ Image generation failed:', error);
      console.error('🔍 Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        stack: error.stack
      });
      showError('Generation Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle LTX video generation
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
          id: uuidv4(),
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
          id: uuidv4(),
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
        stack: error.stack
      });
      showError('Video Generation Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setIsGeneratingLtx(false);
    }
  };

  const handleGenerateLumaVideo = async () => {
    console.log('🎬 Luma generate button clicked - keyframes mode');
    console.log('📝 Current state:', {
      lumaPrompt: lumaPrompt?.substring(0, 50) + '...',
      lumaMode,
      isGeneratingLuma,
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
    const validModels = ['ray-2', 'ray-flash-2', 'ray-1-6'];
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
          id: uuidv4(),
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
            const { toTempUrl } = await import('./utils/uxpFs');
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

        const videoGenerationResult = {
          id: uuidv4(),
          imageUrl: videoUrl, // Use video URL for thumbnail
          videoUrl: videoUrl,
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

        addGeneration(videoGenerationResult);

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
      showError('Video Generation Failed', error?.message || 'An unexpected error occurred.');
    } finally {
      setIsGeneratingLuma(false);
    }
  };

  const handleReframeLumaVideo = async () => {
    console.log('🎬 Luma reframe button clicked - reframe mode');
    console.log('📝 Current state:', {
      lumaPrompt: lumaPrompt?.substring(0, 50) + '...',
      lumaMode,
      isGeneratingLuma,
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
          id: uuidv4(),
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
          id: uuidv4(),
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
      showError('Video Reframing Failed', error?.message || 'An unexpected error occurred.');
    } finally {
      setIsGeneratingLuma(false);
    }
  };
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Log available videos when reframe mode is selected and sync if needed
  useEffect(() => {
    if (lumaMode === 'reframe') {
      const syncAndLogVideos = async () => {
        console.log('🔄 Auto-syncing local files for reframe mode...');
        await useGalleryStore.getState().actions.syncLocalFiles();
        
        // Wait a bit for the sync to complete, then log results
        setTimeout(() => {
          const { contentItems } = useGalleryStore.getState();
          const videos = contentItems.filter(item => ['video', 'uploaded-video'].includes(item.contentType));
          console.log('🎥 Available videos for reframing after sync:', videos.length);
          videos.forEach((video, index) => {
            console.log(`  ${index + 1}. ${video.filename} (${video.contentType}) - Display URL: ${video.displayUrl ? 'YES' : 'NO'}`);
          });
          
          // Also log the local storage directory info
          const folderToken = localStorage.getItem('boltuxp.localFolderToken');
          const folderPath = localStorage.getItem('boltuxp.localFolderPath');
          console.log('🎥 Local storage directory for videos:', { folderToken, folderPath });
        }, 1000); // Wait 1 second for sync to complete
      };
      
      syncAndLogVideos();
    }
  }, [lumaMode]);

  // Blob URL rehydration on app startup and gallery tab switch
  useEffect(() => {
    // Only run rehydration if store is hydrated AND user is authenticated
    if (!isHydrated || !isAuthed) {
      console.log('🔄 Skipping blob URL rehydration - store not hydrated or user not authenticated', { isHydrated, isAuthed });
      return;
    }

    const rehydrateBlobUrls = async () => {
      console.log('🔄 Starting blob URL rehydration...');
      const { contentItems, actions } = useGalleryStore.getState();

      // Find items that need blob URL rehydration (have relativePath and folderToken but no displayUrl)
      const itemsNeedingRehydration = contentItems.filter(item =>
        item.relativePath &&
        item.folderToken &&
        !item.displayUrl
      );

      if (itemsNeedingRehydration.length === 0) {
        console.log('✅ No items need blob URL rehydration');
        return;
      }

      console.log(`🔄 Rehydrating blob URLs for ${itemsNeedingRehydration.length} items...`);

      for (const item of itemsNeedingRehydration) {
        try {
          // Use refreshContentItemUrls to recreate the display URL
          const refreshedUrls = await refreshContentItemUrls({
            displayUrl: item.displayUrl,
            thumbnailUrl: item.thumbnailUrl,
            blobUrl: item.blobUrl,
            folderToken: item.folderToken,
            relativePath: item.relativePath,
            localPath: item.localPath,
            mimeType: item.mimeType
          });

          if (refreshedUrls.displayUrl && refreshedUrls.displayUrl !== item.displayUrl) {
            // Update the item with the refreshed URL
            actions.updateContentItem(item.id, {
              displayUrl: refreshedUrls.displayUrl,
              thumbnailUrl: refreshedUrls.thumbnailUrl || item.thumbnailUrl
            });
            console.log(`✅ Rehydrated blob URL for ${item.filename}: ${refreshedUrls.displayUrl.substring(0, 50)}...`);
          } else {
            console.warn(`⚠️ Failed to rehydrate blob URL for ${item.filename}`);
          }
        } catch (error) {
          console.error(`❌ Error rehydrating blob URL for ${item.filename}:`, error);
        }
      }

      console.log('✅ Blob URL rehydration complete');
    };

    rehydrateBlobUrls();
  }, [isHydrated, isAuthed]); // Re-run when hydration or auth status changes

  // Clear any lingering auth dialogs and reset state
  const clearAuthState = () => {
    console.log('🔄 Clearing authentication state and dialogs...');
    setImsToken(null);
    setImsStatus('Not authenticated');
    setIsAuthenticating(false);
    
    // Clear any cached IMS data
    try {
      const imsService = createIMSService();
      imsService.clearTokenCache();
      showInfo('Auth Cleared', 'Authentication state has been reset');
    } catch (error) {
      console.warn('Failed to clear IMS cache:', error);
    }
  };

  const testIMSAuthentication = async () => {
    setIsAuthenticating(true);
    setImsStatus('Authenticating...');
    
    try {
      console.log('🔐 Starting IMS authentication test...');
      
      // Create IMS service instance
      const imsService = createIMSService();
      
      // Test token info first
      const tokenInfo = imsService.getTokenInfo();
      console.log('📊 Current token info:', tokenInfo);
      
      // Get access token
      const accessToken = await imsService.getAccessToken();
      
      console.log('✅ IMS authentication successful!');
      console.log('🎟️ Token received:', accessToken.substring(0, 20) + '...');
      
      // Set authentication state in auth store
      setAuthFromToken(accessToken);
      
      setImsToken(accessToken);
      setImsStatus(`✅ Authenticated! Token: ${accessToken.substring(0, 20)}...`);
      
      // Show success toast
      showSuccess('Authentication Successful', 'Connected to Adobe Identity Management System');
      
      // Log token storage
      console.log('🔍 Token storage:', { accessToken: accessToken.substring(0, 20) + '...', imsToken: accessToken });
      
    } catch (error) {
      console.error('❌ IMS authentication failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setImsStatus(`Error: ${errorMessage}`);
      
      // Show error toast
      showError('Authentication Failed', errorMessage);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="uxp-app">
      {/* Header */}
      <header className="uxp-header">
        <h1 className="text-heading-medium">Adobe UXP Panel</h1>
        <div className="text-detail">Premiere Pro</div>
      </header>

      {/* Main Content Area */}
      <main className="uxp-main">
        {/* Tab Navigation */}
        <div className="uxp-tabs">
          <div 
            className={`uxp-tab ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            Generate
          </div>
          <div 
            className={`uxp-tab ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery
          </div>
          <div 
            className={`uxp-tab ${activeTab === 'ingest' ? 'active' : ''}`}
            onClick={() => setActiveTab('ingest')}
          >
            Premiere Ingest
          </div>
        </div>

        {/* Primary Content */}
        <section className="uxp-content">
          <div className="content-area">
            {activeTab === 'generate' && (
              <>


                {/* Image Generation Card */}
                <article className="card">
                  <header className="card-header">
                    <h2 className="card-title">Generate Content</h2>
                    <div className="text-detail">Create images with Adobe Firefly AI or videos with LTX and Luma Dream Machine</div>
                    
                    {/* Generation Mode Toggle */}
                    <div className="generation-mode-toggle">
                      <sp-button-group>
                        <sp-button
                          variant={generationMode === 'firefly' ? 'primary' : 'secondary'}
                          size="s"
                          onClick={() => setGenerationMode('firefly')}
                        >
                          Firefly
                        </sp-button>
                        <sp-button
                          variant={generationMode === 'ltx' ? 'primary' : 'secondary'}
                          size="s"
                          onClick={() => setGenerationMode('ltx')}
                        >
                          LTX
                        </sp-button>
                          <sp-button
                            variant={generationMode === 'luma' ? 'primary' : 'secondary'}
                            size="s"
                            onClick={() => {
                              console.log('🎯 Switching to Luma generation mode');
                              setGenerationMode('luma');
                            }}
                          >
                            Luma
                          </sp-button>
                      </sp-button-group>
                    </div>
                  </header>
                  <div className="card-body">
                    {!imsToken ? (
                      <div className="auth-required">
                        <div className="text-detail" style={{ color: 'var(--theme-warning)' }}>
                          Please authenticate to generate content
                        </div>

                        <sp-button variant="accent" onClick={testIMSAuthentication} style={{ marginLeft: '12px' }}>
                          Login
                        </sp-button>
                      </div>
                    ) : generationMode === 'firefly' ? (
                      <div className="generation-form">
                        {/* Prompt Input */}
                        <div className="form-group">
                          <sp-label className="form-label">Prompt *</sp-label>
                          <sp-textarea 
                            id="prompt-input"
                            placeholder="A majestic mountain landscape at sunset with purple clouds..."
                            className="prompt-input"
                            multiline
                            rows={3}
                            maxlength={1000}
                            value={prompt}
                            onInput={(e: any) => setPrompt(e.target.value)}
                          >
                          </sp-textarea>
                          <div className="character-counter text-detail">
                            {prompt.length}/1000 characters
                          </div>
                        </div>

                        {/* Style Preset */}
                        <div className="form-group">
                          <sp-label className="form-label">Style Preset</sp-label>
                          <div className="text-detail mb-sm">Choose a visual style for your image</div>
                          <sp-picker 
                            placeholder="No Style" 
                            className="style-dropdown"
                            onChange={(e: any) => setStylePreset(e.target.value)}
                          >
                            <sp-menu slot="options">
                              <sp-menu-item value="">No Style</sp-menu-item>
                              <sp-menu-item value="photographic">Photographic</sp-menu-item>
                              <sp-menu-item value="digital-art">Digital Art</sp-menu-item>
                              <sp-menu-item value="graphic-design">Graphic Design</sp-menu-item>
                              <sp-menu-item value="3d">3D</sp-menu-item>
                              <sp-menu-item value="painting">Painting</sp-menu-item>
                              <sp-menu-item value="sketch">Sketch</sp-menu-item>
                            </sp-menu>
                          </sp-picker>
                        </div>

                        {/* Content Type */}
                        <div className="form-group">
                          <sp-label className="form-label">Content Type</sp-label>
                          <div className="text-detail mb-sm">Choose between artistic or photorealistic content</div>
                          <sp-radio-group 
                            className="content-type-group"
                            onChange={(e: any) => setContentType(e.target.value)}
                          >
                            <sp-radio value="art" checked={contentType === 'art'}>
                              <span className="radio-label">Art</span>
                              <div className="radio-description text-detail">Creative, artistic content</div>
                            </sp-radio>
                            <sp-radio value="photo" checked={contentType === 'photo'}>
                              <span className="radio-label">Photo</span>
                              <div className="radio-description text-detail">Photorealistic content</div>
                            </sp-radio>
                          </sp-radio-group>
                        </div>

                        {/* Aspect Ratio */}
                        <div className="form-group">
                          <sp-label className="form-label">Aspect Ratio</sp-label>
                          <div className="text-detail mb-sm">Choose image dimensions</div>
                          <sp-radio-group 
                            className="content-type-group"
                            onChange={(e: any) => setAspectRatio(e.target.value)}
                          >
                            <sp-radio value="square" checked={aspectRatio === 'square'}>
                              <span className="radio-label">Square</span>
                              <div className="radio-description text-detail">1024×1024</div>
                            </sp-radio>
                            <sp-radio value="landscape" checked={aspectRatio === 'landscape'}>
                              <span className="radio-label">Landscape</span>
                              <div className="radio-description text-detail">1792×1024</div>
                            </sp-radio>
                            <sp-radio value="portrait" checked={aspectRatio === 'portrait'}>
                              <span className="radio-label">Portrait</span>
                              <div className="radio-description text-detail">1024×1792</div>
                            </sp-radio>
                            <sp-radio value="ultrawide" checked={aspectRatio === 'ultrawide'}>
                              <span className="radio-label">Ultrawide</span>
                              <div className="radio-description text-detail">2048×896</div>
                            </sp-radio>
                          </sp-radio-group>
                        </div>

                        {/* Seed (Optional) */}
                        <div className="form-group">
                          <sp-label className="form-label">Seed (Optional)</sp-label>
                          <sp-slider 
                            min={0} 
                            max={999999} 
                            value={seedValue}
                            step={1}
                            className="seed-slider"
                            onInput={(e: any) => setSeedValue(parseInt(e.target.value) || 0)}
                          >
                          </sp-slider>
                        </div>

                        {/* Generate Button */}
                        <div className="form-actions">
                          <sp-button 
                            variant="accent" 
                            size="m"
                            className="generate-button"
                            onClick={handleGenerateImage}
                            disabled={isGenerating || !prompt.trim()}
                          >
                            {isGenerating ? 'Generating...' : 'Generate Image'}
                          </sp-button>
                        </div>
                      </div>
                    ) : generationMode === 'ltx' ? (
                      <div className="generation-form">
                        {/* LTX Video Prompt Input */}
                        <div className="form-group">
                          <sp-label className="form-label">Video Prompt *</sp-label>
                          <sp-textarea 
                            id="ltx-prompt-input"
                            placeholder="A cinematic shot of a futuristic city skyline at sunset, camera slowly dolly-in with warm golden light..."
                            className="prompt-input"
                            multiline
                            rows={3}
                            maxlength={1000}
                            value={ltxPrompt}
                            onInput={(e: any) => setLtxPrompt(e.target.value)}
                          >
                          </sp-textarea>
                          <div className="character-counter text-detail">
                            {ltxPrompt.length}/1000 characters
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="form-group">
                          <sp-label className="form-label">Duration</sp-label>
                          <div className="text-detail mb-sm">Video length in seconds</div>
                          <sp-slider 
                            min={1} 
                            max={10} 
                            value={ltxDuration}
                            step={1}
                            className="duration-slider"
                            onInput={(e: any) => setLtxDuration(parseInt(e.target.value) || 6)}
                          >
                          </sp-slider>
                          <div className="text-detail mt-sm">{ltxDuration} seconds</div>
                        </div>

                        {/* FPS */}
                        <div className="form-group">
                          <sp-label className="form-label">Frame Rate</sp-label>
                          <div className="text-detail mb-sm">Frames per second</div>
                          <sp-radio-group 
                            className="fps-group"
                            onChange={(e: any) => setLtxFps(parseInt(e.target.value))}
                          >
                            <sp-radio value="16" checked={ltxFps === 16}>
                              <span className="radio-label">16 FPS</span>
                              <div className="radio-description text-detail">Smooth, cinematic</div>
                            </sp-radio>
                            <sp-radio value="24" checked={ltxFps === 24}>
                              <span className="radio-label">24 FPS</span>
                              <div className="radio-description text-detail">Film standard</div>
                            </sp-radio>
                          </sp-radio-group>
                        </div>

                        {/* Resolution */}
                        <div className="form-group">
                          <sp-label className="form-label">Resolution</sp-label>
                          <div className="text-detail mb-sm">Video dimensions</div>
                          <sp-radio-group 
                            className="resolution-group"
                            onChange={(e: any) => {
                              const [width, height] = e.target.value.split('x').map(Number);
                              setLtxWidth(width);
                              setLtxHeight(height);
                            }}
                          >
                            <sp-radio value="1024x576" checked={`${ltxWidth}x${ltxHeight}` === '1024x576'}>
                              <span className="radio-label">1024×576</span>
                              <div className="radio-description text-detail">16:9 SD</div>
                            </sp-radio>
                            <sp-radio value="1280x720" checked={`${ltxWidth}x${ltxHeight}` === '1280x720'}>
                              <span className="radio-label">1280×720</span>
                              <div className="radio-description text-detail">16:9 HD</div>
                            </sp-radio>
                            <sp-radio value="1920x1080" checked={`${ltxWidth}x${ltxHeight}` === '1920x1080'}>
                              <span className="radio-label">1920×1080</span>
                              <div className="radio-description text-detail">16:9 Full HD</div>
                            </sp-radio>
                          </sp-radio-group>
                        </div>

                        {/* Seed (Optional) */}
                        <div className="form-group">
                          <sp-label className="form-label">Seed (Optional)</sp-label>
                          <sp-slider 
                            min={0} 
                            max={999999} 
                            value={ltxSeed}
                            step={1}
                            className="seed-slider"
                            onInput={(e: any) => setLtxSeed(parseInt(e.target.value) || 0)}
                          >
                          </sp-slider>
                        </div>

                        {/* Generate Button */}
                        <div className="form-actions">
                          <sp-button 
                            variant="accent" 
                            size="m"
                            className="generate-button"
                            onClick={handleGenerateLtxVideo}
                            disabled={isGeneratingLtx || !ltxPrompt.trim()}
                          >
                            {isGeneratingLtx ? 'Generating...' : 'Generate Video'}
                          </sp-button>
                        </div>
                      </div>
                    ) : (
                      <div className="generation-form">
                        {/* Luma Video Prompt */}
                        <div className="form-group">
                          <sp-label className="form-label">Video Prompt *</sp-label>
                          <sp-textarea 
                            id="luma-prompt-input"
                            placeholder="A sweeping drone shot over bioluminescent waves crashing on a night beach..."
                            className="prompt-input"
                            multiline
                            rows={3}
                            maxlength={1000}
                            value={lumaPrompt}
                            onInput={(e: any) => setLumaPrompt(e.target.value)}
                          >
                          </sp-textarea>
                          <div className="character-counter text-detail">
                            {lumaPrompt.length}/1000 characters
                          </div>
                        </div>

                        {/* Mode Selection */}
                        <div className="form-group">
                          <sp-label className="form-label">Mode</sp-label>
                          <div className="text-detail mb-sm">Choose generation mode</div>
                          <sp-radio-group 
                            className="content-type-group"
                            onChange={(e: any) => {
                              setLumaMode(e.target.value);
                              // Clear selections when switching modes
                              if (e.target.value === 'reframe') {
                                setLumaFirstFrameItem(null);
                                setLumaLastFrameItem(null);
                              } else {
                                setLumaReframeVideoItem(null);
                              }
                            }}
                          >
                            <sp-radio value="keyframes" checked={lumaMode === 'keyframes'}>
                              <span className="radio-label">First Frame Last Frame</span>
                              <div className="radio-description text-detail">Generate video with start/end images</div>
                            </sp-radio>
                            <sp-radio value="reframe" checked={lumaMode === 'reframe'}>
                              <span className="radio-label">Reframe</span>
                              <div className="radio-description text-detail">Change aspect ratio of existing video</div>
                            </sp-radio>
                          </sp-radio-group>
                        </div>

                        {/* Model */}
                        <div className="form-group">
                          <sp-label className="form-label">Model</sp-label>
                          <div className="text-detail mb-sm">Choose the Dream Machine model</div>
                          <sp-picker 
                            placeholder="Select model"
                            className="style-dropdown"
                            onChange={(e: any) => setLumaModel(e.target.value)}
                          >
                            <sp-menu slot="options">
                              <sp-menu-item value="ray-2">Ray 2</sp-menu-item>
                              <sp-menu-item value="ray-flash-2">Ray Flash 2</sp-menu-item>
                              <sp-menu-item value="ray-1-6">Ray 1.6</sp-menu-item>
                            </sp-menu>
                          </sp-picker>
                        </div>

                        {lumaMode === 'keyframes' ? (
                          <>
                            {/* Aspect Ratio */}
                            <div className="form-group">
                              <sp-label className="form-label">Aspect Ratio</sp-label>
                              <div className="text-detail mb-sm">Select the composition</div>
                              <sp-radio-group 
                                className="content-type-group"
                                onChange={(e: any) => setLumaAspectRatio(e.target.value)}
                              >
                                <sp-radio value="16:9" checked={lumaAspectRatio === '16:9'}>
                                  <span className="radio-label">16:9</span>
                                  <div className="radio-description text-detail">Widescreen</div>
                                </sp-radio>
                                <sp-radio value="9:16" checked={lumaAspectRatio === '9:16'}>
                                  <span className="radio-label">9:16</span>
                                  <div className="radio-description text-detail">Vertical</div>
                                </sp-radio>
                                <sp-radio value="1:1" checked={lumaAspectRatio === '1:1'}>
                                  <span className="radio-label">1:1</span>
                                  <div className="radio-description text-detail">Square</div>
                                </sp-radio>
                                <sp-radio value="21:9" checked={lumaAspectRatio === '21:9'}>
                                  <span className="radio-label">21:9</span>
                                  <div className="radio-description text-detail">Ultra-wide</div>
                                </sp-radio>
                              </sp-radio-group>
                            </div>

                            {/* Duration */}
                            <div className="form-group">
                              <sp-label className="form-label">Duration</sp-label>
                              <div className="text-detail mb-sm">Clip length</div>
                              <sp-radio-group 
                                className="fps-group"
                                onChange={(e: any) => setLumaDuration(e.target.value)}
                              >
                                <sp-radio value="5s" checked={lumaDuration === '5s'}>
                                  <span className="radio-label">5 seconds</span>
                                  <div className="radio-description text-detail">Quick loop</div>
                                </sp-radio>
                                <sp-radio value="9s" checked={lumaDuration === '9s'}>
                                  <span className="radio-label">9 seconds</span>
                                  <div className="radio-description text-detail">Longer motion</div>
                                </sp-radio>
                              </sp-radio-group>
                            </div>

                            {/* Resolution */}
                            <div className="form-group">
                              <sp-label className="form-label">Resolution</sp-label>
                              <div className="text-detail mb-sm">Output size</div>
                              <sp-radio-group 
                                className="resolution-group"
                                onChange={(e: any) => setLumaResolution(e.target.value)}
                              >
                                <sp-radio value="540p" checked={lumaResolution === '540p'}>
                                  <span className="radio-label">540p</span>
                                  <div className="radio-description text-detail">Lightweight preview</div>
                                </sp-radio>
                                <sp-radio value="720p" checked={lumaResolution === '720p'}>
                                  <span className="radio-label">720p</span>
                                  <div className="radio-description text-detail">HD</div>
                                </sp-radio>
                                <sp-radio value="1080p" checked={lumaResolution === '1080p'}>
                                  <span className="radio-label">1080p</span>
                                  <div className="radio-description text-detail">Full HD</div>
                                </sp-radio>
                                <sp-radio value="4k" checked={lumaResolution === '4k'}>
                                  <span className="radio-label">4K</span>
                                  <div className="radio-description text-detail">Ultra HD</div>
                                </sp-radio>
                              </sp-radio-group>
                            </div>

                            {/* Quick Frame Selection */}
                            <div className="form-group">
                              {/* @ts-ignore */}
                              <sp-label className="form-label">Quick Selection</sp-label>
                              <div className="text-detail mb-sm">Select both first and last frame images at once</div>
                              <div className="image-selection-buttons">
                                {/* @ts-ignore */}
                                <sp-button
                                  variant="primary"
                                  size="m"
                                  onClick={() => {
                                    // Open gallery picker for selecting both frames
                                    setGalleryPickerTarget('both');
                                    setShowGalleryPicker(true);
                                  }}
                                  disabled={lumaFirstFrameItem !== null && lumaLastFrameItem !== null}
                                >
                                  {lumaFirstFrameItem && lumaLastFrameItem ? 'Frames Selected' : 'Select First & Last Frame'}
                                {/* @ts-ignore */}
                                </sp-button>
                                {(lumaFirstFrameItem || lumaLastFrameItem) && (
                                  /* @ts-ignore */
                                  <sp-button
                                    variant="secondary"
                                    size="m"
                                    onClick={() => {
                                      setLumaFirstFrameItem(null);
                                      setLumaLastFrameItem(null);
                                    }}
                                  >
                                    Clear All Frames
                                  {/* @ts-ignore */}
                                  </sp-button>
                                )}
                              </div>
                            </div>
                            {/* First Frame Image */}
                            <div className="form-group">
                              {/* @ts-ignore */}
                              <sp-label className="form-label">First Frame Image (Optional)</sp-label>
                              <div className="text-detail mb-sm">Select an image from your gallery for the video start</div>
                              {lumaFirstFrameItem ? (
                                <div className="selected-image-preview">
                                  {lumaFirstFrameItem.displayUrl ? (
                                    <img
                                      src={lumaFirstFrameItem.displayUrl}
                                      alt="First frame"
                                      className="preview-image"
                                      style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <div className="preview-image-placeholder" style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--theme-surface-secondary)', border: '1px dashed var(--theme-border)' }}>
                                      <div className="text-detail" style={{ fontSize: '11px', color: 'var(--theme-text-secondary)' }}>No preview</div>
                                    </div>
                                  )}
                                  <div className="preview-info">
                                    <div className="text-detail">{lumaFirstFrameItem.filename}</div>
                                    {!lumaFirstFrameItem.blobUrl && (
                                      <div className="text-detail" style={{ color: 'var(--theme-warning)', fontSize: '11px' }}>
                                        ⚠️ May not be accessible to Luma API
                                      </div>
                                    )}
                                    {/* @ts-ignore */}
                                    <sp-button
                                      variant="secondary"
                                      size="s"
                                      onClick={() => setLumaFirstFrameItem(null)}
                                    >
                                      Remove
                                    {/* @ts-ignore */}
                                    </sp-button>
                                  </div>
                                </div>
                              ) : (
                                <div className="image-selection-buttons">
                                  {/* @ts-ignore */}
                                  <sp-button
                                    variant="secondary"
                                    size="m"
                                    onClick={() => {
                                      setGalleryPickerTarget('first');
                                      setShowGalleryPicker(true);
                                    }}
                                  >
                                    Choose First Frame from Gallery
                                  {/* @ts-ignore */}
                                  </sp-button>
                                </div>
                              )}
                            </div>
                            <div className="form-group">
                              {/* @ts-ignore */}
                              <sp-label className="form-label">Last Frame Image (Optional)</sp-label>
                              <div className="text-detail mb-sm">Select an image from your gallery for the video end</div>
                              {lumaLastFrameItem ? (
                                <div className="selected-image-preview">
                                  {lumaLastFrameItem.displayUrl ? (
                                    <img
                                      src={lumaLastFrameItem.displayUrl}
                                      alt="Last frame"
                                      className="preview-image"
                                      style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <div className="preview-image-placeholder" style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--theme-surface-secondary)', border: '1px dashed var(--theme-border)' }}>
                                      <div className="text-detail" style={{ fontSize: '11px', color: 'var(--theme-text-secondary)' }}>No preview</div>
                                    </div>
                                  )}
                                  <div className="preview-info">
                                    <div className="text-detail">{lumaLastFrameItem.filename}</div>
                                    {/* @ts-ignore */}
                                    <sp-button
                                      variant="secondary"
                                      size="s"
                                      onClick={() => setLumaLastFrameItem(null)}
                                    >
                                      Remove
                                    {/* @ts-ignore */}
                                    </sp-button>
                                  </div>
                                </div>
                              ) : (
                                <div className="image-selection-buttons">
                                  {/* @ts-ignore */}
                                  <sp-button
                                    variant="secondary"
                                    size="m"
                                    onClick={() => {
                                      setGalleryPickerTarget('last');
                                      setShowGalleryPicker(true);
                                    }}
                                  >
                                    Choose Last Frame from Gallery
                                  {/* @ts-ignore */}
                                  </sp-button>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Reframe Video Selection */}
                            <div className="form-group">
                              {/* @ts-ignore */}
                              <sp-label className="form-label">Video to Reframe *</sp-label>
                              <div className="text-detail mb-sm">Select a video from your gallery to change its aspect ratio</div>
                              {lumaReframeVideoItem ? (
                                <div className="selected-video-preview">
                                  {lumaReframeVideoItem.displayUrl ? (
                                    <video
                                      src={lumaReframeVideoItem.displayUrl}
                                      className="preview-video"
                                      style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                                      controls
                                    />
                                  ) : (
                                    <div className="preview-video-placeholder" style={{ width: '200px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--theme-surface-secondary)', border: '1px dashed var(--theme-border)' }}>
                                      <div className="text-detail" style={{ fontSize: '11px', color: 'var(--theme-text-secondary)' }}>No preview</div>
                                    </div>
                                  )}
                                  <div className="preview-info">
                                    <div className="text-detail">{lumaReframeVideoItem.filename}</div>
                                    {/* @ts-ignore */}
                                    <sp-button
                                      variant="secondary"
                                      size="s"
                                      onClick={() => setLumaReframeVideoItem(null)}
                                    >
                                      Remove
                                    {/* @ts-ignore */}
                                    </sp-button>
                                  </div>
                                </div>
                              ) : (
                                <div className="video-selection-buttons">
                                  {/* @ts-ignore */}
                                  <sp-button
                                    variant="secondary"
                                    size="m"
                                    onClick={() => {
                                      console.log('🎥 Opening gallery picker for reframe-video selection');
                                      setGalleryPickerTarget('reframe-video');
                                      setShowGalleryPicker(true);
                                    }}
                                  >
                                    Choose Video from Gallery
                                  {/* @ts-ignore */}
                                  </sp-button>
                                  {/* @ts-ignore */}
                                  <sp-button
                                    variant="outline"
                                    size="s"
                                    onClick={async () => {
                                      console.log('🔄 Syncing local files to load videos...');
                                      const { actions } = useGalleryStore.getState();
                                      await actions.syncLocalFiles();
                                      console.log('✅ Local files synced');
                                      
                                      // Re-log available videos after sync
                                      const { contentItems } = useGalleryStore.getState();
                                      const videos = contentItems.filter(item => ['video', 'uploaded-video'].includes(item.contentType));
                                      console.log('🎥 Videos after sync:', videos.length);
                                      videos.forEach((video, index) => {
                                        console.log(`  ${index + 1}. ${video.filename} (${video.contentType})`);
                                      });
                                      
                                      showInfo('Sync Complete', 'Local files have been synced to gallery');
                                    }}
                                    style={{ marginLeft: '8px' }}
                                  >
                                    Sync Local Files
                                  {/* @ts-ignore */}
                                  </sp-button>
                                </div>
                              )}
                            </div>

                            {/* Reframe Aspect Ratio */}
                            <div className="form-group">
                              {/* @ts-ignore */}
                              <sp-label className="form-label">Target Aspect Ratio *</sp-label>
                              <div className="text-detail mb-sm">Choose the new aspect ratio for the video</div>
                              {/* @ts-ignore */}
                              <sp-radio-group 
                                className="content-type-group"
                                onChange={(e: any) => setLumaAspectRatio(e.target.value)}
                              >
                                {/* @ts-ignore */}
                                <sp-radio value="1:1" checked={lumaAspectRatio === '1:1'}>
                                  <span className="radio-label">1:1</span>
                                  <div className="radio-description text-detail">Square</div>
                                {/* @ts-ignore */}
                                </sp-radio>
                                {/* @ts-ignore */}
                                <sp-radio value="16:9" checked={lumaAspectRatio === '16:9'}>
                                  <span className="radio-label">16:9</span>
                                  <div className="radio-description text-detail">Widescreen</div>
                                {/* @ts-ignore */}
                                </sp-radio>
                                {/* @ts-ignore */}
                                <sp-radio value="9:16" checked={lumaAspectRatio === '9:16'}>
                                  <span className="radio-label">9:16</span>
                                  <div className="radio-description text-detail">Vertical</div>
                                {/* @ts-ignore */}
                                </sp-radio>
                                {/* @ts-ignore */}
                                <sp-radio value="4:3" checked={lumaAspectRatio === '4:3'}>
                                  <span className="radio-label">4:3</span>
                                  <div className="radio-description text-detail">Traditional</div>
                                {/* @ts-ignore */}
                                </sp-radio>
                                {/* @ts-ignore */}
                                <sp-radio value="3:4" checked={lumaAspectRatio === '3:4'}>
                                  <span className="radio-label">3:4</span>
                                  <div className="radio-description text-detail">Portrait</div>
                                {/* @ts-ignore */}
                                </sp-radio>
                                {/* @ts-ignore */}
                                <sp-radio value="21:9" checked={lumaAspectRatio === '21:9'}>
                                  <span className="radio-label">21:9</span>
                                  <div className="radio-description text-detail">Ultra-wide</div>
                                {/* @ts-ignore */}
                                </sp-radio>
                                {/* @ts-ignore */}
                                <sp-radio value="9:21" checked={lumaAspectRatio === '9:21'}>
                                  <span className="radio-label">9:21</span>
                                  <div className="radio-description text-detail">Ultra-tall</div>
                                {/* @ts-ignore */}
                                </sp-radio>
                              {/* @ts-ignore */}
                              </sp-radio-group>
                            </div>
                          </>
                        )}

                        {/* Generate Button */}
                        <div className="form-actions">
                          {(() => {
                            const isButtonDisabled = isGeneratingLuma || !lumaPrompt.trim() || (lumaMode === 'reframe' && !lumaReframeVideoItem);
                            return (
                              <sp-button 
                                variant="accent" 
                                size="m"
                                className="generate-button"
                                onClick={lumaMode === 'reframe' ? handleReframeLumaVideo : handleGenerateLumaVideo}
                                disabled={isButtonDisabled}
                              >
                                {isGeneratingLuma ? 'Generating...' : lumaMode === 'reframe' ? 'Reframe Video' : 'Generate Video'}
                              </sp-button>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              </>
            )}

            {activeTab === 'gallery' && (
              imsToken ? (
                <Gallery />
              ) : (
                <article className="card">
                  <header className="card-header">
                    <h2 className="card-title">Sign in to view your gallery</h2>
                    <div className="text-detail">Authenticate to browse saved generations.</div>
                  </header>
                  <div className="card-body">
                    <div className="auth-required" style={{ margin: 0 }}>
                      <div className="text-detail" style={{ color: 'var(--theme-warning)' }}>
                        Please authenticate to access the gallery
                      </div>

                      {/* @ts-ignore */}
                      <sp-button
                        variant="accent"
                        onClick={testIMSAuthentication}
                        style={{ marginLeft: '12px' }}
                      >
                        Login
                      {/* @ts-ignore */}
                      </sp-button>
                    </div>
                  </div>
                </article>
              )
            )}

            {activeTab === 'ingest' && (
              <LocalIngestPanel />
            )}
          </div>
        </section>
      </main>

      {/* Gallery Picker Modal */}
      {showGalleryPicker && (
        <div className="gallery-picker-modal">
          <div className="gallery-picker-overlay" onClick={() => {
            setShowGalleryPicker(false);
            setGalleryPickerTarget(null);
          }} />
          <div className="gallery-picker-dialog">
            <div className="gallery-picker-header">
              <h3>
                {galleryPickerTarget === 'both' 
                  ? `Select ${!lumaFirstFrameItem ? 'First' : 'Last'} Frame Image`
                  : galleryPickerTarget === 'reframe-video'
                  ? 'Select Video to Reframe'
                  : 'Select Image from Gallery'
                }
              </h3>
              {/* @ts-ignore */}
              <sp-button
                variant="secondary"
                size="s"
                onClick={() => {
                  setShowGalleryPicker(false);
                  setGalleryPickerTarget(null);
                }}
              >
                ✕
              {/* @ts-ignore */}
              </sp-button>
            </div>
            <div className="gallery-picker-content">
              <GalleryPicker
                target={galleryPickerTarget}
                onSelect={(item: ContentItem) => {
                  if (galleryPickerTarget === 'first') {
                    setLumaFirstFrameItem(item);
                  } else if (galleryPickerTarget === 'last') {
                    setLumaLastFrameItem(item);
                  } else if (galleryPickerTarget === 'reframe-video') {
                    setLumaReframeVideoItem(item);
                  } else if (galleryPickerTarget === 'both') {
                    // For 'both' selection, alternate between first and last
                    if (!lumaFirstFrameItem) {
                      setLumaFirstFrameItem(item);
                      // If last frame is also not set, keep picker open for second selection
                      if (!lumaLastFrameItem) {
                        showInfo('First Frame Selected', 'Now select the last frame image');
                        return; // Keep picker open
                      }
                    } else if (!lumaLastFrameItem) {
                      setLumaLastFrameItem(item);
                    }
                  }
                  setShowGalleryPicker(false);
                  setGalleryPickerTarget(null);
                }}
                onCancel={() => {
                  setShowGalleryPicker(false);
                  setGalleryPickerTarget(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="uxp-footer">
        <div className="text-detail">UXP Panel v1.0.0</div>
        <div className="footer-controls">
          <div className="text-detail">
            {isAuthenticating ? 'Authenticating...' : imsToken ? 'Authenticated' : 'Ready'}
          </div>

          {/* Theme Toggle */}
          {/* @ts-ignore */}
          <sp-action-button 
            quiet 
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="theme-toggle"
          >
            {isDarkMode ? <MoonIcon className="theme-icon" /> : <SunIcon className="theme-icon" />}
          {/* @ts-ignore */}
          </sp-action-button>

          {/* Logout Button */}
          {imsToken && (
            /* @ts-ignore */
            <sp-action-button 
              quiet 
              onClick={clearAuthState}
              title="Logout"
              className="logout-button"
            >
              <span>Logout</span>
            {/* @ts-ignore */}
            </sp-action-button>
          )}
        </div>
      </footer>
    </div>
  );
};

// Gallery Picker Component
const GalleryPicker = ({ target, onSelect, onCancel }: {
  target: 'first' | 'last' | 'both' | 'reframe-video' | null;
  onSelect: (item: ContentItem) => void;
  onCancel: () => void;
}) => {
  // Use useShallow to prevent infinite re-renders by doing shallow comparison of the result
  const galleryImages = useGalleryStore(
    useShallow((state) => {
      const allItems = state.contentItems;
      console.log('🎥 GalleryPicker - All content items:', allItems.length);
      console.log('🎥 GalleryPicker - Target:', target);
      
      // Log what directory we're searching
      const folderToken = localStorage.getItem('boltuxp.localFolderToken');
      const folderPath = localStorage.getItem('boltuxp.localFolderPath');
      console.log('🎥 GalleryPicker - Local storage directory:', { folderToken, folderPath });
      
      const filtered = allItems.filter(item => {
        const hasVideoExtension = item.filename ? /\.(mp4|mov|avi|mkv|webm|m4v)$/i.test(item.filename) : false;
        const isVideo = ['video', 'uploaded-video'].includes(item.contentType) || hasVideoExtension;
        const isImage = ['generated-image', 'corrected-image', 'uploaded-image'].includes(item.contentType);
        
        if (target === 'reframe-video') {
          console.log(`🎥 GalleryPicker - Checking item: ${item.filename} (${item.contentType}) - isVideo: ${isVideo} (ext:${hasVideoExtension})`);
          return isVideo;
        } else {
          return isImage;
        }
      });
      
      console.log(`🎥 GalleryPicker - Filtered items (${target}):`, filtered.length);
      filtered.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.filename} (${item.contentType}) - URL: ${item.displayUrl ? 'has displayUrl' : 'no displayUrl'}`);
      });
      
      return filtered;
    })
  );

  return (
    <div className="gallery-picker">
      {galleryImages.length === 0 ? (
        <div className="gallery-empty">
          <div className="text-detail">
            {target === 'reframe-video' ? 'No videos in gallery' : 'No images in gallery'}
          </div>
          {/* @ts-ignore */}
          <sp-button variant="secondary" onClick={onCancel}>
            Cancel
          {/* @ts-ignore */}
          </sp-button>
        </div>
      ) : (
        <>
          <div className="gallery-grid">
            {galleryImages.slice(0, 20).map((item: ContentItem) => (
              <div
                key={item.id}
                className="gallery-item"
                onClick={() => onSelect(item)}
              >
                {item.displayUrl ? (
                  <img
                    src={item.displayUrl}
                    alt={item.filename}
                    className="gallery-thumbnail"
                  />
                ) : (
                  <div className="gallery-thumbnail-placeholder">
                    <div className="text-detail">No preview</div>
                  </div>
                )}
                <div className="gallery-item-info">
                  <div className="text-detail">{item.filename}</div>
                  <div className="text-detail" style={{ fontSize: '10px', color: 'var(--theme-text-secondary)', marginTop: '2px' }}>
                    Type: {item.contentType}
                  </div>
                  {item.size && (
                    <div className="text-detail" style={{ fontSize: '10px', color: 'var(--theme-text-secondary)' }}>
                      Size: {(item.size / 1024 / 1024).toFixed(1)} MB
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="gallery-actions">
            {/* @ts-ignore */}
            <sp-button variant="secondary" onClick={onCancel}>
              Cancel
            {/* @ts-ignore */}
            </sp-button>
          </div>
        </>
      )}
    </div>
  );
};

// Main App component with ToastProvider
export const App = () => {
  return (
    <ToastProvider maxToasts={5} defaultDuration={5000}>
      <AppContent />
    </ToastProvider>
  );
};
