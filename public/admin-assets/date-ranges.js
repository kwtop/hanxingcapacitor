const day = 86400000;
export function dateRange(preset, now = Date.now()) {
  const today = new Date(now + 8*3600000).toISOString().slice(0,10), midnight = Date.parse(today);
  const shift = days => new Date(midnight-days*day).toISOString().slice(0,10);
  if (preset === 'yesterday') return {from:shift(1),to:shift(1)};
  if (preset === '7days') return {from:shift(6),to:today};
  if (preset === '30days') return {from:shift(29),to:today};
  return {from:today,to:today};
}
export function matchingPreset(from,to,now = Date.now()) {
  return ['today','yesterday','7days','30days'].find(preset => {const range = dateRange(preset,now);return range.from === from && range.to === to;}) || 'custom';
}
