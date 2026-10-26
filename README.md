# 🏛️ Hệ Thống Thuyết Minh Tự Động Đa Ngôn Ngữ (Museum Audio Guide)

> **Đồ Án Công Nghệ Phần Mềm — Chuyên Sâu Frontend & CI/CD**  
> Dành cho sinh viên ngành Công nghệ phần mềm / Khoa học máy tính.  
> Ứng dụng Web PWA dành cho khách tham quan bảo tàng tích hợp tự động định vị Geofence, quét mã QR, đồng bộ âm thanh & phụ đề 5 ngôn ngữ, kèm cổng quản trị điều hành theo thời gian thực (Admin Dashboard).

---

## 🌟 Tính Năng Nổi Bật

### 1. Phân Hệ Khách Tham Quan (Visitor PWA Web App - Không Cần Đăng Nhập)
- **Quét mã QR tại cổng hoặc tủ trưng bày:** Sử dụng camera thiết bị để giải mã tức thì ID hiện vật và mở ngay bài thuyết minh tương ứng.
- **Định vị & Kích hoạt tự động (Geofence Engine):** Sử dụng `navigator.geolocation.watchPosition` kết hợp thuật toán tính khoảng cách. Khi du khách đến gần hiện vật trong bán kính 30m, hệ thống tự động highlight và mở bài giới thiệu.
- **Đa ngôn ngữ 5 thứ tiếng (i18n):** Tiếng Việt, English, 中文 (Chinese), 한국어 (Korean), 日本語 (Japanese). Chuyển đổi ngôn ngữ chỉ với một chạm.
- **Trình phát âm thanh & Phụ đề đồng bộ (Audio & Subtitle Sync):** Thanh phát audio cố định ở đáy màn hình, hỗ trợ đổi tốc độ (1x, 1.25x, 1.5x, 2x), tua thanh thời gian và hiển thị phụ đề chạy song song theo từng mốc giây (VTT Subtitles).
- **Sơ đồ bảo tàng tương tác (Floor Map):** Hiển thị mặt bằng các tầng, trực quan hóa vị trí hiện vật qua các điểm ghim tọa độ `(X, Y)`.
- **Lưu danh sách yêu thích:** Lưu cục bộ trên thiết bị qua `localStorage`, giúp khách tham quan đánh dấu các hiện vật ấn tượng để xem lại sau.
- **Hỗ trợ Offline (PWA):** Tích hợp Service Worker và Workbox CacheFirst cho dữ liệu media, giúp app tiếp tục hoạt động mượt mà khi mạng bảo tàng chập chờn.

### 2. Phân Hệ Quản Trị & Vận Hành (Admin Dashboard - Tách Biệt Hoàn Toàn)
- **Đăng nhập quản trị an toàn:** Quản lý quyền truy cập cho nhân viên và ban quản lý (Tài khoản demo: `admin@museum.vn` / `admin123`).
- **Dashboard thời gian thực (Real-time Overview):**
  - **Live Device Counter:** Đếm số thiết bị khách tham quan đang mở web theo thời gian thực.
  - **System Health Panel:** Giám sát độ trễ API, trạng thái máy chủ ứng dụng, cơ sở dữ liệu và media streamer.
  - **Biểu đồ lượt nghe:** Thống kê lượt nghe phân bổ theo từng khung giờ trong ngày.
- **Quản lý hiện vật (CRUD):** Thêm, sửa, xóa thông tin hiện vật kèm tiêu đề và bài mô tả theo 5 ngôn ngữ.
- **Quản lý mã QR:** Tự động sinh mã đồ họa QR cho cổng bảo tàng và từng hiện vật, cho phép tải ảnh PNG chất lượng cao hoặc in trực tiếp.
- **Quản lý tệp âm thanh & Phụ đề:** Tải lên tệp âm thanh (MP3, WAV, AAC &le; 50MB), nghe thử trực tiếp trên dashboard và quản lý các mốc phụ đề đồng bộ.
- **Biên tập sơ đồ (Floor Map Editor):** Nhấp chuột trực tiếp lên sơ đồ để đặt hoặc dời ghim vị trí `(X, Y)` của hiện vật.
- **Quản lý phiên tham quan (Session Management):** Tạo và theo dõi các ca mở cửa, đoàn tham quan chuyên biệt (đoàn ngoại giao, học sinh, v.v.).
- **Báo cáo & Thống kê chuyên sâu (Analytics):**
  - Biểu đồ vùng (Area Chart) xu hướng lượt nghe theo ngày.
  - Biểu đồ tròn (Donut Chart) tỷ lệ ngôn ngữ được sử dụng.
  - Biểu đồ cột (Bar Chart) top 5 hiện vật thu hút khách nhất.
  - Xuất báo cáo ra định dạng file Excel / CSV.

---

## 🏗️ Kiến Trúc Hệ Thống (Tech Stack)

