(/* 由 prepare_capture.py 绑定测量基线。只读取主文档，不导航、不操作页面。 */
(plan) => {
  const elements = plan.targets.map(({name, selector}) => {
    let matches;
    try { matches = document.querySelectorAll(selector); }
    catch { return {name, selector, status: 'invalid_selector', count: 0}; }
    if (matches.length !== 1) return {name, selector, count: matches.length, status: matches.length ? 'ambiguous' : 'missing'};
    const el = matches[0];
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    let hidden = ['hidden', 'collapse'].includes(style.visibility);
    for (let parent = el; parent; parent = parent.parentElement) {
      const s = getComputedStyle(parent);
      if (s.display === 'none' || Number(s.opacity) === 0) hidden = true;
    }
    const hasBox = el.getClientRects().length > 0 && rect.width > 0 && rect.height > 0;
    const result = {
      name, selector, count: 1,
      status: hidden ? 'hidden' : hasBox ? 'measured' : 'unmeasurable',
      box: [rect.left + scrollX, rect.top + scrollY, rect.width, rect.height],
      text: (el.textContent || '').trim().slice(0, 300),
      computed: {display: style.display, visibility: style.visibility, opacity: style.opacity, fontFamily: style.fontFamily, fontSize: style.fontSize, lineHeight: style.lineHeight, fontWeight: style.fontWeight, color: style.color, backgroundColor: style.backgroundColor},
      viewport_intersects: rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth
    };
    if (el.tagName === 'IMG') result.asset = {src: el.currentSrc, natural_width: el.naturalWidth, natural_height: el.naturalHeight, version: el.getAttribute('data-version') || null};
    return result;
  });
  return {
    measurement_sha256: plan.measurement_sha256,
    url: location.href, title: document.title,
    viewport: {width: innerWidth, height: innerHeight}, dpr: devicePixelRatio,
    scroll: {x: scrollX, y: scrollY}, document_height: document.documentElement.scrollHeight,
    fonts_ready: document.fonts.status === 'loaded',
    images_ready: [...document.images].every(im => im.complete && im.naturalWidth > 0),
    document_overflow_x: document.documentElement.scrollWidth > innerWidth,
    captured_at: new Date().toISOString(), elements,
    assets: Object.fromEntries(elements.filter(el => el.asset).map(el => [el.name, el.asset]))
  };
}
)({"measurement_sha256": "6f06902038aa2096e6ae1c4d1ca8cfe935df6549f95340b9f9aa82275f2d39a5", "targets": [{"name": "header", "selector": ".sp-header"}, {"name": "hero", "selector": ".sp-hero"}, {"name": "series-strip", "selector": ".sp-series-strip"}, {"name": "categories", "selector": ".sp-categories"}, {"name": "label-banner", "selector": ".sp-photo-banner:nth-of-type(3)"}, {"name": "series-rail", "selector": ".sp-content-rail.sp-has-range-note"}, {"name": "fit-banner", "selector": ".sp-photo-banner:nth-of-type(5)"}, {"name": "guide-rail", "selector": ".sp-content-rail:not(.sp-has-range-note)"}, {"name": "applications", "selector": ".sp-applications"}, {"name": "inquiry", "selector": ".sp-inquiry-panel"}, {"name": "source-intro", "selector": ".sp-source-intro"}, {"name": "source-stories", "selector": ".sp-stories"}, {"name": "resource-bar", "selector": ".sp-resource-bar"}, {"name": "footer", "selector": ".site-footer"}]})
