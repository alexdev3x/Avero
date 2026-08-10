import { SiteSpec, SiteContent, SiteSectionKey, SiteTone } from "./types";
import { pickPalette } from "./palettes";
import { detectIndustry, pick, IndustryProfile } from "./industries";
import { iconSvg } from "./icons";

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1));
}

function deriveName(prompt: string, industry: IndustryProfile, seed: number): string {
  const quoted = prompt.match(/["'“”]([A-Za-z0-9&' -]{2,30})["'“”]/);
  if (quoted) return titleCase(quoted[1]);
  const called = prompt.match(/(?:called|named)\s+([A-Z][A-Za-z0-9&' -]{1,24})/);
  if (called) return titleCase(called[1]);
  const adjectives = ["Nova", "Lumen", "Arc", "Vero", "Haven", "Pulse", "North", "Bloom", "Crest", "Orbit", "Willow", "Ember"];
  const adj = pick(adjectives, seed);
  const suffix = pick(industry.nameSuffixes, seed >> 3);
  return `${adj} ${suffix}`;
}

function detectTone(prompt: string): SiteTone {
  const p = prompt.toLowerCase();
  if (/(luxury|elegant|premium|high-end|sophisticated)/.test(p)) return "elegant";
  if (/(fun|playful|colorful|vibrant|quirky|kids)/.test(p)) return "playful";
  if (/(minimal|clean|simple|sleek)/.test(p)) return "minimal";
  if (/(corporate|professional|enterprise|business)/.test(p)) return "corporate";
  return "bold";
}

const SECTION_KEYWORDS: Record<Exclude<SiteSectionKey, "nav" | "hero" | "footer">, string[]> = {
  features: ["feature", "service", "what we offer", "offering"],
  about: ["about", "story", "who we are"],
  testimonials: ["testimonial", "review", "customer", "client love"],
  pricing: ["pricing", "price", "plan", "subscription"],
  contact: ["contact", "reach", "get in touch", "book", "reserve"],
};

function detectSections(prompt: string, industryId: string): SiteSectionKey[] {
  const p = prompt.toLowerCase();
  const base: SiteSectionKey[] = ["nav", "hero", "features", "about"];
  if (industryId === "saas" || industryId === "ecommerce") base.push("pricing");
  base.push("testimonials", "contact", "footer");
  const wantsNoPricing = /(no pricing|without pricing)/.test(p);
  const sections = base.filter((s) => !(wantsNoPricing && s === "pricing"));
  for (const [key, kws] of Object.entries(SECTION_KEYWORDS)) {
    if (kws.some((kw) => p.includes(kw)) && !sections.includes(key as SiteSectionKey)) {
      const idx = sections.indexOf("contact");
      sections.splice(idx > -1 ? idx : sections.length - 1, 0, key as SiteSectionKey);
    }
  }
  return Array.from(new Set(sections));
}

export function generateContent(prompt: string, industry: IndustryProfile, seed: number, name: string): SiteContent {
  return {
    siteName: name,
    tagline: pick(industry.taglines, seed),
    heroHeadline: pick(industry.heroHeadlines, seed + 1),
    heroSubheadline: pick(industry.heroSubheadlines, seed + 2),
    ctaLabel: pick(industry.ctaLabels, seed + 3),
    aboutTitle: pick(industry.aboutTitles, seed + 4),
    aboutBody: pick(industry.aboutBodies, seed + 5),
    features: industry.features,
    testimonials: [
      { quote: "This completely changed the way we work. Couldn't imagine going back.", author: "Jordan Lee", role: "Happy Customer" },
      { quote: "The attention to detail and quality is unmatched. Highly recommend.", author: "Sam Rivera", role: "Loyal Client" },
      { quote: "Exceeded every expectation. The team truly cares about the outcome.", author: "Casey Morgan", role: "Verified Buyer" },
    ],
    pricing: [
      { name: "Starter", price: "$19", period: "/mo", features: ["Core features", "Up to 3 projects", "Email support"], highlighted: false },
      { name: "Pro", price: "$49", period: "/mo", features: ["Everything in Starter", "Unlimited projects", "Priority support", "Advanced analytics"], highlighted: true },
      { name: "Enterprise", price: "$99", period: "/mo", features: ["Everything in Pro", "Dedicated manager", "Custom integrations", "SLA guarantee"], highlighted: false },
    ],
    contactTitle: "Let's talk",
    contactBody: "Have a question or ready to get started? We'd love to hear from you.",
    footerNote: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
    navLinks: industry.navLinks,
  };
}

export function generateSpec(prompt: string): SiteSpec {
  const seed = Math.abs(hashString(prompt + Date.now()));
  const industry = detectIndustry(prompt);
  const palette = pickPalette(prompt);
  const tone = detectTone(prompt);
  const name = deriveName(prompt, industry, seed);
  const content = generateContent(prompt, industry, seed, name);
  const sections = detectSections(prompt, industry.id);
  return {
    prompt,
    tone,
    font: industry.font,
    colors: palette,
    content,
    sections,
  };
}

/* ---------------- Rendering ---------------- */

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function radiusFor(tone: SiteTone): string {
  switch (tone) {
    case "playful":
      return "22px";
    case "minimal":
      return "4px";
    case "elegant":
      return "2px";
    case "corporate":
      return "8px";
    default:
      return "14px";
  }
}

function renderNav(spec: SiteSpec): string {
  const { content } = spec;
  return `<header class="nav" id="nav">
  <div class="container nav__inner">
    <a class="nav__brand" href="#top">${esc(content.siteName)}</a>
    <nav class="nav__links" id="navLinks">
      ${content.navLinks.map((l) => `<a href="#${l.toLowerCase().replace(/\s+/g, "-")}">${esc(l)}</a>`).join("\n      ")}
    </nav>
    <a class="btn btn--primary btn--sm nav__cta" href="#contact">${esc(content.ctaLabel)}</a>
    <button class="nav__toggle" id="navToggle" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>`;
}

function renderHero(spec: SiteSpec): string {
  const { content } = spec;
  return `<section class="hero" id="top">
  <div class="container hero__inner">
    <p class="eyebrow">${esc(content.tagline)}</p>
    <h1 class="hero__title">${esc(content.heroHeadline)}</h1>
    <p class="hero__subtitle">${esc(content.heroSubheadline)}</p>
    <div class="hero__actions">
      <a href="#contact" class="btn btn--primary btn--lg">${esc(content.ctaLabel)}</a>
      <a href="#about" class="btn btn--ghost btn--lg">Learn more</a>
    </div>
  </div>
  <div class="hero__glow" aria-hidden="true"></div>
</section>`;
}

function renderFeatures(spec: SiteSpec): string {
  const { content } = spec;
  return `<section class="features" id="features">
  <div class="container">
    <h2 class="section__title">What we offer</h2>
    <div class="features__grid">
      ${content.features
        .map(
          (f) => `<div class="feature-card">
        <div class="feature-card__icon">${iconSvg(f.icon, 22)}</div>
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.body)}</p>
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`;
}

function renderAbout(spec: SiteSpec): string {
  const { content } = spec;
  return `<section class="about" id="about">
  <div class="container about__inner">
    <div class="about__media" aria-hidden="true"></div>
    <div class="about__copy">
      <h2 class="section__title">${esc(content.aboutTitle)}</h2>
      <p>${esc(content.aboutBody)}</p>
      <a href="#contact" class="link-arrow">Get in touch ${iconSvg("arrow", 16)}</a>
    </div>
  </div>
</section>`;
}

function renderTestimonials(spec: SiteSpec): string {
  const { content } = spec;
  return `<section class="testimonials" id="testimonials">
  <div class="container">
    <h2 class="section__title">Loved by people like you</h2>
    <div class="testimonials__grid">
      ${content.testimonials
        .map(
          (t) => `<div class="testimonial-card">
        <div class="testimonial-card__stars">${iconSvg("star", 14)}${iconSvg("star", 14)}${iconSvg("star", 14)}${iconSvg("star", 14)}${iconSvg("star", 14)}</div>
        <p>&ldquo;${esc(t.quote)}&rdquo;</p>
        <div class="testimonial-card__author">
          <div class="testimonial-card__avatar">${esc(t.author.split(" ").map((n) => n[0]).join(""))}</div>
          <div>
            <strong>${esc(t.author)}</strong>
            <span>${esc(t.role)}</span>
          </div>
        </div>
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`;
}

function renderPricing(spec: SiteSpec): string {
  const { content } = spec;
  return `<section class="pricing" id="pricing">
  <div class="container">
    <h2 class="section__title">Simple, transparent pricing</h2>
    <div class="pricing__grid">
      ${content.pricing
        .map(
          (p) => `<div class="price-card${p.highlighted ? " price-card--highlight" : ""}">
        ${p.highlighted ? '<span class="price-card__badge">Most popular</span>' : ""}
        <h3>${esc(p.name)}</h3>
        <div class="price-card__price">${esc(p.price)}<span>${esc(p.period)}</span></div>
        <ul>
          ${p.features.map((f) => `<li>${iconSvg("check", 14)}${esc(f)}</li>`).join("\n          ")}
        </ul>
        <a href="#contact" class="btn ${p.highlighted ? "btn--primary" : "btn--outline"} btn--block">Choose plan</a>
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`;
}

function renderContact(spec: SiteSpec): string {
  const { content } = spec;
  return `<section class="contact" id="contact">
  <div class="container contact__inner">
    <h2 class="section__title">${esc(content.contactTitle)}</h2>
    <p>${esc(content.contactBody)}</p>
    <form class="contact__form" id="contactForm">
      <input type="text" placeholder="Your name" required />
      <input type="email" placeholder="Your email" required />
      <textarea placeholder="Your message" rows="4" required></textarea>
      <button type="submit" class="btn btn--primary btn--lg btn--block">Send message</button>
      <p class="contact__success" id="contactSuccess">Thanks! We'll be in touch soon.</p>
    </form>
  </div>
</section>`;
}

function renderFooter(spec: SiteSpec): string {
  const { content } = spec;
  return `<footer class="footer" id="footer">
  <div class="container footer__inner">
    <span class="nav__brand">${esc(content.siteName)}</span>
    <p>${esc(content.footerNote)}</p>
  </div>
</footer>`;
}

const RENDERERS: Record<SiteSectionKey, (spec: SiteSpec) => string> = {
  nav: renderNav,
  hero: renderHero,
  features: renderFeatures,
  about: renderAbout,
  testimonials: renderTestimonials,
  pricing: renderPricing,
  contact: renderContact,
  footer: renderFooter,
};

export function renderHtml(spec: SiteSpec): string {
  return spec.sections.map((s) => RENDERERS[s](spec)).join("\n\n");
}

export function renderCss(spec: SiteSpec): string {
  const { colors, font, tone } = spec;
  const radius = radiusFor(tone);
  return `:root {
  --primary: ${colors.primary};
  --primary-dark: ${colors.primaryDark};
  --accent: ${colors.accent};
  --bg: ${colors.background};
  --surface: ${colors.surface};
  --text: ${colors.text};
  --text-muted: ${colors.textMuted};
  --radius: ${radius};
  --font: ${font};
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
.container { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
.section__title { font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 700; margin-bottom: 40px; letter-spacing: -0.02em; }
.eyebrow { color: var(--primary); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.8rem; margin-bottom: 16px; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 22px; border-radius: var(--radius); font-weight: 600; font-size: 0.95rem; border: 1px solid transparent; cursor: pointer; transition: transform .15s ease, opacity .15s ease, background .15s ease; }
.btn:hover { transform: translateY(-1px); opacity: 0.92; }
.btn--primary { background: var(--primary); color: #fff; }
.btn--outline { background: transparent; color: var(--text); border-color: color-mix(in srgb, var(--text) 25%, transparent); }
.btn--ghost { background: transparent; color: var(--text); }
.btn--lg { padding: 15px 30px; font-size: 1rem; }
.btn--sm { padding: 9px 16px; font-size: 0.85rem; }
.btn--block { width: 100%; }

.nav { position: sticky; top: 0; z-index: 50; backdrop-filter: blur(12px); background: color-mix(in srgb, var(--bg) 82%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--text) 8%, transparent); }
.nav__inner { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; }
.nav__brand { font-weight: 800; font-size: 1.2rem; letter-spacing: -0.02em; }
.nav__links { display: flex; gap: 28px; }
.nav__links a { font-size: 0.92rem; font-weight: 500; color: var(--text-muted); transition: color .15s ease; }
.nav__links a:hover { color: var(--text); }
.nav__toggle { display: none; flex-direction: column; gap: 4px; background: none; border: none; cursor: pointer; padding: 8px; }
.nav__toggle span { width: 22px; height: 2px; background: var(--text); border-radius: 2px; }

.hero { position: relative; padding: 120px 0 90px; overflow: hidden; text-align: center; }
.hero__inner { position: relative; z-index: 1; max-width: 780px; margin: 0 auto; }
.hero__title { font-size: clamp(2.4rem, 5.5vw, 4rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.08; margin-bottom: 22px; }
.hero__subtitle { font-size: 1.15rem; color: var(--text-muted); max-width: 600px; margin: 0 auto 36px; }
.hero__actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.hero__glow { position: absolute; top: -180px; left: 50%; transform: translateX(-50%); width: 900px; height: 500px; background: radial-gradient(circle, var(--primary) 0%, transparent 70%); opacity: 0.22; filter: blur(60px); pointer-events: none; }

.features { padding: 90px 0; }
.features__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
.feature-card { background: var(--surface); border: 1px solid color-mix(in srgb, var(--text) 8%, transparent); border-radius: var(--radius); padding: 30px; transition: transform .2s ease, box-shadow .2s ease; }
.feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px color-mix(in srgb, var(--primary) 15%, transparent); }
.feature-card__icon { width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: color-mix(in srgb, var(--primary) 15%, transparent); color: var(--primary); margin-bottom: 18px; }
.feature-card h3 { font-size: 1.1rem; margin-bottom: 8px; }
.feature-card p { color: var(--text-muted); font-size: 0.95rem; }

.about { padding: 90px 0; }
.about__inner { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.about__media { aspect-ratio: 4/3; border-radius: var(--radius); background: linear-gradient(135deg, var(--primary), var(--accent)); opacity: 0.85; }
.about__copy p { color: var(--text-muted); margin: 18px 0 22px; font-size: 1.02rem; }
.link-arrow { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; color: var(--primary); }

.testimonials { padding: 90px 0; }
.testimonials__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
.testimonial-card { background: var(--surface); border: 1px solid color-mix(in srgb, var(--text) 8%, transparent); border-radius: var(--radius); padding: 28px; }
.testimonial-card__stars { display: flex; gap: 2px; color: var(--accent); margin-bottom: 14px; }
.testimonial-card p { font-size: 0.98rem; margin-bottom: 20px; }
.testimonial-card__author { display: flex; align-items: center; gap: 12px; }
.testimonial-card__avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; }
.testimonial-card__author div { display: flex; flex-direction: column; font-size: 0.85rem; }
.testimonial-card__author span { color: var(--text-muted); }

.pricing { padding: 90px 0; }
.pricing__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; align-items: stretch; }
.price-card { position: relative; background: var(--surface); border: 1px solid color-mix(in srgb, var(--text) 8%, transparent); border-radius: var(--radius); padding: 32px; display: flex; flex-direction: column; }
.price-card--highlight { border-color: var(--primary); box-shadow: 0 16px 40px color-mix(in srgb, var(--primary) 20%, transparent); transform: scale(1.03); }
.price-card__badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--primary); color: #fff; font-size: 0.72rem; font-weight: 700; padding: 4px 14px; border-radius: 999px; }
.price-card h3 { font-size: 1rem; color: var(--text-muted); margin-bottom: 12px; }
.price-card__price { font-size: 2.2rem; font-weight: 800; margin-bottom: 22px; }
.price-card__price span { font-size: 1rem; font-weight: 500; color: var(--text-muted); }
.price-card ul { list-style: none; margin-bottom: 26px; flex: 1; }
.price-card li { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: var(--text-muted); padding: 7px 0; }
.price-card li svg { color: var(--primary); flex-shrink: 0; }

.contact { padding: 90px 0 110px; }
.contact__inner { max-width: 560px; margin: 0 auto; text-align: center; }
.contact__inner > p { color: var(--text-muted); margin: 14px 0 30px; }
.contact__form { display: flex; flex-direction: column; gap: 14px; text-align: left; }
.contact__form input, .contact__form textarea { width: 100%; padding: 13px 16px; border-radius: calc(var(--radius) - 2px); border: 1px solid color-mix(in srgb, var(--text) 15%, transparent); background: var(--surface); color: var(--text); font-family: inherit; font-size: 0.95rem; }
.contact__form input:focus, .contact__form textarea:focus { outline: 2px solid var(--primary); outline-offset: 1px; }
.contact__success { display: none; text-align: center; color: var(--primary); font-weight: 600; font-size: 0.9rem; }
.contact__success.show { display: block; }

.footer { padding: 34px 0; border-top: 1px solid color-mix(in srgb, var(--text) 8%, transparent); }
.footer__inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.footer p { color: var(--text-muted); font-size: 0.85rem; }

@media (max-width: 820px) {
  .about__inner { grid-template-columns: 1fr; }
  .about__media { order: -1; }
}
@media (max-width: 720px) {
  .nav__links { position: fixed; top: 66px; left: 0; right: 0; background: var(--bg); flex-direction: column; padding: 20px 24px; gap: 18px; border-bottom: 1px solid color-mix(in srgb, var(--text) 8%, transparent); transform: translateY(-140%); opacity: 0; transition: all .2s ease; pointer-events: none; }
  .nav__links.open { transform: translateY(0); opacity: 1; pointer-events: auto; }
  .nav__toggle { display: flex; }
  .nav__cta { display: none; }
}
`;
}

export function renderJs(): string {
  return `document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }
  var form = document.getElementById('contactForm');
  var success = document.getElementById('contactSuccess');
  if (form && success) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      success.classList.add('show');
      form.reset();
    });
  }
});`;
}

export function renderDocument(html: string, css: string, js: string, title = "Preview"): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<style>${css}</style>
</head>
<body>
${html}
<script>${js}</script>
</body>
</html>`;
}

export function regenerateContent(spec: SiteSpec): SiteSpec {
  const seed = Math.abs(hashString(spec.prompt + Math.random()));
  const industry = detectIndustry(spec.prompt);
  const content = generateContent(spec.prompt, industry, seed, spec.content.siteName);
  return { ...spec, content };
}

export function generateSite(prompt: string) {
  const spec = generateSpec(prompt);
  const html = renderHtml(spec);
  const css = renderCss(spec);
  const js = renderJs();
  return { spec, html, css, js };
}
