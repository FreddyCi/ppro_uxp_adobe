// @ts-ignore
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useGenerationStore } from '../../store/generationStore';
import { useGalleryStore, useGalleryDisplayItems } from '../../store/galleryStore';
import { createIMSService } from '../../services/ims/IMSService';
import type { IMSService as IMSServiceClass } from '../../services/ims/IMSService';
import { GeminiService } from '../../services/gemini';
import type { CorrectionParams } from '../../types/gemini';
import { useToastHelpers } from '../../hooks/useToast';
import type { ContentItem, VideoData } from '../../types/content';
import { VideoWebView } from '../VideoPlayer/VideoWebView';
import './Gallery.scss';

// Helper functions for gallery filtering and sorting
const getAllItems = (
  state: { contentItems: ContentItem[]; typeFilter: string }
): ContentItem[] => {
  switch (state.typeFilter) {
    case 'generated':
      return state.contentItems.filter(item =>
        item.contentType === 'generated-image' || item.contentType === 'uploaded-image'
      )
    case 'corrected':
      return state.contentItems.filter(item => item.contentType === 'corrected-image')
    case 'videos':
      return state.contentItems.filter(item => {
        const isVideo = item.contentType === 'video' || item.contentType === 'uploaded-video';
        if (!isVideo) return false;
        
        // Check if video has a playable URL
        const videoContent = item.content as VideoData;
        const hasVideoUrl = videoContent?.videoUrl && 
          (videoContent.videoUrl.startsWith('blob:') || videoContent.videoUrl.startsWith('data:'));
        const hasDisplayUrl = item.displayUrl && 
          (item.displayUrl.startsWith('blob:') || item.displayUrl.startsWith('data:'));
        
        // Only include videos that have playable URLs
        return hasVideoUrl || hasDisplayUrl;
      })
    case 'images':
      return state.contentItems.filter(item =>
        ['generated-image', 'corrected-image', 'uploaded-image'].includes(item.contentType)
      )
    case 'all':
    default:
      return state.contentItems
  }
}

const filterItems = (
  items: ContentItem[],
  state: { searchQuery: string; filterTags: string[]; dateRange: { start?: Date; end?: Date } }
): ContentItem[] => {
  let filtered = items

  // Search query filter
  if (state.searchQuery.trim()) {
    const query = state.searchQuery.toLowerCase()
    filtered = filtered.filter(item => {
      // Search based on content type
      let searchText = item.filename || item.originalName

      // For generated images, search in prompt
      if (item.contentType === 'generated-image') {
        const genData = item.content as any
        searchText = genData.prompt || searchText
      }

      return searchText.toLowerCase().includes(query)
    })
  }

  // Date range filter
  if (state.dateRange.start || state.dateRange.end) {
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.timestamp)
      const afterStart =
        !state.dateRange.start || itemDate >= state.dateRange.start
      const beforeEnd = !state.dateRange.end || itemDate <= state.dateRange.end
      return afterStart && beforeEnd
    })
  }

  // Tags filter
  if (state.filterTags.length > 0) {
    filtered = filtered.filter(item => {
      return state.filterTags.every(tag => item.tags.includes(tag))
    })
  }

  return filtered
}

