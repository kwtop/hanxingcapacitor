import {dateRange,matchingPreset} from './date-ranges.js?v=20261106-contact';
import {renderTrendChart} from './trend-chart.js?v=20261121-layout';
import {sourceName,positionName} from './attribution-labels.js?v=20261115';
const $ = id => document.getElementById(id);
const h = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iconPaths = JSON.parse($('admin-icon-data').textContent);
const icon = name => `<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${iconPaths[name] || iconPaths.info}</svg>`;
const statusLabels = {pending:'待处理',following:'跟进中',completed:'已完成',spam:'垃圾询盘'};
const eventLabels = {page_view:'访问页面',product_view:'查看产品',spec_expand:'展开参数',image_view:'查看图片',download_click:'点击资料下载',inquiry_click:'点击询价',whatsapp_click:'点击 WhatsApp',email_click:'点击邮箱',wechat_click:'打开微信二维码',form_start:'开始填写表单',form_failure:'提交失败',inquiry_success:'询盘保存成功'};
const labels = {unknown:'未知',direct_or_unknown:'直接 / 未识别',organic_search:'自然搜索',paid_search:'付费搜索',social:'社交媒体',email:'邮件',referral:'外部引荐',campaign:'推广活动',display:'展示广告',desktop:'电脑',mobile:'手机',tablet:'平板',en:'英语',es:'西班牙语',ar:'阿拉伯语'};
const label = value => labels[value] || value || '未知';
const date = value => value ? new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(Number(value)) : '未知';
const number = value => Number(value || 0).toLocaleString('zh-CN');
const country = value => value && /^[A-Z]{2}$/.test(value) ? new Intl.DisplayNames(['zh-CN'],{type:'region'}).of(value) : label(value);
const browserLanguage = value => {
  if (!value || value === 'unknown') return '未知';
  try {return new Intl.DisplayNames(['zh-CN'],{type:'language'}).of(value) || value;} catch {return value;}
};
const badge = status => `<span class="badge status-${h(status)}">${h(statusLabels[status] || '未知')}</span>`;
const products = value => {try {return JSON.parse(value).map(label).join(' / ');} catch {return '未知';}};
const metricNames = {visitors:'访客数',visits:'访问次数',page_views:'页面浏览量',returning_visitors:'回访访客',contact_clicks:'联系按钮点击',form_starters:'开始填写人数',inquiries:'成功询盘',messaging_clicks:'联系点击数'};
const metricIcons = {visitors:'users',visits:'route',page_views:'layers',returning_visitors:'refresh',contact_clicks:'link',form_starters:'note',inquiries:'inbox',messaging_clicks:'wechat'};
let csrf = '', view = 'overview', inquiryPage = 1, visitorPage = 1, generation = 0, detailGeneration = 0, journeyGeneration = 0;
let currentDetail = null, activeInquiryId = '', overviewData = null;
let recordsContext = null, recordsGeneration = 0, recordsPage = 1;
const dimensionNames = ['source','channel','country','product','language'];
const filterState = {analytics:new URLSearchParams(),inquiries:new URLSearchParams()};

function showError(message) {
  const node = $('error') || $('login-error');
  node.textContent = message;
  node.hidden = false;
}
async function api(path, options = {}) {
  const target = new URL(path, location.origin);
  if (!target.pathname.endsWith('/')) target.pathname += '/';
  const headers = new Headers(options.headers || {});
  if (options.body) {headers.set('Content-Type','application/json');headers.set('X-CSRF-Token',csrf);}
  const response = await fetch(target.pathname + target.search, {...options,headers,body:options.body ? JSON.stringify(options.body) : undefined,credentials:'same-origin',signal:AbortSignal.timeout(25000)});
  const data = await response.json().catch(() => ({error:'服务返回了无法读取的内容。请刷新页面后重试。'}));
  if (!response.ok) {
    if (response.status === 401 && document.body.dataset.authenticated === 'true') location.assign('/admin/');
    const error = new Error(data.error || '操作失败，请稍后重试。');
    error.status = response.status;
    throw error;
  }
  return data;
}
if (document.body.dataset.authenticated !== 'true') {
  $('login-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const button = event.currentTarget.querySelector('button');button.disabled = true;$('login-error').textContent = '';
    try {const fields = new FormData(event.currentTarget);await api('/api/admin/login',{method:'POST',body:{email:fields.get('email'),password:fields.get('password')}});location.assign('/admin/');}
    catch (error) {showError(error.message);} finally {button.disabled = false;}
  });
} else {init().catch(error => showError(error.message));}

