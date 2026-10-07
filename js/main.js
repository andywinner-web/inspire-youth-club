(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelectorAll(".nav-links a");
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Story tabs ---------- */
  var tabButtons = document.querySelectorAll(".tab-btn");
  var tabPanels = document.querySelectorAll(".tab-panel");
  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-tab");
      tabButtons.forEach(function (b) {
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      tabPanels.forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-tab") !== target;
      });
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var question = item.querySelector(".faq-question");
    question.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";
      document.querySelectorAll(".faq-item").forEach(function (other) {
        other.setAttribute("data-open", "false");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.setAttribute("data-open", "true");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var lightbox = document.querySelector(".lightbox");
  var lightboxContent = lightbox ? lightbox.querySelector(".lightbox-content") : null;
  var currentIndex = 0;
  var lastFocused = null;

  function renderLightbox(index) {
    var item = galleryItems[index];
    var type = item.getAttribute("data-type");
    var src = item.getAttribute("data-src");
    var alt = item.getAttribute("data-alt") || "";
    lightboxContent.innerHTML = "";
    var closeBtn = document.createElement("button");
    closeBtn.className = "lightbox-close";
    closeBtn.setAttribute("aria-label", "Schließen / Close");
    closeBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><use href="#icon-close"></use></svg>';
    closeBtn.addEventListener("click", closeLightbox);

    var prevBtn = document.createElement("button");
    prevBtn.className = "lightbox-nav lightbox-prev";
    prevBtn.setAttribute("aria-label", "Vorheriges Bild / Previous");
    prevBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><use href="#icon-chevron-left"></use></svg>';
    prevBtn.addEventListener("click", function () { show((currentIndex - 1 + galleryItems.length) % galleryItems.length); });

    var nextBtn = document.createElement("button");
    nextBtn.className = "lightbox-nav lightbox-next";
    nextBtn.setAttribute("aria-label", "Nächstes Bild / Next");
    nextBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><use href="#icon-chevron-right"></use></svg>';
    nextBtn.addEventListener("click", function () { show((currentIndex + 1) % galleryItems.length); });

    var media;
    if (type === "video") {
      media = document.createElement("video");
      media.src = src;
      media.controls = true;
      media.playsInline = true;
    } else {
      media = document.createElement("img");
      media.src = src;
      media.alt = alt;
    }

    lightboxContent.appendChild(closeBtn);
    lightboxContent.appendChild(prevBtn);
    lightboxContent.appendChild(nextBtn);
    lightboxContent.appendChild(media);
  }

  function show(index) {
    currentIndex = index;
    renderLightbox(index);
  }

  function openLightbox(index) {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    show(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox-close").focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightboxContent.innerHTML = "";
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener("click", function () { openLightbox(index); });
  });

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") show((currentIndex + 1) % galleryItems.length);
      if (e.key === "ArrowLeft") show((currentIndex - 1 + galleryItems.length) % galleryItems.length);
    });
  }

  /* ---------- Scroll reveal ---------- */
  /* Elements are visible by default (see .reveal in style.css). Only once
     we know JS is actually running do we opt them into the hidden-then-
     fade-in animated state, so a script failure never hides content. */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    revealEls.forEach(function (el) { el.classList.add("reveal-init"); });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Current year ---------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
