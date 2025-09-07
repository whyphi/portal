import { User } from "@/types/admin/users";

// ================= MEMBER TYPES =================
export interface EventTimeframeMember {
  id: string;
  name: string;
  spreadsheet_id: string;
  date_created: string;
  events_member: EventMember[];
}

export interface EventMember {
  id: string;
  code: string;
  name: string;
  date_created: string;
  timeframe_id: string;
  spreadsheet_col: string;
  spreadsheet_tab: string;
  tags?: string[]; // TODO: maybe remove tags
}

export interface EventMemberDetails extends EventMember {
  attendees: EventMemberAttendee[];
}

interface EventMemberAttendee {
  checkin_time: string;
  user: User;
}

export interface UserInEvent {
  name: string;
  userId: string;
  dateCheckedIn: string;
}

// ================= RUSH TYPES =================
export interface EventRush extends EventRushDefault {
  attendees: readonly Attendee[];
}

interface EventRushDefault {
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

interface EventRushAnalytics extends EventRushDefault {
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
