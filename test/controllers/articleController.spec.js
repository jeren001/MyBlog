const { expect } = require("chai");

const articleController = require("../../controllers/articleController");
const Article = require("../../models/article");
const ArticleModel = require("../../models/articleModel");
const CategoryModel = require("../../models/categoryModel");
const CommentModel = require("../../models/commentModel");

function createMockRequest({ query = {}, params = {}, body = {} } = {}) {
  return {
    query,
    params,
    body,
  };
}

function createMockResponse() {
  return {
    statusCode: 200,
    jsonPayload: undefined,
    renderedView: undefined,
    renderedData: undefined,
    redirectUrl: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.jsonPayload = payload;
      return this;
    },
    render(view, data) {
      this.renderedView = view;
      this.renderedData = data;
      return this;
    },
    redirect(url) {
      this.redirectUrl = url;
      return this;
    },
  };
}

function createNextSpy() {
  const calls = [];

  function next(error) {
    calls.push(error);
  }

  next.calls = calls;
  return next;
}

function flushAsyncHandler() {
  return new Promise((resolve) => setImmediate(resolve));
}

async function invokeHandler(
  handler,
  { req = createMockRequest(), res = createMockResponse(), next = createNextSpy() } = {}
) {
  handler(req, res, next);
  await flushAsyncHandler();

  return { req, res, next };
}

