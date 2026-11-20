/* ---------- учитель ---------- */
let TAB="students",STUDENTS=[],COURSE_I=0,OPEN=null;
/* фильтр учеников: категория (Школа / Репетиторство) и группа (класс). "" — все, "-" — не указано */
const CATS=["Школа","Репетиторство"];
let FCAT="",FGRP="";
try{FCAT=localStorage.getItem("kab-fcat")||"";FGRP=localStorage.getItem("kab-fgrp")||""}catch(e){}
try{TAB=sessionStorage.getItem("kab-tab")||TAB;COURSE_I=+(sessionStorage.getItem("kab-course")||0)}catch(e){}
async function viewTeacher(){
  app.innerHTML=`<nav class="tabs" role="tablist">
     <button class="tab" role="tab" data-t="students">Ученики</button>
     <button class="tab" role="tab" data-t="schedule">Расписание</button>
     <button class="tab" role="tab" data-t="progress">Прогресс</button>
     <button class="tab" role="tab" data-t="skills">Задания ЕГЭ</button>
     <button class="tab" role="tab" data-t="variants">Варианты</button>
     <button class="tab" role="tab" data-t="rating">Рейтинг</button></nav><div id="pane"><div class="loading">Загрузка…</div></div>`;
  app.querySelectorAll(".tab").forEach(b=>{b.setAttribute("aria-selected",b.dataset.t===TAB);b.onclick=()=>{TAB=b.dataset.t;try{sessionStorage.setItem("kab-tab",TAB)}catch(e){}viewTeacher()}});
  try{STUDENTS=(await api("students")).students}catch(e){document.getElementById("pane").innerHTML=`<div class="msg">${esc(e.message)}</div>`;return}
  if(TAB==="rating"){document.getElementById("pane").innerHTML=await lbCard(true);return}
  if(TAB==="variants"){paneVariants();return}
  if(TAB==="skills"){paneSkills();return}
  if(TAB==="schedule"){paneSchedule();return}
  TAB==="students"?paneStudents():paneProgress();
}
function credText(login,pass){return "Сайт: "+SITE+"\nЛогин: "+login+"\nПароль: "+pass}
function credBox(name,login,pass){
  return `<div class="cred"><p>Данные для входа <b>${esc(name)}</b> — пароль показывается один раз, отправьте его ученику сейчас:</p>
   <pre id="ct">${esc(credText(login,pass))}</pre><button class="btn small" id="cp" type="button">Скопировать</button></div>`;
}
function bindCopy(){const b=document.getElementById("cp");if(!b)return;b.onclick=async()=>{const t=document.getElementById("ct").textContent;
  try{await navigator.clipboard.writeText(t);b.textContent="Скопировано"}catch(e){const r=document.createRange();r.selectNodeContents(document.getElementById("ct"));const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent="Выделено — нажмите Копировать"}
  setTimeout(()=>b.textContent="Скопировать",2000)}}
