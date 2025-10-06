#!/usr/bin/env python3
"""
Extract handler functions from main.tsx into custom hooks
Handles Firefly, LTX, and Luma generation handlers
"""

import re
from pathlib import Path

def read_file(filepath):
    """Read file content"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    """Write content to file"""
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def extract_handler(content, start_marker, end_marker):
    """Extract a handler function between markers"""
    start_idx = content.find(start_marker)
    if start_idx == -1:
        return None, content
    
    # Find the matching closing brace
    # Count braces to find the correct end
    brace_count = 0
    in_handler = False
    end_idx = start_idx
    
    for i in range(start_idx, len(content)):
        char = content[i]
        if char == '{':
            brace_count += 1
            in_handler = True
        elif char == '}':
            brace_count -= 1
            if in_handler and brace_count == 0:
                # Found the closing brace, include it and the semicolon
                end_idx = i + 1
                if end_idx < len(content) and content[end_idx] == ';':
                    end_idx += 1
                break
    
    if end_idx == start_idx:
        return None, content
    
    handler_code = content[start_idx:end_idx]
    remaining_content = content[:start_idx] + content[end_idx:]
    
    return handler_code, remaining_content

def create_firefly_hook(handler_code):
    """Create useFireflyGeneration hook file"""
    hook_content = '''import { createIMSService } from '../services/ims/IMSService';
import { FireflyService } from '../services/firefly';

interface ToastHelpers {
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
}

interface FireflyGenerationParams {
  prompt: string;
  stylePreset: string;
  contentType: string;
  aspectRatio: string;
  seedValue: number;
  imsToken: string | null;
  setIsGenerating: (value: boolean) => void;
  addGeneration: (result: any) => void;
  toastHelpers: ToastHelpers;
}

export function useFireflyGeneration(params: FireflyGenerationParams) {
  const {
    prompt,
    stylePreset,
    contentType,
    aspectRatio,
    seedValue,
    imsToken,
    setIsGenerating,
    addGeneration,
    toastHelpers
  } = params;

  const { showSuccess, showError, showWarning, showInfo } = toastHelpers;

  ''' + handler_code + '''

  return { handleGenerateImage };
}
'''
    return hook_content

def create_ltx_hook(handler_code):
    """Create useLtxGeneration hook file"""
    hook_content = '''import { LtxVideoService } from '../services/ltx';
import { saveGenerationLocally } from '../services/local/localBoltStorage';

interface ToastHelpers {
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
}

interface LtxGenerationParams {
  ltxPrompt: string;
  ltxDuration: number;
  ltxFps: number;
  ltxWidth: number;
  ltxHeight: number;
  ltxSeed: number;
  setIsGeneratingLtx: (value: boolean) => void;
  addGeneration: (result: any) => void;
  toastHelpers: ToastHelpers;
}

export function useLtxGeneration(params: LtxGenerationParams) {
  const {
    ltxPrompt,
    ltxDuration,
    ltxFps,
    ltxWidth,
    ltxHeight,
    ltxSeed,
    setIsGeneratingLtx,
    addGeneration,
    toastHelpers
  } = params;

  const { showSuccess, showError, showWarning, showInfo } = toastHelpers;

  ''' + handler_code + '''

  return { handleGenerateLtxVideo };
}
'''
    return hook_content

def create_luma_hook(video_handler, reframe_handler, image_handler):
    """Create useLumaGeneration hook file"""
    hook_content = '''import { LumaVideoService, LumaImageService } from '../services/luma';
import type { ContentItem } from '../types/content';
import type { LumaGenerationRequest, LumaVideoModel, LumaReframeVideoRequest, ReframeVideoModel, LumaImageModel, LumaImageGenerationRequest } from '../types/luma';
import { uploadBlobWithSAS } from '../utils/azureUpload';
import { encodeBase64, convertBlobToDataUrl } from '../utils/base64';
import { createSASTokenService } from '../services/blob/SASTokenService';
import { ensureAuthenticated } from '../store/authStore';
import { saveGenerationLocally } from '../services/local/localBoltStorage';
import { selectHasSAS } from '../store/uiStore';
import { uploadBytes } from '../services/sasUpload';
import { uxp } from '../globals';

interface ToastHelpers {
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
}

interface LumaGenerationParams {
  // Video generation params
  lumaPrompt: string;
  lumaModel: string;
  lumaAspectRatio: string;
  lumaDuration: string;
  lumaResolution: string;
  lumaLoop: boolean;
  lumaFirstFrameItem: ContentItem | null;
  lumaLastFrameItem: ContentItem | null;
  lumaMode: 'keyframes' | 'reframe';
  lumaReframeVideoItem: ContentItem | null;
  
  // Image generation params
  lumaImageReferences: Array<{file: File | null, weight: number}>;
  lumaStyleReference: {file: any | null, weight: number};
  lumaCharacterReferences: Array<Array<File | ContentItem | null>>;
  lumaModifyImage: {file: File | ContentItem | null, weight: number};
  
  // State setters and auth
  isAuthed: boolean;
  setIsGeneratingLuma: (value: boolean) => void;
  addGeneration: (result: any) => void;
  toastHelpers: ToastHelpers;
  
  // Azure storage params
  sasService: ReturnType<typeof createSASTokenService> | null;
  accountName: string;
  containerName: string;
}

export function useLumaGeneration(params: LumaGenerationParams) {
  const {
    lumaPrompt,
    lumaModel,
    lumaAspectRatio,
    lumaDuration,
    lumaResolution,
    lumaLoop,
    lumaFirstFrameItem,
    lumaLastFrameItem,
    lumaMode,
    lumaReframeVideoItem,
    lumaImageReferences,
    lumaStyleReference,
    lumaCharacterReferences,
    lumaModifyImage,
    isAuthed,
    setIsGeneratingLuma,
    addGeneration,
    toastHelpers,
    sasService,
    accountName,
    containerName
  } = params;

  const { showSuccess, showError, showWarning, showInfo } = toastHelpers;

  ''' + video_handler + '''

  ''' + reframe_handler + '''

  ''' + image_handler + '''

  return { 
    handleGenerateLumaVideo,
    handleReframeLumaVideo,
    handleGenerateLumaImage
  };
}
'''
    return hook_content

def main():
    print("🚀 Starting handler extraction...")
    
    # Read main.tsx
    main_tsx_path = Path('src/main.tsx')
    content = read_file(main_tsx_path)
    print(f"📖 Read {main_tsx_path} ({len(content)} chars)")
    
    # Extract Firefly handler
    print("\n🎨 Extracting Firefly handler...")
    firefly_handler, content = extract_handler(content, 'const handleGenerateImage = async () => {', None)
    if firefly_handler:
        firefly_hook = create_firefly_hook(firefly_handler)
        write_file(Path('src/hooks/useFireflyGeneration.ts'), firefly_hook)
        print(f"✅ Created src/hooks/useFireflyGeneration.ts ({len(firefly_handler)} chars)")
    else:
        print("⚠️  Firefly handler not found")
    
    # Extract LTX handler
    print("\n🎬 Extracting LTX handler...")
    ltx_handler, content = extract_handler(content, 'const handleGenerateLtxVideo = async () => {', None)
    if ltx_handler:
        ltx_hook = create_ltx_hook(ltx_handler)
        write_file(Path('src/hooks/useLtxGeneration.ts'), ltx_hook)
        print(f"✅ Created src/hooks/useLtxGeneration.ts ({len(ltx_handler)} chars)")
    else:
        print("⚠️  LTX handler not found")
    
    # Extract Luma handlers
    print("\n🎥 Extracting Luma handlers...")
    luma_video_handler, content = extract_handler(content, 'const handleGenerateLumaVideo = async () => {', None)
    if luma_video_handler:
        print(f"✅ Extracted handleGenerateLumaVideo ({len(luma_video_handler)} chars)")
    else:
        print("⚠️  Luma video handler not found")
    
    luma_reframe_handler, content = extract_handler(content, 'const handleReframeLumaVideo = async () => {', None)
    if luma_reframe_handler:
        print(f"✅ Extracted handleReframeLumaVideo ({len(luma_reframe_handler)} chars)")
    else:
        print("⚠️  Luma reframe handler not found")
    
    luma_image_handler, content = extract_handler(content, 'const handleGenerateLumaImage = async () => {', None)
    if luma_image_handler:
        print(f"✅ Extracted handleGenerateLumaImage ({len(luma_image_handler)} chars)")
    else:
        print("⚠️  Luma image handler not found")
    
    if luma_video_handler and luma_reframe_handler and luma_image_handler:
        luma_hook = create_luma_hook(luma_video_handler, luma_reframe_handler, luma_image_handler)
        write_file(Path('src/hooks/useLumaGeneration.ts'), luma_hook)
        total_chars = len(luma_video_handler) + len(luma_reframe_handler) + len(luma_image_handler)
        print(f"✅ Created src/hooks/useLumaGeneration.ts ({total_chars} chars total)")
    
    # Write updated main.tsx
    write_file(main_tsx_path, content)
    print(f"\n📝 Updated {main_tsx_path}")
    
    # Add imports to main.tsx
    print("\n📦 Adding hook imports to main.tsx...")
    content = read_file(main_tsx_path)
    
    # Find where to insert imports (after other imports)
    import_marker = "// Import utilities"
    import_idx = content.find(import_marker)
    
    if import_idx != -1:
        # Insert hook imports before utilities imports
        hook_imports = '''// Import custom hooks
import { useFireflyGeneration } from './hooks/useFireflyGeneration';
import { useLtxGeneration } from './hooks/useLtxGeneration';
import { useLumaGeneration } from './hooks/useLumaGeneration';

'''
        content = content[:import_idx] + hook_imports + content[import_idx:]
        write_file(main_tsx_path, content)
        print("✅ Added hook imports")
    
    # Now add hook usage in AppContent component
    print("\n🔧 Adding hook calls in AppContent...")
    content = read_file(main_tsx_path)
    
    # Find where to add hook calls (after toast helpers)
    toast_marker = "const { showSuccess, showError, showInfo, showWarning } = useToastHelpers();"
    toast_idx = content.find(toast_marker)
    
    if toast_idx != -1:
        # Find end of that line
        line_end = content.find('\n', toast_idx)
        
        hook_calls = '''
  
  // Initialize generation hooks
  const { handleGenerateImage } = useFireflyGeneration({
    prompt,
    stylePreset,
    contentType,
    aspectRatio,
    seedValue,
    imsToken,
    setIsGenerating,
    addGeneration,
    toastHelpers: { showSuccess, showError, showInfo, showWarning }
  });

  const { handleGenerateLtxVideo } = useLtxGeneration({
    ltxPrompt,
    ltxDuration,
    ltxFps,
    ltxWidth,
    ltxHeight,
    ltxSeed,
    setIsGeneratingLtx,
    addGeneration,
    toastHelpers: { showSuccess, showError, showInfo, showWarning }
  });

  const { 
    handleGenerateLumaVideo,
    handleReframeLumaVideo,
    handleGenerateLumaImage
  } = useLumaGeneration({
    lumaPrompt,
    lumaModel,
    lumaAspectRatio,
    lumaDuration,
    lumaResolution,
    lumaLoop,
    lumaFirstFrameItem,
    lumaLastFrameItem,
    lumaMode,
    lumaReframeVideoItem,
    lumaImageReferences,
    lumaStyleReference,
    lumaCharacterReferences,
    lumaModifyImage,
    isAuthed,
    setIsGeneratingLuma,
    addGeneration,
    toastHelpers: { showSuccess, showError, showInfo, showWarning },
    sasService,
    accountName,
    containerName
  });
'''
        content = content[:line_end + 1] + hook_calls + content[line_end + 1:]
        write_file(main_tsx_path, content)
        print("✅ Added hook calls")
    
    print("\n✨ Handler extraction complete!")
    print("\n📊 Summary:")
    print(f"   - Extracted Firefly handler to hooks/useFireflyGeneration.ts")
    print(f"   - Extracted LTX handler to hooks/useLtxGeneration.ts")
    print(f"   - Extracted 3 Luma handlers to hooks/useLumaGeneration.ts")
    print(f"   - Updated main.tsx with hook imports and calls")
    print(f"\n🔍 Next: Run 'pnpm build' to verify")

if __name__ == '__main__':
    main()
