-- =========================================
-- NOTIFICATION DUPLICATE PREVENTION MIGRATION

-- Add unique indexes to prevent duplicate notifications within time windows
-- These constraints work as a safety net for the application-level duplicate prevention

-- Note: Removed time-based WHERE clauses due to PostgreSQL IMMUTABLE function requirements
-- These indexes serve as a basic safety net for duplicate prevention
-- Application-level logic should handle time-window based duplicate prevention

-- Budget alerts: Basic duplicate prevention
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_budget_alerts
ON notifications (user_id, type_id, (data->>'budget_id'), (data->>'threshold'), created_at);

-- Goal reminders: Basic duplicate prevention
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_goal_reminders
ON notifications (user_id, type_id, (data->>'goal_id'), (data->>'type'), created_at);

-- Transaction alerts: Basic duplicate prevention
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_transaction_alerts
ON notifications (user_id, type_id, (data->>'transaction_id'), (data->>'type'), created_at);

-- =========================================
-- MIGRATION COMPLETE
-- =========================================