import { effect, inject, Injectable, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Router } from '@angular/router';
import { JwtTokenResponse, UserToken } from './model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  apiService = inject(ApiService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  loggedInUser: UserToken | null = null;
  private readonly USER_STORAGE_KEY: string = 'iva2zK2d7p';

  ngOnInit() {}

  async login(username: string, password: string) {
    const loginPayload = { username: username, password: password };
    const login$ = this.apiService.login(loginPayload);
    const result = await firstValueFrom(login$);
    if (result.token) {
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(result));
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.USER_STORAGE_KEY);
    this.router.navigate(['/login']);
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
    if (!token)
      return null;
    const tokenClaims: any = new JwtHelperService().decodeToken(token);
    this.loggedInUser = {
      first_name: tokenClaims.first_name,
      last_name: tokenClaims.last_name,
      is_premium: tokenClaims.is_premium,
      user_id: tokenClaims.user_id,
      profile_id: tokenClaims.profile_id,
    };
    return this.loggedInUser;
  }

  get isLoggedIn() {
    const token = this.getToken();
    if (!token) return false;
    const helper = new JwtHelperService();
    return !helper.isTokenExpired(token);
  }

  unAuthorizedLogout() {
    this.logout();
  }
}
