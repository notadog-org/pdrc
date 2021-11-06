import * as request from 'request';
import * as express from 'express';

import { COUCH_DB_ROOT_HOST, COUCH_DB_HOST } from '../../env';

export const router = express.Router();

router.post('/api/auth/register', async function (req, res) {
  request
    .put(`${COUCH_DB_ROOT_HOST}/_users/org.couchdb.user:${req.body.username}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        name: req.body.username,
        password: req.body.password,
        roles: [],
        type: 'user',
      },
      json: true,
    })
    .pipe(res);
});

router.post('/api/auth/login', async function (req, res) {
  request
    .post(`${COUCH_DB_HOST}/_session`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        name: req.body.username,
        password: req.body.password,
      },
      json: true,
    })
    .pipe(res);
});

export const authRouter = router;
