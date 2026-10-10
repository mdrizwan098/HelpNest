const I={

cam:'<svg viewBox="0 0 24 24"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',

clip:'<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 11h6M9 15h4"/></svg>',

chat:'<svg viewBox="0 0 24 24"><path d="M4 12a8 7 0 1 1 3.5 5.7L4 19l1.2-3.4A7 7 0 0 1 4 12z"/></svg>',

chev:'<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',

back:'<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',

bell:'<svg viewBox="0 0 24 24"><path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4"/></svg>',

head:'<svg viewBox="0 0 24 24"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="2"/><rect x="17" y="14" width="4" height="6" rx="2"/><path d="M19 20c0 1-2 2-5 2"/></svg>',

life:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/></svg>',

tick:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',

vid:'<svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="3"/><path d="M16 10.5l5-3v9l-5-3z"/></svg>'};

const ZOOM="https://zoom.us/j/0000000000"; // replace with the real Zoom meeting link created by your system

let stream;

async function openCall(){

 $("#call").classList.remove("hide");$("#cst").textContent="Connecting…";

 try{stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});$("#me").srcObject=stream;$("#me").classList.remove("hide")}

 catch(e){$("#me").classList.add("hide");$("#cst").textContent="Connecting… (camera not available, you can still talk)"}

 setTimeout(()=>{if(!$("#call").classList.contains("hide"))$("#cst").textContent="Connected"},2500);

}

function endCall(){stream&&stream.getTracks().forEach(t=>t.stop());stream=null;$("#call").classList.add("hide")}

const S={view:"home",mode:"photo",text:"",err:"",photos:[],fixIdx:0,ticket:null,chat:[],notes:[],unread:0};

// Local-only persistence: this data stays in this browser on this device.
const LOCAL_KEY="helpnest.local.v1";
function saveLocalState(){
 try{
  localStorage.setItem(LOCAL_KEY,JSON.stringify({
   ticket:S.ticket,chat:S.chat,text:S.text,err:S.err,notes:S.notes,unread:S.unread,
   savedAt:new Date().toISOString()
  }));
 }catch(e){console.warn("HelpNest could not save local data.",e)}
}
function restoreLocalState(){
 try{
  const raw=localStorage.getItem(LOCAL_KEY);
  if(!raw)return;
  const saved=JSON.parse(raw);
  if(!saved||typeof saved!=="object")return;
  S.ticket=saved.ticket||null;
  S.chat=Array.isArray(saved.chat)?saved.chat:[];
  S.text=typeof saved.text==="string"?saved.text:"";
  S.err=typeof saved.err==="string"?saved.err:"";
  S.notes=Array.isArray(saved.notes)?saved.notes:[];
  S.unread=Number.isFinite(saved.unread)?saved.unread:0;
  // Photos are intentionally not stored because image data can exceed browser storage limits.
  if(S.ticket)S.view="ticket";
 }catch(e){console.warn("HelpNest could not restore local data.",e)}
}
function clearLocalTicket(){
 S.ticket=null;S.chat=[];S.text="";S.err="";S.photos=[];
 try{localStorage.removeItem(LOCAL_KEY)}catch(e){console.warn("HelpNest could not clear local data.",e)}
}

const $=s=>document.querySelector(s);

const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

const cat=()=>(GUESS.find(([r])=>new RegExp(r,"i").test(S.text+" "+S.err))||[0,"other"])[1];

const has=()=>!!(S.text.trim()||S.err.trim()||S.photos.length);

$("#logo").innerHTML=I.life;$("#bell").innerHTML=I.bell;



function bell(){

 $("#bell").querySelector("i")?.remove();

 if(S.unread)$("#bell").insertAdjacentHTML("beforeend","<i></i>");

 $("#notes").innerHTML=S.notes.length?S.notes.map(n=>`<p>${esc(n)}</p>`).join(""):'<p class="e">No updates yet. We\'ll tell you here when something changes.</p>';

}

