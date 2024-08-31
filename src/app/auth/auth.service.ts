import { effect, inject, Injectable, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Router } from '@angular/router';
import {User} from "./model";

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  #userSignal = signal<User | null>(null);
  user = this.#userSignal.asReadonly();

  apiService = inject(ApiService);
  router = inject(Router);
  private USER_STORAGE_KEY: string = 'iva2zK2d7p';

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

  loadFromLocalStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_STORAGE_KEY);
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }

  async login(username: string, password: string): Promise<User> {
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
    return this.apiService.getMyProfile()
  }
}
