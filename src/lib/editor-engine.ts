import { SiteSpec, SiteSectionKey, SiteTone } from "./types";
import { PALETTES, pickPalette } from "./palettes";

export interface EditResult {
  spec: SiteSpec;
  summary: string;
  changed: boolean;
}

const HEX_RE = /#([0-9a-f]{3}|[0-9a-f]{6})\b/i;

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', Times, serif";
const ELEGANT_SERIF = "'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif";

const FONT_MAP: Record<string, string> = {
  serif: SERIF,
  elegant: ELEGANT_SERIF,
  modern: SANS,
  clean: SANS,
  playful: SANS,
  geometric: SANS,
  classic: SERIF,
};

const SECTION_ALIASES: Record<string, SiteSectionKey> = {
  pricing: "pricing",
  price: "pricing",
  plans: "pricing",
  testimonial: "testimonials",
  testimonials: "testimonials",
  reviews: "testimonials",
  faq: "testimonials",
  about: "about",
  story: "about",
  features: "features",
  services: "features",
  contact: "contact",
  footer: "footer",
};

function cloneSpec(spec: SiteSpec): SiteSpec {
  return JSON.parse(JSON.stringify(spec));
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1));
}

function findSectionKeyword(text: string): SiteSectionKey | null {
  for (const [kw, key] of Object.entries(SECTION_ALIASES)) {
    if (text.includes(kw)) return key;
  }
  return null;
}

export function applyEdit(spec: SiteSpec, instructionRaw: string): EditResult {
  const instruction = instructionRaw.trim();
  const text = instruction.toLowerCase();
  const next = cloneSpec(spec);
  const notes: string[] = [];
  let changed = false;

  // Color / theme change
  const hexMatch = instruction.match(HEX_RE);
  if (hexMatch && /(color|colour|theme|primary|palette)/.test(text)) {
    next.colors = { ...next.colors, primary: hexMatch[0], primaryDark: hexMatch[0] };
    notes.push(`updated the primary color to ${hexMatch[0]}`);
    changed = true;
  } else if (/(color|colour|theme|palette)/.test(text)) {
    const paletteMatch = PALETTES.find((p) => text.includes(p.id) || text.includes(p.name.toLowerCase()));
    const namedColorMatch = pickPalette(text);
    if (paletteMatch) {
      next.colors = { ...paletteMatch };
      notes.push(`switched the theme to ${paletteMatch.name}`);
      changed = true;
    } else if (
      /(blue|red|green|purple|pink|orange|yellow|teal|indigo|dark|light|black|luxury|warm|cool|vibrant)/.test(text)
    ) {
      next.colors = { ...namedColorMatch };
      notes.push(`updated the color palette to ${namedColorMatch.name}`);
      changed = true;
    }
  }

  // Tone
  const toneMap: [RegExp, SiteTone][] = [
    [/minimal|clean|simple/, "minimal"],
    [/playful|fun|quirky/, "playful"],
    [/elegant|luxury|premium|sophisticated/, "elegant"],
    [/corporate|professional|formal/, "corporate"],
    [/bold|dramatic|striking/, "bold"],
  ];
  for (const [re, tone] of toneMap) {
    if (re.test(text) && (text.includes("tone") || text.includes("feel") || text.includes("style") || text.includes("look") || text.includes("make it") || text.includes("more"))) {
      next.tone = tone;
      notes.push(`shifted the overall style to feel more ${tone}`);
      changed = true;
      break;
    }
  }

  // Font
  for (const [kw, font] of Object.entries(FONT_MAP)) {
    if (text.includes(kw) && (text.includes("font") || text.includes("typography") || text.includes("typeface"))) {
      next.font = font;
      notes.push(`updated the typography to a more ${kw} font`);
      changed = true;
      break;
    }
  }

  // Rename site
  const renameMatch = instruction.match(/(?:rename|change)\s+(?:the\s+)?(?:site\s+name|business\s+name|company\s+name|name)\s+(?:to|as)\s+["']?([A-Za-z0-9&' -]{2,40})["']?/i);
  if (renameMatch) {
    const newName = titleCase(renameMatch[1].trim());
    next.content = { ...next.content, siteName: newName, footerNote: `© ${new Date().getFullYear()} ${newName}. All rights reserved.` };
    notes.push(`renamed the site to "${newName}"`);
    changed = true;
  }

  // Headline
  const headlineMatch = instruction.match(/(?:headline|title|heading)\s+(?:to|as)\s+["']?([^"'.]{4,120})["']?/i);
  if (headlineMatch) {
    next.content = { ...next.content, heroHeadline: headlineMatch[1].trim() };
    notes.push(`updated the hero headline`);
    changed = true;
  }

  // Subheadline / tagline / description
  const subMatch = instruction.match(/(?:subheadline|subtitle|tagline|description)\s+(?:to|as)\s+["']?([^"'.]{4,180})["']?/i);
  if (subMatch) {
    next.content = { ...next.content, heroSubheadline: subMatch[1].trim() };
    notes.push(`updated the hero subheadline`);
    changed = true;
  }

  // CTA button text
  const ctaMatch = instruction.match(/(?:button|cta|call to action)\s+(?:text\s+)?(?:to|as|say)\s+["']?([^"'.]{2,40})["']?/i);
  if (ctaMatch) {
    next.content = { ...next.content, ctaLabel: ctaMatch[1].trim() };
    notes.push(`changed the call-to-action button to "${ctaMatch[1].trim()}"`);
    changed = true;
  }

  // Add section
  if (/(add|include|show)\b/.test(text)) {
    const key = findSectionKeyword(text);
    if (key && !next.sections.includes(key)) {
      const insertBefore = next.sections.indexOf("contact");
      const idx = insertBefore > -1 ? insertBefore : next.sections.length;
      next.sections = [...next.sections.slice(0, idx), key, ...next.sections.slice(idx)];
      notes.push(`added a ${key} section`);
      changed = true;
    }
  }

  // Remove section
  if (/(remove|delete|hide|get rid of)\b/.test(text)) {
    const key = findSectionKeyword(text);
    if (key && next.sections.includes(key) && key !== "nav" && key !== "hero" && key !== "footer") {
      next.sections = next.sections.filter((s) => s !== key);
      notes.push(`removed the ${key} section`);
      changed = true;
    }
  }

  // Regenerate / shuffle content
  if (/(regenerate|shuffle|surprise me|try again|different (copy|content|text)|randomize)/.test(text)) {
    changed = true;
    notes.push("refreshed the copy with new variations");
    return { spec: next, summary: "__REGENERATE__", changed };
  }

  if (!changed) {
    notes.push(
      "I wasn't able to detect a specific change from that message — try things like \"change the color to blue\", \"rename the site to Acme\", \"add a pricing section\", or \"make it feel more minimal\"."
    );
    return { spec: next, summary: notes[0], changed: false };
  }

  const summary = `Done — I ${notes.join(" and ")}.`;
  return { spec: next, summary, changed };
}
