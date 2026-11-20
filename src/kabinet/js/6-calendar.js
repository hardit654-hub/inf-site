/* ---------- календарь «Сделать до»: дни занятий подсвечены зелёным ---------- */
const MONS=["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
const MONN=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const ymd=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
/* дни занятий: {день недели 1–7: ["Имя 17:00", …]} из списка [имя, расписание] */
const schedMap=list=>{const L={};list.forEach(([name,sch])=>(sch||[]).forEach(x=>{(L[x.day]=L[x.day]||[]).push((name?name+" ":"")+x.time)}));return L};
/* inp — поле даты: значение ГГГГ-ММ-ДД остаётся в нём, вместо системного календаря — свой; lessons() — дни занятий */
function datePicker(inp,lessons){
  if(!inp||inp.dataset.dp)return;inp.dataset.dp="1";inp.type="hidden";
  const w=document.createElement("div");w.className="dp";inp.after(w);
  w.innerHTML=`<button type="button" class="dpb" aria-haspopup="dialog"><span class="dpv"></span><span aria-hidden="true">📅</span></button><div class="dpp" hidden role="dialog" aria-label="Выбор даты"></div>`;
  const b=w.querySelector(".dpb"),p=w.querySelector(".dpp");let cur=new Date();
  const label=()=>{const v=inp.value,d=v?new Date(v+"T00:00"):null;w.querySelector(".dpv").textContent=d?DS[d.getDay()||7]+", "+d.getDate()+" "+MONS[d.getMonth()]+" "+d.getFullYear():"Выбрать дату";b.classList.toggle("empty",!v)};
  const outside=e=>{if(!w.contains(e.target))close()},key=e=>{if(e.key==="Escape"){close();b.focus()}};
  function close(){p.hidden=true;document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",key)}
  function draw(){
    const L=lessons()||{},today=ymd(new Date()),y=cur.getFullYear(),m=cur.getMonth(),first=(new Date(y,m,1).getDay()||7)-1,n=new Date(y,m+1,0).getDate();
    let cells="<span></span>".repeat(first);
    for(let d=1;d<=n;d++){const dt=new Date(y,m,d),v=ymd(dt),who=L[dt.getDay()||7]||[];
      cells+=`<button type="button" data-v="${v}" class="${who.length?"les":""}${v===today?" today":""}${v===inp.value?" sel":""}${v<today?" past":""}"${who.length?` title="${esc("Занятие: "+who.join(", "))}"`:""}>${d}</button>`}
    const any=Object.keys(L).some(k=>L[k].length);
    p.innerHTML=`<div class="dph"><button type="button" class="dpn" data-m="-1" aria-label="Предыдущий месяц">‹</button><b>${MONN[m]} ${y}</b><button type="button" class="dpn" data-m="1" aria-label="Следующий месяц">›</button></div>
     <div class="dpg dpw">${DS.slice(1).map(x=>`<span>${x}</span>`).join("")}</div><div class="dpg">${cells}</div>
     <div class="dpf"><span class="dpl">${any?"<i></i> дни занятий":"Расписание не задано"}</span><button type="button" class="dpc">Очистить</button></div>`;
    p.querySelectorAll(".dpn").forEach(x=>x.onclick=()=>{cur=new Date(y,m+ +x.dataset.m,1);draw()});
    p.querySelectorAll("[data-v]").forEach(x=>x.onclick=()=>{inp.value=x.dataset.v;label();close();b.focus()});
    p.querySelector(".dpc").onclick=()=>{inp.value="";label();close();b.focus()};
  }
  b.onclick=()=>{if(!p.hidden){close();return}const v=inp.value;cur=v?new Date(v+"T00:00"):new Date();cur=new Date(cur.getFullYear(),cur.getMonth(),1);draw();p.hidden=false;
    document.addEventListener("pointerdown",outside);document.addEventListener("keydown",key)};
  inp.addEventListener("change",label);label();
}
