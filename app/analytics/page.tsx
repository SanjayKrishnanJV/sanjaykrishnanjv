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
          <p className="text-lg text-dark-600">
            Real-time visitor statistics and insights
          </p>
        </div>

        {/* Dashboard */}
        <AnalyticsDashboard />
      </div>
    </main>
  );
}
