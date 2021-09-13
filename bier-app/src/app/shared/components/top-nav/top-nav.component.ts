import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { faSignOutAlt, faUserEdit, faUserFriends } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  public faExit = faSignOutAlt;
  public faUserChange = faUserFriends;

  constructor(private authService: AuthService, private navigationService: NavigationService) { }

  ngOnInit(): void {
  }
  
  logout() {
    this.authService.logout()
  }

  goToUsers() {
    this.navigationService.navigateToWelcome();
  }

}
