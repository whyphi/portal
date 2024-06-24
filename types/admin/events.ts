export interface Timeframe {
  _id: string;
  name: string;
  spreadsheetId: string;
  dateCreated: string;
  events: Event[]
}

export interface Event {
  _id: string;
  name: string;
  dateCreated: string;
  timeframeId: string;
  usersAttended: UserInEvent[];
  tags: string[];
}

export interface UserInEvent{
  name: string;
  userId: string;
  dateCheckedIn: string;
}

export interface RushEvent {
  eventId: string;
  name: string;
  dateCreated: string;
  lastModified: string;
  code: string;
}

export interface RushCategory {
  _id: string;
  dateCreated: string;
  name: string;
  events: RushEvent[]
}

