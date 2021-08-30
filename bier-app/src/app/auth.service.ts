import { Injectable } from '@angular/core';
import { AuthApiService } from './_sdk/services';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private authApi: AuthApiService) {}

  public async login(code: string): Promise<boolean> {
    try {
      const res = await this.authApi
        .authControllerLoginWithCode({ code })
        .toPromise();
      if (res) {
        // Set the auth token somewhere
        // Set Role that is in return body
        // Go to correct page (either chose user or go to admin page)
      }
    } catch (err) {
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
}
