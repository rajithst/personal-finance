import { Component } from '@angular/core';
import { SessionEventMessage, SessionService } from './core/session.service';
import { ProgressBarMode } from '@angular/material/progress-bar';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  progressMode: ProgressBarMode = 'determinate';
  message = this.sessionService.getEventMessage()
  filters: any = {}

  constructor(private sessionService:SessionService) {
    this.progressMode = 'indeterminate';
    this.sessionService.refresh()
    this.message.subscribe((msg: SessionEventMessage)  => {
      if (msg === SessionEventMessage.INIT_SESSION_LOAD_SUCCESS) {
        this.progressMode = 'determinate';
      }
    })
  }

  onFilterSearch($event: any) {
    console.log('reciveing...')
    this.filters = $event;
  }
}
