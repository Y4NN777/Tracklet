'use client';

import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '@/lib/supabase';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  dateFormat: string;
  notifications: {
    budgetAlerts: {
      enabled: boolean;
      thresholds: number[];
    };
    goalReminders: {
      enabled: boolean;
      frequency: string;
      daysBeforeDeadline: number;
    };
    transactionAlerts: {
      enabled: boolean;
      minAmount: number;
      unusualSpending: boolean;
    };
    emailNotifications: {
      enabled: boolean;
      digest: string;
    };
  };
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  notifications: {
    budgetAlerts: {
      enabled: true,
      thresholds: [80, 90, 100]
    },
    goalReminders: {
      enabled: true,
      frequency: 'weekly',
      daysBeforeDeadline: 7
    },
    transactionAlerts: {
      enabled: true,
      minAmount: 100,
      unusualSpending: true
    },
    emailNotifications: {
      enabled: false,
      digest: 'daily'
    }
  }
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Load preferences from localStorage
  const loadLocalPreferences = useCallback((): UserPreferences => {
    try {
      const stored = localStorage.getItem('fintrack-preferences');
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }, []);

  // Save preferences to localStorage
  const saveLocalPreferences = useCallback((prefs: UserPreferences) => {
    try {
      localStorage.setItem('fintrack-preferences', JSON.stringify(prefs));
    } catch (error) {
//      console.warn('Failed to save preferences to localStorage:', error);
    }
  }, []);

  // Sync preferences with database
  const syncWithDatabase = useCallback(async (prefs: UserPreferences) => {
    if (!user) return;

    try {
      await db.updateUserPreferences(user.id, prefs);
      setSyncError(null); // Clear any previous error
    } catch (error) {
      console.warn('Failed to sync preferences with database:', error);
      setSyncError('Failed to save preferences. Changes may not persist across sessions.');
    }
  }, [user]);

  // Load preferences from database and merge with local
  const loadDatabasePreferences = useCallback(async () => {
    if (!user) return;

    try {
      const { data: profile } = await db.getUserProfile(user.id);
      if (profile?.preferences) {
        const dbPrefs = { ...DEFAULT_PREFERENCES, ...profile.preferences };
        setPreferences(dbPrefs);
        saveLocalPreferences(dbPrefs);
      }
    } catch (error) {
      console.warn('Failed to load preferences from database:', error);
      // On mobile, this might fail - user will see localStorage preferences
      // Consider showing a toast to inform user of potential sync issues
    }
  }, [user, saveLocalPreferences]);

  // Update preferences (local + database sync)
  const updatePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    const updatedPrefs = { ...preferences, ...newPreferences };
    setPreferences(updatedPrefs);
    saveLocalPreferences(updatedPrefs);

    // Sync with database if user is logged in
    if (user) {
      await syncWithDatabase(updatedPrefs);
    }
  }, [preferences, saveLocalPreferences, syncWithDatabase, user]);

  // Initialize preferences on mount
  useEffect(() => {
    const initializePreferences = async () => {
      setIsLoading(true);

      try {
        // Load from localStorage first
        const localPrefs = loadLocalPreferences();
        setPreferences(localPrefs);

        // Check if user is logged in with timeout
        const authTimeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Auth timeout')), 5000)
        );

        const authPromise = auth.getUser();

        let currentUser = null;
        try {
          const result = await Promise.race([authPromise, authTimeout]);
          currentUser = result.user;
        } catch (authError) {
//          console.warn('Auth check failed or timed out:', authError);
          // Continue with null user (unauthenticated)
        }

        setUser(currentUser);

        if (currentUser) {
          // Load from database and merge
          try {
            await loadDatabasePreferences();
          } catch (dbError) {
//            console.warn('Failed to load database preferences:', dbError);
            // Continue with local preferences only
          }
        }
      } catch (error) {
//        console.error('Error initializing preferences:', error);
        // Ensure we have default preferences loaded
        const localPrefs = loadLocalPreferences();
        setPreferences(localPrefs);
      } finally {
        // Always set loading to false, even if errors occurred
        setIsLoading(false);
      }
    };

    initializePreferences();
  }, []); // Empty dependency array - run only once on mount


  return {
    preferences,
    updatePreferences,
    isLoading,
    isLoggedIn: !!user,
    user,
    syncError
  };
}