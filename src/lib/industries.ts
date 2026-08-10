export interface IndustryProfile {
  id: string;
  keywords: string[];
  nameSuffixes: string[];
  taglines: string[];
  heroHeadlines: string[];
  heroSubheadlines: string[];
  ctaLabels: string[];
  aboutTitles: string[];
  aboutBodies: string[];
  features: { title: string; body: string; icon: string }[];
  navLinks: string[];
  font: string;
}

export const INDUSTRIES: IndustryProfile[] = [
  {
    id: "saas",
    keywords: ["saas", "software", "app", "platform", "startup", "ai", "tool", "product", "tech"],
    nameSuffixes: ["Labs", "Cloud", "Stack", "OS", "Base", "Kit"],
    taglines: ["Work smarter, ship faster", "The platform teams love", "Automate the busywork"],
    heroHeadlines: [
      "Ship your best work, faster than ever",
      "The all-in-one platform for modern teams",
      "Turn ideas into products in record time",
    ],
    heroSubheadlines: [
      "Everything you need to plan, build, and launch — in one beautifully simple workspace.",
      "Trusted by thousands of teams to move fast without breaking things.",
      "Powerful automation and effortless collaboration, built for the way you actually work.",
    ],
    ctaLabels: ["Start free trial", "Get started free", "Try it now"],
    aboutTitles: ["Built for teams that move fast", "Why teams switch to us"],
    aboutBodies: [
      "We started with a simple idea: software should get out of your way. Every feature we build is tested against one question — does this make our customers faster? The result is a platform trusted by fast-growing teams around the world.",
    ],
    features: [
      { title: "Lightning fast", body: "Optimized from the ground up so every action feels instant.", icon: "zap" },
      { title: "Built-in collaboration", body: "Work together in real time, no matter where your team is.", icon: "users" },
      { title: "Enterprise-grade security", body: "SOC 2 compliant with end-to-end encryption by default.", icon: "shield" },
      { title: "Powerful automations", body: "Automate repetitive work so your team can focus on what matters.", icon: "workflow" },
    ],
    navLinks: ["Product", "Features", "Pricing", "Contact"],
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  {
    id: "restaurant",
    keywords: ["restaurant", "cafe", "bakery", "bistro", "kitchen", "food", "coffee", "dining", "chef"],
    nameSuffixes: ["Kitchen", "Table", "House", "Bistro", "& Co.", "Eatery"],
    taglines: ["Fresh, local, unforgettable", "Made with love, served with pride", "Where every plate tells a story"],
    heroHeadlines: [
      "Handcrafted dishes, made with love",
      "Taste the difference of fresh, local ingredients",
      "A seat at the table you'll never forget",
    ],
    heroSubheadlines: [
      "Seasonal menus crafted daily from the freshest local ingredients — book your table today.",
      "From our kitchen to your table, every dish is made from scratch with care.",
      "Join us for an unforgettable dining experience in the heart of the city.",
    ],
    ctaLabels: ["Reserve a table", "View our menu", "Book now"],
    aboutTitles: ["Our story", "A passion for good food"],
    aboutBodies: [
      "It started with a family recipe and a love for bringing people together. Today, we source from local farms and craft every dish by hand, because good food deserves nothing less than the best ingredients and a lot of heart.",
    ],
    features: [
      { title: "Farm-fresh ingredients", body: "Sourced daily from local farms and trusted producers.", icon: "leaf" },
      { title: "Seasonal menu", body: "Our menu changes with the seasons to showcase the best flavors.", icon: "sparkles" },
      { title: "Cozy atmosphere", body: "A warm, inviting space perfect for any occasion.", icon: "heart" },
      { title: "Private events", body: "Host your next celebration in our beautiful dining room.", icon: "calendar" },
    ],
    navLinks: ["Menu", "About", "Reservations", "Contact"],
    font: "Georgia, 'Times New Roman', Times, serif",
  },
  {
    id: "fitness",
    keywords: ["gym", "fitness", "workout", "training", "coach", "yoga", "crossfit", "personal trainer", "sport"],
    nameSuffixes: ["Fitness", "Performance", "Gym", "Training", "Athletics", "Strength"],
    taglines: ["Stronger every day", "Train hard. Live strong.", "Your transformation starts here"],
    heroHeadlines: [
      "Transform your body, transform your life",
      "Train with the best, become your best",
      "Stronger starts here",
    ],
    heroSubheadlines: [
      "Personalized training programs and a community that pushes you further, every single day.",
      "State-of-the-art facilities and expert coaches ready to help you crush your goals.",
      "Join a community dedicated to helping you become the strongest version of yourself.",
    ],
    ctaLabels: ["Start your trial", "Join now", "Book a free class"],
    aboutTitles: ["Why train with us", "Our philosophy"],
    aboutBodies: [
      "We believe fitness is more than a workout — it's a lifestyle. Our certified coaches build programs around your goals, and our community keeps you accountable every step of the way.",
    ],
    features: [
      { title: "Expert coaching", body: "Certified trainers who build programs around your goals.", icon: "dumbbell" },
      { title: "Flexible classes", body: "Morning, noon, or night — there's a class that fits your schedule.", icon: "calendar" },
      { title: "Modern equipment", body: "Top-of-the-line equipment maintained to the highest standard.", icon: "zap" },
      { title: "Supportive community", body: "Train alongside people who will push you to be better.", icon: "users" },
    ],
    navLinks: ["Programs", "Schedule", "Membership", "Contact"],
    font: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif",
  },
  {
    id: "portfolio",
    keywords: ["portfolio", "designer", "photographer", "artist", "studio", "freelance", "creative", "architecture"],
    nameSuffixes: ["Studio", "Design", "Creative", "Works", "Atelier"],
    taglines: ["Design that speaks", "Crafted with intention", "Where ideas take shape"],
    heroHeadlines: [
      "Crafting bold ideas into beautiful work",
      "Design that tells your story",
      "Turning vision into reality",
    ],
    heroSubheadlines: [
      "A curated collection of work spanning brand, digital, and print — built with intention.",
      "I help ambitious brands stand out through thoughtful, considered design.",
      "Every project starts with a story. Let's tell yours.",
    ],
    ctaLabels: ["View my work", "See the portfolio", "Let's talk"],
    aboutTitles: ["About me", "The person behind the work"],
    aboutBodies: [
      "I'm a multidisciplinary designer with a decade of experience helping brands find their voice. My work blends strategy and craft to create things that are as effective as they are beautiful.",
    ],
    features: [
      { title: "Brand identity", body: "Distinct visual systems that make brands unforgettable.", icon: "sparkles" },
      { title: "Web design", body: "Thoughtful, accessible interfaces that convert.", icon: "layout" },
      { title: "Art direction", body: "Cohesive creative direction across every touchpoint.", icon: "camera" },
      { title: "Print & packaging", body: "Tactile design that leaves a lasting impression.", icon: "package" },
    ],
    navLinks: ["Work", "About", "Services", "Contact"],
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  {
    id: "agency",
    keywords: ["agency", "marketing", "consulting", "digital agency", "growth", "branding"],
    nameSuffixes: ["Agency", "Collective", "Partners", "Group", "Digital"],
    taglines: ["Growth, engineered", "Ideas that move markets", "Your growth partner"],
    heroHeadlines: [
      "We build brands that break through",
      "Growth strategies that actually work",
      "Marketing that moves the needle",
    ],
    heroSubheadlines: [
      "A full-service digital agency helping ambitious brands grow through strategy, design, and data.",
      "We partner with brands to build campaigns that convert and stories that stick.",
      "From strategy to execution, we're the team behind some of the fastest-growing brands.",
    ],
    ctaLabels: ["Book a strategy call", "Get in touch", "Start a project"],
    aboutTitles: ["Who we are", "Our approach"],
    aboutBodies: [
      "We're a team of strategists, designers, and marketers obsessed with growth. We combine data-driven thinking with world-class creative to help our partners win in crowded markets.",
    ],
    features: [
      { title: "Brand strategy", body: "Positioning that makes your brand impossible to ignore.", icon: "target" },
      { title: "Performance marketing", body: "Campaigns engineered to drive measurable growth.", icon: "trending" },
      { title: "Creative production", body: "Scroll-stopping content across every channel.", icon: "sparkles" },
      { title: "Analytics & insight", body: "Data-backed decisions at every stage of the funnel.", icon: "chart" },
    ],
    navLinks: ["Services", "Work", "About", "Contact"],
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  {
    id: "ecommerce",
    keywords: ["shop", "store", "ecommerce", "e-commerce", "boutique", "products", "brand", "fashion", "jewelry"],
    nameSuffixes: ["Co.", "Goods", "Market", "Studio", "Shop"],
    taglines: ["Made to last", "Quality you can feel", "Thoughtfully made, ethically sourced"],
    heroHeadlines: [
      "Thoughtfully designed, made to last",
      "Discover pieces you'll love for years",
      "Quality goods, honestly made",
    ],
    heroSubheadlines: [
      "Small-batch, sustainably made products designed for everyday life.",
      "Every piece is crafted with intention using premium, responsibly sourced materials.",
      "Shop our latest collection — designed in-house, made to last a lifetime.",
    ],
    ctaLabels: ["Shop now", "Explore the collection", "Shop new arrivals"],
    aboutTitles: ["Our story", "Why we do this"],
    aboutBodies: [
      "We started this brand because we couldn't find products that matched our standards for quality and sustainability. So we made our own — thoughtfully designed, ethically produced, and built to last.",
    ],
    features: [
      { title: "Premium materials", body: "Sourced from trusted, sustainable suppliers.", icon: "gem" },
      { title: "Free shipping", body: "Free shipping and easy returns on every order.", icon: "truck" },
      { title: "Handcrafted quality", body: "Every piece checked by hand before it ships.", icon: "heart" },
      { title: "Loved by thousands", body: "Rated 4.9/5 by customers worldwide.", icon: "star" },
    ],
    navLinks: ["Shop", "Collections", "About", "Contact"],
    font: "'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif",
  },
  {
    id: "general",
    keywords: [],
    nameSuffixes: ["Co.", "Group", "Studio", "Hub"],
    taglines: ["Built for what's next", "Simple. Powerful. Yours.", "Ideas worth building"],
    heroHeadlines: ["Build something people love", "Everything you need, beautifully simple", "Your next big idea starts here"],
    heroSubheadlines: [
      "A modern, thoughtfully designed experience built to help you grow.",
      "We help you turn great ideas into experiences people remember.",
      "Simple, powerful tools designed around how you actually work.",
    ],
    ctaLabels: ["Get started", "Learn more", "Get in touch"],
    aboutTitles: ["About us", "Our story"],
    aboutBodies: [
      "We believe great experiences are built on simplicity, care, and craft. Every detail is designed with our customers in mind, because that's what makes something worth using.",
    ],
    features: [
      { title: "Thoughtfully designed", body: "Every detail considered, nothing left to chance.", icon: "sparkles" },
      { title: "Built to scale", body: "Reliable performance whether you're just starting or scaling fast.", icon: "trending" },
      { title: "Always supported", body: "A team that's here for you whenever you need us.", icon: "heart" },
      { title: "Trusted by many", body: "Join a growing community who trust us every day.", icon: "users" },
    ],
    navLinks: ["Home", "About", "Services", "Contact"],
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
];

export function detectIndustry(prompt: string): IndustryProfile {
  const p = prompt.toLowerCase();
  let best = INDUSTRIES[INDUSTRIES.length - 1];
  let bestScore = 0;
  for (const ind of INDUSTRIES) {
    const score = ind.keywords.reduce((acc, kw) => (p.includes(kw) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      best = ind;
    }
  }
  return best;
}

export function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}
