# Groundlink Project Structure

This document provides an overview of the project structure and organization.

## Directory Structure

```
groundlink/
├── app/                          # Next.js App Router (main application)
│   ├── api/                      # API Route Handlers
│   │   ├── process-report/       # POST endpoint for processing field reports
│   │   │   └── route.ts          # Groq AI integration for report processing
│   │   └── match-volunteers/     # POST endpoint for volunteer matching
│   │       └── route.ts          # Volunteer matching algorithm
│   ├── dashboard/                # Dashboard page
│   │   └── page.tsx              # Main dashboard interface
│   ├── layout.tsx                # Root layout with dark mode
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles with Tailwind CSS
│
├── components/                   # React components (to be populated)
│   └── .gitkeep                  # Placeholder for future components
│
├── lib/                          # Utility functions and shared code
│   ├── demo-data.ts              # Sample reports and volunteers for testing
│   └── utils.ts                  # Utility functions (cn for className merging)
│
├── types/                        # TypeScript type definitions
│   └── index.ts                  # All data models and interfaces
│
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   │   ├── .gitkeep              # Placeholder
│   │   └── setup.test.ts         # Test setup verification
│   ├── property/                 # Property-based tests (fast-check)
│   │   └── .gitkeep              # Placeholder
│   └── setup.ts                  # Test configuration and setup
│
├── .kiro/                        # Kiro spec files
│   └── specs/
│       └── groundlink-ngo-dashboard/
│           ├── requirements.md   # Project requirements
│           ├── design.md         # Design document
│           └── tasks.md          # Task list
│
├── node_modules/                 # Dependencies (not tracked in git)
│
├── .env.local.example            # Environment variables template
├── .gitignore                    # Git ignore rules
├── next.config.ts                # Next.js configuration
├── package.json                  # Project dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration for Tailwind
├── README.md                     # Project documentation
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── vitest.config.ts              # Vitest test runner configuration
└── PROJECT_STRUCTURE.md          # This file
```

## Key Files

### Configuration Files

- **tsconfig.json**: TypeScript compiler configuration with strict mode enabled
- **tailwind.config.ts**: Tailwind CSS v4 configuration with content paths
- **next.config.ts**: Next.js configuration (currently minimal)
- **vitest.config.ts**: Test runner configuration with jsdom environment
- **postcss.config.mjs**: PostCSS configuration for Tailwind CSS processing

### Application Files

- **app/layout.tsx**: Root layout with dark mode and metadata
- **app/page.tsx**: Landing page with product introduction
- **app/dashboard/page.tsx**: Main dashboard (placeholder for future implementation)
- **app/api/process-report/route.ts**: API endpoint for report processing
- **app/api/match-volunteers/route.ts**: API endpoint for volunteer matching

### Type Definitions

- **types/index.ts**: Contains all TypeScript interfaces:
  - FieldReportInput
  - StructuredReport
  - Volunteer
  - VolunteerMatch
  - DemoData
  - APIError
  - GroqResponse

### Utilities

- **lib/demo-data.ts**: Sample data for testing and demonstration
  - 4 sample field reports
  - 8 sample volunteers with varied skills and locations
- **lib/utils.ts**: Utility functions for className merging (shadcn/ui pattern)

## Technology Stack

### Core Framework

- **Next.js 16.2.1**: React framework with App Router
- **React 19.2.4**: UI library
- **TypeScript 5.9.3**: Type-safe JavaScript

### Styling

- **Tailwind CSS 4.2.2**: Utility-first CSS framework
- **@tailwindcss/postcss**: PostCSS plugin for Tailwind v4
- **clsx & tailwind-merge**: Utility for merging class names

### AI & Backend

- **groq-sdk 1.1.1**: Groq API client for AI processing
- **firebase 12.11.0**: Optional backend services (Firestore)

### Testing

- **vitest 4.1.0**: Fast test runner with TypeScript support
- **fast-check 4.6.0**: Property-based testing library
- **@testing-library/react 16.3.2**: React component testing utilities
- **@testing-library/jest-dom 6.9.1**: Custom Jest matchers for DOM
- **jsdom 29.0.1**: DOM implementation for Node.js

## NPM Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run Next.js linter
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Environment Variables

Required environment variables (see `.env.local.example`):

- **GROQ_API_KEY**: API key for Groq AI service (required)
- **NEXT*PUBLIC_FIREBASE*\***: Firebase configuration (optional)

## Next Steps

The following components and features will be implemented in subsequent tasks:

1. **API Implementation**: Complete Groq API integration and volunteer matching logic
2. **UI Components**: Build dashboard components using shadcn/ui
3. **Report Processing**: Implement field report submission and processing
4. **Volunteer Matching**: Implement volunteer recommendation system
5. **Testing**: Write comprehensive unit and property-based tests
6. **Demo Data Integration**: Connect demo data to UI

## Development Workflow

1. Start development server: `npm run dev`
2. Make changes to files in `app/`, `components/`, or `lib/`
3. View changes at http://localhost:3000
4. Write tests in `tests/unit/` or `tests/property/`
5. Run tests: `npm test`
6. Build for production: `npm run build`

## Notes

- The project uses Next.js App Router (not Pages Router)
- Dark mode is enabled by default in the root layout
- All API routes are serverless functions
- TypeScript strict mode is enabled for type safety
- Tests use Vitest (not Jest) for better TypeScript support
- Property-based tests will use fast-check library
