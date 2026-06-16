import { useEffect, useRef, useState } from 'react';
import HeroAnimation from './HeroAnimation.tsx';
import ScrambleText from './ScrambleText.tsx';
import { ScrollIndicator } from './ScrollIndicator.tsx';
import LandingNavModal from '../ui/LandingNavModal.tsx';

type EntryPhase = 'init' | 'blink' | 'reveal';

interface HeroOverlayProps {
  slideOutP: number;
  entryPhase: EntryPhase;
  dotActive?: boolean;
}

function HeroOverlay({ slideOutP, entryPhase, dotActive = false }: HeroOverlayProps) {
  const isRevealed = entryPhase === 'reveal';
  const dotActiveClass = dotActive ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-bg)]';

  return (
    <div
      className="max-w-2xl"
      style={{
        transform: isRevealed ? `translateY(${-slideOutP * 250}px)` : undefined,
        opacity: isRevealed ? 1 - slideOutP : 0,
      }}
    >
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold italic text-[#252422] leading-[1.1] tracking-tight">
        <span className={isRevealed ? 'anim-word' : ''} style={{ animationDelay: '0ms' }}>All-in-one</span>{' '}
        <br />
        <span className={isRevealed ? 'anim-word' : ''} style={{ animationDelay: '150ms' }}>web</span>{' '}
        <span className={isRevealed ? 'anim-word' : ''} style={{ animationDelay: '300ms' }}>
          toolkit<span id="title-dot" className={'inline-block w-[0.20em] h-[0.20em] ml-0.75 mt-[1.7px] transition-colors duration-500 ' + dotActiveClass} />
        </span>
      </h1>
      <p className={`mt-2.5 text-sm sm:text-base font-semibold italic text-[#686864] leading-relaxed ${isRevealed ? 'anim-desc' : ''}`}>
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

  const [showHorizGrid, setShowHorizGrid] = useState(false);
  const [showVertGrid, setShowVertGrid] = useState(false);
  const [showGridLabels, setShowGridLabels] = useState(false);
  const [gridDir] = useState<{ x: 'left' | 'right'; y: 'top' | 'bottom' }>(() => ({
    x: Math.random() > 0.5 ? 'left' : 'right',
    y: Math.random() > 0.5 ? 'top' : 'bottom',
  }));

  const [showNavbar, setShowNavbar] = useState(false);
  const [navEntryDone, setNavEntryDone] = useState(false);

  const [titleAnimDone, setTitleAnimDone] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [contentRevealed, setContentRevealed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
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

    const t_blink        = setTimeout(() => setEntryPhase('blink'), 100);
    const t_bg           = setTimeout(() => setBgStarted(true), 600);
    const t_horiz        = setTimeout(() => setShowHorizGrid(true), 900);
    const t_vert         = setTimeout(() => setShowVertGrid(true), 1200);
    const t_labels       = setTimeout(() => setShowGridLabels(true), 900);
    const t_navbar       = setTimeout(() => setShowNavbar(true), 1600);
    const t_navbar_done  = setTimeout(() => setNavEntryDone(true), 2500);
    const t_title        = setTimeout(() => { setShowTitle(true); setEntryPhase('reveal'); }, 2100);
    const t_title_done   = setTimeout(() => setTitleAnimDone(true), 3000);
    const t_cta          = setTimeout(() => { setShowCTA(true); setCtaEntered(true); }, 2600);
    const t_content      = setTimeout(() => setContentRevealed(true), 2600);
    const t_cta_done     = setTimeout(() => setCtaAnimDone(true), 3600);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      [t_blink, t_bg, t_horiz, t_vert, t_labels,
       t_navbar, t_navbar_done, t_title, t_title_done, t_content, t_cta, t_cta_done].forEach(clearTimeout);
    };
  }, []);

  const SLIDE_OUT_START = 0.02;
  const SLIDE_OUT_END = 0.18;
  const slideOutP = Math.max(0, Math.min(1, (scrollProgress - SLIDE_OUT_START) / (SLIDE_OUT_END - SLIDE_OUT_START)));
  
  const heroOverlayOpacity = Math.max(0, 1 - (scrollProgress - 0.8) / 0.2);

  const scrollbarVisible = scrollProgress > 0.215;
  const isEndPhase = scrollProgress > 0.75;
  const innerBgColor = (!bgStarted || isEndPhase) ? '#252422' : '#EBEBDF';
  const innerBgTransition = bgStarted ? 'background-color 0.8s ease' : 'none';

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

  const navScrollStyle = navEntryDone
    ? {
        transform: `translateY(${-slideOutP * 150}px)`,
        opacity: 1 - slideOutP,
      }
    : {};

  const numLabelsX = 12;
  const numLabelsY = 6;

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
        id="hero"
        data-section
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
            pointerEvents: slideOutP >= 1 ? 'none' : 'auto',
          }}
        >
          {showHorizGrid && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: horizBg,
                animation: `${horizAnimName} ${gridAnimCurve}`,
              }}
            />
          )}

          {showVertGrid && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: vertBg,
                animation: `${vertAnimName} ${gridAnimCurve}`,
              }}
            />
          )}

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

          {showNavbar && (
            <div
              className="absolute top-0 left-0 right-0 pointer-events-auto"
              style={{
                zIndex: 30,
                animation: !navEntryDone ? `navSlideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) both` : undefined,
                ...navScrollStyle,
              }}
            >
              <nav
                className="w-full bg-transparent border-b border-transparent"
                style={{ paddingTop: '10svh' }}
              >
                <div className="flex items-center justify-between px-6 sm:px-16 lg:px-24 xl:px-32 py-3">
                  <div className="flex items-center gap-8">
                    <a href="/" className="flex items-center">
                      <img src="/img/logo.png" alt="ViewPort logo" className="h-8" />
                    </a>
                    <div className="hidden sm:flex items-center gap-6">
                      <span className="text-sm text-[#252422] font-medium">Home</span>
                      <a href="/app" className="text-sm text-[#686864] hover:text-[#252422] transition-colors">App</a>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(o => !o)}
                    className="sm:hidden relative p-2 text-[#252422] transition-colors z-50"
                    aria-label="Menu"
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" strokeWidth="2" strokeLinecap="round" style={{ overflow: 'visible' }}>
                      <line x1="3" y1="7" x2="19" y2="7" stroke="#252422" style={{ transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)', transform: mobileMenuOpen ? 'translateY(4px) rotate(45deg)' : 'translateY(0) rotate(0)', transformOrigin: 'center' }} />
                      <line x1="3" y1="15" x2="19" y2="15" stroke="#EB1D62" style={{ transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)', transform: mobileMenuOpen ? 'translateY(-4px) rotate(-45deg)' : 'translateY(0) rotate(0)', transformOrigin: 'center' }} />
                    </svg>
                  </button>
                </div>
              </nav>
            </div>
          )}

          <LandingNavModal isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

          {showTitle && (
            <div className="absolute top-[20vh] left-0 right-0 pointer-events-none z-10 px-6 sm:px-16 lg:px-24 xl:px-32">
              <HeroOverlay slideOutP={slideOutP} entryPhase={entryPhase} dotActive={titleAnimDone} />
            </div>
          )}

          <div
            className={`absolute top-[40vh] left-0 right-0 flex justify-center ${entryPhase === 'reveal' ? 'anim-mockup-in' : entryPhase === 'init' ? 'opacity-0' : 'anim-mockup-ready'}`}
            style={{ transition: 'opacity 0.4s' }}
          >
            <HeroAnimation scrollProgress={scrollProgress} entryPhase={entryPhase} contentRevealed={contentRevealed} />
          </div>

          <div
            className={`absolute bottom-[20vh] left-0 right-0 flex items-end justify-between px-6 sm:px-16 lg:px-24 xl:px-32 pb-[max(2.5rem,env(safe-area-inset-bottom,20px))] pointer-events-auto ${!ctaAnimDone && ctaEntered ? 'anim-cta-enter' : ''}`}
            style={{
              opacity: showCTA ? 1 - slideOutP : 0,
              transform: showCTA ? `translateY(${slideOutP * 150}px)` : undefined,
            }}
          >
            <button
              onClick={() => {
                const target = document.getElementById('features');
                if (!target) return;
                const start = window.scrollY;
                const end = target.getBoundingClientRect().top + window.scrollY;
                const duration = 5000;
                const startTime = performance.now();
                const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                const step = (now: number) => {
                  const elapsed = now - startTime;
                  const progress = Math.min(elapsed / duration, 1);
                  window.scrollTo(0, start + (end - start) * ease(progress));
                  if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-text bg-bg rounded-[3px] hover:brightness-150 transition-all shadow-lg shadow-black/20"
            >
              Learn more
              <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
              </svg>
            </button>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-semibold tracking-wide text-[#686864] uppercase">Support us</span>
              <a
                href="#donate"
                className="inline-flex items-center justify-center w-[46px] h-[46px] rounded-[3px] bg-accent hover:brightness-110 transition-all shadow-lg shadow-accent/30"
                aria-label="Support us"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
                  <line x1="6" y1="2" x2="6" y2="5" />
                  <line x1="10" y1="2" x2="10" y2="5" />
                  <line x1="14" y1="2" x2="14" y2="5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <ScrollIndicator visible={scrollbarVisible} />
      </div>
    </>
  );
}
