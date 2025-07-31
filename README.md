# FinTrack - AI-Powered Personal Finance Manager

**A smart personal finance management application powered by Google Gemini AI, designed to help users track spending, set budgets, and achieve financial goals with intelligent insights.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC.svg)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](https://postgresql.org)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4.svg)](https://ai.google)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-orange.svg)](https://github.com/Y4NN777/FinTrack)

## Overview

<img width="400" height="761" alt="image" src="https://github.com/user-attachments/assets/323b2569-4221-4299-9848-bb3746549a0e" />
<img width="400" height="761" alt="image" src="https://github.com/user-attachments/assets/94e008cf-579e-4bc3-8cf5-14f597aff336" />

FinTrack is a sophisticated personal finance management system built on a modern full-stack architecture. By combining a responsive Next.js frontend with a robust PostgreSQL backend and Google Gemini AI capabilities, FinTrack provides intelligent financial insights and recommendations to help users achieve their financial goals.

The system leverages advanced natural language processing and financial analysis capabilities to generate personalized savings opportunities and spending insights, ensuring both accuracy and relevance in financial guidance.

## Key Features

### Core Financial Management

- **💰 Transaction Tracking**: Comprehensive income and expense tracking with category-based organization
- **📊 Budget Management**: Intuitive budget creation and monitoring with progress visualization
- **🎯 Goal Setting**: Financial goal tracking with progress indicators and milestone celebrations
- **📈 Dashboard Overview**: Real-time financial health metrics with spending trends and net worth analysis

### AI-Powered Intelligence

- **🤖 Financial Insights**: AI-generated analysis of spending patterns and financial behaviors
- **💡 Savings Recommendations**: Personalized suggestions for optimizing expenses and increasing savings
- **🔮 Spending Predictions**: Forecasting tools based on historical financial data
- **🧠 Intelligent Categorization**: Automatic transaction categorization using machine learning

### Advanced Capabilities

- **💱 Multi-Currency Support**: Manage finances in multiple currencies with automatic conversion
- **📱 Responsive Design**: Mobile-first approach with optimized experience across all devices
- **🔒 Secure Authentication**: JWT-based authentication with secure session management
- **📤 Data Export**: Export financial data in CSV format for external analysis

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
- **PostgreSQL 15**: Advanced open-source relational database
- **Prisma**: Next-generation ORM for database operations
- **JWT**: Secure token-based authentication
- **Google Genkit**: Framework for building AI-powered applications

#### AI Integration

- **Google Gemini**: State-of-the-art language models for financial analysis
- **Genkit Flows**: Structured AI workflows for consistent results
- **Prompt Engineering**: Optimized prompts for financial domain expertise

### 🌐 Application Architecture

- **Component-Based Design**: Reusable UI components with consistent styling
- **Server Actions**: Secure server-side mutations with validation
- **API Routes**: RESTful endpoints for data operations
- **Database Schema**: Normalized relational structure for financial data

### ☁️ Infrastructure & Deployment

- **Docker**: Containerization for consistent development environments
- **Environment Management**: dotenv for configuration management
- **Version Control**: Git-based development workflow
- **CI/CD Pipeline**: Automated testing and deployment workflows

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
│   ├── app/                    # Next.js App Router structure
│   │   ├── (app)/              # Main application pages
│   │   │   ├── budgets/        # Budget management interface
│   │   │   ├── insights/       # AI insights dashboard
│   │   │   ├── savings/        # Savings recommendations
│   │   │   ├── settings/       # User profile and settings
│   │   │   ├── transactions/   # Transaction tracking
│   │   │   └── layout.tsx      # Application layout
│   │   └── (auth)/             # Authentication pages
│   ├── ai/                     # AI integration components
│   │   ├── flows/              # Genkit AI workflows
│   │   ├── dev.ts              # Development configuration
│   │   └── genkit.ts           # Genkit initialization
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Utility functions and services
│   │   ├── actions/            # Server actions
│   │   └── utils.ts            # Helper functions
│   └── hooks/                  # Custom React hooks
├── docs/                       # Project documentation
├── public/                     # Static assets
├── styles/                     # Global CSS files
├── .env                        # Environment variables
├── .gitignore                 # Version control exclusions
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── README.md                  # Project documentation
```

## Installation & Configuration

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 15+ database
- Google Cloud account with Gemini API access
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

Create `.env` file with required API credentials:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/fintrack

# Google Genkit Configuration
GOOGLE_API_KEY=your_google_api_key

# Authentication
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=24h

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

##### 4. Database Setup

```bash
# Run database migrations
npx prisma migrate dev --name init

# Seed initial data (optional)
npx prisma db seed
```

##### 5. AI Services Initialization

```bash
# Start Genkit development server
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

Access the application at `http://localhost:3000`

## Development & Architecture

### Component Architecture

#### Frontend Components

- **Form Components**: TransactionForm, BudgetForm, GoalForm with validation
- **Data Display**: Charts, tables, and progress indicators
- **Navigation**: Sidebar, header, and mobile navigation
- **UI Elements**: Cards, dialogs, and interactive components

#### AI Integration

```bash
# Access AI development environment
npm run genkit:dev
```

### Core Services

**📁 lib/actions/**: Server-Side Operations

- Financial data CRUD operations
- AI service integration
- Data validation and sanitization
- Error handling and logging

**🧠 ai/flows/**: AI Workflows

- Financial insights generation
- Savings opportunities analysis
- Prompt engineering and optimization
- Response validation and formatting

**🌐 app/**: Frontend Routing

- Page components with server-side data fetching
- Client-side state management
- Responsive UI implementation
- Accessibility compliance

## Production Deployment

### Infrastructure Configuration

#### Database Setup

```sql
-- PostgreSQL database creation
CREATE DATABASE fintrack;
CREATE USER fintrack_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE fintrack TO fintrack_user;
```

#### Environment Variables

```bash
export DATABASE_URL="postgresql://fintrack_user:secure_password@production-db:5432/fintrack"
export GOOGLE_API_KEY="production_google_api_key"
export JWT_SECRET="production_secure_jwt_secret"
export NODE_ENV="production"
```

#### Process Management

```bash
# Using PM2 for process management
npm install -g pm2
pm2 start npm --name "fintrack" -- start
pm2 startup
pm2 save
```

## Performance Optimization

### Frontend Optimization

- **Code Splitting**: Dynamic imports for route-based code splitting
- **Image Optimization**: Next.js Image component for responsive images
- **Bundle Analysis**: Webpack Bundle Analyzer for size optimization
- **Caching Strategies**: Client-side caching for improved UX

### Backend Optimization

- **Database Indexing**: Strategic indexing for financial queries
- **Query Optimization**: Efficient database queries with Prisma
- **Connection Pooling**: Database connection management
- **API Caching**: Response caching for frequently accessed data

### AI Service Optimization

- **Prompt Caching**: Cache optimized prompts for consistent results
- **Rate Limiting**: API usage management to prevent quota exhaustion
- **Response Validation**: Ensure AI responses meet quality standards
- **Fallback Mechanisms**: Graceful degradation for AI service failures

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

**Ragnang Newende Yanis Axel DABO**  
📧 Email: <axeldaboworkplace@gmail.com>  
🔗 LinkedIn: [Ragnang Newende Yanis Axel](https://www.linkedin.com/in/y4nnthedev777)

## Acknowledgments

### Technology Partners

- **Google AI**: Gemini API for financial analysis
- **Vercel**: Hosting and deployment platform
- **PlanetScale**: Database infrastructure (alternative option)
- **shadcn/ui**: Component library foundation

### Financial Domain Expertise

- Financial professionals providing domain validation
- Personal finance literature and knowledge base contributors
- Open-source financial management initiatives

## Support & Documentation

**📋 Issues**: [GitHub Issues Tracker](https://github.com/Y4NN777/FinTrack/issues)  
**📖 Documentation**: Comprehensive guides in `/docs` directory  
**💬 Community**: Developer discussions and Q&A  
**🔧 API Reference**: Complete endpoint documentation

## Roadmap & Future Development

### Planned Features

- [ ] **Investment Tracking**: Portfolio management and performance analysis
- [ ] **Bill Reminders**: Automated payment reminders and due date tracking
- [ ] **Financial Reports**: Comprehensive monthly and annual financial reports
- [ ] **Tax Integration**: Tax preparation assistance and deduction tracking
- [ ] **Family Accounts**: Shared financial management for households

### System Expansion

- [ ] **Mobile Applications**: Native iOS/Android implementations
- [ ] **Bank Integration**: Direct bank account synchronization
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

**💰 Financial Management Disclaimer**: FinTrack provides tools and insights to help manage personal finances more effectively. This system enhances financial awareness but does not constitute financial advice, investment recommendations, or tax guidance. Always consult qualified financial professionals for important financial decisions.
