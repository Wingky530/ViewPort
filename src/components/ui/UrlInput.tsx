import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlass, ArrowRight, Clock } from '@phosphor-icons/react';

interface UrlInputProps {
  url: string;
  onChange: (url: string) => void;
  recentUrls?: string[];
  onSelectRecent?: (url: string) => void;
}

function stripProtocol(s: string) {
  return s.replace(/^https?:\/\//i, '');
}

function normalizeUrl(input: string) {
  let s = input.trim();
  if (!s) return '';
  s = stripProtocol(s);
  const host = s.split('/')[0].split(':')[0];
  const isLocal = /^localhost$|^127\.|^10\.|^192\.168\.|^0\.|^::1$/.test(host);
  return (isLocal ? 'http://' : 'https://') + s;
}

export default function UrlInput({ url, onChange, recentUrls = [], onSelectRecent }: UrlInputProps) {
  const [value, setValue] = useState(stripProtocol(url));
  const [showRecent, setShowRecent] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(stripProtocol(url));
  }, [url]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowRecent(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeUrl(value);
    if (normalized) onChange(normalized);
    setShowRecent(false);
  };

  return (
    <div ref={ref} className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface shrink-0">
        <div className="relative flex-1 flex items-center bg-bg border border-border rounded-lg focus-within:border-accent transition-colors">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim z-10" />
          <span className="pl-9 text-sm text-text-dim/40 pointer-events-none select-none shrink-0">https://</span>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => recentUrls.length > 0 && setShowRecent(true)}
            placeholder="example.com, localhost:3000"
            className="flex-1 py-2 pr-3 text-sm bg-transparent text-text placeholder:text-text-dim focus:outline-none min-w-0"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-hover transition-colors"
        >
          Go
          <ArrowRight size={16} />
        </button>
      </form>
      {showRecent && recentUrls.length > 0 && (
        <div className="absolute top-full left-4 right-4 z-20 mt-1 bg-surface border border-border rounded-lg shadow-xl overflow-hidden">
          {recentUrls.map((recentUrl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setValue(stripProtocol(recentUrl));
                if (onSelectRecent) onSelectRecent(recentUrl);
                setShowRecent(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-muted hover:text-text hover:bg-surface-hover transition-colors text-left"
            >
              <Clock size={12} className="shrink-0" />
              <span className="truncate">{stripProtocol(recentUrl)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
