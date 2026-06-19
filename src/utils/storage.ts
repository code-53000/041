import { getInitialSoundStates, type SoundState } from "@/data/sounds";

const STORAGE_KEY = "ambient-mixer-config";

export interface SavedConfig {
  sounds: SoundState[];
  savedAt: number;
}

export const saveConfig = (sounds: SoundState[]): void => {
  try {
    const config: SavedConfig = {
      sounds,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save config:", e);
  }
};

export const loadConfig = (): SoundState[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialSoundStates();

    const parsed = JSON.parse(raw) as SavedConfig;
    if (!parsed.sounds || !Array.isArray(parsed.sounds)) {
      return getInitialSoundStates();
    }

    const initial = getInitialSoundStates();
    return initial.map((init) => {
      const saved = parsed.sounds.find((s) => s.id === init.id);
      return saved
        ? {
            id: init.id,
            isPlaying: saved.isPlaying ?? false,
            volume: Math.min(100, Math.max(0, saved.volume ?? init.volume)),
          }
        : init;
    });
  } catch (e) {
    console.error("Failed to load config:", e);
    return getInitialSoundStates();
  }
};

export const clearConfig = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
