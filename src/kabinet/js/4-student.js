/* ---------- ученик ---------- */
async function viewStudent(){
  const [cat,p]=await Promise.all([catalog(),api("my_progress")]);
  const by=p.coins_by||{};
  let info={schedule:[],homework:""};try{info=await api("info_get")}catch(e){}
  HWCTX={cat,prog:p.progress};
  app.innerHTML=infoCards(info)+skillsCard(info.skills,cat)+`<div class="wallet">${COIN}<div><b>${p.coins||0}</b><span>${coinWord(p.coins||0)} в копилке. 3 за каждую решённую задачу, −1 за каждую ошибку; если посмотреть ответ — 0.</span></div></div><div id="lbslot" style="margin-bottom:16px"></div><div class="courses">${groupCat(cat).map(c=>{if(c.parts)return egeCard(c,p,by);const s=stats(c,(p.progress[c.key]||{}).data);
    return `<article class="course"><h3>${esc(c.title)}</h3>
      <div><div class="meter"><i style="width:${pct(s.done,s.total)}%"></i></div></div>
      <div class="cnum">${s.done} из ${s.total} задач решено${by[c.key]?` · ${COIN} ${by[c.key]}`:""}</div>
      ${s.lessons.filter(l=>l.total).map(l=>{const ex=exRes(p.progress[c.key],l.num);return `<div class="lrow"><span>${c.kind==="variant"?`<a href="${esc(c.url)}#${esc(l.num)}${ex?"-res":""}">${esc(l.title)}</a>`:esc(LN(l)+" "+l.title)}</span><div class="meter"><i style="width:${pct(l.done,l.total)}%"></i></div><b>${ex?ex.test+" б.":l.done+"/"+l.total}</b></div>`}).join("")}
      <a class="btn" href="${esc(c.url)}" data-go="${esc(c.url)}">${s.touched?"Продолжить":"Начать"}</a></article>`}).join("")}</div>
    ${pwCard()}`;
  bindGo();
  saveWho();
  bindPw();
  bindHw();
  lbCard(false).then(h=>{const s=document.getElementById("lbslot");if(s)s.innerHTML=h});
}
let HWCTX={cat:[],prog:{}};
/* Переход «Начать / Продолжить»: сначала сохраняем на устройстве, чей это кабинет — чтобы работа,
   открытая в этом браузере, не подхватила чужой черновик или чужую сданную работу (было с контрольной № 1). */
function bindGo(){
  document.querySelectorAll("[data-go]").forEach(a=>a.onclick=()=>{
    try{localStorage.setItem("inf-uid",String(ME.id));localStorage.setItem("inf-name",JSON.stringify([ME.id,ME.name]))}catch(e){}
  });
}
/* Та же метка — при открытии кабинета: ученик зашёл в кабинет, значит в этом браузере работает он.
   Если в браузере осталась работа другого ученика, контрольная покажет «Начать заново» вместо неё. */
