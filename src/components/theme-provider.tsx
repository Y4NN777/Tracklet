'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'fintrack-ui-theme',
  ...props
}: ThemeProviderProps) {
  // Start with default theme (same on server and client)
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Track if we're on the client side yet
  const [isClient, setIsClient] = useState(false);

  // This runs ONLY on the client side, after hydration
  useEffect(() => {
    setIsClient(true); // Now we know we're on the client

    // Safe to access localStorage now
    const storedTheme = localStorage.getItem(storageKey) as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [storageKey]);

  // Apply the theme to the page
  useEffect(() => {
    if (!isClient) return; // Don't run on server

    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    let actualTheme = theme;
    if (theme === 'system') {
      // Check user's system preference
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    root.classList.add(actualTheme);
  }, [theme, isClient]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);

      // Only save to localStorage if we're on the client
      if (isClient) {
        localStorage.setItem(storageKey, newTheme);
      }
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};