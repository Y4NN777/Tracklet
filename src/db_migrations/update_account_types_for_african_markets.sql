-- =========================================
-- Update Account Types for African Markets
-- Adds support for mobile money, cash, business funds, and other African financial practices
-- =========================================

-- Drop the existing constraint first
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_type_check;

-- Convert existing 'checking' accounts to 'bank_account' for better clarity
UPDATE accounts SET type = 'bank_account' WHERE type = 'checking';

-- Add the new CHECK constraint with all account types
ALTER TABLE accounts ADD CONSTRAINT accounts_type_check
CHECK (type IN ('bank_account', 'savings', 'credit', 'investment', 'mobile_money', 'cash', 'business_fund', 'other'));

-- Add comment to document the account types
COMMENT ON COLUMN accounts.type IS 'Account type: bank_account (traditional banking), savings (savings accounts), credit (credit cards), investment (investment accounts), mobile_money (Orange Money, MTN MoMo, etc.), cash (physical cash), business_fund (small business capital), other (miscellaneous)';

-- Verify the migration worked
-- SELECT type, COUNT(*) FROM accounts GROUP BY type ORDER BY type;