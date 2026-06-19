import { create } from "zustand";
import {
  getInitialSoundStates,
  type SoundState,
  SOUNDS,
} from "@/data/sounds";
import { loadFullConfig, saveFullConfig } from "@/utils/storage";

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

const persist = (partial: Partial<SoundStore>, state: SoundStore) => {
  const merged = { ...state, ...partial };
  saveFullConfig({
    sounds: merged.sounds,
    previousActiveSounds: merged.previousActiveSounds,
    isGlobalPlaying: merged.isGlobalPlaying,
  });
};

const initialConfig = loadFullConfig();
const initialSounds = initialConfig.sounds.length > 0
  ? initialConfig.sounds
  : getInitialSoundStates();
const hasAnySelected = initialSounds.some((s) => s.isPlaying);

export const useSoundStore = create<SoundStore>((set, get) => ({
  sounds: initialSounds,
  previousActiveSounds: initialConfig.previousActiveSounds,
  isGlobalPlaying: initialConfig.isGlobalPlaying && hasAnySelected,
  timerMinutes: 0,
  timerRemaining: 0,
  isTimerRunning: false,

  toggleSound: (id: string) => {
    set((state) => {
      const sounds = state.sounds.map((s) =>
        s.id === id ? { ...s, isPlaying: !s.isPlaying } : s
      );
      const anyPlaying = sounds.some((s) => s.isPlaying);
      const next = {
        sounds,
        isGlobalPlaying: anyPlaying,
      };
      persist(next, state);
      return next;
    });
  },

  setVolume: (id: string, volume: number) => {
    set((state) => {
      const sounds = state.sounds.map((s) =>
        s.id === id ? { ...s, volume: Math.min(100, Math.max(0, volume)) } : s
      );
      const next = { sounds };
      persist(next, state);
      return next;
    });
  },

  toggleGlobalPlay: () => {
    set((state) => {
      if (state.isGlobalPlaying) {
        const previous = state.sounds.filter((s) => s.isPlaying).map((s) => s.id);
        const sounds = state.sounds.map((s) => ({ ...s, isPlaying: false }));
        const next = {
          sounds,
          isGlobalPlaying: false,
          previousActiveSounds: previous,
        };
        persist(next, state);
        return next;
      } else {
        const currentlySelected = state.sounds
          .filter((s) => s.isPlaying)
          .map((s) => s.id);

        const toActivate =
          state.previousActiveSounds.length > 0
            ? state.previousActiveSounds
            : currentlySelected.length > 0
            ? currentlySelected
            : [SOUNDS[0].id];

        const sounds = state.sounds.map((s) => ({
          ...s,
          isPlaying: toActivate.includes(s.id),
        }));
        const next = {
          sounds,
          isGlobalPlaying: true,
          previousActiveSounds: [],
        };
        persist(next, state);
        return next;
      }
    });
  },

  stopAllSounds: () => {
    set((state) => {
      const previous = state.sounds.filter((s) => s.isPlaying).map((s) => s.id);
      const sounds = state.sounds.map((s) => ({ ...s, isPlaying: false }));
      const next = {
        sounds,
        isGlobalPlaying: false,
        previousActiveSounds: previous,
      };
      persist(next, state);
      return next;
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
    const next = {
      sounds,
      isGlobalPlaying: false,
      previousActiveSounds: previous,
      isTimerRunning: false,
      timerRemaining: 0,
    };
    persist(next, state);
    set(next);
  },
}));
