const { getDb } = require("../config/database");
const { buildTimestampedSlug } = require("../utils/slugify");

class ArticleModel {
  static async getAll({ search = "", categoryId = "" } = {}) {
    const db = await getDb();
    const params = [];
    const whereClauses = [];

    let query = `
      SELECT
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        COALESCE(a.tags, '') AS tags,
        a.content,
        a.reading_time,
        a.published_at,
        a.updated_at,
        a.category_id,
        c.name AS category_name,
        c.slug AS category_slug,
        COUNT(CASE WHEN cm.status = 'approved' THEN cm.id END) AS comment_count
      FROM articles a
      LEFT JOIN categories c ON c.id = a.category_id
      LEFT JOIN comments cm ON cm.article_id = a.id
    `;

    if (categoryId) {
      whereClauses.push("a.category_id = ?");
      params.push(Number(categoryId));
    }

    if (search.trim()) {
      const searchPattern = `%${search.trim()}%`;

      whereClauses.push(
        "(a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ?)"
      );
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    query += `
      GROUP BY a.id, c.id
      ORDER BY datetime(a.published_at) DESC, a.id DESC
    `;

    return db.all(query, params);
  }

  static async getLatest(limit = 5) {
    const db = await getDb();

    return db.all(
      `
        SELECT
          a.id,
          a.title,
          a.slug,
          a.excerpt,
          COALESCE(a.tags, '') AS tags,
          a.reading_time,
          a.published_at,
          c.name AS category_name
        FROM articles a
        LEFT JOIN categories c ON c.id = a.category_id
        ORDER BY datetime(a.published_at) DESC, a.id DESC
        LIMIT ?
      `,
      [Number(limit)]
    );
  }

  static async getById(id) {
    const db = await getDb();

    return db.get(
      `
        SELECT
          a.id,
          a.title,
          a.slug,
          a.excerpt,
          COALESCE(a.tags, '') AS tags,
          a.content,
          a.reading_time,
          a.published_at,
          a.updated_at,
          a.category_id,
          c.name AS category_name,
          c.slug AS category_slug,
          COUNT(CASE WHEN cm.status = 'approved' THEN cm.id END) AS comment_count
        FROM articles a
        LEFT JOIN categories c ON c.id = a.category_id
        LEFT JOIN comments cm ON cm.article_id = a.id
        WHERE a.id = ?
        GROUP BY a.id, c.id
      `,
      [Number(id)]
    );
  }

  static async getRelated(articleId, categoryId, limit = 3) {
    const db = await getDb();

    return db.all(
      `
        SELECT
          a.id,
          a.title,
          a.slug,
          a.excerpt,
          a.published_at,
          c.name AS category_name
        FROM articles a
        LEFT JOIN categories c ON c.id = a.category_id
        WHERE a.id != ?
        ORDER BY
          CASE WHEN a.category_id = ? THEN 0 ELSE 1 END,
          datetime(a.published_at) DESC,
          a.id DESC
        LIMIT ?
      `,
      [Number(articleId), Number(categoryId) || 0, Number(limit)]
    );
  }

  static async create({
    title,
    excerpt,
    content,
    categoryId,
    tags,
    readingTime,
    publishedAt,
  }) {
    const db = await getDb();
    const slug = buildTimestampedSlug(title);

    const result = await db.run(
      `
        INSERT INTO articles (
          title,
          slug,
          excerpt,
          tags,
          content,
          category_id,
          reading_time,
          published_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        slug,
        excerpt || "",
        (tags || "").trim(),
        content,
        categoryId ? Number(categoryId) : null,
        Number(readingTime) || 5,
        publishedAt || new Date().toISOString(),
      ]
    );

    return this.getById(result.lastID);
  }

  static async update(
    id,
    { title, excerpt, content, categoryId, tags, readingTime, publishedAt }
  ) {
    const db = await getDb();
    const slug = buildTimestampedSlug(title);

    await db.run(
      `
        UPDATE articles
        SET
          title = ?,
          slug = ?,
          excerpt = ?,
          tags = ?,
          content = ?,
          category_id = ?,
          reading_time = ?,
          published_at = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        title,
        slug,
        excerpt || "",
        (tags || "").trim(),
        content,
        categoryId ? Number(categoryId) : null,
        Number(readingTime) || 5,
        publishedAt || new Date().toISOString(),
        Number(id),
      ]
    );

    return this.getById(id);
  }

  static async delete(id) {
    const db = await getDb();
    return db.run("DELETE FROM articles WHERE id = ?", [Number(id)]);
  }
}

module.exports = ArticleModel;
