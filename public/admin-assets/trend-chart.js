import {dateRange} from './date-ranges.js?v=20261106-contact';
const $ = id => document.getElementById(id);
const number = value => Number(value || 0).toLocaleString('zh-CN');
const h = value => String(value ?? '').replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const valueFor = (point,period,metric) => point[period] === null ? null : Number(point[period]?.[metric] || 0);
const hourRange = hour => `${String(hour).padStart(2,'0')}:00–${String(hour+1).padStart(2,'0')}:00`;

// Null means the hour has not started. Never connect a line through that gap
// or turn a future hour into an observed zero.
export function seriesSegments(points,period,metric) {
  const segments = [];let segment = [];
  points.forEach((point,index) => {
    const value = valueFor(point,period,metric);
    if (value === null) {if (segment.length) segments.push(segment);segment = [];}
    else segment.push({index,value});
  });
  if (segment.length) segments.push(segment);
  return segments;
}
export function trendLabels(data) {
  const hourly = data.trendGranularity === 'hour', now = data.generatedAt || Date.now();
  const today = dateRange('today',now).to, yesterday = dateRange('yesterday',now).to;
  const beforeYesterday = new Date(Date.parse(yesterday)-86400000).toISOString().slice(0,10);
  const relative = date => date === today ? '今日' : date === yesterday ? '昨日' : date === beforeYesterday ? '前日' : '';
  const day = date => `${relative(date)}${relative(date) ? ' ' : ''}${date.slice(5)}`;
  return hourly ? {current:`${day(data.period.from)}（实线）`,previous:`${day(data.period.previousFrom)}（虚线）`} :
    {current:`${data.period.from.slice(5)} — ${data.period.to.slice(5)}（实线）`,previous:`${data.period.previousFrom.slice(5)} — ${data.period.previousTo.slice(5)}（虚线）`};
}
export function renderTrendChart(data,emptyHtml = '<div class="chart-empty"><p>本期与对比周期均暂无此项记录</p></div>') {
  if (!data || !$('trend-chart')) return;
  const metric = $('trend-metric').value, points = data.trend, node = $('trend-chart');
  const title = $('trend-metric').selectedOptions[0].textContent, hourly = data.trendGranularity === 'hour', labels = trendLabels(data);
  const generatedAt = data.generatedAt || Date.now();
  const clock = new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(generatedAt);
  $('trend-heading').textContent = title+(hourly ? '小时趋势' : '趋势');
  $('legend-current').textContent = labels.current;$('legend-previous').textContent = labels.previous;
  $('trend-data-summary').textContent = hourly ? '查看每小时数据' : '查看每日数据';
  node.dataset.granularity = hourly ? 'hour' : 'day';
  const displayValue = (point,period) => {
    const value = valueFor(point,period,metric);
    return value === null ? '尚未开始' : number(value)+(point[period+'Partial'] ? '（当前小时未结束）' : '');
  };
  $('trend-data').innerHTML = hourly ? `<table><thead><tr><th>小时（北京时间）</th><th>${h(data.period.from)} · ${h(title)}</th><th>${h(data.period.previousFrom)} · ${h(title)}</th></tr></thead><tbody>${points.map(point => `<tr><td>${hourRange(point.hour)}</td><td>${h(displayValue(point,'current'))}</td><td>${h(displayValue(point,'previous'))}</td></tr>`).join('')}</tbody></table>` :
    `<table><thead><tr><th>本期日期</th><th>${h(title)}</th><th>上期日期</th><th>${h(title)}</th></tr></thead><tbody>${points.map(point => `<tr><td>${h(point.date)}</td><td>${displayValue(point,'current')}</td><td>${h(point.previousDate)}</td><td>${displayValue(point,'previous')}</td></tr>`).join('')}</tbody></table>`;
  $('comparison-period').textContent = `${data.period.from} — ${data.period.to}，对比 ${data.period.previousFrom} — ${data.period.previousTo}。日期按北京时间计算。${hourly ? '00:00–24:00 共 24 个小时区间，24:00 是次日零点边界，不额外计数。' : ''}${hourly && metric === 'visitors' ? '各小时访客独立去重，逐小时相加可能高于全天去重访客数。' : ''}`;
  const observed = points.flatMap(point => [valueFor(point,'current',metric),valueFor(point,'previous',metric)]).filter(value => value !== null);
  const max = Math.max(0,...observed);
  if (!points.length || (!hourly && max === 0)) {
    node.innerHTML = emptyHtml;node.setAttribute('aria-label',title+'趋势：两个周期均为 0');
    $('trend-readout').textContent = '';return;
  }
  const width = Math.max(245,node.clientWidth), height = node.clientHeight || 232;
  const ceiling = Math.max(4,Math.ceil(max/4)*4);
  const left = Math.max(34,number(ceiling).length * 6 + 12), right = 12, top = 14, bottom = 30;
  const plotWidth = width-left-right, plotHeight = height-top-bottom;
  const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns,'svg');svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
  const draw = (name,attrs,text,parent = svg) => {const element = document.createElementNS(ns,name);for (const [key,value] of Object.entries(attrs)) element.setAttribute(key,String(value));if (text !== undefined) element.textContent = text;parent.append(element);return element;};
  draw('title',{},`${title}，${labels.current}，对比${labels.previous}。${hourly ? '横轴 0 至 24 小时。' : ''}方向键浏览数据。`);
  for (let tick = 0;tick <= 4;tick++) {
    const y = top+plotHeight-tick/4*plotHeight;
    draw('line',{x1:left,x2:width-right,y1:y,y2:y,stroke:'var(--chart-grid)'});
    draw('text',{x:left-8,y:y+3,'font-size':11,'text-anchor':'end',fill:'var(--axis)'},number(ceiling*tick/4));
  }
  // Hourly samples sit at the start of their interval: hour 23 covers 23–24.
  // The final 24:00 tick is a boundary, never a duplicated or invented sample.
  const x = index => left+(hourly ? index/24*plotWidth : points.length === 1 ? plotWidth/2 : index/(points.length-1)*plotWidth);
  const y = value => top+plotHeight-Number(value || 0)/ceiling*plotHeight;
  for (const [period,color] of [['previous','var(--series-previous)'],['current','var(--series-current)']]) {
    const segments = seriesSegments(points,period,metric);
    segments.forEach(segment => {
      draw('polyline',{'data-series':period,'data-first-index':segment[0].index,'data-last-index':segment.at(-1).index,points:segment.map(point => `${x(point.index)},${y(point.value)}`).join(' '),fill:'none',stroke:color,'stroke-width':period === 'current' ? 2.2 : 1.8,'stroke-linecap':'round','stroke-linejoin':'round',...(period === 'previous' ? {'stroke-dasharray':'4 5'} : {})});
      if (period === 'current' && (hourly || points.length <= 14)) segment.forEach(point => draw('circle',{cx:x(point.index),cy:y(point.value),r:2.4,fill:color}));
    });
  }
  if (!hourly && points.length <= 10) points.forEach((point,index) => draw('text',{x:x(index),y:Math.max(10,y(valueFor(point,'current',metric))-10),'text-anchor':'middle','font-size':11,fill:'var(--accent-ink)'},number(valueFor(point,'current',metric))));
  if (hourly) {
    const step = width < 450 ? 6 : 4;
    for (let hour = 0;hour <= 24;hour += step) draw('text',{x:x(hour),y:height-8,'text-anchor':hour === 0 ? 'start' : hour === 24 ? 'end' : 'middle','font-size':11,fill:'var(--axis)','data-hour-tick':hour},`${String(hour).padStart(2,'0')}:00`);
  } else {
    const tickCount = Math.min(width < 450 ? 3 : 7,points.length);
    for (let tick = 0;tick < tickCount;tick++) {const index = tickCount === 1 ? 0 : Math.round(tick/(tickCount-1)*(points.length-1));draw('text',{x:x(index),y:height-8,'text-anchor':tick === 0 ? 'start' : tick === tickCount-1 ? 'end' : 'middle','font-size':11,fill:'var(--axis)'},points[index].date.slice(5));}
  }
  const textFor = point => `${point.date}${hourly ? ' '+hourRange(point.hour) : ''} ${title} ${displayValue(point,'current')}；对比 ${point.previousDate}${hourly ? ' '+hourRange(point.hour) : ''} ${displayValue(point,'previous')}`;
  const hits = points.map((point,index) => {
    const value = valueFor(point,'current',metric) ?? valueFor(point,'previous',metric) ?? 0;
    const hit = draw('circle',{cx:x(index),cy:y(value),r:8,class:'chart-hit','data-period':valueFor(point,'current',metric) === null ? 'previous' : 'current',tabindex:index === 0 ? '0' : '-1',role:'img','aria-label':textFor(point)});
    const show = () => {$('trend-readout').textContent = textFor(point);};hit.addEventListener('mouseenter',show);hit.addEventListener('focus',show);hit.addEventListener('click',show);
    hit.addEventListener('keydown',event => {
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? points.length-1 : ['ArrowRight','ArrowDown'].includes(event.key) ? Math.min(points.length-1,index+1) : ['ArrowLeft','ArrowUp'].includes(event.key) ? Math.max(0,index-1) : -1;
      if (next < 0) return;event.preventDefault();hits.forEach((item,i) => item.setAttribute('tabindex',String(i === next ? 0 : -1)));hits[next].focus();
    });return hit;
  });
  node.replaceChildren(svg);node.setAttribute('aria-label',`${title}，${hourly ? '00:00 至 24:00 小时趋势' : '每日趋势'}；${labels.current}，合计${number(data.metrics[metric].current)}；${labels.previous}，合计${number(data.metrics[metric].previous)}。`);
  $('trend-readout').textContent = hourly && points.some(point => point.currentPartial)
    ? `截至 ${clock} · 当前小时未结束`
    : '';
}
