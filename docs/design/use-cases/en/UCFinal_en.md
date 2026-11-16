# Standardized 14 Core Use Case Specifications — Final Release

> **Project:** Museum Multilingual Smart Audio Guide System  
> **Course:** Software Engineering — Saigon University (SGU)  
> **Design References:** [AUDIT_V3.md](../../audit/AUDIT_V3.md), [v3_vs_v2_use_case_analysis.md](../v3_vs_v2_use_case_analysis.md), [Context.md](../../requirements/Context.md)  
> **Synchronized Source Code:** Web SPA (`frontend/`), Android App Offline-First (`mobile/`), REST API & MSSQL (`backend/`)

---

## System Actor Catalog

| Actor | Classification | Role & Operational Boundary Description |
| :--- | :--- | :--- |
| **Visitor** (`Visitor`) | Human Actor | General audience experiencing the museum via the Web SPA or Android App (`museum-audio-guide.apk`). **Requires zero account registration or credential authentication**. Permitted to search exhibits, scan QR codes, stream audio narration in 5 languages, view synchronized subtitles, view museum information, and manage personal favorite exhibits. |
| **System Administrator** (`Admin`) | Human Actor | Museum administrative and curatorial personnel. Authenticates via the `/admin/login` portal on the Web CMS. Granted comprehensive permissions to manage the artifact catalog, multilingual translations, floor maps, audio assets, visitor tour sessions, and inspect analytics telemetry. |
| **GPS Positioning System** (`GpsSystem`) | Sensor Actor | Device-embedded hardware GPS sensor and the runtime Geolocation API (`navigator.geolocation` / `expo-location`). Dispatches periodic coordinate readings `(latitude, longitude, accuracy)`. |
| **Audio System** (`AudioSystem`) | External System Actor | Audio delivery and rendering infrastructure: On Android, utilizes the operating system's native Audio Engine to play pre-packaged MP3 assets embedded within the APK bundle; on the Web, uses the HTML5 Web Audio API / static HTTP server streams with Web Speech API fallback. |

---

## Master Table of Contents: 14 Core Use Cases

