// uso: node anim2.js logo|fondo W H tema tipo dir [subfotogramas] [solo=i1,i2]
const p=require('puppeteer-core'),fs=require('fs');(async()=>{
const [capa,W,H,tema,tipo,dir,sub='3',solo]=process.argv.slice(2), S=+sub, fps=30;
const b=await p.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const pg=await b.newPage();await pg.setViewport({width:+W,height:+H,deviceScaleFactor:1});
pg.on('pageerror',e=>console.log('ERR',e.message));
const f=capa==='fondo'?'fondo.html':'logo-anim2.html';
await pg.goto(`file:///F:/claude-tmp/logo-anim/${f}?w=${W}&h=${H}&tema=${tema}&tipo=${tipo}`,{waitUntil:'networkidle0'});
await pg.evaluate(()=>document.fonts.ready);
const dur=tipo==='cierre'?7:5, n=dur*fps; fs.mkdirSync(dir,{recursive:true});
const lista=solo?solo.split(',').map(Number):[...Array(n).keys()];
for(const i of lista){for(let k=0;k<S;k++){const t=(i+(k+.5)/S-.5)/fps;await pg.evaluate(t=>render(Math.max(0,t)),t);
 await pg.screenshot({path:`${dir}/f${String(i).padStart(4,'0')}_${k}.png`,omitBackground:capa!=='fondo'});}}
await b.close();console.log('ok',dir)})();
