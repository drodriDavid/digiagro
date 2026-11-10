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

  /* Servicios */
  SERVICIOS.forEach(s => {
    const a = crea("article", "servicio");
    a.innerHTML = `<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${s.i}"/></svg>`;
    a.append(crea("h4", "", s.t), crea("p", "", s.d));
    $("servicios").append(a); revela(a);
  });

  /* Líneas: mosaicos de vídeo */
  LINEAS.forEach(l => {
    const a = crea("article", "linea"); a.tabIndex = 0;
    const v = crea("video"); v.muted = true; v.loop = true; v.playsInline = true; v.preload = "none"; v.dataset.auto = ""; v.poster = l.img.replace(".mp4", ".jpg"); v.src = l.img; v.setAttribute("aria-hidden", "true");
    const t = crea("div", "linea-texto"); t.append(crea("h3", "", l.t), crea("p", "", l.d));
    a.append(v, t); $("lista-lineas").append(a); revela(a);
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

  /* Plataformas y sensores */
  const tarjetaEquipo = e => {
    const b = crea("button", "equipo-tarjeta"); b.type = "button";
    const im = crea("img"); im.src = e.img; im.alt = ""; im.loading = "lazy";
    b.append(im, crea("b", "", e.nombre), crea("span", "eq-lema", e.lema));
    b.addEventListener("click", () => abreDialogo(c => {
      const g = crea("div", "ficha-eq");
      const i = crea("img"); i.src = e.img; i.alt = e.nombre;
      const t = crea("div");
      t.append(crea("h3", "", e.nombre), crea("p", "", e.texto));
      const dl = crea("dl");
      e.datos.forEach(([k, v]) => { dl.append(crea("dt", "", k), crea("dd", "", v)); });
      t.append(dl); g.append(i, t); c.append(g);
    }));
    return b;
  };
  EQUIPOS.filter(e => e.tipo === "drone").forEach(e => $("aeronaves").append(tarjetaEquipo(e)));
  const tarjetasSen = EQUIPOS.filter(e => e.tipo === "sensor").map(e => { const b = tarjetaEquipo(e); $("lista-sensores").append(b); return { b, e }; });
  filtros($("filtros-sensores"), [["todos", "Todos"], ["multiespectral", "Multiespectral"], ["térmica", "Térmico"], ["lidar", "LiDAR"], ["hiperespectral", "Hiperespectral"]], f => {
    tarjetasSen.forEach(({ b, e }) => { b.hidden = f !== "todos" && !(e.nombre + " " + e.lema + " " + e.rasgos.join(" ")).toLowerCase().includes(f); });
  });

  /* Software de trabajo */
  SOFTWARE.forEach(h => {
    const a = h.u ? crea("a", "herramienta") : crea("div", "herramienta");
    if (h.u) { a.href = h.u; a.rel = "noopener"; }
    a.append(crea("span", "pr-marco", h.c), crea("b", "", h.n), crea("span", "eq-lema", h.d));
    $("herramientas-lista").append(a);
  });

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

  /* Proyectos */
  const tarjetasPr = PROYECTOS.map(p => {
    const a = p.u ? crea("a", "proyecto") : crea("article", "proyecto");
    if (p.u) { a.href = p.u; a.rel = "noopener"; }
    a.append(crea("span", "etiqueta", ETIQUETAS[p.a]));
    if (p.img) { const i = crea("img"); i.src = p.img; i.alt = ""; i.loading = "lazy"; a.append(i); }
    const t = crea("div", "proyecto-texto");
    t.append(crea("h3", "", p.t));
    if (p.d) t.append(crea("p", "", p.d));
    t.append(crea("span", "pr-marco", p.m));
    if (p.u) t.append(crea("span", "pr-url", dominio(p.u)));
    a.append(t); $("lista-proyectos").append(a);
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
