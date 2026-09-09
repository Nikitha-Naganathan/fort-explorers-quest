import { useMemo, useState } from "react";
import { ScrollText, X } from "lucide-react";
import { MANUSCRIPT_LINES, MANUSCRIPT_PASSAGE } from "@/game/content";

interface Props {
  onClose: () => void;
  onComplete: () => void;
  witBonus: boolean;
}

function shuffled<T>(arr: T[]) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export function ManuscriptPuzzle({ onClose, onComplete, witBonus }: Props) {
  const initial = useMemo(() => {
    const order = MANUSCRIPT_LINES.map((_, i) => i);
    let s = shuffled(order);
    while (s.every((v, i) => v === i)) s = shuffled(order);
    return s;
  }, []);
  const [order, setOrder] = useState<number[]>(initial);
  const [held, setHeld] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const solved = order.every((v, i) => v === i);

  const place = (slot: number) => {
    if (held === null) return;
    setOrder((cur) => {
      const next = [...cur];
      const from = next.indexOf(held);
      [next[from], next[slot]] = [next[slot]!, next[from]!];
      return next;
    });
    setHeld(null);
    setChecked(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
      <div className="panel-parchment flex max-h-[92vh] w-full max-w-3xl flex-col rounded-sm p-7">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl">
              <ScrollText className="size-5" /> The broken palm-leaf record
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              The cord snapped and the leaves fell out of order. Pick up a line, then click the line
              you want to swap it with.
              {witBonus && " Your scribe's eye marks a line the moment it sits right."}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Leave the scribe's table"
            className="rounded-sm border border-ink/25 p-2 text-ink/70 hover:bg-ink/10"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {order.map((lineIdx, slot) => {
            const correct = lineIdx === slot;
            const active = held === lineIdx;
            return (
              <button
                key={lineIdx}
                onClick={() => (held === null ? setHeld(lineIdx) : place(slot))}
                className={`flex w-full items-center gap-3 rounded-sm border px-3 py-3 text-left transition ${
                  active
                    ? "border-gold bg-gold/25 ring-2 ring-gold/60"
                    : (witBonus || checked) && correct
                      ? "border-emerald-800/40 bg-emerald-800/10"
                      : "border-ink/20 bg-white/40 hover:bg-ink/10"
                }`}
              >
                <span className="font-mono text-xs text-ink/45">{slot + 1}</span>
                <span
                  className="grow font-display text-[15px] leading-snug"
                  style={{ letterSpacing: "0.02em" }}
                >
                  {MANUSCRIPT_LINES[lineIdx]}
                </span>
                <span
                  className="h-6 w-1.5 rounded-full bg-[#8a6b3d]/60"
                  aria-hidden
                  title="stylus-incised leaf edge"
                />
              </button>
            );
          })}
        </div>

        {solved ? (
          <div className="mt-5 rounded-sm border border-ink/25 bg-white/45 p-4">
            <h3 className="text-lg">The record reads clear</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{MANUSCRIPT_PASSAGE}</p>
            <button
              onClick={onComplete}
              className="mt-4 w-full rounded-sm bg-ink px-4 py-3 font-display text-parchment hover:brightness-125"
            >
              Copy it into your codex (+1 Wit)
            </button>
          </div>
        ) : (
          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-sm text-ink/60">
              {held === null
                ? "Choose a line to lift from the pile."
                : "Now choose where that line belongs."}
            </p>
            <button
              onClick={() => setChecked(true)}
              className="rounded-sm border border-ink/25 px-4 py-2 text-sm text-ink/75 hover:bg-ink/10"
            >
              Check the cord order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
