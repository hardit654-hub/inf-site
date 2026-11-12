/* Пасхалка главной страницы: звёздочка справа снизу.
 * Внутри два развлечения для отдыха между задачами:
 *  — автомат «ЕГЭ-777»: три одинаковых = приз в коллекцию и фейерверк (без ставок и денег);
 *  — Python-змейка: стен нет, ест фрукты, за золотую звезду — радужный режим.
 * Всё хранится только в браузере (localStorage "egg777"). */
(function(){
"use strict";
const STYLE=`
.egg{position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:max(14px,env(safe-area-inset-bottom,0px));z-index:40;width:34px;height:34px;border-radius:50%;border:1px solid var(--line);background:var(--card);color:var(--muted);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;opacity:.55;transition:opacity .2s,transform .4s,color .2s}
.egg svg{width:16px;height:16px}
.egg:hover,.egg:focus-visible{opacity:1;color:#e0a100;transform:rotate(72deg) scale(1.12)}
dialog.slot{border:0;padding:0;background:transparent;color:var(--hero-ink);max-width:calc(100vw - 24px);max-height:calc(100dvh - 16px);overflow:visible}
dialog.slot::backdrop{background:#0b0d10b3;backdrop-filter:blur(3px)}
dialog.slot[open] .machine{animation:slotIn .35s cubic-bezier(.2,.9,.3,1.2)}
@keyframes slotIn{from{transform:scale(.85);opacity:0}to{transform:none;opacity:1}}
.fx{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:5}
.machine{position:relative;background:linear-gradient(180deg,#22262b,#121417);border:1px solid #ffffff1c;border-radius:26px;padding:18px 20px 20px;box-shadow:0 30px 80px #0009,inset 0 1px 0 #ffffff14;width:min(400px,calc(100vw - 72px))}
.machine.thud{animation:thud .18s ease-out}
@keyframes thud{40%{transform:translateY(3px)}}
.mtop{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.mtitle{font:700 18px var(--f-display);letter-spacing:.04em}
.mtitle b{color:var(--green)}
.mx{width:34px;height:34px;border-radius:10px;border:1px solid #ffffff22;background:#ffffff0a;color:var(--hero-muted);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}
.mx svg{width:16px;height:16px}
.mx:hover{color:var(--hero-ink)}
.mtabs{display:flex;gap:6px;margin-bottom:14px}
.mtab{flex:1;height:36px;border-radius:10px;border:1px solid #ffffff1c;background:#ffffff06;color:var(--hero-muted);font:600 14px var(--f-body);cursor:pointer}
.mtab:hover{color:var(--hero-ink)}
.mtab[aria-selected=true]{background:#ffffff1a;color:var(--hero-ink);border-color:#ffffff33}
.lights{display:flex;justify-content:space-between;margin:0 6px 10px}
.lights i{width:8px;height:8px;border-radius:50%;background:#3a3f45}
.machine.win .lights i{animation:blink .5s infinite alternate}
.machine.win .lights i:nth-child(even){animation-delay:.25s}
@keyframes blink{from{background:#3a3f45}to{background:#ffd34d;box-shadow:0 0 10px #ffd34d}}
.window{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;background:#0a0b0d;border-radius:16px;padding:8px;border:1px solid #ffffff14}
.window::after{content:"";position:absolute;left:4px;right:4px;top:50%;height:2px;margin-top:-1px;background:#66cc6655;pointer-events:none;border-radius:2px}
.machine.win .window::after{background:#ffd34d;box-shadow:0 0 12px #ffd34d}
.reel{--h:62px;height:calc(var(--h)*3);overflow:hidden;border-radius:10px;background:linear-gradient(180deg,#d9dcd6 0%,#fbfcfa 22%,#fff 50%,#fbfcfa 78%,#d9dcd6 100%);position:relative}
.reel::before,.reel::after{content:"";position:absolute;left:0;right:0;height:22%;z-index:1;pointer-events:none}
.reel::before{top:0;background:linear-gradient(#0000002e,#0000)}
.reel::after{bottom:0;background:linear-gradient(#0000,#0000002e)}
.strip{will-change:transform}
.sym{height:var(--h);display:flex;align-items:center;justify-content:center;font-size:36px;line-height:1;user-select:none}
.sym.t{font:800 25px var(--f-mono);color:#1c1f24}
.machine.win .reel .hit{animation:pop .6s ease-in-out infinite alternate}
@keyframes pop{to{transform:scale(1.18)}}
.mmsg{min-height:44px;margin:12px 2px 10px;font:500 15px/1.45 var(--f-body);text-align:center;display:flex;align-items:center;justify-content:center}
.mmsg span{color:var(--hero-muted)}
.spin{width:100%;height:52px;border:0;border-radius:14px;background:var(--green);color:#0f2a12;font:700 17px var(--f-display);letter-spacing:.04em;cursor:pointer;box-shadow:0 5px 0 #3d8f3d;transition:transform .08s,box-shadow .08s}
.spin:active,.spin.down{transform:translateY(4px);box-shadow:0 1px 0 #3d8f3d}
.spin[disabled]{filter:saturate(.6);cursor:default}
.mfoot{display:flex;justify-content:space-between;align-items:center;margin-top:10px;font:500 12.5px var(--f-mono);color:var(--hero-muted)}
.mfoot button{background:none;border:0;color:var(--hero-muted);font:inherit;cursor:pointer;padding:4px}
.mfoot button:hover{color:var(--hero-ink)}
.shelfh{display:flex;justify-content:space-between;margin:14px 2px 8px;font:600 12px var(--f-mono);color:var(--hero-muted);letter-spacing:.06em;text-transform:uppercase}
.shelf{display:grid;grid-template-columns:repeat(8,1fr);gap:6px}
.prize{aspect-ratio:1;border-radius:9px;background:#ffffff06;border:1px dashed #ffffff1f;display:flex;align-items:center;justify-content:center;font-size:19px;position:relative;cursor:help}
.prize span{filter:grayscale(1) brightness(.6);opacity:.35}
.prize.t span{font:800 13px var(--f-mono);color:#fff}
.prize.got{border:1px solid #ffd34d66;background:#ffd34d14}
.prize.got span{filter:none;opacity:1}
.prize b{position:absolute;right:-5px;top:-7px;font:700 10px/1 var(--f-mono);background:#ffd34d;color:#2a1a00;border-radius:99px;padding:2px 4px}
.prize.fresh{animation:fresh 1s ease-out 2}
@keyframes fresh{50%{transform:scale(1.35);box-shadow:0 0 16px #ffd34d}}
.legend{margin-top:10px;text-align:center;font:700 13px var(--f-display);color:#ffd34d;letter-spacing:.04em}
.prizepop{position:absolute;inset:0;border-radius:26px;background:#0d0f12f0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;z-index:3;gap:10px;animation:fadeIn .25s}
@keyframes fadeIn{from{opacity:0}}
.prizepop .big{font-size:88px;line-height:1.1;animation:prizeIn .9s cubic-bezier(.2,1.4,.4,1)}
.prizepop .big.t{font:800 64px var(--f-mono);color:#ffd34d}
@keyframes prizeIn{from{transform:scale(0) rotate(-220deg)}to{transform:none}}
.prizepop small{font:700 12px var(--f-mono);color:var(--green);letter-spacing:.14em;text-transform:uppercase}
.prizepop h3{margin:0;font:700 23px/1.2 var(--f-display);color:#ffd34d}
.prizepop p{margin:0;color:var(--hero-muted);font-size:15px;max-width:290px}
.prizepop .spin{width:auto;padding:0 30px;margin-top:10px}
.lever{position:absolute;right:-30px;top:150px;width:22px;height:150px;cursor:pointer}
.lever .rod{position:absolute;left:8px;top:18px;width:6px;height:110px;background:linear-gradient(90deg,#9aa0aa,#e7e9ec,#8a9099);border-radius:3px;transform-origin:50% 100%;transition:transform .25s cubic-bezier(.3,1.6,.5,1)}
.lever .knob{position:absolute;left:-11px;top:-14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff8a80,#d9342b 60%,#8e1a14);box-shadow:0 3px 8px #0008}
.lever .base{position:absolute;left:0;bottom:0;width:22px;height:30px;border-radius:6px;background:#2a2e34;border:1px solid #ffffff1c}
.lever.pull .rod{transform:scaleY(-.55)}
.machine.snake-on .lever{display:none}
.snakebar{display:flex;justify-content:space-between;align-items:baseline;font:600 12.5px var(--f-mono);color:var(--hero-muted);margin:0 2px 10px}
.snakebar b{color:var(--hero-ink);font-size:17px;margin-left:4px}
.board{outline:none;position:relative;border-radius:16px;overflow:hidden;background:#0a0b0d;border:1px solid #ffffff14;touch-action:none;user-select:none;-webkit-user-select:none}
.board canvas{display:block;width:100%;aspect-ratio:1}
.sover{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:#0a0b0dc7;text-align:center;padding:20px;backdrop-filter:blur(2px)}
.sover h3{margin:0;font:700 22px var(--f-display)}
.sover p{margin:0;color:var(--hero-muted);font-size:14px;line-height:1.5;max-width:290px}
.sover .spin{width:auto;padding:0 28px;height:48px;font-size:15px;margin-top:4px}
.dpad{display:none;grid-template-columns:repeat(3,56px);grid-template-rows:repeat(2,46px);gap:6px;justify-content:center;margin-top:12px}
.dpad button{-webkit-tap-highlight-color:transparent;border-radius:12px;border:1px solid #ffffff1c;background:#ffffff0d;color:var(--hero-ink);font-size:18px;cursor:pointer;padding:0;touch-action:manipulation}
.dpad button:active{background:#ffffff26}
.dpad .u{grid-column:2}.dpad .l{grid-column:1;grid-row:2}.dpad .d{grid-column:2;grid-row:2}.dpad .r{grid-column:3;grid-row:2}
.shint{margin-top:10px;text-align:center;font:500 12px var(--f-mono);color:var(--hero-muted)}
@media (pointer:coarse){.dpad{display:grid}.shint{display:none}}
@media (max-width:480px){.lever{display:none}.machine{width:calc(100vw - 32px);padding:16px}.reel{--h:54px}.sym{font-size:30px}}
@media (max-height:700px){.reel{--h:50px}.sym{font-size:28px}.mmsg{margin:8px 2px 8px}}
@media (prefers-reduced-motion:reduce){dialog.slot[open] .machine,.machine.thud{animation:none}}
`;
const STAR='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>';
const HTML=`
<button class="egg" id="egg" type="button" aria-label="Пасхалка" title="★">${STAR}</button>
<dialog class="slot" id="slot" aria-label="Пасхалка: автомат и змейка">
 <canvas class="fx" id="fx"></canvas>
 <div class="machine" id="machine">
  <div class="mtop"><span class="mtitle">ЕГЭ<b>-777</b></span><button class="mx" id="slotx" type="button" aria-label="Закрыть"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg></button></div>
  <div class="mtabs" role="tablist"><button class="mtab" role="tab" data-p="slot" aria-selected="true">🎰 Автомат</button><button class="mtab" role="tab" data-p="snake" aria-selected="false">🐍 Змейка</button></div>
  <div id="pslot">
   <div class="lights">${"<i></i>".repeat(11)}</div>
   <div class="window">${'<div class="reel"><div class="strip"></div></div>'.repeat(3)}</div>
   <div class="mmsg" id="mmsg" aria-live="polite"><span>Потяни рычаг или нажми «Крутить»</span></div>
   <button class="spin" id="spin" type="button">КРУТИТЬ</button>
   <div class="mfoot"><span id="mstat"></span><button id="msnd" type="button"></button></div>
   <div class="shelfh"><span>Коллекция призов</span><span id="pcount"></span></div>
   <div class="shelf" id="shelf"></div>
   <div class="legend" id="legend" hidden>👑 Легенда ЕГЭ-777 — собраны все призы</div>
  </div>
  <div id="psnake" hidden>
   <div class="snakebar"><span>Счёт<b id="sscore">0</b></span><span id="sstar"></span><span>Рекорд<b id="sbest">0</b></span></div>
   <div class="board" id="board" tabindex="-1"><canvas id="snk"></canvas><div class="sover" id="sover"></div></div>
   <div class="dpad"><button class="u" data-d="u" aria-label="Вверх">▲</button><button class="l" data-d="l" aria-label="Влево">◀</button><button class="d" data-d="d" aria-label="Вниз">▼</button><button class="r" data-d="r" aria-label="Вправо">▶</button></div>
   <div class="shint">стрелки или WASD · пробел — пауза</div>
  </div>
  <div class="lever" id="lever" role="button" aria-label="Рычаг"><div class="base"></div><div class="rod"><div class="knob"></div></div></div>
 </div>
</dialog>`;

const st=document.createElement("style");st.textContent=STYLE;document.head.appendChild(st);
const holder=document.createElement("div");holder.innerHTML=HTML;while(holder.firstElementChild)document.body.appendChild(holder.firstElementChild);
const $=id=>document.getElementById(id);
const dlg=$("slot"),egg=$("egg"),m=$("machine");
if(!dlg.showModal){egg.hidden=true;return}

/* ---------- общее: сохранение, звук, фейерверк ---------- */
let S={spins:0,wins:0,sound:true,prizes:{},best:0};
try{Object.assign(S,JSON.parse(localStorage.getItem("egg777")||"{}"))}catch(e){}
S.prizes=S.prizes||{};
const keep=()=>{try{localStorage.setItem("egg777",JSON.stringify(S))}catch(e){}};
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const isText=s=>!/\p{Extended_Pictographic}/u.test(s);
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
let ac=null;
const actx=()=>{if(!S.sound)return null;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume();return ac}catch(e){return null}};
function tone(f,d,type,vol,slide){const a=actx();if(!a)return;try{const o=a.createOscillator(),g=a.createGain();o.type=type||"square";o.frequency.setValueAtTime(f,a.currentTime);if(slide)o.frequency.exponentialRampToValueAtTime(slide,a.currentTime+d);g.gain.setValueAtTime(vol||.05,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+d);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+d)}catch(e){}}
function boom(d,vol){const a=actx();if(!a)return;try{const n=Math.floor(a.sampleRate*d),b=a.createBuffer(1,n,a.sampleRate),c=b.getChannelData(0);for(let i=0;i<n;i++)c[i]=(Math.random()*2-1)*Math.pow(1-i/n,3);const s=a.createBufferSource(),g=a.createGain(),f=a.createBiquadFilter();f.type="lowpass";f.frequency.value=900;s.buffer=b;g.gain.value=vol;s.connect(f).connect(g).connect(a.destination);s.start()}catch(e){}}

