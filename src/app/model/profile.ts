import { CreditAccount } from './common';

export interface MyProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  onboarding: boolean;
  is_premium: boolean;
  premium_plan: string | null;
  user_id: number;
  profile_picture: string | null;
  is_verified: boolean;
  two_factor_enabled: boolean;
  theme: string | null;
  language: string | null;
}

export interface MyAccount {
  profile: MyProfile;
  credit_accounts: CreditAccount[];
}
