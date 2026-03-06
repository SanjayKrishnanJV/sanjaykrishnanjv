import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import BlogShareButtons from '@/components/blog/BlogShareButtons';
import FloatingShareSidebar from '@/components/blog/FloatingShareSidebar';
import 'highlight.js/styles/github-dark.css';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Sanjay Krishnan JV`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }


  const shareData = {
    url: `https://www.sanjaykrishnanjv.com/blog/${slug}`,
    title: post.title,
    description: post.description,
    hashtags: post.tags,
  };

  return (
    <main className="min-h-screen pt-20">
      {/* Floating Share Sidebar */}
      <FloatingShareSidebar data={shareData} />

      <article className="container-custom py-20 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-6">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-dark-600 mb-6">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {post.readingTime}
            </span>
            <span className="text-dark-700">By {post.author}</span>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 glass rounded-full text-sm"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-12 rounded-xl overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeHighlight,
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: 'wrap',
                  properties: {
                    className: ['anchor'],
                  },
                },
              ],
            ]}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Share Buttons */}
        <div className="mt-12">
          <BlogShareButtons
            title={post.title}
            description={post.description}
            slug={slug}
            tags={post.tags}
          />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all articles
          </Link>
        </footer>
      </article>
    </main>
  );
}
