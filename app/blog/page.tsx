import { getAllPosts, getAllTags } from '@/lib/blog';
import BlogList from '@/components/blog/BlogList';
import { PageShell } from '@/components/redesign/layout/PageShell';

export const metadata = {
  title: 'Writing | Sanjay Krishnan JV',
  description: 'Notes on systems engineering, cloud infrastructure, and automation.',
};

export default function BlogPage() {
  const posts = getAllPosts();
  const allTags = getAllTags();

  return (
    <PageShell breadcrumb="~/writing">
      <div className="font-mono text-sm text-text-faint">
        <span className="text-accent">$</span> ls -la writing/
      </div>
      <h1 className="mt-4 font-mono text-3xl font-bold text-text md:text-4xl">Notes from the field.</h1>
      <p className="mt-3 max-w-xl font-sans text-sm text-text-soft">
        Writing on systems engineering, cloud infrastructure, and the automation that keeps it
        all running.
      </p>

      <div className="mt-10">
        <BlogList posts={posts} allTags={allTags} />
      </div>
    </PageShell>
  );
}
