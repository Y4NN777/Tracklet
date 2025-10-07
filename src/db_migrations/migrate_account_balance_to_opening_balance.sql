-- SAFE PRODUCTION MIGRATION: Add opening balance without destructive operations
-- This migration is safe for production as it doesn't drop any columns

-- Step 1: Add new opening_balance column (safe operation)
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS opening_balance DECIMAL(15,2) DEFAULT 0;

-- Step 2: Copy current balance to opening_balance for existing accounts
-- This preserves historical balance data as the immutable opening balance
UPDATE accounts SET opening_balance = COALESCE(balance, 0) WHERE opening_balance = 0;

-- Step 3: Add helpful comment for future developers
COMMENT ON COLUMN accounts.opening_balance IS 'The account balance when it was first created/imported. This represents historical balance before transactions in this app. Current balance = opening_balance + Σ(transactions)';
COMMENT ON COLUMN accounts.balance IS 'DEPRECATED: Use opening_balance for new calculations. Kept for backward compatibility during migration.';

-- IMPORTANT: The balance column is kept as backup for safety
-- After confirming everything works, you can safely drop it with:
-- ALTER TABLE accounts DROP COLUMN balance;

-- Verification query (run after migration):
-- SELECT id, name, balance, opening_balance FROM accounts LIMIT 5;