function paneStudents(cred){
  const pane=document.getElementById("pane");
  const V=visible();
  pane.innerHTML=`<datalist id="grplist">${groups().map(([g])=>`<option value="${esc(g)}">`).join("")}</datalist>${filterBar(true)}<div id="editslot"></div>
   <div class="card"><h2>Ученики · ${esc(fLabel())} · ${V.length}</h2>
    ${V.length?`<div class="bulk" id="bulk"><span class="bn" id="bn">Отметьте учеников галочками, чтобы перенести сразу нескольких</span>
     <span class="bacts"><button class="btn small" type="button" data-bcat="Школа" disabled>→ Школа</button><button class="btn small" type="button" data-bcat="Репетиторство" disabled>→ Репетиторство</button>
     <span class="bgrp"><input id="bg" list="grplist" placeholder="10 класс" aria-label="Класс для выбранных"><button class="btn ghost small" type="button" id="bgb" disabled>Поставить класс</button></span></span></div>`:""}
    <div class="tbl-wrap"><table><thead><tr><th class="ck">${V.length?'<input type="checkbox" id="ckall" aria-label="Отметить всех">':""}</th><th>Имя</th><th class="hide-sm">Логин</th><th>Категория и класс</th><th>Монетки</th><th>Занятия и ДЗ</th><th class="hide-sm">Был на сайте</th><th></th></tr></thead><tbody>
    ${V.length?V.map(s=>`<tr><td class="ck"><input type="checkbox" class="ck1" value="${s.id}" aria-label="Отметить: ${esc(s.name)}"></td><td>${esc(s.name)}</td><td class="mono hide-sm">${esc(s.login)}</td><td><span class="mv">${CATS.map(c=>`<button type="button" data-mv="${s.id}" data-cat="${c}" aria-pressed="${catOf(s)===c}">${c}</button>`).join("")}</span>${grpOf(s)?`<div class="muted mvg">${esc(grpOf(s))}</div>`:""}</td><td><span class="ccell">${COIN}${s.coins||0}</span></td><td class="sum">${s.info&&s.info.schedule.length?s.info.schedule.map(x=>DS[x.day]+" "+x.time).join(", "):'<span class="muted">без расписания</span>'}<br>ДЗ: ${hwChip(s.info)}</td><td class="hide-sm muted">${ago(s.last_seen)}</td>
       <td class="acts"><button class="btn small" data-info="${s.id}">Занятия и ДЗ</button><button class="btn ghost small" data-reset="${s.id}">Новый пароль</button><button class="btn danger small" data-del="${s.id}">Удалить</button></td></tr>`).join("")
     :`<tr><td colspan="8" class="empty">${STUDENTS.length?"В этой группе пока никого.":"Пока никого. Добавьте первого ученика выше."}</td></tr>`}
    </tbody></table></div></div>
   <div class="card"><h2>Добавить ученика</h2><p class="sub">Логин придумается сам из имени, пароль — случайный.</p>
    <form id="af"><div class="row">
      <div class="field" style="flex-basis:240px"><label for="an">Имя и фамилия</label><input id="an" required placeholder="Иван Петров"></div>
      <div class="field"><label for="al">Логин <span class="muted">(необязательно)</span></label><input id="al" autocapitalize="none" spellcheck="false" placeholder="ivan.petrov"></div>
      <div class="field" style="flex:0 1 190px"><label for="aca">Категория</label>${catSel("aca",CATS.includes(FCAT)?FCAT:"")}</div>
      <div class="field" style="flex:0 1 160px"><label for="ao">Класс / группа</label><input id="ao" list="grplist" placeholder="10 класс" value="${FGRP&&FGRP!=="-"?esc(FGRP):""}"></div>
      <button class="btn" id="ab">Добавить</button></div><div id="am" hidden></div></form>
    <div id="credslot">${cred||""}</div></div>
   ${V.length?`<div class="card"><h2>Начислить монетки</h2><p class="sub">Бонус за работу на уроке, олимпиаду или просто так. Отрицательное число — списать.</p>
    <form id="cf"><div class="row">
      <div class="field" style="flex-basis:240px"><label for="cs">Ученик</label><select id="cs" class="sel">${V.map(s=>`<option value="${s.id}">${esc(s.name)} · ${s.coins||0}</option>`).join("")}</select></div>
      <div class="field" style="flex:0 1 140px"><label for="ca">Монеток</label><input id="ca" type="number" value="5" step="1" min="-1000" max="1000" required></div>
      <button class="btn" id="cb">Начислить</button></div><div id="cm" hidden></div></form></div>`:""}`;
  bindCopy();bindFilter(()=>paneStudents());bindMove();
  const f=document.getElementById("af"),m=document.getElementById("am"),b=document.getElementById("ab");
  f.onsubmit=async e=>{e.preventDefault();msg(m,"");setBusy(b,true,"Добавляем…");
    try{const j=await api("student_create",{name:f.an.value,login:f.al.value,note:f.ao.value,cat:f.aca.value});
      STUDENTS=(await api("students")).students;paneStudents(credBox(j.student.name,j.student.login,j.password));document.getElementById("an").focus()}
    catch(err){msg(m,err.message);setBusy(b,false)}};
  pane.querySelectorAll("[data-info]").forEach(btn=>btn.onclick=()=>editInfo(STUDENTS.find(x=>x.id===+btn.dataset.info)));
  const gb=document.getElementById("ghw");if(gb)gb.onclick=()=>editGroupHw();
  const cf=document.getElementById("cf");
  if(cf)cf.onsubmit=async e=>{e.preventDefault();const m=document.getElementById("cm"),b=document.getElementById("cb"),id=+cf.cs.value,n=parseInt(cf.ca.value,10);
    setBusy(b,true);try{const j=await api("coins_add",{id,amount:n});STUDENTS=(await api("students")).students;const s=STUDENTS.find(x=>x.id===id);paneStudents();
      const m2=document.getElementById("cm");document.getElementById("cs").value=id;msg(m2,(n>0?"Начислено ":"Списано ")+Math.abs(n)+" "+coinWord(Math.abs(n))+": "+s.name+" — теперь "+j.coins,true)}
    catch(err){msg(m,err.message);setBusy(b,false)}};
  pane.querySelectorAll("[data-reset]").forEach(btn=>btn.onclick=async()=>{
    const s=STUDENTS.find(x=>x.id===+btn.dataset.reset);
    if(!btn.classList.contains("sure")){btn.classList.add("sure");btn.textContent="Точно сбросить?";setTimeout(()=>{btn.classList.remove("sure");btn.textContent="Новый пароль"},4000);return}
    try{const j=await api("student_reset",{id:s.id});paneStudents(credBox(s.name,j.login,j.password));document.getElementById("credslot").scrollIntoView({behavior:"smooth",block:"center"})}catch(err){alertBox(err.message)}});
  pane.querySelectorAll("[data-del]").forEach(btn=>btn.onclick=async()=>{
    const s=STUDENTS.find(x=>x.id===+btn.dataset.del);
    if(!btn.classList.contains("sure")){btn.classList.add("sure");btn.textContent="Удалить вместе с прогрессом?";setTimeout(()=>{btn.classList.remove("sure");btn.textContent="Удалить"},4000);return}
    try{await api("student_delete",{id:s.id});STUDENTS=STUDENTS.filter(x=>x.id!==s.id);paneStudents()}catch(err){alertBox(err.message)}});
}
const catOf=s=>(s.cat||"").trim(),grpOf=s=>(s.note||"").trim();
const inCat=s=>FCAT===""||(FCAT==="-"?!catOf(s):catOf(s)===FCAT);
const inGrp=s=>FGRP===""||(FGRP==="-"?!grpOf(s):grpOf(s)===FGRP);
const visible=()=>STUDENTS.filter(s=>inCat(s)&&inGrp(s));
function groups(list){
  const m=new Map();(list||STUDENTS).forEach(s=>{const g=grpOf(s);if(g)m.set(g,(m.get(g)||0)+1)});
  return[...m].sort((a,b)=>a[0].localeCompare(b[0],"ru",{numeric:true}));
}
function fLabel(){
  const a=[];if(FCAT)a.push(FCAT==="-"?"без категории":FCAT);if(FGRP)a.push(FGRP==="-"?"без группы":FGRP);
  return a.length?a.join(" · "):"все ученики";
}
function filterBar(withHw){
  const inC=STUDENTS.filter(inCat);const G=groups(inC);
  if(FGRP&&FGRP!=="-"&&!G.some(([g])=>g===FGRP))FGRP="";
  const noCat=STUDENTS.filter(s=>!catOf(s)).length,noGrp=inC.filter(s=>!grpOf(s)).length;
  const t=(v,label,n)=>`<button class="tab" type="button" data-fc="${esc(v)}" aria-selected="${FCAT===v}">${esc(label)} <span class="cnt">${n}</span></button>`;
  const c=(v,label,n)=>`<button class="tab sm" type="button" data-fg="${esc(v)}" aria-selected="${FGRP===v}">${esc(label)} <span class="cnt">${n}</span></button>`;
  const vis=visible().length;
  return `<div class="card fbar"><div class="seg" role="tablist" aria-label="Категория">${t("","Все",STUDENTS.length)}${CATS.map(x=>t(x,x,STUDENTS.filter(s=>catOf(s)===x).length)).join("")}${noCat?t("-","Без категории",noCat):""}</div>
   <div class="seg sub2" aria-label="Группа">${c("","Все классы",inC.length)}${G.map(([g,n])=>c(g,g,n)).join("")}${noGrp&&G.length?c("-","Без группы",noGrp):""}</div>
   ${withHw?`<div class="row fhw"><button class="btn" type="button" id="ghw" ${vis?"":"disabled"}>📝 Задать домашку: ${esc(fLabel())} (${vis})</button>
   ${noCat===STUDENTS.length&&STUDENTS.length?`<p class="note">Разделите учеников: в таблице ниже нажмите «Школа» или «Репетиторство» у ученика или отметьте нескольких галочками.</p>`:""}</div>`:""}</div>`;
}
function bindFilter(rerender){
  document.querySelectorAll("[data-fc]").forEach(b=>b.onclick=()=>{FCAT=b.dataset.fc;FGRP="";saveF();rerender()});
  document.querySelectorAll("[data-fg]").forEach(b=>b.onclick=()=>{FGRP=b.dataset.fg;saveF();rerender()});
}
/* перенос учеников между категориями и классами */
async function moveStudents(ids,patch,what){
  try{const j=await api("students_move",Object.assign({ids},patch));STUDENTS=(await api("students")).students;paneStudents();
    document.getElementById("editslot").innerHTML=`<div class="card"><div class="msg good" role="status">${esc(what)}: ${j.count} ${plural(j.count,"ученик","ученика","учеников")}.</div></div>`}
  catch(err){alertBox(err.message)}
}
function bindMove(){
  document.querySelectorAll("[data-mv]").forEach(b=>b.onclick=()=>{if(b.getAttribute("aria-pressed")==="true")return;
    const s=STUDENTS.find(x=>x.id===+b.dataset.mv);moveStudents([s.id],{cat:b.dataset.cat},s.name+" → «"+b.dataset.cat+"»")});
  const all=document.getElementById("ckall");if(!all)return;
  const boxes=[...document.querySelectorAll(".ck1")];
  const sel=()=>boxes.filter(c=>c.checked).map(c=>+c.value);
  const upd=()=>{const n=sel().length;document.getElementById("bn").innerHTML=n?`Выбрано <b>${n}</b>:`:"Отметьте учеников галочками, чтобы перенести сразу нескольких";
    document.querySelectorAll("#bulk button").forEach(b=>b.disabled=!n);document.getElementById("bulk").classList.toggle("on",n>0);
    all.checked=n===boxes.length;all.indeterminate=n>0&&n<boxes.length};
  boxes.forEach(c=>c.onchange=upd);all.onchange=()=>{boxes.forEach(c=>c.checked=all.checked);upd()};
  document.querySelectorAll("[data-bcat]").forEach(b=>b.onclick=()=>moveStudents(sel(),{cat:b.dataset.bcat},"Перенесено в «"+b.dataset.bcat+"»"));
  document.getElementById("bgb").onclick=()=>{const g=document.getElementById("bg").value.trim();if(!g){document.getElementById("bg").focus();return}
    moveStudents(sel(),{note:g},"Класс «"+g+"» поставлен")};
}
function saveF(){try{localStorage.setItem("kab-fcat",FCAT);localStorage.setItem("kab-fgrp",FGRP)}catch(e){}}
const catSel=(id,v)=>`<select id="${id}" class="sel"><option value="">— не указана —</option>${CATS.map(x=>`<option ${x===v?"selected":""}>${x}</option>`).join("")}${v&&!CATS.includes(v)?`<option selected>${esc(v)}</option>`:""}</select>`;
function editGroupHw(){
  const slot=document.getElementById("editslot");
  const list=visible(),label=fLabel();
  slot.innerHTML=`<div class="card edit"><h2>Домашка: ${esc(label)}</h2><p class="sub">Домашка появится в кабинете у каждого отмеченного ученика. Расписание, решённые задачи и монетки не меняются. Другую группу выберите кнопками выше.</p>
   <form id="gf">
    <div class="field"><label>Кому <span class="muted" id="gcnt"></span></label><div class="glist">${list.length?list.map(s=>`<label class="gs"><input type="checkbox" class="gu" value="${s.id}" checked><span>${esc(s.name)}</span><span class="gcur">сейчас: ${hwChip(s.info)}</span></label>`).join(""):'<p class="muted">В этой группе пока никого.</p>'}</div></div>
    <div class="field"><label>Если у ученика уже есть домашка</label><div class="gmode"><label><input type="radio" name="gm" value="replace" checked> Заменить новой</label><label><input type="radio" name="gm" value="add"> Добавить к текущей</label></div></div>
    <div class="field" style="margin-top:6px"><label>Задачи из курсов <span class="muted" id="pkall"></span></label><div id="picker"><div class="loading" style="padding:14px">Загрузка курсов…</div></div></div>
    <div class="field"><label for="hwt">Задание словами <span class="muted">(необязательно)</span></label><textarea id="hwt" style="min-height:80px" placeholder="Например: повторить перевод в двоичную систему. Ссылки можно вставлять прямо в текст."></textarea></div>
    <div class="row"><div class="field" style="flex:0 1 200px"><label for="hwd">Сделать до</label><input type="date" id="hwd"></div></div>
    <div class="row" style="margin-top:14px"><button class="btn" id="gs">Выдать домашку</button><button class="btn ghost" type="button" id="gc">Закрыть</button></div><div id="gmsg" hidden></div></form></div>`;
  buildPicker(new Set());
  datePicker(document.getElementById("hwd"),()=>schedMap([...slot.querySelectorAll(".gu:checked")].map(c=>{const s=STUDENTS.find(x=>x.id===+c.value);return[s?s.name:"",s&&s.info&&s.info.schedule]})));
  const cnt=()=>{const n=slot.querySelectorAll(".gu:checked").length;document.getElementById("gcnt").textContent="— выбрано "+n+" из "+list.length;document.getElementById("gs").textContent=n?"Выдать домашку ("+n+")":"Выдать домашку"};
  slot.querySelectorAll(".gu").forEach(c=>c.onchange=cnt);cnt();
  document.getElementById("gc").onclick=()=>{slot.innerHTML=""};
  slot.scrollIntoView({behavior:"smooth",block:"start"});
  document.getElementById("gf").onsubmit=async e=>{e.preventDefault();const b=document.getElementById("gs"),m=document.getElementById("gmsg");
    const ids=[...slot.querySelectorAll(".gu:checked")].map(c=>+c.value);
    const hw_tasks=[...document.querySelectorAll("#picker .tk:checked")].map(c=>c.value);
    const homework=document.getElementById("hwt").value,mode=slot.querySelector("[name=gm]:checked").value;
    if(!ids.length){msg(m,"Отметьте хотя бы одного ученика");return}
    if(!hw_tasks.length&&!homework.trim()){msg(m,"Выберите задачи или напишите задание словами");return}
    setBusy(b,true,"Выдаём…");
    try{const j=await api("hw_assign",{ids,homework,hw_tasks,hw_due:document.getElementById("hwd").value,mode});
      STUDENTS=(await api("students")).students;paneStudents();
      document.getElementById("editslot").innerHTML=`<div class="card"><div class="msg good" role="status">Домашка выдана: ${j.count} ${plural(j.count,"ученику","ученикам","ученикам")}${FCAT||FGRP?" ("+esc(label)+")":""}. Ученики уже видят её в кабинете.</div></div>`}
    catch(err){msg(m,err.message);setBusy(b,false)}};
}
