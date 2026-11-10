/* Portada: nube de puntos real de una finca de olivar (fotogrametría, multiespectral, LiDAR y copas segmentadas). */
(function () {
  const lienzo = document.getElementById("olivar");
  const textoSensor = document.getElementById("sensor-texto");
  const leyenda = document.getElementById("leyenda");
  const ficha = document.getElementById("ficha");
  const cargando = document.getElementById("cargando");
  const botones = [...document.querySelectorAll("[data-sensor]")];
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const TEXTOS = {
    rgb: "Color real de la nube fotogramétrica del vuelo.",
    ndvi: "Vigor de la vegetación, medido con cámara multiespectral.",
    ndre: "Índice de borde rojo, sensible a la clorofila de la copa.",
    lidar: "Altura medida con láser sobre el suelo.",
    ids: "La inteligencia artificial separa cada olivo del resto.",
  };
  const css = t => t.map(h => "#" + h.toString(16).padStart(6, "0")).join(",");
  const NDVI_H = [0xa50026, 0xf46d43, 0xfee08b, 0xa6d96a, 0x1a9850];
  const ALT_H = [0x3b4cc0, 0x2ab7ca, 0xa8e05f, 0xfdc030, 0xf0304f];
  const rampaCss = (t, a, b) => `<span>${a}</span><span class="rampa" style="background:linear-gradient(90deg,${css(t)})"></span><span>${b}</span>`;
  const LEY = { rgb: "", ndvi: rampaCss(NDVI_H, "0", "0,9"), ndre: rampaCss(NDVI_H, "0", "0,5"), lidar: rampaCss(ALT_H, "0 m", "6 m"), ids: "" };

  const gl = lienzo.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false });
  let cambiaColor = null;

  function elegir(sensor) {
    botones.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.sensor === sensor)));
    textoSensor.textContent = TEXTOS[sensor];
    leyenda.innerHTML = LEY[sensor];
    if (cambiaColor) cambiaColor(sensor);
  }
  botones.forEach(b => b.addEventListener("click", () => elegir(b.dataset.sensor)));
  textoSensor.textContent = TEXTOS.rgb;

  const sinVisor = () => { lienzo.classList.add("sin-webgl"); if (cargando) cargando.hidden = true; };
  if (!gl) { sinVisor(); return; }

  Promise.all([fetch("assets/nube/parcela.json").then(r => { if (!r.ok) throw 0; return r.json(); }), fetch("assets/nube/parcela.bin").then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); })])
    .then(([meta, datos]) => iniciar(meta, datos))
    .catch(sinVisor);

  function iniciar(meta, datos) {
    const { n, nl, despl, fichas } = meta;
    const i16 = (k, c) => new Int16Array(datos, despl[k], c), u8 = (k, c) => new Uint8Array(datos, despl[k], c);
    const x = i16(0, n), y = i16(1, n), z = i16(2, n), r = u8(3, n), g = u8(4, n), b = u8(5, n), ndvi = u8(6, n), ndre = u8(7, n), ids = new Uint16Array(datos, despl[8], n);
    const lx = i16(10, nl), ly = i16(11, nl), lz = i16(12, nl), lalt = u8(13, nl);

    const hex = h => [h >> 16 & 255, h >> 8 & 255, h & 255];
    const NDVI = NDVI_H.map(hex), ALT = ALT_H.map(hex);
    function rampa(tabla, t) {
      t = Math.min(0.9999, Math.max(0, t)) * (tabla.length - 1);
      const i = t | 0, f = t - i, a = tabla[i], c = tabla[i + 1];
      return [a[0] + (c[0] - a[0]) * f, a[1] + (c[1] - a[1]) * f, a[2] + (c[2] - a[2]) * f];
    }
    function tono(h) { /* color vivo y estable para cada individuo */
      const a = h * 137.508 % 360 / 60, c = 215, m = 40, v = c * (1 - Math.abs(a % 2 - 1));
      const t = [[c, v, 0], [v, c, 0], [0, c, v], [0, v, c], [v, 0, c], [c, 0, v]][a | 0];
      return [t[0] + m, t[1] + m, t[2] + m];
    }

    const pos = new Int16Array(n * 3), posL = new Int16Array(nl * 3);
    const C = { rgb: new Uint8Array(n * 3), ndvi: new Uint8Array(n * 3), ndre: new Uint8Array(n * 3), ids: new Uint8Array(n * 3) };
    const colL = new Uint8Array(nl * 3);
    for (let i = 0, j = 0; i < n; i++, j += 3) {
      pos[j] = x[i]; pos[j + 1] = y[i]; pos[j + 2] = z[i];
      C.rgb[j] = r[i]; C.rgb[j + 1] = g[i]; C.rgb[j + 2] = b[i];
      C.ndvi.set(rampa(NDVI, ndvi[i] / 255), j);
      C.ndre.set(rampa(NDVI, ndre[i] / 255), j);
      if (ids[i]) C.ids.set(tono(ids[i]), j);
      else { const v = (r[i] + g[i] + b[i]) / 3 * 0.42 + 26; C.ids[j] = v; C.ids[j + 1] = v; C.ids[j + 2] = v; }
    }
    for (let i = 0, j = 0; i < nl; i++, j += 3) {
      posL[j] = lx[i]; posL[j + 1] = ly[i]; posL[j + 2] = lz[i];
      colL.set(rampa(ALT, lalt[i] / 255), j);
    }

    const VS = `attribute vec3 p; attribute vec3 a; attribute vec3 b; uniform mat4 m; uniform float t, s; varying vec3 c;
      void main(){ gl_Position = m * vec4(p * 0.0016, 1.0); gl_PointSize = s / gl_Position.w; c = mix(a, b, t) / 255.0; }`;
    const FS = `precision mediump float; varying vec3 c; void main(){ gl_FragColor = vec4(c, 1.0); }`;
    const sh = (tipo, src) => { const o = gl.createShader(tipo); gl.shaderSource(o, src); gl.compileShader(o); return o; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog); gl.useProgram(prog);
    const crea = d => { const o = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, o); gl.bufferData(gl.ARRAY_BUFFER, d, gl.DYNAMIC_DRAW); return o; };
    const bP = crea(pos), bPL = crea(posL), bCL = crea(colL), bA = crea(C.rgb), bB = crea(C.rgb);
    const lp = gl.getAttribLocation(prog, "p"), la = gl.getAttribLocation(prog, "a"), lb = gl.getAttribLocation(prog, "b");
    [lp, la, lb].forEach(l => gl.enableVertexAttribArray(l));
    const uM = gl.getUniformLocation(prog, "m"), uT = gl.getUniformLocation(prog, "t"), uS = gl.getUniformLocation(prog, "s");
    gl.enable(gl.DEPTH_TEST); gl.clearColor(0, 0, 0, 0);

    const pequeño = Math.min(innerWidth, innerHeight) < 700;
    const cuenta = pequeño ? n >> 1 : n, cuentaL = pequeño ? nl >> 1 : nl;
    let actual = "rgb", t = 1, azimut = -0.5, elev = 0.5, sucio = true, M = null;

    cambiaColor = sensor => {
      if (sensor === actual) return;
      if (sensor !== "lidar" && actual !== "lidar") {
        gl.bindBuffer(gl.ARRAY_BUFFER, bA); gl.bufferData(gl.ARRAY_BUFFER, C[actual], gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, bB); gl.bufferData(gl.ARRAY_BUFFER, C[sensor], gl.DYNAMIC_DRAW);
        t = quieto ? 1 : 0;
      } else {
        if (sensor !== "lidar") { gl.bindBuffer(gl.ARRAY_BUFFER, bB); gl.bufferData(gl.ARRAY_BUFFER, C[sensor], gl.DYNAMIC_DRAW); }
        t = 1;
      }
      actual = sensor; ficha.hidden = sensor === "lidar" ? true : ficha.hidden; sucio = true;
    };

    function matriz(ancho, alto) {
      const asp = ancho / alto, f = 1 / Math.tan(0.36), near = 1, far = 120;
      const ancha = asp > 1.2;
      const dist = ancha ? 27 : 33;
      const ca = Math.cos(azimut), sa = Math.sin(azimut), ce = Math.cos(elev), se = Math.sin(elev);
      const dx = ancha ? 8.2 : 0, dy = ancha ? -1.2 : -0.3;
      const V = [ca, sa * se, -sa * ce, 0, -sa, ca * se, -ca * ce, 0, 0, ce, se, 0, dx, dy, -dist, 1];
      const fx = asp > 1 ? f / asp : f, fy = asp > 1 ? f : f * asp;
      const P = [fx, 0, 0, 0, 0, fy, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, 2 * far * near / (near - far), 0];
      const R = new Float32Array(16);
      for (let c = 0; c < 4; c++) for (let e = 0; e < 4; e++) { let s = 0; for (let k = 0; k < 4; k++) s += P[k * 4 + e] * V[c * 4 + k]; R[c * 4 + e] = s; }
      return R;
    }
    function ajusta() {
      const q = lienzo.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      const w = Math.round(q.width * d), h = Math.round(q.height * d);
      if (lienzo.width !== w || lienzo.height !== h) { lienzo.width = w; lienzo.height = h; gl.viewport(0, 0, w, h); }
    }

    const num = (v, d) => v.toLocaleString("es", { minimumFractionDigits: d, maximumFractionDigits: d });
    const ESC = 0.16;
    function mostrarFicha(cx, cy) {
      if (!M) return;
      const q = lienzo.getBoundingClientRect(), px = cx - q.left, py = cy - q.top;
      let mejor = null, dm = Infinity;
      for (const o of fichas) {
        const a = o.x * ESC, c = o.y * ESC, e = o.z * ESC;
        const X = M[0] * a + M[4] * c + M[8] * e + M[12], Y = M[1] * a + M[5] * c + M[9] * e + M[13], W = M[3] * a + M[7] * c + M[11] * e + M[15];
        const sx = (X / W + 1) / 2 * q.width, sy = (1 - Y / W) / 2 * q.height, d = Math.hypot(sx - px, sy - py);
        if (d < dm) { dm = d; mejor = { o, sx, sy }; }
      }
      if (!mejor || dm > Math.max(18, q.height * 0.05)) { ficha.hidden = true; return; }
      const { o, sx, sy } = mejor, panel = lienzo.parentElement.getBoundingClientRect();
      const fila = (a, v) => `<div><span>${a}</span><span>${v}</span></div>`;
      ficha.innerHTML = `<b>Individuo ${o.n}</b>` + fila("Altura", num(o.alt, 1) + " m") + fila("Diámetro de copa", num(o.copa, 1) + " m") + fila("NDVI", num(o.ndvi, 2)) + fila("NDRE", num(o.ndre, 2));
      ficha.hidden = false;
      const fw = ficha.offsetWidth / 2 + 8;
      ficha.style.left = Math.min(panel.width - fw, Math.max(fw, sx + q.left - panel.left)) + "px";
      ficha.style.top = Math.max(ficha.offsetHeight + 22, sy + q.top - panel.top) + "px";
    }

    let visible = true, antes = 0, arrastre = null, lentos = 0, autogiro = !quieto;
    new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(lienzo);
    lienzo.addEventListener("pointerdown", e => { arrastre = { x: e.clientX, y: e.clientY, a: azimut, el: elev, movido: false, raton: e.pointerType === "mouse" }; lienzo.classList.add("girando"); lienzo.setPointerCapture(e.pointerId); });
    lienzo.addEventListener("pointermove", e => {
      if (arrastre) {
        if (Math.hypot(e.clientX - arrastre.x, e.clientY - arrastre.y) > 5) { arrastre.movido = true; ficha.hidden = true; }
        azimut = arrastre.a + (e.clientX - arrastre.x) * 0.008;
        if (arrastre.raton) elev = Math.min(1.3, Math.max(0.25, arrastre.el + (e.clientY - arrastre.y) * 0.004));
        sucio = true;
      } else if (e.pointerType === "mouse") mostrarFicha(e.clientX, e.clientY);
    });
    lienzo.addEventListener("pointerleave", () => { if (!arrastre) ficha.hidden = true; });
    const suelta = e => { if (arrastre && !arrastre.movido && e.type === "pointerup") mostrarFicha(e.clientX, e.clientY); arrastre = null; lienzo.classList.remove("girando"); };
    lienzo.addEventListener("pointerup", suelta); lienzo.addEventListener("pointercancel", suelta);
    addEventListener("resize", () => { sucio = true; });

    const ata = (l, o, tipo) => { gl.bindBuffer(gl.ARRAY_BUFFER, o); gl.vertexAttribPointer(l, 3, tipo, false, 0, 0); };
    function cuadro(ahora) {
      requestAnimationFrame(cuadro);
      const real = (ahora - antes) / 1000, dt = Math.min(0.05, real); antes = ahora;
      if (!visible || document.hidden) return;
      lentos = real > 0.06 && real < 1 ? lentos + 1 : 0;
      if (lentos > 12) autogiro = false;
      if (autogiro && !arrastre && ficha.hidden) { azimut += dt * 0.04; sucio = true; }
      if (t < 1) { t = Math.min(1, t + dt / 0.45); sucio = true; }
      if (!sucio) return;
      sucio = false; ajusta();
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      M = matriz(lienzo.width, lienzo.height);
      gl.uniformMatrix4fv(uM, false, M); gl.uniform1f(uT, t);
      gl.uniform1f(uS, Math.max(1.6, lienzo.height * (pequeño ? 0.17 : 0.085)));
      const L = actual === "lidar";
      ata(lp, L ? bPL : bP, gl.SHORT);
      ata(la, L ? bCL : bA, gl.UNSIGNED_BYTE); ata(lb, L ? bCL : bB, gl.UNSIGNED_BYTE);
      gl.drawArrays(gl.POINTS, 0, L ? cuentaL : cuenta);
    }
    if (cargando) cargando.hidden = true;
    requestAnimationFrame(cuadro);
  }
})();
