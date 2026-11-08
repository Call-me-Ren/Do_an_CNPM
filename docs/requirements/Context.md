# 1. PROJECT OVERVIEW

- **Tên đồ án:** Hệ thống Thuyết minh Tự động Đa ngôn ngữ (Museum Multilingual Smart Audio Guide)
- **Học phần:** Công nghệ Phần mềm
- **Đơn vị đào tạo:** Khoa Công nghệ Thông tin – Trường Đại học Sài Gòn (SGU)
- **Hướng đề tài – lựa chọn:**
  1. **FE Dev (React Native + React.js) chuyên nghiệp xử lý giao diện (trên Web, Mobile) bao gồm CI/CD** [ĐÃ CHỌN]
  2. ~~BE Dev theo hướng 3 lớp bao gồm CI/CD~~
  3. ~~BE Dev tạo các services giao tiếp với nhau bao gồm CI/CD~~
- **Mục tiêu cốt lõi:**
  - Xây dựng nền tảng ứng dụng Web Single-Page Application (SPA) hiện đại phục vụ du khách tham quan bảo tàng và di tích lịch sử.
  - **Tiếp cận tức thì không rào cản:** Khách tham quan không cần tạo tài khoản hoặc đăng nhập; chỉ cần mở liên kết hoặc quét mã QR gắn tại cổng / quầy lễ tân để truy cập ứng dụng.
  - **Định vị kết hợp thông minh (Hybrid Geofencing):** Khách chỉ cần quét mã QR một lần làm mốc neo xuất phát (`anchorArtifactId`). Sau đó, hệ thống tự động theo dõi vị trí qua cảm biến GPS độ chính xác cao (`enableHighAccuracy`) kết hợp giải thuật khoảng cách Haversine. Khi khách bước vào bán kính kích hoạt (mặc định 12m), hệ thống tự động nhận diện hiện vật và kích hoạt thuyết minh tương ứng mà không cần quét lại.
  - **Trải nghiệm đa phương tiện:** Hỗ trợ phát thuyết minh âm thanh chất lượng cao (Web Audio API) kèm phụ đề chạy chữ karaoke đồng bộ theo mốc thời gian (cues/WebVTT), hình ảnh tư liệu sắc nét và thông tin giới thiệu hiện vật.
  - **Đa ngôn ngữ phản ứng (i18n):** Hỗ trợ chuyển đổi tức thì 5 ngôn ngữ quốc tế: Tiếng Việt (`vi`), Tiếng Anh (`en`), Tiếng Trung (`zh`), Tiếng Hàn (`ko`), Tiếng Nhật (`ja`) với cơ chế Zero Page Reload.
  - **Tương tác sơ đồ & Tìm kiếm:** Khách có thể khám phá các điểm tham quan (POI) trên sơ đồ tầng tương tác (có halo "Bạn đang ở đây"), lưu danh mục hiện vật yêu thích (LocalStorage), hoặc tìm kiếm đa tiêu chí theo tên, mã số (`ART-xxx`).
  - **Phân hệ Quản trị (Admin CMS):** Cho phép Quản trị viên đăng nhập (tích hợp cơ chế khóa bảo vệ chống brute-force 5 lần / 5 phút), quản lý kho hiện vật, kéo thả gán tọa độ trên sơ đồ mặt bằng, quản lý tệp âm thanh đa ngữ, quản lý các ca tham quan (`SES-xx`), tự động sinh mã QR đón tiếp và theo dõi thống kê lượt nghe trực quan.
- **Phạm vi Use Case chuẩn hóa:** Đã tinh gọn từ 20 Use Cases ban đầu xuống đúng **14 Use Cases trọng tâm (Focused Use Cases)** theo góp ý của Giảng viên hướng dẫn.
- **Trạng thái hiện tại:** Đã hoàn thiện toàn diện bộ hồ sơ phân tích thiết kế UML 2.5 (v2), hiện thực đầy đủ mã nguồn Front-end SPA (`frontend/src/`), phân hệ dịch vụ máy chủ (`backend/src/`), bộ kiểm thử tự động 21 test cases và thiết lập pipeline GitHub Actions CI/CD.

---

# 2. TECH STACK & ARCHITECTURE

- **Client Front-end (Single-Page Application):**
  - Framework: React 18, TypeScript, Vite.
  - Styling: Tailwind CSS (chủ đề Dark Luxury sang trọng, tối ưu độ tương phản bảo tàng).
  - Quản lý trạng thái: Zustand (`playerStore`, `geofenceStore`, `langStore`, `favStore`, `adminAuthStore`).
  - Bộ Web APIs tiêu chuẩn: HTML5 Web Audio API, HTML5 Geolocation API, HTML5 MediaDevices / Camera Scanner API (`html5-qrcode`), Browser LocalStorage & SessionStorage.
- **Backend & Storage (Phiên bản dịch vụ mở rộng):**
  - Máy chủ ứng dụng: Node.js, Express, TypeScript.
  - Hệ quản trị cơ sở dữ liệu: Microsoft SQL Server (MSSQL) với 11 bảng chuẩn hóa 3NF (`schema.sql`).
  - Containerization: Docker & Docker Compose (`frontend`, `backend`, `mssql`).
- **Hạ tầng Phân phối & Giám sát:**
  - Hosting: GitHub Pages Edge CDN (phân phối tĩnh tệp HTML/JS/CSS, âm thanh MP3 và ảnh sơ đồ).
  - Realtime Telemetry: Dịch vụ đám mây `ntfy.sh` (đồng bộ sự kiện nghe và ca tham quan).
