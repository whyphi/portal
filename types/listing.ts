export interface Question {
  question: string;
  context: string;
  type: "text" | "video";
}

export interface Listing {
  id: string;
  title: string;
  active: boolean;
  date_created: string;
  deadline: string;
  is_encrypted: boolean;
  is_visible: boolean;
  include_events_attended: boolean;
  questions: Question[] | null;
}