$("#bell").onclick=()=>{const n=$("#notes");n.classList.toggle("hide");S.unread=0;bell()};

function note(t){S.notes.unshift(t);S.unread++;bell();saveLocalState()}

function go(v,m){S.view=v;if(m)S.mode=m;render();window.scrollTo({top:0,behavior:"smooth"})}

function stp(n){return `<div class="stp">${["Describe","Quick fix","Get help"].map((t,i)=>`<div class="${n===i+1?"on":n>i+1?"dn":""}">${n>i+1?"✓ ":""}${t}</div>`).join("")}</div>`}

function addPhoto(f){if(!f||!f.type.startsWith("image/"))return;const r=new FileReader();r.onload=()=>{S.photos.push(r.result);if(S.view==="compose"){drawPhotos();check()}};r.readAsDataURL(f)}

function drawPhotos(){const el=$("#photos");if(!el)return;

 el.innerHTML=S.photos.map((p,i)=>`<div class="thumb"><img src="${p}" alt="Photo ${i+1}"><button aria-label="Remove photo ${i+1}" data-rm="${i}">×</button></div>`).join("");

 el.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{S.photos.splice(+b.dataset.rm,1);drawPhotos();check()})}

function check(){const b=$("#next");if(b)b.disabled=!has()}

const helpCard=(t)=>`<div class="help"><h3>${I.head}Need a real person?</h3><p>${t}</p><button class="btn pri" id="human" style="width:auto">Talk to a technician</button></div>`;