- **Tự động hóa CI/CD & Kiểm thử:**
  - Pipeline GitHub Actions: Linting (ESLint), kiểm tra kiểu tĩnh (TypeScript `tsc`), tự động chạy unit tests (Vitest) và tự động build/deploy.

---

# 3. DIRECTORY STRUCTURE & DOCUMENTATION LINEAGE

### 3.1. Phả hệ tài liệu (Lineage Tree)
```text
         ┌─> v1   (Refactor theo agent_handoff_fix_uml_architecture_anomalies.md)
 v0 ─────┼─> v1'  (Chuẩn hóa 14 Use Cases theo ý kiến Giảng viên hướng dẫn)
         └─> v1'' (Hiện thực kỹ thuật thực tế: React SPA, Zustand, Geofencing)
              │
              └─> v2 (Phiên bản tích hợp tối thượng: Báo cáo v2 + Sơ đồ UML 2.5 v2)
```

### 3.2. Cấu trúc thư mục tài liệu (`/docs/`)
- `docs/report/`:
  - `Bao_cao_do_an_CNPM_v2.md`: Bản thảo báo cáo tổng hợp đồ án chính thức (chuẩn 14 UCs).
  - `media/`: 59 tệp sơ đồ kiến trúc và hình ảnh minh họa độc lập cho báo cáo v2.
  - `Bao_cao_do_an_CNPM_v0/`: Báo cáo v0 lịch sử lưu trữ.
- `docs/requirements/`:
  - `Context.md`: Bối cảnh đề tài, mục tiêu, công nghệ và quy ước kỹ thuật.
- `docs/design/`:
  - `components/`: Sơ đồ thành phần kiến trúc (`ComponentDiagramV{0, 1, 1'', 2}.puml`).
  - `deployment/`: Sơ đồ triển khai vật lý (`DeployDiagramV{0, 1, 1'', 2}.puml`).
  - `erd/`: Mô hình quan hệ thực thể cơ sở dữ liệu (`ErdV{0, 1, 2}.puml`).
  - `use-cases/`:
    - `v1'/`: Bản đặc tả 14 Use Cases gốc của Thanh & Quan (`UCv1'.md`, `UCv1'.puml`, `actscript/`).
    - `v2/`: Sơ đồ Use Case tổng quát, 14 sơ đồ chi tiết và 14 kịch bản ActScript chuẩn hóa cho v2.

---

# 4. CODING CONVENTIONS & DEVELOPMENT RULES

- **Quy tắc đặt tên:**
  - Biến và hàm: `camelCase` (ví dụ: `haversineDistance`, `checkArtifactProximity`).
  - React Component, Class và TypeScript Interface: `PascalCase` (ví dụ: `AudioPlayerBar`, `Artifact`).
  - Tên tệp tin: `PascalCase.tsx` cho Component giao diện; `camelCase.ts` cho stores/services/utils; `kebab-case` cho tệp tài liệu và cấu hình.
- **Tiêu chuẩn TypeScript:**
  - Nghiêm cấm sử dụng kiểu `any` tùy tiện; mọi cấu trúc dữ liệu đều phải có interface tường minh tại `shared/types/index.ts`.
- **Formatting & Linting:**
  - Tuân thủ ESLint chuẩn, 2 spaces indentation, kết thúc câu lệnh bằng dấu chấm phẩy rõ ràng.
- **Xử lý lỗi (Error Handling):**
  - Mọi thao tác I/O bất đồng bộ (gọi API, tải luồng âm thanh, truy cập camera, định vị GPS) bắt buộc đặt trong khối `try-catch`, cung cấp thông báo lỗi chi tiết ra UI hoặc kích hoạt phương án fallback (đọc text thay thế âm thanh, nhập mã thay cho quét QR).
- **Ngôn ngữ:**
  - Tên biến, tên hàm, mã lệnh viết bằng Tiếng Anh kỹ thuật chuẩn mực.
  - Chú thích mã nguồn (comments) và tài liệu giải trình viết bằng Tiếng Việt học thuật rõ ràng, mạch lạc.

---

# 5. STRICT INSTRUCTIONS FOR AI CODING AGENT

- **Thứ bậc giải quyết xung đột (Conflict Resolution Hierarchy):**
  1. *Phạm vi chức năng & Use Case:* Phiên bản `v1'` là căn cứ tối thượng (chốt cứng 14 Use Cases).
  2. *Kiến trúc vật lý & Công nghệ:* Phiên bản `v1''` phản ánh trung thực mã nguồn đã xây dựng; các sơ đồ Component/Deployment phải đồng bộ với hiện trạng này và tuân thủ chặt chẽ chuẩn UML 2.5.1 trong `agent_handoff_fix_uml_architecture_anomalies.md`.
  3. *Văn phong tài liệu:* Tuyệt đối không sử dụng văn phong AI dịch máy cẩu thả; sử dụng văn phong báo cáo khoa học kỹ thuật tiếng Việt trang trọng, chính xác.
- **Không tự ý phỏng đoán (No Hallucination):** Nếu yêu cầu không rõ ràng hoặc xuất hiện mâu thuẫn giữa các phiên bản, bắt buộc phải dừng lại và đặt câu hỏi làm rõ.
- **Không dùng Placeholder:** Mọi đoạn mã, sơ đồ PlantUML hoặc kịch bản ActScript sinh ra phải hoàn chỉnh, có thể chạy và kiểm thử được ngay mà không chứa `TODO` hoặc nội dung bỏ dở.
- **Tuân thủ công cụ kiểm tra cú pháp:** Các sơ đồ ActScript bắt buộc phải vượt qua bộ kiểm tra cú pháp `lint_actscript.py` trước khi bàn giao.
