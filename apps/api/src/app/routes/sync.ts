import * as express from 'express';
import * as request from 'request';
import * as bodyParser from 'body-parser';
import axios from 'axios';

import { environment } from '../../environments/environment';
import { hexEncode, verifyJwt } from '../utils';

export const router = express.Router();

const toUserDbUrl = (url, username) =>
  `${environment.couchDbUrl}/userdb-${hexEncode(username)}/${url.replace(
    '/api/sync',
    ''
  )}`;

router.all('/api/sync/*', async (req, res, next) => {
  try {
    const { sub } = verifyJwt(req.headers.authorization);
    const url = toUserDbUrl(req.url, sub);
    req.pipe(request(url)).pipe(res);
  } catch (err) {
    next(err);
  }
});

export const syncRouter = router;
