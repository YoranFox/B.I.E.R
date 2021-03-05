import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.isSelected('lol')
  }

  goToEdit(){
    this.navigationService.changeLocation(['edit'], {}, 'edit')
  }

  goToHome(){
    this.navigationService.changeLocation(['home'], {}, 'home')
  }
  
  isSelected(path:string):boolean{
    const currentSection =  this.navigationService.getCurrentSection();
    
    return currentSection == path;
  }

}
