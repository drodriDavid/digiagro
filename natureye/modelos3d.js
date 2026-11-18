/* Galería de modelos 3D de especies con <model-viewer>. La librería se carga solo cuando la galería se acerca a la pantalla. */
(() => {
  const caja = document.getElementById("visor-modelos");
  if (!caja) return;
  const botones = document.querySelectorAll("[data-modelo]");
  const VER = "3.5.0";
  let visor = null, cargando = null;
  const nombre = k => document.querySelector(`[data-modelo="${k}"] b`).textContent;

  const carga = () => cargando || (cargando = new Promise((ok, mal) => {
    const js = document.createElement("script");
    js.type = "module"; js.src = `https://unpkg.com/@google/model-viewer@${VER}/dist/model-viewer.min.js`;
    js.onload = ok; js.onerror = mal; document.head.append(js);
  }).then(() => {
    visor = document.createElement("model-viewer");
    visor.setAttribute("camera-controls", ""); visor.setAttribute("auto-rotate", "");
    visor.setAttribute("auto-rotate-delay", "0"); visor.setAttribute("rotation-per-second", "18deg");
    visor.setAttribute("interaction-prompt", "none"); visor.setAttribute("shadow-intensity", "0.8");
    visor.setAttribute("exposure", "1.05"); visor.setAttribute("camera-orbit", "0deg 80deg auto");
    visor.addEventListener("load", () => caja.querySelector(".ne-modelo-cargando")?.setAttribute("hidden", ""));
    caja.append(visor);
    muestra(document.querySelector('[data-modelo][aria-pressed="true"]').dataset.modelo);
  }).catch(() => { caja.querySelector(".ne-modelo-cargando").textContent = "No se ha podido cargar el visor 3D."; }));

  function muestra(k) {
    botones.forEach(b => b.setAttribute("aria-pressed", b.dataset.modelo === k));
    if (!visor) return carga();
    const aviso = caja.querySelector(".ne-modelo-cargando"); aviso.textContent = "Cargando modelo 3D…"; aviso.removeAttribute("hidden");
    visor.alt = `Modelo 3D de ${nombre(k)}`;
    visor.src = `media/modelos/${k}.glb?v=1`;
  }

  botones.forEach(b => b.addEventListener("click", () => muestra(b.dataset.modelo)));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); carga(); } }, { rootMargin: "300px" });
    io.observe(caja);
  } else carga();
})();
