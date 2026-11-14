# BẢNG MA TRẬN ĐỐI SOÁT KIẾN TRÚC VÀ MÔ HÌNH HÓA (V0, V1, V1'', V2)
**Học phần:** Công nghệ phần mềm — Khoa CNTT, Trường Đại học Sài Gòn (SGU)  
**Đề tài:** Hệ thống thuyết minh tự động đa ngôn ngữ (Museum Multilingual Smart Audio Guide)  
**Ngày thực hiện:** 13/11/2026  
**Căn cứ pháp lý & kỹ thuật:**  
- Báo cáo chính thức: `docs/report/Bao_cao_do_an_CNPM_v2.md`
- Quy chuẩn bối cảnh: `docs/requirements/Context.md`
- Quy tắc chuẩn hóa UML: `docs/archive/agent_handoff_fix_uml_architecture_anomalies.md`
- Hiện thực mã nguồn: `frontend/src/`, `backend/src/db/schema.sql`

---

## 1. MA TRẬN ĐỐI SOÁT SƠ ĐỒ THÀNH PHẦN (COMPONENT DIAGRAM)

| Tiêu chí / Khía cạnh | Phiên bản V0 (`ComponentDiagramV0.puml`) | Phiên bản V1 (`ComponentDiagramV1.puml`) | Phiên bản V1'' (`ComponentDiagramV1''.puml`) | Phiên bản Mục tiêu V2 (`ComponentDiagramV2.puml`) | Đánh giá & Hướng xử lý trong V2 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tác giả & Nguồn gốc** | Nguyễn Trí Cường (Bản phác thảo ban đầu) | Nguyễn Hoài Quân (Tái cấu trúc theo tài liệu handoff) | Nguyễn Trí Cường (As-Built bám sát React SPA) | Tổng hợp chính thức (V2 Synthesis) | Kế thừa cấu trúc module thực tế của V1'' và chuẩn mực cổng/giao diện UML 2.5 của V1. |
| **Phân chia Subsystem** | 3 khối: `Client`, `Server`, `Storage & DB`. | 3 khối: `Client Applications`, `Server Application Tier`, `Storage & Persistence Tier`. | 4 gói module: `Visitor Experience`, `Admin Experience`, `Zustand Stores`, `Services & Helpers`. | 4 phân hệ chuẩn UML 2.5: (1) `Visitor Experience`, (2) `Admin Experience`, (3) `State & Services Tier`, (4) `Persistence & Infrastructure Tier`. | Đạt chuẩn hóa cao độ, phản ánh cả Front-end SPA, Backend REST API và Hosting Edge. |
| **Phân biệt Khách & Quản trị** | ❌ Gộp chung toàn bộ vào một khối `Client` duy nhất. | ✅ Tách riêng `Visitor Client` và `Admin CMS`. | ✅ Tách riêng `Visitor Experience` và `Admin Experience`. | ✅ Tách riêng 2 phân hệ rõ ràng với cổng (Ports) và giao diện độc lập. | Tuân thủ yêu cầu không rào cản cho khách và bảo mật khóa tạm cho quản trị. |
| **Tầng Quản lý Trạng thái** | ❌ Không có (chỉ có `ClientSession`). | ❌ Không có (chỉ có `ClientSession`). | ✅ Thể hiện 5 Zustand stores (`playerStore`, `geofenceStore`, `langStore`, `favStore`, `adminAuthStore`). | ✅ Đóng gói 5 Zustand Stores kết nối dịch vụ qua giao diện nội bộ. | Phản ánh trung thực kiến trúc React SPA hiện đại. |
| **Định vị & Geofencing** | ❌ Hoàn toàn vắng bóng. | ❌ Hoàn toàn vắng bóng. | ✅ Có `TrackingPanel`, `GeofenceHelper` (Haversine 12m), `FloorMapView`. | ✅ Chuẩn hóa thành module định vị kết hợp (Hybrid QR + GPS Haversine). | Điểm cốt lõi khác biệt của đề tài được thể hiện tường minh. |
| **Chuẩn kết nối UML 2.5** | ⚠️ Dùng cổng và giao diện nhưng ký hiệu chắp vá (`..( IArtifact`). | ✅ Chuẩn UML 2.5: Ports (`portin`/`portout`), Provided (`()--`), Required (`(--`). | ❌ Sử dụng mũi tên phụ thuộc thông thường (`-->`), thiếu Ports và Interfaces. | ✅ Tuân thủ 100% UML 2.5.1: Ports, Assembly Connector (`-0)-`), Delegation Connector. | Khắc phục triệt để lỗi phi chuẩn UML của V1''. |
| **Hạ tầng máy chủ & CSDL** | ⚠️ Mô hình Server/DB trừu tượng. | ⚠️ Mô hình Client-Server truyền thống (chưa có CDN/ntfy). | ⚠️ Chỉ mô tả GitHub Pages + LocalStorage (thiếu Node.js/MSSQL). | ✅ Song hành cả 2 phương án: Static CDN + ntfy.sh VÀ Docker Node.js/Express + MSSQL 3NF. | Đáp ứng hoàn hảo cả kịch bản bảo vệ đồ án tĩnh lẫn hệ thống client-server đầy đủ. |

