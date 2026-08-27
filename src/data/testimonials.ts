export type ProjectDomain = "FinTech" | "SaaS" | "AI / ML" | "POS / Retail" | "Operations" | "Infrastructure";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  projectTitle: string;
  projectType: ProjectDomain;
  techStack: string[];
  quote: string;
  highlight: string;
  metricOrOutcome: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "jonas-s",
    name: "Jonas S.",
    role: "Lending Operations Manager",
    projectTitle: "Automated Credit Investigation & Decision Support System",
    projectType: "FinTech",
    techStack: ["Decision Support", "Credit Scoring", "Role-Based Access"],
    quote:
      "Jun turned a slow, paper-based credit investigation process into a system our officers actually enjoy using. Approvals that took days now happen the same day, and the decision support reports gave our management real confidence in every recommendation.",
    highlight: "Same-day credit decisions instead of multi-day manual investigations.",
    metricOrOutcome: "Days of manual investigation reduced to same-day approvals",
  },
  {
    id: "van-m",
    name: "Van M.",
    role: "Property Business Owner",
    projectTitle: "Multi-Tenant Property Management & Billing Platform",
    projectType: "SaaS",
    techStack: ["Multi-Tenant", "Stripe API", "Automated Billing"],
    quote:
      "Billing used to be spreadsheets, follow-ups, and missed payments. Now rent collection runs itself — invoices go out on schedule, payments are tracked automatically through Stripe, and I can see the status of every unit at a glance.",
    highlight: "Hands-off recurring billing across multiple tenant accounts.",
    metricOrOutcome: "Zero-chase automated rent collection via Stripe integration",
  },
  {
    id: "ken-d",
    name: "Ken D.",
    role: "Retail Store Owner",
    projectTitle: "Offline-First POS & Inventory Sync System",
    projectType: "POS / Retail",
    techStack: ["Offline-First", "Atomic Stock Deduction", "Receipt Printing"],
    quote:
      "Internet drops used to mean we stopped selling or risked overselling. With Jun's offline-first POS, checkout keeps working no matter what, stock stays accurate, and everything syncs cleanly once we're back online.",
    highlight: "Uninterrupted sales even during internet outages.",
    metricOrOutcome: "Zero overselling incidents with atomic inventory deduction",
  },
  {
    id: "alexa-lei-b",
    name: "Alexa Lei B.",
    role: "Salon Founder",
    projectTitle: "AI-Powered Salon Booking & Decision Support System",
    projectType: "AI / ML",
    techStack: ["Machine Learning", "Booking Engine", "Analytics"],
    quote:
      "The system doesn't just take bookings — it helps me decide. Peak hours, staff assignments, service demand — it's all surfaced for me. Clients book faster, and double bookings basically disappeared overnight.",
    highlight: "Data-backed scheduling decisions with conflict-free bookings.",
    metricOrOutcome: "Double bookings eliminated through intelligent scheduling",
  },
  {
    id: "jenny-h",
    name: "Jenny H.",
    role: "Sales Supervisor",
    projectTitle: "Intelligent Sales & Inventory Management System",
    projectType: "AI / ML",
    techStack: ["Demand Forecasting", "Low-Stock Alerts", "Sales Analytics"],
    quote:
      "We were always either overstocked or scrambling. The forecasting alerts changed that completely. I know what's moving and what to reorder before it becomes a problem — purchasing is finally proactive instead of reactive.",
    highlight: "Producible reordering driven by sales trend analysis.",
    metricOrOutcome: "Stockouts and overstock dramatically reduced via forecasting",
  },
  {
    id: "klois-d",
    name: "Klois D.",
    role: "Fleet Operations Lead",
    projectTitle: "End-to-End Vehicle Rental & Fleet Management System",
    projectType: "Operations",
    techStack: ["Fleet Tracking", "Reservation System", "Maintenance Logs"],
    quote:
      "Managing rentals over chat and notebooks was a nightmare. Now every vehicle, booking, and maintenance schedule lives in one system. Disputes dropped because everything is documented, and utilization is finally visible.",
    highlight: "Single source of truth for fleet status and reservations.",
    metricOrOutcome: "Full audit trail across bookings, vehicles, and maintenance",
  },
  {
    id: "joyce-s",
    name: "Joyce S.",
    role: "Small Business Consultant",
    projectTitle: "Web Infrastructure, UI/UX & Cloud Deployment",
    projectType: "Infrastructure",
    techStack: ["Cloud Deployment", "UI/UX", "Performance Tuning"],
    quote:
      "Jun rebuilt our web presence from the ground up — faster load times, cleaner design, and deployments that just work. Downtime went from a regular worry to something we simply don't think about anymore.",
    highlight: "Reliable cloud deployment with zero-downtime updates.",
    metricOrOutcome: "Zero-downtime architecture after full infrastructure rebuild",
  },
];

export const TESTIMONIAL_FILTERS = [
  "All",
  "SaaS",
  "FinTech",
  "AI / ML",
  "POS / Retail",
] as const;

export type TestimonialFilter = (typeof TESTIMONIAL_FILTERS)[number];
