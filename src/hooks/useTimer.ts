import { useEffect, useRef } from "react";
import { useSoundStore } from "@/store/useSoundStore";

export const useTimer = () => {
  const tickTimer = useSoundStore((state) => state.tickTimer);
  const timerRemaining = useSoundStore((state) => state.timerRemaining);
  const isTimerRunning = useSoundStore((state) => state.isTimerRunning);
  const fadeOutAll = useSoundStore((state) => state.fadeOutAll);
  const hasFaded = useRef(false);

  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, tickTimer]);

  useEffect(() => {
    if (timerRemaining === 0 && isTimerRunning && !hasFaded.current) {
      hasFaded.current = true;
      fadeOutAll();
      setTimeout(() => {
        hasFaded.current = false;
      }, 4000);
    }
  }, [timerRemaining, isTimerRunning, fadeOutAll]);

  return null;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
