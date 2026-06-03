import { useEffect, useRef, useState } from 'react';
import HeroAnimation from './HeroAnimation.tsx';
import ScrambleText from './ScrambleText.tsx';

type EntryPhase = 'init' | 'blink' | 'reveal';

interface HeroOverlayProps {
  scrollProgress?: number;
  entryPhase: 'init' | 'blink' | 'reveal';
  dotActive?: boolean;
  overlayOpacity?: number;
}

function HeroOverlay({ scrollProgress = 0, entryPhase, dotActive = false, overlayOpacity = 1 }: HeroOverlayProps) {
  const FADE_START = 0.8;
  const FADE_RANGE = 0.35;
  const topP = scrollProgress < FADE_START
    ? 0
    : Math.min(1, (scrollProgress - FADE_START) / FADE_RANGE);
  const topY = -topP * 60;
  const topOpacity = 1 - topP;

  const isRevealed = entryPhase === 'reveal';

  return (
        <div className="max-w-2xl"
          style={{
            transform: isRevealed ? `translateY(${topY}px)` : undefined,
            opacity: isRevealed ? topOpacity : 0,
          }}
        >
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold italic text-[var(--color-accent)] leading-[1.1] tracking-tight">
        <span className={isRevealed ? 'anim-word' : ''} style={{ animationDelay: '0ms' }}>All-in-one</span>{' '}
        <br />
        <span className={isRevealed ? 'anim-word' : ''} style={{ animationDelay: '800ms' }}>web</span>{' '}
        <span className={isRevealed ? 'anim-word' : ''} style={{ animationDelay: '360ms' }}>
          toolkit<span id="title-dot" className={`inline-block w-[0.15em] h-[0.15em] ml-1 mt-[1.7px] transition-colors duration-500 ${            dotActive ? 'bg-[var(--color-accent)]' : 'bg-accent'}`} />
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
  const [gridPhase, setGridPhase] = useState<'none' | 'horiz' | 'vert' | 'full'>('none');
  const [gridXOrigin] = useState(() => (Math.random() > 0.5 ? 'right center' : 'left center'));
  const [gridYOrigin] = useState(() => (Math.random() > 0.5 ? 'top center' : 'bottom center'));
  const [titleAnimDone, setTitleAnimDone] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [showMockup, setShowMockup] = useState(false);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    lockedHeightRef.current = window.innerHeight;

    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const viewH = lockedHeightRef.current;
      const scrollable = height - viewH;
      const scrolled = -top;
      const p = Math.max(0, Math.min(1, scrolled / scrollable));
      setScrollProgress(p);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Sequence: Blink -> Transition -> Grid -> Navbar -> Title -> CTA -> Mockup
    
    // 1. Blink (using entryPhase for HeroAnimation)
    const t_blink_start = setTimeout(() => setEntryPhase('blink'), 200);

    // 2. Transition (background color change)
    const t_bg_start = setTimeout(() => setBgStarted(true), 1000);

    // 3. Grid animations
    const t_grid_horiz = setTimeout(() => setGridPhase('horiz'), 1200);
    const t_grid_vert = setTimeout(() => setGridPhase('vert'), 1500);
    const t_grid_full = setTimeout(() => setGridPhase('full'), 1800);

    // 4. Navbar appears
    const t_navbar = setTimeout(() => setShowNavbar(true), 2400);

    // 5. Title appears (and entryPhase becomes 'reveal')
    const t_title_entry = setTimeout(() => {
      setShowTitle(true);
      setEntryPhase('reveal');
    }, 3000);
    const t_title_done = setTimeout(() => setTitleAnimDone(true), 4360); // Based on existing anim-word delays

    // 6. CTA appears
    const t_cta_entry = setTimeout(() => {
      setShowCTA(true);
      setCtaEntered(true);
    }, 3600);
    const t_cta_done = setTimeout(() => setCtaAnimDone(true), 6600); // Based on existing anim-cta-enter duration

    // 7. Mockup appears
    const t_mockup_entry = setTimeout(() => setShowMockup(true), 4200);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(t_blink_start);
      clearTimeout(t_bg_start);
      clearTimeout(t_grid_horiz);
      clearTimeout(t_grid_vert);
      clearTimeout(t_grid_full);
      clearTimeout(t_navbar);
      clearTimeout(t_title_entry);
      clearTimeout(t_title_done);
      clearTimeout(t_cta_entry);
      clearTimeout(t_cta_done);
      clearTimeout(t_mockup_entry);
    };
  }, []);

  // Using `entryPhase` for HeroAnimation directly and `isRevealed` for HeroOverlay
  // and new state variables for other elements.
  const FADE_START = 0.8;
  const FADE_RANGE = 0.35;
  const ctaP = scrollProgress < FADE_START
    ? 0
    : Math.min(1, (scrollProgress - FADE_START) / FADE_RANGE);
  const ctaOpacity = 1 - ctaP;
  const ctaY = ctaP * 60;

  const navP = scrollProgress < FADE_START
    ? 0
    : Math.min(1, (scrollProgress - FADE_START) / FADE_RANGE);
  const navY = entryPhase === 'reveal' ? -navP * 60 : -200;
  
  const displayNavOpacity = showNavbar ? 1 - navP : 0;
  const displayNavY = showNavbar ? -navP * 60 : -200;

  const heroOverlayOpacity = Math.max(0, 1 - (scrollProgress - 0.8) / 0.2);
  const innerBgColor = bgStarted ? '#EBEBDF' : '#252422';
  const getGridPattern = () => {
    if (!bgStarted) return 'none';
    
    const horizMinor = 'repeating-linear-gradient(rgba(37, 36, 34, 0.05) 0px, rgba(37, 36, 34, 0.05) 1px, transparent 1px, transparent 40px)';
    const vertMinor = 'repeating-linear-gradient(90deg, rgba(37, 36, 34, 0.05) 0px, rgba(37, 36, 34, 0.05) 1px, transparent 1px, transparent 40px)';
    const horizMajor = 'repeating-linear-gradient(rgba(37, 36, 34, 0.1) 0px, rgba(37, 36, 34, 0.1) 2px, transparent 2px, transparent 200px)';
    const vertMajor = 'repeating-linear-gradient(90deg, rgba(37, 36, 34, 0.1) 0px, rgba(37, 36, 34, 0.1) 2px, transparent 2px, transparent 200px)';

    if (gridPhase === 'horiz') return `${horizMinor}, ${horizMajor}`;
    if (gridPhase === 'vert' || gridPhase === 'full') return `${horizMinor}, ${vertMinor}, ${horizMajor}, ${vertMajor}`;
    
    return 'none';
  };
  const gridPattern = getGridPattern();
  const innerBgTransition = bgStarted
    ? 'background-color 0.8s ease'
    : 'none';

  // Generate labels for the cutting mat
  const numLabelsX = 40; 
  const numLabelsY = 12; 

  return (
    <div ref={sectionRef} className="relative" style={{ height: '400svh', backgroundColor: '#252422', transition: innerBgTransition }}>
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
          backgroundImage: gridPattern,
          backgroundPosition: '0px 0px, 0px 0px, 0px 0px, 0px 0px',
          transition: innerBgTransition,
          opacity: heroOverlayOpacity,
          pointerEvents: heroOverlayOpacity > 0 ? 'auto' : 'none',
        }}
      >
        {gridPhase === 'full' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 anim-nav" style={{ transition: 'opacity 0.8s ease' }}>
            {Array.from({ length: numLabelsX }).map((_, i) => (
              i > 0 && (
                <div 
                  key={`x-${i}`}
                  className="absolute text-[10px] font-mono"
                  style={{ 
                    left: `${i * 200 + 40}px`, 
                    top: '40px',
                    color: 'rgba(37, 36, 34, 0.25)'
                  }}
                >
                  {i * 50}
                </div>
              )
            ))}
            {Array.from({ length: numLabelsY }).map((_, i) => (
              i > 0 && (
                <div 
                  key={`y-${i}`}
                  className="absolute text-[10px] font-mono"
                  style={{ 
                    top: `${i * 200 + 40}px`, 
                    left: '40px',
                    color: 'rgba(37, 36, 34, 0.25)'
                  }}
                >
                  {i * 50}
                </div>
              )
            ))}
          </div>
        )}
          {showNavbar && (
            <div className="absolute top-0 left-0 right-0 pointer-events-auto" style={{ transform: `translateY(${displayNavY}px)`, opacity: displayNavOpacity, zIndex: 50, transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
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

          {showTitle && (
            <div className="absolute top-[20vh] left-0 right-0 pointer-events-none z-10 px-6 sm:px-16 lg:px-24 xl:px-32">
                <HeroOverlay scrollProgress={scrollProgress} entryPhase={entryPhase} dotActive={titleAnimDone} overlayOpacity={heroOverlayOpacity} />
            </div>
          )}

            <div className={`absolute top-[40vh] left-0 right-0 flex justify-center ${entryPhase === 'reveal' ? 'anim-mockup-in' : entryPhase === 'init' ? 'opacity-0' : 'anim-mockup-ready'}`} style={{ transition: 'opacity 0.4s' }}>
              <HeroAnimation scrollProgress={scrollProgress} entryPhase={entryPhase} />
          </div>

          <div
            className={`absolute bottom-[20vh] left-0 right-0 flex items-center justify-center gap-4 px-6 sm:px-16 lg:px-24 xl:px-32 pb-[max(2.5rem,env(safe-area-inset-bottom,20px))] pointer-events-auto ${!ctaAnimDone && ctaEntered ? 'anim-cta-enter' : ''}`}
            style={{
              opacity: showCTA ? ctaOpacity : 0,
              transform: showCTA ? `translateY(${ctaY}px)` : undefined,
            }} >
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
  );
}
