const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'public', 'qr', 'museum_portal_qr.png');
const targetDir = path.dirname(targetPath);
fs.mkdirSync(targetDir, { recursive: true });

QRCode.toFile(
  targetPath,
  'https://call-me-ren.github.io/Do_an_CNPM/',
  {
    width: 600,
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    }
  },
  function (err) {
    if (err) throw err;
    console.log('Successfully generated public/qr/museum_portal_qr.png!');
  }
);
