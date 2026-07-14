export interface WorkItem {
  index: string;
  name: string;
  year: string;
  description: string;
  stack: string[];
  url: string;
}

// Editorial copy for the projects exhibit. Sourced from data/github.json
// repo names/languages — refine with real case-study detail as it's written.
export const work: WorkItem[] = [
  {
    index: '01',
    name: 'Portfolio',
    year: '2026',
    description:
      'This site. A Next.js build wired to auto-sync GitHub activity, certifications, and writing, so the record stays current without manual upkeep.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    url: 'https://github.com/SanjayKrishnanJV/sanjaykrishnanjv',
  },
  {
    index: '02',
    name: 'CricIQ',
    year: '2026',
    description:
      'A TypeScript project exploring cricket analytics — turning raw match data into something readable.',
    stack: ['TypeScript'],
    url: 'https://github.com/SanjayKrishnanJV/CricIQ',
  },
  {
    index: '03',
    name: 'Wintrail',
    year: '2026',
    description:
      'A JavaScript project for tracking trails — routes, distance, and terrain in one view.',
    stack: ['JavaScript'],
    url: 'https://github.com/SanjayKrishnanJV/Wintrail',
  },
];
