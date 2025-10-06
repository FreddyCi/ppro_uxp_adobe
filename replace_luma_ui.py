#!/usr/bin/env python3
"""
Script to replace the massive Luma UI section in main.tsx with the LumaGeneration component.
This is safer than trying to do it with text replacement tools on such a large section.
"""

import re

# Read the file
with open('src/main.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# The replacement component code
replacement = """                      <LumaGeneration
                        lumaGenerationType={lumaGenerationType}
                        setLumaGenerationType={setLumaGenerationType}
                        videoFormProps={{
                          lumaPrompt,
                          setLumaPrompt,
                          lumaModel,
                          setLumaModel,
                          lumaAspectRatio,
                          setLumaAspectRatio,
                          isGeneratingLuma,
                          isAuthed: !!imsToken,
                          lumaMode,
                          setLumaMode,
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
                          handleGenerateLumaVideo,
                          handleReframeLumaVideo,
                          useGalleryStore,
                          showInfo
                        }}
                        imageFormProps={{
                          lumaPrompt,
                          setLumaPrompt,
                          lumaModel,
                          setLumaModel,
                          lumaAspectRatio,
                          setLumaAspectRatio,
                          isGeneratingLuma,
                          isAuthed: !!imsToken,
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
                          uxp
                        }}
                      />
                    )}"""

# Pattern to match the entire Luma UI section
# Starts with: <div className="generation-form"> after ) : (
# Ends with: the closing </div> before )}
pattern = r'(<div className="generation-form">)\s*{/\* Generation Type Selector \*/}.*?({/\* Generate Button \*/}.*?}\)\(\)\}\s*</div>\s*</div>\s*)\s*(\}\))'

# Find and replace
match = re.search(pattern, content, re.DOTALL)
if match:
    print(f"✅ Found Luma UI section")
    print(f"   Start position: {match.start()}")
    print(f"   End position: {match.end()}")
    print(f"   Length: {match.end() - match.start()} characters")
    
    # Replace
    new_content = content[:match.start()] + replacement + content[match.end()-2:]  # Keep the final )}
    
    # Write back
    with open('src/main.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Replacement complete!")
    print(f"   Removed: {match.end() - match.start()} characters")
    print(f"   Added: {len(replacement)} characters")
    print(f"   Net change: {len(replacement) - (match.end() - match.start())} characters")
else:
    print("❌ Could not find the Luma UI section to replace")
    print("   Trying simpler pattern...")
    
    # Try a simpler approach - just find from generation-form to the matching closing
    simple_pattern = r'(<div className="generation-form">.*?</div>\s*</div>\s*\}\))'
    
    matches = list(re.finditer(simple_pattern, content, re.DOTALL))
    if matches:
        # Take the longest match (should be the Luma section)
        match = max(matches, key=lambda m: m.end() - m.start())
        print(f"✅ Found section with simpler pattern")
        print(f"   Length: {match.end() - match.start()} characters")
        
        # Check if this looks like the Luma section
        section = match.group(0)
        if 'Generation Type Selector' in section and 'Luma Prompt' in section:
            print("✅ Confirmed this is the Luma UI section")
            new_content = content[:match.start()] + replacement + "\n                    )}" + content[match.end():]
            
            with open('src/main.tsx', 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print("✅ Replacement complete!")
        else:
            print("❌ This doesn't look like the Luma section")
    else:
        print("❌ Simple pattern also failed")
