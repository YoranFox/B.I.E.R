import { Injectable } from '@angular/core';
import { Router, RouterState } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

export enum BottomRoutes {
  NONE = -1,
  HOME = 1,
  RANKINGS = 3,
  ORDERS = 2,
  PROFILE = 4
}

export interface NavigationState {
  lastLocation: BottomRoutes,
  currentLocation: BottomRoutes
}


@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  
  public bottomNavState: NavigationState = {
    lastLocation: BottomRoutes.NONE,
    currentLocation: BottomRoutes.NONE
  };
  public bottomNavSubject: BehaviorSubject<NavigationState> = new BehaviorSubject<NavigationState>(this.bottomNavState);

  private locationCommands: Record<number, any[]> = {
    [BottomRoutes.HOME]: ['main', { outlets: {'main-page': ['home']}}],
    [BottomRoutes.RANKINGS]: ['main', { outlets: {'main-page': ['rankings']}}],
    [BottomRoutes.ORDERS]: ['main', { outlets: {'main-page': ['orders']}}],
    [BottomRoutes.PROFILE]: ['main', { outlets: {'main-page': ['profile']}}],
  }

  constructor(private router: Router) {}

  initLocationFromURL() {
  }


  navigateTo(route: BottomRoutes) {
    this.router.navigate(this.locationCommands[route]);
    this.bottomNavState = {
      lastLocation: this.bottomNavState.currentLocation,
      currentLocation: route,
    }
    this.bottomNavSubject.next(this.bottomNavState)
  }

  navigateToWelcome() {
   this.router.navigate(['welcome']);
  }

  navigateToAdmin() {
    this.router.navigate(['admin']);
  }

  navigateToLogin() {
    this.router.navigate(['login'])
  }
}
