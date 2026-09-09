import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Flame, Shield, X } from "lucide-react";

interface Props {
  valour: number;
  onClose: () => void;
  onComplete: (wallsHeld: number) => void;
}

interface Wall {
  id: string;
  name: string;
  integrity: number;
  garrison: number;
  threat: number;
}

const WALL_DEFS = [
  { id: "north", name: "North curtain" },
  { id: "east", name: "East bastion" },
  { id: "south", name: "South gate" },
  { id: "west", name: "West rampart" },
];

const WAVES = 4;
const WAVE_SECONDS = 20;

export function SiegeDefence({ valour, onClose, onComplete }: Props) {
  const startingGarrison = 6 + Math.min(3, Math.floor(valour / 3));
  const [walls, setWalls] = useState<Wall[]>(() =>
    WALL_DEFS.map((w) => ({ ...w, integrity: 100, garrison: 0, threat: 0 })),
  );
  const [reserve, setReserve] = useState(startingGarrison);
  const [wave, setWave] = useState(1);
  const [timeLeft, setTimeLeft] = useState(WAVE_SECONDS);
  const [phase, setPhase] = useState<"brief" | "fight" | "between" | "over">("brief");
  const [log, setLog] = useState<string[]>([]);
  const raf = useRef<number | null>(null);
  const last = useRef(0);

  const held = walls.filter((w) => w.integrity > 0).length;

  const pushLog = useCallback((line: string) => {
    setLog((l) => [line, ...l].slice(0, 5));
  }, []);

  const startWave = useCallback(
    (n: number) => {
      const attacked = [...WALL_DEFS]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(4, 1 + n))
        .map((w) => w.id);
      setWalls((ws) =>
        ws.map((w) => ({ ...w, threat: attacked.includes(w.id) && w.integrity > 0 ? 1 : 0 })),
      );
      pushLog(`Wave ${n}: pressure on ${attacked.length} wall${attacked.length > 1 ? "s" : ""}.`);
      setTimeLeft(WAVE_SECONDS);
      setPhase("fight");
    },
    [pushLog],
  );

  useEffect(() => {
    if (phase !== "fight") return;
    const loop = (now: number) => {
      const dt = last.current ? Math.min((now - last.current) / 1000, 0.05) : 0;
      last.current = now;
      if (dt > 0) {
        setTimeLeft((v) => Math.max(0, v - dt));
        setWalls((ws) =>
          ws.map((w) => {
            if (!w.threat || w.integrity <= 0) return w;
            const defence = 1 + w.garrison * 1.35;
            const damage = (dt * 13 * (0.6 + wave * 0.35)) / defence;
            return { ...w, integrity: Math.max(0, w.integrity - damage) };
          }),
        );
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      last.current = 0;
    };
  }, [phase, wave]);

  useEffect(() => {
    if (phase !== "fight") return;
    if (walls.every((w) => w.integrity <= 0)) {
      setPhase("over");
      return;
    }
    if (timeLeft <= 0) {
      if (wave >= WAVES) {
        setPhase("over");
      } else {
        pushLog(`Wave ${wave} spent. They are re-forming.`);
        setReserve((r) => r + 2);
        setWalls((ws) => ws.map((w) => ({ ...w, threat: 0 })));
        setPhase("between");
      }
    }
  }, [timeLeft, phase, wave, walls, pushLog]);

  const assign = (id: string) => {
    if (reserve <= 0) return;
    setReserve((r) => r - 1);
    setWalls((ws) => ws.map((w) => (w.id === id ? { ...w, garrison: w.garrison + 1 } : w)));
  };

  const recall = (id: string) => {
    setWalls((ws) =>
      ws.map((w) => {
        if (w.id !== id || w.garrison <= 0) return w;
        setReserve((r) => r + 1);
        return { ...w, garrison: w.garrison - 1 };
      }),
    );
  };

  const verdict = useMemo(() => {
    if (held === 4) return "Every wall held. The relief column found the circuit intact.";
    if (held >= 2)
      return `${held} walls held. The breaches were contained street by street until the horse arrived.`;
    if (held === 1) return "One wall stood. The fort was retaken at a cost that will be counted.";
    return "The circuit fell. It was taken back from inside, house by house.";
  }, [held]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-8">
      <div className="panel-parchment w-full max-w-3xl rounded-sm p-7">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl">
              <Shield className="size-5" /> Hold the bastions
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              Send your reserve where the pressure is. A wall with nobody on it comes down fast.
            </p>
          </div>
          {phase === "brief" && (
            <button
              onClick={onClose}
              aria-label="Step back from the stair"
              className="rounded-sm border border-ink/25 p-2 text-ink/70 hover:bg-ink/10"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {phase !== "over" && (
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink/70">
            <span>
              Wave <strong className="tabular-nums">{wave}</strong> of {WAVES}
            </span>
            <span>
              Reserve <strong className="tabular-nums">{reserve}</strong> sections
            </span>
            {phase === "fight" && (
              <span>
                Wave ends in <strong className="tabular-nums">{Math.ceil(timeLeft)}s</strong>
              </span>
            )}
          </div>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {walls.map((w) => {
            const fallen = w.integrity <= 0;
            return (
              <div
                key={w.id}
                className={`rounded-sm border p-4 ${
                  fallen
                    ? "border-red-900/45 bg-red-900/12"
                    : w.threat
                      ? "border-gold/70 bg-gold/15"
                      : "border-ink/20 bg-white/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg">{w.name}</span>
                  {w.threat > 0 && !fallen && (
                    <Flame className="size-4 animate-pulse text-red-800" />
                  )}
                </div>
                <div className="mt-2 h-2 rounded-full bg-ink/15">
                  <div
                    className={`h-2 rounded-full ${w.integrity > 40 ? "bg-emerald-800/70" : "bg-red-800/75"}`}
                    style={{ width: `${w.integrity}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-ink/60">
                  {fallen ? "Breached" : `${Math.round(w.integrity)}% sound`} ·{" "}
                  {w.garrison} section{w.garrison === 1 ? "" : "s"}
                </p>
                {!fallen && phase !== "over" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => assign(w.id)}
                      disabled={reserve <= 0}
                      className="grow rounded-sm bg-ink px-3 py-1.5 text-sm text-parchment enabled:hover:brightness-125 disabled:opacity-35"
                    >
                      Send a section
                    </button>
                    <button
                      onClick={() => recall(w.id)}
                      disabled={w.garrison <= 0}
                      className="rounded-sm border border-ink/25 px-3 py-1.5 text-sm text-ink/75 enabled:hover:bg-ink/10 disabled:opacity-35"
                    >
                      Recall
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {log.length > 0 && phase !== "over" && (
          <ul className="mt-4 space-y-1 text-sm text-ink/65">
            {log.map((l, i) => (
              <li key={`${l}-${i}`} className={i === 0 ? "" : "opacity-60"}>
                · {l}
              </li>
            ))}
          </ul>
        )}

        {phase === "brief" && (
          <button
            onClick={() => startWave(1)}
            className="mt-5 w-full rounded-sm bg-ink px-4 py-3 font-display text-parchment hover:brightness-125"
          >
            Stand to — first wave
          </button>
        )}
        {phase === "between" && (
          <button
            onClick={() => {
              setWave((w) => w + 1);
              startWave(wave + 1);
            }}
            className="mt-5 w-full rounded-sm bg-ink px-4 py-3 font-display text-parchment hover:brightness-125"
          >
            Redeploy, then meet wave {wave + 1}
          </button>
        )}
        {phase === "over" && (
          <div className="mt-5 rounded-sm border border-ink/25 bg-white/45 p-4">
            <h3 className="text-xl">{held} of 4 walls held</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{verdict}</p>
            <button
              onClick={() => onComplete(held)}
              className="mt-4 w-full rounded-sm bg-ink px-4 py-3 font-display text-parchment hover:brightness-125"
            >
              See how the day ended
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
