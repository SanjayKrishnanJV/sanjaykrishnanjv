import Link from 'next/link';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { TerminalChrome } from '@/components/redesign/layout/TerminalChrome';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';

interface PageShellProps {
  breadcrumb: string;
  children: React.ReactNode;
}

/**
 * Shell for standalone content routes (blog list/post) that read normally —
 * unlike the homepage terminal, these scroll like a regular page. Keeps the
 * same chrome and type system so navigating here doesn't feel like leaving
 * the site.
 */
export function PageShell({ breadcrumb, children }: PageShellProps) {
  return (
    <div className="redesign min-h-screen bg-bg text-text">
      <CustomCursor />
      <PageViewTracker />
      <TerminalChrome />
      <div className="grid-texture pointer-events-none fixed inset-0 z-0 opacity-30" />

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-10 md:px-5 md:py-14">
        <Link
          href="/"
          data-cursor="view"
          data-cursor-text="Home"
          className="inline-flex items-center gap-2 font-mono text-xs text-text-faint transition-colors hover:text-accent"
        >
          <span className="text-accent">$</span> cd ~
        </Link>
        <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-text-faint">
          {breadcrumb}
        </div>

        <div className="mt-10">{children}</div>
      </main>
    </div>
  );
}
