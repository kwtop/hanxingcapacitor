type Reference = { series: string; text: string };
const seriesPaths: Record<string, string> = { CBB60: 'cbb60-motor-run-capacitor', CBB61: 'cbb61-fan-capacitor', CBB65: 'cbb65-air-conditioner-capacitor', CD60: 'cd60-start-capacitor' };
const applications: Record<string, { name: string; slug: string }> = {
  hvac: { name: 'Air conditioners / HVAC', slug: 'hvac-and-refrigeration' },
  'hvac-and-refrigeration': { name: 'Air conditioners / HVAC', slug: 'hvac-and-refrigeration' },
  pump: { name: 'Water pumps', slug: 'pumps-and-water-systems' },
  'pumps-and-water-systems': { name: 'Water pumps', slug: 'pumps-and-water-systems' },
  fan: { name: 'Fans and blowers', slug: 'fans-and-ventilation' },
  'fans-and-ventilation': { name: 'Fans and blowers', slug: 'fans-and-ventilation' },
  appliance: { name: 'Washing machines', slug: 'appliances-and-small-motors' },
  'appliances-and-small-motors': { name: 'Washing machines', slug: 'appliances-and-small-motors' },
  other: { name: 'Other single-phase motor', slug: '' },
};
const purposes: Record<string, string> = {
  quote: 'A quotation', documents: 'Datasheets or drawings', samples: 'Samples',
  oem: 'OEM / private label', packing: 'Packing and delivery', 'after-sales': 'Help with an existing order',
};

