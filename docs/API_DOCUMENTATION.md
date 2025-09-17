# FinTrack API Documentation

## Overview

FinTrack provides a comprehensive REST API for financial management with both PATCH (partial updates) and PUT (complete replacements) support. The API follows RESTful conventions and uses JWT token authentication.

**Base URL:** `https://your-domain.com/api/v1`

**Authentication:** All endpoints require JWT tokens in the `Authorization` header.

## Quick Start

### Environment Configuration
Add to your `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

### Authentication
```bash
# Include JWT token in all requests
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     https://your-domain.com/api/v1/transactions
```

### Common Headers
```typescript
const headers = {
  'Authorization': `Bearer ${jwt_token}`,
  'Content-Type': 'application/json'
}
```

## API Client (Recommended)

FinTrack includes a centralized API client for easier development:

```typescript
import { api } from '@/lib/api-client';

// Simple usage - authentication handled automatically
const transactions = await api.getTransactions({ limit: 10 });
const newTransaction = await api.createTransaction({
  amount: 25.99,
  description: 'Coffee',
  type: 'expense',
  date: '2024-01-15'
});

// Error handling
if (transactions.error) {
  console.error('Failed to fetch:', transactions.error);
} else {
  console.log('Data:', transactions.data);
}
```

**Benefits:**
- ✅ Automatic JWT token handling
- ✅ Environment-based URL configuration
- ✅ Consistent error handling
- ✅ TypeScript support
- ✅ Centralized configuration

## API Endpoints Overview

| Entity | Collection Routes | Individual Routes |
|--------|------------------|-------------------|
| Transactions | `GET/POST /api/v1/transactions` | `GET/PATCH/PUT/DELETE /api/v1/transactions/[id]` |
| Accounts | `GET/POST /api/v1/accounts` | `GET/PATCH/PUT/DELETE /api/v1/accounts/[id]` |
| Categories | `GET/POST /api/v1/categories` | `GET/PATCH/PUT/DELETE /api/v1/categories/[id]` |
| Budgets | `GET/POST /api/v1/budgets` | `GET/PATCH/PUT/DELETE /api/v1/budgets/[id]` |
| Goals | `GET/POST /api/v1/goals` | `GET/PATCH/PUT/DELETE /api/v1/goals/[id]` |
| Notifications | `GET/POST /api/v1/notifications` | `PATCH/DELETE /api/v1/notifications/[id]` |
| Notification Preferences | `GET/PATCH /api/v1/notification-preferences` | N/A |
| Profile | `GET/PATCH /api/v1/profile` | N/A |

## API Client Methods

The API client provides convenient methods for all operations:

### Transactions
```typescript
// List with filtering
api.getTransactions({ limit: 10, type: 'expense' })

// CRUD operations
api.createTransaction(data)
api.getTransaction(id)
api.updateTransaction(id, data)
api.deleteTransaction(id)
```

### Accounts
```typescript
api.getAccounts()
api.createAccount(data)
api.getAccount(id)
api.updateAccount(id, data)
api.deleteAccount(id)
```

### Categories
```typescript
api.getCategories()
api.createCategory(data)
api.getCategory(id)
api.updateCategory(id, data)
api.deleteCategory(id)
```

### Budgets
```typescript
api.getBudgets({ include_progress: true })
api.createBudget(data)
api.getBudget(id, { include_progress: true })
api.updateBudget(id, data)
api.deleteBudget(id)
```

### Goals
```typescript
api.getGoals({ include_progress: true })
api.createGoal(data)
api.getGoal(id, { include_progress: true })
api.updateGoal(id, data)
api.deleteGoal(id)
```

### Notifications
```typescript
// List notifications with filtering and pagination
api.getNotifications({ limit: 10, read: 'false', type: 'budget_alert' })

// CRUD operations
api.createNotification(data)
api.updateNotification(id, data)
api.deleteNotification(id)

// Bulk operations
api.markAllNotificationsRead()
api.clearAllNotifications()
```

### Notification Preferences
```typescript
api.getNotificationPreferences()
api.updateNotificationPreferences(data)
```

### Profile
```typescript
api.getProfile()
api.updateProfile(data)
```

## Authentication

All API endpoints require authentication via Supabase JWT tokens.

### Getting a JWT Token
```typescript
// After user signs in with Supabase Auth
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token

