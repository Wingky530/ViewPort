import { useState, useEffect, useRef, useCallback } from 'react';
import { Warning, ArrowClockwise, GlobeHemisphereWest } from '@phosphor-icons/react';
import type { Device } from '../../content/devices';

interface PreviewFrameProps {
  url: string;
  device: Device;
  zoom: number;
  scrolling: boolean;
  isRotated: boolean;
  onRotate?: () => void;
  onResize?: (w: number, h: number) => void;
}

interface FrameStyle {
  bezelClass: string;
  topBar: 'notch' | 'thin-notch' | 'traffic-lights' | 'none';
  bottomBar: 'home-indicator' | 'stand' | 'tv-stands' | 'none';
  contentBorder: boolean;
  shadow: string;
}

const FRAME_STYLES: Record<string, FrameStyle> = {
  mobile: {
    bezelClass: 'bg-frame-bezel rounded-[2.5rem] p-3',
    topBar: 'notch',
    bottomBar: 'home-indicator',
    contentBorder: false,
    shadow: 'shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_32px_80px_rgba(0,0,0,0.8)]',
  },
  tablet: {
    bezelClass: 'bg-frame-bezel rounded-[1.5rem] p-2.5',
    topBar: 'thin-notch',
    bottomBar: 'home-indicator',
    contentBorder: false,
    shadow: 'shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_32px_80px_rgba(0,0,0,0.8)]',
  },
  desktop: {
    bezelClass: 'bg-surface rounded-t-lg',
    topBar: 'traffic-lights',
    bottomBar: 'stand',
    contentBorder: false,
    shadow: 'shadow-[0_12px_40px_rgba(0,0,0,0.35)]',
  },
  tv: {
    bezelClass: '',
    topBar: 'none',
    bottomBar: 'tv-stands',
    contentBorder: true,
    shadow: 'shadow-[0_12px_40px_rgba(0,0,0,0.5)]',
  },
  custom: {
    bezelClass: '',
    topBar: 'none',
    bottomBar: 'none',
    contentBorder: true,
    shadow: 'shadow-[0_12px_40px_rgba(0,0,0,0.35)]',
  },
};

const CATEGORY_MAP: Record<string, string> = {
  phone: 'mobile',
  tablet: 'tablet',
  desktop: 'desktop',
  tv: 'tv',
};

function resolveFrameCategory(category: string) {
  return CATEGORY_MAP[category] || 'custom';
}

function TopBar({ type, url }: { type: FrameStyle['topBar']; url: string }) {
  if (type === 'notch') {
    return (
      <div className="h-6 w-full rounded-t-[1.8rem] flex items-center justify-center">
        <div className="w-20 h-1.5 bg-frame-notch rounded-full" />
      </div>
    );
  }
  if (type === 'thin-notch') {
    return (
      <div className="h-5 w-full rounded-t-[1.1rem] flex items-center justify-center">
        <div className="w-16 h-1 bg-frame-notch rounded-full" />
      </div>
    );
  }
  if (type === 'traffic-lights') {
    return (
      <div className="h-9 rounded-t-lg flex items-center px-3 gap-2 bg-surface">
        <div className="w-2.5 h-2.5 rounded-full bg-danger/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-warning/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-success/70" />
        <div className="flex-1 h-5 bg-bg/50 rounded mx-2 flex items-center px-2">
          <span className="text-[10px] text-text-dim font-mono truncate">{url}</span>
        </div>
      </div>
    );
  }
  return null;
}

function BottomBar({ type }: { type: FrameStyle['bottomBar'] }) {
  if (type === 'home-indicator') {
    return (
      <div className="h-5 w-full rounded-b-[1.8rem] flex items-center justify-center bg-frame-bezel">
        <div className="w-24 h-1 bg-frame-notch rounded-full" />
      </div>
    );
  }
  if (type === 'stand') {
    return (
      <div className="flex justify-center">
        <div className="w-2/5 h-1.5 bg-surface rounded-b-sm" />
      </div>
    );
  }
  if (type === 'tv-stands') {
    return (
      <div className="flex justify-center gap-12 mt-1">
        <div className="w-1.5 h-2 bg-text-dim/30 rounded-b" />
        <div className="w-1.5 h-2 bg-text-dim/30 rounded-b" />
      </div>
    );
  }
  return null;
}

