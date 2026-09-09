import { useEffect, useRef, useState } from "react";
import { Waves, X } from "lucide-react";

interface Props {
  onClose: () => void;
  onComplete: () => void;
}

// A single, clearly-readable timing game: a crocodile icon sweeps back and
// forth across the channel. A red "strike zone" sits in the middle. Press
// SPACE (or click) while the icon is OUTSIDE the strike zone to log a safe
// pass. Three clean passes in practice unlock the real crossing, which uses
// the same rule at a faster, tighter pace.
const PRACTICE_TARGET = 3;
const PRACTICE_SPEED = 1.1; // radians/sec
const PRACTICE_ZONE = 0.22; // strike zone half-width, 0..0.5
const CROSS_SPEED = 1.8;
const CROSS_ZONE = 0.14;

export function MoatCrossing({ onClose, onComplete }: Props) {
  const [phase, setPhase] = useState<"practice" | "cross" | "caught" | "safe">("practice");
  const [practiceHits, setPracticeHits] = useState(0);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const posRef = useRef(0.5); // 0..1 across the channel
  const [, forceRender] = useState(0);
  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const tRef = useRef(0);

  const speed = phase === "cross" ? CROSS_SPEED : PRACTICE_SPEED;
  const zone = phase === "cross" ? CROSS_ZONE : PRACTICE_ZONE;

  useEffect(() => {
    const loop = (now: number) => {
      const dt = last.current ? Math.min((now - last.current) / 1000, 0.05) : 0;
      last.current = now;
      if (phase === "practice" || phase === "cross") {
        tRef.current += dt;
        posRef.current = 0.5 + 0.5 * Math.sin(tRef.current * speed);
      }
      forceRender((n) => (n + 1) % 1000000);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      last.current = 0;
    };
  }, [phase, speed]);

  const attempt = () => {
    if (phase !== "practice" && phase !== "cross") return;
    const distFromCenter = Math.abs(posRef.current - 0.5);
    const inStrikeZone = distFromCenter < zone;

    if (phase === "practice") {
      if (inStrikeZone) {
        setFlash("bad");
        return;
      }
      setFlash("good");
      setPracticeHits((h) => {
        const next = h + 1;
        if (next >= PRACTICE_TARGET) {
          window.setTimeout(() => setPhase("cross"), 500);
        }
        return next;
      });
      return;
    }

    // phase === "cross"
    if (inStrikeZone) {
      setFlash("bad");
      setPhase("caught");
    } else {
      setFlash("good");
      setPhase("safe");
    }
  };

  useEffect(() => {
    if (!flash) return;
    const t = window.setTimeout(() => setFlash(null), 240);
    return () => window.clearTimeout(t);
  }, [flash]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (phase === "caught") {
          setPhase("practice");
          setPracticeHits(0);
          tRef.current = 0;
        } else {
          attempt();
        }
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, zone]);

  const pos = posRef.current;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
      <div className="panel-parchment w-full max-w-2xl rounded-sm p-7">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl">
              <Waves className="size-5" /> Reading the moat
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              {phase === "practice"
                ? `Watch the crocodile's round. Press SPACE while it's clear of the red strike
                   zone — ${practiceHits}/${PRACTICE_TARGET} clean passes logged.`
                : phase === "cross"
                  ? "Same rule, real stakes: press SPACE the moment it's clear, and cross."
                  : phase === "caught"
                    ? "Caught mid-channel. Press SPACE to go back and re-time the round."
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

        {(phase === "practice" || phase === "cross") && (
          <div className="mt-5">
            <div
              className={`relative h-20 overflow-hidden rounded-sm border transition-colors ${
                flash === "good"
                  ? "border-emerald-700/60 bg-emerald-700/10"
                  : flash === "bad"
                    ? "border-red-800/60 bg-red-800/10"
                    : "border-ink/20"
              } bg-[linear-gradient(180deg,#5b8a68,#3f6b53)]`}
            >
              {/* strike zone */}
              <div
                className="absolute inset-y-0 bg-red-900/35"
                style={{ left: `${(0.5 - zone) * 100}%`, width: `${zone * 2 * 100}%` }}
              />
              <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/40" />
              {/* crocodile */}
              <span
                className="absolute top-1/2 -translate-y-1/2 text-3xl"
                style={{
                  left: `${pos * 100}%`,
                  transform: `translate(-50%,-50%) scaleX(${Math.cos(tRef.current * speed) >= 0 ? 1 : -1})`,
                }}
                aria-hidden
              >
                🐊
              </span>
            </div>
            <p className="mt-2 text-center text-xs text-ink/50">
              Red band = strike zone (unsafe) · everywhere else = clear
            </p>
            <button
              onClick={attempt}
              className="mt-4 w-full rounded-sm bg-ink px-4 py-3 font-display text-parchment hover:brightness-125"
            >
              {phase === "practice" ? "Mark it clear (Space)" : "Cross now (Space)"}
            </button>
          </div>
        )}

        {phase === "caught" && (
          <button
            onClick={() => {
              setPhase("practice");
              setPracticeHits(0);
              tRef.current = 0;
            }}
            className="mt-5 w-full rounded-sm bg-ink px-4 py-3 font-display text-parchment hover:brightness-125"
          >
            Back to the bank (Space)
          </button>
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