import { products, productHref } from './site';
const root = '/images/previews/satechi-fidelity-20261018';
export const seriesTabs = [
  { label: 'Series specifications', href: '/products/', cta: 'Compare all series', cards: products.map(product => ({
    title: `${product.code} · ${product.shortName}`, href: productHref(product),
    image: `/images/reference-20261012/${product.code.toLowerCase()}-studio.webp`, alt: `${product.code} motor capacitor`,
    lines: product.code === 'CBB65' ? ['Single: 2–100 µF · 110–450 VAC', 'Dual: 1+15 to 15+80 µF · 370–450 VAC'] : [product.capacitance, product.voltage],
  })) },
  { label: 'Original samples', href: '/products/photographs/', cta: 'View sample photographs', cards: products.map(product => ({
    title: `${product.code} original sample`, href: productHref(product) + '#sample-photographs', image: product.image, alt: product.imageAlt,
    lines: ['Supplied product photograph.', 'Check the proposed model and drawing.'], kind: 'sample' as const,
  })) },
];
export const guideTabs = [
  { label: 'Technical guides', href: '/resources/articles/', cta: 'All technical guides', cards: [
    { title: 'Read the capacitor label', href: '/resources/read-motor-capacitor-label/', image: root + '/category-cbb65.webp', alt: 'CBB65 metal-can capacitor with its printed label visible.', lines: ['Copy the original µF and VAC, along with the other label markings.'], kind: 'guide' as const },
    { title: 'Dimensions & connections', href: '/resources/dimensions-terminals-mounting/', image: root + '/fit-desktop.webp', alt: 'CBB60 and CBB61 capacitors beside a caliper.', lines: ['Check the case, mounting space, terminals and wiring.'], kind: 'guide' as const },
    { title: 'Run and start duty', href: '/resources/start-vs-run-capacitors/', image: root + '/category-cd60.webp', alt: 'CD60 motor-start capacitor.', lines: ['The motor circuit specifies the duty. Check it before choosing a series.'], kind: 'guide' as const },
    { title: 'Single or dual run', href: '/resources/single-vs-dual-run-capacitors/', image: '/images/real/cbb65-2.jpg', alt: 'CBB65 single-run capacitor.', lines: ['Read both capacitance values on a dual-run capacitor.'], kind: 'guide' as const },
  ] },
  { label: 'Buying & shipping', href: '/buying-guide/', cta: 'Buying & shipping guide', cards: [
    { title: 'Prepare your inquiry', href: '/buying-guide/', image: root + '/inquiry.webp', alt: 'CBB60, CBB61, CBB65 and CD60 capacitor formats.', lines: ['Send the original label, specifications, quantity and destination.'], kind: 'guide' as const },
    { title: 'Approve the sample', href: '/oem/', image: root + '/category-cbb60.webp', alt: 'CBB60 motor-run capacitor.', lines: ['Confirm the drawing, connections, label and packaging version.'], kind: 'guide' as const },
    { title: 'Order & shipping checklist', href: '/resources/motor-capacitor-order-shipment-checklist/', image: '/images/real/batch-products.jpg', alt: 'Capacitor samples grouped on a work surface.', lines: ['Review the agreed model, packing, dispatch and shipping documents.'], kind: 'guide' as const },
    { title: 'Buyer FAQ', href: '/faq/', image: root + '/category-cbb61.webp', alt: 'CBB61 fan-run capacitor.', lines: ['Questions about samples, minimum quantities and model information.'], kind: 'guide' as const },
  ] },
];
