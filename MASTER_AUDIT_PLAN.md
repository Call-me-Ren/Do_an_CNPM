# MASTER_AUDIT_PLAN.md — Báo Cáo Kiểm Toán Toàn Diện, Kế Hoạch Hoàn Thiện & Cẩm Nang Bảo Vệ Đồ Án

> **Đề tài:** Hệ thống Thuyết minh Tự động Đa ngôn ngữ (*Museum Multilingual Smart Audio Guide*)  
> **Chuyên đề:** 1. FE DEV (React Native + React.js) chuyên nghiệp xử lý giao diện (trên Web, Mobile) bao gồm CI/CD  
> **Ngày kiểm toán:** 2026-11-15  
> **Phạm vi:** `frontend/`, `mobile/`, `backend/`, `.github/workflows/`, `docker-compose.yml`, `docs/` (bộ V3 & Báo cáo V3)

---

## Phần 1 — Bảng Tổng Hợp Trạng Thái Kiểm Thử & Build (Health Scorecard Baseline)

| Phân hệ | Lệnh kiểm tra | Kết quả Baseline | Chi tiết ghi nhận |
| :--- | :--- | :---: | :--- |
| **Frontend (`frontend/`)** | `npm run lint` | ✅ PASS (Exit 0) | 0 errors, 10 warnings (`react-hooks/exhaustive-deps`, `react-refresh`) |
| **Frontend (`frontend/`)** | `npm test` (Vitest) | ✅ PASS (Exit 0) | 6 test files passed, **22/22 tests passed** (`subtitles`, `login_lock`, `qr_helper`, `geofence`, `player`, `visitor_click`) |
| **Frontend (`frontend/`)** | `npm run build` | ✅ PASS (Exit 0) | `tsc -b && vite build && node scripts/prepare_deploy.cjs` thành công (`dist/assets/index.js` 1,341.85 kB, `index.css` 75.66 kB) |
| **Mobile (`mobile/`)** | `npm run typecheck` | ✅ PASS (Exit 0) | `tsc --noEmit` không có lỗi TypeScript |
| **Mobile (`mobile/`)** | `npm run lint` | ✅ PASS (Exit 0) | 0 errors, 3 warnings (`import/first`, `import/no-named-as-default-member`, unused `eslint-disable`) |
| **Mobile (`mobile/`)** | `npm test` (Jest) | ✅ PASS (Exit 0) | 4 test suites passed, **10/10 tests passed** (`fav_store`, `geofence`, `qr_helper`, `subtitles`) |
| **Mobile (`mobile/`)** | `npx expo export --platform android` | ✅ PASS (Exit 0) | Đóng gói Metro Android bundle (1494 modules, 145 assets) vào `mobile/dist/` thành công |
| **Backend (`backend/`)** | `npm run typecheck` | ✅ PASS (Exit 0) | `tsc --noEmit` không có lỗi |
| **Backend (`backend/`)** | `npm test` (Vitest + Supertest) | ✅ PASS (Exit 0) | 1 test file passed, **8/8 tests passed** (`api.test.ts`) |
| **Backend (`backend/`)** | `npm run build` | ✅ PASS (Exit 0) | `tsc -p tsconfig.json` biên dịch `dist/` thành công |
| **Dữ liệu (`museum_data.json`)** | So sánh FE ↔ Mobile | ✅ KHỚP 100% | Cả 2 bên đều có 4 tầng, 15 hiện vật, nội dung JSON giống hệt nhau |

---

## Phần 2 — Ma Trận Đối Chiếu Sự Thật (Source-of-Truth Traceability Matrix)

