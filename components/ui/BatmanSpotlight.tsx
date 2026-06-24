'use client';

import { useEffect, useRef } from 'react';

const BAT_PATH =
  'M50,10 C44,4 30,3 18,11 C25,9 31,16 27,24 C23,18 15,20 8,26 C16,25 23,21 27,28 C31,35 37,42 43,48 C45,50 48,51 50,51 C52,51 55,50 57,48 C63,42 69,35 73,28 C77,21 84,25 92,26 C85,20 77,18 73,24 C69,16 75,9 82,11 C70,3 56,4 50,10 Z';

const RADIUS = 260;

export function BatmanSpotlight() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const batRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = (x: number, y: number) => {
      const mask = `radial-gradient(circle ${RADIUS}px at ${x}px ${y}px, transparent 0%, transparent 55%, rgba(0,0,0,0.5) 68%, rgba(0,0,0,0.93) 80%, rgba(0,0,0,0.97) 88%)`;

      if (overlayRef.current) {
        overlayRef.current.style.setProperty('mask-image', mask);
        overlayRef.current.style.setProperty('-webkit-mask-image', mask);
      }
      if (batRef.current) {
        batRef.current.style.left = `${x}px`;
        batRef.current.style.top = `${y}px`;
      }
      if (glowRef.current) {
        glowRef.current.style.left = `${x}px`;
        glowRef.current.style.top = `${y}px`;
      }
    };

    const onMove = (e: MouseEvent) => update(e.clientX, e.clientY);
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      {/* Near-opaque black overlay — mask punches circular spotlight at cursor */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          pointerEvents: 'none',
          backgroundColor: 'rgba(0,0,0,0.97)',
        }}
      />

      {/* Bat-signal amber glow ring at the spotlight edge */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          width: `${RADIUS * 2}px`,
          height: `${RADIUS * 2}px`,
          borderRadius: '50%',
          background: 'transparent',
          boxShadow:
            '0 0 60px 14px rgba(255,200,40,0.13), 0 0 120px 35px rgba(255,200,40,0.05)',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          pointerEvents: 'none',
          left: '-4000px',
          top: '-4000px',
        }}
      />

      {/* Batman bat silhouette projected as a shadow inside the spotlight */}
      <div
        ref={batRef}
        style={{
          position: 'fixed',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          pointerEvents: 'none',
          left: '-4000px',
          top: '-4000px',
        }}
      >
        <svg
          width="190"
          height="114"
          viewBox="0 0 100 60"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter:
              'drop-shadow(0 10px 28px rgba(0,0,0,1)) drop-shadow(0 2px 8px rgba(0,0,0,0.9))',
            opacity: 0.88,
          }}
        >
          <path d={BAT_PATH} fill="rgba(0,0,0,0.82)" />
        </svg>
      </div>
    </>
  );
}
