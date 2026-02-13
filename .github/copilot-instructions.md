# AI Agent Instructions: Premiere Pro UXP AI Generation Panel

## Project Overview
This is an Adobe UXP (Unified Extensibility Platform) plugin for Premiere Pro that integrates multiple AI generation services (Firefly, LTX, Luma, FAL.ai) for creating images and videos. The panel runs inside Premiere Pro's UXP host environment with React + TypeScript + Vite.

**Key constraint**: UXP is NOT a standard browser environment. It has limited DOM APIs, no native Blob URLs, and requires special handling for module imports via `require()`.

## Architecture & Data Flow

### Service Layer Architecture
Services follow a **factory pattern** with dual storage modes controlled by `VITE_STORAGE_MODE`:
- **Azure mode** (default): Uploads to Azure Blob Storage with SAS token authentication
- **Local mode**: Stores files using UXP filesystem APIs in plugin data folder

Core service directories:
- `src/services/ims/` - Adobe IMS OAuth authentication (required for Azure)
- `src/services/blob/` - Azure Storage SDK integration (`AzureSDKBlobService`, `SASTokenService`)
- `src/services/{firefly,ltx,luma,fal}/` - AI generation API clients
- `src/services/premiere/` - Premiere Pro integration APIs
- `src/services/local/` - UXP local storage fallback

### State Management (Zustand)
Four main stores with **UXP-compatible persistence**:
- `authStore` - IMS authentication state with token refresh
- `galleryStore` - Content library (1900+ lines, handles images/videos with unified `ContentItem` model)
- `generationStore` - Active generation tracking
- `uiStore` - UI state including storage mode selection

**Critical pattern**: Stores use `zustand/middleware` with custom JSON storage adapter for UXP persistence (native localStorage not fully supported).

### Content Model
Unified `ContentItem` interface (`src/types/content.ts`) handles all content types:
```typescript
contentType: 'generated-image' | 'corrected-image' | 'video' | 'uploaded-image' | 'uploaded-video'
storageMode: 'azure' | 'local' | 'memory'
persistenceMethod: 'blob' | 'dataUrl' | 'presigned' | 'local'
```

Key conversion utilities: `convertGenerationResultToContentItem`, `convertVideoMetadataToContentItem`

## Development Workflows

### Setup & Environment
```bash
pnpm install                    # Required: pnpm, not npm
pnpm dev                        # Watch mode for development
pnpm build                      # Production build
pnpm ccx                        # Package as .ccx with MODE=package
pnpm mac-build / pnpm win-build # Platform-specific hybrid builds
```

**Environment variables** (`.env` - do NOT commit):
```env
VITE_IMS_CLIENT_ID=...          # Adobe IMS OAuth
VITE_AZURE_STORAGE_ACCOUNT_NAME=...
VITE_GEMINI_API_KEY=...
VITE_LTX_API_KEY=...
VITE_LUMA_API_KEY=...
VITE_FAL_API_KEY=...
VITE_STORAGE_MODE=azure         # or 'local'
```

### Testing
```bash
pnpm test                       # Vitest with jsdom
pnpm test:coverage              # Coverage reports
pnpm lint:ts                    # Type checking
```

Test setup mocks UXP globals (`src/test/setup.ts`) - always check mocks when adding UXP API calls.

## Critical Code Patterns

### UXP Module Loading Pattern
**Always use** the safe require pattern from `src/globals.ts`:
```typescript
import { uxp, premierepro } from './globals'
// NOT: const uxp = require('uxp')
```

Rationale: UXP modules (`uxp`, `premierepro`) are externalized in Vite config and loaded at runtime via host. Direct requires fail in test/dev environments.

### Custom Hooks for Generation Workflows
Pattern: Complex generation logic lives in hooks (`src/hooks/`), not components. Example: `useLumaGeneration`:
- Handles validation, authentication check via `ensureAuthenticated()`
- Coordinates service calls (Luma API + Azure upload)
- Manages local/Azure storage dispatch
- Returns handler functions to components

**Why**: Separates orchestration from UI, easier to test, reusable across components.

### Azure Upload with SAS Tokens
Critical flow (`src/services/blob/SASTokenService.ts` + `src/utils/azureUpload.ts`):
1. Check auth: `await ensureAuthenticated()` 
2. Mint SAS token via Azure Function (requires IMS token)
3. Upload with `@azure/storage-blob` SDK
4. Store metadata in gallery with blob URL

**Fallback**: If Azure fails or `isLocalMode()`, save to `src/services/local/localBoltStorage.ts`

### Base64 & Blob Conversion for UXP
UXP doesn't support native Blob URLs. Use utilities from `src/utils/`:
- `blobToDataUrl()` - Convert Blob to data URL (base64)
- `dataUrlToObjectUrl()` - Shim for creating object URLs in UXP
- `encodeBase64()` - Custom base64 encoder (fallback if `btoa` unavailable)

**Never** use `URL.createObjectURL()` directly - it fails silently in UXP.

### DOM Shims
Import `src/shims/domparser.ts` **first** in entry points if using DOMParser (required for Azure SDK XML parsing).

## Integration Points

### Adobe IMS Authentication
Flow: OAuth via `createIMSService()` → stores access token in `authStore` → refreshes automatically
- Check: `const isAuthed = useAuthStore(selectIsAuthed)`
- Login: `const { actions: { login } } = useAuthStore()`
- Required for: Azure uploads, Firefly API

### Premiere Pro API
Available globally via `premierepro` from `src/globals.ts`. Key APIs:
- `premierepro.Project.getActiveProject()` - Get current project
- Sequence/track/clip manipulation in `src/api/premierepro.ts`

Type definitions: `src/types/ppro.d.ts` (custom, not from Adobe)

### AI Service Patterns
Each AI service exports client classes (e.g., `LumaVideoService`, `FireflyService`) that:
- Accept API keys from env vars
- Return typed results matching `src/types/{service}.ts`
- Handle polling for async generation (common pattern for video generation)

Reference docs in `docs/` folder (e.g., `luma-service-api-reference.md`, `firefly-image-generation-workflow.md`)

## Common Pitfalls

1. **Storage mode mismatch**: Check `getStorageMode()` before assuming Azure. Gallery may have local-only items.
2. **Token expiry**: Always call `ensureAuthenticated()` before Azure/Firefly operations, not just once at startup.
3. **UXP async limits**: Avoid Promise.all with >10 concurrent operations in UXP (causes hangs).
4. **Type imports**: Use `import type` for types to avoid Vite bundling issues.
5. **Vite externals**: Don't import `premierepro` or `uxp` directly in tests - use mocks from `src/test/setup.ts`.

## File References
- Entry point: [src/main.tsx](src/main.tsx) (719 lines, full app component)
- Storage abstraction: [src/services/storageMode.ts](src/services/storageMode.ts)
- Gallery persistence: [src/store/galleryStore.ts](src/store/galleryStore.ts) (1890 lines)
- Azure integration: [src/services/blob/AzureSDKBlobService.ts](src/services/blob/AzureSDKBlobService.ts) (1622 lines)
- Build config: [vite.config.ts](vite.config.ts) + [uxp.config.ts](uxp.config.ts)

## Debugging
- **Build errors**: Check `pnpm lint:ts` first, then inspect `dist/` output
- **Runtime errors**: Use UXP Developer Tool (bundled with Creative Cloud) to attach debugger
- **Storage issues**: Check `isLocalMode()` vs actual env var `VITE_STORAGE_MODE`
- **Azure failures**: Verify IMS token valid, check SAS token mint endpoint logs in `infra/mint-sas/`
