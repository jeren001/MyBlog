const { getDb } = require("../config/database");
const { buildTimestampedSlug } = require("../utils/slugify");

class Article {
  static schemaCache = null;

  static async getSchema() {
    if (!this.schemaCache) {
      const db = await getDb();
      const columns = await db.all("PRAGMA table_info(articles)");
      const columnNames = new Set(columns.map((column) => column.name));

      this.schemaCache = {
        hasSlug: columnNames.has("slug"),
        hasExcerpt: columnNames.has("excerpt"),
        hasTags: columnNames.has("tags"),
        hasViewCount: columnNames.has("view_count"),
        summaryColumn: columnNames.has("summary")
          ? "summary"
          : columnNames.has("excerpt")
            ? "excerpt"
            : null,
      };
    }

    return this.schemaCache;
  }

  static normalizeCategoryId(categoryId) {
    if (categoryId === undefined || categoryId === null || categoryId === "") {
      return null;
    }

    const parsed = Number(categoryId);
    return Number.isFinite(parsed) ? parsed : null;
  }

  static normalizeTags(tags) {
    const input = Array.isArray(tags)
      ? tags
      : String(tags || "")
          .split(",")
          .map((tag) => tag.trim());

    return [...new Set(input.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
  }

  static serializeTags(tags) {
    return this.normalizeTags(tags).join(",");
  }

  static normalizePagination({ page = 1, limit = 10 } = {}) {
    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

    return {
      page: safePage,
      limit: safeLimit,
      offset: (safePage - 1) * safeLimit,
    };
  }

  static buildWhereClause(filters, schema, params, alias = "a") {
    const whereClauses = [];
    const categoryId = this.normalizeCategoryId(
      filters.categoryId ?? filters.category_id
    );
    const normalizedTag = this.normalizeTags(filters.tag)[0];

    if (categoryId !== null) {
      whereClauses.push(`${alias}.category_id = ?`);
      params.push(categoryId);
    }

    if (normalizedTag && schema.hasTags) {
      whereClauses.push(
        `LOWER(',' || REPLACE(COALESCE(${alias}.tags, ''), ' ', '') || ',') LIKE ?`
      );
      params.push(`%,${normalizedTag},%`);
    }

    return whereClauses.length > 0
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";
  }

  static buildSelectClause(schema, alias = "a") {
    const summarySelect =
      schema.summaryColumn === "summary" && schema.hasExcerpt
        ? `COALESCE(${alias}.summary, ${alias}.excerpt, '')`
        : schema.summaryColumn
          ? `COALESCE(${alias}.${schema.summaryColumn}, '')`
          : "''";
    const tagsSelect = schema.hasTags ? `COALESCE(${alias}.tags, '')` : "''";
    const viewCountSelect = schema.hasViewCount
      ? `COALESCE(${alias}.view_count, 0)`
      : "0";

    return `
      SELECT
        ${alias}.id,
        ${alias}.title,
        ${alias}.content,
        ${summarySelect} AS summary,
        ${alias}.category_id,
        ${tagsSelect} AS tags,
        ${viewCountSelect} AS view_count,
        ${alias}.created_at,
        ${alias}.updated_at
      FROM articles ${alias}
    `;
  }

  static mapRow(row) {
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      title: row.title,
      content: row.content,
      summary: row.summary || "",
      category_id: row.category_id,
      tags: row.tags || "",
      view_count: Number(row.view_count) || 0,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  static buildWritePayload(input = {}, existing = null) {
    const title =
      input.title !== undefined
        ? String(input.title).trim()
        : existing
          ? existing.title
          : "";
    const content =
      input.content !== undefined
        ? String(input.content)
        : existing
          ? existing.content
          : "";
    const summary =
      input.summary !== undefined
        ? String(input.summary).trim()
        : existing
          ? existing.summary
          : "";
    const categoryId =
      input.category_id !== undefined || input.categoryId !== undefined
        ? this.normalizeCategoryId(input.category_id ?? input.categoryId)
        : existing
          ? existing.category_id
          : null;
    const tags =
      input.tags !== undefined
        ? this.serializeTags(input.tags)
        : existing
          ? existing.tags
          : "";
    const viewCount =
      input.view_count !== undefined || input.viewCount !== undefined
        ? Math.max(Number(input.view_count ?? input.viewCount) || 0, 0)
        : existing
          ? existing.view_count
          : 0;

    return {
      title,
      content,
      summary,
      categoryId,
      tags,
      viewCount,
    };
  }

  static async create(data) {
    const schema = await this.getSchema();
    const db = await getDb();
    const payload = this.buildWritePayload(data);

    if (!payload.title || !payload.content) {
      throw new Error("Both title and content are required.");
    }

    const fields = ["title", "content", "category_id"];
    const values = [payload.title, payload.content, payload.categoryId];

    if (schema.hasSlug) {
      fields.push("slug");
      values.push(buildTimestampedSlug(payload.title));
    }

    if (schema.summaryColumn) {
      fields.push(schema.summaryColumn);
      values.push(payload.summary);
    }

    if (schema.hasExcerpt && schema.summaryColumn !== "excerpt") {
      fields.push("excerpt");
      values.push(payload.summary);
    }

    if (schema.hasTags) {
      fields.push("tags");
      values.push(payload.tags);
    }

    if (schema.hasViewCount) {
      fields.push("view_count");
      values.push(payload.viewCount);
    }

    const placeholders = fields.map(() => "?").join(", ");

    const result = await db.run(
      `
        INSERT INTO articles (
          ${fields.join(", ")},
          created_at,
          updated_at
        )
        VALUES (${placeholders}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      values
    );

    return this.findById(result.lastID);
  }

  static async findById(id) {
    const schema = await this.getSchema();
    const db = await getDb();

    const row = await db.get(
      `
        ${this.buildSelectClause(schema)}
        WHERE a.id = ?
        LIMIT 1
      `,
      [Number(id)]
    );

    return this.mapRow(row);
  }

  static async findAll(options = {}) {
    const schema = await this.getSchema();
    const db = await getDb();
    const { page, limit, offset } = this.normalizePagination(options);

    const filterParams = [];
    const whereClause = this.buildWhereClause(options, schema, filterParams);

    const totalRow = await db.get(
      `
        SELECT COUNT(*) AS total
        FROM articles a
        ${whereClause}
      `,
      filterParams
    );

    const rows = await db.all(
      `
        ${this.buildSelectClause(schema)}
        ${whereClause}
        ORDER BY datetime(a.created_at) DESC, a.id DESC
        LIMIT ? OFFSET ?
      `,
      [...filterParams, limit, offset]
    );

    const total = Number(totalRow?.total) || 0;

    return {
      data: rows.map((row) => this.mapRow(row)),
      pagination: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  static async update(id, data) {
    const schema = await this.getSchema();
    const db = await getDb();
    const existing = await this.findById(id);

    if (!existing) {
      return null;
    }

    const payload = this.buildWritePayload(data, existing);

    if (!payload.title || !payload.content) {
      throw new Error("Both title and content are required.");
    }

    const assignments = [
      "title = ?",
      "content = ?",
      "category_id = ?",
      "updated_at = CURRENT_TIMESTAMP",
    ];
    const values = [payload.title, payload.content, payload.categoryId];

    if (schema.hasSlug) {
      assignments.push("slug = ?");
      values.push(buildTimestampedSlug(payload.title));
    }

    if (schema.summaryColumn) {
      assignments.push(`${schema.summaryColumn} = ?`);
      values.push(payload.summary);
    }

    if (schema.hasExcerpt && schema.summaryColumn !== "excerpt") {
      assignments.push("excerpt = ?");
      values.push(payload.summary);
    }

    if (schema.hasTags) {
      assignments.push("tags = ?");
      values.push(payload.tags);
    }

    if (schema.hasViewCount) {
      assignments.push("view_count = ?");
      values.push(payload.viewCount);
    }

    values.push(Number(id));

    await db.run(
      `
        UPDATE articles
        SET ${assignments.join(", ")}
        WHERE id = ?
      `,
      values
    );

    return this.findById(id);
  }

  static async delete(id) {
    const db = await getDb();
    const result = await db.run("DELETE FROM articles WHERE id = ?", [
      Number(id),
    ]);

    return result.changes > 0;
  }

  static async incrementViewCount(id) {
    const schema = await this.getSchema();
    const db = await getDb();

    if (!schema.hasViewCount) {
      return this.findById(id);
    }

    await db.run(
      `
        UPDATE articles
        SET
          view_count = COALESCE(view_count, 0) + 1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [Number(id)]
    );

    return this.findById(id);
  }
}

module.exports = Article;
