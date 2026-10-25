import { defineConfig } from 'vite';
import fs from 'node:fs/promises';
import { renderRoute, routes, pageTitle } from './src/pages.js';
const normalize=url=>{const path=(url||'/').split('?')[0];return path==='/index.html'?'/':path.endsWith('/')?path:`${path}/`;};
const fill=(html,path)=>html.replace(/<!--site:start-->[\s\S]*?<!--site:end-->/,`<!--site:start-->${renderRoute(path)}<!--site:end-->`).replace(/<title>.*?<\/title>/,`<title>${pageTitle(path)} | VERDE AUTO</title>`);
export default defineConfig({plugins:[{
 name:'verde-static-pages',enforce:'post',
 configureServer(server){server.middlewares.use(async(req,res,next)=>{const path=normalize(req.url);if(path==='/'||!routes.includes(path))return next();try{const template=await fs.readFile(new URL('./index.html',import.meta.url),'utf8');const html=await server.transformIndexHtml(req.url,fill(template,path));res.statusCode=200;res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);}catch(e){next(e);}});},
 transformIndexHtml(html,ctx){return html.includes('<!--site:start--><!--site:end-->')?fill(html,normalize(ctx.path)):html;},
 generateBundle:{order:'post',handler(_,bundle){const shell=bundle['index.html'];if(!shell)throw new Error('Missing HTML shell for static pages');for(const route of routes.filter(r=>r!=='/'))this.emitFile({type:'asset',fileName:`${route.slice(1)}index.html`,source:fill(String(shell.source),route)});}}
}],build:{chunkSizeWarningLimit:600},server:{host:'127.0.0.1'},preview:{host:'127.0.0.1'}});
