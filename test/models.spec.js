const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
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

describe("ArticleModel and CategoryModel", () => {
  let db;
  let ArticleModel;
  let CategoryModel;

  beforeEach(async () => {
    db = await open({
      filename: ":memory:",
      driver: sqlite3.Database,
    });

    await db.exec("PRAGMA foreign_keys = ON;");
    await db.exec(schemaSql);

    primeDatabaseModule(db);
    clearModules(["../models/articleModel", "../models/categoryModel"]);

    ArticleModel = require("../models/articleModel");
    CategoryModel = require("../models/categoryModel");
  });

  afterEach(async () => {
    await db.close();

    clearModules(["../models/articleModel", "../models/categoryModel"]);
    delete require.cache[require.resolve("../config/database")];
  });

  // Verifies that a category can be created and then loaded again by its id.
  it("creates a category and gets it by id", async () => {
    const createdCategory = await CategoryModel.create({
      name: "Testing",
      description: "Posts about automated testing.",
    });

    const fetchedCategory = await CategoryModel.getById(createdCategory.id);

    expect(createdCategory.id).to.be.a("number");
    expect(createdCategory.name).to.equal("Testing");
    expect(createdCategory.description).to.equal(
      "Posts about automated testing."
    );
    expect(fetchedCategory).to.deep.include({
      id: createdCategory.id,
      name: "Testing",
      description: "Posts about automated testing.",
    });
  });

  // Verifies that an article is inserted correctly and returned with its related category details.
  it("creates an article", async () => {
    const category = await CategoryModel.create({
      name: "Node.js",
      description: "Node.js articles.",
    });

    const article = await ArticleModel.create({
      title: "Testing models with SQLite",
      excerpt: "A short summary",
      content: "This article explains how to test SQLite-backed models.",
      categoryId: category.id,
      tags: "node,sqlite,testing",
      readingTime: 7,
      publishedAt: "2026-05-01T12:00:00.000Z",
    });

    expect(article.id).to.be.a("number");
    expect(article.title).to.equal("Testing models with SQLite");
    expect(article.excerpt).to.equal("A short summary");
    expect(article.content).to.equal(
      "This article explains how to test SQLite-backed models."
    );
    expect(article.category_id).to.equal(category.id);
    expect(article.category_name).to.equal("Node.js");
    expect(article.tags).to.equal("node,sqlite,testing");
    expect(article.reading_time).to.equal(7);
  });

  // Verifies that an article can be fetched later by id with the same persisted values.
  it("gets an article by id", async () => {
    const category = await CategoryModel.create({
      name: "Express",
      description: "Express articles.",
    });

    const createdArticle = await ArticleModel.create({
      title: "Fetching by id",
      excerpt: "Lookup article",
      content: "Stored article content.",
      categoryId: category.id,
      tags: "express,routing",
      readingTime: 4,
      publishedAt: "2026-05-02T08:30:00.000Z",
    });

    const fetchedArticle = await ArticleModel.getById(createdArticle.id);

    expect(fetchedArticle).to.deep.include({
      id: createdArticle.id,
      title: "Fetching by id",
      excerpt: "Lookup article",
      content: "Stored article content.",
      category_id: category.id,
      category_name: "Express",
      tags: "express,routing",
      reading_time: 4,
    });
  });

  // Verifies that updating an article changes the stored fields and returns the updated record.
  it("updates an article", async () => {
    const category = await CategoryModel.create({
      name: "Backend",
      description: "Backend development.",
    });

    const createdArticle = await ArticleModel.create({
      title: "Original title",
      excerpt: "Original excerpt",
      content: "Original content",
      categoryId: category.id,
      tags: "initial",
      readingTime: 5,
      publishedAt: "2026-05-03T09:00:00.000Z",
    });

    const updatedArticle = await ArticleModel.update(createdArticle.id, {
      title: "Updated title",
      excerpt: "Updated excerpt",
      content: "Updated content",
      categoryId: category.id,
      tags: "updated,backend",
      readingTime: 9,
      publishedAt: "2026-05-04T10:15:00.000Z",
    });

    expect(updatedArticle).to.deep.include({
      id: createdArticle.id,
      title: "Updated title",
      excerpt: "Updated excerpt",
      content: "Updated content",
      category_id: category.id,
      tags: "updated,backend",
      reading_time: 9,
    });
    expect(updatedArticle.slug).to.not.equal(createdArticle.slug);
    expect(updatedArticle.updated_at).to.be.a("string");
  });

  // Verifies that deleting an article removes it from the database so it can no longer be found.
  it("deletes an article", async () => {
    const category = await CategoryModel.create({
      name: "SQLite",
      description: "SQLite articles.",
    });

    const createdArticle = await ArticleModel.create({
      title: "Delete me",
      excerpt: "Temporary article",
      content: "This article will be removed.",
      categoryId: category.id,
      tags: "temporary",
      readingTime: 3,
      publishedAt: "2026-05-05T14:45:00.000Z",
    });

    await ArticleModel.delete(createdArticle.id);

    const deletedArticle = await ArticleModel.getById(createdArticle.id);

    expect(deletedArticle).to.equal(undefined);
  });
});
