import { Session } from "next-auth";
import { EventsAttended } from "./applicant";

export interface FormData {
  firstName: string;
  lastName: string;
  preferredName: string;
  major: string;
  minor: string;
  gpa: string;
  hasGpa: boolean;
  gradYear: string;
  gradMonth: string;
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
  events: EventsAttended | null;
  responses: string[];
}

export interface FormProps {
  title: string | null;
  questions: [] | { question: string; context: string }[];
  listingId: string | null;
  isPreview: boolean;
  session?: Session | null;
}
