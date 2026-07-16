export interface CaseStudy {
  id: string;
  name: string;
  tagline: string;
  role: string;
  visibility: 'public' | 'private';
  url?: string;
  repoUrl?: string;
  lastUpdated: string;
  stack: string[];
  description: string;
  highlights: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'winnoventures',
    name: 'Winnoventures',
    tagline: 'Software studio for client and product engineering.',
    role: 'Founder',
    visibility: 'private',
    url: 'https://winnoventures.vercel.app',
    lastUpdated: 'Jul 2026',
    stack: ['Next.js', 'TypeScript'],
    description:
      "The studio behind the client and product work below — full-stack engineering, cloud infrastructure, and applied AI, delivered end to end rather than consulted on.",
    highlights: [
      'Custom software and full-stack web/mobile development',
      'Cloud infrastructure and DevOps automation across AWS, Azure, and GCP',
      'Applied AI — LLM integrations, predictive analytics, chatbots',
      'UI/UX design and security assessments',
    ],
  },
  {
    id: 'winora',
    name: 'Winora',
    tagline: 'Customer support platform — a full alternative to Intercom, Zendesk, and Freshdesk.',
    role: 'Founder & engineer, built through Winnoventures',
    visibility: 'private',
    url: 'https://winora.dev',
    lastUpdated: 'Jul 2026',
    stack: ['Next.js 15', 'TypeScript', 'PostgreSQL', 'Prisma', 'Expo'],
    description:
      'A complete customer support platform covering the full lifecycle — chat widget through to tickets and proactive outreach — built as a real alternative to the incumbents rather than a clone of one. Backed by a companion Expo mobile app.',
    highlights: [
      'Omnichannel inbox — chat widget, email, WhatsApp, Instagram DM, Telegram, X, Facebook Messenger, and SMS in one thread view, over Server-Sent Events',
      'AI triage, sentiment analysis, auto-tagging, and reply suggestions on every conversation, with a bring-your-own-model choice of OpenRouter, OpenAI, Anthropic, Groq, or Ollama',
      'In-browser WebRTC voice calls and rrweb-powered co-browsing — no phone number or third-party plugin required',
      'Ticketing with SLA policies and two-way Jira sync',
    ],
  },
  {
    id: 'orby-jewels',
    name: 'Orby Jewels',
    tagline: 'Luxury jewellery e-commerce platform for a client.',
    role: 'Engineer, built through Winnoventures',
    visibility: 'private',
    lastUpdated: 'May 2026',
    stack: ['Next.js 15', 'TypeScript', 'Prisma', 'PostgreSQL', 'Razorpay'],
    description:
      'A production storefront and admin dashboard for a luxury jewellery client — built and deployed entirely on free-tier infrastructure without cutting corners on the customer experience.',
    highlights: [
      'Storefront with real-time search, wishlist, coupons, and Razorpay checkout',
      'Admin dashboard for products, orders, customers, and revenue analytics',
      'Custom luxury UI — Playfair Display and Poppins typography, Framer Motion throughout',
      'Zero-cost stack: Vercel, Neon Postgres, Cloudinary, and NextAuth.js',
    ],
  },
  {
    id: 'winorganiser',
    name: 'WinOrganiser',
    tagline: 'Gmail automation — rules-first inbox triage with an LLM fallback.',
    role: 'Solo builder',
    visibility: 'private',
    lastUpdated: 'Jul 2026',
    stack: ['Python', 'Gmail API'],
    description:
      "A production-ready inbox cleanup tool that classifies, labels, and safely archives Gmail by rule first — sender, subject, and keyword matching — only calling an LLM when the rules can't confidently decide, to keep API usage and false positives low.",
    highlights: [
      'Rule-based classification with an optional OpenAI/Gemini fallback, not the other way around',
      'Priority labels with hard guards against archiving anything unread, starred, or important',
      "Duplicate detection, learned sender-domain rules, and a --dry-run mode that prints intended actions without touching Gmail",
      'Scheduler installers for macOS launchd, Linux cron, and Windows Task Scheduler',
    ],
  },
  {
    id: 'criciq',
    name: 'CricIQ',
    tagline: 'Cricket tournament and match management, with live ball-by-ball scoring.',
    role: 'Solo builder',
    visibility: 'public',
    repoUrl: 'https://github.com/SanjayKrishnanJV/CricIQ',
    lastUpdated: 'Feb 2026',
    stack: ['Next.js', 'Express', 'TypeScript', 'PostgreSQL', 'Socket.io'],
    description:
      'A full tournament management system — players, teams, auctions, and a live ball-by-ball scoring engine — built to run a real cricket league end to end rather than just track scores.',
    highlights: [
      'Live ball-by-ball scoring with auto strike rotation, partnership analysis, and real-time updates over Socket.io',
      'Auction system for player bidding with budget validation and contract management',
      'Analytics module — win probability, MVP auto-selection, run-rate graphs',
      'Gamification — achievement badges, XP/level progression, and fantasy cricket with private leagues',
    ],
  },
];

export function getCaseStudy(id: string) {
  return caseStudies.find((study) => study.id === id);
}
