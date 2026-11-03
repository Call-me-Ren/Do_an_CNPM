/**
 * Thêm các khóa i18n cho tính năng theo dõi vị trí (USC14) vào src/locales/i18n.ts.
 * Chèn ngay sau dòng `scanQR:` của từng ngôn ngữ. Chạy một lần: node scripts/add_tracking_i18n.cjs
 */
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'locales', 'i18n.ts');
let src = fs.readFileSync(file, 'utf8');

if (src.includes('trackStart:')) {
  console.log('Keys already present, skipping.');
  process.exit(0);
}

const T = {
  vi: {
    trackStart: 'Bật theo dõi vị trí',
    trackStop: 'Dừng theo dõi',
    trackSearching: 'Đang xác định vị trí...',
    trackActive: 'Đang theo dõi vị trí',
    trackDenied: 'Không thể theo dõi vị trí. Hãy cấp quyền định vị hoặc quét mã QR gần nhất.',
    trackUnavailable: 'Thiết bị không hỗ trợ định vị. Hãy quét mã QR hoặc dùng chức năng Tìm kiếm.',
    trackLowAccuracy: 'Vị trí chưa chính xác, hãy quét mã QR gần nhất để hiệu chỉnh.',
    trackNoData: 'Không tải được dữ liệu khu trưng bày. Hãy quét mã QR thủ công hoặc dùng Tìm kiếm.',
    trackEnabledByQr: 'Đã bật theo dõi vị trí. Khi bạn đến gần hiện vật khác, thuyết minh sẽ tự động mở.',
    nearYou: 'Gần bạn',
    youAreHere: 'Bạn đang ở đây',
    noNearby: 'Chưa phát hiện hiện vật nào gần bạn.',
    suggestSwitch: 'Bạn đang đến gần "{{name}}". Chuyển sang nghe?',
    suggestReplay: 'Bạn đã nghe "{{name}}" rồi. Nghe lại?',
    switchNow: 'Chuyển sang',
    replayNow: 'Nghe lại',
    dismiss: 'Bỏ qua',
  },
  en: {
    trackStart: 'Enable location tracking',
    trackStop: 'Stop tracking',
    trackSearching: 'Locating you...',
    trackActive: 'Tracking your location',
    trackDenied: 'Unable to track your location. Please allow location access or scan the nearest QR code.',
    trackUnavailable: 'Location is not supported on this device. Please scan a QR code or use Search.',
    trackLowAccuracy: 'Location is not accurate enough. Scan the nearest QR code to recalibrate.',
    trackNoData: 'Could not load exhibition data. Please scan a QR code manually or use Search.',
    trackEnabledByQr: 'Location tracking is on. The audio guide opens automatically when you approach another exhibit.',
    nearYou: 'Near you',
    youAreHere: 'You are here',
    noNearby: 'No exhibits detected near you yet.',
    suggestSwitch: 'You are approaching "{{name}}". Switch to it?',
    suggestReplay: 'You have already listened to "{{name}}". Listen again?',
    switchNow: 'Switch',
    replayNow: 'Listen again',
    dismiss: 'Dismiss',
  },
  zh: {
    trackStart: '开启位置跟踪',
    trackStop: '停止跟踪',
    trackSearching: '正在定位...',
    trackActive: '正在跟踪您的位置',
    trackDenied: '无法跟踪位置。请授予定位权限或扫描最近的二维码。',
    trackUnavailable: '此设备不支持定位。请扫描二维码或使用搜索功能。',
    trackLowAccuracy: '位置不够准确，请扫描最近的二维码进行校准。',
    trackNoData: '无法加载展区数据。请手动扫描二维码或使用搜索。',
    trackEnabledByQr: '已开启位置跟踪。当您靠近其他展品时，讲解将自动播放。',
    nearYou: '您附近',
    youAreHere: '您在这里',
    noNearby: '附近暂未发现展品。',
    suggestSwitch: '您正在靠近“{{name}}”。是否切换收听？',
    suggestReplay: '您已听过“{{name}}”。是否重新收听？',
    switchNow: '切换',
    replayNow: '重新收听',
    dismiss: '忽略',
  },
  ko: {
    trackStart: '위치 추적 켜기',
    trackStop: '추적 중지',
    trackSearching: '위치를 확인하는 중...',
    trackActive: '위치를 추적하는 중',
    trackDenied: '위치를 추적할 수 없습니다. 위치 권한을 허용하거나 가까운 QR 코드를 스캔하세요.',
    trackUnavailable: '이 기기는 위치 기능을 지원하지 않습니다. QR 코드를 스캔하거나 검색을 이용하세요.',
    trackLowAccuracy: '위치가 정확하지 않습니다. 가까운 QR 코드를 스캔하여 보정하세요.',
    trackNoData: '전시 데이터를 불러올 수 없습니다. QR 코드를 직접 스캔하거나 검색을 이용하세요.',
    trackEnabledByQr: '위치 추적이 켜졌습니다. 다른 유물에 가까워지면 해설이 자동으로 열립니다.',
    nearYou: '내 주변',
    youAreHere: '현재 위치',
    noNearby: '근처에서 감지된 유물이 없습니다.',
    suggestSwitch: '"{{name}}"에 가까워지고 있습니다. 전환하시겠습니까?',
    suggestReplay: '"{{name}}"을(를) 이미 들으셨습니다. 다시 들으시겠습니까?',
    switchNow: '전환',
    replayNow: '다시 듣기',
    dismiss: '닫기',
  },
  ja: {
    trackStart: '位置追跡をオンにする',
    trackStop: '追跡を停止',
    trackSearching: '位置を確認しています...',
    trackActive: '位置を追跡中',
    trackDenied: '位置を追跡できません。位置情報の許可を与えるか、最寄りのQRコードをスキャンしてください。',
    trackUnavailable: 'この端末は位置情報に対応していません。QRコードをスキャンするか検索をご利用ください。',
    trackLowAccuracy: '位置の精度が低いです。最寄りのQRコードをスキャンして補正してください。',
    trackNoData: '展示データを読み込めません。QRコードを手動でスキャンするか検索をご利用ください。',
    trackEnabledByQr: '位置追跡をオンにしました。他の展示品に近づくと音声ガイドが自動で開きます。',
    nearYou: '近くの展示品',
    youAreHere: '現在地',
    noNearby: '近くに展示品は見つかりません。',
    suggestSwitch: '「{{name}}」に近づいています。切り替えますか？',
    suggestReplay: '「{{name}}」はすでにお聴きになりました。もう一度聴きますか？',
    switchNow: '切り替える',
    replayNow: 'もう一度聴く',
    dismiss: '閉じる',
  },
};

const lines = src.split(/\r?\n/);
const eol = src.includes('\r\n') ? '\r\n' : '\n';
const out = [];
let currentLang = null;
lines.forEach((line) => {
  const langMatch = line.match(/^\s{2}(vi|en|zh|ko|ja):\s*\{/);
  if (langMatch) currentLang = langMatch[1];
  out.push(line);
  if (currentLang && /^\s*scanQR:/.test(line)) {
    Object.entries(T[currentLang]).forEach(([k, v]) => {
      out.push(`      ${k}: ${JSON.stringify(v)},`);
    });
  }
});
fs.writeFileSync(file, out.join(eol), 'utf8');
console.log('i18n keys added.');
