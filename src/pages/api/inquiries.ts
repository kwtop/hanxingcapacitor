import type { APIRoute } from 'astro';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import nodemailer from 'nodemailer';

export const prerender = false;
const MAX_TOTAL = 22 * 1024 * 1024;
const MAX_FILE = 5 * 1024 * 1024;
const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp']);
const field = (form: FormData, key: string, max = 1000) => String(form.get(key) ?? '').trim().slice(0, max);
const env = (key: string) => process.env[key] || (import.meta.env as Record<string,string|undefined>)[key] || '';
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100) || 'attachment';

export const POST: APIRoute = async ({ request }) => {
  if (env('ENABLE_ONLINE_INQUIRIES') !== 'true') return json({ error: 'Online submissions are disabled. Prepare an email or WhatsApp draft on the contact page.' }, 410);
  if (Number(request.headers.get('content-length') || 0) > MAX_TOTAL) return json({ error: 'Request exceeds the 22 MB upload limit.' }, 413);
  let form: FormData;
  try { form = await request.formData(); } catch { return json({ error: 'Unable to read the form.' }, 400); }
  if (field(form, 'website')) return json({ error: 'Unable to process this request.' }, 400);
  const name = field(form, 'name', 120);
  const email = field(form, 'email', 200);
  const company = field(form, 'company', 160);
  const country = field(form, 'country', 100);
  const message = field(form, 'message', 4000);
  const phone = field(form, 'phone', 80);
  const quantity = field(form, 'quantity', 80);
  const application = field(form, 'application', 120);
  const destination = field(form, 'destination', 120);
  const documents = field(form, 'documents', 500);
  const context = field(form, 'context', 200);
  if (!name || !company || !email || !country || !message) return json({ error: 'Complete the required contact and project fields.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Enter a valid email address.' }, 400);
  let specifications: unknown;
  try { specifications = JSON.parse(field(form, 'specifications', 12000)); } catch { return json({ error: 'Add at least one product requirement.' }, 400); }
  if (!Array.isArray(specifications) || specifications.length < 1 || specifications.length > 5) return json({ error: 'Add between one and five product requirements.' }, 400);
  const specs = specifications.map((raw) => {
    if (!raw || typeof raw !== 'object') return null;
    const record = raw as Record<string, unknown>;
    const get = (key: string) => String(record[key] ?? '').trim().slice(0, 200);
    return { series: get('series'), function: get('function'), capacitance: get('capacitance'), voltage: get('voltage'), dimensions: get('dimensions'), terminals: get('terminals'), notes: get('notes') };
  });
  if (specs.some(s => !s || (!s.series && !s.capacitance && !s.notes))) return json({ error: 'Each product requirement needs a series, capacitance or useful description.' }, 400);
  const uploads = form.getAll('attachments').filter((item): item is File => item instanceof File && item.size > 0);
  if (uploads.length > 4 || uploads.some(file => file.size > MAX_FILE || !allowedTypes.has(file.type))) return json({ error: 'Attach up to four PDF, JPG, PNG or WebP files, 5 MB each.' }, 400);
  const isPreview = import.meta.env.DEV;
  const storageRoot = isPreview ? (env('INQUIRY_STORE_DIR') || join(process.cwd(), '.local-inquiries')) : env('INQUIRY_STORE_DIR');
  const notifyEmail = env('SALES_NOTIFY_EMAIL');
  const smtpHost = env('SMTP_HOST');
  const smtpPort = Number(env('SMTP_PORT') || 587);
  const smtpUser = env('SMTP_USER');
  const smtpPassword = env('SMTP_PASSWORD');
  const smtpFrom = env('SMTP_FROM');
  if (!storageRoot || (!isPreview && (!notifyEmail || !smtpHost || !smtpUser || !smtpPassword || !smtpFrom))) return json({ error: 'Online inquiry delivery is not configured. Please use the contact options instead.' }, 503);
  const id = `HX-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${randomUUID().slice(0,8).toUpperCase()}`;
  const dir = join(storageRoot, id);
  const attachmentInfo: { name: string; type: string; size: number; storedAs: string }[] = [];
  try {
    await mkdir(dir, { recursive: true });
    for (let i=0;i<uploads.length;i++) {
      const file=uploads[i]; const storedAs=`${i+1}-${safeName(file.name)}`;
      await writeFile(join(dir, storedAs), Buffer.from(await file.arrayBuffer()), { flag: 'wx' });
      attachmentInfo.push({ name:file.name.slice(0,100), type:file.type, size:file.size, storedAs });
    }
    const record = { id, receivedAt:new Date().toISOString(), status:isPreview?'local_preview':'stored', contact:{name,email,company,country,phone}, project:{quantity,application,destination,documents,message,context}, specifications:specs, attachments:attachmentInfo };
    await writeFile(join(dir,'inquiry.json'),JSON.stringify(record,null,2),{flag:'wx'});
  } catch { return json({ error: 'The inquiry could not be saved. Please retry.' }, 500); }
  if (isPreview) return json({ id, status:'local_preview', message:'Saved in the local preview only. No sales email was sent.' }, 201);
  try {
    const transport = nodemailer.createTransport({ host:smtpHost, port:smtpPort, secure:smtpPort===465, auth:{user:smtpUser,pass:smtpPassword} });
    const summary = [`Reference: ${id}`,`Name: ${name}`,`Company: ${company}`,`Email: ${email}`,`Phone: ${phone}`,`Country: ${country}`,`Destination: ${destination}`,`Application: ${application}`,`Quantity: ${quantity}`,`Documents: ${documents}`,`Context: ${context}`,`Message: ${message}`,`Specifications: ${JSON.stringify(specs,null,2)}`,`Attachments saved: ${attachmentInfo.map(a=>a.name).join(', ') || 'None'}`].join('\n');
    await transport.sendMail({ from:smtpFrom, to:notifyEmail, replyTo:email, subject:`[Hanxing RFQ] ${id} · ${company}`, text:summary, attachments:attachmentInfo.map(info=>({filename:info.name,path:join(dir,info.storedAs)})) });
    let confirmationSent=true;
    try { await transport.sendMail({ from:smtpFrom, to:email, subject:`Hanxing inquiry received · ${id}`, text:`Thank you, ${name}.\n\nYour inquiry reference is ${id}. The submitted information has been received for review. This automated acknowledgement does not confirm product availability, compatibility or a quote.\n\nHanxing Capacitor` }); } catch { confirmationSent=false; }
    await writeFile(join(dir,'delivery.json'),JSON.stringify({ salesNotified:true, confirmationSent, at:new Date().toISOString() },null,2));
    return json({ id, status:'received', confirmationSent }, 201);
  } catch { await writeFile(join(dir,'delivery.json'),JSON.stringify({ salesNotified:false, at:new Date().toISOString() },null,2)); return json({ id, error:'Your inquiry was saved, but the sales notification failed. Please contact us with this reference before resubmitting.' },503); }
};
