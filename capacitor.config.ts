import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.aivisualassistant',
  appName: 'AI Visual Assistant',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // url: 'https://7b6a1110-b7e6-4f39-a06d-12d4a1866828.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
      sound: 'beep.wav'
    }
  },
  android: {
    allowMixedContent: true
  }
};

export default config;