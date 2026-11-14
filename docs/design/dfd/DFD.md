# Đặc Tả Sơ Đồ Luồng Dữ Liệu (Data Flow Diagram — DFD)

Bộ sơ đồ DFD mô tả luồng di chuyển dữ liệu của **Hệ thống Thuyết minh Tự động Đa ngôn ngữ** (bao gồm **Web SPA**, **Android App** và **Backend MSSQL**).

## 1. DFD Mức 0 — Sơ đồ Ngữ cảnh ([DFD_Level0.puml](./DFD_Level0.puml))
- **Thực thể ngoài (External Entities):**
  - **Khách tham quan:** Truy cập qua trình duyệt Web hoặc ứng dụng Android (không cần đăng nhập).
  - **Quản trị viên:** Truy cập cổng `/admin` trên Web để quản trị nội dung và xem thống kê.
  - **Hệ thống định vị GPS:** Cung cấp tọa độ địa lý `(latitude, longitude)` và sai số (`accuracy`).
  - **Dịch vụ dịch thuật ngoài:** Google Translate API & MyMemory API dùng cho chức năng tự động dịch 5 ngôn ngữ ở Admin.

## 2. DFD Mức 1 — Phân rã 6 tiến trình chính ([DFD_Level1.puml](./DFD_Level1.puml))

| Mã | Tiến trình | Use Case liên quan | Mô tả luồng dữ liệu |
| :--- | :--- | :--- | :--- |
| **1.0** | Quản lý xác thực Quản trị | UC01 | Nhận email/mật khẩu, đối chiếu `AdminUser` (`bcryptjs`), khóa tạm thời khi sai ≥ 5 lần (1 phút ở backend, 5 phút ở frontend), cấp JWT Token. |
| **2.0** | Khám phá, Quét QR & Định vị Geofence | UC02, UC06, UC08, UC14 | Đọc dữ liệu bảo tàng/hiện vật/sơ đồ từ `D2`, giải mã QR (`?artifact=`, `?entry=gate`, hoặc mã thô), tính khoảng cách Haversine từ GPS và hiển thị vị trí lên sơ đồ. |
| **3.0** | Phát thuyết minh, Phụ đề & Đa ngôn ngữ | UC03, UC04, UC07 | Đọc ngôn ngữ ưu tiên (`vi/en/zh/ko/ja`), nạp âm thanh (`D3`: file đóng gói trong APK hoặc `/uploads`) cùng `SubtitleCue`, phát đồng bộ và gửi `ListenEvent` sang `6.0`. |
| **4.0** | Quản lý yêu thích | UC05 | Đọc/ghi danh sách ID hiện vật yêu thích cục bộ vào `localStorage` (Web) hoặc `AsyncStorage` (Android). |
| **5.0** | Quản trị hiện vật, Sơ đồ, Âm thanh & Dịch | UC09, UC11, UC13 | Admin CRUD hiện vật, kéo thả tọa độ `(X, Y)` trên sơ đồ tầng, upload âm thanh (≤ 30MB) / ảnh (≤ 10MB) và gọi API dịch tự động. |
| **6.0** | Ghi nhận phiên, Sinh QR & Thống kê | UC10, UC12 | Nhận heartbeat phiên tham quan (`10–15s`), lưu `VisitorSession` & `ListenEvent` vào MSSQL (`D5`), tổng hợp biểu đồ và xuất báo cáo CSV, sinh mã QR cổng/hiện vật. |

## 3. DFD Mức 2 — Chi tiết Định vị Geofence & Phát thuyết minh ([DFD_Level2_Geofence.puml](./DFD_Level2_Geofence.puml))
Phân rã tiến trình **2.0** và **3.0** thành 4 tiến trình con (`2.1` → `2.2` → `2.3` → `3.1`) khớp đúng với `geofence.ts`, `qrHelper.ts`, `VisitorLayout.tsx` (Web) và `MuseumDataContext.tsx` (Mobile):
1. **2.1:** Giải mã QR hoặc nhập mã thủ công, đặt `hasScannedQr = true` và `anchorArtifactId`.
2. **2.2:** Lọc tín hiệu GPS có `accuracy <= 150m`, tính khoảng cách Haversine tới các hiện vật.
3. **2.3:** Kiểm tra ngưỡng `distance <= triggerRadius` (mặc định **15m**). Nếu đang nghe bài khác → gợi ý chuyển (`switch`); nếu đã nghe trong phiên → gợi ý nghe lại (`replay`); ngược lại → tự động phát.
4. **3.1:** Phát âm thanh theo ngôn ngữ đang chọn, đồng bộ phụ đề karaoke và ghi nhận `ListenEvent`.