| Hạng mục nghiệp vụ / kỹ thuật | Code Backend (`backend/`) | Code Frontend (`frontend/`) | Code Mobile (`mobile/`) | Sơ đồ UML/ERD/DFD V3 (`docs/design/`) | Báo cáo V3 (`Bao_cao_do_an_CNPM_v3.md`) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **Cơ sở dữ liệu (12 bảng)** | `schema.sql`: 12 bảng (`Museum`..`ListenEvent`) | `types/index.ts`, `api.ts` khớp DTO | `types/index.ts`, `api.ts` khớp DTO | `ErdV3.puml`: đủ 12 bảng, PK/FK/UQ khớp 100% | Mô tả đủ 12 bảng & lý do `ListenEvent` không FK cứng | ✅ Khớp |
| **Phạm vi Use Case (14 UC)** | Routes `auth`, `museum`, `analytics`, `uploads`, `translate` | Visitor (`UC02–08,14`) + Admin (`UC01,09–13`) | Visitor-only (`UC02–08,14`), không có Admin | `OverviewUCv3.puml`, `UCv3.md`, 14 `.actscript` | Đủ 14 UC, 4 Actors, không còn 20 UC | ✅ Khớp |
| **Đa ngôn ngữ (5 thứ tiếng)** | `env.ts`: `vi, en, zh, ko, ja` | `i18n.ts`: Đủ 75/75 keys cho cả 5 ngôn ngữ | `i18n.ts`: Đủ 75/75 keys + `TrackingBanner.tsx` dùng `t('replayNow')` | `UC04`, `DFD_Level1` ghi đủ 5 ngôn ngữ | Ghi đủ 5 ngôn ngữ `vi, en, zh, ko, ja` | ✅ Khớp |
| **Geofencing (`UC14`)** | Lưu `Latitude`, `Longitude`, `TriggerRadius` | `geofence.ts`: `15m`, `150m`, `0.15 m/px` | `geofence.ts`: `15m`, `150m`, `0.15 m/px` | `UCv3.md`, `UC14_Activity`, `DFD_Level2_Geofence` khớp `15m/150m` | Khớp `15m`, `150m`, `0.15 m/px` | ✅ Khớp |
| **Khóa đăng nhập (`UC01`)** | `auth.ts`: 5 lần sai → khóa 60s (`429`) | `loginLock.ts`: 5 lần sai → khóa 5 phút (`localStorage`) | N/A (Visitor-only) | `UCv3.md`, `UC01_Activity`, `AUDIT_V3.md` ghi rõ 5 phút FE / 1 phút BE | Khớp 5 lần / 5 phút FE / 1 phút BE | ✅ Khớp |
| **Giới hạn Upload (`UC11`)** | `uploads.ts`: Audio `<= 30MB`, Ảnh `<= 10MB` | `AudioManageView.tsx` (`<= 30MB`), `ArtifactsManageView.tsx` (`<= 10MB`) | N/A | `UCv3.md`, `UC11_Activity`, `AUDIT_V3.md` ghi `<= 30MB` audio, `<= 10MB` ảnh, Nginx `35m` | Khớp `30MB` / `10MB` / `35m` | ✅ Khớp |
| **Dịch tự động** | `translate.ts`: Google Translate + MyMemory | `translationService.ts`: Backend API / Google / MyMemory | N/A | `ComponentDiagramV3`, `DeployDiagramV3`, `DFD_Level0/1` | Khớp Google Translate + MyMemory | ✅ Khớp |
| **Mobile Offline-First & Sync** | `GET /api/museum`, `POST /api/analytics/listen` | `frontend/` là nguồn media gốc | `MuseumDataContext`, `AsyncStorage` cache + queue 200; `sync-assets.cjs` đã sinh `getApiOrigin()` | `ComponentDiagramV3`, `DeployDiagramV3`, `AUDIT_V3.md` | Mô tả rõ cơ chế offline-first & sync | ✅ Khớp |
| **Telemetry & Session (`UC10,12`)** | `analytics.ts`: timeout `35_000 ms`, `deviceType` enum | `analytics.ts`: heartbeat 10s + `ntfy.sh` demo fallback | `api.ts`: heartbeat 15s, `deviceType: 'Mobile'` | `UCv3.md`, `DFD_Level1` | Khớp heartbeat & timeout 35s | ✅ Khớp |
| **CI/CD (3 workflows)** | `deploy.yml` (test/build BE), `docker.yml` (GHCR) | `deploy.yml` (GitHub Pages), `docker.yml` (GHCR) | `mobile.yml` (Lint/Test/APK + Release) | `DeployDiagramV3.puml`, `AUDIT_V3.md` | Mô tả đủ 3 pipeline CI/CD | ✅ Khớp |

---

## Phần 3 — Danh Sách Lỗi, Điểm Chưa Đồng Nhất & Hạng Mục Cần Hoàn Thiện (Actionable Backlog)

### 🔴 Mức độ P0 (Bắt buộc sửa ngay — Lỗi logic, lệch thông số FE/BE/Docs, rủi ro ghi đè)

