import { notFound } from 'next/navigation';
import Link from 'next/link';
import { caseStudies, getCaseStudy } from '@/content/case-studies';
import { PageShell } from '@/components/redesign/layout/PageShell';

interface CaseStudyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return caseStudies.map((study) => ({ id: study.id }));
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { id } = await params;
  const study = getCaseStudy(id);

  if (!study) {
    return { title: 'Case Study Not Found' };
  }

  return {
    title: `${study.name} | Sanjay Krishnan JV`,
    description: study.tagline,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { id } = await params;
  const study = getCaseStudy(id);

  if (!study) {
    notFound();
  }

  const link = study.url ?? study.repoUrl;

  return (
    <PageShell breadcrumb={`~/cases/${study.id}.md`}>
      <article>
        <div className="font-mono text-sm text-text-faint">
          <span className="text-accent">$</span> cat {study.id}.md
        </div>

        <h1 className="mt-4 font-mono text-2xl font-bold leading-tight text-text md:text-4xl">
          {study.name}
        </h1>
        <p className="mt-3 max-w-xl font-mono text-sm text-text-soft md:text-base">{study.tagline}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-text-faint">
          <span>{study.role}</span>
          <span>{study.visibility === 'public' ? 'public repo' : 'private repo'}</span>
          <span>updated {study.lastUpdated}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {study.stack.map((tech) => (
            <span key={tech} className="font-mono text-[10px] uppercase tracking-widest text-accent">
              #{tech}
            </span>
          ))}
        </div>

        <div className="mt-10 max-w-2xl border-t border-rule pt-8 font-mono text-sm leading-relaxed text-text-soft md:text-base">
          {study.description}
        </div>

        <div className="mt-8">
          <div className="font-mono text-xs uppercase tracking-widest text-text-faint"># highlights</div>
          <ul className="mt-4 space-y-3 font-mono text-sm text-text-soft">
            {study.highlights.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="text-accent">·</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            data-cursor="view"
            data-cursor-text="Open ↗"
            className="mt-10 inline-flex items-center gap-2 font-mono text-sm text-accent underline-offset-4 hover:underline"
          >
            <span className="text-text-faint">$</span> open --{study.url ? 'live' : 'repository'} ↗
          </a>
        )}

        <footer className="mt-12 border-t border-rule pt-6">
          <Link
            href="/"
            data-cursor="view"
            data-cursor-text="Back"
            className="inline-flex items-center gap-2 font-mono text-xs text-text-faint transition-colors hover:text-accent"
          >
            <span className="text-accent">$</span> cd ../cases
          </Link>
        </footer>
      </article>
    </PageShell>
  );
}
