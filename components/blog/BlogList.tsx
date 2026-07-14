'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { BlogPostMetadata } from '@/lib/blog';
import { formatDate } from '@/lib/utils';

interface BlogListProps {
  posts: BlogPostMetadata[];
  allTags: string[];
}

export default function BlogList({ posts, allTags }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedTag !== 'all') {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag));
    }

    return filtered;
  }, [posts, searchQuery, selectedTag]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-rule pb-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-text-faint">
          <span className="text-accent">$</span>
          <span>grep --search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="query"
            className="w-40 border-b border-rule bg-transparent px-1 py-0.5 text-text caret-accent outline-none placeholder:text-text-faint focus:border-accent"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedTag('all')}
            className={`rounded px-2 py-1 uppercase tracking-widest transition-colors ${
              selectedTag === 'all' ? 'bg-accent-dim text-accent' : 'text-text-faint hover:text-text-soft'
            }`}
          >
            --all
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`rounded px-2 py-1 uppercase tracking-widest transition-colors ${
                selectedTag === tag ? 'bg-accent-dim text-accent' : 'text-text-faint hover:text-text-soft'
              }`}
            >
              --{tag}
            </button>
          ))}
        </div>
        <span className="ml-auto text-text-faint">
          {filteredPosts.length}/{posts.length} matched
        </span>
      </div>

      {filteredPosts.length === 0 ? (
        <p className="py-12 font-mono text-sm text-text-faint">
          no matches. try a different query or flag.
        </p>
      ) : (
        <div className="divide-y divide-rule">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              data-cursor="view"
              data-cursor-text="Read →"
              className="group block py-5 font-mono text-sm"
            >
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-text-faint">-rw-r--r--</span>
                <span className="text-text transition-colors group-hover:text-accent">
                  {post.slug}.mdx
                </span>
                <span className="ml-auto text-xs text-text-faint">
                  {formatDate(post.date)} · {post.readingTime}
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-soft">{post.description}</p>
              {post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest text-text-faint">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
