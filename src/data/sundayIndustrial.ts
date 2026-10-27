/** Product presentations only; original photographs remain the technical evidence. */
import { polishedEditorial } from './imagePolish';
export const sundayIndustrial = {
  catalog: polishedEditorial.catalog,
  connections: polishedEditorial.connections,
  technical: polishedEditorial.technical,
  packing: polishedEditorial.packing,
};
export const findSundayIndustrial = (src: string) => Object.values(sundayIndustrial).find(x => x.src === src);