function render(){

 const a=$("#app");

 if(S.view==="home"){

  a.innerHTML=`<p class="eyebrow">👋 Hello! Your personal tech assistant</p><h1>What can we help you fix today?</h1>

  <p class="sub">Don't worry about technical terms. Just show us what's happening.</p><div class="chips"><span>⚡ Replies in about 5 min</span><span>🙂 No jargon, ever</span><span>👩‍💻 Real technicians</span></div>

  <div class="list">

   <button class="opt" data-m="photo"><span class="ic">${I.cam}</span><span class="tx"><b>Upload a photo or screenshot</b><small>Show us the error on your screen.</small></span><span class="ch">${I.chev}</span></button>

   <button class="opt" data-m="error"><span class="ic">${I.clip}</span><span class="tx"><b>Paste your error message</b><small>Copy and paste anything you don't understand.</small></span><span class="ch">${I.chev}</span></button>

   <button class="opt" data-m="words"><span class="ic">${I.chat}</span><span class="tx"><b>Explain it in your own words</b><small>For example: “My Wi-Fi is not working.”</small></span><span class="ch">${I.chev}</span></button>

  </div>${helpCard("Our support team can help if the steps don't solve your problem.")}`;

  a.querySelectorAll(".opt").forEach(b=>b.onclick=()=>go("compose",b.dataset.m));

  $("#human").onclick=()=>has()?makeTicket():go("compose","words");

 }

 else if(S.view==="compose"){

  const M=S.mode,T={photo:"Show us the problem",error:"Paste the error message",words:"Tell us what's happening"};

  const body=M==="photo"?`<div class="row"><button class="btn out" id="cam">${I.cam} Take a photo</button><button class="btn out" id="up">${I.clip.replace(/<svg/,"<svg")} Choose from gallery</button></div>

   <div class="photos" id="photos"></div><label class="lbl" for="n1" style="margin-top:18px">Add a short note (optional)</label><input type="text" id="n1" placeholder="e.g. This appeared when I opened my email" value="${esc(S.text)}">`

   :M==="error"?`<label class="lbl" for="t2">Error message</label><textarea id="t2" placeholder="Paste the message here">${esc(S.err)}</textarea><p class="hint">You can also paste a screenshot straight into this box.</p><div class="photos" id="photos"></div>`

   :`<label class="lbl" for="t3">Describe the problem</label><textarea id="t3" placeholder="For example: My printer says offline and nothing comes out.">${esc(S.text)}</textarea><p class="hint">Plain words are perfect. You can paste a screenshot here too.</p><div class="photos" id="photos"></div>`;

  a.innerHTML=`<button class="back" id="back">${I.back} Back</button>${stp(1)}<h1>${T[M]}</h1><p class="sub">Add as much or as little as you like.</p>

  <div class="seg" role="group" aria-label="How to describe it">${[["photo","Photo"],["error","Error message"],["words","Own words"]].map(([k,l])=>`<button data-k="${k}" aria-pressed="${k===M}">${l}</button>`).join("")}</div>

  <div class="card">${body}<input type="file" id="fcam" accept="image/*" capture="environment" class="hide"><input type="file" id="fup" accept="image/*" multiple class="hide"></div>

  <button class="btn pri" id="next" disabled>See quick fixes</button>`;

  $("#back").onclick=()=>go("home");

  a.querySelectorAll(".seg button").forEach(b=>b.onclick=()=>go("compose",b.dataset.k));

  const bind=(id,key)=>{const e=$(id);if(!e)return;e.oninput=()=>{S[key]=e.value;check()};e.addEventListener("paste",ev=>{[...(ev.clipboardData?.items||[])].forEach(i=>{if(i.type.startsWith("image/")){ev.preventDefault();addPhoto(i.getAsFile())}})})};

  bind("#n1","text");bind("#t2","err");bind("#t3","text");

  if(M==="photo"){$("#cam").onclick=()=>$("#fcam").click();$("#up").onclick=()=>$("#fup").click();$("#fcam").onchange=e=>[...e.target.files].forEach(addPhoto);$("#fup").onchange=e=>[...e.target.files].forEach(addPhoto)}

  $("#next").onclick=()=>{S.fixIdx=0;go("fix")};drawPhotos();check();

 }

 else if(S.view==="fix"){

  const L=FIXES[cat()],f=L[S.fixIdx],last=S.fixIdx===L.length-1;

  a.innerHTML=`<button class="back" id="back">${I.back} Edit my description</button>${stp(2)}<h1>Let's try a quick fix</h1><p class="sub">Most problems like this are solved in a minute or two.</p>

  <div class="card fix"><span class="tag">Idea ${S.fixIdx+1} of ${L.length}</span><h2>${f[0]}</h2><ol>${f.slice(1).map(s=>`<li>${s}</li>`).join("")}</ol>

  <div class="row"><button class="btn ok" id="yes">${I.tick} That fixed it</button><button class="btn out" id="no">${last?"Still not working":"Didn't work, next idea"}</button></div></div>

  ${helpCard("Stuck or in a hurry? A technician can take over.")}`;

  $("#back").onclick=()=>go("compose");$("#yes").onclick=()=>go("done");

  $("#no").onclick=()=>last?makeTicket():(S.fixIdx++,render());$("#human").onclick=makeTicket;

 }

 else if(S.view==="done"){

  a.innerHTML=`<div class="card big"><div class="ok">${I.tick}</div><h1>Glad that worked!</h1><p class="sub">If it comes back, we're here. Asking again is always fine.</p><button class="btn pri" id="again">Report another problem</button></div>`;

  $("#again").onclick=()=>{Object.assign(S,{text:"",err:"",photos:[],ticket:null,chat:[]});go("home")};

 }

 else ticketView();

}

$("#end").onclick=endCall;

$("#mic").onclick=e=>{const t=stream?.getAudioTracks()[0];if(t){t.enabled=!t.enabled;e.target.textContent=t.enabled?"Mute":"Unmute"}};

$("#cmr").onclick=e=>{const t=stream?.getVideoTracks()[0];if(t){t.enabled=!t.enabled;e.target.textContent=t.enabled?"Camera off":"Camera on"}};

restoreLocalState();bell();render();
