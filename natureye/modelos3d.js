/* Galería de modelos 3D de especies con <model-viewer>, con cotas de altura, base y diámetro de copa
   dibujadas como en un plano. La librería se carga solo cuando la galería se acerca a la pantalla.
   Medidas: cada modelo se escala a una altura habitual de la especie (dentro del rango de Flora iberica) y el
   resto se mide sobre su geometría; el volumen de copa es la envolvente convexa del follaje. */
(() => {
  const caja = document.getElementById("visor-modelos");
  if (!caja) return;
  const raiz = caja.closest(".ne-modelos");
  const MEDIDAS = {"encina":{"ref":10,"rango":"8-12(15) m","alt":10,"base":1.82,"diam":7.79,"vol":468.033,"g":{"z0":-0.0392,"h":12.0721,"b":2.1989,"dx":9.1377,"dy":9.6789,"cx":0.0482,"cy":-0.067}},"quejigo":{"ref":12,"rango":"hasta 15(20) m","alt":12,"base":2.86,"diam":7.98,"vol":464.444,"g":{"z0":0.0,"h":16.3702,"b":3.8956,"dx":10.3315,"dy":11.4482,"cx":0.043,"cy":-0.121}},"pino":{"ref":15,"rango":"hasta 20 m","alt":15,"base":4.83,"diam":6.54,"vol":344.123,"g":{"z0":-0.0,"h":18.1814,"b":5.8595,"dx":7.8006,"dy":8.0622,"cx":0.0905,"cy":0.3257}},"majuelo":{"ref":4,"rango":"hasta 5(10) m","alt":4,"base":0.62,"diam":3.66,"vol":31.352,"g":{"z0":-0.0083,"h":95.5431,"b":14.7769,"dx":81.5762,"dy":93.0871,"cx":-2.059,"cy":-1.4621}},"agracejo":{"ref":1.5,"rango":"0,7-2(3) m","alt":1.5,"base":0.24,"diam":1.07,"vol":1.453,"g":{"z0":-0.0313,"h":0.1974,"b":0.0319,"dx":0.1419,"dy":0.1408,"cx":-0.0046,"cy":0.0023}},"erizon":{"ref":0.5,"rango":"hasta 0,6(1) m","alt":0.5,"base":0.07,"diam":0.75,"vol":0.192,"g":{"z0":-0.2415,"h":1.6438,"b":0.2211,"dx":2.5315,"dy":2.4107,"cx":0.0334,"cy":-0.0219}},"piorno":{"ref":0.35,"rango":"hasta 0,4(0,8) m","alt":0.35,"base":0.05,"diam":0.54,"vol":0.067,"g":{"z0":-0.0146,"h":0.9322,"b":0.1204,"dx":1.5384,"dy":1.3291,"cx":0.0656,"cy":0.0234}},"eleboro":{"ref":0.5,"rango":"tallos de 20-80 cm","alt":0.5,"base":0.13,"diam":0.93,"vol":0.337,"g":{"z0":-1.64,"h":7.5523,"b":1.8936,"dx":13.8249,"dy":14.2341,"cx":0.0536,"cy":0.135}}};
  const botones = raiz.querySelectorAll("[data-modelo]");
  const VER = "3.5.0";
  const NS = "http://www.w3.org/2000/svg";
  const TIC = 6; // media longitud de los topes de cada cota, en píxeles
  let visor = null, cargando = null, actual = null, svg = null, conMedidas = true;
  const boton = k => raiz.querySelector(`[data-modelo="${k}"]`);
  const fmt = (v, d = 1) => v.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d });
  const vol = v => v >= 10 ? fmt(v, 0) : v >= 1 ? fmt(v, 1) : fmt(v, 2);
  const aviso = raiz.querySelector(".ne-modelo-cargando");

  const carga = () => cargando || (cargando = new Promise((ok, mal) => {
    const js = document.createElement("script");
    js.type = "module"; js.src = `https://unpkg.com/@google/model-viewer@${VER}/dist/model-viewer.min.js`;
    js.onload = ok; js.onerror = mal; document.head.append(js);
  }).then(() => {
    visor = document.createElement("model-viewer");
    const at = { "camera-controls": "", "auto-rotate": "", "auto-rotate-delay": "3000", "rotation-per-second": "10deg",
      "interaction-prompt": "none", "environment-image": "media/modelos/cielo.webp", "tone-mapping": "neutral",
      "exposure": "1.35", "max-camera-orbit": "auto auto 300%", "shadow-intensity": "0.9", "shadow-softness": "0.85",
      "camera-orbit": `-30deg 78deg ${matchMedia("(max-width: 560px)").matches ? 150 : 126}%` };
    Object.entries(at).forEach(([a, v]) => visor.setAttribute(a, v));
    svg = document.createElementNS(NS, "svg"); svg.setAttribute("class", "ne-cotas"); svg.setAttribute("aria-hidden", "true");
    visor.append(svg);
    visor.addEventListener("load", () => { aviso.hidden = true; ponCotas(); });
    caja.append(visor);
    const conmuta = raiz.querySelector(".ne-medidas-conmuta input");
    conmuta.addEventListener("change", () => { conMedidas = conmuta.checked; raiz.classList.toggle("sin-medidas", !conMedidas); });
    requestAnimationFrame(dibuja);
    muestra(raiz.querySelector('[data-modelo][aria-pressed="true"]').dataset.modelo);
  }).catch(() => { aviso.textContent = "No se ha podido cargar el visor 3D."; }));

  // Extremos de las cotas en coordenadas del modelo (glTF, Y arriba).
  // Las medidas se tomaron en Blender (Z arriba), así que glTF = (x, z, -y).
  function puntos(g) {
    const top = g.z0 + g.h, yb = g.z0 + g.b, yc = g.z0 + g.b + (g.h - g.b) * .55, yd = top + g.h * .07;
    const x0 = g.cx - g.dx / 2, x1 = g.cx + g.dx / 2, z = -g.cy, m = g.dx * .14;
    return { a0: [x1 + m, g.z0, z], a1: [x1 + m, top, z], d0: [x0, yd, z], d1: [x1, yd, z], b0: [x0 - m, g.z0, z], b1: [x0 - m, yb, z],
      e0: [x0, yc, z], e1: [x1, yc, z] };
  }

  function ponCotas() {
    visor.querySelectorAll("[slot^=hotspot]").forEach(e => e.remove());
    const d = MEDIDAS[actual]; if (!d) return;
    const p = puntos(d.g);
    const base = d.base / d.alt > .12;
    const punto = (nombre, pos, texto) => {
      const e = document.createElement("div");
      e.slot = `hotspot-${nombre}`; e.dataset.position = pos.map(v => v.toFixed(4)).join(" ");
      e.className = texto ? "ne-cota-texto" : "ne-cota-punto";
      if (texto) e.textContent = texto;
      visor.append(e);
    };
    Object.entries(p).forEach(([n, pos]) => { if (base || n[0] !== "b") punto(n, pos); });
    const medio = (a, b) => a.map((v, i) => (v + b[i]) / 2);
    punto("ta", medio(p.a0, p.a1), `${fmt(d.alt, 2)} m`);
    punto("td", medio(p.d0, p.d1), `${fmt(d.diam, 2)} m`);
    if (base) punto("tb", medio(p.b0, p.b1), `${fmt(d.base, 2)} m`);
    const fila = (t, v) => `<div><dt>${t}</dt><dd>${v}</dd></div>`;
    raiz.querySelector(".ne-medidas-datos").innerHTML =
      `<dl>${fila("Altura", `${fmt(d.alt, 2)} m`)}` +
      (base ? fila("Base de copa", `${fmt(d.base, 2)} m`) : "") +
      fila("Diámetro de copa", `${fmt(d.diam, 2)} m`) +
      fila("Volumen de copa", `${vol(d.vol)} m³`) + "</dl>" +
      `<p>Modelo escalado a ${fmt(d.ref, d.ref % 1 ? 2 : 0)} m de altura, dentro del rango de la especie en Flora iberica (${d.rango}). ` +
      "Base, diámetro y volumen se miden sobre el modelo; el volumen es la envolvente convexa del follaje.</p>";
  }

  function dibuja() {
    requestAnimationFrame(dibuja);
    if (!svg) return;
    if (!visor.loaded || !conMedidas || !MEDIDAS[actual]) { svg.innerHTML = ""; return; }
    const q = n => { const h = visor.queryHotspot(`hotspot-${n}`); return h && h.canvasPosition; };
    let s = "";
    for (const n of ["a", "d", "b"]) {
      const p0 = q(n + "0"), p1 = q(n + "1"); if (!p0 || !p1) continue;
      const dx = p1.x - p0.x, dy = p1.y - p0.y, l = Math.hypot(dx, dy) || 1;
      const nx = -dy / l * TIC, ny = dx / l * TIC;
      const seg = (a, b) => `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      const tope = p => seg({ x: p.x - nx, y: p.y - ny }, { x: p.x + nx, y: p.y + ny });
      const d = `${seg(p0, p1)}${tope(p0)}${tope(p1)}`;
      s += `<path class="ne-halo" d="${d}"/><path class="ne-c-${n}" d="${d}"/>`;
    }
    const e0 = q("e0"), e1 = q("e1"), d0 = q("d0"), d1 = q("d1");
    if (e0 && d0 && e1 && d1) s = `<path class="ne-referencia" d="M${e0.x} ${e0.y}L${d0.x} ${d0.y}M${e1.x} ${e1.y}L${d1.x} ${d1.y}"/>` + s;
    svg.innerHTML = s;
  }

  function muestra(k) {
    actual = k;
    botones.forEach(b => b.setAttribute("aria-pressed", b.dataset.modelo === k));
    const r = raiz.querySelector(".ne-modelo-rotulo");
    r.querySelector("b").textContent = boton(k).textContent; r.querySelector("i").textContent = boton(k).dataset.latin;
    if (!visor) return carga();
    visor.querySelectorAll("[slot^=hotspot]").forEach(e => e.remove());
    raiz.querySelector(".ne-medidas-datos").innerHTML = "";
    aviso.textContent = "Cargando modelo 3D…"; aviso.hidden = false;
    visor.alt = `Modelo 3D de ${boton(k).textContent}`;
    visor.src = `media/modelos/${k}.glb?v=3`;
  }

  botones.forEach(b => b.addEventListener("click", () => muestra(b.dataset.modelo)));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); carga(); } }, { rootMargin: "300px" });
    io.observe(caja);
  } else carga();
})();