---

## 2. MA TRẬN ĐỐI SOÁT SƠ ĐỒ TRIỂN KHAI (DEPLOYMENT DIAGRAM)

| Tiêu chí / Khía cạnh | Phiên bản V0 (`DeployDiagramV0.puml`) | Phiên bản V1 (`DeployDiagramV1.puml`) | Phiên bản V1'' (`DeployDiagramV1''.puml`) | Phiên bản Mục tiêu V2 (`DeployDiagramV2.puml`) | Đánh giá & Hướng xử lý trong V2 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Môi trường Client** | Máy tính để bàn (`Client PC`) chạy trình duyệt. | `MobileDevice` (React Native/Expo) & `AdministratorPC` (Web Browser). | `Visitor Device` (Mobile Browser iOS/Android) & `Admin Workstation` (Desktop Browser). | Chuẩn hóa thiết bị di động của khách (Mobile Browser) & máy tính quản trị viên (Desktop Browser). | Sửa sai lệch: Ứng dụng là React Web SPA truy cập trực tiếp qua browser, không đóng gói APK/IPA. |
| **Tạo tác Client (Artifacts)** | `GUI.spa`, `ClientSession.js`, `QRScanner.js`, `MediaPlayer.js`. | `VisitorApp.apk/.ipa`, `AdminCMS.spa`. | `React SPA (Visitor Bundle)`, `React SPA (Admin Dashboard Bundle)`. | `React SPA (Visitor Bundle) <<artifact>>`, `React SPA (Admin Dashboard Bundle) <<artifact>>`. | Chuẩn hóa tên tệp và stereotype `<<artifact>>` theo UML 2.5.1. |
| **Hạ tầng Hosting & Edge** | ❌ Máy chủ ứng dụng thông thường (`Application Server`). | ❌ Máy chủ đám mây thông thường (`CloudAppServer`). | ✅ `GitHub Pages Global CDN / Edge Servers` (HTTPS Static Server). | ✅ `GitHub Pages Edge CDN` phân phối Static Assets (`index.html`, bundle, MP3, ảnh sơ đồ). | Phản ánh chính xác hạ tầng triển khai thực tế của đề tài. |
| **Kênh Thời gian thực** | ❌ Không có. | ❌ Không có. | ✅ `ntfy.sh Realtime Cloud Service` (WebSocket & SSE Message Broker). | ✅ `ntfy.sh Realtime Cloud Service` (`<<device>>` & `<<executionEnvironment>>`). | Thể hiện kênh đồng bộ sự kiện nghe và phiên tham quan trực tuyến. |
| **Máy chủ Dịch vụ & CSDL** | ❌ Chạy JVM (`.jar` files) và DBMS không xác định. | ⚠️ Docker Node.js + PostgreSQL/MySQL. | ❌ Bị lược bỏ (chỉ dùng Mock JSON). | ✅ Bổ sung `Docker Host Server` chứa `Node.js Container` (Express REST API) và `MSSQL Container` (11 bảng 3NF). | Tích hợp đầy đủ hiện thực CSDL MSSQL (`backend/src/db/schema.sql`). |
| **Quy trình CI/CD** | ❌ Không có. | ❌ Không có. | ✅ `GitHub Actions Runner` (Ubuntu Latest, Node.js 20). | ✅ `CI/CD Build Server (GitHub Actions Runner)` tự động chạy kiểm thử và deploy. | Khẳng định tính tự động hóa CI/CD theo mục tiêu đề tài. |
| **Giao thức truyền thông** | Thiếu chi tiết cổng và giao thức. | Có cổng (443, 5432) nhưng sai CSDL (MSSQL dùng cổng 1433). | Dùng chú thích tự do trên mũi tên. | Gắn nhãn chuẩn UML Communication Path: `HTTPS:443`, `WSS:443`, `TDS/TCP:1433`. | Tuân thủ nghiêm ngặt UML 2.5.1 Clause 19. |

