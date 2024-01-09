// Metrics : uses `name` `value` object to easily integrate with `recharts` pie charts
export interface Metrics {
  name: string | boolean;
  value: number;
}

export interface Colleges {
  [college: string]: boolean;
}
  
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