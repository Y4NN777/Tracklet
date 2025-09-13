'use client';

import { useEffect } from 'react';
import { usePreferencesContext } from '@/contexts/preferences-context';

export function PreferencesThemeBridge() {
  const { preferences } = usePreferencesContext();
  const theme = preferences.theme === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : preferences.theme;

  useEffect(() => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // Apply the current theme (already resolved from preferences)
    root.classList.add(theme);
  }, [theme]);

  // Listen for system theme changes when user preference is 'system'
  useEffect(() => {
    if (preferences.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preferences.theme]);

  return null; // This component doesn't render anything
}