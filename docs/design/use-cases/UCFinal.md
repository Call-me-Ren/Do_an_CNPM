# Đặc Tả 14 Use Case Chuẩn Hóa — Phiên Bản Hoàn Thiện (Final)

> **Dự án:** Hệ thống Thuyết minh Tự động Đa ngôn ngữ (Museum Multilingual Smart Audio Guide)  
> **Bộ môn:** Công nghệ Phần mềm — Trường Đại học Sài Gòn (SGU)  
> **Căn cứ thiết kế:** [AUDIT_V3.md](../../audit/AUDIT_V3.md), [v3_vs_v2_use_case_analysis.md](../v3_vs_v2_use_case_analysis.md), [Context.md](../../requirements/Context.md)  
> **Mã nguồn đồng bộ:** Web SPA (`frontend/`), Android App Offline-First (`mobile/`), REST API & MSSQL (`backend/`)

---

## Danh Sách Tác Nhân Hệ Thống (Actors)

| Tác nhân | Phân loại | Mô tả vai trò & phạm vi hoạt động |
| :--- | :--- | :--- |
| **Khách tham quan** (`Visitor`) | Tác nhân con người (Human) | Người dùng phổ thông trải nghiệm bảo tàng qua Web SPA hoặc Android App (`museum-audio-guide.apk`). **Tuyệt đối không bắt buộc đăng nhập hay đăng ký tài khoản**. Có quyền tra cứu, quét mã QR, nghe thuyết minh 5 ngôn ngữ, xem phụ đề, xem hồ sơ bảo tàng và lưu hiện vật yêu thích. |
| **Quản trị viên** (`Admin`) | Tác nhân con người (Human) | Nhân sự vận hành bảo tàng. Xác thực qua biểu mẫu `/admin/login` trên Web CMS. Có quyền quản lý hiện vật, bản dịch, sơ đồ tầng, tệp âm thanh, phiên tham quan và xem báo cáo thống kê. |
| **Hệ thống định vị GPS** (`GpsSystem`) | Tác nhân cảm biến (Sensor) | Cảm biến GPS phần cứng trên thiết bị di động của khách và API Geolocation của trình duyệt (`navigator.geolocation` / `expo-location`). Cung cấp định kỳ tọa độ `(latitude, longitude, accuracy)`. |
| **Hệ thống âm thanh** (`AudioSystem`) | Tác nhân hệ thống ngoài (System) | Hạ tầng cung cấp và kết xuất âm thanh: Trên Android là Audio Engine ngoại vi của hệ điều hành phát tệp MP3 đóng gói sẵn trong bộ cài APK; trên Web là HTML5 Web Audio API / luồng âm thanh tĩnh từ máy chủ và Web Speech API (fallback). |

---

## Mục Lục 14 Use Cases Chuẩn Hóa

