import { getInitialSoundStates, type SoundState } from "@/data/sounds";

const STORAGE_KEY = "ambient-mixer-config";

export interface SavedConfig {
  sounds: SoundState[];
  previousActiveSounds: string[];
  isGlobalPlaying: boolean;
  savedAt: number;
}

export const saveFullConfig = (config: {
  sounds: SoundState[];
  previousActiveSounds: string[];
  isGlobalPlaying: boolean;
}): void => {
  try {
    const fullConfig: SavedConfig = {
      ...config,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullConfig));
  } catch (e) {
    console.error("Failed to save config:", e);
  }
};

export const saveConfig = (sounds: SoundState[]): void => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing = raw ? (JSON.parse(raw) as Partial<SavedConfig>) : {};
    const config: SavedConfig = {
      sounds,
      previousActiveSounds: existing.previousActiveSounds ?? [],
      isGlobalPlaying: existing.isGlobalPlaying ?? false,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save config:", e);
  }
};

export interface LoadedConfig {
  sounds: SoundState[];
  previousActiveSounds: string[];
  isGlobalPlaying: boolean;
}

export const loadFullConfig = (): LoadedConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        sounds: getInitialSoundStates(),
        previousActiveSounds: [],
        isGlobalPlaying: false,
      };
    }

    const parsed = JSON.parse(raw) as SavedConfig;
    if (!parsed.sounds || !Array.isArray(parsed.sounds)) {
      return {
        sounds: getInitialSoundStates(),
        previousActiveSounds: [],
        isGlobalPlaying: false,
      };
    }

    const initial = getInitialSoundStates();
    const sounds = initial.map((init) => {
      const saved = parsed.sounds.find((s) => s.id === init.id);
      return saved
        ? {
            id: init.id,
            isPlaying: false,
            volume: Math.min(100, Math.max(0, saved.volume ?? init.volume)),
          }
        : init;
    });

    const previouslyPlaying = parsed.sounds
      .filter((s) => s.isPlaying)
      .map((s) => s.id);

    return {
      sounds,
      previousActiveSounds: previouslyPlaying.length > 0
        ? previouslyPlaying
        : Array.isArray(parsed.previousActiveSounds)
          ? parsed.previousActiveSounds
          : [],
      isGlobalPlaying: false,
    };
  } catch (e) {
    console.error("Failed to load config:", e);
    return {
      sounds: getInitialSoundStates(),
      previousActiveSounds: [],
      isGlobalPlaying: false,
    };
  }
};

export const loadConfig = (): SoundState[] => {
  return loadFullConfig().sounds;
};

export const clearConfig = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
