import { NPCS } from "./content";

export interface InteractionPoint {
  id: string;
  label: string;
  hint: string;
  position: [number, number, number];
  radius: number;
  level: 1 | 2;
}

export const INTERACTIONS: InteractionPoint[] = [
  ...NPCS.map<InteractionPoint>((npc) => ({
    id: `npc:${npc.id}`,
    label: `${npc.name} — ${npc.role}`,
    hint: "Speak",
    position: npc.position,
    radius: 4.5,
    level: 1,
  })),
  {
    id: "task:sword",
    label: "Drill yard",
    hint: "Begin sword drill",
    position: [24, 0, 24],
    radius: 6,
    level: 1,
  },
  {
    id: "task:manuscript",
    label: "Scribe's table",
    hint: "Restore the palm-leaf record",
    position: [10, 0, -12],
    radius: 5,
    level: 1,
  },
  {
    id: "task:moat",
    label: "Moat bank",
    hint: "Read the water",
    position: [-24, 0, 30],
    radius: 6,
    level: 1,
  },
  {
    id: "task:tactics",
    label: "North bastion — command post",
    hint: "Read the attack",
    position: [0, 0, -31],
    radius: 6,
    level: 2,
  },
  {
    id: "task:siege",
    label: "Rampart stair",
    hint: "Take the walls",
    position: [-30, 0, -28],
    radius: 6,
    level: 2,
  },
];
