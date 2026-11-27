/* NATUREYE: visor 3D de la nube de puntos de Puerto de la Mata (muestra de la nube RGB densificada).
   Formato de media/puerto-mata.bin: n×3 uint16 (x, y, z cuantizados a la extensión), n×3 uint8 (RGB), n uint8 (altura sobre
   el suelo en dm) y, si meta.indices existe, n uint8 por índice (NDVI, NDRE, GNDVI: 0..250 de -0,2 a 1,0; 255 sin dato).
   media/puerto-mata-especies.bin: n uint8 con la especie de cada punto (0 sin clasificar; nombres y colores en el .json),
   solo para el vuelo de 2024; se descarga la primera vez que se pulsa «Especies».
   media/puerto-mata-2025.bin (vuelo de febrero de 2025) usa la misma malla, sin índices; se descarga solo si se pide.
   Carga diferida: solo se descarga cuando la sección se acerca a la pantalla. */
import * as THREE from "./vendor/three.module.min.js";
import { OrbitControls } from "./vendor/OrbitControls.js";

const caja = document.getElementById("visor");
if (caja) iniciar(caja);

function iniciar(caja) {
  const lienzo = caja.querySelector("canvas");
  const aviso = caja.querySelector(".vs-aviso");
  const barra = caja.querySelector(".vs-barra i");
  const botones = [...document.querySelectorAll("[data-modo]")];
  const fechas = [...caja.querySelectorAll("[data-fecha]")];
  const indices = [...caja.querySelectorAll("[data-indice]")];
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let empezado = false;

  const ok = (() => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch (e) { return false; } })();
  if (!ok) { caja.classList.add("sin-webgl"); aviso.textContent = "Tu navegador no permite gráficos 3D. Aquí tienes una vista fija de la nube."; return; }

  const obs = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting) && !empezado) { empezado = true; obs.disconnect(); carga(); } }, { rootMargin: "400px" });
  obs.observe(caja);

  async function baja(url, total, progreso) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(url);
    total = +r.headers.get("content-length") || total;
    const lector = r.body.getReader(); const trozos = []; let leidos = 0;
    for (;;) {
      const { done, value } = await lector.read(); if (done) break;
      trozos.push(value); leidos += value.length; progreso(Math.min(1, leidos / total));
    }
    const buf = new Uint8Array(leidos); let o = 0; for (const t of trozos) { buf.set(t, o); o += t.length; }
    return buf.buffer;
  }

  async function carga() {
    const meta = await (await fetch("media/puerto-mata.json?v=4")).json();
    const ab = await baja("media/puerto-mata.bin?v=4", meta.n * 13, p => { barra.style.width = p * 100 + "%"; });
    monta(meta, ab);
  }

  function monta(meta, ab0) {
    const [ex, ey, ez] = meta.extension;
    const hex = h => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
    const P_ALT = [[0, hex("#e9dfc6")], [0.8, hex("#cbd98a")], [3, hex("#6aae3a")], [6, hex("#1e5631")], [10, hex("#1c8cb8")]];
    const C_VIGOR = ["#9a7b55", "#dccb8a", "#a9c95f", "#3f8f3a", "#0f4a26"].map(hex);
    const P_REL = [[0, hex("#1d4e6b")], [0.35, hex("#4f9fb8")], [0.6, hex("#d9dcb4")], [0.85, hex("#c08a52")], [1, hex("#7a4b2a")]];
    const SIN = hex("#b8bcb6");
    /* Estratos por altura sobre el suelo: herbáceo y suelo, matorral bajo, matorral alto, arbolado */
    const ESTRATOS = [[0.3, hex("#e3d6b0")], [1, hex("#b9cf73")], [3, hex("#5e9e3e")], [Infinity, hex("#1f5a35")]];
    const NOMBRES = ["ndvi", "ndre", "gndvi"];
    const fmt = v => v.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const rampa = (paradas, v, out, i) => {
      let k = 0; while (k < paradas.length - 2 && v > paradas[k + 1][0]) k++;
      const [a, ca] = paradas[k], [b, cb] = paradas[k + 1];
      const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
      out[i] = ca[0] + (cb[0] - ca[0]) * t; out[i + 1] = ca[1] + (cb[1] - ca[1]) * t; out[i + 2] = ca[2] + (cb[2] - ca[2]) * t;
    };

    /* Convierte un fichero binario en una geometría con sus atributos */
    function prepara(n, ab, conIndices) {
      const q = new Uint16Array(ab, 0, n * 3), rgb = new Uint8Array(ab, n * 6, n * 3), alt = new Uint8Array(ab, n * 9, n);
      const idx = {};
      if (conIndices && meta.indices && ab.byteLength >= n * 13) NOMBRES.forEach((k, j) => { idx[k] = new Uint8Array(ab, n * (10 + j), n); });
      const pos = new Float32Array(n * 3);
      const sx = ex / 65535, sy = ey / 65535, sz = ez / 65535;
      for (let i = 0; i < n; i++) {
        pos[i * 3] = q[i * 3] * sx - ex / 2;           // este
        pos[i * 3 + 1] = q[i * 3 + 2] * sz - ez / 2;   // altura (eje vertical de three.js)
        pos[i * 3 + 2] = -(q[i * 3 + 1] * sy - ey / 2); // norte hacia el fondo
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const col = new Float32Array(n * 3);
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      const cuenta = [0, 0, 0, 0];
      for (let i = 0; i < n; i++) { const h = alt[i] / 10; cuenta[h < 0.3 ? 0 : h < 1 ? 1 : h < 3 ? 2 : 3]++; }
      return { n, pos, rgb, alt, idx, geo, col, cuenta };
    }

    const datos = { 2024: prepara(meta.n, ab0, true) };
    let actual = datos[2024], fecha = "2024", modo = "real", indice = "ndvi";

    function colorea() {
      const { n, pos, rgb, alt, idx, col, cuenta } = actual;
      const v = idx[indice], esc = meta.indices && meta.indices[indice] ? meta.indices[indice].escala : [0.2, 0.9];
      const P_V = C_VIGOR.map((c, k) => [esc[0] + (esc[1] - esc[0]) * k / 4, c]);
      for (let i = 0; i < n; i++) {
        const j = i * 3;
        if (modo === "real") { col[j] = (rgb[j] / 255) ** 1.6 * 1.25; col[j + 1] = (rgb[j + 1] / 255) ** 1.6 * 1.25; col[j + 2] = (rgb[j + 2] / 255) ** 1.6 * 1.25; }
        else if (modo === "altura") rampa(P_ALT, alt[i] / 10, col, j);
        else if (modo === "estratos") { const h = alt[i] / 10, c = ESTRATOS.find(e => h < e[0])[1]; col[j] = c[0]; col[j + 1] = c[1]; col[j + 2] = c[2]; }
        else if (modo === "especies") {
          const c = esp.col[esp.cl[i]];
          if (c) { col[j] = c[0]; col[j + 1] = c[1]; col[j + 2] = c[2]; }
          else { const g = ((rgb[j] + rgb[j + 1] + rgb[j + 2]) / 765) ** 1.6 * 0.9 + 0.05; col[j] = g; col[j + 1] = g; col[j + 2] = g * 0.96; } // suelo en gris
        }
        else if (modo === "vigor") { if (v[i] === 255) { col[j] = SIN[0]; col[j + 1] = SIN[1]; col[j + 2] = SIN[2]; } else rampa(P_V, v[i] / 250 * 1.2 - 0.2, col, j); }
        else rampa(P_REL, (pos[j + 1] + ez / 2) / ez, col, j);
      }
      actual.geo.attributes.color.needsUpdate = true;
      document.querySelectorAll("[data-leyenda]").forEach(l => { l.hidden = l.dataset.leyenda !== modo; });
      document.querySelectorAll("[data-estrato]").forEach(e => { e.textContent = `${Math.round(cuenta[+e.dataset.estrato] / n * 100)} %`; });
      caja.querySelectorAll("[data-vigor-min]").forEach(e => { e.textContent = fmt(esc[0]); });
      caja.querySelectorAll("[data-vigor-max]").forEach(e => { e.textContent = fmt(esc[1]); });
      botones.forEach(b => { b.setAttribute("aria-pressed", b.dataset.modo === modo); });
      const vig = botones.find(b => b.dataset.modo === "vigor");
      if (vig) { vig.disabled = !v; vig.title = v ? "" : "Solo hay datos multiespectrales del vuelo de abril de 2024"; }
      const be = botones.find(b => b.dataset.modo === "especies");
      if (be) { be.disabled = fecha !== "2024"; be.title = fecha === "2024" ? "" : "La clasificación por especies es del vuelo de abril de 2024"; }
    }

    const escena = new THREE.Scene();
    const mat = new THREE.PointsMaterial({ size: 1.05, vertexColors: true, sizeAttenuation: true });
    const puntos = new THREE.Points(actual.geo, mat);
    escena.add(puntos);
    colorea();

    const render = new THREE.WebGLRenderer({ canvas: lienzo, antialias: false, alpha: true });
    render.setPixelRatio(Math.min(devicePixelRatio, 2));
    render.outputColorSpace = THREE.SRGBColorSpace;
    const cam = new THREE.PerspectiveCamera(45, 1, 1, 5000);
    cam.position.set(-215, 190, 295);
    const ctl = new OrbitControls(cam, lienzo);
    ctl.enableDamping = true; ctl.dampingFactor = 0.08;
    ctl.maxPolarAngle = Math.PI * 0.49; ctl.minDistance = 40; ctl.maxDistance = 1100;
    ctl.autoRotate = !quieto; ctl.autoRotateSpeed = 0.55;
    ctl.target.set(0, -10, 0); ctl.update();
    const para = () => { ctl.autoRotate = false; };
    lienzo.addEventListener("pointerdown", para); lienzo.addEventListener("wheel", para, { passive: true });

    const ajusta = () => {
      const w = lienzo.clientWidth, h = lienzo.clientHeight;
      render.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    };
    new ResizeObserver(ajusta).observe(lienzo); ajusta();
    /* En pantallas estrechas la cámara se aleja para que quepa la nube entera */
    const vistaInicial = () => { const f = cam.aspect < 1 ? 2.3 : cam.aspect < 1.4 ? 1.3 : 1; cam.position.set(-215 * f, 190 * f, 295 * f); ctl.target.set(0, -10, 0); ctl.update(); };
    vistaInicial();

    let visible = true;
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(caja);
    render.setAnimationLoop(() => { if (!visible) return; ctl.update(); render.render(escena, cam); });

    /* Especies: se descarga la primera vez que se pide (1,5 MB) */
    const esp = { cl: null, col: [] };
    async function cargaEspecies(b) {
      const texto = b.textContent; b.disabled = true;
      try {
        const m = await (await fetch("media/puerto-mata-especies.json?v=1")).json();
        const ab = await baja("media/puerto-mata-especies.bin?v=1", m.n, p => { b.textContent = `Cargando ${Math.round(p * 100)} %`; });
        if (m.n !== meta.n) throw new Error("especies");
        esp.cl = new Uint8Array(ab);
        const cuenta = new Array(m.clases.length + 1).fill(0); for (let i = 0; i < esp.cl.length; i++) cuenta[esp.cl[i]]++;
        const ley = caja.querySelector('[data-leyenda="especies"]');
        ley.textContent = "";
        m.clases.forEach(c => {
          esp.col[c.id] = hex(c.color).map(v => v ** 2.2); // a lineal, como el resto de colores del visor
          const s = document.createElement("span"), i = document.createElement("i"), n = document.createElement("b");
          i.style.background = c.color; n.textContent = `${Math.round(cuenta[c.id] / m.n * 100)} %`;
          s.append(i, c.nombre + " ", n); ley.append(s);
        });
        const s = document.createElement("span"), i = document.createElement("i"); i.style.background = "#8a8a86"; s.append(i, "Suelo y sin clasificar"); ley.append(s);
      } finally { b.textContent = texto; b.disabled = false; }
    }
    botones.forEach(b => b.addEventListener("click", async () => {
      if (b.disabled) return;
      if (b.dataset.modo === "especies" && !esp.cl) { try { await cargaEspecies(b); } catch (e) { return; } }
      modo = b.dataset.modo; colorea();
    }));
    indices.forEach(b => b.addEventListener("click", () => {
      indice = b.dataset.indice; indices.forEach(x => x.setAttribute("aria-pressed", x === b)); colorea();
    }));

    /* Cambio de fecha: la nube de febrero de 2025 se descarga la primera vez que se pide */
    async function ponFecha(f) {
      if (f === fecha) return;
      if (!datos[f]) {
        const b = fechas.find(x => x.dataset.fecha === f), texto = b.textContent;
        fechas.forEach(x => { x.disabled = true; });
        try {
          const m = await (await fetch(`media/puerto-mata-${f}.json?v=2`)).json();
          const ab = await baja(`media/puerto-mata-${f}.bin?v=2`, m.n * 10, p => { b.textContent = `Cargando ${Math.round(p * 100)} %`; });
          datos[f] = prepara(m.n, ab, false);
        } catch (e) { b.textContent = texto; fechas.forEach(x => { x.disabled = false; }); return; }
        b.textContent = texto; fechas.forEach(x => { x.disabled = false; });
      }
      fecha = f; actual = datos[f]; puntos.geometry = actual.geo;
      fechas.forEach(x => x.setAttribute("aria-pressed", x.dataset.fecha === f));
      if ((modo === "vigor" && !actual.idx[indice]) || (modo === "especies" && f !== "2024")) modo = "real";
      colorea();
    }
    fechas.forEach(b => b.addEventListener("click", () => ponFecha(b.dataset.fecha)));

    const rec = document.getElementById("vs-reinicia");
    if (rec) rec.addEventListener("click", () => { vistaInicial(); ctl.autoRotate = !quieto; });
    caja.classList.add("listo");
  }
}
