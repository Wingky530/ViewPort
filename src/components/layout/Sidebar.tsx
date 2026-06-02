import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Tv, ChevronDown, ChevronRight, Trash2, X, Moon, Sun, Heart } from 'lucide-react';
import { DEVICE_CATEGORIES, DEVICES, type Device } from '../../content/devices';

interface SidebarProps {
  selectedDevice: Device;
  onSelectDevice: (device: Device) => void;
  onCustomMode: () => void;
  customDevices: Device[];
  onDeleteCustom: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

const categoryIcons: Record<string, typeof Smartphone> = {
  smartphone: Smartphone,
  tablet: Tablet,
  monitor: Monitor,
  tv: Tv,
};

function getInitialExpanded(): string | null {
  return null;
}

export default function Sidebar({ selectedDevice, onSelectDevice, onCustomMode, customDevices, onDeleteCustom, isOpen, onClose, isDark, onToggleDark }: SidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(getInitialExpanded);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleCategory = (id: string) => {
    setExpandedCategory(prev => (prev === id ? null : id));
  };

  const isSelected = (device: Device) =>
    selectedDevice.id === device.id;

  const handleSelect = (device: Device) => {
    onSelectDevice(device);
    onClose();
  };

  const handleCustomClick = () => {
    onCustomMode();
    onClose();
  };

  const renderDeviceItem = (device: Device, showDelete = false) => (
    <div key={device.id || device.name} className="flex items-center group px-3 py-1">
      <button
        onClick={() => handleSelect(device)}
        className={`flex-1 flex items-center justify-between rounded-lg transition-colors cursor-pointer ${
          isSelected(device)
            ? 'bg-accent/15 text-accent border-l-2 border-accent pl-2.5'
            : 'hover:bg-surface-hover text-text pl-3'
        }`}
      >
        <span className="text-sm">{device.name}</span>
        <span className="text-[10px] text-text-dim font-mono">
          {device.width}&times;{device.height}
        </span>
      </button>
      {showDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDeleteCustom(device.id); }}
          className="ml-1 shrink-0 p-1 text-text-dim hover:text-danger transition-colors opacity-0 group-hover:opacity-100"
          title="Delete custom device"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border shrink-0 flex items-center justify-between">
        <span className="text-sm font-semibold text-text">Devices</span>
        <button onClick={onClose} className="lg:hidden p-1 text-text-dim hover:text-text transition-colors">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {DEVICE_CATEGORIES.map(category => {
          const isCustom = category.id === 'custom';
          const devices = isCustom ? customDevices : DEVICES.filter(d => d.category === category.id);
          const Icon = categoryIcons[category.icon] || Smartphone;
          const isExpanded = expandedCategory === category.id;
          const isCustomSelected = isCustom && selectedDevice.category === 'custom';

          if (isCustom) {
            if (customDevices.length === 0) {
              return (
                <div key={category.id}>
                  <button
                    onClick={handleCustomClick}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-xs uppercase tracking-widest font-semibold transition-colors ${
                      isCustomSelected
                        ? 'text-accent'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{category.name}</span>
                  </button>
                </div>
              );
            }

            return (
              <div key={category.id}>
                <div className="flex items-center w-full">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="p-3 text-text-muted hover:text-text transition-colors shrink-0"
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  <button
                    onClick={handleCustomClick}
                    className={`flex items-center gap-2 flex-1 py-2 pr-3 text-xs uppercase tracking-widest font-semibold transition-colors ${
                      isCustomSelected
                        ? 'text-accent'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{category.name}</span>
                  </button>
                </div>
                <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  {devices.map(d => renderDeviceItem(d, true))}
                </div>
              </div>
            );
          }

          return (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs uppercase tracking-widest text-text-muted hover:bg-surface-hover transition-colors"
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <Icon size={16} />
                <span className="font-semibold">{category.name}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {devices.map(d => renderDeviceItem(d, false))}
        </div>
      </div>
    );
  })}
</div>
<div className="p-3 border-t border-border shrink-0 flex items-center justify-between">
  <button
    onClick={onToggleDark}
    className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {isDark ? <Sun size={18} /> : <Moon size={18} />}
  </button>
  <a
    href="#"
    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg hover:bg-red-500 transition-colors"
  >
    <Heart size={16} />
    <span>Donate</span>
  </a>
</div>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-bg border-r border-border transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
      <aside className="hidden lg:flex lg:w-[260px] lg:flex-col lg:shrink-0 lg:overflow-hidden border-r border-border bg-bg">
        {sidebarContent}
      </aside>
    </>
  );
}
