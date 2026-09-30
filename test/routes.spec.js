const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const request = require("supertest");
const { expect } = require("chai");

const schemaSql = fs.readFileSync(
  path.resolve(__dirname, "../database/schema.sql"),
  "utf8"
);

function clearModules(modulePaths) {
  for (const modulePath of modulePaths) {
    delete require.cache[require.resolve(modulePath)];
  }
}

function primeDatabaseModule(db) {
  const databaseModulePath = require.resolve("../config/database");

  delete require.cache[databaseModulePath];
  require.cache[databaseModulePath] = {
    id: databaseModulePath,
    filename: databaseModulePath,
    loaded: true,
    exports: {
      getDb: async () => db,
      initDatabase: async () => db.exec(schemaSql),
      seedDatabase: async () => {},
    },
  };
}

describe("Application routes", () => {
  let db;
  let app;

  beforeEach(async () => {
    db = await open({
      filename: ":memory:",
      driver: sqlite3.Database,
    });

    await db.exec("PRAGMA foreign_keys = ON;");
    await db.exec(schemaSql);

    primeDatabaseModule(db);
    clearModules([
      "../app",
      "../config/database",
      "../models/articleModel",
      "../models/categoryModel",
      "../models/commentModel",
      "../models/statsModel",
      "../controllers/articleController",
      "../controllers/categoryController",
      "../controllers/commentController",
      "../controllers/homeController",
      "../controllers/statsController",
      "../routes/articleRoutes",
      "../routes/categoryRoutes",
      "../routes/commentRoutes",
      "../routes/indexRoutes",
      "../routes/statsRoutes",
      "../middleware/pageStats",
    ]);

    primeDatabaseModule(db);
    app = require("../app");
  });

  afterEach(async () => {
    await db.close();

    clearModules([
      "../app",
      "../models/articleModel",
      "../models/categoryModel",
      "../models/commentModel",
      "../models/statsModel",
      "../controllers/articleController",
      "../controllers/categoryController",
      "../controllers/commentController",
      "../controllers/homeController",
      "../controllers/statsController",
      "../routes/articleRoutes",
      "../routes/categoryRoutes",
      "../routes/commentRoutes",
      "../routes/indexRoutes",
      "../routes/statsRoutes",
      "../middleware/pageStats",
    ]);
    delete require.cache[require.resolve("../config/database")];
  });

  // Verifies that the home page route responds successfully.
  it("GET / returns 200", async () => {
    const response = await request(app).get("/");

    expect(response.status).to.equal(200);
  });

  // Verifies that the article index route renders successfully.
  it("GET /articles returns 200", async () => {
    const response = await request(app).get("/articles");

    expect(response.status).to.equal(200);
  });

  // Verifies that the category index route renders successfully.
  it("GET /categories returns 200", async () => {
    const response = await request(app).get("/categories");

    expect(response.status).to.equal(200);
  });

  // Verifies that submitting an article without required fields returns a validation error.
  it("POST /articles with missing fields returns 400", async () => {
    const response = await request(app).post("/articles").send({
      title: "",
      content: "",
    });

    expect(response.status).to.equal(400);
  });
});
