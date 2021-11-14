import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import { JWT_TOKEN_KEY } from '../../const';
import { environment } from '../../environments/environment';
import { Change, Doc } from '../types';

@Injectable()
export class DatabaseService {
  private destroy$ = new Subject();

  private db: any;
  private change$ = new BehaviorSubject<Change | null>(null);

  data$ = new BehaviorSubject<Doc[] | null>(null);

  constructor() {
    this.init();
  }

  invalidate() {
    this.destroy();
    this.init();
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

  destroy() {
    this.destroy$.next();
    this.data$.next([]);
    this.db.destroy();
  }

  private init() {
    this.db = new PouchDB(`pdrc-${new Date().toString()}`);
    this.sync();

    this.change$
      .pipe(takeUntil(this.destroy$), withLatestFrom(this.data$))
      .subscribe(([change, data]) => {
        if (!change || !data) {
          console.log('Change or data is missed');
          return;
        }

        const docIndex = data.findIndex((doc) => doc?._id === change.id);
        const doc = data[docIndex];

        switch (true) {
          case doc === undefined && change.deleted:
            break;
          case doc !== undefined && change.deleted:
            data.splice(docIndex, 1);
            break;
          case doc !== undefined:
            data[docIndex] = change.doc;
            break;
          default:
            data.push(change.doc);
        }

        this.data$.next(data);
      });

    from<Promise<Doc[]>>(this.db.allDocs({ include_docs: true }))
      .pipe(
        takeUntil(this.destroy$),
        map((result: any) => result.rows.map(({ doc }: { doc: Doc }) => doc))
      )
      .subscribe(
        (data) => {
          this.data$.next(data);
          this.db
            .changes({ live: true, since: 'now', include_docs: true })
            .on('change', (change: Change) => this.change$.next(change));
        },
        (err) => {
          console.log(err);
        }
      );
  }

  private sync() {
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
}
