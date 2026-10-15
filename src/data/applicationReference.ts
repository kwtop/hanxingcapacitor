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
    lead: 'Check which capacitor the pump motor actually uses.',
    decision: 'A pump motor may specify a run capacitor, a separately switched start capacitor, or both. Check the wiring diagram before comparing CBB60 and CD60; the two duties cannot substitute for each other.',
    comparisonTitle: 'Run and start capacitors for pump motors',
    comparisonIntro: 'Once the circuit is identified, compare the original capacitor rating and mounting space with the series below.',
    functions: {
      CBB60: 'Run duty, where specified by the pump motor manufacturer.',
      CD60: 'Start duty in a circuit that switches the capacitor out after starting.',
    },
    confirmations: {
      CBB60: 'Run duty; verify the cylindrical body, fixing and lead clearance.',
      CD60: 'Switched start duty; request the model-specific duty and time limits.',
    },
    showDimensions: false,
    paths: [
      { title: 'Run', text: 'For a motor that specifies run duty, compare CBB60 with the original run capacitor.', href: '/products/cbb60-motor-run-capacitor/', link: 'CBB60 run capacitors' },
      { title: 'Start', text: 'For a separately switched start circuit, compare CD60 and ask for the model’s starting-duty limits.', href: '/products/cd60-start-capacitor/', link: 'CD60 start capacitors' },
      { title: 'Both', text: 'List the two parts separately. Each needs its own µF, VAC, connections and position on the motor diagram.', href: '/resources/start-vs-run-capacitors/', link: 'Start and run explained' },
      { title: 'Unknown', text: 'Send the original labels and motor diagram. A pump name alone cannot identify capacitor duty.', href: '/contact/?application=pumps-and-water-systems&request=quote#inquiry-form', link: 'Ask about the original part' },
    ],
    fitChecks: [
      ['Body and base stud', 'Measure body diameter, height, stud and fixing dimensions against the proposed model drawing.'],
      ['Lead clearance', 'Include the lead exit, length and connector, allowing room to route the leads at the installed location.'],
      ['Separate parts', 'A motor with both start and run capacitors needs separate installation and connection details for each part.'],
    ],
    inquiryFields: ['Pump / motor model and its circuit or diagram.', 'Original label, duty and µF / VAC for each separate part.', 'Body size, base stud, fixing and installed lead clearance.', 'Connection photograph or drawing; start-duty limits if relevant.', 'Quantity by model and destination country / market.'],
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
    decision: 'Use the original label and circuit to confirm the run rating. Then check the case and connections at the mounting point; matching the µF value alone is not enough.',
    comparisonTitle: 'Run-capacitor formats for fan motors',
    comparisonIntro: 'Both series are for run duty. Use the motor specification to choose the rating and the available mounting space to check the case format.',
    functions: {
      CBB61: 'Rectangular run capacitor for fan and blower motors that specify this format.',
      CBB60: 'Cylindrical run capacitor, subject to the motor specification and available space.',
    },
    confirmations: {
      CBB61: 'Rectangular case; verify mounting tabs and the lead or blade-terminal arrangement.',
      CBB60: 'Cylindrical body; verify fixing and lead clearance.',
    },
    showDimensions: true,
    paths: [
      { title: 'Motor rating', text: 'Find run duty, µF and VAC in the motor specification and original capacitor label.', href: '/resources/read-motor-capacitor-label/', link: 'Read the capacitor label' },
      { title: 'Rectangular case', text: 'Compare CBB61 case size and mounting tabs, then check the blade or wire connections against the drawing.', href: '/products/cbb61-fan-capacitor/', link: 'CBB61 fan capacitors' },
      { title: 'Cylindrical case', text: 'CBB60 needs the rating and format specified by the motor, with enough room for the case and connections.', href: '/products/cbb60-motor-run-capacitor/', link: 'CBB60 run capacitors' },
    ],
    fitChecks: [
      ['Case and mounting tabs', 'Record L / W / H for a rectangular case or D / H for a cylindrical body. Include fixing positions and the available mounting space.'],
      ['Wire leads', 'Specify exit direction, wire count, length and connector, with the wiring diagram. Include the original label to establish the required rating.'],
      ['Blade terminals', 'Include the blade pattern and spacing from the model drawing. Check these separately from wire-lead connections.'],
    ],
    inquiryFields: ['Fan / motor model, specification and original capacitor label.', 'Required µF / VAC and confirmed motor duty.', 'Case L / W / H or D / H, mounting tabs and fixing positions.', 'Lead / connector details or blade pattern and wiring drawing.', 'Quantity by model and destination country / market.'],
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
    decision: 'A washing machine may contain more than one motor. Identify the one that uses the capacitor, then check the original part’s duty, rating, wiring and mounting space.',
    comparisonTitle: 'Run-capacitor formats for appliance motors',
    comparisonIntro: 'CBB60 and CBB61 are run series. Consider them only where the motor specifies run duty and the case and connections fit the appliance.',
    functions: {
      CBB60: 'Cylindrical run format for single-phase appliance motors that specify it.',
      CBB61: 'Compact rectangular run format, subject to the motor and installation requirements.',
    },
    confirmations: {
      CBB60: 'Cylindrical body; verify fixing and lead clearance.',
      CBB61: 'Rectangular case; verify fixing and the lead or blade arrangement.',
    },
    showDimensions: false,
    paths: [
      { title: 'Appliance and motor', text: 'Identify the appliance and the motor served by the capacitor. Other motors in the same appliance may need different parts.', href: '/resources/read-motor-capacitor-label/', link: 'Read the original label' },
      { title: 'Original capacitor', text: 'Copy duty, µF and VAC, then add wiring and installed dimensions. Mark unclear fields as unknown.', href: '/buying-guide/#rfq-template', link: 'Quotation checklist' },
      { title: 'Case format', text: 'With the motor requirement and wiring identified, compare cylindrical CBB60 and rectangular CBB61 cases.', href: '/products/', link: 'Compare product series' },
    ],
    fitChecks: [
      ['Original labels', 'Send the capacitor label and motor plate for the specific motor being serviced. Copy its required ratings into the inquiry.'],
      ['Wiring and connector', 'Include the wiring diagram, lead or blade arrangement and connector. Parts with the same wire count can have different connections.'],
      ['Installed dimensions', 'Measure the case and fixing points, including clearance inside the appliance for the connections.'],
    ],
    inquiryFields: ['Appliance model and the motor served by the capacitor.', 'Original capacitor label and motor plate; mark unreadable fields as unknown.', 'Duty, µF / VAC and original wiring diagram.', 'Installed dimensions, fixing and connection format.', 'Initial quantity or forecast and destination country / market.'],
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
