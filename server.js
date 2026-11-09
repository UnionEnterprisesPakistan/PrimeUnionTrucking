import express from 'express';
import { DatabaseSync } from 'node:sqlite';
import nodemailer from 'nodemailer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const env = process.env;
const app = express();
if (env.TRUST_PROXY === 'true') app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '32kb', strict: true }));
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.set('X-Frame-Options', 'SAMEORIGIN');
  next();
});

const root = path.join(ROOT, 'public');
app.use('/assets', express.static(path.join(root, 'assets'), { immutable: false, maxAge: 0, etag: true }));
const pages = { '/': 'index', '/owner-operator': 'owner-operator', '/fleet': 'fleet', '/getting-started': 'getting-started', '/privacy-policy': 'privacy-policy' };
for (const [url, filename] of Object.entries(pages)) app.get(url, (_req, res) => res.sendFile(path.join(root, `${filename}.html`)));

// Local development routes for the Vercel booking functions.
app.get('/api/availability', async (req,res) => {
  const {default: handler} = await import('./api/availability.js');
  return handler(req,res);
});
app.post('/api/book', async (req,res) => {
  const {default: handler} = await import('./api/book.js');
  return handler(req,res);
});

const dbPath = path.resolve(ROOT, env.DB_PATH || 'data/leads.sqlite');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new DatabaseSync(dbPath);
db.exec(`PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS leads (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 form TEXT NOT NULL,
 first_name TEXT NOT NULL,
 email TEXT NOT NULL,
 phone TEXT NOT NULL,
 payload_json TEXT NOT NULL,
 email_status TEXT NOT NULL DEFAULT 'not_configured'
);
CREATE INDEX IF NOT EXISTS leads_created_at ON leads(created_at);`);
const insertLead = db.prepare('INSERT INTO leads (form,first_name,email,phone,payload_json,email_status) VALUES (?,?,?,?,?,?)');
const updateEmailStatus = db.prepare('UPDATE leads SET email_status=? WHERE id=?');
const rate = new Map();
const allowed = {
 '[PUT — Owner Op]': {
   page: 'owner-operator', fields: { running: ['Just getting started', '1 truck', '2 trucks', '3+'], authority: ['Yes', 'No', 'Applying now'] }, required: ['running', 'authority']
 },
 '[PUT — Fleet]': {
   page: 'fleet', fields: { size: ['3–10', '11–30', '31–75', '75+'] }, required: ['size', 'company', 'looking']
 },
 '[PUT — Getting Started]': {
   page: 'getting-started', fields: { where: ['Just researching', 'Have my CDL', 'Ready to buy a truck', 'Already started the paperwork'] }, required: ['where']
 }
};
const subjects = Object.keys(allowed);
const allowedNeeds = ['Dispatch', 'Compliance', 'Back office', 'Driver management', 'Software or a portal built', 'Not sure yet'];
const mailer = env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.FROM && env.TO_EMAIL
 ? nodemailer.createTransport({ host: env.SMTP_HOST, port: Number(env.SMTP_PORT || 587), secure: Number(env.SMTP_PORT || 587) === 465, auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } }) : null;
