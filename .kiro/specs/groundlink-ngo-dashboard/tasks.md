# Implementation Plan: Groundlink NGO Dashboard

## Overview

This implementation plan breaks down the Groundlink NGO Dashboard into sequential, incremental tasks. The system is a Next.js application with TypeScript that processes field reports using Groq AI, prioritizes them, and matches volunteers. The implementation follows a bottom-up approach: core utilities first, then API endpoints, then UI components, and finally integration.

## Tasks

- [x] 1. Set up project structure and dependencies
  - Initialize Next.js project with TypeScript and App Router
  - Install dependencies: Tailwind CSS, shadcn/ui, Groq SDK, Firebase (optional)
  - Configure TypeScript, Tailwind, and environment variables
  - Set up project folder structure following Next.js conventions
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.7, 10.9_

- [ ] 2. Create TypeScript type definitions and data models
  - Create types file with all interfaces: FieldReportInput, StructuredReport, Volunteer, VolunteerMatch, APIError, GroqResponse
  - Include validation rules as TypeScript types with proper constraints
  - Add JSDoc comments documenting each interface
  - Commit and push: `git add . && git commit -m "feat: add TypeScript type definitions and data models" && git push origin main`
  - _Requirements: 10.2, 10.5, 11.5_

- [ ] 3. Implement core utility functions
  - [ ] 3.1 Create priority score calculation function
    - Implement calculatePriorityScore(severity, people_affected) returning severity × people_affected
    - _Requirements: 1.7, 3.1_
  - [ ]\* 3.2 Write property test for priority score calculation
    - **Property 5: Priority Score Calculation**
    - **Validates: Requirements 1.7, 3.1**
  - [ ] 3.3 Create volunteer matching logic function
    - Implement calculateMatchScore(volunteer, report) considering skills, location, availability
    - Calculate skill match score as (matching skills / total needed skills) × 100
    - Add location bonus: exact match +20, partial match +10
    - Generate reasoning string explaining the match
    - Filter out unavailable volunteers
    - _Requirements: 4.2, 4.3, 8.2_
  - [ ]\* 3.4 Write property test for match score calculation
    - **Property 13: Match Score Calculation**
    - **Validates: Requirements 4.3, 8.2**
  - [ ]\* 3.5 Write property test for unavailable volunteer filtering
    - **Property 16: Unavailable Volunteer Filtering**
    - **Validates: Requirements 4.7, 8.5**
  - Commit and push: `git add . && git commit -m "feat: implement core utility functions and tests" && git push origin main`

- [ ] 4. Implement /api/process-report endpoint
  - [ ] 4.1 Create Route Handler at app/api/process-report/route.ts
    - Accept POST requests with reportText in body
    - Validate input: non-empty string, max 10,000 characters
    - Return 400 for invalid inputs with descriptive error messages
    - _Requirements: 7.1, 11.4, 7.4_
  - [ ] 4.2 Integrate Groq API call
    - Configure Groq client with API key from environment variable
    - Use model "llama-3.3-70b-versatile" with temperature 0.2
    - Use exact system prompt: "You are an AI that converts NGO field reports into structured data. Extract: location, issues, severity (1-5), people_affected, priority_reason, recommended_help. Return ONLY valid JSON. No explanation text."
    - Send user message with report text
    - Handle network errors, rate limiting, authentication errors with user-friendly messages
    - _Requirements: 1.2, 1.3, 7.2_
  - [ ]\* 4.3 Write property test for Groq API call parameters
    - **Property 1: Groq API Call Parameters**
    - **Validates: Requirements 1.2**
  - [ ] 4.4 Parse and validate Groq API response
    - Parse JSON response from Groq API
    - Validate all required fields exist: location, issues, severity, people_affected, priority_reason, recommended_help
    - Validate field types match expected types
    - Return 500 with descriptive error if parsing fails or fields missing
    - Calculate priority_score using utility function
    - Return structured data as JSON response
    - _Requirements: 1.4, 1.5, 1.6, 7.3, 7.5_
  - [ ]\* 4.5 Write property test for JSON response parsing
    - **Property 2: JSON Response Parsing**
    - **Validates: Requirements 1.4**
  - [ ]\* 4.6 Write property test for structured data validation
    - **Property 3: Structured Data Validation**
    - **Validates: Requirements 1.5, 7.3, 7.5**
  - [ ]\* 4.7 Write property test for invalid JSON error handling
    - **Property 4: Invalid JSON Error Handling**
    - **Validates: Requirements 1.6**
  - [ ]\* 4.8 Write unit tests for /api/process-report endpoint
    - Test endpoint exists and responds
    - Test empty report text returns 400
    - Test very long report text (10,000+ characters)
    - Test error response structure includes status code and message
    - _Requirements: 7.1, 7.4, 11.3_
  - Commit and push: `git add . && git commit -m "feat: implement /api/process-report endpoint with Groq AI integration" && git push origin main`

