# Technical Requirements Document (TRD)

**Project Name:** Premiere Pro UXP Panel – Image Gen, Metadata & Export Tools\
**Date:** 2025-09-12\
**Based on:** [PRD Canvas]

---

## 1. Introduction & Goals

**Technical Goals:**

- Provide an end-to-end pipeline for **Firefly Image Generation → Gemini Correction → Blob Storage → Consistency Video → Premiere Import**.
- Enable iterative preview of Firefly/Gemini outputs inside the UXP panel.
- Ensure all generated/corrected assets are persisted via **Azure Blob Storage** with SAS tokens.
- Import generated video/images into Premiere with markers and metadata logs.
- Export final sequence as `.mp4`.

**Non-Goals:**

- No direct sync with AEM/Frame.io.
- No advanced keyframe animation beyond dissolve-based MVP.
- No dubbing in MVP (future nice-to-have).

---

## 2. Architecture & Key Components

**High-Level Architecture:**

```
[UXP Panel UI]
   ├── React + Vite frontend (react-aria-components + React Spectrum)
   ├── Gallery/Prompt Panel (looping image gen)
   ├── Logging + Event Manager
   │
   ▼
[Services Layer]
   ├── Firefly Service API (Image Gen)
   ├── Gemini Nano Banana API (Correction)
   ├── Video Gen Module (first+last → dissolve video)
   ├── Azure Blob Storage (upload/download)
   └── Premiere Pro API (markers, metadata, import/export)
```

**Key Components:**

- **UI Layer:** React components with React Spectrum design system for consistent Adobe styling.
- **Service Adapters:** Axios clients for Firefly, Gemini, Blob, and video gen.
- **State Management:** Zustand for in-panel state, including iteration history.
- **Storage:** Azure Blob SDK integration via SAS URLs.
- **PPro Integration:** UXP Premiere APIs for project import, sequence placement, marker creation.

---

## 3. Data Models & Persistence

### 3.1 ID Strategy

- **UUIDv4** generated **client-side** for every artifact (`imageId`, `videoId`, `iterationId`, `sessionId`).
- IDs are **not** minted by Blob. The panel creates them and reuses the same IDs across:
  - In‑panel state (Zustand)
  - Blob object names
  - Optional manifest index JSON

### 3.2 In‑Panel State (Zustand)

- `generationHistory[]`: `{ id: uuid, prompt, params, service: 'Firefly'|'Gemini', blobUrl, timestamp }`
- `currentSelection`: reference to accepted image/video by `id`.
- **Persistence:**
  - **Primary:** in‑memory (cleared on panel reload).
  - **Session restore (optional):** `localStorage` keys:
    - `uxp.session.id` → current session UUID
    - `uxp.history.<sessionId>` → compact JSON array of last N (e.g., 20) history items
  - **No DB** in MVP.

### 3.3 Blob Storage Objects (Authoritative Artifacts)

- Containers/folders (example):
  - `images/{imageId}.png`
  - `videos/{videoId}.mp4`
  - `logs/{sessionId}.json` (optional exported panel log)
  - `manifests/{sessionId}.json` (optional index of all artifacts for that session)
- **Per‑blob metadata** (HTTP headers / tags):
  - `x-meta-prompt`, `x-meta-params`, `x-meta-service`, `x-meta-timestamp`
  - These duplicate minimal context so each blob is self‑describing.
- **Where are IDs stored?**
  - Inside the **object name** (e.g., `{imageId}.png`) and in **blob metadata**.
  - Optionally listed in `manifests/{sessionId}.json` → authoritative lookup of all artifacts produced in that session.

### 3.4 Manifest Index (Optional but Recommended)

