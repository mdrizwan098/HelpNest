// Ticket view and support-request demo logic.
function makeTicket(){

 S.ticket={id:"HN-"+Math.floor(1000+Math.random()*9000),pos:2,eta:5,stage:0,tech:"Priya"};

 S.chat=[{who:"tech",text:"Hi, I've received your request and details. I'll be with you shortly. Is there a good number or time to reach you?"}];

 saveLocalState();
 note(`Request ${S.ticket.id} received.`);go("ticket");

 clearTimeout(S.t1);clearTimeout(S.t2);clearTimeout(S.t3);

 S.ticket.avail=Math.random()<.5;

 S.t3=setTimeout(()=>{S.ticket.link=true;saveLocalState();note("Your video call is ready. Tap Join.");if(S.view==="ticket")ticketView(1)},S.ticket.avail?9000:40000);

 S.t1=setTimeout(()=>{S.ticket.stage=1;S.ticket.pos=1;S.ticket.eta=3;saveLocalState();note("Priya is reading your request.");if(S.view==="ticket")ticketView(1)},5000);

 S.t2=setTimeout(()=>{S.ticket.stage=2;S.ticket.pos=0;S.ticket.eta=1;S.chat.push({who:"tech",text:"I'm looking at it now. What do you see on your screen right now?"});saveLocalState();note("Priya is ready to help you now.");if(S.view==="ticket")ticketView(1)},12000);

}

function ticketView(keep){

 const T=S.ticket,st=["Request received","Priya is reading your details","Priya is ready to help you"],prev=$("#chatin")?.value||"";

 $("#app").innerHTML=`${stp(3)}<span class="live">Technicians online</span><h1>Your support request</h1><p class="sub">This prototype saves your demo ticket in this browser. It has not been sent to a real technician.</p>

 <div class="card"><p class="hint">Local demo only · saved on this device · no real technician is connected.</p><div class="ticket"><div><small>Request number</small><b>${T.id}</b></div><div><small>${T.pos?"People ahead":"Your turn"}</small><b>${T.pos||"Now"}</b></div><div><small>Expected wait</small><b>\~${T.eta} min</b></div></div>

 <ul class="tl">${st.map((s,i)=>`<li class="${i<T.stage?"done":i===T.stage?"now":""}">${s}</li>`).join("")}</ul></div>

 ${T.link?`<div class="card vid ready"><div class="vh">${I.vid}<div><b>Your video call is ready</b><small>${T.tech} is waiting for you.</small></div></div><div class="row"><a class="btn pri" href="${ZOOM}" target="_blank" rel="noopener">Join with Zoom</a><button class="btn out" id="joinweb">Join here in the browser</button></div></div>`:`<div class="card vid"><div class="vh">${I.vid}<div><b>Video help</b><small>${T.avail?"A technician is free right now. Your video link will appear here in a few seconds.":"All technicians are on other calls. Expected in about 10 minutes. We'll show your video link here and notify you."}</small></div></div></div>`}

 <div class="card"><span class="lbl">Chat with ${T.tech}</span><div class="chat" id="chat" aria-live="polite">${S.chat.map(m=>`<div class="msg ${m.who}">${m.who==="tech"?`<small>${T.tech}, HelpNest</small>`:""}${esc(m.text)}</div>`).join("")}</div>

 <div class="send"><input type="text" id="chatin" placeholder="Type a message" aria-label="Message"><button class="btn pri" id="sendb" style="width:auto">Send</button></div>

 <p class="hint" style="margin-top:16px">Prefer a call? Leave your number.</p>

 <div class="send" style="margin-top:6px"><input type="tel" id="tel" placeholder="Phone number" aria-label="Phone number"><button class="btn out" id="callb">Call me</button></div><div class="toast" id="toast"></div></div>

 <div class="card"><p class="sum">What you told us<q>${esc([S.text,S.err].filter(x=>x.trim()).join("\n")||"(Photos only)")}</q></p>

 ${S.photos.length?`<div class="photos">${S.photos.map((p,i)=>`<div class="thumb"><img src="${p}" alt="Your photo ${i+1}"></div>`).join("")}</div>`:""}</div>

 <button class="btn out" id="done" style="width:100%">It's working now. Close my request</button>`;

 const ci=$("#chatin");ci.value=prev;if(keep&&prev)ci.focus();const c=$("#chat");c.scrollTop=c.scrollHeight;

 const send=()=>{const v=ci.value.trim();if(!v)return;S.chat.push({who:"me",text:v});saveLocalState();setTimeout(()=>{S.chat.push({who:"tech",text:"Thanks, got it. I'm on it."});saveLocalState();if(S.view==="ticket")ticketView(1)},1800);ci.value="";ticketView(1)};

 $("#sendb").onclick=send;ci.onkeydown=e=>{if(e.key==="Enter")send()};

 $("#callb").onclick=()=>{const n=$("#tel").value.trim();$("#toast").textContent=n?`We'll call ${n} as soon as a technician is free.`:"Please type your phone number first."};

 $("#done").onclick=()=>go("done");$("#joinweb")&&($("#joinweb").onclick=openCall);

}
