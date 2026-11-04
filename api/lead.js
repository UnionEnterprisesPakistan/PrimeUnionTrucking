import { neon } from '@neondatabase/serverless';
const OPTIONS={
 '[PUT — Owner Op]':{page:'owner-operator', required:['running','authority'],pick:{running:['Just getting started','1 truck','2 trucks','3+'],authority:['Yes','No','Applying now']}},
 '[PUT — Fleet]':{page:'fleet',required:['company','size','looking'],pick:{size:['3–10','11–30','31–75','75+']}},
 '[PUT — Getting Started]':{page:'getting-started',required:['where'],pick:{where:['Just researching','Have my CDL','Ready to buy a truck','Already started the paperwork']}}
};
const NEEDS=['Dispatch','Compliance','Back office','Driver management','Software or a portal built','Not sure yet'];
const str=(v,max=2000)=>typeof v==='string'?v.trim().slice(0,max):'';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 if(!process.env.DATABASE_URL)return res.status(503).json({error:'Lead storage is not configured yet.'});
 const d=req.body;
 if(!d||typeof d!=='object'||Array.isArray(d))return res.status(400).json({error:'Invalid request'});
 if(d.website)return res.status(200).json({ok:true});
 const subject=str(d.subject,70),conf=OPTIONS[subject],name=str(d.name,100),email=str(d.email,254).toLowerCase(),digits=str(d.phone,50).replace(/\D/g,'');
 if(!conf||!name||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||digits.length<7||digits.length>15)return res.status(400).json({error:'Please check your name, email, and phone.'});
 if(str(d.source_page)!==conf.page)return res.status(400).json({error:'Incorrect source page'});
 for(const key of conf.required)if(!str(d[key]))return res.status(400).json({error:'Missing '+key});
 for(const [key,values] of Object.entries(conf.pick))if(!values.includes(str(d[key],100)))return res.status(400).json({error:'Invalid '+key});
 if(subject==='[PUT — Fleet]'){
  const looking=str(d.looking,1000).split(',').map(s=>s.trim()).filter(Boolean);
  if(looking.length===0||looking.some(s=>!NEEDS.includes(s)))return res.status(400).json({error:'Invalid services selected'});
 }
 const safe={};for(const k of ['subject','name','email','phone','source_page','running','authority','company','size','looking','where','notes','pain','sit','utm_source','utm_medium','utm_campaign','utm_content','utm_term','referrer'])safe[k]=str(d[k],k==='referrer'?500:2000);
 try{
  const sql=neon(process.env.DATABASE_URL);
  await sql`CREATE TABLE IF NOT EXISTS put_leads (id BIGSERIAL PRIMARY KEY,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),source_page TEXT NOT NULL,first_name TEXT NOT NULL,email TEXT NOT NULL,phone TEXT NOT NULL,details JSONB NOT NULL)`;
  await sql`INSERT INTO put_leads (source_page,first_name,email,phone,details) VALUES (${conf.page},${name},${email},${digits},${JSON.stringify(safe)}::jsonb)`;
  return res.status(201).json({ok:true});
 }catch(err){console.error('Lead save failed',err);return res.status(503).json({error:'Unable to save your message. Please call us instead.'});}
}