- [x] **P0-1: Đồng bộ giới hạn upload Audio 30MB tại Frontend Admin** *(Đã sửa `AudioManageView.tsx` về `30 * 1024 * 1024` & `30MB`, đã verify `frontend` lint/test/build Exit 0)*
  - **Vấn đề:** `frontend/src/admin/views/AudioManageView.tsx` (dòng `68`, `71`, `495`) đang kiểm tra và hiển thị `50MB` (`50 * 1024 * 1024`), trong khi Backend (`backend/src/routes/uploads.ts`) giới hạn cứng `30MB` (`30 * 1024 * 1024`), Nginx (`frontend/nginx.conf`) đặt `client_max_body_size 35m`, và toàn bộ tài liệu V3 (`UCv3.md`, `UC11_Activity.actscript`, `AGENTS.md`, `README.md`) đều chốt `<= 30MB`.
  - **Hướng dẫn sửa:** Đổi `50 * 1024 * 1024` → `30 * 1024 * 1024` và các chuỗi `"50MB"` → `"30MB"` tại `frontend/src/admin/views/AudioManageView.tsx`.
  - **Kiểm chứng:** `cd frontend; npm run lint; npm test; npm run build`.

- [x] **P0-2: Sửa lỗi thiếu key i18n và sai key `t('replay')` trên Mobile & Frontend** *(Đã sửa `t('replayNow')` tại `TrackingBanner.tsx` và bổ sung đủ `75/75` keys cho 5 ngôn ngữ ở cả `frontend` & `mobile`)*
  - **Vấn đề:**
    1. `mobile/src/components/TrackingBanner.tsx` (dòng `107`) gọi `t('replay')` khi `suggestion.kind === 'replay'`, nhưng `mobile/src/locales/i18n.ts` định nghĩa key là `replayNow` (khiến UI hiển thị chữ thô `"replay"`).
    2. Cả `frontend/src/locales/i18n.ts` và `mobile/src/locales/i18n.ts` đều thiếu 3 key trong `en` (`trackReadyNeedQr`, `trackAutoTourActive`, `scanQrNow`) và thiếu 6 key phân trang trong `zh`, `ko`, `ja` (`page`, `prevPage`, `nextPage`, `showingItems`, `ofItems`, `items`).
  - **Hướng dẫn sửa:**
    - Sửa `t('replay')` → `t('replayNow')` trong `mobile/src/components/TrackingBanner.tsx`.
    - Bổ sung đầy đủ 3 key tiếng Anh và 6 key phân trang (`zh`, `ko`, `ja`) vào cả `frontend/src/locales/i18n.ts` và `mobile/src/locales/i18n.ts` để cả 5 ngôn ngữ có đúng `75/75` keys.
  - **Kiểm chứng:** Chạy script kiểm tra độ phủ key i18n cả 5 ngôn ngữ + `npm run lint` + `npm test`.

- [x] **P0-3: Bảo toàn `getApiOrigin()` trong `mobile/scripts/sync-assets.cjs`** *(Đã cập nhật `sync-assets.cjs`, chạy lại `node mobile/scripts/sync-assets.cjs` và verify `mobile` typecheck/lint/test/export Exit 0)*
  - **Vấn đề:** `mobile/src/shared/assetMap.ts` hiện có `import { getApiOrigin } from './services/api';` (dòng `3`) và logic fallback `const origin = getApiOrigin(); if (origin) return { uri: `${origin}${normalized}` };` (dòng `113-114`) để tải ảnh/audio mới upload (`/uploads/...`) từ Backend. Tuy nhiên `mobile/scripts/sync-assets.cjs` chưa sinh ra đoạn code này, nên nếu chạy `node mobile/scripts/sync-assets.cjs` theo `INSTRUCTIONS.md` sẽ làm mất tính năng tải media từ server trên Mobile.
  - **Hướng dẫn sửa:** Cập nhật `mobile/scripts/sync-assets.cjs` để sinh sẵn `import { getApiOrigin } from './services/api';` và fallback `getApiOrigin()` trong `resolveBundledAsset`, đồng thời không cần chèn comment `eslint-disable` thừa (để hết luôn 1 warning ESLint ở `assetMap.ts`).
  - **Kiểm chứng:** Chạy `node mobile/scripts/sync-assets.cjs`, sau đó chạy `cd mobile; npm run typecheck; npm run lint; npm test`.

### 🟡 Mức độ P1 (Cải thiện chất lượng code, validation & loại bỏ lint warning an toàn)

- [x] **P1-1: Bổ sung kiểm tra kích thước ảnh `<= 10MB` phía Client tại `ArtifactsManageView.tsx`** *(Đã thêm `file.size > 10 * 1024 * 1024` với `setAlertMessage`, đã verify `frontend` lint/test/build Exit 0)*
  - **Vấn đề:** Backend `uploads.ts` giới hạn ảnh `<= 10MB`, nhưng `frontend/src/admin/views/ArtifactsManageView.tsx` chưa kiểm tra `file.size > 10 * 1024 * 1024` trước khi đọc DataURL/upload.
  - **Hướng dẫn sửa:** Thêm kiểm tra `file.size > 10 * 1024 * 1024` với thông báo rõ ràng bằng `AlertModal` hoặc inline error khi Admin chọn ảnh vượt quá `10MB`.
  - **Kiểm chứng:** `cd frontend; npm run lint; npm test; npm run build`.

