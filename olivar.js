/* Olivar sintético en nube de puntos, coloreado según el sensor elegido, con ficha de cada individuo. */
(function () {
  const lienzo = document.getElementById("olivar");
  const textoSensor = document.getElementById("sensor-texto");
  const leyenda = document.getElementById("leyenda");
  const ficha = document.getElementById("ficha");
  const botones = [...document.querySelectorAll("[data-sensor]")];
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const TEXTOS = {
    rgb: "Color real. Es la base de los ortomosaicos y de los modelos 3D.",
    ms: "Vigor de cada copa, a partir de índices como NDVI y NDRE.",
    term: "Temperatura de copa y suelo. Delata el estrés hídrico.",
    lidar: "Altura y estructura del cultivo y del terreno.",
    hiper: "Cientos de bandas para separar materiales que a simple vista parecen iguales.",
  };
  const css = t => t.map(h => "#" + h.toString(16).padStart(6, "0")).join(",");
  const NDVI_H = [0xa50026, 0xd73027, 0xfdae61, 0xd9ef8b, 0x66bd63, 0x1a9850, 0x006837];
  const TERM_H = [0x2c115f, 0x721f81, 0xb73779, 0xf1605d, 0xfeae77, 0xf7d13d];
  const ALT_H = [0x253494, 0x2c7fb8, 0x41b6c4, 0x7fcdbb, 0xfecc5c, 0xe31a1c];
  const LEY = {
    rgb: "",
    ms: `<span>Bajo vigor</span><span class="rampa" style="background:linear-gradient(90deg,${css(NDVI_H)})"></span><span>Alto vigor</span>`,
    term: `<span>Más frío</span><span class="rampa" style="background:linear-gradient(90deg,${css(TERM_H)})"></span><span>Más calor</span>`,
    lidar: `<span>Suelo</span><span class="rampa" style="background:linear-gradient(90deg,${css(ALT_H)})"></span><span>Copa alta</span>`,
    hiper: [["#1b7837", "Variedad A"], ["#c51b7d", "Variedad B"], ["#e08214", "Estrés"], ["#4d9221", "Cubierta"], ["#b8a26a", "Suelo 1"], ["#8073ac", "Suelo 2"]].map(([c, t]) => `<span class="clase"><i style="background:${c}"></i>${t}</span>`).join(""),
  };

  const gl = lienzo.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false });

  function elegir(sensor) {
    botones.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.sensor === sensor)));
    textoSensor.textContent = TEXTOS[sensor];
    leyenda.innerHTML = LEY[sensor];
    if (gl) cambiaColor(sensor);
  }
  botones.forEach(b => b.addEventListener("click", () => elegir(b.dataset.sensor)));
  textoSensor.textContent = TEXTOS.rgb;

  if (!gl) { lienzo.classList.add("sin-webgl"); return; }

  /* Generador con semilla: el olivar es siempre el mismo. */
  let semilla = 20261110;
  const az = () => { semilla |= 0; semilla = semilla + 0x6D2B79F5 | 0; let t = Math.imul(semilla ^ semilla >>> 15, 1 | semilla); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const azr = (a, b) => a + (b - a) * az();

  const onda = (x, y, f, d) => Math.sin(x * f + d) * Math.cos(y * f * 1.3 - d * 0.7);
  const relieve = (x, y) => 0.14 * onda(x, y, 0.22, 1.1) + 0.05 * onda(x, y, 0.61, 2.7) + 0.018 * onda(x, y, 2.3, 0.4);
  const vigorEn = (x, y) => Math.min(1, Math.max(0, 0.62 + 0.28 * onda(x, y, 0.27, 0.8) + 0.14 * onda(x, y, 0.71, 3.1)));

  const RADIO = 13.5;
  const SOL = norm([0.55, -0.45, 0.7]);
  function norm(v) { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; }

  const pequeño = Math.min(innerWidth, innerHeight) < 700;
  const PUNTOS_COPA = pequeño ? 240 : 480;
  const PUNTOS_SUELO = pequeño ? 34000 : 85000;

  /* Marco de plantación ligeramente irregular */
  const olivos = [];
  for (let i = -8; i <= 8; i++) for (let j = -8; j <= 8; j++) {
    const x = (i + (j & 1) * 0.5) * 1.7 + azr(-0.13, 0.13), y = j * 1.55 + azr(-0.13, 0.13);
    if (Math.hypot(x, y) > RADIO - 0.6 + azr(-0.4, 0.4)) continue;
    const sano = vigorEn(x, y), estres = az() < 0.08;
    const v = estres ? azr(0.05, 0.28) : sano;
    const r = 0.42 + 0.26 * v + azr(-0.05, 0.05);
    olivos.push({ num: olivos.length + 1, x, y, z: relieve(x, y), v, r, variedad: az() < 0.32 ? 1 : 0, estres, alto: 0,
      lobulos: Array.from({ length: 5 + (az() * 4 | 0) }, () => {
        const a = azr(0, 6.283), d = azr(0.1, 0.62) * r;
        return { x: Math.cos(a) * d, y: Math.sin(a) * d, z: azr(0.62, 1.05) * r + 0.42, r: r * azr(0.48, 0.74) };
      }) });
  }

  const n = olivos.length * PUNTOS_COPA + PUNTOS_SUELO;
  const pos = new Float32Array(n * 3);
  const C = { rgb: new Uint8Array(n * 3), ms: new Uint8Array(n * 3), term: new Uint8Array(n * 3), lidar: new Uint8Array(n * 3), hiper: new Uint8Array(n * 3) };

  const hex = h => [h >> 16 & 255, h >> 8 & 255, h & 255];
  const mezcla = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  function rampa(tabla, t) {
    t = Math.min(0.9999, Math.max(0, t)) * (tabla.length - 1);
    const i = t | 0;
    return mezcla(tabla[i], tabla[i + 1], t - i);
  }
  const NDVI = NDVI_H.map(hex), TERM = TERM_H.map(hex), ALT = ALT_H.map(hex);
  const pinta = (m, i, c, k = 1) => { C[m][i * 3] = Math.min(255, c[0] * k); C[m][i * 3 + 1] = Math.min(255, c[1] * k); C[m][i * 3 + 2] = Math.min(255, c[2] * k); };

  let k = 0;
  const altMax = 2.0;

  for (const o of olivos) {
    for (let p = 0; p < PUNTOS_COPA; p++, k++) {
      let x, y, z, luz, tronco = p < PUNTOS_COPA * 0.03;
      if (tronco) {
        const a = azr(0, 6.283), h = azr(0, 0.5), r = 0.05 + 0.03 * (0.5 - h);
        x = o.x + Math.cos(a) * r; y = o.y + Math.sin(a) * r; z = o.z + h; luz = 0.55;
      } else {
        const l = o.lobulos[az() * o.lobulos.length | 0];
        const u = azr(-1, 1), a = azr(0, 6.283), s = Math.sqrt(1 - u * u);
        const nx = s * Math.cos(a), ny = s * Math.sin(a), nz = u, rr = l.r * azr(0.86, 1.04);
        x = o.x + l.x + nx * rr; y = o.y + l.y + ny * rr; z = o.z + l.z + nz * rr * 0.86;
        if (z < o.z + 0.3) z = o.z + 0.3 + az() * 0.2;
        luz = Math.max(0.3, 0.55 + 0.6 * (nx * SOL[0] + ny * SOL[1] + nz * SOL[2])) * azr(0.82, 1.14);
        if (z - o.z > o.alto) o.alto = z - o.z;
      }
      pos.set([x, y, z], k * 3);
      const verde = mezcla(hex(0x46572a), hex(0x8f9d5f), az());
      pinta("rgb", k, tronco ? hex(0x5c4a38) : mezcla(verde, hex(0x9c9457), o.estres ? 0.55 : 0), luz * 1.1);
      pinta("ms", k, rampa(NDVI, tronco ? 0.25 : 0.46 + o.v * 0.54 + azr(-0.03, 0.03)));
      pinta("term", k, rampa(TERM, (tronco ? 0.5 : 0.12 + (1 - o.v) * 0.5) + (luz - 0.7) * 0.1));
      pinta("lidar", k, rampa(ALT, Math.max(0, z) / altMax));
      pinta("hiper", k, hex(tronco ? 0x6b5a3e : o.estres ? 0xe08214 : o.variedad ? 0xc51b7d : 0x1b7837), Math.min(1.2, luz + 0.3));
    }
  }

  /* Suelo: tierra desnuda con franjas de cubierta vegetal en las calles */
  for (let p = 0; p < PUNTOS_SUELO; p++, k++) {
    const a = azr(0, 6.283), d = Math.sqrt(az()) * RADIO;
    const x = Math.cos(a) * d, y = Math.sin(a) * d, z = relieve(x, y);
    pos.set([x, y, z], k * 3);
    const fila = Math.abs(((y / 1.55 % 1) + 1) % 1 - 0.5);
    const cubierta = fila < 0.2 + 0.05 * onda(x, y, 1.7, 0.2) && onda(x, y, 0.33, 2) > -0.42;
    let sombra = 1;
    for (const o of olivos) {
      const dx = x - (o.x + 0.42), dy = y - (o.y - 0.32);
      if (dx * dx + dy * dy < (o.r * 1.1) * (o.r * 1.1)) { sombra = 0.55; break; }
    }
    const tono = azr(0.86, 1.12) * sombra;
    pinta("rgb", k, cubierta ? mezcla(hex(0x8f9b49), hex(0xb0a85c), az()) : mezcla(hex(0xb4845c), hex(0xc99c72), az()), tono);
    pinta("ms", k, rampa(NDVI, (cubierta ? 0.5 : 0.1) + azr(-0.06, 0.06)));
    pinta("term", k, rampa(TERM, (cubierta ? 0.66 : 0.9) * (sombra < 1 ? 0.62 : 1) + azr(-0.03, 0.03)));
    pinta("lidar", k, rampa(ALT, (z + 0.2) / altMax));
    const suelo2 = onda(x, y, 0.42, 1.9) > 0.1;
    pinta("hiper", k, hex(cubierta ? 0x4d9221 : suelo2 ? 0xb8a26a : 0x8073ac), tono);
  }

  /* WebGL */
  const VS = `attribute vec3 p; attribute vec3 a; attribute vec3 b; uniform mat4 m; uniform float t, s; varying vec3 c;
    void main(){ gl_Position = m * vec4(p, 1.0); gl_PointSize = s / gl_Position.w; c = mix(a, b, t) / 255.0; }`;
  const FS = `precision mediump float; varying vec3 c; void main(){ gl_FragColor = vec4(c, 1.0); }`;
  const sh = (tipo, src) => { const o = gl.createShader(tipo); gl.shaderSource(o, src); gl.compileShader(o); return o; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog); gl.useProgram(prog);

  const buf = (nombre, datos, tipo, norma) => {
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, datos, gl.DYNAMIC_DRAW);
    const l = gl.getAttribLocation(prog, nombre); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, 3, tipo, norma, 0, 0);
    return b;
  };
  buf("p", pos, gl.FLOAT, false);
  const bufA = buf("a", C.rgb, gl.UNSIGNED_BYTE, false);
  const bufB = buf("b", C.rgb, gl.UNSIGNED_BYTE, false);
  const uM = gl.getUniformLocation(prog, "m"), uT = gl.getUniformLocation(prog, "t"), uS = gl.getUniformLocation(prog, "s");
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);

  let actual = "rgb", t = 1, azimut = -0.55, elev = 0.62, sucio = true, M = null;

  function cambiaColor(sensor) {
    if (sensor === actual) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufA); gl.bufferData(gl.ARRAY_BUFFER, C[actual], gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufB); gl.bufferData(gl.ARRAY_BUFFER, C[sensor], gl.DYNAMIC_DRAW);
    actual = sensor; t = quieto ? 1 : 0; sucio = true;
  }

  function matriz(ancho, alto) {
    const asp = ancho / alto, f = 1 / Math.tan(0.36), near = 1, far = 120;
    const ancha = asp > 1.35;
    const dist = ancha ? 28 : 31;
    const ca = Math.cos(azimut), sa = Math.sin(azimut), ce = Math.cos(elev), se = Math.sin(elev);
    /* Vista: giro en Z, inclinación y alejamiento. En pantalla ancha el olivar va a la derecha para dejar sitio al texto. */
    const dx = ancha ? 6.5 : 0, dy = ancha ? -0.2 : -0.3;
    const V = [ca, sa * se, -sa * ce, 0, -sa, ca * se, -ca * ce, 0, 0, ce, se, 0, dx, dy, -dist, 1];
    const fx = asp > 1 ? f / asp : f, fy = asp > 1 ? f : f * asp;
    const P = [fx, 0, 0, 0, 0, fy, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, 2 * far * near / (near - far), 0];
    const R = new Float32Array(16);
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
      let s = 0; for (let e = 0; e < 4; e++) s += P[e * 4 + r] * V[c * 4 + e];
      R[c * 4 + r] = s;
    }
    return R;
  }

  function ajusta() {
    const r = lienzo.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    const w = Math.round(r.width * d), h = Math.round(r.height * d);
    if (lienzo.width !== w || lienzo.height !== h) { lienzo.width = w; lienzo.height = h; gl.viewport(0, 0, w, h); sucio = true; }
  }

  /* Ficha: busca el olivo cuya copa queda más cerca del puntero */
  function mostrarFicha(cx, cy) {
    if (!M) return;
    const r = lienzo.getBoundingClientRect(), px = cx - r.left, py = cy - r.top;
    let mejor = null, dm = Infinity;
    for (const o of olivos) {
      const z = o.z + 0.9;
      const X = M[0] * o.x + M[4] * o.y + M[8] * z + M[12], Y = M[1] * o.x + M[5] * o.y + M[9] * z + M[13], W = M[3] * o.x + M[7] * o.y + M[11] * z + M[15];
      const sx = (X / W + 1) / 2 * r.width, sy = (1 - Y / W) / 2 * r.height;
      const d = Math.hypot(sx - px, sy - py);
      if (d < dm) { dm = d; mejor = { o, sx, sy }; }
    }
    if (!mejor || dm > Math.max(16, r.height * 0.05)) { ficha.hidden = true; return; }
    const { o, sx, sy } = mejor;
    const panel = lienzo.parentElement.getBoundingClientRect();
    const fila = (a, b) => `<div><span>${a}</span><span>${b}</span></div>`;
    ficha.innerHTML = `<b>Individuo ${o.num}</b>` +
      fila("Altura", (o.alto * 2.1).toLocaleString("es", { maximumFractionDigits: 1 }) + " m") +
      fila("Diámetro de copa", (o.r * 6.4).toLocaleString("es", { maximumFractionDigits: 1 }) + " m") +
      fila("NDVI", (0.42 + o.v * 0.42).toLocaleString("es", { minimumFractionDigits: 2, maximumFractionDigits: 2 })) +
      fila("Temperatura", (24 + (1 - o.v) * 9).toLocaleString("es", { maximumFractionDigits: 1 }) + " °C");
    ficha.hidden = false;
    const fw = ficha.offsetWidth / 2 + 8;
    ficha.style.left = Math.min(panel.width - fw, Math.max(fw, sx + r.left - panel.left)) + "px";
    ficha.style.top = Math.max(ficha.offsetHeight + 22, sy + r.top - panel.top) + "px";
  }

  let visible = true, antes = 0, arrastre = null, lentos = 0, autogiro = !quieto;
  new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(lienzo);

  lienzo.addEventListener("pointerdown", e => {
    arrastre = { x: e.clientX, y: e.clientY, a: azimut, el: elev, movido: false, raton: e.pointerType === "mouse" };
    lienzo.classList.add("girando"); lienzo.setPointerCapture(e.pointerId);
  });
  lienzo.addEventListener("pointermove", e => {
    if (arrastre) {
      if (Math.hypot(e.clientX - arrastre.x, e.clientY - arrastre.y) > 5) { arrastre.movido = true; ficha.hidden = true; }
      azimut = arrastre.a + (e.clientX - arrastre.x) * 0.008;
      if (arrastre.raton) elev = Math.min(1.25, Math.max(0.3, arrastre.el + (e.clientY - arrastre.y) * 0.004));
      sucio = true;
    } else if (e.pointerType === "mouse") mostrarFicha(e.clientX, e.clientY);
  });
  lienzo.addEventListener("pointerleave", () => { if (!arrastre) ficha.hidden = true; });
  const suelta = e => {
    if (arrastre && !arrastre.movido && e.type === "pointerup") mostrarFicha(e.clientX, e.clientY);
    arrastre = null; lienzo.classList.remove("girando");
  };
  lienzo.addEventListener("pointerup", suelta);
  lienzo.addEventListener("pointercancel", suelta);
  addEventListener("resize", () => { sucio = true; });

  function cuadro(ahora) {
    requestAnimationFrame(cuadro);
    const real = (ahora - antes) / 1000, dt = Math.min(0.05, real); antes = ahora;
    if (!visible || document.hidden) return;
    /* En equipos sin potencia gráfica se detiene el giro automático */
    lentos = real > 0.06 && real < 1 ? lentos + 1 : 0;
    if (lentos > 12) autogiro = false;
    if (autogiro && !arrastre && ficha.hidden) { azimut += dt * 0.035; sucio = true; }
    if (t < 1) { t = Math.min(1, t + dt / 0.45); sucio = true; }
    if (!sucio) return;
    sucio = false;
    ajusta();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    M = matriz(lienzo.width, lienzo.height);
    gl.uniformMatrix4fv(uM, false, M);
    gl.uniform1f(uT, t);
    gl.uniform1f(uS, Math.max(1.5, lienzo.height * (pequeño ? 0.17 : 0.072)));
    gl.drawArrays(gl.POINTS, 0, n);
  }
  requestAnimationFrame(cuadro);
})();
