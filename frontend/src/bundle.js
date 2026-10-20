// === FILE: frontend/src/services/MockDatabase.js ===
/**
 * Mock Database cho Hệ thống Thuyết minh tự động đa ngôn ngữ
 * Cung cấp đầy đủ dữ liệu hiện vật, âm thanh mẫu, phụ đề đa ngôn ngữ và tài khoản
 */
const mockDB = {
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
      // Audio đa ngôn ngữ (USC04, USC19) - Dùng valid audio stream / data URI chống lỗi 404
      audio: {
        vi: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
        en: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
        fr: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
        ja: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
        zh: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
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
        ],
        fr: [
          { time: 0, text: 'Bienvenue à l exposition sur la civilisation de Dong Son.' },
          { time: 4, text: 'Devant vous se trouve le tambour de bronze datant de plus de deux mille cinq cents ans.' },
          { time: 9, text: 'Au centre se trouve une étoile rayonnante symbolisant le Dieu Soleil.' },
          { time: 14, text: 'Les cercles concentriques illustrent les oiseaux Lac et la vie agricole florissante.' }
        ],
        ja: [
          { time: 0, text: 'ドンソン文化展示エリアへようこそ。' },
          { time: 4, text: '目の前にあるのは、2500年以上の歴史を持つ象徴的な青銅太鼓です。' },
          { time: 9, text: '鼓面の中央には太陽神を象徴する星が彫られています。' },
          { time: 14, text: '同心円状の文様は、ラック鳥と古代の豊かな農耕生活を描いています。' }
        ],
        zh: [
          { time: 0, text: '欢迎光临东山文化展区。' },
          { time: 4, text: '展现在您面前的是距今已有两千五百年历史的东山铜鼓。' },
          { time: 9, text: '鼓面中央为象征太阳神的放射状星芒。' },
          { time: 14, text: '外层同心圆纹饰生动展现了翱翔的雒鸟与古代繁荣的农耕生活。' }
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
        vi: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
        en: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
        fr: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
        ja: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
        zh: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
      },
      subtitles: {
        vi: [
          { time: 0, text: 'Chào mừng quý khách chiêm bái Tượng Phật A Di Đà chùa Phật Tích.' },
          { time: 5, text: 'Tác phẩm được xem là chuẩn mực của nghệ thuật điêu khắc thời Lý thế kỷ 11.' },
          { time: 10, text: 'Bệ tượng chạm khắc đôi rồng mềm mại uốn lượn hình sin uyển chuyển.' }
        ],
        en: [
          { time: 0, text: 'Welcome to contemplate the Amitabha Buddha statue from Phat Tich pagoda.' },
          { time: 5, text: 'Regarded as the pinnacle of 11th-century Ly Dynasty sculpture.' },
          { time: 10, text: 'The pedestal features sinuous twin dragons undulating gracefully.' }
        ],
        fr: [
          { time: 0, text: 'Bienvenue pour contempler la statue du Bouddha Amitabha de la pagode Phat Tich.' },
          { time: 5, text: 'Elle est considérée comme le chef-d oeuvre de la sculpture de la dynastie Ly au XIe siècle.' },
          { time: 10, text: 'Le socle est orné de dragons jumeaux aux courbes sinueuses.' }
        ],
        ja: [
          { time: 0, text: '仏跡寺の阿弥陀如来坐像へようこそ。' },
          { time: 5, text: '11世紀李朝彫刻芸術の最高傑作と称えられています。' },
          { time: 10, text: '台座には優美な曲線を描く対の龍が精緻に刻まれています。' }
        ],
        zh: [
          { time: 0, text: '欢迎瞻仰佛迹寺阿弥陀佛坐像。' },
          { time: 5, text: '本座佛像被誉为十一世纪李朝佛教雕塑艺术的最高典范。' },
          { time: 10, text: '佛座基底雕刻着形态优美的双龙盘旋纹饰。' }
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
        vi: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
        en: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
        fr: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
        ja: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
        zh: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
      },
      subtitles: {
        vi: [
          { time: 0, text: '82 tấm bia Tiến Sĩ tại Văn Miếu là Di sản Tư liệu Thế giới.' },
          { time: 4, text: 'Rùa đá đội bia biểu trưng cho sự trường tồn và lòng kiên định học vấn.' },
          { time: 9, text: 'Đây là nơi khắc ghi tên tuổi của các bậc hiền tài làm rạng danh non sông Việt Nam.' }
        ],
        en: [
          { time: 0, text: 'The 82 doctoral stelae at the Temple of Literature are a UNESCO World Documentary Heritage.' },
          { time: 4, text: 'Stone tortoises supporting the stelae symbolize longevity and steadfast pursuit of knowledge.' },
          { time: 9, text: 'Here are inscribed the names of eminent scholars who illuminated Vietnamese history.' }
        ],
        fr: [
          { time: 0, text: 'Les 82 stèles doctorales du Temple de la Littérature sont inscrites au registre Mémoire du monde de l UNESCO.' },
          { time: 4, text: 'Les tortues de pierre soutenant les stèles symbolisent la longévité et la persévérance dans le savoir.' },
          { time: 9, text: 'Elles immortalisent les noms des érudits qui ont honoré la nation.' }
        ],
        ja: [
          { time: 0, text: '文廟の82基の進士題名碑はユネスコの世界記憶遺産です。' },
          { time: 4, text: '石碑を背負う石亀は、不朽の生命力と学問への揺るぎない志を象徴しています。' },
          { time: 9, text: 'ここにはベトナムの歴史を輝かせた賢人たちの名が刻まれています。' }
        ],
        zh: [
          { time: 0, text: '文庙的八十二座进士题名碑被列为联合国教科文组织世界记忆名录。' },
          { time: 4, text: '石龟驮碑象征着学识与品德的永恒不朽与坚定追求。' },
          { time: 9, text: '碑上铭刻着光耀越南千年文明史的杰出先贤英名。' }
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

// === FILE: frontend/src/services/I18nService.js ===
/**
 * I18n Translations Dictionary cho Hệ Thống Thuyết Minh Tự Động Đa Ngôn Ngữ
 * Hỗ trợ chuyển đổi toàn bộ giao diện sang: Tiếng Việt (vi), English (en), Français (fr), 日本語 (ja), 中文 (zh)
 * Tương ứng Use Case: USC05 (Chuyển Đổi Ngôn Ngữ)
 */

const translations = {
  vi: {
    // Navbar & Header
    brandTitle: 'SMART AUDIO GUIDE',
    brandSubtitle: 'Bảo Tàng Lịch Sử Quốc Gia',
    navHome: 'Trang Chủ',
    navFavorites: 'Yêu Thích',
    navMuseumMap: 'Sơ Đồ Bảo Tàng (USC14)',
    navAdminPanel: '⚙️ Quản Trị Hệ Thống',
    btnScanQR: 'Quét QR',
    btnLogin: 'Đăng Nhập',
    btnLogout: 'Đăng Xuất',
    greeting: 'Chào',
    confirmLogout: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống? (USC16)',

    // Hero Section
    badgeSmartGuide: 'Ứng Dụng Hướng Dẫn Thuyết Minh Thông Minh 4.0',
    heroTitleMain: 'Khám Phá Di Sản Dân Tộc',
    heroTitleHighlight: 'Bằng Giọng Thuyết Minh Đa Ngôn Ngữ',
    heroDescription: 'Hỗ trợ quét mã QR tại quầy hiện vật, nghe thuyết minh tức thì bằng 5 ngôn ngữ quốc tế và phụ đề đồng bộ thời gian thực.',
    searchPlaceholder: 'Tìm theo tên hiện vật, thời kỳ (VD: Trống Đồng, Thời Lý)...',
    btnScanHero: 'Quét QR Hiện Vật',

    // Artifacts Section
    sectionArtifactsTitle: 'Hiện Vật Tiêu Biểu',
    sectionArtifactsSubtitle: 'Chọn một hiện vật để xem hình ảnh độ phân giải cao và nghe bài thuyết minh tự động',
    showingArtifactsCount: (count) => `Hiển thị ${count} hiện vật`,
    listensCount: 'lượt nghe',
    btnListenAudio: 'Nghe Thuyết Minh',
    btnDetail: 'Chi Tiết',
    noArtifactsFound: 'Không tìm thấy hiện vật phù hợp (USC15-E2).',
    noArtifactsFoundDesc: 'Vui lòng thử lại với từ khóa khác.',
    alertLoginToFav: 'Vui lòng đăng nhập để lưu hiện vật vào danh sách yêu thích!',

    // Detail View
    backToHome: 'Quay lại trang chủ',
    zoomHint: '🔍 Nhấn để phóng to (USC13)',
    qrBadgeTitle: 'Mã QR Định Danh',
    btnDownloadQR: 'Tải Mã QR',
    audioStreamingTitle: 'Thuyết Minh Tự Động (USC04)',
    audioMultiLang: 'Đa ngôn ngữ',
    btnStartAudio: 'Bắt Đầu Phát Thuyết Minh',
    btnPauseAudio: 'Tạm Dừng Thuyết Minh',
    btnPauseShort: 'Tạm dừng',
    historyInfoTitle: 'Thông Tin Lịch Sử Di Sản',
    storageInfo: 'Được lưu trữ bởi: AudioStreamer / MediaArchive',
    totalListens: 'Lượt nghe:',
    locationLabel: 'Vị trí:',
    eraLabel: 'Niên đại:',

    // Favorites View
    favTitle: '❤️ Hiện Vật Yêu Thích Của Bạn (USC06)',
    favSubtitle: 'Danh sách các hiện vật đã được lưu vào bộ sưu tập cá nhân',

    // Map View
    mapTitle: 'Sơ Đồ Khu Trưng Bày & Hồ Sơ Bảo Tàng (USC11, USC14)',
    addressLabel: '📍 Địa chỉ bảo tàng',
    openingHoursLabel: '⏰ Giờ mở cửa',
    ticketPriceLabel: '🎟️ Giá vé tham quan',
    interactiveMapTitle: 'Mặt Bằng Tầng Trưng Bày Tương Tác',
    artifactsWithQrCount: (count) => `${count} hiện vật có gắn mã QR`,
    btnExploreZone: 'Khám Phá Khu Vực',

    // Global Player Bar
    rewindBtnTitle: 'Lùi 10 giây',
    forwardBtnTitle: 'Tua tới 10 giây',
    playbackSpeedTitle: 'Tốc độ phát',
    ccSubtitleTitle: 'Bật/Tắt phụ đề (USC18)',
    ccBtnText: 'CC Phụ Đề',
    audioStreamError: 'Không thể tải luồng âm thanh thuyết minh (USC04-E1).',
    noAudioForLang: 'Chưa có bản ghi âm thanh cho ngôn ngữ này (USC12-E1).',

    // QR Scanner Modal
    scannerTitle: 'Quét Mã QR Hiện Vật (USC03)',
    scannerHint: 'Hướng camera về phía bảng mã QR đặt cạnh hiện vật bảo tàng',
    quickTryHint: 'Hoặc chọn nhanh mã hiện vật mẫu để thử nghiệm:',
    quickArtifact1: '🥁 Trống Đồng',
    quickArtifact2: '🪨 Tượng Phật',
    quickArtifact3: '🐢 Bia Tiến Sĩ',
    manualInputPlaceholder: 'Nhập mã (VD: ART_art_001)',
    btnLookup: 'Tra Cứu',

    // Auth Modal
    modalTitleLogin: 'Đăng Nhập Hệ Thống (USC02)',
    modalTitleRegister: 'Đăng Ký Thành Viên (USC01)',
    modalTitleForgot: 'Khôi Phục Mật Khẩu (USC17)',
    labelEmailOrPhone: 'Email hoặc Số điện thoại',
    labelPassword: 'Mật khẩu',
    btnForgotPassword: 'Quên mật khẩu?',
    demoAccountBox: 'Tài khoản thử nghiệm nhanh:',
    btnLoginSubmit: 'Đăng Nhập',
    labelFullName: 'Họ và tên',
    labelDefaultLang: 'Ngôn ngữ mặc định',
    labelMinPassword: 'Mật khẩu (Tối thiểu 6 ký tự)',
    labelConfirmPassword: 'Xác nhận mật khẩu',
    btnRegisterSubmit: 'Xác Nhận Đăng Ký',
    labelRegisteredEmail: 'Nhập Email đã đăng ký',
    btnSendOtp: '1. Gửi Mã Xác Nhận OTP',
    labelOtpCode: 'Mã OTP xác thực (6 số)',
    labelNewPassword: 'Mật khẩu mới',
    btnUpdatePasswordSubmit: '2. Cập Nhật Mật Khẩu',
    switchRegisterText: 'Chưa có tài khoản?',
    switchRegisterAction: 'Đăng ký ngay',
    switchLoginText: 'Đã có tài khoản?',
    switchLoginAction: 'Quay lại Đăng nhập',

    // Admin Dashboard
    adminTitle: 'Bảng Quản Trị Hệ Thống (Admin Panel)',
    adminSubtitle: 'Quản lý di sản hiện vật, luồng âm thanh, mã QR và báo cáo thống kê bảo tàng',
    tabArtifacts: '🏛️ Quản Lý Sự Vật (USC07)',
    tabAnalytics: '📊 Thống Kê Lượt Nghe (USC10)',
    adminArtifactListTitle: (count) => `Danh Sách Hiện Vật Đang Trưng Bày (${count})`,
    btnAddArtifact: 'Thêm Mới Hiện Vật (A1)',
    colCodeAndImg: 'Mã & Ảnh',
    colArtifactName: 'Tên Hiện Vật',
    colZoneEra: 'Khu Vực & Niên Đại',
    colListens: 'Lượt Nghe',
    colQRCode: 'Mã QR (USC08)',
    colActions: 'Thao Tác',
    btnDelete: 'Xóa (A3)',
    confirmDelete: (id) => `Bạn có chắc muốn xóa hiện vật ${id} khỏi hệ thống?`,
    statTotalListeners: 'Tổng Lượt Nghe Thuyết Minh',
    statGrowth: '↑ +14.8% so với tuần trước',
    statStreamingTime: 'Thời Lượng Stream Âm Thanh',
    statHours: 'Giờ',
    statActiveArtifacts: 'Hiện Vật Đang Được Kích Hoạt',
    statActiveNote: '100% gắn mã QR & Audio Đa ngữ',
    topArtifactsTitle: 'Top Hiện Vật Được Nghe Nhiều Nhất (USC10)',
    weeklyTrendTitle: 'Lưu Lượng Nghe Theo Ngày Trong Tuần',
    btnExportReport: '📥 Xuất Báo Cáo (A1)',
    exportReportSuccess: 'Đã xuất báo cáo thống kê định dạng CSV/PDF thành công! (USC10-A1)',

    // Days of week
    days: {
      T2: 'T2',
      T3: 'T3',
      T4: 'T4',
      T5: 'T5',
      T6: 'T6',
      T7: 'T7',
      CN: 'CN'
    },

    // Footer
    footerCopyright: '© 2026 Hệ thống Thuyết minh tự động đa ngôn ngữ • Đồ án Công nghệ phần mềm',
    footerArchitecture: 'Kiến trúc: GUI.spa • ClientSession • QRScanner • MediaPlayer • AudioStreamer'
  },

  en: {
    // Navbar & Header
    brandTitle: 'SMART AUDIO GUIDE',
    brandSubtitle: 'National History Museum',
    navHome: 'Home',
    navFavorites: 'Favorites',
    navMuseumMap: 'Museum Map (USC14)',
    navAdminPanel: '⚙️ Admin Panel',
    btnScanQR: 'Scan QR',
    btnLogin: 'Sign In',
    btnLogout: 'Sign Out',
    greeting: 'Hi',
    confirmLogout: 'Are you sure you want to log out? (USC16)',

    // Hero Section
    badgeSmartGuide: 'Smart 4.0 Museum Audio Guide System',
    heroTitleMain: 'Discover National Heritage',
    heroTitleHighlight: 'Through Multilingual Audio Narrations',
    heroDescription: 'Scan QR codes at exhibition stands, listen to auto-guided tours in 5 languages with real-time synchronized subtitles.',
    searchPlaceholder: 'Search by artifact name, dynasty, era (e.g., Bronze Drum, Ly Dynasty)...',
    btnScanHero: 'Scan Artifact QR',

    // Artifacts Section
    sectionArtifactsTitle: 'Featured Artifacts',
    sectionArtifactsSubtitle: 'Select an artifact to view high-resolution photos and listen to audio narration',
    showingArtifactsCount: (count) => `Showing ${count} artifacts`,
    listensCount: 'listens',
    btnListenAudio: 'Listen Narration',
    btnDetail: 'Details',
    noArtifactsFound: 'No artifacts found matching your criteria (USC15-E2).',
    noArtifactsFoundDesc: 'Please try again with different keywords.',
    alertLoginToFav: 'Please sign in to add this artifact to your favorites list!',

    // Detail View
    backToHome: 'Back to Home',
    zoomHint: '🔍 Click to zoom (USC13)',
    qrBadgeTitle: 'Artifact QR Code',
    btnDownloadQR: 'Download QR',
    audioStreamingTitle: 'Automated Audio Guide (USC04)',
    audioMultiLang: 'Multilingual Stream',
    btnStartAudio: 'Start Audio Narration',
    btnPauseAudio: 'Pause Narration',
    btnPauseShort: 'Pause',
    historyInfoTitle: 'Historical & Heritage Background',
    storageInfo: 'Streamed via: AudioStreamer / MediaArchive',
    totalListens: 'Total listens:',
    locationLabel: 'Location:',
    eraLabel: 'Era:',

    // Favorites View
    favTitle: '❤️ Your Favorite Artifacts (USC06)',
    favSubtitle: 'Collection of artifacts saved to your personal list',

    // Map View
    mapTitle: 'Exhibition Map & Museum Profile (USC11, USC14)',
    addressLabel: '📍 Museum Address',
    openingHoursLabel: '⏰ Opening Hours',
    ticketPriceLabel: '🎟️ Admission Fee',
    interactiveMapTitle: 'Interactive Exhibition Floor Plan',
    artifactsWithQrCount: (count) => `${count} artifacts with QR codes`,
    btnExploreZone: 'Explore Gallery',

    // Global Player Bar
    rewindBtnTitle: 'Rewind 10 seconds',
    forwardBtnTitle: 'Fast-forward 10 seconds',
    playbackSpeedTitle: 'Playback speed',
    ccSubtitleTitle: 'Toggle Subtitles (USC18)',
    ccBtnText: 'CC Subtitles',
    audioStreamError: 'Unable to stream audio narration (USC04-E1).',
    noAudioForLang: 'Audio narration is not yet available in this language (USC12-E1).',

    // QR Scanner Modal
    scannerTitle: 'Scan Artifact QR Code (USC03)',
    scannerHint: 'Point your camera at the QR code stand next to the museum artifact',
    quickTryHint: 'Or pick a sample artifact code to test quickly:',
    quickArtifact1: '🥁 Bronze Drum',
    quickArtifact2: '🪨 Buddha Statue',
    quickArtifact3: '🐢 Doctoral Stelae',
    manualInputPlaceholder: 'Enter code (e.g. ART_art_001)',
    btnLookup: 'Lookup',

    // Auth Modal
    modalTitleLogin: 'Sign In (USC02)',
    modalTitleRegister: 'Create Account (USC01)',
    modalTitleForgot: 'Reset Password (USC17)',
    labelEmailOrPhone: 'Email or Phone Number',
    labelPassword: 'Password',
    btnForgotPassword: 'Forgot password?',
    demoAccountBox: 'Quick Demo Accounts:',
    btnLoginSubmit: 'Sign In',
    labelFullName: 'Full Name',
    labelDefaultLang: 'Default Language',
    labelMinPassword: 'Password (Minimum 6 characters)',
    labelConfirmPassword: 'Confirm Password',
    btnRegisterSubmit: 'Confirm Registration',
    labelRegisteredEmail: 'Enter Registered Email',
    btnSendOtp: '1. Send Verification Code (OTP)',
    labelOtpCode: '6-digit OTP Code',
    labelNewPassword: 'New Password',
    btnUpdatePasswordSubmit: '2. Update Password',
    switchRegisterText: "Don't have an account?",
    switchRegisterAction: 'Register now',
    switchLoginText: 'Already have an account?',
    switchLoginAction: 'Back to Sign In',

    // Admin Dashboard
    adminTitle: 'Museum System Administration (Admin Panel)',
    adminSubtitle: 'Manage heritage artifacts, audio streaming assets, QR codes and analytics',
    tabArtifacts: '🏛️ Manage Artifacts (USC07)',
    tabAnalytics: '📊 Audio Analytics (USC10)',
    adminArtifactListTitle: (count) => `Exhibition Artifacts List (${count})`,
    btnAddArtifact: 'Add New Artifact (A1)',
    colCodeAndImg: 'Code & Photo',
    colArtifactName: 'Artifact Name',
    colZoneEra: 'Gallery & Era',
    colListens: 'Listens',
    colQRCode: 'QR Code (USC08)',
    colActions: 'Actions',
    btnDelete: 'Delete (A3)',
    confirmDelete: (id) => `Are you sure you want to remove artifact ${id} from the system?`,
    statTotalListeners: 'Total Audio Tour Listens',
    statGrowth: '↑ +14.8% compared to last week',
    statStreamingTime: 'Total Audio Stream Time',
    statHours: 'Hours',
    statActiveArtifacts: 'Active Exhibition Artifacts',
    statActiveNote: '100% paired with QR code & Multilingual Audio',
    topArtifactsTitle: 'Most Listened Artifacts (USC10)',
    weeklyTrendTitle: 'Daily Listening Volume Trends',
    btnExportReport: '📥 Export Report (A1)',
    exportReportSuccess: 'Analytics report exported successfully in CSV/PDF format! (USC10-A1)',

    // Days of week
    days: {
      T2: 'Mon',
      T3: 'Tue',
      T4: 'Wed',
      T5: 'Thu',
      T6: 'Fri',
      T7: 'Sat',
      CN: 'Sun'
    },

    // Footer
    footerCopyright: '© 2026 Multilingual Automated Audio Guide System • Software Engineering Project',
    footerArchitecture: 'Architecture: GUI.spa • ClientSession • QRScanner • MediaPlayer • AudioStreamer'
  },

  fr: {
    // Navbar & Header
    brandTitle: 'GUIDE AUDIO INTELLIGENT',
    brandSubtitle: 'Musée National d’Histoire',
    navHome: 'Accueil',
    navFavorites: 'Favoris',
    navMuseumMap: 'Plan du Musée (USC14)',
    navAdminPanel: '⚙️ Administration',
    btnScanQR: 'Scanner QR',
    btnLogin: 'Connexion',
    btnLogout: 'Déconnexion',
    greeting: 'Bonjour',
    confirmLogout: 'Voulez-vous vraiment vous déconnecter? (USC16)',

    // Hero Section
    badgeSmartGuide: 'Système d’Audioguide Intelligent 4.0',
    heroTitleMain: 'Explorez le Patrimoine National',
    heroTitleHighlight: 'Avec Commentaires Audio Multilingues',
    heroDescription: 'Scannez les codes QR dans les galeries, écoutez des visites audioguidées en 5 langues avec sous-titres synchronisés.',
    searchPlaceholder: 'Rechercher par nom d’objet, dynastie, époque...',
    btnScanHero: 'Scanner Code QR',

    // Artifacts Section
    sectionArtifactsTitle: 'Objets Remarquables',
    sectionArtifactsSubtitle: 'Sélectionnez un objet pour afficher ses photos haute résolution et écouter le commentaire audio',
    showingArtifactsCount: (count) => `Affichage de ${count} objets`,
    listensCount: 'écoutes',
    btnListenAudio: 'Écouter le Guide',
    btnDetail: 'Détails',
    noArtifactsFound: 'Aucun objet trouvé correspondant à vos critères (USC15-E2).',
    noArtifactsFoundDesc: 'Veuillez réessayer avec un autre mot-clé.',
    alertLoginToFav: 'Veuillez vous connecter pour ajouter cet objet à vos favoris!',

    // Detail View
    backToHome: 'Retour à l’accueil',
    zoomHint: '🔍 Cliquez pour agrandir (USC13)',
    qrBadgeTitle: 'Code QR de l’Objet',
    btnDownloadQR: 'Télécharger QR',
    audioStreamingTitle: 'Guide Audio Automatique (USC04)',
    audioMultiLang: 'Flux Multilingue',
    btnStartAudio: 'Lancer l’Écoute Audio',
    btnPauseAudio: 'Mettre en Pause',
    btnPauseShort: 'Pause',
    historyInfoTitle: 'Contexte Historique et Patrimonial',
    storageInfo: 'Diffusé via: AudioStreamer / MediaArchive',
    totalListens: 'Écoutes totales:',
    locationLabel: 'Emplacement:',
    eraLabel: 'Époque:',

    // Favorites View
    favTitle: '❤️ Vos Objets Favoris (USC06)',
    favSubtitle: 'Collection d’objets enregistrés dans votre profil',

    // Map View
    mapTitle: 'Plan des Galeries et Profil du Musée (USC11, USC14)',
    addressLabel: '📍 Adresse du musée',
    openingHoursLabel: '⏰ Horaires d’ouverture',
    ticketPriceLabel: '🎟️ Tarif d’entrée',
    interactiveMapTitle: 'Plan Interactif des Expositions',
    artifactsWithQrCount: (count) => `${count} objets équipés de QR code`,
    btnExploreZone: 'Explorer la Galerie',

    // Global Player Bar
    rewindBtnTitle: 'Reculer de 10s',
    forwardBtnTitle: 'Avancer de 10s',
    playbackSpeedTitle: 'Vitesse de lecture',
    ccSubtitleTitle: 'Sous-titres (USC18)',
    ccBtnText: 'Sous-titres CC',
    audioStreamError: 'Impossible de diffuser le fichier audio (USC04-E1).',
    noAudioForLang: 'Guide audio non disponible dans cette langue (USC12-E1).',

    // QR Scanner Modal
    scannerTitle: 'Scanner le Code QR (USC03)',
    scannerHint: 'Pointez votre appareil vers le code QR situé à côté de l’objet',
    quickTryHint: 'Ou choisissez un exemple rapide à tester:',
    quickArtifact1: '🥁 Tambour de Bronze',
    quickArtifact2: '🪨 Statue du Bouddha',
    quickArtifact3: '🐢 Stèles des Docteurs',
    manualInputPlaceholder: 'Code (ex: ART_art_001)',
    btnLookup: 'Rechercher',

    // Auth Modal
    modalTitleLogin: 'Connexion (USC02)',
    modalTitleRegister: 'Créer un Compte (USC01)',
    modalTitleForgot: 'Mot de Passe Oublié (USC17)',
    labelEmailOrPhone: 'E-mail ou Téléphone',
    labelPassword: 'Mot de passe',
    btnForgotPassword: 'Mot de passe oublié?',
    demoAccountBox: 'Comptes de test rapide:',
    btnLoginSubmit: 'Se Connecter',
    labelFullName: 'Nom complet',
    labelDefaultLang: 'Langue par défaut',
    labelMinPassword: 'Mot de passe (Min. 6 caractères)',
    labelConfirmPassword: 'Confirmer mot de passe',
    btnRegisterSubmit: 'Valider l’Inscription',
    labelRegisteredEmail: 'E-mail enregistré',
    btnSendOtp: '1. Envoyer le code OTP',
    labelOtpCode: 'Code OTP (6 chiffres)',
    labelNewPassword: 'Nouveau mot de passe',
    btnUpdatePasswordSubmit: '2. Enregistrer le mot de passe',
    switchRegisterText: 'Pas encore de compte?',
    switchRegisterAction: 'S’inscrire',
    switchLoginText: 'Déjà un compte?',
    switchLoginAction: 'Retour à la connexion',

    // Admin Dashboard
    adminTitle: 'Administration du Musée (Panneau Admin)',
    adminSubtitle: 'Gestion des objets, ressources audio, codes QR et statistiques',
    tabArtifacts: '🏛️ Gestion des Objets (USC07)',
    tabAnalytics: '📊 Statistiques d’Écoute (USC10)',
    adminArtifactListTitle: (count) => `Liste des Objets en Exposition (${count})`,
    btnAddArtifact: 'Ajouter un Objet (A1)',
    colCodeAndImg: 'Code et Photo',
    colArtifactName: 'Nom de l’Objet',
    colZoneEra: 'Galerie & Époque',
    colListens: 'Écoutes',
    colQRCode: 'Code QR (USC08)',
    colActions: 'Actions',
    btnDelete: 'Supprimer (A3)',
    confirmDelete: (id) => `Voulez-vous supprimer l’objet ${id}?`,
    statTotalListeners: 'Total des Écoutes Audio',
    statGrowth: '↑ +14.8% par rapport à la semaine dernière',
    statStreamingTime: 'Temps Total de Diffusion',
    statHours: 'Heures',
    statActiveArtifacts: 'Objets Actifs Exposés',
    statActiveNote: '100% avec QR code et Audio Multilingue',
    topArtifactsTitle: 'Objets les Plus Écoutés (USC10)',
    weeklyTrendTitle: 'Tendance Journalière des Visites Audio',
    btnExportReport: '📥 Exporter le Rapport (A1)',
    exportReportSuccess: 'Rapport exporté avec succès en format CSV/PDF! (USC10-A1)',

    // Days of week
    days: {
      T2: 'Lun',
      T3: 'Mar',
      T4: 'Mer',
      T5: 'Jeu',
      T6: 'Ven',
      T7: 'Sam',
      CN: 'Dim'
    },

    // Footer
    footerCopyright: '© 2026 Système d’Audioguide Multilingue Automatisé • Projet de Génie Logiciel',
    footerArchitecture: 'Architecture: GUI.spa • ClientSession • QRScanner • MediaPlayer • AudioStreamer'
  },

  ja: {
    // Navbar & Header
    brandTitle: 'スマート・音声ガイド',
    brandSubtitle: '国立歴史博物館',
    navHome: 'ホーム',
    navFavorites: 'お気に入り',
    navMuseumMap: '館内マップ (USC14)',
    navAdminPanel: '⚙️ 管理画面',
    btnScanQR: 'QRコード読取',
    btnLogin: 'ログイン',
    btnLogout: 'ログアウト',
    greeting: 'こんにちは',
    confirmLogout: '本当にログアウトしますか？ (USC16)',

    // Hero Section
    badgeSmartGuide: 'スマート博物館 4.0 音声ガイドシステム',
    heroTitleMain: '歴史遺産を発見する',
    heroTitleHighlight: '多言語自動音声ガイドと共に',
    heroDescription: '展示ブースのQRコードを読み取るだけで、5言語の音声解説とリアルタイム同期字幕を楽しめます。',
    searchPlaceholder: '展示品名、時代で検索 (例: 銅太鼓、李朝)...',
    btnScanHero: '展示品のQRをスキャン',

    // Artifacts Section
    sectionArtifactsTitle: '代表的な展示品',
    sectionArtifactsSubtitle: '展示品を選択すると高画質写真の閲覧と自動音声ガイドの再生ができます',
    showingArtifactsCount: (count) => `全 ${count} 件の展示品を表示`,
    listensCount: '回再生',
    btnListenAudio: '解説を聞く',
    btnDetail: '詳細を見る',
    noArtifactsFound: '該当する展示品が見つかりませんでした (USC15-E2)。',
    noArtifactsFoundDesc: '別のキーワードで再検索してください。',
    alertLoginToFav: 'お気に入りに保存するにはログインしてください！',

    // Detail View
    backToHome: 'ホームに戻る',
    zoomHint: '🔍 クリックで拡大 (USC13)',
    qrBadgeTitle: '展示品識別QRコード',
    btnDownloadQR: 'QR画像を保存',
    audioStreamingTitle: '自動音声ガイド (USC04)',
    audioMultiLang: '多言語ストリーミング',
    btnStartAudio: '音声解説を開始',
    btnPauseAudio: '音声解説を一時停止',
    btnPauseShort: '一時停止',
    historyInfoTitle: '歴史的背景・解説',
    storageInfo: '配信サーバー: AudioStreamer / MediaArchive',
    totalListens: '再生回数:',
    locationLabel: '展示場所:',
    eraLabel: '時代:',

    // Favorites View
    favTitle: '❤️ 保存したお気に入り展示品 (USC06)',
    favSubtitle: 'あなたのアカウントに保存された展示品リスト',

    // Map View
    mapTitle: '展示館内図・博物館プロフィール (USC11, USC14)',
    addressLabel: '📍 博物館の所在地',
    openingHoursLabel: '⏰ 開館時間',
    ticketPriceLabel: '🎟️ 入館料',
    interactiveMapTitle: 'インタラクティブ展示フロアマップ',
    artifactsWithQrCount: (count) => `QRコード付き展示品 ${count} 件`,
    btnExploreZone: '展示室を見る',

    // Global Player Bar
    rewindBtnTitle: '10秒戻る',
    forwardBtnTitle: '10秒進む',
    playbackSpeedTitle: '再生速度',
    ccSubtitleTitle: '字幕切替 (USC18)',
    ccBtnText: 'CC 字幕',
    audioStreamError: '音声ストリームの読み込みに失敗しました (USC04-E1)。',
    noAudioForLang: 'この言語の音声解説はまだ用意されていません (USC12-E1)。',

    // QR Scanner Modal
    scannerTitle: '展示品QRコード読み取り (USC03)',
    scannerHint: '展示品の横に設置されているQRコードにカメラを向けてください',
    quickTryHint: 'またはテスト用展示品コードを選択:',
    quickArtifact1: '🥁 青銅太鼓',
    quickArtifact2: '🪨 阿弥陀如来像',
    quickArtifact3: '🐢 進士題名碑',
    manualInputPlaceholder: 'コード入力 (例: ART_art_001)',
    btnLookup: '検索',

    // Auth Modal
    modalTitleLogin: 'ログイン (USC02)',
    modalTitleRegister: '新規会員登録 (USC01)',
    modalTitleForgot: 'パスワード再設定 (USC17)',
    labelEmailOrPhone: 'メールアドレスまたは電話番号',
    labelPassword: 'パスワード',
    btnForgotPassword: 'パスワードをお忘れですか？',
    demoAccountBox: 'クイックテスト用アカウント:',
    btnLoginSubmit: 'ログインする',
    labelFullName: 'お名前',
    labelDefaultLang: 'デフォルト言語',
    labelMinPassword: 'パスワード (6文字以上)',
    labelConfirmPassword: 'パスワード確認',
    btnRegisterSubmit: '登録を完了する',
    labelRegisteredEmail: '登録済みメールアドレス',
    btnSendOtp: '1. 認証コード (OTP) を送信',
    labelOtpCode: '6桁の認証コード',
    labelNewPassword: '新しいパスワード',
    btnUpdatePasswordSubmit: '2. パスワードを更新',
    switchRegisterText: 'アカウントをお持ちでないですか？',
    switchRegisterAction: '新規登録',
    switchLoginText: 'すでに登録済みですか？',
    switchLoginAction: 'ログイン画面へ',

    // Admin Dashboard
    adminTitle: '博物館管理システム (管理者パネル)',
    adminSubtitle: '展示品、音声ファイル、QRコード、利用統計の統合管理',
    tabArtifacts: '🏛️ 展示品管理 (USC07)',
    tabAnalytics: '📊 音声再生統計 (USC10)',
    adminArtifactListTitle: (count) => `現在展示中の遺物リスト (${count})`,
    btnAddArtifact: '展示品を追加 (A1)',
    colCodeAndImg: 'コードと画像',
    colArtifactName: '展示品名',
    colZoneEra: '展示室・時代',
    colListens: '再生回数',
    colQRCode: 'QRコード (USC08)',
    colActions: '操作',
    btnDelete: '削除 (A3)',
    confirmDelete: (id) => `展示品 ${id} をシステムから削除してもよろしいですか？`,
    statTotalListeners: '累計音声ガイド再生数',
    statGrowth: '↑ 前週比 +14.8%',
    statStreamingTime: '累計音声ストリーミング時間',
    statHours: '時間',
    statActiveArtifacts: '稼働中の展示品',
    statActiveNote: '100% QRコード・多言語音声対応済',
    topArtifactsTitle: '最も聴かれた展示品ランキング (USC10)',
    weeklyTrendTitle: '曜日別音声ガイド利用傾向',
    btnExportReport: '📥 統計レポート出力 (A1)',
    exportReportSuccess: 'CSV/PDFレポートを出力しました！ (USC10-A1)',

    // Days of week
    days: {
      T2: '月',
      T3: '火',
      T4: '水',
      T5: '木',
      T6: '金',
      T7: '土',
      CN: '日'
    },

    // Footer
    footerCopyright: '© 2026 多言語自動音声ガイドシステム • ソフトウェア工学プロジェクト',
    footerArchitecture: 'アーキテクチャ: GUI.spa • ClientSession • QRScanner • MediaPlayer • AudioStreamer'
  },

  zh: {
    // Navbar & Header
    brandTitle: '智能语音导览系统',
    brandSubtitle: '国家历史博物馆',
    navHome: '首页',
    navFavorites: '我的收藏',
    navMuseumMap: '展馆地图 (USC14)',
    navAdminPanel: '⚙️ 管理后台',
    btnScanQR: '扫码导览',
    btnLogin: '登录',
    btnLogout: '退出登录',
    greeting: '你好',
    confirmLogout: '确定要退出登录吗？ (USC16)',

    // Hero Section
    badgeSmartGuide: '智慧博物馆 4.0 智能语音导览',
    heroTitleMain: '探索国家历史文化遗产',
    heroTitleHighlight: '享受多语言自动语音导览',
    heroDescription: '展位现场扫描二维码，即刻畅听5种国际语言语音解说与实时同步字幕。',
    searchPlaceholder: '输入文物名称、朝代搜索 (例如: 铜鼓、李朝)...',
    btnScanHero: '扫描文物二维码',

    // Artifacts Section
    sectionArtifactsTitle: '精选重点文物',
    sectionArtifactsSubtitle: '点击选择文物即可查看超清细节图并聆听智能语音解说',
    showingArtifactsCount: (count) => `共展示 ${count} 件珍贵文物`,
    listensCount: '次播放',
    btnListenAudio: '聆听解说',
    btnDetail: '详情',
    noArtifactsFound: '未找到符合条件的文物 (USC15-E2)。',
    noArtifactsFoundDesc: '请尝试更换关键词后重试。',
    alertLoginToFav: '请先登录以将此文物加入您的收藏夹！',

    // Detail View
    backToHome: '返回首页',
    zoomHint: '🔍 点击放大图片 (USC13)',
    qrBadgeTitle: '文物标识二维码',
    btnDownloadQR: '下载二维码',
    audioStreamingTitle: '自动语音解说 (USC04)',
    audioMultiLang: '多语言实时音频流',
    btnStartAudio: '开始播放语音解说',
    btnPauseAudio: '暂停语音解说',
    btnPauseShort: '暂停',
    historyInfoTitle: '文物历史背景与文化内涵',
    storageInfo: '媒体存储源: AudioStreamer / MediaArchive',
    totalListens: '播放次数:',
    locationLabel: '展区展位:',
    eraLabel: '年代:',

    // Favorites View
    favTitle: '❤️ 您收藏的珍贵文物 (USC06)',
    favSubtitle: '保存在您个人账户中的心仪文物清单',

    // Map View
    mapTitle: '展馆展区平面图及博物馆简介 (USC11, USC14)',
    addressLabel: '📍 博物馆地址',
    openingHoursLabel: '⏰ 开放时间',
    ticketPriceLabel: '🎟️ 门票信息',
    interactiveMapTitle: '互动式展馆平面图',
    artifactsWithQrCount: (count) => `配备二维码文物 ${count} 件`,
    btnExploreZone: '探索展区',

    // Global Player Bar
    rewindBtnTitle: '快退 10 秒',
    forwardBtnTitle: '快进 10 秒',
    playbackSpeedTitle: '播放语速',
    ccSubtitleTitle: '开关字幕 (USC18)',
    ccBtnText: 'CC 字幕',
    audioStreamError: '无法加载音频流 (USC04-E1)。',
    noAudioForLang: '暂无当前语言的解说音频 (USC12-E1)。',

    // QR Scanner Modal
    scannerTitle: '扫描文物二维码 (USC03)',
    scannerHint: '请将摄像头对准展品旁设立的二维码标牌',
    quickTryHint: '或快速点击示例文物代码进行测试:',
    quickArtifact1: '🥁 东山铜鼓',
    quickArtifact2: '🪨 阿弥陀佛坐像',
    quickArtifact3: '🐢 进士题名碑',
    manualInputPlaceholder: '手动输入代码 (如: ART_art_001)',
    btnLookup: '查询文物',

    // Auth Modal
    modalTitleLogin: '用户登录 (USC02)',
    modalTitleRegister: '创建新账户 (USC01)',
    modalTitleForgot: '找回密码 (USC17)',
    labelEmailOrPhone: '电子邮箱或手机号码',
    labelPassword: '账户密码',
    btnForgotPassword: '忘记密码？',
    demoAccountBox: '快速测试账户:',
    btnLoginSubmit: '立即登录',
    labelFullName: '您的姓名',
    labelDefaultLang: '默认首选语言',
    labelMinPassword: '登录密码 (至少 6 位)',
    labelConfirmPassword: '确认密码',
    btnRegisterSubmit: '完成注册',
    labelRegisteredEmail: '输入已注册的邮箱',
    btnSendOtp: '1. 获取验证码 (OTP)',
    labelOtpCode: '6位数字验证码',
    labelNewPassword: '新密码',
    btnUpdatePasswordSubmit: '2. 确认重置密码',
    switchRegisterText: '还没有账户？',
    switchRegisterAction: '立即注册',
    switchLoginText: '已有账户？',
    switchLoginAction: '返回登录',

    // Admin Dashboard
    adminTitle: '博物馆系统管理后台 (Admin Panel)',
    adminSubtitle: '管理文物信息、音频资产、二维码和数据报表',
    tabArtifacts: '🏛️ 文物管理 (USC07)',
    tabAnalytics: '📊 播放统计分析 (USC10)',
    adminArtifactListTitle: (count) => `展出中文物列表 (${count})`,
    btnAddArtifact: '新增文物 (A1)',
    colCodeAndImg: '编号与缩略图',
    colArtifactName: '文物名称',
    colZoneEra: '展区与年代',
    colListens: '播放次数',
    colQRCode: '二维码 (USC08)',
    colActions: '操作',
    btnDelete: '删除 (A3)',
    confirmDelete: (id) => `确定要从系统中删除文物 ${id} 吗？`,
    statTotalListeners: '语音导览累计播放次数',
    statGrowth: '↑ 较上周增长 +14.8%',
    statStreamingTime: '累计音频流播放时长',
    statHours: '小时',
    statActiveArtifacts: '展厅现存活跃文物',
    statActiveNote: '100% 配备专属二维码与多语言解说',
    topArtifactsTitle: '热门收听文物排行榜 (USC10)',
    weeklyTrendTitle: '本周各工作日播放量趋势',
    btnExportReport: '📥 导出数据报表 (A1)',
    exportReportSuccess: '数据统计报表已成功导出为 CSV/PDF！ (USC10-A1)',

    // Days of week
    days: {
      T2: '周一',
      T3: '周二',
      T4: '周三',
      T5: '周四',
      T6: '周五',
      T7: '周六',
      CN: '周日'
    },

    // Footer
    footerCopyright: '© 2026 多语言自动语音导览系统 • 软件工程毕业设计',
    footerArchitecture: '架构组件: GUI.spa • ClientSession • QRScanner • MediaPlayer • AudioStreamer'
  }
};

/**
 * Helper function để lấy bản dịch theo mã ngôn ngữ hiện tại
 */
function getI18n(lang = 'vi') {
  return translations[lang] || translations['vi'];
}

// === FILE: frontend/src/services/ClientSession.js ===
/**
 * ClientSession Component - Mô phỏng theo Component Diagram (Client Session)
 * Giao tiếp với I_Auth để xác thực người dùng, lưu trữ Token JWT và quản lý phiên.
 * Tương ứng USC01, USC02, USC16, USC17
 */
class ClientSessionService {
  constructor() {
    this.STORAGE_KEY = 'museum_auth_session';
    this.LOGIN_ATTEMPTS_KEY = 'museum_login_attempts';
    this.currentUser = this.loadSession();
    this.listeners = [];
  }

  // Tải session đã lưu
  loadSession() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  // Đăng ký observer khi trạng thái auth thay đổi
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  // USC02: Đăng nhập hệ thống (hỗ trợ kiểm tra khóa 5 lần sai - E2)
  async login(email, password) {
    await this.delay(500); // Giả lập độ trễ mạng

    // Kiểm tra số lần nhập sai
    const attempts = parseInt(localStorage.getItem(this.LOGIN_ATTEMPTS_KEY) || '0', 10);
    if (attempts >= 5) {
      throw new Error('Tài khoản đã bị tạm khóa do nhập sai quá 5 lần. Vui lòng thử lại sau 15 phút hoặc chọn Quên mật khẩu.');
    }

    const user = mockDB.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('Tài khoản không tồn tại trên hệ thống (E1).');
    }

    if (user.password !== password) {
      localStorage.setItem(this.LOGIN_ATTEMPTS_KEY, (attempts + 1).toString());
      const remaining = 5 - (attempts + 1);
      throw new Error(`Mật khẩu không chính xác. Bạn còn ${remaining} lần thử trước khi bị khóa (E2).`);
    }

    // Đăng nhập thành công -> Reset số lần thử và cấp session
    localStorage.removeItem(this.LOGIN_ATTEMPTS_KEY);
    const sessionData = {
      token: 'jwt_mock_token_' + Date.now(),
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role, // 'user' hoặc 'admin' (A1)
      defaultLang: user.defaultLang || 'vi',
      favorites: [...user.favorites]
    };

    this.currentUser = sessionData;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
    this.notify();
    return sessionData;
  }

  // USC01: Đăng ký tài khoản
  async register({ fullName, email, password, defaultLang = 'vi' }) {
    await this.delay(600);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Định dạng email không hợp lệ (E1).');
    }

    if (password.length < 6) {
      throw new Error('Mật khẩu phải có tối thiểu 6 ký tự (E1).');
    }

    // Kiểm tra tài khoản đã tồn tại (E2)
    const exists = mockDB.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('Email này đã được đăng ký trước đó. Vui lòng đăng nhập hoặc dùng chức năng Quên mật khẩu (E2).');
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      fullName,
      email,
      password,
      role: 'user',
      defaultLang,
      favorites: []
    };

    mockDB.users.push(newUser);
    return { success: true, message: 'Đăng ký tài khoản thành công!' };
  }

  // USC16: Đăng xuất
  logout() {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
    this.notify();
    return true;
  }

  // USC17: Quên mật khẩu & Gửi mã OTP giả lập
  async forgotPassword(email) {
    await this.delay(500);
    const user = mockDB.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Email chưa được đăng ký trong hệ thống (E1).');
    }
    // Tạo OTP mock
    const mockOtp = '888888';
    sessionStorage.setItem('otp_reset_pwd_' + email, mockOtp);
    return { success: true, message: `Mã OTP đã được gửi đến email ${email}. (Mã thử nghiệm: ${mockOtp})` };
  }

  // Đặt lại mật khẩu mới
  async resetPassword(email, otp, newPassword) {
    await this.delay(500);
    const savedOtp = sessionStorage.getItem('otp_reset_pwd_' + email);
    if (!savedOtp || savedOtp !== otp) {
      throw new Error('Mã xác nhận OTP không đúng hoặc đã hết hạn.');
    }
    if (newPassword.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.');
    }
    const user = mockDB.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.password = newPassword;
      sessionStorage.removeItem('otp_reset_pwd_' + email);
      return { success: true, message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.' };
    }
    throw new Error('Người dùng không tồn tại.');
  }

  // USC06: Lưu sự vật yêu thích
  toggleFavorite(artifactId) {
    if (!this.currentUser) {
      throw new Error('Vui lòng đăng nhập để lưu hiện vật vào danh sách yêu thích!');
    }
    const favs = this.currentUser.favorites || [];
    const index = favs.indexOf(artifactId);
    let isFav = false;

    if (index >= 0) {
      favs.splice(index, 1);
    } else {
      favs.push(artifactId);
      isFav = true;
    }

    this.currentUser.favorites = favs;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));

    // Cập nhật lại trong mockDB user
    const dbUser = mockDB.users.find(u => u.id === this.currentUser.id);
    if (dbUser) {
      dbUser.favorites = favs;
    }

    this.notify();
    return isFav;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  getUser() {
    return this.currentUser;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const ClientSession = new ClientSessionService();

// === FILE: frontend/src/services/ArtifactService.js ===
/**
 * ArtifactService - Cổng giao tiếp I_Artifact với ArtifactManager
 * Phục vụ USC03 (Quét QR), USC07 (Quản lý sự vật), USC08 (Chỉnh sửa QR), USC12 (Đọc nội dung), USC15 (Tìm kiếm)
 */
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

const ArtifactServiceInstance = new ArtifactService();

// === FILE: frontend/src/services/MediaPlayer.js ===
/**
 * MediaPlayer Component - Mô phỏng theo Component Diagram (Media Player)
 * Giao tiếp với AudioStreamer qua I_Audio
 * Hiện thực USC04 (Nghe thuyết minh), USC05 (Chuyển đổi ngôn ngữ), USC18 (Xem phụ đề), USC19 (Phát luồng dữ liệu)
 * Hỗ trợ Đa phương thức: Web Speech API (TTS đa ngôn ngữ), Web Audio API (Âm báo Tour Guide) & HTMLAudioElement
 */
class MediaPlayerController {
  constructor() {
    this.audioElement = new Audio();
    this.currentArtifact = null;
    this.currentLang = 'vi';
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 20;
    this.playbackRate = 1.0;
    this.subtitlesEnabled = true; // USC18
    this.currentSubtitleText = '';
    this.subscribers = [];

    this.timer = null;
    this.currentUtterance = null;
    this.lastSpokenIndex = -1;
    this.audioCtx = null;
    this.ambientOsc = null;
    this.ambientGain = null;

    this.voices = [];
    this.initVoices();
  }

  initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices() || [];
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices() || [];
      };
    }
  }

  getVoice(langCode) {
    if (!this.voices || this.voices.length === 0) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        this.voices = window.speechSynthesis.getVoices() || [];
      }
    }
    const prefixMap = {
      vi: ['vi-vn', 'vi'],
      en: ['en-us', 'en-gb', 'en'],
      fr: ['fr-fr', 'fr'],
      ja: ['ja-jp', 'ja'],
      zh: ['zh-cn', 'zh-tw', 'zh']
    };
    const targets = prefixMap[langCode] || [langCode];
    for (const t of targets) {
      const match = this.voices.find(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith(t));
      if (match) return match;
    }
    return null;
  }

  playChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const now = this.audioCtx.currentTime;

      // Bell Tone 1 (D5 - 587Hz)
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Bell Tone 2 (A5 - 880Hz)
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.0, now + 0.12);
      gain2.gain.setValueAtTime(0.15, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.55);
    } catch (e) {
      console.warn('Audio chime note:', e);
    }
  }

  startAmbient() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      this.stopAmbient();

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, this.audioCtx.currentTime);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(146.83, this.audioCtx.currentTime); // D3 soft tone

      gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.02, this.audioCtx.currentTime + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      this.ambientOsc = osc;
      this.ambientGain = gain;
    } catch (e) {
      // ignore
    }
  }

  stopAmbient() {
    try {
      if (this.ambientOsc) {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
        this.ambientOsc = null;
      }
      if (this.ambientGain) {
        this.ambientGain.disconnect();
        this.ambientGain = null;
      }
    } catch (e) {}
  }

  getSubtitlesList() {
    if (!this.currentArtifact) return [];
    const art = this.currentArtifact;
    if (art.subtitles && art.subtitles[this.currentLang] && art.subtitles[this.currentLang].length > 0) {
      return art.subtitles[this.currentLang];
    }
    if (art.subtitles && art.subtitles.vi && art.subtitles.vi.length > 0) {
      return art.subtitles.vi;
    }
    // Fallback: sinh phụ đề từ description của hiện vật
    const descText = (art.description && (art.description[this.currentLang] || art.description.vi)) || '';
    if (descText) {
      const sentences = descText.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
      return sentences.map((sentence, idx) => ({
        time: idx * 5,
        text: sentence.trim()
      }));
    }
    const title = (art.name && (art.name[this.currentLang] || art.name.vi)) || 'Hiện vật bảo tàng';
    return [{ time: 0, text: title }];
  }

  calculateDuration() {
    const subs = this.getSubtitlesList();
    if (subs.length === 0) return 20;
    const lastSub = subs[subs.length - 1];
    return Math.max(lastSub.time + 6, 18);
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  emitChange(extra = {}) {
    this.subscribers.forEach(cb => {
      try {
        cb({
          isPlaying: this.isPlaying,
          currentTime: this.currentTime,
          duration: this.duration,
          currentArtifact: this.currentArtifact,
          currentLang: this.currentLang,
          playbackRate: this.playbackRate,
          subtitlesEnabled: this.subtitlesEnabled,
          currentSubtitleText: this.currentSubtitleText,
          ...extra
        });
      } catch (err) {
        console.error('Subscriber callback error:', err);
      }
    });
  }

  loadArtifact(artifact, lang = 'vi') {
    this.pause();
    this.currentArtifact = artifact;
    this.currentLang = lang;
    this.currentTime = 0;
    this.lastSpokenIndex = -1;
    this.duration = this.calculateDuration();
    this.currentSubtitleText = '';

    // Tăng lượt nghe (listenCount)
    if (artifact && typeof artifact.listenCount === 'number') {
      artifact.listenCount++;
    }

    this.updateSubtitle();
    this.emitChange();
  }

  speakText(text) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.7, Math.min(1.6, this.playbackRate));
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const langMap = {
        vi: 'vi-VN',
        en: 'en-US',
        fr: 'fr-FR',
        ja: 'ja-JP',
        zh: 'zh-CN'
      };
      utterance.lang = langMap[this.currentLang] || 'vi-VN';
      const voice = this.getVoice(this.currentLang);
      if (voice) {
        utterance.voice = voice;
      }

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('Speech cancel error:', e);
      }
    }
    this.currentUtterance = null;
  }

  play() {
    if (!this.currentArtifact) return;
    if (this.isPlaying) return;

    this.isPlaying = true;
    if (this.currentTime < 0.5) {
      this.playChime();
    }
    this.startAmbient();

    const subs = this.getSubtitlesList();
    let currentIdx = -1;
    for (let i = 0; i < subs.length; i++) {
      if (this.currentTime >= subs[i].time) {
        currentIdx = i;
      }
    }

    if (currentIdx >= 0 && subs[currentIdx]) {
      this.lastSpokenIndex = currentIdx;
      this.speakText(subs[currentIdx].text);
    } else if (subs.length > 0) {
      this.lastSpokenIndex = 0;
      this.speakText(subs[0].text);
    }

    this.startTimer();
    this.updateSubtitle();
    this.emitChange();
  }

  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.stopSpeaking();
    this.stopAmbient();
    this.emitChange();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(this.timer);
        this.timer = null;
        return;
      }

      // Khắc phục bug Chrome tạm dừng TTS sau 15s
      if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      this.currentTime += 0.1 * this.playbackRate;

      // Hết bài
      if (this.currentTime >= this.duration) {
        this.currentTime = 0;
        this.isPlaying = false;
        this.lastSpokenIndex = -1;
        this.stopSpeaking();
        this.stopAmbient();
        clearInterval(this.timer);
        this.timer = null;
        this.updateSubtitle();
        this.emitChange();
        return;
      }

      // Kiểm tra chuyển đoạn phụ đề
      const subs = this.getSubtitlesList();
      let currentIdx = -1;
      for (let i = 0; i < subs.length; i++) {
        if (this.currentTime >= subs[i].time) {
          currentIdx = i;
        }
      }

      if (currentIdx !== this.lastSpokenIndex && currentIdx >= 0 && subs[currentIdx]) {
        this.lastSpokenIndex = currentIdx;
        this.speakText(subs[currentIdx].text);
      }

      this.updateSubtitle();
      this.emitChange();
    }, 100);
  }

  seek(seconds) {
    this.currentTime = Math.max(0, Math.min(seconds, this.duration));
    const subs = this.getSubtitlesList();
    let currentIdx = -1;
    for (let i = 0; i < subs.length; i++) {
      if (this.currentTime >= subs[i].time) {
        currentIdx = i;
      }
    }
    this.lastSpokenIndex = currentIdx;
    if (this.isPlaying && currentIdx >= 0 && subs[currentIdx]) {
      this.speakText(subs[currentIdx].text);
    }
    this.updateSubtitle();
    this.emitChange();
  }

  setPlaybackRate(rate) {
    this.playbackRate = rate;
    if (this.isPlaying) {
      const subs = this.getSubtitlesList();
      if (this.lastSpokenIndex >= 0 && subs[this.lastSpokenIndex]) {
        this.speakText(subs[this.lastSpokenIndex].text);
      }
    }
    this.emitChange();
  }

  toggleSubtitles() {
    this.subtitlesEnabled = !this.subtitlesEnabled;
    this.updateSubtitle();
    this.emitChange();
  }

  changeLanguage(newLang) {
    if (this.currentLang === newLang) return;
    this.currentLang = newLang;
    this.duration = this.calculateDuration();
    if (this.isPlaying) {
      const subs = this.getSubtitlesList();
      let currentIdx = -1;
      for (let i = 0; i < subs.length; i++) {
        if (this.currentTime >= subs[i].time) {
          currentIdx = i;
        }
      }
      this.lastSpokenIndex = currentIdx;
      if (currentIdx >= 0 && subs[currentIdx]) {
        this.speakText(subs[currentIdx].text);
      }
    }
    this.updateSubtitle();
    this.emitChange();
  }

  updateSubtitle() {
    if (!this.subtitlesEnabled || !this.currentArtifact) {
      this.currentSubtitleText = '';
      return;
    }

    const subs = this.getSubtitlesList();
    let activeText = '';
    for (let i = 0; i < subs.length; i++) {
      if (this.currentTime >= subs[i].time) {
        activeText = subs[i].text;
      }
    }
    this.currentSubtitleText = activeText;
  }
}

