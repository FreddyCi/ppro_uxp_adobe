import React from 'react';
import type { LtxGenerationFormProps } from './types';

export const LtxGenerationForm: React.FC<LtxGenerationFormProps> = ({
  ltxPrompt,
  setLtxPrompt,
  ltxDuration,
  setLtxDuration,
  ltxFps,
  setLtxFps,
  ltxWidth,
  setLtxWidth,
  ltxHeight,
  setLtxHeight,
  ltxSeed,
  setLtxSeed,
  isGeneratingLtx,
  handleGenerateLtxVideo,
}) => {
  return (
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
  );
};
