/**
 * SimplePDF Central Site Configuration
 * Single source of truth for site branding, canonical domain, and analytics.
 * Safely resolves in both Vite client and Node.js server/test environments.
 */

const getEnv = (key: string, fallback = ''): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch {}
  return fallback;
};

export const SITE_CONFIG = {
  name: 'SimplePDF',
  domain: 'simplepdf.me',
  url: 'https://simplepdf.me',
  defaultLanguage: 'en',
  tagline: 'Online PDF Tools for Document Productivity',
  author: 'SimplePDF Team',
  twitterHandle: '@SimplePDF',
  googleAnalyticsId: getEnv('VITE_GA_MEASUREMENT_ID', 'G-XXXXXXXXXX'),
  googleSearchConsoleVerification: getEnv('VITE_GSC_VERIFICATION', ''),
};

export const SITE_URL = (getEnv('VITE_SITE_URL', SITE_CONFIG.url)).replace(/\/+$/, '');
