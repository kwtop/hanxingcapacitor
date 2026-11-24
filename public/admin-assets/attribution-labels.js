export function sourceName(source) {
  const value = String(source || '').toLowerCase();
  const engines = [['Google',/^(?:google|(?:[^.]+\.)*google\.(?:com|cat|[a-z]{2}|(?:com|co)\.[a-z]{2}))$/],['Bing',/^(?:bing|(?:[^.]+\.)*bing\.com)$/],['DuckDuckGo',/^(?:duckduckgo|(?:[^.]+\.)*duckduckgo\.com)$/],['Yahoo',/^(?:yahoo|(?:[^.]+\.)*yahoo\.(?:com|[a-z]{2}|(?:com|co)\.[a-z]{2}))$/],['百度',/^(?:baidu|(?:[^.]+\.)*baidu\.com)$/],['Yandex',/^(?:yandex|(?:[^.]+\.)*yandex\.(?:com|[a-z]{2}|com\.tr))$/],['Ecosia',/^(?:ecosia|(?:[^.]+\.)*ecosia\.org)$/],['Brave Search',/^search\.brave\.com$/],['搜狗',/^(?:[^.]+\.)*sogou\.com$/],['360 搜索',/^(?:[^.]+\.)*so\.com$/],['Naver',/^search\.naver\.com$/]];
  return engines.find(([,pattern]) => pattern.test(value))?.[0] || (value === 'direct_or_unknown' ? '直接 / 未识别' : source || '未知');
}

export function positionName(value) {
  const names = {navigation:'顶部导航',footer:'页脚',hero:'首屏',page:'页面',contact_form:'联系表单区',main:'正文',inquiry_callout:'询价区',product_gallery:'产品图库',specifications:'规格区', 'home-inquiry':'首页询价区', 'closing-inquiry':'页尾询价区',about_wechat_qr:'关于我们 · 微信二维码',contact_wechat_qr:'联系页 · 微信二维码',about_whatsapp_chat:'关于我们 · WhatsApp 聊天',contact_whatsapp_chat:'联系页 · WhatsApp 聊天',about_whatsapp_qr:'关于我们 · WhatsApp 二维码',contact_whatsapp_qr:'联系页 · WhatsApp 二维码',about_whatsapp_qr_chat:'关于我们 · 二维码弹窗聊天按钮',contact_whatsapp_qr_chat:'联系页 · 二维码弹窗聊天按钮',unknown:'位置未记录'};
  if (names[value]) return names[value];
  const match = String(value || '').match(/^(.*)_(whatsapp|email|wechat)_(\d+)$/);
  if (match) return `${names[match[1]] || match[1]} · ${{whatsapp:'WhatsApp',email:'邮箱',wechat:'微信'}[match[2]]}入口 ${match[3]}`;
  return value || '位置未记录';
}
