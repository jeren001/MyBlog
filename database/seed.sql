INSERT OR IGNORE INTO categories (name, slug, description)
VALUES
  ('Development', 'development', 'Architecture notes, implementation patterns, and practical build logs.'),
  ('Writing', 'writing', 'Essays about blogging workflows, note-taking, and publishing habits.'),
  ('Design', 'design', 'Interface decisions, editorial layouts, and visual system references.');

INSERT OR IGNORE INTO articles (
  title,
  slug,
  excerpt,
  content,
  category_id,
  reading_time,
  published_at
)
VALUES
  (
    'Planning a Maintainable Express MVC Blog',
    'planning-a-maintainable-express-mvc-blog',
    'A practical starter outline for keeping routes, controllers, models, and views separated from day one.',
    'Start with a small vertical slice: one route, one controller, one model, and one view. That gives the project a repeatable pattern before features begin to sprawl.

Keep the database access inside models so controllers stay focused on request flow. When the application grows, that boundary reduces accidental duplication.

For an editorial project, EJS is often enough. You can move quickly with server-rendered templates and still keep the layout easy to evolve.',
    (SELECT id FROM categories WHERE slug = 'development'),
    8,
    '2026-04-18 09:00:00'
  ),
  (
    'Using Categories to Keep a Blog Archive Readable',
    'using-categories-to-keep-a-blog-archive-readable',
    'A category system should clarify the archive instead of turning publishing into taxonomy work.',
    'A category is most useful when it answers a browsing question quickly. Readers should be able to understand the shape of the archive without learning an internal tagging language.

The best category systems stay small. When labels multiply too easily, the archive stops helping and starts fragmenting.

Use tags for nuance, categories for structure, and let the page design reinforce the distinction.',
    (SELECT id FROM categories WHERE slug = 'writing'),
    6,
    '2026-04-12 14:15:00'
  ),
  (
    'Designing a Clean Reading Surface With EJS',
    'designing-a-clean-reading-surface-with-ejs',
    'Server-rendered views can still feel polished when the layout, spacing, and typography are treated seriously.',
    'A reading surface succeeds when it removes tiny points of friction. Clear hierarchy, generous spacing, and stable navigation do most of the work.

EJS keeps the rendering layer simple, which makes partials especially valuable. Shared headers, footers, and card fragments prevent drift between pages.

When the content model is clear, a modest stack can still produce a durable editorial experience.',
    (SELECT id FROM categories WHERE slug = 'design'),
    5,
    '2026-04-08 11:30:00'
  );

INSERT OR IGNORE INTO comments (
  article_id,
  author_name,
  author_email,
  content,
  status
)
VALUES
  (
    (SELECT id FROM articles WHERE slug = 'planning-a-maintainable-express-mvc-blog'),
    'Maya Chen',
    'maya@example.com',
    'The point about building a vertical slice first is exactly what keeps early projects from collapsing into route sprawl.',
    'approved'
  ),
  (
    (SELECT id FROM articles WHERE slug = 'using-categories-to-keep-a-blog-archive-readable'),
    'Rafael Diaz',
    'rafael@example.com',
    'Small category sets are underrated. Most archives become easier to browse as soon as the label count drops.',
    'approved'
  ),
  (
    (SELECT id FROM articles WHERE slug = 'designing-a-clean-reading-surface-with-ejs'),
    'Nina Olsen',
    'nina@example.com',
    'Shared partials really do make design drift less likely. It is the simplest win in an EJS codebase.',
    'approved'
  );

INSERT OR IGNORE INTO page_statistics (
  path,
  title,
  view_count,
  last_visited_at
)
VALUES
  ('/', 'Jeren''s Blog', 12, '2026-04-28 10:00:00'),
  ('/articles', 'Article Management', 8, '2026-04-28 11:20:00'),
  ('/categories', 'Category Management', 4, '2026-04-27 18:35:00'),
  ('/stats', 'Page Statistics', 3, '2026-04-27 20:10:00');
