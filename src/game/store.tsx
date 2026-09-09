import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ARCHETYPE_BY_ID } from "./content";
import type { ArchetypeId, Overlay, SaveState, Stats, TaskId } from "./types";

const SAVE_KEY = "beyond-the-bastions:save:v1";

const EMPTY: SaveState = {
  screen: "title",
  level: 1,
  character: null,
  tasks: {},
  codex: [],
  wallsHeld: 0,
  drillScore: 0,
};

interface GameApi {
  state: SaveState;
  overlay: Overlay;
  hasSave: boolean;
  toast: string | null;
  setOverlay: (o: Overlay) => void;
  closeOverlay: () => void;
  goTitle: () => void;
  startNew: () => void;
  continueGame: () => void;
  createCharacter: (name: string, archetype: ArchetypeId) => void;
  unlockCodex: (ids: string[]) => void;
  completeTask: (id: TaskId) => void;
  addStat: (stat: keyof Stats, amount: number) => void;
  setDrillScore: (n: number) => void;
  setWallsHeld: (n: number) => void;
  advanceLevel: (level: 1 | 2 | 3) => void;
  resetSave: () => void;
}

const GameContext = createContext<GameApi | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SaveState>(EMPTY);
  const [overlay, setOverlay] = useState<Overlay>({ kind: "none" });
  const [stored, setStored] = useState<SaveState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) setStored({ ...EMPTY, ...(JSON.parse(raw) as SaveState) });
    } catch {
      /* ignore unreadable save */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !state.character) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const api = useMemo<GameApi>(() => {
    const unlockCodex = (ids: string[]) => {
      setState((s) => {
        const fresh = ids.filter((id) => !s.codex.includes(id));
        if (fresh.length === 0) return s;
        setToast(
          fresh.length === 1
            ? "New discovery recorded"
            : `${fresh.length} new discoveries recorded`,
        );
        return { ...s, codex: [...s.codex, ...fresh] };
      });
    };

    return {
      state,
      overlay,
      hasSave: Boolean(stored?.character),
      toast,
      setOverlay,
      closeOverlay: () => setOverlay({ kind: "none" }),
      goTitle: () => setState((s) => ({ ...s, screen: "title" })),
      startNew: () => {
        setOverlay({ kind: "none" });
        setState({ ...EMPTY, screen: "create" });
      },
      continueGame: () => {
        if (stored?.character) {
          setState({ ...stored, screen: "play" });
          setOverlay({ kind: "none" });
        }
      },
      createCharacter: (name, archetype) => {
        const base = ARCHETYPE_BY_ID.get(archetype)!;
        setState((s) => ({
          ...s,
          screen: "play",
          character: { name, archetype, stats: { ...base.stats } },
        }));
        setOverlay({ kind: "narrative" });
      },
      unlockCodex,
      completeTask: (id) => setState((s) => ({ ...s, tasks: { ...s.tasks, [id]: true } })),
      addStat: (stat, amount) =>
        setState((s) =>
          s.character
            ? {
                ...s,
                character: {
                  ...s.character,
                  stats: { ...s.character.stats, [stat]: s.character.stats[stat] + amount },
                },
              }
            : s,
        ),
      setDrillScore: (n) => setState((s) => ({ ...s, drillScore: Math.max(s.drillScore, n) })),
      setWallsHeld: (n) => setState((s) => ({ ...s, wallsHeld: n })),
      advanceLevel: (level) => setState((s) => ({ ...s, level })),
      resetSave: () => {
        try {
          localStorage.removeItem(SAVE_KEY);
        } catch {
          /* ignore */
        }
        setStored(null);
        setOverlay({ kind: "none" });
        setState(EMPTY);
      },
    };
  }, [state, overlay, stored, toast]);

  return <GameContext.Provider value={api}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}

export const LEVEL1_TASKS: TaskId[] = [
  "keeper",
  "sergeant",
  "scribe",
  "sword",
  "manuscript",
  "moat",
];