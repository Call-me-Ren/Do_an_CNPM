# Museum Audio Guide — Mobile App (Expo / React Native)

Ứng dụng di động dành cho **Khách tham quan (Visitor)** của Hệ thống Thuyết minh Tự động Đa ngôn ngữ (Bảo tàng Chứng tích Chiến tranh).

## Tính năng chính
- **Hoạt động Offline hoàn toàn:** Toàn bộ dữ liệu hiện vật, ảnh, sơ đồ tầng và âm thanh 5 ngôn ngữ (`vi`, `en`, `zh`, `ko`, `ja`) được đóng gói sẵn trong ứng dụng.
- **Quét mã QR (`expo-camera`):** Quét mã QR cổng hoặc hiện vật (hỗ trợ nhập mã thủ công dự phòng).
- **Định vị Geofence (`expo-location`):** Tính khoảng cách Haversine và tự động gợi ý/phát thuyết minh khi đến gần hiện vật.
- **Phát Audio & Phụ đề đồng bộ (`expo-audio`):** Tua thời gian, đổi tốc độ `1x / 1.25x / 1.5x / 2x`, phụ đề karaoke.
- **Đồng bộ tùy chọn khi có mạng:** Nếu cấu hình `EXPO_PUBLIC_API_URL`, app tự lấy dữ liệu mới nhất từ backend và gửi thống kê thiết bị/lượt nghe.

## Cài đặt & Chạy thử
```bash
cd mobile
npm install
npx expo start
```
Quét mã QR bằng ứng dụng **Expo Go** trên Android, hoặc nhấn `a` để mở Android Emulator.

### Cấu hình Backend (tùy chọn)
Tạo file `.env`:
```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:4000/api
```

### Đồng bộ lại tài nguyên từ `frontend/`
```bash
node scripts/sync-assets.cjs
```

### Build file APK Android cục bộ
```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```
File APK xuất ra tại `android/app/build/outputs/apk/release/app-release.apk`.

### Kiểm thử & Kiểm tra mã nguồn
```bash
npm run lint
npm run typecheck
npm test
```