async function init() {
  const user = await api('/api/admin/me');csrf = user.csrf;
  const today = dateRange('today').to, query = new URLSearchParams(location.search);
  view = ['overview','visitors','inquiries'].includes(query.get('view')) ? query.get('view') : 'overview';
  for (const [key,value] of [['from',query.get('to') || today],['to',today]]) $('filters').elements.namedItem(key).value = query.get(key) || value;
  syncDatePreset();
  $('date-preset').addEventListener('change',() => {
    if ($('date-preset').value === 'custom') {$('filters').elements.namedItem('from').focus();return;}
    const range = dateRange($('date-preset').value);
    for (const key of ['from','to']) $('filters').elements.namedItem(key).value = range[key];
    $('filters').requestSubmit();
  });
  for (const key of dimensionNames) {
    const value = query.get(key);if (!value) continue;
    const node = $('filters').elements.namedItem(key);
    if (node.tagName === 'SELECT' && ![...node.options].some(option => option.value === value)) node.add(new Option(label(value),value));
    node.value = value;
  }
  if (view === 'inquiries') {
    $('inquiry-search').value = query.get('q') || '';
    if (Object.hasOwn(statusLabels,query.get('status'))) $('inquiry-status').value = query.get('status');
    $('unread-only').checked = query.get('unread') === '1';
    const page = Number(query.get('page'));if (Number.isSafeInteger(page) && page > 0) inquiryPage = page;
  }
  document.querySelectorAll('.nav-item[data-view]').forEach(button => button.addEventListener('click',() => switchView(button.dataset.view).catch(error => showError(error.message))));
  $('filters-toggle').addEventListener('click',() => toggleFilters($('advanced-filters').hidden));
  $('filters-close').addEventListener('click',() => toggleFilters(false,true));
  for (const id of ['reset-filters','clear-inquiry-filters']) $(id).addEventListener('click',clearFilters);
  document.addEventListener('keydown',event => {if (event.key === 'Escape' && !$('advanced-filters').hidden) {event.preventDefault();toggleFilters(false,true);}});
  document.addEventListener('click',event => {if (!$('filters').contains(event.target)) toggleFilters(false);});
  $('filters').addEventListener('submit',event => {event.preventDefault();toggleFilters(false);inquiryPage = visitorPage = 1;load().catch(error => showError(error.message));});
  for (const key of ['from','to']) $('filters').elements.namedItem(key).addEventListener('change',() => $('filters').requestSubmit());
  $('refresh').addEventListener('click',() => load().catch(error => showError(error.message)));
  $('search-inquiries').addEventListener('click',() => {inquiryPage = 1;load().catch(error => showError(error.message));});
  $('search-visitors').addEventListener('click',() => {visitorPage = 1;load().catch(error => showError(error.message));});
  $('clear-visitor-search').addEventListener('click',() => {$('visitor-search').value='';visitorPage=1;load().catch(error=>showError(error.message));});
  $('visitor-search').value = query.get('view') === 'visitors' ? query.get('q') || '' : '';
  for (const key of ['inquiry-status','unread-only']) $(key).addEventListener('change',() => {inquiryPage = 1;load().catch(error => showError(error.message));});
  for (const key of ['inquiry-search','visitor-search']) $(key).addEventListener('keydown',event => {if (event.key === 'Enter') {event.preventDefault();$(key === 'inquiry-search' ? 'search-inquiries' : 'search-visitors').click();}});
  $('inquiry-search').addEventListener('search',() => {inquiryPage=1;load().catch(error=>showError(error.message));});
  $('export').addEventListener('click',exportCsv);
  $('close-detail').addEventListener('click',() => $('detail-dialog').close());
  $('detail-dialog').addEventListener('click',event => {if (event.target === $('detail-dialog')) $('detail-dialog').close();});
  $('detail-dialog').addEventListener('close',() => {journeyGeneration++;const url=new URL(location.href);for(const key of ['visitor','focus_event','visitor_day'])url.searchParams.delete(key);history.replaceState(null,'',url.pathname+url.search);});
  $('close-records').addEventListener('click',() => $('records-dialog').close());
  $('records-dialog').addEventListener('click',event => {if(event.target===$('records-dialog'))$('records-dialog').close();});
  $('records-dialog').addEventListener('close',() => {recordsGeneration++;});
  $('logout').addEventListener('click',async () => {try {const result = await api('/api/admin/logout',{method:'POST',body:{}});location.assign(result.accessLogout || '/admin/');} catch (error) {showError(error.message);}});
  document.addEventListener('click',event => {
    const inquiry = event.target.closest('[data-inquiry]'), visitor = event.target.closest('[data-visitor]'), drill=event.target.closest('[data-record-kind]');
    if (inquiry) openInquiry(inquiry.dataset.inquiry).catch(error => showError(error.message));
    else if (visitor) {
      if(visitor.tagName==='TR' && window.getSelection()?.toString())return;
      if(visitor.dataset.event)visitRecord(visitor.dataset.visitor,visitor.dataset.event).catch(error=>showError(error.message));
      else openJourney(visitor.dataset.visitor,'',false,visitor.closest('tr')?.dataset.visitorDay||'').catch(error => showError(error.message));
    } else if(drill)openRecords({kind:drill.dataset.recordKind,...(drill.dataset.source?{source:drill.dataset.source}:{}),...(drill.dataset.channel?{channel:drill.dataset.channel}:{}),...(drill.dataset.contactType?{contact_type:drill.dataset.contactType}:{})}).catch(error=>showError(error.message));
    if(event.target.closest('[data-records-back]')){ $('detail-dialog').close();switchView('overview').then(()=>openRecords()).catch(error=>showError(error.message)); }
    if (event.target.closest('[data-inbox-back]')) {
      document.querySelector('.inquiry-inbox').classList.remove('is-detail');
      [...document.querySelectorAll('.inquiry-row')].find(row => row.dataset.inquiry === activeInquiryId)?.focus();
    }
  });
  $('trend-metric').addEventListener('change',renderChart);
  let resizeTimer;window.addEventListener('resize',() => {clearTimeout(resizeTimer);resizeTimer = setTimeout(() => {if (view === 'overview') renderChart();},150);});
  await switchView(['overview','visitors','inquiries'].includes(query.get('view')) ? query.get('view') : 'overview');
  if(query.get('visitor'))await openJourney(query.get('visitor'),query.get('focus_event')||'',false,query.get('visitor_day')||'');
}
function toggleFilters(open, focus = false) {
  $('advanced-filters').hidden = !open;$('filters-toggle').setAttribute('aria-expanded',String(open));
  if (focus) $('filters-toggle').focus();
}
function syncDatePreset() {
  $('date-preset').value = matchingPreset($('filters').elements.namedItem('from').value,$('filters').elements.namedItem('to').value);
}
function params() {
  const result = new URLSearchParams(new FormData($('filters')));
  for (const [key,value] of [...result]) if (!value) result.delete(key);
  return result;
}
function inboxParams() {
  const result = params();
  result.delete('from');result.delete('to');
  if ($('inquiry-search').value.trim()) result.set('q',$('inquiry-search').value.trim());
  if ($('inquiry-status').value) result.set('status',$('inquiry-status').value);
  if ($('unread-only').checked) result.set('unread','1');
  result.set('page',String(inquiryPage));return result;
}
function clearFilters() {
  for (const key of dimensionNames) $('filters').elements.namedItem(key).value = '';
  if (view === 'inquiries') {$('inquiry-search').value='';$('inquiry-status').value='';$('unread-only').checked=false;}
  else if (view === 'visitors') $('visitor-search').value='';
  inquiryPage=visitorPage=1;toggleFilters(false);load().catch(error=>showError(error.message));
}
async function switchView(next) {
  const currentScope = view === 'inquiries' ? 'inquiries' : 'analytics', nextScope = next === 'inquiries' ? 'inquiries' : 'analytics';
  if (currentScope !== nextScope) {
    for (const key of dimensionNames) {
      const input=$('filters').elements.namedItem(key);
      filterState[currentScope].set(key,input.value);
      const value=filterState[nextScope].get(key)||'';
      if (input.tagName==='SELECT' && value && ![...input.options].some(option=>option.value===value)) input.add(new Option(label(value),value));
      input.value=value;
    }
    toggleFilters(false);
  }
  view = next;document.body.dataset.view = next;
  const titles = {inquiries:'询盘管理',overview:'访问概览',visitors:'访客轨迹'};
  $('view-title').textContent = titles[view];
  const isInbox=view==='inquiries';
  $('date-range').hidden=isInbox;$('date-preset').hidden=isInbox;$('inquiry-scope').hidden=!isInbox;
  for (const key of ['from','to']) $('filters').elements.namedItem(key).disabled=isInbox;
  $('country-filter-label').textContent=isInbox?'客户国家':'访问国家';
  for (const key of ['inquiries','overview','visitors']) $(key+'-view').hidden = key !== view;
  document.querySelectorAll('.nav-item[data-view]').forEach(button => {button.classList.toggle('active',button.dataset.view === view);if (button.dataset.view === view) button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
  $('filter-help').textContent = isInbox ? '询盘显示全部时间，国家筛选对应客户填写的国家。' : '日期按北京时间（UTC+8）计算，最多查询 93 天。国家来自 Cloudflare 地理信息，不可获取时为未知。';
  await load();
}
async function load() {
  const run = ++generation, activeView = view;
  $('error').hidden = true;$('refresh').disabled = true;
  $('load-feedback').textContent = '正在更新数据…';$(activeView+'-view').setAttribute('aria-busy','true');
  const query = activeView === 'inquiries' ? inboxParams() : params(), filterCount = dimensionNames.filter(key => query.has(key)).length;
  $('clear-inquiry-filters').hidden = !filterCount && !query.has('q') && !query.has('status') && !query.has('unread');
  syncDatePreset();
  $('filter-summary').textContent = filterCount ? `筛选 · ${filterCount}` : '筛选';
  const historyQuery=new URLSearchParams([...query,['view',activeView]]);
  if(activeView==='visitors'&&$('visitor-search').value.trim())historyQuery.set('q',$('visitor-search').value.trim());
  history.replaceState(null,'','/admin/?'+historyQuery);
  try {
    if (activeView === 'inquiries') {const data = await api('/api/admin/inquiries?'+inboxParams());if (run === generation) renderInquiries(data);}
    else if (activeView === 'overview') {const data = await api('/api/admin/overview?'+query);if (run === generation) {overviewData = data;renderOverview(data);}}
    else {query.set('page',String(visitorPage));if ($('visitor-search').value.trim()) query.set('q',$('visitor-search').value.trim());const data = await api('/api/admin/visitors?'+query);if (run === generation) renderVisitors(data);}
    if (run === generation) {
      const facetQuery=params();if(activeView==='inquiries')facetQuery.set('scope','inquiries');
      const options = await api('/api/admin/facets?'+facetQuery);
      if (run === generation) {
        renderFacets(options);
      }
    }
  } finally {
    $(activeView+'-view').removeAttribute('aria-busy');
    if (run === generation) {$('refresh').disabled = false;$('load-feedback').textContent = '';}
  }
}
function renderFacets(data) {
  for (const [name,values] of [['source',data.sources],['language',data.languages]]) {
    const input = $('filters').elements.namedItem(name), selected = input.value;
    input.replaceChildren(new Option(name === 'source' ? '全部来源' : '全部语言',''));
    for (const value of new Set([...values,...(selected ? [selected] : [])])) input.add(new Option(label(value),value));
    input.value = selected;
  }
  $('country-options').innerHTML = (view === 'inquiries' ? data.inquiryCountries : data.countries).map(value => `<option value="${h(value)}">${h(country(value))}</option>`).join('');
}
function paginate(id,data,onChange) {
  const node = $(id), pages = Math.max(1,Math.ceil(data.total/data.pageSize));node.replaceChildren();
  const text = document.createElement('span');text.textContent = `共 ${number(data.total)} 条 · 第 ${data.page} / ${pages} 页`;node.append(text);
  for (const [title,next] of [['上一页',data.page-1],['下一页',data.page+1]]) {
    const button = document.createElement('button');button.className = 'button secondary';button.textContent = title;button.disabled = next < 1 || next > pages;
    button.addEventListener('click',() => onChange(next));node.append(button);
  }
}
function renderInquiries(data) {
  const focusedId = document.activeElement?.closest('.inquiry-row')?.dataset.inquiry;
  inquiryPage=data.page;
  $('inquiry-count').textContent = `共 ${number(data.total)} 条 · ${number(data.unread)} 条未读`;$('inquiry-empty').hidden = data.items.length > 0;$('export').disabled=data.total===0;
  $('inquiries-body').innerHTML = data.items.map(row => `<button class="inquiry-row${activeInquiryId === row.id ? ' selected' : ''}" data-inquiry="${h(row.id)}" aria-pressed="${activeInquiryId === row.id}" aria-label="${h(row.name)}，${h(row.reference)}，${row.read_at ? '已读' : '未读'}"><span class="inquiry-row-top"><strong>${row.read_at ? '' : '<span class="unread-dot" aria-hidden="true"></span>'}${h(row.name)}</strong><time>${h(date(row.created_at))}</time></span><span class="inquiry-row-company">${h(row.company || row.email || row.phone || '公司未知')}</span><span class="inquiry-row-bottom"><span>${h(country(row.country))} · ${h(products(row.products))}</span>${badge(row.status)}</span></button>`).join('');
  if (focusedId) [...document.querySelectorAll('.inquiry-row')].find(row => row.dataset.inquiry === focusedId)?.focus({preventScroll:true});
  paginate('inquiries-pagination',data,page => {inquiryPage = page;load().catch(error => showError(error.message));});
}
async function exportCsv() {
  $('export').disabled = true;
  try {
    const response = await fetch('/api/admin/inquiries/export/?'+inboxParams(),{credentials:'same-origin',signal:AbortSignal.timeout(30000)});
    if (!response.ok) {const error = await response.json();throw new Error(error.error || '导出失败。');}
    const url = URL.createObjectURL(await response.blob()), link = document.createElement('a');link.href = url;link.download = `韩兴询盘-${new Date().toISOString().slice(0,10)}.csv`;link.click();setTimeout(() => URL.revokeObjectURL(url),1000);
  } catch (error) {showError(error.message);} finally {$('export').disabled = false;}
}
async function openInquiry(id) {
  if ($('detail-dialog').open) $('detail-dialog').close();
  if (view !== 'inquiries') await switchView('inquiries');
  const run = ++detailGeneration;activeInquiryId = id;
  document.querySelector('.inquiry-inbox').classList.add('is-detail');
  $('inquiry-detail').innerHTML = `<button class="text-button detail-back" data-inbox-back>${icon('back')}返回询盘列表</button><div class="detail-placeholder" role="status">${icon('inbox')}<p>正在加载询盘…</p></div>`;
  document.querySelectorAll('.inquiry-row').forEach(row => {row.classList.toggle('selected',row.dataset.inquiry === id);row.setAttribute('aria-pressed',String(row.dataset.inquiry === id));});
  try {
    const data = await api('/api/admin/inquiries/'+encodeURIComponent(id));if (run !== detailGeneration) return;
    if (!data.read_at) {
      try {const result = await api('/api/admin/inquiries/'+encodeURIComponent(id),{method:'PATCH',body:{read:true,version:data.version}});Object.assign(data,result);}
      catch (error) {if (error.status !== 409) throw error;Object.assign(data,await api('/api/admin/inquiries/'+encodeURIComponent(id)));}
      if (view === 'inquiries') load().catch(error => showError(error.message));
    }
    if (run !== detailGeneration) return;
    currentDetail = data;renderInquiry(data);$('inquiry-detail').focus({preventScroll:true});
  } catch (error) {
    if (run !== detailGeneration) return;
    $('inquiry-detail').innerHTML = `<button class="text-button detail-back" data-inbox-back>${icon('back')}返回询盘列表</button><div class="detail-placeholder"><h2>暂时无法加载</h2><p>${h(error.message)}</p></div>`;
  }
}
function detailPair(key,value,iconName) {return `<div><dt>${icon(iconName)}${key}</dt><dd>${h(value || '未知')}</dd></div>`;}
function renderInquiry(data) {
  const mainPairs = [['邮箱',data.email,'inbox'],['电话',data.phone,'phone'],['公司',data.company,'box'],['客户国家',country(data.country),'location'],['感兴趣的产品',products(data.products),'layers'],['询盘编号',data.reference,'note']];
  const contextPairs = [['提交页面',data.submission_page,'link'],['来源页面',data.source_page,'external'],['网站语言',label(data.language),'globe'],['访问来源',label(data.source),'compass'],['渠道',label(data.channel),'route'],['匿名访客',data.visitor_id,'user']];
  $('inquiry-detail').innerHTML = `<button class="text-button detail-back" data-inbox-back>${icon('back')}返回询盘列表</button><header class="inquiry-detail-header"><div class="inquiry-identity"><span class="avatar" aria-hidden="true">${h(Array.from(data.name || '?')[0].toUpperCase())}</span><div><h2>${h(data.name)}</h2><p>${h(data.company || '公司未知')}</p></div></div><span id="detail-badge">${badge(data.status)}</span></header><div class="inquiry-detail-body"><div class="detail-meta"><span>${icon('calendar')}${h(date(data.created_at))} 提交</span></div><div class="detail-actions"><label>状态<select id="detail-status">${Object.entries(statusLabels).map(([key,text]) => `<option value="${key}" ${key === data.status ? 'selected' : ''}>${text}</option>`).join('')}</select></label><button class="button secondary" id="toggle-read">${data.read_at ? '标记为未读' : '标记为已读'}</button>${data.visitor_id ? `<button class="button secondary" data-visitor="${h(data.visitor_id)}">${icon('route')}查看轨迹</button>` : ''}</div><dl class="detail-grid">${mainPairs.map(pair => detailPair(...pair)).join('')}</dl><section class="detail-section"><h3>${icon('inbox')}客户需求</h3><p class="pre-wrap">${h(data.message)}</p>${data.context ? `<p class="small muted pre-wrap">${h(data.context)}</p>` : ''}</section><details class="context-details"><summary>查看来源与提交信息</summary><dl class="detail-grid">${contextPairs.map(pair => detailPair(...pair)).join('')}</dl></details><section class="detail-section"><h3>${icon('note')}跟进备注</h3><form id="note-form" class="note-form"><label class="sr-only" for="note-text">添加跟进备注</label><textarea id="note-text" rows="3" maxlength="2000" placeholder="记录联系结果和下一步安排" required></textarea><button class="button" type="submit">${icon('note')}添加备注</button></form><p id="detail-feedback" role="status" class="small detail-feedback"></p><div id="notes">${data.notes.length ? data.notes.map(note => `<article class="note-item"><span class="small muted">${h(date(note.created_at))} · ${h(note.author)}</span><p>${h(note.note)}</p></article>`).join('') : '<p class="small muted">暂无跟进备注。</p>'}</div></section></div>`;
  const isCurrent = () => currentDetail?.id === data.id && activeInquiryId === data.id;
  const feedback = (message,error = false) => {if (!isCurrent() || !$('detail-feedback')) return;$('detail-feedback').textContent = message;$('detail-feedback').classList.toggle('error',error);};
  const update = async body => {
    const status = $('detail-status'), read = $('toggle-read');status.disabled = read.disabled = true;
    try {
      const result = await api('/api/admin/inquiries/'+encodeURIComponent(data.id),{method:'PATCH',body:{...body,version:currentDetail.version}});
      if (isCurrent()) {Object.assign(currentDetail,result);status.value = result.status;read.textContent = result.read_at ? '标记为未读' : '标记为已读';$('detail-badge').innerHTML = badge(result.status);feedback('已保存。');}
      if (view === 'inquiries') await load().catch(error => showError('修改已保存，但列表刷新失败：'+error.message));
    } catch (error) {
      if (isCurrent()) {
        if (error.status === 409) {
          try {
            const latest = await api('/api/admin/inquiries/'+encodeURIComponent(data.id));
            if (isCurrent()) {Object.assign(currentDetail,latest);status.value = latest.status;read.textContent = latest.read_at ? '标记为未读' : '标记为已读';$('detail-badge').innerHTML = badge(latest.status);}
          } catch { /* Keep the draft note and show the original conflict. */ }
        }
        if (isCurrent()) {status.value = currentDetail.status;feedback(error.status === 409 ? '此询盘刚被其他操作更新，已尝试同步状态。请核对后重新操作；备注草稿已保留。' : error.message,true);}
      }
    }
    finally {if (status.isConnected) status.disabled = false;if (read.isConnected) read.disabled = false;}
  };
  $('detail-status').addEventListener('change',event => update({status:event.target.value}));
  $('toggle-read').addEventListener('click',() => update({read:!currentDetail.read_at}));
  $('note-form').addEventListener('submit',async event => {
    event.preventDefault();const button = event.currentTarget.querySelector('button'), note = $('note-text').value;button.disabled = true;
    try {
      await api('/api/admin/inquiries/'+encodeURIComponent(data.id)+'/notes',{method:'POST',body:{note}});
      const refreshed = await api('/api/admin/inquiries/'+encodeURIComponent(data.id));
      if (isCurrent()) {currentDetail = refreshed;renderInquiry(refreshed);$('detail-feedback').textContent = '备注已保存。';$('note-text').focus();}
    } catch (error) {feedback(error.message,true);if (button.isConnected) button.disabled = false;}
  });
}
function renderVisitors(data) {
  $('visitor-count').textContent = `${number(data.uniqueVisitors)} 位 · ${number(data.total)} 条每日记录`;$('visitor-empty').hidden = data.items.length > 0;
  $('visitors-body').innerHTML = data.items.map(row => {
    const id = h(row.visitor_id);
    const shortId = h(row.visitor_id.slice(0,8));
    const lastSeen = date(row.last_seen), firstSeen = date(row.first_seen);
    const revisit = row.visits > 1 ? `当日回访 · ${number(row.visits)} 次` : row.is_returning ? '回访访客' : '';
    const city = row.city && row.city !== 'unknown' ? row.city : '';
    const language = browserLanguage(row.browser_language);
    return `<tr class="visitor-record-row" data-visitor="${id}" data-visitor-day="${h(row.day)}">
      <td><button class="text-button visitor-identity" data-visitor="${id}" title="查看访客详情：${id}" aria-label="查看匿名访客 ${shortId} 的地区和访问操作">${icon('user')}匿名 ${shortId}…</button>
        <span class="visitor-meta"><span class="sub">${h(sourceName(row.source))}</span>${revisit ? `<span class="visitor-kind is-returning">${h(revisit)}</span>` : ''}</span></td>
      <td>${h(lastSeen)}${firstSeen !== lastSeen ? `<span class="sub">当日首次 ${h(firstSeen)}</span>` : ''}</td>
      <td>${h(country(row.country))}${city ? `<span class="sub">${h(city)}</span>` : ''}</td>
      <td>${h(label(row.device))}<span class="sub" title="${h(row.browser_language || '未知')}">${h(language)}</span></td>
      <td>${number(row.page_views)} 页浏览<span class="sub">${number(row.events)} 次操作</span></td>
      <td><button class="text-button" data-visitor="${id}">${icon('route')}查看轨迹</button></td>
    </tr>`;
  }).join('');
  paginate('visitors-pagination',data,page => {visitorPage = page;load().catch(error => showError(error.message));});
}
async function visitRecord(id,eventId) {
  if($('records-dialog').open){
    for(const key of ['from','to','source','channel','country','product','language']){
      const input=$('filters').elements.namedItem(key),value=recordsContext?.get(key)||'';
      if(input instanceof HTMLSelectElement&&value&&![...input.options].some(option=>option.value===value))input.add(new Option(label(value),value));
      input.value=value;
    }
    $('records-dialog').close();
  }
  $('visitor-search').value=id;visitorPage=1;
  await switchView('visitors');
  await openJourney(id,eventId,true);
}
const locationText = row => `${country(row.country)} / ${row.city && row.city !== 'unknown' ? row.city : '城市未知'}`;
function attributionText(row) {
  return `<p>${h(sourceName(row.source))} · ${h(label(row.channel))}${row.source && sourceName(row.source)!==row.source ? ` · ${h(row.source)}` : ''}</p><p>落地页：${h(row.entry_page || '未记录')}</p><p>引荐网址：${h(row.referrer_url || row.referrer_host || '未提供 / 历史未记录')}</p>${row.utm_medium || row.utm_campaign ? `<p>推广媒介：${h(row.utm_medium || '未提供')} · 推广活动：${h(row.utm_campaign || '未提供')}</p>` : ''}`;
}
function eventContent(row) {
  return `<div class="event-line"><strong>${h(eventLabels[row.type] || row.type)}${row.product && row.product !== 'unknown' ? ' · '+h(row.product) : ''}</strong><time>${h(date(row.occurred_at))}</time></div><p>${h(row.page)} · ${h(positionName(row.position))}</p><p>${h(locationText(row))} · ${h(label(row.device))} · 网站语言：${h(label(row.language))} · 浏览器语言：${h(browserLanguage(row.browser_language))}</p><details class="event-attribution"><summary>访问来源与落地页</summary>${attributionText(row)}${row.channel==='organic_search'?'<p>搜索词未提供；未采集搜索引擎查询参数。</p>':''}</details>${row.target ? `<p>目标：${h(row.target)}</p>` : ''}${row.inquiry_id ? `<button class="text-button small" data-inquiry="${h(row.inquiry_id)}">查看对应询盘</button>` : ''}`;
}
function journeySummary(data) {
  const context=data.context||{},summary=data.summary||{},hasPlace=context.country&&context.country!=='unknown';
  const title=data.focusEvent?'所选操作的地区':summary.day?'当日最近记录的地区':'最近记录的地区';
  return `<section class="journey-profile" aria-label="访客地理位置与访问概况"><div class="journey-profile-heading"><h3>${icon('user')}访客信息</h3><span>${summary.day?h(summary.day)+' · 当日记录':'全部历史'}</span></div><div class="journey-profile-grid"><div class="journey-place">${icon('location')}<div><span class="profile-label">${title}</span><strong>${h(country(context.country))}${context.city&&context.city!=='unknown'?' / '+h(context.city):''}</strong><p>${hasPlace?(context.city&&context.city!=='unknown'?'位置由访问 IP 估算。':'城市未记录；国家由访问 IP 估算。'):'地理信息未记录；本地请求或历史记录可能没有地区数据。'}</p></div></div><div class="journey-environment">${icon('monitor')}<div><span class="profile-label">设备与浏览器语言</span><strong>${h(label(context.device))} · ${h(browserLanguage(context.browser_language))}</strong><p>网站语言：${h(label(context.language))}${context.browser_language&&context.browser_language!=='unknown'?' · '+h(context.browser_language):''}</p></div></div></div><div class="journey-source">${icon('compass')}<p><strong>${h(sourceName(context.source))}</strong> · ${h(label(context.channel))}<span>落地页：${h(context.entry_page||'未记录')}</span></p></div><dl class="journey-totals">${[['visits','访问次数'],['page_views','页面浏览'],['events','操作记录'],['contact_clicks','联系入口点击']].map(([key,title])=>`<div><dt>${title}</dt><dd>${number(summary[key])}</dd></div>`).join('')}</dl><p class="journey-period">${summary.day?'当日':'历史'}首次操作：${h(date(summary.first_seen))} · 最近操作：${h(date(summary.last_seen))}</p></section>`;
}
async function openJourney(id,focusEvent='',fromRecords=false,day='') {
  const run = ++journeyGeneration;
  $('detail-title').textContent = '访客轨迹';$('detail-content').textContent = '正在加载…';
  if (!$('detail-dialog').open) $('detail-dialog').showModal();
  try {
    const query=new URLSearchParams();if(focusEvent)query.set('focus_event',focusEvent);if(day)query.set('day',day);
    const data = await api('/api/admin/visitors/'+encodeURIComponent(id)+'?'+query);if (run !== journeyGeneration || !$('detail-dialog').open) return;
    const currentUrl=new URL(location.href);currentUrl.searchParams.set('visitor',id);if(focusEvent)currentUrl.searchParams.set('focus_event',focusEvent);else currentUrl.searchParams.delete('focus_event');if(day)currentUrl.searchParams.set('visitor_day',day);else currentUrl.searchParams.delete('visitor_day');history.replaceState(null,'',currentUrl.pathname+currentUrl.search);
    $('detail-content').innerHTML = `${fromRecords?`<button class="text-button records-back" data-records-back>${icon('back')}返回明细</button>`:''}<p class="small muted journey-id">匿名编号：${h(id)}</p>${journeySummary(data)}${data.focusEvent?`<section class="focused-event" aria-label="选中的操作记录"><h3>${icon('location')}选中的操作记录</h3>${eventContent(data.focusEvent)}</section>`:focusEvent?'<p class="notice">这条操作记录未找到，下方仍可查看该访客的历史。</p>':''}<section class="detail-section"><div class="journey-timeline-heading"><h3>${icon('route')}${day?'当日访问操作':'完整访问过程'}</h3>${day?'<button class="text-button" id="journey-all">查看全部历史</button>':''}</div><p class="small muted">${day?`按北京时间展示 ${h(day)} 当日操作。`:'按时间先后展示全部历史操作。'}</p><ol class="timeline" id="timeline"></ol><p class="small muted" id="journey-empty"${data.items.length?' hidden':''}>当前范围没有已记录的操作。</p><button class="button secondary" id="more-events" hidden>加载更多记录</button></section><details class="detail-section journey-inquiries"><summary>${icon('inbox')}关联询盘（${number(data.inquiries.length)}）</summary><div class="related-inquiries">${data.inquiries.length ? data.inquiries.map(row => `<div><button class="text-button" data-inquiry="${h(row.id)}">${h(row.reference)} · ${h(row.name)}</button> ${badge(row.status)}</div>`).join('') : '<p class="small muted">尚未关联到已提交询盘。</p>'}</div></details>`;
    $('journey-all')?.addEventListener('click',()=>openJourney(id,'',fromRecords).catch(error=>showError(error.message)));
    const append = result => {
      if (run !== journeyGeneration || !$('timeline')) return;
      $('timeline').insertAdjacentHTML('beforeend',result.items.map(row => `<li data-event-id="${h(row.id)}"${row.id===focusEvent?' class="is-selected-event"':''}>${eventContent(row)}</li>`).join(''));
      $('more-events').hidden = !result.nextCursor;$('more-events').dataset.cursor = result.nextCursor || '';
    };
    append(data);
    $('more-events').addEventListener('click',async () => {
      const button = $('more-events');button.disabled = true;
      try {const nextQuery=new URLSearchParams(query);nextQuery.set('cursor',button.dataset.cursor);append(await api('/api/admin/visitors/'+encodeURIComponent(id)+'?'+nextQuery));}
      catch (error) {showError(error.message);} finally {if (button.isConnected) button.disabled = false;}
    });
  } catch (error) {if (run === journeyGeneration) $('detail-content').textContent = error.message;}
}

function metricCard(key,data) {
  const { current, previous, change } = data.metrics[key];
  const delta = change === null ? '' : `<span class="${change > 0 ? 'up' : change < 0 ? 'down' : ''}">${change > 0 ? '+' : ''}${number(change)}%</span>`;
  const value = ['messaging_clicks','contact_clicks'].includes(key)
    ? `<button type="button" class="metric-value metric-drill" data-record-kind="contact" aria-label="查看点击明细，${number(current)} 次" title="查看点击明细">${number(current)}${icon('external')}</button>`
    : `<div class="metric-value">${number(current)}</div>`;
  const definition = key === 'messaging_clicks' ? ' title="WhatsApp、邮箱和微信入口点击的合计"' : '';
  return `<article class="metric" data-metric="${key}"${definition}>
    <p class="metric-label">${icon(metricIcons[key])}${metricNames[key]}</p>
    ${value}<div class="metric-compare">${delta}<span>上期 ${number(previous)}</span></div>
  </article>`;
}
function panelHeading(name,title,action = '') {
  return `<div class="panel-heading"><div class="panel-title"><span class="icon-tile">${icon(name)}</span><h2>${title}</h2></div>${action}</div>`;
}
function emptyChart(name,text = '当前范围暂无数据') {
  return `<div class="chart-empty">${icon(name)}<p>${text}</p></div>`;
}
// Percentages use the full matching page-view total, including unshown rows.
function chartRows(rows,total,limit) {
  const selected = rows.filter(row => Number(row.views) > 0).slice(0,limit).map(row => ({...row,views:Number(row.views)}));
  const remaining = Math.max(0,total-selected.reduce((sum,row) => sum+row.views,0));
  if (remaining) selected.push({label:'其他 / 未显示',views:remaining});
  return selected;
}
function barTrack(value,total) {
  const width = Math.min(1000,value/Math.max(1,total)*1000);
  return `<svg class="bar-track" viewBox="0 0 1000 6" preserveAspectRatio="none" aria-hidden="true">
    <rect width="1000" height="6" fill="var(--series-track)"/><rect width="${width}" height="6" fill="var(--series-current)"/>
  </svg>`;
}
function renderCountries(rows,total) {
  const display = chartRows(rows,total,4);
  $('country-chart').innerHTML = panelHeading('globe','国家分布')+(display.length
    ? `<div class="bars-content">${display.map(row => {
      const name = country(row.label);
      const percentage = (row.views/Math.max(1,total)*100).toLocaleString('zh-CN',{maximumFractionDigits:1});
      return `<div class="bar-row"><div class="bar-label"><span title="${h(name)}">${h(name)}</span><strong>${number(row.views)}<small>${percentage}%</small></strong></div>${barTrack(row.views,total)}</div>`;
    }).join('')}</div>`
    : emptyChart('globe'));
}
function renderDevices(data) {
  const total = Number(data.metrics.page_views.current), rows = chartRows(data.devices,total,4);
  const heading = panelHeading('monitor','设备分布');
  if (!total || !rows.length) {
    $('device-chart').innerHTML = heading+emptyChart('monitor');
    return;
  }
  const circumference = 2*Math.PI*52;
  let offset = 0;
  const arcs = rows.map((row,index) => {
    const length = row.views/total*circumference;
    const result = `<circle cx="72" cy="72" r="52" fill="none" stroke="var(--series-${index+1})" stroke-width="12" stroke-dasharray="${length} ${circumference-length}" stroke-dashoffset="${-offset}"/>`;
    offset += length;
    return result;
  }).join('');
  const description = rows.map(row => `${label(row.label)} ${number(row.views)} 次浏览`).join('，');
  $('device-chart').innerHTML = heading+`<div class="donut-layout">
    <div class="donut-visual">
      <svg viewBox="0 0 144 144" role="img" aria-label="${h(description)}">${arcs}</svg>
      <div class="donut-total"><strong>${number(total)}</strong><span>页面浏览量</span></div>
    </div>
    <div class="device-legend">${rows.map((row,index) => `<div><span class="legend-dot legend-color-${index}"></span>
      <span class="device-name">${h(label(row.label))}</span>
      <strong>${number(row.views)}<small>${(row.views/total*100).toLocaleString('zh-CN',{maximumFractionDigits:1})}%</small></strong>
    </div>`).join('')}</div>
  </div>`;
}
function renderProducts(rows) {
  const models = ['CBB60','CBB61','CBB65','CD60'], values = models.map(model => Number(rows.find(row => row.label === model)?.views || 0));
  const max = Math.max(0,...values);
  const heading = panelHeading('box','产品查看');
  if (!max) {
    $('product-chart').innerHTML = heading+emptyChart('box');
    return;
  }
  const ceiling = Math.max(4,Math.ceil(max/4)*4);
  const grid = Array.from({length:5},(_,i) => {
    const y = 157-i/4*132;
    return `<line x1="34" x2="370" y1="${y}" y2="${y}" stroke="var(--chart-grid)"/><text x="26" y="${y+4}" text-anchor="end" fill="var(--axis)" font-size="11">${number(ceiling*i/4)}</text>`;
  }).join('');
  const bars = values.map((value,i) => {
    const x = 51+i*83, height = value/ceiling*132;
    return `<g><title>${models[i]}：${number(value)} 次产品查看</title>
      <rect x="${x}" y="${157-height}" width="41" height="${height}" rx="3" fill="var(--series-current)"/>
      <text x="${x+20.5}" y="${Math.max(16,148-height)}" text-anchor="middle" fill="var(--accent-ink)" font-size="13">${number(value)}</text>
      <text x="${x+20.5}" y="178" text-anchor="middle" fill="var(--axis)" font-size="12">${models[i]}</text>
    </g>`;
  }).join('');
  const description = models.map((model,i) => `${model} ${number(values[i])} 次产品查看`).join('，');
  $('product-chart').innerHTML = heading+`<div class="product-columns"><svg viewBox="0 0 390 186" role="img" aria-label="${h(description)}">${grid}${bars}</svg></div>`;
}
function renderContactActions(data) {
  const types = [['whatsapp_click','WhatsApp 点击','whatsapp'],['email_click','邮件点击','inbox'],['wechat_click','微信二维码点击','wechat'],['inquiry_click','询价入口点击','link']];
  const heading = panelHeading('link','联系入口点击记录','<button class="text-button" data-record-kind="contact">全部点击明细</button>');
  const recent = data.recentContacts || [];
  const counts = types.map(([type,title,name]) => {
    const value = (data.contactActions || []).find(row => row.label === type) || {actions:0,visitors:0};
    return `<article data-contact-type="${type}">
      <h3>${icon(name)}${title}</h3>
      <button class="contact-count text-button" data-record-kind="contact" data-contact-type="${type}" aria-label="查看${title}明细"><strong>${number(value.actions)}<span>次</span></strong></button>
      <p>${number(value.visitors)} 位去重访客</p>
    </article>`;
  }).join('');
  const table = recent.length
    ? `<div class="table-scroll"><table><thead><tr><th>时间（北京时间）</th><th>联系入口</th><th>页面 / 位置</th><th>国家</th><th>访客</th></tr></thead>
      <tbody>${recent.map(row => `<tr>
        <td>${h(date(row.occurred_at))}</td><td>${h(eventLabels[row.type] || row.type)}</td>
        <td>${h(row.page)}<span class="sub">${h(positionName(row.position))}</span></td>
        <td>${h(country(row.country))}</td>
        <td><button class="text-button" data-visitor="${h(row.visitor_id)}" data-event="${h(row.id)}">${h(row.visitor_id.slice(0,8))}… ${icon('route')}查看轨迹</button></td></tr>`).join('')}
      </tbody></table></div>`
    : '<div class="empty"><p>当前范围暂无点击记录。</p></div>';
  $('contact-actions').innerHTML = heading+`<div class="contact-action-metrics">${counts}</div>
    <details class="contact-records"><summary>最近点击记录${recent.length ? `（${recent.length} 条）` : ''}</summary>${table}</details>`;
}
function renderSources(data) {
  const rows = data.sourceDetails || [];
  const organic = data.organicSources || [];
  const total = Number(data.metrics.page_views.current);
  const heading = panelHeading('compass','具体访问来源','<button class="text-button" data-record-kind="source" aria-label="查看全部来源记录">全部来源</button>');
  const sourceRows = rows.slice(0,4).map(row => {
    const name = sourceName(row.source), channel = label(row.channel);
    return `<button class="source-record-link" data-record-kind="source" data-source="${h(row.source)}" data-channel="${h(row.channel)}">
      <span class="source-row-text"><span><strong>${h(name)}</strong>${channel === name ? '' : `<small>${h(channel)}</small>`}</span>
      <span class="source-number"><strong>${number(row.views)} 浏览</strong><small>${number(row.visits)} 次访问</small></span></span>
      ${barTrack(Number(row.views),total)}
    </button>`;
  }).join('');
  const organicRows = organic.slice(0,4).map(row => `<button class="organic-source-link" data-record-kind="source" data-source="${h(row.source)}" data-channel="organic_search" title="${h(row.source)}"><span>${h(sourceName(row.source))}</span><strong>${number(row.visits)} 次访问</strong></button>`).join('');
  $('source-chart').innerHTML = heading+`<div class="specific-sources">${sourceRows||'<p class="muted">当前范围暂无来源记录。</p>'}</div>
    <section class="organic-sources">
      <div class="organic-heading"><h3>自然搜索</h3><button class="text-button" data-record-kind="source" data-channel="organic_search">查看明细</button></div>
      <div class="organic-source-list">${organicRows||'<p class="small muted">暂无自然搜索记录。</p>'}</div>
    </section>`;
}

async function openRecords(options) {
  if(options || !recordsContext) {
    recordsContext=new URLSearchParams(params());
    for(const [key,value]of Object.entries(options||{kind:'source'}))if(value)recordsContext.set(key,value);
    recordsPage=1;
  }
  const kind=recordsContext.get('kind'),isContact=kind==='contact';
  $('records-title').textContent=isContact?'联系点击明细':'访问来源明细';
  const select=(name,values,all)=>`<select name="${name}"><option value="">${all}</option>${values.map(value=>`<option value="${h(value)}"${recordsContext.get(name)===value?' selected':''}>${h(label(value))}</option>`).join('')}</select>`;
  $('records-controls').innerHTML=`<p class="small muted">${h(recordsContext.get('from'))} — ${h(recordsContext.get('to'))} · 北京时间 · ${isContact?'一条记录对应一次点击。':'一条记录对应一次访问，同一访客可有多次访问。'}</p><form id="record-filters" class="record-filters"><label>渠道${select('channel',['organic_search','paid_search','social','email','referral','campaign','display','direct_or_unknown'],'全部渠道')}</label><label>具体来源<input name="source" value="${h(recordsContext.get('source'))}" placeholder="如 www.google.com"></label>${isContact?`<label>联系入口<select name="contact_type"><option value="">全部入口</option>${['whatsapp_click','email_click','wechat_click','inquiry_click'].map(type=>`<option value="${type}"${recordsContext.get('contact_type')===type?' selected':''}>${eventLabels[type]}</option>`).join('')}</select></label><label>页面路径<input name="event_page" value="${h(recordsContext.get('event_page'))}" placeholder="如 /contact/"></label><label>入口位置<select name="position" id="record-position"><option value="">全部位置</option></select></label>`:''}<button class="button secondary" type="submit">应用筛选</button></form>${!isContact?'<p class="record-help">引荐网址显示浏览器提供的域名和路径。</p>':''}`;
  $('record-filters').addEventListener('submit',event=>{
    event.preventDefault();
    for(const [key,value]of new FormData(event.currentTarget)){if(String(value).trim())recordsContext.set(key,String(value).trim());else recordsContext.delete(key);}
    recordsPage=1;loadRecords().catch(error=>showError(error.message));
  });
  if(!$('records-dialog').open)$('records-dialog').showModal();
  await loadRecords();
}
async function loadRecords() {
  const run=++recordsGeneration,query=new URLSearchParams(recordsContext);query.set('page',String(recordsPage));
  $('records-list').innerHTML='<p class="record-loading" role="status">正在加载记录…</p>';$('records-pagination').replaceChildren();
  try{
    const data=await api('/api/admin/records?'+query);
    if(run!==recordsGeneration||!$('records-dialog').open)return;
    const contact=data.kind==='contact';
    const positions=$('record-position');
    if (positions) {
      const selected=recordsContext.get('position')||'';
      positions.replaceChildren(new Option('全部位置',''));
      for (const value of new Set([...(data.positions||[]),...(selected?[selected]:[])])) positions.add(new Option(positionName(value),value));
      positions.value=selected;
    }
    $('records-summary').textContent=`${number(data.total)} ${contact?'次点击':'次访问'} · ${number(data.summary.visitors)} 位去重访客${contact?'':` · ${number(data.summary.page_views)} 次页面浏览`}`;
    $('records-list').innerHTML=data.items.map(row=>`<article class="attribution-record"><div class="record-top"><h3>${icon(contact?({whatsapp_click:'whatsapp',email_click:'inbox',wechat_click:'wechat'}[row.type]||'link'):'compass')}${h(contact?eventLabels[row.type]:sourceName(row.source))}</h3><time>${h(date(row.occurred_at))}</time></div>${contact?`<p class="record-page">${h(row.page)}</p><p>${h(positionName(row.position))}</p>`:`<p>范围内首次 ${h(date(row.first_seen))} · ${number(row.page_views)} 次浏览 · ${number(row.events)} 次操作</p>`}<details class="record-attribution"${contact?'':' open'}><summary>来源与落地页</summary>${attributionText(row)}</details><div class="record-bottom"><p>${h(locationText(row))} · ${h(browserLanguage(row.browser_language))}</p><button class="text-button" data-visitor="${h(row.visitor_id)}" data-event="${h(row.id)}">${icon('route')}匿名 ${h(row.visitor_id.slice(0,8))}… · 查看访客轨迹</button></div></article>`).join('')||'<div class="empty"><p>当前条件下暂无记录。</p></div>';
    paginate('records-pagination',data,page=>{recordsPage=page;loadRecords().catch(error=>showError(error.message));$('records-list').scrollIntoView({block:'start'});});
  }catch(error){if(run===recordsGeneration)$('records-list').innerHTML=`<p class="error">${h(error.message)}</p>`;}
}
function renderOverview(data) {
  $('overview-empty').hidden = data.metrics.visitors.current > 0 || data.metrics.inquiries.current > 0;
  $('metrics').innerHTML = ['visitors','page_views','inquiries','messaging_clicks'].map(key => metricCard(key,data)).join('');
  $('secondary-metrics').innerHTML = ['visits','returning_visitors','contact_clicks','form_starters'].map(key => metricCard(key,data)).join('');
  const totalViews = Number(data.metrics.page_views.current);
  renderSources(data);
  renderCountries(data.countries,totalViews);
  renderProducts(data.products);
  renderDevices(data);
  renderContactActions(data);
  const blocks = [['关注页面',data.pages,'页面'],['产品关注',data.products,'产品'],['访问国家',data.countries,'国家'],['访问来源',data.sources,'来源'],['渠道分布',data.channels,'渠道'],['设备分布',data.devices,'设备']];
  $('breakdowns').innerHTML = blocks.map(([title,rows,first]) => `<section class="panel"><div class="panel-heading"><h2>${title}</h2></div>${rows.length ? `<div class="table-scroll"><table><thead><tr><th>${first}</th><th>${first === '产品' ? '产品查看' : '浏览量'}</th><th>询盘</th></tr></thead><tbody>${rows.map(row => `<tr><td>${h(first === '国家' ? country(row.label) : label(row.label))}</td><td>${number(row.views)}</td><td>${number(row.inquiries)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty"><p>暂无数据</p></div>'}</section>`).join('');
  renderChart();
}
function renderChart() {
  renderTrendChart(overviewData,emptyChart('trend','本期与对比周期均暂无此项记录'));
}
