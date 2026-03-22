# Design Document: Groundlink NGO Dashboard

## Overview

Groundlink is an AI-powered dashboard application that transforms unstructured field reports from NGO workers into actionable insights. The system leverages Groq's llama-3.3-70b model to extract structured data from free-form text, automatically prioritizes community needs based on severity and impact, and recommends optimal volunteer allocation with transparent reasoning.

The application follows a simple request-response architecture where field reports are submitted through a web interface, processed by AI to extract structured information, prioritized using a calculated score, and matched with available volunteers. The system emphasizes transparency by providing clear reasoning for both prioritization and volunteer matching decisions.

Key capabilities:

- AI-powered extraction of structured data from unstructured field reports
- Automatic prioritization based on severity and people affected
- Intelligent volunteer matching with explainable recommendations
- Clean, dark-mode dashboard interface for NGO coordinators
- Demo data for easy exploration and testing

## Architecture

The system uses Next.js 14 with App Router, implementing a modern full-stack architecture where the frontend and backend coexist in a single application.

### High-Level Architecture

```mermaid
graph TB
    User[NGO Coordinator] --> UI[Next.js Frontend]
    UI --> ProcessAPI[/api/process-report]
    UI --> MatchAPI[/api/match-volunteers]
    ProcessAPI --> GroqAPI[Groq AI Service]
    GroqAPI --> ProcessAPI
    ProcessAPI --> UI
    MatchAPI --> UI
    UI --> Firestore[(Firebase Firestore)]
```

### Component Layers

1. **Presentation Layer** (Next.js Pages & Components)
   - Landing page with product introduction
   - Dashboard page with report submission and visualization
   - UI components from shadcn/ui for consistent design
   - Tailwind CSS for styling

2. **API Layer** (Next.js Route Handlers)
   - `/api/process-report`: Handles field report processing via Groq AI
   - `/api/match-volunteers`: Handles volunteer matching logic

3. **External Services**
   - Groq API: AI processing using llama-3.3-70b model
   - Firebase Firestore: Optional persistent storage for reports and volunteers

### Design Principles

- **Simplicity**: No unnecessary abstraction layers; direct API calls from route handlers
- **Transparency**: All AI decisions include human-readable reasoning
- **Type Safety**: TypeScript throughout for compile-time error detection
- **Scalability**: Stateless API handlers that can scale horizontally
- **User Experience**: Dark mode, minimal design, smooth transitions

## Components and Interfaces

### Frontend Components

#### 1. Landing Page (`app/page.tsx`)

- Displays product name, tagline, and call-to-action
- Routes to dashboard on button click
- Dark mode with premium aesthetic

#### 2. Dashboard Page (`app/dashboard/page.tsx`)

- Main application interface
- Manages state for reports, volunteers, and UI interactions
- Coordinates between input, display, and recommendation components

#### 3. Report Input Component

- Text area for field report submission
- Optional file upload capability
- Submit button with loading state
- Error display for failed submissions

#### 4. Reports List Component

- Displays processed reports sorted by priority score
- Shows structured data: location, issues, severity, people affected
- Displays priority reasoning for transparency
- Visual indicators for severity levels

#### 5. Priority Insights Component

- Highlights highest-impact issues across all reports
- Aggregates data to show patterns
- Provides at-a-glance understanding of critical needs

#### 6. AI Insights Panel

- Displays analysis and patterns from processed reports
- Shows system-level observations
- Helps coordinators understand broader trends

#### 7. Volunteer Recommendations Component

- Shows matched volunteers for each report
- Displays match score and reasoning
- Includes volunteer skills, location, and availability
- Explains why each volunteer was recommended

### Backend API Interfaces

#### POST /api/process-report

**Request Body:**

```typescript
{
  reportText: string;
}
```

**Response (Success):**

```typescript
{
  location: string;
  issues: string[];
  severity: number; // 1-5
  people_affected: number;
  priority_reason: string;
  recommended_help: string[];
  priority_score: number; // severity × people_affected
}
```

**Response (Error):**

```typescript
{
  error: string;
  details?: string;
}
```

**Processing Flow:**

1. Validate input (non-empty reportText)
2. Construct prompt for Groq API
3. Call Groq API with temperature 0.2
4. Parse JSON response
5. Validate required fields
6. Calculate priority score
7. Return structured data

#### POST /api/match-volunteers

**Request Body:**

```typescript
{
  report: {
    location: string;
    issues: string[];
    recommended_help: string[];
  };
  volunteers: Array<{
    id: string;
    name: string;
    skills: string[];
    location: string;
    availability: boolean;
  }>;
}
```

**Response:**

```typescript
{
  matches: Array<{
    volunteer: {
      id: string;
      name: string;
      skills: string[];
      location: string;
    };
    match_score: number;
    reasoning: string;
  }>;
}
```

**Matching Logic:**

