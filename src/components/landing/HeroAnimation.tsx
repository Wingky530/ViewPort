import { useEffect, useMemo, useState } from 'react';

const W_MIN = 200;
const W_MAX = 520;
const HO_MAX = 100;

const SIDE_STYLE: Record<string, React.CSSProperties> = {
  top:    { top: 0, left: 0, right: 0, height: 2 },
  right:  { top: 0, right: 0, bottom: 0, width: 2 },
  bottom: { bottom: 0, left: 0, right: 0, height: 2 },
  left:   { top: 0, left: 0, bottom: 0, width: 2 },
};

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function HandOpen() {
  return (
    <svg width="22" height="22" viewBox="0 0 256 256" fill="#FFFFFF">
      <path d="M224,104v50.93c0,46.2-36.85,84.55-83,85.06A83.71,83.71,0,0,1,80.6,215.4C58.79,192.33,34.15,136,34.15,136a16,16,0,0,1,6.53-22.23c7.66-4,17.1-.84,21.4,6.62l21,36.44a6.09,6.09,0,0,0,6,3.09l.12,0A8.19,8.19,0,0,0,96,151.74V32a16,16,0,0,1,16.77-16c8.61.4,15.23,7.82,15.23,16.43V104a8,8,0,0,0,8.53,8,8.17,8.17,0,0,0,7.47-8.25V88a16,16,0,0,1,16.77-16c8.61.4,15.23,7.82,15.23,16.43V112a8,8,0,0,0,8.53,8,8.17,8.17,0,0,0,7.47-8.25v-7.28c0-8.61,6.62-16,15.23-16.43A16,16,0,0,1,224,104Z" />
    </svg>
  );
}

function HandGrabIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 256 256" fill="#FFFFFF">
      <path d="M216,104v48a88,88,0,0,1-176,0V136a16,16,0,0,1,32,0v8a8,8,0,0,0,16,0V88a16,16,0,0,1,32,0v16a8,8,0,0,0,16,0V88a16,16,0,0,1,32,0v16a8,8,0,0,0,16,0,16,16,0,0,1,32,0Z" />
    </svg>
  );
}

interface Props {
  scrollProgress: number;
  entryPhase: 'init' | 'blink' | 'reveal';
  contentRevealed: boolean;
}

