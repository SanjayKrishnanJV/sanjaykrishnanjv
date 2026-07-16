'use client';

import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/motion/gsap';
import { revealOnScroll } from '@/lib/motion/scrollReveal';
import { TypeLine } from '@/components/redesign/terminal/TypeLine';

const SWATCHES = ['#4fd1a5', '#7c9cae', '#c9a66b', '#8a8f87', '#5f8f7a', '#9c8f6f'];

interface SystemsReadoutProps {
  repos: number;
  stars: number;
  followers: number;
  memberSince: string;
  languages: { name: string; percent: number }[];
}

export function SystemsReadout({ repos, stars, followers, memberSince, languages }: SystemsReadoutProps) {
  const rootRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll('[data-sys-reveal]', { delay: 0.35, stagger: 0.12 }, rootRef.current);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduced && barRef.current) {
        gsap.from(barRef.current.children, {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1,
          delay: 0.5,
          ease: 'expo.out',
          stagger: 0.05,
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const stats = [
    { label: 'repositories', value: repos },
    { label: 'stars', value: stars },
    { label: 'followers', value: followers },
    { label: 'active_since', value: memberSince },
  ];

  return (
    <section id="systems" ref={rootRef} className="relative border-t border-rule px-4 py-12 text-text md:px-5">
      <div className="font-mono text-sm text-text-faint">
        <span className="text-accent">$</span> <TypeLine text="curl systems/stats" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 font-mono text-sm md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} data-sys-reveal>
            <div className="text-2xl font-bold text-accent md:text-3xl">{stat.value}</div>
            <div className="mt-1 text-xs text-text-faint">{stat.label}</div>
          </div>
        ))}
      </div>

      <div data-sys-reveal className="mt-8 font-mono text-sm">
        <div className="text-xs text-text-faint"># language mix, by bytes written</div>
        <div ref={barRef} className="mt-3 flex h-2 w-full max-w-2xl overflow-hidden rounded-sm">
          {languages.map((lang, i) => (
            <div
              key={lang.name}
              style={{ width: `${lang.percent}%`, backgroundColor: SWATCHES[i % SWATCHES.length] }}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs">
          {languages.map((lang, i) => (
            <div key={lang.name} className="flex items-center gap-2 text-text-soft">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: SWATCHES[i % SWATCHES.length] }}
              />
              {lang.name} {lang.percent}%
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/projects-stats"
        data-cursor="view"
        data-cursor-text="Open ↗"
        className="mt-8 inline-block font-mono text-xs text-text-faint transition-colors hover:text-accent"
      >
        $ cat systems.stat --repos
      </Link>
    </section>
  );
}
