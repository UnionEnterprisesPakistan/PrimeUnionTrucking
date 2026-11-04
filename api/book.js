import { configured,slotsFor,upcoming,validDate,sqlClient,setup,noStore } from './_lib/booking.js';
export default async function handler(req,res){
 noStore(res);
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 if(!configured())return res.status(503).json({error:'Booking is not configured yet.'});
 const d=req.body||{};
 if(!d||typeof d!=='object'||Array.isArray(d))return res.status(400).json({error:'Invalid request'});
 if(d.website)return res.status(200).json({ok:true});
 const name=typeof d.name==='string'?d.name.trim().slice(0,100):'';
 const email=typeof d.email==='string'?d.email.trim().toLowerCase().slice(0,254):'';
 const rawPhone=typeof d.phone==='string'?d.phone.trim().slice(0,50):'';
 const digits=rawPhone.replace(/\D/g,'');
 const source=d.source_page;
 const date=d.date,time=d.time;
 if(!name||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||digits.length<7||digits.length>15||!['owner-operator','getting-started'].includes(source)||!validDate(date)||!slotsFor(date).includes(time))return res.status(400).json({error:'Please check your details and selected time.'});
 const start=upcoming(date,time);if(!start)return res.status(409).json({error:'This time is not available.'});
 const attribution=Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term','referrer'].map(k=>[k,typeof d[k]==='string'?d[k].slice(0,500):'']));
 try{
  const sql=sqlClient();await setup(sql);
  const rows=await sql`INSERT INTO put_bookings (starts_at,full_name,phone,email,source_page,attribution)
   VALUES (${start.toISOString()},${name},${rawPhone},${email},${source},${JSON.stringify(attribution)}::jsonb)
   ON CONFLICT (starts_at) DO NOTHING RETURNING id,starts_at`;
  if(!rows.length)return res.status(409).json({error:'That time has already been booked.'});
  return res.status(201).json({ok:true,starts_at:new Date(rows[0].starts_at).toISOString()});
 }catch(err){console.error('Booking error',err);return res.status(503).json({error:'Booking is temporarily unavailable. Please use the message form.'})}
}
