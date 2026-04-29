const articles = [
  {
    id: 1,
    title: "Designing a Calm Morning Writing Routine",
    date: "2026-04-27",
    category: "Lifestyle",
    readingTime: "5 min read",
    excerpt:
      "A practical routine for turning early ideas into clear notes before messages and meetings crowd the day.",
    lead:
      "Morning writing works best when the routine makes the first few decisions ahead of time. A stable desk setup, a visible question to answer, and a quiet window before notifications all keep momentum from leaking away.",
    quote:
      "A calm writing routine is usually just a series of tiny frictions removed before the day has time to bargain with you.",
    tags: ["writing", "routine", "focus"],
    body: [
      {
        heading: "Protect the first thirty minutes",
        paragraphs: [
          "Start with a predictable sequence: make tea, open the notebook, and write without sorting ideas. The value is not in romance or ritual for its own sake. The value is that the first minutes never have to negotiate what comes next.",
          "That small amount of predictability keeps the session from collapsing into checking messages. A routine should feel smaller than your ambition so it remains easy to repeat on ordinary days.",
        ],
      },
      {
        heading: "Capture before you organize",
        paragraphs: [
          "Draft loose sentences first and tag them later. If structure shows up too early, you end up editing before the page has anything worth editing.",
          "The archive gets stronger when it captures raw observations quickly, then reshapes them into categories and essays after the energy of noticing is already on the page.",
        ],
      },
      {
        heading: "Leave one visible thread for tomorrow",
        paragraphs: [
          "End each session by writing the next question rather than a perfect conclusion. That unfinished thread lowers the cost of starting again the next morning.",
          "A useful personal blog system is really a chain of returning thoughts. Each post should make the next draft easier to begin.",
        ],
      },
    ],
    comments: [
      {
        author: "Maya Chen",
        date: "Apr 28, 2026",
        text: "The point about leaving an unfinished question is strong. It feels much easier to return to a draft when there is already a visible next step waiting.",
      },
      {
        author: "Jon Alvarez",
        date: "Apr 29, 2026",
        text: "I tried the no-sorting rule this week and it stopped me from over-editing in the first ten minutes. That alone made the routine stick.",
      },
    ],
  },
  {
    id: 2,
    title: "Building a Lightweight Tagging System for Notes",
    date: "2026-04-24",
    category: "Development",
    readingTime: "7 min read",
    excerpt:
      "A simple front-end model for keeping categories and tags easy to scan without making publishing workflows feel heavy.",
    lead:
      "Tags are most useful when they stay readable at a glance and resist becoming a private taxonomy project. The interface should support recall, not demand constant maintenance.",
    quote:
      "A tagging system stops helping the moment it asks for more precision than the writing itself can justify.",
    tags: ["javascript", "ux", "notes"],
    body: [
      {
        heading: "Prefer broad categories and small tags",
        paragraphs: [
          "One stable category per post creates a clean archive while lightweight tags capture the edges between topics. That balance keeps navigation obvious without flattening everything into one stream.",
          "Readers scan quickly, so the system should surface a few useful ways into the content instead of many nearly identical labels.",
        ],
      },
      {
        heading: "Make metadata visible where decisions happen",
        paragraphs: [
          "The best time to show categories and tags is while the user is already reading or publishing. Hiding them in a settings panel turns them into admin overhead.",
          "In a front-end prototype, visible chips and small counts do enough work to communicate structure without requiring a backend or a full CMS.",
        ],
      },
      {
        heading: "Use interaction to teach the model",
        paragraphs: [
          "Search, category filters, and tag clicks should immediately narrow the list. When the interface responds fast, readers understand the information model without needing instructions.",
          "That feedback loop is what turns static metadata into practical navigation.",
        ],
      },
    ],
    comments: [
      {
        author: "Lena Brooks",
        date: "Apr 25, 2026",
        text: "The distinction between one category and several tags is clearer here than in most note apps. It keeps the structure legible.",
      },
      {
        author: "Kai Patel",
        date: "Apr 27, 2026",
        text: "Immediate feedback really is the key. If filters do not respond right away, people stop trusting the taxonomy.",
      },
    ],
  },
  {
    id: 3,
    title: "Why Slow Reading Still Matters on the Web",
    date: "2026-04-20",
    category: "Culture",
    readingTime: "4 min read",
    excerpt:
      "Careful reading changes how we write, bookmark, and return to ideas, especially in a fast stream of links and alerts.",
    lead:
      "The web trains us to skim for signals, but a personal blog can still make room for slower attention. Layout, pacing, and typography all shape whether a reader settles in or bounces away.",
    quote:
      "Slow reading is less about speed than about giving an idea enough room to become memorable.",
    tags: ["reading", "reflection", "writing"],
    body: [
      {
        heading: "Attention follows environment",
        paragraphs: [
          "Readers decide how seriously to treat a page within seconds. A calm layout, generous spacing, and dark text on a light background all signal that the page is meant for reading rather than extraction.",
          "That signal matters because it changes how much patience a visitor is willing to bring to the next paragraph.",
        ],
      },
      {
        heading: "Bookmarks are often a delayed promise",
        paragraphs: [
          "Many links are saved with good intentions and never revisited. A better archive keeps short excerpts and visible themes so returning later feels possible instead of costly.",
          "A blog that values slow reading should make rediscovery as intentional as first contact.",
        ],
      },
      {
        heading: "Writing improves when reading slows down",
        paragraphs: [
          "Writers borrow the pace of what they consume. If every source is optimized for scanning, our own sentences start to flatten into headlines and fragments.",
          "Spending more time with a careful paragraph teaches rhythm, not just information.",
        ],
      },
    ],
    comments: [
      {
        author: "Ruth Kim",
        date: "Apr 21, 2026",
        text: "The line about bookmarks being a delayed promise feels uncomfortably accurate. I want more archives that help me re-enter an idea.",
      },
      {
        author: "Devon Ross",
        date: "Apr 23, 2026",
        text: "Pacing is an underrated design tool. The calmer the page feels, the more likely I am to actually finish the article.",
      },
    ],
  },
  {
    id: 4,
    title: "Photographing Rainy Streets With Minimal Gear",
    date: "2026-04-17",
    category: "Photography",
    readingTime: "6 min read",
    excerpt:
      "A compact kit, a patient pace, and attention to reflections can make overcast city walks surprisingly rich.",
    lead:
      "Rain simplifies a scene by muting distractions and multiplying reflections. The best results come from slowing down, carrying less, and watching how surfaces change under a gray sky.",
    quote:
      "Bad weather often removes the pressure to shoot fast, which is exactly why it can improve what you notice.",
    tags: ["photography", "city", "practice"],
    body: [
      {
        heading: "Carry less so you move more",
        paragraphs: [
          "One camera and one lens are usually enough for a wet walk. Minimal gear keeps your attention on timing and framing rather than on switching setups at every corner.",
          "Mobility matters more than theoretical flexibility when the light is changing block by block.",
        ],
      },
      {
        heading: "Use reflections as structure",
        paragraphs: [
          "Puddles and windows can create an instant second frame inside the composition. They also slow you down because they reward small shifts in angle more than frantic movement.",
          "That patience often turns an ordinary sidewalk into something cinematic.",
        ],
      },
      {
        heading: "Edit for atmosphere, not novelty",
        paragraphs: [
          "Rainy images do not need heavy effects to feel moody. Gentle contrast, restrained color, and a consistent crop usually do more than dramatic processing.",
          "The goal is to keep the weather believable while letting the mood remain intact.",
        ],
      },
    ],
    comments: [
      {
        author: "Hiro Tan",
        date: "Apr 18, 2026",
        text: "The reminder to edit for atmosphere rather than novelty is useful. Rain photos get over-processed very quickly.",
      },
      {
        author: "Elise Moore",
        date: "Apr 19, 2026",
        text: "I like the emphasis on moving with one lens. It changes the walk from technical problem-solving into observation.",
      },
    ],
  },
  {
    id: 5,
    title: "A Weekly Review Template for Busy Creators",
    date: "2026-04-12",
    category: "Productivity",
    readingTime: "5 min read",
    excerpt:
      "This review pattern keeps projects visible, trims noise, and leaves enough room for thoughtful planning every Friday.",
    lead:
      "A weekly review should reduce mental clutter, not become another elaborate ritual. The template works when it highlights current commitments, unresolved friction, and the next few useful decisions.",
    quote:
      "A review is successful when it narrows your next week to a handful of visible priorities.",
    tags: ["planning", "workflow", "focus"],
    body: [
      {
        heading: "Start with what moved",
        paragraphs: [
          "List what actually changed this week before you judge what did not. That keeps the review grounded in evidence instead of vague guilt.",
          "Momentum is easier to extend when it is named clearly.",
        ],
      },
      {
        heading: "Surface drag without dramatizing it",
        paragraphs: [
          "Every project accumulates friction points: missing assets, unclear decisions, postponed messages. A short section for drag helps you respond to them without letting them dominate the review.",
          "The template should reveal blockers while keeping the overall tone practical.",
        ],
      },
      {
        heading: "Plan by subtraction",
        paragraphs: [
          "Before adding new goals, remove what no longer deserves space. Subtraction is often the fastest route to a week that feels deliberate.",
          "A personal system stays useful when it can say no just as clearly as it can organize yes.",
        ],
      },
    ],
    comments: [
      {
        author: "Nora Hill",
        date: "Apr 13, 2026",
        text: "Planning by subtraction is the part I usually skip, and it is probably the one I need most.",
      },
      {
        author: "Sami Ortega",
        date: "Apr 15, 2026",
        text: "The review framing here feels realistic. It is structured enough to help without becoming its own productivity project.",
      },
    ],
  },
];

