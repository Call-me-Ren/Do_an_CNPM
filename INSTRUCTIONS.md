# INSTRUCTIONS.md — Quy trình Làm việc & Kiểm chứng cho AI

## 1. Trước khi sửa đổi mã nguồn
1. Đọc [AGENTS.md](./AGENTS.md) và [RULE.md](./RULE.md).
2. Nếu có `graphify-out/GRAPH_REPORT.md`, kiểm tra các node liên quan để đánh giá phạm vi ảnh hưởng trước khi sửa.
3. Đối chiếu mọi thay đổi nghiệp vụ với [YEU_CAU_DO_AN.md](./YEU_CAU_DO_AN.md) và [docs/design/use-cases/v3/UCv3.md](./docs/design/use-cases/v3/UCv3.md).

---

## 2. Quy trình chỉnh sửa từng phân hệ

### A. Khi thay đổi dữ liệu / media bảo tàng (`frontend/src/data/museum_data.json`, `frontend/public/{audio,images,maps}`)
- `frontend/` là nguồn gốc (source of truth) của bộ media mẫu.
- Sau khi sửa media hoặc `museum_data.json` ở `frontend/`, **bắt buộc** chạy lại script đồng bộ sang `mobile/`:
  ```powershell
  node mobile/scripts/sync-assets.cjs
  ```
- Script này sẽ copy sang `mobile/assets/museum/` với tên file ASCII an toàn (tránh lỗi ký tự tiếng Việt/dấu nháy của Metro & Android AAPT2) và tạo lại `mobile/src/shared/assetMap.ts` cùng `mobile/src/data/museum_data.json`.

### B. Khi sửa logic dùng chung (`geofence.ts`, `qrHelper.ts`, `types/index.ts`, `locales/i18n.ts`)
- `mobile/` tự chứa bản sao tại `mobile/src/shared/` và `mobile/src/locales/` (không import chéo thư mục ngoài `mobile/` để Metro bundler và CI hoạt động độc lập).
- Nếu sửa logic ở `frontend/src/shared/utils/`, phải đồng bộ sang `mobile/src/shared/utils/` và chạy test cả 2 bên.

### C. Khi sửa API Backend (`backend/src/routes/`)
- Kiểm tra lại cả `frontend/src/shared/services/` và `mobile/src/shared/services/api.ts` để đảm bảo payload & schema Zod khớp nhau (đặc biệt `deviceType`, `lang`, `artifactSchema`).

### D. Khi cập nhật Tài liệu & Sơ đồ (`docs/`)
- **Tuyệt đối không xóa hay sửa đè** các phiên bản cũ (`V0`, `V1`, `V1''`, `V2`, `v0`, `v1'`).
- Mọi chỉnh sửa mới phải tạo ở phiên bản **V3** (`docs/design/use-cases/v3/`, `ComponentDiagramV3.puml`, `DeployDiagramV3.puml`, `ErdV3.puml`, `docs/design/dfd/`), tuân thủ **quy chuẩn trình bày của V0**, và ghi nhận vào [docs/design/audit/AUDIT_V3.md](./docs/design/audit/AUDIT_V3.md).

---

## 3. Quy trình kiểm thử bắt buộc trước khi kết thúc tác vụ
Chạy các lệnh kiểm tra tương ứng với phân hệ đã sửa:
1. **Frontend:** `cd frontend; npm run lint; npm test; npm run build`
2. **Mobile:** `cd mobile; npm run typecheck; npm run lint; npm test; npx expo export --platform android`
3. **Backend:** `cd backend; npm run typecheck; npm test; npm run build`

Chỉ báo cáo hoàn thành khi tất cả lệnh liên quan đều thoát với mã `0`.
