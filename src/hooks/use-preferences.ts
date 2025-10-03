'use client';

import { useState, useEffect, useCallback } from 'react';
import { auth, db, supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Load preferences from localStorage
  const loadLocalPreferences = useCallback((): UserPreferences => {
    try {
      const stored = localStorage.getItem('tracklet-preferences');
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }, []);

  // Save preferences to localStorage
  const saveLocalPreferences = useCallback((prefs: UserPreferences) => {
    try {
      localStorage.setItem('tracklet-preferences', JSON.stringify(prefs));
    } catch (error) {
//      console.warn('Failed to save preferences to localStorage:', error);
    }
  }, []);

  // Sync preferences with database with retry logic
  const syncWithDatabase = useCallback(async (prefs: UserPreferences, retryCount = 0) => {
    if (!user) return;

    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    try {
      await db.updateUserPreferences(user.id, prefs);
      setSyncError(null); // Clear any previous error
      console.log('Preferences synced successfully');
    } catch (error) {
      console.warn(`Failed to sync preferences with database (attempt ${retryCount + 1}):`, error);

      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
        console.log(`Retrying sync in ${delay}ms...`);
        setTimeout(() => syncWithDatabase(prefs, retryCount + 1), delay);
      } else {
        const errorMessage = 'Failed to save preferences. Changes may not persist across sessions.';
        setSyncError(errorMessage);
        toast({
          title: 'Sync Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }
  }, [user, toast]);

  // Load preferences from database and merge with local
  const loadDatabasePreferences = useCallback(async () => {
    if (!user) return;

    try {
      const { data: profile } = await db.getUserProfile(user.id);
      if (profile?.preferences) {
        const dbPrefs = { ...DEFAULT_PREFERENCES, ...profile.preferences };
        setPreferences(dbPrefs);
        saveLocalPreferences(dbPrefs);
        console.log('Preferences loaded from database');
      }
    } catch (error) {
      console.warn('Failed to load preferences from database:', error);
      // On mobile, this might fail - user will see localStorage preferences
      toast({
        title: 'Sync Warning',
        description: 'Unable to load latest preferences from server. Using local settings.',
        variant: 'default',
      });
    }
  }, [user, saveLocalPreferences, toast]);

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
          console.warn('Auth check failed or timed out:', authError);
          toast({
            title: 'Authentication Issue',
            description: 'Unable to verify login status. Some features may be limited.',
            variant: 'default',
          });
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

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUser = session?.user || null;
        setUser(newUser);

        if (newUser) {
          // User logged in - load preferences from database
          try {
            await loadDatabasePreferences();
          } catch (dbError) {
            console.warn('Failed to load database preferences on auth change:', dbError);
          }
        } else {
          // User logged out - keep local preferences but don't sync
          // Optionally clear localStorage on logout if desired
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadDatabasePreferences, toast]);


  return {
    preferences,
    updatePreferences,
    isLoading,
    isLoggedIn: !!user,
    user,
    syncError
  };
}