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

| Thực thể (Entity) | Hiện trạng V0 (`ErdV0.puml`) | Hiện trạng V1 (`ErdV1.puml`) | Hiện trạng Mã nguồn (`schema.sql`) | Hiện trạng Báo cáo V2 (`Bao_cao_v2.md`) | Giải pháp Chuẩn hóa V2 (`ErdV2.puml`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. NGUOI_DUNG** | Đủ thuộc tính cơ bản. | Đủ thuộc tính cơ bản. | Bảng `AdminUser`: có `FailedAttempts`, `LockedUntil`. | Chuẩn hóa 7 thuộc tính: `user_id`, `email`, `mat_khau_hash`, `ho_ten`, `vai_tro`, `ngon_ngu_mac_dinh`, `trang_thai_khoa`. | Đồng bộ 7 thuộc tính và bổ sung logic khóa tạm 5 phút chống brute-force. |
| **2. NGON_NGU** | ❌ Thực thể rỗng. | ✅ Đủ 3 thuộc tính: `ma_ngon_ngu` (PK), `ten_ngon_ngu`, `kich_hoat`. | Phản ánh qua mã ngôn ngữ `Lang CHAR(2)`. | 3 thuộc tính: `ma_ngon_ngu`, `ten_ngon_ngu`, `kich_hoat`. | Đầy đủ 3 thuộc tính theo chuẩn ISO 639-1 (vi, en, zh, ko, ja). |
| **3. SO_DO_KHU_VUC**| ❌ Thực thể rỗng. | ✅ Đủ 4 thuộc tính: `khu_vuc_id` (PK), `ten_khu_vuc`, `so_tang`, `anh_so_do_url`. | Bảng `Floor`: `Id`, `MapImage`, `Width`, `Height`. | 4 thuộc tính: `khu_vuc_id`, `ten_khu_vuc`, `so_tang`, `anh_so_do_url`. | Giữ vững chuẩn tiếng Việt học thuật của báo cáo. |
| **4. HIEN_VAT** | Thiếu GPS và bán kính. | ⚠️ Thiếu GPS và bán kính kích hoạt. | Bảng `Artifact`: Có `Latitude`, `Longitude`, `TriggerRadius`. | Có `vi_do`, `kinh_do`, `ban_kinh_kich_hoat` (12m). | ✅ Bổ sung đầy đủ 3 thuộc tính Geofencing vào `HIEN_VAT` trong `ErdV2.puml`. |
| **5. MA_QR** | Đủ thuộc tính. | Đủ thuộc tính. | Tích hợp trong DeepLink của `Artifact`. | 4 thuộc tính: `qr_id`, `hien_vat_id`, `duong_dan_qr`, `anh_qr_url`. | Duy trì quan hệ 1-1 với `HIEN_VAT`. |
| **6. NOI_DUNG_DA_NGON_NGU**| ❌ Thực thể rỗng. | ✅ Đủ 5 thuộc tính. | Bảng `ArtifactTranslation`. | 5 thuộc tính: `noi_dung_id`, `hien_vat_id`, `ma_ngon_ngu`, `tieu_de`, `van_ban_thuyet_minh`. | Chuẩn hóa quan hệ khóa ngoại kép với `HIEN_VAT` và `NGON_NGU`. |
| **7. HINH_ANH** | ❌ Thực thể rỗng. | ✅ Đủ 4 thuộc tính. | Bảng `ArtifactImage`. | 4 thuộc tính: `hinh_anh_id`, `hien_vat_id`, `duong_dan_anh`, `thu_tu_hien_thi`. | Quan hệ 1-N với `HIEN_VAT`. |
| **8. TEP_AM_THANH** | Đủ thuộc tính. | Đủ thuộc tính. | Bảng `ArtifactAudio`. | 5 thuộc tính: `tep_am_thanh_id`, `hien_vat_id`, `ma_ngon_ngu`, `duong_dan_tep`, `thoi_luong_giay`. | Quan hệ 1-N với `HIEN_VAT` và `NGON_NGU`. |
| **9. PHU_DE** | Đủ thuộc tính. | Đủ thuộc tính. | Bảng `SubtitleCue`. | 3 thuộc tính: `phu_de_id`, `tep_am_thanh_id`, `duong_dan_vtt`. | Quan hệ 1-1 hoặc 1-N với `TEP_AM_THANH` (WebVTT/Cues). |
| **10. LUU_YEU_THICH**| ❌ Thực thể rỗng. | ✅ Đủ 3 thuộc tính (`user_id`, `hien_vat_id`, `ngay_luu`). | Ánh xạ LocalStorage `museum_fav_ids`. | 3 thuộc tính (`user_id`, `hien_vat_id`, `ngay_luu`). | Lưu trên máy chủ cho User và ánh xạ LocalStorage cho khách vãng lai. |
| **11. THONG_KE_LUOT_NGHE**| Có `user_id` bắt buộc (sai nghiệp vụ).| ✅ `user_id` là nullable. | Bảng `ListenEvent` / `VisitorSession`. | 6 thuộc tính, `user_id` cho phép `NULL` đối với khách vãng lai. | Quan hệ đa dạng cho cả khách vãng lai (ẩn danh) và quản trị viên. |

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
