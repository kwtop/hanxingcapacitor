import { guides } from './guides';
import { guideExamples, type PhotoExample } from './guideExamples';

export type GuideLink = { label: string; href: string };
export type GuideCell = string | { text: string; href: string };
export type GuideTable = { caption: string; headers: string[]; rows: GuideCell[][] };
export type GuideSection = {
  id: string;
  aliases?: string[];
  heading: string;
  tocLabel?: string;
  paragraphs?: string[];
  points?: string[];
  orderedPoints?: boolean;
  records?: { label: string; text: string }[];
  tables?: GuideTable[];
  photos?: PhotoExample[];
  photoPlacement?: 'before' | 'after';
  layout?: 'label' | 'compact-photo';
  note?: string;
  links?: GuideLink[];
  copyText?: string;
};
export type GuideLayout = { sections: GuideSection[]; details: string[]; inquiryLinks?: GuideLink[] };

const examplePhotos = (slug: string) => guideExamples[slug].photos;
const productLink = (text: string, slug: string): GuideCell => ({ text, href: `/products/${slug}/` });
const measurementTable = (caption: string, fields: string[]): GuideTable => ({
  caption, headers: ['Field', 'Your measurement', 'Unit'], rows: fields.map(field => [field, '________', 'mm']),
});
const orderGuide = guides.find(guide => guide.slug === 'motor-capacitor-order-shipment-checklist')!;
const orderNotes = [
  'Order reference:',
  'Series / exact model / electrical ratings:',
  'Drawing revision / connection layout:',
  'Quantity by model / approved alternatives:',
  'Sample approval / label artwork revision:',
  'Price / currency / payment / quotation validity / sample or tooling charges:',
  'Approved packing revision / protection / units / marks / language / pallet:',
  'Carton count / dimensions / net and gross weights:',
  'Inspection scope / acceptance criteria / record format / lot or sample reference:',
  'Production complete: ______  confirmed or estimated: ______  contact: ______',
  'Inspection release: ______  confirmed or estimated: ______  contact: ______',
  'Carrier pickup: ______  confirmed or estimated: ______  contact: ______',
  'Departure: ______  confirmed or estimated: ______  contact: ______',
  'Estimated arrival: ______  update contact: ______',
  'Delay / partial-shipment approval contact:',
  'Delivery term and named place / shipping method / who pays freight:',
  'Required documents / issuer / scope / matching order details:',
  'Contact for discrepancies / reporting procedure / warranty and claim terms:',
  'Order file reference / items still to agree:',
].join('\n');

