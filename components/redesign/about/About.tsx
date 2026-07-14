'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { revealOnScroll } from '@/lib/motion/scrollReveal';
import { TypeLine } from '@/components/redesign/terminal/TypeLine';
import { PrintText } from '@/components/redesign/terminal/PrintText';

interface AboutProps {
  bio: string;
  location: string;
  timezone: string;
  education: string;
  certified: string;
}

export function About({ bio, location, timezone, education, certified }: AboutProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll('[data-fm-line]', { delay: 0.35, stagger: 0.08 }, rootRef.current);
      revealOnScroll('[data-about-heading]', { delay: 1.0 }, rootRef.current);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const frontmatter: [string, string][] = [
    ['base', location],
    ['timezone', timezone],
    ['education', education],
    ['certified', certified],
  ];

  return (
    <section id="about" ref={rootRef} className="relative border-t border-rule px-4 py-12 text-text md:px-5">
      <div className="font-mono text-sm text-text-faint">
        <span className="text-accent">$</span> <TypeLine text="cat about.md" />
      </div>

      <div className="mt-4">
        <div className="font-mono text-xs leading-relaxed text-text-faint">
          <div data-fm-line className="text-accent">---</div>
          {frontmatter.map(([key, value]) => (
            <div key={key} data-fm-line>
              <span className="text-text-soft">{key}</span>: {value}
            </div>
          ))}
          <div data-fm-line className="text-accent">---</div>
        </div>

        <h2
          data-about-heading
          className="mt-8 font-mono text-2xl font-bold leading-tight text-accent md:text-3xl"
        >
          In IT since 2017 — service desk to systems engineering.
        </h2>
        <PrintText
          startDelay={1300}
          className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-text-soft md:text-base"
          text={bio}
        />
      </div>
    </section>
  );
}
