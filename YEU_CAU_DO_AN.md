# YEU_CAU_DO_AN.md — Yêu Cầu Chuẩn Hóa Đồ Án Môn Học

## 1. Thông tin chung
- **Tên đề tài:** Hệ thống Thuyết minh Tự động Đa ngôn ngữ (*Museum Multilingual Smart Audio Guide*).
- **Môn học:** Công nghệ Phần mềm — Khoa CNTT, Trường Đại học Sài Gòn (SGU).
- **Chuyên đề đã chọn:** **1. FE DEV (React Native + React.js) chuyên nghiệp xử lý giao diện (trên Web, Mobile) bao gồm CI/CD**.
- **Nhóm thực hiện:** Nguyễn Trí Cường, Nguyễn Hoài Quân, Đặng Phú Thành.
- **Giảng viên hướng dẫn:** TS. Nguyễn Quốc Huy.

---

## 2. Yêu cầu về Sản phẩm Phần mềm

### 2.1. Phân hệ Khách tham quan (Visitor) — Web SPA + Android Mobile App
- **Không rào cản:** Khách tham quan không cần đăng ký hoặc đăng nhập.
- **Đa ngôn ngữ 5 thứ tiếng:** `vi` (Tiếng Việt), `en` (English), `zh` (中文), `ko` (한국어), `ja` (日本語), chuyển đổi tức thì không tải lại trang/app.
- **Quét mã QR (`UC02`):** Giải mã URL (`?artifact=<id|code>`, `?entry=gate`) hoặc mã thô; có ô nhập mã thủ công dự phòng.
- **Định vị Geofencing (`UC14`):** Theo dõi GPS độ chính xác cao, tính khoảng cách Haversine với bán kính kích hoạt mặc định **15m**, lọc sai số `> 150m`; tự động gợi ý chuyển bài (`switch`) hoặc nghe lại (`replay`).
- **Phát Audio & Phụ đề đồng bộ (`UC03`, `UC07`):** Tua thời gian, tốc độ `1x / 1.25x / 1.5x / 2x`, hiển thị phụ đề karaoke theo mốc giây.
- **Mobile App (`mobile/` — Expo React Native):** Đóng gói toàn bộ audio, ảnh, bản đồ vào APK để **chạy offline hoàn toàn**; khi có mạng tự đồng bộ dữ liệu mới và gửi telemetry về Backend.
- **Sơ đồ tầng, Tìm kiếm & Yêu thích (`UC05`, `UC06`, `UC08`):** Sơ đồ tầng có ghim tọa độ `(X, Y)` và vòng tròn "Bạn đang ở đây"; lưu yêu thích cục bộ (`localStorage` / `AsyncStorage`).

### 2.2. Phân hệ Quản trị (Admin CMS) — Web (`/admin`)
- **Bảo mật (`UC01`):** Đăng nhập JWT, khóa tạm thời nếu nhập sai quá 5 lần (5 phút ở Frontend, 1 phút ở Backend).
- **Quản lý nội dung (`UC09`, `UC11`, `UC13`):** CRUD hiện vật 5 ngôn ngữ (hỗ trợ dịch tự động Google Translate / MyMemory), upload ảnh (`<= 10MB`), upload audio (`<= 30MB`), biên tập phụ đề, kéo thả ghim vị trí `(X, Y)` trên sơ đồ tầng.
- **Vận hành & Thống kê (`UC10`, `UC12`):** Theo dõi thiết bị online theo thời gian thực, sinh mã QR cổng/hiện vật (PNG), biểu đồ thống kê và xuất CSV.

### 2.3. Backend & Cơ sở dữ liệu (`backend/`)
- Node.js + Express + TypeScript kết nối Microsoft SQL Server (MSSQL) gồm **12 bảng** chuẩn hóa (`schema.sql`), hỗ trợ chạy độc lập qua Docker Compose (`frontend` + `backend` + `host MSSQL`).

---

## 3. Yêu cầu về CI/CD (GitHub Actions)
1. **Web Demo (`deploy.yml`):** Lint, Test (Vitest), Build và triển khai lên **GitHub Pages**.
2. **Docker (`docker.yml`):** Build và đẩy đồng thời image **Frontend** và **Backend** lên **GHCR**.
3. **Mobile (`mobile.yml`):** Lint, Typecheck, Test (Jest), build **Android APK** (`museum-audio-guide.apk`) và đính kèm **GitHub Release** khi gắn tag `v*`.

---

## 4. Yêu cầu về Hồ sơ Thiết kế & Tài liệu (`docs/`)
- **Phạm vi Use Case:** Chốt cứng **14 Use Cases** (`UC01`–`UC14`), không quay lại 20 UC.
- **Quy chuẩn vẽ:** Giữ đúng phong cách và quy luật vẽ chuẩn mực của phiên bản **V0**; phiên bản **V3** phải phản ánh chính xác 100% mã nguồn thực tế (kèm bảng đối chiếu [AUDIT_V3.md](./docs/design/audit/AUDIT_V3.md)).
- **Các loại sơ đồ bắt buộc:**
  1. Use Case Tổng quát & Đặc tả 14 UC (`OverviewUCv3.puml`, `UCv3.md`)
  2. Activity Diagrams cho 14 UC (`docs/design/use-cases/v3/activity/`)
  3. Component Diagram (`ComponentDiagramV3.puml`)
  4. Deployment Diagram (`DeployDiagramV3.puml`)
  5. ERD (`ErdV3.puml` — khớp 12 bảng `schema.sql`)
  6. **DFD — Data Flow Diagram** (`DFD_Level0.puml`, `DFD_Level1.puml`, `DFD_Level2_Geofence.puml`, `DFD.md`) — yêu cầu bổ sung của Giảng viên.
- **Bảo toàn phiên bản cũ:** Giữ nguyên toàn bộ tài liệu V0–V2.
