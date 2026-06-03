import { useState, useEffect } from 'react';
import { Monitor, DeviceMobile, DeviceTablet, Television, CaretDown, CaretRight, TrashSimple, X, MoonStars, Sun, Heart } from '@phosphor-icons/react';
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
  zoom: number;
  setZoom: (zoom: number) => void;
  scrolling: boolean;
  setScrolling: (scrolling: boolean | ((prev: boolean) => boolean)) => void;
  isRotated: boolean;
  setIsRotated: (rotated: boolean | ((prev: boolean) => boolean)) => void;
  isMultiView: boolean;
  onToggleMultiView: () => void;
  onToast: (message: string) => void;
  multiDevice1: Device;
  setMultiDevice1: (device: Device) => void;
  multiRotated1: boolean;
  setMultiRotated1: (rotated: boolean | ((prev: boolean) => boolean)) => void;
  multiDevice2: Device;
  setMultiDevice2: (device: Device) => void;
  multiRotated2: boolean;
  setMultiRotated2: (rotated: boolean | ((prev: boolean) => boolean)) => void;
  multiDevice3: Device;
  setMultiDevice3: (device: Device) => void;
  multiRotated3: boolean;
  setMultiRotated3: (rotated: boolean | ((prev: boolean) => boolean)) => void;
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  smartphone: DeviceMobile,
  tablet: DeviceTablet,
  monitor: Monitor,
  tv: Television,
};

function getInitialExpanded(): string | null {
  return null;
}

export default function Sidebar({ selectedDevice, onSelectDevice, onCustomMode, customDevices, onDeleteCustom, isOpen, onClose, isDark, onToggleDark, zoom, setZoom, scrolling, setScrolling, isRotated, setIsRotated, isMultiView, onToggleMultiView, onToast, multiDevice1, setMultiDevice1, multiRotated1, setMultiRotated1, multiDevice2, setMultiDevice2, multiRotated2, setMultiRotated2, multiDevice3, setMultiDevice3, multiRotated3, setMultiRotated3 }: SidebarProps) {
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
          <TrashSimple size={12} />
        </button>
      )}
    </div>
  );

  const renderMultiDeviceSelect = (label: string, device: Device, onChange: (d: Device) => void, rotated: boolean, onRotate: (r: boolean) => void) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-text-muted">{label}</span>
      <div className="flex items-center gap-1">
        <select
          value={device.id}
          onChange={(e) => {
            const found = DEVICES.find(d => d.id === e.target.value);
            if (found) onChange(found);
          }}
          className="flex-1 text-xs bg-surface text-text border border-border rounded px-1 py-1"
        >
          {DEVICES.map(d => (
            <option key={d.id} value={d.id}>{d.name} ({d.width}x{d.height})</option>
          ))}
        </select>
        <button
          onClick={() => onRotate(!rotated)}
          className={`text-xs px-2 py-1 rounded ${rotated ? 'bg-accent text-white' : 'bg-surface text-text-dim'} border border-border`}
          title="Rotate"
        >
          ↻
        </button>
      </div>
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
          const Icon = categoryIcons[category.icon] || DeviceMobile;
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
{isExpanded ? <CaretDown size={14} /> : <CaretRight size={14} />}
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
                {isExpanded ? <CaretDown size={14} /> : <CaretRight size={14} />}
                <Icon size={16} />
                <span className="font-semibold">{category.name}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {devices.map(d => renderDeviceItem(d, false))}
        </div>
      </div>
    );
  })}

  {isMultiView && (
    <div className="p-3 flex flex-col gap-2 border-t border-border">
      <span className="text-xs font-semibold text-text-muted uppercase tracking-widest">Multi-View Devices</span>
      {renderMultiDeviceSelect('Device 1', multiDevice1, setMultiDevice1, multiRotated1, setMultiRotated1)}
      {renderMultiDeviceSelect('Device 2', multiDevice2, setMultiDevice2, multiRotated2, setMultiRotated2)}
      {renderMultiDeviceSelect('Device 3', multiDevice3, setMultiDevice3, multiRotated3, setMultiRotated3)}
    </div>
  )}
</div>

<div className="p-3 flex flex-col gap-3 border-t border-border shrink-0">
  <div className="flex flex-col gap-2">
    <label htmlFor="zoom-input" className="block text-xs font-medium text-text-muted">Zoom: {zoom}%</label>
    <input
      id="zoom-input"
      type="range"
      min="25"
      max="200"
      step="25"
      value={zoom}
      onChange={(e) => setZoom(parseInt(e.target.value))}
      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
    />
  </div>

  <div className="flex items-center justify-between">
    <span className="text-xs font-medium text-text-muted">Scrolling</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" value="" className="sr-only peer" checked={scrolling} onChange={() => setScrolling(prev => !prev)} />
      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
    </label>
  </div>

  <div className="flex items-center justify-between">
    <span className="text-xs font-medium text-text-muted">Multi-view</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" value="" className="sr-only peer" checked={isMultiView} onChange={onToggleMultiView} />
      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
    </label>
  </div>
</div>

<div className="p-3 border-t border-border shrink-0 flex items-center justify-between">
  <button
    onClick={onToggleDark}
    className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {isDark ? <Sun size={18} /> : <MoonStars size={18} />}
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
