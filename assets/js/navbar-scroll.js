// Navbar scroll state: the fixed navbar stays clean and border-light
// at the very top of the page, then "lands" — gaining its divider and a
// faint shadow — once the reader scrolls past a small threshold. Mirrors
// the header treatment on high-craft product sites (e.g. Linear).
//
// Progressive enhancement: adds/removes a class only; if JS is off the
// navbar keeps its default (landed) look, which is still correct.
(function () {
  function init() {
    var nav = document.getElementById("navbar");
    if (!nav) return;

    var THRESHOLD = 8; // px scrolled before the navbar "lands"
    var ticking = false;

    function update() {
      var scrolled = (window.scrollY || window.pageYOffset) > THRESHOLD;
      nav.classList.toggle("is-scrolled", scrolled);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // set correct state on load (e.g. when restored mid-page)
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
