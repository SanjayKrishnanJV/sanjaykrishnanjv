'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  GitFork,
  Eye,
  Code,
  GitBranch,
  Users,
  Activity,
  TrendingUp,
  Github,
  ExternalLink,
} from 'lucide-react';

interface RepoStats {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  language: string;
  openIssues: number;
  size: number;
  createdAt: string;
  updatedAt: string;
  url: string;
  topics: string[];
}

export default function ProjectStatsDashboard() {
  const [repos, setRepos] = useState<RepoStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalStars: 0,
    totalForks: 0,
    totalRepos: 0,
    languages: {} as Record<string, number>,
  });

  useEffect(() => {
    fetchGitHubStats();
  }, []);

  const fetchGitHubStats = async () => {
    try {
      const username = 'SanjayKrishnanJV';
      const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || '';

      const response = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.ok) {
        const data = await response.json();

        const repoStats: RepoStats[] = data
          .filter((repo: any) => !repo.fork) // Exclude forked repos
          .map((repo: any) => ({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || 'No description',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            watchers: repo.watchers_count,
            language: repo.language || 'Unknown',
            openIssues: repo.open_issues_count,
            size: repo.size,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            url: repo.html_url,
            topics: repo.topics || [],
          }));

        // Calculate total stats
        const stats = {
          totalStars: repoStats.reduce((sum, repo) => sum + repo.stars, 0),
          totalForks: repoStats.reduce((sum, repo) => sum + repo.forks, 0),
          totalRepos: repoStats.length,
          languages: repoStats.reduce((acc, repo) => {
            if (repo.language) {
              acc[repo.language] = (acc[repo.language] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>),
        };

        setRepos(repoStats.slice(0, 10)); // Top 10 repos
        setTotalStats(stats);
      }
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <Github className="w-12 h-12 text-primary-400 mx-auto mb-4 animate-pulse" />
        <p className="text-dark-600">Loading GitHub statistics...</p>
      </div>
    );
  }

  const topLanguages = Object.entries(totalStats.languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">{totalStats.totalStars}</h3>
          <p className="text-sm text-dark-600">Total Stars</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <GitFork className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">{totalStats.totalForks}</h3>
          <p className="text-sm text-dark-600">Total Forks</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <Code className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">{totalStats.totalRepos}</h3>
          <p className="text-sm text-dark-600">Public Repos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <GitBranch className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">{topLanguages.length}</h3>
          <p className="text-sm text-dark-600">Languages Used</p>
        </motion.div>
      </div>

      {/* Top Languages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-6"
      >
        <h3 className="text-xl font-bold mb-6">Top Languages</h3>
        <div className="space-y-4">
          {topLanguages.map(([language, count], index) => {
            const percentage = (count / totalStats.totalRepos) * 100;
            return (
              <div key={language}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{language}</span>
                  <span className="text-sm text-dark-600">
                    {count} repos ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-dark-200/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Top Repositories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-xl p-6"
      >
        <h3 className="text-xl font-bold mb-6">Top Repositories</h3>
        <div className="space-y-4">
          {repos
            .sort((a, b) => b.stars - a.stars)
            .map((repo, index) => (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="p-4 bg-dark-200/20 rounded-lg hover:bg-dark-200/30 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lg group-hover:text-primary-400 transition-colors">
                        {repo.name}
                      </h4>
                      <span className="px-2 py-1 text-xs bg-dark-200/50 rounded-full">
                        {repo.language}
                      </span>
                    </div>
                    <p className="text-sm text-dark-600 mb-3 line-clamp-2">
                      {repo.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-dark-700">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {repo.stars}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4 text-blue-400" />
                        {repo.forks}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-green-400" />
                        {repo.watchers}
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4 text-purple-400" />
                        Updated {new Date(repo.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label={`View ${repo.name} on GitHub`}
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
                {repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {repo.topics.slice(0, 5).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 text-xs bg-primary-500/20 text-primary-400 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
