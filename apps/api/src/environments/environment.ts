export const environment = {
  production: false,
  jwtSecret: process.env.NX_JWT_SECRET,
  couchDbHost: process.env.NX_COUCH_DB_HOST,
  couchDbUser: process.env.NX_COUCH_DB_USER,
  couchDbPassword: process.env.NX_COUCH_DB_PASSWORD,
  couchDbRootHost: process.env.NX_COUCH_DB_ROOT_HOST,
};
