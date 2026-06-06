import { useState, useEffect, useRef } from 'react';
import { BedDouble, Bath, Maximize2, ArrowRight } from 'lucide-react';

// ─── Brand Tokens ─────────────────────────────────────────────────────────────
const PRIMARY_BLACK = '#1c1b18';
const ACCENT_GOLD   = '#bfa37a';
const LIGHT_BEIGE   = '#f5efe4';

// ─── Logo ────────────────────────────────────────────────────────────────────
const LOGO = 'https://i.postimg.cc/gjr3HDK7/Logo.jpg';

// ─── Hero BG ─────────────────────────────────────────────────────────────────
const BG_IMG = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260603_073200_7082add5-f1f8-4873-8696-d6f78a44089b.png&w=1920&q=85';

// ─── Preloader config ─────────────────────────────────────────────────────────
const CHAR_INTERVAL = 140;
const TYPE_START    = 600;
const MONOGRAM      = '11|22';
const LIFT_AT       = TYPE_START + MONOGRAM.length * CHAR_INTERVAL + 700;

// ─── Nav links ───────────────────────────────────────────────────────────────
const NAV_LINKS = ['Residences', 'Story', 'Listings', 'Inquire'] as const;

// ─── Stats data ───────────────────────────────────────────────────────────────
const STATS = [
  { value: 200, prefix: '',  suffix: '+',  label: 'Properties Placed' },
  { value: 50,  prefix: '$', suffix: 'M+', label: 'Total Volume' },
  { value: 5,   prefix: '',  suffix: '+',  label: 'Years Active' },
  { value: 98,  prefix: '',  suffix: '%',  label: 'Client Satisfaction' },
] as const;

// ─── Listings data ────────────────────────────────────────────────────────────
interface Property {
  id: number;
  img: string;
  address: string;
  location: string;
  price: string;
  type: 'Sale' | 'Rent';
  beds: number;
  baths: number;
  sqft: number;
}

