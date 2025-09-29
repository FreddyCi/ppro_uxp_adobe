// @ts-ignore
import React, { useState, useMemo, useCallback } from 'react';
import { useGenerationStore } from '../../store/generationStore';
import { useGalleryStore } from '../../store/galleryStore';
import { createIMSService } from '../../services/ims/IMSService';
import type { IMSService as IMSServiceClass } from '../../services/ims/IMSService';
import { GeminiService } from '../../services/gemini';
import type { CorrectionParams } from '../../types/gemini';
import { useToastHelpers } from '../../hooks/useToast';
import './Gallery.scss';

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
}

interface GalleryProps {}

export const Gallery = () => {
  // Get real images from generation store
  const { generationHistory } = useGenerationStore();
  const correctedImages = useGalleryStore(state => state.correctedImages);
  const galleryActions = useGalleryStore(state => state.actions);
  const { showSuccess, showError, showInfo, showWarning } = useToastHelpers();

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
    return generationHistory.map((result: any) => ({
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
    }));
  }, [generationHistory]);

  const correctedGalleryImages = useMemo(() => {
    return correctedImages.map(image => ({
      id: image.id,
      url: image.correctedUrl,
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
    }));
  }, [correctedImages]);

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

    try {
      setIsCorrecting(true);
      showInfo('Enhancing image', 'Gemini is applying your corrections...');

      const response = await fetch(selectedImage.url);
      if (!response.ok) {
        throw new Error('Unable to load the original image.');
      }

      const imageBlob = await response.blob();
      const result = await geminiService.correctImage(imageBlob, params);

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Gemini did not return a corrected image.');
      }

      const correctedImage = result.data;
      const originalSize = await getImageDimensions(selectedImage.url);
      const correctedSize = await getImageDimensions(correctedImage.correctedUrl);

      const enhancedImage = {
        ...correctedImage,
        originalUrl: selectedImage.url,
        thumbnailUrl: correctedImage.thumbnailUrl || correctedImage.correctedUrl,
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

      showSuccess('Correction complete', 'Gemini created a refined version in your gallery.');
      resetCorrectionDialog();
    } catch (error: any) {
      console.error('Gemini correction failed:', error);
      showError('Correction failed', error?.message || 'Unable to correct the image right now.');
      setIsCorrecting(false);
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
                      prompt: image.prompt
                    });
                    
                    // Try to find the original generation result to get downloadUrl
                    const originalResult = generationHistory.find((result: any) => 
                      result.metadata.prompt === image.prompt
                    );
                    
                    if (originalResult?.downloadUrl && target.src !== originalResult.downloadUrl) {
                      console.warn('🔄 Trying downloadUrl fallback:', originalResult.downloadUrl);
                      target.src = originalResult.downloadUrl;
                    } else {
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
                    multiline
                    rows={4}
                    maxlength={500}
                    value={correctionPrompt}
                    placeholder="Add or refine the prompt that Gemini should follow..."
                    onInput={(e: any) => setCorrectionPrompt(e.target.value)}
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