'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Star, GitFork } from 'lucide-react';
import { useGitHubData } from '@/app/data-provider';
import { formatNumber } from '@/lib/utils';

export default function Projects() {
  const githubData = useGitHubData();
  const projects = githubData.pinnedRepos || githubData.repositories?.slice(0, 6) || [];

  return (
    <section id="projects" className="section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="mb-4">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              A selection of my recent work and open-source contributions
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-600 mb-4">
                No projects loaded yet. Run the sync script to fetch projects from GitHub.
              </p>
              <code className="glass px-4 py-2 rounded-lg">npm run sync-github</code>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project: any, index: number) => (
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
          {projects.length > 0 && (
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
