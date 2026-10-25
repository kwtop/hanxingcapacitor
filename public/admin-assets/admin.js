const $=id=>document.getElementById(id);
const h=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const statusLabels={pending:'待处理',following:'跟进中',completed:'已完成',spam:'垃圾询盘'};
const eventLabels={page_view:'访问页面',product_view:'查看产品',spec_expand:'展开参数',image_view:'查看图片',download_click:'点击资料下载',inquiry_click:'点击询价',whatsapp_click:'点击 WhatsApp',email_click:'点击邮箱',form_start:'开始填写表单',form_failure:'提交失败',inquiry_success:'询盘保存成功'};
const labels={unknown:'未知',direct_or_unknown:'直接 / 未识别',organic_search:'自然搜索',paid_search:'付费搜索',social:'社交媒体',email:'邮件',referral:'外部引荐',campaign:'推广活动',display:'展示广告',desktop:'电脑',mobile:'手机',tablet:'平板',en:'英语',es:'西班牙语',ar:'阿拉伯语'};
const label=value=>labels[value]||value||'未知';
const date=value=>value?new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(Number(value)):'未知';
const number=value=>Number(value||0).toLocaleString('zh-CN');
const country=value=>value&&/^[A-Z]{2}$/.test(value)?new Intl.DisplayNames(['zh-CN'],{type:'region'}).of(value):label(value);
const badge=status=>`<span class="badge status-${h(status)}">${h(statusLabels[status]||'未知')}</span>`;
let csrf='',view='inquiries',inquiryPage=1,visitorPage=1,generation=0,currentDetail=null,overviewData=null;
function showError(message){const node=$('error')||$('login-error');node.textContent=message;node.hidden=false;}
async function api(path,options={}){
  const target=new URL(path,location.origin);if(!target.pathname.endsWith('/'))target.pathname+='/';path=target.pathname+target.search;
  const headers=new Headers(options.headers||{});
  if(options.body){headers.set('Content-Type','application/json');headers.set('X-CSRF-Token',csrf);}
  const response=await fetch(path,{...options,headers,body:options.body?JSON.stringify(options.body):undefined,credentials:'same-origin',signal:AbortSignal.timeout(25000)});
  const data=await response.json().catch(()=>({error:'服务返回了无法读取的内容。'}));
  if(!response.ok){if(response.status===401&&document.body.dataset.authenticated==='true')location.assign('/admin/');throw new Error(data.error||'操作失败，请稍后重试。');}
  return data;
}
if(document.body.dataset.authenticated!=='true'){
  $('login-form')?.addEventListener('submit',async event=>{
    event.preventDefault();const button=event.currentTarget.querySelector('button');button.disabled=true;$('login-error').textContent='';
    try{const fields=new FormData(event.currentTarget);await api('/api/admin/login',{method:'POST',body:{email:fields.get('email'),password:fields.get('password')}});location.assign('/admin/');}
    catch(error){showError(error.message);}finally{button.disabled=false;}
  });
}else{
  init().catch(error=>showError(error.message));
}
async function init(){
  const user=await api('/api/admin/me');csrf=user.csrf;
  const today=new Date(Date.now()+8*3600000).toISOString().slice(0,10),from=new Date(Date.parse(today)-6*86400000).toISOString().slice(0,10),query=new URLSearchParams(location.search);
  for(const [key,value]of [['from',from],['to',today]])$('filters').elements.namedItem(key).value=query.get(key)||value;
  for(const key of ['source','country','product','language']){const value=query.get(key);if(!value)continue;const node=$('filters').elements.namedItem(key);if(node.tagName==='SELECT'&&![...node.options].some(option=>option.value===value))node.add(new Option(label(value),value));node.value=value;}
  $('filters').elements.namedItem('include_internal').checked=query.get('include_internal')==='1';
  document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>switchView(button.dataset.view)));
  $('filters').addEventListener('submit',event=>{event.preventDefault();inquiryPage=visitorPage=1;load().catch(error=>showError(error.message));});
  $('refresh').addEventListener('click',()=>load().catch(error=>showError(error.message)));
  $('search-inquiries').addEventListener('click',()=>{inquiryPage=1;load().catch(error=>showError(error.message));});
  $('search-visitors').addEventListener('click',()=>{visitorPage=1;load().catch(error=>showError(error.message));});
  for(const key of ['inquiry-status','unread-only'])$(key).addEventListener('change',()=>{inquiryPage=1;load().catch(error=>showError(error.message));});
  for(const key of ['inquiry-search','visitor-search'])$(key).addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();$(key==='inquiry-search'?'search-inquiries':'search-visitors').click();}});
  $('export').addEventListener('click',exportCsv);
  $('close-detail').addEventListener('click',()=>$('detail-dialog').close());
  $('detail-dialog').addEventListener('click',event=>{if(event.target===$('detail-dialog'))$('detail-dialog').close();});
  $('logout').addEventListener('click',async()=>{try{const result=await api('/api/admin/logout',{method:'POST',body:{}});location.assign(result.accessLogout||'/admin/');}catch(error){showError(error.message);}});
  document.addEventListener('click',event=>{const inquiry=event.target.closest('[data-inquiry]'),visitor=event.target.closest('[data-visitor]');if(inquiry)openInquiry(inquiry.dataset.inquiry).catch(error=>showError(error.message));else if(visitor)openJourney(visitor.dataset.visitor).catch(error=>showError(error.message));});
  $('trend-metric').addEventListener('change',()=>renderChart());
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(view==='overview')renderChart();},150);});
  await switchView(['inquiries','overview','visitors'].includes(query.get('view'))?query.get('view'):'inquiries');
}
function params(){const result=new URLSearchParams(new FormData($('filters')));for(const [key,value]of [...result])if(!value)result.delete(key);return result;}
function inboxParams(){const result=params();if($('inquiry-search').value.trim())result.set('q',$('inquiry-search').value.trim());if($('inquiry-status').value)result.set('status',$('inquiry-status').value);if($('unread-only').checked)result.set('unread','1');result.set('page',String(inquiryPage));return result;}
async function switchView(next){
  view=next;const titles={inquiries:['询盘管理','查看客户需求，记录跟进进展。'],overview:['访问概览','了解访问来源、产品关注与实际询盘。'],visitors:['访客轨迹','查看匿名访客的关键操作与关联询盘。']};
  $('view-title').textContent=titles[view][0];$('view-description').textContent=titles[view][1];
  for(const key of ['inquiries','overview','visitors'])$(key+'-view').hidden=key!==view;
  document.querySelectorAll('[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===view));
  $('filter-help').textContent=`日期按北京时间（UTC+8）计算，最多查询 93 天。${view==='inquiries'?'国家筛选对应客户填写的国家。':'国家来自 Cloudflare 地理信息，不可获取时为未知。'}`;
  await load();
}
async function load(){
  const run=++generation;$('error').hidden=true;$('notice').hidden=true;$('refresh').disabled=true;
  const query=params();history.replaceState(null,'','/admin/?'+new URLSearchParams([...query,['view',view]]));
  try{
    if(view==='inquiries'){const data=await api('/api/admin/inquiries?'+inboxParams());if(run===generation)renderInquiries(data);}
    if(view==='overview'){const data=await api('/api/admin/overview?'+query);if(run===generation){overviewData=data;renderOverview(data);}}
    if(view==='visitors'){query.set('page',String(visitorPage));if($('visitor-search').value.trim())query.set('q',$('visitor-search').value.trim());const data=await api('/api/admin/visitors?'+query);if(run===generation)renderVisitors(data);}
    if(run===generation){const options=await api('/api/admin/facets?'+params());if(run===generation){renderFacets(options);if($('filters').elements.namedItem('include_internal').checked){$('notice').textContent='当前包含内部测试记录。这些记录默认不计入网站访问与询盘统计。';$('notice').hidden=false;}}}
  }finally{if(run===generation)$('refresh').disabled=false;}
}
function renderFacets(data){
  for(const [name,values]of [['source',data.sources],['language',data.languages]]){const input=$('filters').elements.namedItem(name),selected=input.value;input.replaceChildren(new Option(name==='source'?'全部来源':'全部语言',''));for(const value of new Set([...values,...(selected?[selected]:[])]))input.add(new Option(label(value),value));input.value=selected;}
  $('country-options').innerHTML=(view==='inquiries'?data.inquiryCountries:data.countries).map(value=>`<option value="${h(value)}">${h(country(value))}</option>`).join('');
}
function paginate(id,data,onChange){
  const node=$(id),pages=Math.max(1,Math.ceil(data.total/data.pageSize));node.replaceChildren();const text=document.createElement('span');text.textContent=`共 ${number(data.total)} 条 · 第 ${data.page} / ${pages} 页`;node.append(text);
  for(const [title,next]of [['上一页',data.page-1],['下一页',data.page+1]]){const button=document.createElement('button');button.className='button secondary';button.textContent=title;button.disabled=next<1||next>pages;button.addEventListener('click',()=>onChange(next));node.append(button);}
}
function renderInquiries(data){
  $('inquiry-count').textContent=`${number(data.total)} 条 · ${number(data.unread)} 条未读`;$('inquiry-empty').hidden=data.items.length>0;
  $('inquiries-body').innerHTML=data.items.map(row=>`<tr><td><strong>${row.read_at?'':'<span class="unread-dot" aria-label="未读"></span>'}${h(row.name)}</strong><span class="sub">${h(row.company||'公司未知')}</span><span class="sub">${h(row.reference)}${row.is_internal?' · 内部测试':''}</span></td><td><span class="email">${h(row.email)}</span><span class="sub">${h(row.phone||'电话未知')}</span></td><td>${h(row.country)}<span class="sub">${h(JSON.parse(row.products).map(label).join(' / '))}</span></td><td>${h(date(row.created_at))}<span class="sub">${h(label(row.source))} · ${h(label(row.language))}</span></td><td>${badge(row.status)}</td><td><button class="text-button" data-inquiry="${h(row.id)}">查看详情</button></td></tr>`).join('');
  paginate('inquiries-pagination',data,page=>{inquiryPage=page;load().catch(error=>showError(error.message));});
}
async function exportCsv(){
  $('export').disabled=true;
  try{const response=await fetch('/api/admin/inquiries/export/?'+inboxParams(),{credentials:'same-origin',signal:AbortSignal.timeout(30000)});if(!response.ok){const error=await response.json();throw new Error(error.error||'导出失败。');}const url=URL.createObjectURL(await response.blob()),link=document.createElement('a');link.href=url;link.download=`韩兴询盘-${new Date().toISOString().slice(0,10)}.csv`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  catch(error){showError(error.message);}finally{$('export').disabled=false;}
}
function openDialog(title){$('detail-title').textContent=title;$('detail-content').textContent='正在加载…';if(!$('detail-dialog').open)$('detail-dialog').showModal();}
async function openInquiry(id){
  openDialog('询盘详情');const data=await api('/api/admin/inquiries/'+encodeURIComponent(id));
  if(!data.read_at){const result=await api('/api/admin/inquiries/'+id,{method:'PATCH',body:{read:true,version:data.version}});data.read_at=result.read_at;data.version=result.version;if(view==='inquiries')load().catch(error=>showError(error.message));}
  currentDetail=data;renderInquiry(data);
}
function renderInquiry(data){
  $('detail-title').textContent=data.reference;
  const pairs=[['姓名',data.name],['公司',data.company||'未知'],['邮箱',data.email],['电话',data.phone||'未知'],['客户国家',data.country],['感兴趣的产品',JSON.parse(data.products).map(label).join(' / ')],['提交页面',data.submission_page],['来源页面',data.source_page],['网站语言',label(data.language)],['访问来源',label(data.source)],['渠道',label(data.channel)],['匿名访客',data.visitor_id||'未知']];
  $('detail-content').innerHTML=`<div class="detail-meta"><span>${h(date(data.created_at))} 提交</span><span>${h(data.is_internal?'内部测试记录':'网站询盘')}</span></div><div class="detail-actions"><label>状态 <select id="detail-status">${Object.entries(statusLabels).map(([key,text])=>`<option value="${key}" ${key===data.status?'selected':''}>${text}</option>`).join('')}</select></label><button class="button secondary" id="toggle-read">${data.read_at?'标记为未读':'标记为已读'}</button>${data.visitor_id?`<button class="button secondary" data-visitor="${h(data.visitor_id)}">查看访客轨迹</button>`:''}</div><dl class="detail-grid">${pairs.map(([key,value])=>`<div><dt>${key}</dt><dd>${h(value)}</dd></div>`).join('')}</dl><section class="detail-section"><h3>客户需求</h3><p class="pre-wrap">${h(data.message)}</p>${data.context?`<p class="small muted pre-wrap">${h(data.context)}</p>`:''}</section><section class="detail-section"><h3>跟进备注</h3><form id="note-form" class="note-form"><label class="sr-only" for="note-text">添加跟进备注</label><textarea id="note-text" rows="3" maxlength="2000" placeholder="记录联系结果和下一步安排" required></textarea><button class="button" type="submit">添加备注</button></form><p id="detail-feedback" role="status" class="small"></p><div id="notes">${data.notes.length?data.notes.map(note=>`<article class="note-item"><span class="small muted">${h(date(note.created_at))} · ${h(note.author)}</span><p>${h(note.note)}</p></article>`).join(''):'<p class="small muted">暂无跟进备注。</p>'}</div></section>`;
  const update=async body=>{try{const result=await api('/api/admin/inquiries/'+data.id,{method:'PATCH',body:{...body,version:currentDetail.version}});Object.assign(currentDetail,result);$('detail-feedback').textContent='已保存。';$('toggle-read').textContent=result.read_at?'标记为未读':'标记为已读';if(view==='inquiries')await load();}catch(error){$('detail-feedback').textContent=error.message;}};
  $('detail-status').addEventListener('change',event=>update({status:event.target.value}));
  $('toggle-read').addEventListener('click',()=>update({read:!currentDetail.read_at}));
  $('note-form').addEventListener('submit',async event=>{event.preventDefault();const button=event.currentTarget.querySelector('button');button.disabled=true;try{await api('/api/admin/inquiries/'+data.id+'/notes',{method:'POST',body:{note:$('note-text').value}});const refreshed=await api('/api/admin/inquiries/'+data.id);currentDetail=refreshed;renderInquiry(refreshed);$('detail-feedback').textContent='备注已保存。';}catch(error){$('detail-feedback').textContent=error.message;button.disabled=false;}});
}
function renderVisitors(data){
  $('visitor-count').textContent=number(data.total)+' 位';$('visitor-empty').hidden=data.items.length>0;
  $('visitors-body').innerHTML=data.items.map(row=>`<tr><td><strong>${h(row.visitor_id.slice(0,8))}…</strong><span class="sub">${h(label(row.source))}</span></td><td>${h(date(row.last_seen))}<span class="sub">首次：${h(date(row.first_seen))}</span></td><td>${h(country(row.country))}<span class="sub">${h(label(row.device))}</span></td><td>${number(row.visits)} 次访问<span class="sub">${number(row.events)} 次操作</span></td><td>${number(row.inquiries)}</td><td><button class="text-button" data-visitor="${h(row.visitor_id)}">查看轨迹</button></td></tr>`).join('');
  paginate('visitors-pagination',data,page=>{visitorPage=page;load().catch(error=>showError(error.message));});
}
async function openJourney(id){
  openDialog('访客轨迹');const data=await api('/api/admin/visitors/'+encodeURIComponent(id));
  $('detail-content').innerHTML=`<p class="small muted">匿名编号：${h(id)}</p><div class="detail-meta"><span>首次记录 ${h(date(data.visitor.first_seen))}</span><span>最近记录 ${h(date(data.visitor.last_seen))}</span></div><section class="detail-section"><h3>关联询盘</h3><div class="related-inquiries">${data.inquiries.length?data.inquiries.map(row=>`<div><button class="text-button" data-inquiry="${h(row.id)}">${h(row.reference)} · ${h(row.name)}</button> ${badge(row.status)}</div>`).join(''):'<p class="small muted">尚未关联到已提交询盘。</p>'}</div></section><section class="detail-section"><h3>访问过程</h3><p class="small muted">按时间顺序展示，包括内部测试记录。仅列出已成功记录的关键操作。</p><ol class="timeline" id="timeline"></ol><button class="button secondary" id="more-events" hidden>加载更多记录</button></section>`;
  const append=result=>{$('timeline').insertAdjacentHTML('beforeend',result.items.map(row=>`<li><div class="event-line"><strong>${h(eventLabels[row.type]||row.type)}${row.product!=='unknown'?' · '+h(row.product):''}</strong><time>${h(date(row.occurred_at))}</time></div><p>${h(row.page)}</p><p>${h(label(row.source))} · ${h(country(row.country))} · ${h(label(row.device))} · ${h(label(row.language))} · 位置：${h(row.position)}${row.is_internal?' · 内部测试':''}</p>${row.target?`<p>目标：${h(row.target)}</p>`:''}${row.inquiry_id?`<button class="text-button small" data-inquiry="${h(row.inquiry_id)}">查看对应询盘</button>`:''}</li>`).join(''));$('more-events').hidden=!result.nextCursor;$('more-events').dataset.cursor=result.nextCursor||'';};
  append(data);$('more-events').addEventListener('click',async()=>{const button=$('more-events');button.disabled=true;try{append(await api('/api/admin/visitors/'+encodeURIComponent(id)+'?cursor='+encodeURIComponent(button.dataset.cursor)));}catch(error){showError(error.message);}finally{button.disabled=false;}});
}
function renderOverview(data){
  let empty=$('overview-empty');if(!empty){empty=document.createElement('div');empty.id='overview-empty';empty.className='notice';empty.setAttribute('role','status');empty.textContent='当前筛选范围暂无已记录的访问或有效询盘。';$('metrics').before(empty);}empty.hidden=data.metrics.visitors.current>0||data.metrics.inquiries.current>0;
  const names={visitors:'访客数',visits:'访问次数',page_views:'页面浏览量',returning_visitors:'回访访客',contact_clicks:'联系按钮点击',form_starters:'开始填写人数',inquiries:'成功询盘',conversion_rate:'询盘访客转化率'};
  $('metrics').innerHTML=Object.entries(names).map(([key,title])=>{const value=data.metrics[key],change=value.change===null?(value.current?'新增':'—'):`${value.change>0?'+':''}${value.change}%`;return `<article class="metric"><p class="metric-label">${title}</p><div class="metric-value">${number(value.current)}${key==='conversion_rate'?'%':''}</div><span class="metric-compare">较上周期 <span class="${value.change>0?'up':value.change<0?'down':''}">${h(change)}</span> · 上期 ${number(value.previous)}${key==='conversion_rate'?'%':''}</span></article>`;}).join('');
  $('comparison-period').textContent=`${data.period.from} — ${data.period.to}，对比 ${data.period.previousFrom} — ${data.period.previousTo}`;
  const blocks=[['关注页面',data.pages,'页面'],['产品关注',data.products,'产品'],['访问国家',data.countries,'国家'],['访问来源',data.sources,'来源'],['渠道分布',data.channels,'渠道'],['设备分布',data.devices,'设备']];
  $('breakdowns').innerHTML=blocks.map(([title,rows,first])=>`<section class="panel"><div class="panel-heading"><h2>${title}</h2></div>${rows.length?`<div class="table-scroll"><table><thead><tr><th>${first}</th><th>${first==='产品'?'产品查看':'浏览量'}</th><th>询盘</th></tr></thead><tbody>${rows.map(row=>`<tr><td>${h(first==='国家'?country(row.label):label(row.label))}</td><td>${number(row.views)}</td><td>${number(row.inquiries)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty"><p>暂无数据</p></div>'}</section>`).join('');renderChart();
}
function renderChart(){
  if(!overviewData||!$('trend-chart'))return;
  const metric=$('trend-metric').value,points=overviewData.trend,node=$('trend-chart'),width=Math.max(310,node.clientWidth-28),height=245,left=35,right=16,top=22,bottom=40;
  const max=Math.max(1,...points.flatMap(point=>[Number(point.current[metric]||0),Number(point.previous[metric]||0)])),ceiling=Math.max(1,Math.ceil(max/4)*4),plotWidth=width-left-right,plotHeight=height-top-bottom;
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.setAttribute('aria-hidden','true');
  const draw=(name,attrs,text)=>{const element=document.createElementNS(ns,name);for(const[key,value]of Object.entries(attrs))element.setAttribute(key,String(value));if(text!==undefined)element.textContent=text;svg.append(element);return element;};
  for(let tick=0;tick<=4;tick++){const y=top+plotHeight-tick/4*plotHeight;draw('line',{x1:left,x2:width-right,y1:y,y2:y,stroke:'#edf0f4'});draw('text',{x:left-8,y:y+4,'font-size':11,'text-anchor':'end',fill:'#98a1ae'},number(ceiling*tick/4));}
  const x=index=>left+(points.length===1?plotWidth/2:index/(points.length-1)*plotWidth),y=value=>top+plotHeight-Number(value||0)/ceiling*plotHeight;
  for(const [period,color]of [['previous','#b6c0ce'],['current','#2b3d56']]){draw('polyline',{points:points.map((point,index)=>`${x(index)},${y(point[period][metric])}`).join(' '),fill:'none',stroke:color,'stroke-width':2,...(period==='previous'?{'stroke-dasharray':'5 4'}:{})});points.forEach((point,index)=>{const circle=draw('circle',{cx:x(index),cy:y(point[period][metric]),r:period==='current'?3:2,fill:color});const title=document.createElementNS(ns,'title');title.textContent=`${period==='current'?point.date:point.previousDate}：${number(point[period][metric])}`;circle.append(title);});}
  const tickCount=width<500?3:Math.min(7,points.length);for(let tick=0;tick<tickCount;tick++){const index=tickCount===1?0:Math.round(tick/(tickCount-1)*(points.length-1));draw('text',{x:x(index),y:height-13,'text-anchor':'middle','font-size':11,fill:'#98a1ae'},points[index].date.slice(5));}
  node.replaceChildren(svg);node.setAttribute('aria-label',`${$('trend-metric').selectedOptions[0].textContent}趋势；本周期${number(overviewData.metrics[metric].current)}，上周期${number(overviewData.metrics[metric].previous)}。`);
}
