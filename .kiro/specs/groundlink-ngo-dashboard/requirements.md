# Requirements Document

## Introduction

Groundlink is an AI-powered dashboard that helps NGOs and social organizations convert unstructured field reports into actionable insights. The system processes field reports using AI, prioritizes community needs based on severity and impact, and recommends optimal volunteer allocation with transparent reasoning.

## Glossary

- **System**: The Groundlink application (frontend and backend)
- **Field_Report**: Unstructured text input describing community issues, needs, or observations from field workers
- **Structured_Data**: JSON object containing location, issues, severity, people_affected, priority_reason, and recommended_help
- **Priority_Score**: Calculated value (severity × people_affected) used to rank reports
- **Groq_API**: External AI service using llama-3.3-70b model for report processing
- **Volunteer**: Individual with skills, location, and availability who can be matched to reports
- **Match_Score**: Ranking value for volunteer-to-report matching based on skills, location, and availability
- **Dashboard**: Main interface displaying reports, priorities, insights, and recommendations
- **Route_Handler**: Next.js API Route for backend processing

## Requirements

### Requirement 1: Process Field Reports

**User Story:** As an NGO coordinator, I want to submit field reports as text, so that the system can extract structured information automatically.

#### Acceptance Criteria

1. THE System SHALL accept field report text input through a text area component
2. WHEN a field report is submitted, THE System SHALL send the report to the Groq_API with temperature 0.2
3. THE System SHALL use the prompt "You are an AI that converts NGO field reports into structured data. Extract: location, issues, severity (1-5), people_affected, priority_reason, recommended_help. Return ONLY valid JSON. No explanation text."
4. WHEN the Groq_API returns a response, THE System SHALL parse the response as valid JSON
5. THE Structured_Data SHALL contain fields: location (string), issues (array), severity (number 1-5), people_affected (number), priority_reason (string), recommended_help (array)
6. IF the Groq_API returns invalid JSON, THEN THE System SHALL return a descriptive error message
7. THE System SHALL calculate Priority_Score as severity multiplied by people_affected

### Requirement 2: Upload Field Report Files

**User Story:** As an NGO coordinator, I want to optionally upload field report files, so that I can submit reports in different formats.

#### Acceptance Criteria

1. WHERE file upload is enabled, THE System SHALL accept file uploads for field reports
2. WHEN a file is uploaded, THE System SHALL extract text content from the file
3. THE System SHALL process uploaded file content using the same workflow as text input

### Requirement 3: Prioritize Reports

**User Story:** As an NGO coordinator, I want reports automatically prioritized by impact, so that I can focus on the most critical needs first.

#### Acceptance Criteria

1. THE System SHALL calculate Priority_Score for each processed report
2. THE System SHALL sort reports by Priority_Score in descending order
3. THE Dashboard SHALL display reports in priority order
4. THE System SHALL display the priority_reason from Structured_Data for each report
5. WHEN displaying a report, THE System SHALL show WHY it was prioritized with the priority_reason field

### Requirement 4: Match Volunteers to Reports

**User Story:** As an NGO coordinator, I want the system to recommend volunteers for each report, so that I can allocate resources effectively.

#### Acceptance Criteria

1. THE System SHALL accept volunteer data containing skills (array), location (string), and availability (boolean)
2. WHEN a report is processed, THE System SHALL match volunteers based on skills, location, and availability
3. THE System SHALL calculate Match_Score for each volunteer-report pair
4. THE System SHALL rank volunteers by Match_Score in descending order
5. THE System SHALL return top-ranked volunteer recommendations with reasoning
6. THE System SHALL explain WHY each volunteer was recommended
7. WHERE a volunteer is unavailable, THE System SHALL exclude them from recommendations

### Requirement 5: Display Dashboard Interface

**User Story:** As an NGO coordinator, I want a clean dashboard showing all reports and insights, so that I can understand the situation at a glance.

#### Acceptance Criteria

