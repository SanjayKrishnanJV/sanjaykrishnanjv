'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/motion/gsap';

interface PrintTextProps {
  text: string;
  className?: string;
  wordDelay?: number;
  startDelay?: number;
}

/**
 * Reveals `text` word-by-word via a GSAP stagger, so prose reads as output
 * printing rather than a block fading in. GSAP drives this (not native CSS
 * animation-delay per word) because that approach silently drops a tail of
 * words on long paragraphs — Chromium stops firing very-short (~1ms)
 * animations once enough are queued a couple of seconds out. GSAP's ticker
 * doesn't have that failure mode and is what every other reveal on this site
 * already uses. Falls back to plain static text under prefers-reduced-motion.
 */
export function PrintText({ text, className, wordDelay = 16, startDelay = 0 }: PrintTextProps) {
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const words = ref.current.querySelectorAll('.print-word');
    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0 });
      gsap.to(words, {
        opacity: 1,
        duration: 0.01,
        ease: 'none',
        stagger: wordDelay / 1000,
        delay: startDelay / 1000,
      });
    });
    return () => ctx.revert();
  }, [reduced, text, wordDelay, startDelay]);

  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  const words = text.split(' ');

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="print-word">
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
