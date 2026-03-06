import { motion } from 'framer-motion';
import { getAllPosts, getAllTags } from '@/lib/blog';
import BlogList from '@/components/blog/BlogList';

export const metadata = {
  title: 'Blog & Articles | Sanjay Krishnan JV',
  description: 'Insights on software engineering, cloud architecture, and technology',
};

export default function BlogPage() {
  const posts = getAllPosts();
  const allTags = getAllTags();

  return (
    <main className="min-h-screen pt-20">
      <div className="container-custom py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            <span className="gradient-text">Blog & Articles</span>
          </h1>
          <p className="text-xl text-dark-600 max-w-2xl mx-auto">
            Insights on software engineering, cloud architecture, and technology
          </p>
        </div>

        <BlogList posts={posts} allTags={allTags} />
      </div>
    </main>
  );
}
