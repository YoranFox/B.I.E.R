import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { BeveragesService } from 'src/app/shared/services/beverages.service';
import { EditRoutes, NavigationService } from 'src/app/shared/services/navigation.service';
import { Beverage } from 'src/app/_sdk/models';

@Component({
  selector: 'app-admin-beverages',
  templateUrl: './admin-beverages.component.html',
  styleUrls: ['./admin-beverages.component.scss']
})
export class AdminBeveragesComponent implements OnInit {

  public beverages: Beverage[] = [];
  faAdd = faPlus;

  constructor(private beveragesService: BeveragesService, private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.fetchBeverages();
  }

  async fetchBeverages() {
    this.beverages = await this.beveragesService.getCurrentCreatorBeverages();
  }

  onClickBeverage(id: string) {
    this.navigationService.navigateToEdit(EditRoutes.BEVERAGE, id)
  }

  onClickAddBeverage() {
    this.navigationService.navigateToEdit(EditRoutes.BEVERAGE);
  }

}
