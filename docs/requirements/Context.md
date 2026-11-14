# 0. QUY ƯỚC TỪ KHOÁ (RFC 2119)

Các từ khoá **PHẢI** (MUST), **BẮT BUỘC** (REQUIRED), **KHÔNG ĐƯỢC** (MUST NOT), **NÊN** (SHOULD), **KHUYẾN NGHỊ** (RECOMMENDED), **KHÔNG NÊN** (SHOULD NOT), **CÓ THỂ** (MAY), **TÙY CHỌN** (OPTIONAL) trong tài liệu này được hiểu như mô tả trong [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119.txt). Các từ này chỉ mang nghĩa chuẩn khi viết HOA; cách viết thường ("phải", "nên", "có thể"…) mang nghĩa thông thường và không cấu thành yêu cầu.

| Từ khoá | Tương đương | Ý nghĩa |
|---|---|---|
| **PHẢI** | BẮT BUỘC, SHALL | Yêu cầu tuyệt đối |
| **KHÔNG ĐƯỢC** | SHALL NOT | Cấm tuyệt đối |
| **NÊN** | KHUYẾN NGHỊ | Có thể bỏ qua khi có lý do hợp lệ, sau khi hiểu rõ và cân nhắc kỹ hệ quả |
| **KHÔNG NÊN** | KHÔNG KHUYẾN NGHỊ | Có thể chấp nhận khi có lý do hợp lệ, sau khi hiểu rõ và cân nhắc kỹ hệ quả |
| **CÓ THỂ** | TÙY CHỌN | Hoàn toàn tuỳ chọn |

**Quy ước định danh yêu cầu:**
- `REQ-*`: yêu cầu của sản phẩm (§1.2).
- `DEV-*`: quy ước lập trình (§4).
- `AGT-*`: nguyên tắc thực thi cho Agent (§5).

---

# 1. TỔNG QUAN ĐỀ TÀI (PROJECT OVERVIEW)

## 1.1. Thông tin chung

- **Tên đề tài:** Hệ thống thuyết minh tự động đa ngôn ngữ (Museum Multilingual Smart Audio Guide)
- **Học phần:** Công nghệ phần mềm
- **Đơn vị đào tạo:** Khoa Công nghệ thông tin – Trường Đại học Sài Gòn (SGU)
- **Hướng đề tài – lựa chọn:**
  1. **Front-End Dev (React Native + React.js) chuyên nghiệp xử lý giao diện (trên Web, Mobile) bao gồm CI/CD** [ĐÃ CHỌN]
  2. ~~Back-End Dev theo hướng 3 lớp bao gồm CI/CD~~
  3. ~~Back-End Dev tạo các services giao tiếp với nhau bao gồm CI/CD~~
- **Mục tiêu trọng tâm:** Xây dựng ứng dụng Web Single-Page Application (SPA) hiện đại phục vụ du khách tham quan bảo tàng và di tích lịch sử, theo các yêu cầu tại §1.2.
- **Phạm vi ca sử dụng:** Tinh gọn từ 20 Use Case ban đầu xuống 14 Use Case trọng tâm (Focused Use Cases) theo góp ý chuyên môn từ giảng viên hướng dẫn. Ràng buộc đối với Agent: xem `AGT-002`.
- **Hiện trạng dự án:** Đã hoàn thiện hồ sơ thiết kế UML 2.5 (v2), mã nguồn Front-end SPA (`frontend/src/`), phân hệ dịch vụ máy chủ (`backend/src/`), bộ 21 kịch bản kiểm thử tự động và pipeline CI/CD với GitHub Actions.

## 1.2. Yêu cầu sản phẩm

### Truy cập (không rào cản)

| ID | Yêu cầu |
|---|---|
| REQ-ACC-001 | Hệ thống **KHÔNG ĐƯỢC** yêu cầu khách tham quan thực hiện bất kỳ thao tác đăng nhập, đăng ký tài khoản hay xác thực danh tính nào để truy cập nội dung thuyết minh và sơ đồ. |
| REQ-ACC-002 | Phân hệ khách **KHÔNG ĐƯỢC** cung cấp chức năng quản lý tài khoản người dùng cá nhân. Mọi trạng thái cá nhân hoá của khách (danh mục yêu thích, ngôn ngữ) **PHẢI** được lưu cục bộ tại trình duyệt. |
| REQ-ACC-003 | Hệ thống **PHẢI** cho phép khách mở trực tiếp liên kết web hoặc quét mã QR gắn tại cổng đón tiếp và bảng hiện vật. |

### Định vị kết hợp (Hybrid Geofencing)

