import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  public $users: Observable<any[]> = new Observable();
  public search: string | undefined;

  constructor() { }

  ngOnInit(): void {
    this.fetchUsers();
  }


  fetchUsers() {
    this.$users = from(this.mockUsers());
  }



  async mockUsers() {
    return [{name: 'Yoran'}]
  }

}
