**HỆ THỐNG THUYẾT MINH TỰ ĐỘNG ĐA NGÔN NGỮ**

**Đặc Tả Use Case Chi Tiết (Focused Use Cases)**

# Mục Lục

[Mục Lục [2](#mục-lục)](#mục-lục)

[1. Sơ Đồ Use Case Tổng Quát [3](#sơ-đồ-use-case-tổng-quát)](#sơ-đồ-use-case-tổng-quát)

[2. Danh Sách Tác Nhân (Actors) [3](#danh-sách-tác-nhân-actors)](#danh-sách-tác-nhân-actors)

[3. Đặc Tả Chi Tiết Các Use Case [5](#đặc-tả-chi-tiết-các-use-case)](#đặc-tả-chi-tiết-các-use-case)

[3.1 USC01 — Đăng Ký [6](#usc01-đăng-ký)](#usc01-đăng-ký)

[3.2 USC02 — Đăng Nhập [9](#usc02-đăng-nhập)](#usc02-đăng-nhập)

[3.3 USC03 — Quét Mã QR [12](#usc03-quét-mã-qr)](#usc03-quét-mã-qr)

[3.4 USC04 — Nghe Thuyết Minh [15](#usc04-nghe-thuyết-minh)](#usc04-nghe-thuyết-minh)

[3.5 USC05 — Chuyển Đổi Ngôn Ngữ [18](#usc05-chuyển-đổi-ngôn-ngữ)](#usc05-chuyển-đổi-ngôn-ngữ)

[3.6 USC06 — Lưu Sự Vật Yêu Thích [20](#usc06-lưu-sự-vật-yêu-thích)](#usc06-lưu-sự-vật-yêu-thích)

[3.7 USC07 — Quản Lý Sự Vật [22](#usc07-quản-lý-sự-vật)](#usc07-quản-lý-sự-vật)

[3.8 USC08 — Chỉnh Sửa Mã QR [25](#usc08-chỉnh-sửa-mã-qr)](#usc08-chỉnh-sửa-mã-qr)

[3.9 USC09 — Quản Lý Tệp Âm Thanh [29](#usc09-quản-lý-tệp-âm-thanh)](#usc09-quản-lý-tệp-âm-thanh)

[3.10 USC10 — Xem Thống Kê Lượt Nghe [32](#usc10-xem-thống-kê-lượt-nghe)](#usc10-xem-thống-kê-lượt-nghe)

[3.11 USC11 — Quản Lý Sơ Đồ [35](#usc11-quản-lý-sơ-đồ)](#usc11-quản-lý-sơ-đồ)

[3.12 USC12 — Đọc Nội Dung [38](#usc12-đọc-nội-dung)](#usc12-đọc-nội-dung)

[3.13 USC13 — Xem Hình Ảnh [40](#usc13-xem-hình-ảnh)](#usc13-xem-hình-ảnh)

[3.14 USC14 — Xem Hồ Sơ Bảo Tàng [44](#usc14-xem-hồ-sơ-bảo-tàng)](#usc14-xem-hồ-sơ-bảo-tàng)

[3.15 USC15 — Tìm Kiếm [47](#usc15-tìm-kiếm)](#usc15-tìm-kiếm)

[3.16 USC16 — Đăng Xuất [50](#usc16-đăng-xuất)](#usc16-đăng-xuất)

[3.17 USC17 — Quên Mật Khẩu [53](#usc17-quên-mật-khẩu)](#usc17-quên-mật-khẩu)

[3.18 USC18 — Xem Phụ Đề [56](#usc18-xem-phụ-đề)](#usc18-xem-phụ-đề)

[3.19 USC19 — Phát Luồng Dữ Liệu Âm Thanh [59](#usc19-phát-luồng-dữ-liệu-âm-thanh)](#usc19-phát-luồng-dữ-liệu-âm-thanh)

[3.20 USC20 — Lưu Trữ Tệp Âm Thanh [62](#usc20-lưu-trữ-tệp-âm-thanh)](#usc20-lưu-trữ-tệp-âm-thanh)

# 1. Sơ Đồ Use Case Tổng Quát

Sơ đồ dưới đây mô tả tổng quan các use case của Hệ thống Thuyết minh tự động đa ngôn ngữ, cùng các tác nhân (actor) tham gia và các quan hệ include/extend/generalization giữa các use case.

![](media/image1.png)

# 2. Danh Sách Tác Nhân (Actors)

| **Tác nhân**                                              | **Mô tả**                                                                                               |
|-----------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| **Người (Khách vãng lai)**                                | Người dùng phổ thông chưa đăng nhập vào tài khoản cá nhân.                                              |
| **Người Dùng (Đã đăng ký/đăng nhập)**                     | Thừa kế từ tác nhân Người, có tài khoản để lưu trữ thông tin cá nhân và sử dụng các tính năng nâng cao. |
| **Admin (Quản trị viên)**                                 | Người quản lý hệ thống dữ liệu hiện vật, sơ đồ, mã QR, tệp âm thanh và thống kê.                        |
| **Thiết Bị Lưu Âm Thanh (Audio Storage Device / Server)** | Hệ thống phần cứng/dịch vụ lưu trữ và truyền phát dòng dữ liệu âm thanh thuyết minh (Streaming Server). |

# 3. Đặc Tả Chi Tiết Các Use Case

Phần dưới đây trình bày đặc tả chi tiết (Focused Use Case) cho từng use case của hệ thống, theo mẫu: Tác nhân, Mức độ hoàn thiện, Mô tả tóm tắt, Điều kiện tiên quyết, Dòng sự kiện chính, Luồng thay thế (Alternative), Luồng ngoại lệ (Exception), Điều kiện kết thúc và Sự kiện kích hoạt, kèm sơ đồ use case và sơ đồ hoạt động minh họa.

## 3.1 USC01 — Đăng Ký

***Sơ đồ Use Case — UC01***

![](media/image2.png)

**Tác nhân (Actor):** Người dùng

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Cho phép người dùng vãng lai tạo tài khoản thành viên để sử dụng các tính năng cá nhân hóa (như lưu sự vật yêu thích, đồng bộ lịch sử tham quan).

**Điều kiện tiên quyết:** Người dùng đã cài đặt/mở ứng dụng hoặc truy cập vào trang web của hệ thống.

**Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Người dùng chọn chức năng "Đăng Kí". |  |
|  | 2. Hệ thống hiển thị biểu mẫu đăng ký (Họ tên, Email/SĐT, Mật khẩu, Xác nhận mật khẩu, Ngôn ngữ mặc định). |
| 3. Người dùng điền đầy đủ thông tin hợp lệ và nhấn "Xác nhận". |  |
|  | 4. Hệ thống kiểm tra tính hợp lệ của dữ liệu (E1, E2). |
|  | 5. Hệ thống khởi tạo tài khoản mới, mã hóa mật khẩu và gửi thông báo đăng ký thành công. |
|  | 6. Chuyển hướng người dùng đến màn hình Đăng Nhập hoặc tự động đăng nhập. Kết thúc Use Case. |

**Luồng thay thế (Alternative):**

- A1 - Hủy bỏ đăng ký: Tại bước 3, người dùng nhấn "Hủy" hoặc quay lại. Hệ thống hủy thao tác và quay về màn hình trước đó.

**Luồng ngoại lệ (Exception):**

- E1 - Thông tin không hợp lệ: Định dạng email/SĐT sai hoặc mật khẩu không đủ độ dài an toàn. Hệ thống thông báo lỗi chi tiết tại trường bị sai để người dùng nhập lại.
- E2 - Tài khoản đã tồn tại: Email/SĐT đã được đăng ký trước đó. Hệ thống thông báo lỗi và gợi ý chuyển sang "Đăng nhập" hoặc "Quên mật khẩu".

**Điều kiện kết thúc:** Tài khoản người dùng mới được tạo thành công và lưu vào cơ sở dữ liệu.

**Sự kiện kích hoạt (Trigger):** Người dùng chọn nút "Đăng ký" trên giao diện chính.

***Sơ đồ hoạt động (Activity Diagram) — USC01***

![](media/image3.png)

## 3.2 USC02 — Đăng Nhập

***Sơ đồ Use Case — USC02***

![](media/image4.png)

**Tác nhân (Actor):** Người, Người Dùng, Admin

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Xác thực danh tính của Người Dùng hoặc Quản trị viên để phân quyền truy cập các chức năng tương ứng trong hệ thống. Bao gồm Use Case Xác Thực Đăng Nhập

**Điều kiện tiên quyết:**

- Tác nhân (Người dùng / Admin) đã có tài khoản tồn tại trên hệ thống.
- Tác nhân chưa được xác thực/đăng nhập vào phiên hiện tại.

**Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Tác nhân chọn "Đăng Nhập". |  |
|  | 2. Hệ thống hiển thị biểu mẫu đăng nhập (Tên đăng nhập/Email và Mật khẩu). |
| 3. Tác nhân nhập thông tin đăng nhập và nhấn "Đăng nhập". |  |
|  | 4. Hệ thống thực hiện UC con {Xác Thực Đăng Nhập} (E1, E2). |
|  | 5. Hệ thống kiểm tra vai trò (Role) của tài khoản (A1). Với tài khoản Người Dùng, hệ thống hiển thị trang cá nhân với danh mục yêu thích và lịch sử tham quan. |
|  | 6. Use Case kết thúc thành công. |

**Luồng thay thế (Alternative):**

- A1 - Tài khoản có vai trò Admin: Hệ thống hiển thị Dashboard Quản trị thay cho trang cá nhân, sau đó Use Case kết thúc thành công.
- A2 – Quên mật khẩu

**Luồng ngoại lệ (Exception):**

- E1 - Tài khoản không tồn tại: Hệ thống thông báo "Tài khoản không tồn tại trên hệ thống" và quay lại bước 1.
- E2 - Sai mật khẩu: Hệ thống thông báo "Tên đăng nhập hoặc mật khẩu không chính xác" và cho phép nhập lại (tự động khóa tạm thời nếu nhập sai quá 5 lần).

**Điều kiện kết thúc:**

- Thành công: Phiên làm việc (Session/Token) được khởi tạo thành công với quyền hạn tương ứng (Admin truy cập Dashboard Quản trị; Người dùng truy cập Trang cá nhân).
- Thất bại: Hệ thống từ chối quyền truy cập, hiển thị thông báo lỗi (E1, E2) và không tạo phiên làm việc.

**Sự kiện kích hoạt (Trigger):** Tác nhân chọn chức năng "Đăng nhập" hoặc cố gắng truy cập chức năng yêu cầu đăng nhập.

***Sơ đồ hoạt động (Activity Diagram) — USC02***

![](media/image5.png)

## 3.3 USC03 — Quét Mã QR

***Sơ đồ Use Case — USC03***

![](media/image6.png)

**Tác nhân (Actor):** Người Dùng (hoặc Khách tham quan)

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Người dùng sử dụng camera thiết bị di động quét mã QR gắn tại vị trí hiện vật/khu vực trưng bày để hệ thống tự động nhận diện và mở nội dung thuyết minh tương ứng.

**Điều kiện tiên quyết:**

- Thiết bị di động của người dùng có tích hợp Camera và phần cứng hoạt động bình thường.
- Ứng dụng đã được cấp quyền truy cập Camera.

**Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Người dùng chọn tính năng "Quét Mã QR". |  |
|  | 2. Hệ thống kích hoạt camera và hiển thị khung quét mã QR E2 |
| 3. Người dùng hướng camera về phía mã QR gắn trên hiện vật. |  |
|  | 4. Hệ thống nhận diện và giải mã chuỗi định danh QR E1 |
|  | 5. Hệ thống truy vấn thông tin hiện vật từ CSDL theo ID vừa giải mã. |
|  | 6. Hệ thống tự động chuyển đến màn hình chi tiết hiện vật và kích hoạt chức năng liên quan (Đọc nội dung, Xem hình ảnh hoặc phát Use Case {Nghe Thuyết Minh}). |

**Luồng thay thế (Alternative):** Không có.

**Luồng ngoại lệ (Exception):**

- E1 - Không thể quét/mã QR mờ hoặc hỏng: Hệ thống hiển thị thông báo "Không nhận dạng được mã QR" và gợi ý điều chỉnh khoảng cách, ánh sáng. Đồng thời hiển thị nút "Tìm kiếm hiện vật" để người dùng chuyển sang chức năng Tìm kiếm (có thể nhập trực tiếp mã số hiện vật).
- E2 - Chưa cấp quyền Camera hoặc thiết bị không có camera: Hệ thống thông báo cần quyền truy cập Camera để quét mã, hướng dẫn cấp quyền trong phần cài đặt của thiết bị và hiển thị nút "Tìm kiếm hiện vật".

**Điều kiện kết thúc:**

- Thành công: Hệ thống giải mã thành công QR ID, truy vấn dữ liệu hiện vật và chuyển hướng người dùng đến màn hình chi tiết hiện vật tương ứng.
- Thất bại: Màn hình quét giữ nguyên hoặc hiển thị thông báo lỗi mã QR không hợp lệ/mờ hỏng/chưa cấp quyền Camera (E1, E2, E3), kèm gợi ý chuyển sang chức năng Tìm kiếm.

**Sự kiện kích hoạt (Trigger):** Người dùng chọn biểu tượng "Quét QR" trên giao diện.

***Sơ đồ hoạt động (Activity Diagram) — USC03***

![](media/image7.png)

## 3.4 USC04 — Nghe Thuyết Minh

***Sơ đồ Use Case — USC04***

![](media/image8.png)

**Tác nhân (Actor):** Người Dùng, Thiết Bị Lưu Âm Thanh

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Phát bản thu âm thuyết minh về hiện vật/sự vật theo ngôn ngữ hiện tại của người dùng. Tự động gọi {Phát Luồng Dữ Liệu Âm Thanh} («include») từ thiết bị lưu trữ và có thể mở rộng hiển thị phụ đề với {Xem Phụ Đề} («extend»).

**Điều kiện tiên quyết:** Đã xác định được hiện vật cần thuyết minh (thông qua Quét mã QR hoặc Tìm kiếm/Xem danh sách).

**Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Người dùng đăng nhập |  |
|  | 2. Hệ thống hiển thị lời chào mừng đăng nhập cùng với những chức năng chính cho người dùng lựa chọn |
| 3. Người dùng chọn nghe thuyết minh của hiện vật (hoặc tự động kích hoạt sau khi quét QR). |  |
|  | 4. Hệ thống xác định ngôn ngữ người dùng đang chọn và mã ID của tệp âm thanh tương ứng. |
|  | 5. Hệ thống thực hiện {Phát Luồng Dữ Liệu Âm Thanh}: gửi yêu cầu lấy tệp tin/dòng dữ liệu âm thanh đến Thiết Bị Lưu Âm Thanh. |
|  | 6. Thiết Bị Lưu Âm Thanh truyền luồng dữ liệu (audio stream) về ứng dụng. E1 |
|  | 7. Hệ thống khởi tạo trình phát âm thanh và bắt đầu phát (Play). Hiển thị các nút điều khiển: Pause, Stop, Seek, Tốc độ phát. |
| 8. Người dùng lắng nghe thuyết minh và tương tác thanh điều khiển phát khi cần. (A1, A2) |  |
|  | 9. Âm thanh kết thúc. Hệ thống cập nhật số lượt nghe (lưu log thống kê) và dừng trình phát. Kết thúc Use Case. |

**Luồng thay thế (Alternative):**

- A1 - Người dùng bật phụ đề (Extension Point Xem Phụ Đề): Người dùng bấm nút "Bật Phụ Đề" trên trình phát. Hệ thống kích hoạt use case Xem Phụ Đề, tải và hiển thị văn bản đồng bộ theo mốc thời gian của bài nói.
- A2 - Đổi ngôn ngữ giữa chừng: Người dùng chọn thay đổi ngôn ngữ khác (Use case Chuyển Đổi Ngôn Ngữ). Hệ thống lưu vị trí phát hiện tại, nạp tệp âm thanh ngôn ngữ mới từ Thiết Bị Lưu Âm Thanh và phát tiếp.

**Luồng ngoại lệ (Exception):**

- E1 - Lỗi kết nối thiết bị âm thanh/mạng: Hệ thống không nhận được luồng dữ liệu âm thanh. Hệ thống thông báo "Không tải được âm thanh thuyết minh, vui lòng kiểm tra kết nối" và gợi ý người dùng đọc bản thuyết minh bằng văn bản (DocND).

**Điều kiện kết thúc:** Âm thanh thuyết minh được phát liên tục, trơn tru cho người dùng.

**Sự kiện kích hoạt (Trigger):** Extension Point: Xem Phụ Đề (khi người dùng kích hoạt bật phụ đề văn bản tương ứng với audio).

***Sơ đồ hoạt động (Activity Diagram) — UC04***

![](media/image9.png)

## 3.5 USC05 — Chuyển Đổi Ngôn Ngữ

***Sơ đồ Use Case — USC05***

![](media/image10.png)

**Tác nhân (Actor):** Người Dùng (hoặc Khách vãng lai)

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Thay đổi ngôn ngữ hiển thị giao diện và ngôn ngữ các nội dung thuyết minh (Tiếng Việt, Tiếng Anh, Tiếng Pháp, Tiếng Trung, v.v.).

**Điều kiện tiên quyết:** Không có.

**Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Người dùng chọn tính năng "Chuyển Đổi Ngôn Ngữ". |  |
|  | 2. Hệ thống hiển thị danh sách các ngôn ngữ được hỗ trợ. |
| 3. Người dùng chọn một ngôn ngữ mong muốn |  |
|  | 4. Hệ thống ghi nhận thiết lập ngôn ngữ mới vào cấu hình phiên. |
|  | 5. Hệ thống tải lại tài nguyên giao diện, nội dung bài viết và các liên kết âm thanh tương ứng với ngôn ngữ đã chọn. |
|  | 6. Giao diện hiển thị bằng ngôn ngữ mới. Use case kết thúc. |

**Luồng thay thế (Alternative):** Không có.

**Luồng ngoại lệ (Exception):** Không có.

**Điều kiện kết thúc:** Toàn bộ giao diện và dữ liệu nội dung hiển thị sang ngôn ngữ mới được chọn.

**Sự kiện kích hoạt (Trigger):** Người dùng chọn biểu tượng ngôn ngữ/quốc kỳ trên màn hình.

***Sơ đồ hoạt động (Activity Diagram) — USC05***

![](media/image11.png)

## 3.6 USC06 — Lưu Sự Vật Yêu Thích

***Sơ đồ Use Case — USC06***

![](media/image12.png)

**Tác nhân (Actor):** Người Dùng

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Cho phép người dùng đánh dấu/lưu lại các hiện vật, sự vật ấn tượng vào danh mục "Yêu thích" để xem lại sau.

**Điều kiện tiên quyết:** Người dùng đang ở màn hình chi tiết hiện vật và đã đăng nhập (nếu chưa đăng nhập, include {Đăng Nhập}).

**Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Người dùng đăng nhập |  |
|  | 2. Hệ thống hiển thị lời chào mừng đăng nhập cùng với những chức năng chính cho người dùng lựa chọn |
| 3. Người dùng bấm nút "Lưu Yêu Thích" tại trang hiện vật. |  |
|  | 4. Hệ thống kiểm tra trạng thái lưu: nếu chưa lưu thì thêm hiện vật vào danh mục yêu thích trong CSDL; nếu đã lưu thì hiển thị tùy chọn xóa khỏi danh sách (A1). |
|  | 5. Hệ thống cập nhật biểu tượng trạng thái (đã lưu) và thông báo "Đã lưu vào danh sách yêu thích". |

**Luồng thay thế (Alternative):**

- A1 - Hủy lưu yêu thích: Người dùng bấm lần nữa để bỏ chọn. Hệ thống xóa hiện vật khỏi bảng danh sách yêu thích của người dùng.

**Luồng ngoại lệ (Exception):** Không có.

**Điều kiện kết thúc:** Hiện vật được thêm vào danh sách yêu thích của tài khoản người dùng.

**Sự kiện kích hoạt (Trigger):** Người dùng nhấn vào nút "Thêm vào Yêu thích" (biểu tượng trái tim/ngôi sao).

***Sơ đồ hoạt động (Activity Diagram) — USC06***

![](media/image13.png)

## 3.7 USC07 — Quản Lý Sự Vật

***Sơ đồ Use Case — USC07***

![](media/image14.png)

**Tác nhân (Actor):** Admin

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Cho phép Admin quản lý thông tin các sự vật trong hệ thống, gồm thêm mới, chỉnh sửa và xóa sự vật.

**Điều kiện tiên quyết:** Admin đã đăng nhập thành công vào hệ thống (nếu chưa đăng nhập, include {Đăng Nhập}).

**Sự kiện kích hoạt (Trigger):** Admin chọn menu "Quản Lý Sự Vật".

**Dòng sự kiện chính**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Admin đăng nhập |  |
|  | 2. Hệ thống hiển thị lời chào mừng đăng nhập cùng với những chức năng chính cho Admin lựa chọn |
| 3. Admin chọn menu "Quản Lý Sự Vật". |  |
|  | 4. Hệ thống hiển thị danh sách các sự vật hiện có kèm bộ lọc, tìm kiếm và các nút "Thêm mới", "Sửa", "Xóa". |
| 5. Admin chọn một thao tác quản lý (A1, A2, A3). |  |
| 6. Admin thoát khỏi màn hình quản lý. Use case kết thúc. |  |

**Luồng thay thế (Alternative):**

- A1 – Thêm mới sự vật: Ở bước 3, Admin chọn "Thêm mới". Hệ thống hiển thị biểu mẫu trống gồm: Tên, Mã số, Khu vực/Sơ đồ, Nội dung mô tả đa ngôn ngữ, Hình ảnh đính kèm. Admin điền thông tin và nhấn "Lưu" (A4). Hệ thống kiểm tra tính hợp lệ của dữ liệu (E1, E2), lưu vào CSDL (E3), thông báo "Lưu thông tin sự vật thành công" và làm mới danh sách. Use case quay lại bước 3.
- A2 – Sửa sự vật: Ở bước 3, Admin chọn một sự vật trong danh sách và nhấn "Sửa". Hệ thống hiển thị biểu mẫu đã điền sẵn thông tin hiện tại. Các bước tiếp theo thực hiện như A1.
- A3 – Xóa sự vật: Ở bước 3, Admin chọn một sự vật và nhấn "Xóa". Hệ thống hiển thị hộp thoại xác nhận. Khi Admin đồng ý, hệ thống xóa sự vật khỏi CSDL, thông báo thành công, làm mới danh sách và quay lại bước 3.
- A4 – Hủy thao tác: Khi đang ở biểu mẫu của A1 hoặc A2, Admin nhấn "Hủy". Hệ thống đóng biểu mẫu mà không lưu thay đổi và quay lại danh sách (bước 3).

**Luồng ngoại lệ (Exception):**

- E1 – Thiếu trường bắt buộc: Admin bỏ trống tên sự vật hoặc chưa chọn khu vực. Hệ thống cảnh báo đỏ tại các trường thiếu và yêu cầu điền bổ sung trước khi lưu (quay lại bước điền biểu mẫu).
- E2 – Trùng mã số: Mã số vừa nhập đã tồn tại. Hệ thống thông báo "Mã số đã tồn tại" và yêu cầu nhập mã khác (quay lại bước điền biểu mẫu).
- E3 – Lưu thất bại: CSDL lỗi hoặc hình ảnh sai định dạng/quá dung lượng. Hệ thống thông báo lỗi và giữ nguyên dữ liệu đã nhập để Admin thử lại (quay lại bước điền biểu mẫu).

**Điều kiện kết thúc:** Thông tin sự vật được thêm, cập nhật hoặc xóa trong CSDL và danh sách hiển thị đúng thay đổi. Nếu Admin hủy thao tác thì dữ liệu giữ nguyên.

***Sơ đồ hoạt động (Activity Diagram) — USC07***

![](media/image15.png)

## 3.8 USC08 — Chỉnh Sửa Mã QR

***Sơ đồ Use Case — USC08***

![](media/image16.png)

**Tác nhân (Actor):** Admin

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Cho phép Admin tạo mới mã QR cho sự vật mới, cập nhật liên kết URL/nội dung trỏ tới của mã QR, hoặc xuất/in lại mã QR để gắn tại bảo tàng.

**Điều kiện tiên quyết:** Admin đã đăng nhập hệ thống (nếu chưa đăng nhập, include {Đăng Nhập}). Sự vật cần gắn mã QR đã tồn tại trong hệ thống.

**Sự kiện kích hoạt (Trigger):** Admin chọn mục "Quản Lý / Chỉnh Sửa Mã QR".

**Dòng sự kiện chính**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Admin đăng nhập |  |
|  | 2. Hệ thống hiển thị lời chào mừng đăng nhập cùng với những chức năng chính cho Admin lựa chọn |
| 3. Admin chọn mục "Chỉnh Sửa Mã QR". |  |
|  | 4. Hệ thống hiển thị danh mục mã QR đã cấp cho các sự vật/khu vực. |
| 5. Admin chọn sự vật cần cập nhật mã QR (A1, A3). |  |
|  | 6. Hệ thống hiển thị thông số mã QR: sự vật liên kết, liên kết dữ liệu (URL/nội dung), kích thước, định dạng và ảnh mã QR hiện tại. |
| 7. Admin chỉnh sửa liên kết dữ liệu (A2). |  |
|  | 8. Hệ thống kiểm tra tính hợp lệ của liên kết (E1), mã hóa dữ liệu mới thành mã đồ họa QR và hiển thị bản xem trước. |
| 9. Admin nhấn "Lưu". |  |
|  | 10. Hệ thống lưu thay đổi vào CSDL (E2) và thông báo "Lưu mã QR thành công". |
| 11. Admin chọn định dạng tệp (PNG/SVG/PDF) và nhấn "Tải về" để in ấn. |  |
|  | 12. Hệ thống tạo và cho phép tải tệp hình ảnh mã QR theo định dạng đã chọn (E2). |

**Luồng thay thế (Alternative):**

- A1 – Tạo mã QR mới: Ở bước 3, Admin chọn "Tạo mã QR mới" và chọn một sự vật chưa có mã QR. Hệ thống hiển thị biểu mẫu thông số mã QR trống (liên kết dữ liệu, kích thước, định dạng). Use case tiếp tục từ bước 5.
- A2 – Sửa lại mã (Regenerate): Ở bước 5, Admin chọn "Sinh lại mã" thay vì chỉnh sửa liên kết. Hệ thống tạo lại mã đồ họa QR từ liên kết hiện tại và hiển thị bản xem trước. Use case tiếp tục từ bước 7.
- A3 – Xóa mã QR: Ở bước 3, Admin chọn một sự vật đã có mã QR và nhấn "Xóa mã QR". Hệ thống hiển thị hộp thoại xác nhận. Khi Admin đồng ý, hệ thống xóa mã QR khỏi CSDL (E2), thông báo "Xóa mã QR thành công", làm mới danh mục mã QR và kết thúc use case.

**Luồng ngoại lệ (Exception):**

- E1 – Liên kết không hợp lệ: Ở bước 6, liên kết dữ liệu bị bỏ trống hoặc sai định dạng URL. Hệ thống cảnh báo đỏ tại trường liên kết và yêu cầu nhập lại (quay lại bước 5).
- E2 – Lưu hoặc tạo tệp thất bại: Ở bước 8 hoặc bước 10, CSDL lỗi hoặc hệ thống không tạo được tệp hình ảnh. Hệ thống thông báo lỗi và giữ nguyên dữ liệu đã nhập để Admin thử lại.

**Điều kiện kết thúc:** Mã QR được tạo/cập nhật chính xác với sự vật trong hệ thống. Tệp hình ảnh mã QR được tải về nếu Admin chọn tải.

***Sơ đồ hoạt động (Activity Diagram) — USC08***

![](media/image17.png)

## 3.9 USC09 — Quản Lý Tệp Âm Thanh

***Sơ đồ Use Case — USC09***

![](media/image18.png)

**Tác nhân (Actor):** Admin, Thiết Bị Lưu Âm Thanh

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Admin tải lên, thay thế hoặc xóa các file audio thuyết minh và gán nhãn ngôn ngữ cho từng file. Bao gồm {Lưu Trữ Tệp Âm Thanh} («include») tương tác trực tiếp với Thiết Bị Lưu Âm Thanh.

**Điều kiện tiên quyết:** Admin đã đăng nhập (nếu chưa đăng nhập, include {Đăng Nhập}). Hiện vật cần gắn thuyết minh đã tồn tại trong hệ thống.

**Sự kiện kích hoạt (Trigger):** Admin chọn "Quản Lý Tệp Âm Thanh".

**Dòng sự kiện chính**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Admin đăng nhập |  |
|  | 2. Hệ thống hiển thị lời chào mừng đăng nhập cùng với những chức năng chính cho Admin lựa chọn |
| 3. Admin chọn "Quản Lý Tệp Âm Thanh". |  |
|  | 4. Hệ thống hiển thị danh sách các file thuyết minh theo từng hiện vật và ngôn ngữ. |
| 5. Admin chọn một thao tác quản lý tệp âm thanh (A1, A2, A3). |  |
| 6. Admin thoát khỏi màn hình quản lý. Use case kết thúc. |  |

**Luồng thay thế (Alternative):**

- A1 – Tải lên tệp mới: Ở bước 3, Admin chọn hiện vật và nhấn "Tải lên tệp âm thanh mới". Hệ thống hiển thị hộp thoại chọn file và chọn ngôn ngữ thuyết minh. Admin chọn ngôn ngữ, chọn file audio (MP3, WAV, AAC) từ máy tính và bấm "Tải lên". Hệ thống kiểm tra dung lượng, định dạng file (E1), rồi thực hiện {Lưu Trữ Tệp Âm Thanh}: gửi tệp sang Thiết Bị Lưu Âm Thanh. Thiết Bị Lưu Âm Thanh tiếp nhận, lưu file và trả về đường dẫn (URL/ID lưu trữ) (E2). Hệ thống cập nhật đường dẫn vào hồ sơ hiện vật và thông báo "Tải lên thành công". Use case quay lại bước 3.
- A2 – Thay thế tệp: Ở bước 3, Admin chọn một tệp âm thanh đã có của hiện vật/ngôn ngữ và nhấn "Thay thế". Admin chọn file audio mới từ máy tính và bấm "Tải lên". Các bước tiếp theo thực hiện như A1; hệ thống cập nhật đường dẫn mới vào hồ sơ hiện vật và xóa tệp cũ khỏi thiết bị lưu trữ.
- A3 – Xóa tệp: Ở bước 3, Admin chọn một tệp âm thanh đã có và nhấn "Xóa". Hệ thống hiển thị hộp thoại xác nhận. Khi Admin đồng ý, hệ thống yêu cầu Thiết Bị Lưu Âm Thanh xóa tệp (E2), cập nhật hồ sơ hiện vật, thông báo "Xóa tệp thành công" và quay lại bước 3.

**Luồng ngoại lệ (Exception):**

- E1 – Sai định dạng hoặc vượt quá dung lượng: Khi Admin tải lên (A1, A2), file không phải âm thanh hợp lệ (MP3, WAV, AAC) hoặc kích thước quá lớn (&gt;50MB). Hệ thống từ chối tải lên và thông báo lỗi.
- E2 – Thiết Bị Lưu Âm Thanh không phản hồi hoặc lưu/xóa thất bại: Khi lưu hoặc xóa tệp (A1, A2, A3), thiết bị lưu trữ không phản hồi hoặc báo lỗi. Hệ thống thông báo lỗi và không cập nhật hồ sơ hiện vật.

**Điều kiện kết thúc:** Tệp âm thanh được lưu trữ an toàn trên thiết bị lưu trữ và liên kết đúng với hiện vật tương ứng; hoặc được thay thế/xóa khỏi thiết bị lưu trữ và hồ sơ hiện vật nếu Admin chọn thay thế/xóa.

***Sơ đồ hoạt động (Activity Diagram) — USC09***

![](media/image19.png)

## 3.10 USC10 — Xem Thống Kê Lượt Nghe

***Sơ đồ Use Case — USC10***

![](media/image20.png)

**Tác nhân (Actor):** Admin

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Cung cấp báo cáo, biểu đồ về số lượt khách nghe thuyết minh theo từng sự vật, theo ngôn ngữ, theo khung giờ hoặc theo ngày/tháng/năm để đánh giá mức độ quan tâm của du khách.

**Điều kiện tiên quyết:** Admin đã đăng nhập hệ thống (nếu chưa đăng nhập, include {Đăng Nhập}).

**Sự kiện kích hoạt (Trigger):** Admin chọn menu "Thống Kê Lượt Nghe".

**Dòng sự kiện chính**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Admin đăng nhập |  |
|  | 2. Hệ thống hiển thị lời chào mừng đăng nhập cùng với những chức năng chính cho Admin lựa chọn |
| 3. Admin chọn menu "Thống Kê Lượt Nghe". |  |
|  | 4. Hệ thống hiển thị bộ lọc tiêu chí báo cáo: Khoảng thời gian, Đơn vị thống kê (giờ/ngày/tháng/năm), Khu vực trưng bày, Sự vật cụ thể, Ngôn ngữ. |
| 5. Admin thiết lập các tiêu chí lọc và bấm "Xem Thống Kê". |  |
|  | 6. Hệ thống kiểm tra tiêu chí lọc (E1), truy vấn CSDL và tổng hợp dữ liệu lượt nghe (E2). |
|  | 7. Hệ thống hiển thị biểu đồ trực quan (biểu đồ cột/đường) cùng bảng tổng hợp số liệu chi tiết, gồm: top sự vật được nghe nhiều nhất, ngôn ngữ phổ biến nhất và tổng số lượt nghe theo từng mốc thời gian. |
| 8. Admin xem báo cáo và có thể chọn "Xuất báo cáo" (A1). Use case kết thúc. |  |

**Luồng thay thế (Alternative):**

- A1 – Xuất báo cáo: Ở bước 6, Admin bấm "Xuất báo cáo" và chọn định dạng Excel hoặc PDF. Hệ thống đóng gói dữ liệu báo cáo (E3) và tải về máy theo định dạng đã chọn. Use case kết thúc.

**Luồng ngoại lệ (Exception):**

- E1 – Tiêu chí lọc không hợp lệ: Ở bước 4, tiêu chí lọc không hợp lệ (ví dụ ngày bắt đầu sau ngày kết thúc hoặc chưa chọn khoảng thời gian). Hệ thống cảnh báo tại tiêu chí sai và yêu cầu chọn lại (quay lại bước 3).
- E2 – Không có dữ liệu: Ở bước 4, không có lượt nghe nào phù hợp với tiêu chí đã chọn. Hệ thống thông báo "Không có dữ liệu thống kê phù hợp" và yêu cầu Admin đổi tiêu chí lọc (quay lại bước 3).
- E3 – Xuất tệp thất bại: Ở A1, hệ thống không tạo được tệp báo cáo. Hệ thống thông báo lỗi để Admin thử xuất lại hoặc chọn định dạng khác.

**Điều kiện kết thúc:** Báo cáo thống kê được hiển thị trực quan theo tiêu chí đã chọn; nếu Admin chọn xuất thì tệp báo cáo được tải về máy.

***Sơ đồ hoạt động (Activity Diagram) — USC10***

![](media/image21.png)

## 3.11 USC11 — Quản Lý Sơ Đồ

***Sơ đồ Use Case — USC11***

![](media/image22.png)

**Tác nhân (Actor):** Admin

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Quản lý bản đồ/sơ đồ các tầng, phòng trưng bày của bảo tàng, gồm thêm mới, chỉnh sửa và xóa sơ đồ; gán vị trí tọa độ của các sự vật lên sơ đồ để phục vụ hiển thị định vị cho khách tham quan.

**Điều kiện tiên quyết:** Admin đã đăng nhập hệ thống (nếu chưa đăng nhập, include {Đăng Nhập}). Các sự vật cần gán vị trí đã tồn tại trong hệ thống.

**Sự kiện kích hoạt (Trigger):** Admin chọn menu "Quản Lý Sơ Đồ".

**Dòng sự kiện chính**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Admin đăng nhập |  |
|  | 2. Hệ thống hiển thị lời chào mừng đăng nhập cùng với những chức năng chính cho Admin lựa chọn |
| 3. Admin chọn menu "Quản Lý Sơ Đồ". |  |
|  | 4. Hệ thống hiển thị danh sách các tầng/khu vực trưng bày và sơ đồ mặt bằng tương ứng. |
| 5. Admin chọn một thao tác quản lý sơ đồ (A1, A2, A3). |  |
| 6. Admin thoát khỏi màn hình quản lý. Use case kết thúc. |  |

**Luồng thay thế (Alternative):**

- A1 – Thêm sơ đồ mới: Ở bước 3, Admin chọn "Thêm sơ đồ mới" và tải lên ảnh mặt bằng cho tầng/khu vực. Hệ thống kiểm tra định dạng và dung lượng ảnh (E1), sau đó hiển thị giao diện biên tập sơ đồ tương tác. Các bước tiếp theo thực hiện như A2.
- A2 – Chỉnh sửa sơ đồ: Ở bước 3, Admin chọn một khu vực và nhấn "Chỉnh sửa". Hệ thống hiển thị giao diện biên tập sơ đồ tương tác. Admin kéo thả các điểm ghim sự vật vào đúng vị trí thực tế trên sơ đồ. Hệ thống ghi nhận tạm tọa độ (X, Y) của từng sự vật. Admin nhấn "Lưu Sơ Đồ". Hệ thống lưu cấu hình tọa độ vào CSDL (E2) và thông báo cập nhật thành công. Use case quay lại bước 3.
- A3 – Xóa sơ đồ: Ở bước 3, Admin chọn một sơ đồ và nhấn "Xóa". Hệ thống hiển thị hộp thoại xác nhận. Khi Admin đồng ý, hệ thống xóa sơ đồ cùng tọa độ các sự vật đã gán khỏi CSDL (E2), thông báo thành công, làm mới danh sách và quay lại bước 3.

**Luồng ngoại lệ (Exception):**

- E1 – Ảnh mặt bằng không hợp lệ: Ở A1, ảnh sai định dạng hoặc vượt quá dung lượng cho phép. Hệ thống từ chối tải lên, thông báo lỗi và yêu cầu chọn lại ảnh.
- E2 – Lưu thất bại: Khi lưu hoặc xóa sơ đồ (A1, A2, A3), CSDL lỗi. Hệ thống thông báo lỗi và giữ nguyên dữ liệu đang chỉnh sửa để Admin thử lại.

**Điều kiện kết thúc:** Sơ đồ và tọa độ các sự vật được lưu vào CSDL và hiển thị đúng cho khách tham quan; hoặc sơ đồ được xóa khỏi hệ thống nếu Admin chọn xóa.

***Sơ đồ hoạt động (Activity Diagram) — USC11***

![](media/image23.png)

##  3.12 USC12 — Đọc Nội Dung

***Sơ đồ Use Case — USC12***

![](media/image24.png)

**Tác nhân (Actor):** Người Dùng

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Cho phép người dùng đọc bản thuyết minh dạng văn bản của hiện vật theo ngôn ngữ đang chọn, dùng thay thế hoặc song song với việc nghe thuyết minh.

**Điều kiện tiên quyết:** Đã xác định được hiện vật cần xem (thông qua Quét mã QR hoặc Tìm kiếm) và người dùng đang ở màn hình chi tiết hiện vật.

**Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Người dùng chọn "Đọc nội dung" tại màn hình chi tiết hiện vật. |  |
|  | 2. Hệ thống xác định ngôn ngữ đang chọn và truy vấn nội dung thuyết minh dạng văn bản của hiện vật trong CSDL (E1, E2). |
|  | 3. Hệ thống hiển thị nội dung gồm tên hiện vật, mô tả, nguồn gốc, niên đại và các thông tin liên quan. |
| 4. Người dùng cuộn trang để đọc nội dung (A1, A2). |  |
| 5. Người dùng thoát khỏi màn hình đọc. Use case kết thúc. |  |

**Luồng thay thế (Alternative):**

- A1 - Đổi ngôn ngữ: Tại bước 4, người dùng chọn {Chuyển Đổi Ngôn Ngữ}. Hệ thống tải lại nội dung theo ngôn ngữ mới và hiển thị tiếp.
- A2 - Chuyển sang nghe thuyết minh: Tại bước 4, người dùng chọn "Nghe thuyết minh". Hệ thống chuyển sang use case {Nghe Thuyết Minh}.

**Luồng ngoại lệ (Exception):**

- E1 - Chưa có nội dung ở ngôn ngữ đã chọn: Hệ thống hiển thị nội dung ở ngôn ngữ mặc định (Tiếng Việt) kèm thông báo "Nội dung chưa có bản dịch".
- E2 - Lỗi tải nội dung: Hệ thống thông báo "Không tải được nội dung, vui lòng thử lại" và cho phép tải lại.

**Điều kiện kết thúc:** Nội dung văn bản của hiện vật được hiển thị đầy đủ theo ngôn ngữ người dùng đang chọn.

**Sự kiện kích hoạt (Trigger):** Người dùng chọn "Đọc nội dung" tại màn hình chi tiết hiện vật (hoặc được mở tự động sau khi quét QR).

***Sơ đồ hoạt động (Activity Diagram) — USC12***

![](media/image25.png)

## 3.13 USC13 — Xem Hình Ảnh

***Sơ đồ Use Case — USC13***

![](media/image26.png)

**Tác nhân (Actor):** Người Dùng

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Cho phép người dùng xem hình ảnh minh họa của hiện vật, bao gồm xem thư viện ảnh, phóng to/thu nhỏ và lướt qua các ảnh.

**Điều kiện tiên quyết:** Đã xác định được hiện vật cần xem và người dùng đang ở màn hình chi tiết hiện vật.

**Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Người dùng chọn "Xem hình ảnh" tại màn hình chi tiết hiện vật. |  |
|  | 2. Hệ thống truy vấn danh sách hình ảnh gắn với hiện vật trong CSDL (E1, E2). |
|  | 3. Hệ thống hiển thị ảnh đại diện cùng danh sách ảnh thu nhỏ (thư viện ảnh). |
| 4. Người dùng chọn một ảnh để xem chi tiết (A1). |  |
|  | 5. Hệ thống hiển thị ảnh ở chế độ toàn màn hình cùng chú thích ảnh (nếu có). |
| 6. Người dùng đóng chế độ xem. Use case kết thúc. |  |

**Luồng thay thế (Alternative):**

- A1 - Phóng to/thu nhỏ và lướt ảnh: Tại bước 5, người dùng thao tác phóng to, thu nhỏ hoặc vuốt sang ảnh kế tiếp/trước đó. Hệ thống cập nhật hiển thị tương ứng.

**Luồng ngoại lệ (Exception):**

- E1 - Lỗi tải hình ảnh: Hệ thống hiển thị ảnh thay thế (placeholder) kèm nút "Tải lại".
- E2 - Hiện vật chưa có hình ảnh: Hệ thống thông báo "Hiện vật chưa có hình ảnh minh họa" và quay lại màn hình chi tiết hiện vật.

**Điều kiện kết thúc:** Hình ảnh của hiện vật được hiển thị cho người dùng xem.

**Sự kiện kích hoạt (Trigger):** Người dùng chọn "Xem hình ảnh" tại màn hình chi tiết hiện vật (hoặc được mở tự động sau khi quét QR).

***Sơ đồ hoạt động (Activity Diagram) — USC13***

![](media/image27.png)

## 3.14 USC14 — Xem Hồ Sơ Bảo Tàng

***Sơ đồ Use Case — USC14***

![](media/image28.png)

**Tác nhân (Actor):** Người Dùng

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Cho phép người dùng xem thông tin tổng quan về bảo tàng: giới thiệu, lịch sử hình thành, giờ mở cửa, địa chỉ, thông tin liên hệ và sơ đồ các khu trưng bày.

**Điều kiện tiên quyết:** Người dùng đã mở ứng dụng hoặc truy cập trang web của hệ thống.

**Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Người dùng chọn "Hồ sơ bảo tàng" trên giao diện chính. |  |
|  | 2. Hệ thống xác định ngôn ngữ đang chọn và truy vấn hồ sơ bảo tàng trong CSDL (E1). |
|  | 3. Hệ thống hiển thị thông tin giới thiệu, lịch sử, giờ mở cửa, địa chỉ và thông tin liên hệ của bảo tàng. |
| 4. Người dùng xem thông tin và có thể chọn xem sơ đồ khu trưng bày (A1). |  |
| 5. Người dùng thoát khỏi màn hình hồ sơ. Use case kết thúc. |  |

**Luồng thay thế (Alternative):**

- A1 - Xem sơ đồ khu trưng bày: Tại bước 4, người dùng chọn "Sơ đồ khu trưng bày". Hệ thống hiển thị sơ đồ do Admin quản lý ở {Quản Lý Sơ Đồ}; người dùng có thể phóng to/thu nhỏ rồi quay lại bước 4.

**Luồng ngoại lệ (Exception):**

- E1 - Lỗi tải hồ sơ bảo tàng: Hệ thống thông báo "Không tải được thông tin bảo tàng, vui lòng thử lại" và cho phép tải lại.

**Điều kiện kết thúc:** Thông tin hồ sơ bảo tàng được hiển thị đầy đủ theo ngôn ngữ người dùng đang chọn.

**Sự kiện kích hoạt (Trigger):** Người dùng chọn "Hồ sơ bảo tàng" trên giao diện chính.

***Sơ đồ hoạt động (Activity Diagram) — USC14***

![](media/image29.png)

## 3.15 USC15 — Tìm Kiếm

***Sơ đồ Use Case — USC15***

![](media/image30.png)

**Tác nhân (Actor):** Người Dùng

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Cho phép người dùng tìm hiện vật theo tên, mã số hoặc từ khóa trong mô tả. Đây cũng là phương án thay thế khi không quét được mã QR ({Quét Mã QR} - E1, E2).

**Điều kiện tiên quyết:** Người dùng đã mở ứng dụng hoặc truy cập trang web của hệ thống.

**Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Người dùng chọn chức năng "Tìm kiếm". |  |
|  | 2. Hệ thống hiển thị ô nhập từ khóa/mã số hiện vật. |
| 3. Người dùng nhập từ khóa hoặc mã số hiện vật và nhấn "Tìm" (A1, E1). |  |
|  | 4. Hệ thống tìm kiếm trong CSDL theo tên, mã số và mô tả hiện vật ở ngôn ngữ đang chọn (E2). |
|  | 5. Hệ thống hiển thị danh sách kết quả phù hợp. |
| 6. Người dùng chọn một hiện vật trong danh sách. |  |
|  | 7. Hệ thống chuyển đến màn hình chi tiết hiện vật, từ đó người dùng có thể đọc nội dung, xem hình ảnh hoặc nghe thuyết minh. Use case kết thúc. |

**Luồng thay thế (Alternative):**

- Không có

**Luồng ngoại lệ (Exception):**

- E1 - Từ khóa rỗng: Hệ thống yêu cầu người dùng nhập từ khóa trước khi tìm kiếm.
- E2 - Không có kết quả: Hệ thống thông báo "Không tìm thấy hiện vật phù hợp" và gợi ý kiểm tra lại từ khóa hoặc dùng chức năng Quét mã QR.

**Điều kiện kết thúc:** Người dùng tìm được hiện vật cần xem và được chuyển đến màn hình chi tiết hiện vật; hoặc nhận thông báo không có kết quả phù hợp.

**Sự kiện kích hoạt (Trigger):** Người dùng chọn biểu tượng/ô "Tìm kiếm" trên giao diện.

***Sơ đồ hoạt động (Activity Diagram) — USC15***

![](media/image30.png)

## 3.16 USC16 — Đăng Xuất

***Sơ đồ Use Case — USC16***

![](media/image31.png)

**Tác nhân (Actor):** Người (gồm Người Dùng và Admin đã đăng nhập)

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Kết thúc phiên làm việc hiện tại của người dùng hoặc quản trị viên, đưa hệ thống về chế độ khách vãng lai.

**Điều kiện tiên quyết:** Tác nhân đã đăng nhập thành công và đang có phiên làm việc (Session/Token) hợp lệ.

**Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Tác nhân chọn chức năng "Đăng xuất". |  |
|  | 2. Hệ thống hiển thị hộp thoại xác nhận đăng xuất. |
| 3. Tác nhân nhấn "Đồng ý" (A1). |  |
|  | 4. Hệ thống hủy phiên làm việc (Session/Token) và xóa dữ liệu phiên lưu trên thiết bị |
|  | 5. Hệ thống chuyển về màn hình chính ở chế độ khách vãng lai và thông báo "Đăng xuất thành công". Use case kết thúc. |

**Luồng thay thế (Alternative):**

- A1 - Hủy đăng xuất: Tại bước 3, tác nhân nhấn "Hủy". Hệ thống đóng hộp thoại và giữ nguyên phiên làm việc.

**Luồng ngoại lệ (Exception):**

- Không có

**Điều kiện kết thúc:** Phiên làm việc được hủy; tác nhân không còn quyền truy cập các chức năng yêu cầu đăng nhập cho đến khi đăng nhập lại.

**Sự kiện kích hoạt (Trigger):** Tác nhân chọn "Đăng xuất" trên giao diện.

***Sơ đồ hoạt động (Activity Diagram) — USC16***

![](media/image32.png)

## 3.17 USC17 — Quên Mật Khẩu

***Sơ đồ Use Case — USC17***

![](media/image33.png)

**Tác nhân (Actor):** Người Dùng, Admin

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Cho phép tác nhân đặt lại mật khẩu khi không nhớ mật khẩu hiện tại. Là use case mở rộng («extend») của {Đăng Nhập} tại điểm mở rộng "Quên mật khẩu" (UC02 - A2).

**Điều kiện tiên quyết:**

- Tác nhân đang ở màn hình {Đăng Nhập}.
- Tác nhân đã có tài khoản với Email/SĐT đăng ký còn hoạt động.

**Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Tác nhân chọn "Quên mật khẩu" tại màn hình đăng nhập. |  |
|  | 2. Hệ thống hiển thị biểu mẫu nhập Email/SĐT đã đăng ký. |
| 3. Tác nhân nhập Email/SĐT và nhấn "Gửi mã xác nhận" (A1). |  |
|  | 4. Hệ thống kiểm tra Email/SĐT có tồn tại trong CSDL (E1). |
|  | 5. Hệ thống gửi mã xác nhận (OTP) hoặc liên kết đặt lại mật khẩu đến Email/SĐT đó. |
| 6. Tác nhân nhập mã xác nhận nhận được. |  |
|  | 7. Hệ thống kiểm tra mã xác nhận còn hiệu lực và đúng (E2). |
|  | 8. Hệ thống hiển thị biểu mẫu nhập mật khẩu mới và xác nhận mật khẩu mới. |
| 9. Tác nhân nhập mật khẩu mới và nhấn "Xác nhận". |  |
|  | 10. Hệ thống kiểm tra mật khẩu hợp lệ và trùng khớp (E3), mã hóa và cập nhật vào CSDL. |
|  | 11. Hệ thống thông báo "Đặt lại mật khẩu thành công" và quay lại màn hình {Đăng Nhập}. Use case kết thúc. |

**Luồng thay thế (Alternative):**

- A1 - Hủy đặt lại mật khẩu: Tại bất kỳ bước nào trước bước 10, tác nhân nhấn "Hủy" hoặc quay lại. Hệ thống hủy thao tác, giữ nguyên mật khẩu cũ và quay về màn hình {Đăng Nhập}.

**Luồng ngoại lệ (Exception):**

- E1 - Email/SĐT chưa đăng ký: Hệ thống thông báo "Email/SĐT không tồn tại trên hệ thống" và cho phép nhập lại.
- E2 - Mã xác nhận sai hoặc hết hạn: Hệ thống thông báo lỗi và cho phép nhập lại hoặc yêu cầu gửi lại mã mới.
- E3 - Mật khẩu mới không hợp lệ: Mật khẩu không đủ độ dài an toàn hoặc phần xác nhận không trùng khớp. Hệ thống báo lỗi tại trường sai để nhập lại.

**Điều kiện kết thúc:** Mật khẩu mới được cập nhật; tác nhân có thể đăng nhập bằng mật khẩu mới.

**Sự kiện kích hoạt (Trigger):** Tác nhân chọn "Quên mật khẩu" tại màn hình đăng nhập (Extension Point của {Đăng Nhập}).

***Sơ đồ hoạt động (Activity Diagram) — USC17***

![](media/image34.png)

## 3.18 USC18 — Xem Phụ Đề

***Sơ đồ Use Case — USC18***

![](media/image35.png)

**Tác nhân (Actor):** Người Dùng

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Hiển thị phụ đề dạng văn bản đồng bộ với âm thanh thuyết minh đang phát. Là use case mở rộng («extend») của {Nghe Thuyết Minh} tại điểm mở rộng "Xem Phụ Đề" (UC04 - A1).

**Điều kiện tiên quyết:** Người dùng đang nghe thuyết minh (use case {Nghe Thuyết Minh} đang thực hiện).

**Dòng sự kiện chính:**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
| 1. Người dùng nhấn nút "Bật phụ đề" trên trình phát. |  |
|  | 2. Hệ thống xác định ngôn ngữ đang chọn và truy vấn tệp phụ đề tương ứng với tệp âm thanh đang phát (E1). |
|  | 3. Hệ thống hiển thị phụ đề đồng bộ theo mốc thời gian của bài thuyết minh. |
|  | 4. Hệ thống tiếp tục cập nhật phụ đề khi âm thanh phát, tạm dừng hoặc tua (A1). |
| 5. Người dùng nhấn "Tắt phụ đề" hoặc bài thuyết minh kết thúc. |  |
|  | 6. Hệ thống ẩn phụ đề và trả điều khiển về {Nghe Thuyết Minh}. Use case kết thúc. |

**Luồng thay thế (Alternative):**

- A1 - Đổi ngôn ngữ giữa chừng: Tại bước 4, người dùng chọn {Chuyển Đổi Ngôn Ngữ}. Hệ thống tải phụ đề theo ngôn ngữ mới, đồng bộ theo vị trí phát hiện tại và tiếp tục hiển thị.

**Luồng ngoại lệ (Exception):**

- E1 - Chưa có phụ đề cho ngôn ngữ đã chọn: Hệ thống thông báo "Chưa có phụ đề cho ngôn ngữ này" và tiếp tục phát âm thanh bình thường, không hiển thị phụ đề.

**Điều kiện kết thúc:** Phụ đề được hiển thị đồng bộ với âm thanh cho đến khi người dùng tắt phụ đề hoặc thuyết minh kết thúc.

**Sự kiện kích hoạt (Trigger):** Người dùng nhấn "Bật phụ đề" trên trình phát (Extension Point của {Nghe Thuyết Minh}).

***Sơ đồ hoạt động (Activity Diagram) — USC18***

![](media/image35.png)

## 3.19 USC19 — Phát Luồng Dữ Liệu Âm Thanh

***Sơ đồ Use Case — USC19***

![](media/image36.png)

**Tác nhân (Actor):** Thiết Bị Lưu Âm Thanh

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Truyền luồng dữ liệu âm thanh thuyết minh từ Thiết Bị Lưu Âm Thanh về ứng dụng của người dùng theo thời gian thực. Là use case con bắt buộc của {Nghe Thuyết Minh} («include»).

**Điều kiện tiên quyết:** Hệ thống đã xác định được ID tệp âm thanh và ngôn ngữ tương ứng với hiện vật (UC04, bước 4).

**Dòng sự kiện chính**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
|  | 1. Use case {Nghe Thuyết Minh} gửi yêu cầu lấy luồng âm thanh (ID tệp, ngôn ngữ) đến Thiết Bị Lưu Âm Thanh. |
| 2. Thiết Bị Lưu Âm Thanh tiếp nhận và kiểm tra tính hợp lệ của yêu cầu. |  |
| 3. Thiết Bị Lưu Âm Thanh tìm tệp âm thanh theo ID và ngôn ngữ (E1). |  |
| 4. Thiết Bị Lưu Âm Thanh mở luồng và truyền dữ liệu âm thanh theo từng đoạn (streaming) về ứng dụng (E2). |  |
|  | 5. Ứng dụng nhận dữ liệu, lưu đệm (buffer) và bắt đầu phát (A1). |
| 6. Khi phát hết tệp hoặc người dùng dừng phát, Thiết Bị Lưu Âm Thanh đóng luồng. |  |
|  | 7. Hệ thống trả điều khiển về {Nghe Thuyết Minh}. Use case kết thúc. |

**Luồng thay thế (Alternative):**

- A1 - Tua (Seek) hoặc đổi ngôn ngữ: Khi người dùng tua đến vị trí khác hoặc đổi ngôn ngữ (UC04 - A2), {Nghe Thuyết Minh} gửi yêu cầu mới. Thiết Bị Lưu Âm Thanh truyền luồng từ vị trí/tệp mới.

**Luồng ngoại lệ (Exception):**

- E1 - Không tìm thấy tệp âm thanh: Thiết Bị Lưu Âm Thanh trả mã lỗi; {Nghe Thuyết Minh} thông báo cho người dùng và gợi ý đọc bản văn bản ({Đọc Nội Dung}).
- E2 - Mất kết nối hoặc ngắt luồng giữa chừng: Hệ thống tự động thử kết nối lại. Nếu vẫn thất bại, thông báo “Không tải được âm thanh thuyết minh, vui lòng kiểm tra kết nối” (UC04 - E1).

**Điều kiện kết thúc:** Dữ liệu âm thanh được truyền liên tục về ứng dụng; luồng được đóng đúng cách khi kết thúc.

**Sự kiện kích hoạt (Trigger):** Use case {Nghe Thuyết Minh} thực hiện bước 5 (quan hệ «include»).

***Sơ đồ hoạt động (Activity Diagram) — USC19***

![](media/image36.png)

## 3.20 USC20 — Lưu Trữ Tệp Âm Thanh

***Sơ đồ Use Case — USC20***

![](media/image37.png)

**Tác nhân (Actor):** Thiết Bị Lưu Âm Thanh

**Mức độ hoàn thiện:** Focused

**Mô tả tóm tắt:** Lưu trữ tệp âm thanh thuyết minh (kèm thông tin hiện vật, ngôn ngữ) lên Thiết Bị Lưu Âm Thanh để phục vụ việc phát luồng. Use case này gọi use case {Quản Lý Tệp Âm Thanh} («include») để nhận tệp và thông tin do Admin cung cấp.

**Điều kiện tiên quyết:** Thiết Bị Lưu Âm Thanh sẵn sàng kết nối; tệp âm thanh và thông tin kèm theo đã được Admin cung cấp qua {Quản Lý Tệp Âm Thanh}.

**Dòng sự kiện chính**

| Hành động của Actor | Phản hồi của Hệ thống |
| --- | --- |
|  | 1. Hệ thống gọi use case {Quản Lý Tệp Âm Thanh} («include») để nhận tệp âm thanh thuyết minh và thông tin kèm theo (hiện vật, ngôn ngữ) do Admin cung cấp. |
|  | 2. Hệ thống kiểm tra tệp: đúng định dạng âm thanh và trong dung lượng cho phép (E1). |
|  | 3. Hệ thống kiểm tra đã có tệp cùng hiện vật và ngôn ngữ chưa (A1), tạo ID tệp và gửi yêu cầu lưu kèm dữ liệu đến Thiết Bị Lưu Âm Thanh. |
| 4. Thiết Bị Lưu Âm Thanh tiếp nhận yêu cầu và kiểm tra dung lượng trống (E2). |  |
| 5. Thiết Bị Lưu Âm Thanh ghi tệp lên bộ nhớ và kiểm tra tính toàn vẹn của tệp (E3). |  |
| 6. Thiết Bị Lưu Âm Thanh trả kết quả lưu thành công kèm ID và đường dẫn tệp. |  |
|  | 7. Hệ thống cập nhật thông tin tệp (ID, hiện vật, ngôn ngữ, đường dẫn) vào CSDL và thông báo “Lưu tệp âm thanh thành công”. Use case kết thúc. |

**Luồng thay thế (Alternative):**

- A1 - Thay thế tệp đã có: Tại bước 3, nếu đã tồn tại tệp cùng hiện vật và ngôn ngữ, hệ thống thông báo tệp đã có và gửi tệp mới đến Thiết Bị Lưu Âm Thanh. Tệp cũ chỉ bị thay thế sau khi tệp mới được lưu xong. Dòng sự kiện tiếp tục từ bước 4.

**Luồng ngoại lệ (Exception):**

- E1 - Tệp không hợp lệ: Tệp sai định dạng âm thanh hoặc vượt dung lượng cho phép. Hệ thống thông báo lỗi và không lưu tệp.
- E2 - Thiết bị không đủ dung lượng: Thiết Bị Lưu Âm Thanh trả mã lỗi; hệ thống thông báo “Không đủ dung lượng lưu trữ” và không lưu tệp.
- E3 - Ghi tệp thất bại hoặc mất kết nối: Hệ thống tự động thử lại. Nếu vẫn thất bại, hệ thống xóa phần tệp ghi dở và thông báo “Lưu tệp thất bại, vui lòng thử lại”.

**Điều kiện kết thúc:** Tệp âm thanh được lưu đầy đủ trên Thiết Bị Lưu Âm Thanh và thông tin tệp được cập nhật trong CSDL; nếu thất bại thì không giữ lại tệp ghi dở.

**Sự kiện kích hoạt (Trigger):** Hệ thống cần lưu một tệp âm thanh thuyết minh mới hoặc tệp được cập nhật (khi Admin thêm hoặc thay tệp).

***Sơ đồ hoạt động (Activity Diagram) — UC20***

![](media/image37.png)
