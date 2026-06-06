import { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Brand Design Tokens
// ─────────────────────────────────────────────────────────────────────────────
const PRIMARY_BLACK = '#1c1b18'; // Carbon black (from logo)
const ACCENT_GOLD   = '#bfa37a'; // Champagne gold (from logo)
const LIGHT_BEIGE   = '#f5efe4'; // Warm beige contrast

// ─────────────────────────────────────────────────────────────────────────────
// Preloader Config
// ─────────────────────────────────────────────────────────────────────────────
const CHAR_INTERVAL = 140;      // ms between each typed character
const TYPE_START    = 600;      // ms delay before typing begins
const MONOGRAM      = '11|22'; // Text to animate; '|' renders in ACCENT_GOLD

// Derived timing: slide-up begins after all chars typed + 700 ms pause
const LIFT_AT = TYPE_START + MONOGRAM.length * CHAR_INTERVAL + 700;

// ─────────────────────────────────────────────────────────────────────────────
// Global CSS injected once — fonts + reset + shared keyframes
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: #fbfbf9;
    font-family: 'Inter', sans-serif;
    color: ${PRIMARY_BLACK};
    overflow-x: hidden;
  }

  ::selection {
    background: ${ACCENT_GOLD}55;
    color: ${PRIMARY_BLACK};
  }

  @keyframes grain {
    0%, 100% { transform: translate(0, 0); }
    10%       { transform: translate(-2%, -3%); }
    20%       { transform: translate(3%, 1%); }
    30%       { transform: translate(-1%, 4%); }
    40%       { transform: translate(4%, -2%); }
    50%       { transform: translate(-3%, 3%); }
    60%       { transform: translate(2%, -4%); }
    70%       { transform: translate(-4%, 2%); }
    80%       { transform: translate(1%, -1%); }
    90%       { transform: translate(3%, 4%); }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// MonogramDisplay — renders typed chars, styling '|' in gold
// ─────────────────────────────────────────────────────────────────────────────
function MonogramDisplay({ count }: { count: number }) {
  return (
    <>
      {MONOGRAM.slice(0, count)
        .split('')
        .map((ch, i) =>
          ch === '|' ? (
            <span
              key={i}
              style={{
                color:      ACCENT_GOLD,
                fontWeight: 300,
                margin:     '0 0.1em',
                opacity:    0.9,
              }}
            >
              {ch}
            </span>
          ) : (
            <span key={i}>{ch}</span>
          )
        )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [typedCount, setTypedCount] = useState(0);
  const [lifting,    setLifting]    = useState(false);
  const [liftDone,   setLiftDone]   = useState(false);
  const [cursorOn,   setCursorOn]   = useState(true);

  // Keep stable refs to avoid stale-closure issues in timers
  const liftingRef = useRef(false);

  useEffect(() => {
    // ── 1. Typewriter: start after TYPE_START delay ────────────────────────
    const startTimer = setTimeout(() => {
      let idx = 0;
      const tick = setInterval(() => {
        idx += 1;
        setTypedCount(idx);
        if (idx >= MONOGRAM.length) clearInterval(tick);
      }, CHAR_INTERVAL);
    }, TYPE_START);

    // ── 2. Slide preloader off-screen at LIFT_AT ──────────────────────────
    const liftTimer = setTimeout(() => {
      liftingRef.current = true;
      setLifting(true);
      // Remove from DOM after CSS transition completes (1 500 ms)
      setTimeout(() => setLiftDone(true), 1_500);
    }, LIFT_AT);

    // ── 3. Blinking cursor ────────────────────────────────────────────────
    const cursorTimer = setInterval(
      () => setCursorOn(v => !v),
      530,
    );

    return () => {
      clearTimeout(startTimer);
      clearTimeout(liftTimer);
      clearInterval(cursorTimer);
    };
  }, []);

  const typingDone = typedCount >= MONOGRAM.length;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Global styles (fonts + reset + keyframes) ──────────────────── */}
      <style>{GLOBAL_STYLES}</style>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 — Preloader / Intro Overlay
          Fixed fullscreen overlay z-100; slides up via CSS transform.
      ══════════════════════════════════════════════════════════════════ */}
      {!liftDone && (
        <div
          style={{
            // Layout
            position:       'fixed',
            inset:          0,
            zIndex:         100,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '1.1rem',

            // Colour
            backgroundColor: PRIMARY_BLACK,

            // Lift animation
            willChange:  'transform',
            transform:   lifting ? 'translateY(-100%)' : 'translateY(0%)',
            transition:  lifting
              ? 'transform 1.5s cubic-bezier(0.45, 0, 0.15, 1)'
              : 'none',

            // Disable interaction during exit
            pointerEvents: lifting ? 'none' : 'all',

            // Subtle film-grain texture overlay
            overflow: 'hidden',
          }}
        >
          {/* Film-grain pseudo-layer */}
          <div
            aria-hidden="true"
            style={{
              position:        'absolute',
              inset:           '-50%',
              width:           '200%',
              height:          '200%',
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
              backgroundSize:  '180px 180px',
              opacity:         0.04,
              animation:       'grain 8s steps(1) infinite',
              pointerEvents:   'none',
            }}
          />

          {/* ── Monogram ─────────────────────────────────────────────────── */}
          <div
            style={{
              fontFamily:    "'Syne', sans-serif",
              fontSize:      '3rem',
              fontWeight:    800,
              color:         '#ffffff',
              letterSpacing: '0.05em',
              lineHeight:    1,
              display:       'flex',
              alignItems:    'center',
              position:      'relative',
            }}
          >
            <MonogramDisplay count={typedCount} />

            {/* Blinking cursor — hidden once lifting starts */}
            {!lifting && (
              <span
                style={{
                  display:         'inline-block',
                  width:           '2px',
                  height:          '2.75rem',
                  backgroundColor: ACCENT_GOLD,
                  marginLeft:      '4px',
                  borderRadius:    '1px',
                  flexShrink:      0,
                  // Blink state driven by cursorOn
                  opacity:    cursorOn ? 1 : 0,
                  transition: 'opacity 0.07s linear',
                }}
              />
            )}
          </div>

          {/* ── "LIVING" caption — fades in after typewriter completes ──── */}
          <div
            style={{
              fontFamily:    "'Syne', sans-serif",
              fontSize:      '0.58rem',
              fontWeight:    400,
              color:         ACCENT_GOLD,
              letterSpacing: '0.52em',
              textTransform: 'uppercase',
              paddingLeft:   '0.52em', // compensate last-char spacing
              opacity:       typingDone && !lifting ? 1 : 0,
              transform:     typingDone && !lifting
                ? 'translateY(0px)'
                : 'translateY(10px)',
              transition:
                'opacity 0.65s ease 0.15s, transform 0.65s ease 0.15s',
            }}
          >
            Living
          </div>

          {/* ── Progress bar — fills as chars are typed ───────────────── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom:   0,
              left:     0,
              height:   '2px',
              width:    `${(typedCount / MONOGRAM.length) * 100}%`,
              background:
                `linear-gradient(90deg, ${ACCENT_GOLD}00, ${ACCENT_GOLD}bb)`,
              transition: `width ${CHAR_INTERVAL}ms linear`,
            }}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          Main App Shell
          Sections 2-N will be added in subsequent steps.
          Fades up into view once the preloader has fully lifted.
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="min-h-screen"
        style={{
          backgroundColor: '#fbfbf9',
          opacity:   liftDone ? 1 : 0,
          transform: liftDone ? 'translateY(0px)' : 'translateY(14px)',
          transition:
            'opacity 0.55s ease 0.1s, transform 0.55s ease 0.1s',
        }}
      >
        {/* ↓ Sections 2–N mount here */}
      </div>
    </>
  );
}
