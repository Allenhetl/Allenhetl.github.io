// Living blueprint: on the homepage hero, a faint accent spotlight
// follows the pointer over the background grid, and the corner
// coordinate readout updates to the pointer's normalized position — so
// the "technical blueprint" reads as a live sensor canvas rather than a
// static backdrop. Tied to the embodied-AI / robotics identity.
//
// Progressive enhancement: fine-pointer devices only, skipped under
// reduced-motion, and the static grid + fixed coordinate remain if this
// never runs.
(function () {
  function init() {
    var mm = window.matchMedia;
    if (!mm) return;
    if (!mm("(pointer: fine)").matches || !mm("(hover: hover)").matches) return;
    if (mm("(prefers-reduced-motion: reduce)").matches) return;

    var hero = document.querySelector(".home-header");
    if (!hero) return;

    // Base coordinate (matches the CSS default so there's no jump).
    var BASE_LAT = 22.34;
    var BASE_LON = 114.26;

    var ticking = false;
    var lastX = 0,
      lastY = 0;

    function update() {
      var r = hero.getBoundingClientRect();
      // Normalized position within the hero (0..1), clamped.
      var nx = Math.min(1, Math.max(0, (lastX - r.left) / r.width));
      var ny = Math.min(1, Math.max(0, (lastY - r.top) / r.height));

      // Spotlight position for the CSS radial-gradient overlay.
      hero.style.setProperty("--bp-mx", (nx * 100).toFixed(1) + "%");
      hero.style.setProperty("--bp-my", (ny * 100).toFixed(1) + "%");

      // Coordinate readout drifts slightly with the pointer — small
      // deltas so it feels like a live fix, not a random number.
      var lat = (BASE_LAT + (ny - 0.5) * 0.08).toFixed(2);
      var lon = (BASE_LON + (nx - 0.5) * 0.08).toFixed(2);
      hero.setAttribute("data-coord", "N" + lat + "° · E" + lon + "°");

      ticking = false;
    }

    hero.addEventListener(
      "pointermove",
      function (e) {
        lastX = e.clientX;
        lastY = e.clientY;
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
        hero.classList.add("bp-live");
      },
      { passive: true }
    );

    hero.addEventListener("pointerleave", function () {
      hero.classList.remove("bp-live");
      hero.removeAttribute("data-coord"); // fall back to the CSS default
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
