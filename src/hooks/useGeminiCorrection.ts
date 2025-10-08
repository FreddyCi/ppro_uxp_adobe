import { useCallback } from 'react';
import { createIMSService } from '../services/ims/IMSService';
import { GeminiService } from '../services/gemini';
import type { CorrectionParams } from '../types/gemini';
import type { ContentItem } from '../types/content';

interface ToastHelpers {
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
}

interface GeminiCorrectionParams {
  selectedImage: {
    id: string;
    url: string;
    prompt: string;
    localFilePath?: string;
    source?: 'generated' | 'corrected';
    parentId?: string;
  } | null;
  corrections: CorrectionParams;
  loadLocalFileAsBlob: (filePath: string) => Promise<Blob>;
  getImageDimensions: (url: string) => Promise<{ width: number; height: number; aspectRatio: number } | null>;
  addContentItem: (item: ContentItem) => void;
  setIsCorrecting: (value: boolean) => void;
  resetDialog: () => void;
  toastHelpers: ToastHelpers;
}

function inferMimeType(filePath: string, fallback: string = 'image/jpeg'): string {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';

  switch (extension) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return fallback;
  }
}

export function useGeminiCorrection(params: GeminiCorrectionParams) {
  const {
    selectedImage,
    corrections,
    loadLocalFileAsBlob,
    getImageDimensions,
    addContentItem,
    setIsCorrecting,
    resetDialog,
    toastHelpers
  } = params;

  const { showSuccess, showError, showInfo, showWarning } = toastHelpers;

  const handleCorrectImage = useCallback(async () => {
    console.log('🚀 [Gemini Hook] Starting correction process...');
    
    if (!selectedImage) {
      console.warn('⚠️ [Gemini Hook] No image selected');
      return;
    }

    console.log('📝 [Gemini Hook] Checking corrections:', corrections);

    const hasCorrections =
      Object.keys(corrections).some(key => key !== 'customPrompt' && Boolean(corrections[key as keyof CorrectionParams])) ||
      Boolean(corrections.customPrompt);

    console.log('✅ [Gemini Hook] Has corrections:', hasCorrections);

    if (!hasCorrections) {
      console.warn('⚠️ [Gemini Hook] No corrections provided');
      showWarning('Add a correction', 'Select at least one correction or provide a prompt.');
      return;
    }

    try {
      setIsCorrecting(true);
      showInfo('Enhancing image', 'Gemini is applying your corrections...');

      let imageBlob: Blob;

      // Try to load from local file first if available
      if (selectedImage.localFilePath) {
        try {
          console.log('📁 [Gemini Hook] Loading image from local file:', selectedImage.localFilePath);
          imageBlob = await loadLocalFileAsBlob(selectedImage.localFilePath);
          console.log('✅ [Gemini Hook] Successfully loaded local image');
        } catch (localError) {
          console.warn('⚠️ [Gemini Hook] Failed to load local image, falling back to URL fetch:', localError);
          // Fall back to URL fetch
          const response = await fetch(selectedImage.url);
          if (!response.ok) {
            throw new Error('Unable to load the original image.');
          }
          imageBlob = await response.blob();
        }
      } else {
        // Load from URL
        const response = await fetch(selectedImage.url);
        if (!response.ok) {
          throw new Error('Unable to load the original image.');
        }
        imageBlob = await response.blob();
      }

      const sourcePath = selectedImage.localFilePath || selectedImage.url;
      const inferredMime = inferMimeType(sourcePath);
      const originalMime = imageBlob.type;
      const resolvedMime =
        originalMime && originalMime.startsWith('image/')
          ? originalMime
          : inferredMime && inferredMime.startsWith('image/')
            ? inferredMime
            : 'image/jpeg';

      if (!originalMime || originalMime !== resolvedMime) {
        const arrayBuffer = await imageBlob.arrayBuffer();
        imageBlob = new Blob([arrayBuffer], { type: resolvedMime });
        console.log('ℹ️ [Gemini Hook] Normalized image blob MIME type', {
          originalType: originalMime,
          resolvedMime,
          sourcePath,
        });
      }

      // Create Gemini service with IMS token
      const imsService = createIMSService();
      const geminiService = new GeminiService(imsService as any);

      console.log('🚀 [Gemini Hook] Sending correction request...');
      const result = await geminiService.correctImage(imageBlob, corrections);

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Gemini did not return a corrected image.');
      }

      const correctedImage = result.data;
      console.log('📦 [Gemini Hook] Received corrected image:', {
        id: correctedImage.id,
        filename: correctedImage.filename,
        hasDataUrl: !!correctedImage.dataUrl,
        hasCorrectedUrl: !!correctedImage.correctedUrl,
        hasLocalFilePath: !!correctedImage.localFilePath,
        storageMode: correctedImage.storageMode,
        persistenceMethod: correctedImage.persistenceMethod,
      });
      
      // Use the data URL from GeminiService (same as Firefly/Luma pattern)
      const displayUrl = correctedImage.dataUrl || correctedImage.correctedUrl;
      
      console.log('🔍 [Gemini Hook] Using data URL for display:', displayUrl?.substring(0, 50) + '...');
      console.log('🔍 [Gemini Hook] Getting image dimensions...');
      
      // Get dimensions with timeout to prevent hanging
      const getDimensionsWithTimeout = (url: string, timeoutMs: number = 5000) => {
        return Promise.race([
          getImageDimensions(url),
          new Promise<null>((resolve) => setTimeout(() => {
            console.warn('⏱️ [Gemini Hook] Image dimension fetch timed out, using defaults');
            resolve(null);
          }, timeoutMs))
        ]);
      };
      
      const originalSize = await getDimensionsWithTimeout(selectedImage.url);
      const correctedSize = await getDimensionsWithTimeout(displayUrl);
      console.log('✅ [Gemini Hook] Image dimensions retrieved', { originalSize, correctedSize });

      const enhancedImage = {
        ...correctedImage,
        originalUrl: selectedImage.url,
        correctedUrl: displayUrl,
        thumbnailUrl: displayUrl,
        dataUrl: displayUrl,
        parentGenerationId:
          selectedImage.source === 'generated'
            ? selectedImage.id
            : selectedImage.parentId || selectedImage.id,
        metadata: {
          ...correctedImage.metadata,
          corrections: corrections,
          originalSize: originalSize || correctedImage.metadata.originalSize,
          correctedSize: correctedSize || correctedImage.metadata.correctedSize,
          timestamp: new Date(),
        },
        timestamp: new Date(),
      };

      console.log('🖼️ [Gemini Hook] Enhanced image data:', {
        id: enhancedImage.id,
        filename: enhancedImage.filename,
        correctedUrl: enhancedImage.correctedUrl,
        thumbnailUrl: enhancedImage.thumbnailUrl,
        localFilePath: enhancedImage.localFilePath,
        storageMode: enhancedImage.storageMode,
      });

      // Convert to unified ContentItem format
      const contentItem: ContentItem = {
        // Base metadata
        id: enhancedImage.id,
        filename: enhancedImage.filename || `correction_${enhancedImage.id}.jpg`,
        originalName: enhancedImage.filename || `correction_${enhancedImage.id}.jpg`,
        mimeType: 'image/jpeg',
        size: enhancedImage.metadata?.correctedSize?.width * enhancedImage.metadata?.correctedSize?.height || 0,
        tags: [],
        timestamp: enhancedImage.timestamp,
        userId: undefined,
        sessionId: undefined,

        // Type and display
        contentType: 'corrected-image',
        displayUrl: enhancedImage.correctedUrl, // Data URL - persists across reloads!
        thumbnailUrl: enhancedImage.thumbnailUrl,
        localPath: enhancedImage.localFilePath,
        localMetadataPath: enhancedImage.localMetadataPath,

        // Content data for corrected image
        content: {
          type: 'corrected-image',
          originalUrl: enhancedImage.originalUrl,
          correctedUrl: enhancedImage.correctedUrl,
          corrections: corrections,
          correctionMetadata: enhancedImage.metadata,
          parentGenerationId: enhancedImage.parentGenerationId,
          azureMetadata: enhancedImage.azureMetadata
        },

        // Storage
        storageMode: enhancedImage.storageMode || 'local',
        persistenceMethod: enhancedImage.persistenceMethod || 'local',
        folderToken: enhancedImage.folderToken,
        relativePath: enhancedImage.relativePath,

        // Status
        status: 'ready'
      };

      console.log('🔄 [Gemini Hook] Adding content item to gallery...');
      console.log('📦 [Gemini Hook] Content item details:', {
        id: contentItem.id,
        filename: contentItem.filename,
        contentType: contentItem.contentType,
        displayUrl: contentItem.displayUrl?.substring(0, 100),
        thumbnailUrl: contentItem.thumbnailUrl?.substring(0, 100),
        localPath: contentItem.localPath,
        storageMode: contentItem.storageMode,
        persistenceMethod: contentItem.persistenceMethod
      });
      
      addContentItem(contentItem);
      console.log('✅ [Gemini Hook] Content item added successfully');

      console.log('🎉 [Gemini Hook] Showing success toast...');
      showSuccess('Correction complete', 'Gemini created a refined version in your gallery.');
      
      console.log('🚪 [Gemini Hook] Closing dialog...');
      setIsCorrecting(false);
      resetDialog();
      console.log('✅ [Gemini Hook] Correction completed successfully!');
      
    } catch (error: any) {
      console.error('❌ [Gemini Hook] Correction failed:', error);
      showError('Correction failed', error?.message || 'Unable to correct the image right now.');
      
      setIsCorrecting(false);
      resetDialog();
    }
  }, [
    selectedImage,
    corrections,
    loadLocalFileAsBlob,
    getImageDimensions,
    addContentItem,
    setIsCorrecting,
    resetDialog,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  ]);

  return { handleCorrectImage };
}
