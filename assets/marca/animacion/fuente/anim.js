const p=require('puppeteer-core'),fs=require('fs');(async()=>{
const [tema,lema,fps,dur,escala,dir,solo]=process.argv.slice(2);
const b=await p.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const pg=await b.newPage();await pg.setViewport({width:1920,height:1080,deviceScaleFactor:+escala});
pg.on('pageerror',e=>console.log('ERR',e.message));
await pg.goto('file:///F:/claude-tmp/logo-anim/logo-anim.html?tema='+tema+'&lema='+lema,{waitUntil:'networkidle0'});
await pg.evaluate(()=>document.fonts.ready);
fs.mkdirSync(dir,{recursive:true});
const n=Math.round(fps*dur), lista=solo?solo.split(',').map(Number):[...Array(n).keys()];
for(const i of lista){await pg.evaluate(t=>render(t),i/fps);await pg.screenshot({path:`${dir}/f${String(i).padStart(4,'0')}.png`,omitBackground:tema==='transparente'});}
await b.close();console.log('ok',lista.length)})();
