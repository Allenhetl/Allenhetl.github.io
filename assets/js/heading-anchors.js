// Heading anchor links: for article headings, add a "#" link that
// appears on hover and, when clicked, copies a deep link to that
// section to the clipboard (falling back to a normal in-page jump).
// Progressive enhancement — if JS is off, headings are just headings.
(function () {
  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w一-鿿\s-]/g, "") // keep word chars, CJK, spaces, hyphens
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function init() {
    var headings = document.querySelectorAll(".post article > h2, .post article > h3, .post article > h4");
    if (!headings.length) return;

    var used = {};
    headings.forEach(function (h) {
      // Assign a stable id if the heading doesn't already have one.
      var id = h.id;
      if (!id) {
        id = slugify(h.textContent) || "section";
        if (used[id]) {
          used[id] += 1;
          id = id + "-" + used[id];
        } else {
          used[id] = 1;
        }
        h.id = id;
      }

      // Don't double-inject (e.g. if the script runs twice).
      if (h.querySelector(".heading-anchor")) return;

      var a = document.createElement("a");
      a.className = "heading-anchor";
      a.href = "#" + id;
      a.setAttribute("aria-label", "Link to this section");
      a.textContent = "#";

      a.addEventListener("click", function (e) {
        var url = location.origin + location.pathname + "#" + id;
        // Update the URL + jump regardless of clipboard support.
        history.replaceState(null, "", "#" + id);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          e.preventDefault();
          navigator.clipboard.writeText(url).then(
            function () {
              a.classList.add("is-copied");
              a.textContent = "✓";
              setTimeout(function () {
                a.classList.remove("is-copied");
                a.textContent = "#";
              }, 1200);
            },
            function () {}
          );
        }
      });

      h.insertBefore(a, h.firstChild);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
