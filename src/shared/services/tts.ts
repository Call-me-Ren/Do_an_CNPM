import { SupportedLanguage } from '../types';

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

class TTSService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];

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

    // Cancel any previous speech
    this.stop();

    if (!text || text.trim() === '') {
      callbacks?.onEnd?.();
      return;
    }

    try {
      const targetLocale = langLocaleMap[lang] || 'vi-VN';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLocale;

      // Smooth, natural pacing for museum audio guide
      const baseRate = lang === 'en' ? 0.95 : 1.0;
      utterance.rate = Math.max(0.7, Math.min(2.0, playbackRate * baseRate));
      utterance.pitch = 1.0;

      // Select best natural voice
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
        // 'canceled' or 'interrupted' errors happen on stop/re-trigger
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

      if (callbacks?.onBoundary) {
        utterance.onboundary = (e) => {
          callbacks.onBoundary?.(e.charIndex, text);
        };
      }

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Failed to trigger speech synthesis:', err);
      callbacks?.onError?.(err);
    }
  }

  public pause(): void {
    if (this.isSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      this.isPaused = true;
    }
  }

  public resume(): void {
    if (this.isSupported() && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
    }
  }

  public stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
    }
  }
}

export const ttsService = new TTSService();
