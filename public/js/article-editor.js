(function initializeArticleEditor() {
  const form = document.querySelector("[data-article-editor-form]");

  if (!form) {
    return;
  }

  const markdownField = form.querySelector("[data-markdown-editor]");
  const tagsInput = form.querySelector("[data-tag-input]");
  const tagsPreview = form.querySelector("[data-tag-preview]");
  const summaryField = form.querySelector("[data-summary-field]");
  let summaryMode =
    summaryField && summaryField.value.trim().length > 0 ? "manual" : "auto";

  function parseTags(value) {
    return [
      ...new Set(
        String(value || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      ),
    ];
  }

  function renderTagPreview() {
    if (!tagsPreview || !tagsInput) {
      return;
    }

    const tags = parseTags(tagsInput.value);

    if (tags.length === 0) {
      tagsPreview.innerHTML =
        '<span class="tag-preview-empty">No tags added yet.</span>';
      return;
    }

    tagsPreview.innerHTML = tags
      .map((tag) => `<span class="tag-pill">${tag}</span>`)
      .join("");
  }

  function wrapSelection(editor, before, after, placeholder) {
    const cm = editor.codemirror;
    const selection = cm.getSelection() || placeholder;

    cm.replaceSelection(`${before}${selection}${after}`);
    cm.focus();
  }

  function insertHeading(editor) {
    const cm = editor.codemirror;
    const selection = cm.getSelection().trim() || "Heading";

    cm.replaceSelection(`## ${selection}`);
    cm.focus();
  }

  function insertLink(editor) {
    const cm = editor.codemirror;
    const selection = cm.getSelection().trim() || "link text";

    cm.replaceSelection(`[${selection}](https://example.com)`);
    cm.focus();
  }

  function insertImage(editor) {
    const cm = editor.codemirror;

    cm.replaceSelection(
      "![descriptive alt text](https://images.example.com/photo.jpg)"
    );
    cm.focus();
  }

  function insertCodeBlock(editor) {
    const cm = editor.codemirror;
    const selection = cm.getSelection().trim() || "const message = 'Hello';";

    cm.replaceSelection(`\n\`\`\`js\n${selection}\n\`\`\`\n`);
    cm.focus();
  }

  function normalizeSummarySource(value) {
    return String(value || "")
      .replace(/!\[.*?\]\((.*?)\)/g, "")
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
      .replace(/[`#>*_\-\n]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function syncSummaryFromMarkdown(editor) {
    if (!summaryField || summaryMode !== "auto") {
      return;
    }

    const normalized = normalizeSummarySource(editor.value());
    summaryField.value = normalized.slice(0, 150);
  }

  renderTagPreview();

  if (tagsInput) {
    tagsInput.addEventListener("input", renderTagPreview);
  }

  if (summaryField) {
    summaryField.addEventListener("input", () => {
      summaryMode = "manual";
    });
  }

  if (!markdownField || typeof window.EasyMDE === "undefined") {
    return;
  }

  const editor = new EasyMDE({
    element: markdownField,
    forceSync: true,
    spellChecker: false,
    autoDownloadFontAwesome: false,
    sideBySideFullscreen: false,
    minHeight: "380px",
    status: ["lines", "words", "cursor"],
    placeholder: "Write the article in Markdown...",
    toolbar: [
      {
        name: "bold",
        action: (instance) =>
          wrapSelection(instance, "**", "**", "bold text"),
        className: "fa fa-bold",
        title: "Bold",
      },
      {
        name: "italic",
        action: (instance) =>
          wrapSelection(instance, "*", "*", "italic text"),
        className: "fa fa-italic",
        title: "Italic",
      },
      {
        name: "heading",
        action: insertHeading,
        className: "fa fa-header",
        title: "Heading",
      },
      "|",
      {
        name: "link",
        action: insertLink,
        className: "fa fa-link",
        title: "Link",
      },
      {
        name: "image",
        action: insertImage,
        className: "fa fa-picture-o",
        title: "Image",
      },
      {
        name: "code",
        action: insertCodeBlock,
        className: "fa fa-code",
        title: "Code Block",
      },
      "|",
      "preview",
      "side-by-side",
      "fullscreen",
      "|",
      "guide",
    ],
  });

  editor.codemirror.on("change", () => {
    syncSummaryFromMarkdown(editor);
  });

  if (
    window.innerWidth >= 1100 &&
    typeof editor.toggleSideBySide === "function"
  ) {
    window.setTimeout(() => {
      editor.toggleSideBySide();
    }, 0);
  }

  syncSummaryFromMarkdown(editor);
})();
