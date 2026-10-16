/**
 * Mock Database cho Hệ thống Thuyết minh tự động đa ngôn ngữ
 * Cung cấp đầy đủ dữ liệu hiện vật, âm thanh mẫu, phụ đề đa ngôn ngữ và tài khoản
 */
export const mockDB = {
  // Danh sách ngôn ngữ hỗ trợ (USC05)
  languages: [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ],

  // Tài khoản mẫu (USC01, USC02, USC16)
  users: [
    {
      id: 'usr_001',
      fullName: 'Nguyễn Văn Du Khách',
      email: 'visitor@museum.vn',
      password: 'password123',
      role: 'user',
      defaultLang: 'vi',
      favorites: ['art_001', 'art_003']
    },
    {
      id: 'adm_001',
      fullName: 'Quản Trị Viên Bảo Tàng',
      email: 'admin@museum.vn',
      password: 'admin123',
      role: 'admin',
      defaultLang: 'vi',
      favorites: []
    }
  ],

  // Danh mục hiện vật lịch sử (USC07, USC12, USC13, USC15)
  artifacts: [
    {
      id: 'art_001',
      code: 'TRONG-DONG-01',
      name: {
        vi: 'Trống Đồng Đông Sơn',
        en: 'Dong Son Bronze Drum',
        fr: 'Tambour de bronze de Dong Son',
        ja: 'ドンソン青銅太鼓',
        zh: '东山铜鼓'
      },
      era: 'Thế kỷ V - I TCN (Thời kỳ Văn Lang - Âu Lạc)',
      category: 'Khảo cổ học & Cổ vật kim khí',
      zone: 'Khu A - Phòng Văn hóa Tiền sử',
      image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
      ],
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ART_art_001',
      listenCount: 1420,
      description: {
        vi: 'Trống đồng Đông Sơn là biểu tượng tiêu biểu cho đỉnh cao nền văn minh lúa nước của người Việt cổ. Mặt trống chạm khắc hình mặt trời tỏa tia sáng ở chính giữa, bao quanh là các vành hoa văn hình chim Lạc bay ngược chiều kim đồng hồ, cảnh giã gạo múa hát lễ hội cầu mùa.',
        en: 'The Dong Son bronze drum is an outstanding symbol of ancient Vietnamese civilization. The tympanum features a radiating multi-pointed star surrounded by concentric bands depicting Lac birds, deer, warriors, and harvest festivals.',
        fr: 'Le tambour de bronze de Dong Son est le symbole le plus remarquable de la civilisation du fleuve Rouge au Vietnam ancient.',
        ja: 'ドンソン青銅太鼓は、古代ベトナム文明の象徴的な工芸品であり、見事な彫刻が施されています。',
        zh: '东山铜鼓是古代越南红河文明青铜时代的杰出代表性文物。'
      },
      // Audio đa ngôn ngữ (USC04, USC19)
      audio: {
        vi: 'https://actions.google.com/sounds/v1/ambiences/outdoor_market_large_crowd.ogg',
        en: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg',
        fr: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg',
        ja: 'https://actions.google.com/sounds/v1/ambiences/outdoor_market_large_crowd.ogg',
        zh: 'https://actions.google.com/sounds/v1/ambiences/outdoor_market_large_crowd.ogg'
      },
      // Phụ đề theo thời gian chạy (USC18)
      subtitles: {
        vi: [
          { time: 0, text: 'Kính chào quý khách đến với khu trưng bày Văn hóa Đông Sơn.' },
          { time: 4, text: 'Trước mắt quý vị là chiếc Trống Đồng có niên đại hơn 2.500 năm.' },
          { time: 9, text: 'Chính giữa mặt trống là hình ngôi sao tượng trưng cho thần Mặt Trời.' },
          { time: 14, text: 'Các vòng tròn tiếp theo mô tả hình chim Lạc và đời sống nông nghiệp phồn vinh.' }
        ],
        en: [
          { time: 0, text: 'Welcome visitors to the Dong Son Civilization exhibition.' },
          { time: 4, text: 'Before you stands the iconic Bronze Drum dated back over 2,500 years.' },
          { time: 9, text: 'At the center of the drumhead is a star symbolizing the Sun deity.' },
          { time: 14, text: 'Surrounding concentric rings depict soaring Lac birds and ancient daily life.' }
        ]
      }
    },
    {
      id: 'art_002',
      code: 'TUONG-PHAT-02',
      name: {
        vi: 'Tượng Phật A Di Đà (Thời Lý)',
        en: 'Amitabha Buddha Statue (Ly Dynasty)',
        fr: 'Statue du Bouddha Amitabha (Dynastie Ly)',
        ja: '阿弥陀如来坐像（李朝）',
        zh: '阿弥陀佛坐像（李朝）'
      },
      era: 'Năm 1057 (Thời vua Lý Thánh Tông)',
      category: 'Điêu khắc Phật giáo & Di sản Quốc gia',
      zone: 'Khu B - Gian Nghệ thuật Phật giáo',
      image: 'https://images.unsplash.com/photo-1606744888344-498238f01037?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1606744888344-498238f01037?auto=format&fit=crop&w=800&q=80'
      ],
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ART_art_002',
      listenCount: 980,
      description: {
        vi: 'Bảo vật quốc gia được tạo tác từ đá xanh nguyên khối. Tượng Phật ngồi thiền định trên tòa sen nâng bởi bệ rồng cuộn đặc trưng của mỹ thuật Lý, biểu hiện sự từ bi, thanh tịnh và phát triển rực rỡ của Phật giáo Đại thừa tại Đại Việt.',
        en: 'National Treasure crafted from a single block of blue stone. The Buddha sits in meditative posture on a lotus throne supported by sinuous dragon motifs typical of Ly Dynasty art.',
        fr: 'Trésor national sculpté dans un bloc de pierre bleue monolithique de la dynastie Ly.',
        ja: '李朝時代に制作された国宝の阿弥陀如来像で、独特の龍文様が特徴です。',
        zh: '李朝时期用整块青石雕刻而成的国宝级阿弥陀佛坐像。'
      },
      audio: {
        vi: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg',
        en: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg'
      },
      subtitles: {
        vi: [
          { time: 0, text: 'Chào mừng quý khách chiêm bái Tượng Phật A Di Đà chùa Phật Tích.' },
          { time: 5, text: 'Tác phẩm được xem là chuẩn mực của nghệ thuật điêu khắc thời Lý thế kỷ 11.' },
          { time: 10, text: 'Bệ tượng chạm khắc đôi rồng mềm mại uốn lượn hình sin uyển chuyển.' }
        ],
        en: [
          { time: 0, text: 'Welcome to contemplate the Amitabha Buddha statue from Phat Tich pagoda.' },
          { time: 5, text: 'Regarded as the pinnacle of 11th-century Ly Dynasty sculpture.' }
        ]
      }
    },
    {
      id: 'art_003',
      code: 'BIA-TIEN-SI-03',
      name: {
        vi: 'Bia Tiến Sĩ Văn Miếu',
        en: 'Doctoral Stelae of Temple of Literature',
        fr: 'Stèles des Docteurs du Temple de la Littérature',
        ja: '文廟の進士題名碑',
        zh: '文庙进士题名碑'
      },
      era: 'Thế kỷ XV - XVIII (Thời Hậu Lê & Mạc)',
      category: 'Di sản Tư liệu Ký ức Thế giới UNESCO',
      zone: 'Khu C - Khu Lưu niệm Khoa bảng',
      image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80'
      ],
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ART_art_003',
      listenCount: 2150,
      description: {
        vi: 'Hệ thống 82 bia đá vinh danh những người đỗ đại khoa trong các kỳ thi Đình thời xưa, đặt trang nghiêm trên lưng rùa đá. Đây là minh chứng hùng hồn cho truyền thống hiếu học và tôn sư trọng đạo ngàn năm.',
        en: 'A collection of 82 stone stelae honoring scholars who passed royal exams, resting on the backs of stone tortoises.',
        fr: 'Collection de 82 stèles en pierre gravées des noms des lauréats des concours royaux.',
        ja: '82基の石碑群で、科挙試験の合格者を称え、亀の背の上に建てられています。',
        zh: '82座设立在石龟背上的进士题名碑，列入联合国教科文组织世界记忆名录。'
      },
      audio: {
        vi: 'https://actions.google.com/sounds/v1/ambiences/outdoor_market_large_crowd.ogg',
        en: 'https://actions.google.com/sounds/v1/ambiences/outdoor_market_large_crowd.ogg'
      },
      subtitles: {
        vi: [
          { time: 0, text: '82 tấm bia Tiến Sĩ tại Văn Miếu là Di sản Tư liệu Thế giới.' },
          { time: 4, text: 'Rùa đá đội bia biểu trưng cho sự trường tồn và lòng kiên định học vấn.' }
        ]
      }
    }
  ],

  // Thông tin bảo tàng (USC14)
  museumProfile: {
    name: 'Bảo Tàng Lịch Sử & Di Sản Quốc Gia',
    address: 'Số 01 Đường Tràng Tiền, Quận Hoàn Kiếm, TP. Hà Nội',
    openingHours: '08:00 - 17:00 (Từ Thứ Ba đến Chủ Nhật hàng tuần)',
    ticketPrice: '40.000 VNĐ / Lượt (Miễn phí cho trẻ em dưới 6 tuổi)',
    hotline: '(+84) 24 3825 2853',
    overview: 'Nơi lưu giữ, bảo quản và phát huy hơn 200.000 hiện vật, tài liệu lịch sử văn hóa Việt Nam từ thời tiền sử cho đến thời kỳ hiện đại.',
    zones: [
      { id: 'zone_a', name: 'Khu A', title: 'Thời kỳ Tiền sử & Sơ sử', artifactCount: 15 },
      { id: 'zone_b', name: 'Khu B', title: 'Thời kỳ Quân chủ Phong kiến', artifactCount: 28 },
      { id: 'zone_c', name: 'Khu C', title: 'Văn hóa & Nghệ thuật Dân gian', artifactCount: 19 }
    ]
  },

  // Thống kê lượt nghe (USC10)
  analytics: {
    totalListeners: 15430,
    totalMinutesStreamed: 89400,
    topArtifacts: [
      { name: 'Bia Tiến Sĩ Văn Miếu', listens: 2150, percent: 38 },
      { name: 'Trống Đồng Đông Sơn', listens: 1420, percent: 25 },
      { name: 'Tượng Phật A Di Đà', listens: 980, percent: 17 },
      { name: 'Hiện vật khác', listens: 1120, percent: 20 }
    ],
    dailyTrends: [
      { day: 'T2', listens: 420 },
      { day: 'T3', listens: 750 },
      { day: 'T4', listens: 890 },
      { day: 'T5', listens: 1100 },
      { day: 'T6', listens: 1650 },
      { day: 'T7', listens: 2890 },
      { day: 'CN', listens: 3120 }
    ]
  }
};
