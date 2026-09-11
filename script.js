/* Vitória Santos — interações discretas + motion no scroll (nicho de saúde) */
(function () {
  "use strict";
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fino = window.matchMedia("(hover: none)").matches;

  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* Reveal suave no scroll */
  var alvos = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduz) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    alvos.forEach(function (a) { io.observe(a); });
  } else {
    alvos.forEach(function (a) { a.classList.add("in"); });
  }

  /* Header: borda ao rolar */
  var cab = document.querySelector(".cab");
  if (cab) {
    var onScrollCab = function () { cab.classList.toggle("rolou", window.scrollY > 6); };
    window.addEventListener("scroll", onScrollCab, { passive: true });
    onScrollCab();
  }

  /* Parallax discreto no retrato do hero (só desktop, com ponteiro fino) */
  var foto = document.querySelector(".hero__foto");
  if (foto && !reduz && !fino && window.innerWidth > 940) {
    var ticking = false;
    var aplica = function () {
      var y = window.scrollY;
      if (y < 700) foto.style.transform = "translateY(" + (y * 0.06) + "px)";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(aplica); ticking = true; }
    }, { passive: true });
  }

  /* Analytics — preparado (sem rede). Empilha eventos em window.dataLayer para
     GA4/GTM lerem quando/se forem ativados. Sem script externo, não coleta nada sozinho. */
  window.dataLayer = window.dataLayer || [];
  document.querySelectorAll("[data-cta]").forEach(function (el) {
    el.addEventListener("click", function () {
      window.dataLayer.push({ event: "cta_click", cta_local: el.getAttribute("data-cta"), destino: "whatsapp" });
    });
  });

  /* Menu mobile */
  var menuBtn = document.getElementById("menuBtn");
  var menu = document.getElementById("menu");
  if (menuBtn && menu) {
    var fecha = function () { menu.classList.remove("aberto"); menuBtn.setAttribute("aria-expanded", "false"); };
    menuBtn.addEventListener("click", function () {
      var aberto = menu.classList.toggle("aberto");
      menuBtn.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", fecha); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") fecha(); });
  }
})();
