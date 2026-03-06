'use client';

import { motion } from 'framer-motion';
import { Github, Star, GitFork, Users, BookOpen } from 'lucide-react';
import { useGitHubData } from '@/app/data-provider';
import { formatNumber } from '@/lib/utils';

interface StatCard {
  label: string;
  value: number;
  icon: any;
  color: string;
}

export default function GitHubActivity() {
  const githubData = useGitHubData();
  const stats = githubData.stats || {};
  const profile = githubData.profile || {};

  const statCards: StatCard[] = [
    {
      label: 'Total Repositories',
      value: stats.totalRepos || 0,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Total Stars',
      value: stats.totalStars || 0,
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      label: 'Total Forks',
      value: stats.totalForks || 0,
      icon: GitFork,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Followers',
      value: stats.followers || 0,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const languages = stats.languages || {};
  const topLanguages = Object.entries(languages as Record<string, number>)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const total = topLanguages.reduce((sum, [, bytes]) => sum + bytes, 0);

  return (
    <section id="github-activity" className="section bg-dark-100/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="mb-4">
              GitHub <span className="gradient-text">Activity</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Open source contributions and development statistics
            </p>
          </div>

          {Object.keys(stats).length === 0 ? (
            <div className="text-center py-12">
              <div className="glass rounded-xl p-8 max-w-md mx-auto">
                <Github className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                <p className="text-dark-600 mb-4">
                  No GitHub data loaded yet. Run the sync script to fetch statistics.
                </p>
                <code className="glass px-4 py-2 rounded-lg">npm run sync-github</code>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {statCards.map((stat: StatCard, index: number) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20 w-fit mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-4xl font-bold mb-2 gradient-text">
                        {formatNumber(stat.value)}
                      </p>
                      <p className="text-dark-600">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Language Chart */}
              {topLanguages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass rounded-xl p-8 max-w-4xl mx-auto"
                >
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Github className="w-6 h-6 text-primary-400" />
                    Most Used Languages
                  </h3>

                  <div className="space-y-6">
                    {topLanguages.map(([language, bytes], index) => {
                      const percentage = ((bytes / total) * 100).toFixed(1);
                      const colors = [
                        'bg-blue-500',
                        'bg-yellow-500',
                        'bg-green-500',
                        'bg-purple-500',
                        'bg-pink-500',
                      ];

                      return (
                        <div key={language}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{language}</span>
                            <span className="text-dark-600">{percentage}%</span>
                          </div>
                          <div className="h-3 bg-dark-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${percentage}%` }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.1, duration: 0.8 }}
                              className={`h-full ${colors[index % colors.length]} rounded-full`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Profile Link */}
              {profile.username && (
                <div className="text-center mt-12">
                  <a
                    href={`https://github.com/${profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <Github className="w-5 h-5" />
                    View GitHub Profile
                  </a>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