| ID | Yêu cầu |
|---|---|
| REQ-GEO-001 | Hệ thống **PHẢI** dùng mã QR được quét đầu tiên làm điểm neo xuất phát (`anchorArtifactId`). |
| REQ-GEO-002 | Hệ thống **PHẢI** lấy tọa độ GPS từ trình duyệt (`enableHighAccuracy`) và **PHẢI** tính khoảng cách bằng công thức Haversine. |
| REQ-GEO-003 | Hệ thống **PHẢI** hỗ trợ bán kính kích hoạt riêng cho từng hiện vật (`TriggerRadius`). Khi hiện vật không khai báo bán kính riêng, hệ thống **PHẢI** áp dụng bán kính mặc định **12 mét**. |
| REQ-GEO-004 | Khi khách bước vào bán kính kích hoạt, hệ thống **PHẢI** tự động nhận diện hiện vật và kích hoạt thuyết minh tương ứng; hệ thống **KHÔNG ĐƯỢC** yêu cầu khách quét lại. |

### Trải nghiệm đa phương tiện

| ID | Yêu cầu |
|---|---|
| REQ-MED-001 | Hệ thống **PHẢI** phát bài thuyết minh âm thanh qua Web Audio API. |
| REQ-MED-002 | Hệ thống **PHẢI** hiển thị phụ đề chạy chữ karaoke đồng bộ theo mốc thời gian (cues/WebVTT). |
| REQ-MED-003 | Hệ thống **PHẢI** hiển thị hình ảnh trực quan và nội dung giới thiệu chi tiết của hiện vật. |

### Đa ngôn ngữ (i18n)

| ID | Yêu cầu |
|---|---|
| REQ-I18N-001 | Hệ thống **PHẢI** hỗ trợ 5 ngôn ngữ: tiếng Việt (`vi`), tiếng Anh (`en`), tiếng Trung (`zh`), tiếng Hàn (`ko`), tiếng Nhật (`ja`). |
| REQ-I18N-002 | Việc chuyển đổi ngôn ngữ **KHÔNG ĐƯỢC** tải lại trang (Zero Page Reload). |

### Sơ đồ, yêu thích, tìm kiếm

| ID | Yêu cầu |
|---|---|
| REQ-MAP-001 | Hệ thống **PHẢI** hiển thị vị trí của khách trên sơ đồ tầng ("Bạn đang ở đây"). |
| REQ-FAV-001 | Hệ thống **PHẢI** cho phép khách lưu danh mục hiện vật yêu thích vào LocalStorage. |
| REQ-SRC-001 | Hệ thống **PHẢI** cho phép tìm kiếm theo tên hiện vật và theo mã số (`ART-xxx`). |

### Phân hệ quản trị (Admin CMS)

| ID | Yêu cầu |
|---|---|
| REQ-ADM-001 | Hệ thống **PHẢI** cung cấp phân hệ quản trị cho quản trị viên với các chức năng: quản lý danh mục hiện vật; kéo thả tọa độ trên sơ đồ mặt bằng; quản lý tệp âm thanh đa ngữ; tạo ca tham quan (`SES-xx`); xuất mã QR đón tiếp; theo dõi thống kê lượt nghe trực quan. |
| REQ-SEC-001 | Hệ thống **PHẢI** tự động khoá tạm thời quyền đăng nhập của tài khoản quản trị viên trong **300 giây (5 phút)** ngay khi ghi nhận **5 lần xác thực thất bại liên tiếp**. |

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

### 4.1. Quy tắc đặt tên

| ID | Yêu cầu |
|---|---|
| DEV-NAM-001 | Biến và hàm **PHẢI** đặt theo `camelCase` (ví dụ: `haversineDistance`, `checkArtifactProximity`). |
| DEV-NAM-002 | React Component, Class và TypeScript Interface **PHẢI** đặt theo `PascalCase` (ví dụ: `AudioPlayerBar`, `Artifact`). |
| DEV-NAM-003 | Tệp Component giao diện **PHẢI** đặt tên `PascalCase.tsx`. |
| DEV-NAM-004 | Tệp stores, services, utils **PHẢI** đặt tên `camelCase.ts`. |
| DEV-NAM-005 | Tệp tài liệu và tệp cấu hình **PHẢI** đặt tên `kebab-case`. |

### 4.2. Tiêu chuẩn TypeScript

| ID | Yêu cầu |
|---|---|
| DEV-TS-001 | Mã nguồn **KHÔNG ĐƯỢC** dùng kiểu `any` cho models, stores, services, props và business logic nội bộ. Mọi cấu trúc dữ liệu **PHẢI** có interface tường minh tại `shared/types/index.ts`. |
| DEV-TS-002 | Với dữ liệu I/O động có cấu trúc không xác định (ví dụ: phản hồi từ API bên thứ ba), mã nguồn **PHẢI** dùng `unknown` kèm thu hẹp kiểu (type narrowing / type guard) trước khi sử dụng. |
| DEV-TS-003 | Chỉ khi không thể áp dụng DEV-TS-002 (ví dụ: thư viện thiếu khai báo kiểu), mã nguồn **CÓ THỂ** dùng `any` tại đúng ranh giới I/O; trường hợp này **PHẢI** kèm chú thích giải trình lý do. |

