export interface User {
  id: string;
  name: string;
  email: string;
  class: string | null;
  college: string | null;
  family: string | null;
  grad_year: number | null;
  is_eboard: boolean;
  is_new_user: boolean;
  major: string | null;
  minor: string | null;
  team: string | null;
}
