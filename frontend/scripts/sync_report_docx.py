import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

def sync_report():
    path = 'docs/report/BAO_CAO_DO_AN_CONG_NGHE_PHAN_MEM_SGU.docx'
    doc = docx.Document(path)

    # 1. Replace language occurrences (Tiếng Pháp -> Tiếng Hàn)
    lang_replacements = [
        ('Tiếng Pháp', 'Tiếng Hàn'),
        ('tiếng Pháp', 'tiếng Hàn'),
        ('Français', '한국어'),
        ('Tiếng Việt, Anh, Pháp, Nhật, Trung', 'Tiếng Việt, Anh, Trung, Hàn, Nhật'),
        ('Tiếng Việt, Tiếng Anh (English), Tiếng Pháp (Français), Tiếng Nhật (日本語), Tiếng Trung (中文)',
         'Tiếng Việt, Tiếng Anh (English), Tiếng Trung (中文), Tiếng Hàn (한국어), Tiếng Nhật (日本語)'),
        ('Chuyển sang Tiếng Pháp và Tiếng Nhật', 'Chuyển sang Tiếng Hàn và Tiếng Nhật'),
    ]

    for p in doc.paragraphs:
        for old, new in lang_replacements:
            if old in p.text:
                p.text = p.text.replace(old, new)

    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for old, new in lang_replacements:
                    if old in cell.text:
                        cell.text = cell.text.replace(old, new)

    # 2. Update Table 4 (USC02 - Đăng Nhập): Add 5-try lockout
    t4 = doc.tables[4]
    for row in t4.rows:
        if 'Luồng ngoại lệ' in row.cells[0].text:
            row.cells[1].text = (
                '● E1 - Sai mật khẩu hoặc tài khoản không tồn tại: Hệ thống thông báo lỗi và cho phép nhập lại.\n'
                '● E2 - Chống tấn công dò mật khẩu (Brute-Force): Nếu nhập sai quá 5 lần liên tiếp, hệ thống tự động khóa tạm thời 5 phút kèm đồng hồ đếm ngược trên giao diện.'
            )
        elif 'Điều kiện kết thúc' in row.cells[0].text:
            row.cells[1].text = (
                '● Thành công: Phiên làm việc (Session/Token) được khởi tạo thành công với quyền hạn tương ứng '
                '(Admin truy cập Dashboard Quản trị; khách vãng lai sử dụng trực tiếp các tính năng thuyết minh không cần đăng nhập).\n'
                '● Thất bại: Hệ thống từ chối truy cập và hiển thị thông báo lỗi.'
            )

    # 3. Update Table 5 (USC03 - Quét Mã QR): Add hybrid QR + GPS tracking
    t5 = doc.tables[5]
    for row in t5.rows:
        if 'Mô tả tóm tắt' in row.cells[0].text:
            row.cells[1].text = (
                'Người dùng sử dụng camera quét mã QR tại cổng hoặc gắn tại hiện vật để mở nội dung thuyết minh. '
                'Đồng thời, hệ thống ghi nhận mã QR làm mốc neo xuất phát (anchorArtifactId) và tự động kích hoạt chế độ GPS theo dõi '
                'độ chính xác cao, tự động nhận diện và gợi ý phát thuyết minh khi đến gần các hiện vật tiếp theo mà không cần quét lại.'
            )

    # 4. Update Table 8 (USC06 - Lưu Yêu Thích): State guest LocalStorage
    t8 = doc.tables[8]
    for row in t8.rows:
        if 'Điều kiện tiên quyết' in row.cells[0].text:
            row.cells[1].text = 'Người dùng đang ở màn hình chi tiết hiện vật (không yêu cầu đăng nhập tài khoản).'
        elif 'Điều kiện kết thúc' in row.cells[0].text:
            row.cells[1].text = 'Hiện vật được thêm vào danh sách yêu thích lưu trữ cục bộ trên thiết bị của người dùng (LocalStorage).'

    # 5. Update Source Tree in Chapter 4 (Paragraph 579)
    actual_source_tree = """Do_an_CNPM/
├── index.html                   # Điểm khởi nhập HTML Single-Page Application (SPA)
├── package.json                 # Cấu hình dự án React 18, TypeScript, Tailwind CSS, Vite
├── vite.config.ts               # Thiết lập pipeline build tối ưu hóa và đường dẫn alias
├── public/                      # Thư mục tài nguyên tĩnh phân phối qua Web CDN
│   ├── audio/                   # 15 tệp âm thanh thuyết minh MP3 thời lượng thực tế
│   ├── images/                  # Sơ đồ bản đồ 4 khu vực (ngoài trời, trệt, lầu 1, lầu 2)
│   └── mock/museum_data.json    # Dữ liệu hiện vật chuẩn có tọa độ GPS & bán kính kích hoạt
└── src/
    ├── visitor/                 # Phân hệ giao diện khách tham quan
    │   ├── VisitorLayout.tsx    # Bộ điều hướng chung, kích hoạt QR & GPS tracking
    │   ├── components/          # TrackingPanel, AudioPlayerBar, SubtitleOverlay
    │   └── views/               # FloorMapView (halo định vị), ExploreView, ArtifactDetailView
    ├── admin/                   # Phân hệ giao diện quản trị viên
    │   ├── AdminLayout.tsx      # Khung điều hướng Dashboard quản trị
    │   └── views/               # AdminLoginView (khóa 5 lần), ArtifactsManageView, SessionsManageView
    ├── shared/                  # Lớp dịch vụ, tiện ích và kho trạng thái dùng chung
    │   ├── utils/               # geofence.ts (Haversine & Proximity), qrHelper.ts, loginLock.ts
    │   ├── stores/              # geofenceStore, playerStore, langStore, favoritesStore
    │   ├── services/            # api.ts (mock DB + LocalStorage), tts.ts, audioService.ts
    │   └── types/               # Định nghĩa kiểu dữ liệu TypeScript (Artifact, Floor, Session)
    ├── locales/i18n.ts          # Từ điển phản ứng 5 ngôn ngữ (vi, en, zh, ko, ja)
    └── __tests__/               # Bộ kiểm thử tự động (21 tests: geofence, qr, login, audio)"""

    for p in doc.paragraphs:
        if 'frontend/' in p.text and 'components/' in p.text:
            p.text = actual_source_tree
            break

    # 6. Update Table 23 (Bảng 4.1: Bảng đối chiếu Kiến trúc Thiết kế và File Mã nguồn)
    t23 = doc.tables[23]
    # Clear existing rows after header
    while len(t23.rows) > 1:
        tr = t23.rows[-1]._tr
        tr.getparent().remove(tr)

    new_mapping_data = [
        ('Component Diagram', 'Phân hệ Khách tham quan', 'VisitorLayout.tsx & TrackingPanel.tsx', 'Điều phối luồng ứng dụng, quét QR deep link và kích hoạt GPS tracking'),
        ('Component Diagram', 'Bản đồ tương tác & Định vị', 'FloorMapView.tsx & geofence.ts', 'Hiển thị sơ đồ 4 tầng, mốc halo "Bạn đang ở đây" và tính khoảng cách Haversine'),
        ('Component Diagram', 'Bộ phát âm thanh & Phụ đề', 'AudioPlayerBar.tsx & playerStore.ts', 'Phát Web Audio HTML5, đồng bộ phụ đề Karaoke từng giây'),
        ('Component Diagram', 'Tra cứu & Tìm kiếm hiện vật', 'ExploreView.tsx & ArtifactDetailView.tsx', 'Tìm kiếm đa tiêu chí theo tên, mã số (ART-xxx) và tóm tắt hiện vật'),
        ('Component Diagram', 'Quản trị & Bảo mật đăng nhập', 'AdminLoginView.tsx & loginLock.ts', 'Xác thực Admin, chống Brute-force tự động khóa 5 phút khi sai 5 lần'),
        ('Component Diagram', 'Quản trị Hiện vật & Tọa độ', 'ArtifactsManageView.tsx & api.ts', 'CRUD hiện vật, cấu hình tọa độ GPS (geoCoordinates) & bán kính kích hoạt'),
        ('Component Diagram', 'Quản trị Phiên & Xuất mã QR', 'SessionsManageView.tsx', 'Quản lý ca mở cửa, đoàn khách và tạo mã QR đón tiếp tại cổng'),
        ('Deploy Diagram', 'Nút Thiết bị Khách / Admin', 'Trình duyệt Web (Web APIs)', 'Thực thi SPA, khai thác Camera API, Geolocation API, Web Audio API, LocalStorage'),
        ('Deploy Diagram', 'Hạ tầng Lưu trữ & Phân phối', 'GitHub Pages CDN', 'Nginx CDN phân phối gói tĩnh HTML/CSS/JS, MP3 audio và hình ảnh sơ đồ'),
        ('Deploy Diagram', 'Hạ tầng Giám sát Telemetry', 'ntfy.sh Gateway', 'Thu thập sự kiện thống kê lượt nghe và phiên tham quan qua HTTPS POST')
    ]

    for item in new_mapping_data:
        row = t23.add_row()
        for c_idx, val in enumerate(item):
            row.cells[c_idx].text = val

    # 7. Update Paragraph 584-588 (Mục 4.3 Các Tính năng Nổi bật)
    for p in doc.paragraphs:
        txt = p.text
        if 'Cơ chế Đa ngôn ngữ Phản ứng (i18n):' in txt:
            p.text = (
                'Cơ chế Đa ngôn ngữ Phản ứng (i18n): Hỗ trợ trọn vẹn 5 ngôn ngữ quốc tế: Tiếng Việt, Tiếng Anh (English), '
                'Tiếng Trung (中文), Tiếng Hàn (한국어), Tiếng Nhật (日本語). Chuyển đổi ngôn ngữ tức thời không cần tải lại trang '
                'với cơ chế đồng bộ phụ đề và thuyết minh tương ứng.'
            )
        elif 'Quét mã QR Code Thông minh:' in txt:
            p.text = (
                'Định vị Thông minh kết hợp QR & GPS (Hybrid Geofencing Tracking): Quét mã QR tại cổng hoặc hiện vật làm mốc neo xuất phát '
                '(anchorArtifactId), tự động kích hoạt GPS độ chính xác cao (enableHighAccuracy). Hệ thống tính toán khoảng cách Haversine '
                'thực tế tới các hiện vật, tự động nhận diện hiện vật trong bán kính 12m, hiển thị pin halo xanh "Bạn đang ở đây" trên bản đồ tầng '
                'và đưa ra gợi ý chuyển bài thuyết minh mượt mà khi di chuyển.'
            )
        elif 'Hệ thống Xác thực & Phân quyền:' in txt:
            p.text = (
                'Hệ thống Bảo mật Xác thực & Chống Brute-Force: Bảo mật tài khoản Quản trị bằng cơ chế mã hóa mật khẩu, '
                'tự động đếm số lần đăng nhập sai và kích hoạt khóa tạm thời 5 phút khi sai quá 5 lần liên tiếp (kèm đồng hồ đếm ngược). '
                'Khách tham quan được tối ưu hóa trải nghiệm tối đa, lưu trữ hiện vật yêu thích trực tiếp qua LocalStorage mà không cần tạo tài khoản.'
            )
        elif 'Bảng điều khiển Quản trị (Admin Panel):' in txt:
            p.text = (
                'Bảng điều khiển Quản trị Toàn diện (Admin Panel): Cho phép Quản trị viên thêm, sửa, xóa hiện vật trực tiếp; '
                'cấu hình tọa độ GPS địa lý (vĩ độ, kinh độ) và bán kính kích hoạt (triggerRadius); quản lý các ca mở cửa/phiên tham quan; '
                'tự động xuất mã QR cổng đón tiếp và mã QR hiện vật; theo dõi biểu đồ thống kê lượt nghe theo phiên và ngôn ngữ trực quan.'
            )

    # 8. Update Table 24 (Bảng 5.1: Kết quả kiểm thử thực nghiệm)
    t24 = doc.tables[24]
    while len(t24.rows) > 1:
        tr = t24.rows[-1]._tr
        tr.getparent().remove(tr)

    new_test_results = [
        ('TC_01', 'USC01 - Đăng Nhập & Khóa bảo mật', 'Nhập sai mật khẩu 5 lần liên tiếp -> Kích hoạt khóa 5 phút', 'Khóa đúng 5 phút, đếm ngược chính xác (PASS) - 4 tests'),
        ('TC_02', 'USC02 & USC14 - Quét mã QR & Deep Link', 'Giải mã QR URL: ?entry=gate, ?artifact=ART-001, mã trực tiếp', 'Nhận diện đúng mốc neo xuất phát (PASS) - 5 tests'),
        ('TC_03', 'USC14 - Định vị GPS Haversine & Vùng kích hoạt', 'Tính khoảng cách Haversine, kích hoạt vùng 12m, chọn hiện vật gần nhất', 'Tính toán sai số < 0.1m, phát hiện chuẩn (PASS) - 7 tests'),
        ('TC_04', 'USC03 & USC07 - Trình phát Audio & Phụ đề', 'Phát MP3 audio, tua tiến độ, đồng bộ phụ đề Karaoke từng giây', 'Âm thanh chuẩn, phụ đề khớp mốc thời gian (PASS) - 4 tests'),
        ('TC_05', 'USC08 - Tìm Kiếm & Tương tác giao diện', 'Tìm kiếm đa tiêu chí theo tên, mã số ART-xxx, mô tả tóm tắt', 'Lọc kết quả tức thời, click phát không lỗi (PASS) - 1 test'),
        ('TC_06', 'USC04 - Chuyển đổi 5 Ngôn ngữ', 'Chuyển đổi giữa 5 thứ tiếng (vi, en, zh, ko, ja)', 'Toàn bộ giao diện và dữ liệu đổi ngay lập tức (PASS)'),
        ('TC_07', 'USC09 & USC10 - Quản lý Hiện vật, Tọa độ & QR', 'Thêm/sửa hiện vật, đổi bán kính 12m, xuất mã QR ca tham quan', 'Lưu trữ CSDL chuẩn, sinh mã QR hợp lệ (PASS)')
    ]

    for item in new_test_results:
        row = t24.add_row()
        for c_idx, val in enumerate(item):
            row.cells[c_idx].text = val

    # 9. Update Chapter 2 descriptions
    for p in doc.paragraphs:
        txt = p.text
        if 'Sơ đồ thành phần mô tả cấu trúc phân rã của hệ thống' in txt:
            p.text = (
                'Sơ đồ thành phần mô tả cấu trúc phân rã của hệ thống thành các khối module độc lập, giao tiếp với nhau thông qua '
                'các cổng giao tiếp chuẩn hóa và các Web APIs hiện đại. Hệ thống được tổ chức thành 3 phân hệ chính:\n'
                '1. Phân hệ Khách tham quan (Visitor Module): VisitorLayout, TrackingPanel (định vị lai QR & GPS), AudioPlayerBar & Subtitles, '
                'FloorMapView (bản đồ đa tầng & pin "Bạn đang ở đây"), ExploreView (tìm kiếm & lọc), ArtifactDetailView.\n'
                '2. Phân hệ Quản trị (Admin Module): AdminLoginView (bảo mật khóa 5 phút khi sai 5 lần), AdminDashboard, ArtifactsManageView '
                '(CRUD hiện vật, cấu hình tọa độ GPS & bán kính kích hoạt), SessionsManageView (quản lý phiên & xuất mã QR đón tiếp).\n'
                '3. Phân hệ Shared Core & Dịch vụ ngoại vi: geofence.ts (Haversine & Proximity), qrHelper.ts, loginLock.ts, api.ts, các Zustand stores, '
                'Hạ tầng GitHub Pages CDN (phân phối tệp tĩnh HTML/JS/CSS, âm thanh MP3, ảnh sơ đồ) và ntfy.sh Telemetry Gateway.'
            )
        elif 'Sơ đồ triển khai xác định cách thức các thành phần phần mềm được đóng gói' in txt:
            p.text = (
                'Sơ đồ triển khai xác định môi trường thực thi và hạ tầng mạng thực tế của hệ thống:\n'
                '1. Nút Thiết bị Người dùng (Client Device - Mobile / Desktop): Môi trường Modern Web Browser (Chrome, Safari, Edge, Firefox), '
                'thực thi gói ứng dụng Vite React SPA, tận dụng trực tiếp HTML5 Web Audio API, HTML5 Geolocation API, HTML5 Camera API và Browser LocalStorage.\n'
                '2. Nút Hạ tầng Lưu trữ & Phân phối (GitHub Pages CDN): Máy chủ Static Web Server Nginx với bảo mật HTTPS :443, phân phối toàn cầu '
                'bản dựng dist/, tệp thuyết minh audio MP3 và ảnh sơ đồ các tầng với tốc độ cao và độ trễ thấp.\n'
                '3. Nút Hạ tầng Giám sát Telemetry (ntfy.sh Gateway): Máy chủ HTTPS Push Gateway thu thập và đồng bộ các sự kiện thống kê lượt nghe theo thời gian thực.'
            )

    doc.save(path)
    print('BAO_CAO_DO_AN_CONG_NGHE_PHAN_MEM_SGU.docx synchronized successfully!')

if __name__ == '__main__':
    sync_report()