---

## 3. MA TRẬN ĐỐI SOÁT MÔ HÌNH DỮ LIỆU (ERD)

| Thực thể vật lý V2 (`ErdV2.puml` / `schema.sql`) | Tương đương V0 (`ErdV0.puml`) | Tương đương V1 (`ErdV1.puml`) | Hiện trạng Mã nguồn (`backend/src/db/schema.sql`) | Hiện trạng Báo cáo V2 (`Bao_cao_v2.md`) | Giải pháp Chuẩn hóa V2 (`ErdV2.puml`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. AdminUser** | `NGUOI_DUNG` | `NGUOI_DUNG` | Bảng `AdminUser`: có `FailedAttempts`, `LockedUntil`. | Chuẩn hóa `AdminUser` (7 thuộc tính: `Id`, `Email`, `PasswordHash`, `DisplayName`, `Role`, `FailedAttempts`, `LockedUntil`). | Đồng bộ 100% với `schema.sql`, tích hợp logic khóa 5 phút sau 5 lần sai liên tiếp ($N = 5$). |
| **2. Floor** | ❌ Bị rỗng trong V0. | `SO_DO_KHU_VUC` (4 thuộc tính). | Bảng `Floor`: `Id` (PK), `MapImage`, `Width`, `Height`. | `Floor` (4 thuộc tính: `Id`, `MapImage`, `Width`, `Height`). | Thay thế tên tiếng Việt cũ bằng tên chuẩn vật lý `Floor`. |
| **3. FloorTranslation** | ❌ Không có. | Gộp trong `SO_DO_KHU_VUC`. | Bảng `FloorTranslation`: `FloorId` (PK, FK), `Lang` (PK), `Name`. | `FloorTranslation`: `FloorId`, `Lang`, `Name`. | Chuẩn hóa 3NF tách riêng bản dịch tên tầng đa ngữ theo mã ISO 639-1. |
| **4. Artifact** | `HIEN_VAT` (thiếu GPS). | `HIEN_VAT` (thiếu GPS & bán kính). | Bảng `Artifact`: Có `Latitude`, `Longitude`, `TriggerRadius`, `MapX`, `MapY`. | `Artifact`: Bổ sung đầy đủ tọa độ bản đồ, tọa độ GPS và bán kính kích hoạt. | Chuẩn hóa `Artifact`, tích hợp mã định danh tra cứu `Code` ('ART-xxx') dùng cho quét QR. |
| **5. ArtifactTranslation** | ❌ Không có. | `NOI_DUNG_DA_NGON_NGU`. | Bảng `ArtifactTranslation`: `ArtifactId` (PK, FK), `Lang` (PK), `Title`, `Description`. | `ArtifactTranslation`: `ArtifactId`, `Lang`, `Title`, `Description`. | Chuẩn hóa quan hệ 1-N với `Artifact` cho bài giới thiệu đa ngữ. |
| **6. ArtifactImage** | ❌ Không có. | `HINH_ANH` (4 thuộc tính). | Bảng `ArtifactImage`: `ArtifactId` (PK, FK), `SortOrder` (PK), `Url`. | `ArtifactImage`: `ArtifactId`, `SortOrder`, `Url`. | Chuẩn hóa thư viện ảnh tư liệu hiện vật. |
| **7. ArtifactAudio** | `TEP_AM_THANH` | `TEP_AM_THANH` | Bảng `ArtifactAudio`: `ArtifactId` (PK, FK), `Lang` (PK), `Url`. | `ArtifactAudio`: `ArtifactId`, `Lang`, `Url`. | Lưu trữ đường dẫn tệp âm thanh MP3 phân phối qua Edge CDN. |
| **8. SubtitleCue** | `PHU_DE` | `PHU_DE` | Bảng `SubtitleCue`: `ArtifactId`, `Lang`, `SortOrder`, `StartSec`, `EndSec`, `Text`. | `SubtitleCue`: Phụ đề mốc thời gian chạy chữ karaoke bám sát giọng đọc. | Chuẩn hóa 3NF mốc thời gian (cues) thay cho tệp phẳng WebVTT đơn thuần. |
| **9. VisitorSession** | ❌ Không có. | ❌ Không có. | Bảng `VisitorSession`: `SessionId` (PK), `DeviceType`, `Browser`, `Lang`, `CurrentArtifactId`, `CurrentArtifactTitle`, `StartedAt`, `LastActive`. | `VisitorSession`: Quản lý phiên tham quan ẩn danh của khách vãng lai. | Thay thế thực thể `LUU_YEU_THICH` phía server (yêu thích chuyển sang LocalStorage của khách). |
| **10. ListenEvent** | `THONG_KE_LUOT_NGHE` (ép buộc user_id). | `THONG_KE_LUOT_NGHE` (user_id nullable). | Bảng `ListenEvent`: `Id` (PK), `SessionId` (FK), `ArtifactId` (FK), `ArtifactCode`, `ArtifactTitle`, `Lang`, `Timestamp`. | `ListenEvent`: Ghi nhận sự kiện nghe không bắt buộc tài khoản khách. | Liên kết toàn vẹn với `VisitorSession` và `Artifact`. |
| **11. MuseumTranslation & Museum** | ❌ Không có. | ❌ Không có. | Bảng `MuseumTranslation` (`Lang` PK, `Name`, `Address`, `OpenHours`, `Description`) và `Museum` (`Hotline`, `Banner`). | `MuseumTranslation` & `Museum`: Hồ sơ thông tin và bản dịch đa ngữ bảo tàng (UC06). | Hoàn thiện dữ liệu cho chức năng xem thông tin bảo tàng. |

---

## 4. TỔNG HỢP DANH MỤC 14 USE CASE VÀ QUAN HỆ CHUẨN HÓA

| STT | Mã Use Case | Tên Ca Sử Dụng | Tác Nhân Chính | Quan Hệ Phụ Thuộc (Include / Extend) | Ghi Chú Chuẩn Hóa Theo Anomalies Doc |
| :---: | :---: | :--- | :--- | :--- | :--- |
| 1 | **USC01** | Đăng nhập | Admin | Độc lập (cơ chế khóa 5 phút sau 5 lần sai) | Bỏ ràng buộc bắt buộc đối với khách vãng lai. |
| 2 | **USC02** | Quét mã QR | Khách tham quan | `<<include>>` sang Đọc nội dung / Nghe | Tuyệt đối không include sang Chỉnh sửa QR của Admin. |
| 3 | **USC03** | Nghe thuyết minh | Khách tham quan | Điểm kích hoạt cho phát audio | Khách vãng lai nghe trực tiếp, không bắt buộc đăng nhập. |
| 4 | **USC04** | Chuyển đổi ngôn ngữ | Khách tham quan | Độc lập | Chuyển đổi tức thì 5 ngôn ngữ (Zero reload). |
| 5 | **USC05** | Lưu hiện vật yêu thích | Khách tham quan | Lưu cục bộ LocalStorage / Account | Lưu trên browser không cần tài khoản bảo tàng. |
| 6 | **USC06** | Xem hồ sơ bảo tàng | Khách tham quan | Độc lập | Giới thiệu, địa chỉ, giờ mở cửa bảo tàng. |
| 7 | **USC07** | Xem phụ đề | Khách tham quan | `<<extend>>` từ Nghe thuyết minh (USC03) | Hiển thị chữ chạy karaoke đồng bộ mốc thời gian. |
| 8 | **USC08** | Tìm kiếm | Khách tham quan | Độc lập | Tìm theo từ khóa tên hoặc mã hiện vật `ART-xxx`. |
| 9 | **USC09** | Quản lý hiện vật | Admin | `<<include>>` Đăng nhập (USC01) | Thêm, sửa, xóa, gắn tọa độ và bán kính GPS. |
| 10 | **USC10** | Quản lý phiên & QR | Admin | `<<include>>` Đăng nhập (USC01) | Tạo phiên tham quan `SES-xx` và xuất file ảnh QR. |
| 11 | **USC11** | Quản lý tệp âm thanh | Admin | `<<include>>` Đăng nhập (USC01) | Tải lên MP3, đồng bộ WebVTT theo từng ngôn ngữ. |
| 12 | **USC12** | Xem thống kê lượt nghe | Admin | `<<include>>` Đăng nhập (USC01) | Báo cáo trực quan lượt nghe và thời lượng nghe. |
| 13 | **USC13** | Quản lý sơ đồ | Admin | `<<include>>` Đăng nhập (USC01) | Tải ảnh mặt bằng tầng, kéo thả điểm neo hiện vật. |
| 14 | **USC14** | Định vị vị trí & tự động thuyết minh | Khách & Cảm biến GPS | Độc lập / Phối hợp USC03 | Đo khoảng cách Haversine (<12m) tự kích hoạt audio. |
