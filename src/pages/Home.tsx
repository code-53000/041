import { SoundCard } from "@/components/SoundCard";
import { ControlPanel } from "@/components/ControlPanel";
import { SOUNDS } from "@/data/sounds";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useTimer } from "@/hooks/useTimer";
import { Headphones, Sparkles } from "lucide-react";

export default function Home() {
  useAudioPlayer();
  useTimer();

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <div className="absolute inset-0 noise-bg opacity-[0.03] pointer-events-none" />
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-breathe pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-breathe pointer-events-none" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-6xl">
        <header className="text-center mb-10 sm:mb-14 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles size={14} className="text-accent-300" />
            <span className="text-xs text-ambient-300 tracking-wide">营造你的专属氛围</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-4 text-balance">
            环境音
            <span className="bg-gradient-to-r from-accent-300 to-accent-400 bg-clip-text text-transparent"> 混音器</span>
          </h1>
          
          <p className="text-ambient-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            混合自然之声，创造属于你的宁静空间
            <br />
            <span className="text-ambient-500 text-sm">专注、放松、入眠 — 由你决定</span>
          </p>
        </header>

        <section className="mb-10 sm:mb-12">
          <ControlPanel />
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <Headphones size={16} className="text-ambient-400" />
            <h2 className="text-sm font-medium text-ambient-300 tracking-wide uppercase">选择你的声音</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {SOUNDS.map((sound, index) => (
              <SoundCard key={sound.id} soundId={sound.id} index={index} />
            ))}
          </div>
        </section>

        <footer className="mt-16 sm:mt-20 text-center animate-fade-in" style={{ animationDelay: "800ms" }}>
          <p className="text-xs text-ambient-600">
            点击卡片播放 · 调节音量滑块 · 组合喜欢的声音
          </p>
          <p className="text-xs text-ambient-700 mt-2">
            你的配置将自动保存在本地
          </p>
        </footer>
      </div>
    </div>
  );
}
