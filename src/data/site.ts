import { oemNavigation } from './oemNavigation';
import { companyProfile, companyRelationship } from './company';

export const SITE_NAME = 'Hanxing Capacitor';
export const PUBLIC_BRAND_NAME = companyProfile.brand.name;
export const PUBLIC_COMPANY_NAME = companyProfile.name;
export const PUBLIC_HEADQUARTERS_ADDRESS = companyProfile.headquarters.address;
export const PUBLIC_FACTORY_ADDRESS = companyProfile.manufacturing.address;
export const PUBLIC_COMPANY_RELATIONSHIP = companyRelationship;
export const PUBLIC_OFFICE_MOBILE = companyProfile.contact.officeMobile;
export const PUBLIC_OFFICE_PHONE = companyProfile.contact.officePhone;
export const PUBLIC_EMAIL = companyProfile.contact.email;
export const STANDARD_MOQ_PCS = 5000;
export const STANDARD_MOQ_DESCRIPTION = `${STANDARD_MOQ_PCS.toLocaleString('en-US')} pieces in total across mixed models. Confirm the quantity for each model in the quotation.`;
export const procurementPolicy = {
  "leadTime": "Lead time is quoted for your model, quantity, label and packing. Sample preparation and transport have separate dates; the quotation identifies which approval or payment event starts the production period.",
  "samples": "Free test samples are available for eligible models. Confirm the sample quantity, any customisation charges, freight and preparation date before dispatch.",
  "warranty": "All models carry a warranty of at least three years. The written quotation or contract specifies the start date, coverage, exclusions and claim procedure.",
  "payment": "We accept T/T bank transfers and L/C letters of credit. Agree the currency, payment schedule and any letter-of-credit conditions in the written quotation or contract.",
  "packing": "Packing depends on the model and the agreed factory packing specification. Customer packing requirements can be reviewed; approve unit protection, carton quantities, labels and any pallet requirements before production.",
  "dispatch": "Shipments can be arranged through Ningbo, Shanghai or Tianjin ports, or with logistics handover in Yiwu. Other routes can be reviewed. Confirm the route, named delivery place and Incoterms rule in the quotation."
} as const;
export const PUBLIC_PHONE = companyProfile.contact.whatsapp;
export const WHATSAPP_NUMBER = PUBLIC_PHONE.replace(/\D/g, '');
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const OFFICIAL_SITE = 'https://www.hanxingcapacitor.com';

