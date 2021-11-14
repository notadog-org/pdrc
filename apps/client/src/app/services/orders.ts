import { Injectable } from '@angular/core';

import { DatabaseService } from './database';
import { Doc, Order } from '../types';
import { map } from 'rxjs/operators';

@Injectable()
export class OrderService {
  constructor(private readonly database: DatabaseService) {}

  getOrders() {
    return this.database.getAll().pipe(
      map((data: Doc[] | null) => {
        if (data === null) {
          return data;
        }

        return data
          .filter((doc) => doc.type === 'order')
          .map((doc) => new Order(doc));
      })
    );
  }

  createOrder(order: Order) {
    return this.database.createOne({ ...order, type: 'order' });
  }

  updateOrder(order: Order) {
    return this.database.updateOne(order);
  }

  deleteOrder(order: Order) {
    return this.database.deleteOne(order);
  }
}