const sortItems = (
  items: ContentItem[],
  sortBy: string,
  sortOrder: string
): ContentItem[] => {
  const sorted = [...items].sort((a, b) => {
    let aValue: string | number | Date
    let bValue: string | number | Date

    switch (sortBy) {
      case 'newest':
      case 'oldest':
        aValue = new Date(a.timestamp).getTime()
        bValue = new Date(b.timestamp).getTime()
        break
      case 'prompt':
        // Get search text for sorting
        aValue = a.filename || a.originalName || ''
        bValue = b.filename || b.originalName || ''

        // For generated images, use prompt
        if (a.contentType === 'generated-image') {
          const genData = a.content as any
          aValue = genData.prompt || aValue
        }
        if (b.contentType === 'generated-image') {
          const genData = b.content as any
          bValue = genData.prompt || bValue
        }

        aValue = (aValue as string).toLowerCase()
        bValue = (bValue as string).toLowerCase()
        break
      case 'rating':
        // Rating is optional property, default to 0
        aValue = 0
        bValue = 0
        break
      case 'size':
        // Use file size for sorting
        aValue = a.size || 0
        bValue = b.size || 0
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  // For 'oldest' sort, reverse the array after sorting by timestamp
  if (sortBy === 'oldest') {
    return sorted.reverse()
  }

  return sorted
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
    // Video formats
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'avi':
      return 'video/avi';
    case 'mov':
      return 'video/quicktime';
    case 'mkv':
      return 'video/x-matroska';
    case 'm4v':
      return 'video/x-m4v';
    default:
      return fallback;
  }
}

// Helper function to load local file as blob (supports images and videos)
async function loadLocalFileAsBlob(filePath: string): Promise<Blob> {
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

  throw new Error(`Unable to load local file: ${filePath}`);
}

type GallerySource = 'generated' | 'corrected';

// UXP-compatible base64 encoder (FileReader not available in UXP)
function encodeBase64UXP(bytes: Uint8Array): string {
  // Try browser btoa first (faster if available)
  if (typeof btoa === 'function') {
    let binary = '';
    const chunkSize = 0x8000; // Process in chunks to avoid stack overflow
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += Array.from(chunk, byte => String.fromCharCode(byte)).join('');
    }
    return btoa(binary);
  }

  // Fallback: Manual base64 encoding
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;

  for (; i + 3 <= bytes.length; i += 3) {
    const triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    result += base64Chars[(triplet >> 18) & 63];
    result += base64Chars[(triplet >> 12) & 63];
    result += base64Chars[(triplet >> 6) & 63];
    result += base64Chars[triplet & 63];
  }

  if (i < bytes.length) {
    const remaining = bytes.length - i;
    const chunk = (bytes[i] << 16) | ((remaining > 1 ? bytes[i + 1] : 0) << 8);
    result += base64Chars[(chunk >> 18) & 63];
    result += base64Chars[(chunk >> 12) & 63];
    if (remaining === 2) {
      result += base64Chars[(chunk >> 6) & 63];
      result += '=';
    } else {
      result += '=';
      result += '=';
    }
  }

  return result;
}

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
  storageMode?: 'azure' | 'local' | 'memory';
  persistenceMethod?: 'blob' | 'dataUrl' | 'presigned' | 'local';
  // Video support
  isVideo?: boolean;
  videoUrl?: string;
  duration?: number;
  fps?: number;
  resolution?: { width: number; height: number };
}

interface GalleryProps {}