- [x] **P1-2: Dọn dẹp 3 ESLint warnings trong `mobile/`** *(Đã xử lý toàn bộ, `mobile` `npm run lint` đạt `0 errors, 0 warnings`)*
  - **Vấn đề:** `mobile/src/__tests__/fav_store.test.ts` (dòng `7`: `import/first`), `mobile/src/locales/i18n.ts` (dòng `381`: `import/no-named-as-default-member`), `mobile/src/shared/assetMap.ts` (dòng `1`: unused `eslint-disable`).
  - **Hướng dẫn sửa:** Sửa `import { use as initReactI18next }` hoặc `i18next.use(...)` đúng chuẩn ESM, sắp xếp lại `jest.mock` / `import` ở `fav_store.test.ts` (hoặc disable rule cục bộ hợp lý nếu `jest.mock` cần đặt trước), và bỏ directive thừa ở `sync-assets.cjs`.
  - **Kiểm chứng:** `cd mobile; npm run lint` đạt `0 errors, 0 warnings`.

### 🟢 Mức độ P2 (Tối ưu hóa bổ sung trước khi bảo vệ)

- [x] **P2-1: Kiểm tra quy trình Git & Artifacts** *(Đã kiểm tra `git status -s`: không có file build tạm hoặc `.env` bị lộ; chỉ có các file sửa sạch và `MASTER_AUDIT_PLAN.md`)*
  - Đảm bảo không commit nhầm thư mục build tạm (`mobile/dist/`, `frontend/dist/`, `backend/dist/`, `.env` chứa secret thật) nếu không nằm trong `.gitignore`.

---

## Phần 4 — Đánh Giá Mức Độ Đáp Ứng Yêu Cầu Đồ Án (`YEU_CAU_DO_AN.md`)

- **Chuyên đề 1 (FE DEV — React.js + React Native + CI/CD):** Đạt mức xuất sắc. Có đủ Web SPA (Visitor + Admin CMS tách biệt hoàn toàn), Mobile App Android (Expo React Native offline-first đóng gói 145 media assets vào APK), và 3 pipeline GitHub Actions tự động hóa hoàn toàn (`deploy.yml`, `docker.yml`, `mobile.yml`).
- **Nghiệp vụ cốt lõi:** Đủ 14 Use Cases (`UC01–UC14`), 5 ngôn ngữ (`vi, en, zh, ko, ja`) chuyển đổi tức thì, Geofencing Haversine 15m/150m chống nhiễu, QR deep-link, Audio + Phụ đề đồng bộ karaoke, Admin Dashboard real-time & Auto-translate.
- **Hồ sơ thiết kế (`docs/`):** Bộ V3 đã chuẩn hóa đồng nhất 100% (12 bảng ERD, DFD 3 mức 0-1-2, Component, Deployment, 14 Use Case & Activity) và bảo toàn nguyên vẹn lịch sử V0–V2.

---

## Phần 5 — Kịch Bản Demo Sống (Step-by-Step Live Demo Script — 10–15 Phút)

1. **Phút 0–2 | Giới thiệu Kiến trúc & Chế độ Visitor Web (`/`):**
   - Mở `http://localhost:3000/` (hoặc link GitHub Pages). Không cần đăng nhập.
   - Đổi ngôn ngữ tức thì giữa `Tiếng Việt` → `English` → `日本語` trên `LanguageSwitcher` (không reload trang).
2. **Phút 2–5 | Quét QR, Nghe Thuyết minh & Phụ đề Karaoke (`UC02`, `UC03`, `UC07`):**
   - Nhấn nút **Quét QR** ở thanh điều hướng → quét mã hoặc nhập mã `WRM001` (hoặc mở `?artifact=WRM001`).
   - Mở chi tiết hiện vật `ArtifactDetailSheet`, bật phát Audio trên `AudioPlayerBar`, đổi tốc độ `1.0x → 1.5x`, bấm vào một dòng phụ đề trên `LiveTranscriptCard` để tua tới đúng mốc giây.
