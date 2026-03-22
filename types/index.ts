// Data Models for Groundlink Application

export interface FieldReportInput {
  reportText: string;
  file?: File;
}

export interface StructuredReport {
  id: string;
  location: string;
  issues: string[];
  severity: number; // 1-5
  people_affected: number;
  priority_reason: string;
  recommended_help: string[];
  priority_score: number;
  timestamp: Date;
}

export interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  location: string;
  availability: boolean;
}

export interface VolunteerMatch {
  volunteer: {
    id: string;
    name: string;
    skills: string[];
    location: string;
  };
  match_score: number;
  reasoning: string;
}

export interface DemoData {
  sampleReports: string[];
  sampleVolunteers: Volunteer[];
}

export interface APIError {
  error: string;
  details?: string;
  statusCode: number;
}

export interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}
