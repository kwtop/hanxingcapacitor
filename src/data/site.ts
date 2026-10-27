export const SITE_NAME = 'Hanxing Capacitor';
export const PUBLIC_BRAND_NAME = 'HAN XING';
export const PUBLIC_COMPANY_NAME = 'Hangzhou Zebang Refrigeration Equipment Co., Ltd.';
export const PUBLIC_BUSINESS_ADDRESS: string = 'Jiegu Village, Jiegu Township, Pingxiang County, Xingtai, Hebei, China';
export const PUBLIC_EMAIL = 'ManuelaMusio570@gmail.com';
export const STANDARD_MOQ_PCS = 1000;
export const STANDARD_MOQ_DESCRIPTION = `${STANDARD_MOQ_PCS.toLocaleString('en-US')} pieces. The quotation confirms the minimum for your selected rating, label and packing.`;
export const PUBLIC_PHONE = '+86 153 3339 4111';
export const WHATSAPP_NUMBER = PUBLIC_PHONE.replace(/\D/g, '');
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const OFFICIAL_SITE = 'https://www.hanxingcapacitor.com';

export type Product = {
  code: string;
  slug: string;
  title: string;
  shortName: string;
  function: 'Run' | 'Start';
  tagline: string;
  intro: string;
  image: string;
  imageAlt: string;
  catalogImage: string;
  catalogImageAlt: string;
  capacitance: string;
  voltage: string;
  tolerance: string;
  frequency: string;
  temperature: string;
  dimensions: string;
  construction: string;
  terminals: string;
  applications: string[];
  procurement: string[];
  notes: string[];
  decisionChecks: string[];
  decisionGuide: { label: string; href: string };
  source: string;
};

