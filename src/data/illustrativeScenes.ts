export type IllustrativeScene = {
  src: string;
  alt: string;
  title: string;
  text: string;
};

export const factoryScenes: IllustrativeScene[] = [
  {
    src: '/images/illustrative/factory-process-v3.webp',
    alt: 'Capacitor winding equipment with an operator working beside component trays.',
    title: 'At the winding station',
    text: 'The equipment, materials and work instructions should match the capacitor being ordered.',
  },
  {
    src: '/images/illustrative/team-at-work-v3.webp',
    alt: 'Two operators working with capacitor components and winding equipment.',
    title: 'Workstation checks',
    text: 'For a factory review, ask to see the work instruction and how changes are recorded at each station.',
  },
  {
    src: '/images/illustrative/sample-review.webp',
    alt: 'Capacitor sample beside a caliper and a drawing on a worktable.',
    title: 'Sample and drawing',
    text: 'The approved sample and drawing should agree on the rating, dimensions and connections.',
  },
  {
    src: '/images/illustrative/inspection-setup.webp',
    alt: 'Hands connecting a capacitor to test equipment.',
    title: 'Electrical testing',
    text: 'For the selected model, request the test method, acceptance limits and dated results.',
  },
  {
    src: '/images/illustrative/carton-packing.webp',
    alt: 'Electrical components placed in carton dividers for packing.',
    title: 'Packing protection',
    text: 'Specify how terminals are protected and how many units go into each inner pack and carton.',
  },
  {
    src: '/images/illustrative/dispatch-loading.webp',
    alt: 'Cartons being moved across a warehouse loading area.',
    title: 'Before dispatch',
    text: 'Check carton marks, package count and weights against the packing list and purchase order.',
  },
];

export const homeScenes: IllustrativeScene[] = [
  factoryScenes[0],
  factoryScenes[1],
  factoryScenes[2],
  {
    src: '/images/illustrative/buyer-discussion-v3.webp',
    alt: 'Two people discussing capacitor samples and a drawing at a worktable.',
    title: 'Drawing discussion',
    text: 'A sample and connection drawing give both sides a common reference before a model is approved.',
  },
];

export const packingPreviewScenes: IllustrativeScene[] = [
  factoryScenes[4],
  {
    src: '/images/illustrative/warehouse-staging.webp',
    alt: 'Cartons grouped on pallets in a warehouse staging area.',
    title: 'Carton count',
    text: 'Dated packing photos can help check carton marks and quantities before carrier pickup.',
  },
  {
    src: '/images/illustrative/container-handover.webp',
    alt: 'Worker moving a wrapped pallet toward a freight container.',
    title: 'Carrier pickup',
    text: 'Record the pickup date and package count alongside the agreed transport document.',
  },
];

export const packingScenes: IllustrativeScene[] = [
  factoryScenes[4],
  packingPreviewScenes[1],
  factoryScenes[5],
  packingPreviewScenes[2],
  {
    src: '/images/illustrative/export-document-review.webp',
    alt: 'Shipping forms being checked beside a carton.',
    title: 'Shipping paperwork',
    text: 'The invoice, packing list and transport record should carry matching order details.',
  },
];