3. **Phút 5–7 | Sơ đồ tầng & Định vị Geofencing (`UC05`, `UC06`, `UC14`):**
   - Chuyển sang tab **Bản đồ tầng (`FloorMapView`)**, đổi giữa 4 tầng, chỉ vào ghim vị trí `(X, Y)` và vòng tròn *"Bạn đang ở đây"*.
   - Thêm hiện vật vào **Yêu thích (`FavoritesView`)**, tải lại trang để chứng minh lưu bền vững qua `localStorage`.
4. **Phút 7–10 | Mobile Android App Offline-First (`mobile/`):**
   - Mở app Expo trên máy thật/Emulator: **bật Chế độ Máy bay (tắt Wifi/4G)**.
   - Mở danh sách hiện vật, bản đồ tầng, phát audio tiếng Việt/Anh/Nhật và phụ đề hoàn toàn mượt mà (lấy từ `assetMap.ts` + `museum_data.json` nhúng trong APK).
   - Bật lại mạng, vào tab **Thông tin (`info.tsx`)** nhấn **Đồng bộ / Flush** để đẩy các `ListenEvent` từ hàng đợi `AsyncStorage` về Backend.
5. **Phút 10–13 | Admin CMS Thời gian thực (`/admin` — `UC01, UC09–13`):**
   - Đăng nhập `/admin/login` (`admin@museum.vn` / `admin123`), demo thử nhập sai 5 lần (nếu muốn) để chỉ cơ chế khóa tạm thời.
   - Xem **Dashboard**: Live Device Counter tăng theo thiết bị đang mở Web/Mobile.
   - Vào **Quản lý hiện vật** → mở **Dịch tự động (`AutoTranslateModal`)** dịch 1 đoạn tiếng Việt sang 5 ngôn ngữ; tạo & tải ảnh PNG mã QR.
   - Vào **Biên tập sơ đồ (`FloorMapEditorView`)** kéo/click đặt tọa độ `(X, Y)`; vào **Thống kê (`AnalyticsView`)** xem biểu đồ Recharts và xuất file CSV.
6. **Phút 13–15 | Trình diễn CI/CD (`.github/workflows/`):**
   - Mở tab **GitHub Actions** cho Hội đồng xem 3 workflow chạy xanh: `deploy.yml` (GitHub Pages), `docker.yml` (GHCR images), `mobile.yml` (build `museum-audio-guide.apk` đính kèm Release).

---

## Phần 6 — Bộ 20 Câu Hỏi & Trả Lời Phản Biện Xoáy Sâu (Defense Q&A Cheat Sheet)

1. **Hỏi: Tại sao Visitor không cần đăng nhập, vậy làm sao hệ thống đếm được "thiết bị đang online" và lượt nghe theo từng phiên?**
   - **Trả lời:** Khi vào Visitor Web hoặc Mobile App, client tự sinh một `sessionId` lưu ở `sessionStorage` (`museum_visitor_session_id` trong `frontend/src/shared/services/analytics.ts`) hoặc `AsyncStorage` (`museum_mobile_session_id` trong `mobile/src/shared/services/api.ts`), rồi gửi heartbeat định kỳ 10s (Web) / 15s (Mobile) lên `POST /api/sessions/heartbeat`. Backend `analyticsRepo.ts` dùng `SESSION_TIMEOUT_MS = 35_000` để tự động loại bỏ các phiên đã thoát quá 35 giây.
2. **Hỏi: Khi triển khai bản demo tĩnh trên GitHub Pages (không có Backend), chức năng đếm thiết bị online và thống kê hoạt động thế nào?**
   - **Trả lời:** Khi biến `VITE_API_URL` rỗng (`apiEnabled === false` trong `frontend/src/shared/services/http.ts`), `analyticsService` tự động chuyển sang cơ chế fallback đồng bộ thời gian thực qua `ntfy.sh/wrm_museum_presence_cnpm` (HTTP + WebSocket) kết hợp `localStorage` (`museum_active_sessions_v3`, `museum_listen_events_v3`) trong `frontend/src/shared/services/analytics.ts`.
3. **Hỏi: Mobile App của nhóm giải quyết bài toán mất mạng trong bảo tàng (tầng hầm, tường dày) như thế nào?**
   - **Trả lời:** Áp dụng kiến trúc **Offline-First**: script `mobile/scripts/sync-assets.cjs` sao chép toàn bộ 145 file audio/ảnh/bản đồ từ `frontend/public/` sang `mobile/assets/museum/` với tên ASCII an toàn và sinh `mobile/src/shared/assetMap.ts` (`require(...)` tĩnh để Metro đóng gói vào APK). Khi mở app, `museumMobileApi.getMuseumData()` trong `mobile/src/shared/services/api.ts` thử gọi `/api/museum` với timeout `4s`; nếu lỗi/offline sẽ fallback về `AsyncStorage` cache (`museum_cached_data_v1`), và cuối cùng là `mobile/src/data/museum_data.json` nhúng sẵn.
