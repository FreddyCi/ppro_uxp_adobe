import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useGalleryStore } from '../../store/galleryStore';
import type { ContentItem } from '../../types/content';
import { GalleryPickerProps } from './types';

export const GalleryPicker: React.FC<GalleryPickerProps> = ({ target, onSelect, onCancel }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

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

  // Calculate pagination
  const totalPages = Math.ceil(galleryImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = galleryImages.slice(startIndex, endIndex);

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
          {/* Pagination Info */}
          <div className="gallery-pagination-info" style={{ 
            padding: '8px 16px', 
            textAlign: 'center',
            borderBottom: '1px solid var(--theme-border)'
          }}>
            <div className="text-detail">
              Showing {startIndex + 1} - {Math.min(endIndex, galleryImages.length)} of {galleryImages.length} {target === 'reframe-video' ? 'videos' : 'images'}
            </div>
            <div className="text-detail" style={{ fontSize: '10px', color: 'var(--theme-text-secondary)', marginTop: '4px' }}>
              Page {currentPage} of {totalPages}
            </div>
          </div>

          <div className="gallery-grid">
            {currentItems.map((item: ContentItem) => (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="gallery-pagination" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              padding: '12px 16px',
              borderTop: '1px solid var(--theme-border)',
              borderBottom: '1px solid var(--theme-border)'
            }}>
              {/* @ts-ignore */}
              <sp-button
                variant="secondary"
                size="s"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                «
              {/* @ts-ignore */}
              </sp-button>
              {/* @ts-ignore */}
              <sp-button
                variant="secondary"
                size="s"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                ‹ Previous
              {/* @ts-ignore */}
              </sp-button>
              <span className="text-detail" style={{ minWidth: '120px', textAlign: 'center' }}>
                Page {currentPage} of {totalPages}
              </span>
              {/* @ts-ignore */}
              <sp-button
                variant="secondary"
                size="s"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next ›
              {/* @ts-ignore */}
              </sp-button>
              {/* @ts-ignore */}
              <sp-button
                variant="secondary"
                size="s"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                »
              {/* @ts-ignore */}
              </sp-button>
            </div>
          )}

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
