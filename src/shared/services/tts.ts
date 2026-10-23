import { SupportedLanguage, SubtitleCue } from '../types';

const langLocaleMap: Record<SupportedLanguage, string> = {
  vi: 'vi-VN',
  en: 'en-US',
  zh: 'zh-CN',
  ko: 'ko-KR',
  ja: 'ja-JP',
};

export interface TTSCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onBoundary?: (charIndex: number, text: string) => void;
  onError?: (err: any) => void;
}

export interface CueCallbacks {
  onCueChange?: (cueIndex: number, cue: SubtitleCue) => void;
  onCueProgress?: (cueIndex: number, currentSeconds: number) => void;
  onFinish?: () => void;
  onError?: (err: any) => void;
}

class TTSService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  // Cue queue state
  private activeCues: SubtitleCue[] = [];
  private currentCueIndex: number = 0;
  private currentLang: SupportedLanguage = 'vi';
  private currentRate: number = 1.0;
  private cueCallbacks?: CueCallbacks;
  private progressInterval: any = null;
  private isCuePlaying: boolean = false;
  private cueStartTimeMs: number = 0;
  private isCancelling: boolean = false;
  private seekTimeout: any = null;

  constructor() {
    if (this.isSupported()) {
      this.initVoices();
    }
  }

  private initVoices(): void {
    if (!this.isSupported()) return;
    this.cachedVoices = window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  public getIsCuePlaying(): boolean {
    return this.isCuePlaying;
  }

  public getCurrentCueIndex(): number {
    return this.currentCueIndex;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported()) return [];
    if (this.cachedVoices.length > 0) return this.cachedVoices;
    this.cachedVoices = window.speechSynthesis.getVoices();
    return this.cachedVoices;
  }

  /**
   * Score and pick the most natural, pleasant sounding voice for the requested language.
   * Gives strong priority to modern neural/natural/Google studio voices over legacy robotic ones.
   */
  public getBestVoice(lang: SupportedLanguage, targetLocale: string): SpeechSynthesisVoice | undefined {
    const voices = this.getVoices();
    if (!voices || voices.length === 0) return undefined;

    const matchingVoices = voices.filter((v) => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      const target = targetLocale.toLowerCase().replace('_', '-');
      const prefix = target.split('-')[0];
      return vLang === target || vLang.startsWith(prefix);
    });

    if (matchingVoices.length === 0) return undefined;

    const scoreVoice = (v: SpeechSynthesisVoice): number => {
      let score = 0;
      const name = v.name.toLowerCase();
      const vLang = v.lang.toLowerCase().replace('_', '-');
      const target = targetLocale.toLowerCase().replace('_', '-');

      // Exact dialect match (e.g. en-US for en-US)
      if (vLang === target) {
        score += 80;
      }

      // High-tier Natural / Neural / Online voices (Edge, Windows 11 Natural, Azure)
      if (name.includes('natural') || name.includes('online')) {
        score += 500;
      }
      if (name.includes('neural') || name.includes('premium')) {
        score += 400;
      }

      // Studio Google voices (Chrome)
      if (name.includes('google')) {
        score += 300;
      }

      // Language-specific preferences
      if (lang === 'en') {
        // Preferred warm, clear English narrators
        if (
          name.includes('jenny') ||
          name.includes('aria') ||
          name.includes('guy') ||
          name.includes('christopher') ||
          name.includes('ana')
        ) {
          score += 250;
        }
        if (name.includes('samantha') || name.includes('karen') || name.includes('victoria') || name.includes('daniel')) {
          score += 150;
        }
        // Penalize robotic legacy synthesizers (Microsoft David, Microsoft Mark, etc.)
        if (name.includes('david') || name.includes('mark') || name.includes('desktop')) {
          score -= 300;
        }
      } else if (lang === 'vi') {
        // Vietnamese preferred voices (HoaiMy, NamMinh, Google Tiếng Việt)
        if (name.includes('hoaimy') || name.includes('namminh')) {
          score += 250;
        }
      }

      if (v.default) {
        score += 5;
      }

      return score;
    };

    const sorted = [...matchingVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    return sorted[0];
  }

  // --- Cue Queue Playback Engine ---

  public setCueCallbacks(callbacks: CueCallbacks): void {
    this.cueCallbacks = callbacks;
  }

  public playCues(
    cues: SubtitleCue[],
    startIndex: number = 0,
    lang: SupportedLanguage = 'vi',
    playbackRate: number = 1.0,
    callbacks?: CueCallbacks
  ): void {
    if (!this.isSupported()) {
      callbacks?.onFinish?.();
      return;
    }

    this.stop();

    if (!cues || cues.length === 0) {
      callbacks?.onFinish?.();
      return;
    }

    this.activeCues = cues;
    this.currentCueIndex = Math.max(0, Math.min(startIndex, cues.length - 1));
    this.currentLang = lang;
    this.currentRate = playbackRate;
    if (callbacks) {
      this.cueCallbacks = callbacks;
    }
    this.isCuePlaying = true;

    this.speakCurrentCue();
  }

  private clearProgressTimer(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  private speakCurrentCue(): void {
    if (!this.isCuePlaying) return;

    if (this.currentCueIndex >= this.activeCues.length) {
      this.stop();
      this.cueCallbacks?.onFinish?.();
      return;
    }

    const cue = this.activeCues[this.currentCueIndex];
    if (!cue) return;

    this.clearProgressTimer();
    this.cueCallbacks?.onCueChange?.(this.currentCueIndex, cue);

    try {
      const targetLocale = langLocaleMap[this.currentLang] || 'vi-VN';
      const utterance = new SpeechSynthesisUtterance(cue.text);
      utterance.lang = targetLocale;

      const baseRate = this.currentLang === 'en' ? 0.95 : 1.0;
      utterance.rate = Math.max(0.7, Math.min(2.0, this.currentRate * baseRate));
      utterance.pitch = 1.0;

      const voice = this.getBestVoice(this.currentLang, targetLocale);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.isPaused = false;
        this.cueStartTimeMs = Date.now();

        // High frequency progress update (every 100ms)
        this.clearProgressTimer();
        this.progressInterval = setInterval(() => {
          if (!this.isSpeaking || this.isPaused || this.isCancelling) return;
          const elapsed = ((Date.now() - this.cueStartTimeMs) / 1000) * this.currentRate;
          const cueDuration = Math.max(0.5, cue.end - cue.start);
          const progress = Math.min(cueDuration, elapsed);
          const currentTotal = Number((cue.start + progress).toFixed(2));
          this.cueCallbacks?.onCueProgress?.(this.currentCueIndex, currentTotal);
        }, 100);
      };

      utterance.onend = () => {
        this.clearProgressTimer();
        if (this.isCancelling || !this.isCuePlaying) return;

        // Progress reaches cue end
        this.cueCallbacks?.onCueProgress?.(this.currentCueIndex, cue.end);

        // Advance to next cue immediately
        this.currentCueIndex++;
        this.speakCurrentCue();
      };

      utterance.onerror = (e) => {
        this.clearProgressTimer();
        if (
          this.isCancelling ||
          !this.isCuePlaying ||
          e.error === 'canceled' ||
          e.error === 'interrupted'
        ) {
          return;
        }

        console.warn('TTS cue error:', e.error);
        this.cueCallbacks?.onError?.(e);
        if (this.isCuePlaying) {
          this.currentCueIndex++;
          this.speakCurrentCue();
        }
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Failed to speak cue:', err);
      this.cueCallbacks?.onError?.(err);
    }
  }

  public seekToCueIndex(
    index: number,
    newCues?: SubtitleCue[],
    lang?: SupportedLanguage,
    rate?: number
  ): void {
    if (!this.isSupported()) return;

    if (newCues && newCues.length > 0) {
      this.activeCues = newCues;
    }
    if (lang) {
      this.currentLang = lang;
    }
    if (rate) {
      this.currentRate = rate;
    }
    if (this.activeCues.length === 0) return;

    this.currentCueIndex = Math.max(0, Math.min(index, this.activeCues.length - 1));
    this.isCuePlaying = true;
    this.clearProgressTimer();

    // Cancel currently speaking utterance and ignore its events
    this.isCancelling = true;
    window.speechSynthesis.cancel();

    if (this.seekTimeout) clearTimeout(this.seekTimeout);
    this.seekTimeout = setTimeout(() => {
      this.isCancelling = false;
      if (this.isCuePlaying) {
        this.speakCurrentCue();
      }
    }, 60);
  }

  public seekToSeconds(seconds: number): void {
    if (!this.activeCues || this.activeCues.length === 0) return;
    const targetIdx = this.activeCues.findIndex(
      (c) => seconds >= c.start && seconds <= c.end
    );
    if (targetIdx !== -1) {
      this.seekToCueIndex(targetIdx);
    } else {
      let closestIdx = 0;
      let minDiff = Infinity;
      this.activeCues.forEach((c, idx) => {
        const diff = Math.abs(c.start - seconds);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      this.seekToCueIndex(closestIdx);
    }
  }

  public setPlaybackRate(rate: number): void {
    this.currentRate = rate;
    if (this.isSpeaking && this.isCuePlaying) {
      this.seekToCueIndex(this.currentCueIndex);
    }
  }

  public pause(): void {
    if (this.isSupported()) {
      window.speechSynthesis.pause();
      this.isPaused = true;
      this.clearProgressTimer();
    }
  }

  public resume(): void {
    if (this.isSupported()) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        this.isPaused = false;
        this.cueStartTimeMs = Date.now();
        this.clearProgressTimer();
        const cue = this.activeCues[this.currentCueIndex];
        if (cue) {
          this.progressInterval = setInterval(() => {
            if (!this.isSpeaking || this.isPaused || this.isCancelling) return;
            const elapsed = ((Date.now() - this.cueStartTimeMs) / 1000) * this.currentRate;
            const cueDuration = Math.max(0.5, cue.end - cue.start);
            const progress = Math.min(cueDuration, elapsed);
            const currentTotal = Number((cue.start + progress).toFixed(2));
            this.cueCallbacks?.onCueProgress?.(this.currentCueIndex, currentTotal);
          }, 100);
        }
      } else if (!this.isSpeaking && this.isCuePlaying) {
        this.speakCurrentCue();
      }
    }
  }

  public stop(): void {
    this.isCuePlaying = false;
    this.isSpeaking = false;
    this.isPaused = false;
    this.clearProgressTimer();
    if (this.seekTimeout) {
      clearTimeout(this.seekTimeout);
      this.seekTimeout = null;
    }
    this.isCancelling = true;
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    setTimeout(() => {
      this.isCancelling = false;
    }, 60);
  }

  /**
   * Standalone speak method for single-string speech
   */
  public speak(
    text: string,
    lang: SupportedLanguage,
    playbackRate: number = 1.0,
    callbacks?: TTSCallbacks
  ): void {
    if (!this.isSupported()) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      callbacks?.onEnd?.();
      return;
    }

    this.stop();

    if (!text || text.trim() === '') {
      callbacks?.onEnd?.();
      return;
    }

    try {
      const targetLocale = langLocaleMap[lang] || 'vi-VN';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLocale;

      const baseRate = lang === 'en' ? 0.95 : 1.0;
      utterance.rate = Math.max(0.7, Math.min(2.0, playbackRate * baseRate));
      utterance.pitch = 1.0;

      const matchedVoice = this.getBestVoice(lang, targetLocale);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.isPaused = false;
        callbacks?.onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.isPaused = false;
        this.currentUtterance = null;
        callbacks?.onEnd?.();
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('SpeechSynthesis error:', e.error);
          callbacks?.onError?.(e);
        }
        this.isSpeaking = false;
        this.isPaused = false;
        this.currentUtterance = null;
      };

      utterance.onpause = () => {
        this.isPaused = true;
        callbacks?.onPause?.();
      };

      utterance.onresume = () => {
        this.isPaused = false;
        callbacks?.onResume?.();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Failed to trigger speech synthesis:', err);
      callbacks?.onError?.(err);
    }
  }
}

export const ttsService = new TTSService();
