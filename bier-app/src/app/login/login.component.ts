import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { faLock, faEnvelope, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public invalidCred = false;
  public loading = false;
  public loginCreateActive = false;
  public loginJoinActive = true;
  public codeShown = false;
  public creatorInputValid = false;

  public faPassword = faLock;
  public faEmail = faEnvelope;
  public faEye = faEye;

  code: string = '';

  email: string = '';
  password: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  public async onClickLoginCode(): Promise<void> {
    this.loading = true;

    const success = await this.auth.loginCode(this.code);

    if(!success) {
      this.invalidCred = true;
      this.code = '';
    }

    this.loading = false;
  }

  public async onClickLoginCreator(): Promise<void> {
    this.loading = true;

    const success = await this.auth.loginCreator(this.email, this.password);

    if(!success) {
      this.invalidCred = true;
      this.code = '';
    }

    this.loading = false;
  }

  selectAllContent($event: any) {
    $event.target.select();
  }

  onClickSwitchRight() {
    this.loginCreateActive = true;
    this.loginJoinActive = false;
  }
  
  onClickSwitchLeft() {
    this.loginCreateActive = false;
    this.loginJoinActive = true;
  }

  onClickShowCode() {
    this.codeShown = !this.codeShown;
  }

  checkInputValid() {
    function validateEmail(email: string) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    this.creatorInputValid = this.password !== '' && validateEmail(this.email);
  }
}
