import {Component, computed, inject, OnInit, signal} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import {
  MatFormField,
  MatSuffix,
  MatLabel,
} from '@angular/material/form-field';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { AuthStore } from '../../auth/auth.store';
import {AppInitService} from "../../core/app-init.service";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: `
    mat-card {
      display: flex;
      flex-direction: column;
      margin: 100px auto;
      max-width: 400px;
      padding: 15px;
    }

    mat-card-title {
      text-align: center;
    }

    .form-field {
      width: 100%;
    }

    button {
      margin: 5px 0;
    }
  `,
  imports: [
    MatCard,
    MatCardTitle,
    ReactiveFormsModule,
    MatCardContent,
    MatFormField,
    MatIcon,
    MatSuffix,
    MatLabel,
    MatInput,
    MatButton,
    MatProgressBar,
  ],
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly store = inject(AuthStore);
  private readonly appInitService = inject(AppInitService);
  private readonly snackbar = inject(MatSnackBar);
  isLoggedIn = computed(() => this.store.isLoggedIn());
  isLoading = signal(false);
  loginError = signal('');


  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', Validators.required],
  });
  invalidLogin = signal(false);

  ngOnInit() {
    this.logInIfTokenPresent().then();
  }

  async logInIfTokenPresent() {
    if (this.store.user()) {
      await this.store.init();
      await this.store.getMyProfile();
      await this.router.navigate(['dashboard']);
    }
  }

  async submit() {
    this.invalidLogin.set(false)
    this.isLoading.set(true);
    this.loginError.set('');
    const {username, password} = this.loginForm.value;
    if (!username || !password) {
      return;
    }
    const tokenResolved = await this.store.login(username, password);
    if (!tokenResolved) {
      this.handleLoginError("Invalid username or password");
      return;
    }
    const profileResolved = await this.store.getMyProfile();
    if (
      tokenResolved &&
      profileResolved &&
      this.store.user() &&
      this.store.profile()
    ) {
      await this.appInitService.appInit();
      await this.router.navigate(['/']);
    } else {
      this.handleLoginError("Something went wrong, please try again later.");
    }
  }

  private handleLoginError(errorMessage: string) {
    this.isLoading.set(false);
    this.invalidLogin.set(true);
    this.snackbar.open(errorMessage, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }
}
