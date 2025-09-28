// @ts-ignore
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useGenerationStore } from '../../store/generationStore';
import './ImageDetailPopup.scss';

interface ImageData {
  id: number;
  url: string;
  prompt: string;
  contentType: string;
  aspectRatio: string;
  createdAt: Date;
  tags: string[];
  metadata?: {
    size?: string;
    model?: string;
    seed?: number;
    steps?: number;
    guidance?: number;
    strength?: number;
  };
}

interface ImageDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: ImageData | null;
  images: ImageData[];
  currentIndex: number;
  onNavigate: (direction: 'prev' | 'next') => void;
  onDelete?: (imageId: number) => void;
}

export const ImageDetailPopup = ({
  isOpen,
  onClose,
  imageData,
  images,
  currentIndex,
  onNavigate,
  onDelete
}: ImageDetailPopupProps) => {
  // Zoom and pan state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  
  // Image container ref
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset zoom and pan when image changes
  useEffect(() => {
    if (imageData) {
      setZoomLevel(1);
      setPanX(0);
      setPanY(0);
    }
  }, [imageData?.id]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) onNavigate('prev');
          break;
        case 'ArrowRight':
          if (currentIndex < images.length - 1) onNavigate('next');
          break;
        case '+':
        case '=':
          e.preventDefault();
          setZoomLevel((prev: number) => Math.min(prev + 0.25, 5));
          break;
        case '-':
          e.preventDefault();
          setZoomLevel((prev: number) => Math.max(prev - 0.25, 0.5));
          break;
        case '0':
          e.preventDefault();
          handleResetZoom();
          break;
        case '1':
          e.preventDefault();
          setZoomLevel(1);
          break;
        case '2':
          e.preventDefault();
          setZoomLevel(2);
          break;
        case '3':
          e.preventDefault();
          setZoomLevel(3);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  // Mouse drag handlers
  const handleMouseDown = (e: any) => {
    if (zoomLevel <= 1) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      panX,
      panY
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setPanX(dragStart.panX + deltaX);
    setPanY(dragStart.panY + deltaY);
  }, [isDragging, dragStart, zoomLevel]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Zoom functions
  const handleZoomIn = () => {
    setZoomLevel((prev: number) => Math.min(prev + 0.25, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev: number) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanX(0);
    setPanY(0);
  };

  const handleFitToScreen = () => {
    if (!imageRef.current || !imageContainerRef.current) return;
    
    const container = imageContainerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const img = imageRef.current;
    const imageWidth = img.naturalWidth;
    const imageHeight = img.naturalHeight;
    
    const scaleX = containerWidth / imageWidth;
    const scaleY = containerHeight / imageHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    
    setZoomLevel(scale);
    setPanX(0);
    setPanY(0);
  };

  // Navigation helpers
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  // Format metadata for display
  const formatMetadata = useMemo(() => {
    if (!imageData) return [];
    
    const metadata = [];
    
    if (imageData.metadata?.size) {
      metadata.push({ label: 'Size', value: imageData.metadata.size });
    }
    
    if (imageData.metadata?.model) {
      metadata.push({ label: 'Model', value: imageData.metadata.model });
    }
    
    if (imageData.metadata?.seed) {
      metadata.push({ label: 'Seed', value: imageData.metadata.seed.toString() });
    }
    
    if (imageData.metadata?.steps) {
      metadata.push({ label: 'Steps', value: imageData.metadata.steps.toString() });
    }
    
    if (imageData.metadata?.guidance) {
      metadata.push({ label: 'Guidance', value: imageData.metadata.guidance.toString() });
    }
    
    metadata.push({ 
      label: 'Created', 
      value: new Date(imageData.createdAt).toLocaleString() 
    });
    
    metadata.push({ 
      label: 'Type', 
      value: imageData.contentType.charAt(0).toUpperCase() + imageData.contentType.slice(1)
    });
    
    metadata.push({ 
      label: 'Aspect Ratio', 
      value: imageData.aspectRatio.charAt(0).toUpperCase() + imageData.aspectRatio.slice(1)
    });
    
    return metadata;
  }, [imageData]);

  if (!isOpen || !imageData) return null;

  return (
    <div className="image-detail-overlay" onClick={onClose}>
      {/* @ts-ignore */}
      <sp-dialog size="fullscreen" open={isOpen} className="image-detail-dialog">
        <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
          
          {/* Dialog Header */}
          <div className="dialog-header">
            <div className="dialog-title">
              <h2>Image Details</h2>
              <span className="image-counter">
                {currentIndex + 1} of {images.length}
              </span>
            </div>
            
            <div className="dialog-actions">
              {/* Navigation */}
              {/* @ts-ignore */}
              <sp-action-button 
                quiet 
                disabled={!hasPrevious}
                onClick={() => onNavigate('prev')}
                title="Previous image (←)"
              >
                {/* @ts-ignore */}
                <sp-icon name="ui:ChevronLeft" size="m"></sp-icon>
              {/* @ts-ignore */}
              </sp-action-button>
              
              {/* @ts-ignore */}
              <sp-action-button 
                quiet 
                disabled={!hasNext}
                onClick={() => onNavigate('next')}
                title="Next image (→)"
              >
                {/* @ts-ignore */}
                <sp-icon name="ui:ChevronRight" size="m"></sp-icon>
              {/* @ts-ignore */}
              </sp-action-button>
              
              {/* @ts-ignore */}
              <sp-divider size="m" vertical></sp-divider>
              
              {/* Zoom Controls */}
              {/* @ts-ignore */}
              <sp-action-button 
                quiet 
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                title="Zoom out (-)"
              >
                {/* @ts-ignore */}
                <sp-icon name="ui:Remove" size="s"></sp-icon>
              {/* @ts-ignore */}
              </sp-action-button>
              
              <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
              
              {/* @ts-ignore */}
              <sp-action-button 
                quiet 
                onClick={handleZoomIn}
                disabled={zoomLevel >= 5}
                title="Zoom in (+)"
              >
                {/* @ts-ignore */}
                <sp-icon name="ui:Add" size="s"></sp-icon>
              {/* @ts-ignore */}
              </sp-action-button>
              
              {/* @ts-ignore */}
              <sp-action-button 
                quiet 
                onClick={handleFitToScreen}
                title="Fit to screen"
              >
                {/* @ts-ignore */}
                <sp-icon name="ui:ViewSingle" size="s"></sp-icon>
              {/* @ts-ignore */}
              </sp-action-button>
              
              {/* @ts-ignore */}
              <sp-action-button 
                quiet 
                onClick={handleResetZoom}
                title="Reset zoom (0)"
              >
                {/* @ts-ignore */}
                <sp-icon name="ui:Refresh" size="s"></sp-icon>
              {/* @ts-ignore */}
              </sp-action-button>
              
              {/* @ts-ignore */}
              <sp-divider size="m" vertical></sp-divider>
              
              {/* Delete */}
              {onDelete && (
                /* @ts-ignore */
                <sp-action-button 
                  quiet 
                  onClick={() => onDelete(imageData.id)}
                  title="Delete image"
                >
                  {/* @ts-ignore */}
                  <sp-icon name="ui:Delete" size="s"></sp-icon>
                {/* @ts-ignore */}
                </sp-action-button>
              )}
              
              {/* Close */}
              {/* @ts-ignore */}
              <sp-action-button 
                quiet 
                onClick={onClose}
                title="Close (Esc)"
              >
                {/* @ts-ignore */}
                <sp-icon name="ui:Close" size="m"></sp-icon>
              {/* @ts-ignore */}
              </sp-action-button>
            </div>
          </div>

          {/* Main Content */}
          <div className="dialog-body">
            
            {/* Image Display */}
            <div className="image-section">
              <div 
                className="image-container"
                ref={imageContainerRef}
                onMouseDown={handleMouseDown}
                style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
              >
                <img
                  ref={imageRef}
                  src={imageData.url}
                  alt={imageData.prompt}
                  className="detail-image"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panX / zoomLevel}px, ${panY / zoomLevel}px)`,
                    transformOrigin: 'center center'
                  }}
                  onLoad={() => {
                    // Auto-fit large images on initial load
                    if (imageRef.current && imageContainerRef.current) {
                      const img = imageRef.current;
                      const container = imageContainerRef.current;
                      
                      if (img.naturalWidth > container.clientWidth || 
                          img.naturalHeight > container.clientHeight) {
                        setTimeout(handleFitToScreen, 100);
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Metadata Panel */}
            <div className="metadata-section">
              <h3>Details</h3>
              
              {/* Prompt */}
              <div className="metadata-group">
                <label className="metadata-label">Prompt</label>
                <div className="metadata-value prompt-text">
                  {imageData.prompt}
                </div>
              </div>

              {/* Tags */}
              {imageData.tags && imageData.tags.length > 0 && (
                <div className="metadata-group">
                  <label className="metadata-label">Tags</label>
                  <div className="tags-container">
                    {imageData.tags.map((tag: string, index: number) => (
                      /* @ts-ignore */
                      <sp-tag key={index} size="s">
                        {tag}
                      {/* @ts-ignore */}
                      </sp-tag>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Details */}
              <div className="metadata-group">
                <label className="metadata-label">Technical Info</label>
                <div className="metadata-list">
                  {formatMetadata.map((item: any, index: number) => (
                    <div key={index} className="metadata-item">
                      <span className="item-label">{item.label}:</span>
                      <span className="item-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="metadata-actions">
                {/* @ts-ignore */}
                <sp-button variant="secondary" onClick={() => {
                  // Copy prompt to clipboard
                  navigator.clipboard.writeText(imageData.prompt);
                }}>
                  {/* @ts-ignore */}
                  <sp-icon name="ui:Copy" size="s" slot="icon"></sp-icon>
                  Copy Prompt
                {/* @ts-ignore */}
                </sp-button>
                
                {/* @ts-ignore */}
                <sp-button variant="secondary" onClick={() => {
                  // Download image
                  const link = document.createElement('a');
                  link.href = imageData.url;
                  link.download = `firefly-${imageData.id}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}>
                  {/* @ts-ignore */}
                  <sp-icon name="ui:Download" size="s" slot="icon"></sp-icon>
                  Download
                {/* @ts-ignore */}
                </sp-button>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className="dialog-footer">
            <div className="shortcuts-help">
              <span>Shortcuts:</span>
              <span>← → Navigate</span>
              <span>+/- Zoom</span>
              <span>0 Reset</span>
              <span>Esc Close</span>
            </div>
          </div>
        </div>
      {/* @ts-ignore */}
      </sp-dialog>
    </div>
  );
};