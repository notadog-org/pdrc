import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as btoa from 'btoa';
import axios from 'axios';

import { environment } from '../../environments/environment';

export const router = express.Router();

router.post('/api/auth/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { data } = await axios.put(
      `${environment.couchDbRootHost}/_users/org.couchdb.user:${req.body.username}`,
      {
        name: username,
        password,
        roles: [],
        type: 'user',
      },
      {}
    );
    const token = jwt.sign(
      { sub: username },
      Buffer.from(environment.jwtSecret, 'base64')
    );

    return res.json({ token: `Bearer ${token}`, ...data });
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
    const token = jwt.sign(
      { sub: username },
      Buffer.from(environment.jwtSecret, 'base64')
    );

    return res.json({ token: `Bearer ${token}`, ...data });
  } catch (err) {
    next(err);
  }
});

export const authRouter = router;
