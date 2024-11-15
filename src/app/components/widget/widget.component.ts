import {Component, input, Type} from '@angular/core';
import {NgComponentOutlet} from "@angular/common";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

export interface Widget {
  id: number;
  label: string;
  content: Type<unknown>,
  rows?: number;
  columns?: number;
  backgroundColor?: string;
  color?: string;
  hideSettingsButton?: boolean;
}

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [NgComponentOutlet, MatIconButton, MatIcon],
  template: `
    <div class="container mat-elevation-z3"
         [style.background-color]="data().backgroundColor ?? 'white'"
         [style.color]="data().color ?? 'inherit'"
    >
      <h3 class="widget-header">{{data().label}}</h3>
      @if(!data().hideSettingsButton) {
        <button mat-icon-button
                class="widget-settings-button"
                [style.--mdc-icon-button-icon-color]="data().color"
        >
          <mat-icon >settings</mat-icon>
        </button>
      }
      <ng-container [ngComponentOutlet]="data().content"/>
    </div>
  `,
  styles: `
    :host {
      display: block;
      border-radius: 16px;
    }

    .container {
      position: relative;
      height: 100%;
      width: 100%;
      padding: 10px 10px 30px 10px;
      border: 1px solid #dddddd;
      box-sizing: border-box;
      border-radius: inherit;
      overflow: hidden;
    }

    .widget-header {
      margin: 0;
      font-size: 16px;
      text-align: center;
    }

    .widget-settings-button {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  `,
  host: {
    '[style.grid-area]': '"span "+(data().rows ?? 1) +"/ span "+(data().columns ?? 1)'
  }
})
export class WidgetComponent {
  data = input.required<Widget>();
}