const fx=$("fx"),fc=fx.getContext("2d");let rockets=[],sparks=[],fxOn=false;
function sizeFx(){const d=Math.min(2,devicePixelRatio||1);fx.width=innerWidth*d;fx.height=innerHeight*d;fc.setTransform(d,0,0,d,0,0)}
function burst(x,y,hue,n,power){
  for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=(power||1)*(1.5+Math.random()*4.5);
    sparks.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1,decay:.009+Math.random()*.01,hue:hue+Math.random()*50-25,r:1.4+Math.random()*1.8})}
  if(!fxOn){fxOn=true;sizeFx();requestAnimationFrame(fxLoop)}
}
function fireworks(n){
  if(reduce)n=Math.min(n,2);
  for(let i=0;i<n;i++)setTimeout(()=>{
    rockets.push({x:innerWidth*(.12+Math.random()*.76),y:innerHeight+8,vx:(Math.random()-.5)*2.2,vy:-(9.5+Math.random()*4)*Math.min(1.25,Math.max(.7,innerHeight/850)),hue:Math.random()*360});
    tone(260,.45,"sine",.025,900);
    if(!fxOn){fxOn=true;sizeFx();requestAnimationFrame(fxLoop)}
  },i*280);
}
function fxLoop(){
  fc.globalCompositeOperation="source-over";fc.clearRect(0,0,innerWidth,innerHeight);fc.globalCompositeOperation="lighter";
  rockets=rockets.filter(r=>{
    r.x+=r.vx;r.y+=r.vy;r.vy+=.17;
    sparks.push({x:r.x,y:r.y,vx:(Math.random()-.5)*.5,vy:Math.random()*.6,life:.6,decay:.03,hue:40,r:1.3});
    fc.fillStyle=`hsl(${r.hue},100%,75%)`;fc.beginPath();fc.arc(r.x,r.y,2.6,0,7);fc.fill();
    if(r.vy>=-.8){burst(r.x,r.y,r.hue,80,1);boom(.6,.35);return false}return true});
  sparks=sparks.filter(p=>{
    p.x+=p.vx;p.y+=p.vy;p.vy+=.05;p.vx*=.986;p.vy*=.986;p.life-=p.decay;if(p.life<=0)return false;
    fc.globalAlpha=p.life;fc.fillStyle=`hsl(${p.hue},100%,${55+p.life*30}%)`;fc.beginPath();fc.arc(p.x,p.y,p.r*(.5+p.life*.5),0,7);fc.fill();return true});
  fc.globalAlpha=1;
  if(rockets.length||sparks.length)requestAnimationFrame(fxLoop);else{fxOn=false;fc.clearRect(0,0,innerWidth,innerHeight)}
}

