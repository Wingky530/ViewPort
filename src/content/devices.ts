export interface Device {
  id: string;
  name: string;
  width: number;
  height: number;
  category: string;
}

export interface DeviceCategory {
  id: string;
  name: string;
  icon: 'smartphone' | 'tablet' | 'monitor' | 'tv';
}

export const DEVICE_CATEGORIES: DeviceCategory[] = [
  { id: 'phone', name: 'Phone', icon: 'smartphone' },
  { id: 'tablet', name: 'Tablet', icon: 'tablet' },
  { id: 'desktop', name: 'Desktop', icon: 'monitor' },
  { id: 'tv', name: 'TV', icon: 'tv' },
  { id: 'custom', name: 'Custom', icon: 'smartphone' },
];

export const DEVICES: Device[] = [
  // Phone
  { id: 'phone-360x800', name: '360×800', width: 360, height: 800, category: 'phone' },
  { id: 'phone-375x812', name: '375×812', width: 375, height: 812, category: 'phone' },
  { id: 'phone-390x844', name: '390×844', width: 390, height: 844, category: 'phone' },
  { id: 'phone-393x852', name: '393×852', width: 393, height: 852, category: 'phone' },
  { id: 'phone-412x915', name: '412×915', width: 412, height: 915, category: 'phone' },
  { id: 'phone-430x932', name: '430×932', width: 430, height: 932, category: 'phone' },
  { id: 'phone-717x904', name: '717×904', width: 717, height: 904, category: 'phone' },

  // Tablet
  { id: 'tablet-720x1280', name: '720×1280', width: 720, height: 1280, category: 'tablet' },
  { id: 'tablet-744x1133', name: '744×1133', width: 744, height: 1133, category: 'tablet' },
  { id: 'tablet-800x1280', name: '800×1280', width: 800, height: 1280, category: 'tablet' },
  { id: 'tablet-820x1180', name: '820×1180', width: 820, height: 1180, category: 'tablet' },
  { id: 'tablet-1024x1366', name: '1024×1366', width: 1024, height: 1366, category: 'tablet' },

  // Desktop
  { id: 'desktop-1024x768', name: '1024×768', width: 1024, height: 768, category: 'desktop' },
  { id: 'desktop-1280x800', name: '1280×800', width: 1280, height: 800, category: 'desktop' },
  { id: 'desktop-1366x768', name: '1366×768', width: 1366, height: 768, category: 'desktop' },
  { id: 'desktop-1440x900', name: '1440×900', width: 1440, height: 900, category: 'desktop' },
  { id: 'desktop-1920x1080', name: '1920×1080', width: 1920, height: 1080, category: 'desktop' },
  { id: 'desktop-2560x1440', name: '2560×1440', width: 2560, height: 1440, category: 'desktop' },
  { id: 'desktop-3840x2160', name: '3840×2160', width: 3840, height: 2160, category: 'desktop' },

  // TV
  { id: 'tv-720p', name: '1280×720', width: 1280, height: 720, category: 'tv' },
  { id: 'tv-1080p', name: '1920×1080', width: 1920, height: 1080, category: 'tv' },
  { id: 'tv-4k', name: '3840×2160', width: 3840, height: 2160, category: 'tv' },
  { id: 'tv-8k', name: '7680×4320', width: 7680, height: 4320, category: 'tv' },
];
