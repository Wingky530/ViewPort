interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className="sm:hidden p-2 text-[#252422] hover:text-[#252422]/60 transition-colors"
      aria-label={isOpen ? 'Close menu' : 'Menu'}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" strokeWidth="2" strokeLinecap="round">
        <line
          x1="2" y1="7" x2="20" y2="7" stroke="#252422"
          style={{
            transformOrigin: '11px 11px',
            transform: isOpen ? 'translateY(4px) rotate(45deg)' : 'none',
            transition: 'transform 0.3s cubic-bezier(0.76, 0, 0.24, 1)',
          }}
        />
        <line
          x1="2" y1="15" x2="20" y2="15" stroke="#EB1D62"
          style={{
            transformOrigin: '11px 11px',
            transform: isOpen ? 'translateY(-4px) rotate(-45deg)' : 'none',
            transition: 'transform 0.3s cubic-bezier(0.76, 0, 0.24, 1)',
          }}
        />
      </svg>
    </button>
  );
}