4. **Hỏi: Nếu du khách nghe thuyết minh lúc mất mạng trên Mobile, dữ liệu thống kê lượt nghe có bị mất không?**
   - **Trả lời:** Không. Trong `mobile/src/shared/services/api.ts`, hàm `trackListen()` khi gặp lỗi mạng sẽ đẩy `ListenEvent` vào hàng đợi bền vững `museum_pending_listen_events_v1` trong `AsyncStorage` (tối đa 200 sự kiện). Khi app có mạng trở lại (trong `getMuseumData()`, `sendHeartbeat()` hoặc nút đồng bộ ở `info.tsx`), `flushPendingListens()` sẽ tự động gửi bù toàn bộ lên `POST /api/analytics/listen`. Backend `analyticsRepo.ts` kiểm tra `IF NOT EXISTS (SELECT 1 FROM dbo.ListenEvent WHERE Id = @Id)` để đảm bảo idempotent, không bị trùng lặp.
5. **Hỏi: Tại sao trong CSDL (`schema.sql` / `ErdV3.puml`), bảng `ListenEvent` lại không đặt khóa ngoại (FK) cứng tới `VisitorSession` và `Artifact`?**
   - **Trả lời:** Vì 2 lý do kỹ thuật thực tế: (1) `VisitorSession` là bảng trạng thái sống, bị xóa khi phiên hết hạn 35s (`DELETE FROM dbo.VisitorSession WHERE LastActive < ...`) hoặc khi khách đóng tab (`/sessions/leave`), nếu đặt FK cứng thì không thể lưu lịch sử `ListenEvent` lâu dài; (2) Mobile hỗ trợ hàng đợi offline có thể đồng bộ `ListenEvent` sau khi phiên đã đóng hoặc hiện vật vừa được chỉnh sửa.
6. **Hỏi: Thuật toán Geofencing của nhóm tính khoảng cách thế nào và làm sao tránh tình trạng GPS trong nhà nhảy loạn gây chuyển bài liên tục?**
   - **Trả lời:** Hệ thống dùng công thức **Haversine** (`distanceMeters` trong `geofence.ts`) với bán kính kích hoạt mặc định `DEFAULT_TRIGGER_RADIUS = 15` m. Để chống nhảy bài do nhiễu GPS: (1) Lọc bỏ mọi tín hiệu có độ sai số `accuracy > MAX_ACCEPTABLE_ACCURACY` (`150` m); (2) Bắt buộc `hasScannedQr === true` (khách đã quét QR cổng hoặc hiện vật) mới kích hoạt tự động; (3) Nếu đang phát bài khác thì chỉ hiện banner gợi ý `switch`, nếu bài đó đã nằm trong `heardIds` thì chỉ hiện gợi ý `replay` chứ không tự cắt ngang bài đang nghe (`VisitorLayout.tsx`, `MuseumDataContext.tsx`).
7. **Hỏi: Nếu bảo tàng trong nhà không bắt được GPS, sơ đồ tầng (`FloorMapView`) xác định "gần bạn" bằng cách nào?**
   - **Trả lời:** Dùng hàm `findNearbyByMap()` trong `geofence.ts`: dựa vào điểm neo `anchorArtifactId` (hiện vật vừa quét QR hoặc đang nghe), tính khoảng cách Euclid theo pixel giữa các `mapCoordinates (x, y)` trên cùng tầng và quy đổi ra mét bằng hằng số `MAP_METERS_PER_PIXEL = 0.15` m/pixel.
8. **Hỏi: Hệ thống đồng bộ Audio và Phụ đề Karaoke (chạy theo từng câu, bấm vào câu để tua) hoạt động ra sao?**
   - **Trả lời:** Trên Web (`frontend/src/shared/services/tts.ts`), `AudioPlayerBar.tsx` ưu tiên phát file MP3 qua `HTMLAudioElement` và lắng nghe sự kiện `ontimeupdate` để cập nhật `currentTime`, so khớp với mảng `subtitles` (`start`, `end`, `text`). Nếu hiện vật chưa có file MP3, hệ thống fallback sang Web Speech API (`window.speechSynthesis`) đọc từng cue. Trên Mobile (`mobile/src/components/AudioPlayerBar.tsx`), dùng `useAudioPlayer` & `useAudioPlayerStatus` của `expo-audio` và hàm `findActiveCueIndex()` trong `mobile/src/shared/utils/subtitles.ts`.
