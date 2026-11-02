/**
 * Thêm geoCoordinates + triggerRadius cho các hiện vật trong museum_data.json.
 * Tọa độ GPS là ƯỚC LƯỢNG, suy ra từ vị trí ghim (x, y) trên sơ đồ:
 *  - Tâm khu trưng bày: Bảo tàng Chứng tích Chiến tranh (~10.77952, 106.69218)
 *  - Sơ đồ 800x600 px được quy đổi 0.15 m / px (khu 120m x 90m)
 *  - Admin có thể chỉnh lại tọa độ thật trong trang Quản lý hiện vật.
 * Chạy: node scripts/add_geo_coordinates.cjs
 */
const fs = require('fs');
const path = require('path');

const CENTER_LAT = 10.77952;
const CENTER_LON = 106.69218;
const METERS_PER_PIXEL = 0.15;
const METERS_PER_DEG_LAT = 111000;
const DEFAULT_RADIUS_M = 12;

const files = [
  path.join(__dirname, '..', 'src', 'data', 'museum_data.json'),
  path.join(__dirname, '..', 'public', 'mock', 'museum_data.json'),
];

files.forEach((file) => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.artifacts.forEach((art) => {
    const dx = (art.mapCoordinates.x - 400) * METERS_PER_PIXEL; // mét, + là sang Đông
    const dy = (art.mapCoordinates.y - 300) * METERS_PER_PIXEL; // mét, + là xuống Nam
    const latitude = CENTER_LAT - dy / METERS_PER_DEG_LAT;
    const longitude =
      CENTER_LON + dx / (METERS_PER_DEG_LAT * Math.cos((CENTER_LAT * Math.PI) / 180));
    art.geoCoordinates = {
      latitude: Number(latitude.toFixed(6)),
      longitude: Number(longitude.toFixed(6)),
    };
    art.triggerRadius = DEFAULT_RADIUS_M;
  });
  fs.writeFileSync(file, JSON.stringify(data, null, 2).replace(/\n/g, '\r\n'), 'utf8');
  console.log('Updated', file, '-', data.artifacts.length, 'artifacts');
});
