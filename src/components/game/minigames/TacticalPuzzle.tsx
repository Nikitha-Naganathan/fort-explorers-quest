import { useState } from "react";
import { Compass, X } from "lucide-react";
import { TACTICAL_CASES } from "@/game/content";

interface Props {
  onClose: () => void;
  onComplete: (correct: number) => void;
}

export function TacticalPuzzle({ onClose, onComplete }: Props) {
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const kase = TACTICAL_CASES[i]!;

  const pick = (n: number) => {
    if (chosen !== null) return;
    setChosen(n);
    if (kase.options[n]!.correct) setCorrect((c) => c + 1);
  };

  const next = () => {
    if (i === TACTICAL_CASES.length - 1) {
      setDone(true);
      return;
    }
    setI(i + 1);
    setChosen(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
      <div className="panel-parchment w-full max-w-2xl rounded-sm p-7">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl">
              <Compass className="size-5" /> Command post — read the attack
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              Three threats, one decision each. The garrison is too small to be wrong twice.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Leave the command post"
            className="rounded-sm border border-ink/25 p-2 text-ink/70 hover:bg-ink/10"
          >
            <X className="size-4" />
          </button>
        </div>

        {!done ? (
          <>
            <p className="mt-5 text-xs uppercase tracking-widest text-ink/55">
              Threat {i + 1} of {TACTICAL_CASES.length}
            </p>
            <h3 className="mt-1 text-xl">{kase.threat}</h3>
            <p className="mt-1 text-sm text-ink/70">{kase.detail}</p>

            <div className="mt-4 space-y-2">
              {kase.options.map((o, n) => {
                const picked = chosen === n;
                const reveal = chosen !== null;
                return (
                  <button
                    key={o.label}
                    onClick={() => pick(n)}
                    className={`w-full rounded-sm border px-4 py-3 text-left transition ${
                      reveal && o.correct
                        ? "border-emerald-800/50 bg-emerald-800/12"
                        : picked
                          ? "border-red-900/50 bg-red-900/12"
                          : "border-ink/20 bg-white/40 hover:bg-ink/10"
                    }`}
                  >
                    <span className="font-display text-[15px]">{o.label}</span>
                    {reveal && (picked || o.correct) && (
                      <span className="mt-1 block text-sm text-ink/70">{o.note}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {chosen !== null && (
              <button
                onClick={next}
                className="mt-5 w-full rounded-sm bg-ink px-4 py-3 font-display text-parchment hover:brightness-125"
              >
                {i === TACTICAL_CASES.length - 1 ? "Give the orders" : "Next threat"}
              </button>
            )}
          </>
        ) : (
          <div className="mt-6">
            <h3 className="text-xl">
              {correct} of {TACTICAL_CASES.length} read correctly
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/85">
              Every one of these answers is architecture doing its work: bastions to sweep the wall
              face, a bent gate to kill a ram's momentum, and moat channels that can drown a mine.
              The fort was designed to make the right decision the obvious one.
            </p>
            <button
              onClick={() => onComplete(correct)}
              className="mt-6 w-full rounded-sm bg-ink px-4 py-3 font-display text-parchment hover:brightness-125"
            >
              To the ramparts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
