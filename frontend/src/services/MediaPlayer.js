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

export const MediaPlayer = new MediaPlayerController();
