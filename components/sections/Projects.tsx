'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Star, GitFork, Search, Filter } from 'lucide-react';
import { useGitHubData } from '@/app/data-provider';
import { formatNumber } from '@/lib/utils';
import { useState, useMemo } from 'react';

interface Project {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  size: number;
  openIssues: number;
}

export default function Projects() {
  const githubData = useGitHubData();
  const allProjects = (githubData.repositories || []) as Project[];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'stars' | 'updated' | 'name'>('stars');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique languages
  const languages = useMemo(() => {
    const langs = new Set<string>();
    allProjects.forEach(project => {
      if (project.language) langs.add(project.language);
    });
    return ['all', ...Array.from(langs).sort()];
  }, [allProjects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = allProjects;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.topics.some(topic => topic.toLowerCase().includes(query))
      );
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(project => project.language === selectedLanguage);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stars - a.stars;
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProjects, searchQuery, selectedLanguage, sortBy]);

  // Show top 9 for featured
  const displayProjects = searchQuery || selectedLanguage !== 'all' ? filteredProjects : filteredProjects.slice(0, 9);

  return (
    <section id="projects" className="section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="mb-4">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto mb-8">
              A selection of my recent work and open-source contributions
            </p>

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 btn-secondary mb-8"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-4xl mx-auto"
              >
                <div className="glass rounded-xl p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-600" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-400 transition-colors"
                      />
                    </div>

                    {/* Language Filter */}
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      aria-label="Filter by programming language"
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-400 transition-colors"
                    >
                      {languages.map(lang => (
                        <option key={lang} value={lang}>
                          {lang === 'all' ? 'All Languages' : lang}
                        </option>
                      ))}
                    </select>

                    {/* Sort */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'stars' | 'updated' | 'name')}
                      aria-label="Sort projects by"
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-400 transition-colors"
                    >
                      <option value="stars">Most Stars</option>
                      <option value="updated">Recently Updated</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>

                  {/* Results count */}
                  <div className="mt-4 text-center text-sm text-dark-600">
                    Showing {displayProjects.length} of {allProjects.length} projects
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {displayProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-600 mb-4">
                No projects loaded yet. Run the sync script to fetch projects from GitHub.
              </p>
              <code className="glass px-4 py-2 rounded-lg">npm run sync-github</code>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjects.map((project: Project, index: number) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 glass rounded-lg group-hover:bg-primary-500/20 transition-colors">
                      <Github className="w-6 h-6 text-primary-400" />
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 glass glass-hover rounded-lg"
                        aria-label="View on GitHub"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">
                    {project.name}
                  </h3>

                  <p className="text-dark-700 mb-4 flex-grow line-clamp-3">
                    {project.description || 'No description available'}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 text-sm text-dark-600">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {formatNumber(project.stars || 0)}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        {formatNumber(project.forks || 0)}
                      </span>
                    </div>
                    {project.language && (
                      <span className="px-3 py-1 glass rounded-full text-xs font-medium">
                        {project.language}
                      </span>
                    )}
                  </div>

                  {/* Topics */}
                  {project.topics && project.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.topics.slice(0, 3).map((topic: string) => (
                        <span
                          key={topic}
                          className="px-2 py-1 glass rounded text-xs"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* View More */}
          {displayProjects.length > 0 && (
            <div className="text-center mt-12">
              <a
                href={githubData.profile?.username ? `https://github.com/${githubData.profile.username}?tab=repositories` : 'https://github.com/SanjayKrishnanJV'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Github className="w-5 h-5" />
                View All Projects
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
