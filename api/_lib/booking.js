import { neon } from '@neondatabase/serverless';

const TZ='America/New_York';
const formatter=new Intl.DateTimeFormat('en-US',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const toNY=(dt)=>Object.fromEntries(formatter.formatToParts(dt).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
export const dateNY=(dt)=>{const x=toNY(dt);return `${x.year}-${x.month}-${x.day}`};
export const validDate=d=>{if(typeof d!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d))return false; const t=new Date(d+'T12:00:00Z');return !Number.isNaN(t.getTime())&&t.toISOString().slice(0,10)===d};
export const sqlClient=()=>process.env.DATABASE_URL?neon(process.env.DATABASE_URL):null;
export const configured=()=>Boolean(process.env.DATABASE_URL&&process.env.BOOKING_DAYS&&process.env.BOOKING_TIMES);
export const slotsFor=(day)=>{
 if(!configured()||!validDate(day))return [];
 const n=new Date(day+'T12:00:00Z').getUTCDay();
 const days=process.env.BOOKING_DAYS.split(',').map(v=>Number(v.trim()));
 if(!days.includes(n))return [];
 const times=process.env.BOOKING_TIMES.split(',').map(v=>v.trim()).filter(v=>/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(v));
 return [...new Set(times)].sort();
};
export const utcFor=(day,time)=>{
 const [year,month,date]=day.split('-').map(Number),[hour,minute]=time.split(':').map(Number);
 for(const offset of [4,5]){
  const candidate=new Date(Date.UTC(year,month-1,date,hour+offset,minute));const p=toNY(candidate);
  if(`${p.year}-${p.month}-${p.day}`===day&&`${p.hour}:${p.minute}`===time)return candidate;
 }
 return null;
};
export const upcoming=(day,time)=>{
 const start=utcFor(day,time);
 return start&&start.getTime()>Date.now()+60*60*1000&&start.getTime()<Date.now()+31*86400000?start:null;
};
export const setup=async sql=>{
 await sql`CREATE TABLE IF NOT EXISTS put_bookings (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  starts_at TIMESTAMPTZ NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  source_page TEXT NOT NULL,
  attribution JSONB NOT NULL DEFAULT '{}'::jsonb
 )`;
};
export const noStore=res=>res.setHeader('Cache-Control','no-store');
