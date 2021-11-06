import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class Orders {
  data: any;
  db: any;
  remote: any;

  constructor() {
    this.db = new PouchDB('pdrc');
    this.remote = 'http://localhost:3333/api/sync/pdrc';

    const options = {
      live: true,
      retry: true,
      continuous: true,
    };
    this.db.sync(this.remote, options);
  }
}
