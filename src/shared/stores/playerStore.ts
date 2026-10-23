import { create } from 'zustand';
import { Artifact } from '../types';

interface PlayerState {
  currentArtifact: Artifact | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  showSubtitle: boolean;
  playArtifact: (artifact: Artifact) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
  toggleSubtitle: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentArtifact: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1.0,
  showSubtitle: true,

  playArtifact: (artifact) => {
    set({
      currentArtifact: artifact,
      isPlaying: true,
      currentTime: 0,
    });
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  stop: () => set({ isPlaying: false, currentTime: 0 }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  toggleSubtitle: () => set({ showSubtitle: !get().showSubtitle }),
}));
