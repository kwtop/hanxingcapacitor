import {readFile,readdir,writeFile} from 'node:fs/promises';
import ts from 'typescript';
const root=new URL('../',import.meta.url);
const entries=JSON.parse(await readFile(new URL('docs/spanish-localization-20261106/source-inventory.json',root),'utf8'));
const dictionary={}; const used=new Set();
for(const file of (await readdir(new URL('src/i18n/es/',root))).filter(f=>f.endsWith('.tsv')).sort()){
  for(const line of (await readFile(new URL('src/i18n/es/'+file,root),'utf8')).split(/\r?\n/).filter(Boolean)){
    const split=line.indexOf('|'),id=Number(line.slice(0,split)),value=line.slice(split+1);
    if(!entries[id-1]||split<1||!value||used.has(id))throw new Error('Invalid/duplicate Spanish segment: '+file+' '+id);
    used.add(id);dictionary[entries[id-1].text]=value;
  }
}
Object.assign(dictionary,JSON.parse(await readFile(new URL('src/i18n/es-ui.json',root),'utf8')),JSON.parse(await readFile(new URL('src/i18n/es-extra.json',root),'utf8')));
// Photo-library labels share exact, reviewed caption fragments. Compose only
// fixed UI wrappers; never translate prose by replacing individual words.
for(const [en,es]of Object.entries(dictionary)){
  if(/^P\d{3} · /.test(en))dictionary[en.replace(/^P\d{3} · /,'')]=es.replace(/^P\d{3} · /,'');
}
const preserved=new Set(['HAN XING','Hanxing Capacitor','HAN XING / Hanxing Capacitor','Hangzhou Zebang Refrigeration Equipment Co., Ltd.','© 2026 Hangzhou Zebang Refrigeration Equipment Co., Ltd.','WhatsApp','OEM','CBB65 CAPACITOR','C / COMMON','HERM','FAN','TDK AC Film Capacitors','IEC 60252-1:2010+A1:2013']);
function allowed(s){return preserved.has(s)||/^WhatsApp[ ·+\d-]/.test(s)||!/[a-z]{2}/i.test(s.replace(/(?:CBB6[015]|CD60|VAC|AC|IEC|EN|µF|Hz|mm|°C|SH|CQC|CE|P\d+|S\d|\bL\b|\bW\b|\bH\b|\bD\b)/g,''));}
function translate(s){
  if(dictionary[s])return dictionary[s];if(allowed(s))return s;
  let m;
  for(const [pattern,prefix]of [[/^Further reading for (.+)$/,'Más información: '],[/^Enlarge (.+)$/,'Ampliar: '],[/^Open full image: (.+)$/,'Ampliar imagen: '],[/^Open full photograph: (.+)$/,'Ampliar fotografía: ']]){
    if((m=s.match(pattern))){const value=translate(m[1]);if(value)return prefix+value;}
  }
  if((m=s.match(/^Select photograph (\d+): (.+)$/))){const value=translate(m[2]);if(value)return `Seleccionar fotografía ${m[1]}: ${value}`;}
  if((m=s.match(/^(CBB6[015]|CD60) capacitor sample: (.+)$/))){const value=translate(m[2]);if(value)return `Muestra de condensador ${m[1]}: ${value}`;}
  if((m=s.match(/^View photograph (P\d+): (.+)$/))){const value=translate(m[2]);if(value)return `Ver fotografía ${m[1]}: ${value}`;}
  if((m=s.match(/^(P\d{3} · )(.+)$/))){const value=translate(m[2]);if(value)return m[1]+value;}
  return null;
}
let composed=0;const missing=[];
for(const entry of entries){const result=translate(entry.text);if(result===null)missing.push(entry);else if(!dictionary[entry.text]){dictionary[entry.text]=result;composed++;}}
await writeFile(new URL('src/i18n/es.generated.json',root),JSON.stringify(dictionary,null,2)+'\n');
const reactUi={};
for(const folder of ['src/components/','src/lib/'])for(const file of (await readdir(new URL(folder,root))).filter(f=>/\.tsx?$/.test(f))){
  const source=ts.createSourceFile(file,await readFile(new URL(folder+file,root),'utf8'),ts.ScriptTarget.Latest,true,file.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  function visit(node){
    if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)||ts.isJsxText(node)){
      const value=node.text.replace(/\s+/g,' ').trim();if(dictionary[value])reactUi[value]=dictionary[value];
    }ts.forEachChild(node,visit);
  }visit(source);
}
await writeFile(new URL('src/i18n/es-react-ui.generated.json',root),JSON.stringify(reactUi,null,2)+'\n');
await writeFile(new URL('docs/spanish-localization-20261106/missing-segments.json',root),JSON.stringify(missing,null,2)+'\n');
console.log(JSON.stringify({sourceSegments:entries.length,reviewedSegments:used.size,composedOrPreserved:composed,missing:missing.length}));
for(const entry of missing)console.log(`${entries.indexOf(entry)+1}\t${entry.text}`);
if(missing.length)process.exitCode=1;
