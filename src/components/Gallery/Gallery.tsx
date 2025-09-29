// @ts-ignore
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useGenerationStore } from '../../store/generationStore';
import { useGalleryStore, loadGalleryItems } from '../../store/galleryStore';
import { createIMSService } from '../../services/ims/IMSService';
import type { IMSService as IMSServiceClass } from '../../services/ims/IMSService';
import { GeminiService } from '../../services/gemini';
import type { CorrectionParams } from '../../types/gemini';
import { useToastHelpers } from '../../hooks/useToast';
import './Gallery.scss';

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
    case 'bmp':
      return 'image/bmp';
    case 'tif':
    case 'tiff':
      return 'image/tiff';
    case 'heic':
      return 'image/heic';
    case 'psd':
      return 'image/vnd.adobe.photoshop';
    case 'svg':
      return 'image/svg+xml';
    default:
      return fallback;
  }
}

// Helper function to load local image file as blob
async function loadLocalImageAsBlob(filePath: string): Promise<Blob> {
  const inferredMimeType = inferMimeType(filePath);
  // Try Bolt addon first
  try {
    const requireFn = (globalThis as unknown as { require?: (moduleId: string) => any }).require;
    if (requireFn) {
      const uxp = requireFn('uxp') as any;
      if (uxp?.addon?.get) {
        const addon = uxp.addon.get('bolt-uxp-hybrid.uxpaddon');
        if (addon?.readFile) {
          const base64Data = addon.readFile(filePath, false); // false = don't base64 encode
          if (base64Data) {
            // Convert base64 to blob
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            return new Blob([bytes], { type: inferredMimeType });
          }
        }
      }
    }
  } catch (boltError) {
    console.warn('Bolt addon read failed, trying UXP filesystem:', boltError);
  }

  // Try UXP filesystem fallback with stored folder token
  try {
    const requireFn = (globalThis as unknown as { require?: (moduleId: string) => any }).require;
    if (requireFn) {
      const uxp = requireFn('uxp') as any;
      const storage = uxp?.storage;
      const localFileSystem = storage?.localFileSystem;
      const binaryFormat = storage?.formats?.binary;
      if (localFileSystem) {
        // Get the stored folder token
        const FOLDER_TOKEN_STORAGE_KEY = 'boltuxp.localFolderToken';
        const FOLDER_PATH_STORAGE_KEY = 'boltuxp.localFolderPath';
        const token = typeof window !== 'undefined' && window.localStorage 
          ? window.localStorage.getItem(FOLDER_TOKEN_STORAGE_KEY) 
          : null;
        const storedFolderPath = typeof window !== 'undefined' && window.localStorage
          ? window.localStorage.getItem(FOLDER_PATH_STORAGE_KEY)
          : null;
        
        if (token) {
          // Get the folder entry using the token
          let folder: any = null;
          if (typeof localFileSystem.getEntryWithToken === 'function') {
            folder = await localFileSystem.getEntryWithToken(token);
          } else if (typeof localFileSystem.getEntryForPersistentToken === 'function') {
            folder = await localFileSystem.getEntryForPersistentToken(token);
          }
          
          if (folder) {
            // Determine the relative path from the stored base folder if available
            let relativePath = filePath;
            if (storedFolderPath && filePath.startsWith(storedFolderPath)) {
              relativePath = filePath.slice(storedFolderPath.length);
            }

            relativePath = relativePath.replace(/^[/\\]+/, '');
            const pathSegments = relativePath
              .split(/[/\\]+/)
              .filter(segment => segment.length > 0);

            let currentEntry: any = folder;
            for (const segment of pathSegments) {
              if (!currentEntry?.getEntry) {
                currentEntry = null;
                break;
              }

              try {
                currentEntry = await currentEntry.getEntry(segment);
              } catch (segmentError) {
                console.warn('UXP filesystem segment lookup failed:', {
                  segment,
                  error: segmentError
                });
                currentEntry = null;
                break;
              }
            }

            if (currentEntry && typeof currentEntry.read === 'function') {
              if (!binaryFormat) {
                console.warn('UXP storage binary format unavailable; attempting default read.');
              }

              const readOptions = binaryFormat ? { format: binaryFormat } : undefined;
              const arrayBuffer = await currentEntry.read(readOptions);
              if (arrayBuffer instanceof ArrayBuffer) {
                return new Blob([arrayBuffer], { type: inferredMimeType });
              }

              // Some environments may return a typed array; normalise to ArrayBuffer
              if (arrayBuffer?.buffer instanceof ArrayBuffer) {
                return new Blob([arrayBuffer.buffer], { type: inferredMimeType });
              }

              throw new Error('UXP filesystem read did not return binary data.');
            }
          }
        }
        
        throw new Error('Unable to access UXP filesystem with stored token');
      }
    }
  } catch (uxpError) {
    console.warn('UXP filesystem read failed:', uxpError);
  }

  throw new Error(`Unable to load local image file: ${filePath}`);
}

