import { useEffect, useMemo, useState } from 'react';

const W_MIN = 200;
const W_MAX = 520;
const HO_MAX = 100;
const MIN_CONTENT_H = 320;

const SIDE_STYLE: Record<string, React.CSSProperties> = {
  top:    { top: 0, left: 0, right: 0, height: 2 },
  right:  { top: 0, right: 0, bottom: 0, width: 2 },
  bottom: { bottom: 0, left: 0, right: 0, height: 2 },
  left:   { top: 0, left: 0, bottom: 0, width: 2 },
};

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function phaseP(p: number, start: number, end: number): number {
  return Math.max(0, Math.min(1, (p - start) / (end - start)));
}

function entry(t: number, s: number, e: number): number {
  if (t < s) return 0;
  if (t < e) return easeInOutCubic(phaseP(t, s, e));
  return 1;
}

function exit(t: number, s: number, e: number): number {
  if (t < s) return 1;
  if (t < e) return 1 - easeInOutCubic(phaseP(t, s, e));
  return 0;
}

function elementPhase(t: number, es: number, ee: number, xs: number, xe: number): number {
  return entry(t, es, ee) * exit(t, xs, xe);
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

  const p = scrollProgress;

  let width = W_MIN;
  let handOffset = HO_MAX;
  let handClosed = false;
  let handOpacity = 1;
  let zoomScale = 0.97;
  let zoomRadius = 3;

  const winW = typeof window !== 'undefined' ? window.innerWidth : W_MAX;
  const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
  const viewW = winW - 48;
  const isDesktop = winW >= 1024;

  let startW: number;
  let endW: number;
  let startH: number;
  let endH: number;

  if (isDesktop) {
    startW = W_MIN;
    endW = W_MAX;
    startH = MIN_CONTENT_H;
    endH = Math.max(endW * (winH / Math.max(1, winW)), MIN_CONTENT_H);
  } else {
    startW = Math.min(W_MAX, viewW);
    endW = W_MIN;
    startH = MIN_CONTENT_H;
    endH = MIN_CONTENT_H;
  }
  
  let currentH = startH;
  let translateY = 0;

  if (p < 0.08) {
    width = startW;
    currentH = startH;
    handOffset = HO_MAX;
    handOpacity = 0;
  } else if (p < 0.18) {
    const pp = phaseP(p, 0.08, 0.18);
    handOffset = HO_MAX * (1 - easeInOutCubic(pp));
    handOpacity = easeInOutCubic(pp);
    width = startW;
    currentH = startH;
  } else if (p < 0.25) {
    const pp = phaseP(p, 0.18, 0.25);
    handOffset = 0;
    handClosed = pp >= 0.5;
    width = startW;
    currentH = startH;
  } else if (p < 0.50) {
    const pp = phaseP(p, 0.25, 0.50);
    handOffset = 0;
    handClosed = true;
    const ease = easeOutBack(pp);
    width = startW + (endW - startW) * ease;
    currentH = startH + (endH - startH) * ease;
  } else if (p < 0.55) {
    const pp = phaseP(p, 0.50, 0.55);
    handOffset = 0;
    handClosed = pp < 0.5;
    width = endW;
    currentH = endH;
  } else if (p < 0.60) {
    const pp = phaseP(p, 0.55, 0.60);
    handOffset = HO_MAX * easeInOutCubic(pp);
    width = endW;
    currentH = endH;
  } else {
    width = endW;
    currentH = endH;
    handOffset = HO_MAX;
  }

  const actualBaseWidth = Math.min(endW, Math.max(1, viewW));

  if (p < 0.60) {
    zoomScale = 0.97;
  } else {
    const pp = phaseP(p, 0.60, 1.00);
    handOpacity = Math.max(0, 1 - pp * 3);
    
    const targetScale = winW / actualBaseWidth;
    
    const ease = easeInOutCubic(pp);
    zoomScale = 0.97 + (targetScale - 0.97) * ease;
    zoomRadius = Math.max(0, 3 * (1 - pp));
    
    const centeringH = isDesktop ? endH : MIN_CONTENT_H;
    const screenTop = 0.30 * winH;
    const currentCenterY = screenTop + centeringH / 2;
    const targetCenterY = winH / 2;
    const maxTranslateY = targetCenterY - currentCenterY;
    
    translateY = maxTranslateY * ease;
  }

  const isNarrow = false;
  const showHand = entryPhase === 'reveal';
  const urlText = initReady && entryPhase !== 'init' ? typedText : '';

  const headingExit = exit(p, 0.60, 0.68);
  const barExit    = exit(p, 0.60, 0.68);
  const gridExit   = exit(p, 0.63, 0.73);
  const sidebarExit= exit(p, 0.68, 0.78);
  const chromeExit = exit(p, 0.72, 0.80);
  const urlExit    = exit(p, 0.78, 0.88);
  const headingEntry = entry(p, 0.25, 0.33);
  const barEntry    = entry(p, 0.29, 0.39);
  const gridEntry   = entry(p, 0.34, 0.44);
  const sidebarEntry= entry(p, 0.38, 0.48);

  const BORDER_RADIUS = `${zoomRadius}px`;

  return (
    <div className="w-full relative overflow-visible" style={{ height: startH }}>
      <style>{flickerKeyframes.join('\n')}</style>

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: `${width}px`,
          maxWidth: `min(${W_MAX}px, calc(100vw - 48px))`,
          transform: `translateY(${translateY}px) scale(${zoomScale})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          className="bg-[#252422] rounded-[3px] overflow-hidden shadow-lg flex flex-col"
          style={{
            borderRadius: BORDER_RADIUS,
            opacity: bodyVisible ? 1 : 0,
            transition: 'opacity 0.3s ease',
            height: `${currentH}px`
          }}
        >
          <div className="h-9 bg-[#252422] border-b border-white/10 flex items-center px-4 gap-2">
            <div className="flex items-center gap-[3px]" style={{ opacity: chromeExit }}>
              <span className="w-2.5 h-[1.5px] rounded-full bg-white/15" />
              <span className="w-2.5 h-[1.5px] rounded-full bg-white/15" />
              <span className="w-2.5 h-[1.5px] rounded-full bg-white/15" />
            </div>
            <div className="flex-1 h-5 bg-white/8 rounded flex items-center px-2" style={{ opacity: chromeExit }}>
              <span className="text-[10px] text-white/40 font-mono truncate w-full text-center" style={{ opacity: urlText ? urlExit : 1 }}>
                {urlText}{entryPhase === 'blink' && initReady && typedText.length < 'viewport'.length ? (
                  <span className="animate-pulse">|</span>
                ) : ''}
              </span>
            </div>
          </div>

          <div className="p-3 flex-1 flex flex-col" style={{ opacity: contentRevealed ? 1 : 0, transition: 'opacity 0.4s ease', minHeight: 120 }}>
            <div className="flex gap-4 mb-6">
              <div className="h-3 w-16 rounded bg-white/8" style={{ opacity: barExit, transform: `translateY(${(1 - barEntry) * 6}px) scale(${1 - 0.05 * (1 - barExit)})`}} />
              <div className="h-3 w-14 rounded bg-white/8" style={{ opacity: barExit, transform: `translateY(${(1 - barEntry) * 6}px) scale(${1 - 0.05 * (1 - barExit)})`}} />
              <div className="h-3 w-12 rounded bg-white/8" style={{ opacity: barExit, transform: `translateY(${(1 - barEntry) * 6}px) scale(${1 - 0.05 * (1 - barExit)})`}} />
            </div>

            <div className="flex gap-4" style={{ flexDirection: 'row' }}>
              <div className="space-y-3 w-1/4 min-w-[60px]" style={{ opacity: sidebarExit, transform: `translateY(${(1 - sidebarEntry) * 8}px) scale(${1 - 0.05 * (1 - sidebarExit)})` }}>
                <div className="h-24 rounded-lg bg-white/8" />
                <div className="h-3 w-3/4 rounded bg-white/8" />
                <div className="h-3 w-1/2 rounded bg-white/8" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-5 w-3/5 rounded bg-white/8" style={{ opacity: headingExit, transform: `translateY(${(1 - headingEntry) * 6}px) scale(${1 - 0.05 * (1 - headingExit)})`}} />
                <div className="h-3 w-full rounded bg-white/8" style={{ opacity: barExit, transform: `translateY(${(1 - barEntry) * 6}px) scale(${1 - 0.05 * (1 - barExit)})`}} />
                <div className="h-3 w-11/12 rounded bg-white/8" style={{ opacity: barExit, transform: `translateY(${(1 - barEntry) * 6}px) scale(${1 - 0.05 * (1 - barExit)})`}} />
                <div className="h-3 w-4/5 rounded bg-white/8" style={{ opacity: barExit, transform: `translateY(${(1 - barEntry) * 6}px) scale(${1 - 0.05 * (1 - barExit)})`}} />
                <div className="grid gap-3 mt-6 grid-cols-3">
                  <div className="h-20 rounded-lg bg-white/8" style={{ opacity: gridExit, transform: `scale(${1 - 0.08 * (1 - gridEntry * gridExit)})`}} />
                  <div className="h-20 rounded-lg bg-white/8" style={{ opacity: gridExit, transform: `scale(${1 - 0.08 * (1 - gridEntry * gridExit)})`}} />
                  <div className="h-20 rounded-lg bg-white/8" style={{ opacity: gridExit, transform: `scale(${1 - 0.08 * (1 - gridEntry * gridExit)})`}} />
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
                background: 'var(--color-accent)',
                opacity: activeGlowSides.has(side) && !flickerSides.has(side) ? 1 : 0,
                transition: 'opacity 0.12s ease',
                pointerEvents: 'none',
                borderRadius: sideRadius,
                animation: flickerSides.has(side) ? `flicker-${idx} 0.35s step-end 1 forwards` : undefined,
                filter: activeGlowSides.has(side) ? 'drop-shadow(0 0 3px color-mix(in srgb, var(--color-accent) 30%, transparent))' : 'none',
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
