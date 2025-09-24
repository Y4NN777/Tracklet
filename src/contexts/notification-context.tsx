'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface NotificationType {
  name: string;
  display_name: string;
  description?: string;
  icon: string;
  color: string;
  priority: string;
}

interface Notification {
  id: string;
  user_id: string;
  type_id?: string;
  title: string;
  message?: string;
  data?: any;
  read_at?: string;
  action_url?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  notification_types?: NotificationType;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'read_at'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read_at).length;

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Fetch initial notifications
  const fetchNotifications = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch('/api/v1/notifications', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
//      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Setup realtime subscription
  useEffect(() => {
    const setupRealtime = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      setUser(session.user);
      await fetchNotifications(session.user.id);

      // Subscribe to realtime changes
      const newChannel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
    {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);

            // Show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
              const notification = new Notification(newNotification.title, {
                body: newNotification.message || '',
                icon: '/icon.ico',
                tag: newNotification.id,
              });

              // Auto-close after 5 seconds
              setTimeout(() => notification.close(), 5000);
            }
          }
        )
        .subscribe();

      setChannel(newChannel);
    };

    setupRealtime();

    // Cleanup on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setNotifications([]);
          setLoading(false);
          if (channel) {
            supabase.removeChannel(channel);
            setChannel(null);
          }
        } else if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await fetchNotifications(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [channel]);

  const addNotification = async (notification: Omit<Notification, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'read_at'>) => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch('/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (response.ok) {
        const data = await response.json();
        // The realtime subscription will handle adding to state
      }
    } catch (error) {
//      console.error('Error adding notification:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch(`/api/v1/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
    setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
    );
      }
    } catch (error) {
//      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch('/api/v1/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
    setNotifications(prev => 
          prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
    );
      }
    } catch (error) {
//      console.error('Error marking all notifications as read:', error);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch(`/api/v1/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      } else {
        toast({
          title: "Error",
          description: "Failed to delete notification. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error removing notification:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      loading
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}