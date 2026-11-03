# TECHNICAL SPECIFICATION & AGENT HANDOFF: RESOLVING UML & PRD ARCHITECTURAL INCONSISTENCIES

- **Target Repository:** `Call-me-Ren/Do_an_CNPM` (Public university repository)
- **Topic Track:** Topic 1 – Frontend Engineering (React.js Web + React Native Mobile) with CI/CD
- **Application Domain:** Hệ thống Thuyết minh Tự động Đa ngôn ngữ cho Bảo tàng (Museum Multilingual Audio Guide)
- **Objective:** Tự động đối soát, kiểm tra và sửa đổi dứt điểm các lỗi sai về quan hệ UML, logic nghiệp vụ, nhãn công nghệ và thực thể ERD trên toàn bộ các tệp tài liệu kiến trúc.

---

## 1. BỐI CẢNH DỰ ÁN & VAI TRÒ CỦA AGENT

### 1.1. Vai trò của Agent
Bạn đóng vai trò là **Senior Software Architect & QA Engineer**. Bạn có quyền đọc, phân tích cú pháp các tệp văn bản/PlantUML trong repository, xác minh mâu thuẫn logic với tài liệu đặc tả nghiệp vụ (`DacTaUseCase.pdf` / `DacTaUseCase.md`) và cập nhật nội dung các tệp diagram để đảm bảo tính nhất quán 100%.

### 1.2. Danh sách tệp liên quan
```text
docs/prd/                                   # Thư mục tài liệu yêu cầu & thiết kế kiến trúc
├── UC-activities/
│   ├── DacTaUseCase.md                     # Bản text đặc tả Use Case chi tiết – Cơ sở đối chiếu chính
│   ├── DacTaUseCase.pdf                    # Bản PDF của file trên, không cần đọc
│   ├── Use_cases_activities.puml           # Sơ đồ tổng thể Use Case & 20 phân rã UC/Activity (CẦN SỬA)
│   └── usecases.puml                       # Sơ đồ tổng quát tham khảo đã tinh chỉnh
├── Components/
│   └── ComponentDiagram.puml               # Sơ đồ thành phần (CẦN SỬA)
├── Deployment/
│   └── UMLDeployDiagram.puml               # Sơ đồ triển khai vật lý (CẦN SỬA)
└── ER/
    └── erd.puml                            # Sơ đồ quan hệ thực thể ERD (CẦN SỬA)
```

> [!NOTE]
> **Lưu ý quan trọng về định danh (Aliases & Labels) giữa các commit:**
> - Trong các phiên bản cũ (`archive/General_old.puml`), các use case sử dụng định danh tiếng Việt viết tắt như `QuetMaQR`, `ChinhSuaQR`, `NgheThuyetMinh`, `LuuTruTepAmThanh`, `QLTepAmThanh`, `DocND`, `LuuSVYeuThich`, `QuenMK`, `DangNhap`.
> - Trong phiên bản hiện tại của `docs/prd/UC-activities/Use_cases_activities.puml`, sơ đồ `General` và các sơ đồ chi tiết sử dụng định danh PascalCase tiếng Anh (`ScanQRCode`, `EditQRCode`, `ListenToNarration`, `StoreAudioFiles`, `ManageAudioFiles`, `ReadContent`, `SaveFavoriteItem`, `ForgotPassword`, `Login`, `StreamAudioData`, v.v.) và tác nhân là `PERSON`, `USER`, `ADMIN`, `AUDIO_STORAGE_DEVICE`.
> - Tài liệu này đã được chuẩn hóa lại chính xác theo alias và tên phần tử của bản hiện tại (`Use_cases_activities.puml`).

---

## 2. BẢNG PHÂN TÍCH CHI TIẾT CÁC LỖI VÀ CHỈ THỊ SỬA ĐỔI (TASK SPECIFICATIONS)

### Lỗi 1: Quan hệ nghịch lý giữa Quét QR (`ScanQRCode`) và Chỉnh sửa QR (`EditQRCode`)
- **Tệp mục tiêu:** `docs/prd/UC-activities/Use_cases_activities.puml` (sơ đồ `@startuml General` dòng 89 và các sơ đồ phân rã liên quan như `UC03_usecase`)
- **Hiện trạng sai phạm trong mã nguồn mới nhất:**
  ```plantuml
  ScanQRCode ..> EditQRCode : <<include>>
  ```
  *(Tương đương `(USC03_QuetMaQR) ..> (USC08_ChinhSuaQR) : <<include>>` trong ký hiệu cũ)*