9. **Hỏi: Khi người dùng đổi ngôn ngữ giữa chừng hoặc bấm liên tiếp nhiều hiện vật, làm sao tránh lỗi phát 2 âm thanh chồng lên nhau?**
   - **Trả lời:** Trong `frontend/src/shared/stores/playerStore.ts`, hàm `playArtifact()` luôn gọi `ttsService.stop()` trước khi cập nhật `currentArtifact` mới; đồng thời `ttsService.stop()` giải phóng hoàn toàn `HTMLAudioElement` (`pause()`, `src = ''`) và `speechSynthesis.cancel()`. Trên Mobile, `AudioPlayerBar.tsx` quản lý một instance `useAudioPlayer` duy nhất và gọi `player.replace(source)` khi đổi track/ngôn ngữ.
10. **Hỏi: Cơ chế chống tấn công vét cạn mật khẩu (Brute-force) ở cổng Admin được thiết kế mấy lớp?**
    - **Trả lời:** Thiết kế **3 lớp bảo vệ**: (1) Rate limiter trên Express tại `backend/src/app.ts` giới hạn `30 requests/phút` cho `/api/auth`; (2) Lớp Backend trong `backend/src/routes/auth.ts` & `adminRepo.ts`: lưu `FailedAttempts` và `LockedUntil` trong bảng `AdminUser`, sai `5` lần khóa `1 phút` (`LOCK_MS = 60_000`) và trả HTTP `429`; (3) Lớp Frontend trong `frontend/src/shared/utils/loginLock.ts`: đếm sai `5` lần và khóa UI `5 phút` (`300_000 ms`) trong `localStorage` để bảo vệ ngay cả khi chạy chế độ demo không có Backend.
11. **Hỏi: Tại sao Token Admin trên Web lưu ở `sessionStorage` thay vì `localStorage`?**
    - **Trả lời:** Trong `frontend/src/shared/stores/adminAuthStore.ts`, token lưu ở `sessionStorage` (`admin_session_token`) để phiên đăng nhập tự động hết hạn khi đóng tab/trình duyệt, giảm rủi ro lộ phiên trên máy dùng chung tại quầy bảo tàng. Ngoài ra `AdminLayout.tsx` còn xóa phiên Admin khỏi danh sách `VisitorSession` để không làm sai lệch thống kê khách tham quan.
12. **Hỏi: Giới hạn dung lượng upload file Audio và Ảnh được kiểm soát đồng bộ ở những tầng nào?**
    - **Trả lời:** Kiểm soát đồng bộ ở **3 tầng**: (1) Client UI (`AudioManageView.tsx` chặn audio `> 30MB`, `ArtifactsManageView.tsx` chặn ảnh `> 10MB`); (2) Reverse Proxy Nginx (`frontend/nginx.conf` cấu hình `client_max_body_size 35m` để chừa overhead multipart header); (3) Backend Multer (`backend/src/routes/uploads.ts` chặn cứng `30 * 1024 * 1024` cho `audio/*` và `10 * 1024 * 1024` cho `image/*`).
13. **Hỏi: Chức năng Dịch tự động 5 ngôn ngữ dùng API nào? Nếu API chính lỗi hoặc bị chặn thì sao?**
    - **Trả lời:** Cả `backend/src/routes/translate.ts` và `frontend/src/shared/services/translationService.ts` đều gọi API chính là Google Translate (`translate.googleapis.com/translate_a/single`), nếu thất bại tự động fallback sang MyMemory (`api.mymemory.translated.net/get`, có lọc bỏ chuỗi lỗi `'MYMEMORY WARNING'`), và nếu mất mạng hoàn toàn sẽ trả về chuỗi gốc để không làm crash ứng dụng.
14. **Hỏi: Tại sao trên GitHub Pages (SPA), khi người dùng F5 ở đường dẫn `/admin` lại không bị lỗi 404?**
    - **Trả lời:** Script `frontend/scripts/prepare_deploy.cjs` tạo bản sao `404.html` từ `index.html` và tệp `.nojekyll`, kết hợp với đoạn script khôi phục route `?/` trong `frontend/index.html` và `basename` động trong `frontend/src/main.tsx` (`import.meta.env.BASE_URL`).