// Use token in API requests
fetch('/api/v1/transactions', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### Token Validation
- Tokens are validated on every request
- Invalid/expired tokens return `401 Unauthorized`
- All database queries are automatically filtered by authenticated user

## HTTP Methods & Status Codes

### PATCH vs PUT Decision Guide

| Use Case | Method | Reason |
|----------|--------|---------|
| Update single field (e.g., transaction description) | PATCH | Efficient, mobile-friendly |
| Update multiple fields selectively | PATCH | Only sends changed data |
| Mobile app updates | PATCH | Bandwidth optimization |
| Bulk/admin operations | PUT | Complete control |
| Replace entire resource | PUT | Full replacement |

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET/PATCH/PUT requests |
| 201 | Created | Successful POST requests |
| 204 | No Content | Successful DELETE requests |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing/invalid JWT token |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server errors |

### Request/Response Format

All requests and responses use JSON format:

```typescript
// Request headers
{
  'Authorization': 'Bearer <jwt_token>',
  'Content-Type': 'application/json'
}

// Success response
{
  "data": { ... },
  "message": "Operation successful"
}

// Error response
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Method Implementation

#### PATCH (Recommended for most updates)
- ✅ **Partial Updates**: Send only changed fields
- ✅ **Efficient**: Reduced bandwidth usage
- ✅ **Mobile-First**: Perfect for mobile apps
- ✅ **Flexible**: Clients decide what to update

#### PUT (For complete replacements)
- ✅ **Complete Replacement**: Requires all fields
- ✅ **Idempotent**: Safe to call multiple times
- ✅ **Predictable**: Always returns complete resource
- ✅ **Admin-Friendly**: Full control over resources

## API Endpoints

### Transactions

#### GET /api/v1/transactions
Get all transactions for authenticated user with filtering and pagination.

**Query Parameters:**
```typescript
{
  limit?: number,        // Default: 50, Max: 100
  offset?: number,       // Default: 0
  category_id?: string,  // Filter by category
  account_id?: string,   // Filter by account
  type?: 'income' | 'expense' | 'transfer',  // Filter by type
  start_date?: string,   // YYYY-MM-DD
  end_date?: string      // YYYY-MM-DD
}
```

**Response:**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "amount": 25.99,
      "description": "Coffee purchase",
      "type": "expense",
      "date": "2024-01-15",
      "categories": {
        "id": "uuid",
        "name": "Food & Dining",
        "color": "#ef4444",
        "icon": "UtensilsCrossed"
      },
      "accounts": {
        "id": "uuid",
        "name": "Checking Account",
        "type": "checking"
      }
    }
  ]
}
```

#### POST /api/v1/transactions
Create a new transaction.

**Request:**
```json
{
  "amount": 25.99,
  "description": "Coffee purchase",
  "type": "expense",
  "date": "2024-01-15",
  "category_id": "uuid",     // Optional
  "account_id": "uuid"       // Optional
}
```

**Response (201 Created):**
```json
{
  "transaction": {
    "id": "uuid",
    "amount": 25.99,
    "description": "Coffee purchase",
    "type": "expense",
    "date": "2024-01-15",
    "category_id": "uuid",
    "account_id": "uuid",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /api/v1/transactions/[id]
Get a specific transaction by ID.

**Response:**
```json
{
  "transaction": {
    "id": "uuid",
    "amount": 25.99,
    "description": "Coffee purchase",
    "type": "expense",
    "date": "2024-01-15",
    "categories": { "name": "Food", "color": "#ef4444" },
    "accounts": { "name": "Checking", "type": "checking" }
  }
}
```

#### PATCH /api/v1/transactions/[id] (RECOMMENDED)
Partially update a transaction. Only send fields you want to change.

**Request:**
```json
{
  "description": "Updated coffee purchase",
  "amount": 30.50
}
```

**Response:**
```json
{
  "transaction": { ... },
  "message": "Transaction updated successfully",
  "updatedFields": ["description", "amount"]
}
```

#### PUT /api/v1/transactions/[id]
Replace entire transaction. Requires ALL required fields.

**Request:**
```json
{
  "amount": 30.50,
  "description": "Updated coffee purchase",
  "type": "expense",
  "date": "2024-01-15",
  "category_id": "uuid",
  "account_id": "uuid"
}
```

**Response:**
```json
{
  "transaction": { ... },
  "message": "Transaction replaced successfully"
}
```

#### DELETE /api/v1/transactions/[id]
Delete a transaction.

**Response (204 No Content):**
```json
{
  "message": "Transaction deleted successfully"
}
```

### Budgets

#### GET /api/v1/budgets
Get all budgets for authenticated user with optional progress calculation.

**Query Parameters:**
```typescript
{
  include_progress?: boolean  // Include calculated spending progress
}
```

**Response:**
```json
{
  "budgets": [
    {
      "id": "uuid",
      "name": "Monthly Food Budget",
      "amount": 500.00,
      "spent": 125.50,
      "period": "monthly",
      "start_date": "2024-01-01",
      "categories": {
        "name": "Food & Dining",
        "color": "#ef4444"
      },
      "spent": 125.50,
      "remaining": 374.50,
      "percentage": 25.1
    }
  ]
}
```

#### POST /api/v1/budgets
Create a new budget.

**Request:**
```json
{
  "name": "Monthly Food Budget",
  "amount": 500.00,
  "period": "monthly",
  "category_id": "uuid",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

**Response (201 Created):**
```json
{
  "budget": {
    "id": "uuid",
    "name": "Monthly Food Budget",
    "amount": 500.00,
    "period": "monthly",
    "start_date": "2024-01-01",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### PATCH /api/budgets/[id] (RECOMMENDED)
Partially update a budget
```typescript
// Request - Send only fields you want to update
{
  amount?: number,
  name?: string,
  // ... any other fields
}

// Response
{
  budget: Budget,
  message: "Budget updated successfully",
  updatedFields: ["amount"]
}
```

#### PUT /api/budgets/[id]
Replace entire budget (ADMIN/BULK)
```typescript
// Request - Must include ALL required fields
{
  name: string,
  amount: number,
  period: 'monthly' | 'weekly' | 'yearly',
  category_id?: string,
  start_date: string,
  end_date?: string
}

// Response
{
  budget: Budget,
  message: "Budget replaced successfully"
}
```

### Goals

#### GET /api/goals
Get all savings goals with optional progress
```typescript
// Query parameters
{
  include_progress?: boolean  // Include completion progress
}

// Response
{
  goals: Goal[]
}
```

#### POST /api/goals
Create a new savings goal
```typescript
// Request
{
  name: string,
  target_amount: number,
  current_amount?: number,  // Default: 0
  target_date?: string,     // YYYY-MM-DD
  description?: string
}

// Response
{
  goal: Goal
}
```

#### PATCH /api/goals/[id] (RECOMMENDED)
Partially update a goal
```typescript
// Request - Send only fields you want to update
{
  current_amount?: number,
  target_date?: string,
  // ... any other fields
}

// Response
{
  goal: Goal,
  message: "Goal updated successfully",
  updatedFields: ["current_amount"]
}
```

#### PUT /api/goals/[id]
Replace entire goal (ADMIN/BULK)
```typescript
// Request - Must include ALL required fields
{
  name: string,
  target_amount: number,
  current_amount?: number,
  target_date?: string,
  description?: string
}

// Response
{
  goal: Goal,
  message: "Goal replaced successfully"
}
```

### Notifications

#### GET /api/v1/notifications
Get all notifications for authenticated user with filtering and pagination.

**Query Parameters:**
```typescript
{
  limit?: number,        // Default: 50, Max: 100
  offset?: number,       // Default: 0
  read?: 'true' | 'false',  // Filter by read status
  type?: string          // Filter by notification type (e.g., 'budget_alert')
}
```

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "title": "Budget Alert",
      "message": "You have exceeded your monthly food budget",
      "data": { "budget_id": "uuid", "amount": 150.00 },
      "read_at": null,
      "action_url": "/budgets/uuid",
      "expires_at": "2024-02-01T00:00:00Z",
      "created_at": "2024-01-15T10:30:00Z",
      "notification_types": {
        "name": "budget_alert",
        "display_name": "Budget Alert",
        "description": "Alerts when budget limits are approached or exceeded",
        "icon": "alert-triangle",
        "color": "#ef4444",
        "priority": "high"
      }
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

#### POST /api/v1/notifications
Create a new notification.

**Request:**
```json
{
  "type": "budget_alert",
  "title": "Budget Alert",
  "message": "You have exceeded your monthly food budget",
  "data": { "budget_id": "uuid", "amount": 150.00 },
  "action_url": "/budgets/uuid",
  "expires_at": "2024-02-01T00:00:00Z"
}
```

**Response (201 Created):**
```json
{
  "notification": {
    "id": "uuid",
    "title": "Budget Alert",
    "message": "You have exceeded your monthly food budget",
    "data": { "budget_id": "uuid", "amount": 150.00 },
    "action_url": "/budgets/uuid",
    "expires_at": "2024-02-01T00:00:00Z",
    "created_at": "2024-01-15T10:30:00Z",
    "notification_types": {
      "name": "budget_alert",
      "display_name": "Budget Alert",
      "description": "Alerts when budget limits are approached or exceeded",
      "icon": "alert-triangle",
      "color": "#ef4444",
      "priority": "high"
    }
  }
}
```

#### PATCH /api/v1/notifications/[id]
Update a notification. Only send fields you want to change.

**Request:**
```json
{
  "read": true,
  "title": "Updated Budget Alert"
}
```

**Response:**
```json
{
  "notification": { ... },
  "message": "Notification updated successfully",
  "updatedFields": ["read", "title"]
}
```

#### DELETE /api/v1/notifications/[id]
Delete a notification.

**Response (204 No Content):**
```json
{
  "message": "Notification deleted successfully"
}
```

#### POST /api/v1/notifications/mark-all-read
Mark all unread notifications as read.

**Response:**
```json
{
  "message": "Marked 5 notifications as read",
  "markedCount": 5,
  "readAt": "2024-01-15T10:30:00Z"
}
```

#### DELETE /api/v1/notifications/clear-all
Delete all notifications for the user.

**Response:**
```json
{
  "message": "Cleared 25 notifications",
  "clearedCount": 25
}
```

### Notification Preferences

#### GET /api/v1/notification-preferences
Get notification preferences for the authenticated user.

**Response:**
```json
{
  "notificationPreferences": {
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
}
```

#### PATCH /api/v1/notification-preferences
Update notification preferences. Only send fields you want to change.

**Request:**
```json
{
  "budgetAlerts": {
    "enabled": false,
    "thresholds": [90, 100]
  },
  "emailNotifications": {
    "enabled": true,
    "digest": "weekly"
  }
}
```

**Response:**
```json
{
  "notificationPreferences": { ... },
  "message": "Notification preferences updated successfully",
  "updatedFields": ["budgetAlerts", "emailNotifications"]
}
```

### Profile

#### GET /api/v1/profile
Get current user profile with preferences and settings.

**Response:**
```json
{
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://...",
    "preferences": {
      "theme": "system",
      "currency": "USD",
      "dateFormat": "MM/DD/YYYY",
      "notifications": {
        "budgetAlerts": true,
        "goalReminders": true
      }
    },
    "terms_accepted": true,
    "terms_accepted_at": "2024-01-15T10:30:00Z",
    "onboarding_step": 3,
    "onboarding_completed": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

#### PATCH /api/v1/profile
Update user profile and preferences. Only send fields you want to change.

**Request:**
```json
{
  "full_name": "Jane Doe",
  "preferences": {
    "theme": "dark",
    "currency": "EUR",
    "notifications": {
      "budgetAlerts": false
    }
  },
  "terms_accepted": true,
  "terms_accepted_at": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Jane Doe",
    "preferences": {
      "theme": "dark",
      "currency": "EUR",
      "dateFormat": "MM/DD/YYYY",
      "notifications": {
        "budgetAlerts": false,
        "goalReminders": true
      }
    },
    "terms_accepted": true,
    "terms_accepted_at": "2024-01-15T10:30:00Z"
  },
  "message": "Profile updated successfully",
  "updatedFields": ["full_name", "preferences", "terms_accepted", "terms_accepted_at"]
}
```

### Accounts

#### GET /api/accounts
Get all accounts for authenticated user
```typescript
// Response
{
  accounts: Account[]
}
```

#### POST /api/accounts
Create a new account
```typescript
// Request
{
  name: string,
  type: 'checking' | 'savings' | 'credit' | 'investment',
  balance?: number,     // Default: 0
  currency?: string     // Default: 'USD'
}

// Response
{
  account: Account
}
```

#### GET /api/accounts/[id]
Get specific account
```typescript
// Response
{
  account: Account
}
```

#### PATCH /api/accounts/[id] (RECOMMENDED)
Partially update an account
```typescript
// Request - Send only fields you want to update
{
  name?: string,
  type?: 'checking' | 'savings' | 'credit' | 'investment',
  balance?: number,
  currency?: string
}

// Response
{
  account: Account,
  message: "Account updated successfully",
  updatedFields: ["balance"]
}
```

#### PUT /api/accounts/[id]
Replace entire account (ADMIN/BULK)
```typescript
// Request - Must include ALL required fields
{
  name: string,
  type: 'checking' | 'savings' | 'credit' | 'investment',
  balance?: number,
  currency?: string
}

// Response
{
  account: Account,
  message: "Account replaced successfully"
}
```

#### DELETE /api/accounts/[id]
Delete an account
```typescript
// Response
{
  message: "Account deleted successfully"
}
```

### Categories

#### GET /api/categories
Get all categories for authenticated user
```typescript
// Response
{
  categories: Category[]
}
```

#### POST /api/categories
Create a new category
```typescript
// Request
{
  name: string,
  type: 'income' | 'expense',
  color?: string,     // Default: '#6366f1'
  icon?: string       // Default: '📊'
}

// Response
{
  category: Category
}
```

#### GET /api/categories/[id]
Get specific category
```typescript
// Response
{
  category: Category
}
```

#### PATCH /api/categories/[id] (RECOMMENDED)
Partially update a category
```typescript
// Request - Send only fields you want to update
{
  name?: string,
  type?: 'income' | 'expense',
  color?: string,
  icon?: string
}

// Response
{
  category: Category,
  message: "Category updated successfully",
  updatedFields: ["color"]
}
```

#### PUT /api/categories/[id]
Replace entire category (ADMIN/BULK)
```typescript
// Request - Must include ALL required fields
{
  name: string,
  type: 'income' | 'expense',
  color?: string,
  icon?: string
}

// Response
{
  category: Category,
  message: "Category replaced successfully"
}
```

#### DELETE /api/categories/[id]
Delete a category
```typescript
// Response
{
  message: "Category deleted successfully"
}
```

## Data Types

### Transaction
```typescript
interface Transaction {
  id: string
  user_id: string
  account_id?: string
  category_id?: string
  amount: number
  description: string
  type: 'income' | 'expense' | 'transfer'
  date: string
  created_at: string
  updated_at: string
  categories?: {
    id: string
    name: string
    color: string
    icon: string
  }
  accounts?: {
    id: string
    name: string
    type: string
  }
}
```

### Budget
```typescript
interface Budget {
  id: string
  user_id: string
  name: string
  category_id?: string
  amount: number
  spent: number
  period: 'monthly' | 'weekly' | 'yearly'
  start_date: string
  end_date?: string
  created_at: string
  updated_at: string
  categories?: {
    id: string
    name: string
    color: string
    icon: string
  }
}
```

### Goal
```typescript
interface Goal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  target_date?: string
  description?: string
  created_at: string
  updated_at: string
}
```

### Account
```typescript
interface Account {
  id: string
  user_id: string
  name: string
  type: 'checking' | 'savings' | 'credit' | 'investment'
  balance: number
  currency: string
  created_at: string
  updated_at: string
}
```

### Notification
```typescript
interface Notification {
  id: string
  user_id: string
  type_id: string
  title: string
  message?: string
  data: Record<string, any>
  read_at?: string
  action_url?: string
  expires_at?: string
  created_at: string
  updated_at: string
  notification_types?: {
    name: string
    display_name: string
    description?: string
    icon: string
    color: string
    priority: 'low' | 'normal' | 'high' | 'critical'
  }
}
```

### NotificationType
```typescript
interface NotificationType {
  id: string
  name: string
  display_name: string
  description?: string
  icon: string
  color: string
  priority: 'low' | 'normal' | 'high' | 'critical'
  created_at: string
}
```

### Category
```typescript
interface Category {
  id: string
  user_id: string
  name: string
  type: 'income' | 'expense'
  color: string
  icon: string
  created_at: string
  updated_at: string
}
```

## Error Handling

### Common Error Responses
```typescript
// 400 Bad Request
{
  error: "No valid fields provided for update"
}

// 401 Unauthorized
{
  error: "Unauthorized"
}

// 404 Not Found
{
  error: "Transaction not found"
}

// 500 Internal Server Error
{
  error: "Internal server error"
}
```

## Pagination & Filtering

### Pagination
All list endpoints support pagination:
```typescript
GET /api/v1/transactions?limit=20&offset=40
```

### Filtering Examples
```typescript
// Filter by date range
GET /api/v1/transactions?start_date=2024-01-01&end_date=2024-01-31

// Filter by category and account
GET /api/v1/transactions?category_id=uuid&account_id=uuid

// Filter by transaction type
GET /api/v1/transactions?type=expense

// Combine filters
GET /api/v1/transactions?type=expense&start_date=2024-01-01&limit=10
```

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per user
- **Headers:** Rate limit info included in responses
- **Reset:** Automatic reset every 15 minutes

## SDK Examples

### JavaScript/TypeScript
```typescript
// Initialize API client
const api = {
  baseURL: '/api/v1',
  token: localStorage.getItem('jwt_token'),

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, { ...options, headers });
    return response.json();
  }
};

// Usage
const transactions = await api.request('/transactions?limit=10');
const newTransaction = await api.request('/transactions', {
  method: 'POST',
  body: JSON.stringify({
    amount: 25.99,
    description: 'Coffee',
    type: 'expense',
    date: '2024-01-15'
  })
});
```

### React Hook Example
```typescript
function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async (filters = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/v1/transactions?${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTransactions(data.transactions);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData) => {
    const response = await fetch('/api/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionData)
    });
    const data = await response.json();
    setTransactions(prev => [data.transaction, ...prev]);
    return data.transaction;
  };

  return { transactions, loading, fetchTransactions, createTransaction };
}
```

## Usage Examples

### Mobile App: Update Transaction Description
```typescript
// PATCH - Efficient for mobile
fetch('/api/v1/transactions/123', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: "Updated coffee purchase"
  })
})
```

### Admin: Bulk Update Budget
```typescript
// PUT - Complete control
fetch('/api/v1/budgets/456', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Monthly Food Budget",
    amount: 600.00,
    period: "monthly",
    category_id: "food-cat-id",
    start_date: "2024-01-01"
  })
})
```

## Best Practices

### When to Use PATCH:
- ✅ Single field updates
- ✅ Mobile applications
- ✅ Limited bandwidth scenarios
- ✅ User-driven partial edits

### When to Use PUT:
- ✅ Bulk operations
- ✅ Admin interfaces
- ✅ Complete resource replacement
- ✅ Data import/export scenarios

### General Guidelines:
- Use PATCH for user-facing features
- Use PUT for admin/batch operations
- Always validate input data
- Return meaningful error messages
- Include updated fields in PATCH responses

## API Versioning

- **Current Version:** v1 (`/api/v1/`)
- **Versioning Strategy:** URL path versioning
- **Backward Compatibility:** Maintained within major versions
- **Deprecation:** 6-month notice for breaking changes

## Changelog

### v1.0.0 (Current)
- ✅ Initial release with full CRUD operations
- ✅ JWT token authentication
- ✅ Row Level Security (RLS)
- ✅ Comprehensive filtering and pagination
- ✅ Rate limiting (100 req/15min)
- ✅ TypeScript interfaces for all entities

### v1.0.0 (Current)
- ✅ Profile management endpoints (`GET/PATCH /api/v1/profile`)
- ✅ User preferences persistence in database
- ✅ OAuth terms acceptance flow
- ✅ Settings database integration
- ✅ GDPR-compliant user data handling
- ✅ Notification system with full CRUD operations
- ✅ Notification preferences management
- ✅ Bulk notification operations (mark all read, clear all)
- ✅ Notification filtering and pagination
- ✅ Real-time notification type system

### Planned Features
- 🔄 WebSocket real-time updates
- 📊 Advanced analytics endpoints
- 💰 Multi-currency support
- 📱 Mobile app API optimizations
- 🔍 Advanced search and filtering

## Support

### Common Issues

**401 Unauthorized:**
- Check JWT token is valid and not expired
- Ensure `Authorization: Bearer <token>` header is included

**404 Not Found:**
- Verify resource ID exists and belongs to authenticated user
- Check endpoint URL is correct

**400 Bad Request:**
- Validate request body matches API schema
- Check required fields are included

### Getting Help

- **Documentation:** This API documentation
- **Architecture:** See `architecture.md` for system overview
- **Issues:** Check server logs for detailed error messages
- **Rate Limits:** Monitor `X-RateLimit-*` headers

---

**Last Updated:** September 2025
**API Version:** v1.0.0