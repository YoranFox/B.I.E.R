import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public invalidCred = false;

  constructor(private auth: AuthService) {
    this.form = new FormGroup(
      {
        name: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [Validators.required]),
        stayLoggedIn: new FormControl(false)
      }
    )
   }

  ngOnInit(): void {
  }


  public async onLogin(): Promise<void> {

    const data = this.form.getRawValue();

    const loginSuccesfull = await this.auth.login(data.name, data.password, data.stayLoggedIn)

    if(loginSuccesfull) {
      // Route to home page
      console.log('login succesfull');
      
    }

    else {
      this.invalidCred = true
      this.form.patchValue({
        password: null
      })
      this.form.markAsPristine();
    }
  } 

}
