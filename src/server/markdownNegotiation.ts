export interface PublicMarkdownPage { markdown:string; canonical:string; language:string }
export type PublicMarkdownPages=Record<string,PublicMarkdownPage>;

/** Markdown requires an explicit, acceptable media range; browser wildcards retain HTML. */
export function prefersMarkdown(accept:string|null):boolean {
  const ranges=new Map<string,number>();
  for(const part of (accept||'').slice(0,8192).split(',')){
    const [media,...parameters]=part.toLowerCase().trim().split(';');let quality=1;
    for(const parameter of parameters){
      if(!/^\s*q\s*=/i.test(parameter))continue;
      const match=/^\s*q\s*=\s*(0(?:\.\d{0,3})?|1(?:\.0{0,3})?)\s*$/.exec(parameter);
      quality=match?Number(match[1]):0;
    }
    ranges.set(media.trim(),Math.max(ranges.get(media.trim())??0,quality));
  }
  const markdown=ranges.get('text/markdown')||0,html=ranges.get('text/html')??ranges.get('text/*')??ranges.get('*/*')??0;
  return markdown>0&&markdown>=html;
}
export function varyAccept(headers:Headers){
  const current=headers.get('Vary')?.split(',').map(value=>value.trim()).filter(Boolean)||[];
  if(!current.some(value=>value==='*'||value.toLowerCase()==='accept'))headers.set('Vary',[...current,'Accept'].join(', '));
}
export async function negotiatePublicMarkdown(request:Request,pages:PublicMarkdownPages,next:()=>Promise<Response>):Promise<Response>{
  const url=new URL(request.url),page=Object.hasOwn(pages,url.pathname)?pages[url.pathname]:undefined;
  if(!page||!['GET','HEAD'].includes(request.method))return next();
  if(prefersMarkdown(request.headers.get('Accept'))){
    const headers=new Headers({'Content-Type':'text/markdown; charset=utf-8','Content-Language':page.language,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Accept','Link':`<${page.canonical}>; rel="canonical", <${page.canonical}>; rel="alternate"; type="text/html"`});
    // Pages preview origins remain non-indexable for every representation.
    if(url.hostname!==new URL(page.canonical).hostname)headers.set('X-Robots-Tag','noindex, nofollow, noarchive');
    return new Response(request.method==='HEAD'?null:page.markdown,{headers});
  }
  const response=await next();
  if((response.status===200&&response.headers.get('Content-Type')?.includes('text/html'))||response.status===304){
    const result=new Response(response.body,response);varyAccept(result.headers);
    result.headers.append('Link',`<${page.canonical}>; rel="alternate"; type="text/markdown"`);
    return result;
  }
  return response;
}
