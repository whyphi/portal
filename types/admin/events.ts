export interface Timeframe {
  _id: string;
  name: string;
  dateCreated: string;
  events: Event[]
}

export interface Event {
  _id: string;
  name: string;
  dateCreated: string;
  timeframeId: string;
  usersAttended: UserInEvent[];
}

export interface UserInEvent{
  name: string;
  userId: string;
  dateCheckedIn: string;
}