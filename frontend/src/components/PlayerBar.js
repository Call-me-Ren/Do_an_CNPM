/**
 * PlayerBar Component - Thanh phát âm thanh cố định góc dưới màn hình
 * Hỗ trợ USC04 (Nghe thuyết minh), USC18 (Phụ đề), USC19 (Tua audio), USC05 (Đổi ngôn ngữ)
 * Đã hỗ trợ đa ngôn ngữ đầy đủ (I18n)
 */
import { MediaPlayer } from '../services/MediaPlayer.js';
import { getI18n } from '../services/I18nService.js';

export class PlayerBar {
  constructor(onOpenDetail, getCurrentLang) {
    this.onOpenDetail = onOpenDetail;
    this.getCurrentLang = getCurrentLang || (() => 'vi');
    this.init();
  }

  get t() {
    return getI18n(this.getCurrentLang());
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
      this.render(state);
    });
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  render(state) {
    const el = document.getElementById('global-player-bar');
    if (!state.currentArtifact) {
      el.classList.add('translate-y-full');
      return;
    }
    el.classList.remove('translate-y-full');

    const t = this.t;
    const art = state.currentArtifact;
    const name = art.name[state.currentLang] || art.name.vi;

    el.innerHTML = `
      <!-- Subtitle Floating Box (USC18) -->
      ${state.subtitlesEnabled && state.currentSubtitleText ? `
        <div class="absolute -top-12 inset-x-0 flex justify-center pointer-events-none">
          <div class="bg-black/85 text-amber-300 border border-amber-500/30 text-xs md:text-sm px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md max-w-xl text-center truncate">
            💬 ${state.currentSubtitleText}
          </div>
        </div>
      ` : ''}

      <!-- Progress bar -->
      <div class="w-full bg-slate-800 h-1.5 cursor-pointer relative group" id="player-progress-container">
        <div class="bg-amber-500 h-full relative" style="width: ${(state.currentTime / (state.duration || 1)) * 100}%">
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
            <button id="player-rewind-btn" title="${t.rewindBtnTitle}" class="text-slate-400 hover:text-white p-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"></path></svg>
            </button>

            <button id="player-play-btn" class="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg transition">
              ${state.isPlaying ? `
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
              ` : `
                <svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              `}
            </button>

            <button id="player-forward-btn" title="${t.forwardBtnTitle}" class="text-slate-400 hover:text-white p-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"></path></svg>
            </button>
          </div>
          <div class="text-[11px] text-slate-400 mt-1 font-mono">
            <span>${this.formatTime(state.currentTime)}</span> / <span>${this.formatTime(state.duration)}</span>
          </div>
        </div>

        <!-- Extra Tools: Speed, Subtitle, Lang -->
        <div class="flex items-center space-x-2 flex-shrink-0">
          <button id="player-speed-btn" class="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono" title="${t.playbackSpeedTitle}">
            ${state.playbackRate}x
          </button>

          <button id="player-sub-btn" class="text-xs px-2.5 py-1 rounded ${state.subtitlesEnabled ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-400'} font-medium" title="${t.ccSubtitleTitle}">
            ${t.ccBtnText}
          </button>
        </div>
      </div>
    `;

    this.bindEvents(el, state);
  }

  bindEvents(el, state) {
    el.querySelector('#player-play-btn').onclick = () => MediaPlayer.togglePlay();

    el.querySelector('#player-rewind-btn').onclick = () => MediaPlayer.seek(state.currentTime - 10);
    el.querySelector('#player-forward-btn').onclick = () => MediaPlayer.seek(state.currentTime + 10);

    el.querySelector('#player-progress-container').onclick = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      MediaPlayer.seek(pos * (state.duration || 1));
    };

    el.querySelector('#player-speed-btn').onclick = () => {
      const rates = [1.0, 1.25, 1.5, 0.75];
      const nextIdx = (rates.indexOf(state.playbackRate) + 1) % rates.length;
      MediaPlayer.setPlaybackRate(rates[nextIdx]);
    };

    el.querySelector('#player-sub-btn').onclick = () => MediaPlayer.toggleSubtitles();

    const info = el.querySelector('#player-artifact-info');
    if (info && this.onOpenDetail) {
      info.onclick = () => this.onOpenDetail(state.currentArtifact);
    }
  }
}
