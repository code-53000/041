import { useEffect, useRef } from "react";
import { useSoundStore } from "@/store/useSoundStore";

export const useTimer = () => {
  const tickTimer = useSoundStore((state) => state.tickTimer);
  const timerRemaining = useSoundStore((state) => state.timerRemaining);
  const isTimerRunning = useSoundStore((state) => state.isTimerRunning);
  const fadeOutAll = useSoundStore((state) => state.fadeOutAll);
  const hasFaded = useRef(false);
  const prevTimerRemaining = useRef<number>(timerRemaining);

  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, tickTimer]);

  useEffect(() => {
    const justReachedZero =
      prevTimerRemaining.current > 0 && timerRemaining === 0;

    if (justReachedZero && !hasFaded.current) {
      hasFaded.current = true;
      fadeOutAll();
      setTimeout(() => {
        hasFaded.current = false;
      }, 4000);
    }

    prevTimerRemaining.current = timerRemaining;
  }, [timerRemaining, fadeOutAll]);

  return null;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
