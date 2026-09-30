const path = require("path");

require("dotenv").config();

const rootDir = path.resolve(__dirname, "..");

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  rootDir,
  siteName: process.env.SITE_NAME || "Jeren's Blog",
  databasePath: path.resolve(
    rootDir,
    process.env.DATABASE_PATH || "database/blog.sqlite"
  ),
  seedOnStart: process.env.SEED_ON_START === "true",
};