const newsItems = [
  {
    title: "Monthly digest draft is ready for Friday publication.",
    time: "2 hours ago",
  },
  {
    title: "Archive layout updated with cleaner year filters.",
    time: "Yesterday",
  },
  {
    title: "Guest post invitations open for the May design issue.",
    time: "Apr 26, 2026",
  },
  {
    title: "Photo essay notes added to the editorial backlog.",
    time: "Apr 24, 2026",
  },
];

function getInitialTheme() {
  let storedTheme = null;

  try {
    storedTheme = window.localStorage.getItem("quiet-notes-theme");
  } catch (error) {
    storedTheme = null;
  }

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

const state = {
  search: "",
  category: "All",
  tag: "All",
  selectedArticleId: articles[0].id,
  theme: getInitialTheme(),
};

const articleFeed = document.getElementById("articleFeed");
const articleCount = document.getElementById("articleCount");
const articleDetail = document.getElementById("articleDetail");
const articleDetailSection = document.getElementById("articleDetailSection");
const newsList = document.getElementById("newsList");
const categoryList = document.getElementById("categoryList");
const tagCloud = document.getElementById("tagCloud");
const recentPosts = document.getElementById("recentPosts");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
const themeToggleState = document.getElementById("themeToggleState");

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value) {
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

function saveTheme(theme) {
  try {
    window.localStorage.setItem("quiet-notes-theme", theme);
  } catch (error) {
    // Ignore storage failures in preview environments.
  }
}

function applyTheme(theme) {
  state.theme = theme;
  document.body.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Disable dark mode" : "Enable dark mode"
  );
  themeToggleState.textContent = theme === "dark" ? "On" : "Off";
}

