import { useCallback, useEffect, useRef, useState } from "react";
import { Swords, X } from "lucide-react";

type Guard = "high" | "inside" | "low";

const GUARDS: { id: Guard; key: string; label: string; note: string }[] = [
  { id: "high", key: "1", label: "High guard", note: "blade above the brow, point forward" },
  { id: "inside", key: "2", label: "Inside guard", note: "blade across the chest" },
  { id: "low", key: "3", label: "Low guard", note: "blade dropped, edge outward" },
];

const ROUNDS = [
  { name: "First round — the havildar calls slowly", window: 2000, count: 5 },
  { name: "Second round — the pace closes", window: 1400, count: 6 },
  { name: "Third round — as it comes in earnest", window: 950, count: 7 },
];

interface Props {
  onClose: () => void;
  onComplete: (score: number) => void;
}

export function SwordDrill({ onClose, onComplete }: Props) {
  const [round, setRound] = useState(0);
  const [call, setCall] = useState<Guard | null>(null);
  const [step, setStep] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [flash, setFlash] = useState<"hit" | "miss" | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<number | null>(null);
  const config = ROUNDS[round]!;
  const total = ROUNDS.reduce((n, r) => n + r.count, 0);

  const clearTimer = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };

  const nextCall = useCallback(
    (nextStep: number, currentRound: number) => {
      const cfg = ROUNDS[currentRound]!;
      if (nextStep >= cfg.count) {
        if (currentRound === ROUNDS.length - 1) {
          setRunning(false);
          setDone(true);
          setCall(null);
          return;
        }
        setRound(currentRound + 1);
        setStep(0);
        setCall(null);
        setRunning(false);
        return;
      }
      const guard = GUARDS[Math.floor(Math.random() * GUARDS.length)]!.id;
      setStep(nextStep);
      setCall(guard);
      clearTimer();
      timer.current = window.setTimeout(() => {
        setMisses((m) => m + 1);
        setFlash("miss");
        nextCall(nextStep + 1, currentRound);
      }, cfg.window);
    },
    [],
  );

  const answer = useCallback(
    (guard: Guard) => {
      if (!running || !call) return;
      if (guard === call) {
        setHits((h) => h + 1);
        setFlash("hit");
      } else {
        setMisses((m) => m + 1);
        setFlash("miss");
      }
      nextCall(step + 1, round);
    },
    [running, call, step, round, nextCall],
  );

  useEffect(() => {
    if (!flash) return;
    const t = window.setTimeout(() => setFlash(null), 260);
    return () => window.clearTimeout(t);
  }, [flash]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const g = GUARDS.find((x) => x.key === e.key);
      if (g) answer(g.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer]);

  useEffect(() => () => clearTimer(), []);

  const accuracy = hits + misses === 0 ? 0 : Math.round((hits / (hits + misses)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
      <div className="panel-parchment w-full max-w-2xl rounded-sm p-7">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl">
              <Swords className="size-5" /> Sword drill
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              The havildar calls a guard. Answer with 1 / 2 / 3 or the buttons — recovery matters
              more than the blow.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Leave the drill yard"
            className="rounded-sm border border-ink/25 p-2 text-ink/70 hover:bg-ink/10"
          >
            <X className="size-4" />
          </button>
        </div>

        {!done ? (
          <>
            <p className="mt-5 text-xs uppercase tracking-widest text-ink/55">{config.name}</p>
            <div
              className={`mt-3 flex h-32 items-center justify-center rounded-sm border text-center transition-colors ${
                flash === "hit"
                  ? "border-emerald-700/50 bg-emerald-700/15"
                  : flash === "miss"
                    ? "border-red-800/50 bg-red-800/15"
                    : "border-ink/20 bg-white/40"
              }`}
            >
              {running && call ? (
                <div>
                  <p className="font-display text-4xl">
                    {GUARDS.find((g) => g.id === call)!.label}
                  </p>
                  <p className="mt-1 text-sm text-ink/60">
                    {GUARDS.find((g) => g.id === call)!.note}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setRunning(true);
                    nextCall(0, round);
                  }}
                  className="rounded-sm bg-ink px-6 py-2.5 font-display text-parchment hover:brightness-125"
                >
                  {round === 0 && hits + misses === 0 ? "Take guard" : `Begin round ${round + 1}`}
                </button>
              )}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {GUARDS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => answer(g.id)}
                  className="rounded-sm border border-ink/25 bg-white/40 px-3 py-3 text-left transition hover:bg-ink/10"
                >
                  <span className="font-display text-lg">
                    {g.key}. {g.label}
                  </span>
                  <span className="block text-xs text-ink/60">{g.note}</span>
                </button>
              ))}
            </div>

            <p className="mt-4 text-sm text-ink/65">
              Struck {hits} · missed {misses} · accuracy {accuracy}% · call{" "}
              {Math.min(hits + misses + 1, total)} of {total}
            </p>
          </>
        ) : (
          <div className="mt-6">
            <h3 className="text-xl">Drill complete — {accuracy}% accuracy</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/85">
              {accuracy >= 80
                ? "\u201cGood. You return to guard without being told. That is the whole of it.\u201d"
                : accuracy >= 50
                  ? "\u201cPassable. Your cuts land, your recovery drags. Drill again when the yard is free.\u201d"
                  : "\u201cYou are quick to strike and slow to be ready. On a wall that is how men are lost.\u201d"}
            </p>
            <p className="mt-3 text-sm text-ink/60">
              Garrison training paired the sword with the firelock, and the three guards — high,
              inside, low — were the frame everything else hung on.
            </p>
            <button
              onClick={() => onComplete(accuracy)}
              className="mt-6 w-full rounded-sm bg-ink px-4 py-3 font-display text-parchment hover:brightness-125"
            >
              Return to the fort (+1 Valour, codex entry)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