- Schema (per session):
  ```json
  {
    "sessionId": "<uuid>",
    "createdAt": "2025-09-12T19:00:00Z",
    "items": [
      { "id": "<uuid>", "type": "image", "service": "Firefly", "blobPath": "images/<uuid>.png", "prompt": "...", "params": {"style":"...","aspect":"...","seed":123}, "timestamp": "..." },
      { "id": "<uuid>", "type": "image", "service": "Gemini",  "blobPath": "images/<uuid>.png", "sourceId": "<fireflyUuid>", "ops": ["lines","color"], "timestamp": "..." },
      { "id": "<uuid>", "type": "video", "blobPath": "videos/<uuid>.mp4", "firstImageId": "<uuid>", "lastImageId": "<uuid>", "durationMs": 4000, "timestamp": "..." }
    ]
  }
  ```
- **Location:** `manifests/{sessionId}.json` in the same Blob container.
- **Purpose:** quick re‑hydration of a session, auditability, and sharing.

### 3.5 Local Log (Read‑Only)

- **XMP metadata** is **read from Premiere** and **logged only** (no writeback to assets).
- Panel log entries (API calls, prompts, params, blob URLs) live in memory; user can **export** to `logs/{sessionId}.json` on demand.

---

## 4. API & Interface Contracts

**Firefly Image Generation**

- **Endpoint:** `POST {FIREFLY_URL}/v3/images/generate`
- **Headers:** `Authorization: Bearer {token}`, `x-api-key: {client_id}`
- **Request:** 
  ```json
  {
    "prompt": "string",
    "contentClass": "photo|art",
    "style": { "id": "string" },
    "size": { "width": 1024, "height": 1024 },
    "seeds": [0],
    "numVariations": 1
  }
  ```
- **Response:** 
  ```json
  {
    "outputs": [
      { "image": { "url": "string" }, "seed": 0 }
    ]
  }
  ```

**Gemini Nano Banana Correction**

- **Endpoint:** `POST {GEMINI_URL}/v1/image/correct`
- **Headers:** `Authorization: Bearer {token}`
- **Request:** 
  ```json
  {
    "imageUrl": "string",
    "operations": ["line_cleanup", "color_correction", "perspective_adjustment"],
    "intensity": 0.8
  }
  ```
- **Response:** 
  ```json
  {
    "correctedImageUrl": "string",
    "jobId": "string",
    "status": "completed|processing|failed"
  }
  ```

**Azure Blob Upload**

- **Local Development:** `PUT http://127.0.0.1:10000/devstoreaccount1/uxp-assets/{blobName}{sas}`
- **Production:** `PUT https://{account}.blob.core.windows.net/{container}/{blobName}{sas}`
- **Headers:** `x-ms-blob-type: BlockBlob`, `Content-Type: image/png|video/mp4`
- **Response:** `201 Created` with ETag header
- **Environment Detection:** Use `NODE_ENV` to switch between local/production endpoints automatically

**Video Gen (First/Last)**

- **Function:** `generateConsistencyVideo(firstImageUrl, lastImageUrl, duration)`
- **Parameters:** 
  ```typescript
  {
    firstImageUrl: string;
    lastImageUrl: string;
    duration: number; // milliseconds
    transition: 'crossfade' | 'dissolve';
    frameRate: 24 | 30;
  }
  ```
- **Output:** `.mp4` uploaded to Blob, return blob URL and metadata

**Premiere Pro Import**

- **Function:** `app.project.importFiles([blobUrl])`
- **Markers:** `sequence.markers.createMarker(time, { name, comment, type })`
- **Export:** `sequence.exportAsMediaDirect(outputPath, presetPath, workAreaType)`

---

## 5. Security & Privacy

- **Authentication:** OAuth2 server-to-server for Firefly/Gemini APIs; SAS tokens for Azure Blob access.
- **Data Encryption:** HTTPS/TLS 1.3 for all API calls; SAS tokens scoped to specific containers with time limits.
- **Privacy:** No persistent user data storage; logs exist only in-panel memory unless explicitly exported.
- **Secrets Management:** No client secrets embedded in UXP panel; all credentials managed server-side with environment variables.
- **Token Security:** Access tokens expire in 60 minutes; SAS tokens expire in 24 hours; automatic refresh before expiry.
- **File Size Limits:** Maximum 50MB per file upload to prevent abuse.
- **Rate Limiting:** Respect API rate limits with exponential backoff retry logic.
- **CORS:** Proper CORS configuration for cross-origin requests from UXP panel.

