import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
  BottomRoutes,
  NavigationService,
} from 'src/app/shared/services/navigation.service';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { Order } from 'src/app/_sdk/models';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  faArrow = faArrowLeft;

  loading = false;
  new = false;

  orderId!: string;
  public order: Order | undefined;

  constructor(
    private navigationService: NavigationService,
    private router: Router,
    private ordersService: OrdersService
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    this.new = state?.new;
    this.orderId = state?.id;
  }

  ngOnInit(): void {
    if (!this.new) {
      if (!this.orderId) {
        // route back to orders
        this.navigationService.navigateTo(BottomRoutes.CREATOR_CODES);
        return;
      }
      this.fetchOrder();
    }
  }

  async fetchOrder() {
    this.order = await this.ordersService.getOrder(this.orderId);
  }

  onClickBack() {
    this.navigationService.navigateTo(BottomRoutes.ORDERS);
  }
}
