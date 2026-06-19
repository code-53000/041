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
    audioUrl: "/sounds/mixkit-light-rain-loop-2393.wav",
    defaultVolume: 60,
  },
  {
    id: "waves",
    name: "海浪",
    description: "轻柔的海浪拍岸",
    icon: Waves,
    audioUrl: "/sounds/mixkit-big-thunder-with-rain-1291.wav",
    defaultVolume: 55,
  },
  {
    id: "fire",
    name: "篝火",
    description: "温暖的篝火噼啪声",
    icon: Flame,
    audioUrl: "/sounds/mixkit-big-thunder-with-rain-1291.wav",
    defaultVolume: 50,
  },
  {
    id: "cafe",
    name: "咖啡馆",
    description: "柔和的咖啡馆环境音",
    icon: Coffee,
    audioUrl: "/sounds/mixkit-light-rain-loop-2393.wav",
    defaultVolume: 40,
  },
  {
    id: "wind",
    name: "风声",
    description: "山间清风徐徐",
    icon: Wind,
    audioUrl: "/sounds/mixkit-big-thunder-with-rain-1291.wav",
    defaultVolume: 45,
  },
  {
    id: "birds",
    name: "鸟鸣",
    description: "清晨森林的鸟叫声",
    icon: Bird,
    audioUrl: "/sounds/mixkit-light-rain-loop-2393.wav",
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
