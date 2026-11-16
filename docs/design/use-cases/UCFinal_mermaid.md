# Sơ Đồ Use Case Final Chuẩn Hóa — Định Dạng Mermaid (Tối Giản)

Tài liệu này tập hợp 15 sơ đồ Use Case (1 sơ đồ tổng quát và 14 sơ đồ phân rã chi tiết `UC01` đến `UC14`) được chuẩn hóa theo phong cách **tối giản, gọn gàng, chuẩn UML 2.5** tương tự `UCv1'.puml`, sử dụng cú pháp **Mermaid `usecase-beta`** (Mermaid 12.0.0+).

---

## 1. Sơ Đồ Tổng Quát (General Overview — 14 Use Cases)

> Tập tin nguồn: [General.mermaid](file:///C:/Users/Admin/Documents/Code/University/SE/Do_an_CNPM/docs/design/use-cases/final/General.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Khách tham quan")
actor Admin("Quản trị viên (Admin)")
actor GpsSystem("Hệ thống định vị GPS")
actor AudioSystem("Hệ thống âm thanh")

systemBoundary sys["Hệ thống thuyết minh tự động đa ngôn ngữ"]
  UC01("Đăng nhập quản trị")
  UC02("Quét mã QR")
  UC03("Nghe thuyết minh")
  UC04("Chuyển đổi ngôn ngữ")
  UC05("Lưu hiện vật yêu thích")
  UC06("Xem hồ sơ bảo tàng")
  UC07("Xem phụ đề đồng bộ")
  UC08("Tìm kiếm hiện vật")
  UC09("Quản lý hiện vật")
  UC10("Quản lý phiên & Mã QR")
  UC11("Quản lý tệp âm thanh")
  UC12("Xem thống kê lượt nghe")
  UC13("Quản lý sơ đồ tầng")
  UC14("Định vị & Tự động thuyết minh")
end

%% Tác nhân: Khách tham quan
Visitor --> UC02
Visitor --> UC03
Visitor --> UC04
Visitor --> UC05
Visitor --> UC06
Visitor --> UC08
Visitor --> UC14

%% Tác nhân: Quản trị viên
Admin --> UC01
Admin --> UC09
Admin --> UC10
Admin --> UC11
Admin --> UC12
Admin --> UC13

%% Tác nhân hệ thống ngoài
GpsSystem --> UC14
AudioSystem --> UC03

%% Quan hệ <<include>>
UC09 ..> : include UC01
UC10 ..> : include UC01
UC11 ..> : include UC01
UC12 ..> : include UC01
UC13 ..> : include UC01

%% Quan hệ <<extend>>
UC07 ..> : extend UC03
UC14 ..> : extend UC03
```

---

## 2. Phân Rã Chi Tiết 14 Use Cases (Tối Giản)

### UC01 — Đăng nhập quản trị
> Tập tin nguồn: [UC01_usecase.mermaid](file:///C:/Users/Admin/Documents/Code/University/SE/Do_an_CNPM/docs/design/use-cases/final/UC01_usecase.mermaid)

```mermaid
usecase-beta
direction LR

actor Admin("Quản trị viên (Admin)")

systemBoundary sys["Hệ thống thuyết minh tự động đa ngôn ngữ"]
  UC01("Đăng nhập quản trị")
end

Admin --> UC01
```

---

### UC02 — Quét mã QR
> Tập tin nguồn: [UC02_usecase.mermaid](file:///C:/Users/Admin/Documents/Code/University/SE/Do_an_CNPM/docs/design/use-cases/final/UC02_usecase.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Khách tham quan")

systemBoundary sys["Hệ thống thuyết minh tự động đa ngôn ngữ"]
  UC02("Quét mã QR")
end

Visitor --> UC02
```

---

### UC03 — Nghe thuyết minh
> Tập tin nguồn: [UC03_usecase.mermaid](file:///C:/Users/Admin/Documents/Code/University/SE/Do_an_CNPM/docs/design/use-cases/final/UC03_usecase.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Khách tham quan")
actor AudioSystem("Hệ thống âm thanh")

systemBoundary sys["Hệ thống thuyết minh tự động đa ngôn ngữ"]
  UC03("Nghe thuyết minh")
  UC07("Xem phụ đề đồng bộ")
end

Visitor --> UC03
AudioSystem --> UC03
UC07 ..> : extend UC03
```

---

### UC04 — Chuyển đổi ngôn ngữ
> Tập tin nguồn: [UC04_usecase.mermaid](file:///C:/Users/Admin/Documents/Code/University/SE/Do_an_CNPM/docs/design/use-cases/final/UC04_usecase.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Khách tham quan")

systemBoundary sys["Hệ thống thuyết minh tự động đa ngôn ngữ"]
  UC04("Chuyển đổi ngôn ngữ")
end

Visitor --> UC04
```

---

### UC05 — Lưu hiện vật yêu thích
> Tập tin nguồn: [UC05_usecase.mermaid](file:///C:/Users/Admin/Documents/Code/University/SE/Do_an_CNPM/docs/design/use-cases/final/UC05_usecase.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Khách tham quan")

systemBoundary sys["Hệ thống thuyết minh tự động đa ngôn ngữ"]
  UC05("Lưu hiện vật yêu thích")
end

Visitor --> UC05
```

---

### UC06 — Xem hồ sơ bảo tàng
> Tập tin nguồn: [UC06_usecase.mermaid](file:///C:/Users/Admin/Documents/Code/University/SE/Do_an_CNPM/docs/design/use-cases/final/UC06_usecase.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Khách tham quan")

systemBoundary sys["Hệ thống thuyết minh tự động đa ngôn ngữ"]
  UC06("Xem hồ sơ bảo tàng")
end

Visitor --> UC06
```

---

### UC07 — Xem phụ đề đồng bộ
> Tập tin nguồn: [UC07_usecase.mermaid](file:///C:/Users/Admin/Documents/Code/University/SE/Do_an_CNPM/docs/design/use-cases/final/UC07_usecase.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Khách tham quan")

systemBoundary sys["Hệ thống thuyết minh tự động đa ngôn ngữ"]
  UC03("Nghe thuyết minh")
  UC07("Xem phụ đề đồng bộ")
end

Visitor --> UC03
UC07 ..> : extend UC03
```

---

### UC08 — Tìm kiếm hiện vật
> Tập tin nguồn: [UC08_usecase.mermaid](file:///C:/Users/Admin/Documents/Code/University/SE/Do_an_CNPM/docs/design/use-cases/final/UC08_usecase.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Khách tham quan")

systemBoundary sys["Hệ thống thuyết minh tự động đa ngôn ngữ"]
  UC08("Tìm kiếm hiện vật")
end

Visitor --> UC08
```

---

### UC09 — Quản lý hiện vật
> Tập tin nguồn: [UC09_usecase.mermaid](file:///C:/Users/Admin/Documents/Code/University/SE/Do_an_CNPM/docs/design/use-cases/final/UC09_usecase.mermaid)

```mermaid
usecase-beta
direction LR

actor Admin("Quản trị viên (Admin)")

systemBoundary sys["Hệ thống thuyết minh tự động đa ngôn ngữ"]
  UC09("Quản lý hiện vật")
  UC01("Đăng nhập quản trị")
end

Admin --> UC09
UC09 ..> : include UC01
```

---

### UC10 — Quản lý phiên & Mã QR
> Tập tin nguồn: [UC10_usecase.mermaid](file:///C:/Users/Admin/Documents/Code/University/SE/Do_an_CNPM/docs/design/use-cases/final/UC10_usecase.mermaid)

```mermaid
usecase-beta
direction LR

actor Admin("Quản trị viên (Admin)")

systemBoundary sys["Hệ thống thuyết minh tự động đa ngôn ngữ"]
  UC10("Quản lý phiên & Mã QR")
  UC01("Đăng nhập quản trị")
end

Admin --> UC10
UC10 ..> : include UC01
```

---

### UC11 — Quản lý tệp âm thanh
> Tập tin nguồn: [UC11_usecase.mermaid](file:///C:/Users/Admin/Documents/Code/University/SE/Do_an_CNPM/docs/design/use-cases/final/UC11_usecase.mermaid)

```mermaid
usecase-beta
direction LR

actor Admin("Quản trị viên (Admin)")

systemBoundary sys["Hệ thống thuyết minh tự động đa ngôn ngữ"]
  UC11("Quản lý tệp âm thanh")
  UC01("Đăng nhập quản trị")
end

Admin --> UC11
UC11 ..> : include UC01
```

---

### UC12 — Xem thống kê lượt nghe
> Tập tin nguồn: [UC12_usecase.mermaid](file:///C:/Users/Admin/Documents/Code/University/SE/Do_an_CNPM/docs/design/use-cases/final/UC12_usecase.mermaid)

```mermaid
usecase-beta
direction LR

actor Admin("Quản trị viên (Admin)")

systemBoundary sys["Hệ thống thuyết minh tự động đa ngôn ngữ"]
  UC12("Xem thống kê lượt nghe")
  UC01("Đăng nhập quản trị")
end

Admin --> UC12
UC12 ..> : include UC01
```

---

### UC13 — Quản lý sơ đồ tầng
> Tập tin nguồn: [UC13_usecase.mermaid](file:///C:/Users/Admin/Documents/Code/University/SE/Do_an_CNPM/docs/design/use-cases/final/UC13_usecase.mermaid)

```mermaid
usecase-beta
direction LR

actor Admin("Quản trị viên (Admin)")

systemBoundary sys["Hệ thống thuyết minh tự động đa ngôn ngữ"]
  UC13("Quản lý sơ đồ tầng")
  UC01("Đăng nhập quản trị")
end

Admin --> UC13
UC13 ..> : include UC01
```

---

### UC14 — Định vị & Tự động thuyết minh
> Tập tin nguồn: [UC14_usecase.mermaid](file:///C:/Users/Admin/Documents/Code/University/SE/Do_an_CNPM/docs/design/use-cases/final/UC14_usecase.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Khách tham quan")
actor GpsSystem("Hệ thống định vị GPS")

systemBoundary sys["Hệ thống thuyết minh tự động đa ngôn ngữ"]
  UC14("Định vị & Tự động thuyết minh")
  UC03("Nghe thuyết minh")
end

Visitor --> UC14
GpsSystem --> UC14
UC14 ..> : extend UC03
```
