# Premiere Pro UXP Luma Panel — Developer README

This repository contains the Premiere Pro UXP panel used to generate and manage Luma (image/video) generations, gallery items, and local persistence logic. This README is focused for developers: setup, development, testing, architecture notes, and troubleshooting.

## Table of contents
- Prerequisites
- Quick start (dev)
- Building for production
- Testing
- Project structure
- Key implementation notes
- Troubleshooting & common errors
- Contributing
- Contact

---

## Prerequisites

- Node.js (LTS recommended, e.g. 18+)
- pnpm (project uses pnpm for package management)
- Visual Studio Code or another editor
- macOS for UXP/host testing (the panel is developed to run inside Adobe Premiere Pro's UXP host)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ppro_uxp_adobe
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys and configuration
   ```

   **Required environment variables:**
   - `VITE_IMS_CLIENT_ID` - Adobe IMS OAuth client ID
   - `VITE_IMS_CLIENT_SECRET` - Adobe IMS OAuth client secret
   - `VITE_AZURE_STORAGE_ACCOUNT_NAME` - Azure storage account name
   - `VITE_AZURE_STORAGE_ACCOUNT_KEY` - Azure storage account key
   - `VITE_GEMINI_API_KEY` - Google Gemini API key
   - `VITE_LTX_API_KEY` - LTX-2 API key
   - `VITE_LUMA_API_KEY` - Luma API key
   - `VITE_FAL_API_KEY` - Fal.ai API key

## Quick start (development)

1. Install dependencies

```bash
pnpm install
```

2. Start a dev build/watch (or run the local dev server if configured)

```bash
pnpm dev
```

3. Build for production (generates `dist/`)

```bash
pnpm build
```

4. Load the generated `dist` into your UXP host (Premiere) or use the provided packaging in `__queuestorage__` or `ccx/` samples.

## Building for production

Run `pnpm build` — Vite will produce the built panel under `dist/` with assets in `dist/assets`.

The project uses TypeScript and Vite. The final JS bundle referenced by the UXP manifest should be the file in `dist/assets`.

## Testing

- Unit tests (Vitest): `pnpm test` (if configured)
- Linting/Type-checking: `pnpm lint` / `pnpm typecheck` (if configured)

At minimum, run `pnpm build` to ensure the project compiles after changes.

## Project structure (high-level)

- `src/` — application source
  - `components/` — React components (Gallery, GalleryPicker, LumaGeneration, LumaVideoForm, etc.)
  - `store/` — Zustand stores (galleryStore, generationStore, uiStore)
  - `services/` — platform integrations (Luma API client, local storage helpers)
  - `utils/` — helper utilities
  - `types/` — TypeScript types and conversion helpers
- `dist/` — output of builds
- `ccx/`, `__queuestorage__/` — packaging and distribution materials
- `docs/` — engineering docs and runbooks

## Key implementation notes

- Gallery persistence uses a custom `createUXPStorage` (in `src/store/galleryStore.ts`) that persists a partial state to `localStorage` via `zustand`'s `persist` middleware. The store's `partialize` function strips large binary data (video blobs and large data URLs) prior to persistence to avoid localStorage quota/serialization issues.

- Luma integrations:
  - Video generation uses Ray models and the `/generations/video` endpoint — this flow has been validated and is typically working.
  - Image generation uses Photon models and the `/generations/image` endpoint — historically sensitive to service outages. See logs for `LumaImageService` and polling behavior.

- Blob URL lifecycle: The app converts data URLs and local files into runtime blob URLs for playback using helpers in `src/utils/runtimeUrl.ts` and `src/utils/blobUrlLifecycle.ts`. These runtime URLs are revoked on unmount.

## Troubleshooting & common errors

- RangeError: Invalid string length
  - Symptoms: Crash in Gallery component during rehydration, errors referencing `JSON.stringify` or `localStorage.setItem`.
  - Cause: Large binary data (videoBlob or huge data: URLs) were being persisted to localStorage.
  - Fixes: The store now strips heavy data before persisting. If you still see this, try clearing persisted gallery data from localStorage (see below).

- Clearing persisted gallery state

  - In dev console or from code, run:

  ```js
  localStorage.removeItem('gallery-storage')
  ```

  - Or use the `clearAll()` action in the Gallery store:

  ```ts
  const { actions } = useGalleryStore.getState()
  actions.clearAll()
  ```

- Luma image generation stuck in queued
  - Symptoms: API accepts request (201 Created) but polling stays in `queued` forever.
  - Cause: External Luma Photon worker outage. Not a code issue.
  - Action: Wait for service recovery; test video generation to verify Ray models are working.

## Contributing

- Follow standard PR workflow: branch from `main`, push a PR, include tests, and add a runbook entry under `docs/` for any infra-impacting changes.

## Contact

For questions about Luma API credentials or Azure storage, contact the infra owner or see `docs/azure-sdk-integration-guide.md`.

---

Note: This README replaced an empty README.md and preserves prior manual edits that were present (none in the file). If you want a shorter README or additional sections (e.g., architecture diagrams, sequence diagrams for Luma flows), tell me which sections to expand.
