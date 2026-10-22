/** Product studies derived from supplied samples. Not manufacturing or test records. */
const root='/images/previews/site-coherence-20261019/';
type Study={name:string;src:string;srcset:string;width:number;height:number;alt:string;original:string};
const study=(name:string,width:number,height:number,alt:string,original:string):Study=>({
  name,src:`${root}${name}-${width}.webp`,width,height,alt,original,
  srcset:[...new Set([640,960,1536,2048,width])].filter(value=>value<=width).sort((a,b)=>a-b).map(value=>`${root}${name}-${value}.webp ${value}w`).join(', '),
});
export const coherenceMedia={
  label:study('label-reading-printed',1374,1145,'Illustrative reframing of the supplied Hanxing CBB65 sample, with 20 µF ±5%, 450VAC and 50/60Hz printed on the aluminum case.','/images/real/cbb65-2.jpg'),
  terminals:study('terminal-comparison',1536,1024,'Illustrative comparison of the supplied Hanxing single-run two-group and dual-run three-group CBB65 terminal formats.','/images/real/cbb65-dual-run-7.jpg'),
  measurement:study('measurement-flatlay',1536,1024,'Illustrative Hanxing CBB60 lying beside a caliper, with its leads complete; no measurement result is shown.','/images/real/cbb60-hanxing-wired.jpg'),
  panorama:study('fit-panorama-complete-20261020',2098,749,'Illustrative full-length Hanxing CBB65 product study, with both terminal groups, the printed label and the complete aluminum case visible.','/images/real/cbb65-2.jpg'),
};
export const findCoherenceMedia=(src:string)=>Object.values(coherenceMedia).find(asset=>asset.src===src);
