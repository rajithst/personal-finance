import {MyProfile, UserToken} from './model';
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {ApiService} from "../core/api.service";

type AuthState = {
  user: UserToken | null;
  profile: MyProfile | null;
  loading: boolean;
  token: string;
  error: string;
};

const initialState: AuthState = {
  user: null,
  profile: null,
  loading: false,
  token: '',
  error: '',
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (store, authService = inject(AuthService), apiService = inject(ApiService)) => ({

      async init() {
        const user = authService.currentUser;
        if (user) {
          patchState(store, { user, token: authService.getToken() });
        }
        return user;
      },

      async getMyProfile() {
        const profile = await apiService.getMyProfile();
        if (profile) {
          patchState(store, { profile });
        }
        return profile;
      },

      async login(username: string, password: string) {
        patchState(store, { loading: true });
        const success = await authService.login(username, password);
        if (success) {
          patchState(store, { user: authService.currentUser, token: authService.getToken(), loading: false });
        } else {
          patchState(store, { error: 'Invalid username or password' });
        }
        patchState(store, { loading: false });
        return success;
      },

      logout() {
        authService.clearLocalStorage();
        patchState(store, { user: null, token: '' });
      },

      isLoggedIn() {
        return !!store.user() && !!store.token();
      }
    }),


  )
);
