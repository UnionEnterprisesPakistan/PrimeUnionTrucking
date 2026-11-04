import { configured,slotsFor,upcoming,validDate,sqlClient,setup,noStore } from './_lib/booking.js';
export default async function handler(req,res){
 noStore(res);
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 const date=req.query.date;
 if(!validDate(date))return res.status(400).json({error:'Invalid date'});
 if(!configured())return res.status(200).json({configured:false,slots:[]});
 try{
  const starts=slotsFor(date).map(time=>({time,date:upcoming(date,time)})).filter(x=>x.date);
  const sql=sqlClient();await setup(sql);
  const booked=await sql`SELECT starts_at FROM put_bookings WHERE starts_at >= ${date+'T00:00:00Z'}::timestamptz - interval '1 day' AND starts_at < ${date+'T00:00:00Z'}::timestamptz + interval '2 days'`;
  const taken=new Set(booked.map(row=>new Date(row.starts_at).toISOString()));
  const slots=starts.filter(x=>!taken.has(x.date.toISOString())).map(x=>({value:x.time,label:new Date(x.date).toLocaleTimeString('en-US',{timeZone:'America/New_York',hour:'numeric',minute:'2-digit'})}));
  res.status(200).json({configured:true,timeZone:'America/New_York',slots});
 }catch(err){console.error('Availability error',err);res.status(503).json({error:'Availability is temporarily unavailable',slots:[]})}
}