type GallerySource = 'generated' | 'corrected';

interface ImageData {
  id: string;
  url: string;
  prompt: string;
  contentType: string;
  aspectRatio: string;
  createdAt: Date;
  tags: string[];
  source: GallerySource;
  parentId?: string;
  downloadUrl?: string;
  localFilePath?: string;
  storageMode?: 'azure' | 'local';
  persistenceMethod?: 'blob' | 'dataUrl' | 'presigned' | 'local';
}

interface GalleryProps {}

export const Gallery = () => {
  // Get real images from generation store
  const { generationHistory } = useGenerationStore();
  const generationActions = useGenerationStore(state => state.actions);
  const correctedImages = useGalleryStore(state => state.correctedImages);
  const galleryActions = useGalleryStore(state => state.actions);
  const { showSuccess, showError, showInfo, showWarning } = useToastHelpers();

  // State for hydrated corrected images
  const [hydratedCorrectedImages, setHydratedCorrectedImages] = useState(correctedImages);

  // Hydrate corrected images on mount and when correctedImages change
  useEffect(() => {
    const hydrateImages = async () => {
      try {
        const hydrated = await loadGalleryItems(correctedImages);
        setHydratedCorrectedImages(hydrated as typeof correctedImages);
      } catch (error) {
        console.error('Failed to hydrate corrected images:', error);
        setHydratedCorrectedImages(correctedImages); // Fallback to original
      }
    };

    hydrateImages();
  }, [correctedImages]);

  const geminiService = useMemo(() => {
    const imsService = createIMSService();
    return new GeminiService(imsService as unknown as IMSServiceClass);
  }, []);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState('All');
  const [aspectRatio, setAspectRatio] = useState('All');
  const [dateRange, setDateRange] = useState('All time');
  const [sortBy, setSortBy] = useState('Newest');
  
  // Convert generation results to gallery format
  const storeImages = useMemo(() => {
    return generationHistory.map((result) => ({
      id: result.id,
      url: result.imageUrl,
      prompt: result.metadata?.prompt || 'Untitled generation',
      contentType: (result.metadata?.contentClass || 'art').toLowerCase(),
      aspectRatio: 'square', // Default since we're generating square images
      createdAt: new Date(result.timestamp),
      tags: (result.metadata?.prompt || '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 3),
      source: 'generated' as const,
      downloadUrl: result.downloadUrl,
      localFilePath: result.localPath || result.metadata?.localFilePath,
      storageMode: result.metadata?.storageMode,
      persistenceMethod: result.metadata?.persistenceMethod,
    }));
  }, [generationHistory]);

  const correctedGalleryImages = useMemo(() => {
    return hydratedCorrectedImages.map(image => ({
      id: image.id,
      url: image.correctedUrl, // Use hydrated URL
      prompt:
        image.metadata?.corrections?.customPrompt ||
        image.metadata?.operationsApplied?.join(', ') ||
        'Gemini correction',
      contentType: 'corrected',
      aspectRatio: 'square',
      createdAt: new Date(image.timestamp),
      tags: image.metadata?.operationsApplied?.slice(0, 3) || [],
      source: 'corrected' as const,
      parentId: image.parentGenerationId,
      localFilePath: image.localFilePath || image.correctedUrl,
      storageMode: image.storageMode,
      persistenceMethod: image.persistenceMethod,
    }));
  }, [hydratedCorrectedImages]);

  // Use only real images from the generation store
  const imagesToUse = useMemo(() => {
    return [...storeImages, ...correctedGalleryImages];
  }, [storeImages, correctedGalleryImages]);

  const [isCorrectionDialogOpen, setIsCorrectionDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [selectedCorrections, setSelectedCorrections] = useState<string[]>([
    'lineCleanup',
    'enhanceDetails',
    'noiseReduction',
  ]);
  const [correctionPrompt, setCorrectionPrompt] = useState('');
  const [isCorrecting, setIsCorrecting] = useState(false);

  // Filter and sort images
  const filteredImages = useMemo(() => {
    let filtered = imagesToUse.filter((image: ImageData) => {
      // Search filter
      if (searchQuery && !image.prompt.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !image.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }

      // Content type filter
      if (contentType !== 'All') {
        if (contentType === 'Corrected' && image.source !== 'corrected') {
          return false;
        }

        if (contentType !== 'Corrected' && image.contentType !== contentType.toLowerCase()) {
          return false;
        }
      }

      // Aspect ratio filter
      if (aspectRatio !== 'All' && image.aspectRatio !== aspectRatio.toLowerCase()) {
        return false;
      }

      // Date range filter (simplified)
      if (dateRange !== 'All time') {
        const now = new Date();
        const imageDate = new Date(image.createdAt);
        
        // Skip filtering if date is invalid
        if (isNaN(imageDate.getTime())) return true;
        
        const daysDiff = (now.getTime() - imageDate.getTime()) / (1000 * 3600 * 24);
        
        if (dateRange === '7 days' && daysDiff > 7) return false;
        if (dateRange === '30 days' && daysDiff > 30) return false;
        if (dateRange === '90 days' && daysDiff > 90) return false;
      }

      return true;
    });

    // Sort images
    if (sortBy === 'Newest') {
      filtered.sort((a: ImageData, b: ImageData) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    } else if (sortBy === 'Oldest') {
      filtered.sort((a: ImageData, b: ImageData) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB;
      });
    }

    return filtered;
  }, [searchQuery, contentType, aspectRatio, dateRange, sortBy]);

  const handleApplyFilters = () => {
    // Filters are already applied via useMemo
    console.log('Filters applied');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setContentType('All');
    setAspectRatio('All');
    setDateRange('All time');
    setSortBy('Newest');
  };

  const handleClearLocalImages = useCallback(() => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        'This will remove all locally stored generated and corrected images. Continue?'
      );
      if (!confirmed) {
        return;
      }
    }

    try {
      generationActions.clearHistory();
      galleryActions.clearAll();
      showSuccess('Gallery cleared', 'All locally stored images have been removed.');
    } catch (error) {
      console.error('Failed to clear locally stored images:', error);
      showError('Clear failed', 'Could not remove stored images. Please try again.');
    }
  }, [generationActions, galleryActions, showSuccess, showError]);

  const correctionOptions = useMemo<{ id: string; label: string }[]>(
    () => [
      { id: 'lineCleanup', label: 'Line cleanup' },
      { id: 'colorCorrection', label: 'Color balance' },
      { id: 'enhanceDetails', label: 'Enhance details' },
      { id: 'noiseReduction', label: 'Noise reduction' },
      { id: 'sharpenEdges', label: 'Sharpen edges' },
      { id: 'artifactRemoval', label: 'Remove artifacts' },
    ],
    []
  );

  const toggleCorrectionOption = useCallback((optionId: string) => {
    setSelectedCorrections((prev: string[]) => {
      if (prev.includes(optionId)) {
        return prev.filter((id: string) => id !== optionId);
      }
      return [...prev, optionId];
    });
  }, []);

  const resetCorrectionDialog = useCallback(() => {
    setSelectedCorrections(['lineCleanup', 'enhanceDetails', 'noiseReduction']);
    setCorrectionPrompt('');
    setIsCorrectionDialogOpen(false);
    setSelectedImage(null);
    setIsCorrecting(false);
  }, []);

  const handlePromptChange = useCallback((event: any) => {
    const targetValue =
      typeof event?.target?.value === 'string'
        ? event.target.value
        : typeof event?.detail?.value === 'string'
          ? event.detail.value
          : '';

    setCorrectionPrompt(targetValue);
  }, []);

  const getImageDimensions = useCallback((url: string) => {
    return new Promise<{ width: number; height: number; aspectRatio: number } | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (!img.naturalWidth || !img.naturalHeight) {
          resolve(null);
          return;
        }

        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
        });
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }, []);

  const buildCorrectionParams = useCallback((): CorrectionParams => {
    const params: CorrectionParams = {};

    if (selectedCorrections.includes('lineCleanup')) params.lineCleanup = true;
    if (selectedCorrections.includes('colorCorrection')) params.colorCorrection = true;
    if (selectedCorrections.includes('enhanceDetails')) params.enhanceDetails = true;
    if (selectedCorrections.includes('noiseReduction')) params.noiseReduction = true;
    if (selectedCorrections.includes('sharpenEdges')) params.sharpenEdges = true;
    if (selectedCorrections.includes('artifactRemoval')) params.artifactRemoval = true;

    if (correctionPrompt.trim()) {
      params.customPrompt = correctionPrompt.trim();
    }

    return params;
  }, [selectedCorrections, correctionPrompt]);

  const handleOpenCorrectionDialog = useCallback((image: ImageData) => {
    setSelectedImage(image);
    setSelectedCorrections(['lineCleanup', 'enhanceDetails', 'noiseReduction']);
    setCorrectionPrompt(image.prompt || '');
    setIsCorrectionDialogOpen(true);
    setIsCorrecting(false);
  }, []);

  const handleRunCorrection = useCallback(async () => {
    if (!selectedImage) {
      return;
    }

    const params = buildCorrectionParams();
    const hasCorrections =
      Object.keys(params).some(key => key !== 'customPrompt' && Boolean(params[key as keyof CorrectionParams])) ||
      Boolean(params.customPrompt);

    if (!hasCorrections) {
      showWarning('Add a correction', 'Select at least one correction or provide a prompt.');
      return;
    }

    let correctionSucceeded = false;

    try {
      setIsCorrecting(true);
      showInfo('Enhancing image', 'Gemini is applying your corrections...');

      let imageBlob: Blob;

      // Try to load from local file first if available
      if (selectedImage.localFilePath) {
        try {
          console.warn('📁 Loading image from local file for Gemini correction:', selectedImage.localFilePath);
          imageBlob = await loadLocalImageAsBlob(selectedImage.localFilePath);
          console.warn('✅ Successfully loaded local image for correction');
        } catch (localError) {
          console.warn('⚠️ Failed to load local image, falling back to URL fetch:', localError);
          // Fall back to URL fetch
          const response = await fetch(selectedImage.url);
          if (!response.ok) {
            throw new Error('Unable to load the original image.');
          }
          imageBlob = await response.blob();
        }
      } else {
        // Load from URL as before
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
        console.warn('ℹ️ Normalized image blob MIME type for Gemini correction', {
          originalType: originalMime,
          resolvedMime,
          sourcePath,
        });
      }

      const result = await geminiService.correctImage(imageBlob, params);

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Gemini did not return a corrected image.');
      }

      const correctedImage = result.data;
      const previewUrl = correctedImage.blobUrl || correctedImage.correctedUrl;
      const persistedUrl =
        correctedImage.localFilePath || correctedImage.correctedUrl || previewUrl;
      const originalSize = await getImageDimensions(selectedImage.url);
      const correctedSize = await getImageDimensions(previewUrl || persistedUrl);

      const enhancedImage = {
        ...correctedImage,
        originalUrl: selectedImage.url,
        correctedUrl: persistedUrl,
        thumbnailUrl:
          correctedImage.thumbnailUrl || previewUrl || persistedUrl,
        blobUrl: previewUrl || persistedUrl,
        parentGenerationId:
          selectedImage.source === 'generated'
            ? selectedImage.id
            : selectedImage.parentId || selectedImage.id,
        metadata: {
          ...correctedImage.metadata,
          corrections: params,
          originalSize: originalSize || correctedImage.metadata.originalSize,
          correctedSize: correctedSize || correctedImage.metadata.correctedSize,
          timestamp: new Date(),
        },
        timestamp: new Date(),
      };

      galleryActions.addCorrectedImage(enhancedImage);

      console.warn('🖼️ Gemini: Added corrected image to gallery store', {
        id: enhancedImage.id,
        displayUrl: enhancedImage.correctedUrl,
        previewUrl,
        localFilePath: enhancedImage.localFilePath,
      });

      correctionSucceeded = true;

      showSuccess('Correction complete', 'Gemini created a refined version in your gallery.');
    } catch (error: any) {
      console.error('Gemini correction failed:', error);
      showError('Correction failed', error?.message || 'Unable to correct the image right now.');
    } finally {
      if (correctionSucceeded) {
        resetCorrectionDialog();
      } else {
        setIsCorrecting(false);
      }
    }
  }, [
    selectedImage,
    buildCorrectionParams,
    showWarning,
    geminiService,
    getImageDimensions,
    galleryActions,
    showSuccess,
    showError,
    showInfo,
    resetCorrectionDialog,
  ]);

  const handleCancelCorrection = useCallback(() => {
    if (isCorrecting) {
      return;
    }
    resetCorrectionDialog();
  }, [isCorrecting, resetCorrectionDialog]);

  return (
    <div className="gallery-container">
      {/* Filters Sidebar */}
      <aside className="gallery-sidebar">
        <h3 className="sidebar-title">Filters</h3>
        
        {/* Search */}
        <div className="filter-group">
          <label className="filter-label">Search</label>
          {/* @ts-ignore */}
          <sp-textfield
            placeholder="Search by prompt..."
            value={searchQuery}
            onInput={(e: any) => setSearchQuery(e.target.value)}
          >
          {/* @ts-ignore */}
          </sp-textfield>
        </div>

        {/* Content Type */}
        <div className="filter-group">
          <label className="filter-label">Content Type</label>
          {/* @ts-ignore */}
          <sp-picker
            value={contentType}
            onChange={(e: any) => setContentType(e.target.value)}
          >
            {/* @ts-ignore */}
            <sp-menu slot="options">
              {/* @ts-ignore */}
              <sp-menu-item value="All">All</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="Art">Art</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="Photo">Photo</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="Corrected">Corrected</sp-menu-item>
            {/* @ts-ignore */}
            </sp-menu>
          {/* @ts-ignore */}
          </sp-picker>
        </div>

        {/* Aspect Ratio */}
        <div className="filter-group">
          <label className="filter-label">Aspect Ratio</label>
          {/* @ts-ignore */}
          <sp-picker
            value={aspectRatio}
            onChange={(e: any) => setAspectRatio(e.target.value)}
          >
            {/* @ts-ignore */}
            <sp-menu slot="options">
              {/* @ts-ignore */}
              <sp-menu-item value="All">All</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="Square">Square</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="Landscape">Landscape</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="Portrait">Portrait</sp-menu-item>
            {/* @ts-ignore */}
            </sp-menu>
          {/* @ts-ignore */}
          </sp-picker>
        </div>

        {/* Date Range */}
        <div className="filter-group">
          <label className="filter-label">Date Range</label>
          {/* @ts-ignore */}
          <sp-picker
            value={dateRange}
            onChange={(e: any) => setDateRange(e.target.value)}
          >
            {/* @ts-ignore */}
            <sp-menu slot="options">
              {/* @ts-ignore */}
              <sp-menu-item value="All time">All time</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="7 days">Last 7 days</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="30 days">Last 30 days</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="90 days">Last 90 days</sp-menu-item>
            {/* @ts-ignore */}
            </sp-menu>
          {/* @ts-ignore */}
          </sp-picker>
        </div>

        {/* Filter Actions */}
        <div className="filter-actions">
          {/* @ts-ignore */}
          <sp-button variant="accent" onClick={handleApplyFilters}>
            Apply Filters
          {/* @ts-ignore */}
          </sp-button>
          {/* @ts-ignore */}
          <sp-button variant="secondary" onClick={handleClearFilters}>
            Clear Filters
          {/* @ts-ignore */}
          </sp-button>
        </div>
      </aside>

      {/* Main Gallery Area */}
      <main className="gallery-main">
        {/* Gallery Header */}
        <header className="gallery-header">
          <h2 className="gallery-title">Image Gallery</h2>
          <div className="gallery-sort">
            <span className="sort-label">Sort by:</span>
            {/* @ts-ignore */}
            <sp-picker
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              size="s"
            >
              {/* @ts-ignore */}
              <sp-menu slot="options">
                {/* @ts-ignore */}
                <sp-menu-item value="Newest">Newest</sp-menu-item>
                {/* @ts-ignore */}
                <sp-menu-item value="Oldest">Oldest</sp-menu-item>
              {/* @ts-ignore */}
              </sp-menu>
            {/* @ts-ignore */}
            </sp-picker>
          </div>
          <div className="gallery-actions">
            {/* @ts-ignore */}
            <sp-button
              variant="secondary"
              size="s"
              onClick={async () => {
                try {
                  await galleryActions.syncLocalFiles();
                  showSuccess('Sync complete', 'Local files have been synced to the gallery.');
                } catch (error) {
                  console.error('Sync failed:', error);
                  showError('Sync failed', 'Could not sync local files. Check the console for details.');
                }
              }}
            >
              Sync local files
            {/* @ts-ignore */}
            </sp-button>
            {/* @ts-ignore */}
            <sp-button
              variant="secondary"
              size="s"
              onClick={handleClearLocalImages}
            >
              Clear local images
            {/* @ts-ignore */}
            </sp-button>
          </div>
        </header>

        {/* Image Grid */}
        <div className="gallery-grid">
          {filteredImages.map((image: ImageData) => (
            <div key={image.id} className="gallery-item">
              <div className="item-image">
                <img 
                  src={image.url} 
                  alt={image.prompt}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.warn('❌ Image failed to load:', {
                      originalSrc: target.src,
                      prompt: image.prompt,
                      storageMode: image.storageMode,
                      persistenceMethod: image.persistenceMethod,
                    });

                    if (image.localFilePath && target.src !== image.localFilePath) {
                      console.warn('📁 Trying local file fallback:', image.localFilePath);
                      target.src = image.localFilePath;
                      return;
                    }

                    if (image.downloadUrl && target.src !== image.downloadUrl) {
                      console.warn('🔄 Trying downloadUrl fallback:', image.downloadUrl);
                      target.src = image.downloadUrl;
                      return;
                    }

                    // Try to find the original generation result to get additional fallbacks
                    const originalResult = generationHistory.find((result) =>
                      result.id === image.id || result.metadata.prompt === image.prompt
                    );

                    if (originalResult?.metadata?.localFilePath && target.src !== originalResult.metadata.localFilePath) {
                      console.warn('📁 Trying original result local path:', originalResult.metadata.localFilePath);
                      target.src = originalResult.metadata.localFilePath;
                      return;
                    }

                    if (originalResult?.downloadUrl && target.src !== originalResult.downloadUrl) {
                      console.warn('🔄 Trying downloadUrl fallback:', originalResult.downloadUrl);
                      target.src = originalResult.downloadUrl;
                      return;
                    }

                    // Show error placeholder
                    target.style.backgroundColor = '#f0f0f0';
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.error-placeholder')) {
                      const placeholder = document.createElement('div');
                      placeholder.className = 'error-placeholder';
                      placeholder.style.cssText = `
                        width: 100%; height: 200px; background: #f0f0f0; 
                        display: flex; align-items: center; justify-content: center;
                        color: #666; font-size: 14px; text-align: center;
                      `;
                      placeholder.innerHTML = `
                        <div>
                          <div>🖼️</div>
                          <div>Image unavailable</div>
                          <div style="font-size: 12px; margin-top: 4px;">URL expired</div>
                        </div>
                      `;
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              </div>
              <div className="item-info">
                <div className="item-prompt">{image.prompt}</div>
                <div className="item-meta">
                  <span className="item-type">{image.contentType}</span>
                  <span className="item-date">{new Date(image.createdAt).toLocaleDateString()}</span>
                </div>
                {image.source === 'generated' && (
                  <div className="item-actions">
                    {/* @ts-ignore */}
                    <sp-button
                      variant="secondary"
                      size="s"
                      onClick={() => handleOpenCorrectionDialog(image)}
                    >
                      Enhance with Gemini
                    {/* @ts-ignore */}
                    </sp-button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="gallery-empty">
            {/* @ts-ignore */}
            <sp-icon name="ui:Image" size="xl"></sp-icon>
            <h3>No images found</h3>
            <p>Try adjusting your filters to see more results.</p>
          </div>
        )}
      </main>

      {isCorrectionDialogOpen && selectedImage && (
        <div
          className="correction-dialog-backdrop"
          onClick={handleCancelCorrection}
        >
          <div
            className="correction-dialog"
            onClick={event => event.stopPropagation()}
          >
            <header className="dialog-header">
              <div className="dialog-title">
                <h3>Enhance with Gemini</h3>
                <p className="dialog-subtitle">
                  {selectedImage.prompt ? `Refining "${selectedImage.prompt}"` : 'Apply smart fixes to this image.'}
                </p>
              </div>
              {/* @ts-ignore */}
              <sp-button
                quiet
                size="s"
                onClick={handleCancelCorrection}
                disabled={isCorrecting}
              >
                Close
              {/* @ts-ignore */}
              </sp-button>
            </header>

            <div className="dialog-body">
              <div className="dialog-preview">
                <img src={selectedImage.url} alt={selectedImage.prompt || 'Selected image'} />
              </div>

              <div className="dialog-controls">
                <div className="prompt-group">
                  {/* @ts-ignore */}
                  <sp-label className="form-label">Tell Gemini what to enhance</sp-label>
                  {/* @ts-ignore */}
                  <sp-textarea
                    key={selectedImage.id}
                    className="prompt-textarea"
                    multiline
                    rows={4}
                    maxlength={500}
                    value={correctionPrompt}
                    placeholder="Add or refine the prompt that Gemini should follow..."
                    onInput={handlePromptChange}
                    onChange={handlePromptChange}
                    disabled={isCorrecting}
                  >
                  {/* @ts-ignore */}
                  </sp-textarea>
                  <div className="character-counter text-detail">
                    {correctionPrompt.length}/500 characters
                  </div>
                </div>

                <div className="checkbox-grid">
                  {correctionOptions.map((option: { id: string; label: string }) => (
                    <div key={option.id} className="checkbox-option">
                      {/* @ts-ignore */}
                      <sp-checkbox
                        value={option.id}
                        checked={selectedCorrections.includes(option.id)}
                        onChange={() => toggleCorrectionOption(option.id)}
                        disabled={isCorrecting}
                      >
                        {option.label}
                      {/* @ts-ignore */}
                      </sp-checkbox>
                    </div>
                  ))}
                </div>

                {isCorrecting && (
                  <div className="progress-indicator">
                    {/* @ts-ignore */}
                    <sp-progressbar indeterminate></sp-progressbar>
                    <span>Gemini is working on your correction...</span>
                  </div>
                )}
              </div>
            </div>

            <footer className="dialog-actions">
              {/* @ts-ignore */}
              <sp-button
                variant="secondary"
                onClick={handleCancelCorrection}
                disabled={isCorrecting}
              >
                Cancel
              {/* @ts-ignore */}
              </sp-button>
              {/* @ts-ignore */}
              <sp-button
                variant="accent"
                onClick={handleRunCorrection}
                disabled={isCorrecting}
              >
                {isCorrecting ? 'Enhancing…' : 'Enhance image'}
              {/* @ts-ignore */}
              </sp-button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};