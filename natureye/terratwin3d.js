/* NATUREYE · TerraTwin: gemelo digital interactivo de Ordesa y de Sierra Mágina.
   Relieve MDT25 (media/terratwin3d/<zona>/height.bin, uint16), ortofoto PNOA, idoneidad actual del modelo (Random Forest),
   horizonte de pérdida por escenario (clase 0 = no adecuado; 40·(k+1): k = 0..3 perdido en cada periodo, 4 = refugio)
   y niebla de extrapolación (fracción de modelos climáticos con MESS < 0 en 2081-2100).
   Carga diferida: los datos solo se descargan cuando el visor se acerca a la pantalla. */
import * as THREE from "./vendor/three.module.min.js";
import { OrbitControls } from "./vendor/OrbitControls.js";

const caja = document.getElementById("visor-tt");
if (caja) iniciar(caja);

function iniciar(caja) {
  const lienzo = caja.querySelector("canvas");
  const aviso = caja.querySelector(".vs-aviso");
  const barra = caja.querySelector(".vs-barra i");
  const bZona = [...document.querySelectorAll("[data-tt-zona]")];
  const bCapa = [...document.querySelectorAll("[data-tt-capa]")];
  const bSsp = [...caja.querySelectorAll("[data-tt-ssp]")];
  const tiempo = caja.querySelector(".tt-tiempo input");
  const tRotulo = caja.querySelector(".tt-tiempo output");
  const play = caja.querySelector(".tt-play");
  const niebla = caja.querySelector(".tt-niebla input");
  const dato = caja.querySelector(".tt-dato");
  const resumen = caja.querySelector(".tt-resumen");
  const leyendas = [...caja.querySelectorAll("[data-tt-leyenda]")];
  const reinicia = caja.querySelector(".vs-reinicia");
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const movil = matchMedia("(pointer: coarse)").matches;
  const PERIODOS = ["Hoy", "2021–2040", "2041–2060", "2061–2080", "2081–2100"];
  const CLASES = ["Se pierde en 2021–2040", "Se pierde en 2041–2060", "Se pierde en 2061–2080", "Se pierde en 2081–2100", "Refugio hasta 2100"];
  const estado = { zona: "ordesa", capa: "perdida", ssp: "ssp585", t: 4, niebla: true };
  let empezado = false, escena, camara, render, ctl, malla, mat, datos = {}, cargando = null, anima = null;

  const ok = (() => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch (e) { return false; } })();
  if (!ok) { caja.classList.add("sin-webgl"); aviso.textContent = "Tu navegador no permite gráficos 3D. Aquí tienes una vista fija."; return; }
  const obs = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting) && !empezado) { empezado = true; obs.disconnect(); arranca(); } }, { rootMargin: "300px" });
  obs.observe(caja);

  /* ---------- descarga ---------- */
  const imagen = url => new Promise((ok, mal) => { const i = new Image(); i.onload = () => ok(i); i.onerror = mal; i.src = url; });
  async function zona(id) {
    if (datos[id]) return datos[id];
    const raiz = `media/terratwin3d/${id}/`;
    const meta = await (await fetch(raiz + "meta.json")).json();
    const piezas = ["height.bin", "ortho.webp", "suit.png", "class_ssp245.png", "class_ssp585.png", "fog_ssp245.png", "fog_ssp585.png"];
    let hechas = 0; const avanza = () => { hechas++; barra.style.width = (hechas / piezas.length) * 100 + "%"; };
    const [alt, orto, idon, c245, c585, f245, f585] = await Promise.all(piezas.map(p =>
      (p.endsWith(".bin") ? fetch(raiz + p).then(r => r.arrayBuffer()) : imagen(raiz + p)).then(x => { avanza(); return x; })));
    const tex = (img, cerca, color) => {
      const t = new THREE.Texture(img); t.needsUpdate = true;
      t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.minFilter = cerca ? THREE.NearestFilter : THREE.LinearMipmapLinearFilter;
      t.magFilter = cerca ? THREE.NearestFilter : THREE.LinearFilter;
      t.generateMipmaps = !cerca; t.anisotropy = 8; return t;
    };
    const lee = img => { const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
      const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(img, 0, 0); return { w: c.width, h: c.height, d: g.getImageData(0, 0, c.width, c.height).data }; };
    return (datos[id] = {
      meta, alt: new Uint16Array(alt),
      tex: { orto: tex(orto, false, true), idon: tex(idon, false, false), ssp245: tex(c245, true, false), ssp585: tex(c585, true, false),
             f245: tex(f245, false, false), f585: tex(f585, false, false) },
      clases: { ssp245: lee(c245), ssp585: lee(c585) }
    });
  }

  /* ---------- escena ---------- */
  async function arranca() {
    escena = new THREE.Scene();
    render = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true });
    render.setPixelRatio(Math.min(devicePixelRatio, movil ? 1.5 : 2));
    camara = new THREE.PerspectiveCamera(38, 1, 0.05, 200);
    ctl = new OrbitControls(camara, lienzo);
    ctl.enableDamping = true; ctl.dampingFactor = 0.08; ctl.maxPolarAngle = Math.PI * 0.47; ctl.minDistance = 2; ctl.maxDistance = 60;
    ctl.autoRotate = !quieto; ctl.autoRotateSpeed = 0.35;
    lienzo.addEventListener("pointerdown", () => { ctl.autoRotate = false; }, { once: true });
    new ResizeObserver(ajusta).observe(caja); ajusta();
    await ponZona(estado.zona);
    caja.classList.add("listo");
    render.setAnimationLoop(dibuja);
  }
  function ajusta() { const r = caja.getBoundingClientRect(); render.setSize(r.width, r.height, false); camara.aspect = r.width / r.height; camara.updateProjectionMatrix(); }
  let reloj = 0;
  function dibuja(ms) { reloj = ms / 1000; if (mat) mat.uniforms.uReloj.value = reloj; ctl.update(); render.render(escena, camara); }

  async function ponZona(id) {
    caja.classList.remove("listo"); aviso.textContent = "Cargando el gemelo digital (3 MB)…"; barra.style.width = "0";
    const z = await (cargando = zona(id)); if (estado.zona !== id) return;
    const m = z.meta, paso = movil ? 2 : 1, W = Math.floor((m.w - 1) / paso) + 1, H = Math.floor((m.h - 1) / paso) + 1;
    const ancho = (m.w - 1) * m.res_m / 1000, alto = (m.h - 1) * m.res_m / 1000;   // km
    const escala = 16 / Math.max(ancho, alto);                                        // escena de 16 unidades
    const pos = new Float32Array(W * H * 3), uv = new Float32Array(W * H * 2);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const gi = Math.min(i * paso, m.w - 1), gj = Math.min(j * paso, m.h - 1), k = j * W + i;
      const zm = m.zmin + z.alt[gj * m.w + gi] / 65535 * (m.zmax - m.zmin);
      pos[k * 3] = (gi / (m.w - 1) - 0.5) * ancho * escala;
      pos[k * 3 + 1] = (zm - m.zmin) / 1000 * m.exag * escala;
      pos[k * 3 + 2] = (gj / (m.h - 1) - 0.5) * alto * escala;
      uv[k * 2] = gi / (m.w - 1); uv[k * 2 + 1] = 1 - gj / (m.h - 1);
    }
    const idx = new Uint32Array((W - 1) * (H - 1) * 6); let o = 0;
    for (let j = 0; j < H - 1; j++) for (let i = 0; i < W - 1; i++) { const a = j * W + i, b = a + 1, c = a + W, d = c + 1; idx.set([a, c, b, b, c, d], o); o += 6; }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    geo.setIndex(new THREE.BufferAttribute(idx, 1)); geo.computeVertexNormals(); geo.computeBoundingBox();
    if (malla) { escena.remove(malla); malla.geometry.dispose(); }
    const altoMax = (m.zmax - m.zmin) / 1000 * m.exag * escala;
    mat = material(z, altoMax);
    malla = new THREE.Mesh(geo, mat); escena.add(malla);
    z.escala = escala; z.altoMax = altoMax; z.ancho = ancho; z.alto = alto;
    encuadra(); aplica(); caja.classList.add("listo");
  }
  function encuadra() {
    const f = Math.max(1, 1.45 / camara.aspect);   // pantallas verticales: alejar para que quepa el ancho
    camara.position.set(-8.5 * f, 11 * f, 16.5 * f); ctl.target.set(0, 0.4, 0.6); ctl.update();
  }

  function material(z, altoMax) {
    return new THREE.ShaderMaterial({
      uniforms: {
        uOrto: { value: z.tex.orto }, uIdon: { value: z.tex.idon }, uClase: { value: z.tex.ssp585 }, uNiebla: { value: z.tex.f585 },
        uCapa: { value: 2 }, uT: { value: 4 }, uNieblaOn: { value: 1 }, uAltoMax: { value: altoMax }, uReloj: { value: 0 },
        uSol: { value: new THREE.Vector3(-0.55, 0.62, -0.56).normalize() }
      },
      vertexShader: `varying vec2 vUv; varying vec3 vN; varying float vH; varying vec3 vP;
        void main(){ vUv = uv; vN = normalize(normal); vH = position.y; vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `precision highp float;
        uniform sampler2D uOrto, uIdon, uClase, uNiebla; uniform float uCapa, uT, uNieblaOn, uAltoMax, uReloj; uniform vec3 uSol;
        varying vec2 vUv; varying vec3 vN; varying float vH; varying vec3 vP;
        vec3 viridis(float t){ t = clamp(t,0.,1.);
          vec3 c0=vec3(.267,.005,.329), c1=vec3(.229,.322,.546), c2=vec3(.128,.567,.551), c3=vec3(.369,.789,.383), c4=vec3(.993,.906,.144);
          return t<.25?mix(c0,c1,t/.25):t<.5?mix(c1,c2,(t-.25)/.25):t<.75?mix(c2,c3,(t-.5)/.25):mix(c3,c4,(t-.75)/.25); }
        vec3 srgb2lin(vec3 c){ return pow(c, vec3(2.2)); }
        float ruido(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
        float suave(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
          return mix(mix(ruido(i),ruido(i+vec2(1,0)),f.x), mix(ruido(i+vec2(0,1)),ruido(i+vec2(1,1)),f.x), f.y); }
        void main(){
          vec3 base = texture2D(uOrto, vUv).rgb;
          vec3 col = base;
          if (uCapa > 0.5 && uCapa < 1.5) {
            float s = texture2D(uIdon, vUv).r; col = mix(base*0.55, srgb2lin(viridis(s)), 0.78);
          } else if (uCapa > 1.5) {
            float c = floor(texture2D(uClase, vUv).r * 255. / 40. + 0.5) - 1.;   // -1 no adecuado, 0..3 periodo, 4 refugio
            vec3 C[5]; C[0]=srgb2lin(vec3(.84,.19,.12)); C[1]=srgb2lin(vec3(.99,.55,.23)); C[2]=srgb2lin(vec3(.99,.85,.35)); C[3]=srgb2lin(vec3(.70,.40,.75)); C[4]=srgb2lin(vec3(.13,.40,.67));
            if (c > -0.5) {
              int k = int(c);
              vec3 hoy = srgb2lin(vec3(.20,.62,.32));                           // habitat actual (verde)
              float perdido = (c < 3.5) ? clamp(uT - c, 0., 1.) : 0.;   // se tiñe cuando el tiempo pasa su periodo
              vec3 tinte = (c < 3.5) ? mix(hoy, C[k], perdido) : mix(hoy, C[4], clamp(uT - 3., 0., 1.));
              col = mix(base, tinte, 0.66);
            } else col = base * 0.82;
          }
          vec3 n = normalize(vN);
          float luz = 0.42 + 0.78 * max(dot(n, uSol), 0.) + 0.12 * n.y;
          col *= luz;
          if (uNieblaOn > 0.5) {
            float f = texture2D(uNiebla, vUv).r;
            float h = clamp(vH / uAltoMax, 0., 1.);
            float mov = suave(vP.xz * 0.9 + vec2(uReloj * 0.05, uReloj * 0.03)) * 0.5 + suave(vP.xz * 2.3 - uReloj * 0.04) * 0.5;
            float a = f * pow(1. - h, 1.6) * (0.55 + 0.45 * mov) * 0.95;
            col = mix(col, srgb2lin(vec3(.90,.93,.97)), clamp(a, 0., 0.88));
          }
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`
    });
  }

  /* ---------- estado ---------- */
  const fmt = (v, d = 0) => v.toLocaleString("es-ES", { maximumFractionDigits: d, minimumFractionDigits: d });
  function aplica() {
    const z = datos[estado.zona]; if (!z || !mat) return;
    const u = mat.uniforms;
    u.uCapa.value = { orto: 0, idoneidad: 1, perdida: 2 }[estado.capa];
    u.uClase.value = z.tex[estado.ssp]; u.uNiebla.value = estado.ssp === "ssp245" ? z.tex.f245 : z.tex.f585;
    u.uT.value = estado.t; u.uNieblaOn.value = estado.niebla && estado.capa === "perdida" ? 1 : 0;
    bZona.forEach(b => b.setAttribute("aria-pressed", b.dataset.ttZona === estado.zona));
    bCapa.forEach(b => b.setAttribute("aria-pressed", b.dataset.ttCapa === estado.capa));
    bSsp.forEach(b => b.setAttribute("aria-pressed", b.dataset.ttSsp === estado.ssp));
    caja.dataset.capa = estado.capa;
    leyendas.forEach(l => l.hidden = l.dataset.ttLeyenda !== estado.capa);
    tRotulo.textContent = PERIODOS[Math.round(estado.t)];
    const m = z.meta, cl = m.classes_km2[estado.ssp], total = Object.values(cl).reduce((a, b) => a + b, 0);
    const queda = ["lost_2030", "lost_2050", "lost_2070", "lost_2090", "refugium"].slice(Math.round(estado.t)).reduce((a, k) => a + cl[k], 0);
    const nieb = (m.mess_neg_mean[estado.ssp] || 0) * 100;
    const esc = estado.ssp === "ssp245" ? "SSP2-4.5" : "SSP5-8.5";
    resumen.innerHTML = estado.capa === "perdida"
      ? `<i>${m.species}</i> · ${esc} · ${PERIODOS[Math.round(estado.t)]}: queda el <b>${fmt(100 * queda / total)} %</b> del hábitat actual (${fmt(queda)} de ${fmt(total)} km²)` +
        (estado.niebla ? ` · niebla: <b>${fmt(nieb)} %</b> de la zona` : "")
      : estado.capa === "idoneidad" ? `<i>${m.species}</i> · idoneidad climática actual (Random Forest); adecuado por encima de ${fmt(m.gamma, 2)}`
      : `${m.name} · MDT25 (IGN) y ortofoto PNOA`;
  }

  bZona.forEach(b => b.addEventListener("click", () => { if (estado.zona === b.dataset.ttZona) return; estado.zona = b.dataset.ttZona; ponZona(estado.zona); aplica(); }));
  bCapa.forEach(b => b.addEventListener("click", () => { estado.capa = b.dataset.ttCapa; aplica(); }));
  bSsp.forEach(b => b.addEventListener("click", () => { estado.ssp = b.dataset.ttSsp; aplica(); }));
  tiempo.addEventListener("input", () => { para(); estado.t = +tiempo.value; aplica(); });
  niebla.addEventListener("change", () => { estado.niebla = niebla.checked; aplica(); });
  reinicia.addEventListener("click", encuadra);
  function para() { if (anima) { cancelAnimationFrame(anima); anima = null; play.setAttribute("aria-pressed", "false"); play.textContent = "▶"; } }
  play.addEventListener("click", () => {
    if (anima) return para();
    if (estado.capa !== "perdida") { estado.capa = "perdida"; }
    estado.t = 0; play.setAttribute("aria-pressed", "true"); play.textContent = "❚❚";
    const t0 = performance.now();
    const paso = now => { estado.t = Math.min(4, (now - t0) / 1600); tiempo.value = estado.t; aplica(); anima = estado.t < 4 ? requestAnimationFrame(paso) : (para(), null); };
    anima = requestAnimationFrame(paso);
  });

  /* ---------- dato bajo el puntero ---------- */
  const rayo = new THREE.Raycaster(), p = new THREE.Vector2();
  lienzo.addEventListener("pointermove", e => {
    if (!malla || e.buttons) { dato.hidden = true; return; }
    const r = lienzo.getBoundingClientRect(); p.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    rayo.setFromCamera(p, camara); const hit = rayo.intersectObject(malla)[0];
    if (!hit) { dato.hidden = true; return; }
    const z = datos[estado.zona], m = z.meta;
    const alt = m.zmin + hit.point.y / z.escala * 1000 / m.exag;
    let txt = `${fmt(alt)} m`;
    if (estado.capa === "perdida") {
      const cl = z.clases[estado.ssp], u = hit.uv;
      const x = Math.min(cl.w - 1, Math.floor(u.x * cl.w)), y = Math.min(cl.h - 1, Math.floor((1 - u.y) * cl.h));
      const c = Math.round(cl.d[(y * cl.w + x) * 4] / 40) - 1;
      txt += c < 0 ? " · no adecuado hoy" : ` · ${CLASES[c]}`;
    }
    dato.textContent = txt; dato.hidden = false;
    dato.style.left = e.clientX - r.left + 14 + "px"; dato.style.top = e.clientY - r.top + 14 + "px";
  });
  lienzo.addEventListener("pointerleave", () => { dato.hidden = true; });
  aplica();
}
