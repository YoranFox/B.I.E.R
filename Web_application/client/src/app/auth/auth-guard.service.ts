import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const roles = route.data.roles;
    const url = state.url;
    
    if (!this.auth.isAuthenticated(roles)) {
      this.router.navigate(['login'], { state: { next: url } });
      return false;
    }
    return true;
  }


}