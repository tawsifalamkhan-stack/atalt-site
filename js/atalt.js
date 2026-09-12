/* ATALT — ATA — 001 · displacement engine, accordion, countdown */

/* ---- event facts: one place to change ---- */
const FACTS = {
  dateShort: 'FR · 25.09.26',   // per quicket.me/events/atalt-001 (Fri 25 Sep 2026)
  dateLong:  'FR · 25.09.26',
};
document.querySelectorAll('[data-fact]').forEach(el=>{ const k=el.dataset.fact; if(FACTS[k]) el.textContent=FACTS[k]; });

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- the room darkens as the night approaches ----
   21 days out the palette sits at its published values; by the 25th the ink has
   deepened and the off-white warmed. Nobody notices it. Everybody feels it. */
(function dusk(){
  const gate = new Date('2026-09-25T15:00:00+06:00').getTime();
  const days = Math.max(0, (gate - Date.now()) / 86400000);
  const t = Math.min(1, Math.max(0, 1 - days / 21));           // 0 far out -> 1 on the night
  const mix = (a, b) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const hex = c => '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  const r = document.documentElement.style;
  r.setProperty('--ink',  hex(mix([10, 10, 10],  [7, 6, 5])));      // warm, deeper
  r.setProperty('--off',  hex(mix([245, 243, 237], [246, 241, 228])));// warmer
  r.setProperty('--hair', hex(mix([61, 58, 50],  [54, 50, 41])));
})();

/* ---- hero: one orchestrated moment ---- */
const hero=document.getElementById('hero');
requestAnimationFrame(()=>{ setTimeout(()=>{ hero.classList.add('on'); }, reduce?0:120); });

/* ============================================================
   DISPLACEMENT ENGINE
   One idea: the visitor alters the page. Four inputs feed one
   spring per element, so it never reads as four separate effects.
   Motion is horizontal only and biased right — the altering line.
   ============================================================ */
const ENGINE = !reduce && (()=>{
  const K=520, D=26;                       // same spring as --sp-throw
  const LINE=()=>innerHeight*0.38;         // where the page is cut
  let nodes=[];
  function build(){
    nodes=[];
    const add=(sel,gain)=>document.querySelectorAll(sel).forEach((el,i)=>nodes.push({el,gain:(typeof gain==='function'?gain(el,i):gain),x:0,v:0}));
    add('.hero .wm-big .low',1.5);
    add('.split .b',1.0);
    // each letter shears a slightly different amount — a cut, not a moved block
    add('.name .n .ch .b',(el,i)=>0.18+0.34*((Math.sin(i*12.9898)*43758.5453)%1+1)/2);
    add('.cut .lo',1.25);
  }
  build();

  let sy=scrollY, vel=0, drag=0, my=-1e5, active=performance.now(), raf=0;
  addEventListener('scroll',()=>{ const d=scrollY-sy; sy=scrollY; vel=vel*0.6+d*0.4; wake(); },{passive:true});

  // drag: alter the page with your own hand. works over buttons too — a horizontal
  // pull past the threshold becomes a drag and its click is swallowed on release.
  let pending=false, dragging=false, didDrag=false, x0=0, y0=0;
  addEventListener('pointerdown',e=>{ if(e.target.closest('iframe,input,textarea'))return;
    pending=true; dragging=false; x0=e.clientX; y0=e.clientY; },{passive:true});
  addEventListener('pointermove',e=>{ my=e.clientY;
    if(pending){ const dx=e.clientX-x0, dy=e.clientY-y0;
      if(!dragging && Math.abs(dx)>8 && Math.abs(dx)>Math.abs(dy)) dragging=true;
      if(dragging) drag=Math.max(-110,Math.min(110,dx*0.7)); }
    wake(); },{passive:true});
  const release=()=>{ if(dragging){ didDrag=true; setTimeout(()=>didDrag=false,0); }
    pending=false; dragging=false; drag=0; wake(); };
  addEventListener('pointerup',release); addEventListener('pointercancel',release);
  addEventListener('click',e=>{ if(didDrag){ e.stopPropagation(); e.preventDefault(); } },true);
  addEventListener('mouseleave',()=>{ my=-1e5; });

  function wake(){ active=performance.now(); if(!raf) raf=requestAnimationFrame(step); }
  // the countdown's pulse travels across the page once a second
  function pulse(){ const L=LINE(); nodes.forEach(n=>{ const r=n.el.getBoundingClientRect();
    if(r.bottom>0&&r.top<innerHeight) n.v+=42*n.gain*(1-Math.min(1,Math.abs(r.top+r.height/2-L)/innerHeight)); }); wake(); }

  const RULES=()=>document.getElementById('rules');
  function isStill(){ const s=RULES(); if(!s) return false;
    const r=s.getBoundingClientRect(); return r.top<innerHeight*0.5 && r.bottom>innerHeight*0.5; }

  let last=performance.now();
  function step(now){
    const dt=Math.min(0.032,(now-last)/1000); last=now;
    const L=LINE(); let moving=false;
    const still=isStill(); document.body.classList.toggle('still',still);
    for(const n of nodes){
      const r=n.el.getBoundingClientRect();
      if(r.bottom<-200||r.top>innerHeight+200){ if(n.x||n.v){n.x=0;n.v=0;n.el.style.transform='';} continue; }
      const mid=r.top+r.height/2;
      const cross=Math.max(0,1-Math.abs(mid-L)/170)*9;                    // sitting on the line
      const near=my>-1e4?Math.max(0,1-Math.abs(my-mid)/300)*20:0;          // cursor cuts what it passes
      const target=still?0:(cross+near+Math.max(-72,Math.min(72,vel*1.15))+drag)*n.gain;
      n.v+=(-K*(n.x-target)-D*n.v)*dt; n.x+=n.v*dt;
      n.el.style.transform='translateX('+n.x.toFixed(2)+'px)';
      if(Math.abs(n.x-target)>0.05||Math.abs(n.v)>0.4) moving=true;
    }
    vel*=0.90; if(Math.abs(vel)<0.05) vel=0;
    raf=(moving||vel||drag||still||now-active<400)?requestAnimationFrame(step):0;
  }
  wake();
  addEventListener('resize',()=>{build();wake();});
  return {pulse,rebuild:()=>{build();wake();}};
})();

