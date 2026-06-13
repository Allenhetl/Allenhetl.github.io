// Scroll-reveal: add .is-revealed to [data-reveal] elements as they
// enter the viewport. Progressive enhancement — if IntersectionObserver
// is unavailable or the user prefers reduced motion, everything is
// revealed immediately (the CSS keeps content visible without the class
// only when motion is allowed).
(function () {
  function revealAll(nodes) {
    nodes.forEach(function (n) {
      n.classList.add("is-revealed");
    });
  }

  function init() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (!nodes.length) return;

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      revealAll(nodes);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
