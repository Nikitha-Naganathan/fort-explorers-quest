import { BookOpen, Play, RotateCcw } from "lucide-react";
import { useGame } from "@/game/store";
import { CODEX } from "@/game/codex";

export function TitleScreen() {
  const { hasSave, startNew, continueGame, setOverlay, resetSave, state } = useGame();
  const known = state.codex.length;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-16">
      {/* fort silhouette */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_78%,oklch(0.62_0.12_66/0.5),transparent_62%)]" />
        <svg
          className="absolute bottom-0 left-0 h-[46vh] w-full text-ink/85"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0 300V150h60v-20h20v20h60v-30h20v30h80v-40h30v40h60v-14h18v14h120v-70h26v70h140v-14h18v14h120v-30h20v30h80v-20h20v20h60v-16h18v16h60v150z" />
          <path d="M520 300V90c0-6 6-10 12-14l38-26 38 26c6 4 12 8 12 14v210z" />
          <path d="M556 50h48l-8-16h-32z" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-gold/80">Vellore Fort · Tamil Nadu</p>
        <h1 className="mt-4 text-5xl font-normal text-parchment text-carved sm:text-6xl">
          Beyond the Bastions
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-parchment/75">
          A history adventure inside the granite walls of Vellore — the moat and its watchers, the
          yali pillars of Jalakanteswarar, and the dawn of 10 July 1806.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            onClick={startNew}
            className="flex w-64 items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 font-display text-lg text-primary-foreground transition hover:brightness-110"
          >
            <Play className="size-4" /> New chronicle
          </button>
          {hasSave && (
            <button
              onClick={continueGame}
              className="flex w-64 items-center justify-center gap-2 rounded-sm border border-border bg-secondary px-6 py-3 font-display text-lg text-secondary-foreground transition hover:brightness-110"
            >
              <RotateCcw className="size-4" /> Continue
            </button>
          )}
          <button
            onClick={() => setOverlay({ kind: "codex" })}
            className="flex w-64 items-center justify-center gap-2 rounded-sm border border-border/70 px-6 py-3 text-sm text-parchment/80 transition hover:bg-secondary/60"
          >
            <BookOpen className="size-4" /> Discoveries — {known}/{CODEX.length}
          </button>
          {hasSave && (
            <button
              onClick={resetSave}
              className="mt-2 text-xs text-parchment/45 underline-offset-4 hover:underline"
            >
              Erase saved chronicle
            </button>
          )}
        </div>

        <p className="mt-10 text-xs text-parchment/45">
          Drag to look · W A S D to walk · Shift to run · E to interact · J for Discoveries
        </p>
      </div>
    </div>
  );
}