describe("articleController API handlers", () => {
  const originalArticleMethods = {
    findAll: Article.findAll,
    findById: Article.findById,
    create: Article.create,
    update: Article.update,
    delete: Article.delete,
  };
  const originalArticleModelMethods = {
    getAll: ArticleModel.getAll,
    getById: ArticleModel.getById,
    getRelated: ArticleModel.getRelated,
    create: ArticleModel.create,
    update: ArticleModel.update,
    delete: ArticleModel.delete,
  };
  const originalCategoryModelMethods = {
    getAll: CategoryModel.getAll,
  };
  const originalCommentModelMethods = {
    getApprovedByArticleId: CommentModel.getApprovedByArticleId,
  };

  afterEach(() => {
    Article.findAll = originalArticleMethods.findAll;
    Article.findById = originalArticleMethods.findById;
    Article.create = originalArticleMethods.create;
    Article.update = originalArticleMethods.update;
    Article.delete = originalArticleMethods.delete;

    ArticleModel.getAll = originalArticleModelMethods.getAll;
    ArticleModel.getById = originalArticleModelMethods.getById;
    ArticleModel.getRelated = originalArticleModelMethods.getRelated;
    ArticleModel.create = originalArticleModelMethods.create;
    ArticleModel.update = originalArticleModelMethods.update;
    ArticleModel.delete = originalArticleModelMethods.delete;

    CategoryModel.getAll = originalCategoryModelMethods.getAll;

    CommentModel.getApprovedByArticleId =
      originalCommentModelMethods.getApprovedByArticleId;
  });

  describe("getArticles()", () => {
    it("returns a paginated list of articles with filters", async () => {
      let capturedOptions;

      Article.findAll = async (options) => {
        capturedOptions = options;
        return {
          data: [
            {
              id: 1,
              title: "Testing controllers",
              content: "Content",
              summary: "Summary",
              category_id: 2,
              tags: "nodejs,testing",
              view_count: 3,
              created_at: "2026-04-29 10:00:00",
              updated_at: "2026-04-29 10:00:00",
            },
          ],
          pagination: {
            page: 2,
            limit: 5,
            total: 11,
            totalPages: 3,
          },
        };
      };

      const req = createMockRequest({
        query: {
          page: "2",
          limit: "5",
          category_id: "2",
          tag: "testing",
        },
      });
      const res = createMockResponse();

      await invokeHandler(articleController.getArticles, { req, res });

      expect(capturedOptions).to.deep.equal({
        page: "2",
        limit: "5",
        categoryId: "2",
        tag: "testing",
      });
      expect(res.statusCode).to.equal(200);
      expect(res.jsonPayload).to.deep.equal({
        data: [
          {
            id: 1,
            title: "Testing controllers",
            content: "Content",
            summary: "Summary",
            category_id: 2,
            tags: "nodejs,testing",
            view_count: 3,
            created_at: "2026-04-29 10:00:00",
            updated_at: "2026-04-29 10:00:00",
          },
        ],
        pagination: {
          page: 2,
          limit: 5,
          total: 11,
          totalPages: 3,
        },
        filters: {
          category_id: "2",
          tag: "testing",
        },
      });
    });

    it("forwards database errors to next()", async () => {
      const error = new Error("Database read failed");
      const next = createNextSpy();

      Article.findAll = async () => {
        throw error;
      };

      await invokeHandler(articleController.getArticles, {
        req: createMockRequest(),
        res: createMockResponse(),
        next,
      });

      expect(next.calls).to.have.lengthOf(1);
      expect(next.calls[0]).to.equal(error);
    });
  });

  describe("getArticleById()", () => {
    it("returns the requested article when it exists", async () => {
      Article.findById = async (id) => ({
        id: Number(id),
        title: "Existing article",
        content: "Full content",
        summary: "Summary",
        category_id: 1,
        tags: "express,sqlite",
        view_count: 9,
        created_at: "2026-04-29 10:00:00",
        updated_at: "2026-04-29 10:00:00",
      });

      const res = createMockResponse();

      await invokeHandler(articleController.getArticleById, {
        req: createMockRequest({ params: { id: "8" } }),
        res,
      });

      expect(res.statusCode).to.equal(200);
      expect(res.jsonPayload).to.deep.equal({
        data: {
          id: 8,
          title: "Existing article",
          content: "Full content",
          summary: "Summary",
          category_id: 1,
          tags: "express,sqlite",
          view_count: 9,
          created_at: "2026-04-29 10:00:00",
          updated_at: "2026-04-29 10:00:00",
        },
      });
    });

    it("returns 404 when the article does not exist", async () => {
      Article.findById = async () => null;

      const res = createMockResponse();

      await invokeHandler(articleController.getArticleById, {
        req: createMockRequest({ params: { id: "999" } }),
        res,
      });

      expect(res.statusCode).to.equal(404);
      expect(res.jsonPayload).to.deep.equal({
        message: "Article not found.",
      });
    });
  });

  describe("createArticle()", () => {
    it("creates a valid article and auto-generates a 150-character summary", async () => {
      let receivedPayload;
      const content =
        "This is a long article body that should be trimmed into a clean summary for storage. " +
        "It contains enough content to exceed the summary length boundary used by the controller.";

      Article.create = async (payload) => {
        receivedPayload = payload;
        return {
          id: 12,
          ...payload,
          created_at: "2026-04-29 10:00:00",
          updated_at: "2026-04-29 10:00:00",
        };
      };

      const res = createMockResponse();

      await invokeHandler(articleController.createArticle, {
        req: createMockRequest({
          body: {
            title: "  New article  ",
            content,
            category_id: "4",
            tags: "nodejs, express, testing",
          },
        }),
        res,
      });

      expect(receivedPayload).to.include({
        title: "New article",
        content,
        category_id: "4",
        tags: "nodejs, express, testing",
      });
      expect(receivedPayload.summary).to.equal(
        content.replace(/\s+/g, " ").trim().slice(0, 150)
      );
      expect(res.statusCode).to.equal(201);
      expect(res.jsonPayload.message).to.equal("Article created successfully.");
      expect(res.jsonPayload.data.id).to.equal(12);
    });

    it("returns 400 for an invalid title", async () => {
      let createCalled = false;

      Article.create = async () => {
        createCalled = true;
      };

      const res = createMockResponse();

      await invokeHandler(articleController.createArticle, {
        req: createMockRequest({
          body: {
            title: "   ",
            content: "Valid content",
          },
        }),
        res,
      });

      expect(createCalled).to.equal(false);
      expect(res.statusCode).to.equal(400);
      expect(res.jsonPayload).to.deep.equal({
        message: "Title and content are required.",
      });
    });

    it("returns 400 for empty content", async () => {
      let createCalled = false;

      Article.create = async () => {
        createCalled = true;
      };

      const res = createMockResponse();

      await invokeHandler(articleController.createArticle, {
        req: createMockRequest({
          body: {
            title: "Valid title",
            content: "    ",
          },
        }),
        res,
      });

      expect(createCalled).to.equal(false);
      expect(res.statusCode).to.equal(400);
      expect(res.jsonPayload).to.deep.equal({
        message: "Title and content are required.",
      });
    });

    it("forwards database errors to next()", async () => {
      const error = new Error("Insert failed");
      const next = createNextSpy();

      Article.create = async () => {
        throw error;
      };

      await invokeHandler(articleController.createArticle, {
        req: createMockRequest({
          body: {
            title: "Valid title",
            content: "Valid content",
          },
        }),
        res: createMockResponse(),
        next,
      });

      expect(next.calls).to.have.lengthOf(1);
      expect(next.calls[0]).to.equal(error);
    });
  });

  describe("updateArticle()", () => {
    it("updates an article and regenerates the summary when content changes", async () => {
      let updatePayload;

      Article.findById = async () => ({
        id: 3,
        title: "Old title",
        content: "Old content",
        summary: "Old summary",
        category_id: 2,
        tags: "old",
      });

      Article.update = async (id, payload) => {
        updatePayload = { id, payload };
        return {
          id: Number(id),
          ...payload,
          created_at: "2026-04-29 10:00:00",
          updated_at: "2026-04-29 10:15:00",
        };
      };

      const req = createMockRequest({
        params: { id: "3" },
        body: {
          title: "Updated title",
          content:
            "Updated content that is long enough to demonstrate summary regeneration in the controller.",
          category_id: "7",
          tags: "updated,controller",
        },
      });
      const res = createMockResponse();

      await invokeHandler(articleController.updateArticle, { req, res });

      expect(updatePayload.id).to.equal("3");
      expect(updatePayload.payload.title).to.equal("Updated title");
      expect(updatePayload.payload.content).to.equal(
        "Updated content that is long enough to demonstrate summary regeneration in the controller."
      );
      expect(updatePayload.payload.summary).to.equal(
        "Updated content that is long enough to demonstrate summary regeneration in the controller."
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 150)
      );
      expect(res.statusCode).to.equal(200);
      expect(res.jsonPayload.message).to.equal("Article updated successfully.");
    });

    it("returns 404 when updating a missing article", async () => {
      Article.findById = async () => null;

      const res = createMockResponse();

      await invokeHandler(articleController.updateArticle, {
        req: createMockRequest({
          params: { id: "55" },
          body: {
            title: "Anything",
            content: "Anything",
          },
        }),
        res,
      });

      expect(res.statusCode).to.equal(404);
      expect(res.jsonPayload).to.deep.equal({
        message: "Article not found.",
      });
    });

    it("forwards database errors to next()", async () => {
      const error = new Error("Update failed");
      const next = createNextSpy();

      Article.findById = async () => ({
        id: 2,
        title: "Existing",
        content: "Existing content",
        summary: "Existing summary",
      });

      Article.update = async () => {
        throw error;
      };

      await invokeHandler(articleController.updateArticle, {
        req: createMockRequest({
          params: { id: "2" },
          body: {
            title: "Updated",
            content: "Updated content",
          },
        }),
        res: createMockResponse(),
        next,
      });

      expect(next.calls).to.have.lengthOf(1);
      expect(next.calls[0]).to.equal(error);
    });
  });

  describe("deleteArticle()", () => {
    it("deletes an existing article", async () => {
      Article.delete = async () => true;

      const res = createMockResponse();

      await invokeHandler(articleController.deleteArticle, {
        req: createMockRequest({ params: { id: "4" } }),
        res,
      });

      expect(res.statusCode).to.equal(200);
      expect(res.jsonPayload).to.deep.equal({
        message: "Article deleted successfully.",
      });
    });

    it("returns 404 when deleting a missing article", async () => {
      Article.delete = async () => false;

      const res = createMockResponse();

      await invokeHandler(articleController.deleteArticle, {
        req: createMockRequest({ params: { id: "404" } }),
        res,
      });

      expect(res.statusCode).to.equal(404);
      expect(res.jsonPayload).to.deep.equal({
        message: "Article not found.",
      });
    });

    it("forwards database errors to next()", async () => {
      const error = new Error("Delete failed");
      const next = createNextSpy();

      Article.delete = async () => {
        throw error;
      };

      await invokeHandler(articleController.deleteArticle, {
        req: createMockRequest({ params: { id: "3" } }),
        res: createMockResponse(),
        next,
      });

      expect(next.calls).to.have.lengthOf(1);
      expect(next.calls[0]).to.equal(error);
    });
  });

  describe("server-rendered admin handlers", () => {
    describe("index()", () => {
      it("renders the article management view with filters and categories", async () => {
        let capturedFilters;

        ArticleModel.getAll = async (filters) => {
          capturedFilters = filters;
          return [
            {
              id: 1,
              title: "Rendered article",
            },
          ];
        };

        CategoryModel.getAll = async () => [
          {
            id: 7,
            name: "Testing",
          },
        ];

        const req = createMockRequest({
          query: {
            search: "render",
            categoryId: "7",
          },
        });
        const res = createMockResponse();

        await invokeHandler(articleController.index, { req, res });

        expect(capturedFilters).to.deep.equal({
          search: "render",
          categoryId: "7",
        });
        expect(res.renderedView).to.equal("articles/index");
        expect(res.renderedData.title).to.equal("Article Management");
        expect(res.renderedData.articles).to.deep.equal([
          {
            id: 1,
            title: "Rendered article",
          },
        ]);
        expect(res.renderedData.categories).to.deep.equal([
          {
            id: 7,
            name: "Testing",
          },
        ]);
      });
    });

    describe("show()", () => {
      it("renders the article detail view with comments and related articles", async () => {
        let capturedCommentArticleId;
        let capturedRelatedArgs;

        ArticleModel.getById = async () => ({
          id: 9,
          title: "Full article",
          category_id: 4,
          content: "Body",
        });

        CommentModel.getApprovedByArticleId = async (articleId) => {
          capturedCommentArticleId = articleId;
          return [
            {
              id: 3,
              author_name: "Reader",
              content: "Helpful note",
            },
          ];
        };

        ArticleModel.getRelated = async (articleId, categoryId, limit) => {
          capturedRelatedArgs = [articleId, categoryId, limit];
          return [
            {
              id: 11,
              title: "Related article",
            },
          ];
        };

        const res = createMockResponse();

        await invokeHandler(articleController.show, {
          req: createMockRequest({ params: { id: "9" } }),
          res,
        });

        expect(capturedCommentArticleId).to.equal(9);
        expect(capturedRelatedArgs).to.deep.equal([9, 4, 3]);
        expect(res.renderedView).to.equal("articles/show");
        expect(res.renderedData.title).to.equal("Full article");
        expect(res.renderedData.comments).to.deep.equal([
          {
            id: 3,
            author_name: "Reader",
            content: "Helpful note",
          },
        ]);
        expect(res.renderedData.relatedArticles).to.deep.equal([
          {
            id: 11,
            title: "Related article",
          },
        ]);
      });

      it("renders a 404 page when the article is missing", async () => {
        ArticleModel.getById = async () => null;

        const res = createMockResponse();

        await invokeHandler(articleController.show, {
          req: createMockRequest({ params: { id: "999" } }),
          res,
        });

        expect(res.statusCode).to.equal(404);
        expect(res.renderedView).to.equal("errors/404");
        expect(res.renderedData).to.deep.equal({
          title: "Article Not Found",
        });
      });

      it("forwards comment loading errors to next()", async () => {
        const error = new Error("Comment lookup failed");
        const next = createNextSpy();

        ArticleModel.getById = async () => ({
          id: 2,
          title: "Existing",
          category_id: 1,
        });

        CommentModel.getApprovedByArticleId = async () => {
          throw error;
        };

        ArticleModel.getRelated = async () => [];

        await invokeHandler(articleController.show, {
          req: createMockRequest({ params: { id: "2" } }),
          res: createMockResponse(),
          next,
        });

        expect(next.calls).to.have.lengthOf(1);
        expect(next.calls[0]).to.equal(error);
      });
    });

    describe("newForm()", () => {
      it("renders the create article form with categories", async () => {
        CategoryModel.getAll = async () => [
          { id: 1, name: "Development" },
          { id: 2, name: "Writing" },
        ];

        const res = createMockResponse();

        await invokeHandler(articleController.newForm, {
          res,
        });

        expect(res.renderedView).to.equal("articles/form");
        expect(res.renderedData.title).to.equal("Create Article");
        expect(res.renderedData.submitLabel).to.equal("Create Article");
        expect(res.renderedData.categories).to.have.lengthOf(2);
        expect(res.renderedData.article).to.include({
          title: "",
          excerpt: "",
          content: "",
          tags: "",
        });
      });
    });

    describe("create()", () => {
      it("creates an article and redirects to its detail page", async () => {
        let createdPayload;

        ArticleModel.create = async (payload) => {
          createdPayload = payload;
          return { id: 21 };
        };

        const res = createMockResponse();

        await invokeHandler(articleController.create, {
          req: createMockRequest({
            body: {
              title: "  Rendered create  ",
              excerpt: "Summary text",
              content: "Markdown body",
              categoryId: "5",
              tags: "nodejs,express",
              readingTime: "6",
              publishedAt: "2026-04-29T08:00",
            },
          }),
          res,
        });

        expect(createdPayload).to.deep.equal({
          title: "Rendered create",
          excerpt: "Summary text",
          content: "Markdown body",
          categoryId: "5",
          tags: "nodejs,express",
          readingTime: "6",
          publishedAt: "2026-04-29T08:00",
        });
        expect(res.redirectUrl).to.equal("/articles/21");
      });

      it("re-renders the form with a 400 status when title or content is missing", async () => {
        CategoryModel.getAll = async () => [{ id: 1, name: "Writing" }];

        const res = createMockResponse();

        await invokeHandler(articleController.create, {
          req: createMockRequest({
            body: {
              title: "  ",
              excerpt: "Short summary",
              content: "",
              categoryId: "1",
              tags: "draft",
              readingTime: "4",
            },
          }),
          res,
        });

        expect(res.statusCode).to.equal(400);
        expect(res.renderedView).to.equal("articles/form");
        expect(res.renderedData.errorMessage).to.equal(
          "Title and content are required."
        );
        expect(res.renderedData.article).to.include({
          title: "",
          excerpt: "Short summary",
          content: "",
          categoryId: "1",
          tags: "draft",
          readingTime: "4",
        });
      });
    });

    describe("editForm()", () => {
      it("renders the edit form for an existing article", async () => {
        ArticleModel.getById = async () => ({
          id: 8,
          title: "Editable article",
          excerpt: "Existing excerpt",
          content: "Existing content",
          category_id: 3,
          tags: "editing,coverage",
          reading_time: 7,
          published_at: "2026-04-29T09:30:00.000Z",
        });

        CategoryModel.getAll = async () => [{ id: 3, name: "Coverage" }];

        const res = createMockResponse();

        await invokeHandler(articleController.editForm, {
          req: createMockRequest({ params: { id: "8" } }),
          res,
        });

        expect(res.renderedView).to.equal("articles/form");
        expect(res.renderedData.title).to.equal("Edit Editable article");
        expect(res.renderedData.formAction).to.equal("/articles/8?_method=PUT");
        expect(res.renderedData.article).to.include({
          title: "Editable article",
          excerpt: "Existing excerpt",
          content: "Existing content",
          categoryId: 3,
          tags: "editing,coverage",
          readingTime: 7,
        });
      });

      it("renders 404 when trying to edit a missing article", async () => {
        ArticleModel.getById = async () => null;
        CategoryModel.getAll = async () => [];

        const res = createMockResponse();

        await invokeHandler(articleController.editForm, {
          req: createMockRequest({ params: { id: "404" } }),
          res,
        });

        expect(res.statusCode).to.equal(404);
        expect(res.renderedView).to.equal("errors/404");
        expect(res.renderedData).to.deep.equal({
          title: "Article Not Found",
        });
      });
    });

    describe("update()", () => {
      it("updates an article and redirects back to the detail page", async () => {
        let updatedPayload;

        ArticleModel.getById = async () => ({
          id: 14,
          title: "Old title",
          excerpt: "Old excerpt",
          content: "Old content",
          category_id: 1,
          tags: "old",
          reading_time: 5,
          published_at: "2026-04-29T08:30:00.000Z",
        });

        ArticleModel.update = async (id, payload) => {
          updatedPayload = { id, payload };
          return { id: Number(id) };
        };

        const res = createMockResponse();

        await invokeHandler(articleController.update, {
          req: createMockRequest({
            params: { id: "14" },
            body: {
              title: "Updated render title",
              excerpt: "Updated excerpt",
              content: "Updated content body",
              categoryId: "2",
              tags: "updated,rendered",
              readingTime: "9",
              publishedAt: "2026-04-29T12:30",
            },
          }),
          res,
        });

        expect(updatedPayload).to.deep.equal({
          id: "14",
          payload: {
            title: "Updated render title",
            excerpt: "Updated excerpt",
            content: "Updated content body",
            categoryId: "2",
            tags: "updated,rendered",
            readingTime: "9",
            publishedAt: "2026-04-29T12:30",
          },
        });
        expect(res.redirectUrl).to.equal("/articles/14");
      });

      it("re-renders the edit form with a 400 status when content is empty", async () => {
        ArticleModel.getById = async () => ({
          id: 15,
          title: "Existing article",
          excerpt: "Existing excerpt",
          content: "Existing content",
          category_id: 3,
          tags: "existing",
          reading_time: 4,
          published_at: "2026-04-29T07:45:00.000Z",
        });

        CategoryModel.getAll = async () => [{ id: 3, name: "Writing" }];

        const res = createMockResponse();

        await invokeHandler(articleController.update, {
          req: createMockRequest({
            params: { id: "15" },
            body: {
              title: "Updated but invalid",
              excerpt: "Replacement excerpt",
              content: "   ",
              categoryId: "3",
              tags: "existing,retry",
              readingTime: "4",
              publishedAt: "2026-04-29T09:30",
            },
          }),
          res,
        });

        expect(res.statusCode).to.equal(400);
        expect(res.renderedView).to.equal("articles/form");
        expect(res.renderedData.formAction).to.equal("/articles/15?_method=PUT");
        expect(res.renderedData.errorMessage).to.equal(
          "Title and content are required."
        );
        expect(res.renderedData.article).to.include({
          title: "Updated but invalid",
          excerpt: "Replacement excerpt",
          content: "",
          categoryId: "3",
          tags: "existing,retry",
          readingTime: "4",
        });
      });

      it("renders 404 when trying to update a missing article", async () => {
        ArticleModel.getById = async () => null;

        const res = createMockResponse();

        await invokeHandler(articleController.update, {
          req: createMockRequest({
            params: { id: "515" },
            body: {
              title: "Missing",
              content: "Missing",
            },
          }),
          res,
        });

        expect(res.statusCode).to.equal(404);
        expect(res.renderedView).to.equal("errors/404");
        expect(res.renderedData).to.deep.equal({
          title: "Article Not Found",
        });
      });
    });

    describe("destroy()", () => {
      it("deletes an article and redirects to the listing", async () => {
        let deletedId;

        ArticleModel.delete = async (id) => {
          deletedId = id;
        };

        const res = createMockResponse();

        await invokeHandler(articleController.destroy, {
          req: createMockRequest({ params: { id: "31" } }),
          res,
        });

        expect(deletedId).to.equal("31");
        expect(res.redirectUrl).to.equal("/articles");
      });
    });
  });
});
