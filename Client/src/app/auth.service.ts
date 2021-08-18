import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public async login(name:string, password:string, stayLoggedIn:boolean): Promise<boolean> {

    // call api with creds

    // if authenticated set the local role and key then return true

    // else return false





    return false;
  }



}