- **Admin CMS Subsystem:**
  - [UC01: Admin Authentication](#uc01--admin-authentication)
  - [UC09: Manage Artifacts](#uc09--manage-artifacts)
  - [UC10: Manage Sessions & QR Codes](#uc10--manage-sessions--qr-codes)
  - [UC11: Manage Audio Files](#uc11--manage-audio-files)
  - [UC12: View Listening Analytics](#uc12--view-listening-analytics)
  - [UC13: Manage Floor Maps](#uc13--manage-floor-maps)
- **Visitor Subsystem (Web & Mobile App):**
  - [UC02: Scan QR Code](#uc02--scan-qr-code)
  - [UC03: Listen to Audio Guide](#uc03--listen-to-audio-guide)
  - [UC04: Switch Language](#uc04--switch-language)
  - [UC05: Save Favorite Artifacts](#uc05--save-favorite-artifacts)
  - [UC06: View Museum Information](#uc06--view-museum-information)
  - [UC07: View Synchronized Subtitles](#uc07--view-synchronized-subtitles)
  - [UC08: Search Artifacts](#uc08--search-artifacts)
  - [UC14: Geofencing & Auto Guide](#uc14--geofencing--auto-guide)

---

## Detailed Specifications of the 14 Use Cases

### UC01 — Admin Authentication
- **Identifier:** `UC01` | **Completion Level:** Focused
- **Actor:** System Administrator (`Admin`) | **Platform:** Web (`/admin/login`)
- **Brief Description:** Authenticates administrative identity using Email and Password to authorize access to the CMS Dashboard. Enforces two-tier brute-force lockout mitigation upon repeated failed attempts.
- **Preconditions:** Administrator is not currently logged in, or prior session token has expired.
- **Trigger:** Administrator navigates to `/admin/login`.
- **Main Success Scenario:**

| Actor Action | System Response |
| :--- | :--- |
| 1. Admin opens login view `/admin/login`. | 2. Frontend checks temporary lockout state in `localStorage` (`loginLock.ts`). If currently locked, displays a real-time countdown timer (E1). |
| 3. Admin enters Email (`admin@museum.vn`) and Password, then clicks "Sign In". | 4. Frontend dispatches authentication request `POST /api/auth/login`. |
| | 5. Backend validates account record: inspects `AdminUser.LockedUntil` and verifies password hash via `bcryptjs`. |
| | 6. Backend resets failure counter (`FailedAttempts = 0`) and issues a signed JWT Token with authorization privileges. |
| | 7. Frontend stores Token in `localStorage` and redirects user to Admin Dashboard. |

- **Exception Flows:**
  - **E1 (Invalid Credentials / Two-Tier Lockout):** If credentials do not match:
    - Backend increments `FailedAttempts`. If **5 consecutive failures** occur, Backend sets `AdminUser.LockedUntil = NOW + 1 minute` (`LOCK_MS = 60_000`) and returns HTTP `429 Too Many Requests`.
    - Simultaneously, Frontend records lockout state in `localStorage` (`admin_login_lock_v1`), disabling the form for **5 minutes** (`LOCK_DURATION_MS = 300_000`) and presenting an active countdown timer.
- **Postconditions:**
  - *Success:* Administrative session is established, and user enters the Dashboard.
  - *Failure:* Authentication rejected, error prompt shown, or form temporarily locked.
- **Source Code Mapping:** `frontend/src/shared/utils/loginLock.ts`, `backend/src/routes/auth.ts`, `backend/src/repositories/adminRepo.ts`.

---

### UC02 — Scan QR Code
- **Identifier:** `UC02` | **Completion Level:** Focused
- **Actor:** Visitor (`Visitor`) | **Platform:** Web (`html5-qrcode`) & Android (`expo-camera`)
- **Brief Description:** The visitor scans a physical QR code at an entrance gate or artifact placard using device camera. The system decodes the URL payload to present artifact details or initiate tracking.
- **Preconditions:** Device possesses an operational camera; camera permissions are granted (or manual entry fallback A1 is used).
- **Trigger:** Visitor taps the "Scan QR" button.
- **Main Success Scenario:**

| Actor Action | System Response |
| :--- | :--- |
| 1. Visitor taps "Scan QR". | 2. System verifies and requests Camera permissions (`expo-camera` on Android / `html5-qrcode` on Web). |
| 3. Visitor points camera at QR code. | 4. Viewfinder captures video frames and decodes payload string via `parseQrPayload()`. |
| | 5. **Case Artifact Payload** (`?artifact=<id|code>` or raw string):<br>- Sets origin tracking anchor (`anchorArtifactId = artifact.id`).<br>- Sets `hasScannedQr = true` and enables background geofencing.<br>- Opens artifact detail view and triggers audio narration (UC03). |
| | 6. **Case Entrance Gate Payload** (`?entry=gate`):<br>- Sets `hasScannedQr = true`.<br>- Activates automated GPS tracking (`startTracking(null)`). |

- **Alternative Flows:**
  - **A1 (Manual Code Entry):** If camera hardware is unavailable or permissions are denied, the system displays a text entry field (e.g., `WRM001`, `AIR-F5A`). Visitor enters the code and taps "Search" to navigate directly to the artifact.
- **Exception Flows:**
  - **E1 (Invalid QR Code):** Decoded payload matches no registered artifact or entrance gate. System presents an alert prompt and allows re-scanning.
- **Postconditions:**
  - *Success:* Exhibit recognized, origin anchor set, and narration triggered.
  - *Failure:* Error message displayed, viewfinder remains open for retry.
- **Source Code Mapping:** `frontend/src/shared/utils/qrHelper.ts`, `frontend/src/visitor/views/QRScannerModal.tsx`, `mobile/src/shared/utils/qrHelper.ts`, `mobile/app/scanner.tsx`.

---

### UC03 — Listen to Audio Guide
- **Identifier:** `UC03` | **Completion Level:** Focused
- **Actor:** Visitor (`Visitor`), Audio System (`AudioSystem`) | **Platform:** Web & Android
- **Brief Description:** Streams high-fidelity recorded audio narration in the visitor's active language. Supports full playback controls (Play, Pause, Seekbar, Variable Speed `1x–2x`), background playback when screen is turned off (Android), and synchronized karaoke subtitles (UC07).
- **Preconditions:** The artifact possesses recorded audio assets or interpretive narration text.
- **Trigger:** Visitor taps "Listen to Audio Guide", or system auto-triggers from UC02 / UC14.
- **Main Success Scenario:**

| Actor Action | System Response |
| :--- | :--- |
| 1. Visitor taps "Play" (or auto-triggered). | 2. System pauses any previously active audio streams to prevent acoustic overlap. |
| | 3. System identifies active language (`vi`, `en`, `zh`, `ko`, `ja`):<br>- **On Android App:** Loads pre-packaged MP3 assets directly from APK storage (`assetMap.ts`) and plays via `expo-audio` (supporting locked screen background play).<br>- **On Web SPA:** Streams audio over Web Audio API from `/uploads/audio/` (fallback to Web Speech TTS if audio files are missing). |
| 4. Visitor listens and adjusts playback: Pause/Resume, Scrub timeline, Change speed (`1x`, `1.25x`, `1.5x`, `2x`). | 5. System responds to controls in real time, synchronizing karaoke subtitle scroll progression (UC07). |
| | 6. Upon playback start, system asynchronously dispatches `POST /api/analytics/listen` to record telemetry (when online). |
| 7. Audio stream ends or visitor closes player bar. | 8. System halts playback and releases audio pipeline resources. |

- **Postconditions:**
  - *Success:* Audio narration streams completely, and listening telemetry is logged in database.
- **Source Code Mapping:** `frontend/src/shared/stores/playerStore.ts`, `frontend/src/visitor/components/AudioPlayerBar.tsx`, `mobile/src/shared/stores/playerStore.ts`, `mobile/src/shared/assetMap.ts`.

---

### UC04 — Switch Language
- **Identifier:** `UC04` | **Completion Level:** Focused
- **Actor:** Visitor (`Visitor`) | **Platform:** Web & Android
- **Brief Description:** Enables visitors to switch the interface and narration language across 5 supported languages (`vi`, `en`, `zh`, `ko`, `ja`) instantaneously without page reload (Zero Page Reload).
- **Preconditions:** None.
- **Trigger:** Visitor clicks the language selector icon on the header navigation bar.
- **Main Success Scenario:**

| Actor Action | System Response |
| :--- | :--- |
| 1. Visitor taps the language selector icon. | 2. System opens quick-selection modal showcasing 5 supported languages and national flags. |
| 3. Visitor selects target language (e.g., English). | 4. System updates reactive global store `langStore` and localization engine. |
| | 5. System persists preference to `localStorage` (Web) or `AsyncStorage` (Android). |
| | 6. All UI labels, artifact descriptions, audio asset links, and subtitles switch reactively without page reload. |

- **Postconditions:** Interface and media streams render in the newly selected language.
- **Source Code Mapping:** `frontend/src/shared/stores/langStore.ts`, `frontend/src/visitor/components/LanguageSwitcher.tsx`, `mobile/src/shared/stores/langStore.ts`.

---

### UC05 — Save Favorite Artifacts
- **Identifier:** `UC05` | **Completion Level:** Focused
- **Actor:** Visitor (`Visitor`) | **Platform:** Web & Android
- **Brief Description:** Allows visitors to bookmark remarkable artifacts into a personal favorites list for convenient review or re-listening. Data is stored strictly on the visitor's local device storage.
- **Preconditions:** Visitor is viewing the artifact catalog or an artifact detail view.
- **Trigger:** Visitor clicks the heart icon on an artifact card.
- **Main Success Scenario:**

| Actor Action | System Response |
| :--- | :--- |
| 1. Visitor taps the heart icon of an artifact. | 2. System checks bookmark status: If present, removes from favorites; if absent, appends to favorites list. |
| | 3. System persists array of artifact IDs into `localStorage` (`user_favorites`, Web) or `AsyncStorage` (Android). |
| | 4. Updates heart icon state to highlighted active color. |
| 5. Visitor navigates to the "Favorites" tab. | 6. System renders bookmarked exhibits. Automatically scans and cleans orphaned IDs if exhibits were removed by administrator (`cleanInvalidFavorites`). |

- **Postconditions:** Favorites list is updated accurately in local storage.
- **Source Code Mapping:** `frontend/src/visitor/views/FavoritesView.tsx`, `mobile/app/(tabs)/favorites.tsx`.

---

### UC06 — View Museum Information
- **Identifier:** `UC06` | **Completion Level:** Focused
- **Actor:** Visitor (`Visitor`) | **Platform:** Web & Android
- **Brief Description:** Displays an institutional profile of the museum: official title, address, operating hours, telephone hotline, and historical narrative in the active language.
- **Preconditions:** None.
- **Trigger:** Visitor taps the "Info" tab on the navigation bar.
- **Main Success Scenario:**

| Actor Action | System Response |
| :--- | :--- |
| 1. Visitor taps the "Info" navigation tab. | 2. System queries museum profile metadata from database (`GET /api/museum`) or local cache. |
| | 3. Displays promotional banner, museum title, address, visiting schedule, and historical narrative in the active language. |
| 4. Visitor taps the Hotline telephone number (on mobile). | 5. System launches device's native telephone dialer (`tel:xxxx`). |

- **Postconditions:** Visitor reviews institutional profile and contact channels.
- **Source Code Mapping:** `frontend/src/visitor/views/InfoView.tsx`, `mobile/app/(tabs)/info.tsx`.

---

### UC07 — View Synchronized Subtitles
- **Identifier:** `UC07` | **Completion Level:** Focused | **Relationship:** `<<extend>> UC03`
- **Actor:** Visitor (`Visitor`) | **Platform:** Web & Android
- **Brief Description:** Displays time-synchronized karaoke-style subtitles tracking spoken narration timestamps second-by-second. Visitors can tap any subtitle cue to seek audio playback directly to that timestamp.
- **Preconditions:** UC03 audio playback is active, and subtitle cue data (`SubtitleCue`) exists for the current artifact.
- **Trigger:** Visitor enables subtitle option (`showSubtitle = true`).
- **Main Success Scenario:**

| Actor Action | System Response |
| :--- | :--- |
| 1. Visitor enables "Subtitles" on the player bar. | 2. System matches active playback timestamp (`currentTime`) against cue list (`start <= currentTime <= end`). |
| | 3. Highlights active dialogue cue (karaoke visual effect) within the mini player and on the expanded transcript sheet. |
| 4. Visitor taps an arbitrary dialogue cue in transcript. | 5. System seeks audio playback (`seekToTime`) to starting offset (`cue.start`) of that phrase and continues streaming. |

- **Postconditions:** Subtitles display in high contrast, synchronized with audio progression.
- **Source Code Mapping:** `frontend/src/visitor/components/AudioPlayerBar.tsx`, `mobile/app/artifact/[id].tsx`.

---

### UC08 — Search Artifacts
- **Identifier:** `UC08` | **Completion Level:** Focused
- **Actor:** Visitor (`Visitor`) | **Platform:** Web & Android
- **Brief Description:** Enables rapid catalog searching via text keywords (matching artifact title, multilingual description, or codes like `WRM001`, `AIR-F5A`) combined with exhibition floor filters.
- **Preconditions:** None.
- **Trigger:** Visitor enters search characters into the search bar on the "Explore" tab.
- **Main Success Scenario:**

| Actor Action | System Response |
| :--- | :--- |
| 1. Visitor opens "Explore" tab and inputs search terms. | 2. System executes real-time filtering: performing diacritics-insensitive matching against titles, multilingual descriptions, or codes. |
| 3. Visitor may optionally select a Floor filter (e.g., Floor 1, Floor 2). | 4. System intersects keyword and floor filters to narrow results. |
| 5. Visitor selects an artifact card from results. | 6. System opens the corresponding artifact detail screen. |

- **Postconditions:** Matching exhibits are filtered and presented on screen.
- **Source Code Mapping:** `frontend/src/visitor/views/ExploreView.tsx`, `mobile/app/(tabs)/index.tsx`.

---

### UC09 — Manage Artifacts
- **Identifier:** `UC09` | **Completion Level:** Focused | **Relationship:** `<<include>> UC01`
- **Actor:** System Administrator (`Admin`) | **Platform:** Web (`/admin/artifacts`)
- **Brief Description:** Provides comprehensive CRUD operations for the museum exhibit catalog. Integrates automated translation across 5 languages and artifact thumbnail uploads (≤ 10MB).
- **Preconditions:** Administrator is authenticated (UC01).
- **Trigger:** Admin selects "Artifacts" navigation menu item.
- **Main Success Scenario:**

| Actor Action | System Response |
| :--- | :--- |
| 1. Admin navigates to `/admin/artifacts`. | 2. System retrieves and renders full exhibit catalog table (`GET /api/artifacts`). |
| 3. Admin clicks "Add Artifact" or "Edit". | 4. System displays artifact management modal form. |
| 5. Admin enters Vietnamese title and description, then clicks "Auto-Translate". | 6. System dispatches `POST /api/translate/batch` to Backend (Google Translate API + MyMemory fallback) and populates translations for `en`, `zh`, `ko`, `ja`. |
| 7. Admin uploads an exhibit photo (MIME image, ≤ 10MB). | 8. System dispatches `POST /api/uploads/image`, stores file to `/uploads/images/`, and returns asset URL. |
| 9. Admin clicks "Save". | 10. System dispatches `POST/PUT /api/artifacts/:id` persisting data to MSSQL and refreshes table. |

- **Exception Flows:**
  - **E1 (Image Exceeds Size Limit):** Image file exceeds 10MB. System rejects upload with an error alert.
- **Postconditions:** Artifact record is created or updated in database.
- **Source Code Mapping:** `frontend/src/admin/views/ArtifactManageView.tsx`, `backend/src/routes/museum.ts`, `backend/src/routes/translate.ts`, `backend/src/routes/uploads.ts`.

---

### UC10 — Manage Sessions & QR Codes
- **Identifier:** `UC10` | **Completion Level:** Focused | **Relationship:** `<<include>> UC01`
- **Actor:** System Administrator (`Admin`) | **Platform:** Web (`/admin/sessions`, `/admin/artifacts`)
- **Brief Description:** Monitors active devices and visitor sessions in real time via periodic Heartbeat signals, manages tour shift schedules, and exports high-resolution QR codes for physical printing.
- **Preconditions:** Administrator is authenticated (UC01).
- **Trigger:** Admin selects "Visitor Sessions" or "QR Management".
- **Main Success Scenario:**

| Actor Action | System Response |
| :--- | :--- |
| 1. Admin navigates to "Visitor Sessions". | 2. System queries active sessions (`GET /api/sessions/active`).<br>*(Web and mobile clients transmit `POST /api/sessions/heartbeat` every 10–15s; sessions silent for > 35s transition to offline).* |
| 3. Admin creates a new tour session (shift code, group title, expected headcount). | 4. System saves session entity to database. |
| 5. Admin opens QR Management tool, selects entrance gate or artifact list. | 6. System utilizes `qrcode` library to render high-resolution QR graphics, providing preview and PNG download for decal printing. |

- **Postconditions:** QR graphics generated; session statuses tracked in real time.
- **Source Code Mapping:** `frontend/src/admin/views/QRManageView.tsx`, `frontend/src/admin/views/SessionManageView.tsx`, `backend/src/routes/analytics.ts`.

---

### UC11 — Manage Audio Files
- **Identifier:** `UC11` | **Completion Level:** Focused | **Relationship:** `<<include>> UC01`
- **Actor:** System Administrator (`Admin`) | **Platform:** Web (`/admin/audio`)
- **Brief Description:** Enables uploading narration audio tracks (`.mp3`, `.wav` ≤ 30MB), auditioning recordings, and authoring time-coded karaoke subtitle cues (`SubtitleCue`).
- **Preconditions:** Administrator is authenticated (UC01); target artifact exists in catalog.
- **Trigger:** Admin selects "Audio Files" on navigation bar.
- **Main Success Scenario:**

| Actor Action | System Response |
| :--- | :--- |
| 1. Admin selects artifact and language for audio management. | 2. System displays current audio track metadata and embedded audition player. |
| 3. Admin chooses an audio file from local storage and clicks "Upload". | 4. Frontend validates MIME type and dispatches `POST /api/uploads/audio`. |
| | 5. Backend validates size limit: if **≤ 30MB**, saves to `/uploads/audio/` and updates `AudioUrl` in `ArtifactAudio`. |
| 6. Admin listens to audio and authors subtitle phrases with timestamps (`start`, `end`, `text`). | 7. System stores `SubtitleCue` entries in MSSQL. |

- **Exception Flows:**
  - **E1 (File Exceeds Limit):** Audio file exceeds 30MB. Backend rejects payload with HTTP `400` / Nginx responds with `413 Payload Too Large` (enforced via `client_max_body_size 35m`).
- **Postconditions:** Audio file and subtitle cues are persisted.
- **Source Code Mapping:** `frontend/src/admin/views/AudioManageView.tsx`, `backend/src/routes/uploads.ts`, `backend/src/repositories/museumRepo.ts`.

---

### UC12 — View Listening Analytics
- **Identifier:** `UC12` | **Completion Level:** Focused | **Relationship:** `<<include>> UC01`
- **Actor:** System Administrator (`Admin`) | **Platform:** Web (`/admin/analytics`)
- **Brief Description:** Delivers visual telemetry reports: total listening events, unique visitor counts, hourly/daily trend graphs, language distribution charts (Donut Chart), top-played exhibits (Bar Chart), and CSV export.
- **Preconditions:** Administrator is authenticated (UC01).
- **Trigger:** Admin navigates to `/admin/analytics`.
- **Main Success Scenario:**

| Actor Action | System Response |
| :--- | :--- |
| 1. Admin navigates to "Listening Analytics". | 2. System requests `GET /api/analytics/events` and `GET /api/analytics/summary`. |
| | 3. Displays KPI summary cards (Total Listens, Unique Visitors, Avg Duration) and renders interactive Recharts visualizations. |
| 4. Admin configures date range filters (Today, Last 7 Days, Last 30 Days). | 5. System re-computes metrics and updates charts dynamically. |
| 6. Admin clicks "Export CSV Report". | 7. System compiles telemetry data into a downloadable `.csv` file (UTF-8 BOM encoded) and saves it to client machine. |

- **Postconditions:** Administrator reviews engagement metrics and trends.
- **Source Code Mapping:** `frontend/src/admin/views/AnalyticsView.tsx`, `backend/src/routes/analytics.ts`, `backend/src/repositories/analyticsRepo.ts`.

---

### UC13 — Manage Floor Maps
- **Identifier:** `UC13` | **Completion Level:** Focused | **Relationship:** `<<include>> UC01`
- **Actor:** System Administrator (`Admin`) | **Platform:** Web (`/admin/maps`)
- **Brief Description:** Manages exhibition floor layouts: upload floor plan graphics, configure dimensions, and use an interactive drag-and-drop canvas to calibrate artifact normalized pixel coordinates `(x, y)` and GPS parameters.
- **Preconditions:** Administrator is authenticated (UC01).
- **Trigger:** Admin selects "Floor Maps" menu on CMS Dashboard.
- **Main Success Scenario:**

| Actor Action | System Response |
| :--- | :--- |
| 1. Admin selects a floor to configure (e.g., Floor 1 - Modern History). | 2. System renders floor plan graphic and drawer of unassigned floor exhibits. |
| 3. Admin may upload a new floor layout image (`PUT /api/floors/:id`). | 4. System saves floor plan image and updates map canvas. |
| 5. Admin drags artifact pin icons and drops them onto physical exhibit locations on the layout. | 6. System calculates normalized relative coordinates `(mapCoordinates.x, mapCoordinates.y)`. |
| 7. Admin edits GPS coordinates `(latitude, longitude)` and activation trigger radius (`triggerRadius`, default 15m). | 8. System saves coordinate assignments to MSSQL (`PUT /api/artifacts/:id`). |

- **Postconditions:** Floor layout and calibrated coordinates are persisted in database.
- **Source Code Mapping:** `frontend/src/admin/views/MapManageView.tsx`, `backend/src/routes/museum.ts`.

---

### UC14 — Geofencing & Auto Guide
- **Identifier:** `UC14` | **Completion Level:** Focused | **Relationship:** `<<extend>> UC03`
- **Actor:** Visitor (`Visitor`), GPS Positioning System (`GpsSystem`) | **Platform:** Web & Android
- **Brief Description:** Autonomously tracks visitor movement within the museum via Hybrid Geofencing: Utilizes a scanned QR code as an origin anchor point (`anchorArtifactId`) paired with high-accuracy GPS sensors. Calculates Haversine distances to surrounding exhibits, projects a "You are here" halo marker on the floor plan, and automatically triggers or prompts narration upon entering an exhibit's trigger radius (default **15 meters**) **without requiring repeated QR scans**.
- **Preconditions:** Visitor has scanned at least one QR code (origin anchor established); location permissions granted to device.
- **Trigger:** Automatically activated following a successful QR scan (UC02).
- **Main Success Scenario:**

| Actor Action | System Response |
| :--- | :--- |
| 1. Visitor moves through exhibition galleries after scanning an initial QR code (`hasScannedQr = true`). | 2. Location sensor transmits coordinates continuously `(lat, lng, accuracy)` via `watchPosition`. |
| | 3. System evaluates sensor precision: If `accuracy > 150m`, switches to `low-accuracy` state and suppresses auto-play (E2). |
| | 4. If `accuracy <= 150m`, system applies the **Haversine formula** to calculate distance to all exhibits with geographic coordinates. |
| | 5. Identifies closest exhibit satisfying `distance <= triggerRadius` (default **15 meters**). |
| | 6. Updates "You are here" halo indicator on active floor plan. |
| | 7. Evaluates intelligent playback trigger:<br>- **If another track is playing:** Displays "Switch Track" prompt with new exhibit title.<br>- **If track was already played in session:** Displays "Replay" prompt.<br>- **If unplayed and player idle:** Autonomously triggers audio guide (UC03). |

- **Exception Flows:**
  - **E1 (GPS Signal Lost / Permission Denied):** If GPS signal drops, system retains last QR anchor and falls back to map pixel distance calculation (`MAP_METERS_PER_PIXEL = 0.15` m/px) to suggest "Nearby Exhibits".
  - **E2 (Sensor Variance > 150m):** Transitions to `low-accuracy` state, pausing automated triggers to safeguard visitor listening continuity.
- **Postconditions:** Visitor receives continuous contextual narration throughout the museum tour without repetitive QR scans.
- **Source Code Mapping:** `frontend/src/shared/utils/geofence.ts`, `frontend/src/shared/stores/geofenceStore.ts`, `mobile/src/shared/utils/geofence.ts`, `mobile/src/shared/stores/geofenceStore.ts`.

---
*Specifications compiled in strict accordance with OMG UML 2.5 standards and 100% verified against production codebase.*
