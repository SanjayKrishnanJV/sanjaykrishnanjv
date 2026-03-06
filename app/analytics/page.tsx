import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Analytics Dashboard - Sanjay Krishnan JV',
  description: 'Visitor analytics and statistics',
};

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen pt-20 pb-20">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Analytics <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-lg text-dark-600 mb-2">
            Client-side visitor tracking and analytics demonstration
          </p>
          <p className="text-sm text-dark-700 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2 inline-block">
            Note: This is a demo dashboard using localStorage for client-side tracking
          </p>
        </div>

        {/* Dashboard */}
        <AnalyticsDashboard />
      </div>
    </main>
  );
}
