const fs = require("fs/promises");
const path = require("path");

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const appConfig = require("./app");

let databasePromise;

async function ensureDatabaseDirectory() {
  await fs.mkdir(path.dirname(appConfig.databasePath), { recursive: true });
}

async function getDb() {
  if (!databasePromise) {
    await ensureDatabaseDirectory();

    databasePromise = open({
      filename: appConfig.databasePath,
      driver: sqlite3.Database,
    });

    const db = await databasePromise;
    await db.exec("PRAGMA foreign_keys = ON;");
  }

  return databasePromise;
}

async function runSqlFile(filename) {
  const filePath = path.join(appConfig.rootDir, "database", filename);
  const sql = await fs.readFile(filePath, "utf8");
  const db = await getDb();

  await db.exec(sql);
}

async function initDatabase() {
  await runSqlFile("schema.sql");
}

async function seedDatabase() {
  await runSqlFile("seed.sql");
}

module.exports = {
  getDb,
  initDatabase,
  seedDatabase,
};
