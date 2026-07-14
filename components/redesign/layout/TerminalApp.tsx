'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { SignalField } from '@/components/canvas/SignalField';
import { TerminalChrome } from '@/components/redesign/layout/TerminalChrome';
import { NavRail, type NavSection } from '@/components/redesign/layout/NavRail';
import { PromptBar } from '@/components/redesign/layout/PromptBar';
import { HUDOverlay } from '@/components/redesign/hud/HUDOverlay';
import { trackPageView } from '@/lib/analytics';

export interface TerminalView extends NavSection {
  element: ReactNode;
}

interface TerminalAppProps {
  views: TerminalView[];
  initial?: string;
}

const SWITCH_COOLDOWN = 700;
const EDGE_EPSILON = 2;
const SWIPE_THRESHOLD = 60;

export function TerminalApp({ views, initial }: TerminalAppProps) {
  const [active, setActive] = useState(initial ?? views[0]?.id);
  const paneRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const coolingDown = useRef(false);
  const touchStartY = useRef<number | null>(null);

  activeRef.current = active;

  useEffect(() => {
    trackPageView('/');
  }, []);

  useEffect(() => {
    paneRef.current?.scrollTo({ top: 0 });
  }, [active]);

  useEffect(() => {
    const pane = paneRef.current;
    if (!pane) return;

    function goTo(direction: 1 | -1) {
      const idx = views.findIndex((v) => v.id === activeRef.current);
      const nextIdx = idx + direction;
      if (nextIdx < 0 || nextIdx >= views.length || coolingDown.current) return;
      coolingDown.current = true;
      setActive(views[nextIdx].id);
      setTimeout(() => {
        coolingDown.current = false;
      }, SWITCH_COOLDOWN);
    }

    function onWheel(e: WheelEvent) {
      if (!pane) return;
      const atBottom = pane.scrollTop + pane.clientHeight >= pane.scrollHeight - EDGE_EPSILON;
      const atTop = pane.scrollTop <= EDGE_EPSILON;

      if (e.deltaY > 0 && atBottom) {
        e.preventDefault();
        goTo(1);
      } else if (e.deltaY < 0 && atTop) {
        e.preventDefault();
        goTo(-1);
      }
    }

    function onTouchStart(e: TouchEvent) {
      touchStartY.current = e.touches[0].clientY;
    }

    function onTouchEnd(e: TouchEvent) {
      if (touchStartY.current === null || !pane) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      const atBottom = pane.scrollTop + pane.clientHeight >= pane.scrollHeight - EDGE_EPSILON;
      const atTop = pane.scrollTop <= EDGE_EPSILON;

      if (deltaY > SWIPE_THRESHOLD && atBottom) goTo(1);
      else if (deltaY < -SWIPE_THRESHOLD && atTop) goTo(-1);
      touchStartY.current = null;
    }

    pane.addEventListener('wheel', onWheel, { passive: false });
    pane.addEventListener('touchstart', onTouchStart, { passive: true });
    pane.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      pane.removeEventListener('wheel', onWheel);
      pane.removeEventListener('touchstart', onTouchStart);
      pane.removeEventListener('touchend', onTouchEnd);
    };
  }, [views]);

  const current = views.find((v) => v.id === active) ?? views[0];
  const sections: NavSection[] = views.map(({ id, label }) => ({ id, label }));

  return (
    <div className="redesign fixed inset-0 flex flex-col overflow-hidden bg-bg">
      <TerminalChrome />
      <NavRail sections={sections} active={active} onNavigate={setActive} />

      <div className="relative flex-1 overflow-hidden md:pl-14">
        <div className="grid-texture pointer-events-none absolute inset-0 z-0 opacity-40" />
        <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
          <SignalField className="h-full w-full" />
        </div>
        <div className="hud-scanline pointer-events-none z-0">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-accent/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
        </div>
        <HUDOverlay />

        <div
          ref={paneRef}
          className="relative z-10 h-full overflow-y-auto overscroll-contain"
        >
          {current?.element}
        </div>
      </div>

      <div className="md:pl-14">
        <PromptBar onNavigate={setActive} />
      </div>
    </div>
  );
}
