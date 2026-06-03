import { List, MagnifyingGlass, SlidersHorizontal } from '@phosphor-icons/react';

interface NavbarProps {
  onToggleSidebar: () => void;
  onToggleSearch: () => void;
  onToggleTools: () => void;
  showSearch: boolean;
  showTools: boolean;
}

export default function Navbar({ onToggleSidebar, onToggleSearch, onToggleTools, showSearch, showTools }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-surface shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
          title="Toggle sidebar"
        >
          <List size={20} />
        </button>
        <span className="text-xl font-bold text-accent">ViewPort</span>
        <div className="hidden sm:flex items-center gap-6">
          <a href="/" className="text-sm text-text-muted hover:text-text transition-colors">Home</a>
          <span className="text-sm text-text font-medium">App</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSearch}
          className={`p-2 rounded-lg transition-colors ${showSearch ? 'text-accent bg-accent/20' : 'text-text-muted hover:text-text hover:bg-surface-hover'}`}
          title="Toggle URL input"
        >
          <MagnifyingGlass size={18} />
        </button>
        <button
          onClick={onToggleTools}
          className={`p-2 rounded-lg transition-colors ${showTools ? 'text-accent bg-accent/20' : 'text-text-muted hover:text-text hover:bg-surface-hover'}`}
          title="Toggle tools"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>
    </nav>
  );
}
