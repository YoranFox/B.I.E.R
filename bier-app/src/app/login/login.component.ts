import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public invalidCred = false;
  public loading = false;

  code: string[] = [];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onDigitInput(event: any) {
    this.invalidCred = false;
    console.log(event.code);

    let element;
    if (event.code !== 'Backspace')
      element = event.srcElement.nextElementSibling;

    if (event.code === 'Backspace')
      element = event.srcElement.previousElementSibling;

    if (element == null) {
      element = document.getElementById('login-button');
      element?.focus({ preventScroll: true });
      element?.click();
    } else {
      element.focus({ preventScroll: true });
    }
  }

  public async onClickLogin(): Promise<void> {
    this.loading = true;

    const loginSuccesfull = await this.auth.login(this.code.join(''));

    if (loginSuccesfull) {
      // Route to home page
      this.router.navigate(['welcome']);
    } else {
      this.invalidCred = true;
      this.code = [];
    }

    this.loading = false;
  }

  selectAllContent($event: any) {
    $event.target.select();
  }
}
