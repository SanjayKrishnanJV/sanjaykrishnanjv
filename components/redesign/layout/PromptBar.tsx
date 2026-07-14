'use client';

import { useState, type FormEvent } from 'react';

const ROUTES: Record<string, string> = {
  whoami: 'top',
  home: 'top',
  top: 'top',
  clear: 'top',
  about: 'about',
  career: 'career',
  experience: 'career',
  skills: 'skills',
  work: 'work',
  projects: 'work',
  systems: 'systems',
  stats: 'systems',
  credentials: 'credentials',
  certs: 'credentials',
  writing: 'writing',
  blog: 'writing',
  contact: 'contact',
};

const HELP_TEXT =
  'available: whoami, about, career, skills, work, systems, credentials, writing, contact, clear';

interface PromptBarProps {
  onNavigate: (id: string) => void;
}

export function PromptBar({ onNavigate }: PromptBarProps) {
  const [value, setValue] = useState('');
  const [response, setResponse] = useState<{ cmd: string; text: string } | null>(null);
  const [focused, setFocused] = useState(false);

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'help') {
      setResponse({ cmd, text: HELP_TEXT });
      return;
    }
    if (cmd.startsWith('sudo')) {
      setResponse({ cmd, text: 'nice try. permission denied.' });
      return;
    }

    const target = ROUTES[cmd];
    if (target) {
      onNavigate(target);
      setResponse(cmd === 'clear' ? null : { cmd, text: `→ ${target}` });
    } else {
      setResponse({ cmd, text: `command not found: ${cmd}. type 'help' for options.` });
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    run(value);
    setValue('');
  }

  return (
    <div className="sticky bottom-0 z-[55] border-t border-rule bg-bg px-4 py-3 md:px-5">
      {response && (
        <div className="mb-2 font-mono text-xs text-text-faint">
          <span className="text-accent">$</span> {response.cmd}
          <br />
          {response.text}
        </div>
      )}
      <form onSubmit={onSubmit} className="flex items-center gap-2 font-mono text-sm">
        <label htmlFor="terminal-prompt" className="shrink-0 text-accent">
          visitor@sanjay:~$
        </label>
        <div className="relative flex-1">
          <input
            id="terminal-prompt"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="type 'help'"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Terminal command input"
            className="w-full bg-transparent text-text caret-accent outline-none placeholder:text-text-faint"
          />
          {!focused && !value && (
            <span
              aria-hidden="true"
              className="blink-cursor pointer-events-none absolute left-0 top-1/2 h-[1.1em] w-[0.55em] -translate-y-1/2 bg-text-faint"
            />
          )}
        </div>
      </form>
    </div>
  );
}
