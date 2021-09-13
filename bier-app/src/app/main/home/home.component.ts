import { Component, OnInit } from '@angular/core';
import { SessionsService } from 'src/app/shared/services/sessions.service';
import { User } from 'src/app/_sdk/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: User | undefined;
  orderCount: number = 10;
  userRank: number = 1;

  constructor(private sessionService: SessionsService) {}

  ngOnInit(): void {
    this.user = this.sessionService.user;
  }

}
