# Product Requirements Document (PRD)

**Project Name:** Premiere Pro UXP Panel – Image Gen, Metadata & Export Tools
**Owner:** Foundry / Gen-AI R&D  
**Date:** 2025-09-12  

---

## 1. Purpose (Why)

The project delivers a **Premiere Pro UXP panel** to streamline **image generation/correction, media import, metadata, and export workflows**.
- **Problem:** Creating consistent visuals from prompts, fixing artifacts, and assembling quick motion pieces requires multiple tools and manual steps.
- **Solution:** A unified panel that:
  - Calls **Adobe Firefly Image** API to generate images from prompts.
  - Sends selected images to **Gemini (Nano Banana)** for automated touch‑ups/corrections.
  - Stores intermediate/final assets in **Azure Blob Storage** via SAS.
  - Builds a short **first→last image consistency video**, then imports to Premiere, adds markers, and saves.
  - Manages metadata/markers and exports sequences with presets.

**Value Proposition:** One-click path from **prompt → corrected images → quick motion piece in Premiere**, with durable blob links and minimal friction.

**Non-Goals:**  
- Not a full creative suite for advanced animation or keyframing.  
- Not a long-term media archive (Blob used for interchange only).  
- Dubbing is **nice-to-have** for future, not MVP.

**Design Principles:**  
- **User-first:** seamless inside Premiere.  
- **Privacy-by-default:** temporary tokens (OAuth2 + SAS).  
- **Composable:** Firefly → Gemini → Video steps are modular.  
- **Accessible UI:** react-aria-components.  
- **Observable:** clear logs and markers for review.

---

## 2. Users (Who)

This panel is intended for **general Premiere Pro users** who need to streamline repetitive tasks such as:
- Importing and exporting media.
- Sending clips for automated dubbing/localization.
- Managing metadata and markers consistently.
- Leveraging cloud storage (Azure Blob) for large file interchange.

The use case is broad and not tied to specific personas; the panel is designed as a **proof of concept** to validate integration of dubbing, storage, and metadata workflows inside Premiere Pro.

---

## 3. Core Features & Functionality (What)

**Feature Group A: Import & Storage**  
- Import local **images/video/audio** into the Premiere project.  
- Upload generated and corrected assets to **Azure Blob** (SAS).  
- Download assets from Blob and auto-place into a target bin/sequence.  

**Feature Group B: Image Generation & Correction (MVP)**  
- **Firefly Image Generation:** prompt, style, aspect, seed.  
- **Looping preview workflow inside the UXP panel:**
  - Render results into a **scrollable gallery** (thumbnail grid + selectable detail pane).
  - **Log** each generation/correction (prompt, params, time, blob URL) for review.
  - **Adjust & iterate:** update prompt/params and **regen with Firefly**, or **branch** by sending the current image to **Gemini (Nano Banana)** for correction.
  - Persist accepted images to **Blob** (intermediates optional), maintain in‑session history for quick compare/undo.
- **Gemini (Nano Banana) Correction:** apply clean‑up (lines/color/perspective) to accepted/selected Firefly outputs.  
- Side‑by‑side compare and accept/retry; persist chosen versions to Blob.  

**Feature Group C: Consistency Video Builder (MVP)**: Consistency Video Builder (MVP)**  
- Select **first** and **last** images to create a short clip.  
- **MVP:** Hold → cross‑dissolve → hold with configurable durations.  
- Output rendered video sent to Blob, then imported to project/bin and (optionally) placed on active sequence at CTI.

**Feature Group D: Metadata & Markers (MVP)**  
- **Read and log** XMP metadata (no writes, no external sync).  
- Auto‑add markers to generated clip/sequence: `GEN_START`, `GEN_END`, `REVIEW`.  
- (Optional) View/edit basic project panel metadata columns **locally only**; changes are not persisted externally.

**Feature Group E: Export & Effects (MVP)**  
- Apply simple effect presets (e.g., Lumetri look).  
- **Export sequence to `.mp4`** with a defined preset; optional upload to Blob.  

**Feature Group F: Dubbing Service (Nice-to-Have, not part of MVP)**  
- Configure locales, lip‑sync toggle; send/poll jobs; import outputs.  

**Feature Group G: UI, Events & Logging (MVP)**  
- Accessible UI (react-aria-components).  
- **Generation Gallery:** grid + detail viewer, accept/retry controls, Firefly vs Gemini badges.  
- **Prompt Panel:** editable prompt/params with presets; “Regen (Firefly)” and “Send to Gemini” actions.  
- Event Manager reacts to project/sequence changes.  
- Logger shows API calls, parameters, statuses, and errors; includes blob links for each artifact.

---

## 4. Acceptance Criteria

- All generated/corrected assets must be **persisted to Blob storage** with associated IDs and metadata.  
- Users can **export final sequences to `.mp4`** reliably via defined presets.  
- Firefly → Gemini loop supports at least one regen + correction cycle per session, with preview gallery.  
- Consistency Video builder outputs a clip (hold–dissolve–hold) from first & last images and imports it into Premiere with auto-markers.  
- Metadata is read and logged only; markers (`GEN_START`, `GEN_END`, `REVIEW`) are applied automatically.  
- Logs clearly show API calls, statuses, and blob URLs.

---

