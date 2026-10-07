/* Language toggle: every bilingual node is written twice in the HTML,
   each copy wrapped in an element with lang="de" or lang="en".
   This script shows the one matching the active language and hides the other. */
(function () {
  "use strict";

  var STORAGE_KEY = "iyc-lang";

  function getInitialLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "de" || saved === "en") return saved;
    } catch (e) {}
    return "en";
  }

  function applyLang(lang) {
    var nodes = document.querySelectorAll('[lang="de"], [lang="en"]');
    nodes.forEach(function (el) {
      el.hidden = el.getAttribute("lang") !== lang;
    });
    document.body.lang = lang;
    document.body.setAttribute("data-active-lang", lang);

    var buttons = document.querySelectorAll(".lang-toggle [data-lang-btn]");
    buttons.forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang-btn") === lang;
      btn.setAttribute("aria-current", isActive ? "true" : "false");
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(getInitialLang());

    document.querySelectorAll(".lang-toggle [data-lang-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang-btn"));
      });
    });
  });
})();