- **Bằng chứng nghiệp vụ (`DacTaUseCase.pdf`):**
  - Use case **Quét mã QR (`ScanQRCode`)** (USC03) là hành vi của Khách tham quan (`PERSON` / `USER`).
  - Use case **Chỉnh sửa mã QR (`EditQRCode`)** (USC08) là nghiệp vụ quản trị của Quản trị viên (`ADMIN`).
  - Khách tham quan quét mã QR trên hiện vật để tra cứu thông tin; không thể và không được phép tự động gọi hành vi chỉnh sửa/tạo mã QR của Admin.
  - Sau khi quét mã QR thành công, hệ thống giải mã định danh và tự động hiển thị nội dung thông tin hiện vật (**Đọc nội dung / `ReadContent` - USC12** hoặc phát thuyết minh).
- **Chỉ thị sửa đổi cho Agent:**
  1. Xóa hoàn toàn quan hệ:
     ```plantuml
     ScanQRCode ..> EditQRCode : <<include>>
     ```
  2. Thêm quan hệ đúng bản chất nghiệp vụ (quét QR để đọc nội dung hiện vật):
     ```plantuml
     ScanQRCode ..> ReadContent : <<include>>
     ```
  3. Giữ liên kết `ADMIN -- EditQRCode` độc lập cho quản trị viên; kiểm tra sơ đồ `UC03_usecase` để đảm bảo không xuất hiện bất kỳ quan hệ nào tới `EditQRCode`.

---

### Lỗi 2: Ngược chiều mũi tên `<<include>>` giữa Quản lý tệp âm thanh và Lưu trữ tệp âm thanh
- **Tệp mục tiêu:** `docs/prd/UC-activities/Use_cases_activities.puml` (sơ đồ `@startuml General` dòng 88, `UC09_usecase` dòng 456, `UC20_usecase` dòng 907)
- **Hiện trạng sai phạm trong mã nguồn mới nhất:**
  ```plantuml
  StoreAudioFiles ..> ManageAudioFiles : <<include>>
  ```
  *(Tương đương `(USC20_LuuTruTepAmThanh) ..> (USC09_QuanLyTepAmThanh) : <<include>>` trong ký hiệu cũ)*
- **Bằng chứng nghiệp vụ (`DacTaUseCase.pdf`):**
  - Theo chuẩn UML 2.5, trong quan hệ `A ..> B : <<include>>`, Use Case cơ sở `A` khi thực thi bắt buộc phải gọi Use Case phụ trợ `B` (Supplier).
  - Admin thực hiện **Quản lý tệp âm thanh (`ManageAudioFiles` - USC09)** (tải lên/cập nhật audio). Trong quá trình này, hệ thống bắt buộc phải đẩy dữ liệu vào bộ lưu trữ **Lưu trữ tệp âm thanh (`StoreAudioFiles` - USC20)**.
  - Ngược lại, tệp lưu trữ không thể tự chủ động gọi chức năng quản lý của Admin.
- **Chỉ thị sửa đổi cho Agent:**
  Đảo ngược chiều mũi tên cho đúng chuẩn UML:
  ```plantuml
  ManageAudioFiles ..> StoreAudioFiles : <<include>>
  ```
  Đồng thời rà soát và sửa tại cả 3 vị trí: `@startuml General`, `@startuml UC09_usecase`, và `@startuml UC20_usecase`.

---

### Lỗi 3: Ép buộc đăng nhập đối với Khách vãng lai khi nghe thuyết minh
- **Tệp mục tiêu:** `docs/prd/UC-activities/Use_cases_activities.puml` (sơ đồ `@startuml General` dòng 80, `UC04_usecase` dòng 236, `UC18_usecase` dòng 829)
- **Hiện trạng sai phạm trong mã nguồn mới nhất:**
  ```plantuml
  ListenToNarration ..> Login : <<include>>
  ```
  *(Tương đương `(USC04_NgheThuyetMinh) ..> (USC02_DangNhap) : <<include>>` trong ký hiệu cũ)*
