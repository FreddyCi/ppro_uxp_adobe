// @ts-ignore
import React, { useState, useMemo } from 'react';
import { useGenerationStore } from '../../store/generationStore';
import { ImageDetailPopup } from './ImageDetailPopup';
import './Gallery.scss';

interface ImageData {
  id: number;
  url: string;
  prompt: string;
  contentType: string;
  aspectRatio: string;
  createdAt: Date;
  tags: string[];
}

interface GalleryProps {}

export const Gallery = () => {
  // Get real images from generation store
  const { generationHistory, actions } = useGenerationStore();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState('All');
  const [aspectRatio, setAspectRatio] = useState('All');
  const [dateRange, setDateRange] = useState('All time');
  const [sortBy, setSortBy] = useState('Newest');
  
  // Popup states
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Convert generation results to gallery format
  const storeImages = useMemo(() => {
    return generationHistory.map((result: any, index: number) => ({
      id: index + 1,
      url: result.imageUrl,
      prompt: result.metadata.prompt,
      contentType: result.metadata.contentClass || 'art',
      aspectRatio: 'square', // Default since we're generating square images
      createdAt: new Date(result.timestamp), // Ensure it's a Date object
      tags: result.metadata.prompt.split(' ').slice(0, 3) // Simple tag extraction
    }));
  }, [generationHistory]);

  // Use only real images from the generation store
  const imagesToUse = storeImages;

  // Filter and sort images
  const filteredImages = useMemo(() => {
    let filtered = imagesToUse.filter((image: ImageData) => {
      // Search filter
      if (searchQuery && !image.prompt.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !image.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }

      // Content type filter
      if (contentType !== 'All' && image.contentType !== contentType.toLowerCase()) {
        return false;
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

  // Popup handlers
  const handleImageClick = (imageId: number) => {
    const imageIndex = filteredImages.findIndex((img: ImageData) => img.id === imageId);
    if (imageIndex !== -1) {
      setSelectedImageIndex(imageIndex);
      setIsPopupOpen(true);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleNavigateImage = (direction: 'prev' | 'next') => {
    setSelectedImageIndex((prev: number) => {
      if (direction === 'prev') {
        return Math.max(0, prev - 1);
      } else {
        return Math.min(filteredImages.length - 1, prev + 1);
      }
    });
  };

  const handleDeleteImage = (imageId: number) => {
    // Find the original generation result ID
    const imageToDelete = filteredImages.find((img: ImageData) => img.id === imageId);
    if (imageToDelete) {
      // Use the generation history to find the actual ID
      const generationIndex = storeImages.findIndex((img: ImageData) => 
        img.url === imageToDelete.url && img.prompt === imageToDelete.prompt
      );
      if (generationIndex !== -1) {
        const generationResult = generationHistory[generationIndex];
        actions.removeGeneration(generationResult.id);
        
        // Close popup if this was the selected image
        handleClosePopup();
      }
    }
  };

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
              <div className="item-image" onClick={() => handleImageClick(image.id)}>
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
                <div className="item-overlay">
                  {/* @ts-ignore */}
                  <sp-action-button quiet>
                    {/* @ts-ignore */}
                    <sp-icon name="ui:ViewDetail" size="m"></sp-icon>
                  {/* @ts-ignore */}
                  </sp-action-button>
                </div>
              </div>
              <div className="item-info">
                <div className="item-prompt">{image.prompt}</div>
                <div className="item-meta">
                  <span className="item-type">{image.contentType}</span>
                  <span className="item-date">{new Date(image.createdAt).toLocaleDateString()}</span>
                </div>
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

      {/* Image Detail Popup */}
      {filteredImages.length > 0 && (
        <ImageDetailPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          imageData={filteredImages[selectedImageIndex] || null}
          images={filteredImages}
          currentIndex={selectedImageIndex}
          onNavigate={handleNavigateImage}
          onDelete={handleDeleteImage}
        />
      )}
    </div>
  );
};