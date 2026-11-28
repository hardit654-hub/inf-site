/* ---------- расписание всех учеников по дням недели ---------- */
const tmin=t=>{const a=String(t||"0:0").split(":").map(Number);return a[0]*60+(a[1]||0)},hm=n=>String(Math.floor(n/60)%24).padStart(2,"0")+":"+String(n%60).padStart(2,"0");
function paneSchedule(){
  const pane=document.getElementById("pane"),V=visible(),today=new Date().getDay()||7,by={};
  V.forEach(s=>((s.info&&s.info.schedule)||[]).forEach(x=>(by[x.day]=by[x.day]||[]).push({s,from:tmin(x.time),dur:+x.dur||60})));
  let total=0,mins=0,clash=0;
  const col=d=>{const L=(by[d]||[]).sort((a,b)=>a.from-b.from||a.s.name.localeCompare(b.s.name,"ru"));total+=L.length;
    L.forEach((a,i)=>{mins+=a.dur;a.clash=L.some((b,j)=>j!==i&&a.from<b.from+b.dur&&b.from<a.from+a.dur)});clash+=L.filter(a=>a.clash).length;
    return `<div class="sc-day${d===today?" now":""}"><div class="sc-h"><b>${DAYS[d]}</b>${d===today?'<span class="sc-t">сегодня</span>':""}<small>${L.length?L.length+" "+plural(L.length,"занятие","занятия","занятий"):"—"}</small></div>
      ${L.map(a=>`<button type="button" class="sc-it${a.clash?" clash":""}" data-sid="${a.s.id}" title="Открыть «Занятия и ДЗ»"><span class="sc-tm">${hm(a.from)}–${hm(a.from+a.dur)}</span><span class="sc-nm">${esc(a.s.name)}</span>${catOf(a.s)||grpOf(a.s)?`<small>${esc([catOf(a.s),grpOf(a.s)].filter(Boolean).join(" · "))}</small>`:""}${a.clash?'<small class="sc-x">пересекается по времени</small>':""}</button>`).join("")}</div>`};
  const cols=[1,2,3,4,5,6,7].map(col).join(""),none=V.filter(s=>!(s.info&&s.info.schedule&&s.info.schedule.length));
  pane.innerHTML=`${filterBar(false)}<div class="card"><h2>Расписание · ${esc(fLabel())}</h2>
   <p class="sub">${total?`${total} ${plural(total,"занятие","занятия","занятий")} в неделю, ${(mins/60).toLocaleString("ru-RU",{maximumFractionDigits:1})} ч.`:"Пока ни у кого нет расписания."} Нажмите на занятие, чтобы изменить время или домашку.${clash?` <b class="sc-xw">Пересекаются по времени: ${clash}</b>`:""}</p>
   <div class="sc-grid">${cols}</div>
   ${none.length?`<p class="sc-none"><b>Без расписания (${none.length}):</b> ${none.map(s=>`<button type="button" class="sc-nb" data-sid="${s.id}">${esc(s.name)}</button>`).join("")}</p>`:""}</div>`;
  bindFilter(()=>paneSchedule());
  pane.querySelectorAll("[data-sid]").forEach(b=>b.onclick=async()=>{const id=+b.dataset.sid;TAB="students";try{sessionStorage.setItem("kab-tab",TAB)}catch(e){}
    await viewTeacher();const s=STUDENTS.find(x=>x.id===id);if(s)editInfo(s)});
}
function plural(n,a,b,c){const m=n%10,h=n%100;return m===1&&h!==11?a:m>=2&&m<=4&&(h<12||h>14)?b:c}
function editInfo(s){
  const i=s.info||{schedule:[],homework:"",hw_due:""};
  const slot=document.getElementById("editslot");
  const row=x=>`<div class="srow"><select class="sd">${DAYS.slice(1).map((d,k)=>`<option value="${k+1}" ${x.day===k+1?"selected":""}>${d}</option>`).join("")}</select><input type="time" class="st" value="${x.time||"17:00"}" required><input type="number" class="dur" min="15" max="240" step="15" value="${x.dur||60}" title="Длительность, мин"><span class="muted">мин</span><button class="btn danger small rm" type="button">Убрать</button></div>`;
  slot.innerHTML=`<div class="card edit"><h2>${esc(s.name)}: занятия и домашка</h2><p class="sub">Ученик увидит это у себя в кабинете сразу после сохранения.</p>
   <form id="ef"><div class="row"><div class="field" style="flex:0 1 220px"><label for="eca">Категория</label>${catSel("eca",catOf(s))}</div>
    <div class="field" style="flex:0 1 200px"><label for="egr">Класс / группа</label><input id="egr" list="grplist" value="${esc(s.note||"")}" placeholder="10 класс"></div></div>
    <label>Расписание</label><div id="rows">${(i.schedule.length?i.schedule:[]).map(row).join("")}</div>
    <button class="btn ghost small" type="button" id="addrow">+ Добавить день</button>
    <div class="field" style="margin-top:18px"><label>Домашнее задание: задачи из курсов <span class="muted" id="pkall"></span></label><div id="picker"><div class="loading" style="padding:14px">Загрузка курсов…</div></div></div>
    <div class="field"><label for="hwt">Задание словами <span class="muted">(необязательно)</span></label><textarea id="hwt" style="min-height:80px" placeholder="Например: повторить перевод в двоичную систему. Ссылки можно вставлять прямо в текст.">${esc(i.homework||"")}</textarea></div>
    <div class="row"><div class="field" style="flex:0 1 200px"><label for="hwd">Сделать до</label><input type="date" id="hwd" value="${esc(i.hw_due||"")}"></div>
     <div class="field" style="flex:1 1 200px"><label>&nbsp;</label>${(i.hw_tasks||[]).length?"Сейчас: "+hwChip(i)+" ":""}${i.homework?(i.hw_done?'<span class="chip2 ok">✓ ученик отметил «сделано» '+new Date(i.hw_done*1000).toLocaleDateString("ru-RU")+'</span>':'<span class="chip2 wait">текст ещё не отмечен как сделанный</span>'):""}</div></div>
    <div class="row" style="margin-top:14px"><button class="btn" id="es">Сохранить</button><button class="btn ghost" type="button" id="ec">Закрыть</button><button class="btn ghost" type="button" id="eclr">Очистить домашку</button></div><div id="em" hidden></div></form></div>`;
  const rows=document.getElementById("rows");
  buildPicker(new Set(i.hw_tasks||[]));
  datePicker(document.getElementById("hwd"),()=>schedMap([["",[...rows.querySelectorAll(".srow")].map(r=>({day:+r.querySelector(".sd").value,time:r.querySelector(".st").value}))]]));
  const bindRm=()=>rows.querySelectorAll(".rm").forEach(b=>b.onclick=()=>b.parentElement.remove());bindRm();
  document.getElementById("addrow").onclick=()=>{rows.insertAdjacentHTML("beforeend",row({day:1,time:"17:00",dur:60}));bindRm()};
  document.getElementById("ec").onclick=()=>{slot.innerHTML=""};
  document.getElementById("eclr").onclick=()=>{document.getElementById("hwt").value="";const hd=document.getElementById("hwd");hd.value="";hd.dispatchEvent(new Event("change"));document.querySelectorAll("#picker .tk").forEach(c=>c.checked=false);syncPicker()};
  slot.scrollIntoView({behavior:"smooth",block:"start"});
  document.getElementById("ef").onsubmit=async e=>{e.preventDefault();const b=document.getElementById("es"),m=document.getElementById("em");
    const schedule=[...rows.querySelectorAll(".srow")].map(r=>({day:+r.querySelector(".sd").value,time:r.querySelector(".st").value,dur:+r.querySelector(".dur").value||60}));
    setBusy(b,true,"Сохраняем…");
    const hw_tasks=[...document.querySelectorAll("#picker .tk:checked")].map(c=>c.value);
    try{const ng=document.getElementById("egr").value.trim(),nc=document.getElementById("eca").value;
      if(ng!==grpOf(s)||nc!==catOf(s))await api("student_update",{id:s.id,name:s.name,note:ng,cat:nc});
      await api("info_set",{id:s.id,schedule,homework:document.getElementById("hwt").value,hw_tasks,hw_due:document.getElementById("hwd").value});
      STUDENTS=(await api("students")).students;paneStudents();const ns=STUDENTS.find(x=>x.id===s.id);editInfo(ns);msg(document.getElementById("em"),"Сохранено — ученик уже видит это в кабинете",true)}
    catch(err){msg(m,err.message);setBusy(b,false)}};
}
async function buildPicker(sel){
  const cat=await catalog();const box=document.getElementById("picker");if(!box)return;
  box.innerHTML=cat.map(c=>{
    const any=c.lessons.some(l=>l.steps.some((s,k)=>s==="task"&&sel.has(c.key+"|"+l.num+"/"+K(l,k))));
    return `<details class="pick" ${any?"open":""}><summary>${esc(c.title)}<span class="pc" data-pc></span></summary><div class="lessons">${c.lessons.map(l=>{
      const tk=l.steps.map((s,k)=>s==="task"?k+1:0).filter(Boolean);if(!tk.length)return"";
      return `<details class="pl"><summary><input type="checkbox" class="lall" aria-label="Все задачи урока ${esc(l.num)}"><span>${esc(LN(l)+" "+l.title)}</span><small data-lc></small></summary><div class="tasks">${tk.map(n=>{const v=c.key+"|"+l.num+"/"+K(l,n-1);
        return `<label class="pt"><input type="checkbox" class="tk" value="${esc(v)}" ${sel.has(v)?"checked":""}><b>Шаг ${n}</b><span>${esc((l.labels||[])[n-1]||"")}</span><a href="${esc(c.url)}#${esc(l.num)}-${n}" target="_blank" rel="noopener">открыть</a></label>`}).join("")}</div></details>`}).join("")}</div></details>`}).join("");
  box.querySelectorAll(".lall").forEach(cb=>{cb.onclick=e=>e.stopPropagation();cb.onchange=()=>{cb.closest(".pl").querySelectorAll(".tk").forEach(t=>t.checked=cb.checked);syncPicker()}});
  box.querySelectorAll(".tk").forEach(cb=>cb.onchange=syncPicker);
  syncPicker();
}
function syncPicker(){
  let all=0;
  document.querySelectorAll("#picker .pick").forEach(p=>{let n=0;
    p.querySelectorAll(".pl").forEach(l=>{const t=[...l.querySelectorAll(".tk")],k=t.filter(x=>x.checked).length;n+=k;
      const a=l.querySelector(".lall");a.checked=k===t.length;a.indeterminate=k>0&&k<t.length;l.querySelector("[data-lc]").textContent=k?k+" из "+t.length:t.length+" задач"});
    const pc=p.querySelector("[data-pc]");pc.textContent=n?"выбрано: "+n:"";pc.classList.toggle("on",n>0);all+=n});
  const el=document.getElementById("pkall");if(el)el.textContent=all?"— выбрано "+all:"";
}
