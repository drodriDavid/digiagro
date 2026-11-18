/* Galería de modelos 3D de especies con <model-viewer>, con cotas de altura, base y diámetro de copa.
   La librería se carga solo cuando la galería se acerca a la pantalla.
   Medidas: cada modelo se escala a una altura habitual de la especie (dentro del rango de Flora iberica) y el
   resto se mide sobre su geometría; el volumen de copa es la envolvente convexa del follaje. */
(() => {
  const caja = document.getElementById("visor-modelos");
  if (!caja) return;
  const MEDIDAS = {"encina":{"ref":10,"rango":"8-12(15) m","alt":10,"base":1.82,"diam":7.79,"vol":468.033,"g":{"z0":-0.0392,"h":12.0721,"b":2.1989,"dx":9.1377,"dy":9.6789,"cx":0.0482,"cy":-0.067}},"quejigo":{"ref":12,"rango":"hasta 15(20) m","alt":12,"base":2.86,"diam":7.98,"vol":464.444,"g":{"z0":0.0,"h":16.3702,"b":3.8956,"dx":10.3315,"dy":11.4482,"cx":0.043,"cy":-0.121}},"pino":{"ref":15,"rango":"hasta 20 m","alt":15,"base":4.83,"diam":6.54,"vol":344.123,"g":{"z0":-0.0,"h":18.1814,"b":5.8595,"dx":7.8006,"dy":8.0622,"cx":0.0905,"cy":0.3257}},"majuelo":{"ref":4,"rango":"hasta 5(10) m","alt":4,"base":0.62,"diam":3.66,"vol":31.352,"g":{"z0":-0.0083,"h":95.5431,"b":14.7769,"dx":81.5762,"dy":93.0871,"cx":-2.059,"cy":-1.4621}},"agracejo":{"ref":1.5,"rango":"0,7-2(3) m","alt":1.5,"base":0.24,"diam":1.07,"vol":1.453,"g":{"z0":-0.0313,"h":0.1974,"b":0.0319,"dx":0.1419,"dy":0.1408,"cx":-0.0046,"cy":0.0023}},"erizon":{"ref":0.5,"rango":"hasta 0,6(1) m","alt":0.5,"base":0.07,"diam":0.75,"vol":0.192,"g":{"z0":-0.2415,"h":1.6438,"b":0.2211,"dx":2.5315,"dy":2.4107,"cx":0.0334,"cy":-0.0219}},"piorno":{"ref":0.35,"rango":"hasta 0,4(0,8) m","alt":0.35,"base":0.05,"diam":0.54,"vol":0.067,"g":{"z0":-0.0146,"h":0.9322,"b":0.1204,"dx":1.5384,"dy":1.3291,"cx":0.0656,"cy":0.0234}},"eleboro":{"ref":0.5,"rango":"tallos de 20-80 cm","alt":0.5,"base":0.13,"diam":0.93,"vol":0.337,"g":{"z0":-1.64,"h":7.5523,"b":1.8936,"dx":13.8249,"dy":14.2341,"cx":0.0536,"cy":0.135}}};
  const botones = document.querySelectorAll("[data-modelo]");
  const VER = "3.5.0";
  const NS = "http://www.w3.org/2000/svg";
  let visor = null, cargando = null, actual = null, svg = null, conMedidas = true;
  const boton = k => document.querySelector(`[data-modelo="${k}"]`);
  const fmt = (v, d = 1) => v.toLocaleString("es-ES", { maximumFractionDigits: d });
  const vol = v => v >= 10 ? fmt(v, 0) : v >= 1 ? fmt(v, 1) : fmt(v, 2);

  const carga = () => cargando || (cargando = new Promise((ok, mal) => {
    const js = document.createElement("script");
    js.type = "module"; js.src = `https://unpkg.com/@google/model-viewer@${VER}/dist/model-viewer.min.js`;
    js.onload = ok; js.onerror = mal; document.head.append(js);
  }).then(() => {
    visor = document.createElement("model-viewer");
    const at = { "camera-controls": "", "auto-rotate": "", "auto-rotate-delay": "3000", "rotation-per-second": "12deg",
      "interaction-prompt": "none", "environment-image": "media/modelos/cielo.webp", "tone-mapping": "neutral",
      "exposure": "1.45", "shadow-intensity": "1", "shadow-softness": "0.6", "camera-orbit": `-30deg 80deg ${matchMedia("(max-width: 560px)").matches ? 135 : 108}%` };
    Object.entries(at).forEach(([a, v]) => visor.setAttribute(a, v));
    svg = document.createElementNS(NS, "svg"); svg.setAttribute("class", "ne-cotas"); svg.setAttribute("aria-hidden", "true");
    visor.append(svg);
    visor.addEventListener("load", () => { caja.querySelector(".ne-modelo-cargando").hidden = true; ponCotas(); });
    caja.append(visor);
    const conmuta = caja.querySelector(".ne-medidas-boton");
    conmuta.hidden = false;
    conmuta.addEventListener("click", () => {
      conMedidas = !conMedidas; conmuta.setAttribute("aria-pressed", conMedidas);
      caja.classList.toggle("sin-medidas", !conMedidas);
    });
    requestAnimationFrame(dibuja);
    muestra(document.querySelector('[data-modelo][aria-pressed="true"]').dataset.modelo);
  }).catch(() => { caja.querySelector(".ne-modelo-cargando").textContent = "No se ha podido cargar el visor 3D."; }));

  // Extremos de las cotas en coordenadas del modelo (glTF, Y arriba).
  // Las medidas se tomaron en Blender (Z arriba), así que glTF = (x, z, -y).
  function puntos(g) {
    const top = g.z0 + g.h, yb = g.z0 + g.b, yd = g.z0 + g.b + (g.h - g.b) * .55;
    const x0 = g.cx - g.dx / 2, x1 = g.cx + g.dx / 2, z = -g.cy, m = g.dx * .12;
    return { a0: [x1 + m, g.z0, z], a1: [x1 + m, top, z], d0: [x0, yd, z], d1: [x1, yd, z], b0: [x0 - m, g.z0, z], b1: [x0 - m, yb, z] };
  }

  function ponCotas() {
    visor.querySelectorAll("[slot^=hotspot]").forEach(e => e.remove());
    const d = MEDIDAS[actual]; if (!d) return;
    const p = puntos(d.g);
    const base = d.base / d.alt > .12;
    const punto = (nombre, pos, clase, texto) => {
      const e = document.createElement("div");
      e.slot = `hotspot-${nombre}`; e.dataset.position = pos.map(v => v.toFixed(4)).join(" ");
      e.className = `ne-cota-punto ${clase}`;
      if (texto) { e.textContent = texto; e.classList.add("ne-cota-texto"); }
      visor.append(e);
    };
    Object.entries(p).forEach(([n, pos]) => { if (base || n[0] !== "b") punto(n, pos, "ne-c-" + n[0]); });
    const medio = (a, b) => a.map((v, i) => (v + b[i]) / 2);
    punto("ta", medio(p.a0, p.a1), "ne-c-a", `${fmt(d.alt, 2)} m`);
    punto("td", medio(p.d0, p.d1), "ne-c-d", `${fmt(d.diam, 2)} m`);
    if (base) punto("tb", medio(p.b0, p.b1), "ne-c-b", `${fmt(d.base, 2)} m`);
    caja.querySelector(".ne-medidas-datos").innerHTML =
      `<dl><div class="ne-c-a"><dt>Altura</dt><dd>${fmt(d.alt, 2)} m</dd></div>` +
      (base ? `<div class="ne-c-b"><dt>Base de copa</dt><dd>${fmt(d.base, 2)} m</dd></div>` : "") +
      `<div class="ne-c-d"><dt>Diámetro de copa</dt><dd>${fmt(d.diam, 2)} m</dd></div>` +
      `<div><dt>Volumen de copa</dt><dd>${vol(d.vol)} m³</dd></div></dl>` +
      `<p>Modelo escalado a ${fmt(d.ref, 2)} m de altura (Flora iberica: ${d.rango}).</p>`;
  }

  function dibuja() {
    requestAnimationFrame(dibuja);
    if (!svg) return;
    if (!visor.loaded || !conMedidas || !MEDIDAS[actual]) { svg.innerHTML = ""; return; }
    const q = n => { const h = visor.queryHotspot(`hotspot-${n}`); return h && h.canvasPosition; };
    let s = "";
    for (const n of ["a", "d", "b"]) {
      const p0 = q(n + "0"), p1 = q(n + "1"); if (!p0 || !p1) continue;
      s += `<line class="ne-c-${n}" x1="${p0.x}" y1="${p0.y}" x2="${p1.x}" y2="${p1.y}"/>`;
    }
    svg.innerHTML = s;
  }

  function muestra(k) {
    actual = k;
    botones.forEach(b => b.setAttribute("aria-pressed", b.dataset.modelo === k));
    const r = caja.querySelector(".ne-modelo-rotulo");
    r.querySelector("b").textContent = boton(k).textContent; r.querySelector("i").textContent = boton(k).dataset.latin;
    if (!visor) return carga();
    visor.querySelectorAll("[slot^=hotspot]").forEach(e => e.remove());
    caja.querySelector(".ne-medidas-datos").innerHTML = "";
    const aviso = caja.querySelector(".ne-modelo-cargando"); aviso.textContent = "Cargando modelo 3D…"; aviso.hidden = false;
    visor.alt = `Modelo 3D de ${boton(k).textContent}`;
    visor.src = `media/modelos/${k}.glb?v=3`;
  }

  botones.forEach(b => b.addEventListener("click", () => muestra(b.dataset.modelo)));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); carga(); } }, { rootMargin: "300px" });
    io.observe(caja);
  } else carga();
})();
