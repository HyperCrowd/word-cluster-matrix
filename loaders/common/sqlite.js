const SqliteDatabaseConnection = require('better-sqlite3');
const { ensureFileSync } = require('fs-extra');

/**
 * A cache of all connections
 */
const cache = {};

/**
 * Get a sqlite database connection
 */
const getDb = (path) => {
  if (cache[path] === undefined) {
    ensureFileSync(path);
    cache[path] = new SqliteDatabaseConnection(path);
    cache[path].exec('PRAGMA journal_mode = OFF;');
    cache[path].exec('PRAGMA synchronous = 0;');
    cache[path].exec('PRAGMA cache_size = 1000000;');
    cache[path].exec('PRAGMA locking_mode = EXCLUSIVE');
    cache[path].exec('PRAGMA temp_store = MEMORY;');
  }

  return cache[path];
};

/**
 *
 * @param path
 */
const reset = (path) => {
  cache[path] = undefined;
};

/**
 * run
 */
const run = (db, query, parameters = undefined) => {
  const statement = db.prepare(query);

  if (parameters === undefined) {
    return statement.run();
  } else {
    return statement.bind(parameters).run();
  }
};

/**
 * query
 * @param query sql
 * @param parameters Object
 * @param db SqliteDatabaseConnection
 * @return Object[]
 */
const query = (db, query, parameters) => {
  const statement = db.prepare(query);
  return statement.bind(parameters).all();
};

module.exports = {
  getDb,
  reset,
  query,
  run
}