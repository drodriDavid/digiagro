import re, json
s=open('F:/claude-tmp/digiagro-web/assets/marca/digiagro-principal.svg').read()
piezas=[]
for fill,d in re.findall(r'fill="(#\w+)"[^>]*?d="([^"]+)"',s):
    for sp in re.findall(r'M[^M]*',d):
        n=list(map(float,re.findall(r'-?\d+\.?\d*',sp)))
        piezas.append(dict(f=fill,d=sp,x0=min(n[0::2]),x1=max(n[0::2]),y0=min(n[1::2]),y1=max(n[1::2])))
# unir huecos con su letra (caja contenida)
grupos=[]
for p in sorted(piezas,key=lambda p:-(p['x1']-p['x0'])*(p['y1']-p['y0'])):
    g=next((g for g in grupos if g['f']==p['f'] and g['x0']<=p['x0'] and p['x1']<=g['x1'] and g['y0']<=p['y0'] and p['y1']<=g['y1'] and p['x0']>1400),None)
    if g: g['d']+=p['d']
    else: grupos.append(dict(p))
def nombre(g):
    if g['x0']>1450: return 'letra'
    if g['f']=='#9DBA2C': return 'hoja'
    if g['f']=='#7A9800': return 'a'
    return 'dsup' if g['y0']<300 else 'dbar'
for g in grupos: g['n']=nombre(g)
letras=sorted([g for g in grupos if g['n']=='letra'],key=lambda g:g['x0'])
for i,g in enumerate(letras): g['n']='l%d'%i
json.dump(grupos,open('piezas.json','w'))
print([ (g['n'],g['f']) for g in sorted(grupos,key=lambda g:g['x0'])])
