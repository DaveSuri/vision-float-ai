import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export interface NativeCapabilities {
  isNative: boolean;
  platform: string;
  canUseCamera: boolean;
  canUseOverlay: boolean;
  canUseNotifications: boolean;
}

export const useNativeCapabilities = () => {
  const [capabilities, setCapabilities] = useState<NativeCapabilities>({
    isNative: false,
    platform: 'web',
    canUseCamera: false,
    canUseOverlay: false,
    canUseNotifications: false
  });

  useEffect(() => {
    const checkCapabilities = () => {
      const isNative = Capacitor.isNativePlatform();
      const platform = Capacitor.getPlatform();
      
      setCapabilities({
        isNative,
        platform,
        canUseCamera: isNative || ('mediaDevices' in navigator),
        canUseOverlay: platform === 'android', // Android supports system overlay
        canUseNotifications: isNative || ('Notification' in window)
      });
    };

    checkCapabilities();
  }, []);

  return capabilities;
};