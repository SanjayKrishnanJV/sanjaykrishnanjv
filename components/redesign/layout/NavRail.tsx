'use client';

export interface NavSection {
  id: string;
  label: string;
}

interface NavRailProps {
  sections: NavSection[];
  active: string;
  onNavigate: (id: string) => void;
}

export function NavRail({ sections, active, onNavigate }: NavRailProps) {
  return (
    <>
      {/* Desktop: vertical rail, expands on hover */}
      <nav
        className="group fixed left-0 top-11 z-[60] hidden h-[calc(100%-2.75rem)] w-14 flex-col items-start justify-center border-r border-rule bg-bg py-4 transition-[width] duration-300 hover:w-56 md:flex"
        aria-label="Section navigation"
      >
        <ul className="flex w-full flex-col gap-1">
          {sections.map((s) => (
            <li key={s.id} className="w-full">
              <button
                type="button"
                onClick={() => onNavigate(s.id)}
                data-cursor="view"
                aria-current={active === s.id ? 'true' : undefined}
                className={`flex w-full items-center gap-3 overflow-hidden px-4 py-2 font-mono text-[11px] tracking-wide transition-colors ${
                  active === s.id ? 'text-accent' : 'text-text-faint hover:text-text-soft'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                    active === s.id ? 'animate-pulse bg-accent' : 'bg-text-faint/40'
                  }`}
                />
                <span className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {s.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile: horizontal tab strip, since there's no scroll to discover views by */}
      <nav
        className="flex w-full shrink-0 gap-1 overflow-x-auto border-b border-rule bg-bg px-2 py-2 md:hidden"
        aria-label="Section navigation"
      >
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onNavigate(s.id)}
            aria-current={active === s.id ? 'true' : undefined}
            className={`shrink-0 whitespace-nowrap rounded px-3 py-1.5 font-mono text-[11px] tracking-wide transition-colors ${
              active === s.id ? 'bg-accent-dim text-accent' : 'text-text-faint'
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>
    </>
  );
}
