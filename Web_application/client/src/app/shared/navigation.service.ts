import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private currentSection:any;
  private lastLocation:any;

  constructor(private router: Router, private route: ActivatedRoute) { }

  changeLocation(location:string[], options?:any, section?:string){
    this.lastLocation = this.route;
    this.router.navigate(location, options);
    if(section){
      this.currentSection = section;
    }
  }

  getLastLocation(){
    return this.lastLocation;
  }

  getCurrentSection():string{
    return this.currentSection;
  }

}