- **Bằng chứng nghiệp vụ (`DacTaUseCase.pdf`):**
  - Bối cảnh bảo tàng thực tế: Khách tham quan mua vé vào cửa, dùng điện thoại quét QR hiện vật để nghe thuyết minh ngay lập tức mà **không bắt buộc đăng ký hay đăng nhập tài khoản**.
  - Trong tài liệu đặc tả, các Use Case tra cứu thông tin cơ bản gồm: Quét mã QR (`ScanQRCode`), Nghe thuyết minh (`ListenToNarration`), Chuyển đổi ngôn ngữ (`SwitchLanguage`), Đọc nội dung (`ReadContent`), Xem hình ảnh (`ViewImages`), Xem hồ sơ bảo tàng (`ViewMuseumProfile`), Tìm kiếm (`Search`) đều dành cho `PERSON` (Khách vãng lai).
  - Chỉ riêng các tính năng cá nhân hóa như **Lưu sự vật yêu thích (`SaveFavoriteItem` - USC06)** hoặc thao tác nghiệp vụ Quản trị mới yêu cầu đã đăng nhập (`Login`).
- **Chỉ thị sửa đổi cho Agent:**
  1. Xóa bỏ hoàn toàn ràng buộc `ListenToNarration ..> Login : <<include>>` ở `@startuml General`, `UC04_usecase`, và `UC18_usecase`.
  2. Giữ nguyên ràng buộc đăng nhập cho việc lưu yêu thích:
     ```plantuml
     SaveFavoriteItem ..> Login : <<include>>
     ```

---

### Lỗi 4: Phân cấp Tác nhân (Actor Generalization) và gán quyền Use Case chưa tối ưu
- **Tệp mục tiêu:** `docs/prd/UC-activities/Use_cases_activities.puml` (sơ đồ `@startuml General` và các sơ đồ thành phần)
- **Hiện trạng sai phạm trong mã nguồn mới nhất:**
  - Sơ đồ định nghĩa kế thừa:
    ```plantuml
    USER --|> PERSON
    ADMIN --|> PERSON
    ```
  - Tuy nhiên, trong sơ đồ `General`, tác nhân `USER` lại được nối thủ công với toàn bộ các tính năng công cộng của khách tham quan (`SignUp`, `Search`, `SwitchLanguage`, `ReadContent`, `ViewImages`, `ViewMuseumProfile`, `ScanQRCode`, `ListenToNarration`), trong khi `PERSON` chỉ được nối với `Login` và `Logout`.
  - Điều này đi ngược nguyên tắc kế thừa UML: Người dùng vãng lai (`PERSON`) mới là đối tượng trực tiếp thực hiện các use case công cộng này, và `USER` tự động được thừa hưởng các use case đó thông qua quan hệ generalization `USER --|> PERSON`.
- **Bằng chứng nghiệp vụ (`DacTaUseCase.pdf`):**
  - Khách tham quan vãng lai (`PERSON`) có thể vào tham quan, tìm kiếm, quét mã QR, đọc nội dung và nghe thuyết minh mà không cần tài khoản.
  - Người dùng có tài khoản (`USER`) kế thừa toàn bộ năng lực của `PERSON`, bổ sung quyền `SaveFavoriteItem` (Lưu sự vật yêu thích) và quản lý tài khoản cá nhân.
  - Admin (`ADMIN`) kế thừa hoặc chuyên biệt hóa quyền quản trị danh mục và tệp tin.
- **Chỉ thị sửa đổi cho Agent:**
  1. Tái cấu trúc kết nối tác nhân trong `@startuml General`:
     - Gán các use case công cộng cho `PERSON`:
       ```plantuml
       PERSON -- SignUp
       PERSON -- Login
       PERSON -- ForgotPassword
       PERSON -- Logout
       PERSON -- Search
       PERSON -- SwitchLanguage
       PERSON -- ReadContent
       PERSON -- ViewImages
       PERSON -- ViewMuseumProfile
       PERSON -- ScanQRCode
       PERSON -- ListenToNarration
       ```
     - `USER` kế thừa `PERSON` (`USER --|> PERSON`) và chỉ cần nối trực tiếp với use case chuyên biệt:
       ```plantuml
       USER -- SaveFavoriteItem
       ```
     - `ADMIN` nối với các use case quản trị (`ManageItems`, `ManageFloorPlans`, `EditQRCode`, `ManageAudioFiles`, `ViewListeningStatistics`).

---

### Lỗi 5: Kiểm tra và duy trì chuẩn xác quan hệ `<<extend>>`
- **Tệp mục tiêu:** `docs/prd/UC-activities/Use_cases_activities.puml` (sơ đồ `General`, `UC02`, `UC04`, `UC17`, `UC18`)
- **Hiện trạng:**
  - Trong `General`, các quan hệ đã được viết theo chiều:
    ```plantuml
    ViewSubtitles ..> ListenToNarration : <<extend>>
    ForgotPassword ..> Login : <<extend>>
    ```
    *(Phụ đề mở rộng cho Nghe thuyết minh; Quên mật khẩu mở rộng cho Đăng nhập)*
