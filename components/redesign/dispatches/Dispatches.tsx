'use client';

import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/motion/gsap';
import { revealOnScroll } from '@/lib/motion/scrollReveal';
import { TypeLine } from '@/components/redesign/terminal/TypeLine';
import { PrintText } from '@/components/redesign/terminal/PrintText';
import { formatDate } from '@/lib/utils';

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
}

interface DispatchesProps {
  posts: Post[];
}

export function Dispatches({ posts }: DispatchesProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll('[data-file-row]', { stagger: 0.2, delay: 0.35 }, rootRef.current);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="writing" ref={rootRef} className="relative border-t border-rule px-4 py-12 text-text md:px-5">
      <div className="font-mono text-sm text-text-faint">
        <span className="text-accent">$</span> <TypeLine text="ls -la writing/" />
      </div>

      <div className="mt-6 divide-y divide-rule">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            data-cursor="view"
            data-cursor-text="Read →"
            data-file-row
            className="group block py-4 font-mono text-sm"
          >
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-text-faint">-rw-r--r--</span>
              <span className="text-text transition-colors group-hover:text-accent">
                {post.slug}.mdx
              </span>
              <span className="ml-auto text-xs text-text-faint">
                {formatDate(post.date)} · {post.readingTime}
              </span>
            </div>
            <PrintText
              startDelay={550 + i * 200}
              wordDelay={10}
              className="mt-2 max-w-xl text-sm leading-relaxed text-text-soft"
              text={post.description}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
