import { OFFICIAL_SITE } from './site';

export type Guide = {
  slug: string;
  title: string;
  category: 'Understand capacitors' | 'Compare & select' | 'Prepare your RFQ';
  summary: string;
  answer: string;
  sections: { heading: string; paragraphs: string[]; points?: string[]; links?: { label: string; href: string }[] }[];
  inquiry: { heading: string; note: string; label: string; request: 'quote' | 'documents' };
  related: { label: string; href: string }[];
  sources: { label: string; href: string }[];
};

const motorReference = { label: 'Oriental Motor · AC motor capacitor guidance', href: 'https://www.orientalmotor.com/products/pdfs/F_TecRef/TecAc.pdf' };
const tdkReference = { label: 'TDK Electronics · Motor run and start capacitor catalog', href: 'https://www.tdk-electronics.tdk.com/en/3192232' };
const tdkClimaticReference = { label: 'TDK Electronics · B32350/B32352 datasheet, climatic-category example', href: 'https://www.tdk-electronics.tdk.com/inf/20/25/ds/B32350_B32352.pdf' };
const kemetDutyReference = { label: 'KEMET · MS/MD motor-start datasheet, duty-cycle examples', href: 'https://content.kemet.com/datasheets/kem_a4041_ms_md.pdf' };

export const guides: Guide[] = [
  {
    slug: 'start-vs-run-capacitors', title: 'Start capacitor vs run capacitor', category: 'Understand capacitors',
    summary: 'How start and run capacitors work, with the motor-circuit details needed for a replacement.',
    answer: 'A run capacitor stays connected while the motor runs. A start capacitor operates during startup, as specified by the motor design. Matching case dimensions or µF values does not make them interchangeable.',
    sections: [
      { heading: 'Read the motor circuit first', paragraphs: ['The original label and wiring diagram help identify the capacitor\'s role. Some single-phase motors use both start and run capacitors; others use one. Check the circuit for the exact motor model, since the equipment name alone does not identify the arrangement.', 'The CBB60, CBB61 and CBB65 series are film run capacitors. CD60 is an aluminium electrolytic start-capacitor series. The chosen model must match the motor specification.'] },
      { heading: 'Information needed for a replacement', paragraphs: ['Record the original µF, VAC and frequency, then measure the case and the space for mounting and connections. A start-capacitor inquiry also needs the switching arrangement and duty rating.', 'Request the model datasheet for starting time and interval limits, including any duty information missing from the label.'], links: [{ label: 'Measure dimensions and connections', href: '/resources/dimensions-terminals-mounting/' }] },
    ],
    inquiry: { heading: 'Confirm the required duty', note: 'Send the motor diagram and a photo of the original label. Note any unreadable or missing duty information when requesting the datasheet.', label: 'Request duty information', request: 'documents' },
    related: [{ label: 'Read the original label', href: '/resources/read-motor-capacitor-label/' }, { label: 'Capacitance and voltage guide', href: '/resources/capacitance-voltage-guide/' }],
    sources: [motorReference, { label: 'Hanxing · CD60 series', href: `${OFFICIAL_SITE}/products/cd60-start-capacitor/` }, tdkReference, kemetDutyReference],
  },
  {
    slug: 'cbb60-vs-cbb61-vs-cbb65', title: 'CBB60 vs CBB61 vs CBB65', category: 'Compare & select',
    summary: 'Case formats, connections and motor requirements for CBB60, CBB61 and CBB65 run capacitors.',
    answer: 'CBB60, CBB61 and CBB65 are film run-capacitor series. CBB60 is cylindrical; CBB61 is compact and rectangular. CBB65 uses a metal can and has single-run and dual-run configurations.',
    sections: [
      { heading: 'Three different case formats', paragraphs: ['Specify the required rating, case size and connections when requesting the model number and drawing.'], points: ['CBB60: a cylindrical case for pumps and single-phase motors that require this format.', 'CBB61: a compact rectangular case for fans and similar motors. Check case dimensions and wire routing.', 'CBB65: a metal can for HVAC, with single-run and dual-run configurations.'] },
      { heading: 'Compare the installed part', paragraphs: ['Confirm run duty in the motor documentation and record the original µF and VAC. Use the proposed drawing to check the case, mounting points and connections against the installed part.', 'A CBB65 dual-run inquiry needs both µF values and the terminal-group layout. CBB61 parts can have different wire arrangements even when their case dimensions match.'], links: [{ label: 'Measure the case and connections', href: '/resources/dimensions-terminals-mounting/' }] },
    ],
    inquiry: { heading: 'Find a model within the series', note: 'Send the original label and motor drawing. Include measurements and clear photos of the connections.', label: 'Ask about a matching model', request: 'quote' },
    related: [{ label: 'Compare product series', href: '/products/' }, { label: 'Read the original label', href: '/resources/read-motor-capacitor-label/' }],
    sources: [{ label: 'Hanxing · CBB60', href: `${OFFICIAL_SITE}/products/cbb60-motor-run-capacitor/` }, { label: 'Hanxing · CBB61', href: `${OFFICIAL_SITE}/products/cbb61-fan-capacitor/` }, { label: 'Hanxing · CBB65', href: `${OFFICIAL_SITE}/products/cbb65-air-conditioner-capacitor/` }],
  },
  {
    slug: 'single-vs-dual-run-capacitors', title: 'Single-run vs dual-run capacitors', category: 'Compare & select',
    summary: 'Single and dual-run ratings, terminal groups and wiring checks.',
    answer: 'A single-run capacitor has one capacitance section. A dual-run capacitor has two independent sections in one can, each with its own µF value. Use the configuration specified by the motor circuit.',
    sections: [
      { heading: 'Keep the two values separate', paragraphs: ['A plus sign usually separates the two capacitance values on a dual-run label. Record the pair exactly as printed; do not add the values together. Check the required pair and rated VAC in the equipment documentation.', 'CBB65 single-run and R2 dual-capacitance ranges are listed separately. Specify the required pair in a model quotation.'] },
      { heading: 'Match the connections', paragraphs: ['Take a top-down photo of the terminal end so the group labels and blade count are visible. Send the original wiring diagram and compare the proposed terminal layout with it. Check the can dimensions and mounting against the original part as well.', 'Installation should be carried out by qualified personnel following the equipment manufacturer\'s wiring diagram and instructions.'], links: [{ label: 'Measure the can and mounting', href: '/resources/dimensions-terminals-mounting/' }] },
    ],
    inquiry: { heading: 'Specify the run-capacitor arrangement', note: 'For a dual-run part, send both capacitance values and identify the terminal connections.', label: 'Request a run-capacitor quotation', request: 'quote' },
    related: [{ label: 'Read the original label', href: '/resources/read-motor-capacitor-label/' }, { label: 'Start versus run duty', href: '/resources/start-vs-run-capacitors/' }],
    sources: [{ label: 'Hanxing · CBB65 product page', href: `${OFFICIAL_SITE}/products/cbb65-air-conditioner-capacitor/` }, tdkReference],
  },
  {
    slug: 'read-motor-capacitor-label', title: 'Reading a motor capacitor label', category: 'Understand capacitors',
    summary: 'Read µF, VAC, tolerance and frequency from the original label, and record case dimensions for a quotation.',
    answer: 'Photograph the full label and record its µF, rated VAC, tolerance and frequency. Include model, duty, temperature and batch markings. Measure the case and connection space separately.',
    sections: [
      { heading: 'Electrical markings', paragraphs: ['Capacitance is given in microfarads (µF), and rated AC voltage in VAC. Tolerance states the permitted variation around the specified capacitance; it does not change the target value set by the motor manufacturer. Copy the frequency and any temperature or duty markings as well.', 'Photograph the entire label, including the model and batch codes. For a dual-run part, keep both capacitance values visible. Record the equipment model alongside the photo.'] },
      { heading: 'Dimensions and connections', paragraphs: ['Measure body height and full installed height separately. Add the mounting dimensions, connector shape and wire length, with a photo of the terminal end. An original sample or dimensioned drawing helps confirm the fit.', 'If the label has a compliance mark, request the corresponding certificate. Check that it covers the proposed model and the requirements of your destination market; a marking on one sample does not establish coverage for other models or markets.'], links: [{ label: 'Measure dimensions, terminals and mounting', href: '/resources/dimensions-terminals-mounting/' }, { label: 'Check model documents and certificate scope', href: '/factory/#model-records' }] },
    ],
    inquiry: { heading: 'Ask about the original part', note: 'Attach a full label photo, including any markings you cannot read clearly.', label: 'Ask about the original part', request: 'quote' },
    related: [{ label: 'Capacitance and voltage guide', href: '/resources/capacitance-voltage-guide/' }, { label: 'Start versus run duty', href: '/resources/start-vs-run-capacitors/' }],
    sources: [{ label: 'Hanxing · CBB65 technical specifications', href: `${OFFICIAL_SITE}/products/cbb65-air-conditioner-capacitor/` }, motorReference, tdkClimaticReference],
  },
  {
    slug: 'capacitance-voltage-guide', title: 'Capacitance and voltage ratings for motor capacitors', category: 'Understand capacitors',
    summary: 'Read capacitance, rated AC voltage and tolerance against the original motor specification.',
    answer: 'µF is capacitance; VAC is rated AC voltage. Match both to the motor specification. The capacitor voltage rating is separate from the motor supply voltage.',
    sections: [
      { heading: 'Match the specified capacitance', paragraphs: ['In a capacitor-run single-phase motor, capacitance contributes to the phase relationship chosen by the motor manufacturer. Use the specified µF value. Increasing it changes the capacitance used in the circuit; it is not an upgrade. Oriental Motor advises using the capacitance and rated voltage specified for its motors.', 'A start capacitor also needs the correct duty rating. Equal µF values do not make start and run parts interchangeable.'], links: [{ label: 'Check start and run duty', href: '/resources/start-vs-run-capacitors/' }] },
      { heading: 'Check the capacitor voltage rating', paragraphs: ['Check the VAC marking on the original capacitor against the equipment specification. The required capacitor rating depends on circuit conditions as well as the supply voltage shown on the motor plate.', 'Use the series range to narrow the search, then request the datasheet for the exact model. Check that its capacitance and voltage meet the requirement and that the case fits.'] },
    ],
    inquiry: { heading: 'Check the model’s ratings', note: 'Include the motor specification and original capacitor ratings with your datasheet request.', label: 'Request a model datasheet', request: 'documents' },
    related: [{ label: 'Product series', href: '/products/' }, { label: 'Model records', href: '/factory/#model-records' }],
    sources: [motorReference, { label: 'Oriental Motor · replacement guidance', href: 'https://faq.orientalmotor.com/can-i-use-capacitors-other-than-the-one-that-comes-with-the-ac-motor' }, tdkReference],
  },
  {
    slug: 'dimensions-terminals-mounting', title: 'Capacitor dimensions, connections and mounting', category: 'Prepare your RFQ',
    summary: 'Case measurements, mounting dimensions and clearance for terminals, wires and connectors.',
    answer: 'A replacement needs the correct µF and VAC and enough room for installation. Measure the body separately from the space occupied by the complete part, including its mounting stud, terminals, leads and connector.',
    sections: [
      { heading: 'Measure the space available', paragraphs: ['For a cylindrical case, record the diameter and body height, then the full height with terminals. For a rectangular case, record length, width and height. Show the mounting position on a dimensioned sketch and allow space for fixing hardware, wires and connectors.', 'The CBB60, CBB61, CBB65 and CD60 pages list dimensional ranges for each series. Check the fit using the approved drawing for the exact model.'] },
      { heading: 'Show the connection end', paragraphs: ['Photograph the terminal end and the side. For blade terminals, record the terminal groups and check blade width, orientation and spacing against the drawing. For wires, record the count and specified colors, then the length and connector.', 'A front view may hide the connections. Include details of the mating connector, and send a sample or drawing if the connector or bracket is unusual.'] },
    ],
    inquiry: { heading: 'Check the proposed drawing', note: 'Send a dimensioned sketch and photos of the connections so the proposed drawing can be checked for fit.', label: 'Request a model drawing', request: 'documents' },
    related: [{ label: 'OEM & private label', href: '/oem/' }, { label: 'Model documents', href: '/factory/#model-records' }],
    sources: [{ label: 'Hanxing · CBB60 dimensions and terminals', href: `${OFFICIAL_SITE}/products/cbb60-motor-run-capacitor/` }, { label: 'Hanxing · CBB61 dimensions and terminals', href: `${OFFICIAL_SITE}/products/cbb61-fan-capacitor/` }, { label: 'Hanxing · CBB65 dimensions and terminals', href: `${OFFICIAL_SITE}/products/cbb65-air-conditioner-capacitor/` }],
  },
  {
    slug: 'motor-capacitor-order-shipment-checklist', title: 'Motor capacitor order & shipping checklist', category: 'Prepare your RFQ',
    summary: 'Specify the order, approve packing and check dispatch records and shipping documents.',
    answer: 'Use one order reference for the product specification, approved drawings, packing, inspection records and shipping documents. Agree the terms before production and check the final records before carrier pickup.',
    sections: [
      { heading: '1. Set the product and order details', paragraphs: [], points: ['Use the same series, model, ratings, drawing revision, connections and quantities in the quotation and purchase order. Approve alternatives in writing. Keep sample, artwork and packing approvals for private-label orders.', 'Record price, currency, payment dates, quotation validity and sample or tooling charges. Set the date from which lead time runs.', 'Record the delivery term and named place, transport method and freight payer in writing.'] },
      { heading: '2. Approve the packing', paragraphs: [], points: ['Specify unit protection and terminal clearance, units per inner pack and carton, shipping marks and language, plus pallet and handling requirements.', 'Keep approved artwork and packing revisions for checking later changes. Record carton count and dimensions, gross and net weights for the buyer and forwarder.'] },
      { heading: '3. Record dispatch dates and checks', paragraphs: [], points: ['Record each milestone as confirmed or estimated. Name the contact for updates, delays and partial-shipment approval.', 'Agree the inspection scope and acceptance criteria before production. Specify the report format, with any sample tests, lot or sample identification and packing photos required for the order.', 'Keep electrical test results and carton contents in separate records alongside packing photos.'] },
      { heading: '4. Check documents against the shipping route', paragraphs: [], points: ['Review the draft invoice and packing list against the approved purchase order before dispatch.', 'Check the consignee and shipment reference on the bill of lading, air waybill or courier waybill for the agreed route.', 'Agree the issuer and scope of origin, inspection, export or compliance documents required for the destination and contract.'] },
      { heading: '5. Agree a route for discrepancies', paragraphs: [], points: ['Set the contact and reporting procedure for specification, packing or quantity errors, shortages, transit damage and nonconforming goods. Agree how changes are approved.', 'Record any warranty period, claim deadline and responsible party in the order terms.', 'File the approved drawing, sample record, quotation, purchase order, inspection records and final shipping documents together.'] },
    ],
    inquiry: { heading: 'Discuss the order requirements', note: 'Use one order reference and list the terms that still need agreement in writing.', label: 'Ask about order terms', request: 'quote' },
    related: [{ label: 'Company information', href: '/about/#supplier-records' }, { label: 'Order and shipping questions', href: '/faq/#faq-orders' }],
    sources: [
      { label: 'International Trade Administration · Common Export Documents', href: 'https://www.trade.gov/common-export-documents' },
      { label: 'ICC · Incoterms 2020 named place and delivery', href: 'https://library.iccwbo.org/clp/clp-incoterms-qa-2020.htm?AGENT=ICC_HQ' },
    ],
  },
];

export const guideHref = (guide: Guide) => `/resources/${guide.slug}/`;
