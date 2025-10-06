# LTX Video Component Extraction Plan

## Overview
Extract LTX video generation UI from main.tsx into a reusable component, following the same pattern as Luma and Firefly extractions.

## Current State Analysis

### Location in main.tsx
- **Start**: Line ~1857 - `generationMode === 'ltx' ? (`
- **End**: Line ~1969 - Before final else block with LumaGeneration
- **Total Lines**: ~112 lines
- **Pattern**: Ternary conditional rendering

### State Variables Used (14 total)
1. `ltxPrompt` - string
2. `setLtxPrompt` - setState
3. `ltxDuration` - number (1-10 seconds)
4. `setLtxDuration` - setState
5. `ltxFps` - number (16 or 24)
6. `setLtxFps` - setState
7. `ltxWidth` - number
8. `setLtxWidth` - setState
9. `ltxHeight` - number
10. `setLtxHeight` - setState
11. `ltxSeed` - number (0-999999)
12. `setLtxSeed` - setState
13. `isGeneratingLtx` - boolean
14. `handleGenerateLtxVideo` - function

### UI Elements
1. **Prompt textarea** - multiline, 1000 char max, video-specific placeholder
2. **Duration slider** - 1-10 seconds with value display
3. **FPS radio group** - 16 FPS vs 24 FPS
4. **Resolution radio group** - 3 options (1024x576, 1280x720, 1920x1080)
5. **Seed slider** - 0-999999, optional
6. **Generate button** - Disabled when generating or no prompt

## Component Structure Plan

```
src/components/LtxGeneration/
├── index.tsx                  # Main component export
├── LtxGenerationForm.tsx      # Form UI
└── types.ts                   # TypeScript interfaces
```

## Component Architecture

### types.ts
```typescript
export interface LtxGenerationFormProps {
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
```

### LtxGenerationForm.tsx
- Import types
- Render all form controls
- Pass all handlers as props
- Use UXP uncontrolled component pattern
- Handle resolution as compound state (width x height)

### index.tsx
- Re-export LtxGenerationForm as default
- Keep it simple and consistent with other components

## Replacement in main.tsx

### Before (112 lines)
```tsx
) : generationMode === 'ltx' ? (
  <div className="generation-form">
    {/* 112 lines of LTX UI */}
  </div>
) : (
  <LumaGeneration ... />
)
```

### After (~17 lines)
```tsx
) : generationMode === 'ltx' ? (
  <LtxGenerationForm
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
  />
) : (
  <LumaGeneration ... />
)
```

## Python Automation Script Features

### Pattern Detection
1. **Start**: `generationMode === 'ltx' ? (`
2. **End**: `) : (` followed by `<LumaGeneration`

### Component Template Generation
- Auto-generate types.ts
- Auto-generate LtxGenerationForm.tsx
- Auto-generate index.tsx

### Smart Replacement
- Extract exact indentation
- Preserve surrounding code
- Generate component invocation with all props

### Validation
- Count lines removed
- Count lines added
- Report net change
- Verify section boundaries

## Estimated Impact
- **Lines Removed**: ~112 lines
- **Lines Added**: ~17 lines
- **Net Reduction**: ~95 lines (-4.1% of current main.tsx)
- **Total Reduction After LTX**: ~1,085 lines (-33% from original 3,276)

## Special Considerations

### Resolution Handling
The resolution uses compound state (width + height). The radio onChange handler:
```typescript
onChange={(e: any) => {
  const [width, height] = e.target.value.split('x').map(Number);
  setLtxWidth(width);
  setLtxHeight(height);
}}
```

This pattern should be preserved in the component.

### Value Display
The duration slider shows the current value:
```tsx
<div className="text-detail mt-sm">{ltxDuration} seconds</div>
```

This should be included in the component.

## Benefits
1. **Modularity**: LTX video generation is self-contained
2. **Consistency**: Follows same pattern as Firefly and Luma
3. **Maintainability**: Easier to update LTX features
4. **Type Safety**: Explicit prop interfaces
5. **Reusability**: Can be used in other contexts
6. **Testability**: Component can be tested in isolation

## Implementation Steps
1. ✅ Create extraction plan (this document)
2. Create Python script `extract_ltx.py`
3. Run script to generate components
4. Add export to src/components/index.ts
5. Build and verify
6. Test LTX video generation
7. Commit changes

## Notes
- Follow UXP uncontrolled component pattern
- Maintain all existing functionality
- Preserve resolution compound state handling
- Keep value display for duration slider
- Use same file structure as Firefly and Luma components