/* ---- mobile menu ---- */
const menu=document.getElementById('menu'), burger=document.getElementById('burger');
function setMenu(o){ menu.classList.toggle('open',o); menu.setAttribute('aria-hidden',!o); burger.setAttribute('aria-expanded',o); document.body.style.overflow=o?'hidden':''; }
burger.addEventListener('click',()=>setMenu(true));
document.getElementById('close').addEventListener('click',()=>setMenu(false));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{ if(e.key==='Escape') setMenu(false); });

/* ---- the mark alters as you leave it ---- */
const sgLo=document.querySelector('.sigil-stack .sg-lo');
function sigilShear(){ if(!sgLo||reduce) return;
  const p=Math.min(1,Math.max(0,scrollY/(innerHeight*0.9)));
  sgLo.style.transform='translateX('+(p*p*46).toFixed(1)+'px)'; }
addEventListener('scroll',sigilShear,{passive:true}); sigilShear();

/* ---- landing: no line while the hero is on screen ---- */
function heroCheck(){ document.body.classList.toggle('on-hero', scrollY < innerHeight*0.7); }
addEventListener('scroll', heroCheck, {passive:true}); heroCheck();

/* ---- structural distortion: split names and portraits at the altering line ---- */
document.querySelectorAll('.name .n').forEach(n=>{
  const t=n.textContent;
  n.setAttribute('aria-label',t);
  const btn=n.closest('.name'); if(btn) btn.setAttribute('aria-label',t);
  n.innerHTML=t.split(' ').map(word=>
    '<span class="w" aria-hidden="true">'+[...word].map(c=>
      `<span class="ch"><span class="t">${c}</span><span class="b">${c}</span></span>`).join('')+'</span>'
  ).join(' ');
});document.querySelectorAll('.inner figure').forEach(f=>{ const img=f.querySelector('img'); if(!img) return;
  const w=document.createElement('div'); w.className='cut'; img.classList.add('hi'); const lo=img.cloneNode(); lo.className='lo'; lo.alt='';
  f.replaceChild(w,img); w.append(img,lo); });
if(ENGINE) ENGINE.rebuild();   // halves exist only now — give the engine its nodes
const items=[...document.querySelectorAll('.item')];
function checkItems(){ const y=innerHeight*0.38; items.forEach(it=>{ const r=it.querySelector('.name').getBoundingClientRect(); it.classList.toggle('altered', r.top<y && r.bottom>y); }); }
addEventListener('scroll', checkItems, {passive:true}); checkItems();

/* ---- jolts: hard cuts, never eases ---- */
if(!reduce){
  (function jitter(){ setTimeout(()=>{ if(document.body.classList.contains('on-hero')&&ENGINE){
      ENGINE && document.querySelectorAll('.hero .wm-big .low').length && ENGINE.pulse(); } jitter(); }, 1400+Math.random()*2600); })();
}

