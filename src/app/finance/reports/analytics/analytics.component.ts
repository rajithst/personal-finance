import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
  imports: [MatCard, MatCardContent, MatCardHeader, MatCardTitle],
})
export class AnalyticsComponent {}