1. Filter out unavailable volunteers
2. For each available volunteer:
   - Calculate skill match score (matching skills / total needed skills)
   - Calculate location match (exact match = bonus points)
   - Combine into overall match score
   - Generate reasoning explanation
3. Sort by match score descending
4. Return top matches with reasoning

### External Service Interfaces

#### Groq API Integration

**Endpoint:** `https://api.groq.com/openai/v1/chat/completions`

**Request:**

```typescript
{
  model: "llama-3.3-70b-versatile";
  messages: [
    {
      role: "system";
      content: "You are an AI that converts NGO field reports into structured data. Extract: location, issues, severity (1-5), people_affected, priority_reason, recommended_help. Return ONLY valid JSON. No explanation text.";
    },
    {
      role: "user";
      content: string; // field report text
    }
  ];
  temperature: 0.2;
}
```

**Authentication:** Bearer token via `GROQ_API_KEY` environment variable

**Error Handling:**

- Network errors: Return user-friendly message
- Invalid JSON: Return parsing error with details
- Missing fields: Return validation error
- Rate limiting: Return retry message

## Data Models

### FieldReport (Input)

```typescript
interface FieldReportInput {
  reportText: string;
  file?: File; // optional file upload
}
```

### StructuredReport (Processed)

```typescript
interface StructuredReport {
  id: string; // generated client-side
  location: string;
  issues: string[];
  severity: number; // 1-5
  people_affected: number;
  priority_reason: string;
  recommended_help: string[];
  priority_score: number; // calculated: severity × people_affected
  timestamp: Date;
}
```

### Volunteer

```typescript
interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  location: string;
  availability: boolean;
}
```

### VolunteerMatch

```typescript
interface VolunteerMatch {
  volunteer: {
    id: string;
    name: string;
    skills: string[];
    location: string;
  };
  match_score: number;
  reasoning: string;
}
```

### DemoData

```typescript
interface DemoData {
  sampleReports: string[]; // 3-5 sample field report texts
  sampleVolunteers: Volunteer[]; // 5-8 sample volunteers
}
```

### API Error Response

```typescript
interface APIError {
  error: string;
  details?: string;
  statusCode: number;
}
```

### Groq API Response

```typescript
interface GroqResponse {
  choices: Array<{
    message: {
      content: string; // JSON string to be parsed
    };
  }>;
}
```

### Data Validation Rules

1. **FieldReportInput**
   - reportText: non-empty string, max 10,000 characters
   - file: optional, if present must be text-readable format

2. **StructuredReport**
   - location: non-empty string
   - issues: non-empty array of strings
   - severity: integer between 1 and 5 inclusive
   - people_affected: positive integer
   - priority_reason: non-empty string
   - recommended_help: non-empty array of strings
   - priority_score: positive number (calculated, not validated)

3. **Volunteer**
   - id: non-empty string, unique
   - name: non-empty string
   - skills: non-empty array of strings
   - location: non-empty string
   - availability: boolean

4. **Match Score Calculation**
   - Skill match: (number of matching skills / total recommended skills) × 100
   - Location match: exact match adds 20 points, partial match adds 10 points
   - Final score: skill match + location bonus
   - Range: 0-120

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Groq API Call Parameters

_For any_ field report text submitted to the process-report endpoint, the system should call the Groq API with temperature 0.2 and the llama-3.3-70b-versatile model.

**Validates: Requirements 1.2**

### Property 2: JSON Response Parsing

_For any_ valid JSON response returned by the Groq API, the system should successfully parse it without errors.

**Validates: Requirements 1.4**

### Property 3: Structured Data Validation

_For any_ processed field report, the resulting structured data should contain all required fields (location as string, issues as array, severity as number 1-5, people_affected as number, priority_reason as string, recommended_help as array) with correct types.

**Validates: Requirements 1.5, 7.3, 7.5**

### Property 4: Invalid JSON Error Handling

_For any_ invalid JSON string returned by the Groq API, the system should return a descriptive error message rather than crashing.

**Validates: Requirements 1.6**

### Property 5: Priority Score Calculation

_For any_ structured report with severity and people_affected values, the priority_score should equal severity multiplied by people_affected.

**Validates: Requirements 1.7, 3.1**

### Property 6: File Text Extraction

_For any_ valid text file uploaded to the system, the extracted text content should match the file's actual text content.

**Validates: Requirements 2.2**

### Property 7: File Processing Consistency

_For any_ text content, processing it via file upload should produce the same structured data as processing it via direct text input.

**Validates: Requirements 2.3**

### Property 8: Report Sorting by Priority

_For any_ collection of processed reports, when sorted by the system, they should be ordered by priority_score in descending order (highest priority first).

**Validates: Requirements 3.2, 5.2**

### Property 9: UI Display Order Matches Data Order

