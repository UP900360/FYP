/* eslint-disable no-unused-vars */

import sqlite from 'sqlite3';
import { open } from 'sqlite';

async function init() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite.Database,
  });
  await db.migrate({ migrationsPath: './migrations' });
  return db;
}

const dbConn = init();
