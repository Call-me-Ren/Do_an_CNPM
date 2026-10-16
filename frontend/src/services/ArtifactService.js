/**
 * ArtifactService - Cổng giao tiếp I_Artifact với ArtifactManager
 * Phục vụ USC03 (Quét QR), USC07 (Quản lý sự vật), USC08 (Chỉnh sửa QR), USC12 (Đọc nội dung), USC15 (Tìm kiếm)
 */
import { mockDB } from './MockDatabase.js';

class ArtifactService {
  async getAllArtifacts() {
    return [...mockDB.artifacts];
  }

  async getArtifactById(id) {
    const item = mockDB.artifacts.find(a => a.id === id);
    if (!item) {
      throw new Error(`Không tìm thấy hiện vật với mã ID: ${id}`);
    }
    return item;
  }

  // USC03: Quét mã QR hiện vật
  async resolveQRCode(qrString) {
    // Format QR chuẩn: ART_art_001 hoặc mã định danh
    const cleanCode = qrString.trim();
    let target = mockDB.artifacts.find(a => 
      a.id === cleanCode || 
      'ART_' + a.id === cleanCode || 
      a.code.toLowerCase() === cleanCode.toLowerCase()
    );

    if (!target) {
      throw new Error('Mã QR không hợp lệ hoặc hiện vật không tồn tại trong hệ thống (E1, E2).');
    }

    // Tăng lượt nghe/truy cập
    target.listenCount += 1;
    return target;
  }

  // USC15: Tìm kiếm hiện vật theo tên hoặc niên đại
  async searchArtifacts(keyword, lang = 'vi') {
    if (!keyword || keyword.trim() === '') {
      return [...mockDB.artifacts];
    }
    const kw = keyword.toLowerCase().trim();
    return mockDB.artifacts.filter(a => {
      const nameInLang = (a.name[lang] || a.name.vi || '').toLowerCase();
      const era = (a.era || '').toLowerCase();
      const cat = (a.category || '').toLowerCase();
      const desc = (a.description[lang] || a.description.vi || '').toLowerCase();
      return nameInLang.includes(kw) || era.includes(kw) || cat.includes(kw) || desc.includes(kw);
    });
  }

  // USC07: Admin Thêm hiện vật mới (A1)
  async createArtifact(artifactData) {
    const newId = 'art_' + (mockDB.artifacts.length + 1).toString().padStart(3, '0');
    const newArtifact = {
      id: newId,
      code: artifactData.code || ('SP-' + Date.now().toString().slice(-4)),
      name: artifactData.name,
      era: artifactData.era,
      category: artifactData.category || 'Cổ vật di sản',
      zone: artifactData.zone || 'Khu A',
      image: artifactData.image || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
      gallery: [artifactData.image],
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ART_${newId}`,
      listenCount: 0,
      description: artifactData.description,
      audio: artifactData.audio || {
        vi: 'https://actions.google.com/sounds/v1/ambiences/outdoor_market_large_crowd.ogg'
      },
      subtitles: {
        vi: [
          { time: 0, text: `Chào mừng quý khách đến với ${artifactData.name.vi}.` }
        ]
      }
    };
    mockDB.artifacts.unshift(newArtifact);
    return newArtifact;
  }

  // USC07: Admin Cập nhật hiện vật (A2)
  async updateArtifact(id, updatedData) {
    const idx = mockDB.artifacts.findIndex(a => a.id === id);
    if (idx === -1) {
      throw new Error('Hiện vật không tồn tại để cập nhật.');
    }
    mockDB.artifacts[idx] = { ...mockDB.artifacts[idx], ...updatedData };
    return mockDB.artifacts[idx];
  }

  // USC07: Admin Xóa hiện vật (A3)
  async deleteArtifact(id) {
    const idx = mockDB.artifacts.findIndex(a => a.id === id);
    if (idx === -1) {
      throw new Error('Hiện vật không tồn tại.');
    }
    mockDB.artifacts.splice(idx, 1);
    return true;
  }

  // USC08: Admin Chỉnh sửa mã QR
  async updateQRCode(id, customData) {
    const item = await this.getArtifactById(id);
    const newQr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(customData)}`;
    item.qrCodeUrl = newQr;
    return item;
  }
}

export const ArtifactServiceInstance = new ArtifactService();
