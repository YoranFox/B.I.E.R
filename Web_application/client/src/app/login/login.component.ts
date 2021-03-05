import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import {MatIconModule} from '@angular/material/icon'
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  failedLogin = false
  loginForm:FormGroup;
  loginFailed = false;
  nextUrl:any;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router, private location:Location) {
    this.loginForm = this.formBuilder.group({
      password: ''
    });
    
   }

  ngOnInit(): void {
    
  }

  async onSubmit(){
    const loggedIn = await this.loginService.login(this.loginForm?.getRawValue());
    if(!loggedIn){
      console.log('login failed');
      
      this.loginFailed = true
    }
    else{
      const state:any = this.location.getState();
      if(state.next){
        this.nextUrl = state.next;
      }
      else{
        this.nextUrl = '/home'
      }
      this.router.navigateByUrl(this.nextUrl)
    }
  }

  goBack(){
    this.router.navigate(['home'])
  }
}
