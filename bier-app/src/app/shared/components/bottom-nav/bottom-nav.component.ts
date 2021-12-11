import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { BottomRoutes, BottomRoutesLocation, NavigationService, NavigationState } from '../../services/navigation.service';
import { faHome, faBeer, faUser, faTrophy, faUsers, faUserTie, faMap } from '@fortawesome/free-solid-svg-icons';
import { SessionsService } from '../../services/sessions.service';

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
  public faCodes = faUsers;
  public faWaiters = faUserTie;
  public faMaps = faMap;
  public faBeverages = faBeer;

  public navState: NavigationState | undefined; 

  constructor(private navigationService: NavigationService, private sessionService: SessionsService) { }

  ngOnInit(): void {
    this.navigationService.bottomNavSubject.subscribe(state => {
      this.navState = state;
    })
  }

  navigateTo(route: BottomRoutes) {
    this.navigationService.navigateTo(route);
  }

  public get isCreator(): boolean {
    return this.sessionService.creator ? true : false;
  }

  public get bottomRoutes(): typeof BottomRoutes {
    return BottomRoutes; 
  }

  public getBottomRoutesLocation(bottomRoute: BottomRoutes): number {
    return BottomRoutesLocation[bottomRoute];
  }

}
