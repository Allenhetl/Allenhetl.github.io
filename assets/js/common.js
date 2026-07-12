$(document).ready(function () {
  // Keep publication details mutually exclusive and expose their state.
  $(".publication-toggle").click(function () {
    const entry = this.closest(".col-sm-8, .col-sm-10");
    const target = document.getElementById(this.getAttribute("aria-controls"));
    if (!entry || !target) return;

    const willOpen = !target.classList.contains("open");
    entry.querySelectorAll(".publication-detail.open").forEach(function (panel) {
      panel.classList.remove("open");
      panel.setAttribute("aria-hidden", "true");
    });
    entry.querySelectorAll('.publication-toggle[aria-expanded="true"]').forEach(function (button) {
      button.setAttribute("aria-expanded", "false");
    });

    target.classList.toggle("open", willOpen);
    target.setAttribute("aria-hidden", willOpen ? "false" : "true");
    this.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });
  $("a, button.publication-toggle").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    // remove related publications years from the TOC
    $(".publications h2").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
      offset: 100,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let jupyterTheme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (jupyterTheme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });

  // trigger popovers
  $('[data-toggle="popover"]').popover({
    trigger: "hover",
  });
});
