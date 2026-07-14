'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { revealOnScroll } from '@/lib/motion/scrollReveal';
import { TypeLine } from '@/components/redesign/terminal/TypeLine';

interface SkillsPanelProps {
  categories: { label: string; items: string[] }[];
}

function toKey(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

export function SkillsPanel({ categories }: SkillsPanelProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll('[data-skill-row]', { stagger: 0.16, delay: 0.35 }, rootRef.current);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={rootRef} className="relative border-t border-rule px-4 py-12 text-text md:px-5">
      <div className="font-mono text-sm text-text-faint">
        <span className="text-accent">$</span> <TypeLine text="cat skills.json" />
      </div>

      <div className="mt-6 overflow-x-auto font-mono text-xs leading-relaxed md:text-sm">
        <span className="text-text-faint">{'{'}</span>
        <div className="pl-6">
          {categories.map((cat, i) => (
            <div key={cat.label} data-skill-row>
              <span className="text-accent">&quot;{toKey(cat.label)}&quot;</span>
              <span className="text-text-faint">: [</span>
              <div className="pl-6 text-text-soft">
                {cat.items.map((item, j) => (
                  <span key={item}>
                    <span className="text-text">&quot;{item}&quot;</span>
                    {j < cat.items.length - 1 && <span className="text-text-faint">, </span>}
                  </span>
                ))}
              </div>
              <span className="text-text-faint">]{i < categories.length - 1 ? ',' : ''}</span>
            </div>
          ))}
        </div>
        <span className="text-text-faint">{'}'}</span>
      </div>
    </section>
  );
}
