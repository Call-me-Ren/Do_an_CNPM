# 1. TỔNG QUAN ĐỀ TÀI (PROJECT OVERVIEW)

- **Tên đề tài:** Hệ thống thuyết minh tự động đa ngôn ngữ (Museum Multilingual Smart Audio Guide)
- **Học phần:** Công nghệ phần mềm
- **Đơn vị đào tạo:** Khoa Công nghệ thông tin – Trường Đại học Sài Gòn (SGU)
- **Hướng đề tài – lựa chọn:**
  1. **Front-End Dev (React Native + React.js) chuyên nghiệp xử lý giao diện (trên Web, Mobile) bao gồm CI/CD** [ĐÃ CHỌN]
  2. ~~Back-End Dev theo hướng 3 lớp bao gồm CI/CD~~
  3. ~~Back-End Dev tạo các services giao tiếp với nhau bao gồm CI/CD~~
- **Mục tiêu trọng tâm:**
  - Xây dựng ứng dụng Web Single-Page Application (SPA) hiện đại phục vụ du khách tham quan bảo tàng và di tích lịch sử.
  - **Tiếp cận thuận tiện, không rào cản:** Khách tham quan không bắt buộc tạo tài khoản hay đăng nhập; có thể mở trực tiếp liên kết web hoặc quét mã QR gắn tại cổng đón tiếp và bảng hiện vật.
  - **Định vị kết hợp (Hybrid Geofencing):** Sử dụng mã QR quét đầu tiên làm điểm neo xuất phát (`anchorArtifactId`), kết hợp tọa độ GPS từ trình duyệt (`enableHighAccuracy`) và công thức khoảng cách Haversine. Khi khách bước vào bán kính kích hoạt (mặc định 12m), hệ thống tự động nhận diện hiện vật và kích hoạt thuyết minh tương ứng mà không cần thao tác quét lại.
  - **Trải nghiệm đa phương tiện đồng bộ:** Phát bài thuyết minh âm thanh qua Web Audio API, hiển thị phụ đề chạy chữ karaoke theo mốc thời gian (cues/WebVTT), kèm hình ảnh trực quan và nội dung giới thiệu chi tiết.
  - **Chuyển đổi đa ngôn ngữ tức thời (i18n):** Hỗ trợ chuyển đổi nhanh giữa 5 ngôn ngữ: tiếng Việt (`vi`), tiếng Anh (`en`), tiếng Trung (`zh`), tiếng Hàn (`ko`), tiếng Nhật (`ja`) mà không cần tải lại toàn bộ trang web (Zero Page Reload).
  - **Sơ đồ tương tác & Tìm kiếm:** Khách có thể xem vị trí của mình trên sơ đồ tầng ("Bạn đang ở đây"), lưu danh mục hiện vật yêu thích vào LocalStorage, hoặc tìm kiếm theo tên hiện vật và mã số (`ART-xxx`).
  - **Phân hệ quản trị (Admin CMS):** Cho phép quản trị viên đăng nhập an toàn (tự động khóa tạm thời 5 phút nếu nhập sai quá 5 lần), quản lý danh mục hiện vật, kéo thả tọa độ trên sơ đồ mặt bằng, quản lý tệp âm thanh đa ngữ, tạo ca tham quan (`SES-xx`), xuất mã QR đón tiếp và theo dõi thống kê lượt nghe trực quan.
- **Phạm vi ca sử dụng:** Tinh gọn từ 20 Use Case ban đầu xuống 14 Use Case trọng tâm (Focused Use Cases) theo góp ý chuyên môn từ giảng viên hướng dẫn.
- **Hiện trạng dự án:** Đã hoàn thiện hồ sơ thiết kế UML 2.5 (v2), mã nguồn Front-end SPA (`frontend/src/`), phân hệ dịch vụ máy chủ (`backend/src/`), bộ 21 kịch bản kiểm thử tự động và pipeline CI/CD với GitHub Actions.

---

# 2. CÔNG NGHỆ & KIẾN TRÚC HỆ THỐNG (TECH STACK & ARCHITECTURE)

- **Client Front-end (Single-Page Application):**
  - Công nghệ nền tảng: React 18, TypeScript, Vite.
  - Giao diện: Tailwind CSS (chủ đề tối Dark Luxury, tối ưu độ tương phản trong không gian bảo tàng).
  - Quản lý trạng thái: Zustand (`playerStore`, `geofenceStore`, `langStore`, `favStore`, `adminAuthStore`).
  - Web APIs tích hợp: Web Audio API, Geolocation API, Camera Scanner (`html5-qrcode`), LocalStorage & SessionStorage.
- **Backend & Lưu trữ dữ liệu:**
  - Máy chủ dịch vụ: Node.js, Express, TypeScript.
  - Hệ quản trị cơ sở dữ liệu: Microsoft SQL Server (MSSQL) với 11 bảng chuẩn hóa dạng 3NF (`schema.sql`).
  - Ảo hóa môi trường: Docker & Docker Compose (`frontend`, `backend`, `mssql`).
- **Hạ tầng phân phối & Giám sát:**
  - Máy chủ lưu trữ tĩnh: GitHub Pages Edge CDN (phân phối tệp HTML/JS/CSS, âm thanh MP3 và ảnh sơ đồ).
  - Kênh truyền tin thời gian thực: Dịch vụ đám mây `ntfy.sh` (đồng bộ sự kiện nghe và phiên tham quan).
- **Tự động hóa CI/CD & Kiểm thử:**
  - Đường ống GitHub Actions: Kiểm tra cú pháp (ESLint), kiểm tra kiểu tĩnh (TypeScript `tsc`), chạy kiểm thử tự động (Vitest) và đóng gói/triển khai tự động.

