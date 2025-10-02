-- =========================================
-- NOTIFICATION DUPLICATE PREVENTION MIGRATION
-- Safe to run multiple times - uses IF NOT EXISTS
-- =========================================

-- Add unique indexes to prevent duplicate notifications within time windows
-- These constraints work as a safety net for the application-level duplicate prevention

-- Budget alerts: Prevent duplicates within 2 hours (cron runs hourly)
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_unique_budget_alerts
ON notifications (user_id, type_id, (data->>'budget_id'), (data->>'threshold'))
WHERE created_at > NOW() - INTERVAL '2 hours'
AND type_id = (SELECT id FROM notification_types WHERE name = 'budget_alert');

-- Goal reminders: Prevent duplicates within 8 hours (weekly reminders)
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_unique_goal_reminders
ON notifications (user_id, type_id, (data->>'goal_id'), (data->>'type'))
WHERE created_at > NOW() - INTERVAL '8 hours'
AND type_id = (SELECT id FROM notification_types WHERE name = 'goal_reminder');

-- Transaction alerts: Prevent duplicates within 25 hours (24h + buffer)
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_unique_transaction_alerts
ON notifications (user_id, type_id, (data->>'transaction_id'), (data->>'type'))
WHERE created_at > NOW() - INTERVAL '25 hours'
AND type_id = (SELECT id FROM notification_types WHERE name = 'transaction_alert');

-- =========================================
-- MIGRATION COMPLETE
-- =========================================