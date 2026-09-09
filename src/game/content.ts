import type { Archetype, ArchetypeId } from "./types";

export const ARCHETYPES: Archetype[] = [
  {
    id: "sepoy",
    name: "Sepoy of the Madras Line",
    era: "Company service, 1806",
    blurb:
      "Drilled in volley and bayonet, quartered inside the walls, and quietly uneasy about the new orders on dress.",
    perk: "Officers answer your questions about the garrison directly.",
    stats: { valour: 7, wit: 4, stamina: 6, standing: 4 },
    cloth: "#b8483a",
    sash: "#e8dcc0",
  },
  {
    id: "nayaka",
    name: "Nayaka Household Guard",
    era: "Old garrison lineage",
    blurb:
      "Your family has held this wall since the days of the nayakas. You know every stair, gallery and blind corner.",
    perk: "You find hidden fort features others walk past.",
    stats: { valour: 6, wit: 5, stamina: 7, standing: 3 },
    cloth: "#2f6b52",
    sash: "#d8c27a",
  },
  {
    id: "scribe",
    name: "Palace Scribe",
    era: "Fort administration",
    blurb:
      "Keeper of palm-leaf accounts and grain lists. You read what soldiers only carry.",
    perk: "Manuscripts reveal their meaning faster in your hands.",
    stats: { valour: 3, wit: 8, stamina: 4, standing: 6 },
    cloth: "#e0d3b4",
    sash: "#8a5a2b",
  },
  {
    id: "artisan",
    name: "Temple Artisan",
    era: "Jalakanteswarar workshops",
    blurb:
      "You cut yali pillars and repair the mandapa. Stone tells you where it is weak.",
    perk: "You read architecture — walls confess their flaws to you.",
    stats: { valour: 4, wit: 7, stamina: 6, standing: 4 },
    cloth: "#c8862f",
    sash: "#3c3226",
  },
];

export const ARCHETYPE_BY_ID = new Map<ArchetypeId, Archetype>(
  ARCHETYPES.map((a) => [a.id, a]),
);

export interface StorySlide {
  heading: string;
  lines: string[];
  codex?: string[];
}

export const INTRO_SLIDES: StorySlide[] = [
  {
    heading: "Vellore, before the heat of the day",
    lines: [
      "The fort sits low and wide on the plain, a ring of grey granite laid so close that a knife-blade will not enter the joints.",
      "Around it lies the moat — broad, still, green, and by long tradition not to be swum.",
    ],
    codex: ["granite-walls", "moat"],
  },
  {
    heading: "Inside the walls",
    lines: [
      "Within the circuit: a temple with a carved gopuram, an armoury, barracks, granaries, and men from three different centuries of soldiering.",
      "You have been given the run of the fort today. Learn it. You will need it sooner than anyone expects.",
    ],
    codex: ["temple"],
  },
  {
    heading: "Level One — Secrets of the Moat & Manuscripts",
    lines: [
      "Speak with the moat keeper, the armoury sergeant and the temple scribe.",
      "Complete the sword drill, restore a broken palm-leaf record, and learn how the moat keeps its watch.",
    ],
  },
];

export const CUTSCENE_SLIDES: StorySlide[] = [
  {
    heading: "10 July 1806 — two hours before dawn",
    lines: [
      "The order came down weeks ago: a new turban, no beards, no caste marks on parade.",
      "To the men of the Madras line it read as an order against their faith. Nothing was written down. Everything was understood.",
    ],
    codex: ["mutiny-1806"],
  },
  {
    heading: "The first shots",
    lines: [
      "Muskets sound in the barrack lines. The European quarters are rushed. Within the hour much of the fort has changed hands.",
      "You are on the rampart with a garrison too small for the circuit and too scattered to hold it everywhere.",
    ],
  },
  {
    heading: "Level Two — The Siege of Vellore",
    lines: [
      "Move along the bastions. Read each attack, spend your garrison where it will matter, and hold the walls until relief rides in from Arcot.",
    ],
    codex: ["bastion-defence"],
  },
];

export interface DialogueNode {
  speaker: string;
  text: string;
}

export interface NpcScript {
  id: string;
  name: string;
  role: string;
  position: [number, number, number];
  cloth: string;
  lines: DialogueNode[];
  codex: string[];
  reward: { stat: keyof import("./types").Stats; amount: number };
  unlocks?: "sword" | "manuscript" | "moat";
}

