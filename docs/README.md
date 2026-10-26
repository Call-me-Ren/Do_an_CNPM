# 📚 Tài Liệu Đồ Án Công Nghệ Phần Mềm (Do_an_CNPM)

Thư mục này lưu trữ toàn bộ tài liệu phục vụ báo cáo, phân tích yêu cầu và thiết kế kiến trúc của đề tài **Hệ thống thuyết minh tự động đa ngôn ngữ tại bảo tàng (Museum Audio Guide)**.

---

## 🗂️ Cấu Trúc Thư Mục Tài Liệu

```
docs/
├── report/                   # Báo cáo tổng kết đồ án môn học
│   └── BAO_CAO_DO_AN_CONG_NGHE_PHAN_MEM_SGU.docx
│
├── requirements/             # Phân tích & Đặc tả yêu cầu phần mềm
│   ├── Context.md            # Bối cảnh & phạm vi đề tài
│   ├── DacTaUseCase.md       # Chi tiết đặc tả các Use Case
│   ├── narrative_and_key_features.md  # Kịch bản sử dụng & tính năng trọng tâm
│   ├── system_presentation_summary.md # Bản tóm tắt báo cáo & thuyết trình
│   └── assets/               # File văn bản gốc (PDF, DOCX) và hình ảnh minh họa
│
└── design/                   # Thiết kế kiến trúc & mô hình hóa UML
    ├── components/           # Sơ đồ thành phần kiến trúc (Component Diagram)
    │   ├── ComponentDiagram.puml
    │   └── archive/
    ├── deployment/           # Sơ đồ triển khai hệ thống (Deployment Diagram)
    │   ├── UMLDeployDiagram.puml
    │   └── archive/
    ├── erd/                  # Sơ đồ thực thể liên kết (Entity Relationship Diagram)
    │   └── erd.puml
    └── use-cases/            # Sơ đồ hoạt động use case chi tiết (UC01 -> UC20)
        ├── Use_cases_activities.puml
        ├── DacTaUseCase.pdf
        └── archive/ (File thiết kế Draw.io & Mermaid chi tiết từng use case)
```

---

## 🧭 Hướng Dẫn Tra Cứu Nhanh

1. **Báo cáo hoàn chỉnh đồ án:**  
   Xem tại [`report/BAO_CAO_DO_AN_CONG_NGHE_PHAN_MEM_SGU.docx`](./report/BAO_CAO_DO_AN_CONG_NGHE_PHAN_MEM_SGU.docx).

2. **Đặc tả Use Case chi tiết (20 Use Cases):**  
   - Xem dạng Markdown: [`requirements/DacTaUseCase.md`](./requirements/DacTaUseCase.md)  
   - Xem dạng PDF: [`requirements/assets/DacTaUseCase.pdf`](./requirements/assets/DacTaUseCase.pdf) hoặc [`design/use-cases/DacTaUseCase.pdf`](./design/use-cases/DacTaUseCase.pdf)

3. **Mô hình hóa UML (PlantUML / Draw.io):**  
   - **Component Diagram:** [`design/components/ComponentDiagram.puml`](./design/components/ComponentDiagram.puml)
   - **Deployment Diagram:** [`design/deployment/UMLDeployDiagram.puml`](./design/deployment/UMLDeployDiagram.puml)
   - **ERD:** [`design/erd/erd.puml`](./design/erd/erd.puml)
   - **Use Case Activities:** [`design/use-cases/Use_cases_activities.puml`](./design/use-cases/Use_cases_activities.puml)
