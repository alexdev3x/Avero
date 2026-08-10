import { SiteColors } from "./types";

export interface Palette extends SiteColors {
  id: string;
  name: string;
  keywords: string[];
}

export const PALETTES: Palette[] = [
  {
    id: "midnight",
    name: "Midnight Indigo",
    keywords: ["dark", "tech", "saas", "startup", "night", "sleek", "futuristic", "ai", "indigo"],
    primary: "#6366f1",
    primaryDark: "#4338ca",
    accent: "#22d3ee",
    background: "#0b0c14",
    surface: "#13141f",
    text: "#f5f6fa",
    textMuted: "#9ca0b3",
  },
  {
    id: "sunrise",
    name: "Sunrise Coral",
    keywords: ["warm", "food", "restaurant", "cafe", "bakery", "cozy", "friendly", "red", "coral", "rose"],
    primary: "#fb7185",
    primaryDark: "#e11d48",
    accent: "#fbbf24",
    background: "#fffaf7",
    surface: "#ffffff",
    text: "#231016",
    textMuted: "#7a5b62",
  },
  {
    id: "forest",
    name: "Forest Sage",
    keywords: ["organic", "eco", "nature", "wellness", "garden", "sustainable", "plant", "green", "emerald", "mint", "sage"],
    primary: "#16a34a",
    primaryDark: "#15803d",
    accent: "#a3e635",
    background: "#f6faf5",
    surface: "#ffffff",
    text: "#132018",
    textMuted: "#5c6f60",
  },
  {
    id: "royal",
    name: "Royal Luxe",
    keywords: ["luxury", "premium", "elegant", "fashion", "jewelry", "boutique", "high-end", "purple", "violet", "lavender"],
    primary: "#a855f7",
    primaryDark: "#7e22ce",
    accent: "#facc15",
    background: "#0f0a17",
    surface: "#181025",
    text: "#f6f1fb",
    textMuted: "#ac9dc4",
  },
  {
    id: "ocean",
    name: "Ocean Breeze",
    keywords: ["travel", "agency", "beach", "ocean", "calm", "trust", "finance", "bank", "blue", "teal", "cyan", "turquoise"],
    primary: "#0ea5e9",
    primaryDark: "#0369a1",
    accent: "#2dd4bf",
    background: "#f4fbfd",
    surface: "#ffffff",
    text: "#0b2733",
    textMuted: "#4c6c76",
  },
  {
    id: "candy",
    name: "Candy Pop",
    keywords: ["fun", "playful", "kids", "creative", "art", "game", "colorful", "bright", "pink", "magenta"],
    primary: "#ec4899",
    primaryDark: "#be185d",
    accent: "#8b5cf6",
    background: "#fff8fc",
    surface: "#ffffff",
    text: "#25101c",
    textMuted: "#8a5d79",
  },
  {
    id: "graphite",
    name: "Graphite Mono",
    keywords: ["minimal", "portfolio", "studio", "architecture", "design", "clean", "simple", "black", "gray", "grey", "monochrome"],
    primary: "#111827",
    primaryDark: "#000000",
    accent: "#f97316",
    background: "#fafafa",
    surface: "#ffffff",
    text: "#111111",
    textMuted: "#6b6b6b",
  },
  {
    id: "ember",
    name: "Ember Fitness",
    keywords: ["fitness", "gym", "sport", "energy", "strong", "power", "workout", "orange", "amber", "yellow"],
    primary: "#f97316",
    primaryDark: "#c2410c",
    accent: "#facc15",
    background: "#0c0a09",
    surface: "#171310",
    text: "#fff7ed",
    textMuted: "#b8a99a",
  },
];

export function pickPalette(prompt: string): Palette {
  const p = prompt.toLowerCase();
  let best: Palette | null = null;
  let bestScore = 0;
  for (const palette of PALETTES) {
    const score = palette.keywords.reduce((acc, kw) => (p.includes(kw) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      best = palette;
    }
  }
  if (best) return best;
  const hash = [...p].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return PALETTES[hash % PALETTES.length];
}

export function paletteById(id: string): Palette | undefined {
  return PALETTES.find((p) => p.id === id);
}