export function initContactDraft() {
  const form = document.querySelector<HTMLFormElement>('#contact-inquiry-form');
  if (!form) return;
  const get = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const configurations: Record<string, Reference> = JSON.parse(form.dataset.configurations || '{}');
  const photos: Record<string, Reference> = JSON.parse(form.dataset.photoReferences || '{}');
  const guides: Record<string, string> = JSON.parse(form.dataset.guides || '{}');
  const emailAddress = form.dataset.email || '';
  const whatsappNumber = form.dataset.whatsapp || '';
  const params = new URLSearchParams(location.search);
  const series = Object.hasOwn(seriesPaths, params.get('series') || '') ? params.get('series')! : '';
  const configurationId = params.get('configuration') || '';
  const photoId = params.get('photo') || '';
  const configuration = Object.hasOwn(configurations, configurationId) && configurations[configurationId].series === series ? configurations[configurationId] : null;
  const photo = Object.hasOwn(photos, photoId) && (photos[photoId].series === series || (!params.has('series') && photos[photoId].series === 'Additional samples')) ? photos[photoId] : null;
  const application = Object.hasOwn(applications, params.get('application') || '') ? applications[params.get('application')!] : null;
  const guideSlug = Object.hasOwn(guides, params.get('guide') || '') ? params.get('guide')! : '';
  const request = Object.hasOwn(purposes, params.get('request') || '') ? params.get('request')! : 'quote';
  const contextParts = [configuration && `Sample reference: ${configurationId} · ${configuration.text}`, photo && `Photo reference: ${photo.text}`, series && `Series: ${series}`, application && `Application: ${application.name}`, guideSlug && `Guide: ${guides[guideSlug]}`].filter(Boolean) as string[];
  const email = get<HTMLInputElement>('inquiry-email');
  const phone = get<HTMLInputElement>('inquiry-whatsapp');
  const result = get<HTMLDivElement>('draft-result');
  const draftLink = get<HTMLAnchorElement>('contact-draft-link');
  const draftText = get<HTMLTextAreaElement>('draft-text');
  get('contact-context').hidden = contextParts.length === 0;
  get('contact-context-value').replaceChildren(...contextParts.map(text => {
    const li = document.createElement('li'); li.textContent = text; return li;
  }));
  const back = get<HTMLAnchorElement>('contact-reference-link');
  if (photo) { back.href = '/products/photographs/'; back.textContent = 'Return to sample photographs'; }
  else if (series) { back.href = `/products/${seriesPaths[series]}/${configuration ? '#sample-configurations' : ''}`; back.textContent = `Return to ${series}`; }
  else if (guideSlug) { back.href = `/resources/${guideSlug}/`; back.textContent = 'Return to the guide'; }
  else if (application?.slug) { back.href = `/applications/${application.slug}/`; back.textContent = 'Return to the application'; }
  const directDraft = ['Hello, I have a motor capacitor inquiry.', ...contextParts, `Request: ${purposes[request]}`].join('\n');
  document.querySelectorAll<HTMLAnchorElement>('[data-contact-email]').forEach(link => link.href = `mailto:${emailAddress}?subject=${encodeURIComponent('HAN XING inquiry')}&body=${encodeURIComponent(directDraft)}`);
  document.querySelectorAll<HTMLAnchorElement>('[data-contact-whatsapp]').forEach(link => link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(directDraft)}`);
  const channel = () => form.querySelector<HTMLInputElement>('[name="channel"]:checked')!.value;
  const name = get<HTMLInputElement>('inquiry-name');
  const destination = get<HTMLSelectElement>('inquiry-destination');
  const fields = [name, destination, email, phone];
  const errors = get('contact-errors');
  const errorList = get('contact-error-list');
  const prepare = get<HTMLButtonElement>('prepare-draft');
  const copy = get<HTMLButtonElement>('copy-draft');
  let submitted = false;
  let ready = false;
  let failNextPreparation = form.dataset.previewState === 'prepare-error';
  let failNextCopy = form.dataset.previewState === 'copy-error';
  form.noValidate = true;
  function messageFor(field: HTMLInputElement | HTMLSelectElement) {
    if (field.disabled) return '';
    if (field === name && !field.value.trim()) return 'Enter your name.';
    if (field === destination && !field.value) return 'Choose a destination country.';
    if (field === email && (!field.value.trim() || email.validity.typeMismatch)) return 'Enter a valid email address, such as you@company.com.';
    if (field === phone && (field.value.replace(/\D/g, '').length < 7 || !/^[+\d][\d\s().-]*$/.test(field.value.trim()))) return 'Enter your phone number, including the country code.';
    return '';
  }
  function markField(field: HTMLInputElement | HTMLSelectElement) {
    const message = messageFor(field);
    const error = get(`${field.id}-error`);
    error.textContent = message; error.hidden = !message;
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    return message;
  }
  function syncSummary() {
    const invalid = fields.filter(field => !field.disabled && field.getAttribute('aria-invalid') === 'true');
    errorList.replaceChildren(...invalid.map(field => {
      const li = document.createElement('li'); const link = document.createElement('a');
      link.href = `#${field.id}`; link.textContent = get(`${field.id}-error`).textContent;
      link.addEventListener('click', event => { event.preventDefault(); field.focus(); });
      li.append(link); return li;
    }));
    errors.hidden = !submitted || invalid.length === 0;
  }
  function invalidateDraft() {
    if (!ready) return;
    ready = false; result.dataset.stale = 'true'; get('draft-stale').hidden = false;
    get('contact-form-status').textContent = 'This draft needs updating. Nothing has been sent.';
    draftLink.removeAttribute('href'); draftLink.setAttribute('aria-disabled', 'true'); draftLink.tabIndex = -1;
    copy.disabled = true; get('copy-status').textContent = ''; prepare.textContent = 'Update inquiry';
  }
  const syncChannel = () => {
    const isEmail = channel() === 'email';
    email.required = isEmail; email.disabled = !isEmail; email.setCustomValidity('');
    phone.required = !isEmail; phone.disabled = isEmail; phone.setCustomValidity('');
    get('email-field').hidden = !isEmail; get('whatsapp-field').hidden = isEmail;
    const inactive = isEmail ? phone : email;
    inactive.removeAttribute('aria-invalid'); get(`${inactive.id}-error`).hidden = true; get(`${inactive.id}-error`).textContent = '';
    if (submitted) markField(isEmail ? email : phone);
  };
  form.addEventListener('change', event => {
    if ((event.target as HTMLInputElement).name === 'channel') syncChannel();
    if (event.target === destination || (submitted && fields.includes(event.target as HTMLInputElement))) markField(event.target as HTMLInputElement | HTMLSelectElement);
    syncSummary(); invalidateDraft();
  });
  form.addEventListener('focusout', event => {
    const field = event.target as HTMLInputElement | HTMLSelectElement;
    if (fields.includes(field)) { markField(field); syncSummary(); }
  });
  form.addEventListener('input', event => {
    const field = event.target as HTMLInputElement;
    if (field.id === 'draft-text') return;
    if (fields.includes(field) && (submitted || field.getAttribute('aria-invalid') === 'true')) markField(field);
    syncSummary(); invalidateDraft(); get('prepare-status').hidden = true;
  });
  form.addEventListener('submit', event => {
    event.preventDefault(); syncChannel();
    submitted = true; fields.forEach(markField); syncSummary();
    const firstInvalid = fields.find(field => !field.disabled && field.getAttribute('aria-invalid') === 'true');
    if (firstInvalid) { firstInvalid.focus(); return; }
    try {
    if (failNextPreparation) { failNextPreparation = false; throw new Error('Preview preparation failure'); }
    const values = new FormData(form);
    const value = (key: string) => String(values.get(key) || '').trim();
    const draft = ['Hello, I have a motor capacitor inquiry.', '', `Name: ${value('name')}`, `Destination country: ${value('destination')}`, ...(value('email') ? [`Email: ${value('email')}`] : []), ...(value('whatsapp') ? [`Phone / WhatsApp: ${value('whatsapp')}`] : []), ...contextParts, ...(params.has('request') && Object.hasOwn(purposes, params.get('request')!) ? [`Request: ${purposes[request]}`] : []), ...(value('message') ? ['', 'Message:', value('message')] : [])].join('\n');
    draftText.value = draft;
    const isEmail = channel() === 'email';
    draftLink.href = isEmail ? `mailto:${emailAddress}?subject=${encodeURIComponent('HAN XING inquiry'+(series ? ' · '+series : ''))}&body=${encodeURIComponent(draft)}` : `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(draft)}`;
    draftLink.textContent = isEmail ? 'Open email draft' : 'Open WhatsApp draft';
    if (isEmail) { draftLink.removeAttribute('target'); draftLink.removeAttribute('rel'); }
    else { draftLink.target = '_blank'; draftLink.rel = 'noopener noreferrer'; }
    get('contact-form-status').textContent = 'Your draft is ready. Open it in your email or WhatsApp app to send it. Nothing has been sent yet.';
    ready = true; result.dataset.stale = 'false'; get('draft-stale').hidden = true;
    draftLink.removeAttribute('aria-disabled'); draftLink.removeAttribute('tabindex'); copy.disabled = false;
    prepare.textContent = 'Prepare inquiry'; get('prepare-status').hidden = true;
    get('copy-status').textContent = ''; result.hidden = false; get('contact-form-status').focus();
    } catch {
      const status = get('prepare-status'); status.textContent = 'The draft could not be prepared. Your details are still here. Please try again.'; status.hidden = false;
    }
  });
  copy.addEventListener('click', async () => {
    if (!ready || copy.disabled) return;
    copy.disabled = true; copy.setAttribute('aria-busy', 'true'); copy.textContent = 'Copying…';
    try {
      if (failNextCopy) { failNextCopy = false; throw new Error('Preview clipboard failure'); }
      await navigator.clipboard.writeText(draftText.value); if (ready) get('copy-status').textContent = 'Message copied.';
    }
    catch { draftText.closest('details')!.open = true; draftText.focus(); draftText.select(); get('copy-status').textContent = 'Select and copy the message above.'; }
    finally { copy.disabled = !ready; copy.removeAttribute('aria-busy'); copy.textContent = 'Copy message'; }
  });
  syncChannel();
  prepare.disabled = false;
  // Explicit local-only state links use synthetic details and never open a sending app.
  if (form.dataset.previewState) {
    if (form.dataset.previewState !== 'validation') {
      name.value = 'Procurement review'; destination.value = 'United States'; email.value = 'buyer@example.com';
      get<HTMLTextAreaElement>('inquiry-message').value = 'Please confirm the required rating, dimensions, connections and availability.';
    }
    form.requestSubmit();
  }
}
