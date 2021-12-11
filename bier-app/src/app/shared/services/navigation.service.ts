import { Injectable } from '@angular/core';
import { Router, RouterState } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

export enum BottomRoutes {
  NONE,
  HOME,
  RANKINGS,
  ORDERS,
  PROFILE,
  CREATOR_CODES,
  CREATOR_WAITERS,
  CREATOR_BEVERAGES,
  CREATOR_MAPS,
}

export enum EditRoutes {
  CODE,
  MAP,
  WAITER,
  BEVERAGE,
  ORDER,
}

export interface NavigationState {
  lastLocation: BottomRoutes;
  currentLocation: BottomRoutes;
}

export const BottomRoutesLocation: Record<number, number> = {
  [BottomRoutes.NONE]: -1,
  [BottomRoutes.HOME]: 1,
  [BottomRoutes.RANKINGS]: 3,
  [BottomRoutes.ORDERS]: 2,
  [BottomRoutes.PROFILE]: 4,
  [BottomRoutes.CREATOR_CODES]: 1,
  [BottomRoutes.CREATOR_BEVERAGES]: 2,
  [BottomRoutes.CREATOR_WAITERS]: 3,
  [BottomRoutes.CREATOR_MAPS]: 4,
};

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  public bottomNavState: NavigationState = {
    lastLocation: BottomRoutes.NONE,
    currentLocation: BottomRoutes.NONE,
  };
  public bottomNavSubject: BehaviorSubject<NavigationState> =
    new BehaviorSubject<NavigationState>(this.bottomNavState);

  private locationCommands: Record<number, any[]> = {
    [BottomRoutes.HOME]: [
      'main',
      'user',
      { outlets: { 'main-page': ['home'] } },
    ],
    [BottomRoutes.RANKINGS]: [
      'main',
      'user',
      { outlets: { 'main-page': ['rankings'] } },
    ],
    [BottomRoutes.ORDERS]: [
      'main',
      'user',
      { outlets: { 'main-page': ['orders'] } },
    ],
    [BottomRoutes.PROFILE]: [
      'main',
      'user',
      { outlets: { 'main-page': ['profile'] } },
    ],
    [BottomRoutes.CREATOR_CODES]: [
      'main',
      'creator',
      { outlets: { 'main-page': ['codes'] } },
    ],
    [BottomRoutes.CREATOR_BEVERAGES]: [
      'main',
      'creator',
      { outlets: { 'main-page': ['beverages'] } },
    ],
    [BottomRoutes.CREATOR_WAITERS]: [
      'main',
      'creator',
      { outlets: { 'main-page': ['waiters'] } },
    ],
    [BottomRoutes.CREATOR_MAPS]: [
      'main',
      'creator',
      { outlets: { 'main-page': ['maps'] } },
    ],
  };

  private editLocationCommands: Record<number, any[]> = {
    [EditRoutes.CODE]: ['edit', 'creator', 'code'],
    [EditRoutes.BEVERAGE]: ['edit', 'creator', 'beverage'],
    [EditRoutes.ORDER]: ['edit', 'user', 'order'],
  };

  constructor(private router: Router) {}

  initLocationFromURL() {}

  navigateTo(route: BottomRoutes) {
    this.router.navigate(this.locationCommands[route]);
    this.bottomNavState = {
      lastLocation: this.bottomNavState.currentLocation,
      currentLocation: route,
    };
    this.bottomNavSubject.next(this.bottomNavState);
  }

  navigateToWelcome() {
    this.router.navigate(['welcome']);
  }

  navigateToCreator() {
    this.navigateTo(BottomRoutes.CREATOR_CODES);
  }

  navigateToLogin() {
    this.router.navigate(['login']);
  }

  navigateToEdit(route: EditRoutes, id?: string) {
    const location = this.editLocationCommands[route];
    this.router.navigate(location, {
      state: { new: id ? false : true, id: id },
    });
  }
}
