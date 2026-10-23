# Context Data: Hệ Thống Du Lịch Ẩm Thực Quận 4

## 1. Project Overview & Key Statistics
*   **Project Name:** Hệ Thống Du Lịch Ẩm Thực Quận 4 (District 4 Culinary Tourism System).
*   **Core Description:** A full-stack Progressive Web App (PWA) featuring an interactive map, multi-language audio guides, and offline-first capabilities for exploring street food in District 4, HCMC.
*   **Core Technologies:** FastAPI, MongoDB, React 19.2, Vite 7 PWA, MapLibre, PMTiles, Edge-TTS (Microsoft), Gemini 2.5 Flash / ProxyPal.
*   **System Statistics:**
    *   Mounted FastAPI Routers: 10
    *   Admin + Owner APIs: 52 (40 admin + 12 owner)
    *   RBAC Permissions: 32
    *   Audio Tiers: 4
    *   Content Fallback Layers: 3
    *   Offline Defense Layers: 4
    *   Map Modes: 3
    *   Open-Source Core Cost: $0

## 2. System Architecture (Chapter 00)
*   **Runtime Backend:** Currently mounts 10 router lanes sharing MongoDB, Redis, and static/runtime storage, with distinct boundaries.
*   **Modules:**
    *   `content`: Handles POI CRUD, delta sync, localization hydration, activation gate.
    *   `audio`: Edge-TTS, GoogleTranslator, task manager, voices, pack manifest.
    *   `admin` + `owner`: Cookie auth, RBAC, owner review, notifications, PII encryption.
    *   `analytics`: Consent-gated collect API, Redis presence, Mongo read models.
    *   `ai_advisor`: Gemini 2.5 Flash / ProxyPal, quota 10/day for owners, provider-aware errors.
    *   `localization`: On-demand translation, hotset, warmup, public-English readiness gate.
    *   `ui_i18n`: UI bundles, source_hash, pending/ready payload, long-tail Machine Translation (MT).
    *   `maps`: Static-first manifest, PMTiles, glyphs, sprites, path guard.
    *   `runtime_observability`: Public location ingest (separate from analytics), rate limits, admin observation window.
*   **MongoDB Collections:**
    *   `POI`: Original POI data (Vietnamese), images, coordinates, `trigger_radius`.
    *   `poi_localizations`: Translations and audio URLs by (poi_id, lang).
    *   `audio_tasks`: Snapshot/control state for audio tasks, recovery, heartbeat, TTL.
    *   `content_dataset_versions`: Version tokens for `/poi/load-all`, ETag, delta sync cursor.
    *   `admin_users`: Admin/owner accounts, hashed passwords, roles, verification status, encrypted PII.
    *   `roles`: Dynamic roles and permission arrays (4 default roles).
    *   `audit_logs`: Action logs (action, user_id, resource, timestamp).
    *   `poi_owner_registrations`: Owner applications (pending/approved/rejected) with admin notes.
    *   `poi_submissions`: Pending POI creations/updates from owners.
    *   `owner_notifications`: Review notifications for owners (read/unread status).
    *   `ai_usage_limits`: Daily AI rate limits ({user_id, date, count}).
    *   `analytics_*`: Devices, sessions, events, hourly/daily metrics, jobs, read models.
    *   `localization_rate_limits`: Shared-state rate limits for on-demand translation/TTS.
    *   `ui_translation_bundles`: UI caches by `namespace + locale + source_hash` (pending/ready status).
    *   `runtime_location_hourly`: Read models for runtime locations (separated from consent lane).
    *   `MenuItem`: Menu items associated with POIs.

