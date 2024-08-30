import {
  computed,
  effect,
  inject,
  Injectable,
  OnInit,
  signal,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Router } from '@angular/router';

export interface User {
  profile_id: string;
  email: string;
  access: string;
  refresh: string;
  is_premium: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  #userSignal = signal<User | null>(null);
  user = this.#userSignal.asReadonly();
  isLoggedIn = computed(() => !!this.user());

  apiService = inject(ApiService);
  router = inject(Router);
  private USER_STORAGE_KEY: string = 'USER_STORAGE_KEY';

  constructor() {
    effect(() => {
      const user = this.user();
      if (user) {
        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
      }
    });
  }

  ngOnInit() {
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage(): void {
    const userJson = localStorage.getItem(this.USER_STORAGE_KEY);
    if (userJson) {
      const user = JSON.parse(userJson);
      this.#userSignal.set(user);
    }
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
}
