export interface Applicant {
    website: string;
    listingId: string;
    colleges: { [key: string]: boolean };
    responses: string[];
    lastName: string;
    linkedin: string;
    email: string;
    firstName: string;
    applicantId: string;
    minor: string;
    image: string;
    gpa: string;
    gradYear: string;
    resume: string;
    major: string;
    phone: string;
    preferredName: string;
  }