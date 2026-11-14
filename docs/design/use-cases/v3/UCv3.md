# Đặc Tả Use Case Chi Tiết — Phiên Bản V3 (Khớp 100% Mã Nguồn Web & Android)

> Tài liệu này chuẩn hóa **14 Use Case trọng tâm** theo đúng logic đang chạy trong `frontend/`, `mobile/` và `backend/` (xem chi tiết các điểm đã đối chiếu tại [AUDIT_V3.md](../../audit/AUDIT_V3.md)).

## Danh Sách Tác Nhân (Actors)
| Tác nhân | Mô tả |
| :--- | :--- |
| **Khách tham quan** | Người dùng phổ thông truy cập Web SPA hoặc Android App (`museum-audio-guide.apk`), **không cần đăng nhập**. |
| **Quản trị viên (Admin)** | Nhân viên bảo tàng đăng nhập vào phân hệ `/admin` trên Web CMS. |
| **Hệ thống định vị GPS** | Cảm biến vị trí thiết bị (`Geolocation API` trên Web / `expo-location` trên Android). |
| **Thiết bị phát âm thanh** | Trình phát âm thanh (`HTML5 Audio + Web Speech fallback` trên Web / `expo-audio` với file đóng gói offline trên Android). |

---

## UC01 — Đăng nhập quản trị
- **Tác nhân:** Quản trị viên (Admin) | **Nền tảng:** Web (`/admin/login`)
- **Mô tả:** Xác thực tài khoản quản trị bằng Email và Mật khẩu để truy cập CMS.
- **Dòng sự kiện chính:**
  1. Admin mở trang `/admin/login`.
  2. Hệ thống kiểm tra trạng thái khóa tạm thời trong `localStorage` (`loginLock.ts`).
  3. Admin nhập Email (`admin@museum.vn`) và Mật khẩu, nhấn Đăng nhập.
  4. Hệ thống gửi `POST /api/auth/login` (hoặc kiểm tra tài khoản demo nếu ở chế độ offline).
  5. Backend kiểm tra `AdminUser.LockedUntil`, đối chiếu `bcryptjs`, cấp JWT Token và trả về `{ token, username, role }`.
  6. Hệ thống chuyển hướng vào `/admin`.
- **Ngoại lệ:**
  - **E1 (Sai thông tin):** Nhập sai quá **5 lần** liên tiếp → Frontend khóa form **5 phút** (`300.000 ms` trong `localStorage`), Backend khóa tài khoản **1 phút** (`60.000 ms` trong `AdminUser.LockedUntil`, trả HTTP `429`).

## UC02 — Quét mã QR
- **Tác nhân:** Khách tham quan | **Nền tảng:** Web (`html5-qrcode`) & Android (`expo-camera`)
- **Dòng sự kiện chính:**
  1. Khách mở tính năng Quét mã QR (trên Android lần đầu sẽ xin quyền Camera).
  2. Khách hướng camera vào mã QR cổng bảo tàng hoặc tủ hiện vật.
  3. Hệ thống giải mã chuỗi qua `parseQrPayload()`:
     - Link chứa `?artifact=<id|code>` hoặc chuỗi mã/ID thô → đặt làm mốc neo (`anchorArtifactId`), bật theo dõi GPS (`hasScannedQr = true`), mở chi tiết và tự phát thuyết minh hiện vật đó.
     - Link chứa `?entry=gate` → bật chế độ tự động thuyết minh theo GPS (`startTracking(null)`).
- **Thay thế / Ngoại lệ:**
  - **A1 (Nhập mã thủ công):** Nếu thiết bị không có camera hoặc từ chối quyền Camera, khách nhập mã hiện vật (VD: `WRM001`, `AIR-F5A`) vào ô nhập tay.
  - **E1 (QR không hợp lệ):** Không khớp hiện vật nào → hiển thị thông báo lỗi và cho phép quét lại.

