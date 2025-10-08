import React from 'react';
import type { LumaVideoFormProps } from './types';

export const LumaVideoForm: React.FC<LumaVideoFormProps> = ({
  lumaPrompt,
  setLumaPrompt,
  lumaMode,
  setLumaMode,
  lumaModel,
  setLumaModel,
  lumaAspectRatio,
  setLumaAspectRatio,
  lumaDuration,
  setLumaDuration,
  lumaResolution,
  setLumaResolution,
  lumaFirstFrameItem,
  setLumaFirstFrameItem,
  lumaLastFrameItem,
  setLumaLastFrameItem,
  lumaReframeVideoItem,
  setLumaReframeVideoItem,
  setGalleryPickerTarget,
  setShowGalleryPicker,
  isGeneratingLuma,
  handleGenerateLumaVideo,
  handleReframeLumaVideo,
  useGalleryStore,
  showInfo,
  showError,
  uxp,
}) => {
  return (
    <div className="generation-form">
      {/* Luma Prompt */}
      <div className="form-group">
        <sp-label className="form-label">Video Prompt *</sp-label>
        <sp-textarea 
          id="prompt-input"
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

      {/* Keyframes Mode */}
      {lumaMode === 'keyframes' && (
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
            <sp-label className="form-label">Quick Selection</sp-label>
            <div className="text-detail mb-sm">Select both first and last frame images at once</div>
            <div className="image-selection-buttons">
              <sp-button
                variant="primary"
                size="m"
                onClick={() => {
                  setGalleryPickerTarget('both');
                  setShowGalleryPicker(true);
                }}
                disabled={lumaFirstFrameItem !== null && lumaLastFrameItem !== null}
              >
                {lumaFirstFrameItem && lumaLastFrameItem ? 'Frames Selected' : 'Select First & Last Frame'}
              </sp-button>
              {(lumaFirstFrameItem || lumaLastFrameItem) && (
                <sp-button
                  variant="secondary"
                  size="m"
                  onClick={() => {
                    setLumaFirstFrameItem(null);
                    setLumaLastFrameItem(null);
                  }}
                >
                  Clear All Frames
                </sp-button>
              )}
            </div>
          </div>

          {/* First Frame Image */}
          <div className="form-group">
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
                  <sp-button
                    variant="secondary"
                    size="s"
                    onClick={() => setLumaFirstFrameItem(null)}
                  >
                    Remove
                  </sp-button>
                </div>
              </div>
            ) : (
              <div className="image-selection-buttons">
                <sp-button
                  variant="secondary"
                  size="m"
                  onClick={() => {
                    setGalleryPickerTarget('first');
                    setShowGalleryPicker(true);
                  }}
                >
                  Choose First Frame from Gallery
                </sp-button>
              </div>
            )}
          </div>

          {/* Last Frame Image */}
          <div className="form-group">
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
                  <sp-button
                    variant="secondary"
                    size="s"
                    onClick={() => setLumaLastFrameItem(null)}
                  >
                    Remove
                  </sp-button>
                </div>
              </div>
            ) : (
              <div className="image-selection-buttons">
                <sp-button
                  variant="secondary"
                  size="m"
                  onClick={() => {
                    setGalleryPickerTarget('last');
                    setShowGalleryPicker(true);
                  }}
                >
                  Choose Last Frame from Gallery
                </sp-button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Reframe Mode */}
      {lumaMode === 'reframe' && (
        <>
          {/* Reframe Video Selection */}
          <div className="form-group">
            <sp-label className="form-label">Video to Reframe *</sp-label>
            <div className="text-detail mb-sm">Select a video file from your content directory</div>
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
                  <sp-button
                    variant="secondary"
                    size="s"
                    onClick={() => setLumaReframeVideoItem(null)}
                  >
                    Remove
                  </sp-button>
                </div>
              </div>
            ) : (
              <div className="video-selection-buttons">
                <sp-button
                  variant="secondary"
                  size="m"
                  onClick={async () => {
                    try {
                      const fs = uxp.storage.localFileSystem;
                      const file = await fs.getFileForOpening({ types: ['mp4', 'mov', 'webm', 'avi'] });
                      if (file) {
                        // Create a ContentItem from the local file
                        const contentItem = {
                          id: `local-video-${Date.now()}`,
                          filename: file.name,
                          contentType: 'uploaded-video' as const,
                          displayUrl: file.nativePath,
                          localPath: file.nativePath,
                          file: file,
                        };
                        setLumaReframeVideoItem(contentItem as any);
                      }
                    } catch (error) {
                      console.error('Failed to select video:', error);
                      showError('File Selection Failed', 'Could not select the video file');
                    }
                  }}
                >
                  Choose from Local
                </sp-button>
              </div>
            )}
          </div>

          {/* Reframe Aspect Ratio */}
          <div className="form-group">
            <sp-label className="form-label">Target Aspect Ratio *</sp-label>
            <div className="text-detail mb-sm">Choose the new aspect ratio for the video</div>
            <sp-radio-group 
              className="content-type-group"
              onChange={(e: any) => setLumaAspectRatio(e.target.value)}
            >
              <sp-radio value="1:1" checked={lumaAspectRatio === '1:1'}>
                <span className="radio-label">1:1</span>
                <div className="radio-description text-detail">Square</div>
              </sp-radio>
              <sp-radio value="16:9" checked={lumaAspectRatio === '16:9'}>
                <span className="radio-label">16:9</span>
                <div className="radio-description text-detail">Widescreen</div>
              </sp-radio>
              <sp-radio value="9:16" checked={lumaAspectRatio === '9:16'}>
                <span className="radio-label">9:16</span>
                <div className="radio-description text-detail">Vertical</div>
              </sp-radio>
              <sp-radio value="4:3" checked={lumaAspectRatio === '4:3'}>
                <span className="radio-label">4:3</span>
                <div className="radio-description text-detail">Traditional</div>
              </sp-radio>
              <sp-radio value="3:4" checked={lumaAspectRatio === '3:4'}>
                <span className="radio-label">3:4</span>
                <div className="radio-description text-detail">Portrait</div>
              </sp-radio>
              <sp-radio value="21:9" checked={lumaAspectRatio === '21:9'}>
                <span className="radio-label">21:9</span>
                <div className="radio-description text-detail">Ultra-wide</div>
              </sp-radio>
              <sp-radio value="9:21" checked={lumaAspectRatio === '9:21'}>
                <span className="radio-label">9:21</span>
                <div className="radio-description text-detail">Ultra-tall</div>
              </sp-radio>
            </sp-radio-group>
          </div>
        </>
      )}

      {/* Generate Button */}
      <div className="form-group">
        <sp-button 
          variant="accent" 
          size="m"
          className="generate-button"
          onClick={lumaMode === 'reframe' ? handleReframeLumaVideo : handleGenerateLumaVideo}
          disabled={isGeneratingLuma || !lumaPrompt.trim() || (lumaMode === 'reframe' && !lumaReframeVideoItem)}
        >
          {isGeneratingLuma ? 'Generating...' : lumaMode === 'reframe' ? 'Reframe Video' : 'Generate Video'}
        </sp-button>
      </div>
    </div>
  );
};
