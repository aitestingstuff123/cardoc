import { CapacitorConfig } from '@capacitor/cli';

// ─────────────────────────────────────────────────────────────────
// API routing is handled at runtime in App.tsx via
// Capacitor.isNativePlatform() — native builds always use the
// deployed Cloud Run backend; web dev uses localhost.
//
// Do NOT set server.url here for production — it would force all
// WebViews (including real users' phones) to load the app from
// your dev machine, causing a white screen.
// ─────────────────────────────────────────────────────────────────

const config: CapacitorConfig = {
  appId: 'com.autodiagnostic.app',
  appName: 'AutoDiagnostic',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#09090b',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;

