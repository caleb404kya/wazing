var PK=[
 {id:"wedding",n:"Wedding Usher Team",p:10000,d:"Full team to ensure smooth wedding flow, guest guidance and VIP coordination.",c:"Weddings",art:"wedding"},
 {id:"funeral",n:"Funeral Usher Team",p:8000,d:"Compassionate and organised ushering that maintains dignity and order.",c:"Funerals",art:"funeral"},
 {id:"corporate",n:"Corporate Events",p:12000,d:"Seminars, conferences and corporate gatherings handled professionally.",c:"Corporate",art:"corporate"},
 {id:"birthday",n:"Birthday Parties",p:null,q:"Ask for a quote",d:"Friendly ushers to welcome and guide guests. Priced by the hour or tailored to your party.",c:"Birthdays",art:"birthday"},
 {id:"hourly",n:"Hourly Rate",p:2500,d:"Ideal for short events or add-on services. Minimum 2 hours.",c:"Any event",hr:true,art:"events"},
 {id:"premium",n:"Premium Package",p:18000,d:"Full team, 6+ hours, all-inclusive service for high-standard events.",c:"Any event",art:"events"},
 {id:"other",n:"Other events and gatherings",p:null,q:"Tailored",d:"Any occasion, small or big. We work as you direct us.",c:"Any event",art:"events"}
];
var $=function(s){return document.querySelector(s)};
var fmt=function(n){return "Ksh "+n.toLocaleString("en-KE")};
var byId=function(id){return PK.filter(function(x){return x.id===id})[0]};
var plabel=function(x){return x.p?(x.hr?"Ksh 2,500/hour":fmt(x.p)):x.q};
var RM=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
var sel="wedding",chosen=null,hrs=2,cur="All";
function toast(t){var e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.remove("show")},2400)}

