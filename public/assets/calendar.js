/* Booking UI. Available times are always retrieved from the server, never invented in the browser. */
(function () {
  const FMT_DATE = new Intl.DateTimeFormat('en-US', {timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'});
  const FMT_WEEKDAY = new Intl.DateTimeFormat('en-US', {timeZone:'America/New_York',weekday:'short'});
  const parts = date => Object.fromEntries(FMT_DATE.formatToParts(date).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
  const easternDate = d => {const p=parts(d);return `${p.year}-${p.month}-${p.day}`};
  const dates = () => {
    // Noon UTC avoids edge dates while enumerating NY calendar dates.
    const base = easternDate(new Date()); const start = new Date(base+'T12:00:00Z');
    return Array.from({length:14},(_,i)=>{
      const d=new Date(start.getTime()+i*86400000);return {iso:d.toISOString().slice(0,10),day:FMT_WEEKDAY.format(d).toUpperCase(),num:d.getUTCDate()};
    });
  };
  const escapeText = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.mountCalendar = function(root) {
    const el=root.querySelector('.booking-section');if(!el)return;
    const dayBox=el.querySelector('.booking-days'),slotBox=el.querySelector('.booking-slots');
    const form=el.querySelector('.booking-form'),button=el.querySelector('.booking-submit'),msg=el.querySelector('.booking-feedback');
    const days=dates();let selectedDay=days[0].iso,selectedSlot='',available=[],configured=false,requestSeq=0;
    dayBox.innerHTML=days.map(d=>`<button type="button" class="booking-day" aria-pressed="${d.iso===selectedDay}" data-date="${d.iso}"><small>${escapeText(d.day)}</small>${d.num}</button>`).join('');
    const show = message => {msg.textContent=message};
    function renderSlots(){
      slotBox.innerHTML=available.length?available.map(s=>`<button type="button" class="booking-slot" aria-pressed="${s.value===selectedSlot}" data-slot="${escapeText(s.value)}">${escapeText(s.label)}</button>`).join(''):`<p class="booking-note">${configured?'No available times on this date. Try another day.':'Booking schedule is not connected yet. Please use the message form below.'}</p>`;
      button.disabled=!selectedSlot||!configured;
    }
    async function load(){
      selectedSlot='';available=[];configured=false;slotBox.innerHTML='<p class="booking-note">Checking available times…</p>';button.disabled=true;
      const seq=++requestSeq;
      try {
        const response=await fetch('/api/availability?date='+encodeURIComponent(selectedDay),{cache:'no-store'});
        if(!response.ok)throw new Error('Unavailable');
        const data=await response.json();if(seq!==requestSeq)return;
        configured=Boolean(data.configured);available=Array.isArray(data.slots)?data.slots:[];
        renderSlots();
      } catch(_){if(seq!==requestSeq)return;configured=false;available=[];renderSlots()}
    }
    dayBox.addEventListener('click',e=>{const b=e.target.closest('button[data-date]');if(!b)return;selectedDay=b.dataset.date;dayBox.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));show('');load()});
    slotBox.addEventListener('click',e=>{const b=e.target.closest('button[data-slot]');if(!b)return;selectedSlot=b.dataset.slot;slotBox.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));button.disabled=false;show('')});
    form.addEventListener('submit',async e=>{
      e.preventDefault();if(!selectedSlot||!configured)return;
      const data=Object.fromEntries(new FormData(form));
      if(data.website)return;
      if(!data.name.trim() || !/^\S+@\S+\.\S+$/.test(data.email) || data.phone.replace(/\D/g,'').length<7){show('Please enter your name, valid phone and email.');return;}
      const utm=new URLSearchParams(location.search);
      const payload={...data,date:selectedDay,time:selectedSlot,source_page:document.body.dataset.page,referrer:document.referrer};
      for(const k of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'])payload[k]=utm.get(k)||'';
      button.disabled=true;show('Booking your call…');
      try {
        const res=await fetch('/api/book',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        const outcome=await res.json().catch(()=>({}));
        if(!res.ok){if(res.status===409){show('That time was just booked. Please choose another slot.');await load();return;}throw new Error(outcome.error||'Could not book this time.');}
        const formatted=new Date(outcome.starts_at).toLocaleString('en-US',{timeZone:'America/New_York',dateStyle:'full',timeStyle:'short'});
        el.querySelector('.booking-panel').innerHTML=`<div class="booking-success"><span class="booking-eyebrow">CONFIRMED</span><h2>You're booked.</h2><p>${escapeText(formatted)} Eastern Time</p><p>We have your details. If it’s urgent, call <a href="tel:5184071772">518-407-1772</a>.</p></div>`;
        if(window.fbq)window.fbq('track','Schedule');
      } catch(err){button.disabled=false;show(err.message||'Booking unavailable. Please send us a message instead.')}
    });
    load();
  };
})();