---

## 6. Deliverables

- UXP panel (React + Vite build) packaged with manifest.
- Service adapters: Firefly, Gemini, Video Gen, Blob, PPro API.
- Zustand state manager with generation loop and gallery.
- React Spectrum component library with Adobe-consistent styling.
- `.mp4` export pipeline with configurable presets.
- Authentication server for IMS OAuth server-to-server flow.
- Azure cloud storage for asset management.
- Documentation: API contracts, setup guide, and usage.
- Optional: JSON log export for metadata/session history.

---

## 6.1. Azure Cloud Storage

**Azure Blob Storage Integration:**
- **Production Ready:** Uses Azure cloud storage directly
- **Secure Authentication:** Integration with Azure credentials
- **Scalable Storage:** No local storage limitations
- **Global Access:** Assets available from anywhere
- **Enterprise Grade:** Azure's security and compliance standards

---

## 7. Environments & IMS Integration

**IMS Project**

- **Project ID:** `4566206088345504249`
- **Project Name:** `992GreenNewt`
- **Title:** `UXP PoC`
- **Org:** `Firefly Enterprise Solution Acceleration` (`C4FD1DB5673E3AC50A495FAE@AdobeOrg`)

**Workspace (Production)**

- **action\_url:** `https://3488278-992greennewt.adobeioruntime.net`
- **app\_url:** `https://3488278-992greennewt.adobeio-static.net`

**Credentials (Server-to-Server OAuth)**

- **Integration Name:** `UXP_PoC_09_12_25_Auth`
- **Type:** `oauth_server_to_server`
- **Client ID:** `f39e1cd1c58f498990859085569....` *(store securely)*
- **Client Secret(s):** `p8e-bf0CXOMon9eqnljeCtoxG-....` *(store securely)*
- **Tech Account:** `b264b930-b8d1-4ce1-ae0b-8fcc420a9735@techacct.adobe.com` / `448622E368C43C160A495FDD@techacct.adobe.com`
- **Scopes:** `openid`, `AdobeID`, `ff_apis`, `firefly_api`, `firefly_enterprise`

**Services Enabled**

- `Firefly API - Firefly Services` (GA)
- `Audio & Video API - Firefly Services`
- `Audio-Video-API (Public Beta) - Firefly Services`

**Token Flow (Server-side only)**

- Obtain **access tokens** on the **local server** using the IMS **server-to-server** integration.
- The UXP panel never stores or sends client secrets. It calls your server, which exchanges for a token scoped to the services above, then returns **short‑lived tokens** or **signed action URLs** as needed.

**Environment Variables (server)**

```bash
# Adobe IMS OAuth Configuration
ADOBE_IMS_CLIENT_ID=f39e1cd1c58f498990859085569....
ADOBE_IMS_CLIENT_SECRET=p8e-bf0CXOMon9eqnljeCtoxG-....
ADOBE_IMS_ORG_ID=C4FD1DB5673E3AC50A495FAE@AdobeOrg
ADOBE_IMS_SCOPES="openid,AdobeID,ff_apis,firefly_api,firefly_enterprise"

# Adobe I/O Runtime URLs
APP_ACTION_URL=https://3488278-992greennewt.adobeioruntime.net
APP_STATIC_URL=https://3488278-992greennewt.adobeio-static.net

# Azure Blob Storage Configuration
# For production (Azure Cloud)
NODE_ENV=production
BLOB_ACCOUNT=your-storage-account
BLOB_CONTAINER=uxp-assets
BLOB_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=your-storage-account;AccountKey=...;EndpointSuffix=core.windows.net
BLOB_SAS_EXPIRY_HOURS=24

# API Endpoints
FIREFLY_API_URL=https://firefly-api.adobe.io
GEMINI_API_URL=https://gemini-api.example.com

# Security
TOKEN_EXPIRY_MINUTES=60
MAX_FILE_SIZE_MB=50
```

**UXP Manifest Network Domains (add)**

