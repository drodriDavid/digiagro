# Promedia subfotogramas (desenfoque de movimiento, en alfa premultiplicado) y compone sobre el fondo.
# uso: python mezcla.py dir_logo dir_fondo|- dir_salida S
import sys, glob, os, numpy as np
from PIL import Image
dl, df, do, S = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
os.makedirs(do, exist_ok=True)
idx = sorted({os.path.basename(f)[1:5] for f in glob.glob(dl + '/f*_0.png')})
for i in idx:
    acc = None
    for k in range(S):
        a = np.asarray(Image.open(f'{dl}/f{i}_{k}.png').convert('RGBA'), np.float32) / 255
        pm = np.concatenate([a[..., :3] * a[..., 3:], a[..., 3:]], -1)
        acc = pm if acc is None else acc + pm
    acc /= S
    rgb, al = acc[..., :3], acc[..., 3:]
    if df != '-':
        fondo = np.asarray(Image.open(f'{df}/f{i}_0.png').convert('RGB'), np.float32) / 255
        out = fondo * (1 - al) + rgb
        Image.fromarray((np.clip(out, 0, 1) * 255 + .5).astype(np.uint8)).save(f'{do}/f{i}.png', compress_level=1)
    else:
        col = np.where(al > 1e-4, rgb / np.maximum(al, 1e-4), 0)
        out = np.concatenate([col, al], -1)
        Image.fromarray((np.clip(out, 0, 1) * 255 + .5).astype(np.uint8), 'RGBA').save(f'{do}/f{i}.png', compress_level=1)
print('ok', do, len(idx))
