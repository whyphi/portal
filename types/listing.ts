export interface Listing {
    dateCreated: string;
    deadline: string;
    isVisible: boolean;
    listingId: string;
    questions: { [key: string]: string }[]; // Assuming questions is an array of strings, update it according to your actual data structure
    title: string;
  }
  