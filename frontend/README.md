# Hướng Dẫn Vận Hành & Cấu Trúc Front-end (Smart Audio Guide)

Dự án Front-end cho đề tài: **"Hệ thống Thuyết minh tự động đa ngôn ngữ"** (Công nghệ phần mềm).

---

## 1. Bản Đồ Ánh Xạ Kiến Trúc Hệ Thống (Architecture Mapping)

Dựa trên các sơ đồ hệ thống đã thiết kế trong dự án:

| Sơ đồ gốc | Thành phần trong sơ đồ | File mã nguồn Front-end tương ứng | Vai trò kỹ thuật |
|---|---|---|---|
| **Component Diagram** | `GUI` (Client) | [index.html](file:///d:/github/Do_an_CNPM/frontend/index.html) & [app.js](file:///d:/github/Do_an_CNPM/frontend/src/app.js) | Single-Page Application (SPA) điều hướng giao diện |
| **Component Diagram** | `Client Session` | [ClientSession.js](file:///d:/github/Do_an_CNPM/frontend/src/services/ClientSession.js) | Quản lý Token, phiên làm việc, phân quyền Actor qua interface `I_Auth` |
| **Component Diagram** | `QR Scanner` | [QRScanner.js](file:///d:/github/Do_an_CNPM/frontend/src/components/QRScanner.js) | Camera scanner & đối chiếu mã hiện vật qua `I_Artifact` |
| **Component Diagram** | `Media Player` | [MediaPlayer.js](file:///d:/github/Do_an_CNPM/frontend/src/services/MediaPlayer.js) & [PlayerBar.js](file:///d:/github/Do_an_CNPM/frontend/src/components/PlayerBar.js) | Stream audio, tua bài, phụ đề đa ngôn ngữ qua `I_Audio` |
| **Deploy Diagram** | `Client PC / Browser` | Thư mục `frontend/` | Môi trường thực thi client độc lập |
| **Deploy Diagram** | `Application Server` | [MockDatabase.js](file:///d:/github/Do_an_CNPM/frontend/src/services/MockDatabase.js) & [ArtifactService.js](file:///d:/github/Do_an_CNPM/frontend/src/services/ArtifactService.js) | Giả lập AuthServer.jar, ArtifactManager.jar, AudioStreamer.jar |

---

## 2. Danh Sách Use Case Đã Được Hiện Thực Đầy Đủ

1. **USC01 — Đăng Ký Tài Khoản**: Form validate email, password, ngôn ngữ mặc định, xử lý trùng lặp tài khoản.
2. **USC02 — Đăng Nhập Hệ Thống**: Xác thực danh tính, kiểm tra quyền User / Admin, cơ chế tự khóa sau 5 lần nhập sai.
3. **USC03 — Quét Mã QR**: Mở camera thực tế hoặc tra cứu nhanh theo mã hiện vật (ví dụ: `ART_art_001`).
4. **USC04 & USC19 — Nghe Thuyết Minh & Phát Luồng Dữ Liệu**: Phát thanh, tua tiến độ, điều chỉnh tốc độ đọc (0.75x - 1.5x).
5. **USC05 — Chuyển Đổi Ngôn Ngữ**: Hỗ trợ 5 ngôn ngữ (Tiếng Việt, English, Français, 日本語, 中文), tự động đổi thuyết minh và phụ đề.
6. **USC06 — Lưu Sự Vật Yêu Thích**: Thêm/xóa hiện vật yêu thích với biểu tượng trái tim, lưu trạng thái theo từng user.
7. **USC07 — Quản Lý Sự Vật**: Thêm mới, cập nhật, xóa hiện vật trong bảng quản trị Admin.
8. **USC08 — Chỉnh Sửa Mã QR**: Sinh mã QR code động cho từng hiện vật, cho phép tải ảnh QR.
9. **USC09 & USC20 — Quản Lý & Lưu Trữ Tệp Âm Thanh**: Tích hợp luồng URL audio vào cơ sở dữ liệu.
10. **USC10 — Xem Thống Kê Lượt Nghe**: Dashboard biểu đồ trực quan lượt nghe theo ngày và tỷ lệ từng hiện vật, nút xuất báo cáo.
11. **USC11 & USC14 — Sơ Đồ Bảo Tàng & Hồ Sơ Bảo Tàng**: Xem thông tin giờ mở cửa, giá vé, địa chỉ và mặt bằng từng khu trưng bày.
12. **USC12 & USC13 — Đọc Nội Dung & Xem Hình Ảnh**: Trang chi tiết di sản với ảnh nét cao, zoom ảnh, phụ đề văn bản.
13. **USC15 — Tìm Kiếm**: Bộ lọc tìm kiếm nhanh theo từ khóa tên hiện vật, thời kỳ lịch sử.
14. **USC16 — Đăng Xuất**: Xóa token và phiên làm việc khỏi bộ nhớ an toàn.
15. **USC17 — Quên Mật Khẩu**: Quy trình gửi mã OTP 6 số và đặt lại mật khẩu mới.

---

## 3. Cách Chạy Thử Ứng Dụng Ngay Lập Tức

Do ứng dụng được viết bằng kiến trúc hiện đại tiêu chuẩn Web Modules (ES6 Modules) và Tailwind CSS CDN:

### Cách 1: Sử dụng Python HTTP Server có sẵn trên máy
Mở PowerShell tại thư mục dự án và gõ:
```powershell
python -m http.server 8080 --directory frontend
```
Sau đó truy cập trình duyệt: `http://localhost:8080`

### Cách 2: Sử dụng VS Code Live Server
Mở thư mục `frontend` trong VS Code, chuột phải vào file `index.html` và chọn **Open with Live Server**.

---

## 4. Tài Khoản Thử Nghiệm Có Sẵn

- **Quản trị viên (Admin):**
  - Email: `admin@museum.vn`
  - Mật khẩu: `admin123`
  - *(Khi đăng nhập tài khoản này, trên thanh menu sẽ hiển thị nút **⚙️ Admin Panel** để quản lý hiện vật và xem thống kê lượt nghe)*

- **Khách tham quan (User):**
  - Email: `visitor@museum.vn`
  - Mật khẩu: `password123`