const MediaPlayer = new MediaPlayerController();

// === FILE: frontend/src/components/QRScanner.js ===
/**
 * QRScanner Component - Tương ứng Component Diagram (QR Scanner)
 * Xử lý USC03: Quét mã QR hiện vật (đa ngôn ngữ giao diện)
 */
class QRScannerModal {
  constructor(onSuccess, onError, getCurrentLang) {
    this.onSuccess = onSuccess;
    this.onError = onError;
    this.getCurrentLang = getCurrentLang || (() => 'vi');
    this.stream = null;
    this.isOpen = false;
  }

  get t() {
    return getI18n(this.getCurrentLang());
  }

  render() {
    const t = this.t;
    let modalEl = document.getElementById('qr-scanner-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'qr-scanner-modal';
      modalEl.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 hidden';
      document.body.appendChild(modalEl);
    }

    modalEl.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative animate-fade-in">
        <!-- Header -->
        <div class="p-4 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
            </span>
            <h3 class="font-bold text-lg">${t.scannerTitle}</h3>
          </div>
          <button id="close-qr-scanner" class="text-slate-400 hover:text-white p-1 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Camera Scanner Simulator / Live Video -->
        <div class="p-6 flex flex-col items-center">
          <div class="relative w-64 h-64 bg-slate-950 rounded-xl overflow-hidden border-2 border-dashed border-amber-500/60 flex items-center justify-center shadow-inner group">
            <video id="qr-video" class="w-full h-full object-cover hidden" playsinline></video>
            
            <div id="camera-placeholder" class="text-center p-4">
              <div class="w-16 h-16 mx-auto mb-3 text-amber-400/80 animate-pulse">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <p class="text-xs text-slate-400">${t.scannerHint}</p>
            </div>

            <!-- Scanning overlay line -->
            <div class="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-lg shadow-amber-500/50 animate-bounce"></div>
          </div>

          <div class="w-full mt-4 text-center">
            <p class="text-xs text-slate-400 mb-2">${t.quickTryHint}</p>
            <div class="flex flex-wrap justify-center gap-2">
              <button data-quick-code="ART_art_001" class="quick-qr-btn text-xs bg-slate-800 hover:bg-amber-600 px-3 py-1.5 rounded-full border border-slate-700 transition">
                ${t.quickArtifact1}
              </button>
              <button data-quick-code="ART_art_002" class="quick-qr-btn text-xs bg-slate-800 hover:bg-amber-600 px-3 py-1.5 rounded-full border border-slate-700 transition">
                ${t.quickArtifact2}
              </button>
              <button data-quick-code="ART_art_003" class="quick-qr-btn text-xs bg-slate-800 hover:bg-amber-600 px-3 py-1.5 rounded-full border border-slate-700 transition">
                ${t.quickArtifact3}
              </button>
            </div>
          </div>

          <!-- Nhập thủ công -->
          <div class="w-full mt-5 pt-4 border-t border-slate-800">
            <form id="manual-qr-form" class="flex gap-2">
              <input type="text" id="manual-qr-input" placeholder="${t.manualInputPlaceholder}" 
                class="flex-1 bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
              <button type="submit" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition">
                ${t.btnLookup}
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(modalEl);
  }

