/**
 * App.js - Single-Page Application Central Controller (GUI.spa)
 * Điều phối Router, Navbar, Trang chủ, Trang chi tiết hiện vật, Yêu thích, Sơ đồ và Auth
 * ĐÃ TÍCH HỢP HOÀN CHỈNH ĐA NGÔN NGỮ (I18N) TOÀN DIỆN CHO TẤT CẢ GIAO DIỆN
 */
import { mockDB } from './services/MockDatabase.js';
import { ClientSession } from './services/ClientSession.js';
import { ArtifactServiceInstance } from './services/ArtifactService.js';
import { MediaPlayer } from './services/MediaPlayer.js';
import { QRScannerModal } from './components/QRScanner.js';
import { AuthModal } from './components/AuthModal.js';
import { PlayerBar } from './components/PlayerBar.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import { getI18n } from './services/I18nService.js';

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