function IframeContent({ url, contentW, contentH, scrolling, isCustom, isDragging, transitionDuration, resolveIframeSrc }: {
  url: string; contentW: number; contentH: number; scrolling: boolean; isCustom?: boolean; isDragging?: boolean; transitionDuration?: string; resolveIframeSrc: (url: string) => string;
}) {
  const [loading, setLoading] = useState(!!url && url.trim() !== '');
  const [hasError, setHasError] = useState(false);
  const prevUrl = useRef(url);

  useEffect(() => {
    if (prevUrl.current !== url) {
      setLoading(true);
      setHasError(false);
      prevUrl.current = url;
    }
  }, [url]);

  const inner = !url || url.trim() === '' ? (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-text-dim select-none w-full h-full bg-surface/50">
      <GlobeHemisphereWest size={32} className="text-text-dim/40" />
      <span className="text-sm font-medium text-text-muted">No URL provided</span>
    </div>
  ) : hasError ? (
    <div className="flex flex-col items-center justify-center text-center p-6 w-full h-full bg-frame-error-bg">
      <Warning size={32} className="text-warning mb-3" />
      <p className="text-sm text-text-muted mb-1">Preview unavailable</p>
      <p className="text-xs text-text-dim mb-4">This page blocks embedding via X-Frame-Options</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 text-sm font-medium text-accent border border-accent/30 rounded-lg hover:bg-accent/10 transition-colors"
      >
        Open in new tab
      </a>
    </div>
    ) : (
      <div style={{ overflow: scrolling ? 'auto' : 'hidden' }} className="w-full h-full">
        {url && url.trim() !== '' ? (
          <iframe
            src={resolveIframeSrc(url)}
            className="w-full h-full bg-transparent"
            style={{ border: 'none' }}
            onLoad={() => setLoading(false)}
            onError={(e) => { setLoading(false); setHasError(true); console.warn('Iframe failed to load or was blocked:', e); }}
            title="Device preview"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-text-dim select-none w-full h-full bg-surface/50">
<GlobeHemisphereWest size={32} className="text-text-dim/40" />
            <span className="text-sm font-medium text-text-muted">No URL provided</span>
          </div>
        )}
      </div>
    );

  const content = (
    <div
      className="relative"
      style={{
        width: isCustom ? '100%' : contentW,
        height: isCustom ? '100%' : contentH,
        transition: isDragging ? 'none' : `width ${transitionDuration || '2s'} cubic-bezier(0.16, 1, 0.3, 1), height ${transitionDuration || '2s'} cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <div className="w-8 h-8 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {inner}
    </div>
  );

  return content;
}

const TOPBAR_HEIGHT: Record<string, number> = { notch: 24, 'thin-notch': 20, 'traffic-lights': 36 };
const BOTTOMBAR_HEIGHT: Record<string, number> = { 'home-indicator': 20, stand: 8, 'tv-stands': 14 };
const MAX_CONTENT_W = 1100;
const MAX_CONTENT_H = 850;

function ResizeHandles({ onResize, onResizeLive, onDragChange, frameRef, borderOffX, borderOffY }: {
  onResize: (w: number, h: number) => void;
  onResizeLive: (w: number, h: number) => void;
  onDragChange: (dragging: boolean) => void;
  frameRef: React.RefObject<HTMLDivElement | null>;
  borderOffX: number;
  borderOffY: number;
}) {
  const dragging = useRef<{
    startX: number; startY: number;
    startW: number; startH: number;
    scale: number; lockH: boolean; lockW: boolean; flipX: boolean; flipY: boolean;
    rafId: number | null; committed: boolean;
  } | null>(null);

  const getScale = useCallback(() => {
    const el = frameRef.current;
    if (!el) return 1;
    return el.offsetWidth / el.getBoundingClientRect().width;
  }, [frameRef]);

  const makeHandler = useCallback((lockW: boolean, lockH: boolean, flipX = false, flipY = false) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = frameRef.current;
    if (!el) return;
    el.style.willChange = 'width, height';
    const startW = el.offsetWidth;
    const startH = el.offsetHeight;
    const scale = getScale();
    onDragChange(true);

    dragging.current = { startX: e.clientX, startY: e.clientY, startW, startH, scale, lockW, lockH, flipX, flipY, rafId: null, committed: false };

    const onMove = (ev: PointerEvent) => {
      if (!dragging.current) return;
      const d = dragging.current;

      if (!d.committed) {
        const dist = Math.abs(ev.clientX - d.startX) + Math.abs(ev.clientY - d.startY);
        if (dist < 4) return;
        d.committed = true;
      }

      if (d.rafId !== null) cancelAnimationFrame(d.rafId);
      d.rafId = requestAnimationFrame(() => {
        if (!dragging.current) return;
        const dd = dragging.current;
        const signX = dd.flipX ? -1 : 1;
        const signY = dd.flipY ? -1 : 1;
        const newW = Math.max(100, Math.round(dd.startW + (ev.clientX - dd.startX) * dd.scale * signX));
        const newH = Math.max(100, Math.round(dd.startH + (ev.clientY - dd.startY) * dd.scale * signY));
        if (!dd.lockW) {
          el.style.width = `${newW}px`;
          onResizeLive(newW - borderOffX, newH - borderOffY);
        }
        if (!dd.lockH) {
          el.style.height = `${newH}px`;
          onResizeLive(newW - borderOffX, newH - borderOffY);
        }
        dd.rafId = null;
      });
    };

    const onUp = () => {
      if (dragging.current?.rafId !== null) cancelAnimationFrame(dragging.current!.rafId!);
      dragging.current = null;
      el.style.willChange = '';
      const frameW = parseInt(el.style.width);
      const frameH = parseInt(el.style.height);
      if (!isNaN(frameW) && !isNaN(frameH)) {
        onResize(Math.max(100, frameW - borderOffX), Math.max(100, frameH - borderOffY));
      }
      onDragChange(false);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, [frameRef, getScale, onResize, onResizeLive, onDragChange, borderOffX, borderOffY]);

  const onLeftDown = makeHandler(false, true, true, false);
  const onRightDown = makeHandler(false, true, false, false);
  const onTopDown = makeHandler(true, false, false, true);
  const onBottomDown = makeHandler(true, false, false, false);

  return (
    <>
      {/* Top edge — outside top-left corner */}
      <div className="absolute z-10" style={{ top: -14, left: 12 }}>
        <div
          onPointerDown={onTopDown}
          className="flex flex-col items-center justify-center gap-px w-16 h-7 rounded-full bg-white/80 shadow-sm cursor-ns-resize"
          style={{ touchAction: 'none' }}
        >
          <div className="h-0.5 w-5 rounded-full bg-text-dim/60" />
          <div className="h-0.5 w-5 rounded-full bg-text-dim/60" />
          <div className="h-0.5 w-5 rounded-full bg-text-dim/60" />
        </div>
      </div>
      {/* Right edge — outside top-right corner */}
      <div className="absolute z-10" style={{ top: 12, right: -14 }}>
        <div
          onPointerDown={onRightDown}
          className="flex items-center justify-center gap-px w-7 h-16 rounded-full bg-white/80 shadow-sm cursor-ew-resize"
          style={{ touchAction: 'none' }}
        >
          <div className="w-0.5 h-5 rounded-full bg-text-dim/60" />
          <div className="w-0.5 h-5 rounded-full bg-text-dim/60" />
          <div className="w-0.5 h-5 rounded-full bg-text-dim/60" />
        </div>
      </div>
      {/* Bottom edge — outside bottom-right corner */}
      <div className="absolute z-10" style={{ bottom: -14, right: 12 }}>
        <div
          onPointerDown={onBottomDown}
          className="flex flex-col items-center justify-center gap-px w-16 h-7 rounded-full bg-white/80 shadow-sm cursor-ns-resize"
          style={{ touchAction: 'none' }}
        >
          <div className="h-0.5 w-5 rounded-full bg-text-dim/60" />
          <div className="h-0.5 w-5 rounded-full bg-text-dim/60" />
          <div className="h-0.5 w-5 rounded-full bg-text-dim/60" />
        </div>
      </div>
      {/* Left edge — outside bottom-left corner */}
      <div className="absolute z-10" style={{ bottom: 12, left: -14 }}>
        <div
          onPointerDown={onLeftDown}
          className="flex items-center justify-center gap-px w-7 h-16 rounded-full bg-white/80 shadow-sm cursor-ew-resize"
          style={{ touchAction: 'none' }}
        >
          <div className="w-0.5 h-5 rounded-full bg-text-dim/60" />
          <div className="w-0.5 h-5 rounded-full bg-text-dim/60" />
          <div className="w-0.5 h-5 rounded-full bg-text-dim/60" />
        </div>
      </div>
    </>
  );
}

export default function PreviewFrame({ url, device, zoom, scrolling, isRotated, onRotate, onResize }: PreviewFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [autoScale, setAutoScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [liveDims, setLiveDims] = useState<{ w: number; h: number } | null>(null);

  const handleResizeLive = useCallback((w: number, h: number) => {
    setLiveDims({ w, h });
  }, []);

  const handleDragChange = useCallback((d: boolean) => {
    setIsDragging(d);
    if (!d) setLiveDims(null);
  }, []);

  const displayWidth = isRotated ? device.height : device.width;
  const displayHeight = isRotated ? device.width : device.height;
  const frameType = resolveFrameCategory(device.category);
  const style = FRAME_STYLES[frameType];
  const isCustom = device.category === 'custom';

  const topH = TOPBAR_HEIGHT[style.topBar] || 0;
  const bottomH = BOTTOMBAR_HEIGHT[style.bottomBar] || 0;
  const bezelPadV = 0;
  const bezelPadH = 0;
  const borderV = style.contentBorder ? 4 : 0;
  const borderH = style.contentBorder ? 4 : 0;

  let capW = displayWidth;
  let capH = displayHeight;
  if (!isCustom) {
    if (capW > MAX_CONTENT_W) {
      capH = capH * (MAX_CONTENT_W / capW);
      capW = MAX_CONTENT_W;
    }
    if (capH > MAX_CONTENT_H) {
      capW = capW * (MAX_CONTENT_H / capH);
      capH = MAX_CONTENT_H;
    }
  }
  const contentW = Math.round(capW);
  const contentH = Math.round(capH);

  const frameW = contentW + bezelPadH + borderH;
  const frameH = contentH + topH + bottomH + bezelPadV + borderV;

  const effectiveScale = autoScale * (zoom / 100);

  const [transitionDuration, setTransitionDuration] = useState('2s');

  function normalizeUrl(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    if (trimmed.startsWith('localhost') || /^\d{1,3}\.\d{1,3}/.test(trimmed)) {
      return 'http://' + trimmed;
    }
    return 'https://' + trimmed;
  }

  function isLocalUrl(normalized: string): boolean {
    try {
      const { hostname } = new URL(normalized);
      return (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.')
      );
    } catch {
      return false;
    }
  }

  function resolveIframeSrc(rawUrl: string): string {
    if (!rawUrl || rawUrl.trim() === '') return '';
    const normalized = normalizeUrl(rawUrl);
    if (!normalized) return '';
    if (isLocalUrl(normalized)) {
      return '/api/proxy?url=' + encodeURIComponent(normalized);
    }
    return normalized;
  }

  const debouncedRecalcRef = useRef<number>(0);
  const prevFrameDimsRef = useRef({ w: 0, h: 0 });

  const recalc = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const availW = parent.clientWidth - 48;
    const availH = parent.clientHeight - 60;

    const fit = Math.min(availW / frameW, availH / frameH) * 0.85;
    const scale = Math.min(Math.max(fit, 0.1), 3);
    
    // Debounce the scale update to sync with frame size transition
    if (debouncedRecalcRef.current) clearTimeout(debouncedRecalcRef.current);
    debouncedRecalcRef.current = window.setTimeout(() => {
      setAutoScale(scale);
    }, 20);
  }, [frameW, frameH]);

  useEffect(() => {
    const deltaW = Math.abs(frameW - prevFrameDimsRef.current.w);
    const deltaH = Math.abs(frameH - prevFrameDimsRef.current.h);
    const isLargeChange = deltaW > 500 || deltaH > 500;
    const duration = isLargeChange ? '5s' : '2s';
    setTransitionDuration(duration);

    // Explicit transition registration before size update
    if (frameRef.current) {
        if (prevFrameDimsRef.current.w !== 0 && (prevFrameDimsRef.current.w !== frameW || prevFrameDimsRef.current.h !== frameH)) {
            frameRef.current.style.transition = `width ${duration} cubic-bezier(0.16,1,0.3,1), height ${duration} cubic-bezier(0.16,1,0.3,1), transform ${duration} cubic-bezier(0.16,1,0.3,1)`;
        } else {
            frameRef.current.style.transition = '';
        }
    }
    prevFrameDimsRef.current = { w: frameW, h: frameH };
    
    recalc();
    const observer = new ResizeObserver(recalc);
    const parent = containerRef.current?.parentElement;
    if (parent) observer.observe(parent);
    return () => observer.disconnect();
  }, [recalc, frameW, frameH]);

  if (!url) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-text-dim select-none">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center">
          <GlobeHemisphereWest size={32} className="text-text-dim/60" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-text-muted">Enter a URL to preview</p>
          <p className="text-xs mt-1">Try <span className="text-accent">example.com</span> or <span className="text-accent">localhost:3000</span></p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 flex flex-col items-center justify-center px-6 overflow-hidden min-h-0 relative" style={{ paddingBottom: 80 }}>
      {url && (
        <div className="absolute left-1/2 -translate-x-1/2 z-30 whitespace-nowrap" style={{ top: 8 }}>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-bg/80 backdrop-blur border border-border shadow-sm text-xs">
            <span className="font-medium text-text">{isDragging && liveDims ? `Custom ${liveDims.w}x${liveDims.h}` : device.name}</span>
            <span className="font-mono text-text-dim">{isDragging && liveDims ? `${liveDims.w}x${liveDims.h}` : `${displayWidth}x${displayHeight}`}</span>
            {onRotate && (
              <button
                onClick={onRotate}
                className="p-0.5 rounded-md text-text-dim hover:text-text hover:bg-surface-hover transition-colors"
                title="Rotate device"
              >
                <ArrowClockwise size={12} />
              </button>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-col items-center">
          <div

            ref={frameRef}
            className="shrink-0 relative"
              style={{
                width: frameW,
                height: frameH,
                transform: `scale(${effectiveScale})`,
                transformOrigin: 'center center',
                overflow: isCustom ? 'visible' : 'hidden',
                transition: isDragging ? 'none' : `width ${transitionDuration} cubic-bezier(0.16, 1, 0.3, 1), height ${transitionDuration} cubic-bezier(0.16, 1, 0.3, 1), transform ${transitionDuration} cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
          >
            <div 
              className={`${isCustom ? '' : 'rounded-lg'} shadow-[0_20px_50px_rgba(0,0,0,0.3)]`} 
              style={isCustom ? { width: '100%', height: '100%' } : undefined}
            >
              <div className="overflow-hidden rounded-lg" style={isCustom ? { width: '100%', height: '100%' } : undefined}>
                <IframeContent url={url} contentW={contentW} contentH={contentH} scrolling={scrolling} isCustom={isCustom} isDragging={isDragging} transitionDuration={transitionDuration} resolveIframeSrc={resolveIframeSrc} />
              </div>
              {isDragging && isCustom && (
                <div className="absolute inset-0" style={{ zIndex: 15 }} />
              )}
            </div>
            {isCustom && onResize && (
              <ResizeHandles onResize={onResize} onResizeLive={handleResizeLive} onDragChange={handleDragChange} frameRef={frameRef} borderOffX={borderH} borderOffY={borderV} />
            )}
          </div>
        </div>
    </div>
  );
}
