import { useEffect, useRef, useState } from "react";
import { Waves, X } from "lucide-react";

interface Props {
  onClose: () => void;
  onComplete: () => void;
}

const CROCS = [
  { speed: 0.28, offset: 0, lane: 0 },
  { speed: -0.21, offset: 0.4, lane: 1 },
  { speed: 0.34, offset: 0.75, lane: 2 },
];

const OBSERVE_TARGET = 3;

export function MoatCrossing({ onClose, onComplete }: Props) {
  const [phase, setPhase] = useState<"observe" | "cross" | "caught" | "safe">("observe");
  const [t, setT] = useState(0);
  const [logged, setLogged] = useState<number[]>([]);
  const [swimmer, setSwimmer] = useState(0);
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);

  useEffect(() => {
    const loop = (now: number) => {
      const dt = last.current ? Math.min((now - last.current) / 1000, 0.05) : 0;
      last.current = now;
      setT((v) => v + dt);
      setSwimmer((s) => (phase === "cross" ? Math.min(s + dt * 0.34, 1) : s));
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      last.current = 0;
    };
  }, [phase]);

  const positions = CROCS.map((c) => {
    const raw = (c.offset + c.speed * t) % 1;
    return raw < 0 ? raw + 1 : raw;
  });

  // during the crossing, the swimmer is caught if a crocodile is close in the lane being crossed
  useEffect(() => {
    if (phase !== "cross") return;
    const lane = Math.min(2, Math.floor(swimmer * 3));
    const crocX = positions[lane]!;
    if (Math.abs(crocX - 0.5) < 0.1) {
      setPhase("caught");
      setSwimmer(0);
    } else if (swimmer >= 1) {
      setPhase("safe");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swimmer, phase]);

  const logPass = (lane: number) => {
    if (phase !== "observe") return;
    const crocX = positions[lane]!;
    const correct = Math.abs(crocX - 0.5) < 0.14;
    if (correct && !logged.includes(lane)) setLogged([...logged, lane]);
  };

  const charted = logged.length >= OBSERVE_TARGET;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
      <div className="panel-parchment w-full max-w-3xl rounded-sm p-7">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl">
              <Waves className="size-5" /> Reading the moat
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              {phase === "observe"
                ? "Each watcher keeps its own round. Mark a lane the instant its crocodile passes the mid-channel post."
                : phase === "cross"
                  ? "Swimming. The channel is crossed one lane at a time."
                  : phase === "caught"
                    ? "The water was not yours."
                    : "Across, dry and unbitten."}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Leave the bank"
            className="rounded-sm border border-ink/25 p-2 text-ink/70 hover:bg-ink/10"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 space-y-2 rounded-sm border border-ink/25 bg-[#4c7a5c]/25 p-3">
          {CROCS.map((c, lane) => {
            const x = positions[lane]!;
            const swimming = phase === "cross" && Math.floor(swimmer * 3) === lane;
            return (
              <button
                key={lane}
                onClick={() => logPass(lane)}
                className={`relative block h-16 w-full overflow-hidden rounded-sm border transition ${
                  logged.includes(lane) ? "border-emerald-800/60" : "border-ink/20"
                } bg-[linear-gradient(180deg,#5b8a68,#3f6b53)]`}
              >
                <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/50" />
                <span
                  className="absolute top-1/2 -translate-y-1/2 text-2xl transition-none"
                  style={{
                    left: `${x * 100}%`,
                    transform: `translate(-50%,-50%) scaleX(${c.speed > 0 ? 1 : -1})`,
                  }}
                  aria-hidden
                >
                  🐊
                </span>
                {swimming && (
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
                    🧍
                  </span>
                )}
                <span className="absolute bottom-1 left-2 text-[11px] text-white/70">
                  Lane {lane + 1} · {logged.includes(lane) ? "round charted" : "watch and mark"}
                </span>
              </button>
            );
          })}
        </div>

        {phase === "observe" && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-ink/65">
              Charted {logged.length} of {OBSERVE_TARGET} rounds
            </p>
            <button
              disabled={!charted}
              onClick={() => {
                setSwimmer(0);
                setPhase("cross");
              }}
              className="rounded-sm bg-ink px-5 py-2.5 font-display text-parchment enabled:hover:brightness-125 disabled:opacity-40"
            >
              Try the crossing
            </button>
          </div>
        )}

        {(phase === "cross" || phase === "caught") && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="h-2 grow rounded-full bg-ink/15">
              <div className="h-2 rounded-full bg-ink/60" style={{ width: `${swimmer * 100}%` }} />
            </div>
            {phase === "caught" && (
              <button
                onClick={() => setPhase("observe")}
                className="rounded-sm bg-ink px-5 py-2.5 font-display text-parchment hover:brightness-125"
              >
                Back to the bank
              </button>
            )}
          </div>
        )}

        {phase === "safe" && (
          <div className="mt-5 rounded-sm border border-ink/25 bg-white/45 p-4">
            <h3 className="text-lg">You would not do that twice</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/85">
              The moat is tens of metres across — beyond any scaling ladder — and it is fed and
              drained through channels rather than left to stagnate. Tradition adds the crocodiles.
              Between the water and the watchers, every attacker was pushed onto the one dry
              causeway before the gate, which is exactly where the defence wanted them.
            </p>
            <button
              onClick={onComplete}
              className="mt-4 w-full rounded-sm bg-ink px-4 py-3 font-display text-parchment hover:brightness-125"
            >
              Record the moat and its watchers (+1 Stamina)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
