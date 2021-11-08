import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth';
import { OrderService } from './services/orders';
import { tap } from 'rxjs/operators';
import { JWT_TOKEN_KEY } from '../const';
import { Order } from './types';

@Component({
  selector: 'pdrc-offline-first-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  userModel = { username: '', password: '' };
  orders: Order[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly orderService: OrderService
  ) {}

  ngOnInit() {
    this.orderService.getAll().then((data) => {
      this.orders = data;
    });
  }

  register() {
    this.authService
      .register({ ...this.userModel })
      .pipe(
        tap(({ token }) => {
          localStorage.setItem(JWT_TOKEN_KEY, token);
        })
      )
      .pipe(tap(() => this.orderService.sync()))
      .subscribe();
  }

  login() {
    this.authService
      .login({ ...this.userModel })
      .pipe(
        tap(({ token }) => {
          localStorage.setItem(JWT_TOKEN_KEY, token);
        })
      )
      .pipe(tap(() => this.orderService.sync()))
      .subscribe();
  }

  createOrder() {
    this.orderService.createOrder({ title: 'order1' + new Date().toString() });
  }

  updateOrder(order: Order) {
    this.orderService.updateOrder({
      _id: order._id,
      _rev: order._rev,
      title: order.title + ' updated',
    });
  }

  deleteOrder(order: Order) {
    this.orderService.deleteOrder(order);
  }
}