export const products: Product[] = [
  {
    code: 'CBB60', slug: 'cbb60-motor-run-capacitor', title: 'CBB60 motor run capacitors',
    shortName: 'Motor run', function: 'Run',
    tagline: 'Cylindrical run capacitors for water pumps and single-phase motors.',
    intro: 'CBB60 is a metallized polypropylene film run capacitor in a cylindrical plastic case. It is used in water pumps, washing machines, smoke exhaust equipment and other single-phase motors.',
    image: '/images/real/cbb60-hanxing-wired.jpg', imageAlt: 'Photograph of a Hanxing-marked white CBB60 capacitor sample with two insulated leads.',
    catalogImage: '/images/generated/site/cbb60-main.webp', catalogImageAlt: 'Cylindrical motor-run capacitor with two insulated leads and a threaded mounting stud.', capacitance: '2–100 µF', voltage: '110–450 VAC',
    tolerance: '±5% (J), ±10% (K)', frequency: '50/60 Hz', temperature: '−40 to +85 °C',
    dimensions: 'Diameter 30–60 mm; height 60–125 mm (series range)',
    construction: 'Metallized polypropylene film in an insulated plastic case.',
    terminals: 'Lead wires or quick-connect terminals.',
    applications: ['Water pumps', 'Washing machines', 'Smoke exhaust equipment', 'Compatible single-phase motors'],
    procurement: ['Original motor or capacitor label', 'Capacitance and rated voltage', 'Body size and mounting space', 'Wire or terminal format', 'Quantity and destination'],
    notes: ['Specify the rating, case size and connections in your inquiry.', 'Request the wire length, life class and any applicable certificate for the model quoted.'],
    decisionChecks: ['Check that the motor drawing calls for run duty.', 'Record the original µF, VAC and frequency markings.', 'Measure the body, fixing stud and installed lead clearance.'],
    decisionGuide: { label: 'Check run versus start duty', href: '/resources/start-vs-run-capacitors/' },
    source: `${OFFICIAL_SITE}/products/cbb60-motor-run-capacitor/`,
  },
  {
    code: 'CBB61', slug: 'cbb61-fan-capacitor', title: 'CBB61 fan capacitors',
    shortName: 'Fan run', function: 'Run',
    tagline: 'Compact rectangular run capacitors for fans, blowers and appliance motors.',
    intro: 'CBB61 is a film run capacitor in a compact rectangular case for fans, blowers and small single-phase motors. Applications also include selected air-conditioner and washing-machine motors.',
    image: '/images/real/cbb61-13.jpg', imageAlt: 'Photograph of three rectangular CBB61 samples with blade terminals.',
    catalogImage: '/images/generated/site/cbb61-main.webp', catalogImageAlt: 'Rectangular motor capacitor housing with blade terminals.', capacitance: '0.5–35 µF', voltage: '250–450 VAC',
    tolerance: '±5% (sample labels)', frequency: '50/60 Hz', temperature: '40/70/21 (sample label)',
    dimensions: 'L 37–73 × W 12–40 × H 24–53 mm (series range)',
    construction: 'Metallized polypropylene film in an insulated plastic shell.',
    terminals: 'Lead wires or quick-connect terminals.',
    applications: ['Fans', 'Blowers', 'Selected air conditioners', 'Selected washing machines'],
    procurement: ['Equipment and motor model', 'Original capacitor label', 'Length, width, height and fixing method', 'Lead count, length or connector', 'Quantity and destination'],
    notes: ['Parts with the same wire count can have different connections. Compare them with the wiring diagram.', 'Use a drawing or approved sample to check the connector, lead exit and mounting.'],
    decisionChecks: ['Record µF and VAC from the original label.', 'Compare case dimensions, fixing points and lead or blade geometry.', 'Check the wiring connection even when the wire count matches.'],
    decisionGuide: { label: 'Review dimensions and terminal fit', href: '/resources/dimensions-terminals-mounting/' },
    source: `${OFFICIAL_SITE}/products/cbb61-fan-capacitor/`,
  },
  {
    code: 'CBB65', slug: 'cbb65-air-conditioner-capacitor', title: 'CBB65 HVAC capacitors',
    shortName: 'HVAC run', function: 'Run',
    tagline: 'Single and dual-run metal-can capacitors for HVAC and refrigeration motors.',
    intro: 'CBB65 metal-can run capacitors are for air conditioners, compressors, refrigerated air dryers and other HVAC equipment. Single and dual-run versions have different ratings and terminal layouts.',
    image: '/images/real/cbb65-2.jpg', imageAlt: 'Photograph of a CBB65 metal-can capacitor sample marked 20 µF and 450 VAC.',
    catalogImage: '/images/generated/site/cbb65-main.webp', catalogImageAlt: 'Metal-can motor-run capacitor with two terminal groups.', capacitance: 'Single: 2–100 µF; dual: 1+15 to 15+80 µF',
    voltage: 'Single: 110–450 VAC; dual: 370–450 VAC', tolerance: '±5% (J), ±10% (K)',
    frequency: '50/60 Hz', temperature: '−40 to +85 °C',
    dimensions: 'Single: D 30–60 × H 55–125 mm (2–100 µF table rows); dual: model drawing required for the selected combination',
    construction: 'Metallized polypropylene film in a metal can.',
    terminals: 'Terminal-group layouts vary by model; match the layout to the wiring diagram.',
    applications: ['Air conditioners', 'Compressors', 'Refrigerated air dryers', 'HVAC motor systems'],
    procurement: ['Single or dual-run function', 'Each µF value and rated VAC', 'Original terminal-group layout', 'Diameter, height and mounting', 'Equipment model, quantity and destination'],
    notes: ['A dual-run label gives a separate value for each capacitance section. Copy both as printed.', 'Use the model drawing to identify each terminal group and its connection.'],
    decisionChecks: ['Identify single-run or dual-run from the motor documentation.', 'For dual-run, record both µF values and the rated VAC.', 'Send a clear terminal-group photo or the drawing for the proposed model.'],
    decisionGuide: { label: 'Compare single and dual run', href: '/resources/single-vs-dual-run-capacitors/' },
    source: `${OFFICIAL_SITE}/products/cbb65-air-conditioner-capacitor/`,
  },
  {
    code: 'CD60', slug: 'cd60-start-capacitor', title: 'CD60 motor start capacitors',
    shortName: 'Motor start', function: 'Start',
    tagline: 'Electrolytic start capacitors for switched single-phase AC motor circuits.',
    intro: 'CD60 is an aluminium electrolytic motor-start capacitor. Its circuit must disconnect the capacitor after startup.',
    image: '/images/real/cd60-25.jpg', imageAlt: 'Photograph of a CD60 cylindrical motor-start capacitor sample.',
    catalogImage: '/images/generated/site/cd60-main.webp', catalogImageAlt: 'Cylindrical motor-start capacitor with two blade terminals.', capacitance: '20–1500 µF', voltage: '110–330 VAC',
    tolerance: '±10% (K), ±20% (M)', frequency: '50/60 Hz', temperature: '−20 to +65 °C',
    dimensions: 'Approximately 34 × 60 to 63 × 110 mm; use the model drawing for exact dimensions.',
    construction: 'Aluminium electrolytic start-capacitor construction.',
    terminals: 'Blade terminals or wire leads, depending on the model.',
    applications: ['Compatible single-phase AC motor starting', 'Selected pumps', 'Selected compressors'],
    procurement: ['Original start-capacitor label and motor model', 'Capacitance and rated VAC', 'Starting circuit / duty details', 'Body size and terminal configuration', 'Quantity and destination'],
    notes: ['CD60 is for starting duty. It cannot replace a continuously connected run capacitor, even at the same capacitance and case size.', 'Request the starting-duty and time ratings for the model quoted.'],
    decisionChecks: ['Verify the motor uses a start capacitor and check its starting circuit.', 'Record the original µF, VAC, frequency and any duty marking.', 'Ask for model-specific duty and time data; do not infer it from the series range.'],
    decisionGuide: { label: 'Check start versus run duty', href: '/resources/start-vs-run-capacitors/' },
    source: `${OFFICIAL_SITE}/products/cd60-start-capacitor/`,
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const productHref = (product: Product) => `/products/${product.slug}/`;

export type Application = {
  slug: string;
  title: string;
  shortName: string;
  listing: string;
  intro: string;
  image: string;
  imageHeight: number;
  imageAlt: string;
  series: string[];
  checks: string[];
};

export const applications: Application[] = [
  {
    slug: 'pumps-and-water-systems', title: 'Water pumps | CBB60 motor run capacitors', shortName: 'Water pumps',
    listing: 'CBB60 cylindrical run capacitors for water-pump motors.',
    intro: 'CBB60 run capacitors and CD60 start capacitors for water-pump motors. Select the duty from the motor circuit, then match the rating and installed fit.',
    image: '/images/generated/site/home-application-water-pumps-20261013.webp', imageHeight: 800, imageAlt: 'Illustration of a centrifugal water pump and motor.',
    series: ['CBB60', 'CD60'],
    checks: ['Pump and motor model', 'Original capacitor label', 'Run versus start function', 'Body size and mounting', 'Lead/terminal format and quantity'],
  },
  {
    slug: 'fans-and-ventilation', title: 'Fans and blowers | CBB61 motor run capacitors', shortName: 'Fans and blowers',
    listing: 'CBB61 rectangular run capacitors for fans and blowers.',
    intro: 'CBB61 rectangular and CBB60 cylindrical run capacitors for fan and blower motors. Compare ratings, wiring and mounting dimensions.',
    image: '/images/generated/site/home-application-fans-blowers-20261013.webp', imageHeight: 800, imageAlt: 'Illustration of a ventilation fan and motor.',
    series: ['CBB61', 'CBB60'],
    checks: ['Fan or motor model', 'Capacitance and voltage', 'Lead length and connector', 'Mounting or fixing detail', 'Original sample or drawing'],
  },
  {
    slug: 'appliances-and-small-motors', title: 'Washing machines | CBB60 and CBB61 motor capacitors', shortName: 'Washing machines',
    listing: 'CBB60 cylindrical and CBB61 rectangular run capacitors for washing-machine motors.',
    intro: 'CBB60 and CBB61 run-capacitor formats for washing-machine motors, with rating, wiring and mounting checks.',
    image: '/images/generated/site/home-application-washing-machines-20261013.webp', imageHeight: 1000, imageAlt: 'Illustration of a white front-loading washing machine.',
    series: ['CBB60', 'CBB61'],
    checks: ['Equipment and motor model', 'Original capacitor photo or label', 'Electrical values', 'Wiring and fixing details', 'Annual or forecast quantity'],
  },
  {
    slug: 'hvac-and-refrigeration', title: 'Air conditioners / HVAC | CBB65 run capacitors', shortName: 'Air conditioners / HVAC',
    listing: 'CBB65 single and dual-run capacitors for air conditioners, compressors and refrigerated air dryers.',
    intro: 'CBB65 single and dual-run capacitors for HVAC motors, with CD60 for separately switched starting circuits.',
    image: '/images/generated/site/home-application-hvac-20261013.webp', imageHeight: 800, imageAlt: 'Illustration of an outdoor air-conditioning condenser.',
    series: ['CBB65', 'CD60'],
    checks: ['Original capacitor label and equipment model', 'Single or dual-run function', 'Each capacitance value and rated voltage', 'Terminal group and mounting space', 'Quantity, market and document requirements'],
  },
];

export const APPLICATION_SELECTION_INTRO = 'Find a capacitor format for your equipment, then match the motor duty, ratings and connections.';
export const applicationHref = (application: Application) => `/applications/${application.slug}/`;

export const resourceSections = [
  { label: 'Technical guides', href: '/resources/articles/', description: 'Label markings, electrical ratings, series comparisons and installation dimensions.' },
  { label: 'Buying & shipping', href: '/buying-guide/', description: 'Quotation details, sample approval, order terms and shipping records.' },
  { label: 'Buyer FAQ', href: '/faq/', description: 'Minimum quantities, custom labels, samples and shipping documents.' },
];

export const primaryNav = [
  { label: 'Home', href: '/', children: [] },
  { label: 'Products', href: '/products/', children: [...products.map((p) => ({ label: `${p.code} · ${p.shortName}`, href: productHref(p) })), { label: 'Sample photographs', href: '/products/photographs/' }] },
  { label: 'Applications', href: '/applications/', children: applications.map((a) => ({ label: a.shortName, href: applicationHref(a) })) },
  { label: 'OEM & quality', href: '/oem-quality/', children: [{ label: 'OEM & private label', href: '/oem/' }, { label: 'Manufacturing & quality', href: '/factory/' }, { label: 'Process photo gallery', href: '/factory/process-gallery/' }, { label: 'Packing & dispatch', href: '/factory/packing-and-dispatch/' }] },
  { label: 'Resources', href: '/resources/', children: resourceSections },
  { label: 'About', href: '/about/', children: [] },
];

