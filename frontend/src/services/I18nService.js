/**
 * I18n Translations Dictionary cho Hệ Thống Thuyết Minh Tự Động Đa Ngôn Ngữ
 * Hỗ trợ chuyển đổi toàn bộ giao diện sang: Tiếng Việt (vi), English (en), Français (fr), 日本語 (ja), 中文 (zh)
 * Tương ứng Use Case: USC05 (Chuyển Đổi Ngôn Ngữ)
 */

export const translations = {
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
export function getI18n(lang = 'vi') {
  return translations[lang] || translations['vi'];
}
