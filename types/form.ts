export interface Events {
  infoSession1: boolean;
  infoSession2: boolean;
  workshop1: boolean;
  workshop2: boolean;
  social1: boolean;
  social2: boolean;
}

export interface FormData {
  firstName: string;
  lastName: string;
  preferredName: string;
  major: string;
  minor: string;
  gpa: string;
  hasGpa: boolean;
  gradYear: string;
  email: string;
  phone: string;
  linkedin: string;
  website: string;
  resume: File | null;
  image: File | null;
  colleges: {
    CAS: boolean;
    Pardee: boolean;
    QST: boolean;
    COM: boolean;
    ENG: boolean;
    CFA: boolean;
    CDS: boolean;
    CGS: boolean;
    Sargent: boolean;
    SHA: boolean;
    Wheelock: boolean;
    Other: boolean;
  };
  events: Events | null;
  responses: string[];
}

export interface FormProps {
  title: string | null;
  questions: [] | [{ question: string, context: string }],
  listingId: string | null;
  includeEventsAttended: boolean
}