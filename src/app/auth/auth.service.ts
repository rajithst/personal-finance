import { effect, inject, Injectable, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Router } from '@angular/router';
import { UserToken } from './model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  apiService = inject(ApiService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  readonly #userSignal = signal<UserToken | null>(null);
  user = this.#userSignal.asReadonly();
  private readonly USER_STORAGE_KEY: string = 'iva2zK2d7p';

  constructor() {
    effect(() => {
      const user = this.user();
      if (user) {
        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
      }
    });
  }

  ngOnInit() {
    const user = this.loadFromLocalStorage();
    this.#userSignal.set(user);
  }

  loadFromLocalStorage(): UserToken | null {
    const userJson = localStorage.getItem(this.USER_STORAGE_KEY);
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }

  async login(username: string, password: string): Promise<UserToken> {
    const loginPayload = { username: username, password: password };
    const login$ = this.apiService.login(loginPayload);
    const user = await firstValueFrom(login$);
    this.#userSignal.set(user);
    return user;
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.USER_STORAGE_KEY);
    this.#userSignal.set(null);
    await this.router.navigate(['/login']);
  }

  getToken() {
    const user = this.user();
    return user ? user.access : null;
  }

  isLoggedIn() {
    if (!this.user()) {
      const user = this.loadFromLocalStorage();
      if (user) {
        this.#userSignal.set(user);
      }
    }
    return !!this.user();
  }

  getMyProfile() {
    return this.apiService.getMyProfile();
  }

  unAuthorizedLogout() {
    const snackbar = this.snackBar.open(
      'Session has expired.Logging out!',
      'Error',
      {
        duration: 3000,
      },
    );

    snackbar.afterDismissed().subscribe(() => {
      this.logout();
    });
  }
}
