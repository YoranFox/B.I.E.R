import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserProfileDto } from '../_sdk/models';
import { UsersApiService } from '../_sdk/services';

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

  constructor(private userApi: UsersApiService) { }

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
    console.log(this.search);
    
    this.filteredUsers = this.users.filter(user => {
      return user.name.toLowerCase().includes(this.search.toLowerCase()) 
    });
  }



  mockUsers() {
    return [{name: 'Yoran'}]
  }

}
