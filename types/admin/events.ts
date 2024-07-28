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
  _id: string;
  name: string;
  dateCreated: string;
  lastModified: string;
  code: string;
  location: string;
  date: string;
  deadline: string;
  eventCoverImage: string;
  eventCoverImageName: string;
  attendees: [Attendee];
  numAttendees: number;
}

interface Attendee {
  name: string;
  email: string;
  checkInTime: string;
}

export interface RushCategory {
  _id: string;
  dateCreated: string;
  name: string;
  defaultRushCategory: boolean;
  events: [RushEvent]
}

export interface Analytics {
  [email: string]: AnalyticsAttendee;
}

interface AnalyticsAttendee {
  name: string;
  email: string;
  checkinTime: string;
  eventsAttended: [AnalyticsEvent];
}

interface AnalyticsEvent {
  eventId: string;
  eventName: string;
}