const PROPERTIES: Property[] = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    address: 'Av. Álvarez Thomas 1420',
    location: 'Palermo, Buenos Aires',
    price: 'USD 480,000',
    type: 'Sale',
    beds: 3, baths: 2, sqft: 180,
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    address: 'Juncal 3280, Piso 8',
    location: 'Recoleta, Buenos Aires',
    price: 'USD 1,250,000',
    type: 'Sale',
    beds: 4, baths: 3, sqft: 320,
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    address: 'Libertador 7850',
    location: 'Núñez, Buenos Aires',
    price: 'USD 3,800 / mo',
    type: 'Rent',
    beds: 2, baths: 2, sqft: 120,
  },
];

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

  /* Design tokens: primary ${PRIMARY_BLACK} · gold ${ACCENT_GOLD} · beige ${LIGHT_BEIGE} */

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  body { background-color: #fbfbf9; font-family: 'Inter', sans-serif; color: ${PRIMARY_BLACK}; overflow-x: hidden; }
  ::selection { background: ${ACCENT_GOLD}55; color: ${PRIMARY_BLACK}; }

  @keyframes grain {
    0%,100%{transform:translate(0,0)}   10%{transform:translate(-2%,-3%)}
    20%{transform:translate(3%,1%)}     30%{transform:translate(-1%,4%)}
    40%{transform:translate(4%,-2%)}    50%{transform:translate(-3%,3%)}
    60%{transform:translate(2%,-4%)}    70%{transform:translate(-4%,2%)}
    80%{transform:translate(1%,-1%)}    90%{transform:translate(3%,4%)}
  }

  /* Menu links */
  .menu-link { transition: color 0.22s ease; }
  .menu-link:hover { color: ${ACCENT_GOLD}; }

  /* ── Hero typography ─────────────────────────────────────── */
  .hero-live-in {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    color: ${PRIMARY_BLACK};
    letter-spacing: -0.02em;
    line-height: 1;
    font-size: clamp(1.5rem, 3.2vw, 2.8rem);
  }

  .hero-sub {
    display: none;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    color: ${PRIMARY_BLACK};
    opacity: 0.68;
    line-height: 1.52;
    text-align: right;
    font-size: clamp(0.78rem, 1.05vw, 0.98rem);
    max-width: 26ch;
  }

  .hero-big {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    color: ${PRIMARY_BLACK};
    letter-spacing: -0.045em;
    line-height: 0.88;
    display: block;
    font-size: clamp(2.5rem, 9.5vw, 11.5rem);
  }

  @media (min-width: 768px) {
    .hero-sub { display: block; }
    .hero-big { letter-spacing: -0.05em; }
  }
  @media (max-width: 1024px) {
    .hero-big      { font-size: clamp(2.5rem, 10.5vw, 9rem); }
    .hero-live-in  { font-size: clamp(1.4rem, 3.8vw, 2.2rem); }
  }
  @media (max-width: 768px) {
    .hero-big      { font-size: clamp(2.2rem, 12.5vw, 5.5rem); letter-spacing: -0.035em; }
    .hero-live-in  { font-size: clamp(1.2rem, 4.5vw, 1.7rem); }
  }
  @media (max-width: 480px) {
    .hero-big      { font-size: clamp(1.9rem, 13vw, 4rem); letter-spacing: -0.025em; }
    .hero-live-in  { font-size: clamp(1rem, 5vw, 1.4rem); }
  }

  /* ── Stats ───────────────────────────────────────────────── */
  .stat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }
  @media (min-width: 768px) {
    .stat-grid { grid-template-columns: repeat(4, 1fr); }
  }

  .stat-cell {
    position: relative;
    padding: 3rem 2rem;
    text-align: center;
  }

  /* Vertical gold divider between cells (not after last in each row) */
  .stat-cell:not(:nth-child(2n))::after,
  .stat-cell:not(:nth-child(2n)) + .stat-cell::before {
    content: '';
    position: absolute;
    right: 0;
    top: 20%;
    height: 60%;
    width: 1px;
    background: ${ACCENT_GOLD}44;
  }
  @media (min-width: 768px) {
    .stat-cell::after {
      content: '';
      position: absolute;
      right: 0;
      top: 20%;
      height: 60%;
      width: 1px;
      background: ${ACCENT_GOLD}44;
    }
    .stat-cell:last-child::after { display: none; }
    .stat-cell::before { display: none; }
  }

  .stat-value {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(2.4rem, 5vw, 4rem);
    color: #fff;
    letter-spacing: -0.04em;
    line-height: 1;
  }

  .stat-prefix { color: ${ACCENT_GOLD}; }
  .stat-suffix { color: ${ACCENT_GOLD}; font-size: 0.65em; vertical-align: super; margin-left: 1px; }

  .stat-label {
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    margin-top: 0.6rem;
  }

  /* ── Listings ────────────────────────────────────────────── */
  .listing-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background: #fff;
    overflow: hidden;
    transition: box-shadow 0.35s ease;
  }
  .listing-card:hover { box-shadow: 0 16px 56px rgba(28,27,24,0.12); }

  .listing-img-wrap {
    position: relative;
    overflow: hidden;
    aspect-ratio: 4 / 3;
  }
  .listing-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.65s cubic-bezier(0.2, 0, 0.1, 1);
  }
  .listing-card:hover .listing-img-wrap img { transform: scale(1.06); }

  .listing-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #fff;
    background: ${ACCENT_GOLD};
    padding: 0.25rem 0.65rem;
    border-radius: 2px;
  }

  .listing-body { padding: 1.4rem 1.5rem 1.6rem; flex: 1; display: flex; flex-direction: column; gap: 0.85rem; }

  .listing-address {
    font-family: 'Syne', sans-serif;
    font-size: clamp(0.95rem, 1.5vw, 1.05rem);
    font-weight: 700;
    color: ${PRIMARY_BLACK};
    letter-spacing: -0.01em;
    line-height: 1.25;
  }

  .listing-location {
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    color: rgba(28,27,24,0.45);
    letter-spacing: 0.04em;
    margin-top: -0.5rem;
  }

  .listing-specs {
    display: flex;
    gap: 1.15rem;
    align-items: center;
    color: rgba(28,27,24,0.55);
  }
  .listing-spec {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
  }

  .listing-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(28,27,24,0.08);
    padding-top: 0.85rem;
    margin-top: auto;
  }

  .listing-price {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(1rem, 1.8vw, 1.1rem);
    color: ${PRIMARY_BLACK};
    letter-spacing: -0.02em;
  }

  .listing-cta {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${ACCENT_GOLD};
    text-decoration: none;
    transition: gap 0.22s ease;
  }
  .listing-cta:hover { gap: 0.55rem; }

  /* Gold underline on listings section heading */
  .section-eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${ACCENT_GOLD};
  }
  .section-heading {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(2rem, 4.5vw, 3.75rem);
    letter-spacing: -0.04em;
    line-height: 0.95;
    color: ${PRIMARY_BLACK};
  }
