'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { revealOnScroll } from '@/lib/motion/scrollReveal';
import { TypeLine } from '@/components/redesign/terminal/TypeLine';
import { PrintText } from '@/components/redesign/terminal/PrintText';
import type { WorkItem } from '@/content/work';

interface ProjectsExhibitProps {
  items: WorkItem[];
}

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function ProjectsExhibit({ items }: ProjectsExhibitProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll('[data-work-item]', { delay: 0.35, stagger: 0.25 }, rootRef.current);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={rootRef} className="relative border-t border-rule px-4 py-12 text-text md:px-5">
      <div className="font-mono text-sm text-text-faint">
        <span className="text-accent">$</span> <TypeLine text="ls -la work/" />
      </div>

      <div className="mt-6 divide-y divide-rule">
        {items.map((item, i) => (
          <div key={item.index} data-work-item className="py-6 font-mono text-sm">
            <div className="text-text-faint">
              drwxr-xr-x  ~/work/{slug(item.name)}/
            </div>
            <h3 className="mt-2 text-lg font-bold text-text">{item.name}</h3>
            <PrintText
              startDelay={450 + i * 250}
              wordDelay={10}
              className="mt-2 max-w-lg leading-relaxed text-text-soft"
              text={item.description}
            />
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              {item.stack.map((tech) => (
                <span key={tech} className="rounded border border-rule px-2 py-1 text-text-soft">
                  {tech}
                </span>
              ))}
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              data-cursor-text="Open ↗"
              className="mt-4 inline-flex items-center gap-2 text-accent underline-offset-4 hover:underline"
            >
              <span className="text-text-faint">$</span> open --repository ↗
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
