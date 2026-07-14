'use client';

import { useEffect, useState } from 'react';

interface TypeLineProps {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
  onDone?: () => void;
}

/**
 * Types `text` character-by-character on mount, so command lines read as
 * live-executed each time a view is opened, not pre-rendered page content.
 * Solid cursor while typing, blinking once idle.
 */
export function TypeLine({ text, className, speed = 24, startDelay = 0, onDone }: TypeLineProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setCount(text.length);
      onDone?.();
      return;
    }

    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    function step() {
      i += 1;
      setCount(i);
      if (i < text.length) {
        timer = setTimeout(step, speed);
      } else {
        onDone?.();
      }
    }
    timer = setTimeout(step, startDelay);
    return () => clearTimeout(timer);
    // Runs once on mount — a fresh mount (switching views) is what should retype.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = count >= text.length;

  return (
    <span className={className}>
      {/* Full text immediately, for screen readers and crawlers — the
          animation below is purely visual and shouldn't gate the real text. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, count)}
        <span
          className={`ml-[1px] inline-block h-[1em] w-[0.5em] translate-y-[2px] bg-current align-middle ${
            done ? 'blink-cursor' : 'opacity-100'
          }`}
        />
      </span>
    </span>
  );
}
