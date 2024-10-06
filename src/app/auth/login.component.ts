import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
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
