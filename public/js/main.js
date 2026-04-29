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
