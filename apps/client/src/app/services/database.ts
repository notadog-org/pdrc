import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import PouchDB from 'pouchdb';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { map, takeUntil, withLatestFrom } from 'rxjs/operators';

import { JWT_TOKEN_KEY } from '../../const';
import { Change, Doc } from '../types';

@Injectable()
export class DatabaseService {
  private destroy$ = new Subject();

  private syncUrl = `${this.document.location.protocol}//${this.document.location.host}/api/sync`;
  private db: any;
  private change$ = new BehaviorSubject<Change | null>(null);

  data$ = new BehaviorSubject<Doc[] | null>(null);

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
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

    this.db
      .sync(this.syncUrl, {
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
      })
      .on('denied', ({ doc }: { doc: Change }) => {
        if (!doc.error) {
          return;
        }
        this.invalidate();
      });
  }
}