### 4.3. Định dạng & kiểm tra cú pháp (Linting)

| ID | Yêu cầu |
|---|---|
| DEV-LNT-001 | Mã nguồn **PHẢI** tuân thủ quy chuẩn ESLint. |
| DEV-LNT-002 | Mã nguồn **PHẢI** thụt lề 2 khoảng trắng (2 spaces) và kết thúc câu lệnh bằng dấu chấm phẩy rõ ràng. |

### 4.4. Xử lý lỗi (Error handling)

| ID | Yêu cầu |
|---|---|
| DEV-ERR-001 | Mọi thao tác I/O bất đồng bộ (gọi API, tải luồng âm thanh, truy cập camera, định vị GPS) **PHẢI** đặt trong khối `try-catch` và **PHẢI** thông báo rõ ràng ra giao diện khi xảy ra lỗi. |
| DEV-ERR-002 | **Camera:** khi không được cấp quyền hoặc camera lỗi, hệ thống **PHẢI** cho phép khách nhập mã hiện vật thủ công (`ART-xxx`) thay cho quét QR. |
| DEV-ERR-003 | **Âm thanh:** khi tệp âm thanh lỗi tải hoặc trình duyệt chặn phát tự động, hệ thống **PHẢI** hiển thị nội dung văn bản và phụ đề của hiện vật thay cho âm thanh. |
| DEV-ERR-004 | **GPS:** khi mất tín hiệu hoặc khách từ chối cấp quyền vị trí, hệ thống **PHẢI** chuyển sang định vị theo điểm neo QR (`anchorArtifactId`) trên sơ đồ tầng. |
| DEV-ERR-005 | **Mạng / REST API:** khi mất kết nối máy chủ, hệ thống **KHÔNG ĐƯỢC** làm sập giao diện và **PHẢI** thông báo cho khách; hệ thống **NÊN** dùng dữ liệu đã lưu cục bộ để tiếp tục hiển thị nội dung đã tải. |

### 4.5. Ngôn ngữ

| ID | Yêu cầu |
|---|---|
| DEV-LNG-001 | Tên biến, hàm và mã lệnh **PHẢI** viết bằng tiếng Anh kỹ thuật thông dụng. |
| DEV-LNG-002 | Chú thích mã nguồn (comments) và tài liệu giải trình **PHẢI** viết bằng tiếng Việt rõ ràng, mạch lạc. |

---

# 5. NGUYÊN TẮC THỰC THI CHO AGENT

| ID | Yêu cầu |
|---|---|
| AGT-001 | Khi xảy ra mâu thuẫn, Agent **PHẢI** áp dụng thứ tự ưu tiên sau (số nhỏ ưu tiên cao): (1) **Phạm vi chức năng & Use Case:** `v1'` là căn cứ tham chiếu cao nhất, cố định danh mục 14 Use Case; (2) **Kiến trúc vật lý & Công nghệ:** `v1''` phản ánh trung thực mã nguồn hiện có; (3) **Văn phong tài liệu** (xem AGT-004). |
| AGT-002 | Agent **KHÔNG ĐƯỢC** tự ý bổ sung, khôi phục hoặc phát sinh bất kỳ Use Case nào nằm ngoài danh mục 14 Use Case đã phê duyệt tại `v1'`, kể cả các Use Case thuộc 20 Use Case ban đầu đã bị loại. Mọi sơ đồ UML 2.5 và tài liệu thiết kế mới **PHẢI** phản ánh đúng 14 Use Case này. |
| AGT-003 | Sơ đồ Component và Deployment **PHẢI** bám sát kiến trúc `v1''` và **PHẢI** tuân thủ đặc tả UML 2.5.1 trong `agent_handoff_fix_uml_architecture_anomalies.md`. |
| AGT-004 | Tài liệu **PHẢI** dùng tiếng Việt học thuật trong sáng, gãy gọn, chính xác; Agent **KHÔNG NÊN** dùng lối dịch máy hoặc câu cú sáo rỗng. |
| AGT-005 | **Tính xác thực (No Hallucination):** khi yêu cầu chưa đủ rõ hoặc phát sinh mâu thuẫn giữa các tài liệu, Agent **PHẢI** trao đổi lại để làm rõ **trước khi** thực hiện và **KHÔNG ĐƯỢC** tự suy đoán. |
| AGT-006 | **Tính hoàn chỉnh:** mã nguồn, sơ đồ PlantUML và kịch bản ActScript tạo mới **PHẢI** hoàn chỉnh, sẵn sàng thực thi hoặc kiểm thử; **KHÔNG ĐƯỢC** dùng ghi chú tạm `TODO` hoặc bỏ dở nội dung. |
| AGT-007 | Toàn bộ sơ đồ ActScript **PHẢI** vượt qua công cụ kiểm tra `lint_actscript.py` trước khi lưu vào tài liệu. |
