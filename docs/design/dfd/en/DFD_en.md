# Data Flow Diagram (DFD) Specification

This documentation outlines the complete data movement model of the **Museum Multilingual Smart Audio Guide System** across its three core tiers: **Web SPA**, **Android App**, and **Backend MSSQL**.

---

## 1. DFD Level 0 — System Context Diagram ([DFD_Level0_en.puml](./DFD_Level0_en.puml))

Models the high-level boundary of the system and its operational interactions with external human and technological entities:
- **External Entities:**
  - **Visitor (`Visitor`):** Accesses interpretive guides via mobile web browser or the native Android app (requires no authentication).
  - **System Administrator (`Admin`):** Interacts via `/admin` on the Web CMS to curate exhibition content, manage tour sessions, and inspect analytics.
  - **GPS Positioning System (`GPS`):** Emits periodic physical coordinates `(latitude, longitude)` alongside precision variance metrics (`accuracy`).
  - **External Translation Services (`TranslateAPI`):** Google Translate API & MyMemory API facilitating automated machine translation into 5 languages.
- **Central System Process:**
  - `0`: Museum Multilingual Smart Audio Guide System.

---

## 2. DFD Level 1 — Functional Decomposition Diagram ([DFD_Level1_en.puml](./DFD_Level1_en.puml))

Decomposes the system into 6 core business processes interacting with 5 persistent data stores:

| Process ID | Process Title | Associated Use Cases | Data Movement Description |
| :--- | :--- | :--- | :--- |
| **1.0** | Admin Authentication Management | UC01 | Ingests administrative email and password, validates cryptographic bcrypt hash against `AdminUser` (`D1`), triggers brute-force lockout when failures reach $\ge 5$ (1 min in backend, 5 mins in frontend), and issues signed JWT tokens. |
| **2.0** | Exploration, QR Scan & Geofencing Tracking | UC02, UC06, UC08, UC14 | Retrieves museum, artifact, and floor metadata from `D2`; decodes QR payloads (`?artifact=`, `?entry=gate`, or raw codes); computes real-time Haversine spherical distance from GPS coordinates; projects active position halo on interactive floor maps. |
| **3.0** | Audio Narration, Subtitles & Localization | UC03, UC04, UC07 | Reads visitor's active language selection (`vi/en/zh/ko/ja`); retrieves audio streams (`D3`: bundled inside APK or served via `/uploads`) alongside `SubtitleCue` timeline records; streams synchronized audio and karaoke subtitles; dispatches `ListenEvent` telemetry to process `6.0`. |
| **4.0** | Local Favorites Management | UC05 | Reads and writes bookmarked artifact identifiers exclusively within client-side local storage (`localStorage` on Web, `AsyncStorage` on Android), guaranteeing privacy without user accounts. |
| **5.0** | Catalog, Floor Map, Audio & Translation Admin | UC09, UC11, UC13 | Facilitates administrative CRUD operations for artifacts, interactive drag-and-drop coordinate calibration `(X, Y)` on floor plan canvases, audio file uploads (≤ 30MB) and image uploads (≤ 10MB), and calls automated machine translation APIs. |
| **6.0** | Session Tracking, QR Gen & Listening Telemetry | UC10, UC12 | Collects periodic visitor session heartbeats (every `10–15s`), records `VisitorSession` and `ListenEvent` into MSSQL (`D5`), aggregates analytical metrics into visual Recharts diagrams and CSV exports, and renders high-resolution QR graphics for entrance gates and artifacts. |

---

## 3. DFD Level 2 — Geofencing Positioning & Narration Sub-Processes ([DFD_Level2_Geofence_en.puml](./DFD_Level2_Geofence_en.puml))

Provides a granular decomposition of processes **2.0** and **3.0** into four sequential sub-processes (`2.1` → `2.2` → `2.3` → `3.1`), directly reflecting the production logic in `geofence.ts`, `qrHelper.ts`, `VisitorLayout.tsx` (Web), and `MuseumDataContext.tsx` (Mobile):

1. **2.1 (Decode QR Payload & Initialize Origin Anchor):** Decodes raw camera video frames or processes manual numeric input; establishes `hasScannedQr = true` and saves `anchorArtifactId` in session state (`D4`).
2. **2.2 (Compute Haversine Distance & Filter Sensor Noise):** Validates incoming GPS sensor frames. Discards or suppresses low-precision readings where `accuracy > 150m`; applies the Haversine spherical trigonometric formula against floor exhibit coordinates (`D2`) to compile a sorted proximity list.
3. **2.3 (Evaluate Proximity Trigger or Switch/Replay Prompt):** Compares user proximity against the exhibit's activation perimeter (`distance <= triggerRadius`, default **15m**). If an alternate track is actively playing, displays a "Switch" prompt; if the exhibit was already completed during the session, displays a "Replay" prompt; otherwise, automatically initiates playback.
4. **3.1 (Load Audio & Subtitles):** Streams audio corresponding to the selected language, scrolls time-aligned karaoke subtitle cues second-by-second, and dispatches a persistent `ListenEvent` to database telemetry (`D5`).
