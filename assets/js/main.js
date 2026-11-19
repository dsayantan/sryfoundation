/* Sitaram Yechury Foundation — site scripts (no dependencies) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Hero slider
  var hero = document.querySelector(".hero");
  if (hero) {
    var slides = hero.querySelectorAll(".slide");
    var dotsBox = hero.querySelector(".hero-dots");
    var capEl = hero.querySelector(".hero-caption");
    var idx = 0, timer;
    var show = function (i) {
      slides[idx].classList.remove("active");
      if (dotsBox) dotsBox.children[idx].classList.remove("active");
      idx = (i + slides.length) % slides.length;
      slides[idx].classList.add("active");
      if (dotsBox) dotsBox.children[idx].classList.add("active");
      if (capEl) capEl.textContent = slides[idx].getAttribute("data-caption") || "";
    };
    if (dotsBox) {
      slides.forEach(function (s, i) {
        var b = document.createElement("button");
        b.setAttribute("aria-label", "Show slide " + (i + 1));
        b.addEventListener("click", function () { show(i); restart(); });
        dotsBox.appendChild(b);
      });
      dotsBox.children[0].classList.add("active");
    }
    if (capEl) capEl.textContent = slides[0].getAttribute("data-caption") || "";
    var restart = function () {
      clearInterval(timer);
      timer = setInterval(function () { show(idx + 1); }, 6500);
    };
    if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) restart();
  }

  // Event countdown
  var cd = document.querySelector("[data-countdown]");
  if (cd) {
    var target = new Date(cd.getAttribute("data-countdown")).getTime();
    var tick = function () {
      var diff = target - Date.now();
      if (diff <= 0) {
        cd.innerHTML = "<div><small>" + (diff > -10 * 3600 * 1000 ? "Happening today" : "Event concluded") + "</small></div>";
        return;
      }
      var d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60;
      cd.innerHTML = "<div><span>" + d + "</span><small>Days</small></div>" +
                     "<div><span>" + h + "</span><small>Hours</small></div>" +
                     "<div><span>" + m + "</span><small>Mins</small></div>";
    };
    tick(); setInterval(tick, 30000);
  }

  // Life page: highlight active chapter
  var chLinks = document.querySelectorAll(".chapter-nav a");
  if (chLinks.length && "IntersectionObserver" in window) {
    var map = {};
    chLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          chLinks.forEach(function (a) { a.classList.remove("active"); });
          map[e.target.id].classList.add("active");
          map[e.target.id].scrollIntoView({ block: "nearest", inline: "center" });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll(".chapter").forEach(function (c) { cio.observe(c); });
  }

  // Gallery + lightbox
  var grid = document.getElementById("gallery-grid");
  var photos = window.SRY_PHOTOS || [];
  var lb = document.querySelector(".lightbox");
  var current = [], pos = 0;

  var CATS = {
    all: "All", early: "Early Years & JNU", congress: "Party & Congresses", movements: "People's Struggles",
    parliament: "Parliament", international: "International Solidarity", bengal: "Bengal",
    culture: "Culture & Friends", portraits: "Portraits"
  };

  function openLB(list, i) {
    if (!lb) return;
    current = list; pos = i; renderLB();
    lb.classList.add("open"); document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  }
  function closeLB() { lb.classList.remove("open"); document.body.style.overflow = ""; }
  function renderLB() {
    var p = current[pos];
    var img = lb.querySelector("img");
    img.src = "assets/gallery/" + p.f; img.alt = p.cap;
    lb.querySelector("p").innerHTML = p.cap + "<small>" + (CATS[p.cat] || "") + " · " + (pos + 1) + " / " + current.length + "</small>";
  }
  if (lb) {
    lb.querySelector(".lb-close").addEventListener("click", closeLB);
    lb.querySelector(".lb-prev").addEventListener("click", function () { pos = (pos - 1 + current.length) % current.length; renderLB(); });
    lb.querySelector(".lb-next").addEventListener("click", function () { pos = (pos + 1) % current.length; renderLB(); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLB(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLB();
      if (e.key === "ArrowLeft") lb.querySelector(".lb-prev").click();
      if (e.key === "ArrowRight") lb.querySelector(".lb-next").click();
    });
  }

  if (grid && photos.length) {
    var filters = document.getElementById("gallery-filters");
    var render = function (cat) {
      var list = cat === "all" ? photos : photos.filter(function (p) { return p.cat === cat; });
      grid.innerHTML = "";
      list.forEach(function (p, i) {
        var fig = document.createElement("figure");
        fig.tabIndex = 0;
        fig.innerHTML = '<img loading="lazy" src="assets/thumbs/' + p.f + '" width="' + p.w + '" height="' + p.h + '" alt="">' +
                        "<figcaption></figcaption>";
        fig.querySelector("img").alt = p.cap;
        fig.querySelector("figcaption").textContent = p.cap;
        fig.addEventListener("click", function () { openLB(list, i); });
        fig.addEventListener("keydown", function (e) { if (e.key === "Enter") openLB(list, i); });
        grid.appendChild(fig);
      });
    };
    Object.keys(CATS).forEach(function (k) {
      if (k !== "all" && !photos.some(function (p) { return p.cat === k; })) return;
      var b = document.createElement("button");
      b.textContent = CATS[k]; b.dataset.cat = k;
      if (k === "all") b.classList.add("active");
      b.addEventListener("click", function () {
        filters.querySelectorAll("button").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active"); render(k);
        history.replaceState(null, "", k === "all" ? location.pathname : "#" + k);
      });
      filters.appendChild(b);
    });
    var start = location.hash.slice(1);
    if (CATS[start]) { filters.querySelector('[data-cat="' + start + '"]').click(); } else { render("all"); }
  }

  // Any element with data-lightbox opens the large image
  document.querySelectorAll("[data-lightbox]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (!lb) return;
      e.preventDefault();
      var f = a.getAttribute("data-lightbox");
      var p = photos.filter(function (x) { return x.f === f; })[0] || { f: f, cap: a.getAttribute("title") || "", cat: "" };
      openLB([p], 0);
    });
  });
})();
