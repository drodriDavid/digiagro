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
