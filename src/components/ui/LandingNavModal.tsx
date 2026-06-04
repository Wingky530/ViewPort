import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from '@phosphor-icons/react';

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
  { label: 'Home', href: '/' },
  { label: 'App', href: '/app' },
  { label: 'Support', href: '/#donate' },
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
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
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
              className="w-full mx-4 bg-[#EBEBDF] border border-[#D6D6C8] shadow-2xl rounded-lg overflow-hidden pointer-events-auto"
              style={{ maxWidth: '400px', width: '88%' }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#D6D6C8]">
                <span className="text-base font-bold text-[#252422]">Menu</span>
                <button
                  onClick={onClose}
                  className="p-1.5 text-[#252422]/60 hover:text-[#252422] hover:bg-[#EEEEE3] rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="p-3 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="px-4 py-3 text-sm font-medium text-[#252422] hover:text-[#EB1D62] hover:bg-[#EEEEE3] rounded-lg transition-all"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="p-3 text-xs text-[#5A5957] text-center border-t border-[#D6D6C8]">
                Press <kbd className="px-1.5 py-0.5 bg-[#EEEEE3] border border-[#D6D6C8] rounded text-[10px] font-mono">Esc</kbd> to close
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
