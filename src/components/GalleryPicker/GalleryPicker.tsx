import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useGalleryStore } from '../../store/galleryStore';
import type { ContentItem } from '../../types/content';
import { GalleryPickerProps } from './types';

export const GalleryPicker: React.FC<GalleryPickerProps> = ({ target, onSelect, onCancel }) => {
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
