import { inject, Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { JwtTokenResponse, UserToken } from './model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiService = inject(ApiService);
  loggedInUser: UserToken | null = null;
  private readonly USER_STORAGE_KEY: string = 'iva2zK2d7p';

  async login(username: string, password: string) {
    const loginPayload = { username: username, password: password };
    try {
      const result = await this.apiService.login(loginPayload);
      if (result?.token) {
        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(result));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  clearLocalStorage() {
    localStorage.removeItem(this.USER_STORAGE_KEY);
  }

  loadFromLocalStorage(): JwtTokenResponse | null {
    const tokenJson = localStorage.getItem(this.USER_STORAGE_KEY);
    if (tokenJson) {
      return JSON.parse(tokenJson);
    }
    return null;
  }

  getToken() {
    return this.loadFromLocalStorage()?.token;
  }

  get currentUser() {
    const token = this.getToken();
    if (!token) return null;
    const tokenClaims: any = new JwtHelperService().decodeToken(token);
    this.loggedInUser = {
      first_name: tokenClaims.first_name,
      last_name: tokenClaims.last_name,
      email: tokenClaims.email,
      is_premium: tokenClaims.is_premium,
      user_id: tokenClaims.user_id,
      profile_id: tokenClaims.profile_id,
    };
    return this.loggedInUser;
  }

  get isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    const helper = new JwtHelperService();
    return helper.isTokenExpired(token);
  }

  unAuthorizedLogout() {
    this.clearLocalStorage();
  }
}