function getCategoryCounts() {
  const counts = new Map();

  for (const article of articles) {
    counts.set(article.category, (counts.get(article.category) || 0) + 1);
  }

  return [
    { name: "All", count: articles.length },
    ...Array.from(counts.entries()).map(([name, count]) => ({ name, count })),
  ];
}

function getTagCounts() {
  const counts = new Map();

  for (const article of articles) {
    for (const tag of article.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort(
      (left, right) =>
        right.count - left.count || left.name.localeCompare(right.name)
    );
}

function getFilteredArticles() {
  const query = state.search.trim().toLowerCase();

  return articles.filter((article) => {
    const matchesSearch =
      query.length === 0 ||
      [
        article.title,
        article.excerpt,
        article.lead,
        article.category,
        article.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

    const matchesCategory =
      state.category === "All" || article.category === state.category;

    const matchesTag = state.tag === "All" || article.tags.includes(state.tag);

    return matchesSearch && matchesCategory && matchesTag;
  });
}

function getSelectedArticle() {
  return (
    articles.find((article) => article.id === state.selectedArticleId) || articles[0]
  );
}

function getRelatedArticles(currentArticle) {
  return articles
    .filter((article) => article.id !== currentArticle.id)
    .map((article) => {
      const sharedTags = article.tags.filter((tag) =>
        currentArticle.tags.includes(tag)
      ).length;
      const categoryMatch = article.category === currentArticle.category ? 2 : 0;

      return {
        article,
        score: sharedTags * 2 + categoryMatch,
      };
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return new Date(right.article.date) - new Date(left.article.date);
    })
    .slice(0, 3)
    .map((entry) => entry.article);
}

function renderNews() {
  newsList.innerHTML = newsItems
    .map(
      (item) => `
        <li>
          <a class="news-item" href="#home">
            <strong>${item.title}</strong>
            <span class="news-time">${item.time}</span>
          </a>
        </li>
      `
    )
    .join("");
}

function renderCategories() {
  categoryList.innerHTML = getCategoryCounts()
    .map(
      (category) => `
        <button
          class="chip ${category.name === state.category ? "active" : ""}"
          type="button"
          data-category="${category.name}"
        >
          ${category.name} (${category.count})
        </button>
      `
    )
    .join("");
}

function renderTags() {
  tagCloud.innerHTML = `
    <button
      class="chip ${state.tag === "All" ? "active" : ""}"
      type="button"
      data-tag="All"
      style="font-size: 0.95rem"
    >
      All Tags
    </button>
    ${getTagCounts()
      .map((tag) => {
        const size = (0.88 + tag.count * 0.08).toFixed(2);

        return `
          <button
            class="chip ${tag.name === state.tag ? "active" : ""}"
            type="button"
            data-tag="${tag.name}"
            style="font-size: ${size}rem"
          >
            ${tag.name}
          </button>
        `;
      })
      .join("")}
  `;
}

function renderRecentPosts() {
  recentPosts.innerHTML = [...articles]
    .sort((left, right) => new Date(right.date) - new Date(left.date))
    .slice(0, 4)
    .map(
      (article) => `
        <li>
          <a
            class="recent-link"
            href="#articleDetailSection"
            data-open-article="${article.id}"
          >
            <strong>${article.title}</strong>
            <span class="recent-date">${formatDate(article.date)}</span>
          </a>
        </li>
      `
    )
    .join("");
}

function renderArticles() {
  const filteredArticles = getFilteredArticles();

  articleCount.textContent = `${filteredArticles.length} sample post${
    filteredArticles.length === 1 ? "" : "s"
  }`;

  if (filteredArticles.length === 0) {
    articleFeed.innerHTML = `
      <div class="empty-state">
        <strong>No sample posts match the current filters.</strong>
        Try a different keyword, category, or tag.
      </div>
    `;
    return;
  }

  articleFeed.innerHTML = filteredArticles
    .map(
      (article) => `
        <article
          class="article-card ${article.id === state.selectedArticleId ? "is-active" : ""}"
          id="article-${article.id}"
        >
          <div>
            <h2>${article.title}</h2>
          </div>
          <div class="article-meta">
            <span class="meta-pill">${formatDate(article.date)}</span>
            <span class="meta-pill">${article.category}</span>
            <span class="meta-pill">${article.readingTime}</span>
          </div>
          <p>${article.excerpt}</p>
          <div class="article-footer">
            <div class="article-tags">
              ${article.tags
                .map((tag) => `<span class="article-tag">#${tag}</span>`)
                .join("")}
            </div>
            <button
              class="read-more"
              type="button"
              data-open-article="${article.id}"
            >
              Read more
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderArticleDetail() {
  const article = getSelectedArticle();
  const relatedArticles = getRelatedArticles(article);

  articleDetail.innerHTML = `
    <article class="detail-panel">
      <header class="detail-hero">
        <p class="panel-kicker">Selected article</p>
        <h3 class="detail-title">${article.title}</h3>
        <div class="article-meta">
          <span class="meta-pill">${formatDate(article.date)}</span>
          <span class="meta-pill">${article.category}</span>
          <span class="meta-pill">${article.readingTime}</span>
        </div>
        <p class="detail-standfirst">${article.lead}</p>
      </header>

      <section class="detail-feature">
        <div class="detail-feature-block">
          <p class="detail-feature-label">Reading notes</p>
          <p class="detail-feature-text">${article.excerpt}</p>
          <div class="detail-feature-list">
            ${article.tags
              .map((tag) => `<span class="article-tag">#${tag}</span>`)
              .join("")}
          </div>
        </div>
        <blockquote class="detail-quote">${article.quote}</blockquote>
      </section>

      <div class="detail-body">
        ${article.body
          .map(
            (section) => `
              <section>
                <h4>${section.heading}</h4>
                ${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
              </section>
            `
          )
          .join("")}
      </div>

      <div class="detail-lower-grid">
        <section class="detail-card">
          <div class="panel-header">
            <p class="panel-kicker">Conversation</p>
            <h4>Comments</h4>
          </div>
          <ul class="comment-list">
            ${article.comments
              .map(
                (comment) => `
                  <li class="comment-item">
                    <div class="comment-meta">
                      <span class="comment-author">${comment.author}</span>
                      <span class="comment-date">${comment.date}</span>
                    </div>
                    <p class="comment-text">${comment.text}</p>
                  </li>
                `
              )
              .join("")}
          </ul>
          <form class="comment-form">
            <div class="comment-fields">
              <label>
                <span class="visually-hidden">Name</span>
                <input type="text" name="name" placeholder="Name" />
              </label>
              <label>
                <span class="visually-hidden">Email</span>
                <input type="email" name="email" placeholder="Email" />
              </label>
            </div>
            <label>
              <span class="visually-hidden">Comment</span>
              <textarea
                name="comment"
                placeholder="Leave a thoughtful comment about this article..."
              ></textarea>
            </label>
            <button class="comment-submit" type="submit">Post comment</button>
          </form>
        </section>

        <section class="detail-card">
          <div class="panel-header">
            <p class="panel-kicker">Next reads</p>
            <h4>Related Articles</h4>
          </div>
          <div class="related-list">
            ${relatedArticles
              .map(
                (relatedArticle) => `
                  <a
                    class="related-card"
                    href="#articleDetailSection"
                    data-open-article="${relatedArticle.id}"
                  >
                    <strong>${relatedArticle.title}</strong>
                    <span class="related-card-meta">
                      ${formatDate(relatedArticle.date)} · ${relatedArticle.category}
                    </span>
                  </a>
                `
              )
              .join("")}
          </div>
        </section>
      </div>
    </article>
  `;
}

function renderAll() {
  renderCategories();
  renderTags();
  renderRecentPosts();
  renderArticles();
  renderArticleDetail();
}

function openArticle(articleId) {
  const parsedId = Number(articleId);

  if (!Number.isFinite(parsedId)) {
    return;
  }

  state.selectedArticleId = parsedId;
  renderArticles();
  renderArticleDetail();
  articleDetailSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function handleArticleSelection(event) {
  const trigger = event.target.closest("[data-open-article]");

  if (!trigger) {
    return;
  }

  event.preventDefault();
  openArticle(trigger.dataset.openArticle);
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderArticles();
});

categoryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");

  if (!button) {
    return;
  }

  state.category = button.dataset.category;
  renderAll();
});

tagCloud.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tag]");

  if (!button) {
    return;
  }

  state.tag = button.dataset.tag;
  renderAll();
});

articleFeed.addEventListener("click", handleArticleSelection);
recentPosts.addEventListener("click", handleArticleSelection);
articleDetail.addEventListener("click", handleArticleSelection);

articleDetail.addEventListener("submit", (event) => {
  if (event.target.matches(".comment-form")) {
    event.preventDefault();
  }
});

themeToggle.addEventListener("click", () => {
  const nextTheme = state.theme === "dark" ? "light" : "dark";

  applyTheme(nextTheme);
  saveTheme(nextTheme);
});

applyTheme(state.theme);
renderNews();
renderAll();
