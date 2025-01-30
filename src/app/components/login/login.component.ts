import { Component, inject, OnInit } from '@angular/core';
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
import { NgIf } from '@angular/common';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { AuthStore } from '../../auth/auth.store';
import {AppInitService} from "../../core/app-init.service";

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

    .invalid-login {
      text-align: center;
      color: red;
      font-weight: 500;
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
    NgIf,
    MatFormField,
    MatIcon,
    MatSuffix,
    MatLabel,
    MatInput,
    MatButton,
  ],
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly store = inject(AuthStore);
  private readonly appInitService = inject(AppInitService);
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', Validators.required],
  });
  invalidLogin = false;

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
    try {
      this.invalidLogin = false;
      const { username, password } = this.loginForm.value;
      if (!username || !password) {
        return;
      }
      const tokenResolved = await this.store.login(username, password);
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
        this.invalidLogin = true;
      }
    } catch (error) {
      this.invalidLogin = true;
    }
  }
}
