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

describe("CommentModel", () => {
  let db;
  let ArticleModel;
  let CategoryModel;
  let CommentModel;
  let article;

  beforeEach(async () => {
    db = await open({
      filename: ":memory:",
      driver: sqlite3.Database,
    });

    await db.exec("PRAGMA foreign_keys = ON;");
    await db.exec(schemaSql);

    primeDatabaseModule(db);
    clearModules([
      "../models/articleModel",
      "../models/categoryModel",
      "../models/commentModel",
    ]);

    ArticleModel = require("../models/articleModel");
    CategoryModel = require("../models/categoryModel");
    CommentModel = require("../models/commentModel");

    const category = await CategoryModel.create({
      name: "Comments",
      description: "Comment-related posts.",
    });

    article = await ArticleModel.create({
      title: "Article with comments",
      excerpt: "Comment testing",
      content: "This article is used by comment model tests.",
      categoryId: category.id,
      tags: "comments,test",
      readingTime: 5,
      publishedAt: "2026-05-06T11:00:00.000Z",
    });
  });

  afterEach(async () => {
    await db.close();

    clearModules([
      "../models/articleModel",
      "../models/categoryModel",
      "../models/commentModel",
    ]);
    delete require.cache[require.resolve("../config/database")];
  });

  // Verifies that creating a comment stores it for the target article with approved status.
  it("creates a comment", async () => {
    const comment = await CommentModel.create({
      articleId: article.id,
      authorName: "Jane Doe",
      authorEmail: "jane@example.com",
      content: "Helpful article.",
    });

    expect(comment.id).to.be.a("number");
    expect(comment.article_id).to.equal(article.id);
    expect(comment.author_name).to.equal("Jane Doe");
    expect(comment.author_email).to.equal("jane@example.com");
    expect(comment.content).to.equal("Helpful article.");
    expect(comment.status).to.equal("approved");
    expect(comment.article_title).to.equal("Article with comments");
  });

  // Verifies that only approved comments are returned for a specific article id.
  it("gets approved comments by article id", async () => {
    const approvedComment = await CommentModel.create({
      articleId: article.id,
      authorName: "Approved User",
      authorEmail: "approved@example.com",
      content: "This one should be returned.",
    });

    await db.run(
      `
        INSERT INTO comments (article_id, author_name, author_email, content, status)
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        article.id,
        "Pending User",
        "pending@example.com",
        "This one should be filtered out.",
        "pending",
      ]
    );

    const comments = await CommentModel.getApprovedByArticleId(article.id);

    expect(comments).to.have.lengthOf(1);
    expect(comments[0]).to.deep.include({
      id: approvedComment.id,
      author_name: "Approved User",
      author_email: "approved@example.com",
      content: "This one should be returned.",
      status: "approved",
    });
  });

  // Verifies that deleting a comment removes it from the database.
  it("deletes a comment", async () => {
    const comment = await CommentModel.create({
      articleId: article.id,
      authorName: "Delete User",
      authorEmail: "delete@example.com",
      content: "Please remove this comment.",
    });

    await CommentModel.delete(comment.id);

    const deletedComment = await CommentModel.getById(comment.id);

    expect(deletedComment).to.equal(undefined);
  });
});
