const app = require("./app");
const appConfig = require("./config/app");
const { initDatabase, seedDatabase } = require("./config/database");

async function startServer() {
  await initDatabase();

  if (appConfig.seedOnStart) {
    await seedDatabase();
  }

  app.listen(appConfig.port, () => {
    console.log(
      `${appConfig.siteName} is running at http://localhost:${appConfig.port}`
    );
  });
}

startServer().catch((error) => {
  console.error("Failed to start the application.");
  console.error(error);
  process.exit(1);
});
