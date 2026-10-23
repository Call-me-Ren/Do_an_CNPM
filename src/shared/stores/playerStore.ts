import { create } from 'zustand';
import { Artifact } from '../types';
import { ttsService } from '../services/tts';

interface PlayerState {
  currentArtifact: Artifact | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  showSubtitle: boolean;
  startCueIndex: number;
  playArtifact: (artifact: Artifact, startCueIndex?: number, startTime?: number) => void;
  seekToCue: (
    index: number,
    startTime: number,
    cues?: any,
    lang?: any,
    rate?: any
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

  playArtifact: (artifact, startCueIndex = 0, startTime = 0) => {
    set({
      currentArtifact: artifact,
      isPlaying: true,
      currentTime: startTime,
      startCueIndex,
      showSubtitle: true,
    });
  },

  seekToCue: (index, startTime, cues, lang, rate) => {
    set({
      isPlaying: true,
      currentTime: startTime,
      startCueIndex: index,
    });
    ttsService.seekToCueIndex(index, cues, lang, rate);
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
