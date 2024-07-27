interface Member {
  _id: string;
  name: string;
  email: string;
  roles: string[];

  // Optional fields due to some members being not onboarded yet
  class?: string;
  college?: string;
  family?: string;
  graduationYear?: string;
  isEboard?: string;
  major?: string;
  minor?: string;
  isNewUser?: boolean;
  team?: string;
  big?: string;
  littles?: string[];
}
