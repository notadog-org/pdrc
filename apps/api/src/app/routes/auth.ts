import * as express from 'express';
import * as btoa from 'btoa';
import axios from 'axios';

import { environment } from '../../environments/environment';
import { signJwt, sleep } from '../utils';

export const router = express.Router();

router.post('/api/auth/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { data } = await axios.put(
      `${environment.couchDbRootHost}/_users/org.couchdb.user:${username}`,
      {
        name: username,
        password,
        roles: ['user'],
        type: 'user',
        settings: {},
      }
    );

    //TODO(klikkn): refactor
    await sleep(500);

    const token = signJwt({ username });
    res.json({ token: `Bearer ${token}`, ...data });
  } catch (err) {
    next(err);
  }
});

router.post('/api/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { data } = await axios.get(`${environment.couchDbHost}/_session`, {
      headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` },
    });
    const token = signJwt({ username });
    res.json({ token: `Bearer ${token}`, ...data });
  } catch (err) {
    next(err);
  }
});

export const authRouter = router;
