import {Component, OnInit} from '@angular/core';
import {SessionEventMessage, SessionService} from "../service/session.service";

@Component({
  selector: 'app-transaction-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class TransactionDashboardComponent implements OnInit {

  message = this.sessionService.getEventMessage();

  constructor(private sessionService:SessionService) {}

  ngOnInit(): void {
    this.message.subscribe((msg: SessionEventMessage) => {
      if (
        msg === SessionEventMessage.INIT_SESSION_LOAD_SUCCESS ||
        msg == SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS
      ) {

      }
    });
  }


}
