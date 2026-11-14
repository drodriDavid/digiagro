/* Noticias de la unidad. Se publican desde el panel de Publicaciones de SAVIA (destino «Web DIGIAGRO»), que deja
   noticias.json e imágenes en savia.ujaen.es/cuadernos/noticias-digiagro/. Así salen al momento, sin tocar este repo.
   Portada (#actualidad): filtros por proyecto, una destacada y una lista compacta; «Ver más» añade de cinco en cinco y
   cada noticia se lee en una ventana con anterior/siguiente (flechas del teclado y deslizar en el móvil).
   noticias.html: todas, completas, con los mismos filtros. Sin noticias, la sección de la portada no aparece. */
(function () {
  const BASE = "https://savia.ujaen.es/cuadernos/noticias-digiagro/";
  const PROYECTO = { digiagro: "DIGIAGRO", soildataspace: "Soil Data Space", livingsoill: "LivingSoiLL" };
  const PASO = 5;
  const $ = id => document.getElementById(id);
  const crea = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const portada = $("lista-noticias"), todas = $("todas-noticias");
  if (!portada && !todas) return;

  const en = () => document.documentElement.lang === "en";
  const fecha = (iso, corta) => { const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString(en() ? "en-GB" : "es-ES", corta ? { day: "numeric", month: "short", year: "numeric" } : { day: "numeric", month: "long", year: "numeric" }); };
  const resumen = t => { const p = t.split(/\n\s*\n/)[0].replace(/\s+/g, " ").trim(); return p.length > 200 ? p.slice(0, 190).replace(/\s+\S*$/, "") + "…" : p; };
  const etiqueta = n => PROYECTO[n.proyecto] || "";

  /* Texto con saltos de línea y enlaces, sin innerHTML */
  const parrafos = (dest, t) => t.split(/\n\s*\n/).forEach(bloque => {
    const p = crea("p");
    bloque.split("\n").forEach((linea, i) => {
      if (i) p.append(crea("br"));
      linea.split(/(https?:\/\/[^\s)]+)/).forEach((trozo, j) => {
        if (j % 2) { const a = crea("a", "", trozo.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")); a.href = trozo; a.rel = "noopener"; a.target = "_blank"; p.append(a); }
        else if (trozo) p.append(trozo);
      });
    });
    dest.append(p);
  });
  const imagen = (n, cls, perezosa = true) => {
    if (!n.imagen) return null;
    const f = crea("figure", cls), i = crea("img"); i.src = BASE + n.imagen; i.alt = ""; if (perezosa) i.loading = "lazy"; f.append(i); return f;
  };
  const meta = n => {
    const m = crea("div", "nt-meta"), t = crea("time", "nt-fecha", fecha(n.fecha, true)); t.dateTime = n.fecha; m.append(t);
    if (etiqueta(n)) m.append(crea("span", "nt-etiqueta nt-" + n.proyecto, etiqueta(n)));
    return m;
  };
  const enlaces = n => {
    const enl = crea("p", "nc-enlaces");
    if (n.enlace) { const e = crea("a", "boton boton-claro", "Más información"); e.href = n.enlace; e.rel = "noopener"; e.target = "_blank"; enl.append(e); }
    if (n.linkedin) { const e = crea("a", "boton boton-claro", "Ver en LinkedIn"); e.href = n.linkedin; e.rel = "noopener"; e.target = "_blank"; enl.append(e); }
    return enl.children.length ? enl : null;
  };

  /* Filtros por proyecto: solo si hay noticias de más de uno */
  const filtros = (dest, ns, alCambiar) => {
    if (!dest) return;
    const hay = [...new Set(ns.map(n => n.proyecto).filter(p => PROYECTO[p]))];
    if (hay.length < 2) { dest.hidden = true; return; }
    const boton = (valor, txt) => {
      const b = crea("button", "nt-filtro", txt); b.type = "button"; b.setAttribute("aria-pressed", valor === "" ? "true" : "false");
      b.onclick = () => { dest.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false")); alCambiar(valor); };
      dest.append(b);
    };
    boton("", "Todas");
    Object.keys(PROYECTO).filter(p => hay.includes(p)).forEach(p => boton(p, PROYECTO[p]));
    dest.hidden = false;
  };

  /* Ventana de lectura con anterior y siguiente */
  let dlg = null, lista = [], pos = 0;
  const ventana = () => {
    if (dlg) return dlg;
    dlg = crea("dialog", "nt-dialogo"); dlg.setAttribute("aria-label", "Noticia");
    const cerrar = crea("button", "nt-cerrar"); cerrar.type = "button"; cerrar.setAttribute("aria-label", "Cerrar"); cerrar.textContent = "×"; cerrar.onclick = () => dlg.close();
    const cuerpo = crea("div", "nt-cuerpo");
    const pie = crea("div", "nt-pie");
    const ant = crea("button", "nt-nav", "Anterior"), sig = crea("button", "nt-nav", "Siguiente"), cont = crea("span", "nt-contador");
    ant.type = sig.type = "button"; ant.onclick = () => abre(pos - 1); sig.onclick = () => abre(pos + 1);
    pie.append(ant, cont, sig);
    dlg.append(cerrar, cuerpo, pie);
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", e => { if (e.key === "ArrowLeft") abre(pos - 1); if (e.key === "ArrowRight") abre(pos + 1); });
    let x0 = null;
    dlg.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 70) abre(pos + (dx < 0 ? 1 : -1)); });
    dlg.addEventListener("close", () => { document.documentElement.classList.remove("nt-abierta"); });
    document.body.append(dlg);
    return dlg;
  };
  const abre = i => {
    if (i < 0 || i >= lista.length) return;
    pos = i; const n = lista[i], d = ventana(), c = d.querySelector(".nt-cuerpo");
    c.replaceChildren();
    const img = imagen(n, "nt-dlg-img", false); if (img) c.append(img);
    const t = crea("div", "nt-dlg-texto");
    t.append(meta(n), crea("h2", "", n.titulo)); parrafos(t, n.texto);
    const e = enlaces(n); if (e) t.append(e);
    c.append(t); c.scrollTop = 0;
    const [ant, cont, sig] = d.querySelector(".nt-pie").children;
    ant.disabled = i === 0; sig.disabled = i === lista.length - 1; cont.textContent = (i + 1) + " / " + lista.length;
    if (!d.open) { d.showModal(); document.documentElement.classList.add("nt-abierta"); }
    d.querySelector(".nt-cerrar").focus();
  };

  /* Elemento de la portada: la tarjeta entera abre la ventana (el enlace lleva a noticias.html si no hay JS) */
  const elemento = (n, i, destacada) => {
    const a = crea("a", "nt" + (destacada ? " nt-dest" : "") + (n.imagen ? "" : " sin-img")); a.href = "noticias.html#" + n.id;
    a.onclick = e => { if (e.ctrlKey || e.metaKey || e.shiftKey) return; e.preventDefault(); abre(i); };
    const img = imagen(n, "nt-img"); if (img) a.append(img);
    const t = crea("div", "nt-texto");
    t.append(meta(n), crea("h3", "", n.titulo));
    if (destacada) t.append(crea("p", "nt-resumen", resumen(n.texto)));
    a.append(t); return a;
  };

  const completa = n => {
    const a = crea("article", "noticia-completa" + (n.imagen ? "" : " sin-img")); a.id = n.id; a.dataset.proyecto = n.proyecto || "";
    const img = imagen(n, "nc-img"); if (img) a.append(img);
    const t = crea("div", "nc-texto");
    const m = meta(n); m.querySelector("time").textContent = fecha(n.fecha);
    t.append(m, crea("h2", "", n.titulo)); parrafos(t, n.texto);
    const e = enlaces(n); if (e) t.append(e);
    a.append(t); return a;
  };

  fetch(BASE + "noticias.json", { cache: "no-cache" })
    .then(r => r.ok ? r.json() : { noticias: [] })
    .catch(() => ({ noticias: [] }))
    .then(j => {
      const ns = (j && j.noticias) || [];
      if (portada) {
        if (!ns.length) return;
        let filtro = "", visibles = PASO;
        const mas = $("nt-mas");
        const pinta = () => {
          lista = ns.filter(n => !filtro || n.proyecto === filtro);
          const vis = lista.slice(0, visibles);
          portada.replaceChildren(...vis.map((n, i) => elemento(n, i, i === 0)));
          portada.classList.toggle("una", vis.length === 1);
          const dest = portada.querySelector(".nt-dest"); if (dest) dest.style.gridRow = "span " + Math.max(1, vis.length - 1);
          if (mas) mas.hidden = lista.length <= visibles;
        };
        if (mas) mas.onclick = () => { visibles += PASO; pinta(); };
        filtros($("nt-filtros"), ns, v => { filtro = v; visibles = PASO; pinta(); });
        pinta();
        $("actualidad").hidden = false;
        const nav = $("nav-actualidad"); if (nav) nav.hidden = false;
        return;
      }
      $("noticias-cargando").hidden = true;
      if (!ns.length) { $("noticias-vacio").hidden = false; return; }
      const arts = ns.map(completa); todas.append(...arts);
      filtros($("nt-filtros"), ns, v => arts.forEach(a => { a.hidden = !!v && a.dataset.proyecto !== v; }));
      if (location.hash) { const e = document.getElementById(location.hash.slice(1)); if (e) e.scrollIntoView(); }
    });
})();
