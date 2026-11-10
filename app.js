/* Interacción de la web: pinta el contenido, filtros, acordeón, diálogos y animaciones al desplazarse. */
(function () {
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = id => document.getElementById(id);
  const crea = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const AEROLAB = "https://drodridavid.github.io/aerolab/assets/video/promo/";

  /* Aparición al desplazarse */
  const aparece = "IntersectionObserver" in window && !quieto
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); aparece.unobserve(e.target); } }), { threshold: 0.08, rootMargin: "0px 0px -6% 0px" })
    : null;
  const revela = e => { e.classList.add("rv"); if (aparece) aparece.observe(e); else e.classList.add("visible"); };

  /* Servicios */
  SERVICIOS.forEach(s => {
    const a = crea("article", "servicio");
    a.innerHTML = `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${s.i}"/></svg>`;
    a.append(crea("h4", "", s.t), crea("p", "", s.d));
    $("servicios").append(a); revela(a);
  });

  /* Acordeón de líneas: la imagen acompaña a la línea abierta */
  const imagen = $("linea-img");
  const filas = LINEAS.map((l, i) => {
    const f = crea("div", "fila");
    const b = crea("button", "fila-boton");
    b.type = "button"; b.id = "lb" + i; b.setAttribute("aria-controls", "lp" + i);
    b.append(crea("span", "", l.t));
    b.insertAdjacentHTML("beforeend", '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 10.5l4 4 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    const p = crea("div", "fila-panel"); p.id = "lp" + i; p.setAttribute("role", "region"); p.setAttribute("aria-labelledby", b.id);
    const interior = crea("div"); interior.append(crea("p", "", l.d)); p.append(interior);
    b.addEventListener("click", () => abre(i));
    f.append(b, p); $("acordeon").append(f);
    return { f, b };
  });
  function abre(i) {
    filas.forEach((x, j) => { x.f.classList.toggle("abierta", j === i); x.b.setAttribute("aria-expanded", String(j === i)); });
    if (imagen.getAttribute("src") !== LINEAS[i].img) {
      imagen.classList.add("cambia");
      setTimeout(() => { imagen.src = LINEAS[i].img; imagen.classList.remove("cambia"); }, quieto ? 0 : 200);
    }
  }
  abre(0);

  /* Filtros genéricos con estado accesible */
  function filtros(cont, opciones, alElegir) {
    const bs = opciones.map(([v, t], i) => {
      const b = crea("button", "filtro", t); b.type = "button"; b.setAttribute("aria-pressed", String(i === 0));
      b.addEventListener("click", () => { bs.forEach(x => x.setAttribute("aria-pressed", String(x === b))); alElegir(v); });
      cont.append(b); return b;
    });
  }

  /* Flota */
  const dlg = $("dialogo"), cuerpo = $("dialogo-cuerpo");
  function abreDialogo(pinta, clase) {
    cuerpo.replaceChildren(); dlg.className = "dialogo " + (clase || ""); pinta(cuerpo);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }
  const cierra = () => { const v = cuerpo.querySelector("video"); if (v) v.pause(); dlg.close(); };
  $("dialogo-cerrar").addEventListener("click", cierra);
  dlg.addEventListener("click", e => { if (e.target === dlg) cierra(); });
  dlg.addEventListener("close", () => { const v = cuerpo.querySelector("video"); if (v) v.pause(); });

  const tarjetasEq = EQUIPOS.map(e => {
    const b = crea("button", "equipo-tarjeta"); b.type = "button";
    const im = crea("img"); im.src = e.img; im.alt = ""; im.loading = "lazy";
    b.append(im, crea("span", "eq-tipo", e.tipo === "drone" ? "Aeronave" : "Sensor"), crea("b", "", e.nombre), crea("span", "eq-lema", e.lema));
    b.addEventListener("click", () => abreDialogo(c => {
      const g = crea("div", "ficha-eq");
      const i = crea("img"); i.src = e.img; i.alt = e.nombre;
      const t = crea("div");
      t.append(crea("h3", "", e.nombre), crea("p", "", e.texto));
      const dl = crea("dl");
      e.datos.forEach(([k, v]) => { dl.append(crea("dt", "", k), crea("dd", "", v)); });
      t.append(dl); g.append(i, t); c.append(g);
    }));
    $("equipos").append(b);
    return { b, e };
  });
  const cumple = (e, f) => {
    if (f === "todos") return true;
    if (f === "drone" || f === "sensor") return e.tipo === f;
    return (e.nombre + " " + e.lema + " " + e.rasgos.join(" ")).toLowerCase().includes(f);
  };
  filtros($("filtros-equipos"), [["todos", "Todo"], ["drone", "Aeronaves"], ["sensor", "Sensores"], ["multiespectral", "Multiespectral"], ["térmica", "Térmica"], ["lidar", "LiDAR"], ["hiperespectral", "Hiperespectral"]], f => {
    tarjetasEq.forEach(({ b, e }) => { b.hidden = !cumple(e, f); });
  });

  /* Vídeos de vuelo */
  VUELOS.forEach(v => {
    const b = crea("button", "vuelo"); b.type = "button"; b.setAttribute("aria-label", "Ver vídeo: " + v.t);
    b.style.backgroundImage = `url(${AEROLAB}${v.f}.jpg)`;
    b.insertAdjacentHTML("beforeend", '<svg viewBox="0 0 48 48" width="52" height="52" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#a8e600"/><path d="M19 15l15 9-15 9z" fill="#0d2b24"/></svg>');
    b.append(crea("span", "", v.t));
    b.addEventListener("click", () => abreDialogo(c => {
      const video = crea("video"); video.src = `${AEROLAB}${v.f}.mp4`; video.controls = true; video.autoplay = true; video.playsInline = true; video.muted = true; video.poster = `${AEROLAB}${v.f}.jpg`;
      c.append(video, crea("p", "pie-video", v.t));
    }, "dialogo-video"));
    $("vuelos").append(b);
  });

  /* Proyectos */
  const tarjetasPr = PROYECTOS.map(p => {
    const a = p.u ? crea("a", "proyecto") : crea("article", "proyecto");
    if (p.u) { a.href = p.u; a.rel = "noopener"; }
    a.append(crea("span", "pr-marco", p.m), crea("h3", "", p.t), crea("p", "", p.d));
    if (p.u) a.append(crea("span", "enlace", "Web del proyecto"));
    $("lista-proyectos").append(a); revela(a);
    return { a, p };
  });
  filtros($("filtros-proyectos"), AMBITOS, f => tarjetasPr.forEach(({ a, p }) => { a.hidden = f !== "todos" && p.a !== f; }));

  /* Publicaciones */
  PUBLICACIONES.forEach(p => {
    const li = crea("li"), a = crea("a"); a.href = "https://doi.org/" + p.doi; a.rel = "noopener";
    a.append(crea("span", "pub-ano", p.y), crea("b", "", p.t), crea("span", "pub-datos", `${p.a} ${p.r}`));
    li.append(a); $("lista-publicaciones").append(li);
  });

  /* Personas */
  PERSONAS.forEach(p => {
    const partes = p.n.split(" ");
    const iniciales = partes[0][0] + partes[partes.length - 2][0];
    const d = crea("div", "persona" + (p.d ? " destacada" : ""));
    const av = crea("span", "avatar", iniciales); av.setAttribute("aria-hidden", "true");
    const t = crea("div"); t.append(crea("b", "", p.n)); if (p.c) t.append(crea("span", "", p.c));
    d.append(av, t); $("lista-personas").append(d); revela(d);
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
  const heroV = $("hero-video");
  const vids = [heroV, ...document.querySelectorAll("video[data-auto]")];
  if (quieto) vids.forEach(v => v.removeAttribute("autoplay"));
  else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const p = e.target.play(); if (p) p.catch(() => {}); } else e.target.pause(); }), { threshold: 0.25 });
    vids.forEach(v => io.observe(v));
  }

  /* Navegación: se vuelve sólida al salir de la portada y marca la sección actual */
  const nav = $("nav"), menu = $("nav-menu"), botonMenu = $("nav-boton");
  const alDesplazar = () => nav.classList.toggle("solida", scrollY > innerHeight * 0.6);
  addEventListener("scroll", alDesplazar, { passive: true }); alDesplazar();
  botonMenu.addEventListener("click", () => {
    const a = nav.classList.toggle("abierto"); botonMenu.setAttribute("aria-expanded", String(a));
  });
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