15. **Hỏi: Tại sao Mobile phải dùng `sync-assets.cjs` đổi tên file sang dạng ASCII + MD5 hash thay vì dùng tên file tiếng Việt gốc?**
    - **Trả lời:** Vì tên file ảnh/audio gốc trong `frontend/public/` có dấu tiếng Việt, khoảng trắng và dấu nháy đơn (ví dụ `Pháo tự hành 175mm M107 'Vua chiến trường'.webp`), gây lỗi `AAPT2` khi Gradle biên dịch tài nguyên Android và lỗi Metro bundler. Hàm `toAsciiSafeName()` trong `mobile/scripts/sync-assets.cjs` chuẩn hóa NFD, bỏ dấu, thay ký tự đặc biệt bằng `_` và gắn 6 ký tự MD5 hash của đường dẫn gốc để đảm bảo duy nhất.
16. **Hỏi: DFD Mức 0, Mức 1 và Mức 2 của đồ án đảm bảo nguyên tắc cân bằng luồng dữ liệu (Data Balancing) như thế nào?**
    - **Trả lời:** Trong `docs/design/dfd/DFD.md`: Mức 0 có đúng 4 thực thể ngoài (`Khách tham quan`, `Quản trị viên`, `Hệ thống định vị GPS`, `Dịch vụ dịch thuật`) với các luồng vào/ra tổng quát. Khi phân rã xuống Mức 1 (`1.0` đến `6.0` + 5 kho dữ liệu `D1–D5`), toàn bộ luồng giao tiếp với 4 thực thể ngoài giữ nguyên tên và hướng. Mức 2 (`DFD_Level2_Geofence.puml`) chỉ phân rã sâu tiến trình `2.0` và `3.0` (`2.1` QR → `2.2` Lọc GPS & Haversine → `2.3` Quyết định Auto-Play/Switch/Replay → `3.1` Tải Audio & Phụ đề).
17. **Hỏi: Vì sao trong đồ án có cả file `V0`, `V1`, `V2` và `V3`? Có phải bị trùng lặp không?**
    - **Trả lời:** Không trùng lặp, đó là lịch sử tiến hóa thiết kế có kiểm soát theo `RULE.md`: `V0–V2` được lưu trữ nguyên vẹn để giảng viên đối chiếu quá trình phát triển, còn `V3` là phiên bản chuẩn hóa cuối cùng (Canonical Baseline) đã được kiểm toán 100% với mã nguồn thực tế trong `docs/design/audit/AUDIT_V3.md`.
18. **Hỏi: Quy trình CI/CD của nhóm có những pipeline nào và chạy tự động khi nào?**
    - **Trả lời:** Có 3 workflow độc lập trong `.github/workflows/`: (1) `deploy.yml` chạy lint/test/build Frontend + typecheck/test/build Backend và deploy Web lên GitHub Pages khi push `main`/`master`; (2) `docker.yml` build multi-stage Docker images (`frontend` + `backend`) đẩy lên GHCR/Docker Hub; (3) `mobile.yml` chạy lint/typecheck/Jest cho Mobile, prebuild Android và chạy `./gradlew assembleRelease` tạo file `museum-audio-guide.apk`, tự động đính kèm vào GitHub Release khi gắn tag `v*.*.*`.
19. **Hỏi: Khi Admin sửa tọa độ hoặc thêm hiện vật mới trên Web CMS, Mobile App đang cài sẵn APK cũ làm sao cập nhật được dữ liệu mới?**
    - **Trả lời:** Khi Mobile có mạng, `MuseumDataContext.tsx` gọi `museumMobileApi.getMuseumData()` lấy JSON mới nhất từ Backend `/api/museum` và lưu đè vào `AsyncStorage` (`museum_cached_data_v1`). Nếu hiện vật mới có ảnh/audio mới upload ở đường dẫn `/uploads/...`, hàm `resolveBundledAsset()` trong `mobile/src/shared/assetMap.ts` không tìm thấy trong `LOCAL_ASSET_MAP` sẽ tự động ghép với `getApiOrigin()` để stream/tải từ server.
20. **Hỏi: Trên Web, camera quét mã QR (`QRScannerModal.tsx`) có xử lý giải phóng phần cứng sau khi đóng modal không?**
    - **Trả lời:** Có. Trong `frontend/src/visitor/views/QRScannerModal.tsx`, hàm cleanup khi đóng modal hoặc unmount gọi `html5QrCode.stop()`, `clear()`, và duyệt qua toàn bộ `video.srcObject` tracks để gọi `track.stop()`, đảm bảo tắt hoàn toàn đèn LED camera trên trình duyệt desktop và mobile.
