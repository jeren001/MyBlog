const { initDatabase } = require("../config/database");

async function run() {
  await initDatabase();
  console.log("Database schema initialized.");
}

run().catch((error) => {
  console.error("Failed to initialize database schema.");
  console.error(error);
  process.exit(1);
});
