import { useEffect, useRef, useState } from "react";

export default function useTimer() {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const startTimeRef = useRef<number>(0);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (timerIdRef.current) return;
    startTimeRef.current = Date.now() - currentTime;
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
    start();
    setCurrentTime(0);
  };

  useEffect(() => {
    return () => stop(); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  return { currentTime, start, stop, reset };
}
