import { create } from 'zustand';
import { Artifact, SupportedLanguage, SubtitleCue } from '../types';
import { ttsService } from '../services/tts';
import { analyticsService } from '../services/analytics';
import { useLangStore } from './langStore';

interface PlayerState {
  currentArtifact: Artifact | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  showSubtitle: boolean;
  startCueIndex: number;
  playArtifact: (
    artifact: Artifact,
    startCueIndex?: number,
    startTime?: number,
    autoShowSubtitle?: boolean
  ) => void;
  seekToCue: (
    index: number,
    startTime: number,
    artifact?: Artifact,
    cues?: SubtitleCue[],
    lang?: SupportedLanguage,
    rate?: number
  ) => void;
  seekToTime: (time: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
  toggleSubtitle: () => void;
  setShowSubtitle: (show: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentArtifact: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1.0,
  showSubtitle: true,
  startCueIndex: 0,

  playArtifact: (artifact, startCueIndex = 0, startTime = 0, autoShowSubtitle = true) => {
    const lang = useLangStore.getState().currentLang;
    set({
      currentArtifact: artifact,
      isPlaying: true,
      currentTime: startTime,
      startCueIndex,
      showSubtitle: autoShowSubtitle,
    });
    analyticsService.trackListen(
      artifact.id,
      artifact.code,
      artifact.title?.[lang] || artifact.title?.['vi'] || artifact.code,
      lang
    );
  },

  seekToCue: (index, startTime, artifact, cues, lang, rate) => {
    const art = artifact || get().currentArtifact;
    const currentLang: SupportedLanguage = lang || useLangStore.getState().currentLang || 'vi';
    const currentRate = rate || get().playbackRate;
    const subtitleList =
      cues && cues.length > 0
        ? cues
        : art?.subtitles?.[currentLang] || art?.subtitles?.['vi'] || [];

    set({
      currentArtifact: art,
      isPlaying: true,
      currentTime: startTime,
      startCueIndex: index,
      showSubtitle: true,
    });

    if (art) {
      analyticsService.sendHeartbeat(
        art.id,
        art.title?.[currentLang] || art.title?.['vi'] || art.code,
        currentLang
      );
    }

    ttsService.seekToCueIndex(index, subtitleList, currentLang, currentRate);
  },

  seekToTime: (time) => {
    set({
      isPlaying: true,
      currentTime: time,
    });
    ttsService.seekToSeconds(time);
  },

  pause: () => {
    ttsService.pause();
    set({ isPlaying: false });
  },

  resume: () => {
    ttsService.resume();
    set({ isPlaying: true });
  },

  stop: () => {
    ttsService.stop();
    set({
      currentArtifact: null,
      isPlaying: false,
      currentTime: 0,
      startCueIndex: 0,
      showSubtitle: false
    });
  },

  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setPlaybackRate: (playbackRate) => {
    ttsService.setPlaybackRate(playbackRate);
    set({ playbackRate });
  },
  toggleSubtitle: () => set({ showSubtitle: !get().showSubtitle }),
  setShowSubtitle: (showSubtitle) => set({ showSubtitle }),
}));
