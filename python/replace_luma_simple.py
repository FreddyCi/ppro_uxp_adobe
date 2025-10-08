#!/usr/bin/env python3
"""
Line-based replacement for the Luma UI section.
"""

# Read the file
with open('src/main.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the start and end lines
start_line = None
end_line = None

for i, line in enumerate(lines):
    if '<div className="generation-form">' in line and start_line is None:
        # Check if this is the Luma section by looking ahead
        if i + 5 < len(lines) and 'Generation Type Selector' in lines[i + 1]:
            start_line = i
            print(f"✅ Found start at line {i + 1}: {line.strip()[:50]}")
    
    if start_line is not None and end_line is None:
        # Look for the pattern that ends the Luma section
        if '})()}' in line and i > start_line + 100:  # Make sure we're past the start
            # Check next few lines for the closing structure
            if i + 3 < len(lines):
                next_lines = ''.join(lines[i:i+10])
                if '</div>' in next_lines and ')}' in next_lines and 'activeTab' in next_lines:
                    # Found the end - the closing )} that matches the opening ( in "ltx ? (...) : ("
                    end_line = i + 3  # Include the closing )}
                    # Find the exact line with )}
                    for j in range(i, min(i+5, len(lines))):
                        if lines[j].strip() == ')}':
                            end_line = j
                            break
                    print(f"✅ Found end at line {end_line + 1}: {lines[end_line].strip()}")
                    break

if start_line is not None and end_line is not None:
    print(f"\n📊 Section details:")
    print(f"   Lines to replace: {start_line + 1} to {end_line + 1}")
    print(f"   Total lines: {end_line - start_line + 1}")
    
    # The replacement code
    replacement_lines = [
        "                      <LumaGeneration\n",
        "                        lumaGenerationType={lumaGenerationType}\n",
        "                        setLumaGenerationType={setLumaGenerationType}\n",
        "                        videoFormProps={{\n",
        "                          lumaPrompt,\n",
        "                          setLumaPrompt,\n",
        "                          lumaModel,\n",
        "                          setLumaModel,\n",
        "                          lumaAspectRatio,\n",
        "                          setLumaAspectRatio,\n",
        "                          isGeneratingLuma,\n",
        "                          isAuthed: !!imsToken,\n",
        "                          lumaMode,\n",
        "                          setLumaMode,\n",
        "                          lumaDuration,\n",
        "                          setLumaDuration,\n",
        "                          lumaResolution,\n",
        "                          setLumaResolution,\n",
        "                          lumaFirstFrameItem,\n",
        "                          setLumaFirstFrameItem,\n",
        "                          lumaLastFrameItem,\n",
        "                          setLumaLastFrameItem,\n",
        "                          lumaReframeVideoItem,\n",
        "                          setLumaReframeVideoItem,\n",
        "                          setGalleryPickerTarget,\n",
        "                          setShowGalleryPicker,\n",
        "                          handleGenerateLumaVideo,\n",
        "                          handleReframeLumaVideo,\n",
        "                          useGalleryStore,\n",
        "                          showInfo\n",
        "                        }}\n",
        "                        imageFormProps={{\n",
        "                          lumaPrompt,\n",
        "                          setLumaPrompt,\n",
        "                          lumaModel,\n",
        "                          setLumaModel,\n",
        "                          lumaAspectRatio,\n",
        "                          setLumaAspectRatio,\n",
        "                          isGeneratingLuma,\n",
        "                          isAuthed: !!imsToken,\n",
        "                          lumaImageReferences,\n",
        "                          setLumaImageReferences,\n",
        "                          useImageReferences,\n",
        "                          setUseImageReferences,\n",
        "                          lumaStyleReference,\n",
        "                          setLumaStyleReference,\n",
        "                          useStyleReference,\n",
        "                          setUseStyleReference,\n",
        "                          lumaCharacterReferences,\n",
        "                          setLumaCharacterReferences,\n",
        "                          selectedCharacterIdentity,\n",
        "                          setSelectedCharacterIdentity,\n",
        "                          useCharacterReference,\n",
        "                          setUseCharacterReference,\n",
        "                          lumaModifyImage,\n",
        "                          setLumaModifyImage,\n",
        "                          useModifyImage,\n",
        "                          setUseModifyImage,\n",
        "                          handleGenerateLumaImage,\n",
        "                          showError,\n",
        "                          uxp\n",
        "                        }}\n",
        "                      />\n",
        "                    )}\n"
    ]
    
    # Build new content
    new_lines = lines[:start_line] + replacement_lines + lines[end_line + 1:]
    
    # Write back
    with open('src/main.tsx', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"\n✅ Replacement complete!")
    print(f"   Removed {end_line - start_line + 1} lines")
    print(f"   Added {len(replacement_lines)} lines")
    print(f"   Net change: {len(replacement_lines) - (end_line - start_line + 1)} lines")
else:
    print(f"\n❌ Could not find both start and end")
    if start_line:
        print(f"   Found start at line {start_line + 1}")
        print(f"   Context: {lines[start_line].strip()}")
    else:
        print(f"   Could not find start")
