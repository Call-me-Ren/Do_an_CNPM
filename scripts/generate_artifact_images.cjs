const fs = require('fs');
const path = require('path');

const artifactsDir = path.join(__dirname, '..', 'public', 'images', 'artifacts');
const museumDir = path.join(__dirname, '..', 'public', 'images', 'museum');

fs.mkdirSync(artifactsDir, { recursive: true });
fs.mkdirSync(museumDir, { recursive: true });

const artifacts = [
  {
    id: 'WRM001',
    code: 'TANK-M48',
    file: 'WRM001_tank.svg',
    name: 'Xe tăng M48A3 Patton',
    subtitle: '52-Ton Heavy Armor • 90mm Gun',
    theme: { bg1: '#1c281e', bg2: '#0d150e', accent: '#4ade80', tag: 'OUTDOOR ARMOR' },
    drawIcon: `
      <!-- TANK VECTOR -->
      <g transform="translate(160, 180) scale(1.2)">
        <!-- Tank Treads -->
        <rect x="40" y="160" width="320" height="45" rx="22" fill="#2d3748" stroke="#4a5568" stroke-width="4"/>
        <circle cx="70" cy="182" r="16" fill="#1a202c" stroke="#718096" stroke-width="3"/>
        <circle cx="120" cy="182" r="16" fill="#1a202c" stroke="#718096" stroke-width="3"/>
        <circle cx="170" cy="182" r="16" fill="#1a202c" stroke="#718096" stroke-width="3"/>
        <circle cx="220" cy="182" r="16" fill="#1a202c" stroke="#718096" stroke-width="3"/>
        <circle cx="270" cy="182" r="16" fill="#1a202c" stroke="#718096" stroke-width="3"/>
        <circle cx="320" cy="182" r="16" fill="#1a202c" stroke="#718096" stroke-width="3"/>
        <!-- Tank Hull -->
        <polygon points="50,160 350,160 330,110 90,110" fill="#3b4d3c" stroke="#243325" stroke-width="4"/>
        <!-- Turret -->
        <path d="M 130,110 Q 180,50 250,70 L 270,110 Z" fill="#4a614b" stroke="#243325" stroke-width="4"/>
        <rect x="180" y="65" width="45" height="15" rx="4" fill="#2d3748"/>
        <!-- 90mm Main Cannon Barrel -->
        <rect x="250" y="80" width="180" height="12" fill="#2d3748" stroke="#1a202c" stroke-width="2"/>
        <rect x="415" y="76" width="22" height="20" rx="3" fill="#1a202c"/>
        <!-- US Army Star Insignia -->
        <polygon points="190,125 195,138 208,138 197,146 201,158 190,150 179,158 183,146 172,138 185,138" fill="#fbbf24"/>
      </g>
    `
  },
  {
    id: 'WRM002',
    code: 'AIR-F5A',
    file: 'WRM002_f5a.svg',
    name: 'Tiêm kích F-5A Freedom Fighter',
    subtitle: 'Supersonic Jet Fighter • Mach 1.4',
    theme: { bg1: '#1a2332', bg2: '#0b111c', accent: '#38bdf8', tag: 'MILITARY AIRCRAFT' },
    drawIcon: `
      <!-- JET FIGHTER VECTOR -->
      <g transform="translate(180, 160) scale(1.1)">
        <!-- Wings -->
        <polygon points="200,60 50,220 120,220 200,160 280,220 350,220" fill="#334155" stroke="#1e293b" stroke-width="3"/>
        <!-- Main Fuselage -->
        <path d="M 200,20 Q 215,90 215,220 L 185,220 Q 185,90 200,20 Z" fill="#64748b" stroke="#334155" stroke-width="3"/>
        <!-- Cockpit Canopy -->
        <ellipse cx="200" cy="100" rx="10" ry="30" fill="#38bdf8" opacity="0.8"/>
        <!-- Twin Afterburners -->
        <rect x="188" y="220" width="10" height="15" fill="#f97316"/>
        <rect x="202" y="220" width="10" height="15" fill="#f97316"/>
        <!-- Wingtip Sidewinder Missiles -->
        <rect x="42" y="200" width="8" height="40" rx="2" fill="#94a3b8"/>
        <rect x="350" y="200" width="8" height="40" rx="2" fill="#94a3b8"/>
      </g>
    `
  },
  {
    id: 'WRM003',
    code: 'HELI-CH47',
    file: 'WRM003_chinook.svg',
    name: 'Trực thăng tải nặng CH-47 Chinook',
    subtitle: 'Tandem Rotor Heavy-Lift Transport',
    theme: { bg1: '#262218', bg2: '#120f09', accent: '#f59e0b', tag: 'HEAVY HELICOPTER' },
    drawIcon: `
      <!-- CH-47 CHINOOK VECTOR -->
      <g transform="translate(150, 170) scale(1.1)">
        <!-- Front Rotor -->
        <line x1="20" y1="80" x2="220" y2="80" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
        <line x1="120" y1="80" x2="120" y2="105" stroke="#475569" stroke-width="6"/>
        <!-- Rear Rotor Pylon & Rotor -->
        <line x1="260" y1="40" x2="460" y2="40" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
        <line x1="360" y1="40" x2="360" y2="85" stroke="#475569" stroke-width="6"/>
        <polygon points="340,85 380,85 390,140 330,140" fill="#475569"/>
        <!-- Banana Fuselage -->
        <path d="M 80,145 Q 90,105 130,105 L 350,110 Q 390,120 400,165 L 370,180 L 100,175 Q 75,170 80,145 Z" fill="#4b5563" stroke="#1f2937" stroke-width="4"/>
        <!-- Cockpit Windows -->
        <polygon points="85,135 110,125 115,145 90,150" fill="#38bdf8" opacity="0.8"/>
        <!-- Landing Gear Wheels -->
        <circle cx="130" cy="195" r="10" fill="#111827"/>
        <circle cx="340" cy="198" r="10" fill="#111827"/>
        <circle cx="365" cy="198" r="10" fill="#111827"/>
      </g>
    `
  },
  {
    id: 'WRM004',
    code: 'HELI-UH1',
    file: 'WRM004_uh1.svg',
    name: 'Trực thăng UH-1 Iroquois (Huey)',
    subtitle: 'Tactical Utility Assault Helicopter',
    theme: { bg1: '#1f2a24', bg2: '#0c140e', accent: '#34d399', tag: 'COMBAT HELICOPTER' },
    drawIcon: `
      <!-- UH-1 HUEY VECTOR -->
      <g transform="translate(170, 180) scale(1.15)">
        <!-- Main Rotor Blades -->
        <line x1="40" y1="70" x2="360" y2="70" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round"/>
        <rect x="195" y="70" width="10" height="25" fill="#475569"/>
        <!-- Fuselage Cabin -->
        <path d="M 90,140 Q 100,95 150,95 L 240,95 Q 260,110 270,140 L 260,160 L 110,160 Z" fill="#3f4e42" stroke="#1f2937" stroke-width="4"/>
        <!-- Glass Cockpit -->
        <path d="M 95,135 Q 105,105 140,105 L 140,145 L 105,145 Z" fill="#38bdf8" opacity="0.75"/>
        <!-- Tail Boom -->
        <polygon points="260,125 390,135 395,145 260,150" fill="#3f4e42" stroke="#1f2937" stroke-width="3"/>
        <!-- Tail Rotor Fin -->
        <polygon points="380,110 405,100 400,155 385,150" fill="#4b5563"/>
        <line x1="400" y1="85" x2="400" y2="155" stroke="#94a3b8" stroke-width="3"/>
        <!-- Skids -->
        <line x1="90" y1="185" x2="270" y2="185" stroke="#1e293b" stroke-width="6" stroke-linecap="round"/>
        <line x1="130" y1="160" x2="125" y2="185" stroke="#475569" stroke-width="4"/>
        <line x1="230" y1="160" x2="235" y2="185" stroke="#475569" stroke-width="4"/>
      </g>
    `
  },
  {
    id: 'WRM005',
    code: 'AIR-A37',
    file: 'WRM005_a37.svg',
    name: 'Cường kích A-37 Dragonfly',
    subtitle: 'Twin-Engine Ground Attack Aircraft',
    theme: { bg1: '#2b2118', bg2: '#140c06', accent: '#fb923c', tag: 'GROUND ATTACK' },
    drawIcon: `
      <!-- A-37 DRAGONFLY VECTOR -->
      <g transform="translate(170, 170) scale(1.15)">
        <polygon points="200,60 80,180 130,185 200,150 270,185 320,180" fill="#44403c" stroke="#1c1917" stroke-width="3"/>
        <path d="M 200,30 Q 212,80 212,190 L 188,190 Q 188,80 200,30 Z" fill="#78716c" stroke="#292524" stroke-width="3"/>
        <!-- Tip Fuel Tanks -->
        <rect x="68" y="155" width="15" height="45" rx="7" fill="#fb923c"/>
        <rect x="318" y="155" width="15" height="45" rx="7" fill="#fb923c"/>
        <!-- Canopy -->
        <ellipse cx="200" cy="90" rx="9" ry="22" fill="#38bdf8" opacity="0.8"/>
      </g>
    `
  },
  {
    id: 'WRM006',
    code: 'GUN-M107',
    file: 'WRM006_m107.svg',
    name: 'Pháo tự hành 175mm M107',
    subtitle: 'King of Battlefield • 175mm Heavy Gun',
    theme: { bg1: '#2a2719', bg2: '#131108', accent: '#eab308', tag: 'HEAVY ARTILLERY' },
    drawIcon: `
      <!-- M107 ARTILLERY VECTOR -->
      <g transform="translate(150, 160) scale(1.15)">
        <!-- Long 175mm Gun Barrel pointing upwards -->
        <polygon points="170,140 400,20 410,28 178,148" fill="#475569" stroke="#0f172a" stroke-width="2"/>
        <circle cx="174" cy="144" r="16" fill="#334155"/>
        <!-- Tracked Chassis Base -->
        <rect x="60" y="160" width="230" height="40" rx="18" fill="#1e293b" stroke="#334155" stroke-width="4"/>
        <circle cx="85" cy="180" r="14" fill="#0f172a"/>
        <circle cx="125" cy="180" r="14" fill="#0f172a"/>
        <circle cx="165" cy="180" r="14" fill="#0f172a"/>
        <circle cx="205" cy="180" r="14" fill="#0f172a"/>
        <circle cx="245" cy="180" r="14" fill="#0f172a"/>
        <polygon points="80,160 270,160 250,135 110,135" fill="#475569"/>
        <!-- Recoil Spade -->
        <polygon points="65,160 20,205 35,210 80,180" fill="#334155"/>
      </g>
    `
  },
  {
    id: 'WRM007',
    code: 'BOMB-BLU82',
    file: 'WRM007_blu82.svg',
    name: 'Bom phát quang siêu lớn BLU-82/B',
    subtitle: '15,000-lb Daisy Cutter High Explosive',
    theme: { bg1: '#311d1d', bg2: '#170b0b', accent: '#f87171', tag: 'HEAVY ORDNANCE' },
    drawIcon: `
      <!-- BLU-82 BOMB VECTOR -->
      <g transform="translate(180, 170) scale(1.1)">
        <!-- Massive Bomb Body -->
        <rect x="100" y="90" width="220" height="90" rx="15" fill="#52525b" stroke="#18181b" stroke-width="4"/>
        <path d="M 100,90 Q 40,135 100,180 Z" fill="#71717a" stroke="#18181b" stroke-width="4"/>
        <!-- Extender Nose Fuse Probe -->
        <rect x="0" y="131" width="50" height="8" fill="#fbbf24"/>
        <circle cx="0" cy="135" r="8" fill="#ef4444"/>
        <!-- Tail Fins -->
        <polygon points="320,90 380,60 380,210 320,180" fill="#3f3f46" stroke="#18181b" stroke-width="3"/>
        <!-- Warning Stencils -->
        <rect x="150" y="125" width="110" height="20" fill="#fbbf24"/>
        <text x="160" y="140" fill="#000" font-family="monospace" font-weight="900" font-size="11">BLU-82/B 15,000 LB</text>
      </g>
    `
  },
  {
    id: 'WRM008',
    code: 'PRIS-CAGE',
    file: 'WRM008_cage.svg',
    name: 'Mô hình Chuồng Cọp Côn Đảo',
    subtitle: 'Con Dao Prison Tiger Cage Regime',
    theme: { bg1: '#262626', bg2: '#0f0f0f', accent: '#e2e8f0', tag: 'HISTORIC RELIC' },
    drawIcon: `
      <!-- TIGER CAGE CELL VECTOR -->
      <g transform="translate(180, 150) scale(1.15)">
        <!-- Stone Walls -->
        <rect x="40" y="40" width="340" height="180" fill="#262626" stroke="#525252" stroke-width="4"/>
        <!-- Overhead Iron Bars -->
        <line x1="80" y1="40" x2="80" y2="220" stroke="#a3a3a3" stroke-width="6"/>
        <line x1="120" y1="40" x2="120" y2="220" stroke="#a3a3a3" stroke-width="6"/>
        <line x1="160" y1="40" x2="160" y2="220" stroke="#a3a3a3" stroke-width="6"/>
        <line x1="200" y1="40" x2="200" y2="220" stroke="#a3a3a3" stroke-width="6"/>
        <line x1="240" y1="40" x2="240" y2="220" stroke="#a3a3a3" stroke-width="6"/>
        <line x1="280" y1="40" x2="280" y2="220" stroke="#a3a3a3" stroke-width="6"/>
        <line x1="320" y1="40" x2="320" y2="220" stroke="#a3a3a3" stroke-width="6"/>
        <!-- Horizontal crossbar with shackles -->
        <line x1="40" y1="90" x2="380" y2="90" stroke="#737373" stroke-width="6"/>
        <line x1="40" y1="170" x2="380" y2="170" stroke="#737373" stroke-width="6"/>
        <!-- Barbed Wire Symbol -->
        <path d="M 40,30 L 100,50 L 160,30 L 220,50 L 280,30 L 340,50 L 380,30" stroke="#ef4444" stroke-width="3" fill="none"/>
      </g>
    `
  },
  {
    id: 'WRM009',
    code: 'PRIS-GUILL',
    file: 'WRM009_guillotine.svg',
    name: 'Máy chém thời thực dân Pháp',
    subtitle: 'Colonial Guillotine • Law 10/59 Relic',
    theme: { bg1: '#2b1b1b', bg2: '#120707', accent: '#f43f5e', tag: 'COLONIAL RELIC' },
    drawIcon: `
      <!-- GUILLOTINE VECTOR -->
      <g transform="translate(220, 140) scale(1.15)">
        <!-- Wood Base & Lunette -->
        <rect x="60" y="210" width="220" height="20" fill="#451a03" stroke="#291204" stroke-width="3"/>
        <rect x="130" y="170" width="80" height="40" rx="6" fill="#5c2605"/>
        <circle cx="170" cy="185" r="16" fill="#18181b"/>
        <!-- Vertical Upright Beams -->
        <rect x="120" y="20" width="16" height="190" fill="#5c2605" stroke="#291204" stroke-width="2"/>
        <rect x="204" y="20" width="16" height="190" fill="#5c2605" stroke="#291204" stroke-width="2"/>
        <rect x="110" y="15" width="120" height="14" fill="#451a03"/>
        <!-- Heavy Steel Angled Blade -->
        <polygon points="136,70 204,70 204,115 136,80" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
        <polygon points="136,55 204,55 204,70 136,70" fill="#475569"/>
        <!-- Pulley Wheel & Rope -->
        <circle cx="170" cy="22" r="8" fill="#1e293b"/>
      </g>
    `
  },
  {
    id: 'WRM010',
    code: 'PHOTO-NAPALM',
    file: 'WRM010_napalm.svg',
    name: 'Bức ảnh "Em bé Napalm"',
    subtitle: 'Nick Ut • The Terror of War (Trang Bang 1972)',
    theme: { bg1: '#331f13', bg2: '#160a04', accent: '#fb923c', tag: 'PULITZER PHOTOGRAPHY' },
    drawIcon: `
      <!-- HISTORIC PHOTO FRAME -->
      <g transform="translate(190, 150) scale(1.1)">
        <!-- Vintage Photo Border -->
        <rect x="40" y="20" width="320" height="220" rx="8" fill="#fafaf9" stroke="#d6d3d1" stroke-width="6"/>
        <rect x="55" y="35" width="290" height="190" fill="#1c1917"/>
        <!-- Napalm Smoke Cloud Silhouette -->
        <path d="M 90,140 Q 120,60 170,80 Q 230,50 280,100 Q 320,130 310,180 L 80,180 Z" fill="#44403c" opacity="0.8"/>
        <circle cx="200" cy="110" r="45" fill="#f97316" opacity="0.6"/>
        <!-- Running Children Silhouettes -->
        <circle cx="190" cy="130" r="8" fill="#e7e5e4"/>
        <line x1="190" y1="138" x2="190" y2="165" stroke="#e7e5e4" stroke-width="4"/>
        <line x1="175" y1="145" x2="205" y2="145" stroke="#e7e5e4" stroke-width="3"/>
        <circle cx="145" cy="135" r="7" fill="#a8a29e"/>
        <circle cx="235" cy="135" r="7" fill="#a8a29e"/>
      </g>
    `
  },
  {
    id: 'WRM011',
    code: 'PHOTO-EXEC',
    file: 'WRM011_exec.svg',
    name: 'Bức ảnh "Hành quyết Sài Gòn"',
    subtitle: 'Eddie Adams • Saigon Street Execution (1968)',
    theme: { bg1: '#262322', bg2: '#110f0f', accent: '#fca5a5', tag: 'PULITZER PHOTOGRAPHY' },
    drawIcon: `
      <!-- HISTORIC PHOTO 1968 -->
      <g transform="translate(190, 150) scale(1.1)">
        <rect x="40" y="20" width="320" height="220" rx="8" fill="#fafaf9" stroke="#d6d3d1" stroke-width="6"/>
        <rect x="55" y="35" width="290" height="190" fill="#18181b"/>
        <!-- Camera Lens Crosshair Overlay -->
        <circle cx="200" cy="120" r="50" stroke="#ef4444" stroke-width="2" fill="none" stroke-dasharray="8 6"/>
        <line x1="200" y1="50" x2="200" y2="190" stroke="#ef4444" stroke-width="1" stroke-dasharray="4 4"/>
        <line x1="130" y1="120" x2="270" y2="120" stroke="#ef4444" stroke-width="1" stroke-dasharray="4 4"/>
        <text x="70" y="210" fill="#71717a" font-family="monospace" font-size="10">PULITZER PRIZE 1969 • EDDIE ADAMS</text>
      </g>
    `
  },
  {
    id: 'WRM012',
    code: 'DIOXIN-ROOM',
    file: 'WRM012_dioxin.svg',
    name: 'Chứng tích Chất độc Da cam / Dioxin',
    subtitle: 'Agent Orange Memorial & Genetic Consequence',
    theme: { bg1: '#382512', bg2: '#170e05', accent: '#f59e0b', tag: 'MEMORIAL EXHIBIT' },
    drawIcon: `
      <!-- DIOXIN DRUM & LOTUS -->
      <g transform="translate(180, 150) scale(1.15)">
        <!-- Chemical Barrel with Orange Band -->
        <rect x="80" y="70" width="100" height="130" rx="14" fill="#3f3f46" stroke="#18181b" stroke-width="3"/>
        <rect x="80" y="110" width="100" height="45" fill="#f97316"/>
        <text x="95" y="137" fill="#fff" font-family="sans-serif" font-weight="900" font-size="12">AGENT ORANGE</text>
        <!-- Dioxin Chemical Benzene Hexagon Structure -->
        <polygon points="260,80 290,95 290,130 260,145 230,130 230,95" stroke="#f59e0b" stroke-width="4" fill="none"/>
        <polygon points="320,80 350,95 350,130 320,145 290,130 290,95" stroke="#f59e0b" stroke-width="4" fill="none"/>
        <line x1="240" y1="100" x2="255" y2="92" stroke="#f59e0b" stroke-width="2"/>
        <text x="235" y="180" fill="#fbbf24" font-family="sans-serif" font-weight="bold" font-size="14">2,3,7,8-TCDD</text>
      </g>
    `
  },
  {
    id: 'WRM013',
    code: 'REQ-PHOTO',
    file: 'WRM013_requiem.svg',
    name: 'Bộ sưu tập ảnh chiến trường "Hồi Niệm"',
    subtitle: 'Requiem Exhibition • 135 War Journalists',
    theme: { bg1: '#1e2430', bg2: '#0b0f16', accent: '#60a5fa', tag: 'PHOTOJOURNALISM' },
    drawIcon: `
      <!-- VINTAGE PRESS CAMERA & FILM -->
      <g transform="translate(180, 150) scale(1.15)">
        <!-- Vintage 35mm Rangefinder Camera -->
        <rect x="80" y="70" width="220" height="120" rx="14" fill="#334155" stroke="#0f172a" stroke-width="4"/>
        <rect x="100" y="50" width="45" height="20" rx="4" fill="#64748b"/>
        <circle cx="270" cy="60" r="10" fill="#94a3b8"/>
        <!-- Large Camera Glass Lens -->
        <circle cx="190" cy="130" r="42" fill="#1e293b" stroke="#64748b" stroke-width="6"/>
        <circle cx="190" cy="130" r="28" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
        <circle cx="180" cy="120" r="8" fill="#38bdf8" opacity="0.6"/>
        <!-- Film Strip Header -->
        <rect x="50" y="200" width="280" height="22" fill="#0f172a"/>
        <rect x="60" y="204" width="12" height="14" fill="#fff"/>
        <rect x="85" y="204" width="12" height="14" fill="#fff"/>
        <rect x="110" y="204" width="12" height="14" fill="#fff"/>
        <rect x="135" y="204" width="12" height="14" fill="#fff"/>
        <rect x="160" y="204" width="12" height="14" fill="#fff"/>
        <rect x="185" y="204" width="12" height="14" fill="#fff"/>
        <rect x="210" y="204" width="12" height="14" fill="#fff"/>
      </g>
    `
  },
  {
    id: 'WRM014',
    code: 'MEDAL-VET',
    file: 'WRM014_medals.svg',
    name: 'Kỷ vật cựu binh Mỹ phản chiến',
    subtitle: 'Vietnam Veterans Against War (VVAW)',
    theme: { bg1: '#1f2923', bg2: '#0b140e', accent: '#4ade80', tag: 'HISTORIC EVIDENCE' },
    drawIcon: `
      <!-- MEDALS & PEACE RIBBON -->
      <g transform="translate(190, 150) scale(1.15)">
        <!-- Medal 1 Ribbon -->
        <rect x="90" y="40" width="50" height="70" fill="#dc2626"/>
        <rect x="105" y="40" width="20" height="70" fill="#3b82f6"/>
        <!-- Medal 1 Bronze Star -->
        <polygon points="115,110 120,125 135,125 123,135 127,150 115,140 103,150 107,135 95,125 110,125" fill="#f59e0b" stroke="#78350f" stroke-width="2"/>
        <!-- Medal 2 Ribbon -->
        <rect x="210" y="40" width="50" height="70" fill="#15803d"/>
        <rect x="225" y="40" width="20" height="70" fill="#eab308"/>
        <!-- Medal 2 Cross -->
        <circle cx="235" cy="130" r="22" fill="#ca8a04" stroke="#78350f" stroke-width="2"/>
        <path d="M 230,118 L 240,118 L 240,142 L 230,142 Z" fill="#fff"/>
        <path d="M 223,125 L 247,125 L 247,135 L 223,135 Z" fill="#fff"/>
        <!-- Peace Ribbon Banner -->
        <path d="M 60,185 Q 175,160 290,185 L 270,210 Q 175,185 80,210 Z" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
        <text x="110" y="200" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="11">VVAW &bull; PEACE NOW</text>
      </g>
    `
  },
  {
    id: 'WRM015',
    code: 'PEACE-DOVE',
    file: 'WRM015_peace.svg',
    name: 'Biểu tượng Bồ Câu Trắng Hòa Bình',
    subtitle: 'Global Solidarity & Peace Culture',
    theme: { bg1: '#172554', bg2: '#0b1120', accent: '#60a5fa', tag: 'PEACE SYMBOL' },
    drawIcon: `
      <!-- WHITE DOVE OF PEACE -->
      <g transform="translate(180, 140) scale(1.15)">
        <!-- Olive Branch in Beak -->
        <path d="M 120,95 Q 80,85 60,100" stroke="#22c55e" stroke-width="3" fill="none"/>
        <ellipse cx="70" cy="92" rx="8" ry="4" fill="#22c55e" transform="rotate(-30 70 92)"/>
        <ellipse cx="90" cy="90" rx="8" ry="4" fill="#22c55e" transform="rotate(-15 90 90)"/>
        <!-- White Dove Silhouette -->
        <path d="M 120,95 Q 150,80 180,95 Q 220,50 290,55 Q 260,110 240,130 Q 280,145 320,180 L 270,185 Q 230,170 200,165 Q 160,180 130,150 Q 115,120 120,95 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
        <circle cx="140" cy="98" r="3" fill="#0f172a"/>
        <!-- Peace Glow Rays -->
        <circle cx="200" cy="120" r="90" stroke="#93c5fd" stroke-width="2" fill="none" opacity="0.4" stroke-dasharray="10 8"/>
      </g>
    `
  }
];

