export interface Applicant {
  website:       string;
  listingId:     string;
  colleges:      { [key: string]: boolean };
  responses:     Response[];
  lastName:      string;
  linkedin:      string;
  email:         string;
  firstName:     string;
  applicantId:   string;
  minor:         string;
  image:         string;
  gpa:           string;
  hasGpa:        boolean;
  gradMonth:     string;
  gradYear:      string;
  resume:        string;
  major:         string;
  phone:         string;
  preferredName: string;
  events:        null | { [key: string]: boolean };
  status:        string;
}

export interface Response {
  question: string;
  response: string;
}

export interface EventsAttended {
  [key: string]: boolean;
}