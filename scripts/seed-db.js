const { initDatabase, seedDatabase } = require("../config/database");

async function run() {
  await initDatabase();
  await seedDatabase();
  console.log("Sample data seeded.");
}

run().catch((error) => {
  console.error("Failed to seed database.");
  console.error(error);
  process.exit(1);
});
