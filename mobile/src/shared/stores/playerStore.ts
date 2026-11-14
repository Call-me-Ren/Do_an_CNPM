import { create } from 'zustand';
import { Artifact } from '../types';
import { museumMobileApi } from '../services/api';
import { useLangStore } from './langStore';

interface PlayerState {
  currentArtifact: Artifact | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  showSubtitle: boolean;
  /** Yêu cầu tua tới giây cụ thể (AudioPlayerBar lắng nghe và thực hiện seekTo) */
  seekTarget: { time: number; seq: number } | null;

  playArtifact: (artifact: Artifact, startTime?: number, autoShowSubtitle?: boolean) => void;
  seekToTime: (time: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
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
  seekTarget: null,

  playArtifact: (artifact, startTime = 0, autoShowSubtitle = true) => {
    const lang = useLangStore.getState().currentLang;
    const prevSeq = get().seekTarget?.seq ?? 0;
    set({
      currentArtifact: artifact,
      isPlaying: true,
      currentTime: startTime,
      showSubtitle: autoShowSubtitle,
      seekTarget: startTime > 0 ? { time: startTime, seq: prevSeq + 1 } : null,
    });

    const title = artifact.title?.[lang] || artifact.title?.vi || artifact.code;
    museumMobileApi.trackListen(artifact.id, artifact.code, title, lang);
    museumMobileApi.sendHeartbeat(lang, artifact.id, title);
  },

  seekToTime: (time) => {
    const prevSeq = get().seekTarget?.seq ?? 0;
    set({
      isPlaying: true,
      currentTime: time,
      seekTarget: { time, seq: prevSeq + 1 },
    });
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  stop: () =>
    set({
      currentArtifact: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      showSubtitle: false,
      seekTarget: null,
    }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  toggleSubtitle: () => set({ showSubtitle: !get().showSubtitle }),
  setShowSubtitle: (showSubtitle) => set({ showSubtitle }),
}));
