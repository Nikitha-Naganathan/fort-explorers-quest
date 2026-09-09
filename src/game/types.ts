export type ArchetypeId = "sepoy" | "nayaka" | "scribe" | "artisan";

export interface Stats {
  valour: number;
  wit: number;
  stamina: number;
  standing: number;
}

export interface Archetype {
  id: ArchetypeId;
  name: string;
  era: string;
  blurb: string;
  perk: string;
  stats: Stats;
  cloth: string;
  sash: string;
}

export interface Character {
  name: string;
  archetype: ArchetypeId;
  stats: Stats;
}

export type CodexCategory = "Architecture" | "People" | "Warfare" | "Temple";

export interface CodexEntry {
  id: string;
  title: string;
  category: CodexCategory;
  body: string;
  footnote?: string;
}

export type TaskId =
  | "intro"
  | "keeper"
  | "sergeant"
  | "scribe"
  | "sword"
  | "manuscript"
  | "moat"
  | "cutscene"
  | "tactics"
  | "siege";

export type Overlay =
  | { kind: "none" }
  | { kind: "narrative" }
  | { kind: "cutscene" }
  | { kind: "dialogue"; npc: string }
  | { kind: "sword" }
  | { kind: "manuscript" }
  | { kind: "moat" }
  | { kind: "tactics" }
  | { kind: "siege" }
  | { kind: "codex" }
  | { kind: "levelup" }
  | { kind: "epilogue" };

export interface SaveState {
  screen: "title" | "create" | "play";
  level: 1 | 2 | 3;
  character: Character | null;
  tasks: Record<string, boolean>;
  codex: string[];
  wallsHeld: number;
  drillScore: number;
}
