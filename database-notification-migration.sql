-- =========================================
-- FinTrack Notification System Migration
-- Safe to run multiple times - uses IF NOT EXISTS and ON CONFLICT
-- =========================================

-- =========================================
-- 1. NOTIFICATION TYPES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS notification_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'bell',
  color TEXT DEFAULT '#3b82f6',
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- 2. NOTIFICATIONS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  type_id UUID REFERENCES notification_types(id),
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- 3. SEED NOTIFICATION TYPES
-- =========================================
INSERT INTO notification_types (name, display_name, description, icon, color, priority) VALUES
('budget_alert', 'Budget Alert', 'Alerts when budget limits are approached or exceeded', 'alert-triangle', '#ef4444', 'high'),
('goal_reminder', 'Goal Reminder', 'Reminders about savings goals and deadlines', 'target', '#3b82f6', 'normal'),
('transaction_alert', 'Transaction Alert', 'Notifications about significant transactions', 'credit-card', '#10b981', 'normal'),
('system_notification', 'System Notification', 'General system and account notifications', 'info', '#6b7280', 'low')
ON CONFLICT (name) DO NOTHING;

-- =========================================
-- 4. UPDATE USER PROFILES WITH NOTIFICATION PREFERENCES
-- =========================================
-- Add notification preferences to existing user_profiles if not present
UPDATE user_profiles
SET preferences = preferences || '{
  "notifications": {
    "budgetAlerts": {
      "enabled": true,
      "thresholds": [80, 90, 100]
    },
    "goalReminders": {
      "enabled": true,
      "frequency": "weekly",
      "daysBeforeDeadline": 7
    },
    "transactionAlerts": {
      "enabled": true,
      "minAmount": 100.00,
      "unusualSpending": true
    },
    "emailNotifications": {
      "enabled": false,
      "digest": "daily"
    }
  }
}'::jsonb
WHERE preferences->'notifications' IS NULL;

-- =========================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =========================================
ALTER TABLE notification_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read notification types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notification_types' AND policyname = 'Users can view notification types') THEN
        CREATE POLICY "Users can view notification types" ON notification_types
          FOR SELECT USING (true);
    END IF;
END $$;

-- Users can only access their own notifications
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can view own notifications') THEN
        CREATE POLICY "Users can view own notifications" ON notifications
          FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can insert own notifications') THEN
        CREATE POLICY "Users can insert own notifications" ON notifications
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can update own notifications') THEN
        CREATE POLICY "Users can update own notifications" ON notifications
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can delete own notifications') THEN
        CREATE POLICY "Users can delete own notifications" ON notifications
          FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- =========================================
-- 6. INDEXES FOR PERFORMANCE
-- =========================================
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_expires ON notifications(expires_at) WHERE expires_at IS NOT NULL;

-- =========================================
-- 7. TRIGGER FOR UPDATED_AT
-- =========================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_notifications_updated_at') THEN
        CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =========================================
-- MIGRATION COMPLETE
-- =========================================
-- This migration is safe to run multiple times
-- All operations use IF NOT EXISTS or ON CONFLICT DO NOTHING