function saveWho(){try{localStorage.setItem("inf-uid",String(ME.id));localStorage.setItem("inf-name",JSON.stringify([ME.id,ME.name]))}catch(e){}}
/* разделы одного курса (ЕГЭ: № 4, № 12, …) — одной карточкой */
function groupCat(cat){
  const out=[],g={};
  cat.forEach(c=>{if(!c.group||c.kind==="variant"){out.push(c);return}
    if(!g[c.group]){g[c.group]={title:c.group,url:c.url,parts:[]};out.push(g[c.group])}g[c.group].parts.push(c)});
  return out;
}
function egeCard(G,p,by){
  let done=0,total=0,coins=0,touched=false;
  const rows=G.parts.map(c=>{const s=stats(c,(p.progress[c.key]||{}).data);done+=s.done;total+=s.total;coins+=by[c.key]||0;touched=touched||s.touched;
    return `<div class="lrow"><span>${esc(c.title)}</span><div class="meter"><i style="width:${pct(s.done,s.total)}%"></i></div><b>${s.done}/${s.total}</b></div>`}).join("");
  return `<article class="course"><h3>${esc(G.title)}</h3>
    <div><div class="meter"><i style="width:${pct(done,total)}%"></i></div></div>
    <div class="cnum">${done} из ${total} задач решено${coins?` · ${COIN} ${coins}`:""}</div>${rows}
    <a class="btn" href="${esc(G.url)}">${touched?"Продолжить":"Начать"}</a></article>`;
}
function hwTasksHTML(tasks){
  /* домашка блоками: один блок на урок («42.1 Теория — 12 задач»); нажатие открывает курс на первой нерешённой задаче */
  if(!tasks||!tasks.length)return"";
  const groups=[];let solved=0,n=0;
  tasks.forEach(tk=>{const [key,sid]=tk.split("|");const c=HWCTX.cat.find(x=>x.key===key);if(!c)return;
    const [ln,sk]=sid.split("/");const L=c.lessons.find(l=>l.num===ln);if(!L)return;const sn=P(L,sk);if(!sn)return;
    const st=((HWCTX.prog[key]||{}).data||{}).st||{};const ok=!!(st[sid]&&st[sid].ok);n++;if(ok)solved++;
    let g=groups.find(x=>x.key===key);if(!g){g={key,c,blocks:[]};groups.push(g)}
    let b=g.blocks.find(x=>x.ln===ln);if(!b){b={ln,L,all:0,ok:0,first:null,min:sn};g.blocks.push(b)}
    b.all++;if(ok)b.ok++;else if(b.first==null||sn<b.first)b.first=sn;if(sn<b.min)b.min=sn});
  const block=(g,b)=>{const vr=g.c.kind==="variant",done=b.ok>=b.all,to=done?b.min:b.first;
    const cnt=done?`✓ ${b.all} из ${b.all}`:b.ok?`${b.ok} из ${b.all}`:`${b.all} ${taskWord(b.all)}`;
    return `<a class="hwb${done?" ok":""}" href="${esc(g.c.url)}#${esc(b.ln)}-${to}"><span class="hwbt">${vr?"":`<small>${esc(LN(b.L))}</small>`}${esc(b.L.title)}</span><span class="hwbc">${cnt}</span><span class="hwba" aria-hidden="true">›</span></a>`};
  return `<div class="hwbar">${solved>=n?"<b>✓ Все задачи решены</b>":`Решено <b>${solved} из ${n}</b>`}<div class="meter"><i style="width:${pct(solved,n)}%"></i></div></div>
    <div class="hwl">${groups.map(g=>`<h4>${esc(g.c.title)}</h4>${g.blocks.map(b=>block(g,b)).join("")}`).join("")}</div>`;
}
function taskWord(n){const m=n%10,h=n%100;return m===1&&h!==11?"задача":m>=2&&m<=4&&(h<12||h>14)?"задачи":"задач"}
function hwSolved(tasks){
  let s=0;(tasks||[]).forEach(tk=>{const [key,sid]=tk.split("|");const st=((HWCTX.prog[key]||{}).data||{}).st||{};if(st[sid]&&st[sid].ok)s++});
  return s;
}
function deadlineHTML(i){
  const tasks=i.hw_tasks||[];if(!i.hw_due||(!i.homework&&!tasks.length))return"";
  const done=tasks.length?hwSolved(tasks)>=tasks.length&&(!i.homework||i.hw_done):!!i.hw_done;
  const due=new Date(i.hw_due+"T00:00:00"),today=new Date(new Date().toDateString());
  const days=Math.round((due-today)/864e5);
  let cls,left;
  if(done){cls="ok";left="✓ Домашка сделана"}
  else if(days<0){cls="late";left="Просрочено на "+(-days)+" "+dayWord(-days)}
  else if(days===0){cls="hot";left="Сегодня — последний день"}
  else if(days===1){cls="hot";left="Остался 1 день — до завтра"}
  else{cls="wait";left="Осталось "+days+" "+dayWord(days)}
  return `<div class="dl ${cls}"><span class="dll">Сдать домашку до</span><b class="dld">${due.toLocaleDateString("ru-RU",{weekday:"long",day:"numeric",month:"long"})}</b><span class="dlc">${left}</span></div>`;
}
function dayWord(n){const m=n%10,h=n%100;return m===1&&h!==11?"день":m>=2&&m<=4&&(h<12||h>14)?"дня":"дней"}
function hwFresh(i){
  /* срок домашки прошёл: решённые задачи убираем из кабинета, нерешённые остаются долгом */
  if(!i.hw_due||!isLate(i.hw_due))return i;
  const tasks=(i.hw_tasks||[]).filter(tk=>{const [key,sid]=tk.split("|");const st=((HWCTX.prog[key]||{}).data||{}).st||{};return!(st[sid]&&st[sid].ok)});
  return Object.assign({},i,{hw_tasks:tasks,homework:i.hw_done?"":i.homework});
}
function infoCards(i){
  i=hwFresh(i);
  const nb=nextLesson(i.schedule);
  const sch=i.schedule&&i.schedule.length?`<div class="days">${i.schedule.map(x=>`<div class="day"><b>${DAYS[x.day]}</b><span>${x.time}</span><small class="muted">${x.dur||60} мин</small></div>`).join("")}</div>${nb?`<div class="next">Следующее занятие<b>${fmtNext(nb)}</b></div>`:""}`
    :`<p class="muted" style="margin:0">Расписание пока не назначено.</p>`;
  const tasks=i.hw_tasks||[];
  const hw=(i.homework||tasks.length)?`${i.homework?`<div class="hw hwnote">${linkify(i.homework)}</div>`:""}${hwTasksHTML(tasks)}<div class="hwmeta">${i.hw_due?`<span>Сделать до <span class="due${isLate(i.hw_due)&&!i.hw_done?" late":""}">${fmtDue(i.hw_due)}</span></span>`:""}
      ${i.homework?(i.hw_done?`<span class="done">✓ Отмечено как сделанное</span><button class="btn ghost small" id="hwundo" type="button">Отменить</button>`:`<button class="btn small" id="hwdone" type="button">Я сделал(а)</button>`):""}</div>`
    :`<p class="muted" style="margin:0">Сейчас домашнего задания нет.</p>`;
  return `<div class="duo"><section class="card" id="schcard"><div class="ic"><span class="em">📅</span><h2>Расписание занятий</h2></div>${sch}${deadlineHTML(i)}</section>
    <section class="card" id="hwcard"><div class="ic"><span class="em">📝</span><h2>Домашнее задание</h2></div>${hw}</section></div>`;
}
function bindHw(){
  const d=document.getElementById("hwdone"),u=document.getElementById("hwundo");
  const go=async done=>{try{const i=await api("hw_done",{done});const c=document.createElement("div");c.innerHTML=infoCards(i);document.getElementById("hwcard").replaceWith(c.querySelector("#hwcard"));const sc=document.getElementById("schcard");if(sc)sc.replaceWith(c.querySelector("#schcard"));bindHw()}catch(e){}};
  if(d)d.onclick=()=>go(true);if(u)u.onclick=()=>go(false);
}
async function lbCard(teacher){
  let d;try{d=await api("leaderboard")}catch(e){return ""}
  const medal=["🥇","🥈","🥉"];
  /* теги за места в рейтинге: их видят все */
  const TAGS=["👑 Чемпион","🖤 Тёмный принц","🐳 Дипсик-мастер","👸 Принцесса","🍦 Воздушный рожок","🚀 Ракета","🍀 Счастливая семёрка"];
  const tag=p=>p>=1&&p<=TAGS.length?`<span class="tg tg${p}">${TAGS[p-1]}</span>`:"";
  const row=r=>`<div class="lbrow${r.me?" me":""}"><span class="pl${r.place<=3?" m":""}">${r.place&&r.place<=3?medal[r.place-1]:(r.place||"—")}</span><span class="nm"><span class="nmt">${esc(r.name)}</span>${tag(r.place)}${r.me?"<small>это ты</small>":""}</span><span class="cs">${COIN}${r.coins}</span></div>`;
  let h=`<section class="card lb"><h2>🏆 Топ‑7 по монеткам</h2><p class="sub">${teacher?"Ученики видят имя и первую букву фамилии.":"Решай задачи без ошибок — так монеток больше всего."}</p>`;
  if(!d.top.length) h+=`<div class="empty">Пока ни у кого нет монеток. ${teacher?"":"Стань первым!"}</div>`;
  h+=d.top.map(row).join("");
  if(d.me&&!d.top.some(r=>r.me)) h+=`<div class="lbrow gap">…</div>`+row(d.me);
  return h+`</section>`;
}
function coinWord(n){const a=n%10,b=n%100;return (a===1&&b!==11?"монетка":a>=2&&a<=4&&(b<12||b>14)?"монетки":"монеток")}
function pwCard(){return `<div class="card" style="margin-top:16px"><details class="pw"><summary>Сменить пароль</summary>
  <form id="pwf"><div class="row"><div class="field"><label for="po">Старый пароль</label><input id="po" type="password" autocomplete="current-password" required></div>
  <div class="field"><label for="pn">Новый пароль</label><input id="pn" type="password" autocomplete="new-password" minlength="4" required></div>
  <button class="btn" id="pwb">Сохранить</button></div><div id="pwm" hidden></div></form></details></div>`}
function bindPw(){
  const f=document.getElementById("pwf"),m=document.getElementById("pwm"),b=document.getElementById("pwb");
  f.onsubmit=async e=>{e.preventDefault();setBusy(b,true);
    try{await api("password",{old:f.po.value,new:f.pn.value});f.reset();msg(m,"Пароль изменён",true)}catch(err){msg(m,err.message)}setBusy(b,false)};
}

