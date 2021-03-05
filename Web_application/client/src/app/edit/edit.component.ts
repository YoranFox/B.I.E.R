import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  accessCode: number = 1234;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  onClickChangePassword(){
    this.router.navigate(['change-password'], {relativeTo: this.route})
  }

  onClickCreate2dSpace(){
    this.router.navigate(['create-space'], {relativeTo: this.route})
  }



  goBack(){
    this.router.navigate(['home'])
  }

}