`;

// ─── MonogramDisplay ──────────────────────────────────────────────────────────
function MonogramDisplay({ count }: { count: number }) {
  return (
    <>
      {MONOGRAM.slice(0, count).split('').map((ch, i) =>
        ch === '|' ? (
          <span key={i} style={{ color: ACCENT_GOLD, fontWeight: 300, margin: '0 0.1em', opacity: 0.9 }}>
            {ch}
          </span>
        ) : (
          <span key={i}>{ch}</span>
        )
      )}
    </>
  );
}

// ─── FullscreenMenu ───────────────────────────────────────────────────────────
function FullscreenMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          40,
        backgroundColor: '#fbfbf9',
        display:         'flex',
        flexDirection:   'column',
        justifyContent:  'center',
        padding:         '6rem 7% 3rem',
        opacity:         open ? 1 : 0,
        pointerEvents:   open ? 'all' : 'none',
        transition:      'opacity 0.35s ease',
      }}
    >
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
        {NAV_LINKS.map((link, i) => (
          <div
            key={link}
            style={{
              opacity:    open ? 1 : 0,
              transform:  open ? 'translateY(0)' : 'translateY(22px)',
              transition: `opacity 0.45s ease ${open ? 0.08 + i * 0.07 : 0}s,
                           transform 0.45s ease ${open ? 0.08 + i * 0.07 : 0}s`,
            }}
          >
            <a
              href={`#${link.toLowerCase()}`}
              className="menu-link"
              onClick={(e) => { e.preventDefault(); onClose(); }}
              style={{
                display:        'block',
                fontFamily:     "'Syne', sans-serif",
                fontSize:       'clamp(2.25rem, 5vw, 4.5rem)',
                fontWeight:     800,
                color:          PRIMARY_BLACK,
                textDecoration: 'none',
                letterSpacing:  '-0.025em',
                lineHeight:     1.1,
                paddingTop:     '0.45rem',
                paddingBottom:  '0.45rem',
              }}
            >
              {link}
            </a>
          </div>
        ))}
      </nav>

      <div
        aria-hidden="true"
        style={{
          position:        'absolute',
          bottom:          '3rem',
          left:            '7%',
          right:           '7%',
          height:          '1px',
          backgroundColor: PRIMARY_BLACK,
          opacity:         0.1,
        }}
      />
    </div>
  );
}

// ─── useCountUp ───────────────────────────────────────────────────────────────
function useCountUp(target: number, duration: number, active: boolean): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration]);

  return count;
}