  bindEvents(modalEl) {
    modalEl.querySelector('#close-qr-scanner').onclick = () => this.close();
    
    // Quick click
    modalEl.querySelectorAll('.quick-qr-btn').forEach(btn => {
      btn.onclick = () => {
        const code = btn.getAttribute('data-quick-code');
        this.processCode(code);
      };
    });

    // Form submit
    modalEl.querySelector('#manual-qr-form').onsubmit = (e) => {
      e.preventDefault();
      const val = modalEl.querySelector('#manual-qr-input').value.trim();
      if (val) {
        this.processCode(val);
      }
    };
  }

  open() {
    this.render();
    const modalEl = document.getElementById('qr-scanner-modal');
    modalEl.classList.remove('hidden');
    this.isOpen = true;
    this.startCamera();
  }

  close() {
    const modalEl = document.getElementById('qr-scanner-modal');
    if (modalEl) modalEl.classList.add('hidden');
    this.stopCamera();
    this.isOpen = false;
  }

  async startCamera() {
    const video = document.getElementById('qr-video');
    const placeholder = document.getElementById('camera-placeholder');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (video) {
          video.srcObject = this.stream;
          video.classList.remove('hidden');
          placeholder.classList.add('hidden');
          video.play();
        }
      } catch (err) {
        // Fallback gracefully
      }
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  async processCode(code) {
    try {
      const artifact = await ArtifactServiceInstance.resolveQRCode(code);
      this.close();
      if (this.onSuccess) this.onSuccess(artifact);
    } catch (err) {
      alert(err.message);
      if (this.onError) this.onError(err);
    }
  }
}

