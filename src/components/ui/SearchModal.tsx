import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, X, DeviceMobile, DeviceTablet, Monitor, Television, GearSix, GlobeHemisphereWest } from '@phosphor-icons/react';
import { type Device, type DeviceCategory, DEVICE_CATEGORIES } from '../../content/devices';

type Direction = 'top' | 'bottom' | 'left' | 'right';
const EASE = [0.76, 0, 0.24, 1] as const;

const getSlideOffset = (dir: Direction) => ({
  top:    { x: '0%',    y: '-105%' },
  bottom: { x: '0%',    y: '105%'  },
  left:   { x: '-105%', y: '0%'    },
  right:  { x: '105%',  y: '0%'    },
}[dir]);

const getClipHidden = (dir: Direction): string => ({
  top:    'inset(100% 0% 0% 0%)',
  bottom: 'inset(0% 0% 100% 0%)',
  left:   'inset(0% 0% 0% 100%)',
  right:  'inset(0% 100% 0% 0%)',
}[dir]);

const panel1Variants = {
  hidden: (custom: { bd: Direction }) => ({ ...getSlideOffset(custom.bd) }),
  visible: {
    x: '0%', y: '0%',
    transition: { duration: 0.45, ease: EASE, delay: 0 },
  },
  exit: (custom: { bd: Direction }) => ({
    ...getSlideOffset(custom.bd),
    transition: { duration: 0.4, ease: EASE, delay: 0.35 },
  }),
};

const panel2Variants = {
  hidden: (custom: { pd: Direction }) => ({ clipPath: getClipHidden(custom.pd) }),
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 0.45, ease: EASE, delay: 0.25 },
  },
  exit: (custom: { pd: Direction }) => ({
    clipPath: getClipHidden(custom.pd),
    transition: { duration: 0.35, ease: EASE, delay: 0 },
  }),
};

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  url:     'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  phone:   'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  tablet:  'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  desktop: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  tv:      'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  url:     <GlobeHemisphereWest size={16} />,
  phone:   <DeviceMobile size={16} />,
  tablet:  <DeviceTablet size={16} />,
  desktop: <Monitor size={16} />,
  tv:      <Television size={16} />,
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  onChange: (url: string) => void;
  recentUrls: string[];
  devices: Device[];
  onSelectRecent: (url: string) => void;
  onSelectDevice: (device: Device) => void;
  onApplyCustomResolution: (width: number, height: number) => void;
}