- [ ] 5. Checkpoint - Ensure API processing works
  - Test /api/process-report with sample field reports
  - Verify structured data is returned correctly
  - Ensure all tests pass, ask the user if questions arise
  - Commit and push: `git add . && git commit -m "test: verify API processing checkpoint" && git push origin main`

- [ ] 6. Implement /api/match-volunteers endpoint
  - [ ] 6.1 Create Route Handler at app/api/match-volunteers/route.ts
    - Accept POST requests with report and volunteers array in body
    - Validate inputs: report has required fields, volunteers is non-empty array
    - Return 400 for invalid inputs
    - _Requirements: 8.1, 11.4_
  - [ ] 6.2 Implement volunteer matching and ranking
    - Use volunteer matching utility function for each volunteer
    - Filter out unavailable volunteers
    - Calculate match scores for all available volunteers
    - Sort matches by match_score in descending order
    - Include reasoning for each match
    - Return top matches as JSON response
    - _Requirements: 4.2, 4.4, 4.5, 4.6, 8.2, 8.3, 8.4, 8.5_
  - [ ]\* 6.3 Write property test for volunteer data acceptance
    - **Property 11: Volunteer Data Acceptance**
    - **Validates: Requirements 4.1**
  - [ ]\* 6.4 Write property test for volunteer matching execution
    - **Property 12: Volunteer Matching Execution**
    - **Validates: Requirements 4.2**
  - [ ]\* 6.5 Write property test for volunteer ranking by match score
    - **Property 14: Volunteer Ranking by Match Score**
    - **Validates: Requirements 4.4, 8.3**
  - [ ]\* 6.6 Write property test for recommendations include reasoning
    - **Property 15: Recommendations Include Reasoning**
    - **Validates: Requirements 4.5, 4.6, 8.4**
  - [ ]\* 6.7 Write unit tests for /api/match-volunteers endpoint
    - Test endpoint exists and responds
    - Test no available volunteers returns empty array
    - Test single volunteer matching
    - _Requirements: 8.1_
  - Commit and push: `git add . && git commit -m "feat: implement /api/match-volunteers endpoint with ranking logic" && git push origin main`

- [ ] 7. Create demo data
  - Create lib/demo-data.ts with 3-5 sample field reports as strings
  - Create 5-8 sample volunteers with varied skills, locations, and availability
  - Ensure demo data represents realistic NGO scenarios
  - Commit and push: `git add . && git commit -m "feat: add demo data with sample reports and volunteers" && git push origin main`
  - _Requirements: 9.1, 9.2, 9.4_

- [ ] 8. Implement landing page
  - [ ] 8.1 Create app/page.tsx with landing page
    - Display "Groundlink" as product name
    - Display tagline "Connecting ground reality to intelligent action"
    - Add call-to-action button linking to /dashboard
    - Use dark mode with premium aesthetic
    - Use Tailwind CSS for styling
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 10.3_
  - [ ]\* 8.2 Write unit tests for landing page
    - Test landing page displays correct text
    - Test CTA button exists and links to dashboard
    - _Requirements: 6.1, 6.2, 6.3_
  - Commit and push: `git add . && git commit -m "feat: implement landing page with dark mode design" && git push origin main`

- [ ] 9. Implement dashboard page and state management
  - [ ] 9.1 Create app/dashboard/page.tsx
    - Set up React state for reports, volunteers, loading, errors
    - Create handler functions for report submission and demo data loading
    - Implement API calls to /api/process-report and /api/match-volunteers
    - Handle loading states and error display
    - Use dark mode styling with Tailwind CSS
    - _Requirements: 5.1, 5.6, 5.7, 5.8, 10.3_
  - [ ] 9.2 Implement report sorting logic
    - Sort reports by priority_score in descending order before rendering
    - _Requirements: 3.2, 5.2_
  - [ ]\* 9.3 Write property test for report sorting by priority
    - **Property 8: Report Sorting by Priority**
    - **Validates: Requirements 3.2, 5.2**
  - [ ]\* 9.4 Write property test for UI display order matches data order
    - **Property 9: UI Display Order Matches Data Order**
    - **Validates: Requirements 3.3**
  - [ ]\* 9.5 Write unit test for dashboard displays input section
    - _Requirements: 5.1_
  - Commit and push: `git add . && git commit -m "feat: implement dashboard page with state management and API integration" && git push origin main`

- [ ] 10. Create report input component
  - [ ] 10.1 Create components/report-input.tsx
    - Text area for field report submission with character count
    - Optional file upload capability (if enabled)
    - Submit button with loading state
    - Error display for failed submissions
    - Inline validation for empty text
    - Use shadcn/ui components
    - _Requirements: 1.1, 2.1, 10.4_
  - [ ]\* 10.2 Write property test for file text extraction
    - **Property 6: File Text Extraction**
    - **Validates: Requirements 2.2**
  - [ ]\* 10.3 Write property test for file processing consistency
    - **Property 7: File Processing Consistency**
    - **Validates: Requirements 2.3**
  - [ ]\* 10.4 Write unit tests for report input component
    - Test text area renders
    - Test file upload component renders when enabled
    - Test submit button disabled during loading
    - _Requirements: 1.1, 2.1_
  - Commit and push: `git add . && git commit -m "feat: create report input component with validation" && git push origin main`

