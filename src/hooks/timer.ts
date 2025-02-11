import { useEffect, useRef, useState } from "react";

export default function useTimer() {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const startTimeRef = useRef<number>(0);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (timerIdRef.current) return;
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    } else {
      startTimeRef.current = Date.now() - currentTime;
    }
    timerIdRef.current = setInterval(() => {
      setCurrentTime(Date.now() - startTimeRef.current);
    }, 100);
  };

  const stop = () => {
    if (!timerIdRef.current) return;
    clearInterval(timerIdRef.current);
    timerIdRef.current = null;
  };

  const reset = () => {
    stop();
    setCurrentTime(0);
    startTimeRef.current = 0;
  };

  useEffect(() => {
    return () => reset();
  }, []);

  return { currentTime, start, stop, reset };
}
