// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  async canActivate(): Promise<boolean> {
    if (!await this.auth.isAuthenticated()) {
        this.auth.logout()
        return false;
    }
    return true;
  }
}