export default function HeroAnimation({ scrollProgress, entryPhase, contentRevealed }: Props) {
  const [typedText, setTypedText] = useState('');
  const [activeGlowSides, setActiveGlowSides] = useState<Set<string>>(new Set());
  const [flickerSides, setFlickerSides] = useState<Set<string>>(new Set());
  const [bodyVisible, setBodyVisible] = useState(false);
  const [initReady, setInitReady] = useState(false);

  const glowSequence = useMemo(() => {
    const sides = ['top', 'right', 'bottom', 'left'];
    for (let i = sides.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sides[i], sides[j]] = [sides[j], sides[i]];
    }
    return sides;
  }, []);

  const flickerKeyframes = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const steps: string[] = [];
      for (let p = 5; p <= 95; p += 9) {
        const o = Math.random() > 0.4 ? 0.15 + Math.random() * 0.8 : 0.04;
        steps.push(`${p}% { opacity: ${o.toFixed(2)}; }`);
      }
      return `@keyframes flicker-${i} { 0% { opacity: 1; } ${steps.join(' ')} 100% { opacity: 1; } }`;
    });
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    setActiveGlowSides(new Set([glowSequence[0]]));
    setFlickerSides(new Set([glowSequence[0]]));

    [0, 1, 2].forEach(i => {
      const startMs = i * 350;
      const endMs = startMs + 350;
      timers.push(setTimeout(() => {
        setActiveGlowSides(prev => new Set(prev).add(glowSequence[i + 1]));
        setFlickerSides(prev => new Set(prev).add(glowSequence[i + 1]));
      }, startMs + 350));
      timers.push(setTimeout(() => {
        setFlickerSides(prev => {
          const next = new Set(prev);
          next.delete(glowSequence[i]);
          return next;
        });
      }, endMs));
    });

    timers.push(setTimeout(() => {
      setFlickerSides(prev => {
        const next = new Set(prev);
        next.delete(glowSequence[3]);
        return next;
      });
    }, 1400));

    timers.push(setTimeout(() => setBodyVisible(true), 1000));
    timers.push(setTimeout(() => setInitReady(true), 1200));

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (entryPhase === 'blink' && initReady) {
      const word = 'viewport';
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setTypedText(word.slice(0, i));
        if (i >= word.length) {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [entryPhase, initReady]);

  function phaseP(p: number, start: number, end: number): number {
    return Math.max(0, Math.min(1, (p - start) / (end - start)));
  }

  const p = scrollProgress;

  let width = W_MIN;
  let handOffset = HO_MAX;
  let handClosed = false;
  let handOpacity = 1;
  let zoomScale = 0.97;
  let zoomRadius = 3;

  if (p < 0.08) {
    width = W_MIN;
    handOffset = HO_MAX;
    handOpacity = 0;
  } else if (p < 0.18) {
    const pp = phaseP(p, 0.08, 0.18);
    handOffset = HO_MAX * (1 - easeInOutCubic(pp));
    handOpacity = easeInOutCubic(pp);
    width = W_MIN;
  } else if (p < 0.25) {
    const pp = phaseP(p, 0.18, 0.25);
    handOffset = 0;
    handClosed = pp >= 0.5;
    width = W_MIN;
  } else if (p < 0.50) {
    const pp = phaseP(p, 0.25, 0.50);
    handOffset = 0;
    handClosed = true;
    width = W_MIN + (W_MAX - W_MIN) * easeInOutCubic(pp);
  } else if (p < 0.55) {
    const pp = phaseP(p, 0.50, 0.55);
    handOffset = 0;
    handClosed = pp < 0.5;
    width = W_MAX;
  } else if (p < 0.60) {
    const pp = phaseP(p, 0.55, 0.60);
    handOffset = HO_MAX * easeInOutCubic(pp);
    width = W_MAX;
  } else {
    const pp = phaseP(p, 0.60, 1.10);
    width = W_MAX;
    handOpacity = Math.max(0, 1 - pp * 3);
    handOffset = HO_MAX;

    const viewW = typeof window !== 'undefined'
      ? window.innerWidth - 48
      : W_MAX;
    const isMobile = viewW < W_MAX;
    const targetScale = isMobile ? 1.15 : viewW / W_MAX;
    zoomScale = 1 + (targetScale - 1) * easeInOutCubic(pp);
    zoomRadius = Math.max(0, 3 * (1 - pp));
  }

  const isNarrow = width < 260;
  const showHand = entryPhase === 'reveal';
  const urlText = initReady && entryPhase !== 'init' ? typedText : '';

  const BORDER_RADIUS = `${zoomRadius}px`;

  return (
    <div className="w-full relative overflow-visible" style={{ height: 180 }}>
      <style>{flickerKeyframes.join('\n')}</style>

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: `${width}px`,
          maxWidth: `min(${W_MAX}px, calc(100vw - 48px))`,
          transform: `scale(${zoomScale})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          className="bg-[#252422] rounded-[3px] overflow-hidden shadow-lg"
          style={{
            borderRadius: BORDER_RADIUS,
            opacity: bodyVisible ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <div className={`h-9 bg-[#252422] border-b border-white/10 flex items-center px-4 gap-2 ${!isNarrow ? '' : 'justify-center'}`}>
            {!isNarrow && (
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
            )}
            <div className="h-5 bg-white/8 rounded flex items-center px-2" style={{ width: isNarrow ? '100%' : 'flex-1' }}>
              <span className="text-[10px] text-white/40 font-mono truncate w-full text-center">
                {urlText}{entryPhase === 'blink' && initReady && typedText.length < 'viewport'.length ? (
                  <span className="animate-pulse">|</span>
                ) : ''}
              </span>
            </div>
          </div>

          <div className={`p-3 ${contentRevealed ? 'anim-content' : 'opacity-0'}`} style={{ minHeight: isNarrow ? 100 : 120 }}>
            <div className="flex gap-4 mb-6">
              <div className="h-3 w-16 rounded bg-white/8" />
              <div className="h-3 w-14 rounded bg-white/8" />
              <div className="h-3 w-12 rounded bg-white/8" />
            </div>

            <div className="flex gap-4" style={{ flexDirection: width < 260 ? 'column' : 'row' }}>
              {width >= 260 && (
                <div className="space-y-3 w-1/4 min-w-[60px]">
                  <div className="h-24 rounded-lg bg-white/8" />
                  <div className="h-3 w-3/4 rounded bg-white/8" />
                  <div className="h-3 w-1/2 rounded bg-white/8" />
                </div>
              )}
              <div className="flex-1 space-y-4">
                <div className="h-5 w-3/5 rounded bg-white/8" />
                <div className="h-3 w-full rounded bg-white/8" />
                <div className="h-3 w-11/12 rounded bg-white/8" />
                <div className="h-3 w-4/5 rounded bg-white/8" />
                <div className={`grid gap-3 mt-6 ${isNarrow ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  <div className="h-20 rounded-lg bg-white/8" />
                  <div className="h-20 rounded-lg bg-white/8" />
                  {!isNarrow && (
                    <div className="h-20 rounded-lg bg-white/8" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {glowSequence.map((side, idx) => {
          const sideRadius = {
            top:    `${BORDER_RADIUS} ${BORDER_RADIUS} 0 0`,
            right:  `0 ${BORDER_RADIUS} ${BORDER_RADIUS} 0`,
            bottom: `0 0 ${BORDER_RADIUS} ${BORDER_RADIUS}`,
            left:   `${BORDER_RADIUS} 0 0 ${BORDER_RADIUS}`,
          }[side];
          return (
            <div
              key={side}
              style={{
                position: 'absolute',
                ...SIDE_STYLE[side],
                background: '#EB1D62',
                opacity: activeGlowSides.has(side) && !flickerSides.has(side) ? 1 : 0,
                transition: 'opacity 0.12s ease',
                pointerEvents: 'none',
                borderRadius: sideRadius,
                animation: flickerSides.has(side) ? `flicker-${idx} 0.35s step-end 1 forwards` : undefined,
                filter: activeGlowSides.has(side) ? 'drop-shadow(0 0 3px rgba(235,29,98,0.3))' : 'none',
                zIndex: 1,
              }}
            />
          );
        })}
      </div>

      <div
        className="absolute top-[40%] z-30 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
        style={{
          opacity: showHand ? handOpacity : 0,
          left: `calc(50% + ${width / 2}px + ${handOffset}px)`,
          transform: 'translateY(-50%)',
          marginLeft: handOffset === 0 ? '-11px' : '0',
          transition: 'none',
        }}
      >
        {handClosed ? <HandGrabIcon /> : <HandOpen />}
      </div>
    </div>
  );
}
