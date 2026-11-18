/* Visor 3D de las zonas de estudio: relieve real (Terrarium, AWS) y ortofoto (Esri World Imagery) con MapLibre.
   La librería solo se carga cuando el visor se acerca a la pantalla o se pulsa «Ver en 3D». */
(() => {
  const caja = document.getElementById("mapa3d");
  if (!caja) return;
  const ZONAS = {
    parque: { centro: [-3.43, 37.735], zoom: 11.2, rumbo: 200, inclina: 62 },
    puerto: { centro: [-3.5025, 37.7321], zoom: 14.6, rumbo: 200, inclina: 66, nombre: "Puerto de la Mata" },
    pico: { centro: [-3.46669, 37.72496], zoom: 14.4, rumbo: 330, inclina: 66, nombre: "Pico Mágina" },
    cruz: { centro: [-3.36196, 37.76023], zoom: 14.6, rumbo: 20, inclina: 66, nombre: "Sierra de la Cruz" }
  };
  const VER = "4.7.1";
  let mapa = null, cargando = null;

  const carga = () => cargando || (cargando = new Promise((ok, mal) => {
    const css = document.createElement("link");
    css.rel = "stylesheet"; css.href = `https://unpkg.com/maplibre-gl@${VER}/dist/maplibre-gl.css`;
    document.head.append(css);
    const js = document.createElement("script");
    js.src = `https://unpkg.com/maplibre-gl@${VER}/dist/maplibre-gl.js`;
    js.onload = ok; js.onerror = mal;
    document.head.append(js);
  }).then(crea).catch(() => { caja.classList.add("ne-mapa3d-error"); caja.textContent = "No se ha podido cargar el visor 3D."; }));

  function crea() {
    const z = ZONAS.parque;
    mapa = new maplibregl.Map({
      container: caja,
      style: {
        version: 8,
        sources: {
          orto: { type: "raster", tileSize: 256, maxzoom: 18,
            tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
            attribution: "Ortofoto: Esri, Maxar, Earthstar Geographics" },
          relieve: { type: "raster-dem", tileSize: 256, maxzoom: 14, encoding: "terrarium",
            tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
            attribution: "Relieve: Mapzen Terrain Tiles" }
        },
        layers: [{ id: "orto", type: "raster", source: "orto" }],
        terrain: { source: "relieve", exaggeration: 1.25 },
        sky: { "sky-color": "#9fd3ee", "horizon-color": "#e6f2f7", "sky-horizon-blend": .6, "horizon-fog-blend": .5, "fog-color": "#e6f2f7", "fog-ground-blend": .2 }
      },
      center: z.centro, zoom: z.zoom, bearing: z.rumbo, pitch: z.inclina, maxPitch: 80,
      cooperativeGestures: true, attributionControl: { compact: true }
    });
    mapa.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    mapa.addControl(new maplibregl.FullscreenControl(), "top-right");
    mapa.once("load", () => { const a = caja.querySelector(".maplibregl-ctrl-attrib"); if (a) a.classList.remove("maplibregl-compact-show"); });
    Object.entries(ZONAS).forEach(([k, v]) => {
      if (!v.nombre) return;
      const m = document.createElement("button");
      m.type = "button"; m.className = "ne-mapa3d-marca"; m.textContent = v.nombre;
      m.addEventListener("click", () => vuela(k));
      new maplibregl.Marker({ element: m, anchor: "bottom" }).setLngLat(v.centro).addTo(mapa);
    });
  }

  function vuela(k) {
    const z = ZONAS[k];
    document.querySelectorAll(".ne-mapa3d-botones button").forEach(b => b.setAttribute("aria-pressed", b.dataset.zona === k));
    const ir = () => mapa.flyTo({ center: z.centro, zoom: z.zoom, bearing: z.rumbo, pitch: z.inclina, duration: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 3500, essential: true });
    if (mapa) mapa.loaded() ? ir() : mapa.once("load", ir); else carga().then(() => mapa && mapa.once("load", ir));
  }

  document.querySelectorAll("[data-zona]").forEach(b => b.addEventListener("click", e => {
    e.preventDefault();
    if (b.closest(".ne-zona3")) caja.scrollIntoView({ behavior: "smooth", block: "center" });
    vuela(b.dataset.zona);
  }));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); carga(); } }, { rootMargin: "400px" });
    io.observe(caja);
  } else carga();
})();
