import { getGitHubData } from '@/lib/data';
import { PageShell } from '@/components/redesign/layout/PageShell';
import { RepoStatsIndex } from '@/components/redesign/systems/RepoStatsIndex';

export const metadata = {
  title: 'Repository Stats — Sanjay Krishnan JV',
  description: 'Public GitHub repository statistics — stars, forks, languages, and activity.',
};

export default function ProjectStatsPage() {
  const github = getGitHubData();

  return (
    <PageShell breadcrumb="~/systems/repos">
      <div className="font-mono text-sm text-text-faint">
        <span className="text-accent">$</span> curl -s api.github.com/repos
      </div>
      <h1 className="mt-4 font-mono text-3xl font-bold text-text md:text-4xl">
        Public repository stats.
      </h1>
      <p className="mt-3 max-w-xl font-sans text-sm text-text-soft">
        Synced daily from GitHub — stars, forks, and languages across public, non-fork
        repositories. Private repos (client and studio work) aren&apos;t part of this count.
      </p>

      <div className="mt-10">
        <RepoStatsIndex
          repos={github.repositories}
          totalStars={github.stats.totalStars}
          totalForks={github.stats.totalForks}
          languages={github.stats.languages}
        />
      </div>
    </PageShell>
  );
}
