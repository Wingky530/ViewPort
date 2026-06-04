import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CaretLeft } from 'phosphor-react';

const SECTION_IDS = ['hero', 'features', 'how-it-works', 'donate'];
const PAD_SEC = 6;
const PAD_TICK = 10;
const TICK_PCT = 0.005;

interface Props {
  visible: boolean;
}

export function ScrollIndicator({ visible }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tickContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const sectionLineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trackHeightRef = useRef(0);
  const maxScrollRef = useRef(0);
  const contentHeightRef = useRef(0);
  const rafId = useRef(0);
  const lastTapRef = useRef(0);
  const ghostRef = useRef<HTMLDivElement>(null);
  const ghostRatioRef = useRef<number | null>(null);
  const sectionScrollRef = useRef<number[]>([]);

  const [manuallyHidden, setManuallyHidden] = useState(false);

  useEffect(() => {
    if (!visible) setManuallyHidden(false);
  }, [visible]);

  useEffect(() => {
    const recalcDimensions = () => {
      if (!trackRef.current) return;
      trackHeightRef.current = trackRef.current.getBoundingClientRect().height;
      contentHeightRef.current = trackHeightRef.current - PAD_SEC * 2;
      maxScrollRef.current = document.body.scrollHeight - window.innerHeight;
    };

    const getIndicatorRatio = (scrollY: number): number => {
      const S = sectionScrollRef.current;
      const N = S.length;
      if (N < 2 || maxScrollRef.current <= 0) return 0;
      const maxS = maxScrollRef.current;
      if (scrollY <= S[0]) return 0;
      if (scrollY >= maxS) return 1;
      for (let i = 0; i < N - 1; i++) {
        if (scrollY >= S[i] && scrollY < S[i + 1]) {
          return (i + (scrollY - S[i]) / (S[i + 1] - S[i])) / (N - 1);
        }
      }
      return 1;
    };

    const updateIndicator = () => {
      if (isDraggingRef.current || !indicatorRef.current) return;
      const ratio = getIndicatorRatio(window.scrollY);
      indicatorRef.current.style.transform = `translateY(${ratio * contentHeightRef.current + PAD_SEC}px)`;
      if (ghostRatioRef.current !== null && Math.abs(ratio - ghostRatioRef.current) < 0.005) {
        ghostRatioRef.current = null;
        if (ghostRef.current) ghostRef.current.style.opacity = '0';
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updateIndicator);
    };

    recalcDimensions();
    window.addEventListener('resize', recalcDimensions);
    window.visualViewport?.addEventListener('resize', recalcDimensions);
    window.addEventListener('scroll', onScroll, { passive: true });
    updateIndicator();
    return () => {
      window.removeEventListener('resize', recalcDimensions);
      window.visualViewport?.removeEventListener('resize', recalcDimensions);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  useLayoutEffect(() => {
    const measureSections = () => {
      const track = trackRef.current;
      const tickContainer = tickContainerRef.current;
      if (!track || !tickContainer) return;
      const trackH = track.getBoundingClientRect().height;
      if (trackH <= PAD_SEC * 2) return;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const sectionCount = SECTION_IDS.length;
      const secGap = (trackH - PAD_SEC * 2) / (sectionCount - 1);
      const sectionPxs: number[] = [];
      for (let i = 0; i < sectionCount; i++) {
        sectionPxs.push(PAD_SEC + i * secGap);
      }

      sectionScrollRef.current = SECTION_IDS.map(id => {
        const el = document.getElementById(id) || document.querySelector(`[data-section="${id}"]`);
        return el ? (el as HTMLElement).offsetTop : 0;
      });

      sectionLineRefs.current.forEach((ref, i) => {
        if (!ref) return;
        ref.style.top = `${sectionPxs[i]}px`;
      });

      tickContainer.innerHTML = '';
      const tickStart = PAD_TICK;
      const tickEnd = trackH - PAD_TICK;
      const tickStep = (tickEnd - tickStart) * TICK_PCT;
      for (let px = tickStart; px <= tickEnd; px += tickStep) {
        const tooClose = sectionPxs.some(sp => Math.abs(px - sp) < 3);
        if (tooClose) continue;
        const el = document.createElement('div');
        el.style.cssText = 'position:absolute;top:' + px + 'px;left:50%;transform:translate(-50%,-50%);width:10px;height:1px;background-color:rgba(235,235,223,0.2);border-radius:1px;pointer-events:none;';
        tickContainer.appendChild(el);
      }
    };

    measureSections();

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver(() => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer as unknown as number);
      resizeTimer = setTimeout(measureSections, 150);
    });
    ro.observe(document.body);

    return () => {
      ro.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setManuallyHidden(true);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  const showScrollbar = () => setManuallyHidden(false);

  const scrollbarVisible = visible && !manuallyHidden;

  const getScrollFromRatio = (ratio: number): number => {
    const S = sectionScrollRef.current;
    const N = S.length;
    if (N < 2 || maxScrollRef.current <= 0) return 0;
    const maxS = maxScrollRef.current;
    const clamped = Math.max(0, Math.min(1, ratio));
    if (clamped === 0) return 0;
    if (clamped >= 1) return maxS;
    const lastSegStart = (N - 2) / (N - 1);
    if (clamped >= lastSegStart) {
      const t = (clamped - lastSegStart) / (1 - lastSegStart);
      return S[N - 2] + t * (maxS - S[N - 2]);
    }
    const posInSeg = clamped * (N - 1);
    const segIdx = Math.floor(posInSeg);
    const t = posInSeg - segIdx;
    return S[segIdx] + t * (S[segIdx + 1] - S[segIdx]);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const indicator = indicatorRef.current;
    if (!indicator) return;
    indicator.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    indicator.style.transition = 'none';
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const track = trackRef.current;
    const indicator = indicatorRef.current;
    if (!track || !indicator) return;
    const trackTop = track.getBoundingClientRect().top;
    const ratio = Math.max(0, Math.min(1, (e.clientY - trackTop - PAD_SEC) / contentHeightRef.current));
    indicator.style.transform = `translateY(${ratio * contentHeightRef.current + PAD_SEC}px)`;
    window.scrollTo({ top: getScrollFromRatio(ratio), behavior: 'instant' });
  };

  const onPointerUp = () => {
    isDraggingRef.current = false;
    if (indicatorRef.current) indicatorRef.current.style.transition = '';
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (isDraggingRef.current) return;
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = Math.max(0, Math.min(1, (e.clientY - rect.top - PAD_SEC) / contentHeightRef.current));
    ghostRatioRef.current = ratio;
    if (ghostRef.current && contentHeightRef.current > 0) {
      ghostRef.current.style.transform = `translateY(${ratio * contentHeightRef.current + PAD_SEC}px)`;
      ghostRef.current.style.opacity = '1';
    }
    window.scrollTo({ top: getScrollFromRatio(ratio), behavior: 'smooth' });
  };

  const handleSectionClick = (i: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDraggingRef.current) return;
    const target = sectionScrollRef.current[i] ?? 0;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  return (
    <>
      <div
        onClick={handleDoubleTap}
        style={{
          position: 'fixed',
          right: 12,
          top: 24,
          height: 'calc(100vh - 48px)',
          width: 15,
          zIndex: 50,
          opacity: scrollbarVisible ? 1 : 0,
          transform: scrollbarVisible ? 'translateX(0)' : 'translateX(40px)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: scrollbarVisible ? 'auto' : 'none',
        }}
      >
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: '#2E2D2C',
            borderRadius: 1,
          }}
        >
          {SECTION_IDS.map((id, i) => (
            <div
              key={`s-${i}`}
              ref={el => { sectionLineRefs.current[i] = el; }}
              data-section={id}
              onClick={handleSectionClick(i)}
              style={{
                position: 'absolute',
                top: PAD_SEC,
                left: '50%',
                width: 10,
                marginLeft: -5,
                height: 2,
                backgroundColor: 'rgba(235,235,223,0.7)',
                borderRadius: 1,
                boxShadow: '0 0 4px rgba(235,237,223,0.4)',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
              }}
            />
          ))}

          <div ref={tickContainerRef} />

          <div
            ref={ghostRef}
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: 13,
              marginLeft: -6.5,
              height: 5,
              backgroundColor: 'rgba(235,29,98,0.3)',
              borderRadius: 1,
              transform: 'translateY(0px)',
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity 0.2s ease',
            }}
          />

          <div
            ref={indicatorRef}
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: 13,
              marginLeft: -6.5,
              height: 5,
              backgroundColor: '#EB1D62',
              borderRadius: 1,
              boxShadow: '0 0 6px rgba(235,29,98,0.6)',
              transform: 'translateY(0px)',
              willChange: 'transform',
              cursor: 'grab',
              touchAction: 'none',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
        </div>
      </div>

      <div
        onClick={showScrollbar}
        style={{
          position: 'fixed',
          right: 12,
          top: 'calc(50vh - 14px)',
          transform: visible && manuallyHidden ? 'translateX(0)' : 'translateX(40px)',
          width: 28,
          height: 28,
          backgroundColor: '#2E2D2C',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 50,
          opacity: visible && manuallyHidden ? 1 : 0,
          pointerEvents: visible && manuallyHidden ? 'auto' : 'none',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <CaretLeft size={16} color="#EBEBDF" />
      </div>
    </>
  );
}
