import { Clock, Pause, Play, RotateCcw, X } from "lucide-react";
import { TIMER_OPTIONS, useSoundStore, type TimerOption } from "@/store/useSoundStore";
import { formatTime } from "@/hooks/useTimer";

export const TimerSelector = () => {
  const timerMinutes = useSoundStore((state) => state.timerMinutes);
  const timerRemaining = useSoundStore((state) => state.timerRemaining);
  const isTimerRunning = useSoundStore((state) => state.isTimerRunning);
  const setTimer = useSoundStore((state) => state.setTimer);
  const startTimer = useSoundStore((state) => state.startTimer);
  const pauseTimer = useSoundStore((state) => state.pauseTimer);
  const resetTimer = useSoundStore((state) => state.resetTimer);

  const hasTimer = timerMinutes > 0;

  if (!hasTimer) {
    return (
      <div className="glass-card p-4 animate-fade-in">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-ambient-300" />
          <span className="text-sm text-ambient-200 font-medium">睡眠定时器</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {TIMER_OPTIONS.filter((t) => t > 0).map((minutes) => (
            <button
              key={minutes}
              onClick={() => {
                setTimer(minutes as TimerOption);
                startTimer();
              }}
              className="btn-icon px-4 py-2 text-sm bg-white/5 hover:bg-white/10 text-ambient-200 border border-white/10 hover:border-white/20"
            >
              {minutes} 分钟
            </button>
          ))}
        </div>
      </div>
    );
  }

  const progress = timerMinutes > 0 ? (timerRemaining / (timerMinutes * 60)) * 100 : 0;

  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-accent-300" />
          <span className="text-sm text-ambient-200 font-medium">
            {timerMinutes} 分钟后停止
          </span>
          {isTimerRunning && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
          )}
        </div>
        <button
          onClick={() => setTimer(0)}
          className="btn-icon p-1.5 text-ambient-400 hover:text-ambient-200 hover:bg-white/10"
          title="清除定时器"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="url(#timerGradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 28}
              strokeDashoffset={2 * Math.PI * 28 * (1 - progress / 100)}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#5eead4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-mono font-medium text-ambient-100">
              {formatTime(timerRemaining)}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {isTimerRunning ? (
            <button
              onClick={pauseTimer}
              className="btn-icon p-3 bg-accent-500/20 text-accent-300 hover:bg-accent-500/30 border border-accent-400/30"
              title="暂停"
            >
              <Pause size={18} />
            </button>
          ) : (
            <button
              onClick={startTimer}
              disabled={timerRemaining <= 0}
              className="btn-icon p-3 bg-accent-500/20 text-accent-300 hover:bg-accent-500/30 border border-accent-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
              title="开始"
            >
              <Play size={18} />
            </button>
          )}
          <button
            onClick={resetTimer}
            className="btn-icon p-3 bg-white/5 text-ambient-300 hover:bg-white/10 border border-white/10"
            title="重置"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
