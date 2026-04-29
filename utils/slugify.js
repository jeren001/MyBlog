function slugify(value = "") {
  return (
    value
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-") || "item"
  );
}

function buildTimestampedSlug(value) {
  return `${slugify(value)}-${Date.now().toString(36)}`;
}

module.exports = {
  slugify,
  buildTimestampedSlug,
};
