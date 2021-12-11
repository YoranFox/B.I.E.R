import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/_sdk/models/order';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  EditRoutes,
  NavigationService,
} from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  faAdd = faPlus;

  pendingOrders: Order[] = [];
  acceptedOrders: Order[] = [];

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {}

  onClickNewOrder() {
    this.navigationService.navigateToEdit(EditRoutes.ORDER);
  }
}
