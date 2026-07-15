import { useEffect, useRef } from "react";
import { useAuthStore } from "../stores/auth.store";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const CHECK_INTERVAL_MS = 60 * 1000;

export function useIdleTimeout() {
  const logout = useAuthStore((s) => s.logout);
  const touchActivity = useAuthStore((s) => s.touchActivity);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    const events = ["mousedown", "keydown", "mousemove", "touchstart", "scroll"];

    const handleActivity = () => {
      touchActivity();
    };

    events.forEach((event) => window.addEventListener(event, handleActivity));

    timerRef.current = setInterval(() => {
      const lastActivity = Number(localStorage.getItem("lastActivity") ?? "0");
      if (lastActivity && Date.now() - lastActivity > IDLE_TIMEOUT_MS) {
        logout();
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [logout, touchActivity]);
}