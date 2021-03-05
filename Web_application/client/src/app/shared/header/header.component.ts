import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title: string = '';

  constructor(private authService: AuthService, private headerService: HeaderService) {
    this.headerService.headerTitle.subscribe(value => {
      this.title = value;
    })
   }

  ngOnInit(): void {
  }

  doLogout(){
    this.authService.logout()
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  async requestFullscreen(){
    await document.documentElement.requestFullscreen()
    this.ngOnInit()
  }

  get isFullScreen(): boolean {
    const nav:any = window.navigator;

    if (("standalone" in nav)){
        return nav.standalone;
    }
    else{
      return document.fullscreen;

    }
  }
}
