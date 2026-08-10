export type SiteTone = "bold" | "minimal" | "playful" | "corporate" | "elegant";

export interface SiteColors {
  primary: string;
  primaryDark: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
}

export interface SiteContent {
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  ctaLabel: string;
  aboutTitle: string;
  aboutBody: string;
  features: { title: string; body: string; icon: string }[];
  testimonials: { quote: string; author: string; role: string }[];
  pricing: { name: string; price: string; period: string; features: string[]; highlighted: boolean }[];
  contactTitle: string;
  contactBody: string;
  footerNote: string;
  navLinks: string[];
}

export interface SiteSpec {
  prompt: string;
  tone: SiteTone;
  font: string;
  colors: SiteColors;
  content: SiteContent;
  sections: SiteSectionKey[];
}

export type SiteSectionKey =
  | "nav"
  | "hero"
  | "features"
  | "about"
  | "testimonials"
  | "pricing"
  | "contact"
  | "footer";

export interface ProjectVersion {
  id: string;
  label: string;
  createdAt: number;
  html: string;
  css: string;
  js: string;
  spec: SiteSpec;
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface PublishInfo {
  isPublished: boolean;
  slug: string;
  publishedAt: number | null;
  publishedVersionId: string | null;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  prompt: string;
  versions: ProjectVersion[];
  currentVersionId: string;
  chat: ChatMessage[];
  publish: PublishInfo;
}
