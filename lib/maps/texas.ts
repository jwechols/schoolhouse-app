/** Real Texas outline from public-domain GeoJSON. viewBox 0 0 800 720. */

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

export const TEXAS_VIEWBOX = "0 0 800 720";

export const TEXAS_OUTLINE = "M300.9 24.0 L404.9 24.0 L404.9 146.7 L409.3 146.1 L422.1 158.2 L429.0 156.1 L447.3 156.8 L451.3 168.9 L463.0 168.2 L475.5 173.8 L486.8 173.1 L491.5 178.3 L498.7 172.4 L509.7 175.2 L514.4 182.1 L522.6 183.2 L527.0 191.8 L537.1 183.5 L550.6 188.4 L555.6 193.6 L562.2 191.1 L566.9 199.1 L581.3 184.9 L585.4 192.2 L598.0 192.2 L609.9 196.7 L614.3 202.2 L625.6 192.5 L637.8 189.4 L643.5 192.9 L657.0 186.6 L660.1 190.1 L674.9 190.4 L678.7 184.9 L693.4 191.1 L699.1 198.4 L721.1 205.3 L727.0 211.2 L738.3 208.1 L746.5 210.9 L746.5 244.5 L746.5 309.4 L759.0 323.2 L759.4 337.1 L775.1 362.8 L776.0 376.3 L770.0 392.6 L764.4 399.2 L766.3 407.9 L762.2 414.4 L766.6 426.6 L753.1 449.1 L758.1 455.4 L748.7 455.7 L718.9 464.4 L708.2 459.5 L706.3 449.1 L698.8 456.4 L693.4 454.7 L690.6 463.7 L696.6 467.5 L697.5 479.3 L686.8 491.8 L669.6 507.4 L635.0 524.0 L631.6 521.2 L621.2 525.4 L620.9 521.6 L606.8 524.4 L600.2 516.4 L596.1 518.1 L611.2 534.4 L600.2 539.6 L589.8 536.5 L588.2 547.9 L575.4 559.7 L562.2 581.6 L553.7 604.5 L547.4 602.7 L545.8 611.0 L552.4 609.0 L549.3 625.6 L544.9 626.3 L544.6 635.7 L549.9 640.9 L551.5 659.9 L557.8 666.5 L559.3 678.7 L564.4 689.4 L546.8 696.0 L539.6 687.7 L526.1 684.6 L508.2 685.3 L492.8 674.8 L481.2 673.8 L472.4 665.5 L460.4 662.7 L452.3 654.7 L446.9 635.7 L436.6 624.2 L437.8 614.5 L433.1 604.1 L434.7 595.1 L427.5 585.0 L421.5 584.0 L411.8 575.0 L408.6 563.5 L400.2 553.1 L387.9 544.5 L381.9 525.4 L376.3 520.2 L368.8 504.9 L366.2 492.5 L359.0 483.4 L346.8 475.5 L344.0 469.9 L332.6 465.1 L323.9 451.2 L298.7 448.1 L283.7 448.8 L270.8 443.9 L268.0 450.5 L254.2 452.6 L243.8 465.8 L237.5 486.9 L234.1 487.3 L226.2 499.7 L216.8 500.1 L202.7 490.4 L167.2 474.8 L160.3 466.5 L146.5 458.5 L136.7 440.4 L136.1 424.1 L126.4 411.0 L124.2 399.5 L117.9 392.2 L95.6 381.5 L83.7 366.9 L73.9 361.7 L63.6 349.3 L49.1 342.7 L39.1 326.0 L30.6 322.6 L24.0 315.3 L25.6 309.0 L229.0 309.0 L229.0 245.6 L230.3 181.4 L230.6 24.0 L232.8 24.0 L300.9 24.0 Z";

export const TEXAS_PLACES: MapPlace[] = [
  { id: "austin", name: "Austin", kind: "city", x: 534.3, y: 418.7, hint: "Capital, center of the state.", prompt: "Find Austin." },
  { id: "houston", name: "Houston", kind: "city", x: 670.3, y: 450.8, hint: "Largest city, near the Gulf.", prompt: "Find Houston." },
  { id: "dallas", name: "Dallas", kind: "city", x: 588.5, y: 259.8, hint: "North Texas.", prompt: "Find Dallas." },
  { id: "fortworth", name: "Fort Worth", kind: "city", x: 557.9, y: 261.2, hint: "Just west of Dallas.", prompt: "Find Fort Worth." },
  { id: "sanantonio", name: "San Antonio", kind: "city", x: 491.2, y: 472.1, hint: "South of Austin. The Alamo.", prompt: "Find San Antonio." },
  { id: "elpaso", name: "El Paso", kind: "city", x: 33.1, y: 324.1, hint: "Far west corner.", prompt: "Find El Paso." },
  { id: "midland", name: "Midland", kind: "city", x: 285.7, y: 309.2, hint: "West Texas. Home.", prompt: "Find Midland." },
  { id: "lubbock", name: "Lubbock", kind: "city", x: 298.5, y: 209.1, hint: "South of the panhandle.", prompt: "Find Lubbock." },
  { id: "amarillo", name: "Amarillo", kind: "city", x: 299.9, y: 105.0, hint: "Up in the panhandle.", prompt: "Find Amarillo." },
  { id: "corpus", name: "Corpus Christi", kind: "city", x: 554.1, y: 574.9, hint: "On the Gulf.", prompt: "Find Corpus Christi." },
  { id: "laredo", name: "Laredo", kind: "city", x: 434.7, y: 592.0, hint: "On the Rio Grande.", prompt: "Find Laredo." },
  { id: "coastal", name: "Gulf Coastal Plains", kind: "region", x: 640, y: 500, hint: "East and south, along the water.", prompt: "Find the Gulf Coastal Plains." },
  { id: "northcentral", name: "North Central Plains", kind: "region", x: 560, y: 280, hint: "Dallas-Fort Worth country.", prompt: "Find the North Central Plains." },
  { id: "greatplains", name: "Great Plains", kind: "region", x: 310, y: 160, hint: "Panhandle and high plains.", prompt: "Find the Great Plains." },
  { id: "mountains", name: "Mountains and Basins", kind: "region", x: 80, y: 330, hint: "Far west. El Paso lives here.", prompt: "Find Mountains and Basins." },
  { id: "oklahoma", name: "Oklahoma", kind: "neighbor", x: 548, y: 48, hint: "North of Texas.", prompt: "Find the state north of Texas." },
  { id: "louisiana", name: "Louisiana", kind: "neighbor", x: 776, y: 372, hint: "East of Texas.", prompt: "Find Louisiana." },
  { id: "newmexico", name: "New Mexico", kind: "neighbor", x: 40, y: 170, hint: "West of Texas.", prompt: "Find New Mexico." },
  { id: "mexico", name: "Mexico", kind: "neighbor", x: 400, y: 690, hint: "South of the Rio Grande.", prompt: "Find Mexico." },
  { id: "gulf", name: "Gulf of Mexico", kind: "water", x: 720, y: 640, hint: "Water on the southeast.", prompt: "Find the Gulf of Mexico." },
  { id: "riogrande", name: "Rio Grande", kind: "river", x: 233, y: 467, hint: "River on the southern border.", prompt: "Find the Rio Grande." },
  { id: "redriver", name: "Red River", kind: "river", x: 606, y: 195, hint: "River on the northern border.", prompt: "Find the Red River." },
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
