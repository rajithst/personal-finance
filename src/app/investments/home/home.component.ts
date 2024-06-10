import {Component, inject, OnInit} from '@angular/core';
import {SessionService} from "../service/session.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  private sessionService = inject(SessionService)
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({investments}) => {
      this.sessionService.setSessionData(investments)
    });
  }

}
