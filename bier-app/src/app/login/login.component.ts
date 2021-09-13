import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { faLock, faEye } from '@fortawesome/free-solid-svg-icons';

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

  public faPassword = faLock;
  public faEye = faEye;

  code: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  public async onClickLogin(): Promise<void> {
    this.loading = true;

    const success = await this.auth.login(this.code);

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
}
