import { useCallback, useEffect, useState } from "react";
import { CharacterCreation } from "./CharacterCreation";
import { CodexPanel } from "./CodexPanel";
import { DialoguePanel } from "./DialoguePanel";
import { GameCanvas } from "./GameCanvas";
import { Hud } from "./Hud";
import { NarrativePanel } from "./NarrativePanel";
import { TitleScreen } from "./TitleScreen";
import { ManuscriptPuzzle } from "./minigames/ManuscriptPuzzle";
import { MoatCrossing } from "./minigames/MoatCrossing";
import { SiegeDefence } from "./minigames/SiegeDefence";
import { SwordDrill } from "./minigames/SwordDrill";
import { TacticalPuzzle } from "./minigames/TacticalPuzzle";
import { ARCHETYPE_BY_ID, CUTSCENE_SLIDES, EPILOGUE_LINES, INTRO_SLIDES, NPCS } from "@/game/content";
import { INTERACTIONS } from "@/game/interactions";
import { LEVEL1_TASKS, useGame } from "@/game/store";
import { useKeyboard } from "@/game/useKeyboard";

export function GameShell() {
  const game = useGame();
  const { state, overlay } = game;
  const [nearId, setNearId] = useState<string | null>(null);

  const near = nearId ? INTERACTIONS.find((p) => p.id === nearId) ?? null : null;
  const busy = overlay.kind !== "none";
  const keys = useKeyboard(state.screen === "play" && !busy);

  const interact = useCallback(() => {
    if (!near || busy) return;
    if (near.id.startsWith("npc:")) {
      game.setOverlay({ kind: "dialogue", npc: near.id.slice(4) });
      return;
    }
    const task = near.id.slice(5);
    if (task === "sword") game.setOverlay({ kind: "sword" });
    else if (task === "manuscript") game.setOverlay({ kind: "manuscript" });
    else if (task === "moat") game.setOverlay({ kind: "moat" });
    else if (task === "tactics") game.setOverlay({ kind: "tactics" });
    else if (task === "siege") game.setOverlay({ kind: "siege" });
  }, [near, busy, game]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (state.screen !== "play") return;
      if (e.key === "e" || e.key === "E") interact();
      if (e.key === "j" || e.key === "J") {
        if (overlay.kind === "codex") game.closeOverlay();
        else if (overlay.kind === "none") game.setOverlay({ kind: "codex" });
      }
      if (e.key === "Escape" && overlay.kind === "codex") game.closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [interact, state.screen, overlay.kind, game]);

  // Level 1 -> 2 transition when every level 1 task is done.
  useEffect(() => {
    if (state.screen !== "play" || state.level !== 1) return;
    if (LEVEL1_TASKS.every((t) => state.tasks[t])) {
      game.advanceLevel(2);
      game.setOverlay({ kind: "cutscene" });
    }
  }, [state.screen, state.level, state.tasks, game]);

  if (state.screen === "title")
    return (
      <>
        <TitleScreen />
        {overlay.kind === "codex" && (
          <CodexPanel known={state.codex} onClose={game.closeOverlay} />
        )}
      </>
    );
  if (state.screen === "create" || !state.character) return <CharacterCreation />;

  const character = state.character;
  const archetype = ARCHETYPE_BY_ID.get(character.archetype)!;
  const npc = overlay.kind === "dialogue" ? NPCS.find((n) => n.id === overlay.npc) : undefined;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#cbb98d]">
      <GameCanvas
        keys={keys}
        level={state.level}
        tasks={state.tasks}
        nearId={nearId}
        onNear={setNearId}
        cloth={archetype.cloth}
        sash={archetype.sash}
        frozen={busy}
      />

      <Hud
        character={character}
        level={state.level}
        tasks={state.tasks}
        codex={state.codex}
        nearLabel={busy ? null : (near?.label ?? null)}
        nearHint={busy ? null : (near?.hint ?? null)}
        onCodex={() => game.setOverlay({ kind: "codex" })}
        onTitle={game.goTitle}
      />

      {game.toast && (
        <div className="pointer-events-none absolute bottom-24 right-6 z-30 rounded-sm border border-gold/70 bg-parchment/95 px-4 py-2 font-display text-ink shadow-lg">
          {game.toast}
        </div>
      )}

      {overlay.kind === "narrative" && (
        <NarrativePanel
          onUnlock={game.unlockCodex}
          slides={INTRO_SLIDES}
          finishLabel="Step into the fort"
          onFinish={() => {
            game.completeTask("intro");
            game.closeOverlay();
          }}
        />
      )}

      {overlay.kind === "cutscene" && (
        <NarrativePanel
          onUnlock={game.unlockCodex}
          slides={CUTSCENE_SLIDES}
          finishLabel="To the walls"
          onFinish={() => {
            game.completeTask("cutscene");
            game.closeOverlay();
          }}
        />
      )}

      {overlay.kind === "dialogue" && npc && (
        <DialoguePanel
          npc={npc}
          playerName={character.name}
          onFinish={() => {
            if (!state.tasks[npc.id]) {
              game.unlockCodex(npc.codex);
              game.addStat(npc.reward.stat, npc.reward.amount);
              game.completeTask(npc.id as never);
            }
            game.closeOverlay();
          }}
        />
      )}

      {overlay.kind === "sword" && (
        <SwordDrill
          onClose={game.closeOverlay}
          onComplete={(score) => {
            game.setDrillScore(score);
            game.unlockCodex(["drill", "sepoy"]);
            game.addStat("valour", 1);
            game.completeTask("sword");
            game.closeOverlay();
          }}
        />
      )}

      {overlay.kind === "manuscript" && (
        <ManuscriptPuzzle
          witBonus={character.archetype === "scribe"}
          onClose={game.closeOverlay}
          onComplete={() => {
            game.unlockCodex(["manuscripts", "temple"]);
            game.addStat("wit", 1);
            game.completeTask("manuscript");
            game.closeOverlay();
          }}
        />
      )}

      {overlay.kind === "moat" && (
        <MoatCrossing
          onClose={game.closeOverlay}
          onComplete={() => {
            game.unlockCodex(["moat", "crocodiles"]);
            game.addStat("stamina", 1);
            game.completeTask("moat");
            game.closeOverlay();
          }}
        />
      )}

      {overlay.kind === "tactics" && (
        <TacticalPuzzle
          onClose={game.closeOverlay}
          onComplete={(correct) => {
            game.unlockCodex(["bastion-defence", "gatehouse"]);
            game.addStat("wit", correct);
            game.completeTask("tactics");
            game.closeOverlay();
          }}
        />
      )}

      {overlay.kind === "siege" && (
        <SiegeDefence
          valour={character.stats.valour}
          onClose={game.closeOverlay}
          onComplete={(walls) => {
            game.setWallsHeld(walls);
            game.unlockCodex(["arcot-relief", "aftermath"]);
            game.addStat("standing", walls);
            game.completeTask("siege");
            game.advanceLevel(3);
            game.setOverlay({ kind: "epilogue" });
          }}
        />
      )}

      {overlay.kind === "epilogue" && (
        <NarrativePanel
          onUnlock={game.unlockCodex}
          slides={[
            {
              heading: `The relief from Arcot — ${state.wallsHeld} of 4 walls held`,
              lines: EPILOGUE_LINES,
              codex: ["arcot-relief", "aftermath", "mutiny-1806"],
            },
          ]}
          finishLabel="Close the chronicle"
          onFinish={() => {
            game.closeOverlay();
            game.goTitle();
          }}
        />
      )}

      {overlay.kind === "codex" && (
        <CodexPanel known={state.codex} onClose={game.closeOverlay} />
      )}
    </div>
  );
}