// === FILE: frontend/src/components/AuthModal.js ===
/**
 * AuthModal Component - Hiện thực USC01 (Đăng ký), USC02 (Đăng nhập), USC17 (Quên mật khẩu)
 * Đã hỗ trợ đa ngôn ngữ đầy đủ theo ngữ cảnh i18n
 */
class AuthModal {
  constructor(onSuccess, getCurrentLang) {
    this.onSuccess = onSuccess;
    this.getCurrentLang = getCurrentLang || (() => 'vi');
    this.mode = 'login'; // 'login' | 'register' | 'forgot'
    this.init();
  }

  get t() {
    return getI18n(this.getCurrentLang());
  }

  init() {
    let el = document.getElementById('auth-modal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'auth-modal';
      el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 hidden';
      document.body.appendChild(el);
    }
  }

  open(mode = 'login') {
    this.mode = mode;
    this.render();
    const el = document.getElementById('auth-modal');
    el.classList.remove('hidden');
  }

  close() {
    const el = document.getElementById('auth-modal');
    if (el) el.classList.add('hidden');
  }

  render() {
    const t = this.t;
    const el = document.getElementById('auth-modal');
    el.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative animate-fade-in">
        <!-- Header -->
        <div class="p-5 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </span>
            <h3 class="font-bold text-lg">
              ${this.mode === 'login' ? t.modalTitleLogin : this.mode === 'register' ? t.modalTitleRegister : t.modalTitleForgot}
            </h3>
          </div>
          <button id="close-auth-modal" class="text-slate-400 hover:text-white p-1 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div id="auth-alert" class="mx-5 mt-4 p-3 rounded-lg text-xs hidden"></div>

        <div class="p-5">
          ${this.renderFormContent()}
        </div>

        <!-- Footer switch mode -->
        <div class="p-4 bg-slate-950/60 border-t border-slate-800 text-center text-xs text-slate-400">
          ${this.renderFooterLinks()}
        </div>
      </div>
    `;

    this.bindEvents(el);
  }

  renderFormContent() {
    const t = this.t;

    if (this.mode === 'login') {
      return `
        <form id="login-form" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelEmailOrPhone}</label>
            <input type="email" id="login-email" required placeholder="admin@museum.vn / visitor@museum.vn" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="text-xs font-semibold text-slate-300">${t.labelPassword}</label>
              <button type="button" id="switch-to-forgot" class="text-xs text-amber-400 hover:underline">${t.btnForgotPassword}</button>
            </div>
            <input type="password" id="login-password" required placeholder="••••••••" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>

