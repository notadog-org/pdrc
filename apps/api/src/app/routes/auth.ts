import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as btoa from 'btoa';
import axios from 'axios';

import { JWT_SECRET, COUCH_DB_ROOT_HOST, COUCH_DB_HOST } from '../../env';

export const router = express.Router();

router.post('/api/auth/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { data } = await axios.put(
      `${COUCH_DB_ROOT_HOST}/_users/org.couchdb.user:${req.body.username}`,
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
      Buffer.from(JWT_SECRET, 'base64')
    );

    return res.json({ token: `Bearer ${token}`, ...data });
  } catch (err) {
    next(err);
  }
});

router.post('/api/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { data } = await axios.get(`${COUCH_DB_HOST}/_session`, {
      headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` },
    });
    const token = jwt.sign(
      { sub: username },
      Buffer.from(JWT_SECRET, 'base64')
    );

    return res.json({ token: `Bearer ${token}`, ...data });
  } catch (err) {
    next(err);
  }
});

export const authRouter = router;
