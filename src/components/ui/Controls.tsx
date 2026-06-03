import { useState } from 'react';
import { MagnifyingGlassPlus, MagnifyingGlassMinus, ArrowClockwise, Columns, MouseSimple, Camera, ShareNetwork, Check } from '@phosphor-icons/react';
import type { Device } from '../../content/devices';

interface ControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onRotate: () => void;
  isMultiView: boolean;
  onMultiViewChange: (v: boolean) => void;
  scrolling: boolean;
  onScrollingChange: (v: boolean) => void;
  onScreenshot: () => void;
  url: string;
  device: Device;
}

export default function Controls({
  zoom, onZoomChange, onRotate,
  isMultiView, onMultiViewChange,
  scrolling, onScrollingChange,
  onScreenshot,
  url, device,
}: ControlsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/app?url=${encodeURIComponent(url)}&device=${encodeURIComponent(device.name)}&w=${device.width}&h=${device.height}`
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const btnBase = 'p-2 rounded-lg transition-colors';
  const btnInactive = 'text-text-dim hover:text-text hover:bg-surface-hover';
  const btnActive = 'bg-accent/20 text-accent';

  return (
    <div className="w-full flex justify-center py-2 px-4">
      <div className="w-fit mx-auto bg-ctrl-bg/90 backdrop-blur border border-border rounded-2xl px-4 py-2 flex items-center gap-1 shadow-xl">
        {/* Zoom */}
        <button
          onClick={() => onZoomChange(Math.max(25, zoom - 25))}
          disabled={zoom <= 25}
          className={`${btnBase} ${btnInactive} disabled:opacity-30 disabled:pointer-events-none`}
          title="Zoom out"
        >
          <MagnifyingGlassMinus size={16} />
        </button>
        <span className="text-xs font-mono w-10 text-center text-text-dim">{zoom}%</span>
        <button
          onClick={() => onZoomChange(Math.min(200, zoom + 25))}
          disabled={zoom >= 200}
          className={`${btnBase} ${btnInactive} disabled:opacity-30 disabled:pointer-events-none`}
          title="Zoom in"
        >
          <MagnifyingGlassPlus size={16} />
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Actions */}
        <button
          onClick={onRotate}
          className={`${btnBase} ${btnInactive}`}
          title="Rotate device"
        >
          <ArrowClockwise size={16} />
        </button>
        <button
          onClick={() => onScrollingChange(!scrolling)}
          className={`${btnBase} ${scrolling ? btnActive : btnInactive}`}
          title={scrolling ? 'Disable scrolling' : 'Enable scrolling'}
        >
          <MouseSimple size={16} />
        </button>
        <button
          onClick={onScreenshot}
          className={`${btnBase} ${btnInactive}`}
          title="Screenshot"
        >
          <Camera size={16} />
        </button>
        <button
          onClick={() => onMultiViewChange(!isMultiView)}
          className={`${btnBase} ${isMultiView ? btnActive : btnInactive}`}
          title={isMultiView ? 'Disable multi-view' : 'Enable multi-view'}
        >
          <Columns size={16} />
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Share */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white rounded-lg px-3 py-1.5 text-xs transition-colors"
          title="Copy share link"
        >
          {copied ? <Check size={14} /> : <ShareNetwork size={14} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}