- **Bằng chứng nghiệp vụ & Chuẩn UML:**
  - Theo chuẩn UML: mũi tên phụ thuộc `<<extend>>` đi từ Use Case mở rộng (Extension Use Case) trỏ về Use Case cơ sở (Base Use Case). Cú pháp PlantUML `Extension ..> Base : <<extend>>` là hoàn toàn chính xác.
- **Chỉ thị sửa đổi cho Agent:**
  - Rà soát toàn bộ 20 cặp diagram (`UC01` đến `UC20`) trong `Use_cases_activities.puml` để đảm bảo:
    1. Không có diagram con nào dùng sai hướng mũi tên (ví dụ: không có `Base ..> Extension : <<extend>>`).
    2. Đảm bảo tính nhất quán giữa sơ đồ `General` và sơ đồ chi tiết từng use case (`UC17_usecase`, `UC18_usecase`).

---

### Lỗi 6: Component Diagram thiếu phân tách kiến trúc Mobile/Web và thiếu phân hệ Admin CMS
- **Tệp mục tiêu:** `docs/prd/Components/ComponentDiagram.puml`
- **Hiện trạng sai phạm:**
  - Toàn bộ Client chỉ là một khối hộp chung chung (`GUI`, `Client Session`, `QR Scanner`, `MediaPlayer`), không phản ánh rõ ràng cấu trúc Đề tài 1: **React Native (Mobile)** và **React.js (Web)**.
  - Trong thư mục mã nguồn `frontend/src/` đã hiện diện đầy đủ mã nguồn cho cả khách vãng lai và quản trị viên:
    - `components/AdminDashboard.js`: Quản lý hiện vật, thống kê lượt nghe, sơ đồ tầng, QR code.
    - `components/QRScanner.js`, `components/PlayerBar.js`: Trải nghiệm khách tham quan.
    - `services/ArtifactService.js`, `services/I18nService.js`, `services/MediaPlayer.js`, `services/ClientSession.js`.
  - Sơ đồ hiện tại hoàn toàn bỏ quên phân hệ Quản trị (Admin CMS).
- **Chỉ thị sửa đổi cho Agent:**
  Cấu trúc lại `ComponentDiagram.puml` thành các package rõ ràng:
  1. **Mobile / Web Visitor Client (React Native / React.js Web PWA):**
     - `QR Scanner Component` (tích hợp Camera/Scan API)
     - `Audio Player & Subtitle Component` (PlayerBar, MediaPlayer service, audio streaming)
     - `Artifact Viewer & Localizer` (I18nService đa ngôn ngữ)
     - `Client Session Manager` (Auth & token storage)
  2. **Web Admin Dashboard (React.js CMS):**
     - `Artifact & Floor Plan Manager` (CRUD hiện vật, quản lý sơ đồ tầng)
     - `QR Code & Media Manager` (quản lý tệp audio, sinh mã QR)
     - `Listening Analytics View` (thống kê lượt nghe)
  3. **Backend Services & Storage:**
     - Tách bạch rõ các interface: `REST API / HTTPS` và `Audio Streaming / HTTP Range Requests`.
     - Kết nối tới `Database (System DB)` và `Object/Media Storage (Media Archive)`.

---

### Lỗi 7: ERD chưa chuẩn hóa đầy đủ thuộc tính và thiếu thực thể hỗ trợ toàn bộ 20 Use Cases
- **Tệp mục tiêu:** `docs/prd/ER/erd.puml`
- **Hiện trạng sai phạm:**
  - Sơ đồ hiện tại đã có 11 tên thực thể, tuy nhiên 5 thực thể cuối (`LUU_YEU_THICH`, `SO_DO_KHU_VUC`, `NOI_DUNG_DA_NGON_NGU`, `HINH_ANH`, `NGON_NGU`) chỉ được khai báo rỗng `entity NAME as NAME` mà **hoàn toàn chưa có thuộc tính, khóa chính (PK), khóa ngoại (FK) hay kiểu dữ liệu**.
  - Bảng `NGUOI_DUNG` thiếu phân biệt trạng thái tài khoản theo đặc tả.
  - Bảng `THONG_KE_LUOT_NGHE` cần cho phép `user_id` là nullable (vì khách vãng lai `PERSON` nghe thuyết minh không cần đăng nhập).
