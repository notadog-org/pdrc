import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { JWT_TOKEN_KEY } from '../../const';
import { environment } from '../../environments/environment';
import { Order } from '../types';

@Injectable()
export class OrderService {
  data: Order[] = [];
  db: any;

  constructor() {
    this.db = new PouchDB('orders');
    this.sync();
  }

  sync() {
    const token = localStorage.getItem(JWT_TOKEN_KEY);
    const url = `${environment.apiHost}/api/sync`;
    this.db.sync(url, {
      headers: { Authorization: token },
      live: true,
      retry: true,
      continuous: true,
      back_off_function: (delay: number) => {
        if (delay === 0) {
          return 1000;
        }
        return delay * 3;
      },
    });
  }

  getAll(): Promise<Order[]> {
    if (this.data.length > 0) {
      return Promise.resolve(this.data);
    }

    return new Promise((resolve) => {
      this.db
        .allDocs({ include_docs: true })
        .then((result: any) => {
          this.data = [];
          result.rows.forEach((row: any) => {
            this.data = [...this.data, row.doc];
          });
          resolve(this.data);
          this.db
            .changes({ live: true, since: 'now', include_docs: true })
            .on('change', (change: Order) => {
              this.handleChange(change);
            });
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
  }

  handleChange(change: any) {
    const docIndex = this.data.findIndex((doc) => doc?._id === change.id);
    const doc = this.data[docIndex];

    switch (true) {
      case doc !== undefined && change.deleted:
        this.data.splice(docIndex, 1);
        break;
      case doc !== undefined:
        this.data[docIndex] = change.doc;
        break;
      default:
        this.data.push(change.doc);
    }
  }

  createOrder(order: Order) {
    this.db.post(order).catch((err: any) => {
      console.log(err);
    });
  }
  updateOrder(order: Order) {
    this.db.put(order).catch((err: any) => {
      console.log(err);
    });
  }
  deleteOrder(order: Order) {
    this.db.remove(order).catch((err: any) => {
      console.log(err);
    });
  }
}
