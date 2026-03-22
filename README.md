# Groundlink NGO Dashboard

AI-powered dashboard that helps NGOs and social organizations convert unstructured field reports into actionable insights.

## Features

- **AI-Powered Report Processing**: Convert unstructured field reports into structured data using Groq's llama-3.3-70b model
- **Automatic Prioritization**: Reports are automatically prioritized based on severity and people affected
- **Volunteer Matching**: Intelligent volunteer recommendations with transparent reasoning
- **Clean Dashboard Interface**: Dark mode, minimal design with smooth transitions
- **Demo Data**: Pre-loaded sample data for easy exploration

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js Route Handlers
- **AI Processing**: Groq API (llama-3.3-70b-versatile)
- **Storage**: Firebase Firestore (optional)
- **Testing**: Vitest, fast-check (property-based testing), React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Groq API key (get one at https://console.groq.com)

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
4. Add your Groq API key to `.env.local`:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Project Structure

```
groundlink/
├── app/                      # Next.js App Router
│   ├── api/                  # API Route Handlers
│   │   ├── process-report/   # Report processing endpoint
│   │   └── match-volunteers/ # Volunteer matching endpoint
│   ├── dashboard/            # Dashboard page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/               # React components
├── lib/                      # Utility functions and demo data
├── types/                    # TypeScript type definitions
├── tests/                    # Test files
│   ├── unit/                 # Unit tests
│   └── property/             # Property-based tests
├── .env.local.example        # Environment variables template
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── vitest.config.ts          # Vitest configuration
```

## API Endpoints

### POST /api/process-report

Process a field report and extract structured data.

**Request:**

```json
{
  "reportText": "Field report text..."
}
```

**Response:**

```json
{
  "location": "string",
  "issues": ["string"],
  "severity": 1-5,
  "people_affected": number,
  "priority_reason": "string",
  "recommended_help": ["string"],
  "priority_score": number
}
```

### POST /api/match-volunteers

Match volunteers to a report based on skills and location.

**Request:**

```json
{
  "report": {
    "location": "string",
    "issues": ["string"],
    "recommended_help": ["string"]
  },
  "volunteers": [
    {
      "id": "string",
      "name": "string",
      "skills": ["string"],
      "location": "string",
      "availability": boolean
    }
  ]
}
```

**Response:**

```json
{
  "matches": [
    {
      "volunteer": { ... },
      "match_score": number,
      "reasoning": "string"
    }
  ]
}
```

## License

ISC
