export interface Events {
  infoSession1: boolean;
  infoSession2: boolean;
  resumeWorkshop: boolean;
  socialEvent: boolean;
  professionalPanel: boolean;
}

export interface FormData {
  first_name: string;
  last_name: string;
  preferred_name: string;
  major: string;
  minor: string;
  gpa: string;
  has_gpa: boolean;
  grad_year: number;
  grad_month: string;
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
  responses: string[];
}

export interface DataToSend extends Omit<FormData, 'responses'>  {
  listing_id: string
  responses: { question: string; response: string }[]
}

export type RequiredFormFields = Array<keyof FormData>;

export interface FormProps {
  title: string | null;
  questions: [] | { question: string; context: string }[];
  listingId: string | null;
  includeEventsAttended: boolean;
  isPreview: boolean;
}
