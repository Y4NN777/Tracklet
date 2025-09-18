# FinTrack - AI-Powered Personal Finance Manager

A fully open-source personal finance management application designed to help users track spending, set budgets, and achieve financial goals with optional AI-powered insights.

[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC.svg)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-336791.svg)](https://supabase.com)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4.svg)](https://ai.google)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-orange.svg)](https://github.com/Y4NN777/FinTrack)

## Overview

<img width="400" height="761" alt="image" src="https://github.com/user-attachments/assets/323b2569-4221-4299-9848-bb3746549a0e" />
<img width="400" height="761" alt="image" src="https://github.com/user-attachments/assets/94e008cf-579e-4bc3-8cf5-14f597aff336" />

FinTrack is a sophisticated personal finance management system built on a modern full-stack architecture. By combining a responsive Next.js frontend with a robust Supabase backend and Google Gemini AI capabilities, FinTrack provides comprehensive financial management tools with interactive AI-powered financial guidance.

The system includes AI-powered forms where users can input their financial information to receive personalized insights and recommendations, alongside comprehensive transaction tracking, budgeting, and goal-setting features.

## Key Features

### Core Financial Management

- Transaction Tracking: Comprehensive income and expense tracking with category-based organization

- Category Management: User-driven transaction categorization with predefined category options

- Budget Management: Intuitive budget creation and monitoring with progress visualization

- Goal Setting: Financial goal tracking with progress indicators and milestone celebrations

- Dashboard Overview: Real-time financial health metrics with spending trends and net worth analysis

### AI-Powered Intelligence

- AI Financial Advisoring: Interactive forms for personalized financial guidance ( Savings opportunities and Insights)

### Advanced Capabilities

- Multi-Currency Support: Manage finances in multiple currencies

- Responsive Design: Mobile-first approach with optimized experience across all devices

- Secure Authentication: JWT-based authentication with secure session management

- Data Export: Export financial data in multiple formats (CSV, Excel XLSX, PDF) with user currency support


## Technical Architecture

### Full-Stack Implementation Stack

#### Frontend Layer

- **Next.js 15**: React-based framework with App Router and Server Components

- **TypeScript 5.0**: Type-safe development with enhanced developer experience

- **Tailwind CSS 3.0**: Utility-first CSS framework for responsive design

- **shadcn/ui**: Reusable component library built on Radix UI primitives

- **React Hook Form**: Performant, flexible forms with easy validation

- **Zod**: TypeScript-first schema declaration and validation

#### Backend Layer

- **Node.js**: JavaScript runtime for server-side development

- **Express.js**: Minimalist web framework for RESTful APIs

- **Supabase**: PostgreSQL-compatible database with real-time capabilities

- **Prisma**: Next-generation ORM for database operations

- **JWT**: Secure token-based authentication

- **Google Genkit**: Framework for building AI-powered applications

#### AI Integration

- **Google Gemini**: State-of-the-art language models for financial analysis

- **Genkit Flows**: Structured AI workflows for consistent results

- **Prompt Engineering**: Optimized prompts for financial domain expertise

### Application Architecture

- Component-Based Design: Reusable UI components with consistent styling
- Server Actions: Secure server-side mutations with validation
- API Routes: RESTful endpoints for data operations
- Database Schema: Normalized relational structure for financial data

### Infrastructure & Deployment

- Environment Management: dotenv for configuration management
- Version Control: Git-based development workflow
- CI/CD Pipeline: Automated testing and deployment workflows

## System Workflow

```text
User Interaction → Frontend Processing → API Requests → Database Operations → AI Analysis → Response Generation → UI Update
      ↓                ↓                   ↓              ↓                   ↓              ↓                 ↓
 Financial Data   Form Validation    RESTful API     PostgreSQL        Google Gemini    JSON Response    Real-time UI
 Management       & Client State     Endpoints       Transactions      AI Processing    with Data        Updates
```

## Project Structure

```text
FinTrack/
├── src/
│   ├── app/                          # Next.js App Router structure
│   │   ├── (app)/                    # Main application pages
│   │   │   ├── accounts/             # Account management interface
│   │   │   ├── budgets/              # Budget management interface
│   │   │   ├── insights/             # AI insights dashboard
│   │   │   ├── page.tsx              # Dashboard page
│   │   │   ├── responsive-layout.tsx # Responsive layout component
│   │   │   ├── savings/              # Savings recommendations
│   │   │   ├── settings/             # User profile and settings
│   │   │   │   ├── categories/       # Category management
│   │   │   │   └── profile/          # Profile settings
│   │   │   ├── transactions/         # Transaction tracking
│   │   │   └── layout.tsx            # Application layout
│   │   ├── (auth)/                   # Authentication pages
│   │   │   ├── forgot-password/      # Password reset
│   │   │   ├── login/                # Login page
│   │   │   ├── signup/               # Signup page
│   │   │   └── layout.tsx            # Auth layout
│   │   ├── (onboarding)/             # Onboarding flow
│   │   │   ├── onboarding/           # Main onboarding
│   │   │   ├── terms/                # Terms acceptance
│   │   │   └── layout.tsx            # Onboarding layout
│   │   ├── api/v1/                   # REST API endpoints
│   │   │   ├── accounts/             # Account CRUD operations
│   │   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── budgets/              # Budget CRUD operations
│   │   │   ├── categories/           # Category CRUD operations
│   │   │   ├── goals/                # Savings goals CRUD
│   │   │   ├── notifications/        # Notification system
│   │   │   ├── notification-preferences/ # User preferences
│   │   │   ├── profile/              # Profile management
│   │   │   ├── transactions/         # Transaction CRUD
│   │   │   └── diagnostic/           # System diagnostics
│   │   ├── auth/                     # Auth callback handling
│   │   ├── logout/                   # Logout handling
│   │   ├── globals.css               # Global styles
│   │   ├── icon.ico                  # App icon
│   │   └── layout.tsx                # Root layout
│   ├── ai/                           # AI integration components
│   │   ├── flows/                    # Genkit AI workflows
│   │   │   ├── financial-insights.ts # Financial analysis
│   │   │   └── savings-opportunities.ts # Savings recommendations
│   │   ├── dev.ts                    # Development configuration
│   │   └── genkit.ts                 # Genkit initialization
│   ├── components/                   # Reusable UI components
│   │   ├── ui/                       # shadcn/ui components
│   │   └── *.tsx                     # Custom components
│   ├── contexts/                     # React contexts
│   │   ├── notification-context.tsx  # Notification state
│   │   └── preferences-context.tsx   # User preferences
│   ├── db_migrations/                # Database schema files
│   │   ├── database-notification-migration.sql
│   │   ├── database-schema.sql
│   │   └── database-user-preference-migration.sql
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-mobile.tsx            # Mobile detection
│   │   ├── use-preferences.ts        # Preferences management
│   │   └── use-toast.ts              # Toast notifications
│   ├── lib/                          # Utility functions and services
│   │   ├── actions/                  # Server actions
│   │   │   ├── insights.ts           # AI insights
│   │   │   ├── notifications.ts      # Notification logic
│   │   │   └── savings.ts            # Savings calculations
│   │   ├── api-client.ts             # API client
│   │   ├── dashboard-service.ts      # Dashboard data service
│   │   ├── financial-calculations.ts # Financial utilities
│   │   ├── supabase.ts               # Supabase client
│   │   ├── supabase-admin.ts         # Admin Supabase client
│   │   └── utils.ts                  # Helper functions
│   ├── middleware.ts                 # Next.js middleware
│   └── scripts/                      # Utility scripts
│       ├── notification-job.ts       # Background notification job
│       └── trigger-notification.sh   # Notification trigger script
├── docs/                             # Project documentation
│   ├── API_DOCUMENTATION.md          # Complete API reference
│   ├── ARCHITECTURE.md               # System architecture
├── .env.local                        # Environment variables (local)
├── .env.local.example                # Environment template
├── .gitignore                        # Version control exclusions
├── components.json                   # shadcn/ui configuration
├── LICENSE                           # MIT License
├── next-env.d.ts                     # Next.js TypeScript types
├── next.config.mjs                   # Next.js configuration
├── package-lock.json                 # NPM lock file
├── package.json                      # Project dependencies
├── postcss.config.mjs                # PostCSS configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── tsconfig.tsbuildinfo              # TypeScript build info
└── README.md                         # Project documentation
```

## Installation & Configuration

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier available)
- Google Cloud account with Gemini API access (optional - for AI features)
- Git version control

