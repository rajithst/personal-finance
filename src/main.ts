import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import {APP_ROUTES} from './app/app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { authInterceptor } from './app/auth/auth.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import {provideRouter} from "@angular/router";
import { provideStore } from '@ngrx/store';


bootstrapApplication(AppComponent, {
    providers: [
    importProvidersFrom(BrowserModule, FormsModule, ReactiveFormsModule, MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore()
]
})
  .catch(err => console.error(err));
