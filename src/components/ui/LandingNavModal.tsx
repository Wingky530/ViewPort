import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, House, Browser, Heart } from '@phosphor-icons/react';

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

const NAV_LINKS = [
  { label: 'Home', href: '/', icon: House, shortcut: 'Index' },
  { label: 'Application', href: '/app', icon: Browser, shortcut: '/app' },
  { label: 'Support', href: '/#donate', icon: Heart, shortcut: '/donate' },
];

interface LandingNavModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LandingNavModal({ isOpen, onClose }: LandingNavModalProps) {
  const [backdropDirection, setBackdropDirection] = useState<Direction>('left');
  const [panelDirection, setPanelDirection] = useState<Direction>('bottom');

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
    }
  }, [isOpen]);

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

  return (
    <AnimatePresence custom={{ bd: backdropDirection, pd: panelDirection }}>
      {isOpen && (
        <>
          <motion.div
            key="lnd-backdrop"
            custom={{ bd: backdropDirection, pd: panelDirection }}
            variants={panel1Variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              key="lnd-panel"
              custom={{ bd: backdropDirection, pd: panelDirection }}
              variants={panel2Variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full mx-4 bg-bg border border-border shadow-2xl rounded-xl overflow-hidden pointer-events-auto"
              style={{ maxWidth: '360px', width: '90%' }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface/50">
                <span className="text-[11px] font-semibold tracking-widest uppercase text-text-dim">Navigation</span>
                <button
                  onClick={onClose}
                  className="p-1 text-text-muted hover:text-text hover:bg-surface-hover rounded transition-colors"
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </div>
              
              <nav className="p-2 flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className="group flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface-hover transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-surface border border-border group-hover:border-accent/30 group-hover:bg-accent/5 transition-colors">
                          <Icon size={16} className="text-text-muted group-hover:text-accent transition-colors" weight="duotone" />
                        </div>
                        <span className="text-sm font-medium text-text-muted group-hover:text-text transition-colors">
                          {link.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-text-dim font-mono opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        {link.shortcut}
                      </span>
                    </a>
                  );
                })}
              </nav>

              <div className="px-4 py-3 flex items-center justify-between border-t border-border bg-surface/50">
                <div className="flex items-center gap-2">
                  <img src="/img/favicon.png" alt="" className="w-4 h-4 rounded-sm grayscale opacity-50" />
                  <span className="text-xs text-text-dim font-medium">ViewPort</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-text-dim uppercase tracking-wider">Close</span>
                  <kbd className="px-1.5 py-0.5 bg-bg border border-border rounded text-[10px] font-mono text-text-muted shadow-sm">Esc</kbd>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
