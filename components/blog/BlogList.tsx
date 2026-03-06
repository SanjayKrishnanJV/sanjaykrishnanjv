'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, Tag, BookOpen } from 'lucide-react';
import Link from 'next/link';
import type { BlogPostMetadata } from '@/lib/blog';

interface BlogListProps {
  posts: BlogPostMetadata[];
  allTags: string[];
}

export default function BlogList({ posts, allTags }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (selectedTag !== 'all') {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag));
    }

    return filtered;
  }, [posts, searchQuery, selectedTag]);

  return (
    <>
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto mb-12"
      >
        <div className="glass rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-600" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-400 transition-colors"
              />
            </div>

            {/* Tag Filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              aria-label="Filter by tag"
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-400 transition-colors"
            >
              <option value="all">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="mt-4 text-center text-sm text-dark-600">
            Showing {filteredPosts.length} of {posts.length} articles
          </div>
        </div>
      </motion.div>

      {/* Blog Posts Grid */}
      {filteredPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-dark-600" />
          <h3 className="text-2xl font-bold mb-2">No articles found</h3>
          <p className="text-dark-600">
            {posts.length === 0
              ? 'Check back soon for new content!'
              : 'Try adjusting your search or filters'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="block glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group h-full flex flex-col"
              >
                {/* Cover Image */}
                {post.coverImage && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Title */}
                <h2 className="text-xl font-bold mb-3 group-hover:text-primary-400 transition-colors">
                  {post.title}
                </h2>

                {/* Description */}
                <p className="text-dark-700 mb-4 flex-grow line-clamp-3">
                  {post.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-dark-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readingTime}
                  </span>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 glass rounded text-xs"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </>
  );
}
