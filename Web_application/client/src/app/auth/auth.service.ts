// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogin = false;
  isRole: string | undefined;

  constructor(private router: Router) {}

  public isAuthenticated(needsRole: string[]): boolean {
    const role = localStorage.getItem('role');
    if(!role){
      return false;
    }
    return needsRole.includes(role);
  }

  public validateToken(token: string):boolean{
    return environment.keys.includes(token);
  }

  login(user:any){
    this.isLogin = true;
    this.isRole = user.role;
    localStorage.setItem('login-token', user.token)
    localStorage.setItem('role', user.role)
  }

  logout(){
    this.isLogin = false;
    this.isRole = undefined;
    localStorage.removeItem('login-token')
    localStorage.removeItem('role');
    this.router.navigate(['login'])
  }

  isLoggedIn():boolean{
    return this.isLogin;
  }
}