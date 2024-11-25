import { Component } from '@angular/core';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrl: './activity-log.component.scss',
  standalone: true,
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent],
})
export class ActivityLog {}
