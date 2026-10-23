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
    return window.speechSynthesis.getVoices();
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
      utterance.rate = Math.max(0.7, Math.min(2.0, playbackRate));
      utterance.pitch = 1.0;

      // Find matching voice for target language
      const voices = this.getVoices();
      const matchedVoice = voices.find(
        (v) =>
          v.lang === targetLocale ||
          v.lang.replace('_', '-').toLowerCase() === targetLocale.toLowerCase() ||
          v.lang.toLowerCase().startsWith(targetLocale.split('-')[0])
      );

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
