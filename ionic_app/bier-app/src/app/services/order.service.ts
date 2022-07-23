import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrder } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  activeOrderId: string;
  $activeOrder: Observable<IOrder>;

  constructor() {}
}
