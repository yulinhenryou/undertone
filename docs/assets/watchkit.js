/* Undertone watch kit · renders the Figma "focused core" screens (198 × 242 pt) as live HTML.
   Usage: <div class="wk" data-s="undertone" style="--w:120px"></div>  (optional data-device="1") */
(function(){
const A='#FFB547', G='#C7C7CC';
const ic=(p,s=14,extra='')=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${p}</svg>`;
const I={
  spkOff: ic('<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" stroke="none"/><path d="M17 9l5 6M22 9l-5 6"/>'),
  spkOn:  ic('<path d="M3 9h4l5-4v14l-5-4H3z" fill="currentColor" stroke="none"/><path d="M15.5 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>'),
  crown:  ic('<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v4.5h-4.5"/>'),
  micOff: ic('<rect x="9" y="2.5" width="6" height="11" rx="3" fill="currentColor" stroke="none"/><path d="M5.5 11a6.5 6.5 0 0 0 11 4.7M12 17.5V21M4 4l16 16"/>',18),
  warn: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2.5 23 21.5H1z" fill="#FFD60A"/><path d="M12 9.5v5M12 17.6v.2" stroke="#000" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  moon: ic('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="currentColor" stroke="none"/>',13),
  note: ic('<path d="M9 18V5l11-2v13" /><circle cx="6.5" cy="18" r="2.6" fill="currentColor"/><circle cx="17.5" cy="16" r="2.6" fill="currentColor"/>'),
  wifiOff: ic('<path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r="1.3" fill="currentColor" stroke="none"/><path d="M3 3l18 18"/>',26),
  app: `<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="${A}"/><path d="M7 14.5a5 5 0 0 1 10 0M9.6 14.5a2.4 2.4 0 0 1 4.8 0" stroke="#000" stroke-width="1.9" fill="none" stroke-linecap="round"/><circle cx="12" cy="15" r="1.2" fill="#000"/></svg>`
};
const nav=(t,clock='10:42')=>`<div class="wk-nav"><span style="color:${A}">${t}</span><span>${clock}</span></div>`;
const bar=n=>`<div class="wk-bar">${[3,2,1].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</div>`;
const off=`<div class="wk-off"><span class="c">${I.micOff}</span><b>Turn off</b></div>`;
/* stage light: the screen warms from below as you turn up (colour supports the words, never replaces them) */
const GLOW=['', 'radial-gradient(closest-side,rgba(255,181,71,.55),rgba(255,181,71,0))','radial-gradient(closest-side,rgba(255,143,90,.7),rgba(255,143,90,0))','radial-gradient(closest-side,rgba(255,214,150,.85),rgba(242,85,127,.55) 55%,rgba(242,85,127,0))'];
const glow=n=>n?`<div class="wk-glow" style="background:${GLOW[n]}"></div>`:'';
const level=(name,lit,on,txt)=>glow(lit)+nav('Room 7')+bar(lit)+`<div class="wk-b"><div class="wk-lv">${name}</div>
  <div class="wk-row ${on?'on':''}"><span style="color:${on?A:G}">${on?I.spkOn:I.spkOff}</span>${txt}</div>`;
const btn=(t,pri,top)=>`<div class="wk-btn ${pri?'pri':''}" style="top:${top}px">${t}</div>`;
const S={
  arrival:()=>`<div class="wk-b" style="top:24px"><div class="wk-app">${I.app}<span>UNDERTONE</span></div>
     <div class="wk-t" style="margin-top:8px">Room 7 is singing</div><div class="wk-p">Mic stays off. Turn the side wheel when you want to sing.</div></div>
     ${btn('Enter room',1,148)}${btn('Not tonight',0,194)}`,
  seat:()=>nav('You: seat 6')+`<svg class="wk-map" width="150" height="120" viewBox="0 0 150 120">
     <rect x="34" y="4" width="82" height="6" rx="3" fill="#BF5AF2"/>
     <rect x="50" y="58" width="49" height="31" rx="6" fill="#1C1C1E" stroke="#2C2C2E"/>
     ${[[24,48],[24,70],[24,91],[49,106],[82,106],[115,70],[115,48]].map(p=>`<circle cx="${p[0]+5}" cy="${p[1]+5}" r="5" fill="#8E8E93"/>`).join('')}
     <circle cx="119.5" cy="96.5" r="7.5" fill="${A}"/><circle cx="119.5" cy="96.5" r="12" fill="none" stroke="${A}" stroke-opacity=".45"/></svg>`+btn('I’m in seat 6',1,194),
  listening:()=>level('Listening',0,0,'Mic off')+`<div class="wk-hint"><span>${I.crown}</span>Turn wheel to join</div><div class="wk-sub">Turn down to stop.</div></div>`,
  undertone:()=>level('Undertone',1,1,'Mic on · softly')+`</div>`+off,
  harmony:()=>level('Harmony',2,1,'Mic on · clearly')+`</div>`+off,
  duet:()=>level('Duet',3,1,'Mic on · up front')+`</div>`+off,
  noise:()=>level('Undertone',1,1,'Mic on · softly')+`</div><div class="wk-plat">${I.warn}<span>Room noise is high<small>Staying soft</small></span></div>`+off,
  wrist:()=>level('Undertone',1,1,'Mic on · softly')+`</div><div class="wk-plat"><span style="color:${G}">${I.moon}</span><span>Screen asleep<small>Turning down works</small></span></div>`+off,
  solo:()=>level('Listening',0,0,'Mic off')+`<div class="wk-row"><span style="color:${G}">${I.note}</span>This song is solo</div><div class="wk-sub" style="margin-top:12px">Join the next open song</div></div>`,
  lost:()=>nav('Room 7')+`<div class="wk-b"><span style="color:${G}">${I.wifiOff}</span><div class="wk-t" style="margin-top:4px">Lost Room 7</div><div class="wk-p">Your mic turned off.<br>It stays off.</div></div>`+btn('Reconnect',1,194),
  face:()=>`<div class="wk-face"><div class="tm">10:42</div><div class="dt">TUE 13</div><div class="cp">${I.app}<span>Room 7 · join</span></div></div>`,
  ended:()=>nav('Room 7')+`<div class="wk-b"><div class="wk-t" style="font-size:15px">Mic off</div><div class="wk-p" style="font-size:14px">The song ended.<br>Your mic stays off.</div></div>`+btn('Done',1,194),
  touch:()=>level('Undertone',1,1,'Mic on · softly')+`</div><div class="wk-tc" style="top:146px"><span>−&nbsp; Softer</span><span>+&nbsp; Louder</span></div>`+off,
  touchListen:()=>level('Listening',0,0,'Mic off')+`<div class="wk-sub" style="padding-left:0;margin-top:12px">Or turn the wheel.</div></div>`+btn('Join softly',1,194),
  large:()=>nav('Room 7')+bar(0)+`<div class="wk-b"><div class="wk-lv" style="font-size:37px;line-height:41px">Listening</div><div class="wk-row" style="font-size:19px;line-height:23px;margin-top:6px"><span style="color:${G}">${I.spkOff}</span>Mic off</div><div class="wk-hint" style="font-size:18px;line-height:22px;margin-top:12px"><span>${I.crown}</span>Turn wheel to join</div><div class="wk-sub" style="font-size:16px;line-height:20px">Turn down to stop.</div></div>`,
  /* historical (for iteration comparisons) */
  old_arrival:()=>`<div class="wk-b" style="top:24px"><div class="wk-app">${I.app}<span>UNDERTONE</span></div>
     <div class="wk-t" style="margin-top:8px">Room 7 is singing</div><div class="wk-p">Join quietly. Your mic stays off until you turn the crown.</div></div>
     ${btn('Join quietly',1,148)}${btn('Not tonight',0,194)}`,
  old_listening:()=>level('Listening',0,0,'Mic off')+`<div class="wk-row"><span style="color:${G}">${ic('<path d="M3 3l18 18M10.6 5.2A10 10 0 0 1 22 12a17 17 0 0 1-3 3.6M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.6 9.6 0 0 0 4.4-1"/>')}</span>Name hidden</div><div class="wk-hint"><span>${I.crown}</span>Turn the crown to join</div></div>`,
  old_noise:()=>level('Undertone',1,1,'Soft, in the chorus')+`</div><div class="wk-plat">${I.warn}<span>Too loud near you<small>Staying soft</small></span></div>`+off,
  old_tip:()=>nav('Tip')+`<div class="wk-b"><div class="wk-plat" style="position:static;width:168px"><span style="color:${A}">${I.crown}</span><span>Turn down to go silent<small>or tap Turn off</small></span></div></div>`+btn('Got it',1,194),
  old_seat:()=>nav('Your seat')+`<svg class="wk-map" width="150" height="120" viewBox="0 0 150 120">
     <rect x="34" y="4" width="82" height="6" rx="3" fill="#BF5AF2"/>
     <rect x="50" y="58" width="49" height="31" rx="6" fill="#1C1C1E" stroke="#2C2C2E"/>
     ${[[24,48],[24,70],[24,91],[49,106],[82,106],[115,70],[115,48]].map(p=>`<circle cx="${p[0]+5}" cy="${p[1]+5}" r="5" fill="#48484A"/>`).join('')}
     <circle cx="119.5" cy="96.5" r="7.5" fill="${A}"/></svg>`+btn('I’m in seat 6',1,194),
  old_duet:()=>nav('Room 7')+bar(3)+`<div class="wk-b"><div class="wk-lv">Duet</div><div class="wk-row on"><span style="color:${A}">${I.spkOn}</span>Beside the lead</div><div class="wk-row on"><span style="color:${A}">${ic('<circle cx="12" cy="8" r="4" fill="currentColor" stroke="none"/><path d="M4 21a8 8 0 0 1 16 0z" fill="currentColor" stroke="none"/>')}</span>Name shown</div></div>`+off,
  old_step:()=>`<div class="wk-b" style="top:26px"><div class="wk-t">Step forward?</div><div class="wk-p">Everyone in Room 7 will see your name next to the singer’s.</div></div>${btn('<span style="color:'+A+'">Step forward</span>',0,148)}${btn('Stay in Harmony',0,194)}`,
  old_reveal:()=>`<div class="wk-b" style="top:26px"><div class="wk-t">Show your name?</div><div class="wk-p">Everyone in Room 7 sees your name for 5 seconds.</div></div>${btn('<span style="color:'+A+'">Show on screen</span>',0,148)}${btn('Keep private',0,194)}`
};
const css=`
.wk{position:relative;display:inline-block;--w:198px;width:var(--w);height:calc(var(--w)*242/198)}
.wk .wk-clip{position:absolute;left:0;top:0;width:var(--w);height:calc(var(--w)*242/198);overflow:hidden;border-radius:calc(var(--w)*40/198)}
.wk .wk-scr{position:absolute;left:0;top:0;width:198px;height:242px;transform:scale(var(--k,1));transform-origin:0 0}
.wk-scr{text-align:left;background:#000;border-radius:40px;overflow:hidden;font-family:Inter,system-ui,sans-serif;color:#fff;-webkit-font-smoothing:antialiased;letter-spacing:-.005em}
.wk-nav{position:absolute;top:8px;left:24px;right:24px;display:flex;justify-content:space-between;font:600 15px/18px Inter}
.wk-b{position:absolute;left:10px;top:30px;right:20px}
.wk-lv{font:700 30px/34px Inter;letter-spacing:-.02em}
.wk-row{display:flex;align-items:center;gap:6px;font:400 15px/18px Inter;color:${G};margin-top:5px}
.wk-row.on{color:#fff}.wk-row svg,.wk-hint svg{display:block}
.wk-hint{display:flex;align-items:center;gap:6px;font:400 14px/17px Inter;color:${A};margin-top:14px}
.wk-sub{font:400 13px/16px Inter;color:${G};margin-top:4px;padding-left:20px}
.wk-glow{position:absolute;left:-40px;right:-40px;top:96px;height:260px;pointer-events:none}
.wk-bar{position:absolute;left:186px;top:44px;width:6px;height:66px;border-radius:3px;background:#2C2C2E;overflow:hidden;display:flex;flex-direction:column;gap:1.5px}
.wk-bar i{flex:1;background:transparent}.wk-bar i.on{background:${A}}
.wk-off{position:absolute;left:10px;top:194px;height:40px;width:111px;border-radius:20px;background:#2C2C2E;display:flex;align-items:center;font:600 14px/1 Inter}
.wk-off .c{width:40px;height:40px;display:flex;align-items:center;justify-content:center}
.wk-off b{font-weight:600;margin-left:4px}
.wk-plat{position:absolute;left:10px;top:117px;width:178px;box-sizing:border-box;background:#1C1C1E;border-radius:14px;padding:9px 11px;display:flex;gap:8px;align-items:flex-start;font:400 14px/17px Inter}
.wk-plat small{display:block;color:${G};font-size:13px;line-height:16px;margin-top:2px}
.wk-btn{position:absolute;left:10px;width:168px;height:40px;border-radius:20px;background:#2C2C2E;display:flex;align-items:center;justify-content:center;font:600 16px/1 Inter}
.wk-btn.pri{background:${A};color:#000}
.wk-tc{position:absolute;left:10px;width:178px;display:flex;gap:6px}
.wk-tc span{flex:1;height:40px;border-radius:20px;background:#2C2C2E;display:flex;align-items:center;justify-content:center;font:600 15px/1 Inter;color:#fff}
.wk-app{display:flex;align-items:center;gap:6px;font:600 13px/1 Inter;color:${G};letter-spacing:.02em}
.wk-t{font:600 18px/22px Inter}
.wk-p{font:400 15px/18px Inter;color:${G};margin-top:4px}
.wk-map{position:absolute;left:24px;top:36px}
.wk-face{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;padding-top:40px}
.wk-face .tm{font:300 64px/1 Inter;letter-spacing:-.03em}.wk-face .dt{font:600 14px/1 Inter;color:${A};margin-top:8px;letter-spacing:.04em}
.wk-face .cp{position:absolute;left:31px;top:182px;height:36px;padding:0 12px 0 9px;border-radius:20px;background:#2C2C2E;display:flex;align-items:center;gap:7px;font:600 14px/1 Inter}
/* device */
.wk.dev .wk-scr{box-shadow:none}
.wk-device{position:absolute;pointer-events:none}
`;
function deviceSVG(id,band,light){
  band=band||null;
  /* front view of a 45 mm-class watch, in screen units: screen at (0,0)-(198,242) */
  return `<svg class="wk-device" viewBox="-40 -100 300 442" style="left:calc(var(--w)*-40/198);top:calc(var(--w)*-100/198);width:calc(var(--w)*300/198);height:calc(var(--w)*442/198)" aria-hidden="true">
  <defs>
   ${band?`<linearGradient id="band${id}" x1="0" x2="1"><stop offset="0" stop-color="${band}" stop-opacity=".78"/><stop offset=".2" stop-color="${band}"/><stop offset=".8" stop-color="${band}"/><stop offset="1" stop-color="${band}" stop-opacity=".78"/></linearGradient>`:`<linearGradient id="band${id}" x1="0" x2="1"><stop offset="0" stop-color="#121214"/><stop offset=".18" stop-color="#232327"/><stop offset=".5" stop-color="#2a2a2f"/><stop offset=".82" stop-color="#202024"/><stop offset="1" stop-color="#101012"/></linearGradient>`}
   <linearGradient id="bfade${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity="1"/></linearGradient>
   <linearGradient id="bfade2${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity="1"/></linearGradient>
   <mask id="m1${id}"><rect x="-40" y="-100" width="300" height="90" fill="url(#bfade${id})"/></mask>
   <mask id="m2${id}"><rect x="-40" y="252" width="300" height="90" fill="url(#bfade2${id})"/></mask>
   ${light?`<linearGradient id="case${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbfbfd"/><stop offset=".3" stop-color="#e3e3e8"/><stop offset=".65" stop-color="#cfcfd6"/><stop offset="1" stop-color="#f2f2f5"/></linearGradient>`:`<linearGradient id="case${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a4b51"/><stop offset=".25" stop-color="#2b2c31"/><stop offset=".6" stop-color="#1b1c20"/><stop offset="1" stop-color="#3b3c42"/></linearGradient>`}
   ${light?`<linearGradient id="rim${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#b9b9c1"/><stop offset="1" stop-color="#e8e8ee"/></linearGradient>`:`<linearGradient id="rim${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8b8c93"/><stop offset=".5" stop-color="#3a3b40"/><stop offset="1" stop-color="#76777e"/></linearGradient>`}
   ${light?`<linearGradient id="crown${id}" x1="0" x2="1"><stop offset="0" stop-color="#c4c4cc"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#bdbdc5"/></linearGradient>`:`<linearGradient id="crown${id}" x1="0" x2="1"><stop offset="0" stop-color="#2a2b30"/><stop offset=".5" stop-color="#6b6c73"/><stop offset="1" stop-color="#2a2b30"/></linearGradient>`}
   <pattern id="kn${id}" width="2.4" height="300" patternUnits="userSpaceOnUse"><rect width="1.2" height="300" fill="#000" fill-opacity=".35"/></pattern>
   <radialGradient id="gl${id}" cx=".25" cy="0" r="1"><stop offset="0" stop-color="#fff" stop-opacity=".10"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <g mask="url(#m1${id})"><path d="M14 -10 L17 -100 H181 L184 -10Z" fill="url(#band${id})"/></g>
  <g mask="url(#m2${id})"><path d="M14 252 L17 342 H181 L184 252Z" fill="url(#band${id})"/>
    ${band?'':'<rect x="94" y="292" width="10" height="10" rx="5" fill="#0c0c0e"/>'}</g>
  <rect x="207" y="56" width="16" height="48" rx="5" fill="url(#crown${id})"/>
  <rect x="214" y="58" width="8" height="44" rx="3" fill="url(#kn${id})"/>
  <rect x="208" y="126" width="9" height="54" rx="4" fill="${light?'#d4d4da':'#26272b'}"/>
  <rect x="-15" y="-17" width="228" height="276" rx="62" fill="url(#rim${id})"/>
  <rect x="-13.5" y="-15.5" width="225" height="273" rx="60.5" fill="url(#case${id})"/>
  <rect x="-10" y="-12" width="218" height="266" rx="56" fill="#050506"/>
  <rect x="-10" y="-12" width="218" height="266" rx="56" fill="none" stroke="#000" stroke-width="1.5"/>
  <rect x="-10" y="-12" width="218" height="266" rx="56" fill="url(#gl${id})"/>
 </svg>`;
}
function render(el){
  const s=el.dataset.s; if(!S[s]) return;
  el.classList.add('wk');
  let h=`<div class="wk-clip"><div class="wk-scr">${S[s]()}</div></div>`;
  if(el.dataset.device){ el.classList.add('dev'); h=deviceSVG(Math.random().toString(36).slice(2,7),el.dataset.band,el.dataset.light)+h; }
  el.innerHTML=h;
  scale(el);
}
/* the screen is drawn at 198 pt and scaled to the element's real width (works with clamp() sizes too) */
function scale(el){const w=el.offsetWidth||parseFloat(getComputedStyle(el).getPropertyValue('--w'))||198;el.style.setProperty('--k',(w/198).toFixed(4));}
let ro=null;
function init(){
  if(!document.getElementById('wk-css')){const st=document.createElement('style');st.id='wk-css';st.textContent=css;document.head.appendChild(st);}
  document.querySelectorAll('[data-s]').forEach(render);
  if(!ro&&window.ResizeObserver){ro=new ResizeObserver(es=>es.forEach(e=>scale(e.target)));}
  if(ro) document.querySelectorAll('.wk').forEach(el=>ro.observe(el));
}
window.WatchKit={init,render,states:Object.keys(S),icons:I,glow};
if(document.readyState!=='loading') init(); else document.addEventListener('DOMContentLoaded',init);
})();
