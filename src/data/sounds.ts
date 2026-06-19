import type { LucideIcon } from "lucide-react";
import {
  CloudRain,
  Waves,
  Flame,
  Coffee,
  Wind,
  Bird,
} from "lucide-react";

export interface SoundData {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  audioUrl: string;
  defaultVolume: number;
}

export const SOUNDS: SoundData[] = [
  {
    id: "rain",
    name: "细雨",
    description: "淅淅沥沥的雨声",
    icon: CloudRain,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_279f40bc34.mp3?filename=rain-on-umbrella-124475.mp3",
    defaultVolume: 60,
  },
  {
    id: "waves",
    name: "海浪",
    description: "轻柔的海浪拍岸",
    icon: Waves,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=ocean-waves-112906.mp3",
    defaultVolume: 55,
  },
  {
    id: "fire",
    name: "篝火",
    description: "温暖的篝火噼啪声",
    icon: Flame,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946b3e44d6.mp3?filename=crackling-fireplace-151706.mp3",
    defaultVolume: 50,
  },
  {
    id: "cafe",
    name: "咖啡馆",
    description: "柔和的咖啡馆环境音",
    icon: Coffee,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/10/30/audio_c8c8a73467.mp3?filename=coffee-shop-ambience-118235.mp3",
    defaultVolume: 40,
  },
  {
    id: "wind",
    name: "风声",
    description: "山间清风徐徐",
    icon: Wind,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_9c7d1b9e17.mp3?filename=wind-howling-109364.mp3",
    defaultVolume: 45,
  },
  {
    id: "birds",
    name: "鸟鸣",
    description: "清晨森林的鸟叫声",
    icon: Bird,
    audioUrl: "https://cdn.pixabay.com/download/audio/2021/09/13/audio_bb80b4afd3.mp3?filename=forest-birds-6756.mp3",
    defaultVolume: 50,
  },
];

export interface SoundState {
  id: string;
  isPlaying: boolean;
  volume: number;
}

export const getInitialSoundStates = (): SoundState[] =>
  SOUNDS.map((s) => ({
    id: s.id,
    isPlaying: false,
    volume: s.defaultVolume,
  }));
