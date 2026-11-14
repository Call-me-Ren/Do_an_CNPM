# RULE.md — Quy tắc Bắt buộc (Hard Rules)

1. **Bảo toàn lịch sử tài liệu:** Không được xóa, di chuyển hay ghi đè các file thiết kế và báo cáo phiên bản cũ (`V0`, `V1`, `V1''`, `V2`, `v0`, `v1 (quan)`, `v1'`, `Bao_cao_do_an_CNPM_v0`). Mọi cập nhật phải đi vào nhánh `V3` / `dfd` / phụ lục báo cáo.
2. **Giữ nguyên quy chuẩn trình bày V0:** Mọi sơ đồ mới (Component, Deployment, ERD, Use Case) phải dùng đúng ký hiệu và bố cục chuẩn mực của bản V0 (portin/portout, interface ball-and-socket, crow's foot ERD, `!pragma layout smetana` cho Use Case).
3. **Không bịa số liệu / trạng thái:** Mọi thông số trong tài liệu (`12 bảng`, `15m`, `150m`, `30MB`, `10MB`, `60s`/`5 phút`, `14 Use Cases`) phải đối chiếu trực tiếp từ mã nguồn thực tế; cấm đoán mò hoặc dùng placeholder (`TODO`).
4. **Offline-First cho Mobile App:** Ứng dụng `mobile/` phải chạy được đầy đủ tính năng Visitor (khám phá, quét QR, sơ đồ tầng, phát audio 5 ngôn ngữ, phụ đề, geofence, yêu thích) khi **không có Internet**. Mọi lệnh gọi mạng lên Backend đều phải đặt trong `try-catch` có timeout và fallback im lặng về cache / dữ liệu nhúng trong APK.
5. **Tách biệt Admin & Visitor:** Không đưa phân hệ Admin CMS vào `mobile/`. Admin chỉ nằm ở `frontend/` (`/admin`).
6. **Chặt chẽ về TypeScript & Linting:** Không lạm dụng kiểu `any` tùy tiện; mọi API response/request đều phải có interface tại `shared/types/index.ts` và validate bằng Zod ở Backend.
7. **Không lộ bí mật:** Không commit `backend/.env` hoặc token/secret thật lên Git.
8. **Giữ các kênh CI/CD hoạt động:** Không xóa cấu hình GitHub Pages (`deploy.yml`, `404.html`, `.nojekyll`, `prepare_deploy.cjs`), không xóa `cloudflared.exe`, giữ đủ 3 workflow CI/CD (`deploy.yml`, `docker.yml`, `mobile.yml`).
9. **Ngôn ngữ mã nguồn & tài liệu:** Tên biến/hàm/lớp viết bằng Tiếng Anh kỹ thuật; comment giải thích nghiệp vụ, nội dung UI mặc định và báo cáo viết bằng Tiếng Việt rõ ràng, học thuật.
