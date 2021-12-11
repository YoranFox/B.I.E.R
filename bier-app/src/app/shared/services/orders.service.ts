import { Injectable } from '@angular/core';
import { CreateBeverageDto, UpdateBeverageDto } from 'src/app/_sdk/models';
import { OrdersApiService } from 'src/app/_sdk/services';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private beveragesApi: OrdersApiService) {}

  async getOrder(id: string) {
    return await this.beveragesApi.ordersControllerFindOne({ id }).toPromise();
  }
}