/* ---- countdown to the gate: 25 Sep 2026, 15:00, Dhaka (UTC+6) ---- */
const GATE = new Date('2026-09-25T15:00:00+06:00').getTime();
const cnt=document.getElementById('count'); const nums={}; cnt.querySelectorAll('.num').forEach(n=>nums[n.dataset.u]=n);
function tick(){ let d=GATE-Date.now(); if(d<=0){ d=0; cnt.classList.add('done'); }
  const s=Math.floor(d/1000); const v={d:Math.floor(s/86400),h:Math.floor(s%86400/3600),m:Math.floor(s%3600/60),s:s%60};
  for(const k in v){ const t=String(v[k]).padStart(2,'0');
    if(nums[k].textContent!==t){ nums[k].textContent=t;
      if(!reduce){ nums[k].classList.add('kick'); requestAnimationFrame(()=>requestAnimationFrame(()=>nums[k].classList.remove('kick')));
        if(k==='s'&&ENGINE) ENGINE.pulse(); } } } }
tick(); setInterval(tick,1000);

/* ---- artist accordion ---- */
document.querySelectorAll('.item .name').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.closest('.item'), open=!item.classList.contains('open');
    document.querySelectorAll('.item.open').forEach(o=>{o.classList.remove('open');o.querySelector('.name').setAttribute('aria-expanded','false')});
    item.classList.toggle('open',open); btn.setAttribute('aria-expanded',open);
    if(ENGINE) setTimeout(ENGINE.rebuild,60);
    if(open) setTimeout(()=>{ const r=item.getBoundingClientRect(); if(r.top<80) scrollTo({top:scrollY+r.top-90,behavior:reduce?'auto':'smooth'}); },60);
  });
});


/* ============================================================
   ADMINISTRATION
   The two internal documents are AES-GCM encrypted at rest. The key is
   derived from the password with PBKDF2; without it the payloads are
   ciphertext, not merely hidden. Decryption happens in the browser and the
   plaintext is never written anywhere — it opens into a blob and dies with
   the tab. Note the ciphertext is public, so the password is the only
   secret: change it here and re-encrypt if it ever leaks.
   ============================================================ */
(() => {
  const VAULT = { brand: 'admin/brand.enc', brief: 'admin/brief.enc' };
  const LABEL = { brand: 'Brand guideline', brief: 'Content brief' };
  const panel = document.getElementById('admin');
  const gate  = document.getElementById('admGate');
  const dash  = document.getElementById('admDash');
  const pw    = document.getElementById('admPw');
  const msg   = document.getElementById('admMsg');
  const msg2  = document.getElementById('admMsg2');
  let KEYPW = null, cache = {};

  const open  = () => { panel.classList.add('open'); panel.setAttribute('aria-hidden','false');
                        document.body.style.overflow='hidden'; setTimeout(()=>pw.focus(),260); };
  const close = () => { panel.classList.remove('open'); panel.setAttribute('aria-hidden','true');
                        document.body.style.overflow=''; };

  document.querySelectorAll('[data-admin]').forEach(a =>
    a.addEventListener('click', e => { e.preventDefault(); setMenu(false); open(); }));
  document.getElementById('admClose').addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });

  const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

  async function payload(name) {
    if (cache[name]) return cache[name];
    const inline = document.getElementById('vault-' + name);
    const raw = inline ? inline.textContent : await (await fetch(VAULT[name])).text();
    return (cache[name] = JSON.parse(raw));
  }
  async function decrypt(p, password) {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password),
                                               'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: b64(p.salt), iterations: p.iter, hash: 'SHA-256' },
      base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    let out = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(p.iv) }, key, b64(p.ct));
    if (p.z === 'gzip') {                                   // payloads are gzipped before encryption
      const ds = new DecompressionStream('gzip');
      out = await new Response(new Blob([out]).stream().pipeThrough(ds)).arrayBuffer();
    }
    return new TextDecoder().decode(out);
  }

  async function unlock() {
    const password = pw.value.trim();
    if (!password) return;
    msg.textContent = 'checking…'; msg.classList.remove('bad');
    try {
      await decrypt(await payload('brand'), password);   // verifies the key
      KEYPW = password;
      gate.hidden = true; dash.hidden = false;
      msg.textContent = '';
    } catch (e) {
      msg.textContent = 'wrong password'; msg.classList.add('bad');
      pw.value = ''; pw.focus();
    }
  }
  document.getElementById('admGo').addEventListener('click', unlock);
  pw.addEventListener('keydown', e => { if (e.key === 'Enter') unlock(); });

  document.querySelectorAll('.adm-doc').forEach(btn => btn.addEventListener('click', async () => {
    const name = btn.dataset.doc;
    msg2.textContent = 'decrypting ' + LABEL[name].toLowerCase() + '…';
    try {
      const html = await decrypt(await payload(name), KEYPW);
      const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      msg2.textContent = 'opened in a new tab';
    } catch (e) { msg2.textContent = 'could not open — reload and try again'; }
  }));
})();
