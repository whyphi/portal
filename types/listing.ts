// NOTE: ensure backwards compatability if this type is ever changed (this type is the source of what is saved in DB)
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
