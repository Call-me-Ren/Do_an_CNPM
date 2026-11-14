# AGENTS.md — Hướng dẫn cho AI Coding Agent

Tài liệu này cung cấp ngữ cảnh tổng thể cho các AI Agent làm việc trên repo **Hệ thống Thuyết minh Tự động Đa ngôn ngữ (Museum Multilingual Smart Audio Guide)**.

Đọc kèm:
- [YEU_CAU_DO_AN.md](./YEU_CAU_DO_AN.md) — Yêu cầu chuẩn của đồ án và giảng viên.
- [INSTRUCTIONS.md](./INSTRUCTIONS.md) — Quy trình thao tác, đồng bộ tài nguyên và kiểm thử.
- [RULE.md](./RULE.md) — Các quy tắc bắt buộc không được vi phạm.

---

## 1. Cấu trúc Repo

| Thư mục | Vai trò | Công nghệ chính |
| :--- | :--- | :--- |
| `frontend/` | Web SPA (Visitor `/` + Admin CMS `/admin`) | React 18, Vite 6, TypeScript, Tailwind CSS v4, Zustand, `html5-qrcode`, Recharts |
| `mobile/` | Android App (chỉ Visitor, **offline-first**) | Expo SDK 58, React Native, `expo-router`, `expo-camera`, `expo-location`, `expo-audio`, Zustand + `AsyncStorage` |
| `backend/` | REST API + Upload + Telemetry + Auto-Translate | Node.js 20, Express, TypeScript, Zod, `bcryptjs`, JWT, `mssql`, `multer` |
| `docs/` | Báo cáo, yêu cầu, sơ đồ UML (V0–V3) và DFD | PlantUML, ActScript, Markdown |
| `.github/workflows/` | CI/CD 3 đích triển khai | `deploy.yml` (GitHub Pages), `docker.yml` (GHCR FE+BE), `mobile.yml` (Android APK) |

---

## 2. Lệnh Kiểm Tra & Chạy Nhanh

```powershell
# Frontend (Web)
cd frontend; npm run lint; npm test; npm run build

# Mobile (Android Expo)
cd mobile; npm run typecheck; npm run lint; npm test; npx expo export --platform android

# Backend (Express + MSSQL)
cd backend; npm run typecheck; npm test; npm run build
```

---

## 3. Thông số Kỹ thuật Cốt lõi (Source of Truth)

- **Cơ sở dữ liệu (`backend/src/db/schema.sql`):** Gồm **12 bảng** (`Museum`, `MuseumTranslation`, `Floor`, `FloorTranslation`, `Artifact`, `ArtifactTranslation`, `ArtifactImage`, `ArtifactAudio`, `SubtitleCue`, `AdminUser`, `VisitorSession`, `ListenEvent`).
- **Đa ngôn ngữ:** 5 ngôn ngữ `vi`, `en`, `zh`, `ko`, `ja` (chuyển đổi không tải lại trang/app).
- **Geofencing (`geofence.ts`):** Bán kính kích hoạt mặc định `DEFAULT_TRIGGER_RADIUS = 15` m; ngưỡng sai số tối đa `MAX_ACCEPTABLE_ACCURACY = 150` m; quy đổi bản đồ khi thiếu GPS `MAP_METERS_PER_PIXEL = 0.15` m/pixel.
- **Khóa đăng nhập (`UC01`):** Tối đa `5` lần sai; Frontend khóa `5 phút` trong `localStorage` (`loginLock.ts`), Backend khóa `1 phút` (`LOCK_MS = 60_000`) trong `AdminUser.LockedUntil` (`auth.ts`).
- **Giới hạn Upload (`uploads.ts` & `nginx.conf`):** Audio `<= 30MB`, Ảnh `<= 10MB`, Nginx `client_max_body_size 35m`.
- **Dịch tự động (`translate.ts`):** Google Translate API (`translate.googleapis.com`) + fallback MyMemory (`api.mymemory.translated.net`).
- **Telemetry Mobile (`mobile/src/shared/services/api.ts`):** Gửi `deviceType: "Mobile"`, `browser: "Expo Android App"` để khớp Zod enum `['Mobile', 'Desktop', 'Tablet']` ở Backend.
