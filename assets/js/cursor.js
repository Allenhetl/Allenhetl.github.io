// Restrained custom cursor: a small accent dot that trails the pointer
// with light easing and softens into a hollow ring over interactive
// targets. Pure decoration and progressive enhancement:
//   - Only runs on devices with a fine, hover-capable pointer (mouse),
//     so touch devices are untouched.
//   - Skipped entirely under prefers-reduced-motion.
//   - The native cursor is left visible, so nothing is lost if JS is off
//     or this bails out.
(function () {
  function init() {
    var mm = window.matchMedia;
    if (!mm) return;

    var finePointer = mm("(pointer: fine)").matches && mm("(hover: hover)").matches;
    var reduce = mm("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduce) return;

    var dot = document.createElement("div");
    dot.className = "rm-cursor";
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);

    // Target position (raw pointer) vs. rendered position (eased) for a
    // subtle trailing feel.
    var tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      active = false,
      raf = null;

    function render() {
      // Exponential smoothing — small factor = a gentle lag.
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      dot.style.transform = "translate3d(" + cx + "px, " + cy + "px, 0) translate(-50%, -50%)";
      // Keep animating while the eased position hasn't caught up.
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(render);
      } else {
        raf = null;
      }
    }

    function kick() {
      if (raf === null) raf = requestAnimationFrame(render);
    }

    document.addEventListener(
      "mousemove",
      function (e) {
        tx = e.clientX;
        ty = e.clientY;
        if (!active) {
          active = true;
          // Snap to the pointer on first move so it doesn't fly in from 0,0.
          cx = tx;
          cy = ty;
          dot.classList.add("is-active");
        }
        kick();
      },
      { passive: true }
    );

    // Hide when the pointer leaves the window; show again on return.
    document.addEventListener("mouseleave", function () {
      dot.classList.remove("is-active");
    });
    document.addEventListener("mouseenter", function () {
      if (active) dot.classList.add("is-active");
    });

    // Press feedback.
    document.addEventListener("mousedown", function () {
      dot.classList.add("is-down");
    });
    document.addEventListener("mouseup", function () {
      dot.classList.remove("is-down");
    });

    // Grow into a ring over anything clickable. Uses event delegation +
    // closest() so it also works for links/buttons added later.
    var interactiveSel = 'a, button, .card, input, textarea, select, summary, [role="button"], .clickable, label[for]';
    document.addEventListener(
      "mouseover",
      function (e) {
        if (e.target.closest && e.target.closest(interactiveSel)) {
          dot.classList.add("is-hovering");
        }
      },
      { passive: true }
    );
    document.addEventListener(
      "mouseout",
      function (e) {
        // Only drop the ring when leaving an interactive element for a
        // non-interactive one (relatedTarget is where the pointer went).
        var to = e.relatedTarget;
        if (!to || !(to.closest && to.closest(interactiveSel))) {
          dot.classList.remove("is-hovering");
        }
      },
      { passive: true }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
