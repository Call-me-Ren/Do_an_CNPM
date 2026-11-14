# 📚 Tài Liệu Đồ Án Công Nghệ Phần Mềm (Do_an_CNPM)

Thư mục này lưu trữ toàn bộ tài liệu phân tích yêu cầu, kiểm tra đối chiếu mã nguồn (Audit) và thiết kế kiến trúc của đề tài **Hệ thống Thuyết minh Tự động Đa ngôn ngữ (Museum Audio Guide)** trên **Web SPA** và **Android Mobile App**.

---

## 🗂️ Cấu Trúc Thư Mục Tài Liệu

```text
docs/
├── report/
│   ├── Bao_cao_do_an_CNPM_v2.md          # Báo cáo tổng kết đồ án (đã bổ sung Mobile App, DFD & V3)
│   ├── media/                            # Hình ảnh sơ đồ cho báo cáo
│   └── Bao_cao_do_an_CNPM_v0/            # Bản lưu trữ lịch sử v0
│
├── requirements/
│   └── Context.md                        # Bối cảnh, mục tiêu & quy ước kỹ thuật
│
└── design/
    ├── audit/
    │   └── AUDIT_V3.md                   # Báo cáo kiểm tra sai lệch giữa tài liệu cũ (V0–V2) và mã nguồn
    ├── components/                       # ComponentDiagramV{0, 1, 1'', 2, 3}.puml
    ├── deployment/                       # DeployDiagramV{0, 1, 1'', 2, 3}.puml
    ├── erd/                              # ErdV{0, 1, 3}.puml (V3 khớp 12 bảng schema.sql)
    ├── dfd/                              # DFD Mức 0, Mức 1, Mức 2 & đặc tả DFD.md
    └── use-cases/
        ├── v0/                           # Bản 20 UC gốc (lưu trữ lịch sử)
        ├── v1 (quan)/                    # Bản nháp v1 (lưu trữ lịch sử)
        ├── v1'/                          # Bản chốt 14 UC (lưu trữ lịch sử)
        └── v3/                           # Bản chuẩn hóa khớp 100% code Web + Android (OverviewUCv3.puml, UCv3.md, activity/)
```

---

## 🧭 Tra Cứu Nhanh Phiên Bản Chuẩn (V3)

1. **Đối chiếu mã nguồn & sơ đồ:** [`design/audit/AUDIT_V3.md`](./design/audit/AUDIT_V3.md)
2. **Đặc tả 14 Use Cases (Web & Android):** [`design/use-cases/v3/UCv3.md`](./design/use-cases/v3/UCv3.md) & [`OverviewUCv3.puml`](./design/use-cases/v3/OverviewUCv3.puml)
3. **Sơ đồ Luồng Dữ Liệu (DFD):** [`design/dfd/DFD.md`](./design/dfd/DFD.md) (`DFD_Level0.puml`, `DFD_Level1.puml`, `DFD_Level2_Geofence.puml`)
4. **Component Diagram V3:** [`design/components/ComponentDiagramV3.puml`](./design/components/ComponentDiagramV3.puml)
5. **Deployment Diagram V3:** [`design/deployment/DeployDiagramV3.puml`](./design/deployment/DeployDiagramV3.puml)
6. **ERD V3 (12 bảng MSSQL):** [`design/erd/ErdV3.puml`](./design/erd/ErdV3.puml)
