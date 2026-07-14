import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import { generateShareUrls } from '@/lib/social-share';
import { formatDate } from '@/lib/utils';
import { PageShell } from '@/components/redesign/layout/PageShell';
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

  const shareUrls = generateShareUrls({
    url: `https://www.sanjaykrishnanjv.com/blog/${slug}`,
    title: post.title,
    description: post.description,
    hashtags: post.tags,
  });

  return (
    <PageShell breadcrumb={`~/writing/${slug}.mdx`}>
      <article>
        <div className="font-mono text-sm text-text-faint">
          <span className="text-accent">$</span> cat {slug}.mdx
        </div>

        <h1 className="mt-4 font-mono text-2xl font-bold leading-tight text-text md:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-text-faint">
          <span>{formatDate(post.date)}</span>
          <span>{post.readingTime}</span>
          <span>by {post.author}</span>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <span key={tag} className="font-mono text-[10px] uppercase tracking-widest text-accent">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {post.coverImage && (
          <div className="mt-8 border border-rule">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt={post.title} className="h-auto w-full object-cover" />
          </div>
        )}

        <div className="prose prose-invert mt-10 max-w-none border-t border-rule pt-8">
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

        <div className="mt-12 border-t border-rule pt-6">
          <div className="font-mono text-sm text-text-faint">
            <span className="text-accent">$</span> ./share.sh --{slug}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs">
            <a
              href={shareUrls.twitter}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              data-cursor-text="Open ↗"
              className="text-text-soft transition-colors hover:text-accent"
            >
              --x
            </a>
            <a
              href={shareUrls.linkedin}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              data-cursor-text="Open ↗"
              className="text-text-soft transition-colors hover:text-accent"
            >
              --linkedin
            </a>
            <a
              href={shareUrls.hackernews}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              data-cursor-text="Open ↗"
              className="text-text-soft transition-colors hover:text-accent"
            >
              --hackernews
            </a>
            <a
              href={shareUrls.email}
              data-cursor="view"
              data-cursor-text="Open ↗"
              className="text-text-soft transition-colors hover:text-accent"
            >
              --email
            </a>
          </div>
        </div>

        <footer className="mt-10">
          <Link
            href="/blog"
            data-cursor="view"
            data-cursor-text="Back"
            className="inline-flex items-center gap-2 font-mono text-xs text-text-faint transition-colors hover:text-accent"
          >
            <span className="text-accent">$</span> cd ../writing
          </Link>
        </footer>
      </article>
    </PageShell>
  );
}