function generateArtifactSVG(art) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${art.theme.bg1}"/>
      <stop offset="100%" stop-color="${art.theme.bg2}"/>
    </linearGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="40%" stop-color="#ffffff" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
    </radialGradient>
    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.05"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="800" height="600" fill="url(#bgGrad)"/>
  <rect width="800" height="600" fill="url(#gridPattern)"/>
  <rect width="800" height="600" fill="url(#vignette)"/>

  <!-- Top Museum Header Bar -->
  <rect x="40" y="35" width="720" height="40" rx="10" fill="#000000" fill-opacity="0.5" stroke="#ffffff" stroke-opacity="0.1"/>
  <text x="60" y="60" fill="#f59e0b" font-family="system-ui, sans-serif" font-weight="900" font-size="13" letter-spacing="1.5">BẢO TÀNG CHỨNG TÍCH CHIẾN TRANH &bull; TP. HỒ CHÍ MINH</text>
  <rect x="620" y="43" width="125" height="24" rx="6" fill="${art.theme.accent}" fill-opacity="0.2" stroke="${art.theme.accent}" stroke-width="1.5"/>
  <text x="682" y="59" fill="${art.theme.accent}" font-family="monospace" font-weight="bold" font-size="11" text-anchor="middle">${art.theme.tag}</text>

  <!-- Center Graphic Vector Artwork -->
  ${art.drawIcon}

  <!-- Bottom Info Plate -->
  <rect x="40" y="475" width="720" height="90" rx="16" fill="#0f172a" fill-opacity="0.9" stroke="#334155" stroke-width="1.5"/>
  <rect x="55" y="492" width="100" height="28" rx="8" fill="#f59e0b" fill-opacity="0.2" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="105" y="511" fill="#fbbf24" font-family="monospace" font-weight="900" font-size="13" text-anchor="middle">${art.code}</text>

  <text x="175" y="512" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="800" font-size="20">${art.name}</text>
  <text x="175" y="538" fill="#94a3b8" font-family="system-ui, sans-serif" font-weight="500" font-size="13">${art.subtitle}</text>

  <!-- Corner watermark logo -->
  <circle cx="715" cy="520" r="18" fill="${art.theme.accent}" fill-opacity="0.15"/>
  <text x="715" y="525" fill="${art.theme.accent}" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">&#x2714;</text>
</svg>`;
}

// Generate Museum Banner SVG
const museumBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="1200" height="600">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
    <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <radialGradient id="bannerVignette" cx="50%" cy="50%" r="70%">
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.8"/>
    </radialGradient>
  </defs>

  <!-- Sky -->
  <rect width="1200" height="600" fill="url(#skyGrad)"/>

  <!-- Museum Modern Architecture Building Facade -->
  <g transform="translate(150, 140)">
    <!-- Main Center Exhibition Pavilion -->
    <rect x="150" y="80" width="600" height="260" rx="6" fill="url(#wallGrad)" stroke="#64748b" stroke-width="4"/>
    
    <!-- Large Museum Signboard on Top Facade -->
    <rect x="220" y="110" width="460" height="60" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="3"/>
    <text x="450" y="145" fill="#f59e0b" font-family="system-ui, sans-serif" font-weight="900" font-size="20" text-anchor="middle" letter-spacing="2">BẢO TÀNG CHỨNG TÍCH CHIẾN TRANH</text>
    <text x="450" y="162" fill="#e2e8f0" font-family="sans-serif" font-weight="600" font-size="12" text-anchor="middle" letter-spacing="1">WAR REMNANTS MUSEUM &bull; 28 VÕ VĂN TẦN, QUẬN 3, TP.HCM</text>

    <!-- Glass Entrance Windows & Doors -->
    <rect x="360" y="240" width="180" height="100" fill="#38bdf8" fill-opacity="0.4" stroke="#94a3b8" stroke-width="2"/>
    <line x1="450" y1="240" x2="450" y2="340" stroke="#0f172a" stroke-width="3"/>
    <line x1="360" y1="290" x2="540" y2="290" stroke="#0f172a" stroke-width="2"/>

    <!-- Left Wing -->
    <polygon points="50,150 150,120 150,340 50,340" fill="#334155" stroke="#475569" stroke-width="3"/>
    <!-- Right Wing -->
    <polygon points="750,120 850,150 850,340 750,340" fill="#334155" stroke="#475569" stroke-width="3"/>

    <!-- Vietnam National Flag on Pole -->
    <line x1="160" y1="0" x2="160" y2="80" stroke="#cbd5e1" stroke-width="4"/>
    <rect x="160" y="5" width="70" height="46" fill="#da251d"/>
    <polygon points="195,15 198,25 208,25 200,31 203,41 195,35 187,41 190,31 182,25 192,25" fill="#ffff00"/>
  </g>

  <!-- Outdoor Yard Vehicles Silhouettes on Front Lawn -->
  <g transform="translate(150, 430)">
    <!-- Ground Yard -->
    <rect x="-150" y="50" width="1200" height="120" fill="#0f172a"/>
    <line x1="-150" y1="50" x2="1050" y2="50" stroke="#334155" stroke-width="4"/>
    <!-- Outdoor Tank Silhouette -->
    <rect x="60" y="20" width="120" height="30" rx="8" fill="#1e293b"/>
    <polygon points="80,20 160,20 145,0 95,0" fill="#334155"/>
    <line x1="145" y1="5" x2="220" y2="5" stroke="#475569" stroke-width="4"/>
    <!-- Outdoor Jet Silhouette -->
    <polygon points="750,45 840,10 880,45" fill="#334155"/>
    <line x1="780" y1="15" x2="880" y2="15" stroke="#1e293b" stroke-width="5"/>
    <!-- Palm Trees in courtyard -->
    <path d="M 30,50 Q 25,10 15,-20" stroke="#78350f" stroke-width="6" fill="none"/>
    <circle cx="15" cy="-25" r="25" fill="#166534" opacity="0.8"/>
    <path d="M 870,50 Q 875,10 885,-20" stroke="#78350f" stroke-width="6" fill="none"/>
    <circle cx="885" cy="-25" r="25" fill="#166534" opacity="0.8"/>
  </g>

  <!-- Vignette & Lighting Filter -->
  <rect width="1200" height="600" fill="url(#bannerVignette)"/>
</svg>`;

// Write all files
artifacts.forEach(art => {
  const svgContent = generateArtifactSVG(art);
  const filePath = path.join(artifactsDir, art.file);
  fs.writeFileSync(filePath, svgContent, 'utf-8');
  console.log(`Generated: ${art.file}`);
});

fs.writeFileSync(path.join(museumDir, 'war_remnants_museum_banner.svg'), museumBannerSvg, 'utf-8');
console.log('Generated: museum banner');
