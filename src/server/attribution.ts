import type { RecordData } from './types';
import { field } from './http';

const ownHost = (host: string) => host.replace(/^www\./, '').toLowerCase();
export function sourceInfo(request: Request, meta: RecordData) {
  let host = '', referrerUrl = '';
  try {
    const referrer = new URL(field(meta.referrer, 1000));
    if (['http:', 'https:'].includes(referrer.protocol) && !referrer.username && !referrer.password) {
      host = referrer.hostname.toLowerCase();
      if (ownHost(host) !== ownHost(new URL(request.url).hostname)) {
        // Query strings and fragments can contain searches, tokens or personal data.
        referrerUrl = (referrer.origin + referrer.pathname).slice(0, 500);
      } else host = '';
    }
  } catch { /* No usable referrer. */ }
  const source = /^[a-z0-9_.-]{1,60}$/i.test(field(meta.utmSource, 61)) ? field(meta.utmSource, 60).toLowerCase() : '';
  const medium = /^[a-z0-9_.-]{1,40}$/i.test(field(meta.utmMedium, 41)) ? field(meta.utmMedium, 40).toLowerCase() : '';
  const campaign = /^[\p{L}\p{N}_. -]{1,100}$/u.test(field(meta.utmCampaign, 101)) ? field(meta.utmCampaign, 100) : '';
  const details = { referrer_host: host, referrer_url: referrerUrl, utm_medium: source ? medium : '', utm_campaign: source ? campaign : '' };
  if (source) return { source, channel: /^(cpc|ppc|paidsearch|paid_search)$/.test(medium) ? 'paid_search' : /^(organic|organic_search)$/.test(medium) ? 'organic_search' : /social/.test(medium) ? 'social' : /email/.test(medium) ? 'email' : /^(display|banner|cpm)$/.test(medium) ? 'display' : 'campaign', ...details };
  if (!host) return { source: 'direct_or_unknown', channel: 'direct_or_unknown', ...details };
  if (/(^|\.)(google\.(?:com|cat|[a-z]{2}|(?:com|co)\.[a-z]{2})|bing\.com|duckduckgo\.com|yahoo\.(?:com|[a-z]{2}|(?:com|co)\.[a-z]{2})|baidu\.com|yandex\.(?:com|[a-z]{2}|com\.tr)|ecosia\.org|search\.brave\.com|sogou\.com|so\.com|search\.naver\.com)$/.test(host)) return { source: host, channel: 'organic_search', ...details };
  return { source: host, channel: /(^|\.)(facebook\.com|instagram\.com|linkedin\.com|t\.co|x\.com|youtube\.com|pinterest\.com)$/.test(host) ? 'social' : 'referral', ...details };
}