export const Gallery = () => {
  // Get raw data from gallery store
  const {
    contentItems,
    typeFilter,
    searchQuery: storeSearchQuery,
    filterTags,
    dateRange,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage
  } = useGalleryDisplayItems()

  const galleryActions = useGalleryStore(state => state.actions)
  const { showSuccess, showError, showInfo, showWarning } = useToastHelpers()

  // Track hydration status to prevent rendering videos before they're ready
  const [isHydrating, setIsHydrating] = useState(true)

  // Log initial gallery state
  useEffect(() => {
    console.log('[Gallery] Component mounted - current contentItems:', {
      count: contentItems.length,
      items: contentItems.map(item => ({
        id: item.id,
        filename: item.filename,
        contentType: item.contentType,
        source: 'gallery_store',
        timestamp: item.timestamp,
        localPath: item.localPath,
        relativePath: item.relativePath
      }))
    });
  }, []); // Empty dependency array - only run on mount

  // Log when contentItems change
  useEffect(() => {
    if (contentItems.length > 0) {
      console.log('[Gallery] Content items updated:', {
        count: contentItems.length,
        items: contentItems.map(item => ({
          id: item.id,
          filename: item.filename,
          contentType: item.contentType,
          source: 'gallery_store_update',
          timestamp: item.timestamp
        }))
      });
      
      // Check for duplicate IDs in contentItems
      const idCounts = new Map<string, number>();
      contentItems.forEach(item => {
        idCounts.set(item.id, (idCounts.get(item.id) || 0) + 1);
      });
      const duplicates = Array.from(idCounts.entries()).filter(([_, count]) => count > 1);
      if (duplicates.length > 0) {
        console.error('❌ [Gallery] DUPLICATE IDs IN STORE:', duplicates);
        console.error('❌ [Gallery] Items with duplicate IDs:', 
          contentItems.filter(item => duplicates.some(([id]) => id === item.id))
        );
      }
    }
  }, [contentItems]);

  // Hydrate runtime URLs on mount (convert data: URLs to blob: URLs for video playback)
  useEffect(() => {
    const { hydrateRuntimeUrls, revokeRuntimeUrls } = galleryActions
    console.log('🎬 [Gallery] Hydrating runtime URLs for video playback')
    
    const runHydration = async () => {
      await hydrateRuntimeUrls()
      setIsHydrating(false)
      console.log('✅ [Gallery] Hydration complete, videos ready to render')
    }
    
    runHydration()
    
    return () => {
      console.log('🗑️ [Gallery] Revoking runtime URLs on unmount')
      revokeRuntimeUrls()
    }
  }, [galleryActions]) // Re-run if actions change

  // Compute filtered and sorted items using useMemo
  const sortedItems = useMemo(() => {
    const allItems = getAllItems({ contentItems, typeFilter })
    const filtered = filterItems(allItems, { searchQuery: storeSearchQuery, filterTags, dateRange })
    return sortItems(filtered, sortBy, sortOrder)
  }, [contentItems, typeFilter, storeSearchQuery, filterTags, dateRange, sortBy, sortOrder])

  // Apply pagination to sorted items
  const displayItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sortedItems.slice(startIndex, endIndex)
  }, [sortedItems, currentPage, itemsPerPage])

  const totalItems = sortedItems.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Get generation store for legacy compatibility
  const { generationHistory } = useGenerationStore()
  const generationActions = useGenerationStore(state => state.actions)

  const geminiService = useMemo(() => {
    const imsService = createIMSService();
    return new GeminiService(imsService as unknown as IMSServiceClass);
  }, []);
  
  // Filter states (local UI state)
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [localContentType, setLocalContentType] = useState('All');
  const [localAspectRatio, setLocalAspectRatio] = useState('All');
  const [localDateRange, setLocalDateRange] = useState('All time');
  const [localSortBy, setLocalSortBy] = useState('Newest');
  
  // Convert unified ContentItems to gallery format for display
  const imagesToUse = useMemo(() => {
    console.log('🔍 [Gallery] displayItems count:', displayItems.length);
    console.log('🔍 [Gallery] displayItems IDs:', displayItems.map(i => i.id));
    
    // Check for duplicate IDs
    const idCounts = new Map<string, number>();
    displayItems.forEach(item => {
      idCounts.set(item.id, (idCounts.get(item.id) || 0) + 1);
    });
    const duplicates = Array.from(idCounts.entries()).filter(([_, count]) => count > 1);
    if (duplicates.length > 0) {
      console.warn('⚠️ [Gallery] DUPLICATE IDs FOUND:', duplicates);
    }
    
    return displayItems.map((item: ContentItem) => {
      // For videos, prefer runtimeUrl (blob:) over data: URLs
      const isVideo = item.contentType === 'video' || item.contentType === 'uploaded-video';
      let videoUrl = '';
      let thumbnailUrl = item.thumbnailUrl || item.displayUrl;
      
      if (isVideo) {
        const videoContent = item.content as VideoData;
        // Prefer runtimeUrl (blob:) which works in UXP video elements
        videoUrl = (item as any).runtimeUrl || videoContent?.videoUrl || '';
        
        // Debug logging to see what URL and data we have
        console.log(`🎥 [Gallery] Video data for ${item.filename}:`, {
          runtimeUrl: (item as any).runtimeUrl,
          contentVideoUrl: videoContent?.videoUrl,
          hasVideoBlob: !!videoContent?.videoBlob,
          hasVideoDataUrl: !!(item.content as any)?.videoDataUrl,
          videoDataUrlLength: (item.content as any)?.videoDataUrl?.length,
          videoMimeType: (item.content as any)?.videoMimeType
        });
        
        // Also use runtimeUrl for thumbnail if available
        if ((item as any).runtimeUrl) {
          thumbnailUrl = (item as any).runtimeUrl;
        }
      }
      
      return {
        id: item.id,
        url: thumbnailUrl,
        prompt: item.contentType === 'generated-image' 
          ? (item.content as any).prompt || item.filename || 'Generated image'
          : item.contentType === 'corrected-image'
          ? (item.content as any).correctionMetadata?.operationsApplied?.join(', ') || item.filename || 'Corrected image'
          : (item.contentType === 'video' || item.contentType === 'uploaded-video')
          ? item.filename || (item as any).metadata?.prompt || 'Video'
          : item.filename || 'Content',
        contentType: item.contentType,
        aspectRatio: 'square', // Default since we're generating square images
        createdAt: item.timestamp,
        tags: item.tags,
        source: item.contentType.includes('corrected') ? 'corrected' as const : 'generated' as const,
        downloadUrl: item.contentType === 'generated-image' ? (item.content as any).downloadUrl : undefined,
        localFilePath: item.localPath,
        storageMode: item.storageMode,
        persistenceMethod: item.persistenceMethod,
        // Video support
        isVideo,
        videoUrl,
        videoBlob: isVideo ? (item.content as VideoData)?.videoBlob : undefined,
        videoDataUrl: isVideo ? (item.content as any)?.videoDataUrl : undefined,
        videoMimeType: isVideo ? (item.content as any)?.videoMimeType || 'video/mp4' : undefined,
        duration: isVideo ? (item.content as any).duration : undefined,
        fps: isVideo ? (item.content as any).fps : undefined,
        resolution: isVideo ? (item.content as any).resolution : undefined,
      };
    });
  }, [displayItems]);

  const [isCorrectionDialogOpen, setIsCorrectionDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [selectedCorrections, setSelectedCorrections] = useState<string[]>([
    'lineCleanup',
    'enhanceDetails',
    'noiseReduction',
  ]);
  const [correctionPrompt, setCorrectionPrompt] = useState('');
  const [isCorrecting, setIsCorrecting] = useState(false);

  // Filter and sort images (using local state for UI filters)
  const filteredImages = useMemo(() => {
    let filtered = imagesToUse.filter((image: ImageData) => {
      // Search filter
      if (localSearchQuery && !image.prompt.toLowerCase().includes(localSearchQuery.toLowerCase()) && 
          !image.tags.some((tag: string) => tag.toLowerCase().includes(localSearchQuery.toLowerCase()))) {
        return false;
      }

      // Content type filter
      if (localContentType !== 'All') {
        if (localContentType === 'Corrected' && !image.contentType.includes('corrected')) {
          return false;
        }
        if (localContentType === 'Videos' && !image.contentType.includes('video')) {
          return false;
        }
        if (localContentType === 'Art' && image.contentType !== 'generated-image') {
          return false;
        }
        if (localContentType === 'Photo' && image.contentType !== 'uploaded-image') {
          return false;
        }
      }

      // Aspect ratio filter
      if (localAspectRatio !== 'All' && image.aspectRatio !== localAspectRatio.toLowerCase()) {
        return false;
      }

      // Date range filter (simplified)
      if (localDateRange !== 'All time') {
        const now = new Date();
        const imageDate = new Date(image.createdAt);
        
        // Skip filtering if date is invalid
        if (isNaN(imageDate.getTime())) return true;
        
        const daysDiff = (now.getTime() - imageDate.getTime()) / (1000 * 3600 * 24);
        
        if (localDateRange === '7 days' && daysDiff > 7) return false;
        if (localDateRange === '30 days' && daysDiff > 30) return false;
        if (localDateRange === '90 days' && daysDiff > 90) return false;
      }

      return true;
    });

    // Sort images
    if (localSortBy === 'Newest') {
      filtered.sort((a: ImageData, b: ImageData) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    } else if (localSortBy === 'Oldest') {
      filtered.sort((a: ImageData, b: ImageData) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB;
      });
    }

    return filtered;
  }, [imagesToUse, localSearchQuery, localContentType, localAspectRatio, localDateRange, localSortBy]);

  const handleApplyFilters = () => {
    // Filters are already applied via useMemo
    console.log('Filters applied');
  };

  const handleClearFilters = () => {
    setLocalSearchQuery('');
    setLocalContentType('All');
    setLocalAspectRatio('All');
    setLocalDateRange('All time');
    setLocalSortBy('Newest');
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
          imageBlob = await loadLocalFileAsBlob(selectedImage.localFilePath);
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
        displayUrl: enhancedImage.correctedUrl,
        thumbnailUrl: enhancedImage.thumbnailUrl,
        blobUrl: enhancedImage.blobUrl,
        localPath: enhancedImage.localFilePath,
        localMetadataPath: enhancedImage.localMetadataPath,

        // Content data for corrected image
        content: {
          type: 'corrected-image',
          originalUrl: enhancedImage.originalUrl,
          correctedUrl: enhancedImage.correctedUrl,
          corrections: params,
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

      galleryActions.addContentItem(contentItem);

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
    <div className={`gallery-container ${isCorrectionDialogOpen ? 'dialog-open' : ''}`}>
      {/* Filters Sidebar */}
      <aside className="gallery-sidebar">
        <h3 className="sidebar-title">Filters</h3>
        
        {/* Search */}
        <div className="filter-group">
          <label className="filter-label">Search</label>
          {/* @ts-ignore */}
          <sp-textfield
            placeholder="Search by prompt..."
            value={localSearchQuery}
            onInput={(e: any) => setLocalSearchQuery(e.target.value)}
          >
          {/* @ts-ignore */}
          </sp-textfield>
        </div>

        {/* Content Type */}
        <div className="filter-group">
          <label className="filter-label">Content Type</label>
          {/* @ts-ignore */}
          <sp-picker
            onChange={(e: any) => setLocalContentType(e.target.value)}
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
              <sp-menu-item value="Videos">Videos</sp-menu-item>
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
            onChange={(e: any) => setLocalAspectRatio(e.target.value)}
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
            onChange={(e: any) => setLocalDateRange(e.target.value)}
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
          <sp-button className='sp-button-mb' variant="accent" onClick={handleApplyFilters}>
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
          <div className="gallery-sort">
            <span className="sort-label">Sort by:</span>
            {/* @ts-ignore */}
            <sp-picker
              onChange={(e: any) => setLocalSortBy(e.target.value)}
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
              className='sp-button-mr'
              variant="secondary"
              size="s"
              onClick={async () => {
                try {
                  await galleryActions.syncLocalFiles();
                  showSuccess('Sync complete', 'Local files have been synced to the gallery. Videos should now display correctly.');
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
          {isHydrating ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#666',
              gridColumn: '1 / -1'
            }}>
              <div>🎬 Loading videos...</div>
              <div style={{ fontSize: '12px', marginTop: '8px' }}>Preparing video playback</div>
            </div>
          ) : (
            filteredImages.map((image: ImageData) => (
            <div key={`${image.id}-${isHydrating ? 'loading' : 'ready'}`} className="gallery-item">
              <div className="item-image">
                {image.isVideo ? (
                  (image.videoUrl || image.url) ? (
                    <>
                      {console.log('🎬 [Gallery] Rendering VideoWebView with:', {
                        filename: image.prompt,
                        hasVideoDataUrl: !!(image as any).videoDataUrl,
                        videoDataUrlLength: (image as any).videoDataUrl?.length,
                        videoDataUrlPrefix: (image as any).videoDataUrl?.substring(0, 50),
                        videoUrl: image.videoUrl,
                        url: image.url
                      })}
                      <VideoWebView
                      key={`video-${image.id}-${(image as any).videoDataUrl?.length || 0}`}
                      videoDataUrl={(image as any).videoDataUrl}
                      videoUrl={image.videoUrl || image.url}
                      poster={image.url}
                      width="100%"
                      height="200px"
                      controls={true}
                      muted={true}
                      onLoadedMetadata={() => {
                        console.log('✅ Video metadata loaded successfully for:', image.prompt);
                      }}
                      onError={(error) => {
                        console.error('❌ Video failed to load in WebView:', {
                          videoUrl: image.videoUrl || image.url,
                          hasVideoDataUrl: !!(image as any).videoDataUrl,
                          videoDataUrlLength: (image as any).videoDataUrl?.length,
                          error,
                          prompt: image.prompt,
                          storageMode: image.storageMode,
                        });
                      }}
                    />
                    </>
                  ) : (
                    <div className="error-placeholder" style={{
                      width: '100%', height: '200px', background: '#f0f0f0', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#666', fontSize: '14px', textAlign: 'center'
                    }}>
                      <div>
                        <div>🎥</div>
                        <div>Video loading...</div>
                      </div>
                    </div>
                  )
                ) : (
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
                )}
              </div>
              <div className="item-info">
                <div className="item-prompt">{image.prompt}</div>
                <div className="item-meta">
                  <span className="item-type">{image.contentType}</span>
                  <span className="item-date">{new Date(image.createdAt).toLocaleDateString()}</span>
                  {image.isVideo && image.duration && (
                    <span className="item-duration">{image.duration}s</span>
                  )}
                </div>
                {image.source === 'generated' && image.contentType === 'generated-image' && (
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
          ))
          )}
        </div>

        {filteredImages.length === 0 && !isHydrating && (
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
                    placeholder="A cinematic NYC street scene at golden hour, with blurred motion in the background from cars and city lights. In the foreground, a man in a dark hoodie and jeans stands still on the sidewalk, looking down at his phone while the city is moving fast behind him — glowing neon signs, streaks of yellow taxis, and pedestrians passing by in a blur. The lighting is warm and atmospheric, with reflections on windows and pavement. Captured with a shallow depth of field and a 35mm lens look."
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