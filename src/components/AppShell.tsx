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

  const addCustomDevice = useCallback((newDevice: Device) => {
    setCustomDevices(prev => [...prev, newDevice]);
    setDevice(newDevice);
  }, [setCustomDevices, setDevice]);

  const deleteCustomDevice = useCallback((id: string) => {
    setCustomDevices(prev => prev.filter(d => d.id !== id));
  }, [setCustomDevices]);

  const updateRecentUrls = useCallback((newUrl: string) => {
    setRecentUrls(prev => {
      const filtered = prev.filter(u => u !== newUrl);
      return [newUrl, ...filtered].slice(0, 10); // Keep last 10
    });
  }, [setRecentUrls]);

  const handleDeviceChange = useCallback((newDevice: Device) => {
    setDevice(newDevice);
    if (isMobileCategory(newDevice.category)) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
    setIsRotated(false);
    setShowCustomForm(false);
  }, [setDevice, setScrolling, setIsRotated]);

  const handleMultiViewToggle = useCallback(() => {
    setIsMultiView(prev => !prev);
    // Reset rotations when switching to/from multi-view
    setIsRotated(false);
    setMultiRotated1(false);
    setMultiRotated2(false);
    setMultiRotated3(false);
  }, []);

  const handleSearchSelect = useCallback((selectedUrl: string) => {
    setUrl(selectedUrl);
    updateRecentUrls(selectedUrl);
    setShowSearch(false);
  }, [setUrl, updateRecentUrls]);

  const handleApplyCustomResolution = useCallback((width: number, height: number) => {
    const newCustomDevice: Device = {
      id: `custom-${width}x${height}-${Date.now()}`,
      name: `Custom ${width}x${height}`,
      category: 'custom',
      width,
      height,
    };
    addCustomDevice(newCustomDevice);
    setShowCustomForm(false);
    setShowSearch(false);
  }, [addCustomDevice]);

  const handleNavbarToggleSearch = useCallback(() => {
    setShowSearch(prev => !prev);
    setShowCustomForm(false);
  }, []);

  const handleNavbarToggleTools = useCallback(() => {
    setShowTools(prev => !prev);
  }, []);

  const handleSidebarOpen = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleRotate = useCallback(() => {
    setIsRotated(prev => !prev);
  }, []);

  const handleToast = useCallback((message: string) => {
    setToast({ message, id: Date.now() });
    setTimeout(() => setToast(null), 3000); // Hide after 3 seconds
  }, []);

  const previewFrameProps = { url, zoom, scrolling, isRotated, onRotate: handleRotate };

  const multiViewFrames = isMultiView && (
    <>
      <PreviewFrame url={url} device={multiDevice1} zoom={zoom} scrolling={scrolling} isRotated={multiRotated1} onRotate={() => setMultiRotated1(prev => !prev)} onResize={() => {}} />
      <PreviewFrame url={url} device={multiDevice2} zoom={zoom} scrolling={scrolling} isRotated={multiRotated2} onRotate={() => setMultiRotated2(prev => !prev)} onResize={() => {}} />
      <PreviewFrame url={url} device={multiDevice3} zoom={zoom} scrolling={scrolling} isRotated={multiRotated3} onRotate={() => setMultiRotated3(prev => !prev)} onResize={() => {}} />
    </>
  );

  return (
    <div className="h-screen flex flex-col bg-bg text-text">
      <Navbar
        onToggleSidebar={handleSidebarOpen}
        onToggleSearch={handleNavbarToggleSearch}
        onToggleTools={handleNavbarToggleTools}
        showSearch={showSearch}
        showTools={showTools}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedDevice={device}
          onSelectDevice={handleDeviceChange}
          onCustomMode={() => setShowCustomForm(true)}
          customDevices={customDevices}
          onDeleteCustom={deleteCustomDevice}
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
          isDark={isDark}
          onToggleDark={() => setIsDark(prev => !prev)}
          zoom={zoom}
          setZoom={setZoom}
          scrolling={scrolling}
          setScrolling={setScrolling}
          isRotated={isRotated}
          setIsRotated={setIsRotated}
          isMultiView={isMultiView}
          onToggleMultiView={handleMultiViewToggle}
          onToast={handleToast}
          // Multi-view specific props
          multiDevice1={multiDevice1}
          setMultiDevice1={setMultiDevice1}
          multiRotated1={multiRotated1}
          setMultiRotated1={setMultiRotated1}
          multiDevice2={multiDevice2}
          setMultiDevice2={setMultiDevice2}
          multiRotated2={multiRotated2}
          setMultiRotated2={setMultiRotated2}
          multiDevice3={multiDevice3}
          setMultiDevice3={setMultiDevice3}
          multiRotated3={multiRotated3}
          setMultiRotated3={setMultiRotated3}
        />
        <main className="flex-1 flex flex-col relative bg-surface overflow-hidden">
          {isMultiView ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 flex-1 overflow-auto">
              {multiViewFrames}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 min-h-0">
              <PreviewFrame
                url={url}
                device={device}
                zoom={zoom}
                scrolling={scrolling}
                isRotated={isRotated}
                onRotate={handleRotate}
                onResize={() => {}} // Placeholder for now
              />
            </div>
          )}
          {showTools && <Controls url={url} device={device} zoom={zoom} onZoomChange={setZoom} onRotate={handleRotate} isMultiView={isMultiView} onMultiViewChange={(v) => setIsMultiView(v)} scrolling={scrolling} onScrollingChange={setScrolling} onScreenshot={() => handleToast('Screenshot not yet implemented')} />}
        </main>
      </div>

        <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        url={url}
        onChange={(newUrl) => {
          setUrl(newUrl);
          updateRecentUrls(newUrl);
        }}
        recentUrls={recentUrls}
        devices={DEVICES}
        onSelectRecent={handleSearchSelect}
        onSelectDevice={handleDeviceChange}
        onApplyCustomResolution={handleApplyCustomResolution}
      />

      {toast && (
        <div key={toast.id} className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out">
          {toast.message}
        </div>
      )}
    </div>
  );
}