          <!-- Quick Fill Demo -->
          <div class="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/60 text-xs">
            <span class="text-slate-400 font-medium">${t.demoAccountBox}</span>
            <div class="mt-1 flex gap-2">
              <button type="button" id="fill-admin" class="bg-amber-500/20 text-amber-300 px-2 py-1 rounded hover:bg-amber-500/30">Admin (admin@museum.vn)</button>
              <button type="button" id="fill-user" class="bg-blue-500/20 text-blue-300 px-2 py-1 rounded hover:bg-blue-500/30">User (visitor@museum.vn)</button>
            </div>
          </div>

          <button type="submit" id="login-submit-btn" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition">
            ${t.btnLoginSubmit}
          </button>
        </form>
      `;
    }

    if (this.mode === 'register') {
      return `
        <form id="register-form" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelFullName}</label>
            <input type="text" id="reg-name" required placeholder="Nguyễn Văn A" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Email</label>
            <input type="email" id="reg-email" required placeholder="email@example.com" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelDefaultLang}</label>
            <select id="reg-lang" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelMinPassword}</label>
            <input type="password" id="reg-password" required placeholder="••••••••" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelConfirmPassword}</label>
            <input type="password" id="reg-confirm-pwd" required placeholder="••••••••" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>

          <button type="submit" id="reg-submit-btn" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition mt-2">
            ${t.btnRegisterSubmit}
          </button>
        </form>
      `;
    }

    if (this.mode === 'forgot') {
      return `
        <form id="forgot-form" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelRegisteredEmail}</label>
            <input type="email" id="forgot-email" required placeholder="visitor@museum.vn" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>
          <button type="button" id="send-otp-btn" class="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 py-2 rounded-lg text-xs font-bold transition">
            ${t.btnSendOtp}
          </button>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelOtpCode}</label>
            <input type="text" id="forgot-otp" placeholder="888888" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelNewPassword}</label>
            <input type="password" id="forgot-new-pwd" placeholder="••••••••" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>
          <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition">
            ${t.btnUpdatePasswordSubmit}
          </button>
        </form>
      `;
    }
  }

  renderFooterLinks() {
    const t = this.t;
    if (this.mode === 'login') {
      return `${t.switchRegisterText} <button id="switch-to-register" class="text-amber-400 font-bold hover:underline">${t.switchRegisterAction}</button>`;
    }
    return `${t.switchLoginText} <button id="switch-to-login" class="text-amber-400 font-bold hover:underline">${t.switchLoginAction}</button>`;
  }

  showAlert(message, isError = true) {
    const alertEl = document.getElementById('auth-alert');
    if (!alertEl) return;
    alertEl.textContent = message;
    alertEl.className = `mx-5 mt-4 p-3 rounded-lg text-xs font-medium ${isError ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}`;
    alertEl.classList.remove('hidden');
  }

  bindEvents(el) {
    el.querySelector('#close-auth-modal').onclick = () => this.close();

    const switchReg = el.querySelector('#switch-to-register');
    if (switchReg) switchReg.onclick = () => this.open('register');

    const switchLog = el.querySelector('#switch-to-login');
    if (switchLog) switchLog.onclick = () => this.open('login');

    const switchForgot = el.querySelector('#switch-to-forgot');
    if (switchForgot) switchForgot.onclick = () => this.open('forgot');

    // Quick fill
    const fillAdmin = el.querySelector('#fill-admin');
    if (fillAdmin) {
      fillAdmin.onclick = () => {
        el.querySelector('#login-email').value = 'admin@museum.vn';
        el.querySelector('#login-password').value = 'admin123';
      };
    }
    const fillUser = el.querySelector('#fill-user');
    if (fillUser) {
      fillUser.onclick = () => {
        el.querySelector('#login-email').value = 'visitor@museum.vn';
        el.querySelector('#login-password').value = 'password123';
      };
    }

    // Submit Login
    const loginForm = el.querySelector('#login-form');
    if (loginForm) {
      loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = el.querySelector('#login-email').value.trim();
        const pwd = el.querySelector('#login-password').value;
        const btn = el.querySelector('#login-submit-btn');

        try {
          btn.disabled = true;
          btn.innerHTML = `<span class="inline-block animate-spin mr-2">⟳</span> ...`;
          const session = await ClientSession.login(email, pwd);
          this.close();
          if (this.onSuccess) this.onSuccess(session);
        } catch (err) {
          this.showAlert(err.message, true);
        } finally {
          btn.disabled = false;
          btn.textContent = this.t.btnLoginSubmit;
        }
      };
    }

    // Submit Register
    const regForm = el.querySelector('#register-form');
    if (regForm) {
      regForm.onsubmit = async (e) => {
        e.preventDefault();
        const fullName = el.querySelector('#reg-name').value.trim();
        const email = el.querySelector('#reg-email').value.trim();
        const defaultLang = el.querySelector('#reg-lang').value;
        const pwd = el.querySelector('#reg-password').value;
        const confirmPwd = el.querySelector('#reg-confirm-pwd').value;

        if (pwd !== confirmPwd) {
          this.showAlert('Mật khẩu xác nhận không khớp.', true);
          return;
        }

        try {
          await ClientSession.register({ fullName, email, password: pwd, defaultLang });
          this.showAlert('Đăng ký thành công! / Registration successful!', false);
          setTimeout(() => this.open('login'), 1200);
        } catch (err) {
          this.showAlert(err.message, true);
        }
      };
    }

    // Submit Forgot Password
    const sendOtpBtn = el.querySelector('#send-otp-btn');
    if (sendOtpBtn) {
      sendOtpBtn.onclick = async () => {
        const email = el.querySelector('#forgot-email').value.trim();
        if (!email) {
          this.showAlert('Vui lòng nhập Email để nhận OTP.', true);
          return;
        }
        try {
          const res = await ClientSession.forgotPassword(email);
          this.showAlert(res.message, false);
        } catch (err) {
          this.showAlert(err.message, true);
        }
      };
    }

    const forgotForm = el.querySelector('#forgot-form');
    if (forgotForm) {
      forgotForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = el.querySelector('#forgot-email').value.trim();
        const otp = el.querySelector('#forgot-otp').value.trim();
        const newPwd = el.querySelector('#forgot-new-pwd').value;

        try {
          const res = await ClientSession.resetPassword(email, otp, newPwd);
          this.showAlert(res.message, false);
          setTimeout(() => this.open('login'), 1500);
        } catch (err) {
          this.showAlert(err.message, true);
        }
      };
    }
  }
}

// === FILE: frontend/src/components/PlayerBar.js ===
/**
 * PlayerBar Component - Thanh phát âm thanh cố định góc dưới màn hình
 * Hỗ trợ USC04 (Nghe thuyết minh), USC18 (Phụ đề), USC19 (Tua audio), USC05 (Đổi ngôn ngữ)
 * Thiết kế tối ưu DOM: Không render lại toàn bộ innerHTML mỗi tick để nút Play/Pause luôn nhận click 100%
 */
class PlayerBar {
  constructor(onOpenDetail, getCurrentLang) {
    this.onOpenDetail = onOpenDetail;
    this.getCurrentLang = getCurrentLang || (() => 'vi');
    this.renderedArtifactId = null;
    this.renderedLang = null;
    this.latestState = null;
    this.init();
  }

  get t() {
    return getI18n(this.getCurrentLang());
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  init() {
    let el = document.getElementById('global-player-bar');
    if (!el) {
      el = document.createElement('div');
      el.id = 'global-player-bar';
      el.className = 'fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white shadow-2xl transition-transform duration-300 translate-y-full';
      document.body.appendChild(el);
    }

    MediaPlayer.subscribe((state) => {
      this.latestState = state;
      this.render(state);
    });
  }

  render(state) {
    const el = document.getElementById('global-player-bar');
    if (!el) return;

    if (!state.currentArtifact) {
      el.classList.add('translate-y-full');
      this.renderedArtifactId = null;
      return;
    }
    el.classList.remove('translate-y-full');

    const art = state.currentArtifact;
    const currentLang = state.currentLang || this.getCurrentLang();

    // 1. Chỉ khởi tạo/tái cấu trúc HTML khung nếu đổi hiện vật hoặc đổi ngôn ngữ
    if (this.renderedArtifactId !== art.id || this.renderedLang !== currentLang) {
      this.buildSkeleton(el, state);
      this.renderedArtifactId = art.id;
      this.renderedLang = currentLang;
    }

    // 2. Cập nhật các thành phần động mà KHÔNG hủy DOM elements
    this.updateDynamicFields(el, state);
  }

  buildSkeleton(el, state) {
    const t = this.t;
    const art = state.currentArtifact;
    const currentLang = state.currentLang || this.getCurrentLang();
    const name = (art.name && (art.name[currentLang] || art.name.vi)) || 'Hiện vật';

    el.innerHTML = `
      <!-- Subtitle Floating Box (USC18) -->
      <div id="player-sub-box" class="absolute -top-12 inset-x-0 flex justify-center pointer-events-none transition-opacity duration-200 ${state.subtitlesEnabled && state.currentSubtitleText ? 'opacity-100' : 'opacity-0'}">
        <div id="player-sub-text" class="bg-black/85 text-amber-300 border border-amber-500/30 text-xs md:text-sm px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md max-w-xl text-center truncate">
          💬 ${state.currentSubtitleText || ''}
        </div>
      </div>

      <!-- Progress bar container -->
      <div class="w-full bg-slate-800 h-1.5 cursor-pointer relative group" id="player-progress-container">
        <div id="player-progress-fill" class="bg-amber-500 h-full relative" style="width: 0%">
          <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-300 rounded-full shadow opacity-0 group-hover:opacity-100 transition"></div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <!-- Artifact Thumbnail & Title -->
        <div class="flex items-center space-x-3 cursor-pointer min-w-0" id="player-artifact-info">
          <img src="${art.image}" class="w-12 h-12 rounded-lg object-cover border border-slate-700 shadow flex-shrink-0" alt="${name}">
          <div class="min-w-0">
            <h4 class="font-bold text-sm text-white truncate hover:text-amber-400 transition">${name}</h4>
            <p class="text-xs text-slate-400 truncate">${art.zone} • ${art.era}</p>
          </div>
        </div>

        <!-- Controls Central -->
        <div class="flex flex-col items-center">
          <div class="flex items-center space-x-4">
            <button type="button" id="player-rewind-btn" title="${t.rewindBtnTitle}" class="text-slate-400 hover:text-white p-2 transition">
              <svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"></path></svg>
            </button>

            <button type="button" id="player-play-btn" class="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 flex items-center justify-center font-bold shadow-lg transition">
              <span id="player-play-icon" class="pointer-events-none">
                <!-- Icon injected dynamically -->
              </span>
            </button>

            <button type="button" id="player-forward-btn" title="${t.forwardBtnTitle}" class="text-slate-400 hover:text-white p-2 transition">
              <svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"></path></svg>
            </button>
          </div>
          <div class="text-[11px] text-slate-400 mt-1 font-mono">
            <span id="player-time-current">00:00</span> / <span id="player-time-duration">00:00</span>
          </div>
        </div>

        <!-- Extra Tools: Speed, Subtitle -->
        <div class="flex items-center space-x-2 flex-shrink-0">
          <button type="button" id="player-speed-btn" class="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono" title="${t.playbackSpeedTitle}">
            ${state.playbackRate}x
          </button>

          <button type="button" id="player-sub-btn" class="text-xs px-2.5 py-1 rounded transition font-medium" title="${t.ccSubtitleTitle}">
            ${t.ccBtnText}
          </button>
        </div>
      </div>
    `;

    this.bindEvents(el);
  }

  bindEvents(el) {
    const playBtn = el.querySelector('#player-play-btn');
    if (playBtn) {
      playBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        MediaPlayer.togglePlay();
      };
    }

    const rewindBtn = el.querySelector('#player-rewind-btn');
    if (rewindBtn) {
      rewindBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const curr = this.latestState ? this.latestState.currentTime : 0;
        MediaPlayer.seek(curr - 10);
      };
    }

    const forwardBtn = el.querySelector('#player-forward-btn');
    if (forwardBtn) {
      forwardBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const curr = this.latestState ? this.latestState.currentTime : 0;
        MediaPlayer.seek(curr + 10);
      };
    }

    const progContainer = el.querySelector('#player-progress-container');
    if (progContainer) {
      progContainer.onclick = (e) => {
        const rect = progContainer.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const dur = (this.latestState && this.latestState.duration) || 1;
        MediaPlayer.seek(pos * dur);
      };
    }

    const speedBtn = el.querySelector('#player-speed-btn');
    if (speedBtn) {
      speedBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentRate = (this.latestState && this.latestState.playbackRate) || 1.0;
        const rates = [1.0, 1.25, 1.5, 0.75];
        const nextIdx = (rates.indexOf(currentRate) + 1) % rates.length;
        MediaPlayer.setPlaybackRate(rates[nextIdx]);
      };
    }

    const subBtn = el.querySelector('#player-sub-btn');
    if (subBtn) {
      subBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        MediaPlayer.toggleSubtitles();
      };
    }

    const info = el.querySelector('#player-artifact-info');
    if (info && this.onOpenDetail) {
      info.onclick = () => {
        if (this.latestState && this.latestState.currentArtifact) {
          this.onOpenDetail(this.latestState.currentArtifact);
        }
      };
    }
  }

  updateDynamicFields(el, state) {
    // 1. Play / Pause icon
    const iconContainer = el.querySelector('#player-play-icon');
    if (iconContainer) {
      if (state.isPlaying) {
        iconContainer.innerHTML = `<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>`;
      } else {
        iconContainer.innerHTML = `<svg class="w-5 h-5 ml-0.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
      }
    }

    // 2. Progress fill
    const fill = el.querySelector('#player-progress-fill');
    if (fill) {
      const dur = state.duration || 1;
      const pct = Math.max(0, Math.min(100, (state.currentTime / dur) * 100));
      fill.style.width = `${pct}%`;
    }

    // 3. Time labels
    const curTime = el.querySelector('#player-time-current');
    if (curTime) curTime.textContent = this.formatTime(state.currentTime);

    const durTime = el.querySelector('#player-time-duration');
    if (durTime) durTime.textContent = this.formatTime(state.duration);

    // 4. Subtitle floating box
    const subBox = el.querySelector('#player-sub-box');
    const subText = el.querySelector('#player-sub-text');
    if (subBox && subText) {
      if (state.subtitlesEnabled && state.currentSubtitleText) {
        subText.textContent = `💬 ${state.currentSubtitleText}`;
        subBox.classList.remove('opacity-0');
        subBox.classList.add('opacity-100');
      } else {
        subBox.classList.remove('opacity-100');
        subBox.classList.add('opacity-0');
      }
    }

    // 5. Speed label
    const speedBtn = el.querySelector('#player-speed-btn');
    if (speedBtn) speedBtn.textContent = `${state.playbackRate}x`;

    // 6. Subtitle toggle button style
    const subBtn = el.querySelector('#player-sub-btn');
    if (subBtn) {
      if (state.subtitlesEnabled) {
        subBtn.className = 'text-xs px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-medium transition';
      } else {
        subBtn.className = 'text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white font-medium transition';
      }
    }
  }
}

