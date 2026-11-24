// Presentation assets only. Original photographs and transcribed ratings stay in sampleConfigurations.
const descriptions: Record<string, string> = {
  'cbb60-stud': 'CBB60 capacitor with insulated wire leads and a threaded base stud.',
  'cbb61-blades': 'Three rectangular CBB61 capacitors with blade terminals.',
  'cbb61-leads': 'Two CBB61 capacitors with red wire leads and mounting tabs.',
  'cbb65-single': 'CBB65 single-run metal-can capacitor with two terminal groups.',
  'cbb65-dual': 'CBB65 dual-run metal-can capacitor with three terminal groups.',
  'cd60-start': 'CD60 cylindrical start capacitor with blade terminals.',
};
export function configurationPhotography(id: string) {
  const base = `/images/configuration-detail-20261029/${id}`;
  return {
    src: `${base}-1280.webp`,
    srcset: `${base}-640.webp 640w, ${base}-1280.webp 1280w`,
    width: 1280,
    height: id === 'cbb61-blades' ? 853 : 1280,
    alt: descriptions[id] ?? 'Motor capacitor case and connection details.',
  };
}
