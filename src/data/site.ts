export const SITE_NAME = 'Hanxing Capacitor';
export const PUBLIC_COMPANY_NAME = 'Hangzhou Zebang Refrigeration Equipment Co., Ltd.';
export const PUBLIC_BUSINESS_ADDRESS = PUBLIC_COMPANY_NAME;
export const PUBLIC_EMAIL = 'ManuelaMusio570@gmail.com';
export const STANDARD_MOQ_PCS = 1000;
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
    intro: 'CBB60 is a metallized polypropylene film run capacitor in a cylindrical plastic case. Applications include water pumps, washing machines, smoke exhaust equipment and other single-phase motors. Select the rating and connections specified by the motor manufacturer.',
    image: '/images/real/cbb60-hanxing-wired.jpg', imageAlt: 'Photograph of a Hanxing-marked white CBB60 capacitor sample with two insulated leads.',
    catalogImage: '/images/generated/site/cbb60-main.webp', catalogImageAlt: 'Cylindrical motor-run capacitor with two insulated leads and a threaded mounting stud.', capacitance: '2–100 µF', voltage: '110–450 VAC',
    tolerance: '±5% (J), ±10% (K)', frequency: '50/60 Hz', temperature: '−40 to +85 °C',
    dimensions: 'Diameter 30–60 mm; height 60–125 mm (series range)',
    construction: 'Metallized polypropylene film in an insulated plastic case.',
    terminals: 'Lead wires or quick-connect terminals, depending on the model.',
    applications: ['Water pumps', 'Washing machines', 'Smoke exhaust equipment', 'Compatible single-phase motors'],
    procurement: ['Original motor or capacitor label', 'Capacitance and rated voltage', 'Body size and mounting space', 'Wire or terminal format', 'Quantity and destination'],
    notes: ['Availability depends on the combination of rating, case size and connections. Include all three in your inquiry.', 'Request the wire length, life class and any applicable certificate for the model quoted.'],
    decisionChecks: ['Check that the motor drawing calls for run duty.', 'Record the original µF, VAC and frequency markings.', 'Measure the body, fixing stud and installed lead clearance.'],
    decisionGuide: { label: 'Check run versus start duty', href: '/resources/start-vs-run-capacitors/' },
    source: `${OFFICIAL_SITE}/products/cbb60-motor-run-capacitor/`,
  },
  {
    code: 'CBB61', slug: 'cbb61-fan-capacitor', title: 'CBB61 fan capacitors',
    shortName: 'Fan run', function: 'Run',
    tagline: 'Compact rectangular run capacitors for fans, blowers and appliance motors.',
    intro: 'The CBB61 film run capacitor has a compact rectangular case for fans, blowers and small single-phase motors. It is also listed for selected air conditioners and washing machines. Alongside the electrical rating, check the space for the case and the lead or terminal arrangement.',
    image: '/images/real/cbb61-13.jpg', imageAlt: 'Photograph of three rectangular CBB61 samples with blade terminals.',
    catalogImage: '/images/generated/site/cbb61-main.webp', catalogImageAlt: 'Rectangular motor capacitor housing with blade terminals.', capacitance: '0.5–35 µF', voltage: '110–450 VAC',
    tolerance: '±5% (J), ±10% (K)', frequency: '50/60 Hz', temperature: '−40 to +85 °C',
    dimensions: 'L 37–73 × W 12–40 × H 24–53 mm (series range)',
    construction: 'Metallized polypropylene film in an insulated plastic shell.',
    terminals: 'Lead wires or quick-connect terminals, depending on the model.',
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
    intro: 'CBB65 metal-can run capacitors are listed for air conditioners, compressors, cold dryers and related HVAC equipment. Single and dual-run versions have different ratings and terminal layouts. Send the original label and a terminal-end photo so the required configuration can be checked.',
    image: '/images/real/cbb65-2.jpg', imageAlt: 'Photograph of a CBB65 metal-can capacitor sample marked 20 µF and 450 VAC.',
    catalogImage: '/images/generated/site/cbb65-main.webp', catalogImageAlt: 'Metal-can motor-run capacitor with two terminal groups.', capacitance: 'Single: 2–100 µF; dual: published range 1+15 to 15+80 µF',
    voltage: 'Single: 110–450 VAC; dual: 370–450 VAC', tolerance: '±5% (J), ±10% (K)',
    frequency: '50/60 Hz', temperature: '−40 to +85 °C',
    dimensions: 'Single: D 30–65 × H 55–135 mm; dual: D 50–65 × H 75–125 mm',
    construction: 'Metallized polypropylene film in a metal can.',
    terminals: 'Terminal-group layouts vary by model; match the layout to the wiring diagram.',
    applications: ['Air conditioners', 'Compressors', 'Cold dryers', 'HVAC motor systems'],
    procurement: ['Single or dual-run function', 'Each µF value and rated VAC', 'Original terminal-group layout', 'Diameter, height and mounting', 'Equipment model, quantity and destination'],
    notes: ['A dual-run label gives two independent capacitance values. Copy both as printed.', 'Use the model drawing to identify each terminal group and its connection.'],
    decisionChecks: ['Identify single-run or dual-run from the motor documentation.', 'For dual-run, record both µF values and the rated VAC.', 'Send a clear terminal-group photo or the drawing for the proposed model.'],
    decisionGuide: { label: 'Compare single and dual run', href: '/resources/single-vs-dual-run-capacitors/' },
    source: `${OFFICIAL_SITE}/products/cbb65-air-conditioner-capacitor/`,
  },
  {
    code: 'CD60', slug: 'cd60-start-capacitor', title: 'CD60 motor start capacitors',
    shortName: 'Motor start', function: 'Start',
    tagline: 'Electrolytic start capacitors for switched single-phase AC motor circuits.',
    intro: 'CD60 is an aluminium electrolytic capacitor for motor starting. It requires a circuit that switches the capacitor out after starting. Use the motor documentation to select the rating and check the permitted starting duty.',
    image: '/images/real/cd60-25.jpg', imageAlt: 'Photograph of a CD60 cylindrical motor-start capacitor sample.',
    catalogImage: '/images/generated/site/cd60-main.webp', catalogImageAlt: 'Cylindrical motor-start capacitor with two blade terminals.', capacitance: '20–1500 µF', voltage: '110–330 VAC',
    tolerance: '±10% (K), ±20% (M)', frequency: '50/60 Hz', temperature: '−20 to +65 °C',
    dimensions: 'Approximately 34 × 60 to 63 × 110 mm (published series envelope)',
    construction: 'Aluminium electrolytic start-capacitor construction.',
    terminals: 'The series listing describes double-welded sheet terminals or lead output. Specify the connection required.',
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
    listing: 'If the pump motor calls for a run capacitor, start with CBB60. Match the original µF and VAC, then check the case, mounting and lead or terminal connection.',
    intro: 'CBB60 run capacitors for water-pump motors. A separately switched start circuit may need CD60. Compare the motor diagram, original rating and installed fit.',
    image: '/images/generated/site/home-application-water-pumps-20261013.webp', imageHeight: 800, imageAlt: 'Illustration of a centrifugal water pump and motor.',
    series: ['CBB60', 'CD60'],
    checks: ['Pump and motor model', 'Original capacitor label', 'Run versus start function', 'Body size and mounting', 'Lead/terminal format and quantity'],
  },
  {
    slug: 'fans-and-ventilation', title: 'Fans and blowers | CBB61 motor run capacitors', shortName: 'Fans and blowers',
    listing: 'CBB61 is a compact run-capacitor option for fans and blowers. Use the original part to check µF, VAC, the wire or terminal format, and space at its mounting point.',
    intro: 'CBB61 run capacitors for fan and blower motors, with CBB60 relevant where specified. Compare the original rating, wiring and mounting space.',
    image: '/images/generated/site/home-application-fans-blowers-20261013.webp', imageHeight: 800, imageAlt: 'Illustration of a ventilation fan and motor.',
    series: ['CBB61', 'CBB60'],
    checks: ['Fan or motor model', 'Capacitance and voltage', 'Lead length and connector', 'Mounting or fixing detail', 'Original sample or drawing'],
  },
  {
    slug: 'appliances-and-small-motors', title: 'Washing machines | CBB60 and CBB61 motor capacitors', shortName: 'Washing machines',
    listing: 'Washing machines can use different motors. If the one you’re sourcing for needs a run capacitor, compare its original part with CBB60 or CBB61 for rating, connections and fit.',
    intro: 'CBB60 and CBB61 run capacitors for selected washing-machine motors. Match the specific motor, original rating, wiring and installed fit.',
    image: '/images/generated/site/home-application-washing-machines-20261013.webp', imageHeight: 1000, imageAlt: 'Illustration of a white front-loading washing machine.',
    series: ['CBB60', 'CBB61'],
    checks: ['Equipment and motor model', 'Original capacitor photo or label', 'Electrical values', 'Wiring and fixing details', 'Annual or forecast quantity'],
  },
  {
    slug: 'hvac-and-refrigeration', title: 'Air conditioners / HVAC | CBB65 run capacitors', shortName: 'Air conditioners / HVAC',
    listing: 'CBB65 is listed for air conditioners, compressors and cold dryers. Check whether the original circuit uses a single or dual-run capacitor, then match its rating and terminal layout.',
    intro: 'CBB65 single and dual-run capacitors for air conditioners and HVAC equipment. Check the original circuit and terminal mapping; separate start duty is different.',
    image: '/images/generated/site/home-application-hvac-20261013.webp', imageHeight: 800, imageAlt: 'Illustration of an outdoor air-conditioning condenser.',
    series: ['CBB65', 'CD60'],
    checks: ['Original capacitor label and equipment model', 'Single or dual-run function', 'Each capacitance value and rated voltage', 'Terminal group and mounting space', 'Quantity, market and document requirements'],
  },
];

