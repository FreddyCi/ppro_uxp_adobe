# Graph Enterprise + Frame.io Integration

## Overview

This document outlines the implementation plan for integrating Graph Enterprise workflow generation with Frame.io media delivery into the Premiere Pro UXP panel. The integration enables users to submit natural-language workflow requests, poll for completion, and retrieve resulting media assets from Frame.io directly in the panel.

---

## Workflow

```
User pastes curl → Select Frame.io project/folder → Click "Generate"
       ↓
Graph Enterprise job submitted (returns jobId)
       ↓
Poll job status (show progress in UI)
       ↓
Job completes → Graph outputs media to Frame.io folder
       ↓
UXP panel fetches new assets from Frame.io folder
       ↓
Display thumbnails/previews in results panel
```

---

## Implementation Steps

### 1. Frame.io Service

**Create**: `src/services/frameio/FrameIOService.ts`

**Methods**:
- `listProjects(accountId?): Promise<Project[]>` — fetch user's Frame.io projects
- `listFolders(projectId, parentId?): Promise<Folder[]>` — get folders in a project
- `listAssets(folderId, opts?): Promise<Asset[]>` — get media assets (images/videos) from a folder
- `getAssetThumbnailUrl(assetId): Promise<string>` — return preview URL
- `downloadAsset(assetId): Promise<Blob>` — download full asset (optional for POC)

**Auth**: Accept IMS token via `ensureAuthenticated()` or server-side token exchange

**Reference patterns**: `src/services/firefly/FireflyService.ts` for API client structure

**Create**: `src/services/frameio/types.ts`

**Type definitions**:
- `Project`, `Folder`, `Asset` interfaces matching Frame.io API response shapes
- `FrameIOConfig` for credentials/endpoints

---

### 2. Graph Enterprise Service

**Create**: `src/services/graph/GraphEnterpriseService.ts`

**Methods**:
- `submitJob(curlPayload): Promise<{ jobId:string, statusUrl?:string }>` — parse curl and POST to Graph endpoint
- `getJobStatus(jobId): Promise<{ status:'pending'|'running'|'completed'|'failed', progress?:number, outputs?:any }>` — check job state
- `pollUntilComplete(jobId, callbacks?): Promise<JobResult>` — poll with backoff, emit progress events

**Auth**: Use IMS token from `ensureAuthenticated()`

**Reuse polling pattern from**: `src/services/luma/LumaVideoService.ts` (`waitForCompletion` with `delay` and abort support)

**Create**: `src/services/graph/types.ts`

**Type definitions**:
- `GraphJobRequest`, `GraphJobStatus`, `GraphJobResult` interfaces

---

### 3. Orchestration Hook

**Create**: `src/hooks/useGraphFrameIO.ts`

**State**:
- `projects: Project[]`, `selectedProject`, `selectedFolder`
- `jobId`, `jobStatus`, `progress`, `error`
- `results: Asset[]` (Frame.io assets from completed job)

**Actions**:
- `loadProjects()` — fetch Frame.io projects on mount
- `handleGenerate(curlString)` — orchestrate:
  1. Parse curl payload
  2. `ensureAuthenticated()`
  3. `GraphEnterpriseService.submitJob()`
  4. `pollUntilComplete()` with progress callbacks
  5. On completion → `FrameIOService.listAssets(selectedFolder)` to fetch new outputs
  6. Update `results` state with thumbnails
- `refreshResults()` — re-fetch Frame.io assets from folder

**Reference**: `src/hooks/useFireflyGeneration.ts` for orchestration pattern

---

### 4. UI Component

**Create**: `src/components/Generations/GraphGenerationsPanel.tsx`

**Layout (3-column)**:

```
┌─────────────────────────────────────────────────────────┐
│ Graph Generations (DEV)                                 │
├─────────────────┬────────────────────┬──────────────────┤
│ Input           │ Status             │ Results          │
│                 │                    │                  │
│ [Frame.io]      │ Job ID: abc123     │ [Thumbnail 1]    │
│ Project: [▼]    │ Status: Running    │ [Thumbnail 2]    │
│ Folder: [▼]     │ Progress: 45%      │ [Thumbnail 3]    │
│                 │                    │                  │
│ [Paste curl]    │ Logs:              │ [View All]       │
│ ┌──────────┐    │ > Submitted...     │                  │
│ │{workflow}│    │ > Polling...       │                  │
│ │...       │    │ > Complete!        │                  │
│ └──────────┘    │                    │                  │
│                 │                    │                  │
│ [Generate]      │ [Cancel]           │ [Refresh]        │
└─────────────────┴────────────────────┴──────────────────┘
```

