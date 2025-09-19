# FinTrack - AI-Powered Personal Finance Management Solution

A fully open-source personal finance management application designed to help users track spending, set budgets, and achieve financial goals with optional AI-powered insights.

[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC.svg)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-336791.svg)](https://supabase.com)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4.svg)](https://ai.google)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-orange.svg)](https://github.com/Y4NN777/FinTrack)
[![Contributors](https://img.shields.io/github/contributors/Y4NN777/FinTrack)](https://github.com/Y4NN777/FinTrack/graphs/contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Y4NN777/FinTrack/pulls)

## Overview

<img width="400" height="761" alt="image" src="https://github.com/user-attachments/assets/323b2569-4221-4299-9848-bb3746549a0e" />
<img width="400" height="761" alt="image" src="https://github.com/user-attachments/assets/94e008cf-579e-4bc3-8cf5-14f597aff336" />

FinTrack is a sophisticated personal finance management system built on a modern full-stack architecture. By combining a responsive Next.js frontend with a robust Supabase backend and Google Gemini AI capabilities, FinTrack provides comprehensive financial management tools with interactive AI-powered financial guidance.

The system includes AI-powered forms where users can input their financial information to receive personalized insights and recommendations, alongside comprehensive transaction tracking, budgeting, and goal-setting features.

## My Story & Mission

**FinTrack was born from personal struggle and a vision to help others in the same situation like me.** As a developer who personally always struggled with personal financial management ( Even before becoming a developer), I realized that most existing finance apps I used didn't help me a lot (may be the problem was me. I respect and worth developers work a lot). So I was thinking about building my own when I started to grow as a dev but I was hesitating. After observing similar challenges among my peers, roommates, and younger people in my campus and community ( Burkina Faso, Ouagadougou), I realized this may be a widespread problem that needed a modern solution.

**That's why I started to built FinTrack** - a comprehensive, AI-powered personal finance management system designed to make financial management accessible, understandable, and effective for everyone. By combining cutting-edge technology with practical financial guidance, FinTrack not only helps users track their money but provides the insights and recommendations needed to truly improve their financial health.

**Our mission is simple**: To empower individuals with the tools and knowledge they need to take control of their finances, break free from financial stress, and build a more secure financial future. Whether you're a student managing your first budget, a young professional building wealth, or anyone seeking better financial clarity, FinTrack is here to help.

**Join us in making personal finance management simpler, smarter, and more accessible for all.**

---

##  How to Contribute

FinTrack is an **open-source project** that welcomes contributions! Whether you're a developer, designer, or financial expert, you can help improve FinTrack.

- **Fix Issues**: Help us resolve bugs and improve stability
- **Add Features**: Implement new financial tools and enhancements
- **Improve Docs**: Enhance documentation and create tutorials
- **UI/UX**: Improve the user interface and experience
- **Testing**: Add tests and ensure code quality

**[Get Started Contributing →](#-contributing-to-fintrack)** | **[View Issues →](https://github.com/Y4NN777/FinTrack/issues)**

---

## Key Features

### Core Financial Management

- Transaction Tracking: Comprehensive income and expense tracking with category-based organization

- Category Management: User-driven transaction categorization with predefined category options

<img width="559" height="301" alt="image" src="https://github.com/user-attachments/assets/0cc7ffa7-ec43-49f4-9268-d1350e6ae6ab" />

---


- Category Management: User-driven transaction categorization with predefined category options
<img width="559" height="301" alt="image" src="https://github.com/user-attachments/assets/1c19f5f6-293d-49e6-87bf-aee012bfd7ea" />

---


- Budget Management: Intuitive budget creation and monitoring with progress visualization

- Goal Setting: Financial goal tracking with progress indicators and milestone celebrations

<img width="559" height="301" alt="image" src="https://github.com/user-attachments/assets/7a04d67e-07c5-46f5-9bac-9c6b97724ebc" />

---


- Dashboard Overview: Real-time financial health metrics with spending trends and net worth analysis
<img width="559" height="301" alt="image" src="https://github.com/user-attachments/assets/3b9e6fe1-e345-4e43-a4c8-ae97aceb1a9d" />

 ---

### AI-Powered Intelligence

- AI Financial Advisoring: Interactive forms for personalized financial guidance (Savings opportunities and Insights)

<img width="429" height="401" alt="image" src="https://github.com/user-attachments/assets/9b9c32e7-e0e7-4fd7-bcc3-a261f7e64089" />
<img width="429" height="301" alt="image" src="https://github.com/user-attachments/assets/52fd44fa-ed6b-4e91-b3b8-14e95d21678f" />

---

- Learning Center: Educational chatbot with 7 structured learning themes covering personal finance basics (English/French bilingual support)
<img width="766" height="501" alt="image" src="https://github.com/user-attachments/assets/e3795a1d-e05a-4c7c-a2ca-c77b0c51333d" />




### Advanced Capabilities

- Multi-Currency Support: Manage finances in multiple currencies

<div>
      <img width="400" height="400" src="https://github.com/user-attachments/assets/c6aa1980-77e6-466f-bd30-7e2f03dcf3fa" />
</div>


- Responsive Design: Mobile-first approach with optimized experience across all devices
<img width="759" height="501" alt="image" src="https://github.com/user-attachments/assets/0bd4f485-ca8e-4c41-a6b4-da8d9c186864" />


- Secure Authentication: JWT-based authentication with secure session management

- Data Export: Export financial data in multiple formats (CSV, Excel XLSX, PDF) with user currency support


<img width="360" height="275" alt="image" src="https://github.com/user-attachments/assets/3ed11d32-f4df-4a23-a025-8356681151d6" />



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

- **Supabase Client**: Direct database operations with PostgreSQL

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
│   │   │   ├── learning/             # Learning Center chatbot
│   │   │   ├── page.tsx              # Learning Center page
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

The database schema is managed through Supabase directly. The project includes SQL migration files in the `src/db_migrations/` directory:

- `database-schema.sql` - Main database schema
- `database-notification-migration.sql` - Notification system tables
- `database-user-preference-migration.sql` - User preferences tables

To set up the database:
1. Create a new Supabase project at https://supabase.com
2. Run the SQL files in your Supabase SQL editor in the following order:
   - `database-schema.sql`
   - `database-notification-migration.sql`
   - `database-user-preference-migration.sql`
3. Configure your environment variables as shown in step 3

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
- **Context Providers**: Notification system, User preferences, and Theme management
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
- Notification system management
- Data validation and sanitization
- Error handling and logging

**ai/flows/**: AI Workflows

- Financial insights generation
- Savings opportunities analysis
- Prompt engineering and optimization
- Response validation and formatting

**lib/actions/notifications/**: Notification System

- Real-time notification delivery
- User preference management
- Budget alerts and reminders
- Background job processing
- Browser notification integration

**app/**: Frontend Routing

- Page components with server-side data fetching
- Client-side state management
- Responsive UI implementation
- Accessibility compliance

##  Contributing to FinTrack

We welcome contributions from developers of all skill levels! FinTrack is an open-source project that benefits from community involvement. Whether you're fixing bugs, adding features, improving documentation, or suggesting ideas, your contributions are valuable.

###  Quick Start for Contributors

1. **Fork & Clone**: Fork the repository and clone it locally
2. **Setup Environment**: Follow the installation guide above
3. **Pick an Issue**: Check [GitHub Issues](https://github.com/Y4NN777/FinTrack/issues) for good first issues
4. **Create Branch**: Use descriptive branch names (e.g., `feature/add-budget-categories`)
5. **Make Changes**: Implement your feature or fix
6. **Test Thoroughly**: Ensure your changes work as expected
7. **Submit PR**: Create a pull request with a clear description

###  Contribution Guidelines

#### Development Standards
- **Code Quality**: TypeScript with strict type checking and ESLint compliance
- **Component Design**: Reusable, accessible UI components following shadcn/ui patterns
- **Documentation**: Comprehensive JSDoc comments and README updates
- **Financial Accuracy**: Validated financial calculations with proper error handling
- **Testing**: Unit tests for critical financial logic
- **Performance**: Optimized queries and efficient state management

#### Code Style
- Use TypeScript for all new code
- Follow the existing naming conventions
- Keep components small and focused
- Use meaningful commit messages
- Write clear, concise comments

#### Areas for Contribution
-  **Bug Fixes**: Help us squash bugs and improve stability
-  **New Features**: Add financial tools, improve UX, enhance AI capabilities
-  **Mobile Optimization**: Improve responsive design and mobile experience
-  **UI/UX Improvements**: Enhance visual design and user experience
-  **Documentation**: Improve docs, add examples, create tutorials
-  **Testing**: Add unit tests, integration tests, and E2E tests
-  **Internationalization**: Add support for new languages
-  **Artificial Intelligence Integration Enhancement**: Leverage GenAI for more powerful and real time data driven management 

### Contribution Process

1. **Choose an Issue**: Look for issues labeled `good first issue` or `help wanted`
2. **Discuss First**: For major changes, open an issue to discuss your approach
3. **Fork & Branch**: Create a feature branch from `main`
4. **Implement**: Write clean, well-tested code
5. **Test**: Ensure all tests pass and add new tests if needed
6. **Document**: Update documentation for any new features
7. **Pull Request**: Submit a PR with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Test results

### Recognition

Contributors will be:
- Listed in the repository contributors
- Mentioned in release notes
- Featured in our community showcase
- Eligible for special recognition badges

###  Getting Help

- **Issues**: [GitHub Issues](https://github.com/Y4NN777/FinTrack/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Y4NN777/FinTrack/discussions)




### Contribution Process

1. **Choose an Issue**: Look for issues labeled `good first issue` or `help wanted`
2. **Discuss First**: For major changes, open an issue to discuss your approach
3. **Fork & Branch**: Create a feature branch from `main`
4. **Implement**: Write clean, well-tested code
5. **Test**: Ensure all tests pass and add new tests if needed
6. **Document**: Update documentation for any new features
7. **Pull Request**: Submit a PR with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Test results

### Recognition

Contributors will be:
- Listed in the repository contributors
- Mentioned in release notes
- Featured in our community showcase
- Eligible for special recognition badges

###  Getting Help

- **Issues**: [GitHub Issues](https://github.com/Y4NN777/FinTrack/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Y4NN777/FinTrack/discussions)
- **Discord**: Join our community chat (coming soon)


---

**Ready to contribute?** Start with issues labeled `good first issue` and let's build something amazing together! 

I started it solo but I believe it can goes far with others developers wanting to support this cause 

## License & Attribution

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for complete terms.

## Project Maintainer

- **The Y4NN**
- **Email**: y4nn.dev@gmail.com
- **LinkedIn**: [Ragnang-Newende Yanis Axel DABO](https://www.linkedin.com/in/y4nnthedev777)

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
- **Query Optimization**: Efficient database queries with Supabase
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

1. **Database Connection**: Ensure your Supabase project is properly configured and accessible.

    ```bash
    # Check Supabase connection by visiting your project dashboard
    # Verify environment variables are correctly set
    echo $NEXT_PUBLIC_SUPABASE_URL
    echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
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

