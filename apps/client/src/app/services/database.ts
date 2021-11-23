import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import PouchDB from 'pouchdb';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import { JWT_TOKEN_KEY } from '../../const';
import { Change, Doc } from '../types';

@Injectable()
export class DatabaseService {
  private syncUrl = `${this.document.location.protocol}//${this.document.location.host}/api/sync`;
  private db: any;
  private change$ = new BehaviorSubject<Change | null>(null);

  data$ = new BehaviorSubject<Doc[] | null>(null);

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.change$
      .pipe(withLatestFrom(this.data$))
      .subscribe(([change, data]) => {
        if (!change || !data) {
          console.log('Change or data is missed');
          return;
        }

        const { id, deleted, doc: newDoc } = change;
        const docIndex = data.findIndex((doc) => doc?._id === id);
        const doc = data[docIndex];

        switch (true) {
          case doc === undefined && deleted:
            break;
          case doc !== undefined && deleted:
            data.splice(docIndex, 1);
            break;
          case doc !== undefined:
            data[docIndex] = newDoc;
            break;
          default:
            data.push(newDoc);
        }

        this.data$.next(data);
      });

    this.init();
  }

  invalidate() {
    return this.destroy().then(() => {
      this.init();
    });
  }

  destroy() {
    return this.db
      .destroy()
      .then(() => {
        this.data$.next([]);
      })
      .catch((err: any) => {
        this.data$.next([]);
      });
  }

  getAll(): Observable<Doc[] | null> {
    return this.data$.asObservable();
  }

  createOne(value: Omit<Doc, '_id' | '_rev'>): Observable<Doc> {
    return from<Promise<Doc>>(this.db.post(value));
  }

  updateOne(value: Doc): Observable<Doc> {
    return from<Promise<Doc>>(this.db.put(value));
  }

  deleteOne(value: Doc): Observable<Doc> {
    return from<Promise<Doc>>(this.db.remove(value));
  }

  private init() {
    const token = localStorage.getItem(JWT_TOKEN_KEY);
    const opts = {
      headers: { Authorization: token },
    };

    this.db = new PouchDB('pdrc');
    this.db.replicate
      .from(this.syncUrl, opts)
      .on('complete', () => {
        this.db
          .sync(this.syncUrl, {
            ...opts,
            live: true,
            retry: true,
            continuous: true,
            back_off_function: (delay: number) => {
              if (delay === 0) {
                return 1000;
              }
              return delay * 3;
            },
          })
          .on('denied', ({ doc }: { doc: Change }) => {
            if (!doc.error) {
              return;
            }
            this.invalidate();
          });
      })
      .on('error', (err: any) => {
        console.log(err);
        this.destroy();
      });

    this.db
      .allDocs({ include_docs: true })
      .then((result: any) => {
        const data = result.rows.map(({ doc }: { doc: Doc }) => doc);
        this.data$.next(data);
        this.db
          .changes({ live: true, since: 'now', include_docs: true })
          .on('change', (change: Change) => this.change$.next(change));
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
}
