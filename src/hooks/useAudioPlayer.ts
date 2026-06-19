import { useEffect, useRef, useCallback } from "react";
import { SOUNDS } from "@/data/sounds";
import { useSoundStore } from "@/store/useSoundStore";
import {
  createAudioInstance,
  fadeIn,
  fadeOut,
  setVolume,
  cleanupAudio,
  type AudioInstance,
} from "@/utils/audio";

export const useAudioPlayer = () => {
  const audioInstances = useRef<Map<string, AudioInstance>>(new Map());
  const sounds = useSoundStore((state) => state.sounds);
  const fadeOutAll = useSoundStore((state) => state.fadeOutAll);

  const getOrCreateInstance = useCallback((id: string): AudioInstance => {
    if (!audioInstances.current.has(id)) {
      const soundData = SOUNDS.find((s) => s.id === id);
      if (!soundData) throw new Error(`Sound not found: ${id}`);
      const soundState = sounds.find((s) => s.id === id);
      const instance = createAudioInstance(
        soundData.audioUrl,
        soundState?.volume ?? soundData.defaultVolume
      );
      audioInstances.current.set(id, instance);
    }
    return audioInstances.current.get(id)!;
  }, [sounds]);

  useEffect(() => {
    sounds.forEach((sound) => {
      try {
        const instance = getOrCreateInstance(sound.id);
        setVolume(instance, sound.volume);

        if (sound.isPlaying && instance.audio.paused) {
          fadeIn(instance, sound.volume, 800);
        }
      } catch (e) {
        console.error(`Error handling sound ${sound.id}:`, e);
      }
    });

    const activeIds = new Set(sounds.filter((s) => s.isPlaying).map((s) => s.id));
    audioInstances.current.forEach((instance, id) => {
      if (!activeIds.has(id) && !instance.audio.paused) {
        fadeOut(instance, 800);
      }
    });
  }, [sounds, getOrCreateInstance]);

  useEffect(() => {
    return () => {
      audioInstances.current.forEach((instance) => cleanupAudio(instance));
      audioInstances.current.clear();
    };
  }, []);

  return { fadeOutAll };
};
