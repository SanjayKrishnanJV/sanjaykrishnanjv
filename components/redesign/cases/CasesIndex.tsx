'use client';

import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/motion/gsap';
import { revealOnScroll } from '@/lib/motion/scrollReveal';
import { TypeLine } from '@/components/redesign/terminal/TypeLine';
import { PrintText } from '@/components/redesign/terminal/PrintText';
import type { CaseStudy } from '@/content/case-studies';

interface CasesIndexProps {
  items: CaseStudy[];
}

export function CasesIndex({ items }: CasesIndexProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll('[data-case-row]', { stagger: 0.2, delay: 0.35 }, rootRef.current);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="cases" ref={rootRef} className="relative border-t border-rule px-4 py-12 text-text md:px-5">
      <div className="font-mono text-sm text-text-faint">
        <span className="text-accent">$</span> <TypeLine text="ls -la cases/" />
      </div>

      <div className="mt-6 divide-y divide-rule">
        {items.map((study, i) => (
          <Link
            key={study.id}
            href={`/case-studies/${study.id}`}
            data-cursor="view"
            data-cursor-text="Read →"
            data-case-row
            className="group block py-4 font-mono text-sm"
          >
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-text-faint">{study.visibility === 'public' ? '-rw-r--r--' : '-rw-------'}</span>
              <span className="text-text transition-colors group-hover:text-accent">{study.id}.md</span>
              <span className="ml-auto text-xs text-text-faint">{study.lastUpdated}</span>
            </div>
            <div className="mt-2 text-base font-bold text-text">{study.name}</div>
            <PrintText
              startDelay={550 + i * 200}
              wordDelay={10}
              className="mt-1 max-w-xl text-sm leading-relaxed text-text-soft"
              text={study.tagline}
            />
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {study.stack.map((tech) => (
                <span key={tech} className="rounded border border-rule px-2 py-0.5 text-text-faint">
                  {tech}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