/* ---------- автомат ---------- */
const SY=["🐍","⭐","💯","🧠","💾","🎯","🍀","{}"];
const PRIZE={
  "🐍":["Питонист","Три питона подряд — Python признал тебя своим."],
  "⭐":["Звезда ЕГЭ","Загадывай 100 баллов — звёзды уже на твоей стороне."],
  "💯":["Сотка","Сто из ста. Так и сдадим!"],
  "🧠":["Мегамозг","Мозговой штурм удался. Задача 27 боится тебя."],
  "💾":["Хранитель","Сохранено навсегда. Ctrl+S — твой лучший друг."],
  "🎯":["Снайпер","В яблочко — точно как ответ в задании 18."],
  "🍀":["Везунчик","Удача на экзамене обеспечена. Но решать всё равно надо 😉"],
  "{}":["Скобочник","Ни одной лишней скобки. Код компилируется с первого раза."]
};
const CALM=["Ещё разок?","Крути, отдыхай","Почти… почти…","Глубокий вдох — и крутим","Барабаны любят терпеливых","Перерыв между задачами — тоже работа"];
const reels=[...dlg.querySelectorAll(".reel")],btn=$("spin"),msg=$("mmsg"),lever=$("lever");
const symH=s=>`<div class="sym${isText(s)?" t":""}">${s}</div>`;
let cur=reels.map(()=>[rnd(SY),rnd(SY),rnd(SY)]),busy=false,popWait=false;
reels.forEach((r,i)=>r.firstElementChild.innerHTML=cur[i].map(symH).join(""));
function paintStat(){
  $("mstat").textContent="круток: "+S.spins+" · джекпотов: "+S.wins;
  $("msnd").textContent=S.sound?"🔊 звук":"🔈 без звука";
  const got=SY.filter(s=>S.prizes[s]).length;
  $("pcount").textContent=got+" / "+SY.length;
  $("shelf").innerHTML=SY.map(s=>{const n=S.prizes[s]||0;return `<div class="prize${n?" got":""}${isText(s)?" t":""}" data-s="${s}" title="${n?PRIZE[s][0]+" — "+PRIZE[s][1]:"Ещё не выпадал: собери три "+s}"><span>${s}</span>${n>1?"<b>×"+n+"</b>":""}</div>`}).join("");
  $("legend").hidden=got<SY.length;
}
paintStat();
const thud=()=>{tone(110,.18,"triangle",.25);tone(70,.25,"sine",.3);m.classList.remove("thud");void m.offsetWidth;m.classList.add("thud")};
const fanfare=()=>[523,659,784,1047,1319].forEach((f,i)=>setTimeout(()=>tone(f,.25,"square",.05),i*110));
function spinReel(i,final){
  return new Promise(res=>{
    const r=reels[i],strip=r.firstElementChild,h=strip.firstElementChild.offsetHeight;
    const n=reduce?6:16+i*7,mid=[...Array(n)].map(()=>rnd(SY)),end=[rnd(SY),final,rnd(SY)];
    strip.innerHTML=[...cur[i],...mid,...end].map(symH).join("");
    const dur=reduce?400:1100+i*450;let ticks=0;
    const tk=setInterval(()=>{tone(900+Math.random()*300,.025,"square",.02);if(++ticks>dur/90)clearInterval(tk)},90);
    const an=strip.animate([{transform:"translateY(0)"},{transform:`translateY(${-(n+3)*h}px)`}],{duration:dur,easing:"cubic-bezier(.15,.55,.25,1.12)",fill:"forwards"});
    an.onfinish=()=>{clearInterval(tk);cur[i]=end;strip.innerHTML=end.map(symH).join("");an.cancel();thud();res()};
  });
}
async function spin(){
  if(busy||popWait||m.querySelector(".prizepop"))return;busy=true;btn.disabled=true;m.classList.remove("win");
  msg.innerHTML="<span>Крутится…</span>";
  const res=Math.random()<.2?Array(3).fill(rnd(SY)):reels.map(()=>rnd(SY));  // джекпот примерно каждый пятый раз — чтобы было приятно
  await Promise.all(reels.map((_,i)=>spinReel(i,res[i])));
  S.spins++;
  if(res[0]===res[1]&&res[1]===res[2])jackpot(res[0]);
  else if(res[0]===res[1]||res[1]===res[2]||res[0]===res[2])msg.innerHTML="Два из трёх! <span>Ещё чуть-чуть</span>";
  else msg.innerHTML="<span>"+rnd(CALM)+"</span>";
  keep();paintStat();busy=false;btn.disabled=false;
  if(!popWait)btn.focus();
}
function jackpot(s){
  S.wins++;m.classList.add("win");
  reels.forEach(r=>r.querySelectorAll(".sym")[1].classList.add("hit"));
  const fresh=!S.prizes[s];S.prizes[s]=(S.prizes[s]||0)+1;
  msg.textContent=PRIZE[s][1];fanfare();
  fireworks(fresh?7:3);
  const all=SY.every(x=>S.prizes[x]);
  setTimeout(()=>{const el=$("shelf").querySelector(`[data-s="${CSS.escape(s)}"]`);if(el)el.classList.add("fresh")},50);
  if(fresh){popWait=true;setTimeout(()=>{popWait=false;prizePop(s,all)},700)}
}
function prizePop(s,all){
  const legend=all;
  const p=document.createElement("div");p.className="prizepop";
  p.innerHTML=legend
    ?`<small>Все 8 призов собраны!</small><div class="big">👑</div><h3>Легенда ЕГЭ-777</h3><p>Ты собрал всю коллекцию. Теперь осталось так же собрать все баллы на экзамене.</p><button class="spin" type="button">Ура!</button>`
    :`<small>Новый приз!</small><div class="big${isText(s)?" t":""}">${s}</div><h3>${PRIZE[s][0]}</h3><p>${PRIZE[s][1]}</p><button class="spin" type="button">Забрать в коллекцию</button>`;
  m.appendChild(p);
  if(legend){fireworks(14);setTimeout(()=>[392,523,659,784,1047,784,1047,1319].forEach((f,i)=>setTimeout(()=>tone(f,.3,"square",.05),i*140)),300)}
  const b=p.querySelector("button");b.focus();
  b.onclick=()=>{p.remove();btn.focus();if(!legend&&SY.every(x=>S.prizes[x]))prizePop(s,true)};
}
function pull(){if(busy||m.querySelector(".prizepop"))return;lever.classList.add("pull");tone(300,.08,"sawtooth",.04);setTimeout(()=>lever.classList.remove("pull"),280);setTimeout(spin,160)}
btn.onclick=spin;lever.onclick=pull;
$("msnd").onclick=()=>{S.sound=!S.sound;keep();paintStat()};

