import fs from 'node:fs';
import path from 'node:path';
import initSqlJs from 'sql.js';
import { config } from '../config.js';

let SQL;
let db;

function ensureDataDir() {
  fs.mkdirSync(config.dataDir, { recursive: true });
}

export async function getDb() {
  if (db) return db;

  ensureDataDir();
  SQL = SQL || (await initSqlJs());

  if (fs.existsSync(config.dbPath)) {
    db = new SQL.Database(fs.readFileSync(config.dbPath));
  } else {
    db = new SQL.Database();
    persistDb();
  }

  db.run('PRAGMA foreign_keys = ON;');
  return db;
}

export function persistDb() {
  if (!db) return;
  ensureDataDir();
  fs.writeFileSync(config.dbPath, Buffer.from(db.export()));
}

export async function execSql(sql) {
  const database = await getDb();
  database.run(sql);
  persistDb();
}

export function queryOne(database, sql, params = {}) {
  const statement = database.prepare(sql);
  try {
    if (Object.keys(params).length) statement.bind(params);
    if (!statement.step()) return null;
    return statement.getAsObject();
  } finally {
    statement.free();
  }
}

export function queryAll(database, sql, params = {}) {
  const statement = database.prepare(sql);
  const rows = [];
  try {
    if (Object.keys(params).length) statement.bind(params);
    while (statement.step()) {
      rows.push(statement.getAsObject());
    }
    return rows;
  } finally {
    statement.free();
  }
}

export function runStatement(database, sql, params = {}) {
  const statement = database.prepare(sql);
  try {
    if (Object.keys(params).length) {
      statement.run(params);
    } else {
      statement.run();
    }
    persistDb();
  } finally {
    statement.free();
  }
}

export function migrationsDir() {
  return path.join(config.rootDir, 'server', 'db', 'migrations');
}
