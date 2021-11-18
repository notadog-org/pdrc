import { App } from './app';
import { environment } from './environments/environment';

export { App } from './app/';

const undefinedVars = Object.entries(environment)
  .filter(([, value]) => value === undefined)
  .map(([key]) => key);

if (undefinedVars.length > 0) {
  throw new Error(
    `Environment vars must be defined: ${undefinedVars.join(', ')}`
  );
}

App();