export const NPCS: NpcScript[] = [
  {
    id: "keeper",
    name: "Ariyanachi",
    role: "Moat keeper",
    position: [-14, 0, 26],
    cloth: "#3f7a63",
    codex: ["moat", "crocodiles", "gatehouse"],
    reward: { stat: "wit", amount: 1 },
    unlocks: "moat",
    lines: [
      {
        speaker: "Ariyanachi",
        text: "You walked the causeway to get in, so you already know the fort's first argument: there is only one dry way through.",
      },
      {
        speaker: "Ariyanachi",
        text: "The water is fed and drained through channels. It is never still for long, and it is never empty. That matters more than the height of the wall.",
      },
      {
        speaker: "Ariyanachi",
        text: "And it is watched. My grandfather fed the watchers by hand. Crocodiles, sir. Whether the Company wrote them into the muster or not, no man tried the water twice.",
      },
      {
        speaker: "Ariyanachi",
        text: "Come to the bank when you are ready. I will show you how to read their round, and when the water is yours to cross.",
      },
    ],
  },
  {
    id: "sergeant",
    name: "Havildar Muthu",
    role: "Armoury sergeant",
    position: [22, 0, 8],
    cloth: "#a8442f",
    codex: ["sepoy", "drill", "nayaka"],
    reward: { stat: "valour", amount: 1 },
    unlocks: "sword",
    lines: [
      {
        speaker: "Havildar Muthu",
        text: "Hands first, opinions later. In this armoury you are a sepoy — an Indian soldier under European officers, and paid like one.",
      },
      {
        speaker: "Havildar Muthu",
        text: "Before the Company there were nayaka guards on this same wall. Chiefs held land, land held soldiers, soldiers held the fort. The stone did not care whose flag flew.",
      },
      {
        speaker: "Havildar Muthu",
        text: "Drill teaches three guards: high, inside, low. The cut is nothing. The return to guard is everything.",
      },
      {
        speaker: "Havildar Muthu",
        text: "Take the drill yard when you like. I will call the guards and you will meet them.",
      },
    ],
  },
  {
    id: "scribe",
    name: "Chinnamma",
    role: "Temple scribe",
    position: [4, 0, -20],
    cloth: "#d9c7a0",
    codex: ["manuscripts", "yali", "temple"],
    reward: { stat: "wit", amount: 1 },
    unlocks: "manuscript",
    lines: [
      {
        speaker: "Chinnamma",
        text: "Mind the pillars as you come in. Each yali is cut from the same block as the shaft it guards — beast and column, one stone.",
      },
      {
        speaker: "Chinnamma",
        text: "I keep the record. Palm leaf, prepared and dried, incised with a stylus, then rubbed with soot so the letters come up black.",
      },
      {
        speaker: "Chinnamma",
        text: "A cord broke last night and a grain record is in pieces on my table. Lines out of order say nothing at all.",
      },
      {
        speaker: "Chinnamma",
        text: "Set the leaf in order for me and you may read what it says.",
      },
    ],
  },
];

export const MANUSCRIPT_LINES = [
  "In the month of Aani, the grain of the fort store",
  "counted by the keeper of the inner gate,",
  "two hundred measures of rice to the garrison,",
  "forty to the temple kitchen at Jalakanteswarar,",
  "and the remainder sealed against the season of siege.",
  "Written on leaf by the hand of the scribe.",
];

export const MANUSCRIPT_PASSAGE =
  "A grain account, nothing more — and yet it is a defence plan. A fort that seals a reserve 'against the season of siege' expects to be cut off, and knows exactly how long it can eat.";

export interface TacticalCase {
  id: string;
  threat: string;
  detail: string;
  options: { label: string; correct: boolean; note: string }[];
}

export const TACTICAL_CASES: TacticalCase[] = [
  {
    id: "ladders",
    threat: "Scaling ladders at the north curtain",
    detail:
      "Twenty men are running ladders at a straight stretch of wall between two bastions.",
    options: [
      {
        label: "Mass musketry on the two flanking bastions",
        correct: true,
        note: "Correct. A round bastion exists to sweep the wall face beside it — the ladder party is caught from both sides at once.",
      },
      {
        label: "Open the gate and counter-charge",
        correct: false,
        note: "Opening the gate trades a wall you hold for a fight you may not win.",
      },
      {
        label: "Pull everyone onto the threatened stretch",
        correct: false,
        note: "Crowding the curtain gives up the flanking fire that makes the ladders fail.",
      },
    ],
  },
  {
    id: "ram",
    threat: "A ram at the main gate",
    detail: "A beam is being carried up the causeway toward the gate complex.",
    options: [
      {
        label: "Let them into the bent passage, then hold the inner turn",
        correct: true,
        note: "Correct. The entrance turns — a ram loses all its momentum at the bend, under fire from above.",
      },
      {
        label: "Fire the causeway before they reach the water",
        correct: false,
        note: "You cannot reach far enough down the causeway to stop a carried beam.",
      },
      {
        label: "Abandon the gate and fall back to the palace",
        correct: false,
        note: "Giving up the gate surrenders the only dry way in — and the fort with it.",
      },
    ],
  },
  {
    id: "mine",
    threat: "Digging heard beneath the eastern bastion",
    detail: "Sappers are working under the wall foot, out of sight.",
    options: [
      {
        label: "Sink a counter-shaft and flood it from the moat channel",
        correct: true,
        note: "Correct. The moat is plumbing as well as barrier — the channels that fill it can drown a mine.",
      },
      {
        label: "Fire the bastion guns at the ground",
        correct: false,
        note: "Guns cannot reach a tunnel beneath their own platform.",
      },
      {
        label: "Wait and see whether the wall settles",
        correct: false,
        note: "By the time a mined wall settles, it is already coming down.",
      },
    ],
  },
];

export const EPILOGUE_LINES = [
  "By mid-morning cavalry from Arcot forced the gate, and the rising inside the fort was over within the day.",
  "The dress regulations that lit it were withdrawn. The commander-in-chief and the governor were recalled to answer for the fort's condition.",
  "Fifty-one years later, a far larger rebellion would repeat the same grievance in the same language. Vellore had said it first.",
];
