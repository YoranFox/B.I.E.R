import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { BottomRoutes, NavigationService, NavigationState } from '../../services/navigation.service';
import { faHome, faBeer, faUser, faTrophy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent implements OnInit {

  public faHome = faHome;
  public faOrders = faBeer;
  public faProfile = faUser;
  public faRanking = faTrophy;

  public navState: NavigationState | undefined; 

  constructor(private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.navigationService.bottomNavSubject.subscribe(state => {
      this.navState = state;
    })
  }

  navigateTo(route: BottomRoutes) {
    this.navigationService.navigateTo(route);
  }

  public get bottomRoutes(): typeof BottomRoutes {
    return BottomRoutes; 
  }

}
