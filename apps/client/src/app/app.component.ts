import { Component } from '@angular/core';
import { AuthService } from './services/auth';
import { OrderService } from './services/orders';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { JWT_TOKEN_KEY } from '../const';
import { Order } from './types';
import { DatabaseService } from './services/database';
import { Subject } from 'rxjs';

@Component({
  selector: 'pdrc-offline-first-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private destroy$ = new Subject();

  userModel = { username: 'user1', password: 'user1' };
  orders$ = this.orderService.getOrders();

  constructor(
    private readonly database: DatabaseService,
    private readonly authService: AuthService,
    private readonly orderService: OrderService
  ) {}

  register() {
    this.authService
      .register({ ...this.userModel })
      .pipe(
        takeUntil(this.destroy$),
        tap(({ token }) => localStorage.setItem(JWT_TOKEN_KEY, token)),
        tap(() => this.database.invalidate())
      )
      .subscribe();
  }

  login() {
    return this.authService
      .login({ ...this.userModel })
      .pipe(
        takeUntil(this.destroy$),
        tap(({ token }) => localStorage.setItem(JWT_TOKEN_KEY, token)),
        tap(() => this.database.invalidate())
      )
      .subscribe();
  }

  logout() {
    this.authService.logout().subscribe(() => this.database.invalidate());
  }

  createOrder() {
    this.orderService.createOrder({
      title: 'order1' + new Date().toString(),
    });
  }

  updateOrder(order: Order) {
    this.orderService.updateOrder({
      ...order,
      title: order.title + ' updated',
    });
  }

  deleteOrder(order: Order) {
    this.orderService.deleteOrder(order);
  }

  invalidate() {
    this.database.invalidate();
  }
}