// ─── StatItem ─────────────────────────────────────────────────────────────────
function StatItem({
  value, prefix, suffix, label, active,
}: { value: number; prefix: string; suffix: string; label: string; active: boolean }) {
  const displayed = useCountUp(value, 1800, active);
  return (
    <div className="stat-cell">
      <div className="stat-value">
        {prefix && <span className="stat-prefix">{prefix}</span>}
        {displayed}
        {suffix && <span className="stat-suffix">{suffix}</span>}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// ─── PropertyCard ─────────────────────────────────────────────────────────────
function PropertyCard({ p }: { p: Property }) {
  return (
    <article className="listing-card">
      <div className="listing-img-wrap">
        <img src={p.img} alt={p.address} loading="lazy" />
        <span className="listing-badge">{p.type}</span>
      </div>
      <div className="listing-body">
        <div>
          <div className="listing-address">{p.address}</div>
          <div className="listing-location">{p.location}</div>
        </div>
        <div className="listing-specs">
          <span className="listing-spec">
            <BedDouble size={13} strokeWidth={1.8} />
            {p.beds} beds
          </span>
          <span className="listing-spec">
            <Bath size={13} strokeWidth={1.8} />
            {p.baths} baths
          </span>
          <span className="listing-spec">
            <Maximize2 size={12} strokeWidth={1.8} />
            {p.sqft} m²
          </span>
        </div>
        <div className="listing-footer">
          <span className="listing-price">{p.price}</span>
          <a href="#inquire" className="listing-cta">
            View <ArrowRight size={12} strokeWidth={2} />
          </a>
        </div>
      </div>
    </article>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  // Preloader
  const [typedCount, setTypedCount] = useState(0);
  const [lifting,    setLifting]    = useState(false);
  const [liftDone,   setLiftDone]   = useState(false);
  const [cursorOn,   setCursorOn]   = useState(true);

  // Nav
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [navOnDark,  setNavOnDark]  = useState(true);
  const [scrolled,   setScrolled]   = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  // Stats
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef<HTMLElement>(null);
  const heroRef  = useRef<HTMLElement>(null);

  // ── Preloader timers ──────────────────────────────────────────────────────
  useEffect(() => {
    const startTimer = setTimeout(() => {
      let idx = 0;
      const tick = setInterval(() => {
        idx += 1;
        setTypedCount(idx);
        if (idx >= MONOGRAM.length) clearInterval(tick);
      }, CHAR_INTERVAL);
    }, TYPE_START);

    const liftTimer = setTimeout(() => {
      setLifting(true);
      setTimeout(() => setLiftDone(true), 1_500);
    }, LIFT_AT);

    const cursorTimer = setInterval(() => setCursorOn(v => !v), 530);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(liftTimer);
      clearInterval(cursorTimer);
    };
  }, []);

  // ── Scroll: track hero exit + depth ──────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const hero = heroRef.current;
      if (hero) setNavOnDark(window.scrollY < hero.offsetTop + hero.offsetHeight - 90);
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Stats IntersectionObserver ────────────────────────────────────────────
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsActive(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Lock body scroll when menu open ──────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // ── ESC closes menu ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const typingDone      = typedCount >= MONOGRAM.length;
  const effectivelyDark = navOnDark && !menuOpen;
  const navColor        = effectivelyDark ? '#ffffff' : PRIMARY_BLACK;
  const topLineW        = menuOpen ? '28px' : (btnHovered ? '20px' : '28px');

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — Preloader
      ═══════════════════════════════════════════════════════════════════ */}
      {!liftDone && (
        <div
          style={{
            position:        'fixed',
            inset:           0,
            zIndex:          100,
            backgroundColor: PRIMARY_BLACK,
            display:         'flex',
            flexDirection:   'column',
            alignItems:      'center',
            justifyContent:  'center',
            gap:             '1.1rem',
            willChange:      'transform',
            transform:       lifting ? 'translateY(-100%)' : 'translateY(0%)',
            transition:      lifting ? 'transform 1.5s cubic-bezier(0.45, 0, 0.15, 1)' : 'none',
            pointerEvents:   lifting ? 'none' : 'all',
            overflow:        'hidden',
          }}
        >
          {/* Film grain */}
          <div
            aria-hidden="true"
            style={{
              position:        'absolute',
              inset:           '-50%',
              width:           '200%',
              height:          '200%',
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
              backgroundSize:  '180px',
              opacity:         0.04,
              animation:       'grain 8s steps(1) infinite',
              pointerEvents:   'none',
            }}
          />

          {/* Monogram */}
          <div
            style={{
              fontFamily:    "'Syne', sans-serif",
              fontSize:      '3rem',
              fontWeight:    800,
              color:         '#fff',
              letterSpacing: '0.05em',
              lineHeight:    1,
              display:       'flex',
              alignItems:    'center',
            }}
          >
            <MonogramDisplay count={typedCount} />
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
                  opacity:         cursorOn ? 1 : 0,
                  transition:      'opacity 0.07s linear',
                }}
              />
            )}
          </div>

          {/* 'Living' caption */}
          <div
            style={{
              fontFamily:    "'Syne', sans-serif",
              fontSize:      '0.58rem',
              fontWeight:    400,
              color:         ACCENT_GOLD,
              letterSpacing: '0.52em',
              textTransform: 'uppercase',
              paddingLeft:   '0.52em',
              opacity:       typingDone && !lifting ? 1 : 0,
              transform:     typingDone && !lifting ? 'translateY(0)' : 'translateY(10px)',
              transition:    'opacity 0.65s ease 0.15s, transform 0.65s ease 0.15s',
            }}
          >
            Living
          </div>

          {/* Progress bar */}
          <div
            aria-hidden="true"
            style={{
              position:   'absolute',
              bottom:     0,
              left:       0,
              height:     '2px',
              width:      `${(typedCount / MONOGRAM.length) * 100}%`,
              background: `linear-gradient(90deg, ${ACCENT_GOLD}00, ${ACCENT_GOLD}bb)`,
              transition: `width ${CHAR_INTERVAL}ms linear`,
            }}
          />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — Fixed Navigation
      ═══════════════════════════════════════════════════════════════════ */}
      <header
        style={{
          position:       'fixed',
          top:            0,
          left:           0,
          right:          0,
          zIndex:         50,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '1.35rem 5%',
          backgroundColor:
            menuOpen
              ? '#fbfbf9'
              : scrolled && !navOnDark
                ? 'rgba(251,251,249,0.92)'
                : 'transparent',
          backdropFilter:
            !menuOpen && scrolled && !navOnDark ? 'blur(14px)' : 'none',
          opacity:    lifting ? 1 : 0,
          transform:  lifting ? 'translateY(0)' : 'translateY(-6px)',
          transition: [
            'background-color 0.4s ease',
            'backdrop-filter 0.4s ease',
            `opacity 0.5s ease ${lifting ? '0.25s' : '0s'}`,
            `transform 0.5s ease ${lifting ? '0.25s' : '0s'}`,
          ].join(', '),
        }}
      >
        {/* Logo — single image, CSS filter inverts it to white on dark BG */}
        <a href="#" aria-label="1122 Living — home" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={LOGO}
            alt="1122 Living"
            className="h-8 md:h-10 w-auto"
            style={{
              objectFit:  'contain',
              filter:     effectivelyDark ? 'brightness(0) invert(1)' : 'none',
              transition: 'filter 0.3s ease',
            }}
          />
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          style={{
            background:    'none',
            border:        'none',
            cursor:        'pointer',
            padding:       '8px',
            display:       'flex',
            flexDirection: 'column',
            gap:           '7px',
            alignItems:    'flex-end',
          }}
        >
          <span
            style={{
              display:         'block',
              width:           topLineW,
              height:          '1px',
              backgroundColor: navColor,
              borderRadius:    '1px',
              transformOrigin: 'center',
              transform:       menuOpen ? 'translateY(4px) rotate(45deg)' : 'none',
              transition:      'width 0.25s ease, transform 0.3s ease, background-color 0.25s ease',
            }}
          />
          <span
            style={{
              display:         'block',
              width:           '28px',
              height:          '1px',
              backgroundColor: navColor,
              borderRadius:    '1px',
              transformOrigin: 'center',
              transform:       menuOpen ? 'translateY(-4px) rotate(-45deg)' : 'none',
              transition:      'transform 0.3s ease, background-color 0.25s ease',
            }}
          />
        </button>
      </header>

      {/* Fullscreen menu overlay */}
      <FullscreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 — Hero
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="inicio"
        ref={heroRef}
        style={{
          position:       'relative',
          minHeight:      '100vh',
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'flex-end',
          overflow:       'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position:           'absolute',
            inset:              0,
            backgroundImage:    `url(${BG_IMG})`,
            backgroundSize:     'cover',
            backgroundPosition: 'center 30%',
            backgroundRepeat:   'no-repeat',
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position:   'absolute',
            inset:      0,
            background: [
              'linear-gradient(180deg,',
              '  rgba(251,251,249,0.06) 0%,',
              '  transparent           30%,',
              '  transparent           52%,',
              '  rgba(251,251,249,0.5) 78%,',
              '  rgba(251,251,249,0.92) 100%',
              ')',
            ].join(''),
          }}
        />

        <div
          style={{
            position:  'relative',
            width:     '100%',
            padding:   '0 5% 5%',
            opacity:   lifting ? 1 : 0,
            transform: lifting ? 'translateY(0)' : 'translateY(28px)',
            transition: [
              `opacity 0.95s ease ${lifting ? '0.55s' : '0s'}`,
              `transform 0.95s cubic-bezier(0.2, 0, 0.1, 1) ${lifting ? '0.55s' : '0s'}`,
            ].join(', '),
          }}
        >
          <div
            style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'flex-end',
              marginBottom:   '0.15rem',
            }}
          >
            <span className="hero-live-in">LIVE IN</span>
            <p className="hero-sub">
              Stately homes built with vision,<br />
              scope, and architectural finesse.
            </p>
          </div>
          <span className="hero-big">IRREPLACEABLE</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — Stats
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="story"
        ref={statsRef}
        style={{ backgroundColor: PRIMARY_BLACK }}
      >
        <div className="stat-grid">
          {STATS.map(s => (
            <StatItem
              key={s.label}
              value={s.value}
              prefix={s.prefix}
              suffix={s.suffix}
              label={s.label}
              active={statsActive}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — Featured Listings
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="listings"
        style={{
          backgroundColor: LIGHT_BEIGE,
          padding:         'clamp(4rem, 8vw, 7rem) 5%',
        }}
      >
        {/* Header */}
        <div
          style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'flex-end',
            marginBottom:   'clamp(2.5rem, 4vw, 3.5rem)',
            gap:            '1.5rem',
            flexWrap:       'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span className="section-eyebrow">Portfolio</span>
            <h2 className="section-heading">Featured<br />Residences</h2>
          </div>
          <a
            href="#listings"
            style={{
              fontFamily:     "'Inter', sans-serif",
              fontSize:       '0.72rem',
              fontWeight:     600,
              letterSpacing:  '0.12em',
              textTransform:  'uppercase',
              color:          PRIMARY_BLACK,
              textDecoration: 'none',
              borderBottom:   `1px solid ${ACCENT_GOLD}`,
              paddingBottom:  '2px',
              whiteSpace:     'nowrap',
              alignSelf:      'flex-end',
            }}
          >
            View all listings
          </a>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
            gap:                 '1.5rem',
          }}
        >
          {PROPERTIES.map(p => <PropertyCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Sections 6-N added in subsequent steps */}
    </>
  );
}
