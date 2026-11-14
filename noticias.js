/* Noticias de la unidad. Se publican desde el panel de Publicaciones de SAVIA (destino «Web DIGIAGRO»), que deja
   noticias.json e imágenes en savia.ujaen.es/cuadernos/noticias-digiagro/. Así salen al momento, sin tocar este repo.
   En la portada: las tres últimas en #actualidad (oculta si no hay ninguna). En noticias.html: todas, completas. */
(function () {
  const BASE = "https://savia.ujaen.es/cuadernos/noticias-digiagro/";
  const $ = id => document.getElementById(id);
  const crea = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const portada = $("lista-noticias"), todas = $("todas-noticias");
  if (!portada && !todas) return;

  const fecha = iso => { const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString(document.documentElement.lang === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "long", year: "numeric" }); };
  const resumen = t => { const p = t.split(/\n\s*\n/)[0].replace(/\s+/g, " ").trim(); return p.length > 220 ? p.slice(0, 210).replace(/\s+\S*$/, "") + "…" : p; };

  /* Texto con saltos de línea y enlaces, sin innerHTML */
  const parrafos = (dest, t) => t.split(/\n\s*\n/).forEach(bloque => {
    const p = crea("p");
    bloque.split("\n").forEach((linea, i) => {
      if (i) p.append(crea("br"));
      linea.split(/(https?:\/\/[^\s)]+)/).forEach((trozo, j) => {
        if (j % 2) { const a = crea("a", "", trozo.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")); a.href = trozo; a.rel = "noopener"; p.append(a); }
        else if (trozo) p.append(trozo);
      });
    });
    dest.append(p);
  });

  const imagen = (n, cls) => {
    if (!n.imagen) return null;
    const f = crea("figure", cls), i = crea("img"); i.src = BASE + n.imagen; i.alt = ""; i.loading = "lazy"; f.append(i); return f;
  };

  const tarjeta = n => {
    const a = crea("a", "noticia"); a.href = "noticias.html#" + n.id;
    const img = imagen(n, "nt-img"); if (img) a.append(img); else a.classList.add("sin-img");
    const t = crea("div", "nt-texto");
    t.append(crea("time", "nt-fecha", fecha(n.fecha)), crea("h3", "", n.titulo), crea("p", "", resumen(n.texto)), crea("span", "nt-mas", "Leer la noticia"));
    a.append(t); return a;
  };

  const completa = n => {
    const a = crea("article", "noticia-completa"); a.id = n.id;
    const img = imagen(n, "nc-img"); if (img) a.append(img); else a.classList.add("sin-img");
    const t = crea("div", "nc-texto");
    t.append(crea("time", "nt-fecha", fecha(n.fecha)), crea("h2", "", n.titulo));
    parrafos(t, n.texto);
    const enl = crea("p", "nc-enlaces");
    if (n.enlace) { const e = crea("a", "boton boton-claro", "Más información"); e.href = n.enlace; e.rel = "noopener"; enl.append(e); }
    if (n.linkedin) { const e = crea("a", "boton boton-claro", "Ver en LinkedIn"); e.href = n.linkedin; e.rel = "noopener"; enl.append(e); }
    if (enl.children.length) t.append(enl);
    a.append(t); return a;
  };

  fetch(BASE + "noticias.json", { cache: "no-cache" })
    .then(r => r.ok ? r.json() : { noticias: [] })
    .catch(() => ({ noticias: [] }))
    .then(j => {
      const ns = (j && j.noticias) || [];
      if (portada) {
        if (!ns.length) return;
        ns.slice(0, 3).forEach(n => portada.append(tarjeta(n)));
        portada.classList.add("n" + Math.min(ns.length, 3));
        $("actualidad").hidden = false;
        const nav = $("nav-actualidad"); if (nav) nav.hidden = false;
        if (ns.length <= 3) { const m = $("mas-noticias"); if (m) m.hidden = true; }
        return;
      }
      $("noticias-cargando").hidden = true;
      if (!ns.length) { $("noticias-vacio").hidden = false; return; }
      ns.forEach(n => todas.append(completa(n)));
      if (location.hash) { const e = document.getElementById(location.hash.slice(1)); if (e) e.scrollIntoView(); }
    });
})();
