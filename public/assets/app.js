const L="/assets/put-icon.png",ENDPOINT="/api/lead",CALURL="";/* set ENDPOINT to your form-handling URL */
document.documentElement.classList.add("js");document.getElementById("lg").src="/assets/prime-union-logo-header.png";
const H=(a,b)=>`<section class="hero inner-hero"><h1>${a}</h1></section>`;
const SV=arcs=>{const cx=380,cy=235,rx=300,ry=170;let k=0,o=`<ellipse class="ob" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`,nd="";
arcs.forEach(([lb,s],a)=>{const m=s.length,st=m>3?38:45;o+=`<text class="lb" x="${cx}" y="${a?452:26}">${lb}</text>`;
s.forEach((t,j)=>{const off=(j-(m-1)/2)*st*(a?-1:1),th=((a?90:-90)+off)*Math.PI/180,x=cx+rx*Math.cos(th),y=cy+ry*Math.sin(th),w=t.length*8.4+34,d=.3+k*.12;k++;
o+=`<path class="sp" pathLength="1" d="M${cx} ${cy}L${x.toFixed(1)} ${y.toFixed(1)}" style="--d:${d}s"/>`;
nd+=`<g class="nd" style="--d:${(d+.8).toFixed(2)}s"><rect x="${(x-w/2).toFixed(1)}" y="${(y-18).toFixed(1)}" width="${w.toFixed(1)}" height="36" rx="18"/><text x="${x.toFixed(1)}" y="${(y+5).toFixed(1)}">${t}</text></g>`})});
return`<svg class="gv" viewBox="0 0 760 470" role="img" aria-label="${arcs.map(a=>a[0]+": "+a[1].join(", ")).join(". ")}">${o}<circle class="pl" cx="${cx}" cy="${cy}" r="60"/><circle cx="${cx}" cy="${cy}" r="60" fill="#10251b" stroke="#b9f34d" stroke-width="2"/><clipPath id="hc"><circle cx="${cx}" cy="${cy}" r="54"/></clipPath><image href="${L}" x="${cx-52}" y="${cy-60}" width="104" height="121" clip-path="url(#hc)"/>${nd}</svg>`};
const HUB=(arcs,cap)=>{
  const title={
    "owner-operator":"One or Two Trucks",
    fleet:"Fleet Operations",
    "getting-started":"Start Trucking"
  }[document.body.dataset.page]||"Prime Union";

  const services=arcs.flatMap(([group,names])=>
    names.map(name=>({group,name}))
  );

  const nodes=services.map(({group,name},i)=>{
    const angle=-90+i*360/services.length;
    return `<button class="po-node" type="button"
      style="--a:${angle}deg"
      data-group="${group}"
      data-name="${name}"
      aria-label="${name} — ${group}"
      aria-pressed="${i===0}">
      <span class="po-node-name">${name}</span>
      <span class="po-node-num">${String(i+1).padStart(2,"0")}</span>
    </button>`;
  }).join("");

  return `<section class="po-hub" aria-label="${title} services">
    <div class="po-kicker">HOW WE HELP</div>
    <h2 class="po-heading">Built around your operation.</h2>

    <div class="po-group-labels">
      <span>${arcs[0][0]}</span>
      <span>${arcs[1][0]}</span>
    </div>

    <div class="po-stage">
      <div class="po-track" aria-hidden="true"></div>
      <div class="po-wheel">${nodes}</div>

      <div class="po-sun">
        <span>PRIME UNION</span>
        <strong>${title}</strong>
      </div>
    </div>

    <div class="po-detail" role="status" aria-live="polite">
      <span class="po-detail-group">${services[0].group}</span>
      <strong class="po-detail-name">${services[0].name}</strong>
      <small>Tap a point to explore services</small>
    </div>

    <p class="po-caption">${cap}</p>
  </section>`;
};
const O=i=>`<section class="offers" id="services">${i.map(([t,x])=>`<div><h3>${t}</h3><p>${x}</p></div>`).join("")}</section>`;
const POS=t=>`<aside class="pos"><p>${t}</p></aside>`,PR=t=>`<p class="proof">${t}</p>`;
const TEL=`<p class="tel">Or call <a href="tel:5184071772">518-407-1772</a></p>`;
const CAL=(h,s,k)=>`<section class="booking-section conv" id="contact"><div class="booking-intro"><span class="booking-eyebrow">NEXT STEP</span><h2>${h}</h2><p>${s}</p>${TEL}</div><div class="booking-panel"><span class="booking-eyebrow">PICK A TIME</span><span class="booking-zone">ALL TIMES EASTERN</span><div class="booking-days" role="group" aria-label="Choose appointment date"></div><div class="booking-slots" role="group" aria-label="Choose appointment time"><p class="booking-note">Loading available times…</p></div><form class="booking-form" novalidate><div class="booking-fields"><label>FIRST NAME<input name="name" autocomplete="given-name" required maxlength="100"></label><label>PHONE<input name="phone" type="tel" autocomplete="tel" required></label><label>EMAIL<input name="email" type="email" autocomplete="email" required></label></div><input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="booking-submit" disabled>BOOK THE CALL <span aria-hidden="true">→</span></button><p class="booking-feedback" role="status" aria-live="polite"></p></form><button type="button" class="booking-alt lnk" data-f="${k}">Rather just send a message? <span aria-hidden="true">→</span></button><div id="fw"></div></div></section>`;
const FORMS={
A:{t:"Owner Op",f:[["name","First name","text",1],["phone","Phone","tel",1],["email","Email","email",1],["running","What are you running","sel",1,["Just getting started","1 truck","2 trucks","3+"]],["authority","Do you have your own authority","sel",1,["Yes","No","Applying now"]],["notes","Anything we should know","area",0]]},
B:{t:"Fleet",f:[["name","First name","text",1],["company","Company","text",1],["phone","Phone","tel",1],["email","Email","email",1],["size","Fleet size","sel",1,["3–10","11–30","31–75","75+"]],["looking","What are you looking at","chk",1,["Dispatch","Compliance","Back office","Driver management","Software or a portal built","Not sure yet"]],["pain","What’s the main pain right now","area",0]]},
C:{t:"Getting Started",f:[["name","First name","text",1],["phone","Phone","tel",1],["email","Email","email",1],["where","Where are you at","sel",1,["Just researching","Have my CDL","Ready to buy a truck","Already started the paperwork"]],["sit","What’s your situation","area",0]]}};
const P={
home:{t:"Prime Union Trucking — Find your next step",d:"Dispatch, compliance and growth for trucking businesses. Choose where you are today.",h:()=>`<div class="home"><section class="home-hero"><div class="hero-copy"><span class="eyebrow">THE WORK BEHIND THE WHEELS</span><h1>Getting loads is the easy part.<br><strong>Growing past one truck takes a plan.</strong></h1><a class="cta hero-action" href="#choose">Let's Talk</a></div></section><section class="home-choices" id="choose"><div class="choice-top"><span class="eyebrow">WHERE YOU ARE NOW</span><h2>Where are you on the road?</h2></div><nav class="cards" aria-label="Choose your trucking stage"><a class="card" href="/owner-operator"><i>01 / OWNER OPERATOR</i><b>I've got one or two trucks</b><em aria-hidden="true">↗</em></a><a class="card" href="/fleet"><i>02 / FLEET OPERATIONS</i><b>I'm running a fleet</b><em aria-hidden="true">↗</em></a><a class="card" href="/getting-started"><i>03 / START TRUCKING</i><b>I'm thinking about getting into trucking</b><em aria-hidden="true">↗</em></a></nav></section></div>`},
"owner-operator":{t:"One or two trucks — Prime Union Trucking",d:"You’re not short on work. You’re short on someone watching the whole thing. Book a call and we’ll tell you what we’d do with your truck.",h:()=>H("You’re not short on work. You’re short on someone watching the whole thing.","Loads are the easy part. What takes people out is everything happening in the background while you’re driving — and it’s almost never one bad month. It’s two years of small things nobody flagged.")+HUB([["Keeps you running",["Compliance","Freight","Insurance"]],["Gets you bigger",["Trailers","Drivers","The next truck"]]],"Everyone sells you the top half. Nothing on top matters if the bottom half never happens.")+O([["Compliance","Rules move. When FMCSA switched registration over to Motus this year, carriers who’d done nothing wrong had their authority go inactive over filing errors — some found out at a weigh station with freight on the trailer. We stay on top of the changes so that’s not your morning."],["Freight","Dispatch picking loads against your plan, not just filling the truck."],["Insurance","We work with 15–20 carriers, so we’re shopping for what fits your money right now — not selling the one policy we’re tied to."],["Trailers","Rent one, own one, or run someone else’s. We’ve got the connections either way, and we’ll tell you honestly which one your numbers can carry right now."],["Drivers","We’ll find them, qualify them, and keep their files clean. Your first hire shouldn’t be the thing that damages your record."],["The next truck","What to buy, where, what to walk away from, and when you can actually carry it."]])+POS("Most of the damage in this industry gets done secondhand, by a dispatcher giving advice about things he was never responsible for. He gets paid on the load. He’s not there when your authority goes sideways.")+PR("More than a thousand US trucks over five years. Ask us on the call and we’ll send you the carriers we’ve worked with.")+CAL("Book a call and we’ll tell you what we’d do with your truck.","Straight read on where you stand. No pitch.","A")},
fleet:{t:"Running a fleet — Prime Union Trucking",d:"The trucks aren’t the problem. Everything behind them is. We run it, or we build the system that does.",h:()=>H("The trucks aren’t the problem. Everything behind them is.","You already know how to move freight. What eats the margin is the back office, the filings, the driver churn, and the fact that most of it lives in someone’s head or someone’s spreadsheet. We take that off you — or build you the system that handles it.")+HUB([["We run it",["Dispatch","Compliance","Back office","Drivers"]],["We build it",["Driver portals","Pre-check systems","Fleet management","Custom apps"]]],"Hand the operation over, or have us build the system you run it with. Most fleets end up doing both.")+`<section class="sys"><h2>Software, built around your operation</h2><p>We have our own development team. That means when something in your workflow doesn’t fit the software on the market, we don’t tell you to adjust — we build the thing that fits.</p><p><b>Driver portals.</b> Your drivers, your branding. Documents, loads, pay, messages, all in one place instead of across four group chats.</p><p><b>Pre-check and inspection systems.</b> Walkarounds, defects, maintenance logged where you can actually see it — before it becomes a roadside violation.</p><p><b>Fleet management.</b> Loads, trucks, drivers, documents and compliance dates in one system that matches the way you already work.</p><p><b>Whatever you’re missing.</b> Settlements that calculate your way, a dispatch board shaped like your lanes, a portal for your owner-operators. If you can describe it, we’ve probably built something close to it.</p><p>White-labelled under your name. You own it. And it’s built by the same people running dispatch and compliance for carriers every day — so it’s designed by people who’ve done the job, not by developers guessing at it.</p></section>`+O([["Dispatch at scale","Covering your lanes, your contracts, your standards. We work inside how you already run — we’re not asking you to change your operation to fit ours."],["Compliance","Filings, audits, driver files, and the rules that moved last month. When FMCSA switched registration over to Motus this year, clean carriers had authority go inactive over filing errors. At your size that’s not an inconvenience, it’s trucks sitting still."],["Back office","Billing, paperwork, settlements, the follow-up nobody wants to do. The stuff that quietly needs three people and never gets budgeted for."],["Drivers","Sourcing, qualifying, and keeping files clean — the part that got significantly harder this year. Roughly 40,000 non-domiciled CDLs have been revoked and about 29,000 drivers pulled out of service over English proficiency. Seats are harder to fill, and the paperwork behind each one matters more than it used to."]])+POS("We’ve been inside more than a thousand US trucks over five years. Not as a vendor sitting outside the operation — as the people doing the work. That’s the only reason we know what actually breaks at forty trucks that didn’t break at four.")+PR("Ask us and we’ll send you the carriers we’ve worked with.")+`<section class="conv" id="contact"><h2>Tell us what you’re running and where it’s hurting.</h2><p>We’ll come back with a straight read on what we’d take over and what we’d build. Someone gets back to you within one business day.</p><div id="fw"></div>${TEL}</section>`,f:"B"},
"getting-started":{t:"Start Trucking — Prime Union Trucking",d:"Most people who start a trucking business are gone inside two years. We’d rather tell you what it takes now, including if you’re not ready.",h:()=>H("Most people who start a trucking business are gone inside two years.","Not because they couldn’t drive. Because nobody told them what the business actually required until they’d already spent the money. We’d rather tell you now — including if the answer is that you’re not ready.")+HUB([["Before you spend anything",["What it really costs","Authority and setup","Insurance reality","Truck or lease"]],["Once you’re moving",["Freight","Compliance","Your first year plan"]]],"The expensive mistakes all happen in the top half, before the wheels ever turn.")+O([["What it actually costs","Not the number on the truck. The whole number — insurance down payment, authority, permits, the months before the money starts arriving, and what you need sitting in the bank the day something breaks."],["Getting set up properly","Authority, permits, filings, the right entity. Done once, done right. This is the part people pay someone to do badly and spend two years correcting."],["Insurance, honestly","New authority means the worst rates you’ll ever pay — that’s just true. We work with 15–20 carriers, so we’ll find the best of a hard situation and tell you straight what it’s going to be."],["Truck or lease","What to buy, what to avoid, what a lease really costs you, and whether buying makes sense at all in your first year."],["Freight from day one","Here’s what nobody mentions until you’re already set up: most brokers won’t touch a new authority. Three months, six months, some won’t quote you at all until you’ve got a history. That’s a long time to make truck payments on nothing. We’ve got the relationships and the track record, so your freight doesn’t wait for your authority to age."],["Your first year","Freight, compliance, and a plan with actual numbers in it. We don’t hand you a document and wish you luck — we run it with you."]])+POS("We’ll also tell you not to do it. If your numbers don’t work yet, you’ll hear that from us before you’ve signed anything. We’ve watched too many people find out eighteen months in, with a truck they can’t sell and a rating they can’t fix.")+CAL("Book your consultation and we’ll give you a straight answer.","No pitch. If it’s not the right time, we’ll say so.","C")}};
function field([n,l,t,r,o]){const q=r?" *":"";if(t==="chk")return`<fieldset data-n="${n}" data-r="${r}"><legend>${l}${q}</legend>${o.map(x=>`<label class="ck"><input type="checkbox" name="${n}" value="${x}">${x}</label>`).join("")}<div class="err"></div></fieldset>`;
const c=t==="sel"?`<select name="${n}"><option value="">Choose one</option>${o.map(x=>`<option>${x}</option>`).join("")}</select>`:t==="area"?`<textarea name="${n}" rows="3"></textarea>`:`<input name="${n}" type="${t}" ${t==="tel"?'inputmode="tel"':""}>`;
return`<div class="f" data-n="${n}" data-t="${t}" data-r="${r}"><label>${l}${q}</label>${c}<div class="err"></div></div>`}
function bad(el){const t=el.dataset.t,r=+el.dataset.r,i=el.querySelector("input,select,textarea");let v=i?i.value.trim():"",m="";
if(el.tagName==="FIELDSET"){if(r&&!el.querySelector(":checked"))m="Pick at least one."}
else if(r&&!v)m="Required.";else if(v&&t==="email"&&!/^\S+@\S+\.\S+$/.test(v))m="That email doesn’t look right.";else if(v&&t==="tel"&&v.replace(/\D/g,"").length<7)m="That number looks short.";
el.querySelector(".err").textContent=m;i&&i.classList.toggle("bad",!!m);return!!m}
function mount(k){const F=FORMS[k],w=document.getElementById("fw"),u=new URLSearchParams(location.search);
w.innerHTML=`<form novalidate>${F.f.map(field).join("")}<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="go">Send it over</button></form>`;
const fm=w.firstChild;fm.querySelectorAll(".f,fieldset").forEach(e=>{e.addEventListener("focusout",()=>bad(e));e.addEventListener("change",()=>bad(e))});
fm.onsubmit=async e=>{e.preventDefault();let x=0;fm.querySelectorAll(".f,fieldset").forEach(el=>{if(bad(el))x=1});if(x)return;
const d=Object.fromEntries(new FormData(fm));d.looking=[...fm.querySelectorAll("[name=looking]:checked")].map(i=>i.value).join(", ");if(d.website)return;delete d.website;
d.subject=`[PUT — ${F.t}]`;d.source_page=document.body.dataset.page;["utm_source","utm_medium","utm_campaign","utm_content","utm_term"].forEach(n=>d[n]=u.get(n)||"");d.referrer=document.referrer;
fm.querySelectorAll(".sf").forEach(e=>e.remove());try{const q=await fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});if(!q.ok)throw 0}catch(_){fm.querySelector(".go").insertAdjacentHTML("afterend",'<p class="err sf">Something went wrong. Please call 518-407-1772.</p>');return}window.fbq&&fbq("track","Lead");
w.innerHTML=`<h2>Got it.</h2><p>Someone will come back to you within one business day, usually sooner. If it’s urgent, call <a href="tel:5184071772">518-407-1772</a>.</p>`}}
function route(){const k=document.body.dataset.page,p=P[k];
const a=document.getElementById("app");a.innerHTML=p.h();
if(p.f)mount(p.f);if(k==="owner-operator"||k==="getting-started")mountCalendar(a);a.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>mount(b.dataset.f));
const io=typeof IntersectionObserver!=="undefined"?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.08}):null;
a.querySelectorAll(".hub").forEach(h=>io?io.observe(h):h.classList.add("in"));fx(a)}