_For any_ sorted list of reports, the dashboard UI should render them in the same order as the data array.

**Validates: Requirements 3.3**

### Property 10: Priority Reason Display

_For any_ report displayed in the UI, the priority_reason field from the structured data should be visible in the rendered output.

**Validates: Requirements 3.4, 3.5**

### Property 11: Volunteer Data Acceptance

_For any_ volunteer object containing skills (array), location (string), and availability (boolean), the system should accept and process it without errors.

**Validates: Requirements 4.1**

### Property 12: Volunteer Matching Execution

_For any_ processed report and list of volunteers, the system should produce volunteer matches that consider skills, location, and availability factors.

**Validates: Requirements 4.2**

### Property 13: Match Score Calculation

_For any_ volunteer-report pair, the system should calculate a match_score based on skill overlap and location proximity.

**Validates: Requirements 4.3, 8.2**

### Property 14: Volunteer Ranking by Match Score

_For any_ list of volunteer matches, they should be sorted by match_score in descending order (best matches first).

**Validates: Requirements 4.4, 8.3**

### Property 15: Recommendations Include Reasoning

_For any_ volunteer match returned by the system, it should include both the match_score and a reasoning string explaining why the volunteer was recommended.

**Validates: Requirements 4.5, 4.6, 8.4**

### Property 16: Unavailable Volunteer Filtering

_For any_ volunteer with availability set to false, they should not appear in the recommendations list.

**Validates: Requirements 4.7, 8.5**

### Property 17: Volunteer Recommendations Display

_For any_ report with volunteer recommendations, those recommendations should be displayed in the dashboard UI.

**Validates: Requirements 5.5**

### Property 18: API Error Response Structure

_For any_ error condition in an API route handler, the response should include both a status code and an error message.

**Validates: Requirements 7.4, 11.3**

### Property 19: Demo Data Loading

_For any_ demo data set, loading it into the dashboard should populate the UI with the demo reports and volunteers.

**Validates: Requirements 9.3**

### Property 20: API Input Validation

_For any_ API endpoint, invalid or malformed inputs should be rejected with an error response before any processing occurs.

**Validates: Requirements 11.4**

## Error Handling

The system implements comprehensive error handling at multiple layers to ensure graceful degradation and clear user feedback.

### API Layer Error Handling

**Groq API Errors:**

- Network failures: Catch and return "Unable to connect to AI service. Please check your internet connection."
- Rate limiting (429): Return "AI service is busy. Please try again in a moment."
- Authentication errors (401): Return "AI service authentication failed. Please check API key configuration."
- Timeout: Return "AI service request timed out. Please try again."
- Invalid response format: Return "AI service returned unexpected format. Please try again."

**Input Validation Errors:**

- Empty report text: Return 400 with "Report text cannot be empty"
- Missing required fields: Return 400 with "Missing required field: {field_name}"
- Invalid data types: Return 400 with "Invalid data type for {field_name}"
- File upload errors: Return 400 with "Unable to read file. Please ensure it's a text file."

**JSON Parsing Errors:**

- Invalid JSON from Groq: Return 500 with "AI service returned invalid data format"
- Missing required fields in parsed JSON: Return 500 with "AI response missing required field: {field_name}"
- Type mismatches: Return 500 with "AI response field {field_name} has incorrect type"

### Frontend Error Handling

**User-Facing Errors:**

- Display error messages in a prominent but non-intrusive notification component
- Use red color scheme for errors, with clear icon indicators
- Provide actionable guidance (e.g., "Try again" button)
- Clear errors automatically after successful operations

**Loading States:**

- Show loading spinner during API calls
- Disable submit buttons during processing to prevent duplicate submissions
- Display "Processing..." text to indicate system is working

**Validation Errors:**

- Inline validation for text area (show character count, warn if empty)
- File upload validation (check file type before upload)
- Display validation errors immediately below input fields

### Data Integrity

**Defensive Programming:**

- Validate all data at API boundaries
- Use TypeScript types to catch type errors at compile time
- Provide default values for optional fields
- Sanitize user inputs to prevent injection attacks

**Fallback Behaviors:**

- If priority_score calculation fails, default to severity value
- If volunteer matching fails, return empty array rather than crashing
- If demo data is corrupted, provide minimal working demo data

**State Management:**

- Maintain consistent state even when operations fail
- Don't update UI state until API calls succeed
- Provide rollback capability for failed operations

## Testing Strategy

The testing strategy employs a dual approach combining unit tests for specific scenarios and property-based tests for comprehensive coverage of the system's correctness properties.

### Property-Based Testing

Property-based testing will be implemented using **fast-check** for TypeScript/JavaScript, which generates hundreds of random inputs to verify that properties hold across all valid inputs.

**Configuration:**

- Minimum 100 iterations per property test
- Each test tagged with format: **Feature: groundlink-ngo-dashboard, Property {number}: {property_text}**
- Tests organized by component/module

