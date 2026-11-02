var PK=[
 {id:"wedding",n:"Wedding Usher Team",p:10000,d:"Full team to ensure smooth wedding flow, guest guidance and VIP coordination.",c:"Weddings"},
 {id:"funeral",n:"Funeral Usher Team",p:8000,d:"Compassionate and organised ushering that maintains dignity and order.",c:"Funerals"},
 {id:"corporate",n:"Corporate Events",p:12000,d:"Seminars, conferences and corporate gatherings handled professionally.",c:"Corporate"},
 {id:"birthday",n:"Birthday Parties",p:null,d:"Friendly ushers to welcome and guide guests. Priced by the hour or tailored to your party.",c:"Birthdays"},
 {id:"hourly",n:"Hourly Rate",p:2500,d:"Ideal for short events or add-on services. Minimum 2 hours.",c:"Any event",hr:true},
 {id:"premium",n:"Premium Package",p:18000,d:"Full team, 6+ hours, all-inclusive service for high-standard events.",c:"Any event"}
];
var $=function(s){return document.querySelector(s)};
var fmt=function(n){return "Ksh "+n.toLocaleString("en-KE")};
var sel="wedding",hrs=2;
function toast(t){var e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.remove("show")},2400)}

/* estimate builder */
var quotable=PK.filter(function(x){return x.id!=="birthday"});
$("#opts").innerHTML=quotable.map(function(x){return '<label class="opt"><span>'+x.n+'</span><span>'+(x.hr?"Ksh 2,500/hr":fmt(x.p))+'</span><input type="radio" name="pkg" value="'+x.id+'"'+(x.id===sel?" checked":"")+'></label>'}).join("");
function calc(){
 var p=PK.filter(function(x){return x.id===sel})[0],t=p.hr?p.p*hrs:p.p,s="Prices are a guide and can be adjusted to fit your budget.";
 $("#hoursRow").hidden=!p.hr;$("#hours").textContent=hrs;
 if($("#early").checked){var off=Math.round(t*.05);t-=off;s="Early booking saving of "+fmt(off)+" (demo: 5%). Final discount to be confirmed."}
 $("#total").textContent=fmt(t);$("#saving").textContent=s;
}
document.querySelectorAll('input[name=pkg]').forEach(function(r){r.addEventListener("change",function(){sel=r.value;calc()})});
$("#plus").onclick=function(){hrs=Math.min(24,hrs+1);calc()};
$("#minus").onclick=function(){hrs=Math.max(2,hrs-1);calc()};
$("#early").onchange=calc;
calc();

/* services */
var cats=["All","Weddings","Funerals","Corporate","Birthdays","Any event","Coming soon"];
var cur="All";
function drawChips(){$("#chips").innerHTML=cats.map(function(c){return '<button type="button" class="chip" aria-pressed="'+(c===cur)+'">'+c+'</button>'}).join("");
 document.querySelectorAll(".chip").forEach(function(b){b.onclick=function(){cur=b.textContent;drawChips();drawSvcs()}})}
function drawSvcs(){
 var h=PK.filter(function(x){return cur==="All"||x.c===cur}).map(function(x){
  return '<article class="card svc"><h3>'+x.n+'</h3><div class="price">'+(x.p?(x.hr?"Ksh 2,500/hour":fmt(x.p)):"Ask for a quote")+'</div><p>'+x.d+'</p><button class="btn ghost" data-id="'+x.id+'" type="button">Choose this</button></article>'}).join("");
 if(cur==="All"||cur==="Any event")h+='<article class="card svc"><h3>Other events and gatherings</h3><div class="price">Tailored</div><p>Any occasion, small or big. We work as you direct us.</p><button class="btn ghost" data-id="other" type="button">Ask about your event</button></article>';
 if(cur==="All"||cur==="Coming soon")h+='<article class="card svc soon"><span class="badge">Coming soon</span><h3>Errand Runner</h3><p>Shopping, pick-ups and deliveries around busy areas, run by university students.</p><button class="btn ghost" id="notify" type="button">Notify me</button></article>';
 $("#svcs").innerHTML=h;
 document.querySelectorAll("[data-id]").forEach(function(b){b.onclick=function(){var id=b.dataset.id;if(id!=="other"){sel=id;var r=document.querySelector('input[value='+id+']');if(r){r.checked=true}calc()}
  setEvent(id);location.hash="#book";toast("Added to your booking")}});
 var n=$("#notify");if(n)n.onclick=function(){n.textContent="We will let you know";n.disabled=true;toast("Thanks. Errand Runner updates will reach you first.")};
}
drawChips();drawSvcs();

/* booking form */
var ET=[["wedding","Wedding"],["funeral","Funeral"],["corporate","Corporate event"],["birthday","Birthday party"],["other","Other event or gathering"]];
$("#etype").innerHTML=ET.map(function(e){return '<option value="'+e[0]+'">'+e[1]+'</option>'}).join("");
function setEvent(id){var v=(id==="hourly"||id==="premium")?$("#etype").value:id;$("#etype").value=v}
$("#goBook").addEventListener("click",function(){if(["wedding","funeral","corporate"].indexOf(sel)>-1)setEvent(sel)});
var d=new Date();d.setDate(d.getDate()+1);$("#date").min=d.toISOString().slice(0,10);
$("#form").addEventListener("submit",function(e){
 e.preventDefault();
 var n=$("#name").value.trim(),ev=$("#etype").selectedOptions[0].text,dt=$("#date").value,v=$("#venue").value.trim(),g=$("#guests").value;
 var pk=PK.filter(function(x){return x.id===sel})[0];
 var txt="Hello Wazing, I would like to book ushers.\nName: "+n+"\nPhone: "+$("#phone").value+"\nEvent: "+ev+"\nDate: "+dt+"\nVenue: "+v+(g?"\nGuests: "+g:"")+"\nPackage interest: "+pk.n+"\nEstimate: "+$("#total").textContent+($("#msg").value?"\nNotes: "+$("#msg").value:"");
 $("#okTitle").textContent="Thank you, "+n.split(" ")[0]+". Your request is ready.";
 $("#okText").textContent=ev+" on "+dt+" in "+v+". This is a demo, so nothing was sent. In the live site this reaches our team by email and WhatsApp.";
 $("#wa").href="https://wa.me/254751954641?text="+encodeURIComponent(txt);
 $("#ok").classList.add("show");$("#ok").scrollIntoView({block:"center"});
});

/* join + menu */
$("#joinBtn").onclick=function(){var c=$("#conduct");c.hidden=!c.hidden;this.textContent=c.hidden?"Show our code of conduct":"Hide our code of conduct"};
$("#menu").onclick=function(){var o=$("#nav").classList.toggle("open");this.setAttribute("aria-expanded",o)};
document.querySelectorAll("nav a").forEach(function(a){a.addEventListener("click",function(){$("#nav").classList.remove("open")})});
