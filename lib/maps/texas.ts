/** Texas geography for a tap-the-map quiz. Coordinates are in viewBox 0 0 240 220. */

export type PlaceKind = "city" | "region" | "neighbor" | "water" | "river";

export interface MapPlace {
  id: string;
  name: string;
  kind: PlaceKind;
  x: number;
  y: number;
  hint: string;
  prompt: string;
}

/** Simplified Texas outline, panhandle on top. */
export const TEXAS_OUTLINE =
  "M78 10 L118 10 L118 38 L198 38 L208 58 L204 92 L188 128 L168 168 L148 198 L118 210 L88 198 L58 178 L22 162 L10 128 L12 88 L22 62 L48 48 L78 44 Z";

export const TEXAS_PLACES: MapPlace[] = [
  { id: "austin", name: "Austin", kind: "city", x: 128, y: 118, hint: "The capital, in the middle of the state.", prompt: "Tap Austin — the capital of Texas." },
  { id: "houston", name: "Houston", kind: "city", x: 168, y: 128, hint: "Biggest city. Near the Gulf.", prompt: "Tap Houston." },
  { id: "dallas", name: "Dallas", kind: "city", x: 148, y: 62, hint: "North Texas, next to Fort Worth.", prompt: "Tap Dallas." },
  { id: "fortworth", name: "Fort Worth", kind: "city", x: 136, y: 66, hint: "Dallas's neighbor to the west.", prompt: "Tap Fort Worth." },
  { id: "sanantonio", name: "San Antonio", kind: "city", x: 118, y: 138, hint: "South of Austin. The Alamo is here.", prompt: "Tap San Antonio." },
  { id: "elpaso", name: "El Paso", kind: "city", x: 22, y: 78, hint: "Far west, against New Mexico and Mexico.", prompt: "Tap El Paso." },
  { id: "midland", name: "Midland", kind: "city", x: 72, y: 88, hint: "West Texas. Home.", prompt: "Tap Midland — that's home." },
  { id: "lubbock", name: "Lubbock", kind: "city", x: 78, y: 52, hint: "South of the panhandle.", prompt: "Tap Lubbock." },
  { id: "amarillo", name: "Amarillo", kind: "city", x: 88, y: 22, hint: "Up in the panhandle.", prompt: "Tap Amarillo." },
  { id: "corpus", name: "Corpus Christi", kind: "city", x: 148, y: 168, hint: "On the Gulf.", prompt: "Tap Corpus Christi." },
  { id: "laredo", name: "Laredo", kind: "city", x: 98, y: 168, hint: "On the Rio Grande.", prompt: "Tap Laredo." },
  { id: "coastal", name: "Gulf Coastal Plains", kind: "region", x: 168, y: 148, hint: "East and south, along the water.", prompt: "Tap the Gulf Coastal Plains." },
  { id: "northcentral", name: "North Central Plains", kind: "region", x: 138, y: 72, hint: "Dallas–Fort Worth country.", prompt: "Tap the North Central Plains." },
  { id: "greatplains", name: "Great Plains", kind: "region", x: 88, y: 36, hint: "Panhandle and high plains.", prompt: "Tap the Great Plains." },
  { id: "mountains", name: "Mountains and Basins", kind: "region", x: 32, y: 88, hint: "Far west. El Paso lives here.", prompt: "Tap Mountains and Basins." },
  { id: "oklahoma", name: "Oklahoma", kind: "neighbor", x: 130, y: 8, hint: "The state on Texas's north side.", prompt: "Tap the state north of Texas." },
  { id: "louisiana", name: "Louisiana", kind: "neighbor", x: 216, y: 78, hint: "East of Texas.", prompt: "Tap Louisiana." },
  { id: "newmexico", name: "New Mexico", kind: "neighbor", x: 8, y: 48, hint: "West of Texas.", prompt: "Tap New Mexico." },
  { id: "mexico", name: "Mexico", kind: "neighbor", x: 48, y: 188, hint: "South of the Rio Grande.", prompt: "Tap Mexico." },
  { id: "gulf", name: "Gulf of Mexico", kind: "water", x: 200, y: 168, hint: "The water on the southeast.", prompt: "Tap the Gulf of Mexico." },
  { id: "riogrande", name: "Rio Grande", kind: "river", x: 48, y: 148, hint: "The river on the southern border.", prompt: "Tap the Rio Grande." },
  { id: "redriver", name: "Red River", kind: "river", x: 148, y: 28, hint: "The river on the northern border.", prompt: "Tap the Red River." },
];

export const TEXAS_DECKS = {
  mix: TEXAS_PLACES,
  cities: TEXAS_PLACES.filter((p) => p.kind === "city"),
  regions: TEXAS_PLACES.filter((p) => p.kind === "region"),
  neighbors: TEXAS_PLACES.filter((p) => p.kind === "neighbor" || p.kind === "water" || p.kind === "river"),
} as const;

export type TexasDeck = keyof typeof TEXAS_DECKS;

export function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function choicesFor(place: MapPlace, deck: MapPlace[]): string[] {
  const pool = deck.filter((p) => p.id !== place.id && p.kind === place.kind);
  const extra = shuffle(pool.length ? pool : deck.filter((p) => p.id !== place.id)).slice(0, 2);
  return shuffle([place.name, ...extra.map((p) => p.name)]);
}
