/** Product studies derived from supplied samples. Not manufacturing or test records. */
const root='/images/previews/site-coherence-20261019/';
type Study={name:string;src:string;srcset:string;width:number;height:number;alt:string;original:string};
const study=(name:string,width:number,height:number,alt:string,original:string):Study=>({
  name,src:`${root}${name}-${width}.webp`,width,height,alt,original,
  srcset:[...new Set([640,960,1536,2048,width])].filter(value=>value<=width).sort((a,b)=>a-b).map(value=>`${root}${name}-${value}.webp ${value}w`).join(', '),
});
export const coherenceMedia={
  label:study('label-reading-printed',1374,1145,'HAN XING CBB65 capacitor marked 20 µF ±5%, 450 VAC and 50/60 Hz.','/images/real/cbb65-2.jpg'),
  terminals:study('terminal-comparison',1536,1024,'CBB65 single-run and dual-run capacitors with two and three terminal groups.','/images/real/cbb65-dual-run-7.jpg'),
  measurement:study('measurement-flatlay',1536,1024,'HAN XING CBB60 capacitor with wire leads beside a caliper.','/images/real/cbb60-hanxing-wired.jpg'),
  panorama:study('fit-panorama-complete-20261020',2098,749,'HAN XING CBB65 capacitor with its complete metal case, label and terminal groups visible.','/images/real/cbb65-2.jpg'),
};
export const findCoherenceMedia=(src:string)=>Object.values(coherenceMedia).find(asset=>asset.src===src);
