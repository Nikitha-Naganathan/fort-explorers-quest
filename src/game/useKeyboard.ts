import { useEffect, useRef } from "react";

export type KeyMap = Record<string, boolean>;

/** Tracks raw key state in a ref so the render loop never re-renders on input. */
export function useKeyboard(enabled: boolean) {
  const keys = useRef<KeyMap>({});

  useEffect(() => {
    if (!enabled) {
      keys.current = {};
      return;
    }
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    const blur = () => {
      keys.current = {};
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, [enabled]);

  return keys;
}
