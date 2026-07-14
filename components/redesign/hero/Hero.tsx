'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { revealOnScroll } from '@/lib/motion/scrollReveal';
import { TypeLine } from '@/components/redesign/terminal/TypeLine';
import { PrintText } from '@/components/redesign/terminal/PrintText';

interface HeroProps {
  name: string;
  role: string;
  location: string;
  employer: string;
}

export function Hero({ name, role, location, employer }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll('[data-out-1]', {}, rootRef.current);
      revealOnScroll('[data-out-2]', { delay: 0.35 }, rootRef.current);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={rootRef} className="relative px-4 pb-12 pt-8 text-text md:px-5">
      <div className="font-mono text-sm">
        <div className="text-text-faint">
          <span className="text-accent">$</span> <TypeLine text="whoami" />
        </div>
        <div
          data-out-1
          className="mt-3 overflow-x-auto whitespace-nowrap font-mono text-3xl font-bold leading-[0.95] text-text sm:text-6xl md:text-7xl"
        >
          {name.split(' ').slice(0, -1).join(' ')}{' '}
          <span className="text-accent">{name.split(' ').slice(-1)}</span>
        </div>
        <div data-out-1 className="mt-2 text-text-soft">
          {role} — {employer}
        </div>
      </div>

      <div className="mt-8 font-mono text-sm">
        <div className="text-text-faint">
          <span className="text-accent">$</span> <TypeLine text="status --check" startDelay={200} />
        </div>
        <div data-out-2 className="mt-2 flex items-center gap-2 text-text-soft">
          <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-accent" />
          online · {location} · N 12.9716° E 77.5946°
        </div>
      </div>

      <div className="mt-8 font-mono text-sm">
        <div className="text-text-faint">
          <span className="text-accent">$</span> <TypeLine text="echo $SUMMARY" startDelay={350} />
        </div>
        <PrintText
          startDelay={650}
          className="mt-2 max-w-xl font-mono text-sm leading-relaxed text-text-soft md:text-base"
          text="Systems engineering for the infrastructure that has to be right the first time — Azure Virtual Desktop, PowerShell automation, and the quiet work of keeping things running."
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-rule pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-text-faint">
        <span>Role — {role}</span>
        <span>Stack — Azure · AVD · PowerShell</span>
        <span>Base — {location}</span>
      </div>
    </section>
  );
}
