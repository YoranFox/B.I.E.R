import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm:FormGroup;
  
  constructor(private formBuilder:FormBuilder, private router:Router) {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: '',
      newPassword: ''
    });
   }

  ngOnInit(): void {
  }

  goBack(){
    this.router.navigate(['edit'])
  }

}
