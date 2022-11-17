import * as connectMemcached from 'connect-memcached';
import * as expressSession from 'express-session';
import { SessionOptions } from 'express-session';

function getMemcachedStore() {
  const store = connectMemcached(expressSession);

  return new store({
    host: process.env.MEMCACHED_HOST,
  });
}

function getStore() {
  if (process.env.SESSION_STORE === 'memcached') {
    return getMemcachedStore();
  }
}

export default {
  secret: process.env.SESSION_SECRET,
  resave: process.env.SESSION_RESAVE === 'true',
  saveUninitialized: process.env.SESSION_SAVE_UNINITIALIZED === 'true',
  store: getStore(),
} as SessionOptions;
