import type { CodexEntry } from "./types";

export const CODEX: CodexEntry[] = [
  {
    id: "granite-walls",
    title: "The Granite Curtain",
    category: "Architecture",
    body: "Vellore Fort's curtain walls are built of massive dressed granite blocks laid without mortar in much of their length, rising from a broad battered base so that cannon shot glances upward rather than biting in. The circuit encloses roughly 133 acres, with round bastions at the angles and projecting galleries for flanking fire.",
    footnote: "Attributed to Vijayanagara-era chieftains of the Vellore region, 16th century.",
  },
  {
    id: "moat",
    title: "The Great Moat",
    category: "Architecture",
    body: "A broad water moat rings the fort, historically fed and drained through channels connected to a subterranean water supply. Its width was measured in tens of metres — far beyond a scaling ladder's reach — which forced any attacker onto the single causeway before the main gate.",
    footnote: "Local tradition holds the moat once held crocodiles as living sentries.",
  },
  {
    id: "crocodiles",
    title: "Sentries with Scales",
    category: "Warfare",
    body: "Accounts and long-standing local tradition describe crocodiles kept in the moat to discourage swimmers and night infiltrators. Whether garrison policy or folklore, the effect was the same: the moat was treated as unpassable, and the fort's defence could concentrate on the gate and the bastions.",
    footnote: "Treat the crocodile garrison as strong tradition rather than documented muster roll.",
  },
  {
    id: "gatehouse",
    title: "The Bent Entrance",
    category: "Architecture",
    body: "The main entrance is not a straight run. Attackers crossing the causeway must turn inside the gate complex, losing the momentum of a charge while exposed to fire from above on both sides. Bent or dog-leg entrances are a signature of South Indian fort design.",
  },
  {
    id: "temple",
    title: "Jalakanteswarar Temple",
    category: "Temple",
    body: "Inside the walls stands the Jalakanteswarar temple, dedicated to Shiva — the name evokes 'the one residing in water', fitting for a shrine within a moated fort. Its gopuram, pillared halls and carved stone mandapa are among the finest surviving Vijayanagara-period work in the region.",
  },
  {
    id: "yali",
    title: "Yali Pillars",
    category: "Temple",
    body: "The mandapa pillars carry yali figures — leonine guardian beasts, often rearing, sometimes ridden by warriors, carved from a single block along with the shaft. They are structural and protective at once: the column holds the roof, the beast holds off harm.",
  },
  {
    id: "manuscripts",
    title: "Palm-Leaf Records",
    category: "People",
    body: "Administrative and religious records in the Tamil country were incised into prepared palm leaves with a stylus, then rubbed with soot to make the strokes legible. Leaves were strung between wooden boards; a broken cord could scatter a document into a puzzle of loose lines.",
  },
  {
    id: "sepoy",
    title: "The Sepoy",
    category: "People",
    body: "A sepoy was an Indian soldier in European-officered service, drilled in musket volley and bayonet. Pay, promotion and — critically — matters of dress and religious observance were set by the Company, and grievances there ran deeper than any drill sergeant admitted.",
  },
  {
    id: "nayaka",
    title: "Nayaka Guards",
    category: "People",
    body: "Under the Vijayanagara and successor states, nayakas were military chiefs holding land in return for troops. Their household guards garrisoned forts like Vellore long before European armies arrived, and their descendants' service memory persisted in the region's soldiering families.",
  },
  {
    id: "drill",
    title: "Sword Drill",
    category: "Warfare",
    body: "Garrison training combined the sword and the firelock. Drill emphasised the guard positions — high, inside, low — and the discipline of returning to guard between cuts. The teaching principle was constant: recovery matters more than the blow.",
  },
  {
    id: "mutiny-1806",
    title: "The Vellore Mutiny, 1806",
    category: "Warfare",
    body: "On 10 July 1806, sepoys of the Madras garrison rose at Vellore before dawn. The immediate grievances were orders touching dress and appearance — a new turban, prohibitions on beards and caste marks — read by the men as an attack on faith. The rising seized much of the fort and was suppressed within a day by relief cavalry from Arcot.",
    footnote: "It preceded the better-known 1857 rebellion by fifty-one years.",
  },
  {
    id: "bastion-defence",
    title: "Holding a Bastion",
    category: "Warfare",
    body: "A round bastion lets defenders sweep the wall face on either side. Defence is a matter of allocation: ladders need men at the merlons, a gate ram needs weight behind the gate, a mine needs counter-digging. Spend the garrison in the wrong place and a wall falls that never needed to.",
  },
  {
    id: "arcot-relief",
    title: "The Ride from Arcot",
    category: "Warfare",
    body: "Word of the rising reached Arcot, some twenty-five kilometres away, and a cavalry force under Rollo Gillespie rode to Vellore, arriving within hours and forcing the gate. Speed of relief, not the strength of the walls, decided the day.",
  },
  {
    id: "aftermath",
    title: "Afterwards",
    category: "People",
    body: "The offending dress regulations were withdrawn and the Madras commander-in-chief and governor were recalled. The fort itself passed through use as a garrison, prison and administrative seat, and today it is a protected monument with the temple, a museum and public buildings inside its walls.",
  },
];

export const CODEX_BY_ID = new Map(CODEX.map((e) => [e.id, e]));
