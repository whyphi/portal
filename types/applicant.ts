export interface Applicant {
  id:             string;
  listing_id:     string;
  responses:      Response[];
  first_name:     string;
  last_name:      string;
  preferred_name: string | null;
  linkedin:       string | null;
  website:        string | null;
  email:          string;
  minor:          string | null;
  image:          string; // TODO: make nullable (maybe)
  gpa:            string | null;
  has_gpa:        boolean;
  grad_month:     string;
  grad_year:      number;
  resume:         string;
  major:          string;
  phone:          string;
  colleges:       { [key: string]: boolean };
  events:         null | { [key: string]: boolean };
}

export interface Response {
  question: string;
  response: string;
}

export interface EventsAttended {
  [key: string]: boolean;
}