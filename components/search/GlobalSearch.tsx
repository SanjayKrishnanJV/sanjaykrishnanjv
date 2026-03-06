'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Briefcase, Code, ArrowRight, Command } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'blog' | 'project' | 'skill' | 'section';
  url: string;
  icon: any;
}

interface GlobalSearchProps {
  blogPosts?: Array<{ slug: string; title: string; description: string; tags: string[] }>;
  projects?: Array<{ id: string; title: string; description: string }>;
  skills?: Array<{ name: string; category: string }>;
}

export default function GlobalSearch({ blogPosts = [], projects = [], skills = [] }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // All searchable items
  const searchableItems: SearchResult[] = useMemo(() => {
    const items: SearchResult[] = [];

    // Add blog posts
    blogPosts.forEach(post => {
      items.push({
        id: `blog-${post.slug}`,
        title: post.title,
        description: post.description,
        type: 'blog',
        url: `/blog/${post.slug}`,
        icon: FileText,
      });
    });

    // Add projects
    projects.forEach(project => {
      items.push({
        id: `project-${project.id}`,
        title: project.title,
        description: project.description,
        type: 'project',
        url: `/#projects`,
        icon: Briefcase,
      });
    });

    // Add skills
    skills.forEach(skill => {
      items.push({
        id: `skill-${skill.name}`,
        title: skill.name,
        description: skill.category,
        type: 'skill',
        url: `/#skills`,
        icon: Code,
      });
    });

    // Add sections
    const sections = [
      { id: 'about', title: 'About', description: 'Learn more about me', url: '/#about' },
      { id: 'skills', title: 'Skills', description: 'Technical skills and expertise', url: '/#skills' },
      { id: 'projects', title: 'Projects', description: 'Featured projects and work', url: '/#projects' },
      { id: 'experience', title: 'Experience', description: 'Professional experience', url: '/#experience' },
      { id: 'education', title: 'Education', description: 'Educational background', url: '/#education' },
      { id: 'certifications', title: 'Certifications', description: 'Professional certifications', url: '/#certifications' },
      { id: 'contact', title: 'Contact', description: 'Get in touch', url: '/#contact' },
    ];

    sections.forEach(section => {
      items.push({
        id: `section-${section.id}`,
        title: section.title,
        description: section.description,
        type: 'section',
        url: section.url,
        icon: ArrowRight,
      });
    });

    return items;
  }, [blogPosts, projects, skills]);

  // Filter results based on query
  const results = useMemo(() => {
    if (!query.trim()) return searchableItems.slice(0, 8);

    const lowercaseQuery = query.toLowerCase();
    return searchableItems
      .filter(item =>
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.description.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, 8);
  }, [query, searchableItems]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        setSelectedIndex(0);
      }

      // Arrow navigation
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        }
        if (e.key === 'Enter' && results[selectedIndex]) {
          e.preventDefault();
          handleSelect(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (result: SearchResult) => {
    router.push(result.url);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog':
        return 'text-blue-400 bg-blue-500/10';
      case 'project':
        return 'text-purple-400 bg-purple-500/10';
      case 'skill':
        return 'text-green-400 bg-green-500/10';
      case 'section':
        return 'text-orange-400 bg-orange-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all group"
      >
        <Search className="w-4 h-4 text-dark-600 group-hover:text-primary-400 transition-colors" />
        <span className="text-sm text-dark-600">Search...</span>
        <kbd className="hidden xl:flex items-center gap-1 px-2 py-1 text-xs bg-dark-200/50 rounded border border-white/10">
          <Command className="w-3 h-3" />
          K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Search Dialog */}
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="w-full max-w-2xl glass rounded-xl overflow-hidden shadow-2xl"
              >
                {/* Search Input */}
                <div className="flex items-center gap-4 p-4 border-b border-white/10">
                  <Search className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedIndex(0);
                    }}
                    placeholder="Search for anything..."
                    className="flex-1 bg-transparent outline-none text-lg placeholder:text-dark-600"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    aria-label="Close search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {results.length > 0 ? (
                    <div className="p-2">
                      {results.map((result, index) => {
                        const Icon = result.icon;
                        return (
                          <button
                            key={result.id}
                            onClick={() => handleSelect(result)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all text-left ${
                              index === selectedIndex
                                ? 'bg-white/10'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">{result.title}</h3>
                              <p className="text-sm text-dark-600 truncate">{result.description}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(result.type)}`}>
                              {result.type}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <Search className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                      <p className="text-dark-600">No results found</p>
                      <p className="text-sm text-dark-700 mt-2">Try a different search term</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-dark-600">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-dark-200/50 rounded border border-white/10">↑</kbd>
                      <kbd className="px-2 py-1 bg-dark-200/50 rounded border border-white/10">↓</kbd>
                      to navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-dark-200/50 rounded border border-white/10">↵</kbd>
                      to select
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-dark-200/50 rounded border border-white/10">esc</kbd>
                    to close
                  </span>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
