import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { User, UserProfileDto } from '../_sdk/models';
import { UsersApiService } from '../_sdk/services';
import { faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { SessionsService } from '../shared/services/sessions.service';
import { Router } from '@angular/router';
import { BottomRoutes, NavigationService } from '../shared/services/navigation.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  public users: UserProfileDto[] = [];
  public filteredUsers: UserProfileDto[] = [];
  public search: string = '';
  public loading = false;

  public faSearch = faSearch;
  public faExit = faSignOutAlt;
  
  constructor(private userApi: UsersApiService, private authService: AuthService, private sessionsService: SessionsService, private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }


  async fetchUsers() {
    this.loading = true;
    try {
      this.users = await this.userApi.usersControllerFindAll().toPromise();
    }
    catch(err) {
      console.log(err);
      
    }
    this.onFilterChange();
    this.loading = false;
  }

  onFilterChange() {
    this.filteredUsers = this.users.filter(user => {
      return user.name.toLowerCase().includes(this.search.toLowerCase()) 
    });
  }

  onClickLogout() {
    this.authService.logout();
  }

  async onClickUser(userId: string) {
    try {
      await this.sessionsService.setSessionUser(userId);
      this.navigationService.navigateTo(BottomRoutes.HOME);
    }
    catch(err) {
      console.log(err);
    }
  }

  /**
   * @method onClickNewUser
   * @description creates a new user out of the search field string
   */
  async onClickNewUser() {
    try {
      const user = await this.userApi.usersControllerCreate( {
        body: {
          name: this.search,
        }
      }).toPromise();

      await this.sessionsService.setSessionUser(user.id);
      this.navigationService.navigateTo(BottomRoutes.HOME);
    }
    catch(err) {
      // TODO give notification something went wrong
      console.log(err);
    }
  }
}