/* themed artwork for service cards */
var A=function(b){return '<svg class="art" viewBox="0 0 160 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+b+'</svg>'};
var ART={
 wedding:A('<circle cx="62" cy="74" r="26"/><circle cx="98" cy="74" r="26"/><path d="M80 40c-6-10-22-6-18 6 3 8 18 16 18 16s15-8 18-16c4-12-12-16-18-6z"/><path d="M24 28l4 4M136 24l4 4M130 100l5-3"/>'),
 funeral:A('<rect x="72" y="62" width="16" height="42" rx="2"/><path d="M80 30c8 10 8 18 0 24-8-6-8-14 0-24z"/><path d="M38 104c20-4 30-20 34-40M122 104c-20-4-30-20-34-40"/><path d="M26 108h108"/>'),
 corporate:A('<rect x="20" y="62" width="24" height="46"/><rect x="50" y="38" width="28" height="70"/><rect x="84" y="52" width="22" height="56"/><rect x="112" y="24" width="26" height="84"/><path d="M58 52h12M58 66h12M58 80h12M120 40h10M120 54h10M120 68h10M12 108h140"/>'),
 birthday:A('<ellipse cx="50" cy="44" rx="18" ry="22"/><ellipse cx="88" cy="36" rx="18" ry="22"/><ellipse cx="124" cy="48" rx="16" ry="20"/><path d="M50 66c0 14 14 20 24 40M88 58c0 16-6 28-14 48M124 68c0 14-20 24-50 38"/><path d="M18 18l6 6M140 12l6 6M16 84l8-2"/>'),
 events:A('<circle cx="34" cy="78" r="14"/><circle cx="52" cy="78" r="14"/><ellipse cx="100" cy="42" rx="14" ry="18"/><path d="M100 60c0 14-6 24-10 38"/><rect x="108" y="78" width="14" height="28"/><rect x="126" y="62" width="16" height="44"/><path d="M70 24l3 8 8 1-6 6 2 8-7-4-7 4 2-8-6-6 8-1z"/><path d="M18 108h132"/>')
};

/* estimate builder */
$("#opts").innerHTML=PK.map(function(x){return '<label class="opt"><span>'+x.n+'</span><span>'+plabel(x)+'</span><input type="radio" name="pkg" value="'+x.id+'"'+(x.id===sel?" checked":"")+'></label>'}).join("");
function calc(){
 var p=byId(sel),s="Prices are a guide and can be adjusted to fit your budget.",t;
 $("#hoursRow").hidden=!p.hr;$("#hours").textContent=hrs;
 if(p.p===null){
  $("#total").textContent=p.q;
  $("#saving").textContent="The price depends on your event. The hourly rate (Ksh 2,500 per hour, minimum 2 hours) is a good guide, or contact us for a quote.";
  return;
 }
 t=p.hr?p.p*hrs:p.p;
 if($("#early").checked){var off=Math.round(t*.05);t-=off;s="Early booking saving of "+fmt(off)+" (demo: 5%). Final discount to be confirmed."}
 $("#total").textContent=fmt(t);$("#saving").textContent=s;
}
function setEvent(){if(["wedding","funeral","corporate","birthday","other"].indexOf(sel)>-1)$("#etype").value=sel}
function choose(id,go){
 sel=id;chosen=id;
 var r=document.querySelector('input[name=pkg][value='+id+']');if(r)r.checked=true;
 calc();setEvent();drawSvcs();
 if(go){var q=$(".quote");q.classList.remove("slide");void q.offsetWidth;q.classList.add("slide");toast("You selected "+byId(id).n);$("#estimate").scrollIntoView({behavior:RM?"auto":"smooth",block:"start"})}
}
document.querySelectorAll('input[name=pkg]').forEach(function(r){r.addEventListener("change",function(){choose(r.value,false)})});
$("#plus").onclick=function(){hrs=Math.min(24,hrs+1);calc()};
$("#minus").onclick=function(){hrs=Math.max(2,hrs-1);calc()};
$("#early").onchange=calc;

/* services */
var cats=["All","Weddings","Funerals","Corporate","Birthdays","Any event","Coming soon"];
function drawChips(){$("#chips").innerHTML=cats.map(function(c){return '<button type="button" class="chip" aria-pressed="'+(c===cur)+'">'+c+'</button>'}).join("");
 document.querySelectorAll(".chip").forEach(function(b){b.onclick=function(){cur=b.textContent;drawChips();drawSvcs()}})}
function drawSvcs(){
 var list=PK.filter(function(x){return cur==="All"||x.c===cur});
 var h=list.map(function(x,i){
  var on=chosen===x.id;
  return '<article class="card svc'+(on?' sel':'')+'" style="--i:'+i+'">'+ART[x.art]+'<h3>'+x.n+'</h3><div class="price">'+plabel(x)+'</div><p>'+x.d+'</p><button class="btn'+(on?'':' ghost')+'" data-id="'+x.id+'" type="button" aria-pressed="'+on+'">'+(on?'Selected':'Select')+'</button></article>'}).join("");
 if(cur==="All"||cur==="Coming soon")h+='<article class="card svc soon" style="--i:'+list.length+'"><span class="badge">Coming soon</span><h3>Errand Runner</h3><p>Shopping, pick-ups and deliveries around busy areas, run by university students.</p><button class="btn ghost" id="notify" type="button">Notify me</button></article>';
 $("#svcs").innerHTML=h;
 document.querySelectorAll("[data-id]").forEach(function(b){b.onclick=function(){choose(b.dataset.id,true)}});
 var n=$("#notify");if(n)n.onclick=function(){n.textContent="We will let you know";n.disabled=true;toast("Thanks. Errand Runner updates will reach you first.")};
}
calc();drawChips();drawSvcs();

/* booking form */
var ET=[["wedding","Wedding"],["funeral","Funeral"],["corporate","Corporate event"],["birthday","Birthday party"],["other","Other event or gathering"]];
$("#etype").innerHTML=ET.map(function(e){return '<option value="'+e[0]+'">'+e[1]+'</option>'}).join("");
$("#goBook").addEventListener("click",setEvent);
var d=new Date();d.setDate(d.getDate()+1);$("#date").min=d.toISOString().slice(0,10);
$("#form").addEventListener("submit",function(e){
 e.preventDefault();
 var n=$("#name").value.trim(),ev=$("#etype").selectedOptions[0].text,dt=$("#date").value,v=$("#venue").value.trim(),g=$("#guests").value;
 var pk=byId(sel);
 var txt="Hello Wazing, I would like to book ushers.\nName: "+n+"\nPhone: "+$("#phone").value+"\nEvent: "+ev+"\nDate: "+dt+"\nVenue: "+v+(g?"\nGuests: "+g:"")+"\nPackage interest: "+pk.n+"\nEstimate: "+$("#total").textContent+($("#msg").value?"\nNotes: "+$("#msg").value:"");
 $("#okTitle").textContent="Thank you, "+n.split(" ")[0]+". Your request is ready.";
 $("#okText").textContent=ev+" on "+dt+" in "+v+". This is a demo, so nothing was sent. In the live site this reaches our team by email and WhatsApp.";
 $("#wa").href="https://wa.me/254751954641?text="+encodeURIComponent(txt);
 $("#ok").classList.add("show");$("#ok").scrollIntoView({block:"center"});
});

/* join + menu */
$("#joinBtn").onclick=function(){var c=$("#conduct");c.hidden=!c.hidden;this.textContent=c.hidden?"Show our code of conduct":"Hide our code of conduct"};
$("#menu").onclick=function(){var o=$("#nav").classList.toggle("open");this.setAttribute("aria-expanded",o)};
document.querySelectorAll("nav a").forEach(function(a){a.addEventListener("click",function(){$("#nav").classList.remove("open");$("#menu").setAttribute("aria-expanded","false")})});

/* dark and light mode */
var tb=$("#theme");
var SUN='<svg width="20" height="20" aria-hidden="true"><use href="#i-sun"/></svg>';
var MOON='<svg width="20" height="20" aria-hidden="true"><use href="#i-moon"/></svg>';
function curTheme(){return document.documentElement.dataset.theme||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light")}
function paintTheme(){var dk=curTheme()==="dark";tb.innerHTML=dk?SUN:MOON;tb.setAttribute("aria-label",dk?"Switch to light mode":"Switch to dark mode")}
tb.onclick=function(){var nx=curTheme()==="dark"?"light":"dark";document.documentElement.dataset.theme=nx;try{localStorage.setItem("wz-theme",nx)}catch(e){}paintTheme()};
paintTheme();

/* sections pop forward as they scroll into view */
var secs=document.querySelectorAll("main section:not(.hero)");
secs.forEach(function(s){s.classList.add("reveal")});
if("IntersectionObserver" in window){
 var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.intersectionRatio >= 0.12){
        e.target.classList.add("in");
      }else if(e.intersectionRatio <= 0){
        e.target.classList.remove("in");
      }
    })
  },{threshold:[0, 0.12]});;
 secs.forEach(function(s){io.observe(s)});
}else{secs.forEach(function(s){s.classList.add("in")})}

/* social links not ready yet */
document.querySelectorAll("a[data-soon]").forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();toast("Our "+a.dataset.soon+" link is coming soon")})});
