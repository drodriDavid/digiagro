/* =====================================================================
   App de inventario — render (tarjetas / tabla), filtros, buscador, ficha
   Estilo institucional claro
   ===================================================================== */

/* ---- Color por tipo de ilustración (fondo claro + trazo) ---- */
const ART = {
  quad:          { bg:"#eef4fc", stroke:"#1556b0", accent:"#2f80d8" },
  industrial:    { bg:"#eaf1fb", stroke:"#0f3e83", accent:"#1556b0" },
  camera:        { bg:"#f1edfb", stroke:"#5b3fb0", accent:"#8266d6" },
  thermal:       { bg:"#fdeeea", stroke:"#c0502f", accent:"#e07a52" },
  lidar:         { bg:"#e6f6f6", stroke:"#0e8f8f", accent:"#23b2b2" },
  multispectral: { bg:"#e9f6ee", stroke:"#1a9d6b", accent:"#3cbb87" },
  hyperspectral: { bg:"#f3edfb", stroke:"#6a3fb0", accent:"#9466d6" },
};
/* Color de categoría (cuadradito en la tabla) */
const TYPE_META = {
  drone:  { label:"Dron",   color:"#1556b0" },
  sensor: { label:"Sensor", color:"#0e8f8f" },
};

/* Visual de un equipo: foto real (entera, con fondo difuminado) o ilustración SVG */
function visual(e, cls){
  const c = ART[e.art] || ART.quad;
  if(e.img){
    return { bg:"#ffffff", inner:
      `<div class="thumb-bg" style="background-image:url('${e.img}')"></div>` +
      `<img class="art-img ${cls||""}" src="${e.img}" alt="${e.name}" loading="lazy"
         onerror="this.classList.add('hidden');this.nextElementSibling.classList.remove('hidden')">` +
      `<span class="svg-fallback hidden">${illustration(e.art)}</span>` };
  }
  return { bg:c.bg, inner: illustration(e.art) };
}

/* Secciones del catálogo (estilo tienda) */
const CAT_META = {
  drone:  { eyebrow:"Plataformas aéreas", title:"Drones", sub:"Aeronaves no tripuladas para captura aérea, cartografía y teledetección." },
  sensor: { eyebrow:"Cargas útiles & teledetección", title:"Sensores", sub:"Cámaras y sensores de teledetección de alta precisión." },
};
const SUBGROUPS = {
  drone: [
    { key:"Plataformas industriales", ids:["m300","matrice400","m210","lidardrone"] },
    { key:"Drones compactos / multirrotor", ids:["phantom4rtk","mavic3m","mavic3t","mavicpro","mini4pro"] },
  ],
  sensor: [
    { key:"Cámaras y gimbales", ids:["p1","xt2"] },
    { key:"Sensores multiespectrales", ids:["rededgemx","rededgemxblue"] },
    { key:"LiDAR", ids:["scoutultra"] },
    { key:"Sensores hiperespectrales", ids:["nanohyperspec","afx17"] },
  ],
};

