import {Component, ElementRef, inject, viewChild} from '@angular/core';
import {
  faSquareCaretLeft,
  faSquareCaretRight,
} from '@fortawesome/free-solid-svg-icons';
import { Title } from '@angular/platform-browser';
import {DataService} from "../service/data.service";

@Component({
  selector: 'app-payee-settings',
  templateUrl: './payee-settings.component.html',
  styleUrl: './payee-settings.component.css',
})
export class PayeeSettingsComponent {
  protected readonly faSquareCaretRight = faSquareCaretRight;
  protected readonly faSquareCaretLeft = faSquareCaretLeft;

  title = inject(Title);




}
