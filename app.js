/* Interacción de la web: pinta el contenido, filtros, diálogos y vídeos. */
(function () {
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = id => document.getElementById(id);
  const crea = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const AEROLAB = "https://drodridavid.github.io/aerolab/assets/video/promo/";
  const dominio = u => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/(home)?$/, "");
  const ETIQUETAS = { europa: "Europeo", espana: "Nacional", andalucia: "Andaluz", otros: "Otros" };

  const aparece = "IntersectionObserver" in window && !quieto
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); aparece.unobserve(e.target); } }), { threshold: 0.06, rootMargin: "0px 0px -5% 0px" })
    : null;
  const revela = e => { e.classList.add("rv"); if (aparece) aparece.observe(e); else e.classList.add("visible"); };

  function filtros(cont, opciones, alElegir) {
    const bs = opciones.map(([v, t], i) => {
      const b = crea("button", "filtro", t); b.type = "button"; b.setAttribute("aria-pressed", String(i === 0));
      b.addEventListener("click", () => { bs.forEach(x => x.setAttribute("aria-pressed", String(x === b))); alElegir(v); });
      cont.append(b); return b;
    });
  }

  /* Líneas */
  LINEAS.forEach(l => {
    const a = crea("article", "linea-compacta");
    const i = crea("img"); i.src = l.img; i.alt = ""; i.loading = "lazy";
    const t = crea("div"); t.append(crea("h3", "", l.t), crea("p", "", l.d));
    a.append(i, t); $("lista-lineas").append(a); revela(a);
  });

  /* Diálogo */
  const dlg = $("dialogo"), cuerpo = $("dialogo-cuerpo");
  function abreDialogo(pinta, clase) {
    cuerpo.replaceChildren(); dlg.className = "dialogo " + (clase || ""); pinta(cuerpo);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }
  const cierra = () => { const v = cuerpo.querySelector("video"); if (v) v.pause(); dlg.close(); };
  $("dialogo-cerrar").addEventListener("click", cierra);
  dlg.addEventListener("click", e => { if (e.target === dlg) cierra(); });
  dlg.addEventListener("close", () => { const v = cuerpo.querySelector("video"); if (v) v.pause(); });

  /* Muestra del equipamiento dentro de AeroLab */
  [["muestra-uav", ["matrice400", "m300", "mavic3m", "mavic3t"]], ["muestra-sensores", ["p1", "scoutultra", "rededgemx", "nanohyperspec"]]].forEach(([dest, ids]) => ids.forEach(id => {
    const e = EQUIPOS.find(x => x.id === id); if (!e) return;
    const a = crea("a", "muestra-item"); a.href = "https://drodridavid.github.io/aerolab/"; a.rel = "noopener";
    const i = crea("img"); i.src = e.img; i.alt = ""; i.loading = "lazy";
    a.append(i, crea("b", "", e.nombre.replace(/ \(.*\)$/, "")), crea("span", "", e.lema));
    $(dest).append(a);
  }));

  /* Vuelos */
  VUELOS.forEach(v => {
    const b = crea("button", "vuelo"); b.type = "button"; b.setAttribute("aria-label", "Ver vídeo: " + v.t);
    b.style.backgroundImage = `url(${AEROLAB}${v.f}.jpg)`;
    b.insertAdjacentHTML("beforeend", '<svg viewBox="0 0 48 48" width="56" height="56" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#8fd400"/><path d="M19 15l15 9-15 9z" fill="#0b3d24"/></svg>');
    b.append(crea("span", "", v.t));
    b.addEventListener("click", () => abreDialogo(c => {
      const video = crea("video"); video.src = `${AEROLAB}${v.f}.mp4`; video.controls = true; video.autoplay = true; video.playsInline = true; video.muted = true; video.poster = `${AEROLAB}${v.f}.jpg`;
      c.append(video, crea("p", "pie-video", v.t));
    }, "dialogo-video"));
    $("vuelos-lista").append(b);
  });

  /* Proyectos: filas con logotipo */
  const tarjetasPr = PROYECTOS.map(p => {
    const a = p.u ? crea("a", "fila-proyecto") : crea("article", "fila-proyecto");
    if (p.u) { a.href = p.u; a.rel = "noopener"; }
    const l = crea("div", "fp-logo");
    if (p.logo) { const i = crea("img"); i.src = p.logo; i.alt = "Logotipo de " + p.t; i.loading = "lazy"; l.append(i); }
    const t = crea("div", "fp-texto"); t.append(crea("h3", "", p.t)); if (p.d) t.append(crea("p", "", p.d));
    const m = crea("div", "fp-meta"); m.append(crea("span", "fp-tipo", ETIQUETAS[p.a]), crea("span", "", p.m)); if (p.u) m.append(crea("span", "pr-url", dominio(p.u)));
    a.append(l, t, m); $("lista-proyectos").append(a);
    return { a, p };
  });
  filtros($("filtros-proyectos"), AMBITOS, f => tarjetasPr.forEach(({ a, p }) => { a.hidden = f !== "todos" && p.a !== f; }));

  /* Publicaciones */
  const filasPub = PUBLICACIONES.map(p => {
    const li = crea("li"), a = crea("a"); a.href = "https://doi.org/" + p.doi; a.rel = "noopener";
    a.append(crea("span", "pub-ano", p.y), crea("b", "", p.t), crea("span", "pub-datos", `${p.a.replace(/\.$/, "")}. ${p.r}`));
    li.append(a); $("lista-publicaciones").append(li);
    return { li, p };
  });

  /* Mostrar solo parte de las publicaciones al principio */
  const VISIBLES = 8, masPubs = $("mas-pubs");
  filasPub.forEach(({ li }, i) => { li.hidden = i >= VISIBLES; });
  masPubs.addEventListener("click", () => { filasPub.forEach(({ li }) => { li.hidden = false; }); masPubs.parentElement.hidden = true; });

  /* Método y sellos */
  PASOS.forEach(p => {
    const li = crea("li", "paso");
    li.innerHTML = `<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${p.i}"/></svg>`;
    li.append(crea("h3", "", p.t), crea("p", "", p.d)); $("lista-pasos").append(li); revela(li);
  });
  SELLOS.forEach(([src, alt]) => { const i = crea("img"); i.src = src; i.alt = alt; i.loading = "lazy"; $("sellos").append(i); });

  /* Barra de progreso */
  const barra = $("progreso");
  const avance = () => { const h = document.documentElement; barra.style.transform = `scaleX(${h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)})`; };
  addEventListener("scroll", avance, { passive: true }); avance();

  /* Enlaces */
  ENLACES.forEach(e => {
    const a = crea("a", "enlace-tarjeta"); a.href = e.u; a.rel = "noopener";
    a.append(crea("b", "", e.n), crea("span", "eq-lema", e.d), crea("span", "pr-url", dominio(e.u)));
    $("lista-enlaces").append(a);
  });

  /* Personas */
  PERSONAS.forEach(p => {
    const partes = p.n.split(" ");
    const d = crea("div", "persona");
    const r = crea("span", "retrato");
    if (p.f) { const im = crea("img"); im.src = p.f; im.alt = ""; im.loading = "lazy"; r.append(im); }
    else { r.textContent = partes[0][0] + partes[partes.length - 2][0]; r.setAttribute("aria-hidden", "true"); }
    d.append(r, crea("b", "", p.n)); if (p.c) d.append(crea("span", "", p.c));
    $("lista-personas").append(d); revela(d);
  });

  /* Cifras */
  const valores = { lineas: LINEAS.length, proyectos: PROYECTOS.length, equipos: EQUIPOS.length, personas: PERSONAS.length };
  const cifras = [...document.querySelectorAll("[data-cifra]")];
  cifras.forEach(b => { b.textContent = valores[b.dataset.cifra]; });
  if (!quieto && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      (function paso(t) {
        const k = Math.min(1, (t - t0) / 900), e = 1 - Math.pow(1 - k, 3);
        cifras.forEach(b => { b.textContent = Math.round(valores[b.dataset.cifra] * e); });
        if (k < 1) requestAnimationFrame(paso);
      })(t0);
    }, { threshold: 0.4 });
    io.observe($("cifras"));
  }

  /* Vídeos: solo se reproducen mientras se ven */
  const vids = [...document.querySelectorAll("video[data-auto]")];
  vids.forEach(v => { v.muted = true; });
  if (!quieto && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { const p = e.target.play(); if (p) p.catch(() => {}); } else e.target.pause();
    }), { threshold: 0.2 });
    vids.forEach(v => io.observe(v));
  }

  /* Navegación */
  const nav = $("nav"), menu = $("nav-menu"), botonMenu = $("nav-boton");
  botonMenu.addEventListener("click", () => { const a = nav.classList.toggle("abierto"); botonMenu.setAttribute("aria-expanded", String(a)); });
  menu.addEventListener("click", e => { if (e.target.tagName === "A") { nav.classList.remove("abierto"); botonMenu.setAttribute("aria-expanded", "false"); } });
  const enlaces = [...menu.querySelectorAll('a[href^="#"]')];
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) enlaces.forEach(a => a.classList.toggle("activo", a.getAttribute("href") === "#" + e.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    enlaces.forEach(a => { const s = document.querySelector(a.getAttribute("href")); if (s) io.observe(s); });
  }

  document.querySelectorAll(".rv").forEach(e => { if (aparece) aparece.observe(e); else e.classList.add("visible"); });
})();
