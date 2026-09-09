import { useState } from "react";
import { BookOpen, Lock, X } from "lucide-react";
import { CODEX } from "@/game/codex";
import type { CodexCategory } from "@/game/types";

const CATEGORIES: CodexCategory[] = ["Architecture", "Temple", "People", "Warfare"];

export function CodexPanel({ known, onClose }: { known: string[]; onClose: () => void }) {
  const [tab, setTab] = useState<CodexCategory>("Architecture");
  const [openId, setOpenId] = useState<string | null>(null);
  const pct = Math.round((known.length / CODEX.length) * 100);
  const entries = CODEX.filter((e) => e.category === tab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm">
      <div className="panel-parchment flex h-full max-h-[92vh] w-full max-w-4xl flex-col rounded-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-2xl">
              <BookOpen className="size-5" /> Discoveries
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              {known.length} of {CODEX.length} entries recorded — {pct}% of the fort understood
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close discoveries"
            className="rounded-sm border border-ink/25 p-2 text-ink/70 transition hover:bg-ink/10"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-3 h-2 rounded-full bg-ink/15">
          <div className="h-2 rounded-full bg-ink/60 transition-all" style={{ width: `${pct}%` }} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const total = CODEX.filter((e) => e.category === c).length;
            const got = CODEX.filter((e) => e.category === c && known.includes(e.id)).length;
            return (
              <button
                key={c}
                onClick={() => setTab(c)}
                className={`rounded-sm px-3 py-1.5 text-sm transition ${tab === c ? "bg-ink text-parchment" : "border border-ink/25 text-ink/70 hover:bg-ink/10"
                  }`}
              >
                {c} <span className="tabular-nums opacity-70">{got}/{total}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {entries.map((e) => {
            const unlocked = known.includes(e.id);
            const open = openId === e.id;
            return (
              <div key={e.id} className="rounded-sm border border-ink/20 bg-white/35">
                <button
                  onClick={() => unlocked && setOpenId(open ? null : e.id)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className={`text-lg ${unlocked ? "" : "text-ink/40"}`}>
                    {unlocked ? e.title : "Undiscovered entry"}
                  </span>
                  {unlocked ? (
                    <span className="text-xs text-ink/50">{open ? "hide" : "read"}</span>
                  ) : (
                    <Lock className="size-4 text-ink/35" />
                  )}
                </button>
                {unlocked && open && (
                  <div className="border-t border-ink/15 px-4 py-3">
                    <p className="text-[15px] leading-relaxed text-ink/85">{e.body}</p>
                    {e.footnote && (
                      <p className="mt-3 border-l-2 border-ink/25 pl-3 text-xs italic text-ink/60">
                        {e.footnote}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}