---

# 3. CẤU TRÚC THƯ MỤC & PHẢ HỆ TÀI LIỆU (LINEAGE)

### 3.1. Phả hệ tài liệu (Lineage Tree)
```text
         ┌─> v1   (Tái cấu trúc theo tài liệu handoff chuẩn hóa UML)
 v0 ─────┼─> v1'  (Chuẩn hóa 14 Use Case theo góp ý của giảng viên)
         └─> v1'' (Hiện thực mã nguồn thực tế: React SPA, Zustand, Geofencing)
              │
              └─> v2  (Phiên bản tổng hợp chính thức: Báo cáo v2 + Sơ đồ UML 2.5 v2)
```

### 3.2. Cấu trúc thư mục tài liệu (`/docs/`)
- `docs/report/`:
  - `Bao_cao_do_an_CNPM_v2.md`: Báo cáo tổng hợp đồ án chính thức (14 Use Case).
  - `media/`: Các sơ đồ kiến trúc và hình ảnh minh họa cho báo cáo v2.
  - `Bao_cao_do_an_CNPM_v0/`: Báo cáo v0 lưu trữ lịch sử.
- `docs/requirements/`:
  - `Context.md`: Bối cảnh đề tài, mục tiêu, công nghệ và quy ước kỹ thuật.
- `docs/design/`:
  - `components/`: Sơ đồ thành phần kiến trúc (`ComponentDiagramV{0, 1, 1'', 2}.puml`).
  - `deployment/`: Sơ đồ triển khai vật lý (`DeployDiagramV{0, 1, 1'', 2}.puml`).
  - `erd/`: Mô hình quan hệ thực thể cơ sở dữ liệu (`ErdV{0, 1, 2}.puml`).
  - `use-cases/`:
    - `v1'/`: Bản đặc tả 14 Use Case ban đầu của nhóm (`UCv1'.md`, `UCv1'.puml`, `actscript/`).
    - `v2/`: Sơ đồ tổng quát, 14 sơ đồ Use Case chi tiết và 14 kịch bản ActScript chuẩn hóa cho v2.

---

# 4. QUY ƯỚC LẬP TRÌNH & NGUYÊN TẮC PHÁT TRIỂN

- **Quy tắc đặt tên:**
  - Biến và hàm: `camelCase` (ví dụ: `haversineDistance`, `checkArtifactProximity`).
  - React Component, Class và TypeScript Interface: `PascalCase` (ví dụ: `AudioPlayerBar`, `Artifact`).
  - Tên tệp tin: `PascalCase.tsx` cho Component giao diện; `camelCase.ts` cho stores/services/utils; `kebab-case` cho tệp tài liệu và tệp cấu hình.
- **Tiêu chuẩn TypeScript:**
  - Nghiêm cấm việc sử dụng kiểu `any` tuỳ tiện; định nghĩa interface tường minh cho mọi cấu trúc dữ liệu tại `shared/types/index.ts`.
- **Định dạng & Kiểm tra cú pháp (Linting):**
  - Tuân thủ quy chuẩn ESLint, thụt lề 2 khoảng trắng (2 spaces), kết thúc câu lệnh bằng dấu chấm phẩy rõ ràng.
- **Xử lý lỗi (Error Handling):**
  - Các thao tác I/O bất đồng bộ (gọi API, tải luồng âm thanh, truy cập camera, định vị GPS) bắt buộc đặt trong khối `try-catch`, cung cấp thông báo rõ ràng ra giao diện hoặc kích hoạt cơ chế dự phòng (hiển thị văn bản thay cho âm thanh, nhập mã số thay cho quét QR).
- **Ngôn ngữ:**
  - Tên biến, hàm và mã lệnh viết bằng tiếng Anh kỹ thuật thông dụng.
  - Chú thích mã nguồn (comments) và tài liệu giải trình viết bằng tiếng Việt rõ ràng, mạch lạc.

---

# 5. NGUYÊN TẮC THỰC THI CHO AGENT

- **Thứ tự ưu tiên khi xử lý mâu thuẫn (Conflict Resolution Hierarchy):**
  1. *Phạm vi chức năng & Use Case:* Phiên bản `v1'` là căn cứ tham chiếu cao nhất (cố định danh mục 14 Use Case).
  2. *Kiến trúc vật lý & Công nghệ:* Phiên bản `v1''` phản ánh trung thực mã nguồn hiện có; các sơ đồ Component/Deployment cần bám sát kiến trúc này và tuân thủ đặc tả UML 2.5.1 trong `agent_handoff_fix_uml_architecture_anomalies.md`.
  3. *Văn phong tài liệu:* Sử dụng tiếng Việt học thuật trong sáng, gãy gọn, chính xác; tránh lối dịch máy hoặc câu cú sáo rỗng.
- **Tính xác thực (No Hallucination):** Khi yêu cầu chưa đủ rõ hoặc phát sinh mâu thuẫn giữa các tài liệu, cần trao đổi lại để làm rõ trước khi thực hiện.
- **Tính hoàn chỉnh:** Các đoạn mã, sơ đồ PlantUML hoặc kịch bản ActScript tạo mới phải hoàn chỉnh, sẵn sàng thực thi hoặc kiểm thử; không sử dụng ghi chú tạm `TODO` hoặc bỏ dở nội dung.
- **Kiểm tra cú pháp ActScript:** Toàn bộ sơ đồ ActScript phải vượt qua công cụ kiểm tra `lint_actscript.py` trước khi lưu vào tài liệu.
