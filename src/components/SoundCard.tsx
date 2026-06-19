import { useSoundStore } from "@/store/useSoundStore";
import { SOUNDS } from "@/data/sounds";
import { VolumeSlider } from "./VolumeSlider";
import { Volume2, Pause } from "lucide-react";

interface SoundCardProps {
  soundId: string;
  index: number;
}

export const SoundCard = ({ soundId, index }: SoundCardProps) => {
  const soundData = SOUNDS.find((s) => s.id === soundId)!;
  const soundState = useSoundStore((state) =>
    state.sounds.find((s) => s.id === soundId)
  )!;
  const toggleSound = useSoundStore((state) => state.toggleSound);
  const setVolume = useSoundStore((state) => state.setVolume);

  const Icon = soundData.icon;
  const isActive = soundState.isPlaying;

  return (
    <div
      className={`relative group transition-all duration-500 ease-out animate-fade-in-up ${
        isActive ? "scale-100" : "scale-100"
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        onClick={() => toggleSound(soundId)}
        className={`cursor-pointer select-none transition-all duration-500 p-6 rounded-2xl border backdrop-blur-xl ${
          isActive
            ? "bg-accent-500/10 border-accent-400/30 shadow-lg shadow-accent-500/10"
            : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/15"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`relative mb-4 transition-all duration-500 ${
              isActive ? "scale-110" : "scale-100"
            }`}
          >
            {isActive && (
              <div className="absolute inset-0 rounded-full bg-accent-400/20 blur-xl animate-pulse-slow" />
            )}
            <div
              className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                isActive
                  ? "bg-gradient-to-br from-accent-400 to-accent-500 text-white shadow-lg shadow-accent-500/30"
                  : "bg-white/5 text-ambient-200 group-hover:bg-white/10"
              }`}
            >
              <Icon size={26} strokeWidth={1.8} />
            </div>
          </div>

          <h3
            className={`text-base font-medium mb-1 transition-colors duration-300 ${
              isActive ? "text-white" : "text-ambient-100"
            }`}
          >
            {soundData.name}
          </h3>
          <p className="text-xs text-ambient-400 mb-4">{soundData.description}</p>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all duration-300 ${
              isActive
                ? "bg-accent-400/20 text-accent-200"
                : "bg-white/5 text-ambient-400"
            }`}
          >
            {isActive ? (
              <>
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-accent-300 rounded-full animate-pulse" style={{ height: "40%", animationDelay: "0ms" }} />
                  <span className="w-0.5 bg-accent-300 rounded-full animate-pulse" style={{ height: "80%", animationDelay: "150ms" }} />
                  <span className="w-0.5 bg-accent-300 rounded-full animate-pulse" style={{ height: "60%", animationDelay: "300ms" }} />
                  <span className="w-0.5 bg-accent-300 rounded-full animate-pulse" style={{ height: "90%", animationDelay: "450ms" }} />
                </div>
                <span>播放中</span>
              </>
            ) : (
              <>
                <Pause size={10} />
                <span>点击播放</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={`mt-4 px-2 transition-all duration-300 ${
          isActive ? "opacity-100 translate-y-0" : "opacity-60 -translate-y-1"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <VolumeSlider
          volume={soundState.volume}
          onChange={(v) => setVolume(soundId, v)}
          disabled={!isActive}
        />
      </div>
    </div>
  );
};
