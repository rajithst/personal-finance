export interface JwtTokenResponse {
  token: string;
  refresh: string;
  is_premium: boolean;
}

export interface UserToken {
  first_name: string;
  last_name: string;
  is_premium: boolean;
  user_id: number;
  profile_id: number;
}
