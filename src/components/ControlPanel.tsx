import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useSoundStore } from "@/store/useSoundStore";
import { TimerSelector } from "./TimerSelector";

export const ControlPanel = () => {
  const isGlobalPlaying = useSoundStore((state) => state.isGlobalPlaying);
  const toggleGlobalPlay = useSoundStore((state) => state.toggleGlobalPlay);
  const sounds = useSoundStore((state) => state.sounds);
  const activeCount = sounds.filter((s) => s.isPlaying).length;

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-4 w-full animate-fade-in-up" style={{ animationDelay: "500ms" }}>
      <div className="glass-card p-6 flex-1 flex items-center justify-center gap-6">
        <button
          onClick={toggleGlobalPlay}
          className={`relative btn-icon w-20 h-20 rounded-full transition-all duration-500 ${
            isGlobalPlaying
              ? "bg-gradient-to-br from-accent-400 to-accent-600 text-white shadow-xl shadow-accent-500/30 hover:shadow-accent-500/50 animate-glow"
              : "bg-white/10 text-ambient-200 hover:bg-white/15 border border-white/10"
          }`}
        >
          {isGlobalPlaying ? (
            <Pause size={32} strokeWidth={2} />
          ) : (
            <Play size={32} strokeWidth={2} className="ml-1" />
          )}
          {isGlobalPlaying && (
            <span className="absolute inset-0 rounded-full bg-accent-400/20 animate-ping opacity-20" />
          )}
        </button>

        <div className="flex flex-col">
          <span className="text-2xl font-display text-white mb-1">
            {isGlobalPlaying ? "播放中" : "已暂停"}
          </span>
          <div className="flex items-center gap-2 text-sm text-ambient-400">
            {isGlobalPlaying ? (
              <>
                <div className="flex items-end gap-0.5 h-4">
                  <span className="w-0.5 bg-accent-400 rounded-full animate-pulse" style={{ height: "40%", animationDelay: "0ms" }} />
                  <span className="w-0.5 bg-accent-400 rounded-full animate-pulse" style={{ height: "70%", animationDelay: "100ms" }} />
                  <span className="w-0.5 bg-accent-400 rounded-full animate-pulse" style={{ height: "50%", animationDelay: "200ms" }} />
                  <span className="w-0.5 bg-accent-400 rounded-full animate-pulse" style={{ height: "80%", animationDelay: "300ms" }} />
                  <span className="w-0.5 bg-accent-400 rounded-full animate-pulse" style={{ height: "60%", animationDelay: "400ms" }} />
                </div>
                <span className="text-accent-300">{activeCount} 个音效正在播放</span>
              </>
            ) : (
              <>
                <VolumeX size={14} />
                <span>点击开始你的氛围之旅</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="lg:w-96">
        <TimerSelector />
      </div>
    </div>
  );
};
