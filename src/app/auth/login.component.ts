import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatSuffix, MatLabel } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    standalone: true,
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
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', Validators.required],
  });
  invalidLogin = false;

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['dashboard']);
    }
  }

  async submit() {
    try {
      this.invalidLogin = false;
      const { username, password } = this.loginForm.value;
      if (!username || !password) {
        console.log('email and password is required');
        return;
      }
      await this.authService.login(username, password);
      this.router.navigate(['/']);
    } catch (error) {
      this.invalidLogin = true;
    }
  }
}
