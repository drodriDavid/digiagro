/* NATUREYE: visor 3D de la nube de puntos de Puerto de la Mata (muestra de la nube RGB densificada).
   Formato de media/puerto-mata.bin: n×3 uint16 (x, y, z cuantizados a la extensión), n×3 uint8 (RGB), n uint8 (altura sobre el suelo en dm).
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
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let empezado = false;

  const ok = (() => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch (e) { return false; } })();
  if (!ok) { caja.classList.add("sin-webgl"); aviso.textContent = "Tu navegador no permite gráficos 3D. Aquí tienes una vista fija de la nube."; return; }

  const obs = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting) && !empezado) { empezado = true; obs.disconnect(); carga(); } }, { rootMargin: "400px" });
  obs.observe(caja);

  async function carga() {
    const meta = await (await fetch("media/puerto-mata.json")).json();
    const r = await fetch("media/puerto-mata.bin");
    const total = +r.headers.get("content-length") || meta.n * 10;
    const lector = r.body.getReader(); const trozos = []; let leidos = 0;
    for (;;) {
      const { done, value } = await lector.read(); if (done) break;
      trozos.push(value); leidos += value.length; barra.style.width = Math.min(100, leidos / total * 100) + "%";
    }
    const buf = new Uint8Array(leidos); let o = 0; for (const t of trozos) { buf.set(t, o); o += t.length; }
    monta(meta, buf.buffer);
  }

  function monta(meta, ab) {
    const n = meta.n, [ex, ey, ez] = meta.extension;
    const q = new Uint16Array(ab, 0, n * 3), rgb = new Uint8Array(ab, n * 6, n * 3), alt = new Uint8Array(ab, n * 9, n);
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

    const rampa = (paradas, v, out, i) => {
      let k = 0; while (k < paradas.length - 2 && v > paradas[k + 1][0]) k++;
      const [a, ca] = paradas[k], [b, cb] = paradas[k + 1];
      const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
      out[i] = ca[0] + (cb[0] - ca[0]) * t; out[i + 1] = ca[1] + (cb[1] - ca[1]) * t; out[i + 2] = ca[2] + (cb[2] - ca[2]) * t;
    };
    const hex = h => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
    const P_ALT = [[0, hex("#c4b28a")], [0.8, hex("#cbd98a")], [3, hex("#6aae3a")], [6, hex("#1e5631")], [10, hex("#1c8cb8")]];
    const P_REL = [[0, hex("#1d4e6b")], [0.35, hex("#4f9fb8")], [0.6, hex("#d9dcb4")], [0.85, hex("#c08a52")], [1, hex("#7a4b2a")]];

    function colorea(modo) {
      for (let i = 0; i < n; i++) {
        const j = i * 3;
        if (modo === "real") { col[j] = (rgb[j] / 255) ** 1.6 * 1.25; col[j + 1] = (rgb[j + 1] / 255) ** 1.6 * 1.25; col[j + 2] = (rgb[j + 2] / 255) ** 1.6 * 1.25; }
        else if (modo === "altura") rampa(P_ALT, alt[i] / 10, col, j);
        else rampa(P_REL, (pos[j + 1] + ez / 2) / ez, col, j);
      }
      geo.attributes.color.needsUpdate = true;
      document.querySelectorAll("[data-leyenda]").forEach(l => { l.hidden = l.dataset.leyenda !== modo; });
    }
    colorea("real");

    const escena = new THREE.Scene();
    const mat = new THREE.PointsMaterial({ size: 1.45, vertexColors: true, sizeAttenuation: true });
    escena.add(new THREE.Points(geo, mat));

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

    botones.forEach(b => b.addEventListener("click", () => {
      botones.forEach(x => x.setAttribute("aria-pressed", x === b));
      colorea(b.dataset.modo);
    }));
    const rec = document.getElementById("vs-reinicia");
    if (rec) rec.addEventListener("click", () => { vistaInicial(); ctl.autoRotate = !quieto; });
    caja.classList.add("listo");
  }
}