1. THE Dashboard SHALL display an input section for field reports
2. THE Dashboard SHALL display a list of processed reports sorted by priority
3. THE Dashboard SHALL display priority insights showing highest-impact issues
4. THE Dashboard SHALL display an AI insights panel with analysis
5. THE Dashboard SHALL display volunteer recommendations for each report
6. THE System SHALL use dark mode with minimal, modern design
7. THE System SHALL use proper spacing, subtle shadows, and smooth transitions
8. THE System SHALL avoid overly bright colors, generic gradients, and messy layouts

### Requirement 6: Provide Landing Page

**User Story:** As a visitor, I want to see what Groundlink does, so that I can understand the product before using it.

#### Acceptance Criteria

1. THE System SHALL display a landing page with the product name "Groundlink"
2. THE System SHALL display the tagline "Connecting ground reality to intelligent action"
3. THE System SHALL display a call-to-action button to access the dashboard
4. THE Landing_Page SHALL use dark mode with premium design aesthetic

### Requirement 7: Process Reports via API

**User Story:** As a developer, I want a backend API to process reports, so that the frontend can submit reports and receive structured data.

#### Acceptance Criteria

1. THE System SHALL provide a Route_Handler at /api/process-report
2. WHEN the Route_Handler receives a POST request with report text, THE System SHALL call the Groq_API
3. THE Route_Handler SHALL return Structured_Data as JSON response
4. IF processing fails, THEN THE Route_Handler SHALL return an error response with status code and message
5. THE Route_Handler SHALL validate that the Groq_API response contains all required fields

### Requirement 8: Match Volunteers via API

**User Story:** As a developer, I want a backend API to match volunteers, so that the frontend can request volunteer recommendations.

#### Acceptance Criteria

1. THE System SHALL provide a Route_Handler at /api/match-volunteers
2. WHEN the Route_Handler receives a POST request with report and volunteers, THE System SHALL calculate Match_Score for each volunteer
3. THE Route_Handler SHALL return ranked volunteer matches with reasoning as JSON response
4. THE Route_Handler SHALL include explanation of WHY each volunteer was recommended
5. THE Route_Handler SHALL filter out unavailable volunteers before ranking

### Requirement 9: Provide Demo Data

**User Story:** As a user trying the system, I want to see demo data, so that I can understand how the system works without entering my own data.

#### Acceptance Criteria

1. THE System SHALL include 3 to 5 sample field reports
2. THE System SHALL include 5 to 8 sample volunteers with varied skills and locations
3. THE System SHALL allow users to load demo data into the dashboard
4. THE Demo_Data SHALL represent realistic NGO scenarios

### Requirement 10: Use Required Technology Stack

**User Story:** As a developer, I want the system built with the specified tech stack, so that it meets project requirements.

#### Acceptance Criteria

1. THE System SHALL use Next.js 14 with App Router for frontend and routing
2. THE System SHALL use TypeScript for type safety
3. THE System SHALL use Tailwind CSS for styling
4. THE System SHALL use shadcn/ui for UI components
5. THE System SHALL use Next.js Route Handlers for backend API endpoints
6. THE System SHALL use Groq API with llama-3.3-70b model for AI processing
7. WHERE persistent storage is needed, THE System SHALL use Firebase Firestore
8. THE System SHALL NOT create unnecessary abstraction layers
9. THE System SHALL maintain simple and scalable file structure

### Requirement 11: Ensure Code Quality

**User Story:** As a developer, I want clean, production-level code, so that the system is maintainable and runs without errors.

#### Acceptance Criteria

1. THE System SHALL run without runtime errors
2. THE System SHALL use clean, readable code with proper naming conventions
3. THE System SHALL handle errors gracefully with user-friendly messages
4. THE System SHALL validate all API inputs before processing
5. THE System SHALL use TypeScript types for all data structures
6. THE System SHALL follow Next.js 14 App Router best practices
