import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import { PageShell } from '@/components/redesign/layout/PageShell';

export const metadata = {
  title: 'Analytics — Sanjay Krishnan JV',
  description: 'Real, client-side page-view tracking scoped to this browser.',
};

export default function AnalyticsPage() {
  return (
    <PageShell breadcrumb="~/systems/analytics">
      <div className="font-mono text-sm text-text-faint">
        <span className="text-accent">$</span> cat ~/.local/analytics.json
      </div>
      <h1 className="mt-4 font-mono text-3xl font-bold text-text md:text-4xl">
        Local page-view log.
      </h1>
      <p className="mt-3 max-w-xl font-sans text-sm text-text-soft">
        Tracked client-side in this browser's localStorage — not a global traffic counter.
        There's no server collecting this, so it only ever reflects your own visits here.
      </p>

      <div className="mt-10">
        <AnalyticsDashboard />
      </div>
    </PageShell>
  );
}
