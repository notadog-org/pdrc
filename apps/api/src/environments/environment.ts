export const environment = {
  production: false,
  jwtSecret: process.env.NX_JWT_SECRET,
  couchDbUser: process.env.NX_COUCH_DB_USER,
  couchDbPassword: process.env.NX_COUCH_DB_PASSWORD,
  couchDbHost: `${process.env.NX_COUCH_DB_PROTOCOL}://${process.env.NX_COUCH_DB_HOST}`,
  couchDbRootHost: `${process.env.NX_COUCH_DB_PROTOCOL}://${process.env.NX_COUCH_DB_USER}:${process.env.NX_COUCH_DB_PASSWORD}@${process.env.NX_COUCH_DB_HOST}`,
};
