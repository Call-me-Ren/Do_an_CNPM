import { SupportedLanguage, SubtitleCue } from '../types';
import { resolveAssetUrl } from '../utils/assetHelper';

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
  onDurationChange?: (duration: number) => void;
  onFinish?: () => void;
  onError?: (err: any) => void;
}

class TTSService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private audioElement: HTMLAudioElement | null = null;
  private isAudioFileMode: boolean = false;
  private currentAudioUrl?: string;

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

      // Exact dialect match (e.g. vi-VN for vi-VN)
      if (vLang === target) {
        score += 80;
      }

      // STRICT SINGLE VOICE POLICY:
      // Each language has EXACTLY ONE preferred voice (Studio-quality Female Edge Natural voice).
      // Male voices and legacy robotic voices are heavily penalized to prevent random voice-switching!
      if (lang === 'vi') {
        // Vietnamese: STRICTLY HoaiMy (Edge Natural Female). Ban NamMinh (Male) & robotic voices.
        if (name.includes('hoaimy')) {
          score += 10000;
        }
        if (name.includes('namminh') || name.includes('an') || name.includes('desktop')) {
          score -= 10000;
        }
      } else if (lang === 'en') {
        // English: STRICTLY Jenny (Edge Natural Female). Ban Guy, Christopher, David, Mark, etc.
        if (name.includes('jenny')) {
          score += 10000;
        }
        if (
          name.includes('guy') ||
          name.includes('christopher') ||
          name.includes('david') ||
          name.includes('mark') ||
          name.includes('george') ||
          name.includes('stefan') ||
          name.includes('desktop')
        ) {
          score -= 10000;
        }
      } else if (lang === 'zh') {
        // Chinese: STRICTLY Xiaoxiao (Edge Natural Female). Ban male voices.
        if (name.includes('xiaoxiao')) {
          score += 10000;
        }
        if (name.includes('yunxi') || name.includes('yunjian') || name.includes('yunyang') || name.includes('desktop')) {
          score -= 10000;
        }
      } else if (lang === 'ko') {
        // Korean: STRICTLY SunHi (Edge Natural Female). Ban male voices.
        if (name.includes('sunhi')) {
          score += 10000;
        }
        if (name.includes('injoon') || name.includes('hyunsu') || name.includes('desktop')) {
          score -= 10000;
        }
      } else if (lang === 'ja') {
        // Japanese: STRICTLY Nanami (Edge Natural Female). Ban male voices.
        if (name.includes('nanami')) {
          score += 10000;
        }
        if (name.includes('keita') || name.includes('desktop')) {
          score -= 10000;
        }
      }

      // General tiering
      if (name.includes('natural') || name.includes('online')) {
        score += 800;
      }
      if (name.includes('neural') || name.includes('premium')) {
        score += 500;
      }
      if (name.includes('microsoft')) {
        score += 350;
      }
      if (name.includes('google')) {
        score += 100;
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

  private cancelSpeech(): void {
    this.clearProgressTimer();
    if (this.currentUtterance) {
      this.currentUtterance.onstart = null;
      this.currentUtterance.onend = null;
      this.currentUtterance.onerror = null;
      this.currentUtterance = null;
    }
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          window.speechSynthesis.cancel();
        }
      } catch {
        // ignore
      }
    }
  }

  public setCueCallbacks(callbacks: CueCallbacks): void {
    this.cueCallbacks = callbacks;
  }

  public playCues(
    cues: SubtitleCue[],
    startIndex: number = 0,
    lang: SupportedLanguage = 'vi',
    playbackRate: number = 1.0,
    callbacks?: CueCallbacks,
    audioUrl?: string
  ): void {
    // Strictly cancel speech synthesis and drop any previous audio track
    this.cancelSpeech();
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement.src = '';
      } catch {
        // ignore
      }
      this.audioElement = null;
    }
    this.isAudioFileMode = false;
    this.currentAudioUrl = audioUrl;

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
    this.isPaused = false;

    // 1. High-fidelity Microsoft Edge Natural Audio file playback
    if (audioUrl && typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      try {
        const resolved = resolveAssetUrl(audioUrl);
        const audio = new Audio(resolved);
        audio.preload = 'auto';
        audio.playbackRate = playbackRate;
        this.audioElement = audio;
        this.isAudioFileMode = true;
        this.isSpeaking = true;
        this.isPaused = false;

        const targetStartTime = cues[this.currentCueIndex]?.start || 0;
        if (targetStartTime > 0) {
          audio.currentTime = Math.max(0, targetStartTime - 0.05);
        }

        audio.onloadedmetadata = () => {
          if (!this.isCuePlaying || !this.isAudioFileMode) return;
          if (isFinite(audio.duration) && audio.duration > 0) {
            this.cueCallbacks?.onDurationChange?.(audio.duration);
          }
          if (targetStartTime > 0 && Math.abs(audio.currentTime - targetStartTime) > 0.5) {
            audio.currentTime = Math.max(0, targetStartTime - 0.05);
          }
        };

        if (typeof audio.play === 'function') {
          try {
            const playPromise = audio.play();
            if (playPromise !== undefined && typeof playPromise.catch === 'function') {
              playPromise.catch((err) => {
                // If autoplay is delayed or interrupted by browser gesture restriction,
                // do NOT fallback to speakCurrentCue()! Falling back triggers dual-layer voices!
                console.warn('Audio playback waiting or interrupted:', err);
              });
            }
          } catch (err) {
            console.warn('Audio play sync error:', err);
          }
        }

        audio.ontimeupdate = () => {
          if (!this.isCuePlaying || !this.isAudioFileMode) return;
          const curTime = audio.currentTime;
          if (isFinite(audio.duration) && audio.duration > 0) {
            this.cueCallbacks?.onDurationChange?.(audio.duration);
          }
          let matchedIdx = this.activeCues.findIndex(
            (c) => curTime >= c.start && curTime < c.end
          );
          if (matchedIdx === -1) {
            if (curTime >= (this.activeCues[this.activeCues.length - 1]?.end || 0)) {
              matchedIdx = this.activeCues.length - 1;
            } else {
              matchedIdx = this.currentCueIndex;
            }
          }

          if (
            matchedIdx !== this.currentCueIndex &&
            matchedIdx >= 0 &&
            matchedIdx < this.activeCues.length
          ) {
            this.currentCueIndex = matchedIdx;
            this.cueCallbacks?.onCueChange?.(matchedIdx, this.activeCues[matchedIdx]);
          }
          this.cueCallbacks?.onCueProgress?.(this.currentCueIndex, curTime);
        };

        audio.onended = () => {
          if (!this.isCuePlaying || !this.isAudioFileMode) return;
          this.isSpeaking = false;
          this.isCuePlaying = false;
          this.isPaused = false;
          const finalTime = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : audio.currentTime;
          this.cueCallbacks?.onCueProgress?.(this.activeCues.length - 1, finalTime);
          this.cueCallbacks?.onFinish?.();
        };

        audio.onerror = (e) => {
          console.warn('Audio file error on:', resolved, e);
        };

        return;
      } catch (err) {
        console.warn('Audio init error:', err);
      }
    }

    // 2. Fallback to Web Speech Synthesis ONLY if no audioUrl was provided
    if (!this.isSupported()) {
      callbacks?.onFinish?.();
      return;
    }

    if (this.seekTimeout) clearTimeout(this.seekTimeout);
    this.seekTimeout = setTimeout(() => {
      if (this.isCuePlaying && !this.isAudioFileMode && !this.audioElement) {
        this.speakCurrentCue();
      }
    }, 50);
  }

  private clearProgressTimer(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  private speakCurrentCue(): void {
    if (!this.isCuePlaying || this.isAudioFileMode || Boolean(this.audioElement)) return;

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
    rate?: number,
    audioUrl?: string
  ): void {
    if (newCues && newCues.length > 0) {
      this.activeCues = newCues;
    }
    if (lang) {
      this.currentLang = lang;
    }
    if (rate) {
      this.currentRate = rate;
    }
    const resolvedAudioUrl = audioUrl || this.currentAudioUrl;
    if (this.activeCues.length === 0) return;

    this.currentCueIndex = Math.max(0, Math.min(index, this.activeCues.length - 1));
    const cue = this.activeCues[this.currentCueIndex];

    if (this.isAudioFileMode && this.audioElement && cue) {
      // Single channel check: ensure speech synthesis is cancelled
      this.cancelSpeech();
      this.audioElement.currentTime = Math.max(0, cue.start - 0.05);
      if (rate) this.audioElement.playbackRate = rate;
      if (this.audioElement.paused) {
        this.audioElement.play().catch(console.warn);
      }
      this.isCuePlaying = true;
      this.isPaused = false;
      this.isSpeaking = true;
      this.cueCallbacks?.onCueChange?.(this.currentCueIndex, cue);
      this.cueCallbacks?.onCueProgress?.(this.currentCueIndex, cue.start);
      return;
    }

    if (resolvedAudioUrl) {
      this.playCues(
        this.activeCues,
        index,
        this.currentLang,
        this.currentRate,
        this.cueCallbacks,
        resolvedAudioUrl
      );
      return;
    }

    if (!this.isSupported()) return;

    // SpeechSynthesis fallback ONLY when no audioUrl exists
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }
    this.isAudioFileMode = false;
    this.isCuePlaying = true;
    this.isPaused = false;
    this.clearProgressTimer();
    this.cancelSpeech();

    if (this.seekTimeout) clearTimeout(this.seekTimeout);
    this.seekTimeout = setTimeout(() => {
      if (this.isCuePlaying && !this.isAudioFileMode && !this.audioElement) {
        this.speakCurrentCue();
      }
    }, 50);
  }

  public seekToSeconds(seconds: number): void {
    if (this.isAudioFileMode && this.audioElement) {
      this.cancelSpeech();
      this.audioElement.currentTime = seconds;
      if (this.audioElement.paused) {
        this.audioElement.play().catch(console.warn);
      }
      let matchedIdx = this.activeCues.findIndex(
        (c) => seconds >= c.start && seconds <= c.end
      );
      if (matchedIdx === -1 && this.activeCues.length > 0) {
        matchedIdx =
          seconds > this.activeCues[this.activeCues.length - 1].end
            ? this.activeCues.length - 1
            : 0;
      }
      if (matchedIdx !== -1) {
        this.currentCueIndex = matchedIdx;
        this.cueCallbacks?.onCueChange?.(matchedIdx, this.activeCues[matchedIdx]);
      }
      this.cueCallbacks?.onCueProgress?.(this.currentCueIndex, seconds);
      return;
    }

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
    if (this.isAudioFileMode && this.audioElement) {
      this.audioElement.playbackRate = rate;
    } else if (this.isSpeaking && this.isCuePlaying) {
      this.seekToCueIndex(this.currentCueIndex);
    }
  }

  public pause(): void {
    if (this.isAudioFileMode && this.audioElement) {
      this.audioElement.pause();
      this.isPaused = true;
      this.isSpeaking = false;
    }
    if (this.isSupported()) {
      window.speechSynthesis.pause();
      this.isPaused = true;
      this.clearProgressTimer();
    }
  }

  public resume(): void {
    if (this.isAudioFileMode && this.audioElement) {
      this.audioElement.play().catch(console.warn);
      this.isPaused = false;
      this.isSpeaking = true;
      return;
    }
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
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement.src = '';
      } catch {
        // ignore
      }
      this.audioElement = null;
    }
    this.currentAudioUrl = undefined;
    this.isAudioFileMode = false;
    this.isCuePlaying = false;
    this.isSpeaking = false;
    this.isPaused = false;
    this.clearProgressTimer();
    if (this.seekTimeout) {
      clearTimeout(this.seekTimeout);
      this.seekTimeout = null;
    }
    if (this.currentUtterance) {
      this.currentUtterance.onstart = null;
      this.currentUtterance.onend = null;
      this.currentUtterance.onerror = null;
      this.currentUtterance = null;
    }
    this.isCancelling = true;
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
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