export const guideLayouts: Record<string, GuideLayout> = {
  'start-vs-run-capacitors': {
    sections: [
      {
        id: 'read-the-motor-circuit-first', heading: 'Run duty and start duty',
        paragraphs: ['The motor wiring diagram identifies whether it uses a run capacitor, a start capacitor or both.'],
        tables: [{ caption: 'Start and run capacitor comparison', headers: ['Check', 'Run capacitor', 'Start capacitor'], rows: [
          ['Circuit role', 'Stays connected while the motor runs.', 'Operates during startup as specified by the motor design.'],
          ['Series examples', 'CBB60 / CBB61 / CBB65', productLink('CD60', 'cd60-start-capacitor')],
          ['Material', 'Film', 'Aluminium electrolytic'],
          ['Duty information to check', 'Run duty and ratings specified for the motor.', 'Switching arrangement, permitted starting time and repeat-start limits in the model documentation.'],
        ] }],
        note: '',
        links: [{ label: 'View motor-run series', href: '/products/' }, { label: 'View CD60 start capacitors', href: '/products/cd60-start-capacitor/' }],
      },
      {
        id: 'sample-examples', heading: 'Run and start capacitor samples', photos: examplePhotos('start-vs-run-capacitors'),
        note: '',
      },
      {
        id: 'information-needed-for-a-replacement', heading: 'Details for a replacement inquiry',
        records: [
          { label: 'Motor and circuit', text: 'Equipment model, motor model and original wiring diagram.' },
          { label: 'Electrical markings', text: 'Copy the original µF, VAC and frequency, along with the tolerance and any duty marking.' },
          { label: 'Installation space', text: 'Measure the body and mounting. Allow space for leads, terminals and connectors.' },
          { label: 'Starting duty', text: 'Provide the switching arrangement, rated starting time and interval between starts from the model datasheet.' },
        ],
        links: [{ label: 'Measure dimensions and connections', href: '/resources/dimensions-terminals-mounting/' }],
      },
    ],
    details: ['Motor model and original wiring diagram', 'Original µF, VAC and frequency', 'Run or start duty', 'Case dimensions, mounting and connections'],
  },
  'cbb60-vs-cbb61-vs-cbb65': {
    sections: [
      {
        id: 'three-different-case-formats', heading: 'Three case formats',
        tables: [{ caption: 'Cases, connections and applications', headers: ['Series', 'Case', 'Connections to check', 'Applications'], rows: [
          [productLink('CBB60', 'cbb60-motor-run-capacitor'), 'Cylindrical', 'Wire leads or blade terminals, with a mounting stud where specified.', 'Pumps and single-phase motors that require this format.'],
          [productLink('CBB61', 'cbb61-fan-capacitor'), 'Compact rectangular', 'Wire or blade layout, with space for routing and the connector.', 'Fan and appliance motors that require this run-capacitor format.'],
          [productLink('CBB65', 'cbb65-air-conditioner-capacitor'), 'Metal can', 'Single-run or dual-run configuration and terminal-group layout.', 'HVAC and refrigeration motors that require run capacitors.'],
        ] }],
        note: 'Include the required rating, dimensions and connection layout when requesting a model quotation.',
      },
      { id: 'sample-examples', heading: 'Compare the sample cases', photos: examplePhotos('cbb60-vs-cbb61-vs-cbb65'), note: '' },
      {
        id: 'compare-the-installed-part', heading: 'Compare the installed part',
        records: [
          { label: 'Run duty', text: 'Confirm the circuit and duty in the motor documentation.' },
          { label: 'µF and VAC', text: 'Record the original ratings. For CBB65 dual-run parts, keep both µF values as printed.' },
          { label: 'Body and mounting', text: 'Measure the body and mounting, then check the space needed for the complete part.' },
          { label: 'Leads or terminals', text: 'Photograph the connections. CBB61 parts can have different wire arrangements even when their case sizes match.' },
          { label: 'Model drawing', text: 'Check the proposed model documentation against the original part and motor drawing.' },
        ],
        links: [{ label: 'Measure the case and connections', href: '/resources/dimensions-terminals-mounting/' }],
      },
    ],
    details: ['Original label and motor drawing', 'Case dimensions, mounting and connection layout', 'Order quantity and destination'],
  },
  'single-vs-dual-run-capacitors': {
    sections: [
      {
        id: 'keep-the-two-values-separate', heading: 'One section or two',
        tables: [{ caption: 'Single-run and dual-run comparison', headers: ['Check', 'Single-run', 'Dual-run'], rows: [
          ['Capacitance sections', 'One section', 'Two sections in one can'],
          ['Rating to record', 'One µF value', 'Both µF values, with the plus sign as printed. Do not add them together.'],
          ['Connections', 'Check the specified terminal layout.', 'Match each terminal group to the original wiring diagram and model drawing.'],
        ] }],
        note: 'Specify the single-run value or dual-run pair required by the equipment.',
      },
      { id: 'sample-examples', heading: 'Single-run and dual-run sample labels', photos: examplePhotos('single-vs-dual-run-capacitors') },
      {
        id: 'record-the-values-separately', heading: 'Record the values separately',
        tables: [{ caption: 'Dual-run rating record', headers: ['Field', 'Your record'], rows: [
          ['Value 1', '________ µF'], ['Value 2', '________ µF'], ['Rated voltage', '________ VAC'], ['Original model', '________'],
        ] }],
        note: '',
      },
      {
        id: 'match-the-connections', heading: 'Match the connections',
        records: [
          { label: 'Top view', text: 'Take a top-down photo showing the entire terminal end.' },
          { label: 'Group labels and blades', text: 'Keep every group label and blade visible. Identify the connections from the wiring diagram.' },
          { label: 'Wiring diagram', text: 'Send the original diagram and check the proposed terminal layout against it.' },
          { label: 'Can and mounting', text: 'Record the can dimensions and mounting. Allow clearance for the connector.' },
        ],
        note: 'Installation should be carried out by qualified personnel following the equipment manufacturer\'s wiring diagram and instructions.',
        links: [{ label: 'Measure the can and mounting', href: '/resources/dimensions-terminals-mounting/' }],
      },
    ],
    details: ['Both µF values and rated VAC', 'Original capacitor model and equipment model', 'Top-down terminal photo showing the group labels, plus the original wiring diagram', 'Can dimensions and mounting, with order quantity and destination'],
    inquiryLinks: [{ label: 'CBB65 single and dual-run specifications', href: '/products/cbb65-air-conditioner-capacitor/' }, { label: 'HVAC application requirements', href: '/applications/hvac-and-refrigeration/' }],
  },
  'read-motor-capacitor-label': {
    sections: [
      {
        id: 'electrical-markings', aliases: ['sample-examples'], heading: 'Reading the label', layout: 'label', photoPlacement: 'before', photos: [examplePhotos('read-motor-capacitor-label')[0]],
        paragraphs: ['Copy the label exactly. Leave unreadable fields blank and attach a clear photo; do not infer them from a series range.'],
        tables: [{ caption: 'Visible text on the CBB65 sample', headers: ['Field', 'Visible sample text', 'What to record'], rows: [
          ['Series / model', 'CBB65 CAPACITOR', 'CBB65 is the series marking. Record a separate model number when present.'],
          ['Capacitance', '20 µF', 'The original µF value, or both values on a dual-run part.'],
          ['Rated AC voltage', '450VAC', 'The capacitor VAC rating, recorded separately from the motor supply voltage.'],
          ['Tolerance', '±5%', 'The permitted capacitance variation. Copy the exact marking.'],
          ['Frequency', '50/60Hz', 'Frequency marking as printed.'],
          ['Temperature / climatic marking', '40/85/21', 'Copy the full code and check its meaning in the model datasheet.'],
          ['Duty', 'Not marked', 'Record the duty from the motor circuit and model documentation.'],
          ['Other code / batch marking', 'C P1; 2025', 'Record each code as it appears.'],
        ] }],
        note: 'The climatic category includes temperature-category and damp-heat-test information. Use the model datasheet to interpret the full code. Check approval marks against the relevant certificate.',
        links: [{ label: 'Review CBB65 sample configurations', href: '/products/cbb65-air-conditioner-capacitor/#sample-configurations' }],
      },
      {
        id: 'worked-label-examples', heading: 'Worked examples from the original labels',
        paragraphs: ['P029 is marked 20 µF ±5%. Five percent of 20 is 1 µF, giving a calculated tolerance range of 19–21 µF.'],
        tables: [{ caption: 'Keep the dual-run values separate · sample P034', headers: ['Printed section value', 'Printed tolerance', 'Calculated nominal band'], rows: [
          ['50 µF', '±5%', '47.5–52.5 µF'],
          ['5 µF', '±5%', '4.75–5.25 µF'],
        ] }],
        photos: [examplePhotos('single-vs-dual-run-capacitors')[1]],
        note: 'P034 reads 50+5 µF, not one 55 µF section. Use the approved model data for terminal mapping, measurement conditions and acceptance limits.',
        links: [{ label: 'Ask about P029 · 20 µF / 450 VAC', href: '/contact/?series=CBB65&configuration=label-p029-20&request=documents#inquiry-form' }, { label: 'Ask about P034 · 50+5 µF / 450 VAC', href: '/contact/?series=CBB65&configuration=label-p034-50plus5&request=documents#inquiry-form' }],
      },
      {
        id: 'if-a-marking-is-missing', heading: 'Missing or unreadable markings',
        records: [
          { label: 'Unreadable text', text: 'Attach the full label photo and identify the unreadable field.' },
          { label: 'Dimensions', text: 'Measure the body and mounting separately. Include the space needed for connections.' },
          { label: 'Compliance mark', text: 'Request the corresponding certificate. Check the covered models and the requirements for your destination market.' },
        ],
        links: [{ label: 'Check model documents and certificate scope', href: '/factory/#model-records' }],
      },
      {
        id: 'dimensions-and-connections', heading: 'Photos to prepare',
        records: [
          { label: 'Full label', text: 'Keep all markings and model or batch codes visible in one clear photo. Include both values on a dual-run part.' },
          { label: 'Terminal end', text: 'Show the terminal-group labels and blades, or the wire exits and connector shape.' },
          { label: 'Side and mounting', text: 'Show the case and mounting parts with the space around the connections. Add measurements to your notes.' },
          { label: 'Motor plate', text: 'Include the equipment and motor identification, with the circuit diagram if available.' },
        ],
        links: [{ label: 'Measure dimensions, terminals and mounting', href: '/resources/dimensions-terminals-mounting/' }],
      },
    ],
    details: ['Clear photos of the full label and connections', 'Motor or equipment model', 'Label markings and a photo of any unreadable field', 'Body dimensions and mounting, with quantity and destination'],
  },
  'capacitance-voltage-guide': {
    sections: [
      {
        id: 'match-the-specified-capacitance', heading: 'µF, VAC and tolerance',
        tables: [{ caption: 'Capacitance, voltage and tolerance', headers: ['Field', 'Meaning', 'Check against'], rows: [
          ['µF', 'Capacitance. In a capacitor-run motor, it contributes to the phase relationship chosen by the motor manufacturer.', 'The motor specification and the µF marking on the original capacitor.'],
          ['VAC', 'The capacitor\'s rated AC voltage.', 'The original VAC marking and model datasheet, checked against the equipment circuit requirements.'],
          ['Tolerance', 'Permitted variation around the marked capacitance. It does not change the target µF.', 'The exact tolerance marking and the required model specification.'],
        ] }],
      },
      {
        id: 'common-reading-mistakes', aliases: ['check-the-capacitor-s-voltage-rating'], heading: 'Common reading mistakes',
        records: [
          { label: 'Increasing µF', text: 'Use the capacitance specified by the motor manufacturer. A higher value changes the capacitance used in the circuit; it is not an upgrade.' },
          { label: 'Reading VAC from the motor plate', text: 'The motor plate shows the supply voltage. The required capacitor VAC also depends on circuit conditions, so check the original capacitor rating and equipment specification.' },
          { label: 'Changing from start to run duty', text: 'Matching µF is not enough to substitute a start capacitor for a run capacitor. Check the motor circuit and, for a start part, the starting limits in its datasheet.' },
        ],
        links: [{ label: 'Check start and run duty', href: '/resources/start-vs-run-capacitors/' }],
      },
      {
        id: 'sample-examples', heading: 'Sample markings', layout: 'compact-photo', photos: [examplePhotos('capacitance-voltage-guide')[0]],
        records: [
          { label: '20 µF', text: 'The capacitance printed on this CBB65 sample.' },
          { label: '450 VAC', text: 'The rated AC voltage on the same label.' },
          { label: '±5%', text: 'The permitted variation around the marked capacitance.' },
        ],
        note: '',
        links: [{ label: 'Copy the complete label fields', href: '/resources/read-motor-capacitor-label/' }],
      },
    ],
    details: ['Motor specification and original capacitor ratings', 'Run or start duty specified for the circuit', 'Required configuration and original sample reference'],
  },
  'dimensions-terminals-mounting': {
    sections: [
      {
        id: 'measure-the-space-available', heading: 'Dimensions to record',
        paragraphs: ['Measure the body first, then record the space occupied by the complete part. On a dimensioned sketch, show the mounting position and allow clearance for terminals, fixing hardware, wires and connectors.'],
        tables: [
          measurementTable('Cylindrical case', ['Diameter D', 'Body height H', 'Full installed height', 'Mounting position / stud dimensions', 'Terminal and connector clearance', 'Lead length / routing clearance']),
          measurementTable('Rectangular case', ['Body length L', 'Body width W', 'Body height H', 'Full installed height', 'Mounting position / fixing dimensions', 'Wire and connector clearance']),
        ],
        note: '',
      },
      {
        id: 'sample-examples', heading: 'Mounting and connection space', photos: examplePhotos('dimensions-terminals-mounting'),
        note: '',
      },
      {
        id: 'show-the-connection-end', heading: 'Connections to record',
        tables: [{ caption: 'Connection details for the original part', headers: ['Field', 'Details to record'], rows: [
          ['Terminal groups', 'Top view with all group labels and blade counts visible.'],
          ['Blade dimensions', 'Width, orientation and spacing in mm, checked against the drawing.'],
          ['Wires', 'Count, specified colors, length in mm and routing.'],
          ['Connector', 'Shape, size and connector reference where available.'],
          ['Mating part', 'Details of the matching connector, bracket or fixing. Include a sample or drawing for unusual arrangements.'],
        ] }],
        note: 'Take terminal-end and side photos so all connections are visible. Send the wiring diagram too, since parts with the same wire count can have different connections.',
      },
    ],
    details: ['Dimensioned sketch showing the body and full installation space in mm', 'Top and side photos', 'Connection and mounting details, including the mating connector or bracket', 'Original sample or model reference'],
  },
  'motor-capacitor-order-shipment-checklist': {
    sections: [
      {
        id: '1-set-the-product-and-order-details', heading: '1. Confirm the product and order', tocLabel: '1. Product and order',
        points: orderGuide.sections[0].points,
        links: [{ label: 'Review label and sample approval', href: '/oem/' }],
      },
      {
        id: '2-approve-the-packout', aliases: ['sample-examples'], heading: '2. Approve the packing', tocLabel: '2. Packing',
        points: orderGuide.sections[1].points, layout: 'compact-photo', photos: [examplePhotos('motor-capacitor-order-shipment-checklist')[0]],
        links: [{ label: 'Review packing and dispatch', href: '/factory/packing-and-dispatch/' }],
      },
      {
        id: '3-record-dispatch-dates-and-checks', heading: '3. Confirm dispatch dates and inspection', tocLabel: '3. Dispatch and inspection',
        points: orderGuide.sections[2].points,
        tables: [{ caption: 'Production and shipping dates', headers: ['Milestone', 'Date / confirmed or estimated', 'Contact for updates'], rows: [
          ['Production complete', '________ / ________', '________'],
          ['Inspection release', '________ / ________', '________'],
          ['Carrier pickup', '________ / ________', '________'],
          ['Departure', '________ / ________', '________'],
          ['Estimated arrival', '________ / estimated', '________'],
        ] }],
        links: [{ label: 'Check model and inspection records', href: '/factory/#model-records' }],
      },
      {
        id: '4-check-documents-against-the-shipping-route', heading: '4. Check the shipping documents', tocLabel: '4. Shipping documents',
        points: orderGuide.sections[3].points,
        tables: [{ caption: 'Documents to check against the order', headers: ['Document', 'Details to confirm'], rows: [
          ['Invoice and packing list', 'Seller/buyer, description, model, quantity, package count, weights, value, currency and delivery term.'],
          ['Transport record', 'Route-specific bill of lading, air waybill or courier waybill; consignee and shipment reference.'],
          ['Origin / inspection / export / compliance', 'The documents required by the destination and contract, including issuer, scope and model or order reference.'],
        ] }],
      },
      {
        id: '5-agree-a-route-for-discrepancies', heading: '5. Agree how to handle discrepancies', tocLabel: '5. Discrepancies',
        points: orderGuide.sections[4].points, orderedPoints: true,
        links: [{ label: 'Ask about an existing order', href: '/contact/?guide=motor-capacitor-order-shipment-checklist&request=after-sales#inquiry-form' }],
      },
      {
        id: 'order-confirmation-notes', heading: 'Order confirmation notes',
        paragraphs: ['Copy the template and enter the terms agreed in writing. Keep unresolved items under the same order reference.'],
        copyText: orderNotes,
      },
    ],
    details: ['Order reference, exact model and drawing revision', 'Approved packing and inspection requirements, with production and shipping dates', 'Delivery term and named place, with the required documents', 'Outstanding order terms'],
  },
};
