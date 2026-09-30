const THEME_STORAGE_KEY = "jeren-blog-theme";
const systemThemeQuery =
  typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

const themeToggle = document.querySelector("[data-theme-toggle]");
const themeState = document.querySelector("[data-theme-state]");

function getStoredTheme() {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : null;
  } catch (error) {
    return null;
  }
}

function getPreferredTheme() {
  return getStoredTheme() || (systemThemeQuery?.matches ? "dark" : "light");
}

function saveTheme(theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // Ignore storage failures in restricted environments.
  }
}

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.documentElement.dataset.theme = theme;

  if (!themeToggle || !themeState) {
    return;
  }

  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
  themeState.textContent = isDark ? "Dark" : "Light";
}

if (themeToggle) {
  applyTheme(getPreferredTheme());

  themeToggle.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });
}

if (systemThemeQuery) {
  const syncWithSystemTheme = (event) => {
    if (getStoredTheme()) {
      return;
    }

    applyTheme(event.matches ? "dark" : "light");
  };

  if (typeof systemThemeQuery.addEventListener === "function") {
    systemThemeQuery.addEventListener("change", syncWithSystemTheme);
  } else if (typeof systemThemeQuery.addListener === "function") {
    systemThemeQuery.addListener(syncWithSystemTheme);
  }
}

document.addEventListener("submit", (event) => {
  const submitter = event.submitter;

  if (!submitter || !submitter.matches("[data-confirm]")) {
    return;
  }

  const message = submitter.getAttribute("data-confirm") || "Are you sure?";

  if (!window.confirm(message)) {
    event.preventDefault();
  }
});