- [ ] 11. Create reports list component
  - [ ] 11.1 Create components/reports-list.tsx
    - Display processed reports in order received from parent
    - Show structured data: location, issues, severity, people_affected
    - Display priority_reason for each report
    - Add visual indicators for severity levels (color coding)
    - Use shadcn/ui components for cards and badges
    - Use dark mode styling
    - _Requirements: 3.3, 3.4, 3.5, 5.2, 10.4_
  - [ ]\* 11.2 Write property test for priority reason display
    - **Property 10: Priority Reason Display**
    - **Validates: Requirements 3.4, 3.5**
  - Commit and push: `git add . && git commit -m "feat: create reports list component with severity indicators" && git push origin main`

- [ ] 12. Create priority insights component
  - Create components/priority-insights.tsx
  - Aggregate data to show highest-impact issues across all reports
  - Display patterns and critical needs
  - Use shadcn/ui components for visual presentation
  - Commit and push: `git add . && git commit -m "feat: create priority insights component" && git push origin main`
  - _Requirements: 5.3, 10.4_

- [ ] 13. Create AI insights panel component
  - Create components/ai-insights.tsx
  - Display analysis and patterns from processed reports
  - Show system-level observations
  - Use shadcn/ui components
  - Commit and push: `git add . && git commit -m "feat: create AI insights panel component" && git push origin main`
  - _Requirements: 5.4, 10.4_

- [ ] 14. Create volunteer recommendations component
  - [ ] 14.1 Create components/volunteer-recommendations.tsx
    - Display matched volunteers for each report
    - Show match_score and reasoning for each volunteer
    - Include volunteer skills, location, and availability
    - Explain why each volunteer was recommended
    - Use shadcn/ui components for cards and lists
    - _Requirements: 4.5, 4.6, 5.5, 10.4_
  - [ ]\* 14.2 Write property test for volunteer recommendations display
    - **Property 17: Volunteer Recommendations Display**
    - **Validates: Requirements 5.5**
  - Commit and push: `git add . && git commit -m "feat: create volunteer recommendations component" && git push origin main`

- [ ] 15. Integrate all components in dashboard
  - Wire report input component to dashboard state
  - Wire reports list component with sorted reports data
  - Wire priority insights component with aggregated data
  - Wire AI insights panel with analysis data
  - Wire volunteer recommendations component with match data
  - Implement demo data loading functionality
  - Ensure all components receive correct props and update on state changes
  - Commit and push: `git add . && git commit -m "feat: integrate all components in dashboard" && git push origin main`
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 9.3_

- [ ]\* 16. Write property test for demo data loading
  - **Property 19: Demo Data Loading**
  - **Validates: Requirements 9.3**
  - Commit and push: `git add . && git commit -m "test: add property test for demo data loading" && git push origin main`

- [ ]\* 17. Write property test for API input validation
  - **Property 20: API Input Validation**
  - **Validates: Requirements 11.4**
  - Commit and push: `git add . && git commit -m "test: add property test for API input validation" && git push origin main`

- [ ]\* 18. Write property test for API error response structure
  - **Property 18: API Error Response Structure**
  - **Validates: Requirements 7.4, 11.3**
  - Commit and push: `git add . && git commit -m "test: add property test for API error response structure" && git push origin main`

- [ ]\* 19. Write integration tests
  - Test end-to-end flow: submit report → process → display
  - Test end-to-end flow: process report → match volunteers → display recommendations
  - Test demo data loading populates all UI sections
  - Commit and push: `git add . && git commit -m "test: add integration tests for end-to-end flows" && git push origin main`
  - _Requirements: 9.3_

- [ ] 20. Final checkpoint - End-to-end testing
  - Test complete user flow from landing page to dashboard
  - Submit sample field reports and verify processing
  - Load demo data and verify all components populate correctly
  - Test volunteer matching with various scenarios
  - Verify error handling for invalid inputs
  - Ensure all tests pass, ask the user if questions arise
  - Commit and push: `git add . && git commit -m "test: complete final end-to-end testing checkpoint" && git push origin main`
  - _Requirements: 11.1, 11.2, 11.3_

## Git Workflow

After completing each task:

1. Stage changes: `git add .`
2. Commit with descriptive message: `git commit -m "feat: [task description]"`
3. Push to GitHub: `git push origin main`

Use conventional commit format:

- `feat:` for new features
- `fix:` for bug fixes
- `test:` for adding tests
- `refactor:` for code refactoring
- `docs:` for documentation updates

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript throughout as specified in the design
- All API endpoints use Next.js Route Handlers following Next.js App Router conventions
- **Git commits should be made after each completed task to maintain version control**