**Property Test Coverage:**

1. **API Processing Properties (Properties 1-7)**
   - Generate random field report texts and verify API call parameters
   - Generate random valid/invalid JSON and verify parsing behavior
   - Generate random severity/people_affected values and verify priority calculation
   - Generate random file contents and verify extraction/consistency

2. **Sorting and Display Properties (Properties 8-10)**
   - Generate random collections of reports and verify sorting order
   - Generate random report data and verify UI rendering order
   - Generate random priority reasons and verify display

3. **Volunteer Matching Properties (Properties 11-17)**
   - Generate random volunteer data and verify acceptance
   - Generate random report/volunteer combinations and verify matching logic
   - Generate random match scores and verify ranking
   - Generate random availability values and verify filtering
   - Generate random recommendations and verify reasoning inclusion

4. **Error Handling Properties (Properties 18, 20)**
   - Generate random error conditions and verify response structure
   - Generate random invalid inputs and verify rejection

5. **Demo Data Property (Property 19)**
   - Generate random demo data sets and verify loading behavior

**Example Property Test Structure:**

```typescript
// Feature: groundlink-ngo-dashboard, Property 5: Priority Score Calculation
test("priority score equals severity times people affected", () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 1, max: 5 }), // severity
      fc.integer({ min: 1, max: 10000 }), // people_affected
      (severity, people_affected) => {
        const report = { severity, people_affected };
        const priority_score = calculatePriorityScore(report);
        expect(priority_score).toBe(severity * people_affected);
      },
    ),
    { numRuns: 100 },
  );
});
```

### Unit Testing

Unit tests complement property tests by verifying specific examples, edge cases, and integration points.

**Unit Test Coverage:**

1. **Component Rendering Tests**
   - Landing page displays correct text (Requirements 6.1, 6.2, 6.3)
   - Dashboard displays input section (Requirement 5.1)
   - Dashboard displays insights panels (Requirements 5.3, 5.4)
   - Text area component renders (Requirement 1.1)
   - File upload component renders when enabled (Requirement 2.1)

2. **API Endpoint Tests**
   - /api/process-report endpoint exists and responds (Requirement 7.1)
   - /api/match-volunteers endpoint exists and responds (Requirement 8.1)
   - Endpoints return correct content-type headers
   - Endpoints handle OPTIONS requests for CORS

3. **Integration Tests**
   - End-to-end flow: submit report → process → display
   - End-to-end flow: process report → match volunteers → display recommendations
   - Demo data loading populates all UI sections

4. **Edge Cases**
   - Empty report text handling
   - Very long report text (10,000+ characters)
   - Reports with severity at boundaries (1 and 5)
   - Zero people affected (edge case for priority calculation)
   - No available volunteers (empty recommendations)
   - All volunteers unavailable (empty recommendations)
   - Single volunteer matching (no ranking needed)

5. **Technology Stack Verification**
   - Next.js 14 with App Router (Requirement 10.1)
   - TypeScript usage (Requirement 10.2)
   - Tailwind CSS configuration (Requirement 10.3)
   - shadcn/ui components (Requirement 10.4)
   - Next.js Route Handlers (Requirement 10.5)
   - Firebase Firestore integration if used (Requirement 10.7)

6. **Demo Data Tests**
   - 3-5 sample reports exist (Requirement 9.1)
   - 5-8 sample volunteers exist (Requirement 9.2)
   - Demo data has required structure

7. **Specific Prompt Test**
   - Exact prompt string is used (Requirement 1.3)

**Test Organization:**

```
tests/
├── unit/
│   ├── components/
│   │   ├── landing-page.test.tsx
│   │   ├── dashboard.test.tsx
│   │   └── report-input.test.tsx
│   ├── api/
│   │   ├── process-report.test.ts
│   │   └── match-volunteers.test.ts
│   └── utils/
│       ├── priority-calculation.test.ts
│       └── volunteer-matching.test.ts
└── property/
    ├── api-processing.property.test.ts
    ├── sorting-display.property.test.ts
    ├── volunteer-matching.property.test.ts
    └── error-handling.property.test.ts
```

### Testing Tools

- **Test Runner:** Vitest (fast, TypeScript-native)
- **Property Testing:** fast-check
- **Component Testing:** React Testing Library
- **API Testing:** MSW (Mock Service Worker) for Groq API mocking
- **Coverage:** Vitest coverage with c8

### Coverage Goals

- Property tests: 100% coverage of all 20 correctness properties
- Unit tests: 80%+ code coverage for critical paths
- Integration tests: All major user flows covered
- Edge cases: All boundary conditions tested

### Continuous Integration

- Run all tests on every commit
- Fail builds if any property test fails
- Fail builds if coverage drops below threshold
- Run property tests with increased iterations (500+) in CI for thorough validation