document.body.insertAdjacentHTML("afterbegin",'<div id="sp"></div><div id="pb"></div>');
const sp=document.getElementById("sp"),pb=document.getElementById("pb");
addEventListener("pointermove",e=>{sp.style.opacity=1;sp.style.transform=`translate(${e.clientX-260}px,${e.clientY-260}px)`;const c=e.target.closest&&e.target.closest(".card");if(c){const r=c.getBoundingClientRect();c.style.setProperty("--mx",e.clientX-r.left+"px");c.style.setProperty("--my",e.clientY-r.top+"px")}});
addEventListener("scroll",()=>{pb.style.width=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100+"%"},{passive:true});
function cnt(b){const n=+b.dataset.n,s=b.dataset.s,t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/1400);b.textContent=Math.round(n*(1-Math.pow(1-p,3))).toLocaleString("en-US")+s;if(p<1)requestAnimationFrame(f)})(t0)}
// One-time reveal: keep the visible state instead of removing classes after a timer.
// A modest root margin ensures the three cards animate as they enter the viewport.
const motionOK=!matchMedia("(prefers-reduced-motion: reduce)").matches;
const io2=typeof IntersectionObserver!=="undefined" ? new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){
    const t=e.target; t.classList.add("in"); io2.unobserve(t);
    const b=t.querySelector("[data-n]"); if(b&&!isNaN(b.dataset.n))cnt(b);
  }
}),{threshold:0.06,rootMargin:"0px 0px 45px 0px"}):null;
function fx(a){const k=document.body.dataset.page==="home"?"":document.body.dataset.page;a.classList.remove("pg");void a.offsetWidth;a.classList.add("pg");
a.querySelectorAll("h1").forEach(h=>{if(document.body.dataset.page==="home")return;let cy=0;h.innerHTML=h.textContent.split(" ").map((w,i,r)=>{const s=`<span class="wd${cy?" cy":""}"><i style="--i:${i}">${w}</i></span>`;if(/\.$/.test(w)&&i<r.length-1)cy=1;return s}).join(" ")});
const hr=a.querySelector(".hero");
a.querySelectorAll(".hero p,.lead,.cards .card,.offers>div,.sys,.pos,.proof,.conv,.cap,.stats>div").forEach((e,i)=>{
  if(motionOK&&io2){e.classList.add("rv");e.style.setProperty("--d",(i%4)*95+"ms");io2.observe(e)}
  else e.classList.add("in");
});const tg=a.querySelector(".conv")||a.querySelector(".cards");document.querySelectorAll(".cta").forEach(b=>b.onclick=e=>{e.preventDefault();tg&&tg.scrollIntoView({behavior:"smooth",block:"start"})})}
/* PUT_ORBIT_CLICK_V1 */
document.getElementById("app").addEventListener("click",e=>{
  const b=e.target.closest(".po-node");
  if(!b)return;

  const h=b.closest(".po-hub");

  h.querySelectorAll(".po-node").forEach(n=>
    n.setAttribute("aria-pressed",String(n===b))
  );

  h.querySelector(".po-detail-group").textContent=b.dataset.group;
  h.querySelector(".po-detail-name").textContent=b.dataset.name;
});
route();