**Components**:

**Input Panel**:
- `<sp-dropdown>` for Frame.io projects (populated from `useGraphFrameIO().projects`)
- `<sp-dropdown>` for folders within selected project
- `<sp-textarea>` for curl paste (pre-filled with example)
- `<sp-button>` Generate

**Status Panel**:
- Job ID display
- `<sp-progressbar>` for polling progress
- Live log textbox showing submit → poll → complete events
- Cancel button (abort polling)

**Results Panel**:
- Grid of thumbnails from `results` array (Frame.io assets)
- Click thumbnail → preview modal or download to local UXP storage
- Refresh button to re-fetch folder contents

**Reference**: `src/components/LumaGeneration/LumaGeneration.tsx` for form + progress patterns

---

### 5. Wire into Main Panel

**Update**: `src/main.tsx`

- Add tab: `"Graph Generations"` visible only when `import.meta.env.DEV === true`
- Render `<GraphGenerationsPanel />` when tab active
- Reference existing tab pattern (Firefly, Luma, LTX tabs)

---

### 6. Types & Adapters

**Create**: `src/types/frameio.ts`
- Export Frame.io type definitions for app-wide use

**Optional**: `src/services/graph/adapter.ts`
- If normalizing Frame.io assets to `ContentItem` for gallery ingestion:
  - `frameioAssetToContentItem(asset: Asset): ContentItem`
  - Use `src/types/content.ts` conversion helpers

---

### 7. Environment & Config

**Update**: `.env.example` (add example entries)

```env
# Frame.io (optional for POC if using IMS-based auth)
VITE_FRAMEIO_API_BASE=https://api.frame.io/v2

# Graph Enterprise
VITE_GRAPH_ENTERPRISE_ENDPOINT=http://localhost:7071/execute
```

**Read existing**: Check `vite.config.ts` for how env vars are exposed via `import.meta.env`

---

### 8. Tests

**Create**: `src/test/graph-frameio.spec.ts`

**Test coverage**:
- Mock `createIMSService()` using `src/services/ims/MockIMSService.ts`
- Mock `fetch` for Graph submit/poll and Frame.io list/get responses
- Test scenarios:
  - `GraphEnterpriseService.submitJob()` parses curl correctly
  - `pollUntilComplete()` handles retries and terminal states
  - `FrameIOService.listAssets()` returns expected shape
  - Hook orchestration calls services in correct order

---

### 9. Documentation

**Create**: `docs/graph-frameio-integration.md`

**Contents**:
- Overview of the workflow
- Example curl (provided by user)
- Environment setup (IMS credentials, Frame.io token, Graph endpoint)
- Dev run instructions:
  ```bash
  pnpm dev
  # Open panel → Graph Generations tab → paste curl → select project → Generate
  ```
- Troubleshooting: auth errors, polling timeouts, Frame.io rate limits

---

## Acceptance Criteria

### ✅ Clear submit → job ID → poll → result pattern
- User sees immediate jobId after clicking Generate
- Progress bar updates during polling
- Terminal state (completed/failed) shown in UI

### ✅ Backend proven without full panel implementation (dev mode only)
- Tab only visible in DEV (`import.meta.env.DEV`)
- Services can be unit tested independently
- Hook orchestrates end-to-end flow

### ✅ Suitable for media workflows (video)
- Frame.io assets include images and videos
- Thumbnails displayed for quick preview
- Optional: download to local UXP storage using `src/services/local/localBoltStorage.ts`

---

## Dependencies & Auth Flow

### IMS Authentication
- Reuse existing `createIMSService()` and `ensureAuthenticated()` from `src/store/authStore.ts`
- Graph Enterprise expects bearer token in `Authorization: Bearer <token>` header
- Frame.io may require:
  - Same IMS token if integrated with Adobe identity, OR
  - Separate Frame.io developer token (stored in env or exchanged server-side)

### Frame.io API
- Base URL: `https://api.frame.io/v2` (or custom endpoint)
- Key endpoints (assumed from typical Frame.io API):
  - `GET /accounts` → list accounts
  - `GET /projects` → list projects
  - `GET /assets?parent_id={folderId}` → list assets in folder
  - `GET /assets/{assetId}/download` → get download URL

