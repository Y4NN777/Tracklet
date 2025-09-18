-- =========================================
-- CLEAN USER PREFERENCES MIGRATION
-- =========================================

-- Step 1: Create backup of existing preferences (recommended)
CREATE TABLE IF NOT EXISTS user_preferences_backup AS
SELECT id, preferences, NOW() as backed_up_at
FROM user_profiles
WHERE preferences IS NOT NULL;

-- Step 2: Reset ALL preferences to new clean structure
UPDATE user_profiles
SET preferences = '{
  "theme": "system",
  "currency": "USD",
  "dateFormat": "MM/DD/YYYY",
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
      "minAmount": 100,
      "unusualSpending": true
    },
    "emailNotifications": {
      "enabled": false,
      "digest": "daily"
    }
  }
}'::jsonb;

-- Step 3: Restore theme, currency, dateFormat from backup if they existed
UPDATE user_profiles
SET preferences = jsonb_build_object(
  'theme', COALESCE(user_preferences_backup.preferences->>'theme', 'system'),
  'currency', COALESCE(user_preferences_backup.preferences->>'currency', 'USD'),
  'dateFormat', COALESCE(user_preferences_backup.preferences->>'dateFormat', 'MM/DD/YYYY'),
  'notifications', user_profiles.preferences->'notifications'
)
FROM user_preferences_backup
WHERE user_profiles.id = user_preferences_backup.id;

-- Step 4: Restore simple notification boolean settings from backup
UPDATE user_profiles
SET preferences = jsonb_set(
  jsonb_set(user_profiles.preferences, '{notifications,budgetAlerts,enabled}',
    COALESCE(user_preferences_backup.preferences->'notifications'->'budgetAlerts', 'true')),
  '{notifications,goalReminders,enabled}',
  COALESCE(user_preferences_backup.preferences->'notifications'->'goalReminders', 'true')
)
FROM user_preferences_backup
WHERE user_profiles.id = user_preferences_backup.id;

-- Step 5: Verify migration worked
SELECT
  id,
  preferences->>'theme' as theme,
  preferences->>'currency' as currency,
  preferences->'notifications'->'transactionAlerts'->'enabled' as transaction_alerts_enabled,
  preferences->'notifications'->'budgetAlerts'->'thresholds' as budget_thresholds
FROM user_profiles
LIMIT 10;

-- Optional: Drop backup table after verification
-- DROP TABLE user_preferences_backup;