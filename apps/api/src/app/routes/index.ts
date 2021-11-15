import { environment } from '../../environments/environment';

import {
  authRouter as couchAuthRouter,
  syncRouter as couchSyncRouter,
} from './couchdb';
import {
  authRouter as cloudantAuthRouter,
  syncRouter as cloudantSyncRouter,
} from './cloudant';

const { production } = environment;

export const authRouter = production ? cloudantAuthRouter : couchAuthRouter;
export const syncRouter = production ? cloudantSyncRouter : couchSyncRouter;
