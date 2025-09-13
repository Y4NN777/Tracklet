# FinTrack Architecture & Data Flow

## Overview

FinTrack follows a modern client-server architecture using Next.js with API Routes, Supabase as the backend, and React for the frontend. This document explains the system architecture, data flow patterns, and API design principles.

## 🏗️ System Architecture

### Client-Server Separation

```
┌─────────────────┐    HTTP Requests    ┌─────────────────┐
│   React Client  │◄──────────────────►│  Next.js Server │
│   (Browser)     │                     │  (API Routes)   │
└─────────────────┘                     └─────────────────┘
                                               │
                                               ▼
                                    ┌─────────────────┐
                                    │   Supabase      │
                                    │  PostgreSQL     │
                                    └─────────────────┘
```

### Key Components

- **Frontend:** React components with client-side state management
- **Backend:** Next.js API Routes handling HTTP requests
- **Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication:** Supabase Auth with JWT tokens

## 🔄 Data Flow Patterns

### 1. Authentication Flow

```
1. User Login → Google OAuth → Supabase Auth
2. JWT Token Generated → Stored in Client
3. All API Requests → Include JWT Token
4. Server Validates Token → Extracts User ID
5. Database Queries → Filtered by User ID (RLS)
```

### 2. CRUD Operations Flow (Direct fetch)

#### Create (POST)
```
React Form → fetch(POST /api/v1/entity) → Next.js API Route → Supabase Insert → Response → UI Update
```

#### Read (GET)
```
Page Load → fetch(GET /api/v1/entity) → Next.js API Route → Supabase Select → JSON Response → React State Update
```

#### Update (PATCH/PUT)
```
Edit Form → fetch(PATCH /api/v1/entity/[id]) → Next.js API Route → Supabase Update → Response → UI Update
```

#### Delete (DELETE)
```
Delete Action → fetch(DELETE /api/v1/entity/[id]) → Next.js API Route → Supabase Delete → Success Response → UI Update
```

### 3. API Client Pattern (Recommended)

For better maintainability, use the centralized API client:

```typescript
import { api } from '@/lib/api-client';

// Instead of manual fetch calls
const response = await api.getTransactions({ limit: 10 });

// Automatic authentication, error handling, and URL configuration
if (response.error) {
  // Handle error
} else {
  setTransactions(response.data.transactions);
}
```

**Benefits:**
- ✅ Environment-based URL configuration (`NEXT_PUBLIC_API_BASE_URL`)
- ✅ Automatic JWT token management
- ✅ Consistent error handling
- ✅ TypeScript support
- ✅ Centralized configuration

## 📁 API Route Structure

### Collection Routes (`/route`)

Handle operations on collections of resources:

```
GET  /api/v1/transactions  → List all transactions for user
POST /api/v1/transactions  → Create new transaction

GET  /api/v1/accounts      → List all accounts for user
POST /api/v1/accounts      → Create new account

GET  /api/v1/categories    → List all categories for user
POST /api/v1/categories    → Create new category
```

### Individual Routes (`/[id]`)

Handle operations on specific resources:

```
GET    /api/v1/transactions/[id]  → Get one transaction
PATCH  /api/v1/transactions/[id]  → Update one transaction
PUT    /api/v1/transactions/[id]  → Replace one transaction
DELETE /api/v1/transactions/[id]  → Delete one transaction

GET    /api/v1/accounts/[id]      → Get one account
PATCH  /api/v1/accounts/[id]      → Update one account
DELETE /api/v1/accounts/[id]      → Delete one account
```

## 🗄️ Database Schema & Relationships

### Core Tables

```sql
user_profiles (extends auth.users)
├── id (UUID, references auth.users)
├── email, full_name, avatar_url
└── preferences (JSONB)

accounts
├── id (UUID, primary key)
├── user_id (references user_profiles)
├── name, type, balance, currency
└── created_at, updated_at

categories
├── id (UUID, primary key)
├── user_id (references user_profiles)
├── name, type (income/expense), color, icon
└── created_at, updated_at

transactions
├── id (UUID, primary key)
├── user_id (references user_profiles)
├── account_id (references accounts)
├── category_id (references categories)
├── amount, description, type, date
└── created_at, updated_at

budgets
├── id (UUID, primary key)
├── user_id (references user_profiles)
├── category_id (references categories)
├── name, amount, period, start_date, end_date
└── spent (calculated), created_at, updated_at

savings_goals
├── id (UUID, primary key)
├── user_id (references user_profiles)
├── name, target_amount, current_amount, target_date
└── description, created_at, updated_at
```

