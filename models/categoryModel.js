const { getDb } = require("../config/database");
const { buildTimestampedSlug } = require("../utils/slugify");

class CategoryModel {
  static async getAll() {
    const db = await getDb();

    return db.all(`
      SELECT
        c.id,
        c.name,
        c.slug,
        c.description,
        c.created_at,
        COUNT(a.id) AS article_count
      FROM categories c
      LEFT JOIN articles a ON a.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
  }

  static async getById(id) {
    const db = await getDb();

    return db.get(
      `
        SELECT
          c.id,
          c.name,
          c.slug,
          c.description,
          c.created_at,
          COUNT(a.id) AS article_count
        FROM categories c
        LEFT JOIN articles a ON a.category_id = c.id
        WHERE c.id = ?
        GROUP BY c.id
      `,
      [Number(id)]
    );
  }

  static async getWithArticles(id) {
    const db = await getDb();
    const category = await this.getById(id);

    if (!category) {
      return null;
    }

    const articles = await db.all(
      `
        SELECT
          id,
          title,
          slug,
          excerpt,
          reading_time,
          published_at
        FROM articles
        WHERE category_id = ?
        ORDER BY datetime(published_at) DESC, id DESC
      `,
      [Number(id)]
    );

    return {
      category,
      articles,
    };
  }

  static async create({ name, description }) {
    const db = await getDb();
    const slug = buildTimestampedSlug(name);

    const result = await db.run(
      `
        INSERT INTO categories (name, slug, description)
        VALUES (?, ?, ?)
      `,
      [name, slug, description || ""]
    );

    return this.getById(result.lastID);
  }
}

module.exports = CategoryModel;