/* ---- Ilustraciones SVG por tipo ---- */
function illustration(art){
  const c = ART[art] || ART.quad;
  const S = (inner) =>
    `<svg class="art" viewBox="0 0 120 120" fill="none" stroke="${c.stroke}" stroke-width="2.3"
       stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const A = c.accent, F = "#ffffff";
  switch(art){
    case "quad": return S(`
      <line x1="34" y1="34" x2="86" y2="86"/><line x1="86" y1="34" x2="34" y2="86"/>
      <circle cx="30" cy="30" r="13" stroke="${A}"/><circle cx="90" cy="30" r="13" stroke="${A}"/>
      <circle cx="30" cy="90" r="13" stroke="${A}"/><circle cx="90" cy="90" r="13" stroke="${A}"/>
      <line x1="20" y1="30" x2="40" y2="30"/><line x1="30" y1="20" x2="30" y2="40"/>
      <line x1="80" y1="30" x2="100" y2="30"/><line x1="90" y1="20" x2="90" y2="40"/>
      <line x1="20" y1="90" x2="40" y2="90"/><line x1="30" y1="80" x2="30" y2="100"/>
      <line x1="80" y1="90" x2="100" y2="90"/><line x1="90" y1="80" x2="90" y2="100"/>
      <rect x="48" y="48" width="24" height="20" rx="5" fill="${F}"/>
      <circle cx="60" cy="72" r="6" fill="${F}" stroke="${A}"/>`);
    case "industrial": return S(`
      <line x1="28" y1="40" x2="92" y2="40"/>
      <circle cx="22" cy="34" r="12" stroke="${A}"/><circle cx="98" cy="34" r="12" stroke="${A}"/>
      <line x1="12" y1="34" x2="32" y2="34"/><line x1="88" y1="34" x2="108" y2="34"/>
      <rect x="40" y="40" width="40" height="26" rx="7" fill="${F}"/>
      <line x1="34" y1="40" x2="30" y2="58"/><line x1="86" y1="40" x2="90" y2="58"/>
      <rect x="50" y="66" width="20" height="12" rx="3" fill="${F}" stroke="${A}"/>
      <circle cx="60" cy="86" r="7" fill="${F}" stroke="${A}"/>
      <line x1="44" y1="92" x2="76" y2="92" stroke="${A}"/>`);
    case "camera": return S(`
      <rect x="24" y="38" width="72" height="48" rx="10" fill="${F}"/>
      <path d="M44 38l6-9h20l6 9"/>
      <circle cx="60" cy="62" r="17"/><circle cx="60" cy="62" r="9" stroke="${A}"/>
      <circle cx="84" cy="48" r="2.6" fill="${A}" stroke="none"/>`);
    case "thermal": return S(`
      <rect x="24" y="40" width="72" height="44" rx="10" fill="${F}"/>
      <circle cx="50" cy="62" r="13"/><circle cx="50" cy="62" r="6" stroke="${A}"/>
      <path d="M74 50v24M82 50v24" stroke="${A}"/>
      <path d="M70 56q4-6 8 0t8 0" stroke="${A}"/>`);
    case "lidar": return S(`
      <ellipse cx="60" cy="34" rx="20" ry="9" fill="${F}"/>
      <path d="M40 34v10a20 9 0 0 0 40 0V34"/>
      <path d="M60 53 38 92M60 53 52 92M60 53 68 92M60 53 82 92" stroke="${A}"/>
      <path d="M34 92h52" stroke="${A}"/>
      <circle cx="46" cy="88" r="2" fill="${A}" stroke="none"/>
      <circle cx="60" cy="90" r="2" fill="${A}" stroke="none"/>
      <circle cx="74" cy="88" r="2" fill="${A}" stroke="none"/>`);
    case "multispectral": return S(`
      <rect x="26" y="32" width="68" height="56" rx="10" fill="${F}"/>
      <circle cx="44" cy="50" r="7"/><circle cx="60" cy="50" r="7" stroke="${A}"/>
      <circle cx="76" cy="50" r="7"/>
      <circle cx="52" cy="70" r="7" stroke="${A}"/><circle cx="68" cy="70" r="7"/>`);
    case "hyperspectral": return S(`
      <rect x="26" y="40" width="68" height="40" rx="9" fill="${F}"/>
      <circle cx="44" cy="60" r="12"/><circle cx="44" cy="60" r="5" stroke="${A}"/>
      <path d="M66 46h24M66 53h24M66 60h24M66 67h24M66 74h24" stroke="${A}"/>`);
    default: return S(`<rect x="34" y="34" width="52" height="52" rx="10"/>`);
  }
}

/* ---- Estado ---- */
let activeFilter = "all";
let query = "";

const catalogEl = document.getElementById("catalog");
const softSection = document.getElementById("software-section");

/* ---- Stats ---- */
(function renderStats(){
  const mount = document.getElementById("stats");
  if(!mount) return;
  const drones = EQUIPAMIENTO.filter(e=>e.type==="drone").length;
  const sensores = EQUIPAMIENTO.filter(e=>e.type==="sensor").length;
  const ops = EQUIPAMIENTO.filter(e=>e.status.level==="ok").length;
  const data = [
    [EQUIPAMIENTO.length,"Equipos"], [drones,"Drones"], [sensores,"Sensores"], [ops,"Operativos"],
  ];
  document.getElementById("stats").innerHTML = data.map(([n,l])=>
    `<div class="stat"><div class="n grad-text" data-target="${n}">0</div><div class="l">${l}</div></div>`).join("");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".stat .n").forEach(el=>{
    if(reduce) el.textContent = el.dataset.target;
    else countUp(el, +el.dataset.target);
  });
})();

/* Contador animado */
function countUp(el, target){
  const dur = 1100, t0 = performance.now();
  (function step(now){
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if(p < 1) requestAnimationFrame(step);
  })(t0);
  /* Failsafe: garantiza el valor final aunque rAF no dispare */
  setTimeout(()=>{ el.textContent = String(target); }, dur + 300);
}

/* Inclinación 3D + foco que sigue al cursor (solo ratón, respeta reduced-motion) */
function tileTilt(el){
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if(window.matchMedia("(hover: none)").matches) return;
  el.addEventListener("pointermove", ev=>{
    const r = el.getBoundingClientRect();
    const px = (ev.clientX - r.left) / r.width;
    const py = (ev.clientY - r.top) / r.height;
    el.style.setProperty("--ry", ((px - 0.5) * 7).toFixed(2) + "deg");
    el.style.setProperty("--rx", ((0.5 - py) * 7).toFixed(2) + "deg");
    el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
    el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
    el.classList.add("tilting");
  });
  el.addEventListener("pointerleave", ()=>{
    el.classList.remove("tilting");
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");
  });
}

/* ---- Búsqueda ---- */
function matches(e,q){
  if(!q) return true;
  const hay = [e.name,e.brand,e.tagline,e.description,e.serial,(e.features||[]).join(" "),
    e.specs.map(s=>s.join(" ")).join(" ")].join(" ").toLowerCase();
  return hay.includes(q);
}

/* ---- Tarjeta ---- */
function card(e){
  const v = visual(e);
  return `
    <div class="card" data-id="${e.id}">
      <div class="thumb ${e.img?"photo":""}" style="background:${v.bg}">
        <span class="badge-type">${TYPE_META[e.type].label}</span>
        <span class="badge-status ${e.status.level}"><span class="dot"></span>${e.status.label}</span>
        ${v.inner}
      </div>
      <div class="card-body">
        <span class="brand">${e.brand}</span>
        <h3>${e.name}</h3>
        <div class="tag">${e.tagline}</div>
        <div class="card-cta">Ver ficha técnica
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </div>
      </div>
    </div>`;
}

/* Imagen del producto para el tile (foto grande o ilustración) */
function tileImage(e){
  if(e.img){
    return `<img class="tile-img" src="${e.img}" alt="${e.name}" loading="lazy"
        onerror="this.classList.add('hidden');this.nextElementSibling.classList.remove('hidden')">` +
      `<span class="tile-svg hidden">${illustration(e.art)}</span>`;
  }
  return `<span class="tile-svg">${illustration(e.art)}</span>`;
}

const ARROW = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

/* Tile grande estilo tienda */
function tile(e){
  return `
    <div class="tile reveal" data-id="${e.id}">
      <span class="tile-status ${e.status.level}"><span class="dot"></span>${e.status.label}</span>
      <span class="tile-label">${e.brand} · ${TYPE_META[e.type].label}</span>
      <h3 class="tile-name">${e.name}</h3>
      <p class="tile-tag">${e.tagline}</p>
      <span class="tile-cta">Ver ficha técnica ${ARROW}</span>
      <div class="tile-img-wrap">${tileImage(e)}</div>
    </div>`;
}

/* Portada / header con título de equipamiento (foto del campus UJA, sin producto) */
function heroTitle(){
  return `
    <header class="hero-feature hero-title">
      <div class="hero-photo" style="background-image:url('assets/img/band-campus.jpg')"></div>
      <video class="hero-video" autoplay muted loop playsinline preload="auto" poster="assets/video/hero-poster.jpg">
        <source src="assets/video/hero.mp4" type="video/mp4">
      </video>
      <div class="hero-inner">
        <h1 class="sr-only">AEROLAB — Inventario de Drones y Sensores · Universidad de Jaén</h1>
        <div class="hero-logo logo-capas" role="img" aria-label="AEROLAB DIGIAGRO · Spatial Intelligence and Computer Graphics">
          ${["a","dron","pixeles","sello","palabra","lema"].map(c=>`<span class="capa capa-${c}" aria-hidden="true"><i></i></span>`).join("")}
        </div>
        <p class="hero-tag">Inventario de drones y sensores de teledetección de la Universidad de Jaén:
        una flota que abarca desde multirrotores ultraligeros a plataformas industriales de carga
        pesada, con sensores RGB, multiespectrales, térmicos, LiDAR e hiperespectrales.</p>
        <a class="hero-cta" href="#catalogo">Ver el catálogo ${ARROW}</a>
      </div>
    </header>`;
}

/* Sección de una categoría con sus subgrupos */
function catSection(type, items){
  const ofType = items.filter(e=>e.type===type);
  if(!ofType.length) return "";
  /* Orden lógico según SUBGROUPS, pero todo en una sola rejilla (sin subcabeceras) */
  const ordered = [], seen = new Set();
  (SUBGROUPS[type] || []).forEach(sg => sg.ids.forEach(id => {
    const e = ofType.find(x => x.id === id);
    if(e && !seen.has(id)){ ordered.push(e); seen.add(id); }
  }));
  ofType.forEach(e => { if(!seen.has(e.id)){ ordered.push(e); seen.add(e.id); } });
  return `<section class="cat">
    <div class="reveal">
      <div class="eyebrow">${CAT_META[type].eyebrow}</div>
      <h2 class="cat-head">${CAT_META[type].title}</h2>
      <p class="cat-sub">${CAT_META[type].sub}</p>
    </div>
    <div class="showcase">${ordered.map(tile).join("")}</div>
  </section>`;
}

/* Banda divisoria a sangre completa con imagen de fondo */
function band(o){
  const bg = o.video
    ? `<video class="band-vid" muted loop playsinline preload="none" poster="${o.poster||""}">
         <source src="${o.video}" type="video/mp4"></video>`
    : `<div class="band-bg" style="background-image:url('${o.img}')"></div>`;
  return `<section class="band">
    ${bg}
    <div class="band-inner">
      <div class="eyebrow">${o.eyebrow}</div>
      <h2>${o.title}</h2>
      ${o.text ? `<p>${o.text}</p>` : ""}
    </div>
    ${o.src ? `<span class="src">${o.src}</span>` : ""}
  </section>`;
}

/* Vista showcase con texto editorial y bandas de imagen intercaladas */
function renderGrid(items, isDefault){
  let html = "";
  if(isDefault){
    html += band({
      img:"assets/img/band-aerea.jpg?v=30",
      eyebrow:"Captura aérea",
      title:"Cartografiamos el territorio desde el aire",
      text:"Vuelos propios de fotogrametría, térmica y LiDAR sobre cultivos, masas forestales e infraestructuras.",
      src:"Vuelo de dron · AEROLAB"
    });
  }
  html += catSection("drone", items);
  if(isDefault){
    html += band({
      video:"assets/video/band.mp4",
      poster:"assets/video/band-poster.jpg",
      eyebrow:"Teledetección",
      title:"Cada sensor, una capa de información",
      text:"<span>RGB</span> · <span>multiespectral</span> · <span>térmico</span> · <span>LiDAR</span> · <span>hiperespectral</span>",
      src:"Vuelo de dron · AEROLAB"
    });
  }
  html += catSection("sensor", items);
  return html;
}

/* Tarjeta de software (icono monograma + categoría + enlace) */
function softCard(s){
  const mono = (s.name.replace(/[^A-Za-z0-9]/g,"").slice(0,2) || "··").toUpperCase();
  const link = s.url
    ? `<span class="soft-link">Visitar sitio ${ARROW}</span>`
    : `<span class="soft-link soft-link--muted">Herramienta interna</span>`;
  const inner =
    `<div class="soft-ico" style="--c:${s.color}">${mono}</div>
     <div class="soft-body">
       <div class="soft-top"><b>${s.name}</b><span class="soft-cat">${s.cat}</span></div>
       <span class="soft-desc">${s.desc}</span>
       ${link}
     </div>`;
  return s.url
    ? `<a class="soft reveal" href="${s.url}" target="_blank" rel="noopener">${inner}</a>`
    : `<div class="soft reveal">${inner}</div>`;
}

/* ---- Render principal ---- */
function render(){
  const q = query.trim().toLowerCase();

  let items = EQUIPAMIENTO.filter(e=>{
    if(activeFilter==="drone" && e.type!=="drone") return false;
    if(activeFilter==="sensor" && e.type!=="sensor") return false;
    if(activeFilter==="software") return false;
    return matches(e,q);
  });

  /* Portada (solo en vista catálogo, sin búsqueda) */
  const heroMount = document.getElementById("hero-mount");
  const showHero = !query.trim();
  heroMount.innerHTML = showHero ? heroTitle() : "";

  let html = "";
  if(activeFilter!=="software"){
    if(!items.length){
      html += `<div class="empty">Sin resultados para “${query}”.</div>`;
    } else {
      html += renderGrid(items, showHero);
    }
  }
  catalogEl.innerHTML = html;

  [document.getElementById("hero-mount"), catalogEl].forEach(root=>
    root.querySelectorAll("[data-id]").forEach(el=>{
      el.setAttribute("role","button");
      el.setAttribute("tabindex","0");
      el.addEventListener("click",()=>openModal(el.dataset.id));
      el.addEventListener("keydown",ev=>{
        if(ev.key==="Enter"||ev.key===" "){ ev.preventDefault(); openModal(el.dataset.id); }
      });
    }));
  catalogEl.querySelectorAll(".tile").forEach(tileTilt);
  setupReveal();
}

/* ---- Scroll reveal (basado en posición, robusto en cualquier entorno) ---- */
function revealVisible(){
  const vh = window.innerHeight || document.documentElement.clientHeight || 800;
  document.querySelectorAll(".reveal:not(.in)").forEach(el=>{
    if(el.getBoundingClientRect().top < vh - 40) el.classList.add("in");
  });
}
function setupReveal(){ revealVisible(); requestAnimationFrame(()=>{ revealVisible(); playVisibleVideos(); }); }

/* Reproduce los vídeos de banda solo cuando están cerca del viewport */
function playVisibleVideos(){
  const vh = window.innerHeight || 800;
  document.querySelectorAll(".band-vid").forEach(v=>{
    const r = v.getBoundingClientRect();
    const near = r.top < vh * 1.3 && r.bottom > -vh * 0.3;
    if(near){ if(v.paused) v.play().catch(()=>{}); }
    else if(!v.paused){ v.pause(); }
  });
}

/* ---- Modal / ficha técnica ---- */
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");

function openModal(id){
  const e = EQUIPAMIENTO.find(x=>x.id===id);
  if(!e) return;
  const vis = visual(e, "big");
  const rows = e.specs.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join("");
  const chips = (e.features||[]).map(f=>`<span class="chip">${f}</span>`).join("");
  modal.innerHTML = `
    <div class="modal-hero ${e.img?"photo":""}" style="background:${vis.bg}">
      <button class="modal-close" id="closeBtn" aria-label="Cerrar">×</button>
      ${vis.inner}
    </div>
    <div class="modal-body">
      <span class="tile-label">${e.brand} · ${TYPE_META[e.type].label}</span>
      <h2>${e.name}</h2>
      <div class="lead">${e.tagline}</div>
      <div class="status-row">
        <span class="status-tag ${e.status.level}"><span class="dot"></span>${e.status.label}</span>
        ${e.serial?`<span class="status-tag">N.º serie: ${e.serial}</span>`:""}
      </div>
      <p class="desc">${e.description}</p>
      <div class="chips" style="margin-bottom:18px">${chips}</div>
      <p class="specs-title">Características técnicas</p>
      <table class="specs">${rows}</table>
      ${e.poliza?`<div class="meta-line"><b>Seguro / inventario:</b> ${e.poliza}</div>`:""}
      <a class="doc-btn" href="${e.doc}" target="_blank" rel="noopener">
        Documentación técnica del fabricante
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4"
          stroke-linecap="round"><path d="M7 17 17 7M9 7h8v8"/></svg>
      </a>
    </div>`;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  document.getElementById("closeBtn").addEventListener("click", closeModal);
}
function closeModal(){
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}
overlay.addEventListener("click", e=>{ if(e.target===overlay) closeModal(); });
document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeModal(); });

/* ---- Tema fijo: siempre claro ---- */
document.documentElement.setAttribute("data-theme", "light");

/* ---- Navbar reactiva al scroll + botón volver arriba ---- */
const navEl = document.querySelector(".nav");
const totopBtn = document.getElementById("totop");
function onScroll(){
  const y = window.scrollY || document.documentElement.scrollTop;
  navEl.classList.toggle("scrolled", y > 8);
  totopBtn.classList.toggle("show", y > 680);
  revealVisible();
  playVisibleVideos();
}
window.addEventListener("scroll", onScroll, { passive:true });
window.addEventListener("resize", revealVisible, { passive:true });
totopBtn.addEventListener("click", ()=> window.scrollTo({ top:0, behavior:"smooth" }));
/* Activa las animaciones de aparición solo si hay JS y no se pide menos movimiento */
if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  document.documentElement.classList.add("has-reveal");
}
onScroll();
/* Failsafe: nada puede quedar invisible — revela todo pasados 2,5 s */
setTimeout(()=>document.querySelectorAll(".reveal:not(.in)").forEach(el=>el.classList.add("in")), 2500);

/* ---- Galería promocional de vídeos + lightbox ---- */
function renderPromo(){
  const grid = document.getElementById("promo-grid");
  if(!grid || typeof PROMO === "undefined") return;
  grid.innerHTML = PROMO.map(p=>{
    const base = "assets/video/promo/" + p.file;
    return `<div class="promo-card reveal">
      <button class="promo-media" data-vid="${base}.mp4" aria-label="Reproducir: ${p.title}">
        <img class="promo-thumb" src="${base}.jpg" alt="${p.title}" loading="lazy">
        <span class="promo-play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>
      </button>
      <div class="promo-cap">
        <span class="promo-title">${p.title}</span>
        <span class="promo-util">${p.util}</span>
      </div>
    </div>`;
  }).join("");
  grid.querySelectorAll(".promo-media").forEach(c=>
    c.addEventListener("click", ()=>openLightbox(c.dataset.vid)));
  setupReveal();
}
const lightbox = document.getElementById("lightbox");
const lightboxVid = document.getElementById("lightboxVid");
function openLightbox(src){
  lightboxVid.src = src;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
  lightboxVid.play().catch(()=>{});
}
function closeLightbox(){
  lightboxVid.pause();
  lightboxVid.removeAttribute("src"); lightboxVid.load();
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e=>{ if(e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e=>{ if(e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox(); });

/* ---- Galería de resultados de vuelos ---- */
function renderResults(){
  const grid = document.getElementById("results-grid");
  if(!grid || typeof RESULTS === "undefined") return;
  grid.innerHTML = RESULTS.map(r=>
    `<figure class="result-card reveal">
       <img class="result-img" src="${r.img}" alt="${r.title}" loading="lazy">
       <figcaption class="result-cap">
         <span class="result-cat">${r.cat}</span>
         <span class="result-title">${r.title}</span>
       </figcaption>
     </figure>`).join("");
  setupReveal();
}

render();
renderPromo();
renderResults();
