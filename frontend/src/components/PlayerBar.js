/**
 * PlayerBar Component - Thanh phát âm thanh cố định góc dưới màn hình
 * Hỗ trợ USC04 (Nghe thuyết minh), USC18 (Phụ đề), USC19 (Tua audio), USC05 (Đổi ngôn ngữ)
 * Thiết kế tối ưu DOM: Không render lại toàn bộ innerHTML mỗi tick để nút Play/Pause luôn nhận click 100%
 */
import { MediaPlayer } from '../services/MediaPlayer.js';
import { getI18n } from '../services/I18nService.js';

export class PlayerBar {
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
