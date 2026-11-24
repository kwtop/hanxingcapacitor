import {load} from 'cheerio';
import TurndownService from 'turndown';
import {gfm} from 'turndown-plugin-gfm';

/** Convert the same published main content, never a separately authored agent page. */
export function publicPageMarkdown(html,origin){
  const $=load(html),main=$('main').first(),canonical=$('link[rel="canonical"]').attr('href');
  if(!main.length||!canonical||new URL(canonical).origin!==origin)throw new Error('Public Markdown requires a main landmark and canonical URL');
  const language=$('html').attr('lang')||'en',title=$('title').text().trim(),description=$('meta[name="description"]').attr('content')||'';
  const tables=main.find('table').length;
  main.find('script,style,template,noscript,dialog,iframe,[hidden],[aria-hidden="true"],[class*="breadcrumb"],.content-filter-controls,.catalog-empty,.sr-only,.visually-hidden,img[alt=""],.pg-caption > span').remove();
  main.find('form').each((_,node)=>{
    const form=$(node),action=form.attr('action'),label=form.find('button[type="submit"],button:not([type])').first().text().replace(/\s+/g,' ').trim();
    if(!action){form.remove();return;}
    const target=new URL(action,canonical);
    if(target.pathname.startsWith('/api/')){target.pathname=language==='es'?'/es/contact/':'/contact/';target.hash=form.attr('id')||'';target.search='';}
    form.replaceWith($('<p>').append($('<a>').attr('href',target.href).text(label||(language==='es'?'Enviar consulta':'Send inquiry'))));
  });
  main.find('svg').each((_,node)=>{
    const svg=$(node),text=[svg.attr('aria-label'),svg.find('title').first().text(),svg.find('desc').first().text()].filter(Boolean);
    if(text.length)svg.replaceWith($('<p>').text([...new Set(text)].join('. ')));else svg.remove();
  });
  main.find('button').each((_,node)=>{const button=$(node);if(button.find('img').length)button.replaceWith(button.contents());else button.remove();});
  main.find('input,select,textarea,progress,meter').remove();
  // These published layouts render each value on its own line. Keep those
  // boundaries explicit rather than joining capacitance and voltage together.
  main.find('.su-series-values > span').each((_,node)=>{const value=$(node);value.replaceWith($('<p>').append(value.contents()));});
  main.find('dd > small').each((_,node)=>{const note=$(node);note.replaceWith($('<span>').text(' · '+note.text().trim()));});
  main.find('h1,h2,h3,h4,h5,h6').each((_,node)=>{
    const heading=$(node),text=heading.contents().map((__,part)=>part.type==='text'?part.data:$(part).text()).get().join(' ').replace(/\s+/g,' ').trim();
    heading.text(text);
  });
  // A whole card is clickable in HTML; a Markdown link cannot wrap headings
  // and multiple paragraphs. Put that same destination on the card heading.
  main.find('a').each((_,node)=>{
    const anchor=$(node),heading=anchor.find('h1,h2,h3,h4,h5,h6').first(),href=anchor.attr('href');
    if(!heading.length)return;
    const label=heading.text();anchor.replaceWith(anchor.contents());
    if(href)heading.empty().append($('<a>').attr('href',href).text(label));
  });
  main.find('th br,td br').replaceWith('; ');
  main.find('table').each((_,node)=>{
    const table=$(node);
    if(table.find('[rowspan],[colspan]').length||!table.find('tr').first().children().toArray().every(cell=>cell.name==='th'))throw new Error('Markdown needs a regular table heading: '+canonical);
    table.find('thead,tbody,tfoot,tr').addBack().contents().filter((__,part)=>part.type==='text'&&!part.data.trim()).remove();
  });
  for(const [selector,attribute] of [['a','href'],['img','src']])main.find(selector).each((_,node)=>{
    const item=$(node),value=item.attr(attribute);if(!value)return;
    try{const url=new URL(value,canonical);if(['http:','https:','mailto:','tel:'].includes(url.protocol))item.attr(attribute,url.href);else item.removeAttr(attribute);}catch{item.removeAttr(attribute);}
  });
  const service=new TurndownService({headingStyle:'atx',bulletListMarker:'-',codeBlockStyle:'fenced',emDelimiter:'*'});
  service.use(gfm);
  service.addRule('table-cell',{filter:['th','td'],replacement:(content,node)=>{
    const first=Array.prototype.indexOf.call(node.parentNode.childNodes,node)===0;
    return (first?'| ':' ')+content.trim().replace(/\s*\n+\s*/g,' ').replace(/(?<!\\)\|/g,'\\|')+' |';
  }});
  service.addRule('definition-term',{filter:'dt',replacement:content=>'\n\n**'+content.trim()+':** '});
  service.addRule('definition-description',{filter:'dd',replacement:content=>content.trim()+'\n'});
  service.addRule('figure-caption',{filter:'figcaption',replacement:content=>'\n\n'+content.trim()+'\n\n'});
  service.addRule('figure',{filter:'figure',replacement:content=>'\n\n'+content.trim()+'\n\n'});
  service.remove(['script','style','svg','iframe','template']);
  const content=service.turndown(main.html()||'').replace(/\n{3,}/g,'\n\n').trim();
  if(!/^# /m.test(content)||content.length<150)throw new Error('Public Markdown has no substantive heading or content: '+canonical);
  const convertedTables=content.split('\n').filter(line=>/^\|(?:\s*:?-{2,}:?\s*\|)+\s*$/.test(line)).length;
  if(convertedTables!==tables||/<(?:script|style|table|form|astro-island)\b/i.test(content))throw new Error('Public Markdown lost a table or retained page markup: '+canonical);
  const metadata={title,description,url:canonical,language};
  const markdown='---\n'+Object.entries(metadata).map(([key,value])=>key+': '+JSON.stringify(value)).join('\n')+'\n---\n\n'+content+'\n';
  return {markdown,canonical,language,tables};
}
