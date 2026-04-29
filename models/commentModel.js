const { getDb } = require("../config/database");

class CommentModel {
  static async getAll({ status = "" } = {}) {
    const db = await getDb();
    const params = [];
    let query = `
      SELECT
        cm.id,
        cm.article_id,
        cm.author_name,
        cm.author_email,
        cm.content,
        cm.status,
        cm.created_at,
        a.title AS article_title
      FROM comments cm
      INNER JOIN articles a ON a.id = cm.article_id
    `;

    if (status) {
      query += " WHERE cm.status = ?";
      params.push(status);
    }

    query += " ORDER BY datetime(cm.created_at) DESC, cm.id DESC";

    return db.all(query, params);
  }

  static async getById(id) {
    const db = await getDb();

    return db.get(
      `
        SELECT
          cm.id,
          cm.article_id,
          cm.author_name,
          cm.author_email,
          cm.content,
          cm.status,
          cm.created_at,
          a.title AS article_title
        FROM comments cm
        INNER JOIN articles a ON a.id = cm.article_id
        WHERE cm.id = ?
      `,
      [Number(id)]
    );
  }

  static async getApprovedByArticleId(articleId) {
    const db = await getDb();

    return db.all(
      `
        SELECT
          id,
          author_name,
          author_email,
          content,
          status,
          created_at
        FROM comments
        WHERE article_id = ? AND status = 'approved'
        ORDER BY datetime(created_at) DESC, id DESC
      `,
      [Number(articleId)]
    );
  }

  static async create({ articleId, authorName, authorEmail, content }) {
    const db = await getDb();

    const result = await db.run(
      `
        INSERT INTO comments (
          article_id,
          author_name,
          author_email,
          content,
          status
        )
        VALUES (?, ?, ?, ?, 'approved')
      `,
      [Number(articleId), authorName, authorEmail || "", content]
    );

    return this.getById(result.lastID);
  }

  static async delete(id) {
    const db = await getDb();
    return db.run("DELETE FROM comments WHERE id = ?", [Number(id)]);
  }
}

module.exports = CommentModel;
