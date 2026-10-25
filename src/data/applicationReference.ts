// Application-specific decision copy. Published ratings remain in site.ts.
type Check = [title: string, description: string];
type CircuitPath = { title: string; text: string; href: string; link: string };
type ApplicationReferenceContent = {
  lead: string;
  decision: string;
  comparisonTitle: string;
  comparisonIntro: string;
  functions: Record<string, string>;
  confirmations: Record<string, string>;
  showDimensions: boolean;
  paths: CircuitPath[];
  fitChecks: Check[];
  inquiryFields: string[];
  checks: Check[];
  detail: { image: string; alt: string; caption: string; focus: string };
  guide: { label: string; href: string };
  inquiryLabel: string;
};

export const applicationReference: Record<string, ApplicationReferenceContent> = {
  'pumps-and-water-systems': {
    lead: 'Identify the capacitor duty in the pump motor circuit.',
    decision: 'Use the motor wiring diagram to identify run duty, switched start duty or both. CBB60 and CD60 have different circuit roles.',
    comparisonTitle: 'Run and start capacitors for pump motors',
    comparisonIntro: 'Match the original µF and VAC, then compare case dimensions and connections.',
    functions: {
      CBB60: 'Run duty for the pump motor circuit.',
      CD60: 'Start duty in a circuit that switches the capacitor out after starting.',
    },
    confirmations: {
      CBB60: 'Run duty; verify the cylindrical body, fixing and lead clearance.',
      CD60: 'Switched start duty; request the model-specific duty and time limits.',
    },
    showDimensions: false,
    paths: [
      { title: 'Run', text: 'Match a CBB60 to the original run-capacitor rating and connections.', href: '/products/cbb60-motor-run-capacitor/', link: 'CBB60 run capacitors' },
      { title: 'Start', text: 'Use CD60 in a switched starting circuit, within its rated starting time and interval between starts.', href: '/products/cd60-start-capacitor/', link: 'CD60 start capacitors' },
      { title: 'Both', text: 'List the two parts separately. Each needs its own µF, VAC, connections and position on the motor diagram.', href: '/resources/start-vs-run-capacitors/', link: 'Start and run explained' },
      { title: 'Identify the duty', text: 'Send the capacitor labels and motor wiring diagram to identify the duty.', href: '/contact/?application=pumps-and-water-systems&request=quote#inquiry-form', link: 'Ask about the original part' },
    ],
    fitChecks: [
      ['Body and base stud', 'Measure body diameter, height, stud and fixing dimensions against the proposed model drawing.'],
      ['Lead clearance', 'Include the lead exit, length and connector, allowing room to route the leads at the installed location.'],
      ['Separate parts', 'A motor with both start and run capacitors needs separate installation and connection details for each part.'],
    ],
    inquiryFields: ['Pump and motor model, with the original capacitor label and circuit diagram.', 'Drawing or measurements for the installation described above.', 'Quantity for each part, destination and any required documents.'],
    checks: [
      ['Pump, motor and circuit', 'Provide the equipment and motor model with its diagram or specification. Identify run duty, switched start duty or both; list each part separately and request start-duty and time limits where needed.'],
      ['Original rating', 'Include a clear capacitor-label photograph showing the original µF, VAC and any duty marking for each part.'],
      ['Body and fixing', 'Measure diameter, height, mounting stud and fixing details. Compare them with the drawing and the available enclosure space.'],
      ['Connections and clearance', 'Include a connection photograph or drawing, lead exit, wire length and connector or terminal format. Check the space available for the installed connections.'],
      ['Quantity and destination', 'Provide the order quantity by model and destination country or market.'],
    ],
    detail: { image: '/images/real/cbb60-18.jpg', alt: 'Two photographed CBB60 samples; the horizontal sample shows a threaded base stud.', caption: 'CBB60 samples · base stud visible on the horizontal sample', focus: '50% 55%' },
    guide: { label: 'Check start versus run duty', href: '/resources/start-vs-run-capacitors/' },
    inquiryLabel: 'Prepare a pump inquiry',
  },
  'fans-and-ventilation': {
    lead: 'The rating and case both have to suit the motor.',
    decision: 'The original label gives the rating. The motor diagram and mounting space determine the connection layout and case format.',
    comparisonTitle: 'Run-capacitor formats for fan motors',
    comparisonIntro: 'Both series are run capacitors. Choose the rating from the motor specification and the case format from the installation space.',
    functions: {
      CBB61: 'Rectangular run format for fan and blower motors.',
      CBB60: 'Cylindrical run format for the specified motor circuit.',
    },
    confirmations: {
      CBB61: 'Rectangular case; verify mounting tabs and the lead or blade-terminal arrangement.',
      CBB60: 'Cylindrical body; verify fixing and lead clearance.',
    },
    showDimensions: true,
    paths: [
      { title: 'Motor rating', text: 'Find run duty, µF and VAC in the motor specification and original capacitor label.', href: '/resources/read-motor-capacitor-label/', link: 'Read the capacitor label' },
      { title: 'Rectangular case', text: 'Compare CBB61 case size and mounting tabs, then check the blade or wire connections against the drawing.', href: '/products/cbb61-fan-capacitor/', link: 'CBB61 fan capacitors' },
      { title: 'Cylindrical case', text: 'Compare the CBB60 body, fixing and lead clearance with the available mounting space.', href: '/products/cbb60-motor-run-capacitor/', link: 'CBB60 run capacitors' },
    ],
    fitChecks: [
      ['Case and mounting tabs', 'Record L / W / H for a rectangular case or D / H for a cylindrical body. Include fixing positions and the available mounting space.'],
      ['Wire leads', 'Specify exit direction, wire count, length and connector on the wiring diagram.'],
      ['Blade terminals', 'Include the blade pattern and spacing from the model drawing. Check these separately from wire-lead connections.'],
    ],
    inquiryFields: ['Fan and motor model, with the original capacitor label.', 'Drawing or measurements showing the case, mounting and connections.', 'Quantity by rating and destination.'],
    checks: [
      ['Fan, motor and rating', 'Provide the equipment and motor model with the original motor specification. Include the capacitor label showing µF and VAC, and confirm that the motor calls for run duty.'],
      ['Case and mounting', 'Measure case length, width and height or body diameter and height, fixing positions and available space at the mounting point.'],
      ['Leads or terminals', 'For wired parts, record lead count, exit direction, length and connector. For blade terminals, include the terminal pattern. Compare with the original sample or drawing; matching wire counts alone do not establish compatibility.'],
      ['Original sample or drawing', 'Include clear label, side and connection photographs, or the original drawing.'],
      ['Quantity and destination', 'Provide the order quantity by model and destination country or market.'],
    ],
    detail: { image: '/images/real/cbb61-leads-10.jpg', alt: 'Two real CBB61 samples with red leads and visible mounting tabs.', caption: 'CBB61 samples · lead exit and mounting tabs', focus: '50% 78%' },
    guide: { label: 'Review dimensions and terminal fit', href: '/resources/dimensions-terminals-mounting/' },
    inquiryLabel: 'Prepare a fan inquiry',
  },
  'appliances-and-small-motors': {
    lead: 'Start with the motor served by the capacitor.',
    decision: 'Identify the motor connected to the capacitor. Use its label and wiring diagram to record the duty, rating and connection layout.',
    comparisonTitle: 'Run-capacitor formats for appliance motors',
    comparisonIntro: 'Compare these run-capacitor formats against the motor specification and available installation space.',
    functions: {
      CBB60: 'Cylindrical run format for single-phase appliance motors.',
      CBB61: 'Compact rectangular run format for appliance motors.',
    },
    confirmations: {
      CBB60: 'Cylindrical body; verify fixing and lead clearance.',
      CBB61: 'Rectangular case; verify fixing and the lead or blade arrangement.',
    },
    showDimensions: false,
    paths: [
      { title: 'Appliance and motor', text: 'Record the appliance model and the motor connected to the capacitor.', href: '/resources/read-motor-capacitor-label/', link: 'Read the original label' },
      { title: 'Original capacitor', text: 'Read the electrical ratings from the capacitor label and identify run or start duty from the motor wiring diagram. Send a clear photo by email or WhatsApp if a marking is difficult to read.', href: '/buying-guide/#rfq-template', link: 'Quotation checklist' },
      { title: 'Case format', text: 'Compare CBB60 cylindrical and CBB61 rectangular cases against the available mounting space.', href: '/products/', link: 'Compare product series' },
    ],
    fitChecks: [
      ['Original labels', 'Use the capacitor label and motor plate for the specific motor being serviced.'],
      ['Wiring and connector', 'Include the wiring diagram, lead or blade arrangement and connector. Parts with the same wire count can have different connections.'],
      ['Installed dimensions', 'Measure the case and fixing points, including clearance inside the appliance for the connections.'],
    ],
    inquiryFields: ['Washing-machine and motor model, with the original capacitor label.', 'Wiring diagram and measurements for the installed part.', 'Initial quantity or forecast, destination and required documents.'],
    checks: [
      ['Equipment, motor and rating', 'Identify the appliance and specific motor served. Provide its specification or diagram and record the original duty, capacitance and rated voltage.'],
      ['Original part record', 'Include clear capacitor-label, side and connection photographs, or the original drawing.'],
      ['Wiring and connector', 'Compare the lead or blade arrangement with the original part and motor drawing, even when the wire counts match.'],
      ['Case and fixing', 'Include cylindrical or rectangular case dimensions, fixing details and installed clearance within the appliance.'],
      ['Quantity, destination and documents', 'Provide the initial order or annual forecast quantity, destination country or market and required documents.'],
    ],
    detail: { image: '/images/real/cbb61-leads-10.jpg', alt: 'Photograph of rectangular CBB61 samples with separate wire leads and mounting tabs.', caption: 'CBB61 samples · wire leads and mounting tabs', focus: '50% 78%' },
    guide: { label: 'Read the original capacitor label', href: '/resources/read-motor-capacitor-label/' },
    inquiryLabel: 'Prepare an appliance inquiry',
  },
};
