/* ---------- варианты (закрытые материалы) ---------- */
async function paneVariants(note){
  const pane=document.getElementById("pane");
  let list=[];try{list=(await api("materials")).materials||[]}catch(e){pane.innerHTML=`<div class="msg">${esc(e.message)}</div>`;return}
  pane.innerHTML=`${note||""}<div class="card"><h2>Варианты · ${list.length}</h2><p class="sub">Видны только вошедшим ученикам. Задать вариант домашкой: «Ученики» → «Задать домашку» или «Занятия и ДЗ» → отметьте вариант целиком.</p>
   ${list.length?`<div class="vlist">${list.map(c=>{const t=c.lessons.reduce((a,l)=>a+l.steps.filter(x=>x==="task").length,0);
     return `<div class="vrow"><div><b>${esc(c.title)}</b><span class="muted">${c.lessons.map(l=>esc(l.title)).join(", ")} · ${t} задач с проверкой</span></div>
      <div class="acts"><a class="btn small" href="${esc(c.url)}" target="_blank" rel="noopener">Открыть</a><button class="btn danger small" type="button" data-vdel="${esc(c.mid)}">Удалить</button></div></div>`}).join("")}</div>`:'<p class="empty">Пока нет ни одного варианта.</p>'}</div>
   <div class="card"><h2>Загрузить вариант</h2><p class="sub">Выберите папку варианта, которую подготовил Claude (в ней лежит файл manifest.json и папки img и files). Если такой вариант уже есть, он обновится — ответы учеников сохранятся.</p>
    <div class="row"><input type="file" id="vdir" webkitdirectory directory multiple hidden><button class="btn" type="button" id="vpick">Выбрать папку…</button><span class="muted" id="vname"></span></div>
    <div id="vprog" hidden><div class="meter" style="margin-top:12px"><i id="vbar" style="width:0%"></i></div><p class="note" id="vstat"></p></div><div id="vmsg" hidden></div></div>`;
  pane.querySelectorAll("[data-vdel]").forEach(b=>b.onclick=async()=>{
    if(!b.classList.contains("sure")){b.classList.add("sure");b.textContent="Точно удалить вариант?";setTimeout(()=>{b.classList.remove("sure");b.textContent="Удалить"},4000);return}
    try{await api("material_delete",{mid:b.dataset.vdel});CAT=null;paneVariants()}catch(e){alert(e.message)}});
  const inp=document.getElementById("vdir");
  document.getElementById("vpick").onclick=()=>inp.click();
  inp.onchange=()=>uploadVariant([...inp.files]);
}
async function uploadVariant(files){
  const m=document.getElementById("vmsg"),prog=document.getElementById("vprog"),bar=document.getElementById("vbar"),stat=document.getElementById("vstat");
  const rel=f=>(f.webkitRelativePath||f.name).split("/").slice(1).join("/")||f.name;
  const man=files.find(f=>rel(f)==="manifest.json");
  if(!man){msg(m,"В папке нет файла manifest.json — выберите папку варианта целиком.");return}
  let mf;try{mf=JSON.parse(await man.text())}catch(e){msg(m,"Не получилось прочитать manifest.json");return}
  const rest=files.filter(f=>/^(img|files)\//.test(rel(f))&&!/\/\./.test(rel(f)));
  const CH=512*1024;const total=rest.reduce((a,f)=>a+Math.max(1,Math.ceil(f.size/CH)),0)+1;let done=0;
  msg(m,"");prog.hidden=false;document.getElementById("vpick").disabled=true;
  const step=t=>{done++;bar.style.width=Math.round(done/total*100)+"%";stat.textContent=t};
  try{
    await api("material_put",{mid:mf.mid,title:mf.title,course:mf.course,catalog:mf.catalog});step("Задания загружены");
    for(const f of rest){const parts=Math.max(1,Math.ceil(f.size/CH));
      for(let i=0;i<parts;i++){
        const body=f.slice(i*CH,(i+1)*CH);
        const r=await fetch(API+"?action=mfile_put&m="+encodeURIComponent(mf.mid)+"&f="+encodeURIComponent(rel(f))+"&part="+i,{method:"POST",headers:{"X-Inf":"1","Content-Type":"application/octet-stream"},body,credentials:"same-origin"});
        let j=null;try{j=await r.json()}catch(e){}
        if(!r.ok||!j||!j.ok)throw new Error((j&&j.error)||("Ошибка загрузки "+rel(f)+" ("+r.status+")"));
        step("Файл "+rel(f)+(parts>1?" — часть "+(i+1)+" из "+parts:""))}}
    CAT=null;paneVariants(`<div class="card"><div class="msg good" role="status">Вариант «${esc(mf.title)}» загружен. Его уже можно задавать домашкой.</div></div>`);
  }catch(e){msg(m,e.message+". Попробуйте ещё раз — уже загруженное просто перезапишется.");document.getElementById("vpick").disabled=false}
}
function paneSkills(){
  const pane=document.getElementById("pane"),V=visible();
  const sk=s=>(s.info&&s.info.skills)||{};
  const tot=k=>{let r=0,y=0,g=0;V.forEach(s=>{const v=sk(s)[k];if(v==="r")r++;else if(v==="y")y++;else if(v==="g")g++});return{r,y,g}};
  pane.innerHTML=filterBar(false)+`<div class="card"><h2>Задания ЕГЭ · ${esc(fLabel())}</h2>
    <p class="sub">Нажмите на клетку и выберите, как ученику даётся задание. Ученик видит отметки у себя в кабинете. Внизу — сколько в группе «так себе» и «не пройдено».</p>
    <div class="sk-sum"><span><i class="sk-dot g"></i>${SKW.g}</span><span><i class="sk-dot y"></i>${SKW.y}</span><span><i class="sk-dot r"></i>${SKW.r}</span><span><i class="sk-dot"></i>без отметки</span></div>
    ${!STUDENTS.length?`<div class="empty">Сначала добавьте учеников на вкладке «Ученики».</div>`:!V.length?`<div class="empty">В этой группе пока никого.</div>`:
    `<div class="tbl-wrap"><table class="skm"><thead><tr><th class="nm">Ученик</th>${EGE.map((t,i)=>`<th title="${esc("№ "+(i+1)+" · "+t)}">${i+1}</th>`).join("")}</tr></thead><tbody>
      ${V.map(s=>`<tr><td class="nm" title="${esc(s.name)}">${esc(s.name)}</td>${EGE.map((t,i)=>{const v=sk(s)[i+1]||"";return `<td><button type="button" class="skc ${v}" data-u="${s.id}" data-n="${i+1}" title="${esc(s.name+" · № "+(i+1)+" "+t+(v?" — "+SKW[v]:""))}" aria-label="${esc(s.name+", задание "+(i+1)+(v?": "+SKW[v]:": без отметки"))}">${i+1}</button></td>`}).join("")}</tr>`).join("")}
      ${V.length>1?`<tr class="tot"><td class="nm">В группе</td>${EGE.map((t,i)=>{const c=tot(i+1);return `<td>${c.r?`<i class="r" title="не пройдено">${c.r}</i>`:""}${c.y?`<i class="y" title="так себе">${c.y}</i>`:""}${!c.r&&!c.y&&c.g===V.length?'<i style="color:var(--green-ink)">✓</i>':""}</td>`}).join("")}</tr>`:""}
    </tbody></table></div><div id="skm" hidden></div>`}</div>`;
  bindFilter(()=>paneSkills());
  let pop=null;const close=()=>{document.querySelectorAll(".skpop").forEach(x=>x.remove());pop=null};
  if(!window.__skDoc){window.__skDoc=1;document.addEventListener("click",e=>{const p=document.querySelector(".skpop");if(p&&!p.contains(e.target))p.remove()});
    document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".skpop").forEach(x=>x.remove())})}
  pane.querySelectorAll(".skc").forEach(b=>b.onclick=e=>{
    e.stopPropagation();const op=document.querySelector(".skpop"),was=op&&op.dataset.k===b.dataset.u+"-"+b.dataset.n;close();if(was)return;
    const s=STUDENTS.find(x=>x.id===+b.dataset.u),n=+b.dataset.n,cur=sk(s)[n]||"";
    pop=document.createElement("div");pop.className="skpop";pop.dataset.k=b.dataset.u+"-"+n;pop.setAttribute("role","menu");
    pop.innerHTML=`<div class="h">${esc(s.name.split(" ")[0])} · № ${n} ${esc(EGE[n-1])}</div>`+[["g",SKW.g],["y",SKW.y],["r",SKW.r],["","Снять отметку"]].map(([v,t])=>`<button type="button" role="menuitem" data-v="${v}" aria-pressed="${cur===v&&v!==""}"><i class="sk-dot ${v}"></i>${t}</button>`).join("");
    document.body.appendChild(pop);
    const r=b.getBoundingClientRect(),w=pop.offsetWidth,h=pop.offsetHeight;
    let x=r.left+scrollX,y=r.bottom+scrollY+6;if(x+w>scrollX+innerWidth-8)x=scrollX+innerWidth-8-w;if(r.bottom+h+6>innerHeight)y=r.top+scrollY-h-6;
    pop.style.left=Math.max(8,x)+"px";pop.style.top=y+"px";pop.querySelector("button").focus();
    pop.onclick=async ev=>{const o=ev.target.closest("button[data-v]");if(!o)return;ev.stopPropagation();const v=o.dataset.v;close();
      const old=b.className;b.className="skc "+v+" busy";
      try{const j=await api("skills_set",{id:s.id,n,v});s.info=s.info||{};s.info.skills=j.skills;paneSkills()}
      catch(err){b.className=old;const m=document.getElementById("skm");if(m)msg(m,err.message)}};
  });
}
function alertBox(t){const m=document.getElementById("am");if(m)msg(m,t)}
async function paneProgress(){
  const pane=document.getElementById("pane"),cat=await catalog();
  if(COURSE_I>=cat.length)COURSE_I=0;
  const c=cat[COURSE_I];
  pane.innerHTML=filterBar(false)+`<div id="fireslot"></div><div class="seg">${cat.map((x,i)=>`<button class="tab" data-c="${i}" aria-selected="${i===COURSE_I}">${esc(x.title)}</button>`).join("")}</div><div class="card" id="pcard"><div class="loading">Загрузка…</div></div>`;
  bindFilter(()=>{OPEN=null;paneProgress()});
  fireCard(cat).then(h=>{const el=document.getElementById("fireslot");if(el)el.innerHTML=h});
  pane.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{COURSE_I=+b.dataset.c;OPEN=null;try{sessionStorage.setItem("kab-course",COURSE_I)}catch(e){}paneProgress()});
  let P;try{P=(await api("class_progress",null,{key:c.key})).progress}catch(e){document.getElementById("pcard").innerHTML=`<div class="msg">${esc(e.message)}</div>`;return}
  const L=c.lessons.filter(l=>l.steps.includes("task"));
  const V=visible();const rows=V.map(s=>{const p=P[s.id]||{};return{s,p,k:stats(c,p.data)}});
  const cellH=(d,t)=>`<span class="cell ${d===t&&t?"full":d?"":"zero"}"><b>${d}/${t}</b><span class="meter"><i style="width:${pct(d,t)}%"></i></span></span>`;
  document.getElementById("pcard").innerHTML=!STUDENTS.length?`<div class="empty">Сначала добавьте учеников на вкладке «Ученики».</div>`:!V.length?`<div class="empty">В этой группе пока никого.</div>`:
   `<div class="tbl-wrap"><table class="pt"><thead><tr><th>Ученик</th>${L.map(l=>`<th title="${esc(l.title)}">${esc(LN(l))}</th>`).join("")}<th>Всего</th><th class="hide-sm">Последнее</th></tr></thead><tbody>
    ${rows.map(r=>`<tr class="srow" data-u="${r.s.id}" aria-expanded="${OPEN===r.s.id}"><td>${esc(r.s.name)}</td>${r.k.lessons.filter(l=>l.total).map(l=>{const ex=exRes(r.p,l.num);return `<td>${ex?`<span class="cell full" title="Первичный балл: ${ex.prim}"><b>${ex.test} б.</b></span>`:cellH(l.done,l.total)}</td>`}).join("")}<td>${cellH(r.k.done,r.k.total)}</td><td class="hide-sm muted">${r.p.updated?ago(r.p.updated):"—"}</td></tr>
      ${OPEN===r.s.id?`<tr class="detail"><td colspan="${L.length+3}">${detail(r)}</td></tr>`:""}`).join("")}
   </tbody></table></div>
   <div class="legend"><span><i class="sq ok"></i>решено</span><span><i class="sq bad"></i>пытался, не решил</span><span><i class="sq"></i>не начинал</span><span><i class="sq rev"></i>смотрел ответ</span><span>Нажмите на ученика, чтобы увидеть каждую задачу</span></div>`;
  pane.querySelectorAll(".srow").forEach(tr=>tr.onclick=()=>{const u=+tr.dataset.u;OPEN=OPEN===u?null:u;paneProgress()});
}
/* огоньки: какие задачи ученики отметили как сложные */
function taskRef(cat,ckey,sid){
  const c=cat.find(x=>x.key===ckey);if(!c)return null;const [ln,k]=sid.split("/");const l=c.lessons.find(x=>x.num===ln);if(!l)return null;
  const pos=P(l,k);return{where:c.kind==="variant"?c.title.replace(/^СтатГрад · /,"")+" · "+l.title:c.title+" · "+LN(l)+" "+l.title,label:(l.labels||[])[pos-1]||("Шаг "+pos),url:c.url+"#"+ln+"-"+pos};
}
async function fireCard(cat){
  let F=[];try{F=(await api("fires_top")).fires||[]}catch(e){return""}
  const V=new Map(visible().map(x=>[x.id,x]));
  const rows=F.map(f=>Object.assign({},f,{users:f.users.filter(u=>V.has(u))})).filter(f=>f.users.length).sort((a,b)=>b.users.length-a.users.length||b.last-a.last);
  const name=u=>{const n=V.get(u).name.split(" ");return n[0]+(n[1]?" "+n[1][0]+".":"")};
  return `<div class="card"><h2>🔥 Сложные задачи · ${esc(fLabel())}</h2><p class="sub">Ученики ставят огонёк у задачи, которая далась тяжело. Огоньки видят все, а здесь — кто именно отметил.</p>
    ${rows.length?`<div class="tbl-wrap"><table><thead><tr><th>🔥</th><th>Задача</th><th class="hide-sm">Кто отметил</th></tr></thead><tbody>${rows.slice(0,30).map(f=>{const r=taskRef(cat,f.ckey,f.sid);
      return `<tr><td class="mono"><b>${f.users.length}</b></td><td>${r?`<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.label)}</a><div class="muted" style="font-size:13px">${esc(r.where)}</div>`:`<span class="muted">${esc(f.ckey+" · "+f.sid)}</span>`}</td><td class="hide-sm muted">${f.users.map(name).map(esc).join(", ")}</td></tr>`}).join("")}</tbody></table></div>`
      :`<p class="empty" style="margin:0">Пока никто из ${FCAT||FGRP?"этой группы":"учеников"} не отметил задачу огоньком.</p>`}</div>`;
}
function ansText(v){if(v==null)return"";if(Array.isArray(v))return v.map(r=>Array.isArray(r)?r.filter(Boolean).join(" "):r).filter(Boolean).join(" | ");return String(v)}
function detail(r){
  const res=r.p.resets?`<p class="note">Нажимал «Начать заново»: ${r.p.resets} раз(а)</p>`:"";
  return `<div class="dl">${r.k.lessons.filter(l=>l.total).map(l=>`<div><h4>${esc(LN(l)+" "+l.title)} · ${l.done}/${l.total}${(e=>e?` · экзамен: ${e.test} тестовых (${e.prim} первичных)`:"")(exRes(r.p,l.num))}</h4><div class="sqs">
    ${l.cells.map(c=>{const x=c.x,cls=x.ok?"ok":(x.att?"bad":""),a=ansText(x.v);
      const tip="Шаг "+c.n+(x.ok?" — решено":x.att?" — не решено":" — не начинал")+(x.att?", попыток: "+x.att:"")+(x.rev?", смотрел ответ":"")+(a?"\nОтвет: "+a:"");
      return `<span class="sq ${cls}${x.rev?" rev":""}" title="${esc(tip)}">${c.n}</span>`}).join("")}</div></div>`).join("")}${res}</div>`;
}

