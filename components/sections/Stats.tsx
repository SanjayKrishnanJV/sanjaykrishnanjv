'use client';

import { motion } from 'framer-motion';
import { Star, GitFork, Users, Code, Award, TrendingUp } from 'lucide-react';
import { useGitHubData } from '@/app/data-provider';
import { useEffect, useState } from 'react';

interface Stat {
  icon: any;
  label: string;
  value: number;
  color: string;
}

export default function Stats() {
  const githubData = useGitHubData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !githubData) return null;

  const stats: Stat[] = [
    {
      icon: Code,
      label: 'Repositories',
      value: githubData.stats.totalRepos,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Star,
      label: 'Total Stars',
      value: githubData.stats.totalStars,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: GitFork,
      label: 'Total Forks',
      value: githubData.stats.totalForks,
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Users,
      label: 'Followers',
      value: githubData.stats.followers,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const topLanguages = Object.entries(githubData.stats.languages as Record<string, number>)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5);

  const totalBytes = topLanguages.reduce((sum, [, bytes]) => sum + (bytes as number), 0);

  return (
    <section id="stats" className="section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="mb-4">
              GitHub <span className="gradient-text">Stats</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Real-time statistics from my GitHub profile
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat: Stat, index: number) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${stat.color} mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-dark-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Language Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-xl p-8 max-w-3xl mx-auto"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary-400" />
              Language Distribution
            </h3>

            <div className="space-y-4">
              {topLanguages.map(([language, bytes]: [string, number], index: number) => {
                const percentage = ((bytes as number) / totalBytes) * 100;
                const colors = [
                  'from-blue-500 to-cyan-500',
                  'from-purple-500 to-pink-500',
                  'from-green-500 to-emerald-500',
                  'from-yellow-500 to-orange-500',
                  'from-red-500 to-pink-500',
                ];

                return (
                  <div key={language}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{language}</span>
                      <span className="text-dark-600">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-dark-200/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 1, ease: 'easeOut' }}
                        className={`h-full bg-gradient-to-r ${colors[index]} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
