'use client';

import { useEffect, useState } from 'react';

interface PrintTextProps {
  text: string;
  className?: string;
  wordDelay?: number;
  startDelay?: number;
}

/**
 * Reveals `text` word-by-word via CSS animation delays, so prose reads as
 * output printing rather than a block fading in. Falls back to plain static
 * text once prefers-reduced-motion is detected client-side.
 */
export function PrintText({ text, className, wordDelay = 16, startDelay = 0 }: PrintTextProps) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  const words = text.split(' ');

  return (
    <p className={className}>
      {words.map((word, i) => (
        <span key={i} className="print-word" style={{ animationDelay: `${startDelay + i * wordDelay}ms` }}>
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
