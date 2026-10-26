const fs = require('fs');
const path = require('path');

const mockDataFile = path.join(__dirname, '..', 'public', 'mock', 'museum_data.json');
const srcDataFile = path.join(__dirname, '..', 'src', 'data', 'museum_data.json');

const imageMap = {
  'WRM001': '/images/artifacts/Xe tăng chiến đấu M48A3 Patton.png',
  'WRM002': '/images/artifacts/Máy bay tiêm kích phản lực F-5A Freedom Fighter.webp',
  'WRM003': '/images/artifacts/Trực thăng vận tải CH-47A Chinook.jpg',
  'WRM004': '/images/artifacts/Trực thăng vũ trang Bell UH-1 Iroquois (Huey).webp',
  'WRM005': '/images/artifacts/Máy bay cường kích A-37 Dragonfly.jpg',
  'WRM006': "/images/artifacts/Pháo tự hành 175mm M107 'Vua chiến trường'.webp",
  'WRM007': "/images/artifacts/Bom phát quang BLU-82 'Daisy Cutter' (15.000 lb).webp",
  'WRM008': '/images/artifacts/Chuồng Cọp Côn Đảo (Khu phục dựng).webp',
  'WRM009': '/images/artifacts/Máy chém thời Pháp và Luật.jpg',
  'WRM010': "/images/artifacts/Bức ảnh lịch sử 'Em bé Napalm' (Nick Út).webp",
  'WRM011': "/images/artifacts/Bức ảnh lịch sử 'Hành quyết tại Sài Gòn' (Eddie Adams).webp",
  'WRM012': '/images/artifacts/Phòng trưng bày Hậu quả Chất độc Da cam.webp',
  'WRM013': "/images/artifacts/Bộ sưu tập ảnh chiến trường 'Hồi Niệm' (Requiem).webp",
  'WRM014': '/images/artifacts/Huân chương & Kỷ vật phản chiến của Cựu chiến binh Mỹ.webp',
  'WRM015': "/images/artifacts/Biểu tượng 'Bồ Câu Trắng vì Hòa Bình'.jpg"
};

for (const file of [mockDataFile, srcDataFile]) {
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    data.museum.banner = '/images/museum/war_remnants_museum_banner.svg';
    data.artifacts.forEach(art => {
      if (imageMap[art.id]) {
        art.images = [imageMap[art.id]];
      }
    });
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Updated ${file}`);
  }
}

console.log('Successfully updated museum_data.json files with authentic exhibit photos!');