export type Product = {
  code: string;
  slug: string;
  title: string;
  shortName: string;
  seriesDescription: string;
  function: 'Run' | 'Start';
  tagline: string;
  seoDescription: string;
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
    seriesDescription: 'Motor run capacitor',
    tagline: 'Cylindrical run capacitors for water pumps and single-phase motors.',
    seoDescription: "CBB60 motor run capacitors for pumps and single-phase motors. Compare ratings, wire leads, quick-connect terminals and case dimensions; request a quotation.",
    intro: 'CBB60 is a cylindrical motor run capacitor with metallized polypropylene film inside a plastic case. It is used in water pumps, washing machines, smoke exhaust equipment and other single-phase motors that require a run capacitor.',
    image: '/images/real/cbb60-hanxing-wired.jpg', imageAlt: 'A Hanxing-marked white CBB60 capacitor sample with two insulated leads.',
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
    seriesDescription: 'Fan capacitor',
    tagline: 'Compact rectangular run capacitors for fans, blowers and appliance motors.',
    seoDescription: "CBB61 fan capacitors with wire leads or blade terminals. Compare capacitance, voltage, case size and mounting for the fan motor; request model documents.",
    intro: 'CBB61 is a rectangular film run capacitor for fans, blowers and small single-phase motors. It is also used in some air-conditioner and washing-machine motors. Connections include wire leads and blade terminals; compare their layout with the motor drawing.',
    image: '/images/real/cbb61-13.jpg', imageAlt: 'Three rectangular CBB61 samples with blade terminals.',
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
    seriesDescription: 'Air conditioner / compressor capacitor',
    tagline: 'Single and dual-run metal-can capacitors for HVAC and refrigeration motors.',
    seoDescription: "CBB65 single and dual-run capacitors for air conditioners and compressors. Compare µF, VAC, terminal groups and can dimensions; request a model quotation.",
    intro: 'CBB65 is a metal-can run capacitor for air conditioners, compressors and refrigerated air dryers in compressed-air systems. Single-run and dual-run versions have different ratings and terminal layouts, so identify the configuration before comparing models.',
    image: '/images/real/cbb65-2.jpg', imageAlt: 'A CBB65 metal-can capacitor sample marked 20 µF and 450 VAC.',
    catalogImage: '/images/generated/site/cbb65-main.webp', catalogImageAlt: 'Metal-can motor-run capacitor with two terminal groups.', capacitance: 'Single: 2–100 µF; dual: 1+15 to 15+80 µF',
    voltage: 'Single: 110–450 VAC; dual: 370–450 VAC', tolerance: '±5% (J), ±10% (K)',
    frequency: '50/60 Hz', temperature: '−40 to +85 °C',
    dimensions: 'Single: D 30–60 × H 55–125 mm (2–100 µF table rows); dual: model drawing required for the selected combination',
    construction: 'Metallized polypropylene film in a metal can.',
    terminals: 'Terminal groups differ between models. Use the wiring diagram to identify each connection.',
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
    seriesDescription: 'Motor start capacitor',
    tagline: 'Electrolytic start capacitors for switched single-phase AC motor circuits.',
    seoDescription: "CD60 electrolytic motor start capacitors for switched starting circuits. Compare ratings, on-time, restart duty, terminals and case size for the selected model.",
    intro: 'CD60 is an aluminium electrolytic capacitor used during motor startup. The starting circuit must disconnect it once the motor is running. Choose it by its electrical ratings and starting-duty limits, including the permitted starting time and interval between starts.',
    image: '/images/real/cd60-25.jpg', imageAlt: 'A CD60 cylindrical motor-start capacitor sample.',
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
    slug: 'pumps-and-water-systems', title: 'Water pump capacitors | CBB60 & CD60', shortName: 'Water pumps',
    listing: 'CBB60 cylindrical run capacitors for water-pump motors.',
    intro: 'CBB60 run capacitors and CD60 start capacitors for water-pump motor circuits, with ratings, connection and mounting requirements.',
    image: '/images/generated/site/home-application-water-pumps-20261013.webp', imageHeight: 800, imageAlt: 'Centrifugal water pump and electric motor.',
    series: ['CBB60', 'CD60'],
    checks: ['Pump and motor model', 'Original capacitor label', 'Run versus start function', 'Body size and mounting', 'Lead/terminal format and quantity'],
  },
  {
    slug: 'fans-and-ventilation', title: 'Fan and blower capacitors | CBB61', shortName: 'Fans and blowers',
    listing: 'CBB61 rectangular run capacitors for fans and blowers.',
    intro: 'CBB61 rectangular and CBB60 cylindrical run capacitors for fan and blower motors, with the connections and installation space each format needs.',
    image: '/images/generated/site/home-application-fans-blowers-20261013.webp', imageHeight: 800, imageAlt: 'Ventilation fan and electric motor.',
    series: ['CBB61', 'CBB60'],
    checks: ['Fan or motor model', 'Capacitance and voltage', 'Lead length and connector', 'Mounting or fixing detail', 'Original sample or drawing'],
  },
  {
    slug: 'appliances-and-small-motors', title: 'Washing machine capacitors | CBB60 & CBB61', shortName: 'Washing machines',
    listing: 'CBB60 cylindrical and CBB61 rectangular run capacitors for washing-machine motors.',
    intro: 'CBB60 cylindrical and CBB61 rectangular run capacitors for washing-machine motors. Select the replacement using the motor’s specified rating and connection layout.',
    image: '/images/generated/site/home-application-washing-machines-20261013.webp', imageHeight: 1000, imageAlt: 'White front-loading washing machine.',
    series: ['CBB60', 'CBB61'],
    checks: ['Equipment and motor model', 'Original capacitor photo or label', 'Electrical values', 'Wiring and fixing details', 'Annual or forecast quantity'],
  },
  {
    slug: 'hvac-and-refrigeration', title: 'HVAC capacitors | CBB65 & CD60', shortName: 'Air conditioners / HVAC',
    listing: 'CBB65 single and dual-run capacitors for air conditioners, compressors and refrigerated air dryers.',
    intro: 'CBB65 single and dual-run capacitors for HVAC and refrigeration motors. CD60 is for separately switched starting circuits.',
    image: '/images/generated/site/home-application-hvac-20261013.webp', imageHeight: 800, imageAlt: 'Outdoor air-conditioning condenser.',
    series: ['CBB65', 'CD60'],
    checks: ['Original capacitor label and equipment model', 'Single or dual-run function', 'Each capacitance value and rated voltage', 'Terminal group and mounting space', 'Quantity, market and document requirements'],
  },
];

export const APPLICATION_SELECTION_INTRO = 'Choose your equipment to compare capacitor types, ratings and mounting requirements.';
export const applicationHref = (application: Application) => `/applications/${application.slug}/`;

export const resourceSections = [
  { label: 'Technical guides', href: '/resources/articles/', description: 'Label markings, electrical ratings, series comparisons and installation dimensions.' },
  { label: 'Buying & shipping', href: '/buying-guide/', description: 'Quotation details, sample approval, order terms and shipping records.' },
  { label: 'Buyer FAQ', href: '/faq/', description: 'Answers about minimum orders, sample costs, lead times and custom labels.' },
];

export const primaryNav = [
  { label: 'Home', href: '/', children: [] },
  { label: 'Products', href: '/products/', children: [...products.map((p) => ({ label: `${p.code} · ${p.seriesDescription}`, href: productHref(p) })), { label: 'Sample photographs', href: '/products/photographs/' }] },
  { label: 'Applications', href: '/applications/', children: applications.map((a) => ({ label: a.shortName, href: applicationHref(a) })) },
  { label: 'OEM & quality', href: '/oem-quality/', children: oemNavigation },
  { label: 'Resources', href: '/resources/', children: resourceSections },
  { label: 'About US', href: '/about/', children: [] },
];

