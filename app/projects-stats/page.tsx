import ProjectStatsDashboard from '@/components/github/ProjectStatsDashboard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Project Statistics - Sanjay Krishnan JV',
  description: 'Live GitHub repository statistics and analytics',
};

export default function ProjectStatsPage() {
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
            Project <span className="gradient-text">Statistics</span>
          </h1>
          <p className="text-lg text-dark-600">
            Live GitHub repository analytics and insights
          </p>
        </div>

        {/* Dashboard */}
        <ProjectStatsDashboard />
      </div>
    </main>
  );
}
