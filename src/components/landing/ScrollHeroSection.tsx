import { useEffect, useRef, useState } from 'react';
import HeroAnimation from './HeroAnimation.tsx';
import ScrambleText from './ScrambleText.tsx';

type EntryPhase = 'init' | 'blink' | 'reveal';

interface HeroOverlayProps {
  scrollProgress?: number;
  entryPhase: EntryPhase;
  dotActive?: boolean;
}

function HeroOverlay({ scrollProgress = 0, entryPhase, dotActive = false }: HeroOverlayProps) {
  const FADE_START = 0.8;
  const FADE_RANGE = 0.35;
  const topP = scrollProgress < FADE_START
    ? 0
    : Math.min(1, (scrollProgress - FADE_START) / FADE_RANGE);
  const isRevealed = entryPhase === 'reveal';

  return (
    <div
      className="max-w-2xl"
      style={{
        transform: isRevealed ? `translateY(${-topP * 60}px)` : undefined,
        opacity: isRevealed ? 1 - topP : 0,
      }}
    >
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold italic text-[var(--color-accent)] leading-[1.1] tracking-tight">
        <span className={isRevealed ? 'anim-word' : ''} style={{ animationDelay: '0ms' }}>All-in-one</span>{' '}
        <br />
        <span className={isRevealed ? 'anim-word' : ''} style={{ animationDelay: '150ms' }}>web</span>{' '}
        <span className={isRevealed ? 'anim-word' : ''} style={{ animationDelay: '300ms' }}>
          toolkit<span id="title-dot" className={`inline-block w-[0.15em] h-[0.15em] ml-1 mt-[1.7px] transition-colors duration-500 ${dotActive ? 'bg-[var(--color-accent)]' : 'bg-accent'}`} />
        </span>
      </h1>
      <p className={`mt-2.5 text-sm sm:text-base font-semibold italic text-[var(--color-text-muted)] leading-relaxed ${isRevealed ? 'anim-desc' : ''}`}>
        An open-source and free web toolkit to <ScrambleText />
      </p>
    </div>
  );
}

