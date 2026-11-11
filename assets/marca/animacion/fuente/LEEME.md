# Animación del logo DIGIAGRO

6,5 s a 30 fps. Versiones: claro (fondo blanco), oscuro (fondo verde) y transparente (solo logo, con canal alfa).

Regenerar:
1. `python construir.py` separa el SVG del logo en piezas (`piezas.json`).
2. `python html.py` crea `logo-anim.html` a partir de `plantilla.html` (ajustar rutas).
3. `node anim.js <claro|oscuro|transparente> <lema 0|1> 30 6.5 2 <carpeta>` saca los fotogramas 4K con puppeteer.
4. ffmpeg: H.264 para MP4; ProRes 4444 (`-c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le`) o VP9 con alfa para el transparente.
