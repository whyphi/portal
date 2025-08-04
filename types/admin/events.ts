// ================= MEMBER TYPES =================
export interface Timeframe {
  _id: string;
  name: string;
  spreadsheetId: string;
  dateCreated: string;
  events: Event[];
}

export interface Event {
  _id: string;
  name: string;
  dateCreated: string;
  timeframeId: string;
  usersAttended: UserInEvent[];
  tags: string[];
}

export interface UserInEvent {
  name: string;
  userId: string;
  dateCheckedIn: string;
}

// ================= RUSH TYPES =================
export interface EventRush extends EventsRushDefault {
  attendees: readonly Attendee[];
}

interface EventsRushDefault {
  id: string;
  timeframe_id: string;
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
}

interface Attendee {
  name: string;
  email: string;
  checkin_time: string;
}

export interface EventTimeframeRush {
  id: string;
  date_created: string;
  name: string;
  default_rush_timeframe: boolean;
  events_rush: readonly EventRush[];
}

// ================= RUSH-ANALYTICS TYPES =================
export interface Analytics {
  timeframe: EventTimeframeRush;
  rushees: {
    [rusheeId: string]: AnalyticsAttendee;
  };
  events: { [eventId: string]: EventRushAnalytics };
}

interface EventRushAnalytics extends EventsRushDefault {
  num_attendees: readonly Attendee[];
}

interface AnalyticsAttendee {
  id: string;
  name: string;
  email: string;
  events_attended: readonly AnalyticsEvent[];
  num_events_attended: number;
  threshold: boolean;
}

export interface AnalyticsEvent {
  id: string;
  attended: boolean;
}