## 3. Startup Flow (Chapter 01–02)
*   **Backend Startup Sequence:**
    *   *Tier 1 (Security Guard):* Validates `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `SECRET_KEY`, and `SUPERADMIN_BOOTSTRAP_MODE`. Fails fast if invalid.
    *   *Tier 2 (DB/Cache/Media):* `connect_db()` -> `assert_transaction_capability()` -> optional S3 health check.
    *   *Tier 3 (Seeding):* Ensures roles, super admin, and runtime storage.
    *   *Tier 4 (Recovery & Workers):* Refresh transactions, recover audio tasks, start observability indexes, boot analytics and media cleanup workers.
    *   *Tier 5:* Mounts the 10 routers, `/static`, and health checks.
*   **Frontend Startup Flow:**
    *   SW Register -> React Router -> Splash Screen -> Language Selection -> Parallel Load.
    *   *Best-Effort Locate:* Uses cached GPS if good (15s budget, 30s cache age, 100m accuracy).
    *   *Offline Snapshot:* Loads `getOfflinePOIs(lang)` and UI bundles from IndexedDB for zero-latency render.
    *   *Delta Sync Content:* `loadAllPOIs(lang)` uses `ETag`, `dataset_version`, and `updated_after`.
    *   *Hotset Readiness:* Prepares up to 10 POIs within 1.5km. Requires 3 mandatory POIs cached before proceeding.
    *   *UI Bundle + Warmup:* Quick-starts with English if needed while background fetching completes. Startup probe tests network with 2.5s timeout.

## 4. GPS, Geofence & Audio (Chapter 04)
*   **Geofence 4-Stage Processing:**
    *   *Stage 1 (GPS Collection):* `watchPosition()` throttled to 5s.
    *   *Stage 2 (Zone Detection):* `turf.distance()` checks radius (default 30m). Triggers 5-minute cooldown on exit.
    *   *Stage 3 (Audio Decision):* 5s safety reconcile loop. Confirms ENTER after 3s debounce. Sorts by `audio_priority` then distance.
    *   *Stage 4 (Playback):* NarrationEngine uses AudioQueueManager.
*   **4-Tier Hybrid Audio Strategy:**
    *   *Tier 1 (Pre-generated):* 0ms latency. Service Worker CacheFirst.
    *   *Tier 1.5 (On-demand):* 2-5s latency. Translates + Edge-TTS on the fly, saves, returns new URL.
    *   *Tier 2 (Cloud TTS Stream):* 3-8s latency. Edge-TTS streams direct MP3, caches to disk.
    *   *Tier 3 (Local Speech Synthesis):* 0ms latency. `window.speechSynthesis` offline fallback.
*   **Background Prefetch:** Scans for fallback POIs within 500m, queues 3 at a time, drains sequentially. Handles 429 errors with exponential backoff.

## 5. Content & POI Lifecycle (Chapter 05)
*   **Core APIs:**
    *   `GET /poi/load-all`: Heavy API. Supports delta sync. Active public lane only returns English-ready POIs.
    *   `GET /poi/nearby`: Uses `$geoNear` or Haversine fallback. Used for hotset.
    *   `Create/Update POI`: Saves text, queues audio for 5 priority languages. Temporarily deactivates POI if description changes until audio processing finishes.
    *   `Delete`: Uses transactions, cascades to localizations, queues media cleanup.
*   **Cache Busting:** Backend appends `?v={updated_at}&l={lang}` to `audio_url` to shard SW cache by language.
*   **3-Tier Content Fallback:**
    *   *Tier 1:* Requested Language (Translation & Audio exist).
    *   *Tier 2:* English Fallback (For international users, UI indicates fallback).
    *   *Tier 3:* Original Vietnamese (Audio = null, forces frontend to use on-demand or local TTS).

## 6. Audio/TTS Module (Chapter 06)
*   **TTSService:** Uses `deep-translator` (free) and `Edge-TTS` (free). Caches via `MD5(text:lang)`. 5 preferred neural voices (vi, en, zh, ja, ko).
*   **AudioTaskManager:** Parallel generation using Semaphore (max=3). Provides real-time SSE stream for Admin UI.
*   **Pack Manifest:** `GET /audio/pack-manifest` hashes all MP3s for a language to support offline bundling.

## 7. Authentication & RBAC (Chapter 07)
*   **Security Mechanism:** httpOnly cookies (access_token: 30m, refresh_token: 7d, SameSite=Lax, Secure).
*   **RBAC Matrix:** 32 permissions across 9 domains (poi, menu, user, role, analytics, audit, system, owner, content).
*   **Default Roles:**
    *   `super_admin` (Priority 0): All 32 permissions.
    *   `admin` (Priority 1): POI/Menu/User, Analytics, Audit, Content.
    *   `poi_owner` (Priority 10): Read POI, manage own POI, submit POI, view own analytics. Requires `is_poi_owner_verified = true` to pass the owner gate.
    *   `user` (Priority 100): Read POI/Menu, register as owner.
*   **PII Encryption:** Owner ID cards encrypted via Fernet (`v1:...`). Auto-redacted after 180 days.

## 8. Localization & UI Bundles (Chapter 08)
*   **Dual-Lane Architecture:** Language switching only completes when both Content and UI are ready.
    *   *Lane 1 (Content):* Hydrates `poi_localizations`. Includes `prepare-hotset` (nearby POIs) and background `warmup` for the full corpus.
    *   *Lane 2 (UI Bundles):* Serves 5 top-level locales statically. Long-tail locales return pending English fallback while MT translates in the background.

## 9. Offline & PWA (Chapter 09)
*   **4 Layers of Defense:**
    *   *Layer 1 (SW Strategies):* NetworkFirst for POI data (8s timeout), CacheFirst for Audio/Images.
    *   *Layer 2 (Sharding):* Audio cached by language (Max 3 languages, 300 files/lang, LRU eviction). `APP_BUILD_SYNC` cleans old chunks.
    *   *Layer 3 (IndexedDB):* `Quan4DB v2` stores `pois_by_lang` and UI bundles to prevent blank screens.
    *   *Layer 4 (Offline Packs):* Explicit language bundles (Map -> POI -> Images -> Audio) with SHA-256 verification.
*   **Quota Handling:** If disk is full, Workbox purges runtime audio/image caches to prioritize Offline Packs.

## 10. Map Pack & PMTiles (Chapter 10)
*   **Architecture:** Static-first (`/static/maps/*`) with `/api/v1/maps/*` compatibility layer.
*   **3 Modes:**
    *   *Cloud:* Project-owned style, cloud data.
    *   *Offline Pack:* Local PMTiles + self-hosted styles/glyphs.
    *   *Hybrid Q4:* Cloud-first, falls back to local pack if network drops.
*   **Security:** `resolve_safe_path()` strictly prevents Path Traversal attacks on map assets.

## 11. Admin, Owner Portal & AI (Chapter 11)
*   **Owner Portal:** Public registration -> Admin approval -> Verified status. Owners can only edit their own POIs via pending submissions.
*   **Admin Dashboard:** 52 total routes. Manages CRUD, approvals, audit logs, analytics, and SSE audio tasks.
*   **AI Advisor (Gemini 2.5 Flash):**
    *   *Function:* Enhances descriptions (adds positive adjectives, 200-300 words, strict "no hallucination" prompt).
    *   *Limits:* 10 requests/day for owners, unlimited for admins. 30s timeout.

## 12. Design Patterns & Industry References
*   **Modular Monolith:** 9 domain backends + 10 routers on a shared runtime.
*   **4-Tier Hybrid Audio:** Pre-gen -> On-demand -> Cloud TTS -> Local TTS.
*   **3-Tier Content Fallback:** Target lang -> English -> Vietnamese.
*   **Dual-Lane i18n:** Content locale and UI bundle independent warming.
*   **Language Sharding:** SW cache partitioned by language with active pinning.
*   **Geofence Reconciliation:** 5s safety, 3s debounce, 5m cooldown.
*   **Consent-Gated Analytics:** Strict privacy-by-design pipeline.
*   **PII Encryption at Rest:** GDPR-style 180-day data minimization.

## 13. Key System Constants (Critical for Logic)
*   `ACCESS_TOKEN_EXPIRE`: 30 mins
*   `REFRESH_TOKEN_EXPIRE`: 7 days
*   `MAX_CONCURRENT_TTS`: 3 (Semaphore)
*   `PII_RETENTION_DAYS`: 180 days
*   `ON_DEMAND_RATE_LIMIT`: 30 req / 10 mins
*   `HOTSET_MAX_POI_IDS`: 10 (needs 3 to clear cache gate)
*   `OWNER_DAILY_LIMIT`: 10 (AI Advisor)
*   `STARTUP_PROBE_WINDOW`: 8s (Max 2 fails)
*   `GPS Throttle`: 5s
*   `Geofence Debounce`: 3s
*   `Geofence Radius`: 30m (Default)
*   `Geofence Cooldown`: 5 mins
*   `POI Cache TTL`: 15 mins (SW)
*   `Audio Max Per Lang`: 300 entries (Max 3 languages)