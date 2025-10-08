#!/usr/bin/env python3
"""
Automated Firefly Component Extraction Script

This script:
1. Extracts the Firefly UI section from main.tsx
2. Generates component files (types.ts, FireflyGenerationForm.tsx, index.tsx)
3. Replaces the UI section with a component invocation
4. Reports the changes made
"""

import os
import re
from pathlib import Path

# Component templates
TYPES_TEMPLATE = """export interface FireflyGenerationFormProps {
  // Prompt
  prompt: string;
  setPrompt: (value: string) => void;
  
  // Style
  stylePreset: string;
  setStylePreset: (value: string) => void;
  
  // Content type
  contentType: 'art' | 'photo';
  setContentType: (value: 'art' | 'photo') => void;
  
  // Aspect ratio
  aspectRatio: string;
  setAspectRatio: (value: string) => void;
  
  // Seed
  seedValue: number;
  setSeedValue: (value: number) => void;
  
  // Generation state
  isGenerating: boolean;
  handleGenerateImage: () => void;
}
"""

FORM_COMPONENT_TEMPLATE = """import React from 'react';
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
"""

INDEX_TEMPLATE = """export { FireflyGenerationForm } from './FireflyGenerationForm';
export type { FireflyGenerationFormProps } from './types';
"""

COMPONENT_INVOCATION = """                      <FireflyGenerationForm
                        prompt={prompt}
                        setPrompt={setPrompt}
                        stylePreset={stylePreset}
                        setStylePreset={setStylePreset}
                        contentType={contentType}
                        setContentType={setContentType}
                        aspectRatio={aspectRatio}
                        setAspectRatio={setAspectRatio}
                        seedValue={seedValue}
                        setSeedValue={setSeedValue}
                        isGenerating={isGenerating}
                        handleGenerateImage={handleGenerateImage}
                      />"""


def create_component_files():
    """Create the component directory and files"""
    component_dir = Path('src/components/FireflyGeneration')
    component_dir.mkdir(parents=True, exist_ok=True)
    
    # Create types.ts
    types_file = component_dir / 'types.ts'
    with open(types_file, 'w', encoding='utf-8') as f:
        f.write(TYPES_TEMPLATE)
    print(f"✅ Created {types_file}")
    
    # Create FireflyGenerationForm.tsx
    form_file = component_dir / 'FireflyGenerationForm.tsx'
    with open(form_file, 'w', encoding='utf-8') as f:
        f.write(FORM_COMPONENT_TEMPLATE)
    print(f"✅ Created {form_file}")
    
    # Create index.tsx
    index_file = component_dir / 'index.tsx'
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(INDEX_TEMPLATE)
    print(f"✅ Created {index_file}")
    
    return component_dir


def extract_and_replace_firefly_section():
    """Extract Firefly UI and replace with component invocation"""
    main_file = Path('src/main.tsx')
    
    with open(main_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find the Firefly section
    start_line = None
    end_line = None
    
    for i, line in enumerate(lines):
        # Look for the start pattern
        if "generationMode === 'firefly' ? (" in line and start_line is None:
            start_line = i + 1  # Skip the condition line, start at the div
            print(f"✅ Found Firefly section start at line {i + 1}")
        
        # Look for the end pattern (before ltx section)
        if start_line is not None and end_line is None:
            if ") : generationMode === 'ltx' ? (" in line:
                end_line = i - 1  # End before the ltx condition
                print(f"✅ Found Firefly section end at line {i}")
                break
    
    if start_line is None or end_line is None:
        print("❌ Could not find Firefly section boundaries")
        return False
    
    # Calculate statistics
    lines_removed = end_line - start_line + 1
    replacement_lines = COMPONENT_INVOCATION.split('\n')
    lines_added = len(replacement_lines)
    
    print(f"\n📊 Extraction Summary:")
    print(f"   Section: lines {start_line + 1} to {end_line + 1}")
    print(f"   Lines to remove: {lines_removed}")
    print(f"   Lines to add: {lines_added}")
    print(f"   Net change: {lines_added - lines_removed} lines")
    
    # Build the replacement
    new_lines = (
        lines[:start_line] +
        [line + '\n' for line in replacement_lines] +
        lines[end_line + 1:]
    )
    
    # Write back
    with open(main_file, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"✅ Replaced Firefly UI with component invocation")
    return True


def update_imports():
    """Add FireflyGenerationForm to imports in main.tsx"""
    main_file = Path('src/main.tsx')
    
    with open(main_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the components import line
    import_pattern = r"(import \{[^}]*)(LumaGeneration)([^}]*\} from ['\"]\.\/components['\"];)"
    
    match = re.search(import_pattern, content)
    if match:
        # Add FireflyGenerationForm to the import
        new_import = f"{match.group(1)}{match.group(2)}, FireflyGenerationForm{match.group(3)}"
        content = content.replace(match.group(0), new_import)
        
        with open(main_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Added FireflyGenerationForm to imports")
        return True
    else:
        print("⚠️  Could not find components import line - you may need to add it manually")
        print("   Add: import { ..., FireflyGenerationForm } from './components';")
        return False


def main():
    """Main execution function"""
    print("🚀 Starting Firefly Component Extraction\n")
    
    # Step 1: Create component files
    print("Step 1: Creating component files...")
    component_dir = create_component_files()
    print()
    
    # Step 2: Extract and replace in main.tsx
    print("Step 2: Extracting Firefly UI from main.tsx...")
    if not extract_and_replace_firefly_section():
        print("❌ Extraction failed")
        return
    print()
    
    # Step 3: Update imports
    print("Step 3: Updating imports...")
    update_imports()
    print()
    
    print("✨ Firefly component extraction complete!")
    print("\n📋 Next steps:")
    print("   1. Run: pnpm build")
    print("   2. Verify no errors")
    print("   3. Test Firefly image generation")
    print("   4. Check that the import was added correctly")
    print(f"   5. Review generated files in {component_dir}")


if __name__ == '__main__':
    main()
