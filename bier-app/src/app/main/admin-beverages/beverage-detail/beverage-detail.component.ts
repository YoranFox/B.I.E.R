import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BeveragesService } from 'src/app/shared/services/beverages.service';
import { BottomRoutes, NavigationService } from 'src/app/shared/services/navigation.service';
import { Beverage } from 'src/app/_sdk/models';

@Component({
  selector: 'app-beverage-detail',
  templateUrl: './beverage-detail.component.html',
  styleUrls: ['./beverage-detail.component.scss']
})
export class BeverageDetailComponent implements OnInit {

  
  loading = false;
  new = false;

  beverageId!: string;
  beverage: Beverage | undefined;

  form = new FormGroup({
    name: new FormControl(null, Validators.required),
    description: new FormControl(null),
    pictureBase64String: new FormControl(null)
  });

  constructor(private navigationService: NavigationService, private beveragesService: BeveragesService, private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state
    this.new = state?.new;
    this.beverageId = state?.id
   }

  ngOnInit(): void {
    if(!this.new) {
      if(!this.beverageId) {
        // route back to codes
        this.navigationService.navigateTo(BottomRoutes.CREATOR_BEVERAGES);
        return;
      }
      this.fetchBeverage();
    } 
  }

  async fetchBeverage() {
    this.beverage = await this.beveragesService.getBeverage(this.beverageId);
    this.form.patchValue({
      ...this.beverage
    })
  }

  async onSubmit() {
    this.loading = true;
    const currentBeverage = this.form.getRawValue();
    try {
      if(this.new){
        await this.beveragesService.createBeverage(currentBeverage)
      }
      else {
        await this.beveragesService.updateBeverage(this.beverageId, currentBeverage)
      }

    }
    catch(err) {
      console.log(err);
    }
    this.loading = false;
  }

  onClickBack() {
    this.navigationService.navigateTo(BottomRoutes.CREATOR_BEVERAGES);
  }
}