## UC03 — Nghe thuyết minh
- **Tác nhân:** Khách tham quan, Thiết bị phát âm thanh | **Nền tảng:** Web & Android
- **Dòng sự kiện chính:**
  1. Khách nhấn nút Nghe thuyết minh trên thẻ hiện vật hoặc màn hình chi tiết.
  2. Hệ thống dừng mọi bài đang phát trước đó (tránh chồng tiếng).
  3. Hệ thống nạp tệp âm thanh theo ngôn ngữ hiện tại (ưu tiên `audio[lang]`, fallback `audio['vi']`):
     - Trên **Android**: phát trực tiếp từ file `.mp3` đóng gói sẵn trong APK (`assetMap.ts`), hỗ trợ phát nền khi tắt màn hình.
     - Trên **Web**: phát qua HTML5 Audio (kèm fallback Web Speech TTS nếu thiếu tệp).
  4. Khách có thể Tạm dừng/Tiếp tục, Tua thanh thời gian, đổi tốc độ (`1x`, `1.25x`, `1.5x`, `2x`).
  5. Nếu có mạng, hệ thống gửi `POST /api/analytics/listen` ghi nhận lượt nghe.

## UC04 — Chuyển đổi ngôn ngữ
- **Tác nhân:** Khách tham quan | **Nền tảng:** Web & Android
- **Dòng sự kiện chính:**
  1. Khách nhấn nút chọn ngôn ngữ trên thanh tiêu đề.
  2. Chọn 1 trong 5 ngôn ngữ: Tiếng Việt (`vi`), English (`en`), 中文 (`zh`), 한국어 (`ko`), 日本語 (`ja`).
  3. Hệ thống cập nhật `i18next` + lưu vào `localStorage` / `AsyncStorage` ngay lập tức (không tải lại trang), đồng thời chuyển tiêu đề, mô tả, âm thanh và phụ đề sang ngôn ngữ mới.

## UC05 — Lưu hiện vật yêu thích
- **Tác nhân:** Khách tham quan | **Nền tảng:** Web & Android
- **Dòng sự kiện chính:**
  1. Khách nhấn biểu tượng Trái tim trên hiện vật.
  2. Hệ thống lưu danh sách ID hiện vật vào `localStorage` (`user_favorites`, Web) hoặc `AsyncStorage` (Android).
  3. Khách mở tab **Yêu thích** để xem lại hoặc nghe nhanh. Khi nạp dữ liệu bảo tàng, các ID không còn tồn tại sẽ tự động được dọn sạch (`cleanInvalidFavorites`).

## UC06 — Xem hồ sơ bảo tàng
- **Tác nhân:** Khách tham quan | **Nền tảng:** Web & Android
- **Dòng sự kiện chính:**
  1. Khách mở tab **Thông tin**.
  2. Hệ thống hiển thị ảnh banner, tên bảo tàng, địa chỉ, giờ mở cửa, mô tả giới thiệu (theo ngôn ngữ đang chọn) và số Hotline (trên Android nhấn vào số sẽ mở trình gọi điện).

## UC07 — Xem phụ đề đồng bộ (`<<extend>>` UC03)
- **Tác nhân:** Khách tham quan | **Nền tảng:** Web & Android
- **Dòng sự kiện chính:**
  1. Khi âm thanh đang phát và bật chế độ phụ đề (`showSubtitle = true`), hệ thống đối chiếu `currentTime` với mảng `subtitles[lang]` (`start <= currentTime <= end`).
  2. Hiển thị câu phụ đề hiện tại nổi bật (karaoke) trên thanh phát và trong danh sách phụ đề ở màn hình chi tiết.
  3. Khách có thể chạm vào bất kỳ mốc câu nào để tua âm thanh đến đúng giây đó.

## UC08 — Tìm kiếm hiện vật
- **Tác nhân:** Khách tham quan | **Nền tảng:** Web & Android
- **Dòng sự kiện chính:**
  1. Tại tab **Khám phá**, khách nhập từ khóa vào ô tìm kiếm và/hoặc chọn bộ lọc theo tầng.
  2. Hệ thống lọc tức thì danh sách hiện vật khớp theo tiêu đề, mô tả (theo ngôn ngữ đang chọn) hoặc mã hiện vật (`code`).

## UC09 — Quản lý hiện vật
- **Tác nhân:** Quản trị viên (`<<include>>` UC01) | **Nền tảng:** Web (`/admin/artifacts`)
- **Dòng sự kiện chính:**
  1. Admin xem danh sách hiện vật, thêm mới, chỉnh sửa hoặc xóa hiện vật.
  2. Hỗ trợ nhập/dịch tự động tiêu đề & mô tả sang 5 ngôn ngữ qua `POST /api/translate/batch` (Google Translate / MyMemory fallback).
  3. Upload hình ảnh (≤ 10MB) qua `POST /api/uploads/image` và lưu dữ liệu qua `POST/PUT/DELETE /api/artifacts/:id`.