```
Client (Browser / PWA)
  ├── Visitor Web App (React 18 + Vite 6 + Tailwind CSS)
  │     ├── Geofence Engine (Geolocation API + Distance calculation)
  │     ├── Media Player (HTML5 Audio + VTT Subtitle Matcher)
  │     ├── QR Scanner (html5-qrcode)
  │     └── State Management (Zustand: lang, player, geofence, favorites)
  │
  ├── Admin Portal (/admin)
  │     ├── Real-time Monitoring & Live Device Counter
  │     ├── Interactive Exhibits CRUD & Floor Map Pin Editor
  │     ├── QR Code Generator (qrcode library)
  │     └── Analytics Dashboard (Recharts charts & CSV exporter)
  │
  └── Offline PWA (Vite PWA Plugin + Workbox CacheFirst)
```

---

## 📁 Cấu Trúc Thư Mục Dự Án

Dự án được tổ chức gọn gàng, phân định rành mạch giữa mã nguồn ứng dụng, tài sản tĩnh và tài liệu đồ án:

```
Do_an_CNPM/
├── .github/                      # CI/CD Workflows (GitHub Actions)
│   └── workflows/deploy.yml      # Tự động kiểm thử và deploy lên GitHub Pages
├── docs/                         # Toàn bộ tài liệu đồ án & báo cáo
│   ├── report/                   # File báo cáo tổng kết đồ án (Word docx)
│   ├── requirements/             # Phân tích yêu cầu & đặc tả Use Case (MD, PDF, media)
│   ├── design/                   # Sơ đồ thiết kế UML (Component, Deploy, ERD, Use Cases)
│   └── README.md                 # Mục lục và hướng dẫn tra cứu tài liệu
├── public/                       # Tài nguyên tĩnh được Vite phân phối (audio, images, maps...)
│   ├── audio/                    # File thuyết minh giọng đọc 5 thứ tiếng
│   ├── images/                   # Ảnh hiện vật bảo tàng
│   ├── maps/                     # Bản đồ các tầng
│   ├── mock/                     # Dữ liệu JSON tĩnh
│   ├── qr/                       # Mã QR demo
│   ├── 404.html                  # Trang điều hướng SPA trên GitHub Pages
│   └── .nojekyll                 # Cấu hình bỏ qua Jekyll engine
├── scripts/                      # Bộ công cụ & script hỗ trợ (TTS, QR, deploy prep, tests)
├── src/                          # Mã nguồn chính ứng dụng React + TypeScript
│   ├── admin/                    # Phân hệ quản trị (Dashboard, Exhibits, Sessions, Floor Map...)
│   ├── visitor/                  # Phân hệ khách tham quan (Home, Scan, Map, Audio Player...)
│   ├── shared/                   # Components, stores Zustand, hooks dùng chung
│   ├── locales/                  # Bản dịch 5 thứ tiếng (i18n)
│   ├── data/                     # Dữ liệu hiện vật chuẩn
│   └── __tests__/                # Kiểm thử tự động (Vitest)
├── index.html                    # Entry point HTML của Vite
├── vite.config.ts                # Cấu hình Vite & Tailwind
├── tsconfig.json                 # Cấu hình TypeScript
└── package.json                  # Khai báo dependencies & npm scripts
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Thử

### Yêu cầu môi trường
- **Node.js:** phiên bản 18 trở lên
- **npm:** phiên bản 9 trở lên

### 1. Cài đặt thư viện
```bash
npm install
```

### 2. Khởi chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
- Truy cập Visitor Web: `http://localhost:3000/`
- Truy cập Admin Dashboard: `http://localhost:3000/admin`
  - *Email:* `admin@museum.vn`
  - *Mật khẩu:* `admin123`

### 3. Chạy kiểm thử tự động (Unit Tests)
```bash
npm run test
```

### 4. Đóng gói ứng dụng (Production Build)
```bash
npm run build
```

---

## 🚀 Quy Trình CI/CD (GitHub Actions & GitHub Pages)

Dự án được tích hợp luồng CI/CD tự động trong [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
1. Mỗi khi có commit mới được đẩy (push) lên nhánh `main`, GitHub Actions sẽ tự động khởi chạy môi trường Ubuntu.
2. Cài đặt các gói phụ thuộc với `npm ci`.
3. Kiểm tra TypeScript và thực thi đóng gói `npm run build`.
4. Xuất bản thư mục `dist/` trực tiếp lên **GitHub Pages** tại địa chỉ:  
   👉 **`https://Call-me-Ren.github.io/Do_an_CNPM/`**

---

## 👨‍💻 Thông Tin Đồ Án
- **Tên đề tài:** Hệ Thống Thuyết Minh Tự Động Đa Ngôn Ngữ
- **Lĩnh vực:** Frontend Engineering (Web PWA, Mobile Friendly) & CI/CD Pipeline
- **Sinh viên thực hiện:** Khóa K22 - Trường Đại học Sài Gòn (SGU)
