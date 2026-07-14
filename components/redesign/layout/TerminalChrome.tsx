'use client';

import { useEffect, useState } from 'react';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// Real facts about the visitor's own session — no fabricated activity or
// visitor counts. If it can't be read, it's skipped rather than faked.
function readDiagnostics(): string[] {
  if (typeof window === 'undefined') return [];
  const facts: string[] = [];
  try {
    facts.push(`tz ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
  } catch {}
  facts.push(`locale ${navigator.language}`);
  facts.push(`viewport ${window.innerWidth}×${window.innerHeight}`);
  facts.push(`net ${navigator.onLine ? 'online' : 'offline'}`);
  return facts;
}

export function TerminalChrome() {
  const [clock, setClock] = useState('--:--:--');
  const [uptime, setUptime] = useState('00:00:00');
  const [facts, setFacts] = useState<string[]>([]);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const start = performance.now();

    function tick() {
      const now = new Date();
      setClock(
        `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
      );
      const elapsed = Math.floor((performance.now() - start) / 1000);
      const h = Math.floor(elapsed / 3600);
      const m = Math.floor((elapsed % 3600) / 60);
      const s = elapsed % 60;
      setUptime(`${pad(h)}:${pad(m)}:${pad(s)}`);
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setFacts(readDiagnostics());
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const id = setInterval(() => {
      setFactIndex((i) => i + 1);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  const currentFact = facts.length ? facts[factIndex % facts.length] : '';

  return (
    <div className="sticky top-0 z-[55] flex h-11 items-center gap-2 border-b border-rule bg-bg px-4 md:px-5">
      <span className="h-2 w-2 rounded-full border border-text-faint" />
      <span className="h-2 w-2 rounded-full border border-text-faint" />
      <span className="h-2 w-2 rounded-full border border-text-faint" />
      <span className="ml-3 font-mono text-[11px] text-text-faint">sanjay@systems — zsh</span>

      {currentFact && (
        <span
          key={factIndex}
          className="fact-fade ml-6 hidden truncate font-mono text-[11px] text-text-faint md:inline"
        >
          {currentFact}
        </span>
      )}

      <span className="ml-auto flex shrink-0 items-center gap-4 font-mono text-[11px] text-text-faint">
        <span className="hidden sm:inline">uptime {uptime}</span>
        <span>{clock} IST</span>
      </span>
    </div>
  );
}
