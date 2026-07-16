interface Repo {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage?: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  openIssues: number;
}

interface RepoStatsIndexProps {
  repos: Repo[];
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>;
}

const SWATCHES = ['#4fd1a5', '#7c9cae', '#c9a66b', '#8a8f87', '#5f8f7a', '#9c8f6f'];

function formatUpdated(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function RepoStatsIndex({ repos, totalStars, totalForks, languages }: RepoStatsIndexProps) {
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  const langBars = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, percent: Math.round((value / total) * 100) }))
    .filter((l) => l.percent > 0);

  const sorted = [...repos].sort((a, b) => b.stars - a.stars);

  return (
    <div>
      <div className="grid grid-cols-2 gap-6 border-y border-rule py-8 font-mono text-sm md:grid-cols-4">
        {[
          { label: 'public repos', value: repos.length },
          { label: 'total stars', value: totalStars },
          { label: 'total forks', value: totalForks },
          { label: 'languages', value: langBars.length },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="text-2xl font-bold text-accent md:text-3xl">{stat.value}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-text-faint">{stat.label}</div>
          </div>
        ))}
      </div>

      {langBars.length > 0 && (
        <div className="mt-8 font-mono text-sm">
          <div className="text-xs uppercase tracking-widest text-text-faint"># language mix, by repo count</div>
          <div className="mt-3 flex h-2 w-full max-w-2xl overflow-hidden rounded-sm">
            {langBars.map((lang, i) => (
              <div key={lang.name} style={{ width: `${lang.percent}%`, backgroundColor: SWATCHES[i % SWATCHES.length] }} />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs">
            {langBars.map((lang, i) => (
              <div key={lang.name} className="flex items-center gap-2 text-text-soft">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SWATCHES[i % SWATCHES.length] }} />
                {lang.name} {lang.percent}%
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <div className="font-mono text-xs uppercase tracking-widest text-text-faint"># repositories, by stars</div>
        <div className="mt-4 divide-y divide-rule">
          {sorted.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              data-cursor-text="Open ↗"
              className="group block py-4 font-mono text-sm"
            >
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-text transition-colors group-hover:text-accent">{repo.name}</span>
                {repo.language && (
                  <span className="rounded border border-rule px-2 py-0.5 text-xs text-text-faint">
                    {repo.language}
                  </span>
                )}
                <span className="ml-auto text-xs text-text-faint">updated {formatUpdated(repo.updatedAt)}</span>
              </div>
              {repo.description && (
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-soft">{repo.description}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-text-faint">
                <span>★ {repo.stars}</span>
                <span>⑂ {repo.forks}</span>
                {repo.openIssues > 0 && <span>{repo.openIssues} open issues</span>}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
