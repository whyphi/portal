export interface Member {
  _id: string;
  name: string;
  email: string;
  roles: string[];

  // Optional fields due to some members being not onboarded yet
  class?: string | null;
  college?: string | null;
  family?: string | null;
  graduationYear?: string | null;
  isEboard?: string | null;
  major?: string | null;
  minor?: string | null;
  isNewUser?: boolean | null;
  team?: string | null;
  big?: string | null;
}
