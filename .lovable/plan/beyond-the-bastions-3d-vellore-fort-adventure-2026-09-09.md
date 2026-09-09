# Beyond the Bastions — 3D Vellore Fort adventure

An educational 3D adventure set in Vellore Fort, playable in the browser preview and packaged as a downloadable desktop app.

## Look and feel

Sun-bleached South Indian granite: warm ochre stone, dusty green moat water, deep temple shade, soft late-afternoon light. Stylized low-poly with hand-painted-feel textures — no neon, no sci-fi glow. Interface uses palm-leaf-manuscript styling: aged parchment panels, Tamil-inspired display type for headings.

## Flow

```text
Title  ->  Character creation  ->  Fort (free walk)
                                    |
                       Level 1: Secrets of the Moat & Manuscripts
                                    |
                       Level 2: The Siege of Vellore
                                    |
                                 Epilogue
Codex / journal openable at any time (J)
```

## What gets built

**Title screen** — fort silhouette backdrop, game title, Start / Continue / Codex.

**Character creation** — pick an archetype (Sepoy, Nayaka Guard, Palace Scribe, Temple Artisan), each with different starting stats (Valour, Wit, Stamina, Standing) and a small dialogue perk. Custom player name. Saved locally so progress survives a restart.

**The fort in 3D** — walkable ground level with granite ramparts and bastions, gatehouse, the water-filled moat ringing the walls, and the Jalakanteswarar temple complex with a carved pillared hall (Yali-figure pillars), gopuram, and courtyard. Third-person character with camera-relative movement (WASD + mouse look, sprint, interact). Ambient birds, water, footsteps, distant drums.

**Level 1 — Secrets of the Moat & Manuscripts**
- Opening narrative sequence introducing the fort and the year.
- NPCs to talk to: a moat keeper, an armoury sergeant, a temple scribe — branching-lite dialogue that awards codex entries.
- Sword training drills: timed directional-parry mini-game with three escalating rounds, scored on accuracy.
- Manuscript deciphering: drag-and-drop jigsaw of a torn palm-leaf manuscript; completing it reveals a historical passage.
- Moat tasks: chart the crocodile patrol pattern and cross safely at the right moment; feeding/timing puzzle with real detail about the fort's crocodile-guarded moat.

**Level 2 — The Siege of Vellore**
- Story cutscene setting up the 1806 mutiny.
- Timed defence: run the ramparts between bastions, assign garrison units to threatened walls, and hold out over several waves.
- Tactical puzzles: pick the right countermeasure per attack type (ladders, gate ram, tunnel), on a limited action budget.
- Repel the final push; ending varies with how many walls held.

**Codex / journal** — every discovery becomes a card with a short historical entry, grouped by Architecture, People, Warfare, Temple. Shows completion percentage; readable from the title screen too.

**Desktop packaging** — Electron wrapper plus a build script producing a downloadable release archive, with instructions for running it.

## Technical notes

- React Three Fiber (`@react-three/fiber` v9 + `@react-three/drei` v10, React 19) on a client-only route (`ssr: false`); DOM overlays for all HUD, dialogue, puzzles, and codex.
- Fort geometry procedural (instanced walls/merlons/pillars) with procedural canvas textures for granite, plaster, and water; local `<Environment>` Lightformers, no CDN presets. Character models sourced from CC0 low-poly kits where available, procedural otherwise.
- Game state in a single Zustand-style store (plain React context + reducer) covering character, stats, level progress, codex unlocks; persisted to `localStorage`. No backend needed.
- Delta-time movement, exponential damping, capped pixel ratio, one post pass max — mobile-web budget.
- Electron: `base: './'` in vite config, `electron/main.cjs`, packaged with `@electron/packager`, archive written to the documents area for download.
- Every route gets its own title/description/social tags.

## Sequencing

1. Stack install, client-only game route, fort scene + character controller, verified by screenshot.
2. Title screen, character creation, save/load, codex system.
3. Level 1 content and its three mini-games.
4. Level 2 siege, cutscene, endings.
5. Electron packaging and release archive.

## Notes

All historical detail will be drawn from the real record of Vellore Fort (Vijayanagara-era granite fort, moat, Jalakanteswarar temple, 1806 mutiny). Anything I cannot verify will be framed as legend rather than stated as fact.
