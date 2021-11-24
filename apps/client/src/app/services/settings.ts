import { Injectable } from '@angular/core';

import { DatabaseService } from './database';
import { Doc, Settings } from '../types';
import { map } from 'rxjs/operators';

@Injectable()
export class SettingsService {
  constructor(private readonly database: DatabaseService) {}

  getSettings() {
    return this.database.getAll().pipe(
      map((data: Doc[] | null) => {
        if (data === null) {
          return data;
        }

        const settings = data.find((doc) => doc.type === 'settings');
        if (!settings) {
          return null;
        }

        return new Settings(settings);
      })
    );
  }

  updateSettings(settings: Settings) {
    return this.database.updateOne(settings);
  }
}
