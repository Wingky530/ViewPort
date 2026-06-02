import { useState, useEffect, useCallback } from 'react';
import Navbar from './layout/Navbar';
import Sidebar from './layout/Sidebar';
// import UrlInput from './ui/UrlInput'; // Removed as it will be replaced by SearchModal
import PreviewFrame from './ui/PreviewFrame';
import Controls from './ui/Controls';
import SearchModal from './ui/SearchModal'; // New import
import { DEVICES, type Device } from '../content/devices';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DEFAULT_DEVICE = DEVICES.find(d => d.id === 'phone-390x844') || DEVICES[0];

const MOBILE_CATS = ['phone'];
const TABLET_CATS = ['tablet'];
const DESKTOP_CATS = ['desktop', 'tv'];

function isMobileCategory(cat: string) {
  return MOBILE_CATS.includes(cat);
}

function pickDevice(categories: string[]): Device {
  for (const cat of categories) {
    const found = DEVICES.find(d => d.category === cat);
    if (found) return found;
  }
  return DEVICES[0];
}

export default function AppShell() {
  const [url, setUrl] = useLocalStorage<string>('viewport-url', '');
  const [recentUrls, setRecentUrls] = useLocalStorage<string[]>('viewport-recent', []);
  const [device, setDevice] = useLocalStorage<Device>('viewport-device', DEFAULT_DEVICE);
  const [zoom, setZoom] = useLocalStorage<number>('viewport-zoom', 100);
  const [scrolling, setScrolling] = useState(true);
  const [isDark, setIsDark] = useLocalStorage<boolean>('viewport-dark', true);
  const [isRotated, setIsRotated] = useState(false);
  const [isMultiView, setIsMultiView] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

  const [multiDevice1, setMultiDevice1] = useState<Device>(DEFAULT_DEVICE);
  const [multiDevice2, setMultiDevice2] = useState<Device>(pickDevice(TABLET_CATS));
  const [multiDevice3, setMultiDevice3] = useState<Device>(pickDevice(DESKTOP_CATS));
  const [multiRotated1, setMultiRotated1] = useState(false);
  const [multiRotated2, setMultiRotated2] = useState(false);
  const [multiRotated3, setMultiRotated3] = useState(false);

  const [customDevices, setCustomDevices] = useLocalStorage<Device[]>('viewport-custom', []);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customWidth, setCustomWidth] = useState('390');
  const [customHeight, setCustomHeight] = useState('844');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get('url');
    if (u) setUrl(decodeURIComponent(u));
    const w = params.get('w');
    const h = params.get('h');
    const d = params.get('device');
    if (d) {
      const found = DEVICES.find(dev => dev.id === d || dev.name === d);
      if (found) setDevice(found);
    } else if (w && h) {
      const found = DEVICES.find(dev => dev.width === parseInt(w) && dev.height === parseInt(h));
      if (found) setDevice(found);
    }
    const z = params.get('zoom');
    if (z) {
      const n = parseInt(z);
      if (n >= 25 && n <= 200) setZoom(n);
    }
    const s = params.get('scroll');
    if (s === '0' || s === '1') setScrolling(s === '1');
  }, []);

  useEffect(() => {
    if (device && typeof device === 'object' && 'id' in device && 'width' in device && 'height' in device) {
      return;
    }
    setDevice(DEFAULT_DEVICE);
  }, [device, setDevice]);

  useEffect(() => {
    if (recentUrls && !Array.isArray(recentUrls)) {
      setRecentUrls([]);
    }
  }, [recentUrls, setRecentUrls]);

  useEffect(() => {
    if (url && typeof url !== 'string') {
      setUrl('');
    }
  }, [url, setUrl]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Global keyboard shortcut for search modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setShowSearch(prev => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleUrlChange = useCallback((newUrl: string) => {
    setUrl(newUrl);
    setRecentUrls(prev => {
      const next = [newUrl, ...prev.filter(u => u !== newUrl)];
      return next.slice(0, 5);
    });
  }, [setUrl, setRecentUrls]);

  const showToast = useCallback((message: string) => {
    setToast({ message, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleScreenshot = useCallback(() => {
    showToast("Screenshot feature requires backend — coming soon!");
  }, [showToast]);

  const handleRotate = useCallback(() => {
    setIsRotated(prev => !prev);
  }, []);

  const handleDeviceChange = useCallback((d: Device) => {
    setDevice(d);
    setIsRotated(false);
    setShowCustomForm(d.category === 'custom');
  }, [setDevice]);

  const handleCustomMode = useCallback(() => {
    const last = customDevices[customDevices.length - 1];
    if (last) {
      setDevice(last);
      setCustomWidth(String(last.width));
      setCustomHeight(String(last.height));
    } else {
      const w = parseInt(customWidth) || 390;
      const h = parseInt(customHeight) || 844;
      setDevice({ id: 'custom-pending', name: `Custom ${w}\u00D7${h}`, width: w, height: h, category: 'custom' });
    }
    setShowCustomForm(true);
    setIsRotated(false);
  }, [customDevices, setDevice, customWidth, customHeight]);

  const handleMultiViewChange = useCallback((v: boolean) => {
    setIsMultiView(v);
    if (v) {
      setMultiDevice1(device);
      if (isMobileCategory(device.category)) {
        setMultiDevice2(pickDevice(TABLET_CATS));
      } else {
        setMultiDevice2(pickDevice(MOBILE_CATS));
      }
      setMultiDevice3(pickDevice(DESKTOP_CATS));
      setMultiRotated1(false);
      setMultiRotated2(false);
      setMultiRotated3(false);
    }
  }, [device]);

  const handleApplyCustom = useCallback((w: number, h: number) => {
    if (isNaN(w) || isNaN(h) || w < 100 || h < 100) {
      showToast('Please enter valid dimensions (min 100px)');
      return;
    }
    const custom: Device = {
      id: `custom-${w}-${h}`,
      name: `Custom ${w}×${h}`,
      width: w,
      height: h,
      category: 'custom',
    };
    setCustomDevices(prev => {
      if (prev.some(d => d.width === w && d.height === h)) return prev;
      return [...prev, custom];
    });
    setDevice(custom);
    setIsRotated(false);
    showToast(`Custom device ${w}×${h} applied`);
  }, [setCustomDevices, setDevice, showToast]);

  const handleApplyCustomFromSearch = useCallback((width: number, height: number) => {
    setDevice({ id: `custom-${width}-${height}`, name: `Custom ${width}×${height}`, width, height, category: 'custom' });
    setIsRotated(false);
    showToast(`Custom device ${width}×${height} applied`);
  }, [setDevice, showToast]);



  const handleCustomResize = useCallback((w: number, h: number) => {
    setDevice(prev => {
      const updated: Device = { ...prev, width: w, height: h };
      setCustomDevices(devices =>
        devices.map(d => d.id === prev.id ? updated : d)
      );
      return updated;
    });
  }, [setDevice, setCustomDevices]);

  const handleDeleteCustom = useCallback((id: string) => {
    setCustomDevices(prev => prev.filter(d => d.id !== id));
    if (device.id === id) {
      setDevice(DEFAULT_DEVICE);
    }
  }, [setCustomDevices, setDevice, device.id]);

  return (
    <div className="h-screen flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} onToggleSearch={() => setShowSearch(prev => !prev)} onToggleTools={() => setShowTools(prev => !prev)} showSearch={showSearch} showTools={showTools} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar selectedDevice={device} onSelectDevice={handleDeviceChange} onCustomMode={handleCustomMode} customDevices={customDevices} onDeleteCustom={handleDeleteCustom} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
        <main className="flex-1 flex flex-col overflow-hidden bg-preview-bg">
          <div className="shrink-0">
            {showTools && (
              <Controls
                zoom={zoom}
                onZoomChange={setZoom}
                onRotate={handleRotate}
                isMultiView={isMultiView}
                onMultiViewChange={handleMultiViewChange}
                scrolling={scrolling}
                onScrollingChange={setScrolling}
                onScreenshot={handleScreenshot}
                url={url}
                device={device}
              />
            )}
          </div>
          
          {isMultiView ? (
            <div className="flex-1 flex flex-row overflow-auto gap-2 p-2">
              <PreviewFrame url={url} device={multiDevice1} zoom={zoom} scrolling={scrolling} onRotate={() => setMultiRotated1(prev => !prev)} isRotated={multiRotated1} />
              <PreviewFrame url={url} device={multiDevice2} zoom={zoom} scrolling={scrolling} onRotate={() => setMultiRotated2(prev => !prev)} isRotated={multiRotated2} />
              <PreviewFrame url={url} device={multiDevice3} zoom={zoom} scrolling={scrolling} onRotate={() => setMultiRotated3(prev => !prev)} isRotated={multiRotated3} />
            </div>
          ) : (
            <PreviewFrame url={url} device={device} zoom={zoom} scrolling={scrolling} isRotated={isRotated} onResize={device.category === 'custom' ? handleCustomResize : undefined} />
          )}

          <SearchModal
            isOpen={showSearch}
            onClose={() => setShowSearch(false)}
            url={url || ''}
            onChange={handleUrlChange}
            recentUrls={Array.isArray(recentUrls) ? recentUrls : []}
            devices={DEVICES}
            onSelectRecent={handleUrlChange}
            onSelectDevice={handleDeviceChange}
            onApplyCustomResolution={handleApplyCustomFromSearch}
          />

          {toast && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-surface border border-border rounded-xl shadow-2xl text-sm text-text toast-enter" key={toast.id}>
              {toast.message}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
