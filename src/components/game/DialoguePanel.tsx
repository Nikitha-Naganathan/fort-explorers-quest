import { useState } from "react";
import type { NpcScript } from "@/game/content";

interface Props {
  npc: NpcScript;
  playerName: string;
  onFinish: () => void;
}

export function DialoguePanel({ npc, playerName, onFinish }: Props) {
  const [i, setI] = useState(0);
  const line = npc.lines[i]!;
  const last = i === npc.lines.length - 1;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-5">
      <div className="panel-parchment mx-auto max-w-3xl rounded-sm p-6">
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="text-xl leading-none">{line.speaker}</h3>
            <p className="mt-1 text-[11px] uppercase tracking-widest text-ink/50">{npc.role}</p>
          </div>
          <p className="text-[11px] text-ink/45">
            speaking with {playerName} · {i + 1}/{npc.lines.length}
          </p>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-ink/90">{line.text}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onFinish}
            className="rounded-sm border border-ink/25 px-4 py-2 text-sm text-ink/70 transition hover:bg-ink/10"
          >
            Take my leave
          </button>
          <button
            onClick={() => (last ? onFinish() : setI(i + 1))}
            className="rounded-sm bg-ink px-6 py-2 font-display text-parchment transition hover:brightness-125"
          >
            {last ? "Understood" : "Go on"}
          </button>
        </div>
      </div>
    </div>
  );
}
