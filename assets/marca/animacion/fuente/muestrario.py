import os, numpy as np
from PIL import Image, ImageDraw, ImageFont
R='r2'; O='muestra'; os.makedirs(O, exist_ok=True)
F=[('16x9','16:9'),('1x1','1:1'),('4x5','4:5'),('9x16','9:16')]
SEG=[('intro','claro','m','Entrada · fondo claro'),('intro','oscuro','m','Entrada · fondo verde'),
     ('intro','claro','a','Entrada · sin fondo (color)'),('intro','oscuro','a','Entrada · sin fondo (blanco)'),
     ('cierre','claro','m','Cierre · fondo claro'),('cierre','oscuro','m','Cierre · fondo verde'),
     ('cierre','claro','a','Cierre · sin fondo (color)')]
Hh=410; W=1920; Hc=1080
fT=ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf',44); fS=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',28)
def ajedrez(w,h,osc):
    a,b=((59,74,64),(86,102,91)) if osc else ((207,212,204),(242,244,240))
    y,x=np.mgrid[0:h,0:w]; m=((x//18+y//18)%2)[...,None]
    return Image.fromarray(np.where(m,np.array(a,np.uint8),np.array(b,np.uint8)).astype(np.uint8))
n=0
for tipo,tema,capa,titulo in SEG:
    nf=150 if tipo=='intro' else 210
    for i in range(nf):
        c=Image.new('RGB',(W,Hc),(244,247,241)); d=ImageDraw.Draw(c)
        d.text((60,70),'DIGIAGRO · logo animado para LinkedIn',font=fS,fill=(95,99,96))
        d.text((60,110),titulo,font=fT,fill=(0,115,54))
        x=60
        for f,et in F:
            im=Image.open(f'{R}/{capa}-{f}-{tema}-{tipo}/f{i:04d}.png')
            w=round(im.width*Hh/im.height); im=im.resize((w,Hh),Image.LANCZOS)
            if capa=='a':
                bg=ajedrez(w,Hh,tema=='oscuro'); bg.paste(im,(0,0),im); im=bg
            c.paste(im.convert('RGB'),(x,280)); d.text((x,280+Hh+14),et,font=fS,fill=(31,42,35)); x+=w+36
        c.save(f'{O}/f{n:04d}.png',compress_level=1); n+=1
print(n)
