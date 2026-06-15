import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSql, getDb, migrationsDir, persistDb, queryOne, runStatement } from './database.js';

export async function runMigrations() {
  const database = await getDb();
  database.run(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      executed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  persistDb();

  const files = fs
    .readdirSync(migrationsDir())
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const applied = queryOne(database, 'SELECT id FROM migrations WHERE filename = $filename', { $filename: file });
    if (applied) continue;

    const sql = fs.readFileSync(path.join(migrationsDir(), file), 'utf8');
    await execSql(sql);
    runStatement(database, 'INSERT INTO migrations (filename) VALUES ($filename)', { $filename: file });
    console.log(`Migration applied: ${file}`);
  }
}

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  runMigrations().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
