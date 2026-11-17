/* NATUREYE: menú móvil y tabla de conjuntos de datos (datos en datos.js). */
(function () {
  const $ = id => document.getElementById(id);
  const crea = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  /* Menú móvil */
  const nav = $("nav"), boton = $("nav-boton");
  if (boton) {
    boton.addEventListener("click", () => { const a = nav.classList.toggle("abierto"); boton.setAttribute("aria-expanded", a); });
    nav.querySelectorAll("nav a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("abierto"); boton.setAttribute("aria-expanded", false); }));
  }

  /* Pasos del método en pestañas (flechas para moverse entre ellas) */
  const pest = [...document.querySelectorAll(".ne-pestanas [role=tab]")];
  const activa = (b, foco) => {
    pest.forEach(x => { const on = x === b; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; $(x.getAttribute("aria-controls")).hidden = !on; });
    if (foco) b.focus();
  };
  pest.forEach((b, i) => {
    b.tabIndex = i ? -1 : 0;
    b.addEventListener("click", () => activa(b));
    b.addEventListener("keydown", e => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { e.preventDefault(); activa(pest[(i + d + pest.length) % pest.length], true); }
    });
  });

  /* Visor de imágenes de las galerías */
  const lupa = $("lupa");
  if (lupa) {
    const enlaces = [...document.querySelectorAll(".ne-galeria a, a.ne-amplia")];
    const img = lupa.querySelector("img"), pie = lupa.querySelector("figcaption");
    let actual = 0, previo = null;
    const texto = a => {
      const f = a.closest("figure"), cap = f && f.querySelector("figcaption");
      if (cap) return cap.textContent;
      const h = a.closest(".ne-etapa"); if (h) return h.querySelector("h3").textContent + ": " + (a.querySelector("img").alt || "");
      return a.querySelector("img") ? a.querySelector("img").alt : "";
    };
    const muestra = i => {
      actual = (i + enlaces.length) % enlaces.length;
      const a = enlaces[actual], t = texto(a);
      img.src = a.href; img.alt = t; pie.textContent = t;
    };
    const cierra = () => { lupa.hidden = true; document.body.classList.remove("con-lupa"); if (previo) previo.focus(); };
    enlaces.forEach((a, i) => a.addEventListener("click", e => {
      e.preventDefault(); previo = a; muestra(i); lupa.hidden = false; document.body.classList.add("con-lupa");
      lupa.querySelector(".ne-lupa-cierra").focus();
    }));
    lupa.querySelector(".ne-lupa-cierra").addEventListener("click", cierra);
    lupa.querySelector(".ne-lupa-ant").addEventListener("click", () => muestra(actual - 1));
    lupa.querySelector(".ne-lupa-sig").addEventListener("click", () => muestra(actual + 1));
    lupa.addEventListener("click", e => { if (e.target === lupa) cierra(); });
    document.addEventListener("keydown", e => {
      if (lupa.hidden) return;
      if (e.key === "Escape") cierra(); else if (e.key === "ArrowLeft") muestra(actual - 1); else if (e.key === "ArrowRight") muestra(actual + 1);
    });
  }

  /* Tabla de datos */
  if (typeof DATOS === "undefined") return;
  const cuerpo = $("lista-datos"), filtros = $("filtros");
  const tamaño = mb => mb >= 1024 ? (mb / 1024).toLocaleString("es-ES", { maximumFractionDigits: 1 }) + " GB" : Math.round(mb).toLocaleString("es-ES") + " MB";
  /* Imagen y explicación de cada tipo de dato, para que se vea qué contiene antes de pedirlo */
  const TIPOS = {
    "MDE": ["img/mde.jpg", "Relieve del terreno en cada píxel"],
    "RGB": ["img/ortomosaico.jpg", "Mosaico de fotos de dron en color real"],
    "Multiespectral": ["img/sensores.jpg", "Verde, rojo, borde rojo e infrarrojo cercano"],
    "Hiperespectral": ["img/firmas-espectrales.jpg", "Cientos de bandas por píxel", "center 70%"],
    "Nube de puntos": ["img/nube-lidar.jpg", "Puntos 3D de LiDAR y fotogrametría"],
    "Modelo GEU": ["img/geu-fusion.jpg", "Datos fusionados listos para GEU", "left center"],
    "Especies": ["media/especies/quejigo.webp", "Fotos de campo de cada especie"]
  };
  const filas = DATOS.map(d => {
    const tr = crea("tr"); tr.dataset.tipo = d.tipo;
    const c1 = crea("td"), w = crea("div", "ne-celda-conjunto"); c1.append(w);
    const t = TIPOS[d.tipo];
    if (t) { const im = crea("img", "ne-mini"); im.src = t[0]; if (t[2]) im.style.objectPosition = t[2]; im.alt = ""; im.loading = "lazy"; w.append(im); }
    const tx = crea("div"); tx.append(crea("b", "", d.titulo)); if (d.desc) tx.append(crea("small", "", d.desc)); tx.append(crea("span", "ne-tipo", d.tipo)); w.append(tx);
    const c2 = crea("td"); c2.append(crea("b", "", d.zona)); if (d.fecha) c2.append(crea("small", "", d.fecha + (d.sensor ? " · " + d.sensor : "")));
    const c3 = crea("td", "", d.formato);
    const c4 = crea("td", "ne-num", d.mb ? tamaño(d.mb) : "—");
    const c5 = crea("td", "ne-acceso");
    if (d.url) { const a = crea("a", "", "Descargar"); a.href = d.url; a.rel = "noopener"; c5.append(a); }
    else c5.append(crea("span", "", "Bajo petición"));
    tr.append(c1, c2, c3, c4, c5); cuerpo.append(tr);
    return tr;
  });
  const cuenta = t => DATOS.filter(d => t === "Todos" || d.tipo === t).length;
  const tipos = ["Todos", ...new Set(DATOS.map(d => d.tipo))];
  tipos.forEach((t, i) => {
    const b = crea("button", "ne-tipo-tarjeta"); b.type = "button"; b.setAttribute("aria-pressed", i === 0);
    const info = TIPOS[t];
    if (info) { const im = crea("img"); im.src = info[0]; if (info[2]) im.style.objectPosition = info[2]; im.alt = ""; im.loading = "lazy"; b.append(im); }
    else b.classList.add("ne-tipo-todos");
    const tx = crea("span", "ne-tipo-tx");
    tx.append(crea("b", "", t), crea("small", "", info ? info[1] : "Todo el catálogo"));
    const n = crea("span", "ne-tipo-n", String(cuenta(t)));
    b.append(tx, n);
    b.addEventListener("click", () => {
      filtros.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
      filas.forEach(f => { f.hidden = t !== "Todos" && f.dataset.tipo !== t; });
    });
    filtros.append(b);
  });
})();
