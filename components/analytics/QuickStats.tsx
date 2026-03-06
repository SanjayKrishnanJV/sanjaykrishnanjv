'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Eye, Clock, Globe } from 'lucide-react';
import { getGlobalStats, formatCount } from '@/lib/analytics';

export default function QuickStats() {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalPageViews: 0,
    averageTimeOnSite: '0m 0s',
    topPages: [] as Array<{ page: string; views: number }>,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const globalStats = getGlobalStats();
    setStats(globalStats);
  }, []);

  if (!isClient) {
    return null;
  }

  const quickStats = [
    {
      label: 'Total Visitors',
      value: formatCount(stats.totalVisitors),
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Page Views',
      value: formatCount(stats.totalPageViews),
      icon: Eye,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Avg. Time on Site',
      value: stats.averageTimeOnSite,
      icon: Clock,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Engagement Rate',
      value: '68%',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary-400" />
        Quick Analytics
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20 mb-2`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-dark-600">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Top Pages */}
      {stats.topPages.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-sm font-semibold mb-3 text-dark-600">Top Pages</h4>
          <div className="space-y-2">
            {stats.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between text-sm">
                <span className="text-dark-700">{page.page}</span>
                <span className="text-primary-400 font-semibold">{page.views} views</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
