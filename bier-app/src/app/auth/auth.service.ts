import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BottomRoutes, NavigationService } from '../shared/services/navigation.service';
import { SessionsService } from '../shared/services/sessions.service';
import { LoginResponseDto } from '../_sdk/models';
import { AuthApiService } from '../_sdk/services';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  public authToken: string | undefined;

  constructor(private authApi: AuthApiService, private navigationService: NavigationService, private sessionsService: SessionsService) {
    this.initLocalAuthToken()
  }

  public async login(code: string): Promise<boolean> {
    try {
      const res: LoginResponseDto = await this.authApi
        .authControllerLoginWithCode({ code })
        .toPromise();
      this.setAuthToken(res.jwt)
      await this.sessionsService.updateLocalSession();
      this.routeAfterLogin();

    } catch (err) {
      console.log(err);      
      return false;
    }
    return true;
  }

  public async logout(): Promise<boolean> {
    // TODO give signal to api that session will be stopped

    // remove auth-token, role, user and remove coockies except user coockie
    this.removeAuthToken();
    // route user to the login page
    this.navigationService.navigateToLogin();
    return true;
  }

  public async initLocalAuthToken() {
    const token = localStorage.getItem('auth-token');
    
    if(token) {
      // do some validation of the token
      // set the session in session service
      this.authToken = token;
      try { 
        await this.sessionsService.updateLocalSession();
      }
      catch(err) {
        console.log(err);
        
        this.logout();
      }
    }
    else {
      this.logout();
    }
  }

  async isAuthenticated() {
    return await this.authApi.authControllerIsAuthenticated().toPromise();
  }

  private routeAfterLogin() {
    
    switch(this.sessionsService.role) {
      case 'Admin':
        this.navigationService.navigateToAdmin();
        break;

      case 'User':
        if(this.sessionsService.user) {
          this.navigationService.navigateTo(BottomRoutes.HOME)
          break;
        }
        this.navigationService.navigateToWelcome();
        break;
      
      default:
        // Robots are minority so they dont get to use the application
        this.logout()
        break;
    }
  }


  private setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('auth-token', token);
  }

  private removeAuthToken(): void {
    this.authToken = undefined;
    localStorage.removeItem('auth-token')
  }
}