// === FILE: frontend/src/components/AdminDashboard.js ===
/**
 * AdminDashboard - Màn hình Quản trị viên (Admin)
 * Hỗ trợ USC07, USC08, USC09, USC10, USC11 và đa ngôn ngữ I18n
 */
class AdminDashboard {
  constructor(onRefresh, getCurrentLang) {
    this.onRefresh = onRefresh;
    this.getCurrentLang = getCurrentLang || (() => 'vi');
    this.currentTab = 'artifacts'; // 'artifacts' | 'analytics'
  }

  get t() {
    return getI18n(this.getCurrentLang());
  }

  render(container) {
    const t = this.t;

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Admin Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div class="flex items-center space-x-3">
              <span class="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </span>
              <div>
                <h1 class="text-2xl font-bold text-white">${t.adminTitle}</h1>
                <p class="text-xs text-slate-400">${t.adminSubtitle}</p>
              </div>
            </div>
          </div>

          <!-- Tab buttons -->
          <div class="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <button id="tab-btn-artifacts" class="px-4 py-2 text-xs font-semibold rounded-lg transition ${this.currentTab === 'artifacts' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}">
              ${t.tabArtifacts}
            </button>
            <button id="tab-btn-analytics" class="px-4 py-2 text-xs font-semibold rounded-lg transition ${this.currentTab === 'analytics' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}">
              ${t.tabAnalytics}
            </button>
          </div>
        </div>

        <div id="admin-tab-content" class="mt-6">
          ${this.currentTab === 'artifacts' ? this.renderArtifactsTab() : this.renderAnalyticsTab()}
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  renderArtifactsTab() {
    const t = this.t;
    const currentLang = this.getCurrentLang();

    return `
      <div>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-bold text-white">${t.adminArtifactListTitle(mockDB.artifacts.length)}</h2>
          <button id="admin-add-artifact-btn" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            <span>${t.btnAddArtifact}</span>
          </button>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
              <thead class="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th class="px-4 py-3">${t.colCodeAndImg}</th>
                  <th class="px-4 py-3">${t.colArtifactName}</th>
                  <th class="px-4 py-3">${t.colZoneEra}</th>
                  <th class="px-4 py-3 text-center">${t.colListens}</th>
                  <th class="px-4 py-3 text-center">${t.colQRCode}</th>
                  <th class="px-4 py-3 text-right">${t.colActions}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 text-xs">
                ${mockDB.artifacts.map(art => {
                  const nameInLang = art.name[currentLang] || art.name.vi;
                  return `
                    <tr class="hover:bg-slate-800/50 transition">
                      <td class="px-4 py-3 flex items-center space-x-3">
                        <img src="${art.image}" class="w-10 h-10 rounded-lg object-cover border border-slate-700" alt="">
                        <div>
                          <span class="font-mono text-[11px] text-amber-400 font-bold">${art.code}</span>
                          <p class="text-[10px] text-slate-500">${art.id}</p>
                        </div>
                      </td>
                      <td class="px-4 py-3 font-semibold text-white">
                        ${nameInLang}
                        <p class="text-[11px] font-normal text-slate-400">${art.name.en || ''}</p>
                      </td>
                      <td class="px-4 py-3">
                        <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">${art.zone}</span>
                        <p class="text-[11px] text-slate-400 mt-1">${art.era}</p>
                      </td>
                      <td class="px-4 py-3 text-center font-mono font-bold text-amber-400">
                        🎧 ${art.listenCount.toLocaleString()}
                      </td>
                      <td class="px-4 py-3 text-center">
                        <a href="${art.qrCodeUrl}" target="_blank" class="inline-block p-1 bg-white rounded border hover:scale-110 transition" title="QR">
                          <img src="${art.qrCodeUrl}" class="w-7 h-7" alt="QR">
                        </a>
                      </td>
                      <td class="px-4 py-3 text-right space-x-1">
                        <button data-delete-id="${art.id}" class="delete-art-btn text-xs px-2.5 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition border border-red-500/20">
                          ${t.btnDelete}
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderAnalyticsTab() {
    const t = this.t;
    const { analytics } = mockDB;

    return `
      <div class="space-y-6">
        <!-- Metric Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
            <span class="text-xs text-slate-400 uppercase font-semibold">${t.statTotalListeners}</span>
            <div class="text-3xl font-extrabold text-amber-400 mt-2 font-mono">${analytics.totalListeners.toLocaleString()}</div>
            <p class="text-xs text-emerald-400 mt-1">${t.statGrowth}</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
            <span class="text-xs text-slate-400 uppercase font-semibold">${t.statStreamingTime}</span>
            <div class="text-3xl font-extrabold text-cyan-400 mt-2 font-mono">${(analytics.totalMinutesStreamed / 60).toFixed(0)} ${t.statHours}</div>
            <p class="text-xs text-slate-400 mt-1">AudioStreamer / I_Audio</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
            <span class="text-xs text-slate-400 uppercase font-semibold">${t.statActiveArtifacts}</span>
            <div class="text-3xl font-extrabold text-white mt-2 font-mono">${mockDB.artifacts.length}</div>
            <p class="text-xs text-amber-400 mt-1">${t.statActiveNote}</p>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Top Artifacts Bar Chart -->
          <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 class="text-sm font-bold text-white mb-4">${t.topArtifactsTitle}</h3>
            <div class="space-y-4">
              ${analytics.topArtifacts.map(item => `
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-slate-300 font-medium">${item.name}</span>
                    <span class="text-amber-400 font-bold font-mono">${item.listens} (${item.percent}%)</span>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-2">
                    <div class="bg-amber-500 h-2 rounded-full" style="width: ${item.percent}%"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Weekly Trend -->
          <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <h3 class="text-sm font-bold text-white mb-4">${t.weeklyTrendTitle}</h3>
            <div class="flex items-end justify-between h-44 pt-6 px-2">
              ${analytics.dailyTrends.map(d => {
                const heightPercent = (d.listens / 3500) * 100;
                const dayLabel = t.days[d.day] || d.day;
                return `
                  <div class="flex flex-col items-center flex-1">
                    <div class="w-7 bg-amber-500/80 hover:bg-amber-400 rounded-t-md transition relative group" style="height: ${heightPercent}%">
                      <span class="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-[10px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none font-mono">
                        ${d.listens}
                      </span>
                    </div>
                    <span class="text-[11px] text-slate-400 mt-2 font-semibold">${dayLabel}</span>
                  </div>
                `;
              }).join('')}
            </div>
            <div class="text-right mt-4">
              <button id="admin-export-btn" class="text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-lg border border-slate-700 transition">
                ${t.btnExportReport}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents(container) {
    const tabArt = container.querySelector('#tab-btn-artifacts');
    const tabAna = container.querySelector('#tab-btn-analytics');

    if (tabArt) {
      tabArt.onclick = () => {
        this.currentTab = 'artifacts';
        this.render(container);
      };
    }

    if (tabAna) {
      tabAna.onclick = () => {
        this.currentTab = 'analytics';
        this.render(container);
      };
    }

    const exportBtn = container.querySelector('#admin-export-btn');
    if (exportBtn) {
      exportBtn.onclick = () => alert(this.t.exportReportSuccess);
    }

    // Delete artifact
    container.querySelectorAll('.delete-art-btn').forEach(btn => {
      btn.onclick = async () => {
        const id = btn.getAttribute('data-delete-id');
        if (confirm(this.t.confirmDelete(id))) {
          await ArtifactServiceInstance.deleteArtifact(id);
          this.render(container);
          if (this.onRefresh) this.onRefresh();
        }
      };
    });

    // Add artifact
    const addBtn = container.querySelector('#admin-add-artifact-btn');
    if (addBtn) {
      addBtn.onclick = () => {
        const titleVi = prompt('Tên Hiện Vật / Artifact Name:', 'Nồi Gốm Hoa Nâu');
        if (!titleVi) return;
        const era = prompt('Niên đại / Era:', 'Thế kỷ XIII - XIV');
        const zone = prompt('Khu vực trưng bày / Gallery Zone:', 'Khu B');

        ArtifactServiceInstance.createArtifact({
          name: { vi: titleVi, en: titleVi, fr: titleVi, ja: titleVi, zh: titleVi },
          era: era || 'Thời kỳ Cổ Trung đại',
          zone: zone || 'Khu A',
          description: { vi: `Hiện vật di sản quý giá: ${titleVi}` }
        }).then(() => {
          alert('Thêm hiện vật thành công! / Created successfully!');
          this.render(container);
          if (this.onRefresh) this.onRefresh();
        });
      };
    }
  }
}

// === FILE: frontend/src/app.js ===
/**
 * App.js - Single-Page Application Central Controller (GUI.spa)
 * Điều phối Router, Navbar, Trang chủ, Trang chi tiết hiện vật, Yêu thích, Sơ đồ và Auth
 * ĐÃ TÍCH HỢP HOÀN CHỈNH ĐA NGÔN NGỮ (I18N) TOÀN DIỆN CHO TẤT CẢ GIAO DIỆN
 */
class AppController {
  constructor() {
    this.currentLang = localStorage.getItem('museum_preferred_lang') || 'vi'; // USC05
    this.currentView = 'home'; // 'home' | 'detail' | 'favorites' | 'admin' | 'map'
    this.selectedArtifact = null;
    this.searchKeyword = '';

    this.qrScanner = new QRScannerModal(
      (artifact) => this.navigateToDetail(artifact),
      (err) => console.error(err),
      () => this.currentLang
    );

    this.authModal = new AuthModal(
      (session) => {
        if (session && session.defaultLang && session.defaultLang !== this.currentLang) {
          this.changeLanguage(session.defaultLang);
        }
        this.render();
        if (session && session.role === 'admin') {
          this.currentView = 'admin';
          this.render();
        }
      },
      () => this.currentLang
    );

    this.playerBar = new PlayerBar(
      (artifact) => this.navigateToDetail(artifact),
      () => this.currentLang
    );

    this.adminDashboard = new AdminDashboard(
      () => this.render(),
      () => this.currentLang
    );

    // Lắng nghe thay đổi auth
    ClientSession.subscribe(() => {
      this.renderNavbar();
    });

    // Lắng nghe thay đổi MediaPlayer để đồng bộ trạng thái nút Play/Pause trên view
    MediaPlayer.subscribe((state) => {
      this.syncPlayButtons(state);
    });
  }

  syncPlayButtons(state) {
    const isPlaying = state.isPlaying;
    const currentId = state.currentArtifact ? state.currentArtifact.id : null;
    const t = this.t;

    // 1. Đồng bộ nút trong trang Chi tiết (Detail View)
    const detailBtn = document.getElementById('detail-play-btn');
    if (detailBtn && this.selectedArtifact) {
      if (currentId === this.selectedArtifact.id && isPlaying) {
        detailBtn.innerHTML = `
          <svg class="w-5 h-5 fill-current pointer-events-none" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
          <span class="pointer-events-none">${t.btnPauseAudio || 'Tạm Dừng Thuyết Minh'}</span>
        `;
        detailBtn.className = 'w-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg transition';
      } else {
        detailBtn.innerHTML = `
          <svg class="w-5 h-5 fill-current pointer-events-none" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <span class="pointer-events-none">${t.btnStartAudio || 'Bắt Đầu Phát Thuyết Minh'}</span>
        `;
        detailBtn.className = 'w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg transition';
      }
    }

    // 2. Đồng bộ các nút trên Card hiện vật (Home & Favorites View)
    document.querySelectorAll('.play-audio-btn').forEach(btn => {
      const artId = btn.getAttribute('data-id');
      if (artId === currentId && isPlaying) {
        btn.innerHTML = `
          <svg class="w-4 h-4 fill-current pointer-events-none" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
          <span class="pointer-events-none">${t.btnPauseShort || 'Tạm dừng'}</span>
        `;
        btn.className = 'play-audio-btn flex-1 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow transition';
      } else {
        btn.innerHTML = `
          <svg class="w-4 h-4 fill-current pointer-events-none" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <span class="pointer-events-none">${t.btnListenAudio || 'Nghe Thuyết Minh'}</span>
        `;
        btn.className = 'play-audio-btn flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow transition';
      }
    });
  }

  get t() {
    return getI18n(this.currentLang);
  }

  init() {
    this.render();
  }

  // Đổi ngôn ngữ toàn bộ hệ thống (USC05)
  changeLanguage(newLang) {
    this.currentLang = newLang;
    localStorage.setItem('museum_preferred_lang', newLang);
    MediaPlayer.changeLanguage(newLang);
    this.render();
  }

  navigateToDetail(artifact) {
    this.selectedArtifact = artifact;
    this.currentView = 'detail';
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  render() {
    const root = document.getElementById('app-root');
    const t = this.t;

    root.innerHTML = `
      <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-28">
        <!-- Navigation Bar -->
        <header id="navbar-container" class="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800"></header>

        <!-- Main Dynamic View Container -->
        <main id="main-content" class="flex-1"></main>

        <!-- Footer -->
        <footer class="bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-500">
          <p>${t.footerCopyright}</p>
          <p class="mt-1">${t.footerArchitecture}</p>
        </footer>
      </div>
    `;

    this.renderNavbar();
    this.renderMainContent();
  }

  renderNavbar() {
    const nav = document.getElementById('navbar-container');
    const user = ClientSession.getUser();
    const isAuth = !!user;
    const isAdmin = user && user.role === 'admin';
    const t = this.t;

    nav.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <!-- Brand / Logo -->
        <div class="flex items-center space-x-3 cursor-pointer" id="nav-brand-logo">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
            🏛️
          </div>
          <div>
            <span class="font-extrabold text-base tracking-wide text-white">${t.brandTitle}</span>
            <span class="block text-[10px] text-amber-400 font-medium">${t.brandSubtitle}</span>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-6 text-sm font-medium">
          <button id="nav-btn-home" class="hover:text-amber-400 transition ${this.currentView === 'home' ? 'text-amber-400' : 'text-slate-300'}">
            ${t.navHome}
          </button>
          <button id="nav-btn-fav" class="hover:text-amber-400 transition flex items-center space-x-1 ${this.currentView === 'favorites' ? 'text-amber-400' : 'text-slate-300'}">
            <span>${t.navFavorites}</span>
            ${user && user.favorites ? `<span class="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.2 rounded-full font-mono">${user.favorites.length}</span>` : ''}
          </button>
          <button id="nav-btn-map" class="hover:text-amber-400 transition ${this.currentView === 'map' ? 'text-amber-400' : 'text-slate-300'}">
            ${t.navMuseumMap}
          </button>
          ${isAdmin ? `
            <button id="nav-btn-admin" class="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 font-bold transition">
              ${t.navAdminPanel}
            </button>
          ` : ''}
        </div>

        <!-- Actions: QR Scan, Language, Auth -->
        <div class="flex items-center space-x-3">
          <!-- QR Scanner Trigger (USC03) -->
          <button id="header-scan-qr-btn" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
            <span class="hidden sm:inline">${t.btnScanQR}</span>
          </button>

          <!-- Language Selector (USC05) -->
          <div class="relative">
            <select id="header-lang-select" class="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer">
              ${mockDB.languages.map(l => `
                <option value="${l.code}" ${this.currentLang === l.code ? 'selected' : ''}>${l.flag} ${l.name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Auth Button (USC01, USC02, USC16) -->
          ${isAuth ? `
            <div class="flex items-center space-x-2">
              <span class="text-xs text-slate-300 hidden sm:inline">${t.greeting}, <b class="text-amber-400">${user.fullName.split(' ').slice(-1)[0]}</b></span>
              <button id="header-logout-btn" title="${t.btnLogout}" class="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition border border-slate-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              </button>
            </div>
          ` : `
            <button id="header-login-btn" class="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition">
              ${t.btnLogin}
            </button>
          `}
        </div>
      </div>
    `;

    this.bindNavbarEvents(nav);
  }

  bindNavbarEvents(nav) {
    nav.querySelector('#nav-brand-logo').onclick = () => {
      this.currentView = 'home';
      this.render();
    };

    const btnHome = nav.querySelector('#nav-btn-home');
    if (btnHome) btnHome.onclick = () => { this.currentView = 'home'; this.render(); };

    const btnFav = nav.querySelector('#nav-btn-fav');
    if (btnFav) {
      btnFav.onclick = () => {
        if (!ClientSession.isAuthenticated()) {
          this.authModal.open('login');
          return;
        }
        this.currentView = 'favorites';
        this.render();
      };
    }

    const btnMap = nav.querySelector('#nav-btn-map');
    if (btnMap) btnMap.onclick = () => { this.currentView = 'map'; this.render(); };

    const btnAdmin = nav.querySelector('#nav-btn-admin');
    if (btnAdmin) btnAdmin.onclick = () => { this.currentView = 'admin'; this.render(); };

    // Scanner
    nav.querySelector('#header-scan-qr-btn').onclick = () => this.qrScanner.open();

    // Language Change (USC05)
    nav.querySelector('#header-lang-select').onchange = (e) => {
      this.changeLanguage(e.target.value);
    };

    // Login & Logout
    const loginBtn = nav.querySelector('#header-login-btn');
    if (loginBtn) loginBtn.onclick = () => this.authModal.open('login');

    const logoutBtn = nav.querySelector('#header-logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        if (confirm(this.t.confirmLogout)) {
          ClientSession.logout();
          this.currentView = 'home';
          this.render();
        }
      };
    }
  }

  renderMainContent() {
    const main = document.getElementById('main-content');
    if (this.currentView === 'home') {
      this.renderHomeView(main);
    } else if (this.currentView === 'detail') {
      this.renderDetailView(main);
    } else if (this.currentView === 'favorites') {
      this.renderFavoritesView(main);
    } else if (this.currentView === 'map') {
      this.renderMapView(main);
    } else if (this.currentView === 'admin') {
      this.adminDashboard.render(main);
    }
  }

  // ==================== TRANG CHỦ (HOME VIEW) ====================
  renderHomeView(container) {
    const artifacts = mockDB.artifacts;
    const t = this.t;

    container.innerHTML = `
      <!-- Hero Banner -->
      <section class="relative bg-gradient-to-b from-slate-900 to-slate-950 py-16 px-4 border-b border-slate-800">
        <div class="max-w-5xl mx-auto text-center">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-4">
            ${t.badgeSmartGuide}
          </span>
          <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            ${t.heroTitleMain} <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500">${t.heroTitleHighlight}</span>
          </h1>
          <p class="mt-4 text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
            ${t.heroDescription}
          </p>

          <!-- Search input (USC15) -->
          <div class="mt-8 max-w-xl mx-auto flex gap-2">
            <div class="relative flex-1">
              <input type="text" id="home-search-input" value="${this.searchKeyword}" placeholder="${t.searchPlaceholder}"
                class="w-full bg-slate-800/90 border border-slate-700 text-sm rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner">
              <svg class="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <button id="home-scan-btn" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm flex items-center space-x-2 shadow-lg transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
              <span>${t.btnScanHero}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Artifacts List Grid -->
      <section class="max-w-7xl mx-auto px-4 py-12">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-xl md:text-2xl font-bold text-white">${t.sectionArtifactsTitle}</h2>
            <p class="text-xs text-slate-400">${t.sectionArtifactsSubtitle}</p>
          </div>
          <span class="text-xs text-amber-400 font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            ${t.showingArtifactsCount(artifacts.length)}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="artifacts-grid">
          ${this.renderArtifactsGrid(artifacts)}
        </div>
      </section>
    `;

    // Events
    const searchInput = container.querySelector('#home-search-input');
    searchInput.oninput = async (e) => {
      this.searchKeyword = e.target.value;
      const filtered = await ArtifactServiceInstance.searchArtifacts(this.searchKeyword, this.currentLang);
      const grid = container.querySelector('#artifacts-grid');
      grid.innerHTML = this.renderArtifactsGrid(filtered);
      this.bindArtifactCardEvents(grid);
    };

    container.querySelector('#home-scan-btn').onclick = () => this.qrScanner.open();
    this.bindArtifactCardEvents(container.querySelector('#artifacts-grid'));
  }

  renderArtifactsGrid(artifacts) {
    const t = this.t;

    if (!artifacts || artifacts.length === 0) {
      return `
        <div class="col-span-full py-16 text-center text-slate-400">
          <p class="text-base font-semibold">${t.noArtifactsFound}</p>
          <p class="text-xs text-slate-500 mt-1">${t.noArtifactsFoundDesc}</p>
        </div>
      `;
    }

    const user = ClientSession.getUser();
    const favs = (user && user.favorites) || [];

    return artifacts.map(art => {
      const name = art.name[this.currentLang] || art.name.en || art.name.vi;
      const desc = art.description[this.currentLang] || art.description.en || art.description.vi;
      const isFav = favs.includes(art.id);

      return `
        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/50 transition group flex flex-col">
          <!-- Image thumbnail with Zoom effect (USC13) -->
          <div class="relative h-52 overflow-hidden bg-slate-950 cursor-pointer card-img-click" data-id="${art.id}">
            <img src="${art.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="${name}">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            
            <!-- Zone badge -->
            <span class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-[11px] text-amber-400 px-2.5 py-1 rounded-full border border-slate-700 font-medium">
              ${art.zone}
            </span>

            <!-- Favorite button (USC06) -->
            <button class="favorite-toggle-btn absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:text-red-500 transition border border-slate-700" data-id="${art.id}">
              <svg class="w-4 h-4 ${isFav ? 'text-red-500 fill-current' : ''}" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span class="font-mono text-amber-500/90 font-bold">${art.code}</span>
                <span>🎧 ${art.listenCount} ${t.listensCount}</span>
              </div>
              <h3 class="font-bold text-base text-white group-hover:text-amber-400 transition line-clamp-1 cursor-pointer card-title-click" data-id="${art.id}">
                ${name}
              </h3>
              <p class="text-xs text-amber-300/80 mt-0.5">${art.era}</p>
              <p class="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                ${desc}
              </p>
            </div>

            <!-- Footer actions -->
            <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button class="play-audio-btn flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow transition" data-id="${art.id}">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span>${t.btnListenAudio}</span>
              </button>
              <button class="view-detail-btn bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-3 rounded-xl text-xs transition" data-id="${art.id}">
                ${t.btnDetail}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  bindArtifactCardEvents(container) {
    if (!container) return;

    // Click xem chi tiết
    container.querySelectorAll('.card-img-click, .card-title-click, .view-detail-btn').forEach(el => {
      el.onclick = () => {
        const id = el.getAttribute('data-id');
        const art = mockDB.artifacts.find(a => a.id === id);
        if (art) this.navigateToDetail(art);
      };
    });

    // Phát audio trực tiếp
    container.querySelectorAll('.play-audio-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        const art = mockDB.artifacts.find(a => a.id === id);
        if (art) {
          if (MediaPlayer.currentArtifact && MediaPlayer.currentArtifact.id === art.id) {
            MediaPlayer.togglePlay();
          } else {
            MediaPlayer.loadArtifact(art, this.currentLang);
            MediaPlayer.play();
          }
        }
      };
    });

    // Toggle yêu thích (USC06)
    container.querySelectorAll('.favorite-toggle-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        try {
          ClientSession.toggleFavorite(id);
          this.render();
        } catch (err) {
          alert(this.t.alertLoginToFav);
          this.authModal.open('login');
        }
      };
    });
  }

  // ==================== TRANG CHI TIẾT (DETAIL VIEW - USC12, USC13, USC04, USC18) ====================
  renderDetailView(container) {
    const art = this.selectedArtifact;
    const t = this.t;

    if (!art) {
      this.currentView = 'home';
      this.render();
      return;
    }

    const name = art.name[this.currentLang] || art.name.en || art.name.vi;
    const desc = art.description[this.currentLang] || art.description.en || art.description.vi;
    const user = ClientSession.getUser();
    const isFav = user && user.favorites && user.favorites.includes(art.id);

    container.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-8">
        <!-- Back button -->
        <button id="detail-back-btn" class="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-amber-400 mb-6 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span>${t.backToHome}</span>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
          <!-- Gallery & Image Zoom (USC13) -->
          <div>
            <div class="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shadow-inner group">
              <img id="detail-main-img" src="${art.image}" class="w-full h-80 md:h-96 object-cover hover:scale-105 transition duration-500 cursor-zoom-in" alt="${name}">
              <div class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-[11px] text-slate-300 px-3 py-1 rounded-full border border-slate-700 pointer-events-none">
                ${t.zoomHint}
              </div>
            </div>

            <!-- QR Code info badge (USC08) -->
            <div class="mt-4 p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <img src="${art.qrCodeUrl}" class="w-12 h-12 bg-white p-1 rounded-lg border border-slate-700" alt="QR Code">
                <div>
                  <span class="text-xs font-bold text-white">${t.qrBadgeTitle}</span>
                  <p class="text-[11px] text-slate-400 font-mono">${art.code}</p>
                </div>
              </div>
              <a href="${art.qrCodeUrl}" download="${art.code}.png" target="_blank" class="text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-lg border border-slate-700 transition">
                ${t.btnDownloadQR}
              </a>
            </div>
          </div>

          <!-- Info & Controls (USC12, USC04, USC18) -->
          <div class="flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  ${art.category}
                </span>
                <button id="detail-fav-btn" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700">
                  <svg class="w-5 h-5 ${isFav ? 'text-red-500 fill-current' : ''}" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </button>
              </div>

              <h1 class="text-2xl md:text-3xl font-black text-white mt-3">${name}</h1>
              <p class="text-xs text-amber-400 font-medium mt-1 font-mono">${t.locationLabel} ${art.zone} • ${t.eraLabel} ${art.era}</p>

              <!-- Audio Player Box Inline (USC04) -->
              <div class="mt-6 p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-amber-500/30 shadow-lg">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                    <span class="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                    <span>${t.audioStreamingTitle}</span>
                  </span>
                  <span class="text-[11px] text-slate-400 font-mono">${t.audioMultiLang}</span>
                </div>

                <button id="detail-play-btn" class="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg transition">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  <span>${t.btnStartAudio}</span>
                </button>
              </div>

              <!-- Full Text Description (USC12) -->
              <div class="mt-6">
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">${t.historyInfoTitle}</h3>
                <p class="text-sm text-slate-300 leading-relaxed text-justify">
                  ${desc}
                </p>
              </div>
            </div>

            <div class="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
              <span>${t.storageInfo}</span>
              <span>${t.totalListens} <b>${art.listenCount}</b></span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Events
    container.querySelector('#detail-back-btn').onclick = () => {
      this.currentView = 'home';
      this.render();
    };

    container.querySelector('#detail-play-btn').onclick = () => {
      if (MediaPlayer.currentArtifact && MediaPlayer.currentArtifact.id === art.id) {
        MediaPlayer.togglePlay();
      } else {
        MediaPlayer.loadArtifact(art, this.currentLang);
        MediaPlayer.play();
      }
    };

    container.querySelector('#detail-fav-btn').onclick = () => {
      try {
        ClientSession.toggleFavorite(art.id);
        this.render();
      } catch (err) {
        alert(this.t.alertLoginToFav);
        this.authModal.open('login');
      }
    };
  }

  // ==================== DANH SÁCH YÊU THÍCH (FAVORITES - USC06) ====================
  renderFavoritesView(container) {
    const user = ClientSession.getUser();
    const favIds = (user && user.favorites) || [];
    const favArtifacts = mockDB.artifacts.filter(a => favIds.includes(a.id));
    const t = this.t;

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-white flex items-center space-x-2">
            <span>${t.favTitle}</span>
          </h1>
          <p class="text-xs text-slate-400 mt-1">${t.favSubtitle}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="fav-grid">
          ${this.renderArtifactsGrid(favArtifacts)}
        </div>
      </div>
    `;

    this.bindArtifactCardEvents(container.querySelector('#fav-grid'));
  }

  // ==================== SƠ ĐỒ BẢO TÀNG (MAP VIEW - USC11, USC14) ====================
  renderMapView(container) {
    const { museumProfile } = mockDB;
    const t = this.t;

    container.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-8">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-white">${t.mapTitle}</h1>
          <p class="text-xs text-slate-400 mt-1">${museumProfile.name}</p>
        </div>

        <!-- Museum Profile Card -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <span class="text-slate-400 font-semibold block mb-1">${t.addressLabel}</span>
              <p class="text-slate-200 font-medium">${museumProfile.address}</p>
            </div>
            <div>
              <span class="text-slate-400 font-semibold block mb-1">${t.openingHoursLabel}</span>
              <p class="text-slate-200 font-medium">${museumProfile.openingHours}</p>
            </div>
            <div>
              <span class="text-slate-400 font-semibold block mb-1">${t.ticketPriceLabel}</span>
              <p class="text-slate-200 font-medium">${museumProfile.ticketPrice}</p>
            </div>
          </div>
          <p class="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
            ${museumProfile.overview}
          </p>
        </div>

        <!-- Interactive Map Floor Plan -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 class="text-sm font-bold text-white mb-4">${t.interactiveMapTitle}</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${museumProfile.zones.map(z => `
              <div class="bg-slate-950 border border-slate-800 hover:border-amber-500 rounded-xl p-5 transition cursor-pointer group">
                <span class="text-xs font-mono font-bold text-amber-400">${z.name}</span>
                <h4 class="font-bold text-white text-base mt-1 group-hover:text-amber-400 transition">${z.title}</h4>
                <p class="text-xs text-slate-400 mt-2">${t.artifactsWithQrCount(z.artifactCount)}</p>
                <button class="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-xs font-bold py-2 rounded-lg text-slate-200 transition">
                  ${t.btnExploreZone}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
}

// Khởi chạy App khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
  const app = new AppController();
  app.init();
});

// Khởi chạy App khi trang tải xong
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new AppController();
    app.init();
  });
} else {
  const app = new AppController();
  app.init();
}