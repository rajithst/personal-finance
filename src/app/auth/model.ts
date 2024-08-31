export interface User {
  profile_id: string;
  email: string;
  access: string;
  refresh: string;
  is_premium: boolean;
}

export interface UserProfile {
  id: number,
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  is_premium: boolean;
  user_id: number;
}
