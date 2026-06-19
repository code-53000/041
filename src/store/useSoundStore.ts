import { create } from "zustand";
import {
  getInitialSoundStates,
  type SoundState,
  SOUNDS,
} from "@/data/sounds";
import { loadConfig, saveConfig } from "@/utils/storage";

export const TIMER_OPTIONS = [0, 15, 30, 60, 90] as const;
export type TimerOption = (typeof TIMER_OPTIONS)[number];

interface SoundStore {
  sounds: SoundState[];
  previousActiveSounds: string[];
  isGlobalPlaying: boolean;
  timerMinutes: TimerOption;
  timerRemaining: number;
  isTimerRunning: boolean;

  toggleSound: (id: string) => void;
  setVolume: (id: string, volume: number) => void;
  toggleGlobalPlay: () => void;
  stopAllSounds: () => void;
  setTimer: (minutes: TimerOption) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  fadeOutAll: () => void;
}

export const useSoundStore = create<SoundStore>((set, get) => ({
  sounds: loadConfig(),
  previousActiveSounds: [],
  isGlobalPlaying: false,
  timerMinutes: 0,
  timerRemaining: 0,
  isTimerRunning: false,

  toggleSound: (id: string) => {
    set((state) => {
      const sounds = state.sounds.map((s) =>
        s.id === id ? { ...s, isPlaying: !s.isPlaying } : s
      );
      const anyPlaying = sounds.some((s) => s.isPlaying);
      saveConfig(sounds);
      return {
        sounds,
        isGlobalPlaying: anyPlaying,
      };
    });
  },

  setVolume: (id: string, volume: number) => {
    set((state) => {
      const sounds = state.sounds.map((s) =>
        s.id === id ? { ...s, volume: Math.min(100, Math.max(0, volume)) } : s
      );
      saveConfig(sounds);
      return { sounds };
    });
  },

  toggleGlobalPlay: () => {
    set((state) => {
      if (state.isGlobalPlaying) {
        const previous = state.sounds.filter((s) => s.isPlaying).map((s) => s.id);
        const sounds = state.sounds.map((s) => ({ ...s, isPlaying: false }));
        saveConfig(sounds);
        return {
          sounds,
          isGlobalPlaying: false,
          previousActiveSounds: previous,
        };
      } else {
        const toActivate =
          state.previousActiveSounds.length > 0
            ? state.previousActiveSounds
            : [SOUNDS[0].id];
        const sounds = state.sounds.map((s) => ({
          ...s,
          isPlaying: toActivate.includes(s.id),
        }));
        saveConfig(sounds);
        return {
          sounds,
          isGlobalPlaying: true,
          previousActiveSounds: [],
        };
      }
    });
  },

  stopAllSounds: () => {
    set((state) => {
      const previous = state.sounds.filter((s) => s.isPlaying).map((s) => s.id);
      const sounds = state.sounds.map((s) => ({ ...s, isPlaying: false }));
      saveConfig(sounds);
      return {
        sounds,
        isGlobalPlaying: false,
        previousActiveSounds: previous,
      };
    });
  },

  setTimer: (minutes: TimerOption) => {
    set({
      timerMinutes: minutes,
      timerRemaining: minutes * 60,
      isTimerRunning: false,
    });
  },

  startTimer: () => {
    const { timerRemaining } = get();
    if (timerRemaining <= 0) return;
    set({ isTimerRunning: true });
  },

  pauseTimer: () => {
    set({ isTimerRunning: false });
  },

  resetTimer: () => {
    set((state) => ({
      timerRemaining: state.timerMinutes * 60,
      isTimerRunning: false,
    }));
  },

  tickTimer: () => {
    set((state) => {
      if (!state.isTimerRunning) return state;
      const newRemaining = Math.max(0, state.timerRemaining - 1);
      if (newRemaining <= 0) {
        return {
          timerRemaining: 0,
          isTimerRunning: false,
        };
      }
      return { timerRemaining: newRemaining };
    });
  },

  fadeOutAll: () => {
    const state = get();
    const previous = state.sounds.filter((s) => s.isPlaying).map((s) => s.id);
    const sounds = state.sounds.map((s) => ({ ...s, isPlaying: false }));
    saveConfig(sounds);
    set({
      sounds,
      isGlobalPlaying: false,
      previousActiveSounds: previous,
      isTimerRunning: false,
      timerRemaining: 0,
    });
  },
}));
