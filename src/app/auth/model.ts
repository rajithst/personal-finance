export interface JwtTokenResponse {
  token: string;
  refresh: string;
  is_premium: boolean;
}

export interface UserToken {
  first_name: string;
  last_name: string;
  email: string;
  is_premium: boolean;
  user_id: number;
  profile_id: number;
}

export interface MyProfile {
  id: number;
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  onboarding: boolean | null;
  is_premium: boolean | null;
  premium_plan: string | null;
  profile_picture: string | null;
  is_verified: boolean;
  two_factor_enabled: boolean;
  theme: string | null;
  language: string | null;
}
