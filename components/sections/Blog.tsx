'use client';

import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, Heart, ExternalLink, MessageCircle, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LinkedInPost, getLinkedInPosts } from '@/lib/linkedin-posts';
import LoadingSpinner from '../ui/LoadingSpinner';
import { SkeletonCard } from '../ui/Skeleton';

export default function Blog() {
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLinkedInPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="blog" className="section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="mb-4">
              Latest <span className="gradient-text">Posts</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Thoughts and insights shared on LinkedIn
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-dark-600" />
              <p className="text-dark-600">No posts found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(0, 6).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group flex flex-col"
                >
                  {post.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-dark-600 text-sm line-clamp-4 mb-4 flex-grow">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between text-sm text-dark-600 mb-4">
                      <div className="flex items-center gap-3">
                        {post.likes !== undefined && post.likes > 0 && (
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {post.likes}
                          </span>
                        )}
                        {post.comments !== undefined && post.comments > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments}
                          </span>
                        )}
                      </div>
                      <span className="text-xs">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <a
                      href={post.url !== '#' ? post.url : 'https://www.linkedin.com/in/sanjaykrishnanjv/recent-activity/all/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      View on LinkedIn
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <a
                href="https://www.linkedin.com/in/sanjaykrishnanjv/recent-activity/all/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                View All Posts
                <ExternalLink className="w-5 h-5" />
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