export const APPLICATION_SELECTION_INTRO = 'Browse by equipment, then check the original capacitor and motor documentation before choosing a series.';
export const applicationHref = (application: Application) => `/applications/${application.slug}/`;

export const resourceSections = [
  { label: 'Technical guides', href: '/resources/articles/', description: 'Read capacitor labels and compare series. Check the ratings and dimensions required for your motor.' },
  { label: 'Buying & shipping', href: '/buying-guide/', description: 'Prepare the details for a quotation, then follow the checks for sample approval, ordering and dispatch.' },
  { label: 'Buyer FAQ', href: '/faq/', description: 'Answers to common buying questions, including minimum quantities, custom labels and shipping documents.' },
];

export const primaryNav = [
  { label: 'Home', href: '/', children: [] },
  { label: 'Products', href: '/products/', children: [...products.map((p) => ({ label: `${p.code} · ${p.shortName}`, href: productHref(p) })), { label: 'Sample photographs', href: '/products/photographs/' }] },
  { label: 'Applications', href: '/applications/', children: applications.map((a) => ({ label: a.shortName, href: applicationHref(a) })) },
  { label: 'OEM & quality', href: '/oem-quality/', children: [{ label: 'OEM & private label', href: '/oem/' }, { label: 'Manufacturing & quality', href: '/factory/' }, { label: 'Packing & dispatch', href: '/factory/packing-and-dispatch/' }] },
  { label: 'Resources', href: '/resources/', children: resourceSections },
  { label: 'About', href: '/about/', children: [] },
];

