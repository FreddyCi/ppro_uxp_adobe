import React from 'react';
import type { LumaImageFormProps } from './types';
import type { ContentItem } from '../../types/content';

export const LumaImageForm: React.FC<LumaImageFormProps> = ({
  lumaPrompt,
  setLumaPrompt,
  lumaModel,
  setLumaModel,
  lumaAspectRatio,
  setLumaAspectRatio,
  isGeneratingLuma,
  lumaImageReferences,
  setLumaImageReferences,
  useImageReferences,
  setUseImageReferences,
  lumaStyleReference,
  setLumaStyleReference,
  useStyleReference,
  setUseStyleReference,
  lumaCharacterReferences,
  setLumaCharacterReferences,
  selectedCharacterIdentity,
  setSelectedCharacterIdentity,
  useCharacterReference,
  setUseCharacterReference,
  lumaModifyImage,
  setLumaModifyImage,
  useModifyImage,
  setUseModifyImage,
  handleGenerateLumaImage,
  showError,
  uxp,
}) => {
  return (
    <>
      {/* Luma Prompt */}
      <div className="form-group">
        <sp-label className="form-label">Image Prompt *</sp-label>
        <sp-textarea 
          id="prompt-input"
          placeholder="A teddy bear in sunglasses playing electric guitar and dancing..."
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

      {/* Model Selection */}
      <div className="form-group">
        <sp-label className="form-label">Model</sp-label>
        <div className="text-detail mb-sm">Choose the Dream Machine model</div>
        <sp-picker 
          placeholder="Select model"
          className="style-dropdown"
          onChange={(e: any) => setLumaModel(e.target.value)}
        >
          <sp-menu slot="options">
            <sp-menu-item value="photon-1">Photon 1</sp-menu-item>
            <sp-menu-item value="photon-flash-1">Photon Flash 1</sp-menu-item>
          </sp-menu>
        </sp-picker>
      </div>

      {/* Aspect Ratio for Images */}
      <div className="form-group">
        <sp-label className="form-label">Aspect Ratio</sp-label>
        <div className="text-detail mb-sm">Select the image composition</div>
        <sp-radio-group 
          className="content-type-group"
          onChange={(e: any) => setLumaAspectRatio(e.target.value)}
        >
          <sp-radio value="16:9" checked={lumaAspectRatio === '16:9'}>
            <span className="radio-label">16:9</span>
            <div className="radio-description text-detail">Widescreen</div>
          </sp-radio>
          <sp-radio value="1:1" checked={lumaAspectRatio === '1:1'}>
            <span className="radio-label">1:1</span>
            <div className="radio-description text-detail">Square</div>
          </sp-radio>
          <sp-radio value="3:4" checked={lumaAspectRatio === '3:4'}>
            <span className="radio-label">3:4</span>
            <div className="radio-description text-detail">Portrait</div>
          </sp-radio>
          <sp-radio value="4:3" checked={lumaAspectRatio === '4:3'}>
            <span className="radio-label">4:3</span>
            <div className="radio-description text-detail">Classic</div>
          </sp-radio>
          <sp-radio value="9:16" checked={lumaAspectRatio === '9:16'}>
            <span className="radio-label">9:16</span>
            <div className="radio-description text-detail">Vertical</div>
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

      {/* Image References (Optional) */}
      <div className="form-group">
        <sp-checkbox
          checked={useImageReferences}
          onChange={(e: any) => setUseImageReferences(e.target.checked)}
        >
          Use Image References (Optional)
        </sp-checkbox>
        <div className="text-detail mb-sm">Add up to 4 reference images to guide the generation</div>
      </div>

      {useImageReferences && (
        <div className="form-group">
          <sp-label className="form-label">Reference Images</sp-label>
          <div className="reference-images-container">
            {lumaImageReferences.map((ref, index) => (
              <div key={index} className="reference-image-item">
                <div className="reference-image-header">
                  <span className="text-detail">Reference {index + 1}</span>
                  {ref.file && (
                    <sp-button
                      size="s"
                      quiet
                      onClick={() => {
                        const newRefs = [...lumaImageReferences];
                        newRefs[index] = { file: null, weight: 0.5 };
                        setLumaImageReferences(newRefs);
                      }}
                    >
                      Remove
                    </sp-button>
                  )}
                </div>
                
                {!ref.file ? (
                  <sp-button
                    size="s"
                    onClick={async () => {
                      try {
                        const fs = uxp.storage.localFileSystem;
                        const file = await fs.getFileForOpening({ types: ['jpg', 'jpeg', 'png'] });
                        if (file) {
                          const newRefs = [...lumaImageReferences];
                          newRefs[index] = { ...newRefs[index], file };
                          setLumaImageReferences(newRefs);
                        }
                      } catch (error) {
                        console.error('Failed to select reference image:', error);
                        showError('File Selection Failed', 'Could not select the reference image');
                      }
                    }}
                  >
                    Select Image
                  </sp-button>
                ) : (
                  <>
                    <div className="reference-image-preview">
                      <span className="text-detail">{ref.file.name}</span>
                    </div>
                    <div className="reference-weight-control">
                      <sp-label className="form-label-small">Weight: {ref.weight.toFixed(1)}</sp-label>
                      <sp-slider
                        min={0.1}
                        max={1.0}
                        step={0.1}
                        value={ref.weight}
                        onInput={(e: any) => {
                          const newRefs = [...lumaImageReferences];
                          newRefs[index] = { ...newRefs[index], weight: parseFloat(e.target.value) };
                          setLumaImageReferences(newRefs);
                        }}
                      >
                      </sp-slider>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Style Reference (Optional) */}
      <div className="form-group">
        <sp-checkbox
          checked={useStyleReference}
          onChange={(e: any) => setUseStyleReference(e.target.checked)}
        >
          Use Style Reference (Optional)
        </sp-checkbox>
        <div className="text-detail mb-sm">Add a style reference image to guide the artistic style</div>
      </div>

      {useStyleReference && (
        <div className="form-group">
          <sp-label className="form-label">Style Reference</sp-label>
          <div className="reference-images-container">
            <div className="reference-image-item">
              <div className="reference-image-header">
                <span className="text-detail">Style Image</span>
                {lumaStyleReference.file && (
                  <sp-button
                    size="s"
                    quiet
                    onClick={() => {
                      setLumaStyleReference({ file: null, weight: 0.5 });
                    }}
                  >
                    Remove
                  </sp-button>
                )}
              </div>
              
              {!lumaStyleReference.file ? (
                <sp-button
                  size="s"
                  onClick={async () => {
                    try {
                      const fs = uxp.storage.localFileSystem;
                      const file = await fs.getFileForOpening({ types: ['jpg', 'jpeg', 'png'] });
                      if (file) {
                        setLumaStyleReference({ ...lumaStyleReference, file });
                      }
                    } catch (error) {
                      console.error('Failed to select style reference:', error);
                      showError('File Selection Failed', 'Could not select the style reference image');
                    }
                  }}
                >
                  Select Style Image
                </sp-button>
              ) : (
                <>
                  <div className="reference-image-preview">
                    <span className="text-detail">{lumaStyleReference.file.name}</span>
                  </div>
                  <div className="reference-weight-control">
                    <sp-label className="form-label-small">Weight: {lumaStyleReference.weight.toFixed(1)}</sp-label>
                    <sp-slider
                      min={0.1}
                      max={1.0}
                      step={0.1}
                      value={lumaStyleReference.weight}
                      onInput={(e: any) => {
                        setLumaStyleReference({ ...lumaStyleReference, weight: parseFloat(e.target.value) });
                      }}
                    >
                    </sp-slider>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Character Reference (Optional) */}
      <div className="form-group">
        <sp-checkbox
          checked={useCharacterReference}
          onChange={(e: any) => setUseCharacterReference(e.target.checked)}
        >
          Use Character Reference (Optional)
        </sp-checkbox>
        <div className="text-detail mb-sm">Add reference images for character consistency (up to 4 identities)</div>
      </div>

      {useCharacterReference && (
        <div className="form-group">
          <sp-label className="form-label">Character References</sp-label>
          
          {/* Identity Selector */}
          <div className="mb-md">
            <sp-label className="form-label-small">Select Identity</sp-label>
            <div className="character-identity-selector">
              {['A', 'B', 'C', 'D'].map((label, index) => (
                <sp-button
                  key={index}
                  size="s"
                  variant={selectedCharacterIdentity === index ? 'accent' : 'secondary'}
                  onClick={() => setSelectedCharacterIdentity(index)}
                >
                  {label} ({lumaCharacterReferences[index].filter((img: File | ContentItem | null) => img !== null).length}/4)
                </sp-button>
              ))}
            </div>
          </div>

          {/* Character Images for Selected Identity */}
          <div className="reference-images-container">
            {lumaCharacterReferences[selectedCharacterIdentity].map((file, imgIndex) => (
              <div key={imgIndex} className="reference-image-item">
                <div className="reference-image-header">
                  <span className="text-detail">Reference {imgIndex + 1}</span>
                  {file && (
                    <sp-button
                      size="s"
                      quiet
                      onClick={() => {
                        const newRefs = [...lumaCharacterReferences];
                        newRefs[selectedCharacterIdentity][imgIndex] = null;
                        setLumaCharacterReferences(newRefs);
                      }}
                    >
                      Remove
                    </sp-button>
                  )}
                </div>
                
                {!file ? (
                  <sp-button
                    variant="accent"
                    onClick={async () => {
                      try {
                        const fs = uxp.storage.localFileSystem;
                        const selectedFile = await fs.getFileForOpening({ types: ['jpg', 'jpeg', 'png'] });
                        if (selectedFile) {
                          const newRefs = [...lumaCharacterReferences];
                          newRefs[selectedCharacterIdentity][imgIndex] = selectedFile;
                          setLumaCharacterReferences(newRefs);
                        }
                      } catch (error) {
                        console.error('Failed to select character image:', error);
                        showError('File Selection Failed', 'Could not select the character image');
                      }
                    }}
                  >
                    Select Image
                  </sp-button>
                ) : (
                  <div className="reference-image-preview">
                    <span className="text-detail">
                      {(file as File).name || (file as ContentItem).filename}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modify Image */}
      <>
        <sp-divider size="medium"></sp-divider>
        <div className="form-group">
          <sp-checkbox 
            checked={useModifyImage}
            onChange={(e: any) => {
              const newValue = e.target.checked;
              setUseModifyImage(newValue);
              // Disable other reference types when modify is enabled
              if (newValue) {
                setUseImageReferences(false);
                setUseStyleReference(false);
                setUseCharacterReference(false);
              }
            }}
          >
            Use Modify Image
          </sp-checkbox>
          <div className="text-detail mb-sm">Modify an existing image with a prompt (Note: For colors, use weight 0.0-0.1)</div>
        </div>

        {useModifyImage && (
          <div className="reference-images-container">
            <div className="reference-image-item">
              <div className="reference-image-header">
                <span className="form-label-small">Base Image to Modify</span>
                {lumaModifyImage.file && (
                  <sp-button
                    variant="secondary"
                    size="s"
                    quiet
                    onClick={() => setLumaModifyImage({ file: null, weight: 0.5 })}
                  >
                    Remove
                  </sp-button>
                )}
              </div>

              {!lumaModifyImage.file ? (
                <sp-button
                  variant="accent"
                  size="m"
                  style={{ width: '100%' }}
                  onClick={async () => {
                    try {
                      const fs = uxp.storage.localFileSystem;
                      const file = await fs.getFileForOpening({
                        types: ['png', 'jpg', 'jpeg', 'webp']
                      });
                      if (file) {
                        setLumaModifyImage({ ...lumaModifyImage, file });
                      }
                    } catch (error) {
                      console.error('Failed to select image:', error);
                      showError('File Selection Failed', 'Could not select the image to modify');
                    }
                  }}
                >
                  Select Image to Modify
                </sp-button>
              ) : (
                <div className="reference-image-preview">
                  <span className="text-detail">
                    {(lumaModifyImage.file as File).name || (lumaModifyImage.file as ContentItem).filename}
                  </span>
                </div>
              )}

              {lumaModifyImage.file && (
                <div className="reference-weight-control">
                  <label className="form-label-small">
                    Modification Weight: {lumaModifyImage.weight.toFixed(2)}
                    <span className="text-detail"> (Higher = closer to original, Lower for colors: 0.0-0.1)</span>
                  </label>
                  <sp-slider
                    min={0}
                    max={1}
                    step={0.05}
                    value={lumaModifyImage.weight}
                    onInput={(e: any) => {
                      setLumaModifyImage({ ...lumaModifyImage, weight: parseFloat(e.target.value) });
                    }}
                  >
                  </sp-slider>
                </div>
              )}
            </div>
          </div>
        )}
      </>

      {/* Generate Button */}
      <div className="form-group">
        <sp-button 
          variant="accent" 
          size="m"
          className="generate-button"
          onClick={handleGenerateLumaImage}
          disabled={isGeneratingLuma || !lumaPrompt.trim()}
        >
          {isGeneratingLuma ? 'Generating...' : 'Generate Image'}
        </sp-button>
      </div>
    </>
  );
};
