import { Injectable } from '@angular/core';
import { LoginResponseDto } from '../_sdk/models';
import { AuthApiService } from '../_sdk/services/auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public authToken: string | undefined;

  constructor(private authApi: AuthApiService) {}

  public async login(code: string): Promise<boolean> {
    try {
      const res: LoginResponseDto = await this.authApi
        .authControllerLoginWithCode({ code })
        .toPromise();
      if (res) {
        // Set the auth token somewhere
        this.setAuthToken(res.jwt)
        // Set Role that is in return body
        // Go to correct page (either chose user or go to admin page)
      }
    } catch (err) {
      console.log(err);
      
      return false;
    }
    return true;
  }

  public async logout(): Promise<boolean> {
    // give signal to api that session will be stopped
    // remove auth-token, role, user and remove coockies except user coockie
    // route user to the login page
    return true;
  }


  private setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('auth-token', token);
  }
}