#### Setup Instructions

##### 1. Repository Setup

```bash
git clone https://github.com/Y4NN777/FinTrack.git
cd FinTrack
```

##### 2. Dependency Installation

```bash
npm install
```

##### 3. Environment Configuration

Create `.env.local` file with required API credentials:

```env
# Supabase Configuration
# Get these from https://supabase.com/dashboard → Your Project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Google OAuth (Optional - for Google sign-in)
# Get these from https://console.cloud.google.com → APIs & Services → Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_API_KEY=your-google-ai-studio-api-key

# Application Settings
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
NEXTAUTH_URL=http://localhost:9002
NEXTAUTH_SECRET=your-random-secret-here

# Development
NODE_ENV=development
```

##### 4. Database Setup

```bash
# Run database migrations
npx prisma migrate dev --name init

# Seed initial data (optional)
npx prisma db seed
```

##### 5. AI Services Initialization (Optional)

```bash
# Start Genkit development server (only needed for AI features)
npm run genkit:dev
```

##### 6. Application Launch

```bash
# Development server
npm run dev

# Production build
npm run build
npm start
```

Access the application at `http://localhost:9002`

## Development & Architecture

### Component Architecture

#### Frontend Components

- **Form Components**: AccountForm, TransactionForm, BudgetForm, GoalForm, CategoryForm with validation
- **Data Display**: Charts, tables, progress indicators, and financial dashboards
- **Navigation**: Responsive sidebar, mobile bottom navigation, and header components
- **UI Elements**: Cards, dialogs, dropdowns, and interactive components
- **Context Providers**: Notification, Preferences, and Theme management
- **Custom Hooks**: Mobile detection, preferences management, and toast notifications

