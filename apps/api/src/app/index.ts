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
  const app = express();

  app.use(cors({ credentials: true, origin: true }));

  //should be before the global bodyParser to prevent sync errors
  app.use(syncRouter);

  app.use(bodyParser.json({ type: 'application/json' }));
  app.use(authRouter);

  const port = process.env.port || 3333;

  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });

  server.on('error', console.error);
};