type Filter = 'all' | 'url' | 'phone' | 'tablet' | 'desktop' | 'tv';
export default function SearchModal({
  isOpen,
  onClose,
  url,
  onChange,
  recentUrls,
  devices,
  onSelectRecent,
  onSelectDevice,
  onApplyCustomResolution,
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [backdropDirection, setBackdropDirection] = useState<Direction>('left');
  const [panelDirection, setPanelDirection] = useState<Direction>('bottom');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    if (isOpen) {
      const PAIRS: [Direction, Direction][] = [
        ['left', 'bottom'],
        ['right', 'top'],
        ['top', 'right'],
        ['bottom', 'left'],
        ['left', 'top'],
        ['right', 'bottom'],
        ['top', 'left'],
        ['bottom', 'right'],
      ];
      const randomPair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
      setBackdropDirection(randomPair[0]);
      setPanelDirection(randomPair[1]);
      setSearchQuery(url);
    } else {
      setFilter('all');
    }
  }, [isOpen, url]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const filteredUrls = recentUrls.filter(u => u.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredDevices = devices.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.includes(searchQuery.toLowerCase())
  );

  const customResMatch = searchQuery.match(/^(\d+)\s*[xX×]\s*(\d+)$/);
  const isCustomResolution = !!customResMatch;

  const allResults: Array<{ id: string; type: 'url' | 'device'; data: any }> = [
    ...filteredUrls.map(u => ({ id: u, type: 'url' as const, data: u })),
    ...filteredDevices.map(d => ({ id: d.id, type: 'device' as const, data: d })),
  ];

  const filteredResults = filter === 'all'
    ? allResults
    : allResults.map(r =>
        (r.type === 'url' && filter === 'url') ||
        (r.type === 'device' && r.data.category === filter)
          ? r
          : null
      ).filter(Boolean) as typeof allResults;

  const handleFilter = (f: Filter) => setFilter(f);
  const handleApplyCustom = () => {
    if (customResMatch) {
      const w = parseInt(customResMatch[1], 10);
      const h = parseInt(customResMatch[2], 10);
      onApplyCustomResolution(w, h);
      onClose();
    }
  };

  const getBadgeLabel = (r: typeof allResults[0]) => {
    if (r.type === 'url') return 'URL';
    return DEVICE_CATEGORIES.find(c => c.id === r.data.category)?.id.toUpperCase() || 'DEVICE';
  };

  const getBadgeColor = (r: typeof allResults[0]) => {
    if (r.type === 'url') return CATEGORY_BADGE_COLORS.url;
    return CATEGORY_BADGE_COLORS[r.data.category] || CATEGORY_BADGE_COLORS.desktop;
  };
  const renderIcon = (r: typeof allResults[0]) => {
    if (r.type === 'url') {
      try {
        const urlObj = new URL(r.data.startsWith('http') ? r.data : `https://${r.data}`);
        const domain = urlObj.hostname;
        return (
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
            alt=""
            className="w-4 h-4 mr-2"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        );
      } catch (e) {
        return <GlobeHemisphereWest size={16} className="text-text-dim mr-2" />;
      }
    }
    const iconId = CATEGORY_ICONS[r.data.category] ? r.data.category : 'desktop';
    return <span className="mr-2 relative w-4 h-4 flex items-center justify-center">
             {CATEGORY_ICONS[iconId]}
           </span>;
  };
  return (
    <AnimatePresence custom={{ bd: backdropDirection, pd: panelDirection }}>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            custom={{ bd: backdropDirection, pd: panelDirection }}
            variants={panel1Variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              key="panel"
              custom={{ bd: backdropDirection, pd: panelDirection }}
              variants={panel2Variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full mx-4 bg-bg border border-border shadow-2xl rounded-lg overflow-hidden pointer-events-auto"
              style={{ maxWidth: '480px', width: '92%' }}
            >
              <div className="p-0.5">
                <form onSubmit={(e) => { e.preventDefault(); onChange(searchQuery); onClose(); }} className="flex flex-col p-3 gap-3">
                  <div className="flex items-center">
                    <MagnifyingGlass size={18} className="text-text-dim mr-2 shrink-0" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setFilter('all'); }}
                      placeholder="Search URLs, devices..."
                      className="flex-1 bg-transparent text-text placeholder-text-dim focus:outline-none text-sm"
                    />
                    {searchQuery && (
                      <button type="button" onClick={() => setSearchQuery('')} className="p-1 text-text-dim hover:text-text"><X size={16} /></button>
                    )}
                    <button type="submit" className="ml-2 px-3 py-1 text-xs font-medium text-white bg-accent rounded hover:bg-accent-hover transition-colors">Go</button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(['all', 'url', 'phone', 'desktop', 'tablet', 'tv'] as Filter[]).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => handleFilter(f)}
                        className={`px-2.5 py-0.5 text-[10px] font-medium rounded border transition-all ${
                          filter === f
                            ? 'bg-accent text-white border-accent'
                            : 'border-border text-text-dim bg-surface hover:border-accent/50'
                        }`}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </form>
              </div>

              <div className="p-0.5 pt-0 max-h-64 overflow-y-auto">
                {filteredResults.length > 0 ? (
                  filteredResults.map((r) => (
                    <button
                      key={r.id}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-text hover:bg-surface-hover gap-3 active:scale-[0.98] transition-transform"
                      onClick={() => {
                        r.type === 'url' ? onSelectRecent(r.data) : onSelectDevice(r.data);
                        onClose();
                      }}
                    >
                      <span className="shrink-0 text-text-dim">
                        {renderIcon(r)}
                      </span>
                      <span className="truncate flex-1 text-left">
                        {r.type === 'url' ? r.data : r.data.name}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded border uppercase ${getBadgeColor(r)}`}>
                        {getBadgeLabel(r)}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="py-6 text-center text-text-dim text-xs">No results found</div>
                )}
              </div>

              {isCustomResolution && (
                <div className="p-2 border-t border-border bg-surface/50">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-accent bg-accent/5 border border-accent/20 rounded hover:bg-accent/10 transition-all active:scale-[0.98]"
                    onClick={handleApplyCustom}
                  >
                    <GearSix size={16} />
                    Apply custom resolution ({customResMatch[1]}×{customResMatch[2]})
                  </button>
                </div>
              )}

              <div className="p-3 text-xs text-text-dim flex justify-between border-t border-border">
                <span>Press <kbd className="kbd">Esc</kbd> to close</span>
                <span><kbd className="kbd">Ctrl</kbd> + <kbd className="kbd">K</kbd> to open</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}