# Firefly Component Extraction Plan

## Overview
Extract Firefly image generation UI from main.tsx into a reusable component, similar to the Luma extraction.

## Current State Analysis

### Location in main.tsx
- **Start**: Line ~1842 - `generationMode === 'firefly' ? (`
- **End**: Line ~1957 - Before `generationMode === 'ltx'`
- **Total Lines**: ~115 lines
- **Pattern**: Ternary conditional rendering

### State Variables Used (8 total)
1. `prompt` - string
2. `setPrompt` - setState
3. `stylePreset` - string
4. `setStylePreset` - setState
5. `contentType` - 'art' | 'photo'
6. `setContentType` - setState
7. `aspectRatio` - string
8. `setAspectRatio` - setState
9. `seedValue` - number
10. `setSeedValue` - setState
11. `isGenerating` - boolean
12. `handleGenerateImage` - function

### UI Elements
1. **Prompt textarea** - multiline, 1000 char max
2. **Style Preset picker** - 7 options (none, photographic, digital-art, graphic-design, 3d, painting, sketch)
3. **Content Type radio group** - Art vs Photo
4. **Aspect Ratio radio group** - Square, Landscape, Portrait, Ultrawide
5. **Seed slider** - 0-999999, optional
6. **Generate button** - Disabled when generating or no prompt

## Component Structure Plan

```
src/components/FireflyGeneration/
├── index.tsx              # Main component export
├── FireflyGenerationForm.tsx  # Form UI
└── types.ts               # TypeScript interfaces
```

## Component Architecture

### types.ts
```typescript
export interface FireflyGenerationFormProps {
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
```

### FireflyGenerationForm.tsx
- Import types
- Render all form controls
- Pass all handlers as props
- Use UXP uncontrolled component pattern

### index.tsx
- Re-export FireflyGenerationForm as default
- Keep it simple like LumaGeneration/index.tsx

## Replacement in main.tsx

### Before (115 lines)
```tsx
) : generationMode === 'firefly' ? (
  <div className="generation-form">
    {/* 115 lines of UI */}
  </div>
) : generationMode === 'ltx' ? (
```

### After (~15 lines)
```tsx
) : generationMode === 'firefly' ? (
  <FireflyGeneration
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
  />
) : generationMode === 'ltx' ? (
```

## Python Automation Script

### Script Features
1. **Pattern Detection**
   - Find: `generationMode === 'firefly' ? (`
   - End: `) : generationMode === 'ltx' ? (`
   
2. **Component Template Generation**
   - Auto-generate types.ts
   - Auto-generate FireflyGenerationForm.tsx
   - Auto-generate index.tsx
   
3. **Smart Replacement**
   - Extract exact indentation
   - Preserve surrounding code
   - Generate component invocation

4. **Validation**
   - Count lines removed
   - Count lines added
   - Report net change

## Estimated Impact
- **Lines Removed**: ~115 lines
- **Lines Added**: ~15 lines
- **Net Reduction**: ~100 lines (-4.2% of current main.tsx)
- **Total Reduction After Firefly**: ~989 lines (-29% from original)

## LTX Component Extraction (Future)
- Similar pattern to Firefly
- Located after Firefly section
- ~120 lines of video generation UI

## Benefits
1. **Maintainability**: Separate concerns
2. **Reusability**: Component can be used elsewhere
3. **Testing**: Easier to test in isolation
4. **Readability**: main.tsx becomes cleaner
5. **Type Safety**: Explicit prop interfaces

## Implementation Steps
1. ✅ Create extraction plan (this document)
2. Create Python script `extract_firefly.py`
3. Run script to generate components
4. Add import to main.tsx
5. Build and verify
6. Test Firefly generation
7. Commit changes

## Notes
- Follow UXP uncontrolled picker pattern (no `selected` attributes)
- Use same structure as LumaGeneration components
- Maintain all existing functionality
- Preserve all state management