```json
{
  "permissions": {
    "network": {
      "domains": [
        "https://3488278-992greennewt.adobeioruntime.net",
        "https://3488278-992greennewt.adobeio-static.net",
        "https://*.blob.core.windows.net"
      ]
    },
    "allowCodeGenerationFromStrings": true,
    "launchProcess": {
      "schemes": ["https", "http"],
      "extensions": [".html"]
    }
  }
}
```

**Azure Cloud Setup**

```bash
# Create Azure Storage Account (if not exists)
az storage account create \
  --name your-storage-account \
  --resource-group your-resource-group \
  --location eastus \
  --sku Standard_LRS

# Create container for production
az storage container create \
  --name uxp-assets \
  --account-name your-storage-account
```

**Security Notes**

- Secrets live **only on the server**; panel receives tokens or pre‑signed URLs (SAS for Blob) with least privilege & short TTL.
- Rotate client secrets regularly; log token issuance for audit.

---

## 8. UI Components & Controls

### Design System & Styling

**React Spectrum Integration**
- **Design System:** Adobe's React Spectrum for consistent Adobe product styling
- **Theme:** Spectrum dark theme for UXP panel integration
- **Typography:** Spectrum font stack and sizing scales
- **Color Palette:** Spectrum semantic colors (background, content, accent, negative, etc.)
- **Spacing:** Spectrum dimension tokens for consistent layout
- **Icons:** Spectrum workflow icons for UI actions

**Component Library Stack**
- **Base Components:** `react-aria-components` for accessible primitives
- **Styled Components:** `@adobe/react-spectrum` for visual design
- **Custom Components:** Panel-specific components extending Spectrum patterns

UI Components & Controls

### Buttons / Actions

- **Connect / Authenticate**
  - Connect Firefly (OAuth)
  - Connect Gemini (OAuth)
  - Get SAS Token (for Blob)
- **Image Generation Loop**
  - Generate (Firefly)
  - Regen (Firefly) (with updated prompt/params)
  - Send to Gemini (correction)
  - Accept Image
  - Reject / Retry
- **Gallery Controls**
  - Next / Previous (cycle through history)
  - Clear History (reset state)
  - Export Log (save session log to blob/local JSON)
- **Video Generation**
  - Build Consistency Video (from first+last images)
- **Premiere Integration**
  - Import to Project
  - Add Markers (GEN\_START, GEN\_END, REVIEW)
  - Export Sequence (.mp4)
- **UI/Session**
  - Settings (aspect ratio, style presets, duration)
  - Help / Info
  - Logout

### react-aria-components + React Spectrum

**Core Components**
- **TextField** → Prompt input, style params, seed (Spectrum styled)
- **Select / ComboBox** → Aspect ratio, style presets, duration options
- **NumberField** → Seed value, dissolve duration
- **Button** → All core actions with Spectrum variants (primary, secondary, accent)
- **ActionButton** → Icon-only actions (next/prev, clear, export)
- **ToggleButton / Switch** → Auto-markers, dark/light mode toggle
- **Tabs** → Switch between Image Gen, Video Gen, Metadata Log views
- **Dialog / Modal** → Preview corrected image, confirm export actions
- **Grid / ListView** → Thumbnail gallery of generations with Spectrum styling
- **ProgressBar / ProgressCircle** → API call/loading states
- **Toast** → Success/failure notifications with Spectrum alerts
- **CheckboxGroup** → Gemini correction operations (lines, color, perspective)

**Layout Components**
- **View** → Main container with Spectrum padding and background
- **Flex** → Responsive layouts for gallery and controls
- **Grid** → Structured layouts for form controls and thumbnails
- **Divider** → Visual separation between panel sections
- **Header** → Panel title and connection status
- **Content** → Main workspace area with scrolling

**Spectrum Theme Integration**
- **Provider** → Spectrum theme provider wrapping the entire panel
- **Color Scheme** → Dark theme matching Premiere Pro interface
- **Responsive** → Spectrum breakpoints for panel resizing
- **Focus Management** → Spectrum focus ring styling for accessibility

