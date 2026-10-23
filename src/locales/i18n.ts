import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  vi: {
    translation: {
      appName: "Thuyết Minh Tự Động",
      selectLanguage: "Chọn ngôn ngữ của bạn",
      explore: "Khám phá",
      map: "Sơ đồ",
      favorites: "Yêu thích",
      museumInfo: "Thông tin",
      scanQR: "Quét mã QR",
      searchPlaceholder: "Tìm kiếm hiện vật, mã số...",
      listenGuide: "Nghe thuyết minh",
      stopListening: "Dừng nghe",
      subtitles: "Phụ đề",
      close: "Đóng",
      nearYou: "Hiện vật gần bạn",
      openHours: "Giờ mở cửa",
      hotline: "Đường dây nóng",
      address: "Địa chỉ",
      noResults: "Không tìm thấy hiện vật phù hợp",
      noFavorites: "Chưa có hiện vật yêu thích nào",
      adminPortal: "Cổng Quản Trị Viên",
      allFloors: "Tất cả các tầng",
      autoTrackingActive: "Tự động định vị hiện vật đang hoạt động",
      cameraPermissionNeeded: "Cần cấp quyền camera để quét mã QR",
      gpsPermissionNeeded: "Vui lòng cho phép quyền định vị để tự động kích hoạt bài thuyết minh khi đến gần hiện vật."
    }
  },
  en: {
    translation: {
      appName: "Smart Audio Guide",
      selectLanguage: "Select your language",
      explore: "Explore",
      map: "Floor Map",
      favorites: "Favorites",
      museumInfo: "Info",
      scanQR: "Scan QR",
      searchPlaceholder: "Search artifacts, code...",
      listenGuide: "Listen to Guide",
      stopListening: "Stop",
      subtitles: "Subtitles",
      close: "Close",
      nearYou: "Artifacts near you",
      openHours: "Opening Hours",
      hotline: "Hotline",
      address: "Address",
      noResults: "No matching artifacts found",
      noFavorites: "No favorites added yet",
      adminPortal: "Admin Portal",
      allFloors: "All Floors",
      autoTrackingActive: "Auto-detecting nearby artifacts is active",
      cameraPermissionNeeded: "Camera permission is required to scan QR codes",
      gpsPermissionNeeded: "Please grant location permission to automatically trigger narration when approaching exhibits."
    }
  },
  zh: {
    translation: {
      appName: "多语言自动导览系统",
      selectLanguage: "选择您的语言",
      explore: "探索",
      map: "导览地图",
      favorites: "我的收藏",
      museumInfo: "展馆信息",
      scanQR: "扫描二维码",
      searchPlaceholder: "搜索文物、编号...",
      listenGuide: "收听语音导览",
      stopListening: "停止播放",
      subtitles: "字幕",
      close: "关闭",
      nearYou: "您附近的展品",
      openHours: "开放时间",
      hotline: "服务热线",
      address: "地址",
      noResults: "未找到匹配展品",
      noFavorites: "暂无收藏展品",
      adminPortal: "管理员平台",
      allFloors: "所有楼层",
      autoTrackingActive: "展品智能感应已开启",
      cameraPermissionNeeded: "需要相机权限以扫描二维码",
      gpsPermissionNeeded: "请开启定位权限，以便在走近文物时自动播放导览。"
    }
  },
  ko: {
    translation: {
      appName: "스마트 오디오 가이드",
      selectLanguage: "언어를 선택하세요",
      explore: "탐색",
      map: "안내도",
      favorites: "즐겨찾기",
      museumInfo: "박물관 안내",
      scanQR: "QR 스캔",
      searchPlaceholder: "유물 또는 코드 검색...",
      listenGuide: "오디오 가이드 듣기",
      stopListening: "중지",
      subtitles: "자막",
      close: "닫기",
      nearYou: "가까운 유물",
      openHours: "관람 시간",
      hotline: "문의 전화",
      address: "주소",
      noResults: "검색 결과가 없습니다",
      noFavorites: "즐겨찾기한 유물이 없습니다",
      adminPortal: "관리자 포털",
      allFloors: "모든 층",
      autoTrackingActive: "주변 유물 자동 감지 중",
      cameraPermissionNeeded: "QR 코드를 스캔하려면 카메라 권한이 필요합니다",
      gpsPermissionNeeded: "전시품에 접근할 때 자동으로 해설을 들으려면 위치 권한을 허용해 주세요."
    }
  },
  ja: {
    translation: {
      appName: "スマート音声ガイド",
      selectLanguage: "言語を選択してください",
      explore: "展示を探す",
      map: "フロアマップ",
      favorites: "お気に入り",
      museumInfo: "施設情報",
      scanQR: "QRスキャン",
      searchPlaceholder: "展示品やコードを検索...",
      listenGuide: "音声ガイドを聴く",
      stopListening: "停止",
      subtitles: "字幕",
      close: "閉じる",
      nearYou: "近くの展示品",
      openHours: "開館時間",
      hotline: "お問い合わせ",
      address: "所在地",
      noResults: "該当する展示品が見つかりません",
      noFavorites: "お気に入りはまだありません",
      adminPortal: "管理者ポータル",
      allFloors: "全フロア",
      autoTrackingActive: "展示品自動検出が有効です",
      cameraPermissionNeeded: "QRコードをスキャンするにはカメラの許可が必要です",
      gpsPermissionNeeded: "展示物に近づいた際に自動で解説を再生するため、位置情報を許可してください。"
    }
  }
};

const savedLang = localStorage.getItem('preferred_lang') || 'vi';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang,
  fallbackLng: 'vi',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
