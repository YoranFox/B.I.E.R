import { tokenize } from '@angular/compiler/src/ml_parser/lexer';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { EncriptDecriptService } from '../shared-services/encript-decript.service';
import { ApiService } from '../_sdk/services';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private authService: AuthService, private router: Router, private encriptDecriptService: EncriptDecriptService, private apiService: ApiService) { }

  async login(info: any){
    const loginInfo = await this.apiService.passwordsControllerLogin({body: info}).toPromise()
    const {role, token} = loginInfo;

    if(role && token){
      this.authService.login(loginInfo)
      return this.loginSuccesfull()
    }

    else{
      return this.loginUnsuccesfull()
    }
  }


  private loginSuccesfull(){

    return true;
  }

  private loginUnsuccesfull(){
    return false;
  }

  public isLoggedIn(){
    return this.authService.isLoggedIn();
  }


}
