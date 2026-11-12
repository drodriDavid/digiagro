/* Interacción de la web: pinta el contenido, filtros, diálogos y vídeos. */
(function () {
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = id => document.getElementById(id);
  const crea = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const dominio = u => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/(home)?$/, "");
  const ETIQUETAS = { europa: "Europeo", espana: "Nacional", andalucia: "Andaluz", otros: "Otros" };

  const aparece = "IntersectionObserver" in window && !quieto
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const t = e.target; t.classList.add("visible"); aparece.unobserve(t); setTimeout(() => { t.classList.remove("rv", "visible"); t.style.removeProperty("--rv"); }, 1400); } }), { threshold: 0.06, rootMargin: "0px 0px -5% 0px" })
    : null;
  /* i: posición dentro de su lista, para que los elementos entren uno tras otro */
  const revela = (e, i) => { e.classList.add("rv"); if (i) e.style.setProperty("--rv", (i % 6) * 80 + "ms"); if (aparece) aparece.observe(e); else e.classList.add("visible"); };


  /* Líneas */
  LINEAS.forEach(l => {
    const a = crea("article", "linea-compacta");
    const f = crea("figure", "lc-img"); const i = crea("img"); i.src = l.img; i.srcset = l.img.replace(/\.jpg$/, "-1600.jpg") + " 1600w, " + l.img + " 3840w"; i.sizes = "(max-width: 600px) 200vw, 1000px"; i.alt = ""; i.loading = "lazy"; f.append(i);
    const t = crea("div"); t.append(crea("h3", "", l.t), crea("p", "", l.d));
    a.append(f, t); $("lista-lineas").append(a); revela(a);
  });

  /* Muestra del equipamiento dentro de AeroLab */
  [["muestra-uav", ["matrice400", "m300", "mavic3m", "mavic3t"]], ["muestra-sensores", ["p1", "scoutultra", "rededgemx", "nanohyperspec"]]].forEach(([dest, ids]) => ids.forEach(id => {
    const e = EQUIPOS.find(x => x.id === id); if (!e) return;
    const a = crea("a", "muestra-item"); a.href = "aerolab/"; a.rel = "noopener";
    const i = crea("img"); i.src = e.img; i.alt = ""; i.loading = "lazy";
    a.append(i, crea("b", "", e.nombre.replace(/ \(.*\)$/, "")), crea("span", "", e.lema));
    $(dest).append(a); revela(a, $(dest).children.length - 1);
  }));

  /* Proyectos: filas con logotipo */
  PROYECTOS.forEach(p => {
    const a = crea("article", "fila-proyecto" + (p.v ? " con-video" : ""));
    const l = crea("div", "fp-logo");
    if (p.logo) { const i = crea("img"); i.src = p.logo; i.alt = "Logotipo de " + p.t; i.loading = "lazy"; l.append(i); }
    const t = crea("div", "fp-texto"), h = crea("h3");
    if (p.u) { const e = crea("a", "", p.t); e.href = p.u; e.rel = "noopener"; h.append(e); } else h.textContent = p.t;
    t.append(h); if (p.d) t.append(crea("p", "", p.d));
    const m = crea("div", "fp-meta"); m.append(crea("span", "fp-tipo", ETIQUETAS[p.a]), crea("span", "", p.m));
    if (p.u) { const e = crea("a", "pr-url", dominio(p.u)); e.href = p.u; e.rel = "noopener"; m.append(e); }
    t.append(m); a.append(l, t);
    if (p.v) {
      const f = crea("figure", "fp-video"), v = crea("video"); v.controls = true; v.playsInline = true; v.preload = "none"; v.poster = p.vp;
      const s = crea("source"); s.src = p.v; s.type = "video/mp4"; v.append(s); v.setAttribute("aria-label", "Vídeo de presentación de " + p.t); f.append(v); a.append(f);
    }
    $("lista-proyectos").append(a); revela(a);
  });

  /* Publicaciones */
  const filasPub = PUBLICACIONES.map(p => {
    const li = crea("li"), a = crea("a"); a.href = "https://doi.org/" + p.doi; a.rel = "noopener";
    a.append(crea("span", "pub-ano", p.y), crea("b", "", p.t), crea("span", "pub-datos", `${p.a.replace(/\.$/, "")}. ${p.r}`));
    li.append(a); $("lista-publicaciones").append(li); revela(li, $("lista-publicaciones").children.length - 1);
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
    li.append(crea("h3", "", p.t), crea("p", "", p.d)); $("lista-pasos").append(li); revela(li, $("lista-pasos").children.length - 1);
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
    $("lista-enlaces").append(a); revela(a, $("lista-enlaces").children.length - 1);
  });

  /* Personas */
  const ICONO_ORCID = '<svg viewBox="0 0 256 256" width="15" height="15" aria-hidden="true" focusable="false"><circle cx="128" cy="128" r="128" fill="#A6CE39"/><path fill="#fff" d="M86.3 186.2H70.9V79.1h15.4v107.1zM108.9 79.1h41.6c39.6 0 57 28.3 57 53.6 0 27.5-21.5 53.6-56.8 53.6h-41.8V79.1zm15.4 93.3h24.5c34.9 0 42.9-26.5 42.9-39.7 0-21.5-13.7-39.7-43.7-39.7h-23.7v79.4zM88.7 56.8c0 5.5-4.5 10.1-10.1 10.1s-10.1-4.6-10.1-10.1c0-5.6 4.5-10.1 10.1-10.1s10.1 4.6 10.1 10.1z"/></svg>';
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
    if (p.e) { const m = crea("a", "persona-correo", p.e); m.href = "mailto:" + p.e; tx.append(m); }
    if (p.o) {
      const o = crea("a", "persona-orcid"); o.href = "https://orcid.org/" + p.o; o.rel = "noopener";
      o.setAttribute("aria-label", "ORCID " + p.o);
      o.innerHTML = ICONO_ORCID + "<span>" + p.o + "</span>"; tx.append(o);
    }
    d.append(r, tx);
    const enFormacion = /doctorado|predoctoral/i.test(p.c || "");
    const lista = $(enFormacion ? "lista-doctorandos" : "lista-personas"); lista.append(d); revela(d, lista.children.length - 1);
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

  /* Logo animado: se dibuja en SVG una vez al verse (vale para todos los navegadores, también iPhone).
     Las piezas salen de assets/marca/logo-piezas.json; la animación es la de assets/marca/animacion/fuente/plantilla.html. */
  const logos = [...document.querySelectorAll("[data-logo-anim]")];
  if (!quieto && "IntersectionObserver" in window && window.fetch && logos.length) {
    let piezas = null;
    const NS = "http://www.w3.org/2000/svg";
    const nodo = (tag, at) => { const n = document.createElementNS(NS, tag); for (const k in at) n.setAttribute(k, at[k]); return n; };
    const cl = x => Math.max(0, Math.min(1, x)), seg = (t, a, b) => cl((t - a) / (b - a));
    const oc = x => 1 - Math.pow(1 - x, 3), oq = x => 1 - Math.pow(1 - x, 5), io3 = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const ob = x => { const c1 = 1.5, c3 = c1 + 1; return x <= 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
    let n = 0;
    const anima = caja => {
      const id = "lg" + (++n), el = {};
      const svg = nodo("svg", { viewBox: "42 58 4508 886", "aria-hidden": "true", focusable: "false",
        preserveAspectRatio: caja.classList.contains("up-logo") ? "xMinYMid meet" : "xMidYMid meet" });
      const defs = nodo("defs", {});
      const grad = nodo("linearGradient", { id: id + "b", x1: 0, x2: 1, y1: 0, y2: 0 });
      [[0, 0], [.5, .55], [1, 0]].forEach(([o, a]) => grad.append(nodo("stop", { offset: o, "stop-color": "#8fd400", "stop-opacity": a })));
      const rDsup = nodo("rect", { x: 40, y: 50, width: 0, height: 700 }), rHoja = nodo("rect", { x: 40, y: 480, width: 0, height: 460 });
      const cDsup = nodo("clipPath", { id: id + "d" }), cHoja = nodo("clipPath", { id: id + "h" }), cTodo = nodo("clipPath", { id: id + "t" });
      cDsup.append(rDsup); cHoja.append(rHoja); defs.append(grad, cDsup, cHoja, cTodo);
      const todo = nodo("g", {}), simbolo = nodo("g", {}), texto = nodo("g", {});
      piezas.forEach(p => {
        const e = nodo("path", { d: p.d, fill: "#fff", "fill-rule": "evenodd" });
        (p.n[0] === "l" ? texto : simbolo).append(e); el[p.n] = e; e.cx = (p.x0 + p.x1) / 2;
        cTodo.append(nodo("path", { d: p.d, "clip-rule": "evenodd" }));
      });
      el.dsup.setAttribute("clip-path", `url(#${id}d)`); el.hoja.setAttribute("clip-path", `url(#${id}h)`);
      const gb = nodo("g", { "clip-path": `url(#${id}t)` });
      const banda = nodo("rect", { x: -900, y: 0, width: 700, height: 1000, fill: `url(#${id}b)`, transform: "skewX(-20)" });
      gb.append(banda); todo.append(simbolo, texto, gb); svg.append(defs, todo);
      const pinta = t => {
        let k = oc(seg(t, .15, .95)); rDsup.setAttribute("width", 800 * k); el.dsup.style.opacity = cl(k * 3);
        k = oq(seg(t, .45, 1.15)); el.dbar.setAttribute("transform", `translate(${-260 * (1 - k)} 0)`); el.dbar.style.opacity = k;
        k = seg(t, .7, 1.45); const a = ob(k), cx = el.a.cx;
        el.a.setAttribute("transform", `translate(${cx} 917) scale(${.82 + .18 * a}) translate(${-cx} -917) translate(0 ${170 * (1 - a)})`); el.a.style.opacity = cl(k * 2.5);
        k = io3(seg(t, 1.15, 1.95)); rHoja.setAttribute("width", 900 * k); el.hoja.style.opacity = cl(k * 4);
        for (let i = 0; i < 8; i++) { const e = el["l" + i]; k = oq(seg(t, 1.75 + i * .085, 2.4 + i * .085)); e.setAttribute("transform", `translate(0 ${520 * (1 - k)})`); e.style.opacity = cl(k * 1.6); }
        k = io3(seg(t, 3.05, 3.95)); banda.setAttribute("x", -900 + 5800 * k);
        const z = .965 + .035 * oc(seg(t, 0, 4)); todo.setAttribute("transform", `translate(2296 501) scale(${z}) translate(-2296 -501)`);
      };
      pinta(0); caja.append(svg); caja.classList.add("animado");
      const t0 = performance.now();
      const paso = ahora => { const t = (ahora - t0) / 1000; pinta(Math.min(t, 4.1)); if (t < 4.1) requestAnimationFrame(paso); };
      requestAnimationFrame(paso);
    };
    const obs = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting || !piezas) return;
      obs.unobserve(e.target); anima(e.target);
    }), { threshold: 0.5 });
    fetch("assets/marca/logo-piezas.json").then(r => r.ok ? r.json() : null)
      .then(p => { if (p && p.length) { piezas = p; logos.forEach(l => obs.observe(l)); } }).catch(() => {});
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

  /* Idioma: español por defecto, inglés con el diccionario EN de i18n.js */
  if (typeof EN === "object") {
    const ORIG = new WeakMap(), ATRS = ["alt", "aria-label", "title"];
    const limpio = s => s.replace(/\s+/g, " ").trim();
    const meta = document.querySelector('meta[name="description"]'), tituloEs = document.title, metaEs = meta ? meta.content : "";
    const botonIdioma = $("idioma");
    const aplica = lang => {
      const en = lang === "en";
      document.documentElement.lang = lang;
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        if (n.parentElement.closest("#lista-publicaciones, script, style")) continue;
        const o = ORIG.has(n) ? ORIG.get(n) : n.nodeValue, t = EN[limpio(o)];
        if (!t) continue;
        ORIG.set(n, o);
        const m = o.match(/^(\s*)[\s\S]*?(\s*)$/);
        n.nodeValue = en ? m[1] + t + m[2] : o;
      }
      document.querySelectorAll("[alt], [aria-label], [title]").forEach(e => ATRS.forEach(a => {
        if (!e.hasAttribute(a) || e.closest("#lista-publicaciones")) return;
        const k = "es" + a.replace(/-/g, ""), o = e.dataset[k] ?? e.getAttribute(a), t = EN[limpio(o)];
        if (!t) return;
        e.dataset[k] = o; e.setAttribute(a, en ? t : o);
      }));
      document.title = en ? (EN[tituloEs] || tituloEs) : tituloEs;
      if (meta) meta.content = en ? (EN[metaEs] || metaEs) : metaEs;
      botonIdioma.textContent = en ? "ES" : "EN";
      botonIdioma.setAttribute("aria-label", en ? "Ver en español" : "View in English");
      botonIdioma.setAttribute("lang", en ? "es" : "en");
    };
    let guardado = null; try { guardado = localStorage.getItem("idioma"); } catch (e) {}
    const pedido = new URLSearchParams(location.search).get("lang");
    let actual = pedido === "en" || pedido === "es" ? pedido : guardado || ((navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en");
    aplica(actual);
    botonIdioma.addEventListener("click", () => {
      actual = actual === "en" ? "es" : "en"; aplica(actual);
      try { localStorage.setItem("idioma", actual); } catch (e) {}
    });
  }

  document.querySelectorAll(".rv").forEach(e => { if (aparece) aparece.observe(e); else e.classList.add("visible"); });
})();
