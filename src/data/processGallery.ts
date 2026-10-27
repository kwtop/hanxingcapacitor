import type { WorkshopPhoto } from './workshopPhotos';

const sourceFrames = new Set([
  '01-film-control', '22-blue-cartons', '24-test-display',
  '26-boxing-table', '29-lift-to-truck', '30-truck-handover',
]);
const landscapeFrames = new Set([
  '01-film-control', '02-film-machine', '03-machine-output', '05-line-wide', '06-press-worker',
  '07-reel-equipment', '09-assembly-machine', '13-terminal-array', '14-press-detail',
  '17-empty-cans', '20-component-pile', '23-tray-racks', '28-outdoor-pallets',
]);

const photo = (slug: string, caption: string, alt: string): WorkshopPhoto => ({
  slug,
  caption,
  alt: `${alt} — ${sourceFrames.has(slug) ? 'source video frame' : 'illustrative ImageGen refinement of supplied footage'}.`,
  illustrative: !sourceFrames.has(slug),
  frame: landscapeFrames.has(slug) ? 'landscape' : 'portrait',
});

export const processGallery = [
  {
    id: 'film-equipment',
    eyebrow: '01 / Equipment',
    title: 'Film and production equipment',
    intro: 'A look at the machines, reels and operators visible in the supplied production clips.',
    photos: [
      photo('02-film-machine', 'Film-processing equipment', 'Enclosed film-processing equipment and rollers'),
      photo('07-reel-equipment', 'Reels on the line', 'Reels and automated equipment'),
      photo('01-film-control', 'Control panel', 'Control display beside workshop equipment'),
      photo('03-machine-output', 'Tooling and output path', 'Metal tooling and output path on a machine'),
      photo('04-workstation-operator', 'Operator at equipment', 'Assembly equipment at an operator workstation'),
      photo('05-line-wide', 'Equipment line', 'Equipment line and operator in the workshop'),
      photo('06-press-worker', 'Press workstation', 'Operator working beside a press'),
    ],
  },
  {
    id: 'can-assembly',
    eyebrow: '02 / Assembly',
    title: 'Can bodies and component work',
    intro: 'Close views of metal can bodies, tooling and manual handling. These images show visible work, not a complete or certified process order.',
    photos: [
      photo('09-assembly-machine', 'Assembly equipment', 'Gloved hands beside metal cans at assembly equipment'),
      photo('08-can-sorting', 'Sorting can bodies', 'Worker sorting metal can bodies at a table'),
      photo('10-assembly-hand', 'Guiding a can', 'Gloved hand guiding a metal can at equipment'),
      photo('11-bench-detail', 'Bench work', 'Gloved hand at a component workbench'),
      photo('12-can-arrangement', 'Arranging can bodies', 'Worker arranging can bodies'),
      photo('13-terminal-array', 'Terminal ends', 'Metal can bodies with terminal ends in a tray'),
      photo('14-press-detail', 'Press tooling', 'Press tooling at a workshop station'),
      photo('15-cans-on-table', 'Metal cans on the table', 'Metal can assemblies on a worktable'),
      photo('16-gloved-can', 'Can handling detail', 'Gloved hands working at an open metal can'),
      photo('17-empty-cans', 'Empty can bodies', 'Empty metal can bodies in trays'),
      photo('18-can-grid', 'Can bodies in rows', 'Rows of metal can bodies being handled'),
      photo('19-equipment-station', 'Workstation close-up', 'Gloved hands and a metal part at a workshop station'),
      photo('20-component-pile', 'Component bin', 'Small cylindrical parts in a work bin'),
      photo('21-can-machine', 'Can body at tooling', 'Metal can body beside workshop tooling'),
    ],
  },
  {
    id: 'finish-pack',
    eyebrow: '03 / Finish',
    title: 'Testing views and packing work',
    intro: 'Scenes show equipment, cartons and hands at packing tables. Screen readings and printed marks must be checked against the original footage and order records.',
    photos: [
      photo('23-tray-racks', 'Can bodies in trays', 'Rows of metal can bodies held in cardboard trays'),
      photo('25-packing-worker', 'Packing individual boxes', 'Worker handling blue individual boxes at a packing station'),
      photo('22-blue-cartons', 'Blue cartons', 'Stacks of blue individual product cartons'),
      photo('24-test-display', 'Electrical equipment display', 'Electrical testing equipment display'),
      photo('26-boxing-table', 'Boxes at the table', 'Worker arranging individual boxes at a table'),
      photo('27-bench-rows', 'Rows beside the workstation', 'Worker beside rows of metal can bodies'),
    ],
  },
  {
    id: 'dispatch',
    eyebrow: '04 / Dispatch',
    title: 'Pallets and loading',
    intro: 'The source clips show outdoor pallet staging and truck loading. Shipment status still depends on the matching transport record.',
    photos: [
      photo('28-outdoor-pallets', 'Pallets outside', 'Wrapped cartons on pallets outside a warehouse'),
      photo('29-lift-to-truck', 'Lift toward the truck', 'Forklift lifting wrapped cartons toward a truck'),
      photo('30-truck-handover', 'Cartons at the truck', 'People handling cartons at a red truck'),
    ],
  },
] as const;