**Note**: If Frame.io requires OAuth or server-side token exchange, we can add a small proxy function (similar to `infra/mint-sas`) to handle secrets securely.

---

## Files Summary

| Path | Action | Purpose |
|------|--------|---------|
| `src/services/graph/GraphEnterpriseService.ts` | Create | Submit/poll Graph jobs |
| `src/services/graph/types.ts` | Create | Graph type definitions |
| `src/services/frameio/FrameIOService.ts` | Create | Frame.io API client |
| `src/services/frameio/types.ts` | Create | Frame.io types |
| `src/hooks/useGraphFrameIO.ts` | Create | Orchestration hook |
| `src/components/Generations/GraphGenerationsPanel.tsx` | Create | UI component |
| `src/main.tsx` | Update | Add DEV tab |
| `src/test/graph-frameio.spec.ts` | Create | Unit tests |
| `docs/graph-frameio-integration.md` | Create | Integration guide |

---

## Example Curl

```bash
curl --location 'http://localhost:7071/execute' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer <IMS_TOKEN>' \
  --header 'x-gw-ims-org-id: 90FC331D59DBA35E0A494204@AdobeOrg' \
  --header 'x-gw-ims-user-id: 2E441D69686227520A494212@c62f24cc5b5b7e0e0a494004' \
  --header 'x-api-key: bulk-automation-web' \
  --data '{
    "workflow": {
      "workflowId": "a1c13339-6c22-4462-80fd-7663ccc97622",
      "inputs": [
        [
          {
            "node_id": "node_1770939134578_57fxlnh98_0_1qndme",
            "content": "{text}"
          }
        ]
      ]
    }
  }'
```

---

## Development Workflow

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Configure environment variables (`.env`):
   ```env
   VITE_IMS_CLIENT_ID=<your_client_id>
   VITE_FRAMEIO_API_BASE=https://api.frame.io/v2
   VITE_GRAPH_ENTERPRISE_ENDPOINT=http://localhost:7071/execute
   ```

3. Start dev server:
   ```bash
   pnpm dev
   ```

### Manual Testing (Dev Mode)

1. Open panel in UXP dev host or local dev UI
2. Navigate to "Graph Generations" tab (DEV only)
3. Select Frame.io project and folder from dropdowns
4. Paste curl request or use pre-filled example
5. Click "Generate"
6. Observe:
   - Immediate jobId display
   - Progress bar updates
   - Poll logs in status panel
   - Final assets appear in results panel

### Unit Testing

Run tests:
```bash
pnpm test
```

Run with coverage:
```bash
pnpm test:coverage
```

---

## Architecture Notes

### Service Layer Pattern
All services follow the factory pattern with:
- Optional `fetchImpl` parameter for testing
- IMS token injection via `ensureAuthenticated()`
- Retry logic with exponential backoff
- Type-safe request/response interfaces

### Polling Strategy
Reuse existing patterns from `src/services/luma/LumaVideoService.ts`:
- Initial delay: 2 seconds
- Exponential backoff: 2x per retry (max 30 seconds)
- Configurable timeout (default: 5 minutes for video workflows)
- AbortController support for cancellation
- Parse `Retry-After` headers when present

### UXP Constraints
- No native `URL.createObjectURL()` — use data URLs or local file paths
- Limited DOM APIs — use UXP-safe patterns from existing services
- Module loading via `require()` — use safe pattern from `src/globals.ts`

---

## Next Steps

Once credentials are provided:
1. Implement services (Graph + Frame.io)
2. Create orchestration hook
3. Build UI component
4. Wire DEV tab into main panel
5. Add unit tests
6. Manual verification in dev environment
7. Iterate based on real API responses

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Frame.io rate limits | Implement exponential backoff, cache project/folder lists |
| Large video downloads in UXP | Use streaming or chunk downloads, save to local storage incrementally |
| IMS token expiry during long polls | Refresh token automatically via `ensureAuthenticated()` |
| Graph job failures | Show clear error messages, allow retry without re-entering data |
| CORS issues with direct API calls | Add server-side proxy if needed (similar to `infra/mint-sas`) |

---

## Future Enhancements

- WebSocket support for real-time job progress (Graph Enterprise supports streaming)
- Batch job submission (multiple workflow requests)
- Save favorite workflows for quick re-run
- Direct import to Premiere timeline from Frame.io assets
- Azure SAS upload for large assets (reuse existing `src/services/blob/` patterns)
- Production deployment with secrets management via Azure Key Vault