- **Phân hệ Quản trị (Admin CMS):**
  - [UC01: Đăng nhập quản trị](#uc01--đăng-nhập-quản-trị)
  - [UC09: Quản lý hiện vật](#uc09--quản-lý-hiện-vật)
  - [UC10: Quản lý phiên & Mã QR](#uc10--quản-lý-phiên--mã-qr)
  - [UC11: Quản lý tệp âm thanh](#uc11--quản-lý-tệp-âm-thanh)
  - [UC12: Xem thống kê lượt nghe](#uc12--xem-thống-kê-lượt-nghe)
  - [UC13: Quản lý sơ đồ tầng](#uc13--quản-lý-sơ-đồ-tầng)
- **Phân hệ Khách tham quan (Visitor Web & Mobile App):**
  - [UC02: Quét mã QR](#uc02--quét-mã-qr)
  - [UC03: Nghe thuyết minh](#uc03--nghe-thuyết-minh)
  - [UC04: Chuyển đổi ngôn ngữ](#uc04--chuyển-đổi-ngôn-ngữ)
  - [UC05: Lưu hiện vật yêu thích](#uc05--lưu-hiện-vật-yêu-thích)
  - [UC06: Xem hồ sơ bảo tàng](#uc06--xem-hồ-sơ-bảo-tàng)
  - [UC07: Xem phụ đề đồng bộ](#uc07--xem-phụ-đề-đồng-bộ)
  - [UC08: Tìm kiếm hiện vật](#uc08--tìm-kiếm-hiện-vật)
  - [UC14: Định vị & Tự động thuyết minh](#uc14--định-vị--tự-động-thuyết-minh)

---

## Chi Tiết Đặc Tả 14 Use Cases

### UC01 — Đăng nhập quản trị
- **Mã định danh:** `UC01` | **Mức độ hoàn thiện:** Focused
- **Tác nhân:** Quản trị viên (`Admin`) | **Nền tảng:** Web (`/admin/login`)
- **Mô tả tóm tắt:** Xác thực danh tính của Quản trị viên bằng Email và Mật khẩu để phân quyền truy cập Dashboard CMS. Hệ thống áp dụng cơ chế bảo mật khóa 2 tầng nhằm ngăn chặn tấn công dò mật khẩu (Brute Force).
- **Điều kiện tiên quyết:** Quản trị viên chưa đăng nhập hoặc phiên làm việc đã hết hạn.
- **Sự kiện kích hoạt (Trigger):** Quản trị viên truy cập đường dẫn `/admin/login`.
- **Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| :--- | :--- |
| 1. Admin mở trang đăng nhập `/admin/login`. | 2. Frontend kiểm tra trạng thái khóa tạm thời trong `localStorage` (`loginLock.ts`). Nếu đang bị khóa, hiển thị bộ đếm ngược thời gian còn lại (E1). |
| 3. Admin nhập Email (`admin@museum.vn`) và Mật khẩu, nhấn "Đăng nhập". | 4. Frontend gửi yêu cầu xác thực `POST /api/auth/login`. |
| | 5. Backend kiểm tra tài khoản: đối chiếu `AdminUser.LockedUntil`, băm mật khẩu `bcryptjs`. |
| | 6. Backend reset bộ đếm thất bại (`FailedAttempts = 0`), cấp JWT Token chứa thông tin phân quyền. |
| | 7. Frontend lưu Token vào `localStorage` và chuyển hướng vào Dashboard quản trị. |

- **Luồng ngoại lệ:**
  - **E1 (Sai thông tin đăng nhập):** Nếu Email hoặc mật khẩu không chính xác:
    - Backend tăng `FailedAttempts`. Nếu sai **5 lần liên tiếp**, Backend cập nhật `AdminUser.LockedUntil = NOW + 1 phút` (`LOCK_MS = 60_000`) và trả về HTTP `429 Too Many Requests`.
    - Đồng thời, Frontend ghi nhận vào `localStorage` (`admin_login_lock_v1`), kích hoạt khóa biểu mẫu đăng nhập trong **5 phút** (`LOCK_DURATION_MS = 300_000`), vô hiệu hóa nút đăng nhập và hiển thị đồng hồ đếm ngược.
- **Điều kiện kết thúc:**
  - *Thành công:* Phiên làm việc được thiết lập, Admin được chuyển vào trang Dashboard.
  - *Thất bại:* Từ chối đăng nhập, hiển thị thông báo lỗi hoặc khóa biểu mẫu tạm thời.
- **Ánh xạ mã nguồn:** `frontend/src/shared/utils/loginLock.ts`, `backend/src/routes/auth.ts`, `backend/src/repositories/adminRepo.ts`.

---

### UC02 — Quét mã QR
- **Mã định danh:** `UC02` | **Mức độ hoàn thiện:** Focused
- **Tác nhân:** Khách tham quan (`Visitor`) | **Nền tảng:** Web (`html5-qrcode`) & Android (`expo-camera`)
- **Mô tả tóm tắt:** Khách tham quan sử dụng camera thiết bị di động quét mã QR gắn tại cổng đón tiếp hoặc tủ trưng bày hiện vật. Hệ thống tự động phân tích URL payload để mở chi tiết hiện vật hoặc kích hoạt định vị.
- **Điều kiện tiên quyết:** Thiết bị có camera; khách cấp quyền truy cập camera (hoặc dùng luồng nhập tay A1).
- **Sự kiện kích hoạt (Trigger):** Khách nhấn vào nút "Quét QR" trên giao diện.
- **Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| :--- | :--- |
| 1. Khách bấm nút "Quét QR". | 2. Hệ thống kiểm tra và xin quyền Camera (`expo-camera` trên Android / `html5-qrcode` trên Web). |
| 3. Khách hướng camera vào mã QR. | 4. Camera thu nhận khung hình và giải mã chuỗi ký tự qua hàm `parseQrPayload()`. |
| | 5. **Trường hợp mã hiện vật** (`?artifact=<id|code>` hoặc chuỗi mã thô):<br>- Thiết lập mốc neo xuất phát (`anchorArtifactId = artifact.id`).<br>- Đánh dấu đã quét mã (`hasScannedQr = true`) và kích hoạt định vị nền.<br>- Tự động mở màn hình chi tiết hiện vật và kích hoạt phát thuyết minh (UC03). |
| | 6. **Trường hợp mã cổng bảo tàng** (`?entry=gate`):<br>- Đánh dấu đã quét mã (`hasScannedQr = true`).<br>- Kích hoạt chế độ tự động định vị theo GPS (`startTracking(null)`). |

- **Luồng thay thế:**
  - **A1 (Nhập mã hiện vật thủ công):** Nếu camera hỏng hoặc khách từ chối cấp quyền camera, hệ thống hiển thị ô nhập mã hiện vật (ví dụ: `WRM001`, `AIR-F5A`). Khách nhập mã và nhấn "Tìm kiếm" để mở thẳng hiện vật tương ứng.
- **Luồng ngoại lệ:**
  - **E1 (Mã QR không hợp lệ):** Nội dung QR không khớp với bất kỳ hiện vật hay cổng đón tiếp nào trong cơ sở dữ liệu → Hệ thống hiển thị thông báo cảnh báo và cho phép quét lại.
- **Điều kiện kết thúc:**
  - *Thành công:* Nhận diện thành công hiện vật, mốc neo được thiết lập và bài thuyết minh được phát.
  - *Thất bại:* Hiển thị thông báo lỗi, giữ nguyên giao diện quét để thử lại.
- **Ánh xạ mã nguồn:** `frontend/src/shared/utils/qrHelper.ts`, `frontend/src/visitor/views/QRScannerModal.tsx`, `mobile/src/shared/utils/qrHelper.ts`, `mobile/app/scanner.tsx`.

---

### UC03 — Nghe thuyết minh
- **Mã định danh:** `UC03` | **Mức độ hoàn thiện:** Focused
- **Tác nhân:** Khách tham quan (`Visitor`), Hệ thống âm thanh (`AudioSystem`) | **Nền tảng:** Web & Android
- **Mô tả tóm tắt:** Phát bài thuyết minh âm thanh chất lượng cao của hiện vật theo ngôn ngữ hiện tại của khách. Hỗ trợ đầy đủ bộ điều khiển (Pause, Resume, Seekbar, Tốc độ 1x–2x), phát nền khi tắt màn hình (Android) và phụ đề đồng bộ (UC07).
- **Điều kiện tiên quyết:** Hiện vật có dữ liệu âm thanh hoặc văn bản thuyết minh.
- **Sự kiện kích hoạt (Trigger):** Khách nhấn nút "Nghe thuyết minh" hoặc do hệ thống tự động kích hoạt từ UC02 / UC14.
- **Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| :--- | :--- |
| 1. Khách nhấn "Nghe thuyết minh" (hoặc tự động kích hoạt). | 2. Hệ thống dừng mọi bài thuyết minh đang phát trước đó để tránh chồng chéo âm thanh. |
| | 3. Hệ thống xác định ngôn ngữ hiện tại (`vi`, `en`, `zh`, `ko`, `ja`).<br>- **Trên Android App:** Nạp tệp MP3 đóng gói sẵn từ APK (`assetMap.ts`) và phát qua `expo-audio` (hỗ trợ phát nền khi khóa màn hình).<br>- **Trên Web SPA:** Tải luồng âm thanh qua Web Audio API từ `/uploads/audio/` (fallback Web Speech TTS nếu thiếu tệp MP3). |
| 4. Khách nghe thuyết minh và tương tác thanh điều khiển: Tạm dừng/Tiếp tục, Tua thời gian, Chỉnh tốc độ (`1x`, `1.25x`, `1.5x`, `2x`). | 5. Hệ thống phản hồi tức thì các thao tác điều khiển, đồng thời đồng bộ vị trí chạy của phụ đề karaoke (UC07). |
| | 6. Khi bắt đầu phát, hệ thống gửi yêu cầu bất đồng bộ `POST /api/analytics/listen` để ghi nhận sự kiện (nếu có mạng). |
| 7. Bài thuyết minh kết thúc hoặc khách nhấn Đóng trình phát. | 8. Hệ thống dừng phát âm thanh và giải phóng tài nguyên. |

- **Điều kiện kết thúc:**
  - *Thành công:* Bài thuyết minh được phát trọn vẹn, sự kiện nghe được ghi nhận vào cơ sở dữ liệu.
- **Ánh xạ mã nguồn:** `frontend/src/shared/stores/playerStore.ts`, `frontend/src/visitor/components/AudioPlayerBar.tsx`, `mobile/src/shared/stores/playerStore.ts`, `mobile/src/shared/assetMap.ts`.

---

### UC04 — Chuyển đổi ngôn ngữ
- **Mã định danh:** `UC04` | **Mức độ hoàn thiện:** Focused
- **Tác nhân:** Khách tham quan (`Visitor`) | **Nền tảng:** Web & Android
- **Mô tả tóm tắt:** Cho phép khách tham quan chuyển đổi linh hoạt giữa 5 ngôn ngữ (`vi`, `en`, `zh`, `ko`, `ja`) tức thì mà **không cần tải lại trang/ứng dụng** (Zero Page Reload).
- **Điều kiện tiên quyết:** Không có.
- **Sự kiện kích hoạt (Trigger):** Khách chọn biểu tượng chuyển đổi ngôn ngữ trên thanh tiêu đề.
- **Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| :--- | :--- |
| 1. Khách nhấn nút chọn ngôn ngữ. | 2. Hệ thống mở danh sách 5 ngôn ngữ hỗ trợ kèm cờ quốc gia. |
| 3. Khách chọn ngôn ngữ mong muốn (ví dụ: English). | 4. Hệ thống cập nhật kho trạng thái `langStore` và thư viện `i18next`. |
| | 5. Hệ thống lưu thiết lập vào `localStorage` (Web) hoặc `AsyncStorage` (Android). |
| | 6. Toàn bộ tiêu đề, mô tả hiện vật, tệp âm thanh và phụ đề lập tức chuyển sang ngôn ngữ mới mà không tải lại trang. |

- **Điều kiện kết thúc:** Giao diện và dữ liệu đa phương tiện được hiển thị theo đúng ngôn ngữ vừa chọn.
- **Ánh xạ mã nguồn:** `frontend/src/shared/stores/langStore.ts`, `frontend/src/visitor/components/LanguageSwitcher.tsx`, `mobile/src/shared/stores/langStore.ts`.

---

### UC05 — Lưu hiện vật yêu thích
- **Mã định danh:** `UC05` | **Mức độ hoàn thiện:** Focused
- **Tác nhân:** Khách tham quan (`Visitor`) | **Nền tảng:** Web & Android
- **Mô tả tóm tắt:** Cho phép khách đánh dấu hiện vật yêu thích để xem lại nhanh hoặc nghe lại trong suốt chuyến tham quan. Dữ liệu được lưu trữ hoàn toàn cục bộ trên thiết bị của khách.
- **Điều kiện tiên quyết:** Khách đang ở danh sách hiện vật hoặc màn hình chi tiết hiện vật.
- **Sự kiện kích hoạt (Trigger):** Khách bấm vào biểu tượng Trái tim trên thẻ hiện vật.
- **Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| :--- | :--- |
| 1. Khách bấm biểu tượng Trái tim của một hiện vật. | 2. Hệ thống kiểm tra: Nếu hiện vật đã có trong danh sách yêu thích thì xóa khỏi danh sách; nếu chưa có thì thêm vào danh sách. |
| | 3. Hệ thống lưu mảng ID hiện vật vào `localStorage` (`user_favorites`, Web) hoặc `AsyncStorage` (Android). |
| | 4. Cập nhật trạng thái biểu tượng Trái tim (đổi màu nổi bật). |
| 5. Khách mở tab "Yêu thích". | 6. Hệ thống hiển thị danh sách các hiện vật đã lưu. Tự động kiểm tra và loại bỏ các ID mồ côi nếu hiện vật đó đã bị Admin xóa khỏi hệ thống (`cleanInvalidFavorites`). |

- **Điều kiện kết thúc:** Danh mục yêu thích được cập nhật chính xác trên bộ nhớ cục bộ.
- **Ánh xạ mã nguồn:** `frontend/src/visitor/views/FavoritesView.tsx`, `mobile/app/(tabs)/favorites.tsx`.

---

### UC06 — Xem hồ sơ bảo tàng
- **Mã định danh:** `UC06` | **Mức độ hoàn thiện:** Focused
- **Tác nhân:** Khách tham quan (`Visitor`) | **Nền tảng:** Web & Android
- **Mô tả tóm tắt:** Cung cấp thông tin tổng quan về bảo tàng gồm: tên bảo tàng, địa chỉ, giờ mở cửa, số điện thoại Hotline và bài viết giới thiệu lịch sử theo ngôn ngữ đang chọn.
- **Điều kiện tiên quyết:** Không có.
- **Sự kiện kích hoạt (Trigger):** Khách nhấn vào tab "Thông tin" trên thanh điều hướng.
- **Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| :--- | :--- |
| 1. Khách nhấn vào tab "Thông tin". | 2. Hệ thống truy vấn thông tin bảo tàng từ CSDL (`GET /api/museum`) hoặc bộ nhớ đệm offline. |
| | 3. Hiển thị ảnh bìa, tên bảo tàng, địa chỉ, giờ phục vụ và mô tả giới thiệu theo ngôn ngữ đang chọn. |
| 4. Khách bấm vào số Hotline (trên thiết bị di động). | 5. Hệ thống kích hoạt trình quay số điện thoại mặc định của thiết bị di động (`tel:xxxx`). |

- **Điều kiện kết thúc:** Khách nắm được các thông tin hành chính và liên hệ của bảo tàng.
- **Ánh xạ mã nguồn:** `frontend/src/visitor/views/InfoView.tsx`, `mobile/app/(tabs)/info.tsx`.

---

### UC07 — Xem phụ đề đồng bộ
- **Mã định danh:** `UC07` | **Mức độ hoàn thiện:** Focused | **Quan hệ:** `<<extend>> UC03`
- **Tác nhân:** Khách tham quan (`Visitor`) | **Nền tảng:** Web & Android
- **Mô tả tóm tắt:** Hiển thị phụ đề chạy chữ karaoke đồng bộ chính xác từng giây theo giọng đọc thuyết minh. Khách có thể chạm vào bất kỳ câu phụ đề nào để tua âm thanh đến mốc giây tương ứng.
- **Điều kiện tiên quyết:** UC03 đang phát âm thanh và hiện vật có dữ liệu phụ đề (`SubtitleCue`).
- **Sự kiện kích hoạt (Trigger):** Khách bật chế độ xem phụ đề (`showSubtitle = true`).
- **Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| :--- | :--- |
| 1. Khách bật tùy chọn "Phụ đề" trên thanh phát âm thanh. | 2. Hệ thống đối chiếu thời gian phát hiện tại (`currentTime`) với danh sách các mốc câu phụ đề (`start <= currentTime <= end`). |
| | 3. Hiển thị câu phụ đề hiện tại nổi bật (hiệu ứng karaoke) trên thanh phát mini và trong danh sách phụ đề ở màn hình chi tiết. |
| 4. Khách chạm vào một mốc câu phụ đề khác trong danh sách. | 5. Hệ thống tự động tua (`seekToTime`) âm thanh đến mốc giây bắt đầu (`cue.start`) của câu đó và tiếp tục phát. |

- **Điều kiện kết thúc:** Phụ đề hiển thị ăn khớp với âm thanh phát ra.
- **Ánh xạ mã nguồn:** `frontend/src/visitor/components/AudioPlayerBar.tsx`, `mobile/app/artifact/[id].tsx`.

---

### UC08 — Tìm kiếm hiện vật
- **Mã định danh:** `UC08` | **Mức độ hoàn thiện:** Focused
- **Tác nhân:** Khách tham quan (`Visitor`) | **Nền tảng:** Web & Android
- **Mô tả tóm tắt:** Cho phép khách tra cứu hiện vật nhanh chóng bằng từ khóa văn bản (tìm theo tên, mô tả đa ngữ hoặc mã hiện vật như `WRM001`, `AIR-F5A`) kết hợp với bộ lọc theo tầng trưng bày.
- **Điều kiện tiên quyết:** Không có.
- **Sự kiện kích hoạt (Trigger):** Khách nhập ký tự vào ô tìm kiếm tại tab "Khám phá".
- **Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| :--- | :--- |
| 1. Khách mở tab "Khám phá" và nhập từ khóa vào ô tìm kiếm. | 2. Hệ thống lọc danh sách tức thì (real-time filter): khớp chuỗi không dấu, so sánh tiêu đề/mô tả theo ngôn ngữ đang chọn hoặc mã hiện vật. |
| 3. Khách có thể bấm chọn bộ lọc Tầng (ví dụ: Tầng 1, Tầng 2). | 4. Hệ thống kết hợp điều kiện từ khóa và điều kiện tầng để thu hẹp kết quả. |
| 5. Khách chọn một thẻ hiện vật trong danh sách kết quả. | 6. Hệ thống mở màn hình chi tiết hiện vật tương ứng. |

- **Điều kiện kết thúc:** Khách tìm thấy hiện vật mong muốn và mở xem chi tiết.
- **Ánh xạ mã nguồn:** `frontend/src/visitor/views/ExploreView.tsx`, `mobile/app/(tabs)/index.tsx`.

---

### UC09 — Quản lý hiện vật
- **Mã định danh:** `UC09` | **Mức độ hoàn thiện:** Focused | **Quan hệ:** `<<include>> UC01`
- **Tác nhân:** Quản trị viên (`Admin`) | **Nền tảng:** Web (`/admin/artifacts`)
- **Mô tả tóm tắt:** Cung cấp các thao tác thêm mới, chỉnh sửa, xóa và tra cứu danh mục hiện vật. Tích hợp tính năng dịch tự động tiêu đề/mô tả sang 5 ngôn ngữ và upload ảnh đại diện hiện vật (≤ 10MB).
- **Điều kiện tiên quyết:** Quản trị viên đã đăng nhập thành công (UC01).
- **Sự kiện kích hoạt (Trigger):** Admin chọn menu "Hiện vật" trên thanh điều hướng quản trị.
- **Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| :--- | :--- |
| 1. Admin vào trang Quản lý hiện vật (`/admin/artifacts`). | 2. Hệ thống tải và hiển thị bảng danh sách toàn bộ hiện vật (`GET /api/artifacts`). |
| 3. Admin bấm "Thêm hiện vật" hoặc "Chỉnh sửa". | 4. Hệ thống mở biểu mẫu biên tập thông tin hiện vật. |
| 5. Admin nhập tiêu đề và mô tả tiếng Việt, nhấn nút "Dịch tự động". | 6. Hệ thống gửi yêu cầu `POST /api/translate/batch` đến Backend (gọi Google Translate API kèm fallback MyMemory) và điền tự động nội dung dịch sang 4 ngôn ngữ còn lại (`en`, `zh`, `ko`, `ja`). |
| 7. Admin chọn tải lên ảnh hiện vật (định dạng ảnh, dung lượng ≤ 10MB). | 8. Hệ thống gửi `POST /api/uploads/image`, lưu tệp vào `/uploads/images/` và trả về URL ảnh. |
| 9. Admin nhấn "Lưu". | 10. Hệ thống gửi `POST/PUT /api/artifacts/:id` lưu dữ liệu vào CSDL MSSQL và cập nhật lại danh sách. |

- **Luồng ngoại lệ:**
  - **E1 (Ảnh quá dung lượng):** Tệp ảnh vượt quá 10MB → Hệ thống từ chối tải lên và thông báo lỗi.
- **Điều kiện kết thúc:** Hồ sơ hiện vật được tạo mới hoặc cập nhật thành công trong CSDL.
- **Ánh xạ mã nguồn:** `frontend/src/admin/views/ArtifactManageView.tsx`, `backend/src/routes/museum.ts`, `backend/src/routes/translate.ts`, `backend/src/routes/uploads.ts`.

---

### UC10 — Quản lý phiên & Mã QR
- **Mã định danh:** `UC10` | **Mức độ hoàn thiện:** Focused | **Quan hệ:** `<<include>> UC01`
- **Tác nhân:** Quản trị viên (`Admin`) | **Nền tảng:** Web (`/admin/sessions`, `/admin/artifacts`)
- **Mô tả tóm tắt:** Theo dõi danh sách thiết bị/phiên tham quan đang hoạt động trực tuyến qua cơ chế Heartbeat định kỳ, quản lý thông tin ca tham quan và tạo/xuất mã QR đón tiếp, mã QR hiện vật phục vụ in ấn.
- **Điều kiện tiên quyết:** Quản trị viên đã đăng nhập thành công (UC01).
- **Sự kiện kích hoạt (Trigger):** Admin chọn menu "Phiên tham quan" hoặc "Quản lý mã QR".
- **Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| :--- | :--- |
| 1. Admin mở trang "Phiên tham quan". | 2. Hệ thống truy vấn danh sách phiên hoạt động (`GET /api/sessions/active`).<br>*(Client Web & App tự động gửi `POST /api/sessions/heartbeat` mỗi 10–15s; phiên không gửi tín hiệu quá 35s sẽ tự động xem là offline).* |
| 3. Admin có thể tạo ca tham quan mới (mã ca, tên đoàn, số lượng khách dự kiến). | 4. Hệ thống lưu ca tham quan vào CSDL. |
| 5. Admin mở công cụ Quản lý mã QR, chọn cổng bảo tàng hoặc danh sách hiện vật cần in mã. | 6. Hệ thống sử dụng thư viện `qrcode` sinh ảnh mã QR độ phân giải cao, cho phép Admin xem trước và tải tệp PNG về máy để in ấn decal dán lên tủ trưng bày. |

- **Điều kiện kết thúc:** Mã QR được sinh chuẩn xác; trạng thái các phiên tham quan được cập nhật theo thời gian thực.
- **Ánh xạ mã nguồn:** `frontend/src/admin/views/QRManageView.tsx`, `frontend/src/admin/views/SessionManageView.tsx`, `backend/src/routes/analytics.ts`.

---

### UC11 — Quản lý tệp âm thanh
- **Mã định danh:** `UC11` | **Mức độ hoàn thiện:** Focused | **Quan hệ:** `<<include>> UC01`
- **Tác nhân:** Quản trị viên (`Admin`) | **Nền tảng:** Web (`/admin/audio`)
- **Mô tả tóm tắt:** Cho phép tải lên các tệp âm thanh thuyết minh đa ngữ (`.mp3`, `.wav`) với dung lượng **≤ 30MB**, nghe thử trực tiếp và biên tập các mốc phụ đề karaoke (`SubtitleCue`).
- **Điều kiện tiên quyết:** Quản trị viên đã đăng nhập thành công (UC01); hiện vật đã được tạo trong hệ thống.
- **Sự kiện kích hoạt (Trigger):** Admin chọn menu "Tệp âm thanh" trên thanh điều hướng quản trị.
- **Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| :--- | :--- |
| 1. Admin chọn hiện vật và ngôn ngữ cần cập nhật âm thanh. | 2. Hệ thống hiển thị thông tin bài thuyết minh hiện tại và bộ phát nghe thử. |
| 3. Admin chọn tệp âm thanh từ máy tính và nhấn "Tải lên". | 4. Frontend kiểm tra định dạng và gửi `POST /api/uploads/audio`. |
| | 5. Backend kiểm tra giới hạn dung lượng: nếu tệp **≤ 30MB**, lưu vào thư mục `/uploads/audio/` và cập nhật đường dẫn `AudioUrl` vào bảng `ArtifactAudio`. |
| 6. Admin nghe thử âm thanh và nhập/chỉnh sửa danh sách các câu phụ đề kèm mốc giây (`start`, `end`, `text`). | 7. Hệ thống lưu danh sách `SubtitleCue` tương ứng vào CSDL MSSQL. |

- **Luồng ngoại lệ:**
  - **E1 (Tệp vượt dung lượng):** Tệp âm thanh lớn hơn 30MB → Backend từ chối với lỗi HTTP `400` / Nginx trả về `413 Payload Too Large` (với giới hạn `client_max_body_size 35m`).
- **Điều kiện kết thúc:** Tệp âm thanh và danh mục phụ đề được cập nhật hoàn tất.
- **Ánh xạ mã nguồn:** `frontend/src/admin/views/AudioManageView.tsx`, `backend/src/routes/uploads.ts`, `backend/src/repositories/museumRepo.ts`.

---

### UC12 — Xem thống kê lượt nghe
- **Mã định danh:** `UC12` | **Mức độ hoàn thiện:** Focused | **Quan hệ:** `<<include>> UC01`
- **Tác nhân:** Quản trị viên (`Admin`) | **Nền tảng:** Web (`/admin/analytics`)
- **Mô tả tóm tắt:** Cung cấp bảng điều khiển phân tích trực quan: tổng lượt nghe, số lượng khách tham quan duy nhất, biểu đồ xu hướng theo ngày/giờ, biểu đồ tỷ lệ ngôn ngữ (Donut Chart), biểu đồ top hiện vật được nghe nhiều nhất (Bar Chart) và chức năng xuất báo cáo CSV.
- **Điều kiện tiên quyết:** Quản trị viên đã đăng nhập thành công (UC01).
- **Sự kiện kích hoạt (Trigger):** Admin truy cập trang Thống kê (`/admin/analytics`).
- **Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| :--- | :--- |
| 1. Admin truy cập trang "Thống kê". | 2. Hệ thống gọi `GET /api/analytics/events` và `GET /api/analytics/summary`. |
| | 3. Hệ thống hiển thị các thẻ chỉ số KPI tổng quan (Tổng lượt nghe, Khách duy nhất, Thời lượng trung bình) và vẽ các biểu đồ phân tích bằng thư viện Recharts. |
| 4. Admin chọn lọc khoảng thời gian (Hôm nay, 7 ngày qua, 30 ngày qua). | 5. Hệ thống tính toán lại số liệu và vẽ lại biểu đồ tương ứng. |
| 6. Admin nhấn nút "Xuất báo cáo CSV". | 7. Hệ thống chuyển đổi dữ liệu sự kiện nghe thành tệp `.csv` có mã hóa UTF-8 BOM và tự động tải về máy tính của Admin. |

- **Điều kiện kết thúc:** Admin nắm bắt được báo cáo hoạt động và xu hướng tham quan của bảo tàng.
- **Ánh xạ mã nguồn:** `frontend/src/admin/views/AnalyticsView.tsx`, `backend/src/routes/analytics.ts`, `backend/src/repositories/analyticsRepo.ts`.

---

### UC13 — Quản lý sơ đồ tầng
- **Mã định danh:** `UC13` | **Mức độ hoàn thiện:** Focused | **Quan hệ:** `<<include>> UC01`
- **Tác nhân:** Quản trị viên (`Admin`) | **Nền tảng:** Web (`/admin/maps`)
- **Mô tả tóm tắt:** Cho phép quản lý sơ đồ mặt bằng các tầng bảo tàng: tải lên ảnh sơ đồ mới, chỉnh sửa thông số tầng và sử dụng giao diện kéo-thả trực quan để gán tọa độ pixel `(x, y)` cùng tọa độ GPS/bán kích hoạt của hiện vật lên bản đồ.
- **Điều kiện tiên quyết:** Quản trị viên đã đăng nhập thành công (UC01).
- **Sự kiện kích hoạt (Trigger):** Admin chọn menu "Sơ đồ tầng" trên Dashboard quản trị.
- **Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| :--- | :--- |
| 1. Admin chọn tầng cần cấu hình (ví dụ: Tầng 1 - Khu trưng bày hiện đại). | 2. Hệ thống hiển thị ảnh mặt bằng tầng và danh sách các hiện vật thuộc tầng đó. |
| 3. Admin có thể tải lên ảnh mặt bằng mới (`PUT /api/floors/:id`). | 4. Hệ thống lưu ảnh sơ đồ và làm mới khung nhìn bản đồ. |
| 5. Admin dùng chuột kéo ghim biểu tượng hiện vật và thả vào vị trí thực tế trên sơ đồ. | 6. Hệ thống tự động tính toán tọa độ pixel tương đối `(mapCoordinates.x, mapCoordinates.y)`. |
| 7. Admin nhập/chỉnh sửa tọa độ địa lý `(latitude, longitude)` và bán kính kích hoạt riêng (`triggerRadius`, mặc định 15m) của hiện vật. | 8. Hệ thống lưu các thay đổi vào CSDL MSSQL (`PUT /api/artifacts/:id`). |

- **Điều kiện kết thúc:** Bản đồ mặt bằng và vị trí gán của hiện vật được lưu chính xác vào CSDL.
- **Ánh xạ mã nguồn:** `frontend/src/admin/views/MapManageView.tsx`, `backend/src/routes/museum.ts`.

---

### UC14 — Định vị & Tự động thuyết minh
- **Mã định danh:** `UC14` | **Mức độ hoàn thiện:** Focused | **Quan hệ:** `<<extend>> UC03`
- **Tác nhân:** Khách tham quan (`Visitor`), Hệ thống định vị GPS (`GpsSystem`) | **Nền tảng:** Web & Android
- **Mô tả tóm tắt:** Tự động theo dõi vị trí của khách tham quan trong bảo tàng thông qua cơ chế định vị lai (Hybrid Geofencing): Sử dụng mã QR đã quét làm điểm neo xuất phát (`anchorArtifactId`) kết hợp cảm biến GPS độ chính xác cao. Hệ thống tính khoảng cách Haversine tới các hiện vật lân cận, hiển thị chấm halo "Bạn đang ở đây" trên bản đồ tầng và tự động kích hoạt/gợi ý bài thuyết minh khi khách bước vào bán kính kích hoạt (mặc định **15 mét**) mà **không cần quét lại mã QR**.
- **Điều kiện tiên quyết:** Khách đã quét thành công ít nhất một mã QR (làm mốc neo); thiết bị đã bật định vị và cấp quyền GPS.
- **Sự kiện kích hoạt (Trigger):** Tự động kích hoạt sau khi khách quét mã QR cổng hoặc hiện vật (UC02).
- **Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| :--- | :--- |
| 1. Khách di chuyển trong khuôn viên bảo tàng sau khi đã quét mã QR ban đầu (`hasScannedQr = true`). | 2. Cảm biến định vị gửi tọa độ liên tục `(lat, lng, accuracy)` qua `watchPosition`. |
| | 3. Hệ thống kiểm tra: Nếu `accuracy > 150m` → chuyển trạng thái `low-accuracy` và không tự động kích hoạt để tránh phát nhầm (E2). |
| | 4. Nếu `accuracy <= 150m`, hệ thống áp dụng công thức **Haversine** tính khoảng cách thực tế đến tất cả các hiện vật có tọa độ địa lý. |
| | 5. Xác định hiện vật gần nhất có khoảng cách `distance <= triggerRadius` (mặc định **15 mét**). |
| | 6. Cập nhật vị trí mốc "Bạn đang ở đây" trên sơ đồ tầng tương ứng. |
| | 7. Hệ thống xử lý kích hoạt thông minh:<br>- **Nếu đang phát bài khác:** Hiển thị hộp thoại gợi ý chuyển bài (`switch`) kèm tên hiện vật mới.<br>- **Nếu bài này đã nghe trong phiên:** Hiển thị hộp thoại gợi ý nghe lại (`replay`).<br>- **Nếu chưa nghe và không phát bài nào:** Tự động phát bài thuyết minh hiện vật đó (UC03). |

- **Luồng ngoại lệ:**
  - **E1 (Từ chối quyền hoặc mất GPS):** Nếu GPS bị tắt hoặc không có tín hiệu, hệ thống giữ mốc neo QR cuối cùng và sử dụng khoảng cách pixel bản đồ (`MAP_METERS_PER_PIXEL = 0.15` m/px) để đưa ra danh sách gợi ý "Hiện vật gần bạn".
  - **E2 (Sai số GPS quá lớn > 150m):** Chuyển trạng thái `low-accuracy`, tạm dừng tự động phát âm thanh để bảo đảm trải nghiệm nghe của khách.
- **Điều kiện kết thúc:** Khách tham quan được dẫn dắt thuyết minh liên tục và tự nhiên trong suốt hành trình mà không phải lặp lại thao tác quét mã.
- **Ánh xạ mã nguồn:** `frontend/src/shared/utils/geofence.ts`, `frontend/src/shared/stores/geofenceStore.ts`, `mobile/src/shared/utils/geofence.ts`, `mobile/src/shared/stores/geofenceStore.ts`.

---
*Tài liệu đặc tả được biên soạn theo chuẩn kỹ nghệ phần mềm UML 2.5 và khớp 100% mã nguồn thực tế của dự án.*