- **Chỉ thị sửa đổi cho Agent:**
  Cập nhật hoàn chỉnh đầy đủ trường dữ liệu cho cả **11 thực thể nghiệp vụ** trong `erd.puml`:
  1. `NGUOI_DUNG`: `user_id` [PK], `email`, `mat_khau_hash`, `ho_ten`, `vai_tro`, `trang_thai_khoa`, `ngon_ngu_mac_dinh`
  2. `NGON_NGU`: `ma_ngon_ngu` [PK, varchar], `ten_ngon_ngu`, `kich_hoat` [boolean]
  3. `SO_DO_KHU_VUC`: `khu_vuc_id` [PK], `ten_khu_vuc`, `so_tang`, `anh_so_do_url`
  4. `HIEN_VAT`: `hien_vat_id` [PK], `ma_dinh_danh`, `ten_hien_vat`, `khu_vuc_id` [FK], `toa_do_x`, `toa_do_y`
  5. `MA_QR`: `qr_id` [PK], `hien_vat_id` [FK], `duong_dan_qr`, `anh_qr_url`
  6. `NOI_DUNG_DA_NGON_NGU`: `noi_dung_id` [PK], `hien_vat_id` [FK], `ma_ngon_ngu` [FK], `tieu_de`, `van_ban_thuyet_minh`
  7. `HINH_ANH`: `hinh_anh_id` [PK], `hien_vat_id` [FK], `duong_dan_anh`, `thu_tu_hien_thi`
  8. `TEP_AM_THANH`: `tep_am_thanh_id` [PK], `hien_vat_id` [FK], `ma_ngon_ngu` [FK], `duong_dan_tep`, `thoi_luong_giay`
  9. `PHU_DE`: `phu_de_id` [PK], `tep_am_thanh_id` [FK], `duong_dan_vtt`
  10. `LUU_YEU_THICH`: `user_id` [PK, FK], `hien_vat_id` [PK, FK], `ngay_luu`
  11. `THONG_KE_LUOT_NGHE`: `thong_ke_id` [PK], `hien_vat_id` [FK], `tep_am_thanh_id` [FK], `user_id` [FK, nullable], `thoi_gian_nghe`, `thoi_luong_da_nghe_giay`

---

## 3. CHỈ THỊ VỀ DỌN DẸP CẤU TRÚC REPOSITORY (HOUSEKEEPING)

1. **Chuẩn hóa thư mục `docs/prd/`:**
   - Đảm bảo tất cả các tệp tài liệu chính thức đều nằm dưới `docs/prd/` (Product Requirements Document), không còn tình trạng nhầm lẫn đường dẫn `docs/pdr/`.
2. **Cập nhật đường dẫn tham chiếu:**
   - Kiểm tra và đảm bảo các tệp `README.md` hoặc markdown hướng dẫn đều trỏ đồng nhất về `docs/prd/...`.
3. **Kiểm tra cú pháp PlantUML:**
   - Toàn bộ các tệp `.puml` (`Use_cases_activities.puml`, `ComponentDiagram.puml`, `UMLDeployDiagram.puml`, `erd.puml`) phải đảm bảo cú pháp hợp lệ, có thể parse và render thành hình ảnh mà không gặp lỗi parser.

---

## 4. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA CHO AGENT)

- [ ] Toàn bộ các phát hiện và chỉ thị sửa đổi trong tài liệu này đều tương thích 100% với tên gọi, nhãn (label) và alias hiện thời của repository.
- [ ] Sơ đồ tổng quát `@startuml General` và các sơ đồ phân rã (`UC01` đến `UC20`) trong `Use_cases_activities.puml` không còn chứa quan hệ sai lệch giữa `ScanQRCode` và `EditQRCode`, không còn ép buộc đăng nhập cho `ListenToNarration`, và đúng chiều `ManageAudioFiles ..> StoreAudioFiles : <<include>>`.
- [ ] Tác nhân `PERSON` (Khách vãng lai) được gán đúng các quyền tra cứu công cộng, `USER` kế thừa `PERSON` cho các tính năng người dùng đăng ký.
- [ ] Tệp `ComponentDiagram.puml` thể hiện rõ cấu trúc Frontend gồm Mobile/Web Visitor và Web Admin Dashboard (phù hợp với code thực tế trong `frontend/src/`).
- [ ] Tệp `erd.puml` định nghĩa đầy đủ 11 bảng cùng các trường thuộc tính, khóa chính PK và khóa ngoại FK logic.
- [ ] Không làm mất hoặc xáo trộn bất kỳ tài liệu hay hình ảnh lịch sử nào trong `archive/`.
