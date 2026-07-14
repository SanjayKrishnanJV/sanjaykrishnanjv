'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { revealOnScroll } from '@/lib/motion/scrollReveal';
import { TypeLine } from '@/components/redesign/terminal/TypeLine';

interface CloseStripProps {
  email: string;
  github: string;
  linkedin: string;
  location: string;
}

export function CloseStrip({ email, github, linkedin, location }: CloseStripProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll('[data-out-email]', { delay: 0.5 }, rootRef.current);
      revealOnScroll('[data-out-links]', { stagger: 0.06, delay: 0.4 }, rootRef.current);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer id="contact" ref={rootRef} className="relative border-t border-rule px-4 py-12 text-text md:px-5">
      <div className="font-mono text-sm text-text-faint">
        <span className="text-accent">$</span> <TypeLine text="./contact.sh --email" />
      </div>
      <a
        href={`mailto:${email}`}
        data-cursor="view"
        data-cursor-text="Say hello ↗"
        data-out-email
        className="mt-3 inline-block break-all font-mono text-2xl font-bold leading-tight text-text transition-colors hover:text-accent sm:text-3xl md:text-4xl"
      >
        {email}
      </a>

      <div className="mt-8 font-mono text-sm text-text-faint">
        <span className="text-accent">$</span> <TypeLine text="./contact.sh --links" startDelay={150} />
      </div>
      <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm">
        <a
          href={github}
          target="_blank"
          rel="noreferrer"
          data-cursor="view"
          data-cursor-text="Open ↗"
          data-out-links
          className="text-text-soft transition-colors hover:text-accent"
        >
          --github <span className="text-text-faint">{github.replace('https://', '')}</span>
        </a>
        <a
          href={linkedin}
          target="_blank"
          rel="noreferrer"
          data-cursor="view"
          data-cursor-text="Open ↗"
          data-out-links
          className="text-text-soft transition-colors hover:text-accent"
        >
          --linkedin <span className="text-text-faint">{linkedin.replace('https://', '')}</span>
        </a>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
        <span>Sanjay Krishnan JV — {location}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