/* ---------- Python-змейка ---------- */
const N=18,cv=$("snk"),cx=cv.getContext("2d"),over=$("sover");
const FRUIT=["🍎","🍓","🍒","🍋","🫐","🍉","🍑","🥝","🍇"];
const EMO='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
let W=0,C=0,G=null,raf=0,last=0,tab="slot";
const touch=matchMedia("(pointer:coarse)").matches;
function sizeSnake(){const r=cv.getBoundingClientRect();if(!r.width)return;const d=Math.min(2,devicePixelRatio||1);W=r.width;C=W/N;cv.width=Math.round(W*d);cv.height=Math.round(W*d);cx.setTransform(d,0,0,d,0,0)}
function freeCell(){let p,tries=0;do{p={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)}}while(tries++<500&&(G.body.some(s=>s.x===p.x&&s.y===p.y)||(G.food&&G.food.x===p.x&&G.food.y===p.y)||(G.star&&G.star.x===p.x&&G.star.y===p.y)));return p}
function newGame(){
  const b=[{x:7,y:9},{x:6,y:9},{x:5,y:9},{x:4,y:9}];
  G={body:b,prev:b.map(p=>({...p})),dir:{x:1,y:0},q:[],food:null,star:null,score:0,eaten:0,step:140,acc:0,state:"ready",
     bulges:[],floats:[],bits:[],rainbow:0,shake:0,gulp:0,nextBlink:performance.now()+2500,blinkTill:0,nextTongue:performance.now()+1200,tongueTill:0};
  G.food={...freeCell(),e:rnd(FRUIT)};
  paintScore();
}
function paintScore(){$("sscore").textContent=G?G.score:0;$("sbest").textContent=S.best||0}
function showOver(h,p,b){over.innerHTML=`<h3>${h}</h3><p>${p}</p><button class="spin" type="button">${b}</button>`;over.hidden=false;const bt=over.querySelector("button");bt.onclick=()=>{if(G.state==="dead")newGame();start()};if(tab==="snake")bt.focus({preventScroll:true})}
function start(){if(G.state==="dead")newGame();G.state="run";if(over.contains(document.activeElement))board.focus({preventScroll:true});over.hidden=true;last=performance.now();loop()}
function pause(){if(G&&G.state==="run"){G.state="paused";showOver("Пауза","Змейка ждёт. Отдохни и возвращайся.","Продолжить")}}
function readyScreen(){showOver("🐍 Python-змейка",touch?"Свайпай по полю или жми кнопки внизу. Стен нет — можно уползти за край и выползти с другой стороны.":"Стрелки или WASD — повороты, пробел — пауза. Стен нет — можно уползти за край и выползти с другой стороны.","Играть")}
function turn(dx,dy){
  if(!G)return;
  if(G.state==="ready"||G.state==="paused"){start()}
  if(G.state!=="run")return;
  const l=G.q.length?G.q[G.q.length-1]:G.dir;
  if((l.x===-dx&&l.y===-dy)||(l.x===dx&&l.y===dy))return;
  if(G.q.length<3)G.q.push({x:dx,y:dy});
}
function addFloat(x,y,text,color){G.floats.push({x:(x+.5)*C,y:(y+.5)*C,t:0,text,color})}
function addBits(x,y,colors,n){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=1+Math.random()*3;G.bits.push({x:(x+.5)*C,y:(y+.5)*C,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1,c:rnd(colors)})}}
function tick(now){
  G.prev=G.body.map(p=>({...p}));
  if(G.q.length)G.dir=G.q.shift();
  const h=G.body[0],nh={x:(h.x+G.dir.x+N)%N,y:(h.y+G.dir.y+N)%N};
  const onFood=G.food&&nh.x===G.food.x&&nh.y===G.food.y,onStar=G.star&&nh.x===G.star.x&&nh.y===G.star.y,grow=onFood||onStar;
  const check=grow?G.body:G.body.slice(0,-1);
  if(check.some(s=>s.x===nh.x&&s.y===nh.y))return die();
  G.body.unshift(nh);
  if(grow)G.prev.push({...G.prev[G.prev.length-1]});else G.body.pop();
  G.bulges=G.bulges.map(b=>b+1).filter(b=>b<G.body.length);
  if(onFood){
    G.score++;G.eaten++;G.step=Math.max(72,G.step-3);G.bulges.push(0);G.gulp=1;
    addFloat(nh.x,nh.y,"+1","#ffd43b");addBits(nh.x,nh.y,["#ff6b6b","#ffd43b","#7ad67a","#ffffff"],14);
    tone(520,.07,"square",.05,780);setTimeout(()=>tone(880,.06,"square",.04),60);
    G.food={...freeCell(),e:rnd(FRUIT)};
    if(G.eaten%5===0&&!G.star){G.star={...freeCell(),born:now};tone(1200,.15,"sine",.04,1800)}
  }
  if(onStar){
    G.score+=5;G.star=null;G.rainbow=now+6000;G.bulges.push(0);G.gulp=1;
    addFloat(nh.x,nh.y,"+5 ★","#ffd34d");addBits(nh.x,nh.y,["#ffd34d","#ff8a80","#80d8ff","#b9f6ca","#ea80fc"],30);
    const r=cv.getBoundingClientRect();burst(r.left+(nh.x+.5)*C,r.top+(nh.y+.5)*C,50,60,.8);boom(.4,.2);
    [784,988,1175,1568].forEach((f,i)=>setTimeout(()=>tone(f,.12,"square",.045),i*70));
  }
  if(G.star&&now-G.star.born>7000)G.star=null;
  paintScore();
}
function die(){
  G.state="dead";G.shake=1;tone(200,.35,"sawtooth",.07,60);setTimeout(()=>boom(.3,.25),120);
  const rec=G.score>(S.best||0);if(rec){S.best=G.score;keep()}
  paintScore();
  if(rec&&G.score>=10)fireworks(4);
  setTimeout(()=>showOver(rec&&G.score?"Новый рекорд! 🏆":"Ой! 🐍",`Змейка укусила себя за хвост. Счёт: ${G.score}.`+(rec&&G.score?"":` Рекорд: ${S.best||0}.`),"Ещё раз"),550);
}
function loop(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(function f(now){
    if(!dlg.open||tab!=="snake")return;
    const dt=Math.min(100,now-last);last=now;
    if(G.state==="run"){G.acc+=dt;while(G.acc>=G.step&&G.state==="run"){G.acc-=G.step;tick(now)}}
    draw(now,dt);
    raf=requestAnimationFrame(f);
  });
}
function lerpColor(a,b,t){const pa=a.match(/\w\w/g).map(x=>parseInt(x,16)),pb=b.match(/\w\w/g).map(x=>parseInt(x,16));return"rgb("+pa.map((v,i)=>Math.round(v+(pb[i]-v)*t)).join(",")+")"}
function draw(now,dt){
  if(!W)sizeSnake();
  cx.clearRect(0,0,W,W);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++)if((x+y)%2){cx.fillStyle="#ffffff06";cx.fillRect(x*C,y*C,C,C)}
  cx.save();
  if(G.shake>0){cx.translate((Math.random()-.5)*10*G.shake,(Math.random()-.5)*10*G.shake);G.shake*=.88;if(G.shake<.03)G.shake=0}
  cx.textAlign="center";cx.textBaseline="middle";
  // еда
  const fs=C*.82*(1+Math.sin(now/260)*.07);
  cx.fillStyle="#fff";cx.font=`${fs}px ${EMO}`;cx.fillText(G.food.e,(G.food.x+.5)*C,(G.food.y+.56)*C);
  // звезда
  if(G.star){
    const age=now-G.star.born,left=7000-age;
    if(left>1800||Math.floor(now/120)%2){
      const sx=(G.star.x+.5)*C,sy=(G.star.y+.5)*C;
      const g=cx.createRadialGradient(sx,sy,0,sx,sy,C*1.1);g.addColorStop(0,"#ffd34d66");g.addColorStop(1,"#ffd34d00");cx.fillStyle=g;cx.fillRect(sx-C*1.2,sy-C*1.2,C*2.4,C*2.4);
      cx.save();cx.translate(sx,sy);cx.rotate(Math.sin(now/300)*.3);cx.fillStyle="#fff";cx.font=`${C*.95}px ${EMO}`;cx.fillText("⭐",0,C*.04);cx.restore();
    }
    $("sstar").textContent="★ "+Math.ceil(left/1000);
  }else $("sstar").textContent=now<G.rainbow?"🌈 радуга":"";
  // змейка: плавно между клетками
  const a=G.state==="run"?Math.min(1,G.acc/G.step):(G.state==="dead"?1:1);
  const len=G.body.length;
  const pts=G.body.map((p,i)=>{const q=G.prev[i]||p;let dx=p.x-q.x,dy=p.y-q.y;
    if(dx>1)dx-=N;if(dx<-1)dx+=N;if(dy>1)dy-=N;if(dy<-1)dy+=N;
    let x=q.x+dx*a,y=q.y+dy*a;if(x<-.5)x+=N;if(x>N-.5)x-=N;if(y<-.5)y+=N;if(y>N-.5)y-=N;return{x:(x+.5)*C,y:(y+.5)*C}});
  const rain=now<G.rainbow;
  const col=i=>rain?`hsl(${(now/6+i*22)%360},90%,62%)`:(k=>`hsl(${212-165*k},${72-6*k}%,${48+10*k}%)`)(len>1?i/(len-1):0);
  const rad=i=>{let r=C*(.43-.15*(i/Math.max(1,len-1)));if(G.bulges.some(b=>Math.abs(b-i)<1))r*=1.32;return r};
  for(let i=len-1;i>0;i--){
    const p=pts[i],q=pts[i-1];
    if(Math.hypot(p.x-q.x,p.y-q.y)<C*1.5){cx.strokeStyle=col(i);cx.lineWidth=rad(i)*2;cx.lineCap="round";cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}
    cx.fillStyle=col(i);cx.beginPath();cx.arc(p.x,p.y,rad(i),0,7);cx.fill();
    if(i%3===0){cx.fillStyle="#ffffff2a";cx.beginPath();cx.arc(p.x-rad(i)*.3,p.y-rad(i)*.3,rad(i)*.35,0,7);cx.fill()}
  }
  // голова
  const hd=pts[0],d=G.dir,px=-d.y,py=d.x;
  G.gulp=Math.max(0,G.gulp-dt/250);
  const hr=C*.5*(1+G.gulp*.25);
  if(Math.floor(now/1)>=G.nextTongue){G.tongueTill=now+260;G.nextTongue=now+1400+Math.random()*1800}
  if(now<G.tongueTill&&G.state!=="dead"){
    const tx=hd.x+d.x*hr*.8,ty=hd.y+d.y*hr*.8,ex=tx+d.x*C*.42,ey=ty+d.y*C*.42;
    cx.strokeStyle="#ff4d6d";cx.lineWidth=Math.max(1.5,C*.08);cx.lineCap="round";cx.beginPath();cx.moveTo(tx,ty);cx.lineTo(ex,ey);
    cx.moveTo(ex,ey);cx.lineTo(ex+(d.x+px)*C*.14,ey+(d.y+py)*C*.14);cx.moveTo(ex,ey);cx.lineTo(ex+(d.x-px)*C*.14,ey+(d.y-py)*C*.14);cx.stroke();
  }
  cx.fillStyle=col(0);cx.beginPath();cx.arc(hd.x,hd.y,hr,0,7);cx.fill();
  cx.fillStyle="#ffffff30";cx.beginPath();cx.arc(hd.x-hr*.3,hd.y-hr*.35,hr*.35,0,7);cx.fill();
  if(now>=G.nextBlink){G.blinkTill=now+140;G.nextBlink=now+2200+Math.random()*3000}
  const fdx=(G.food.x+.5)*C-hd.x,fdy=(G.food.y+.5)*C-hd.y,fl=Math.hypot(fdx,fdy)||1;
  [1,-1].forEach(sgn=>{
    const ex=hd.x+d.x*hr*.25+px*hr*.45*sgn,ey=hd.y+d.y*hr*.25+py*hr*.45*sgn,er=hr*.3;
    if(G.state==="dead"){cx.strokeStyle="#1c1f24";cx.lineWidth=Math.max(1.5,C*.07);cx.beginPath();cx.moveTo(ex-er*.7,ey-er*.7);cx.lineTo(ex+er*.7,ey+er*.7);cx.moveTo(ex+er*.7,ey-er*.7);cx.lineTo(ex-er*.7,ey+er*.7);cx.stroke();return}
    if(now<G.blinkTill){cx.strokeStyle="#1c1f24";cx.lineWidth=Math.max(1.5,C*.07);cx.beginPath();cx.moveTo(ex-er,ey);cx.lineTo(ex+er,ey);cx.stroke();return}
    cx.fillStyle="#fff";cx.beginPath();cx.arc(ex,ey,er,0,7);cx.fill();
    cx.fillStyle="#1c1f24";cx.beginPath();cx.arc(ex+fdx/fl*er*.45,ey+fdy/fl*er*.45,er*.55,0,7);cx.fill();
    cx.fillStyle="#fff";cx.beginPath();cx.arc(ex+fdx/fl*er*.45-er*.18,ey+fdy/fl*er*.45-er*.2,er*.18,0,7);cx.fill();
  });
  // румянец, когда только что поел
  if(G.gulp>0){cx.fillStyle=`rgba(255,120,150,${.5*G.gulp})`;[1,-1].forEach(s=>{cx.beginPath();cx.arc(hd.x-d.x*hr*.15+px*hr*.62*s,hd.y-d.y*hr*.15+py*hr*.62*s,hr*.17,0,7);cx.fill()})}
  // искры и «+1»
  G.bits=G.bits.filter(b=>{b.x+=b.vx;b.y+=b.vy;b.vx*=.92;b.vy*=.92;b.life-=dt/600;if(b.life<=0)return false;cx.globalAlpha=b.life;cx.fillStyle=b.c;cx.beginPath();cx.arc(b.x,b.y,C*.09*b.life+1,0,7);cx.fill();return true});
  cx.font=`700 ${C*.7}px "JetBrains Mono",monospace`;
  G.floats=G.floats.filter(f=>{f.t+=dt;const k=f.t/900;if(k>=1)return false;cx.globalAlpha=1-k;cx.fillStyle=f.color;cx.fillText(f.text,f.x,f.y-k*C*1.6);return true});
  cx.globalAlpha=1;cx.restore();
}
// управление
const DIRS={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0]};
document.addEventListener("keydown",e=>{
  if(!dlg.open||e.altKey||e.ctrlKey||e.metaKey)return;
  if(tab==="snake"){
    const dd=DIRS[e.code];
    if(dd){e.preventDefault();turn(dd[0],dd[1]);return}
    if(e.code==="Space"){e.preventDefault();if(G.state==="run")pause();else start();return}
  }else if((e.key===" "||e.key==="Enter")&&e.target===btn){e.preventDefault();btn.classList.add("down");setTimeout(()=>btn.classList.remove("down"),120);spin()}
});
dlg.querySelectorAll(".dpad button").forEach(b=>b.addEventListener("pointerdown",e=>{e.preventDefault();const d={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]}[b.dataset.d];turn(d[0],d[1])}));
let sw=null;
const board=$("board");
board.addEventListener("pointerdown",e=>{if(e.target.closest("button"))return;sw={x:e.clientX,y:e.clientY}});
board.addEventListener("pointermove",e=>{if(!sw)return;const dx=e.clientX-sw.x,dy=e.clientY-sw.y;if(Math.max(Math.abs(dx),Math.abs(dy))<22)return;
  if(Math.abs(dx)>Math.abs(dy))turn(Math.sign(dx),0);else turn(0,Math.sign(dy));sw={x:e.clientX,y:e.clientY}});
["pointerup","pointercancel","pointerleave"].forEach(t=>board.addEventListener(t,()=>sw=null));

/* ---------- вкладки и окно ---------- */
function setTab(t){
  tab=t;
  dlg.querySelectorAll(".mtab").forEach(b=>b.setAttribute("aria-selected",b.dataset.p===t));
  $("pslot").hidden=t!=="slot";$("psnake").hidden=t!=="snake";
  m.classList.toggle("snake-on",t==="snake");
  try{sessionStorage.setItem("egg-tab",t)}catch(e){}
  if(t==="snake"){sizeSnake();if(!G){newGame();readyScreen()}else if(G.state==="run")pause();last=performance.now();loop()}
  else{if(G)pause();btn.focus({preventScroll:true})}
}
dlg.querySelectorAll(".mtab").forEach(b=>b.onclick=()=>setTab(b.dataset.p));
egg.onclick=()=>{dlg.showModal();let t="slot";try{t=sessionStorage.getItem("egg-tab")||"slot"}catch(e){}setTab(t)};
$("slotx").onclick=()=>dlg.close();
dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});
dlg.addEventListener("close",()=>{if(G)pause()});
addEventListener("resize",()=>{if(dlg.open){sizeSnake();sizeFx()}});
})();
