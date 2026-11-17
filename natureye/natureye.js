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

  /* Visor de imágenes de las galerías */
  const lupa = $("lupa");
  if (lupa) {
    const enlaces = [...document.querySelectorAll(".ne-galeria a")];
    const img = lupa.querySelector("img"), pie = lupa.querySelector("figcaption");
    let actual = 0, previo = null;
    const muestra = i => {
      actual = (i + enlaces.length) % enlaces.length;
      const a = enlaces[actual], cap = a.closest("figure").querySelector("figcaption");
      img.src = a.href; img.alt = cap ? cap.textContent : ""; pie.textContent = cap ? cap.textContent : "";
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
  const filas = DATOS.map(d => {
    const tr = crea("tr"); tr.dataset.tipo = d.tipo;
    const c1 = crea("td"); c1.append(crea("b", "", d.titulo)); if (d.desc) c1.append(crea("small", "", d.desc)); c1.append(crea("span", "ne-tipo", d.tipo));
    const c2 = crea("td"); c2.append(crea("b", "", d.zona)); if (d.fecha) c2.append(crea("small", "", d.fecha + (d.sensor ? " · " + d.sensor : "")));
    const c3 = crea("td", "", d.formato);
    const c4 = crea("td", "ne-num", d.mb ? tamaño(d.mb) : "—");
    const c5 = crea("td", "ne-acceso");
    if (d.url) { const a = crea("a", "", "Descargar"); a.href = d.url; a.rel = "noopener"; c5.append(a); }
    else c5.append(crea("span", "", "Bajo petición"));
    tr.append(c1, c2, c3, c4, c5); cuerpo.append(tr);
    return tr;
  });
  const tipos = ["Todos", ...new Set(DATOS.map(d => d.tipo))];
  tipos.forEach((t, i) => {
    const b = crea("button", "", t); b.type = "button"; b.setAttribute("aria-pressed", i === 0);
    b.addEventListener("click", () => {
      filtros.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
      filas.forEach(f => { f.hidden = t !== "Todos" && f.dataset.tipo !== t; });
    });
    filtros.append(b);
  });
})();
