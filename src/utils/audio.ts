export interface AudioInstance {
  audio: HTMLAudioElement;
  gainNode: GainNode;
  source: MediaElementAudioSourceNode;
  audioContext: AudioContext;
}

const audioContextCache: AudioContext | null = null;

export const getAudioContext = (): AudioContext => {
  if (!(window as any).__ambientAudioContext) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    (window as any).__ambientAudioContext = new AudioCtx();
  }
  return (window as any).__ambientAudioContext;
};

export const createAudioInstance = (url: string, volume: number): AudioInstance => {
  const audio = new Audio(url);
  audio.crossOrigin = "anonymous";
  audio.loop = true;
  audio.preload = "auto";

  const audioContext = getAudioContext();
  const source = audioContext.createMediaElementSource(audio);
  const gainNode = audioContext.createGain();
  
  gainNode.gain.value = volume / 100;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  return { audio, gainNode, source, audioContext };
};

export const playAudio = async (instance: AudioInstance): Promise<void> => {
  try {
    if (instance.audioContext.state === "suspended") {
      await instance.audioContext.resume();
    }
    instance.audio.currentTime = 0;
    await instance.audio.play();
  } catch (e) {
    console.error("Failed to play audio:", e);
  }
};

export const stopAudio = async (instance: AudioInstance): Promise<void> => {
  try {
    instance.audio.pause();
    instance.audio.currentTime = 0;
  } catch (e) {
    console.error("Failed to stop audio:", e);
  }
};

export const setVolume = (instance: AudioInstance, volume: number): void => {
  const normalizedVolume = Math.min(1, Math.max(0, volume / 100));
  instance.gainNode.gain.setValueAtTime(normalizedVolume, instance.audioContext.currentTime);
};

export const fadeOut = async (
  instance: AudioInstance,
  duration: number = 3000
): Promise<void> => {
  return new Promise((resolve) => {
    const startVolume = instance.gainNode.gain.value;
    const startTime = instance.audioContext.currentTime;
    const endTime = startTime + duration / 1000;

    instance.gainNode.gain.setValueAtTime(startVolume, startTime);
    instance.gainNode.gain.linearRampToValueAtTime(0, endTime);

    const checkFadeComplete = () => {
      if (instance.audioContext.currentTime >= endTime) {
        instance.audio.pause();
        instance.audio.currentTime = 0;
        resolve();
      } else {
        requestAnimationFrame(checkFadeComplete);
      }
    };
    checkFadeComplete();
  });
};

export const fadeIn = async (
  instance: AudioInstance,
  targetVolume: number,
  duration: number = 1500
): Promise<void> => {
  return new Promise((resolve) => {
    const normalizedTarget = Math.min(1, Math.max(0, targetVolume / 100));
    const startTime = instance.audioContext.currentTime;
    const endTime = startTime + duration / 1000;

    instance.gainNode.gain.setValueAtTime(0, startTime);
    instance.gainNode.gain.linearRampToValueAtTime(normalizedTarget, endTime);

    if (instance.audioContext.state === "suspended") {
      instance.audioContext.resume();
    }
    instance.audio.play().catch(() => {});

    const checkFadeComplete = () => {
      if (instance.audioContext.currentTime >= endTime) {
        resolve();
      } else {
        requestAnimationFrame(checkFadeComplete);
      }
    };
    checkFadeComplete();
  });
};

export const cleanupAudio = (instance: AudioInstance): void => {
  try {
    instance.audio.pause();
    instance.source.disconnect();
    instance.gainNode.disconnect();
    instance.audio.src = "";
  } catch (e) {
    console.error("Failed to cleanup audio:", e);
  }
};
