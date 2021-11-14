import * as jwt from 'jsonwebtoken';

import { environment } from '../../environments/environment';

export const hexEncode = function (str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
};

export const signJwt = ({ username }) => {
  return jwt.sign(
    { sub: username },
    Buffer.from(environment.jwtSecret, 'base64')
  );
};

export const verifyJwt = (bearerToken: string) => {
  return jwt.verify(
    bearerToken.replace('Bearer ', ''),
    Buffer.from(environment.jwtSecret, 'base64')
  );
};

export const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
