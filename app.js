/* Interacción de la web: pinta el contenido, filtros, diálogos y vídeos. */
(function () {
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = id => document.getElementById(id);
  const crea = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const dominio = u => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/(home)?$/, "");
  const ETIQUETAS = { europa: "Europeo", espana: "Nacional", andalucia: "Andaluz", otros: "Otros" };

  const aparece = "IntersectionObserver" in window && !quieto
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); aparece.unobserve(e.target); } }), { threshold: 0.06, rootMargin: "0px 0px -5% 0px" })
    : null;
  const revela = e => { e.classList.add("rv"); if (aparece) aparece.observe(e); else e.classList.add("visible"); };


  /* Líneas */
  LINEAS.forEach(l => {
    const a = crea("article", "linea-compacta");
    const i = crea("img"); i.src = l.img; i.alt = ""; i.loading = "lazy";
    const t = crea("div"); t.append(crea("h3", "", l.t), crea("p", "", l.d));
    a.append(i, t); $("lista-lineas").append(a); revela(a);
  });

  /* Muestra del equipamiento dentro de AeroLab */
  [["muestra-uav", ["matrice400", "m300", "mavic3m", "mavic3t"]], ["muestra-sensores", ["p1", "scoutultra", "rededgemx", "nanohyperspec"]]].forEach(([dest, ids]) => ids.forEach(id => {
    const e = EQUIPOS.find(x => x.id === id); if (!e) return;
    const a = crea("a", "muestra-item"); a.href = "https://drodridavid.github.io/aerolab/"; a.rel = "noopener";
    const i = crea("img"); i.src = e.img; i.alt = ""; i.loading = "lazy";
    a.append(i, crea("b", "", e.nombre.replace(/ \(.*\)$/, "")), crea("span", "", e.lema));
    $(dest).append(a);
  }));

  /* Proyectos: filas con logotipo */
  PROYECTOS.forEach(p => {
    const a = p.u ? crea("a", "fila-proyecto") : crea("article", "fila-proyecto");
    if (p.u) { a.href = p.u; a.rel = "noopener"; }
    const l = crea("div", "fp-logo");
    if (p.logo) { const i = crea("img"); i.src = p.logo; i.alt = "Logotipo de " + p.t; i.loading = "lazy"; l.append(i); }
    const t = crea("div", "fp-texto"); t.append(crea("h3", "", p.t)); if (p.d) t.append(crea("p", "", p.d));
    const m = crea("div", "fp-meta"); m.append(crea("span", "fp-tipo", ETIQUETAS[p.a]), crea("span", "", p.m)); if (p.u) m.append(crea("span", "pr-url", dominio(p.u)));
    a.append(l, t, m); $("lista-proyectos").append(a);
  });

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
    const a = crea("a", "enlace-logo"); a.href = e.u; a.rel = "noopener"; a.setAttribute("aria-label", e.n);
    const i = crea("img"); i.src = e.l; i.alt = ""; i.loading = "lazy";
    a.append(i, crea("span", "pr-url", dominio(e.u)));
    $("lista-enlaces").append(a);
  });

  /* Personas */
  PERSONAS.forEach(p => {
    const partes = p.n.split(" ");
    const d = crea("div", "persona");
    const r = crea("span", "retrato");
    if (p.f) { const im = crea("img"); im.src = p.f; im.alt = ""; im.loading = "lazy"; r.append(im); }
    else { r.textContent = partes[0][0] + partes[partes.length - 2][0]; r.setAttribute("aria-hidden", "true"); }
    const tx = crea("div", "persona-texto");
    tx.append(crea("b", "", p.n));
    if (p.c) tx.append(crea("span", "persona-cargo", p.c));
    if (p.a) tx.append(crea("em", "persona-area", p.a));
    d.append(r, tx);
    const enFormacion = /doctorado|predoctoral/i.test(p.c || "");
    $(enFormacion ? "lista-doctorandos" : "lista-personas").append(d); revela(d);
  });

  /* Cifras */
  const valores = { lineas: LINEAS.length, publicaciones: PUBLICACIONES.length, equipos: EQUIPOS.length, personas: PERSONAS.length };
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
