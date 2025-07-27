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

export interface EventRush {
  id: string;
  name: string;
  date_created: string;
  last_modified: string;
  code: string;
  location: string;
  date: string;
  deadline: string;
  event_cover_image: string;
  event_cover_image_name: string;
  event_cover_image_version: string;
  // TODO: maybe make optional?
  attendees: readonly Attendee[];
  // numAttendees: number;
}

interface Attendee {
  name: string;
  email: string;
  checkinTime: string;
}

export interface EventTimeframeRush {
  id: string;
  date_created: string;
  name: string;
  default_rush_category: boolean;
  events_rush: readonly EventRush[]
}

export interface Analytics {
  categoryName: string,
  attendees: AnalyticsAttendees,
  events: readonly AnalyticsEvent[],
}

interface AnalyticsAttendees {
  [email: string]: AnalyticsAttendee;
}

interface AnalyticsAttendee {
  name: string;
  email: string;
  checkinTime: string;
  eventsAttended: readonly AnalyticsEvent[];
}

export interface AnalyticsEvent {
  eventId: string;
  eventName: string;
}