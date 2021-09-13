import { Injectable } from '@angular/core';
import { 
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SessionsService } from '../shared/services/sessions.service';
import { AuthService } from './auth.service';
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(public auth: AuthService, public sessionService: SessionsService, public router: Router) {}
  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    await this.sessionService.updateLocalSession();
    const expectedRole = route.data.role;
    const userRole = this.sessionService.role;
    if (
        !this.sessionService.session &&
        userRole !== expectedRole
    ) {
        this.auth.logout()
        return false;
    }
    return true;
  }
}