'use client';

import { useEffect, useState } from 'react';
import { getVisitorStats, type VisitorStats } from '@/lib/analytics';

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Real numbers only — scoped to this browser's own localStorage, not
 * global site traffic. No fabricated trends, device breakdowns, or growth
 * percentages: if it can't be genuinely measured client-side, it isn't shown.
 */
export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<VisitorStats | null>(null);

  useEffect(() => {
    setStats(getVisitorStats());
  }, []);

  if (!stats) {
    return <p className="font-mono text-sm text-text-faint">loading...</p>;
  }

  const routes = Object.entries(stats.pageViews || {}).sort((a, b) => b[1] - a[1]);
  const maxViews = Math.max(1, ...routes.map(([, v]) => v));

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 border-y border-rule py-8 font-mono text-sm sm:grid-cols-3">
        <div>
          <div className="text-3xl font-bold text-accent">{stats.totalVisits}</div>
          <div className="mt-1 text-xs uppercase tracking-widest text-text-faint">
            page loads, this browser
          </div>
        </div>
        <div>
          <div className="text-text">{stats.firstVisit ? formatTimestamp(stats.firstVisit) : '—'}</div>
          <div className="mt-1 text-xs uppercase tracking-widest text-text-faint">first visit</div>
        </div>
        <div>
          <div className="text-text">{stats.lastVisit ? formatTimestamp(stats.lastVisit) : '—'}</div>
          <div className="mt-1 text-xs uppercase tracking-widest text-text-faint">last visit</div>
        </div>
      </div>

      <div className="mt-8">
        <div className="font-mono text-xs uppercase tracking-widest text-text-faint">
          # page views by route
        </div>
        {routes.length === 0 ? (
          <p className="mt-3 font-mono text-sm text-text-faint">
            no page views recorded yet — this fills in as the site gets visited.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {routes.map(([route, views]) => (
              <div key={route} className="font-mono text-xs">
                <div className="flex items-center justify-between text-text-soft">
                  <span>{route === '/' ? '/ (home)' : route}</span>
                  <span className="text-text-faint">{views}</span>
                </div>
                <div className="mt-1 h-1 w-full bg-bg-panel">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${Math.max(4, (views / maxViews) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
