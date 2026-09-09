import { BookOpen, Home } from "lucide-react";
import { CODEX } from "@/game/codex";
import { ARCHETYPE_BY_ID } from "@/game/content";
import { LEVEL1_TASKS } from "@/game/store";
import type { Character } from "@/game/types";

interface Props {
  character: Character;
  level: 1 | 2 | 3;
  tasks: Record<string, boolean>;
  codex: string[];
  nearLabel: string | null;
  nearHint: string | null;
  onCodex: () => void;
  onTitle: () => void;
}

const LEVEL_NAMES: Record<number, string> = {
  1: "Level 1 — Secrets of the Moat & Manuscripts",
  2: "Level 2 — The Siege of Vellore",
  3: "Epilogue",
};

export function Hud({
  character,
  level,
  tasks,
  codex,
  nearLabel,
  nearHint,
  onCodex,
  onTitle,
}: Props) {
  const archetype = ARCHETYPE_BY_ID.get(character.archetype)!;
  const l1done = LEVEL1_TASKS.filter((t) => tasks[t]).length;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none">
      <div className="pointer-events-auto absolute left-4 top-4 max-w-xs rounded-sm border border-ink/25 bg-parchment/85 px-4 py-3 backdrop-blur-sm">
        <p className="font-display text-lg leading-tight text-ink">{character.name}</p>
        <p className="text-xs text-ink/60">{archetype.name}</p>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-ink/75">
          <span>Valour {character.stats.valour}</span>
          <span>Wit {character.stats.wit}</span>
          <span>Stamina {character.stats.stamina}</span>
          <span>Standing {character.stats.standing}</span>
        </div>
      </div>

      <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-sm border border-ink/25 bg-parchment/85 px-4 py-2 text-center backdrop-blur-sm">
        <p className="font-display text-sm text-ink">{LEVEL_NAMES[level]}</p>
        {level === 1 && (
          <p className="text-xs text-ink/60">{l1done} of {LEVEL1_TASKS.length} tasks done</p>
        )}
      </div>

      <div className="pointer-events-auto absolute right-4 top-4 flex gap-2">
        <button
          onClick={onCodex}
          className="flex items-center gap-2 rounded-sm border border-ink/25 bg-parchment/85 px-3 py-2 text-sm text-ink backdrop-blur-sm transition hover:bg-parchment"
        >
          <BookOpen className="size-4" /> Discoveries {codex.length}/{CODEX.length}
          <kbd className="rounded border border-ink/30 px-1 text-[10px]">J</kbd>
        </button>
        <button
          onClick={onTitle}
          aria-label="Back to title"
          className="rounded-sm border border-ink/25 bg-parchment/85 p-2 text-ink backdrop-blur-sm transition hover:bg-parchment"
        >
          <Home className="size-4" />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 rounded-sm border border-ink/20 bg-parchment/75 px-3 py-2 text-xs text-ink/70 backdrop-blur-sm">
        WASD move · Shift sprint · drag to look (left/right and up/down) · E interact · J Discoveries
      </div>

      {nearLabel && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 rounded-sm border border-gold/70 bg-parchment/90 px-5 py-3 text-center backdrop-blur-sm">
          <p className="font-display text-lg text-ink">{nearLabel}</p>
          <p className="text-sm text-ink/70">
            Press <kbd className="rounded border border-ink/30 px-1">E</kbd> — {nearHint}
          </p>
        </div>
      )}
    </div>
  );
}