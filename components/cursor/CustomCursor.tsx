'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorState = 'default' | 'view' | 'drag' | 'text';

const RING_SCALE: Record<CursorState, number> = {
  default: 1,
  view: 2.6,
  drag: 2.1,
  text: 1.4,
};

/**
 * Global reticle cursor. Interactive elements opt in via:
 *   data-cursor="view" data-cursor-text="View project"
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>('default');
  const [label, setLabel] = useState('');

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.4 });
  const coordsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    setEnabled(fine);
    if (!fine) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (coordsRef.current) {
        coordsRef.current.textContent = `X ${String(Math.round(e.clientX)).padStart(4, '0')}  Y ${String(Math.round(e.clientY)).padStart(4, '0')}`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('[data-cursor]') as HTMLElement | null;
      if (target) {
        setState((target.dataset.cursor as CursorState) || 'view');
        setLabel(target.dataset.cursorText || '');
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('[data-cursor]');
      if (target) {
        setState('default');
        setLabel('');
      }
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden="true">
      {/* precise dot, negligible lag */}
      <motion.span
        className="absolute block h-[6px] w-[6px] rounded-full bg-accent"
        style={{ left: x, top: y, translateX: '-50%', translateY: '-50%' }}
      />
      {/* reticle ring, spring-lagged */}
      <motion.div
        className="absolute flex items-center justify-center rounded-full border border-accent/70"
        style={{
          left: ringX,
          top: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 34,
          height: 34,
        }}
        animate={{ scale: RING_SCALE[state] }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <motion.span
          className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-accent"
          animate={{ opacity: label ? 1 : 0, scale: 1 / RING_SCALE[state] }}
          transition={{ duration: 0.15 }}
        >
          {label}
        </motion.span>
      </motion.div>
      {/* coordinate readout — a small nod to instrumentation */}
      <motion.span
        ref={coordsRef}
        className="absolute font-mono text-[9px] tracking-[0.15em] text-text-faint opacity-50"
        style={{ left: x, top: y, translateX: '14px', translateY: '14px' }}
      />

    </div>
  );
}
