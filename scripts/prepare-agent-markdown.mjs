import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {publicPageMarkdown} from './lib/agent-markdown.mjs';

export function publicMarkdownRoutes(paths){
  // Resource families grow with the editorial library. The negotiation handler
  // still serves Markdown only for exact paths present in the public manifest.
  const families=['/resources/','/es/resources/'];
  const grouped=families.filter(prefix=>paths.some(path=>path.startsWith(prefix)));
  const exact=paths.filter(path=>!grouped.some(prefix=>path.startsWith(prefix)));
  return {version:1,include:['/api/*','/admin','/admin/*',...exact,...grouped.map(prefix=>prefix+'*')],exclude:[]};
}

export async function prepareAgentMarkdown(directory,origin,{required=true}={}){
  const sitemap=await readFile(join(directory,'sitemap.xml'),'utf8'),paths=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>new URL(match[1]));
  const documents={},pages=[];
  for(const url of paths){
    if(url.origin!==origin||!url.pathname.endsWith('/')||/^\/(?:api|admin)(?:\/|$)/.test(url.pathname))throw new Error('Unsafe Markdown path: '+url.href);
    const path=url.pathname,html=await readFile(join(directory,path.slice(1),'index.html'),'utf8');
    const result=publicPageMarkdown(html,origin),bytes=Buffer.byteLength(result.markdown);
    documents[path]={markdown:result.markdown,canonical:result.canonical,language:result.language};
    pages.push({path,htmlBytes:Buffer.byteLength(html),markdownBytes:bytes,tables:result.tables,sha256:createHash('sha256').update(result.markdown).digest('hex')});
  }
  if(required&&!pages.length)throw new Error('No public Markdown pages generated');
  const routes=publicMarkdownRoutes(Object.keys(documents));
  if(routes.include.length>100)throw new Error('Public Markdown routing exceeds Pages route limit; group public route families before adding more pages.');
  await mkdir(resolve('.backend-functions'),{recursive:true});
  await writeFile(resolve('.backend-functions/public-markdown.json'),JSON.stringify(documents)+'\n');
  await writeFile(join(directory,'_routes.json'),JSON.stringify(routes,null,2)+'\n');
  await mkdir(resolve('.qa'),{recursive:true});
  const report={checkedAt:new Date().toISOString(),origin,pages,publicPages:pages.length,routeCount:routes.include.length,htmlBytes:pages.reduce((sum,page)=>sum+page.htmlBytes,0),markdownBytes:pages.reduce((sum,page)=>sum+page.markdownBytes,0)};
  await writeFile(resolve('.qa/agent-markdown-build.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({markdownPages:pages.length,publicRouteCount:routes.include.length,htmlBytes:report.htmlBytes,markdownBytes:report.markdownBytes}));
}
