#!/bin/bash
# Renderiza todas las versiones LinkedIn: 4 formatos x entrada/cierre x claro/oscuro, con fondo y transparentes.
set -e
cd /f/claude-tmp/logo-anim
PY=/c/Users/drodrigu/anaconda3/python.exe
FF=/f/claude-tmp/pyff/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v9.0.2.exe
$PY -I -c "import json;open('logo-anim2.html','w',encoding='utf-8').write(open('plantilla2.html',encoding='utf-8').read().replace('__PIEZAS__',json.dumps(json.load(open('piezas.json')))))"
R=/f/claude-tmp/logo-anim/r2; rm -rf $R; mkdir -p $R salida2/con-fondo salida2/transparente
FORMATOS="16x9:1920:1080 1x1:1080:1080 4x5:1080:1350 9x16:1080:1920"
: > $R/trabajos.txt
for F in $FORMATOS; do IFS=: read n w h <<< "$F"
  for tema in claro oscuro; do
    echo "fondo $w $h $tema cierre $R/fondo-$n-$tema 1" >> $R/trabajos.txt
    for tipo in intro cierre; do echo "logo $w $h $tema $tipo $R/logo-$n-$tema-$tipo 3" >> $R/trabajos.txt; done
  done
done
cd /f/claude-tmp/pup && cat $R/trabajos.txt | xargs -P 8 -L 1 node anim2.js
cd /f/claude-tmp/logo-anim
for F in $FORMATOS; do IFS=: read n w h <<< "$F"
  for tema in claro oscuro; do for tipo in intro cierre; do
    echo "$R/logo-$n-$tema-$tipo $R/fondo-$n-$tema $R/m-$n-$tema-$tipo 3"
    echo "$R/logo-$n-$tema-$tipo - $R/a-$n-$tema-$tipo 3"
  done; done
done | xargs -P 6 -L 1 $PY -I mezcla.py
for F in $FORMATOS; do IFS=: read n w h <<< "$F"
  for tema in claro oscuro; do for tipo in intro cierre; do
    [ $tema = claro ] && col=color || col=blanco
    $FF -y -loglevel error -framerate 30 -i $R/m-$n-$tema-$tipo/f%04d.png -c:v libx264 -preset slow -crf 17 -profile:v high -pix_fmt yuv420p -movflags +faststart salida2/con-fondo/digiagro-$tipo-$n-$tema.mp4
    $FF -y -loglevel error -framerate 30 -i $R/a-$n-$tema-$tipo/f%04d.png -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le salida2/transparente/digiagro-$tipo-$n-transparente-$col.mov
    $FF -y -loglevel error -framerate 30 -i $R/a-$n-$tema-$tipo/f%04d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 26 -row-mt 1 salida2/transparente/digiagro-$tipo-$n-transparente-$col.webm
  done; done
done
echo TERMINADO
