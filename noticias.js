/* Noticias de la unidad. Se publican desde el panel de Publicaciones de SAVIA (destino «Web DIGIAGRO»), que deja
   noticias.json e imágenes en savia.ujaen.es/cuadernos/noticias-digiagro/. Así salen al momento, sin tocar este repo.
   Portada (#actualidad): una destacada y una lista compacta; «Ver más» añade de cinco en cinco y cada noticia se lee
   en una ventana con anterior/siguiente (flechas del teclado y deslizar en el móvil). noticias.html: todas, completas.
   Idioma: si la noticia trae tituloEn/textoEn se usan en inglés; al cambiar de idioma (atributo lang de <html>) se
   vuelve a pintar. Sin noticias, la sección de la portada no aparece. */
(function () {
  const BASE = "https://savia.ujaen.es/cuadernos/noticias-digiagro/";
  const PASO = 5;
  const T = {
    es: { mas: "Más información", li: "Ver en LinkedIn", ant: "Anterior", sig: "Siguiente", cerrar: "Cerrar", noticia: "Noticia" },
    en: { mas: "More information", li: "View on LinkedIn", ant: "Previous", sig: "Next", cerrar: "Close", noticia: "News item" },
  };
  const $ = id => document.getElementById(id);
  const crea = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const portada = $("lista-noticias"), todas = $("todas-noticias");
  if (!portada && !todas) return;

  /* noticias.html no tiene botón de idioma: usa el elegido en la portada */
  if (todas) { try { const g = localStorage.getItem("idioma"); if (g === "en" || g === "es") document.documentElement.lang = g; } catch (e) {} }

  const en = () => document.documentElement.lang === "en";
  const t = k => T[en() ? "en" : "es"][k];
  const titulo = n => (en() && n.tituloEn) || n.titulo;
  const texto = n => (en() && n.textoEn) || n.texto;
  const fecha = (iso, corta) => { const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString(en() ? "en-GB" : "es-ES", corta ? { day: "numeric", month: "short", year: "numeric" } : { day: "numeric", month: "long", year: "numeric" }); };
  const resumen = s => { const p = s.split(/\n\s*\n/)[0].replace(/\s+/g, " ").trim(); return p.length > 200 ? p.slice(0, 190).replace(/\s+\S*$/, "") + "…" : p; };

  /* Texto con saltos de línea y enlaces, sin innerHTML */
  const parrafos = (dest, s) => s.split(/\n\s*\n/).forEach(bloque => {
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
  const cuando = (n, corta) => { const x = crea("time", "nt-fecha", fecha(n.fecha, corta)); x.dateTime = n.fecha; return x; };
  const enlaces = n => {
    const enl = crea("p", "nc-enlaces");
    if (n.enlace) { const e = crea("a", "boton boton-claro", t("mas")); e.href = n.enlace; e.rel = "noopener"; e.target = "_blank"; enl.append(e); }
    if (n.linkedin) { const e = crea("a", "boton boton-claro", t("li")); e.href = n.linkedin; e.rel = "noopener"; e.target = "_blank"; enl.append(e); }
    return enl.children.length ? enl : null;
  };

  /* Ventana de lectura con anterior y siguiente */
  let dlg = null, lista = [], pos = 0;
  const ventana = () => {
    if (dlg) return dlg;
    dlg = crea("dialog", "nt-dialogo");
    const cerrar = crea("button", "nt-cerrar"); cerrar.type = "button"; cerrar.textContent = "×"; cerrar.onclick = () => dlg.close();
    const pie = crea("div", "nt-pie");
    const ant = crea("button", "nt-nav"), sig = crea("button", "nt-nav"), cont = crea("span", "nt-contador");
    ant.type = sig.type = "button"; ant.onclick = () => abre(pos - 1); sig.onclick = () => abre(pos + 1);
    pie.append(ant, cont, sig);
    dlg.append(cerrar, crea("div", "nt-cuerpo"), pie);
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", e => { if (e.key === "ArrowLeft") abre(pos - 1); if (e.key === "ArrowRight") abre(pos + 1); });
    let x0 = null;
    dlg.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 70) abre(pos + (dx < 0 ? 1 : -1)); });
    dlg.addEventListener("close", () => document.documentElement.classList.remove("nt-abierta"));
    document.body.append(dlg);
    return dlg;
  };
  const abre = i => {
    if (i < 0 || i >= lista.length) return;
    pos = i; const n = lista[i], d = ventana(), c = d.querySelector(".nt-cuerpo");
    d.setAttribute("aria-label", t("noticia"));
    const cerrar = d.querySelector(".nt-cerrar"); cerrar.setAttribute("aria-label", t("cerrar"));
    c.replaceChildren();
    const img = imagen(n, "nt-dlg-img", false); if (img) c.append(img);
    const x = crea("div", "nt-dlg-texto");
    x.append(cuando(n), crea("h2", "", titulo(n))); parrafos(x, texto(n));
    const e = enlaces(n); if (e) x.append(e);
    c.append(x); c.scrollTop = 0;
    const [ant, cont, sig] = d.querySelector(".nt-pie").children;
    ant.textContent = t("ant"); sig.textContent = t("sig");
    ant.disabled = i === 0; sig.disabled = i === lista.length - 1; cont.textContent = (i + 1) + " / " + lista.length;
    if (!d.open) { d.showModal(); document.documentElement.classList.add("nt-abierta"); cerrar.focus(); }
  };

  /* Elemento de la portada: la tarjeta entera abre la ventana (el enlace lleva a noticias.html si no hay JS) */
  const elemento = (n, i, destacada) => {
    const a = crea("a", "nt" + (destacada ? " nt-dest" : "") + (n.imagen ? "" : " sin-img")); a.href = "noticias.html#" + n.id;
    a.onclick = e => { if (e.ctrlKey || e.metaKey || e.shiftKey) return; e.preventDefault(); abre(i); };
    const img = imagen(n, "nt-img"); if (img) a.append(img);
    const x = crea("div", "nt-texto");
    x.append(cuando(n, true), crea("h3", "", titulo(n)));
    if (destacada) x.append(crea("p", "nt-resumen", resumen(texto(n))));
    a.append(x); return a;
  };
  const completa = n => {
    const a = crea("article", "noticia-completa" + (n.imagen ? "" : " sin-img")); a.id = n.id;
    const img = imagen(n, "nc-img"); if (img) a.append(img);
    const x = crea("div", "nc-texto");
    x.append(cuando(n), crea("h2", "", titulo(n))); parrafos(x, texto(n));
    const e = enlaces(n); if (e) x.append(e);
    a.append(x); return a;
  };

  fetch(BASE + "noticias.json", { cache: "no-cache" })
    .then(r => r.ok ? r.json() : { noticias: [] })
    .catch(() => ({ noticias: [] }))
    .then(j => {
      const ns = (j && j.noticias) || [];
      lista = ns;
      let pinta;
      if (portada) {
        if (!ns.length) return;
        let visibles = PASO;
        const mas = $("nt-mas");
        pinta = () => {
          const vis = ns.slice(0, visibles);
          portada.replaceChildren(...vis.map((n, i) => elemento(n, i, i === 0)));
          portada.classList.toggle("una", vis.length === 1);
          const dest = portada.querySelector(".nt-dest"); if (dest) dest.style.gridRow = "span " + Math.max(1, vis.length - 1);
          if (mas) mas.hidden = ns.length <= visibles;
        };
        if (mas) mas.onclick = () => { visibles += PASO; pinta(); };
        $("actualidad").hidden = false;
        const nav = $("nav-actualidad"); if (nav) nav.hidden = false;
      } else {
        $("noticias-cargando").hidden = true;
        if (!ns.length) { $("noticias-vacio").hidden = false; return; }
        pinta = () => todas.replaceChildren(...ns.map(completa));
      }
      pinta();
      if (todas && location.hash) { const e = document.getElementById(location.hash.slice(1)); if (e) e.scrollIntoView(); }
      /* Cambio de idioma: se vuelve a pintar (y la ventana abierta, si la hay) */
      new MutationObserver(() => { pinta(); if (dlg && dlg.open) abre(pos); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    });
})();