### Relationships

```
User (1)
├── Accounts (many)
├── Categories (many)
├── Transactions (many)
├── Budgets (many)
└── Savings Goals (many)

Transaction (many-to-1)
├── Account (1)
└── Category (1)

Budget (many-to-1)
└── Category (1)
```

## 🔐 Security & Authentication

### JWT Token Authentication

All API routes (except auth endpoints) require JWT tokens:

```typescript
// Client sends requests with Authorization header
fetch('/api/v1/transactions', {
  headers: {
    'Authorization': `Bearer ${jwt_token}`,
    'Content-Type': 'application/json'
  }
})

// Server validates token
const authHeader = request.headers.get('authorization')
const token = authHeader.substring(7) // Remove 'Bearer '
const { data: { user } } = await supabase.auth.getUser(token)
```

### Row Level Security (RLS)

All database queries are automatically filtered by user:

```sql
-- Policies ensure users only see their own data
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT USING (auth.uid() = user_id);
```

## 📊 Data Validation & Error Handling

### Request Validation

```typescript
// Input validation on server
if (!amount || !type || !date) {
  return NextResponse.json(
    { error: 'Missing required fields' },
    { status: 400 }
  )
}
```

### Error Response Format

```json
{
  "error": "Unauthorized"
}

{
  "error": "Transaction not found"
}

{
  "transaction": { ... },
  "message": "Transaction updated successfully",
  "updatedFields": ["amount", "description"]
}
```

## 🚀 Performance Optimizations

### Database Indexes

```sql
-- Optimized for common queries
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_accounts_user ON accounts(user_id);
```

### Query Optimization

- **Joins:** Related data fetched in single queries
- **Pagination:** Large datasets paginated with limit/offset
- **Filtering:** Server-side filtering reduces data transfer
- **Caching:** API responses cached where appropriate

## 🔄 State Management

### Client-Side State

```typescript
// React components manage local state
const [transactions, setTransactions] = useState([])
const [loading, setLoading] = useState(true)

// Effects handle data fetching
useEffect(() => {
  fetchTransactions()
}, [])
```

### Server State Synchronization

- **Optimistic Updates:** UI updates immediately, then syncs with server
- **Error Recovery:** Failed requests revert UI changes
- **Loading States:** User feedback during async operations

## 📱 Mobile Responsiveness

### Responsive Design

- **Mobile-First:** Components designed for mobile screens
- **Progressive Enhancement:** Enhanced features on larger screens
- **Touch-Friendly:** Appropriate button sizes and spacing

### Data Optimization

- **Lazy Loading:** Components load data as needed
- **Pagination:** Mobile-friendly data chunks
- **Offline Support:** Service worker for basic offline functionality

## 🧪 Testing Strategy

### API Testing

- **Unit Tests:** Individual API route functions
- **Integration Tests:** Full request/response cycles
- **Authentication Tests:** Token validation and RLS

### Component Testing

- **UI Tests:** Component rendering and interactions
- **Data Flow Tests:** API integration and state updates
- **Error Handling Tests:** Network failures and validation

## 🚀 Deployment & Scaling

### Environment Configuration

```bash
# Development
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Production
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Monitoring

- **Error Tracking:** Sentry for client and server errors
- **Performance:** Vercel Analytics for user metrics
- **Database:** Supabase dashboard for query performance

## 📚 API Reference

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint specifications.

## 🔧 Development Workflow

1. **Frontend Development:** React components with TypeScript
2. **API Development:** Next.js API routes with proper error handling
3. **Database Changes:** Supabase migrations with RLS policies
4. **Testing:** Unit and integration tests for reliability
5. **Deployment:** Automated CI/CD with Vercel

This architecture provides a scalable, secure, and maintainable foundation for the FinTrack application.