const plain = (value, max=400) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const textField = (v, max) => plain(v, max).replace(/[\u0000-\u001f\u007f]/g, ' ');
const phoneNumber = value => {
 const raw = plain(value, 50);
 const digits = raw.replace(/\D/g, '');
 if (digits.length < 7 || digits.length > 15) return null;
 if (raw.startsWith('+')) return '+' + digits;
 if (digits.length === 10) return '+1' + digits;
 if (digits.length === 11 && digits.startsWith('1')) return '+' + digits;
 return digits;
};
const validEmail = email => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/[\r\n]/.test(email);
function throttle(ip) {
 const now=Date.now();
 if (rate.size > 10000) for (const [key, v] of rate) if (now-v.last > 3600000) rate.delete(key);
 const item=rate.get(ip) || { count:0, last:now };
 if (now-item.last > 3600000) { item.count=0; item.last=now; }
 item.count++; rate.set(ip,item);
 return item.count <= 15;
}
function checkData(d) {
 if (!d || typeof d !== 'object' || Array.isArray(d)) return { error:'Invalid request.' };
 if (d.website) return { honeypot:true };
 const subject=plain(d.subject, 70), spec=allowed[subject];
 if (!spec) return { error:'Invalid form.' };
 const name=textField(d.name,100), email=plain(d.email,254).toLowerCase(), phone=phoneNumber(d.phone);
 if (!name || !validEmail(email) || !phone) return { error:'Please check your name, email and phone.' };
 const source=plain(d.source_page, 60);
 if (source && source !== spec.page) return { error:'Form and source page do not match.' };
 const clean={ subject, name, email, phone, source_page:spec.page };
 for (const [field, opts] of Object.entries(spec.fields)) {
   const value=plain(d[field], 100);
   if (value && !opts.includes(value)) return { error:`Invalid ${field}.` };
   clean[field]=value;
 }
 for (const field of spec.required) if (field !== 'looking' && !clean[field] && !plain(d[field], 100)) return { error:`Missing ${field}.` };
 if (subject === '[PUT — Fleet]') {
   clean.company=textField(d.company,150);
   const selected=plain(d.looking,1000).split(',').map(x=>x.trim()).filter(Boolean);
   if (!clean.company || !selected.length || selected.some(x=>!allowedNeeds.includes(x))) return { error:'Invalid fleet details.' };
   clean.looking=[...new Set(selected)].join(', ');
 }
 const optionalByForm={ '[PUT — Owner Op]':['notes'], '[PUT — Fleet]':['pain'], '[PUT — Getting Started]':['sit'] };
 for (const field of optionalByForm[subject]) clean[field]=textField(d[field], 2000);
 for (const field of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','referrer']) clean[field]=textField(d[field], 500);
 return { clean };
}
app.post('/api/lead', async (req,res) => {
 res.set('Cache-Control','no-store');
 if (!throttle(req.ip || 'unknown')) return res.status(429).json({error:'Too many submissions. Please try later.'});
 const result=checkData(req.body);
 if (result.honeypot) return res.json({ok:true});
 if (result.error) return res.status(400).json({error:result.error});
 const d=result.clean;
 let id;
 try { const row=insertLead.run(d.subject,d.name,d.email,d.phone,JSON.stringify(d),mailer?'pending':'not_configured'); id=Number(row.lastInsertRowid); }
 catch (error) { console.error('Database save failed:',error); return res.status(500).json({error:'Unable to save this request.'}); }
 // Save first; a mail outage must never lose a lead.
 res.status(201).json({ok:true});
 if (!mailer) return;
 const safeSubject=`${d.subject} ${d.name.replace(/[\r\n]/g,' ')}`;
 const message=Object.entries(d).map(([k,v])=>`${k}: ${v}`).join('\n');
 try {
   await mailer.sendMail({from:env.FROM,to:env.TO_EMAIL,replyTo:d.email,subject:safeSubject,text:message});
   updateEmailStatus.run('sent',id);
 } catch (error) { console.error('Lead email failed:',error.message); updateEmailStatus.run('failed',id); }
 try {
   await mailer.sendMail({from:env.FROM,to:d.email,subject:'Got your message — Prime Union Trucking',text:`Hi ${d.name},\n\nI saw your message come in. Someone from the team will get back to you within one business day. If it's urgent, call 518-407-1772.\n\n${env.SIGNOFF || 'Prime Union Trucking'}`});
 } catch (error) { console.error('Autoresponder failed:',error.message); }
});
function isAdmin(req) {
 const key=env.ADMIN_KEY || '';
 if (key.length < 24) return false;
 const token=(req.get('authorization')||'').replace(/^Bearer\s+/i,'');
 const a=Buffer.from(token),b=Buffer.from(key);
 return a.length===b.length && crypto.timingSafeEqual(a,b);
}
app.get('/admin/leads.csv',(req,res)=>{
 res.set('Cache-Control','no-store');
 if (!isAdmin(req)) return res.status(401).json({error:'Unauthorized'});
 const quote = value => { const x=String(value??''); return '"'+( /^[=+@\-\t\r]/.test(x)?"'"+x:x ).replace(/"/g,'""')+'"'; };
 const rows=db.prepare('SELECT id,created_at,form,first_name,email,phone,payload_json,email_status FROM leads ORDER BY id DESC LIMIT 10000').all();
 const keys=['id','created_at','form','first_name','email','phone','payload_json','email_status'];
 res.set('Content-Disposition','attachment; filename="prime-union-leads.csv"');
 res.type('text/csv; charset=utf-8').send('\uFEFF'+[keys.join(','),...rows.map(r=>keys.map(k=>quote(r[k])).join(','))].join('\r\n'));
});
app.get('/health',(_req,res)=>res.json({ok:true}));
app.use((req,res)=>res.status(404).type('text/plain').send('Page not found'));
app.use((err,req,res,next)=>{
 console.error(err);
 res.status(err.status===413?413:400).json({error:'Invalid request.'});
});
const port=Number(env.PORT||3000);
app.listen(port,()=>console.log(`Prime Union Trucking running on http://localhost:${port}`));
