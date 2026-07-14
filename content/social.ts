export interface LinkedInPost {
  date: string;
  url: string;
  excerpt: string;
  tags: string[];
}

export interface NewsletterIssue {
  title: string;
  date: string;
}

// Manually curated — LinkedIn and Instagram don't offer post-reading APIs to
// third-party apps, so this is updated by hand rather than auto-synced like
// data/github.json.
export const linkedinPosts: LinkedInPost[] = [
  {
    date: 'Jul 9, 2026',
    url: 'https://www.linkedin.com/posts/sanjaykrishnanjv_buildwhatmatters-artificialinteligence-anthropic-activity-7480899507463880704-2vK4',
    excerpt:
      "A leading AI model went dark for 18 days — and most teams that depended on it had no backup plan. We've spent a decade building redundancy into servers; we haven't applied the same discipline to AI models yet. The question worth asking: what breaks first at your company if your primary model goes offline tomorrow?",
    tags: ['buildwhatmatters', 'ArtificialInteligence', 'Anthropic'],
  },
  {
    date: 'Jul 7, 2026',
    url: 'https://www.linkedin.com/posts/sanjaykrishnanjv_avd-vdi-azure-activity-7479919600051167233-YOgl',
    excerpt:
      "AI won't replace VDI admins — but it's already replacing the tickets that trained them. Password resets, profile issues, session host failures: that ladder is how every senior AVD engineer learned the job. Automation is closing the L1 queue before juniors ever touch it, and you can't promote someone from tickets they never worked.",
    tags: ['AVD', 'VDI', 'Azure', 'ITCareers', 'AI'],
  },
];

export const newsletter = {
  name: 'Build What Matters',
  url: 'https://www.linkedin.com/newsletters/build-what-matters-7470116443070582786/',
  frequency: 'Weekly',
  description:
    'Beyond headlines, beyond hype — deep dives into AI breakthroughs, startup strategy, and emerging technology.',
  recentIssues: [
    { title: "The Day the World's Best AI Model Went Offline", date: 'Jul 6, 2026' },
    { title: 'The End of Junior Engineers? What AI Agents Mean for Your Career', date: 'Jun 17, 2026' },
    { title: 'The People Building AI Are Asking Us To Slow Down', date: 'Jun 9, 2026' },
  ] as NewsletterIssue[],
};

export const instagram = {
  handle: 'victorious_triumphant',
  url: 'https://www.instagram.com/victorious_triumphant/',
  displayName: 'Sanjay Krishnan J V',
  pronouns: 'he/him/his',
  posts: 235,
  followers: 686,
  following: 1348,
  bioTag: 'Gamer',
  bio: 'Passionate Photographer · Adventure Seeker · MT15 Rider',
};
