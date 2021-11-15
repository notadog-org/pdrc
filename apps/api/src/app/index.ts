import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import { environment } from '../environments/environment';
import { authRouter, syncRouter } from './routes';

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
  const port = process.env.PORT || 3333;
  const app = express();

  app.use(cors({ credentials: true, origin: true }));

  // should be before the global bodyParser to prevent sync errors
  app.use(syncRouter);

  app.use(bodyParser.json({ type: 'application/json' }));
  app.use(authRouter);

  if (environment.production) {
    app.use(express.static(path.join(__dirname, '../client')));
    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, '../client/index.html'));
    });
  }

  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });

  server.on('error', console.error);
};