#### AI Integration

```bash
# Access AI development environment
npm run genkit:dev
```

### Core Services

**lib/actions/**: Server-Side Operations

- Financial data CRUD operations
- AI service integration
- Data validation and sanitization
- Error handling and logging

**ai/flows/**: AI Workflows

- Financial insights generation
- Savings opportunities analysis
- Prompt engineering and optimization
- Response validation and formatting

**app/**: Frontend Routing

- Page components with server-side data fetching
- Client-side state management
- Responsive UI implementation
- Accessibility compliance

## Contributing Guidelines

### Development Standards

- **Code Quality**: TypeScript with strict type checking
- **Component Design**: Reusable, accessible UI components
- **Documentation**: Comprehensive function and component documentation
- **Financial Accuracy**: Validated financial calculations and representations

### Contribution Process

1. Fork repository and create feature branch
2. Implement financial features or improvements
3. Add unit tests for new functionality
4. Update documentation and examples
5. Submit pull request with detailed description

## License & Attribution

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for complete terms.

## Project Maintainer

Ragnang Newende Yanis Axel DABO
Email: y4nn.dev@gmail.com
LinkedIn: [Ragnang-Newende Yanis Axel DABO](https://www.linkedin.com/in/y4nnthedev777)

## Acknowledgments

### Technology Partners

- **Google AI**: Gemini API and GenKit for financial analysis
- **Supabase**: Database and real-time infrastructure
- **shadcn/ui**: Open Source Component library foundation

### Financial Domain Expertise

- Financial professionals providing domain validation
- Personal finance literature and knowledge base contributors
- Open-source financial management initiatives

## Support & Documentation

Issues: [GitHub Issues Tracker](https://github.com/Y4NN777/FinTrack/issues)
Documentation: Comprehensive guides in `/docs` directory
Community: Developer discussions and Q&A
API Reference: Complete endpoint documentation

## Roadmap & Future Development

### Currently Implemented Features

- **Account Management**: Full CRUD operations for bank accounts, credit cards, and investment accounts with real-time balance calculations

- **Category Management**: Customizable income and expense categories with color coding and icons

- **Transaction Tracking**: Comprehensive income and expense tracking with category-based organization and account association

- **Budget Management**: Budget creation and monitoring with progress visualization and spending alerts

- **Goal Setting**: Financial goal tracking with progress indicators and milestone celebrations

- **Dashboard Overview**: Real-time financial health metrics with spending trends and net worth analysis

- **AI Financial ing**: Interactive forms for personalized financial guidance and recommendations

- **Multi-Currency Support**: Manage finances in multiple currencies with automatic conversion

- **Responsive Design**: Mobile-first approach with optimized experience across all devices

- **Secure Authentication**: JWT-based authentication with Supabase and OAuth integration

- **User Profile Management**: Comprehensive settings for preferences, themes, and account management

- **Data Export**: Export financial data in multiple formats (CSV, Excel XLSX, PDF) with user currency support

- **Real-time Notifications**: Intelligent alert system with user-configurable preferences and browser notifications

- **Real-time Updates**: Live synchronization of financial data across all components

- **Enhanced Terms Flow**: Dual-mode terms acceptance supporting both OAuth and regular signup users

### Planned Features (Not Yet Implemented)

- [ ] **Forgot Password**: Password reset functionality via email
- [ ] **Email Notifications**: Email-based notification delivery system
- [ ] **Delete Account**: User account deletion with data cleanup
- [ ] **AI Spending Analysis**: Automatic analysis of transaction patterns and spending behavior
- [ ] **AI Savings Recommendations**: Intelligent suggestions based on actual spending data
- [ ] **Investment Tracking**: Portfolio management and performance analysis
- [ ] **Bill Reminders**: Automated payment reminders and due date tracking
- [ ] **Financial Reports**: Comprehensive monthly and annual financial reports
- [ ] **Family Accounts**: Shared financial management for households
- [ ] **Real Assets Integration**: Integration with real assets app through uniform and normalized API
- [ ] **Automatic system language detection and switching for better UX**

### Planned Perfomance optimization

#### Frontend Optimization

- **Code Splitting**: Dynamic imports for route-based code splitting
- **Image Optimization**: Next.js Image component for responsive images
- **Bundle Analysis**: Webpack Bundle Analyzer for size optimization
- **Caching Strategies**: Client-side caching for improved UX

#### Backend Optimization

- **Database Indexing**: Strategic indexing for financial queries
- **Query Optimization**: Efficient database queries with Prisma
- **Connection Pooling**: Database connection management
- **API Caching**: Response caching for frequently accessed data

#### AI Service Optimization

- **Prompt Caching**: Cache optimized prompts for consistent results
- **Rate Limiting**: API usage management to prevent quota exhaustion
- **Response Validation**: Ensure AI responses meet quality standards
- **Fallback Mechanisms**: Graceful degradation for AI service failures



### System Expansion

- [ ] **Mobile Applications**: Native iOS/Android implementations
- [ ] **Blockchain Integration**: Direct bank account synchronization
- [ ] **Financial Institution API**: Integration with major banks and financial services
- [ ] **Regulatory Compliance**: Financial data protection and privacy standards
- [ ] **Advanced Analytics**: Predictive modeling and financial forecasting

## Troubleshooting

### Common Development Issues

If the application encounters issues during development, consider the following:

1. **Database Connection**: Ensure PostgreSQL is running and credentials are correct.

   ```bash
   # Check PostgreSQL service status
   sudo systemctl status postgresql
   
   # Verify database connection
   psql -U fintrack_user -d fintrack -c "SELECT version();"
   ```

2. **Environment Variables**: Verify that all required environment variables are correctly set.

   ```bash
   # Check if environment variables are set
   echo $DATABASE_URL
   echo $GOOGLE_API_KEY
   ```

3. **Google API Key**: Ensure the Google API key is valid and has access to the Gemini API.
   - Check the Google Cloud Console for API key validity
   - Verify Gemini API is enabled in your project

4. **Dependency Issues**: Ensure all dependencies are correctly installed.

   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

5. **Port Conflicts**: Ensure the development server port is available.

   ```bash
   # Check if port 3000 is in use
   lsof -i :3000
   ```

6. **Logs and Monitoring**: Check application logs for more detailed error information.

   ```bash
   # Check Next.js development server logs
   npm run dev
   ```

---

Financial Management Disclaimer: FinTrack provides tools and insights to help manage personal finances more effectively. This system enhances financial awareness but does not constitute financial advice, investment recommendations, or tax guidance. Always consult qualified financial professionals for important financial decisions.

