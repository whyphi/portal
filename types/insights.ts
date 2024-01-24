import { Applicant } from "@/types/applicant";

// Dashboard : interface to store applicant batch data from backend
export interface Dashboard {
  applicantCount: number | null;
  avgGpa: any;
  commonMajor: string;
  avgGradYear: string;
}

// Metrics : uses `name` `value` object to easily integrate with `recharts` pie charts (also includes list of Applicants associated with this metric.name --> e.g. colleges[0].applicants)
export interface Metrics {
  name: string | boolean;
  value: number;
  applicants: Applicant[];
}

// DistributionMetricsState : object which contains fields a list of Metrics for each field
export interface DistributionMetricsState {
  colleges: Metrics[];
  gpa: Metrics[];
  gradYear: Metrics[];
  major: Metrics[];
  minor: Metrics[];
  linkedin: Metrics[];
  website: Metrics[];
  // index signature (allows indexing using variables)
  [key: string]: Metrics[];
}
// colleges, gpa, gradYear, major, minor, linkedin, website

export interface Colleges {
  [college: string]: boolean;
}