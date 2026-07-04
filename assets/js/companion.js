// Corner desk-pet companion — an oneko-derived behavior engine with a
// richer "brain": follows the cursor only within a detection range,
// jumps on click (squash-and-stretch), sits/sleeps when idle, turns to
// face its heading, and plays spontaneous micro-animations.
//
// The ART is a sprite sheet (an 8x-ish grid of 32px frames). Swap
// SPRITE.file + the frame map to change the character (cat -> robot)
// without touching the behavior logic.
//
// Progressive enhancement: desktop fine-pointer only, skipped under
// reduced-motion, honors a persisted dismiss.
(function () {
  "use strict";

  // ---- Sprite config (swap this block to change the character) --------
  // Frames are [col, row] into a 32px grid. This is the classic oneko
  // layout; a robot sheet with the same layout drops in unchanged.
  var SPRITE = {
    file: "/assets/img/oneko-placeholder.gif",
    size: 32,
    sets: {
      idle: [[-3, -3]],
      alert: [[-7, -3]],
      // spontaneous micro-animations
      scratchSelf: [
        [-5, 0],
        [-6, 0],
        [-7, 0],
      ],
      // tired / sitting + sleeping
      tired: [[-3, -2]],
      sleeping: [
        [-2, 0],
        [-2, -1],
      ],
      // 8 heading directions (2-frame walk cycles)
      N: [
        [-1, -2],
        [-1, -3],
      ],
      NE: [
        [0, -2],
        [0, -3],
      ],
      E: [
        [-3, 0],
        [-3, -1],
      ],
      SE: [
        [-5, -1],
        [-5, -2],
      ],
      S: [
        [-6, -3],
        [-7, -2],
      ],
      SW: [
        [-5, -3],
        [-6, -1],
      ],
      W: [
        [-4, -2],
        [-4, -3],
      ],
      NW: [
        [-1, 0],
        [-1, -1],
      ],
    },
  };

  // ---- Tunables -------------------------------------------------------
  var SCALE = 1.4; // display scale of the 32px sprite
  var SPEED = 10; // px per logic tick while following
  var DEAD = 44; // stop distance (don't crowd the cursor)
  var WAKE = 240; // cursor within this range → wake + follow
  var SLEEP_RANGE = 340; // cursor beyond this → allowed to rest (hysteresis)
  var TICK_MS = 100; // logic tick (10fps sprite cadence — cheap & charming)
  var SIT_AFTER = 90; // ticks idle (~9s) → sit
  var SLEEP_AFTER = 320; // ticks idle (~32s) → sleep

  function init() {
    var mm = window.matchMedia;
    if (!mm) return;
    if (!mm("(pointer: fine)").matches || !mm("(hover: hover)").matches) return;
    if (mm("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 1024) return;

    // --- element -------------------------------------------------------
    var el = document.createElement("div");
    el.id = "companion";
    el.setAttribute("aria-hidden", "true");
    var S = SPRITE.size;
    el.style.width = S + "px";
    el.style.height = S + "px";
    el.style.backgroundImage = "url(" + SPRITE.file + ")";
    document.body.appendChild(el);

    // The pet is a permanent resident — no dismiss. Left-click jumps,
    // double-click is a happy spin, press-and-drag repositions it.

    // A small discoverable hint bubble for the keyboard easter eggs.
    // Shows once (first time the pointer rests on the pet), then never
    // nags again. Purely a "psst, try this" — not a permanent label.
    var HINT_KEY = "companion-hint-seen";
    var hintShown = false;
    try {
      hintShown = localStorage.getItem(HINT_KEY) === "1";
    } catch (e) {}
    var hintEl = null;
    function showHint() {
      if (hintShown || hintEl) return;
      hintShown = true;
      try {
        localStorage.setItem(HINT_KEY, "1");
      } catch (e) {}
      hintEl = document.createElement("div");
      hintEl.className = "companion-hint";
      hintEl.innerHTML = "press <b>F</b> to feed · <b>C</b> to call";
      document.body.appendChild(hintEl);
      positionHint();
      // fade out after a few seconds
      setTimeout(function () {
        if (hintEl) {
          hintEl.classList.add("is-leaving");
          setTimeout(function () {
            if (hintEl) {
              hintEl.remove();
              hintEl = null;
            }
          }, 400);
        }
      }, 4200);
    }
    // Hint sits fixed in the bottom-left corner (does not follow the pet).
    function positionHint() {
      if (!hintEl) return;
      hintEl.style.left = "1.1rem";
      hintEl.style.bottom = "1.1rem";
    }

    // --- state ---------------------------------------------------------
    // start bottom-right
    var x = window.innerWidth - 64;
    var y = window.innerHeight - 96;
    var mx = x,
      my = y;
    var frame = 0;
    var idle = 0;
    var state = "idle"; // idle | follow | sit | sleep | react
    var micro = null; // active micro-animation name
    var microFrame = 0;
    var awake = false; // hysteresis: became interested?
    // jump animation (runs on the rAF clock, independent of logic ticks)
    var jump = null; // {t0, from, dur}
    var spin = null; // happy double-click spin {t, dur}
    // drag state
    var dragging = false,
      dragMoved = false,
      grabDX = 0,
      grabDY = 0,
      lastPX = 0,
      lastPY = 0,
      velX = 0,
      velY = 0;
    var wander = null; // {x,y} self-directed stroll target while idle
    var treat = null; // {x,y,el} a dropped treat to run to and eat
    var eating = 0; // ticks left in the eat animation
    var petHover = 0; // ms the pointer has rested on the pet
    var startle = 0; // ticks of scroll-startle alertness left

    function setSprite(name, f) {
      var set = SPRITE.sets[name] || SPRITE.sets.idle;
      var s = set[f % set.length];
      el.style.backgroundPosition = s[0] * S + "px " + s[1] * S + "px";
    }

    function place() {
      el.style.left = x - S / 2 + "px";
      el.style.top = y - S / 2 + (jump ? jump.offset : 0) + "px";
    }

    document.addEventListener(
      "mousemove",
      function (e) {
        mx = e.clientX;
        my = e.clientY;
      },
      { passive: true }
    );

    // Press → begin a potential drag. If the pointer moves past a small
    // threshold we treat it as dragging; otherwise the mouseup is a click.
    el.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return; // left only
      e.preventDefault();
      dragging = true;
      dragMoved = false;
      grabDX = e.clientX - x;
      grabDY = e.clientY - y;
      lastPX = e.clientX;
      lastPY = e.clientY;
      velX = velY = 0;
      el.classList.add("is-dragging");
    });

    window.addEventListener("mousemove", function (e) {
      if (!dragging) return;
      if (Math.abs(e.clientX - (x + grabDX)) > 3 || Math.abs(e.clientY - (y + grabDY)) > 3) {
        dragMoved = true;
      }
      x = e.clientX - grabDX;
      y = e.clientY - grabDY;
      x = Math.min(Math.max(16, x), window.innerWidth - 16);
      y = Math.min(Math.max(16, y), window.innerHeight - 16);
      velX = e.clientX - lastPX;
      velY = e.clientY - lastPY;
      lastPX = e.clientX;
      lastPY = e.clientY;
      idle = 0;
      setSprite("alert", 0); // wide-eyed while carried
    });

    window.addEventListener("mouseup", function () {
      if (!dragging) return;
      dragging = false;
      el.classList.remove("is-dragging");
      if (dragMoved) {
        // A little "shake off" after being put down, then resume.
        var prev = "idle";
        jump = { t: 0, dur: 380, offset: 0, prev: prev };
        state = "react";
        idle = 0;
      }
    });

    // Click (no drag) → jump reaction (pushdown: resume prior state after).
    el.addEventListener("click", function () {
      if (jump || dragMoved) return;
      var prev = state;
      jump = { t: 0, dur: 460, offset: 0, prev: prev };
      state = "react";
      idle = 0;
    });

    // Double-click ON the pet → happy spin + scratch.
    el.addEventListener("dblclick", function (e) {
      e.stopPropagation();
      spin = { t: 0, dur: 620 };
      micro = "scratchSelf";
      microFrame = 0;
      idle = 0;
    });

    // Double-click EMPTY page → the pet dashes over to investigate, then
    // idles there. A playful "come here / go look" toy.
    var summon = null; // {x,y}
    document.addEventListener("dblclick", function (e) {
      if (e.target.closest && e.target.closest("a, button, input, textarea, select, #companion, .card")) return;
      summon = { x: e.clientX, y: e.clientY };
      awake = true;
      idle = 0;
    });

    // Keyboard easter eggs: "c" calls the pet to the cursor; "f" feeds it.
    document.addEventListener("keydown", function (e) {
      if (/input|textarea|select/i.test(e.target.tagName || "")) return;
      if (e.key === "c") {
        summon = { x: mx, y: my };
        awake = true;
        idle = 0;
      } else if (e.key === "f") {
        dropTreat(mx, my);
      }
    });

    // Scroll → the pet is startled alert for a moment.
    window.addEventListener(
      "scroll",
      function () {
        startle = 6; // ticks (~0.6s)
        idle = 0;
      },
      { passive: true }
    );

    // Pet-hover: resting the pointer on the pet for ~0.9s makes it happy
    // (scratch + floating hearts).
    var petTimer = null;
    el.addEventListener("mouseenter", function () {
      showHint(); // first hover reveals the keyboard easter eggs, once
      petTimer = setTimeout(function () {
        micro = "scratchSelf";
        microFrame = 0;
        idle = 0;
        spawnHearts();
      }, 900);
    });
    el.addEventListener("mouseleave", function () {
      if (petTimer) clearTimeout(petTimer);
      petTimer = null;
    });

    // --- treats + hearts (little DOM sprites) --------------------------
    function dropTreat(tx, ty) {
      if (treat) return; // one at a time
      var t = document.createElement("div");
      t.className = "companion-treat";
      t.textContent = "🐟";
      t.style.left = tx - 10 + "px";
      t.style.top = ty - 10 + "px";
      document.body.appendChild(t);
      treat = { x: tx, y: ty, el: t };
      awake = true;
      idle = 0;
    }
    function spawnHearts() {
      for (var i = 0; i < 3; i++) {
        (function (n) {
          var h = document.createElement("div");
          h.className = "companion-heart";
          h.textContent = "❤";
          h.style.left = x - 6 + (n - 1) * 10 + "px";
          h.style.top = y - 20 + "px";
          h.style.animationDelay = n * 0.12 + "s";
          document.body.appendChild(h);
          setTimeout(function () {
            h.remove();
          }, 1400);
        })(i);
      }
    }

    // --- micro-animation picker ---------------------------------------
    var microTable = ["scratchSelf", "look", "look"];
    function maybeMicro() {
      // ~ once every few seconds when calm
      if (micro == null && idle > 12 && Math.floor(Math.random() * 22) === 0) {
        micro = microTable[Math.floor(Math.random() * microTable.length)];
        microFrame = 0;
      }
    }

    // --- logic tick (throttled) ---------------------------------------
    function tick() {
      frame += 1;
      var dx = mx - x;
      var dy = my - y;
      var dist = Math.hypot(dx, dy);

      // Hysteresis: wake when cursor comes near, rest only when far.
      if (dist < WAKE) awake = true;
      else if (dist > SLEEP_RANGE) awake = false;

      // React (jump) is driven by the rAF animator; just hold a frame.
      if (state === "react") {
        setSprite("alert", 0);
        return;
      }

      // Startled by scroll → hold an alert pose briefly.
      if (startle > 0) {
        startle -= 1;
        setSprite("alert", 0);
        return;
      }

      // Eating a treat in progress.
      if (eating > 0) {
        eating -= 1;
        setSprite("scratchSelf", eating); // munch animation
        if (eating === 0 && treat) {
          treat.el.remove();
          treat = null;
          spawnHearts();
        }
        return;
      }

      // A treat is on the floor → run to it and eat.
      if (treat) {
        var tdx = treat.x - x,
          tdy = treat.y - y;
        var td = Math.hypot(tdx, tdy);
        if (td < SPEED * 1.6) {
          eating = 10;
        } else {
          idle = 0;
          micro = null;
          var tdir = "";
          tdir += tdy / td < -0.5 ? "N" : "";
          tdir += tdy / td > 0.5 ? "S" : "";
          tdir += tdx / td > 0.5 ? "E" : "";
          tdir += tdx / td < -0.5 ? "W" : "";
          setSprite(tdir || "S", frame);
          x += (tdx / td) * SPEED * 1.5;
          y += (tdy / td) * SPEED * 1.5;
          return;
        }
        return;
      }

      // Summoned (double-click page / press "c") → dash to that spot.
      if (summon) {
        var sdx = summon.x - x,
          sdy = summon.y - y;
        var sd = Math.hypot(sdx, sdy);
        if (sd < SPEED * 1.6) {
          summon = null;
          // arrive with a little hop
          if (!jump) {
            jump = { t: 0, dur: 380, offset: 0, prev: "idle" };
            state = "react";
          }
        } else {
          idle = 0;
          micro = null;
          var sdir = "";
          sdir += sdy / sd < -0.5 ? "N" : "";
          sdir += sdy / sd > 0.5 ? "S" : "";
          sdir += sdx / sd > 0.5 ? "E" : "";
          sdir += sdx / sd < -0.5 ? "W" : "";
          setSprite(sdir || "S", frame);
          var dash = SPEED * 1.7; // faster than normal follow
          x += (sdx / sd) * dash;
          y += (sdy / sd) * dash;
          return;
        }
      }

      // Follow when awake and beyond the dead zone.
      if (awake && dist > DEAD) {
        idle = 0;
        micro = null;
        state = "follow";
        // heading → 8-way sprite
        var dir = "";
        dir += dy / dist < -0.5 ? "N" : "";
        dir += dy / dist > 0.5 ? "S" : "";
        dir += dx / dist > 0.5 ? "E" : "";
        dir += dx / dist < -0.5 ? "W" : "";
        setSprite(dir || "S", frame);
        x += (dx / dist) * SPEED;
        y += (dy / dist) * SPEED;
        x = Math.min(Math.max(16, x), window.innerWidth - 16);
        y = Math.min(Math.max(16, y), window.innerHeight - 16);
        return;
      }

      // Otherwise idle → escalate to sit → sleep.
      idle += 1;
      state = idle > SLEEP_AFTER ? "sleep" : idle > SIT_AFTER ? "sit" : "idle";

      if (state === "sleep") {
        setSprite(idle % 8 < 4 ? "tired" : "sleeping", Math.floor(idle / 4));
        return;
      }
      if (state === "sit") {
        setSprite("tired", 0);
        return;
      }

      // Self-directed wander: while calm (not micro-animating), now and
      // then pick a nearby spot and stroll to it, so it never looks frozen.
      if (micro == null) {
        if (wander) {
          var wdx = wander.x - x,
            wdy = wander.y - y;
          var wd = Math.hypot(wdx, wdy);
          if (wd < SPEED) {
            wander = null;
            setSprite("idle", 0);
          } else {
            var wdir = "";
            wdir += wdy / wd < -0.5 ? "N" : "";
            wdir += wdy / wd > 0.5 ? "S" : "";
            wdir += wdx / wd > 0.5 ? "E" : "";
            wdir += wdx / wd < -0.5 ? "W" : "";
            setSprite(wdir || "S", frame);
            x += (wdx / wd) * SPEED * 0.42; // ambling pace
            y += (wdy / wd) * SPEED * 0.42;
            return;
          }
        } else if (idle > 60 && Math.floor(Math.random() * 320) === 0) {
          // Only wanders occasionally: after ~6s idle, low per-tick chance
          // (~once every 30s+ on average) so it mostly rests, then strolls.
          var ang = Math.random() * Math.PI * 2;
          var rad = 80 + Math.random() * 160;
          wander = {
            x: Math.min(Math.max(40, x + Math.cos(ang) * rad), window.innerWidth - 40),
            y: Math.min(Math.max(40, y + Math.sin(ang) * rad), window.innerHeight - 40),
          };
          return;
        }
      }

      // calm idle: occasional micro-animation
      maybeMicro();
      if (micro === "scratchSelf") {
        setSprite("scratchSelf", microFrame);
        if (++microFrame > 9) micro = null;
      } else if (micro === "look") {
        setSprite(microFrame % 2 ? "E" : "W", 0);
        if (++microFrame > 6) micro = null;
      } else {
        setSprite("idle", 0);
      }
    }

    // Compose the element transform: base scale × jump squash × spin.
    // The script fully owns `transform` so nothing clobbers the scale.
    function applyTransform(sx, sy, rot) {
      el.style.transform =
        "scale(" + (SCALE * sx).toFixed(3) + "," + (SCALE * sy).toFixed(3) + ")" + (rot ? " rotate(" + rot.toFixed(1) + "deg)" : "");
    }

    // --- rAF loop: throttle logic to TICK_MS, animate jump smoothly ----
    var last = 0;
    function loop(ts) {
      if (!el.isConnected) return;
      if (!last) last = ts;

      var sx = 1,
        sy = 1,
        rot = 0;

      // Jump arc (squash-and-stretch) on the display clock.
      if (jump) {
        jump.t += 16;
        var p = Math.min(1, jump.t / jump.dur);
        var arc = 4 * p * (1 - p); // 0→1→0 parabola
        jump.offset = -arc * 30;
        sy = 1 + arc * 0.16 - (p < 0.12 || p > 0.88 ? 0.18 : 0);
        sx = 1 - (sy - 1);
        setSprite("alert", 0);
        if (p >= 1) {
          jump = null;
          state = "idle";
          idle = 0;
        }
      }

      // Happy double-click spin.
      if (spin) {
        spin.t += 16;
        var sp = Math.min(1, spin.t / spin.dur);
        rot = 360 * sp;
        if (sp >= 1) spin = null;
      }

      applyTransform(sx, sy, rot);

      // Logic ticks pause while being dragged (the drag handler moves it).
      if (!dragging && ts - last > TICK_MS) {
        last = ts;
        tick();
      }
      place();
      requestAnimationFrame(loop);
    }
    place();
    setSprite("idle", 0);
    requestAnimationFrame(loop);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
