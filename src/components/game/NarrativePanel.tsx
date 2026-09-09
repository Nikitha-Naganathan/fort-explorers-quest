import { useEffect, useState } from "react";
import type { StorySlide } from "@/game/content";

interface Props {
  slides: StorySlide[];
  onUnlock: (ids: string[]) => void;
  onFinish: () => void;
  finishLabel: string;
}

export function NarrativePanel({ slides, onUnlock, onFinish, finishLabel }: Props) {
  const [i, setI] = useState(0);
  const slide = slides[i]!;

  useEffect(() => {
    if (slide.codex?.length) onUnlock(slide.codex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const last = i === slides.length - 1;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 px-5 py-10 backdrop-blur-sm">
      <div className="panel-parchment w-full max-w-2xl rounded-sm p-8">
        <p className="text-[11px] uppercase tracking-[0.4em] text-ink/50">
          Chronicle {i + 1} of {slides.length}
        </p>
        <h2 className="mt-3 text-3xl leading-tight">{slide.heading}</h2>
        <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink/85">
          {slide.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-1.5">
            {slides.map((s, n) => (
              <span
                key={s.heading}
                className={`h-1.5 w-6 rounded-full ${n <= i ? "bg-ink/70" : "bg-ink/20"}`}
              />
            ))}
          </div>
          <button
            onClick={() => (last ? onFinish() : setI(i + 1))}
            className="rounded-sm bg-ink px-6 py-2.5 font-display text-parchment transition hover:brightness-125"
          >
            {last ? finishLabel : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
