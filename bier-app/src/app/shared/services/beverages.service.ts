import { Injectable } from '@angular/core';
import { CreateBeverageDto, UpdateBeverageDto } from 'src/app/_sdk/models';
import { BeveragesApiService } from 'src/app/_sdk/services';

@Injectable({
  providedIn: 'root'
})
export class BeveragesService {

  constructor(private beveragesApi: BeveragesApiService) { }

  async getCurrentCreatorBeverages() {
    return await this.beveragesApi.beveragesControllerFindByCurrentCreator().toPromise();
  }

  
  async createBeverage(beverage: CreateBeverageDto) {
    return await this.beveragesApi.beveragesControllerCreate({body: beverage}).toPromise();
  }

  async updateBeverage(id: string, beverage: UpdateBeverageDto) {
    return await this.beveragesApi.beveragesControllerUpdate({id, body: beverage}).toPromise();
  }

  async getBeverage(id: string) {
    return await this.beveragesApi.beveragesControllerFindOne({id}).toPromise();
  }

}
