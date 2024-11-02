import { Component } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-user-log',
    templateUrl: './user-log.component.html',
    styleUrl: './user-log.component.css',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
    ],
})
export class UserLogComponent {}
