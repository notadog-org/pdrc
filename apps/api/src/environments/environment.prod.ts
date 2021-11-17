const {
  NX_JWT_SECRET,
  NX_COUCH_DB_PROTOCOL,
  NX_COUCH_DB_USER,
  NX_COUCH_DB_PASSWORD,
  NX_COUCH_DB_HOST,
} = process.env;

export const environment = {
  production: true,
  jwtSecret: NX_JWT_SECRET,
  couchDbProtocol: NX_COUCH_DB_PROTOCOL,
  couchDbUser: NX_COUCH_DB_USER,
  couchDbPassword: NX_COUCH_DB_PASSWORD,
  couchdbHost: NX_COUCH_DB_HOST,
  couchDbUrl: `${NX_COUCH_DB_PROTOCOL}://${NX_COUCH_DB_HOST}`,
  couchDbRootHost: `${NX_COUCH_DB_PROTOCOL}://${NX_COUCH_DB_USER}:${NX_COUCH_DB_PASSWORD}@${NX_COUCH_DB_HOST}`,
};
