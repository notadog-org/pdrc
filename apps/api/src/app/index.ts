import * as request from 'request';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as jwt from 'jsonwebtoken';

import { environment } from '../environments/environment';

import { hexEncode } from './utils';
import { authRouter } from './routes';

if (
  [
    environment.couchDbHost,
    environment.couchDbUser,
    environment.couchDbPassword,
    environment.couchDbRootHost,
  ].includes(undefined)
) {
  throw new Error('no database connection');
}

export const App = function () {
  const app = express();

  app.use(cors({ credentials: true, origin: true }));

  app.all('/api/sync/*', function (req, res) {
    const { sub } = jwt.verify(
      req.headers.authorization.replace('Bearer ', ''),
      Buffer.from(environment.jwtSecret, 'base64')
    );
    const url = `${environment.couchDbHost}/userdb-${hexEncode(
      sub
    )}/${req.url.replace('/api/sync', '')}`;

    req.pipe(request(url)).pipe(res);
  });

  app.use(bodyParser.json({ type: 'application/json' }));
  app.use(authRouter);

  const port = process.env.port || 3333;

  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });

  server.on('error', console.error);
};
