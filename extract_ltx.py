#!/usr/bin/env python3
"""
Automated LTX Component Extraction Script

This script:
1. Extracts the LTX UI section from main.tsx
2. Generates component files (types.ts, LtxGenerationForm.tsx, index.tsx)
3. Replaces the UI section with a component invocation
4. Reports the changes made
"""

import os
import re
from pathlib import Path

# Component templates
TYPES_TEMPLATE = """export interface LtxGenerationFormProps {
  // Prompt
  ltxPrompt: string;
  setLtxPrompt: (value: string) => void;
  
  // Duration
  ltxDuration: number;
  setLtxDuration: (value: number) => void;
  
  // Frame rate
  ltxFps: number;
  setLtxFps: (value: number) => void;
  
  // Resolution
  ltxWidth: number;
  setLtxWidth: (value: number) => void;
  ltxHeight: number;
  setLtxHeight: (value: number) => void;
  
  // Seed
  ltxSeed: number;
  setLtxSeed: (value: number) => void;
  
  // Generation state
  isGeneratingLtx: boolean;
  handleGenerateLtxVideo: () => void;
}
"""

FORM_COMPONENT_TEMPLATE = """import React from 'react';
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
"""

INDEX_TEMPLATE = """export { LtxGenerationForm } from './LtxGenerationForm';
export type { LtxGenerationFormProps } from './types';
"""

COMPONENT_INVOCATION = """                      <LtxGenerationForm
                        ltxPrompt={ltxPrompt}
                        setLtxPrompt={setLtxPrompt}
                        ltxDuration={ltxDuration}
                        setLtxDuration={setLtxDuration}
                        ltxFps={ltxFps}
                        setLtxFps={setLtxFps}
                        ltxWidth={ltxWidth}
                        setLtxWidth={setLtxWidth}
                        ltxHeight={ltxHeight}
                        setLtxHeight={setLtxHeight}
                        ltxSeed={ltxSeed}
                        setLtxSeed={setLtxSeed}
                        isGeneratingLtx={isGeneratingLtx}
                        handleGenerateLtxVideo={handleGenerateLtxVideo}
                      />"""


def create_component_files():
    """Create the component directory and files"""
    component_dir = Path('src/components/LtxGeneration')
    component_dir.mkdir(parents=True, exist_ok=True)
    
    # Create types.ts
    types_file = component_dir / 'types.ts'
    with open(types_file, 'w', encoding='utf-8') as f:
        f.write(TYPES_TEMPLATE)
    print(f"✅ Created {types_file}")
    
    # Create LtxGenerationForm.tsx
    form_file = component_dir / 'LtxGenerationForm.tsx'
    with open(form_file, 'w', encoding='utf-8') as f:
        f.write(FORM_COMPONENT_TEMPLATE)
    print(f"✅ Created {form_file}")
    
    # Create index.tsx
    index_file = component_dir / 'index.tsx'
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(INDEX_TEMPLATE)
    print(f"✅ Created {index_file}")
    
    return component_dir


def extract_and_replace_ltx_section():
    """Extract LTX UI and replace with component invocation"""
    main_file = Path('src/main.tsx')
    
    with open(main_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find the LTX section
    start_line = None
    end_line = None
    
    for i, line in enumerate(lines):
        # Look for the start pattern
        if "generationMode === 'ltx' ? (" in line and start_line is None:
            start_line = i + 1  # Skip the condition line, start at the div
            print(f"✅ Found LTX section start at line {i + 1}")
        
        # Look for the end pattern (before the final else with LumaGeneration)
        if start_line is not None and end_line is None:
            if ") : (" in line and i > start_line + 50:  # Make sure we're past the start
                # Check if next few lines contain LumaGeneration
                next_lines = ''.join(lines[i:min(i+5, len(lines))])
                if '<LumaGeneration' in next_lines:
                    end_line = i - 1  # End before the closing )
                    print(f"✅ Found LTX section end at line {i}")
                    break
    
    if start_line is None or end_line is None:
        print("❌ Could not find LTX section boundaries")
        print(f"   Start: {start_line}, End: {end_line}")
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
    
    print(f"✅ Replaced LTX UI with component invocation")
    return True


def update_imports():
    """Add LtxGenerationForm to imports in main.tsx"""
    main_file = Path('src/main.tsx')
    
    with open(main_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the components import line
    import_pattern = r"(import \{[^}]*)(FireflyGenerationForm)([^}]*\} from ['\"]\.\/components['\"];)"
    
    match = re.search(import_pattern, content)
    if match:
        # Add LtxGenerationForm to the import
        new_import = f"{match.group(1)}{match.group(2)}, LtxGenerationForm{match.group(3)}"
        content = content.replace(match.group(0), new_import)
        
        with open(main_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Added LtxGenerationForm to imports")
        return True
    else:
        print("⚠️  Could not find components import line - you may need to add it manually")
        print("   Add: import { ..., LtxGenerationForm } from './components';")
        return False


def update_component_exports():
    """Add LtxGeneration to src/components/index.ts"""
    index_file = Path('src/components/index.ts')
    
    with open(index_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already exported
    if 'LtxGeneration' in content:
        print("✅ LtxGeneration already exported from components/index.ts")
        return True
    
    # Add export after FireflyGeneration
    content = content.replace(
        "export * from './FireflyGeneration';",
        "export * from './FireflyGeneration';\nexport * from './LtxGeneration';"
    )
    
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Added LtxGeneration export to components/index.ts")
    return True


def main():
    """Main execution function"""
    print("🚀 Starting LTX Component Extraction\n")
    
    # Step 1: Create component files
    print("Step 1: Creating component files...")
    component_dir = create_component_files()
    print()
    
    # Step 2: Extract and replace in main.tsx
    print("Step 2: Extracting LTX UI from main.tsx...")
    if not extract_and_replace_ltx_section():
        print("❌ Extraction failed")
        return
    print()
    
    # Step 3: Update imports in main.tsx
    print("Step 3: Updating imports in main.tsx...")
    update_imports()
    print()
    
    # Step 4: Update component exports
    print("Step 4: Updating component exports...")
    update_component_exports()
    print()
    
    print("✨ LTX component extraction complete!")
    print("\n📋 Next steps:")
    print("   1. Run: pnpm build")
    print("   2. Verify no errors")
    print("   3. Test LTX video generation")
    print("   4. Check that imports were added correctly")
    print(f"   5. Review generated files in {component_dir}")


if __name__ == '__main__':
    main()
