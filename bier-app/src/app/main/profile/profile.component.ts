import { Component, OnInit } from '@angular/core';
import { SessionsService } from 'src/app/shared/services/sessions.service';
import { User } from 'src/app/_sdk/models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User | undefined;

  constructor(private sessionService: SessionsService) {}

  ngOnInit(): void {
    this.user = this.sessionService.user;
  }

}
