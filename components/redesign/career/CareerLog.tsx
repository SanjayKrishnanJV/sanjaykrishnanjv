'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { revealOnScroll } from '@/lib/motion/scrollReveal';
import { TypeLine } from '@/components/redesign/terminal/TypeLine';

export interface CareerEntry {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
}

interface CareerLogProps {
  entries: CareerEntry[];
}

export function CareerLog({ entries }: CareerLogProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll('[data-log-row]', { stagger: 0.18, delay: 0.45 }, rootRef.current);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="career" ref={rootRef} className="relative border-t border-rule px-4 py-12 text-text md:px-5">
      <div className="font-mono text-sm text-text-faint">
        <span className="text-accent">$</span> <TypeLine text="tail -f career.log" />
      </div>

      <div className="mt-6 divide-y divide-rule font-mono text-sm">
        {entries.map((entry) => (
          <div
            key={`${entry.company}-${entry.startDate}`}
            data-log-row
            className="grid gap-x-6 gap-y-1 py-4 md:grid-cols-[200px_1fr_auto] md:items-baseline"
          >
            <div className="text-text-faint">
              {entry.startDate} → {entry.current ? 'present' : entry.endDate?.split('·')[0].trim()}
            </div>
            <div>
              <span className="font-bold text-text">{entry.company}</span>
              <span className="text-text-soft"> — {entry.position}</span>
              <div className="text-xs text-text-faint">{entry.location}</div>
            </div>
            <div>
              {entry.current && (
                <span className="flex items-center gap-2 text-xs text-accent">
                  <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-accent" />
                  current
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
