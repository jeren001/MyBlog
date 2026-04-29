const { getDb } = require("../config/database");

class StatsModel {
  static async trackPageView({ path, title }) {
    const db = await getDb();

    await db.run(
      `
        INSERT INTO page_statistics (
          path,
          title,
          view_count,
          last_visited_at,
          created_at,
          updated_at
        )
        VALUES (?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(path)
        DO UPDATE SET
          title = excluded.title,
          view_count = page_statistics.view_count + 1,
          last_visited_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      `,
      [path, title || path]
    );
  }

  static async getOverview() {
    const db = await getDb();

    return db.get(`
      SELECT
        COUNT(*) AS tracked_pages,
        COALESCE(SUM(view_count), 0) AS total_views,
        MAX(last_visited_at) AS last_visited_at
      FROM page_statistics
    `);
  }

  static async getTopPages(limit = 10) {
    const db = await getDb();

    return db.all(
      `
        SELECT
          id,
          path,
          title,
          view_count,
          last_visited_at,
          updated_at
        FROM page_statistics
        ORDER BY view_count DESC, datetime(last_visited_at) DESC
        LIMIT ?
      `,
      [Number(limit)]
    );
  }
}

module.exports = StatsModel;
