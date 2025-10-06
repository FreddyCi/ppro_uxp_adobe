import React from 'react';
import type { FireflyGenerationFormProps } from './types';

export const FireflyGenerationForm: React.FC<FireflyGenerationFormProps> = ({
  prompt,
  setPrompt,
  stylePreset,
  setStylePreset,
  contentType,
  setContentType,
  aspectRatio,
  setAspectRatio,
  seedValue,
  setSeedValue,
  isGenerating,
  handleGenerateImage,
}) => {
  return (
    <div className="generation-form">
      {/* Prompt Input */}
      <div className="form-group">
        <sp-label className="form-label">Prompt *</sp-label>
        <sp-textarea 
          id="prompt-input"
          placeholder="A majestic mountain landscape at sunset with purple clouds..."
          className="prompt-input"
          multiline
          rows={3}
          maxlength={1000}
          value={prompt}
          onInput={(e: any) => setPrompt(e.target.value)}
        >
        </sp-textarea>
        <div className="character-counter text-detail">
          {prompt.length}/1000 characters
        </div>
      </div>

      {/* Style Preset */}
      <div className="form-group">
        <sp-label className="form-label">Style Preset</sp-label>
        <div className="text-detail mb-sm">Choose a visual style for your image</div>
        <sp-picker 
          placeholder="No Style" 
          className="style-dropdown"
          onChange={(e: any) => setStylePreset(e.target.value)}
        >
          <sp-menu slot="options">
            <sp-menu-item value="">No Style</sp-menu-item>
            <sp-menu-item value="photographic">Photographic</sp-menu-item>
            <sp-menu-item value="digital-art">Digital Art</sp-menu-item>
            <sp-menu-item value="graphic-design">Graphic Design</sp-menu-item>
            <sp-menu-item value="3d">3D</sp-menu-item>
            <sp-menu-item value="painting">Painting</sp-menu-item>
            <sp-menu-item value="sketch">Sketch</sp-menu-item>
          </sp-menu>
        </sp-picker>
      </div>

      {/* Content Type */}
      <div className="form-group">
        <sp-label className="form-label">Content Type</sp-label>
        <div className="text-detail mb-sm">Choose between artistic or photorealistic content</div>
        <sp-radio-group 
          className="content-type-group"
          onChange={(e: any) => setContentType(e.target.value)}
        >
          <sp-radio value="art" checked={contentType === 'art'}>
            <span className="radio-label">Art</span>
            <div className="radio-description text-detail">Creative, artistic content</div>
          </sp-radio>
          <sp-radio value="photo" checked={contentType === 'photo'}>
            <span className="radio-label">Photo</span>
            <div className="radio-description text-detail">Photorealistic content</div>
          </sp-radio>
        </sp-radio-group>
      </div>

      {/* Aspect Ratio */}
      <div className="form-group">
        <sp-label className="form-label">Aspect Ratio</sp-label>
        <div className="text-detail mb-sm">Choose image dimensions</div>
        <sp-radio-group 
          className="content-type-group"
          onChange={(e: any) => setAspectRatio(e.target.value)}
        >
          <sp-radio value="square" checked={aspectRatio === 'square'}>
            <span className="radio-label">Square</span>
            <div className="radio-description text-detail">1024×1024</div>
          </sp-radio>
          <sp-radio value="landscape" checked={aspectRatio === 'landscape'}>
            <span className="radio-label">Landscape</span>
            <div className="radio-description text-detail">1792×1024</div>
          </sp-radio>
          <sp-radio value="portrait" checked={aspectRatio === 'portrait'}>
            <span className="radio-label">Portrait</span>
            <div className="radio-description text-detail">1024×1792</div>
          </sp-radio>
          <sp-radio value="ultrawide" checked={aspectRatio === 'ultrawide'}>
            <span className="radio-label">Ultrawide</span>
            <div className="radio-description text-detail">2048×896</div>
          </sp-radio>
        </sp-radio-group>
      </div>

      {/* Seed (Optional) */}
      <div className="form-group">
        <sp-label className="form-label">Seed (Optional)</sp-label>
        <sp-slider 
          min={0} 
          max={999999} 
          value={seedValue}
          step={1}
          className="seed-slider"
          onInput={(e: any) => setSeedValue(parseInt(e.target.value) || 0)}
        >
        </sp-slider>
      </div>

      {/* Generate Button */}
      <div className="form-actions">
        <sp-button 
          variant="accent" 
          size="m"
          className="generate-button"
          onClick={handleGenerateImage}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </sp-button>
      </div>
    </div>
  );
};
