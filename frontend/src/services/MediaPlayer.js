/**
 * MediaPlayer Component - Mô phỏng theo Component Diagram (Media Player)
 * Giao tiếp với AudioStreamer qua I_Audio
 * Hiện thực USC04 (Nghe thuyết minh), USC05 (Chuyển đổi ngôn ngữ), USC18 (Xem phụ đề), USC19 (Phát luồng dữ liệu)
 */
class MediaPlayerController {
  constructor() {
    this.audioElement = new Audio();
    this.currentArtifact = null;
    this.currentLang = 'vi';
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.playbackRate = 1.0;
    this.subtitlesEnabled = true; // USC18
    this.currentSubtitleText = '';
    this.subscribers = [];

    this.initAudioEvents();
  }

  initAudioEvents() {
    this.audioElement.addEventListener('timeupdate', () => {
      this.currentTime = this.audioElement.currentTime;
      this.duration = this.audioElement.duration || 0;
      this.updateSubtitle();
      this.emitChange();
    });

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.emitChange();
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.emitChange();
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.currentTime = 0;
      this.currentSubtitleText = '';
      this.emitChange();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn('Lỗi luồng âm thanh:', e);
      this.emitChange({ error: 'Không thể tải luồng âm thanh thuyết minh (USC04-E1).' });
    });
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  emitChange(extra = {}) {
    this.subscribers.forEach(cb => cb({
      isPlaying: this.isPlaying,
      currentTime: this.currentTime,
      duration: this.duration,
      currentArtifact: this.currentArtifact,
      currentLang: this.currentLang,
      playbackRate: this.playbackRate,
      subtitlesEnabled: this.subtitlesEnabled,
      currentSubtitleText: this.currentSubtitleText,
      ...extra
    }));
  }

  // Tải hiện vật và bắt đầu phát (USC04, USC19)
  loadArtifact(artifact, lang = 'vi') {
    this.currentArtifact = artifact;
    this.currentLang = lang;
    
    // Lấy URL audio theo ngôn ngữ hoặc fallback về tiếng Việt
    const audioSrc = artifact.audio[lang] || artifact.audio['vi'] || artifact.audio['en'];
    if (!audioSrc) {
      alert('Chưa có bản ghi âm thanh cho ngôn ngữ này (USC12-E1).');
      return;
    }

    this.audioElement.src = audioSrc;
    this.audioElement.load();
    this.currentTime = 0;
    this.currentSubtitleText = '';
    this.emitChange();
  }

  play() {
    this.audioElement.play().catch(e => {
      console.error('Không thể tự động phát:', e);
    });
  }

  pause() {
    this.audioElement.pause();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  // Tua audio đến thời điểm bất kỳ (USC19-A1)
  seek(seconds) {
    if (this.audioElement.duration) {
      this.audioElement.currentTime = Math.max(0, Math.min(seconds, this.audioElement.duration));
      this.currentTime = this.audioElement.currentTime;
      this.updateSubtitle();
      this.emitChange();
    }
  }

  // Thay đổi tốc độ đọc (0.75x, 1x, 1.25x, 1.5x)
  setPlaybackRate(rate) {
    this.playbackRate = rate;
    this.audioElement.playbackRate = rate;
    this.emitChange();
  }

  // Bật/tắt phụ đề (USC18)
  toggleSubtitles() {
    this.subtitlesEnabled = !this.subtitlesEnabled;
    this.updateSubtitle();
    this.emitChange();
  }

  // Chuyển đổi ngôn ngữ âm thanh & phụ đề đồng thời (USC05)
  changeLanguage(newLang) {
    if (this.currentLang === newLang) return;
    this.currentLang = newLang;
    if (this.currentArtifact) {
      const savedTime = this.currentTime;
      const wasPlaying = this.isPlaying;
      
      const audioSrc = this.currentArtifact.audio[newLang] || this.currentArtifact.audio['vi'];
      if (audioSrc) {
        this.audioElement.src = audioSrc;
        this.audioElement.currentTime = savedTime;
        if (wasPlaying) {
          this.play();
        }
      }
    }
    this.updateSubtitle();
    this.emitChange();
  }

  // Đồng bộ phụ đề theo mốc thời gian thời gian thực (USC18)
  updateSubtitle() {
    if (!this.subtitlesEnabled || !this.currentArtifact) {
      this.currentSubtitleText = '';
      return;
    }

    const subs = (this.currentArtifact.subtitles && (this.currentArtifact.subtitles[this.currentLang] || this.currentArtifact.subtitles['vi'])) || [];
    
    // Tìm dòng phụ đề phù hợp với currentTime
    let activeText = '';
    for (let i = 0; i < subs.length; i++) {
      if (this.currentTime >= subs[i].time) {
        activeText = subs[i].text;
      }
    }
    this.currentSubtitleText = activeText;
  }
}

export const MediaPlayer = new MediaPlayerController();