export default function ScrollHeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lockedHeightRef = useRef<number>(0);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [entryPhase, setEntryPhase] = useState<EntryPhase>('init');
  const [ctaEntered, setCtaEntered] = useState(false);
  const [ctaAnimDone, setCtaAnimDone] = useState(false);
  const [bgStarted, setBgStarted] = useState(false);

  // Grid: two independent layers, each with random slide-in direction
  const [showHorizGrid, setShowHorizGrid] = useState(false);
  const [showVertGrid, setShowVertGrid] = useState(false);
  const [showGridLabels, setShowGridLabels] = useState(false);
  const [gridDir] = useState<{ x: 'left' | 'right'; y: 'top' | 'bottom' }>(() => ({
    x: Math.random() > 0.5 ? 'left' : 'right',
    y: Math.random() > 0.5 ? 'top' : 'bottom',
  }));

  // Navbar: entry phase vs scroll phase
  const [showNavbar, setShowNavbar] = useState(false);
  const [navEntryDone, setNavEntryDone] = useState(false);

  const [titleAnimDone, setTitleAnimDone] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    lockedHeightRef.current = window.innerHeight;

    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const viewH = lockedHeightRef.current;
      const p = Math.max(0, Math.min(1, -top / (height - viewH)));
      setScrollProgress(p);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Sequence: Blink → BG → Grid (horiz + vert simultaneously) → Labels → Navbar → Title → CTA
    const t_blink        = setTimeout(() => setEntryPhase('blink'), 200);
    const t_bg           = setTimeout(() => setBgStarted(true), 1000);
    const t_horiz        = setTimeout(() => setShowHorizGrid(true), 1200);
    const t_vert         = setTimeout(() => setShowVertGrid(true), 1500);
    const t_labels       = setTimeout(() => setShowGridLabels(true), 1900);
    const t_navbar       = setTimeout(() => setShowNavbar(true), 2400);
    const t_navbar_done  = setTimeout(() => setNavEntryDone(true), 3300); // 2400 + 800ms anim + 100ms buffer
    const t_title        = setTimeout(() => { setShowTitle(true); setEntryPhase('reveal'); }, 3000);
    const t_title_done   = setTimeout(() => setTitleAnimDone(true), 3900); // 3000 + 300 (last delay) + ~600 (anim)
    const t_cta          = setTimeout(() => { setShowCTA(true); setCtaEntered(true); }, 3600);
    const t_cta_done     = setTimeout(() => setCtaAnimDone(true), 4600);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      [t_blink, t_bg, t_horiz, t_vert, t_labels,
       t_navbar, t_navbar_done, t_title, t_title_done, t_cta, t_cta_done].forEach(clearTimeout);
    };
  }, []);

  const FADE_START = 0.8;
  const FADE_RANGE = 0.35;
  const fadeP = scrollProgress < FADE_START ? 0 : Math.min(1, (scrollProgress - FADE_START) / FADE_RANGE);
  const heroOverlayOpacity = Math.max(0, 1 - (scrollProgress - 0.8) / 0.2);
  const innerBgColor = bgStarted ? '#EBEBDF' : '#252422';
  const innerBgTransition = bgStarted ? 'background-color 0.8s ease' : 'none';

  // Grid background definitions (separate layers)
  const horizBg = [
    'repeating-linear-gradient(rgba(37,36,34,0.05) 0px, rgba(37,36,34,0.05) 1px, transparent 1px, transparent 40px)',
    'repeating-linear-gradient(rgba(37,36,34,0.1) 0px, rgba(37,36,34,0.1) 2px, transparent 2px, transparent 200px)',
  ].join(', ');
  const vertBg = [
    'repeating-linear-gradient(90deg, rgba(37,36,34,0.05) 0px, rgba(37,36,34,0.05) 1px, transparent 1px, transparent 40px)',
    'repeating-linear-gradient(90deg, rgba(37,36,34,0.1) 0px, rgba(37,36,34,0.1) 2px, transparent 2px, transparent 200px)',
  ].join(', ');

  const horizAnimName = gridDir.x === 'left' ? 'gridSlideFromLeft' : 'gridSlideFromRight';
  const vertAnimName  = gridDir.y === 'top'  ? 'gridSlideFromTop'  : 'gridSlideFromBottom';
  const gridAnimCurve = '0.7s cubic-bezier(0.16, 1, 0.3, 1) both';

  // Navbar: CSS animation on entry, scroll-based after
  const navScrollStyle = navEntryDone
    ? {
        transform: `translateY(${-fadeP * 60}px)`,
        opacity: 1 - fadeP,
        transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }
    : {};

  const numLabelsX = 40;
  const numLabelsY = 12;

  return (
    <>
      <style>{`
        @keyframes gridSlideFromLeft   { from { clip-path: inset(0 100% 0 0);   } to { clip-path: inset(0 0% 0 0);   } }
        @keyframes gridSlideFromRight  { from { clip-path: inset(0 0 0 100%);   } to { clip-path: inset(0 0 0 0%);   } }
        @keyframes gridSlideFromTop    { from { clip-path: inset(0 0 100% 0);   } to { clip-path: inset(0% 0 0 0);   } }
        @keyframes gridSlideFromBottom { from { clip-path: inset(100% 0 0 0);   } to { clip-path: inset(0% 0 0 0);   } }
        @keyframes navSlideDown        { from { opacity: 0; transform: translateY(-50px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div
        ref={sectionRef}
        className="relative"
        style={{ height: '400svh', backgroundColor: '#252422', transition: innerBgTransition }}
      >
        <div
          ref={containerRef}
          style={{
            position: 'fixed',
            top: '-10svh',
            left: 0,
            right: 0,
            height: '130svh',
            zIndex: 40,
            overflow: 'visible',
            backgroundColor: innerBgColor,
            transition: innerBgTransition,
            opacity: heroOverlayOpacity,
            pointerEvents: heroOverlayOpacity > 0 ? 'auto' : 'none',
          }}
        >
          {/* Horizontal grid lines — slide from left or right */}
          {showHorizGrid && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: horizBg,
                animation: `${horizAnimName} ${gridAnimCurve}`,
              }}
            />
          )}

          {/* Vertical grid lines — slide from top or bottom */}
          {showVertGrid && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: vertBg,
                animation: `${vertAnimName} ${gridAnimCurve}`,
              }}
            />
          )}

          {/* Cutting mat labels */}
          {showGridLabels && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 anim-nav">
              {Array.from({ length: numLabelsX }).map((_, i) =>
                i > 0 && (
                  <div key={`x-${i}`} className="absolute text-[10px] font-mono" style={{ left: `${i * 200 + 40}px`, top: '40px', color: 'rgba(37,36,34,0.25)' }}>
                    {i * 50}
                  </div>
                )
              )}
              {Array.from({ length: numLabelsY }).map((_, i) =>
                i > 0 && (
                  <div key={`y-${i}`} className="absolute text-[10px] font-mono" style={{ top: `${i * 200 + 40}px`, left: '40px', color: 'rgba(37,36,34,0.25)' }}>
                    {i * 50}
                  </div>
                )
              )}
            </div>
          )}

          {/* Navbar — CSS slide-down on entry, scroll-based after */}
          {showNavbar && (
            <div
              className="absolute top-0 left-0 right-0 pointer-events-auto"
              style={{
                zIndex: 50,
                animation: !navEntryDone ? `navSlideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) both` : undefined,
                ...navScrollStyle,
              }}
            >
              <nav className="m-4 sm:m-auto sm:max-w-5xl border-b border-accent mt-20 bg-[#EBEBDF]">
                <div className="flex items-center justify-between px-6 py-2">
                  <div className="flex items-center gap-8">
                    <span className="text-xl font-bold text-[var(--color-accent)]">ViewPort</span>
                    <div className="hidden sm:flex items-center gap-6">
                      <span className="text-sm text-[var(--color-accent)] font-medium">Home</span>
                      <a href="/app" className="text-sm text-[var(--color-accent)]/60 hover:text-[var(--color-accent)] transition-colors">App</a>
                    </div>
                  </div>
                  <button className="sm:hidden p-2 text-[var(--color-accent)]/60 hover:text-[var(--color-accent)] transition-colors" aria-label="Menu">
                    <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
                      <path d="M40,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H160A8,8,0,0,1,40,128ZM40,72H160a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM160,184H40a8,8,0,0,0,0,16H160a8,8,0,0,0,0-16Z" />
                    </svg>
                  </button>
                </div>
              </nav>
            </div>
          )}

          {/* Title */}
          {showTitle && (
            <div className="absolute top-[20vh] left-0 right-0 pointer-events-none z-10 px-6 sm:px-16 lg:px-24 xl:px-32">
              <HeroOverlay scrollProgress={scrollProgress} entryPhase={entryPhase} dotActive={titleAnimDone} />
            </div>
          )}

          {/* Mockup */}
          <div
            className={`absolute top-[40vh] left-0 right-0 flex justify-center ${entryPhase === 'reveal' ? 'anim-mockup-in' : entryPhase === 'init' ? 'opacity-0' : 'anim-mockup-ready'}`}
            style={{ transition: 'opacity 0.4s' }}
          >
            <HeroAnimation scrollProgress={scrollProgress} entryPhase={entryPhase} />
          </div>

          {/* CTA */}
          <div
            className={`absolute bottom-[20vh] left-0 right-0 flex items-center justify-center gap-4 px-6 sm:px-16 lg:px-24 xl:px-32 pb-[max(2.5rem,env(safe-area-inset-bottom,20px))] pointer-events-auto ${!ctaAnimDone && ctaEntered ? 'anim-cta-enter' : ''}`}
            style={{
              opacity: showCTA ? 1 - fadeP : 0,
              transform: showCTA ? `translateY(${fadeP * 60}px)` : undefined,
            }}
          >
            <a
              href="/app"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[var(--color-accent)] rounded-[3px] hover:bg-accent-hover transition-colors shadow-lg shadow-[var(--color-accent)]/50"
            >
              Try It Free
              <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
                <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,144H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
              </svg>
            </a>
            <a
              href="#donate"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[var(--color-text-dim)] border border-[var(--color-border)] rounded-[3px] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
            >
              Support ViewPort ♥
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
