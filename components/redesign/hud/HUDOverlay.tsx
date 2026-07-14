const CORNERS = [
  'top-0 left-0',
  'top-0 right-0 -scale-x-100',
  'bottom-0 left-0 -scale-y-100',
  'bottom-0 right-0 -scale-x-100 -scale-y-100',
];

// Rounded to a fixed precision so server- and client-rendered markup match
// exactly — raw Math.cos/sin output can differ in its last digit between
// server and browser JS engines and trip a hydration mismatch.
const round = (n: number) => Math.round(n * 100) / 100;
const TICKS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i * 15 * Math.PI) / 180;
  return {
    x1: round(100 + Math.cos(angle) * 84),
    y1: round(100 + Math.sin(angle) * 84),
    x2: round(100 + Math.cos(angle) * 90),
    y2: round(100 + Math.sin(angle) * 90),
  };
});

const RING_TICKS = Array.from({ length: 16 }, (_, i) => {
  const angle = (i * 22.5 * Math.PI) / 180;
  return {
    x1: round(100 + Math.cos(angle) * 96),
    y1: round(100 + Math.sin(angle) * 96),
    x2: round(100 + Math.cos(angle) * 100),
    y2: round(100 + Math.sin(angle) * 100),
  };
});

/**
 * Ambient tracking/HUD chrome — a radar dial with a rotating sweep, a
 * gyroscope cluster of counter-rotating rings bleeding off the corner, small
 * telemetry callouts, and viewfinder corner brackets. Systems-monitoring
 * dressing to match the site's own premise, not decoration for its own
 * sake. Kept to the single accent color, no glow — geometry does the work.
 */
export function HUDOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] hidden md:block" aria-hidden="true">
      <div className="absolute inset-3">
        {CORNERS.map((pos) => (
          <svg key={pos} width="32" height="32" viewBox="0 0 32 32" className={`absolute ${pos} text-accent/70`}>
            <path d="M0,0 L0,16 M0,0 L16,0" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="0" cy="0" r="1.5" fill="currentColor" />
          </svg>
        ))}
      </div>

      {/* gyroscope cluster, bleeding off the top-right corner */}
      <div className="absolute -right-36 -top-36 h-96 w-96 text-accent">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <circle
            className="hud-ring-a"
            cx="100"
            cy="100"
            r="98"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="1 5"
            opacity="0.45"
          />
          <circle className="hud-ring-b" cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <g className="hud-ring-c" opacity="0.4">
            {RING_TICKS.map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="currentColor" strokeWidth="0.75" />
            ))}
          </g>
        </svg>
      </div>

      {/* telemetry callouts */}
      <div className="absolute right-4 top-12 flex items-center gap-2 text-accent/60">
        <span className="h-px w-5 bg-current" />
        <span className="font-mono text-[9px] uppercase tracking-widest">12.9716°N 77.5946°E</span>
      </div>
      <div className="hud-readout absolute bottom-4 left-20 flex items-center gap-2 text-accent/60">
        <span className="h-1 w-1 rounded-full bg-current" />
        <span className="font-mono text-[9px] uppercase tracking-widest">sys.status — nominal</span>
      </div>

      <div className="absolute bottom-4 right-4 h-36 w-36 opacity-40">
        <svg viewBox="0 0 200 200" className="h-full w-full text-accent">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
          {TICKS.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.35"
            />
          ))}
          <g className="hud-sweep">
            <line x1="100" y1="100" x2="100" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          </g>
          <circle className="hud-blip-a" cx="140" cy="70" r="2.5" fill="currentColor" />
          <circle className="hud-blip-b" cx="65" cy="130" r="2.5" fill="currentColor" />
          <circle className="hud-blip-c" cx="130" cy="145" r="2" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
