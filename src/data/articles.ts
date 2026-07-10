export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image: string;
  href: string;
  category: "pinned" | "articles" | "blogs";
}

const BASE = "/quick-portfolio/assets";

export const ARTICLES: Article[] = [
  {
    slug: "accessibility-semantic-html-aria",
    title: "Accessibility First: Semantic HTML and ARIA",
    description:
      "Why semantic HTML is the bedrock of a usable web and how to implement ARIA roles correctly.",
    date: "Feb 11, 2026",
    tags: ["Tech & Engineering"],
    image: `${BASE}/accesibility-image.webp`,
    href: "articles/accessibility-semantic-html-aria/",
    category: "pinned",
  },
  {
    slug: "solar-system-showcase",
    title: "The Solar System (Interactive 3D)",
    description:
      "Exploring the intersection of educational technology and interactive 3D graphics in my latest portfolio project.",
    date: "May 14, 2026",
    tags: ["3D Graphics", "Portfolio Showcase"],
    image: `${BASE}/solar-system.webp`,
    href: "/quick-portfolio/portfolio/solar-system-showcase/index.html",
    category: "pinned",
  },
  {
    slug: "bayanihan-scaffolding",
    title: "Bayanihan: Bulacan Pre-Development Research and Scaffolding Document",
    description:
      "Technical, structural, and legal blueprint for Bayanihan\u2014an autonomous, decentralized collective intelligence platform for the Bulacan region.",
    date: "Jun 26, 2026",
    tags: ["Research & Systems", "Decentralization"],
    image: `${BASE}/bayanihan.png`,
    href: "articles/bayanihan-scaffolding/",
    category: "articles",
  },
  {
    slug: "manual-data-entry-waste",
    title: "The Hidden Cost of Manual Data Entry: Wasted Hours & Operational Leaks",
    description:
      "An in-depth analysis of how manual data entry wastes 10+ hours a week per employee and a cost analysis of manual data errors, with practical automation solutions.",
    date: "May 21, 2026",
    tags: ["Business Automation", "ROI Analysis", "Workflow Strategy"],
    image: `${BASE}/automation-pickup.png`,
    href: "articles/manual-data-entry-waste/",
    category: "articles",
  },
  {
    slug: "ai-agent-saving-money",
    title: "Beyond the Hype: How AI Agents Actually Cut Administrative Costs",
    description:
      "A practical, non-technical guide on how LLMs differ from autonomous AI Agents, and how background document parsers and email auto-responders reduce administrative overhead.",
    date: "May 21, 2026",
    tags: ["AI Agents", "Cost Reduction", "Systems Engineering"],
    image: `${BASE}/tropang-ai.png`,
    href: "articles/ai-agent-saving-money/",
    category: "articles",
  },
  {
    slug: "exceptional-human-performance",
    title: "The Science of Exceptional Human Performance: A Comprehensive Guide to Optimization",
    description:
      "An exhaustive analysis of fourteen core domains of human performance, detailing biological mechanisms and evidence-based protocols for optimization.",
    date: "Mar 20, 2026",
    tags: ["Performance Science", "Biohacking", "Optimization"],
    image: `${BASE}/exceptional-human-performance.webp`,
    href: "articles/exceptional-human-performance/",
    category: "articles",
  },
  {
    slug: "freelance-developer-pricing-guide",
    title: "Freelance Software Development Pricing in the Philippines: 2026 Stack-Specific Market Dynamics",
    description:
      "A comprehensive analysis of freelance software development pricing in the Philippines for 2026, covering market dynamics, tech stacks, databases, and total cost of ownership.",
    date: "Mar 05, 2026",
    tags: ["Freelancing", "Pricing Strategy", "Philippines Market", "Tech Careers"],
    image: `${BASE}/freelance_pricing_guide.png`,
    href: "articles/freelance-developer-pricing-guide/",
    category: "articles",
  },
  {
    slug: "legal-kit-ni-juan",
    title: "Book Report: The Democratization of Philippine Jurisprudence (Legal Kit ni Juan)",
    description:
      "An exhaustive analysis of the democratization of Philippine jurisprudence through Atty. Christian D. Sorongon's seminal work.",
    date: "Feb 21, 2026",
    tags: ["Legal Tech", "Philippine Law", "Book Report"],
    image: `${BASE}/legal-kit-ni-juan.webp`,
    href: "articles/legal-kit-ni-juan/",
    category: "articles",
  },
  {
    slug: "sovereign-imperatives-articles",
    title: "Sovereign Imperatives: The Kalayaan Island Group & WPS",
    description:
      "A comprehensive analysis of the legal, historical, and geopolitical foundations establishing Philippine sovereignty over the Kalayaan Island Group.",
    date: "Feb 12, 2026",
    tags: ["Geopolitics", "National Sovereignty", "West Philippine Sea"],
    image: `${BASE}/marcoleta.webp`,
    href: "articles/sovereign-imperatives/",
    category: "articles",
  },
  {
    slug: "accessibility-semantic-html-aria-articles",
    title: "Accessibility First: Semantic HTML and ARIA",
    description:
      "Why semantic HTML is the bedrock of a usable web and how to implement ARIA roles correctly.",
    date: "Feb 11, 2026",
    tags: ["Accessibility (a11y)", "Semantic HTML", "W3C Standards", "Frontend"],
    image: `${BASE}/accesibility-image.webp`,
    href: "articles/accessibility-semantic-html-aria/",
    category: "articles",
  },
  {
    slug: "how-to-read-people",
    title: "Book Report: How to Read People Like a Book",
    description:
      "A deep dive into understanding human behavior, motivation, and non-verbal communication.",
    date: "Feb 06, 2026",
    tags: ["Psychology", "Human Behavior", "Book Report"],
    image: `${BASE}/read-people-like-a-book.webp`,
    href: "articles/how-to-read-people/",
    category: "articles",
  },
  {
    slug: "ikigai-book-report",
    title: "Book Report: Ikigai: The Japanese Secret to a Long and Happy Life",
    description:
      "A personal reflection on finding purpose, flow states, and meaning through the Japanese concept of ikigai.",
    date: "Jul 10, 2026",
    tags: ["Book Report", "Personal Development", "Philosophy"],
    image: `${BASE}/ikigai-book.jpg`,
    href: "articles/ikigai-book-report/",
    category: "blogs",
  },
  {
    slug: "solar-system-blog",
    title: "The Solar System",
    description:
      "Exploring the intersection of educational technology and interactive 3D graphics in my latest portfolio project.",
    date: "May 14, 2026",
    tags: ["3D Graphics", "Three.js", "Educational Tech"],
    image: `${BASE}/solar-system.webp`,
    href: "/quick-portfolio/portfolio/solar-system-showcase/index.html",
    category: "blogs",
  },
];

export const PINNED = ARTICLES.filter((a) => a.category === "pinned");
export const ARTICLE_ITEMS = ARTICLES.filter((a) => a.category === "articles");
export const BLOG_ITEMS = ARTICLES.filter((a) => a.category === "blogs");
