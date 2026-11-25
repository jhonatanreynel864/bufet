/* =========================================================
   BUFET of Artists — interacciones
   ========================================================= */
(function () {
  "use strict";

  var INSTAGRAM = "https://www.instagram.com/buffetofartists?avpt=MWp3ZmQ1OGY1MWozcQ==";
  var WHATSAPP = "573105991355"; // línea principal: 310 5991355

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function waLink(text, number) {
    return "https://wa.me/" + (number || WHATSAPP) + "?text=" + encodeURIComponent(text);
  }

  var ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var ICON_IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"/></svg>';

  /* ---------- Año actual en el pie de página ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Sombra del header al hacer scroll ---------- */
  var header = $(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menú hamburguesa ---------- */
  var menu = $("#menu");
  var toggle = $(".menu-toggle");
  var lastFocus = null;

  function openMenu() {
    if (!menu) return;
    lastFocus = document.activeElement;
    document.body.classList.add("menu-open", "no-scroll");
    menu.setAttribute("aria-hidden", "false");
    toggle && toggle.setAttribute("aria-expanded", "true");
    setTimeout(function () { var c = $(".menu-close", menu); c && c.focus(); }, 60);
  }
  function closeMenu() {
    if (!menu || !document.body.classList.contains("menu-open")) return;
    document.body.classList.remove("menu-open", "no-scroll");
    menu.setAttribute("aria-hidden", "true");
    toggle && toggle.setAttribute("aria-expanded", "false");
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  toggle && toggle.addEventListener("click", openMenu);
  menu && $$(".menu-close", menu).forEach(function (b) { b.addEventListener("click", closeMenu); });
  menu && $$("a", menu).forEach(function (a) { a.addEventListener("click", closeMenu); });

  /* ---------- Ventana de detalle (modal) ---------- */
  var modal, modalLast;
  function buildModal() {
    modal = document.createElement("div");
    modal.className = "modal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="modal-backdrop" data-close></div>' +
      '<div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
        '<button class="modal-close" type="button" data-close aria-label="Cerrar">' + ICON_CLOSE + '</button>' +
        '<div class="modal-media"><img alt="" id="modal-img"></div>' +
        '<div class="modal-body">' +
          '<span class="modal-tag" id="modal-tag"></span>' +
          '<h2 id="modal-title"></h2>' +
          '<p class="modal-sub" id="modal-sub"></p>' +
          '<p class="modal-desc" id="modal-desc"></p>' +
          '<div class="modal-actions">' +
            '<a class="btn btn-dark" id="modal-wa" target="_blank" rel="noopener noreferrer"></a>' +
            '<a class="btn btn-outline-dark" href="' + INSTAGRAM + '" target="_blank" rel="noopener noreferrer">' + ICON_IG.replace('aria-hidden="true"', 'aria-hidden="true" style="width:20px;height:20px"') + ' Instagram</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    $$("[data-close]", modal).forEach(function (el) { el.addEventListener("click", closeModal); });
  }

  function openModal(data) {
    if (!modal) buildModal();
    modalLast = document.activeElement;
    var img = $("#modal-img", modal);
    img.src = data.img || "";
    img.alt = data.title || "";
    $("#modal-tag", modal).textContent = data.tag || "";
    $("#modal-tag", modal).hidden = !data.tag;
    $("#modal-title", modal).textContent = data.title || "";
    $("#modal-sub", modal).textContent = data.subtitle || "";
    $("#modal-sub", modal).hidden = !data.subtitle;
    $("#modal-desc", modal).textContent = data.desc || "";
    var wa = $("#modal-wa", modal);
    var cta = data.cta || "Más información";
    var msg = data.wa || ("Hola BUFET of Artists, quiero más información sobre: " + data.title + (data.subtitle ? " (" + data.subtitle + ")" : ""));
    wa.innerHTML = cta + " " + ICON_ARROW;
    wa.href = waLink(msg);
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    setTimeout(function () { $(".modal-close", modal).focus(); }, 40);
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    if (!document.body.classList.contains("menu-open")) document.body.classList.remove("no-scroll");
    modalLast && modalLast.focus && modalLast.focus();
  }

  // Cualquier elemento con data-modal abre la ventana con sus datos
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-modal]");
    if (!trigger) return;
    e.preventDefault();
    var d = trigger.dataset;
    openModal({
      title: d.title, subtitle: d.subtitle, desc: d.desc, tag: d.tag,
      img: d.img || ((trigger.querySelector("img") || {}).currentSrc || ""),
      cta: d.cta, wa: d.wa
    });
  });

  // Tecla Escape y trampa de foco básica
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeModal(); closeMenu(); return; }
    if (e.key !== "Tab") return;
    var scope = (modal && !modal.hidden) ? modal : (document.body.classList.contains("menu-open") ? menu : null);
    if (!scope) return;
    var f = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', scope)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- Filtros (pestañas y botones tipo píldora) ---------- */
  $$("[data-filter-group]").forEach(function (group) {
    var target = document.getElementById(group.getAttribute("data-filter-group"));
    if (!target) return;
    var buttons = $$("[data-filter]", group);
    var items = $$("[data-cat]", target);
    var empty = document.getElementById(group.getAttribute("data-empty") || "");
    var pageSize = parseInt(target.getAttribute("data-page-size") || "0", 10);
    var moreBtn = document.getElementById(target.getAttribute("data-more") || "");
    var expanded = false;
    var current = "todos";

    function apply(animate) {
      var matches = items.filter(function (it) {
        return current === "todos" || (" " + it.getAttribute("data-cat") + " ").indexOf(" " + current + " ") > -1;
      });
      items.forEach(function (it) { it.hidden = true; it.classList.remove("is-entering"); });
      matches.forEach(function (it, i) {
        var show = !pageSize || expanded || i < pageSize;
        it.hidden = !show;
        if (show && animate) {
          it.style.animationDelay = (Math.min(i, 8) * 60) + "ms";
          void it.offsetWidth;
          it.classList.add("is-entering");
        }
      });
      if (empty) empty.hidden = matches.length > 0;
      if (moreBtn) {
        var hasMore = pageSize && matches.length > pageSize;
        moreBtn.parentElement.hidden = !hasMore;
        moreBtn.querySelector("[data-label]").textContent = expanded ? "Ver menos" : "Ver más";
        moreBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
      }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
        current = btn.getAttribute("data-filter");
        expanded = false;
        apply(true);
      });
    });

    if (moreBtn) {
      moreBtn.addEventListener("click", function () {
        expanded = !expanded;
        apply(expanded);
        if (!expanded) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    // Permite abrir un filtro desde la URL, ej: artistas.html#musica
    var hash = (location.hash || "").replace("#", "");
    var fromHash = hash && buttons.filter(function (b) { return b.getAttribute("data-filter") === hash; })[0];
    if (fromHash) fromHash.click(); else apply(false);
  });

  /* ---------- Eventos: marcar eventos finalizados ---------- */
  var today = new Date(); today.setHours(0, 0, 0, 0);
  $$("[data-date]").forEach(function (el) {
    var parts = el.getAttribute("data-date").split("-");
    var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    if (d < today) {
      el.classList.add("is-past");
      var media = el.querySelector(".ev-media");
      if (media && !media.querySelector(".ev-badge")) {
        var b = document.createElement("span");
        b.className = "ev-badge"; b.textContent = "Finalizado";
        media.appendChild(b);
      }
    }
  });

  /* ---------- Formulario de contacto → WhatsApp ---------- */
  var form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var name = form.nombre.value.trim();
      var interest = form.interes.value;
      var message = form.mensaje.value.trim();
      var text = "Hola BUFET of Artists, soy " + name + ".\n" +
        "Me interesa: " + interest + ".\n\n" + message;
      window.open(waLink(text), "_blank", "noopener");
    });
  }

  /* ---------- Animación al aparecer ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