## UC10 — Quản lý phiên tham quan & Mã QR
- **Tác nhân:** Quản trị viên (`<<include>>` UC01) | **Nền tảng:** Web (`/admin`, `/admin/sessions`, `/admin/artifacts`)
- **Dòng sự kiện chính:**
  1. Hệ thống tự động nhận heartbeat phiên từ Web & Android App mỗi 10–15 giây (`POST /api/sessions/heartbeat`, timeout hiển thị 35 giây).
  2. Admin theo dõi danh sách thiết bị đang hoạt động theo thời gian thực (`GET /api/sessions/active`), tạo/quản lý thông tin ca/đoàn tham quan.
  3. Admin sinh mã QR cho cổng bảo tàng và từng hiện vật bằng thư viện `qrcode`, tải ảnh PNG để in ấn.

## UC11 — Quản lý tệp âm thanh
- **Tác nhân:** Quản trị viên (`<<include>>` UC01) | **Nền tảng:** Web (`/admin/audio`)
- **Dòng sự kiện chính:**
  1. Admin chọn hiện vật và ngôn ngữ cần cập nhật âm thanh.
  2. Tải lên tệp âm thanh (`audio/*`, giới hạn Backend **≤ 30MB**, Nginx `client_max_body_size 35m`) qua `POST /api/uploads/audio`.
  3. Nghe thử trực tiếp và biên tập các mốc phụ đề (`SubtitleCue`: `start`, `end`, `text`).

## UC12 — Xem thống kê lượt nghe
- **Tác nhân:** Quản trị viên (`<<include>>` UC01) | **Nền tảng:** Web (`/admin`, `/admin/analytics`)
- **Dòng sự kiện chính:**
  1. Admin mở trang Thống kê để xem tổng lượt nghe, số khách duy nhất, biểu đồ xu hướng theo ngày/giờ, tỷ lệ ngôn ngữ (Donut Chart) và top hiện vật (Bar Chart) từ `GET /api/analytics/events` & `/summary`.
  2. Admin có thể xuất báo cáo ra file CSV hoặc xóa dữ liệu sự kiện thử nghiệm (`DELETE /api/analytics/events`).

## UC13 — Quản lý sơ đồ tầng
- **Tác nhân:** Quản trị viên (`<<include>>` UC01) | **Nền tảng:** Web (`/admin/maps`)
- **Dòng sự kiện chính:**
  1. Admin chọn tầng cần biên tập, có thể tải lên ảnh mặt bằng mới (`PUT /api/floors/:id`).
  2. Nhấp chuột hoặc kéo thả ghim vị trí hiện vật để cập nhật tọa độ `(mapCoordinates.x, mapCoordinates.y)` và tọa độ GPS / bán kính kích hoạt.

## UC14 — Định vị vị trí & Tự động thuyết minh (`<<extend>>` UC03)
- **Tác nhân:** Khách tham quan, Hệ thống định vị GPS | **Nền tảng:** Web & Android
- **Dòng sự kiện chính:**
  1. Hệ thống yêu cầu quyền vị trí và theo dõi GPS độ chính xác cao (`enableHighAccuracy` / `Location.Accuracy.High`).
  2. Nếu sai số `accuracy <= 150m`, tính khoảng cách Haversine đến tất cả hiện vật có `geoCoordinates`.
  3. Xác định hiện vật gần nhất có `distance <= triggerRadius` (mặc định **15m**).
  4. Cập nhật điểm "Bạn đang ở đây" trên sơ đồ tầng (`anchorArtifactId`).
  5. Nếu khách đã quét mã QR khởi động (`hasScannedQr = true`):
     - Đang phát bài khác → hiện hộp thoại gợi ý chuyển bài (`switch`).
     - Đã nghe hiện vật này trong phiên → hiện hộp thoại gợi ý nghe lại (`replay`).
     - Chưa nghe và không phát bài khác → tự động phát thuyết minh (UC03).
- **Ngoại lệ:**
  - **E1 (Từ chối quyền / Tắt GPS):** Hiển thị thông báo hướng dẫn dùng Quét QR hoặc Tìm kiếm; nếu có điểm neo QR thì gợi ý hiện vật gần nhất theo khoảng cách bản đồ (`0.15 m/pixel`).
  - **E2 (Sai số > 150m):** Chuyển trạng thái `low-accuracy`, không tự động kích hoạt phát.
