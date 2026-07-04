module.exports = {
  content: ["_site/**/*.html", "_site/**/*.js"],
  css: ["_site/assets/css/*.css"],
  output: "_site/assets/css/",
  skippedContentGlobs: ["_site/assets/**/*.html"],
  // Keep styles that only appear when a feature is switched on, so
  // PurgeCSS doesn't drop them while the feature is dormant:
  //  - robot-viewer: the opt-in 3D hero (off until a .glb is added).
  //  - rm-cursor: the custom cursor element is injected by JS at runtime.
  //  - model-viewer: the web component's own shadow-DOM class hooks.
  //  - is-scrolled / heading-anchor / is-copied: toggled or injected by
  //    JS at runtime, so they never appear in the static HTML.
  safelist: {
    standard: [/^robot-viewer/, /^rm-cursor/, "is-scrolled", "heading-anchor", "is-copied", "bp-live", "hero-spotlight"],
    greedy: [/model-viewer/],
  },
};
