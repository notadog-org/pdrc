import * as express from 'express';
import * as btoa from 'btoa';
import axios from 'axios';

import { environment } from '../../environments/environment';
import { hexEncode, signJwt, sleep } from '../utils';
import { validation } from '../design';

export const router = express.Router();

router.post('/api/auth/register', async (req, res, next) => {
  try {
    if (environment.enableRegistration !== 'true') {
      throw new Error('Registration disabled');
    }

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
    //it allows couch db to create a user db
    await sleep(500);

    await axios.put(
      `${environment.couchDbRootHost}/userdb-${hexEncode(username)}/${
        validation._id
      }`,
      JSON.stringify(validation)
    );

    const token = signJwt({ username });
    res.json({ token: `Bearer ${token}`, ...data });
  } catch (err) {
    next(err);
  }
});

router.post('/api/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { data } = await axios.get(`${environment.couchDbUrl}/_session`, {
      headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` },
    });
    const token = signJwt({ username });
    res.json({ token: `Bearer ${token}`, ...data });
  } catch (err) {
    next(err);
  }
});

export const authRouter = router;
