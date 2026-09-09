import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ARCHETYPES } from "@/game/content";
import { useGame } from "@/game/store";
import type { ArchetypeId, Stats } from "@/game/types";

const STAT_LABELS: Record<keyof Stats, string> = {
  valour: "Valour",
  wit: "Wit",
  stamina: "Stamina",
  standing: "Standing",
};

export function CharacterCreation() {
  const { createCharacter, goTitle } = useGame();
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<ArchetypeId>("sepoy");
  const chosen = ARCHETYPES.find((a) => a.id === picked)!;

  const trimmed = name.trim();

  return (
    <div className="min-h-screen bg-background px-5 py-12">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={goTitle}
          className="mb-6 flex items-center gap-2 text-sm text-parchment/60 hover:text-parchment"
        >
          <ArrowLeft className="size-4" /> Back to title
        </button>

        <h1 className="text-3xl text-parchment text-carved">Who walks into the fort?</h1>
        <p className="mt-2 max-w-2xl text-sm text-parchment/70">
          Each life inside Vellore Fort saw it differently. Your choice sets your starting stats and
          shapes what people are willing to tell you.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {ARCHETYPES.map((a) => {
              const active = a.id === picked;
              return (
                <button
                  key={a.id}
                  onClick={() => setPicked(a.id)}
                  className={`rounded-sm p-4 text-left transition ${active
                      ? "panel-parchment ring-2 ring-gold"
                      : "panel-stone text-parchment/85 hover:brightness-125"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="size-7 shrink-0 rounded-full border border-black/25"
                      style={{ background: a.cloth }}
                      aria-hidden
                    />
                    <div>
                      <h2 className="text-lg leading-tight">{a.name}</h2>
                      <p
                        className={`text-[11px] uppercase tracking-widest ${active ? "text-ink/60" : "text-parchment/50"}`}
                      >
                        {a.era}
                      </p>
                    </div>
                  </div>
                  <p className={`mt-3 text-sm ${active ? "text-ink/85" : "text-parchment/70"}`}>
                    {a.blurb}
                  </p>
                  <p
                    className={`mt-2 text-xs italic ${active ? "text-ink/70" : "text-parchment/55"}`}
                  >
                    {a.perk}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="panel-parchment rounded-sm p-5">
            <h2 className="text-xl">Your name</h2>
            <input
              value={name}
              maxLength={22}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kanaka, Muthu, Rajam"
              className="mt-2 w-full rounded-sm border border-ink/25 bg-white/50 px-3 py-2 text-ink outline-none placeholder:text-ink/40 focus:border-ink/60"
            />

            <h3 className="mt-6 text-sm uppercase tracking-widest text-ink/60">Starting stats</h3>
            <ul className="mt-2 space-y-2">
              {(Object.keys(STAT_LABELS) as (keyof Stats)[]).map((k) => (
                <li key={k}>
                  <div className="flex justify-between text-sm">
                    <span>{STAT_LABELS[k]}</span>
                    <span className="tabular-nums">{chosen.stats[k]}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-ink/15">
                    <div
                      className="h-2 rounded-full bg-ink/60"
                      style={{ width: `${(chosen.stats[k] / 10) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <button
              disabled={trimmed.length < 2}
              onClick={() => createCharacter(trimmed, picked)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-ink px-4 py-3 font-display text-lg text-parchment transition enabled:hover:brightness-125 disabled:opacity-40"
            >
              Enter the fort <ArrowRight className="size-4" />
            </button>
            {trimmed.length < 2 && (
              <p className="mt-2 text-center text-xs text-ink/55">Enter a name to begin.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



