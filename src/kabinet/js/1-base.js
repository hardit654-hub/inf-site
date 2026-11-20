(function(){
const API="../api/index.php";
const app=document.getElementById("app");
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const COIN='<svg class="coin" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="#f6c43a"/><circle cx="10" cy="10" r="9" fill="none" stroke="#c98a12" stroke-width="1.2"/><circle cx="10" cy="10" r="5.6" fill="none" stroke="#c98a12" stroke-width="1.4"/><path d="M6.2 6.4a5 5 0 0 1 4-2" stroke="#fff6cf" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>';
const DAYS=["","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресенье"],DS=["","Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
function linkify(s){return esc(s).replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)»"])/g,'<a href="$1" target="_blank" rel="noopener">$1</a>')}
function nextLesson(sch){
  if(!sch||!sch.length)return null;const now=new Date();let best=null;
  for(let add=0;add<8;add++){const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+add);const wd=(d.getDay()+6)%7+1;
    sch.filter(x=>x.day===wd).forEach(x=>{const [h,m]=x.time.split(":").map(Number);const st=new Date(d.getFullYear(),d.getMonth(),d.getDate(),h,m);const end=new Date(st.getTime()+(x.dur||60)*6e4);
      if(end>now&&(!best||st<best.st))best={st,end,x,now:st<=now}})
    if(best)break}
  return best;
}
function fmtNext(b){
  if(!b)return"";if(b.now)return"Идёт прямо сейчас — до "+b.end.toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"});
  const days=Math.round((new Date(b.st.toDateString())-new Date(new Date().toDateString()))/864e5);
  const d=days===0?"сегодня":days===1?"завтра":b.st.toLocaleDateString("ru-RU",{weekday:"long",day:"numeric",month:"long"});
  return d+", "+b.x.time;
}
function fmtDue(due){if(!due)return"";const d=new Date(due+"T23:59:59");return d.toLocaleDateString("ru-RU",{weekday:"short",day:"numeric",month:"long"})}
const isLate=due=>due&&new Date(due+"T23:59:59")<new Date();
function hwChip(i){
  if(!i||(!i.homework&&!(i.hw_tasks||[]).length))return'<span class="chip2">нет</span>';
  const pg=i.hw_prog;
  if(pg&&pg.total){const all=pg.solved>=pg.total;return`<span class="chip2 ${all?"ok":isLate(i.hw_due)?"late":"wait"}">${all?"✓ ":""}${pg.solved}/${pg.total} задач${!all&&i.hw_due?" до "+new Date(i.hw_due).toLocaleDateString("ru-RU",{day:"numeric",month:"numeric"}):""}</span>`}
  if(i.hw_done)return'<span class="chip2 ok">✓ сделано</span>';
  if(isLate(i.hw_due))return'<span class="chip2 late">просрочено</span>';
  return'<span class="chip2 wait">задано'+(i.hw_due?" до "+new Date(i.hw_due).toLocaleDateString("ru-RU",{day:"numeric",month:"numeric"}):"")+'</span>';
}
const SITE=location.origin+location.pathname.replace(/kabinet\/.*$/,"kabinet/");
let ME=null,CAT=null;

async function api(action,body,params){
  const url=API+"?action="+action+(params?"&"+new URLSearchParams(params):"");
  const opt=body?{method:"POST",headers:{"Content-Type":"application/json","X-Inf":"1"},body:JSON.stringify(body),credentials:"same-origin"}:{credentials:"same-origin",cache:"no-store"};
  let r;
  try{r=await fetch(url,opt)}catch(e){throw new Error("Нет связи с сервером. Проверьте интернет.")}
  let j=null;try{j=await r.json()}catch(e){}
  if(!j)throw new Error("Сервер ответил ошибкой ("+r.status+")");
  if(!j.ok)throw new Error(j.error||"Ошибка");
  return j;
}
async function catalog(){
  if(!CAT){const r=await fetch("courses.json",{cache:"no-store"});CAT=(await r.json()).courses;
    // закрытые варианты (СтатГрад и т. п.) — только для вошедших
    if(ME){try{CAT=CAT.concat((await api("materials")).materials||[])}catch(e){}}}
  return CAT;
}
function header(){
  const who=document.getElementById("who"),lo=document.getElementById("logout");
  who.hidden=lo.hidden=!ME;
  if(ME)who.innerHTML=esc(ME.name)+'<small class="hide-sm">'+esc(ME.login)+"</small>";
  document.getElementById("h1").textContent=ME?(ME.role==="teacher"?"Кабинет учителя":"Привет, "+ME.name.split(" ")[0]+"!"):"Личный кабинет";
  document.getElementById("hsub").textContent=ME?(ME.role==="teacher"?"Ученики и их прогресс по курсам":"Твои курсы и прогресс — сохраняется на любом устройстве"):"Вход для учеников";
}
function setBusy(btn,on,text){if(on){btn.dataset.t=btn.textContent;btn.textContent=text||"Подождите…";btn.disabled=true}else{btn.textContent=btn.dataset.t||btn.textContent;btn.disabled=false}}
function msg(el,text,good){el.hidden=!text;el.textContent=text||"";el.className="msg"+(good?" good":"")}
const nextUrl=()=>{const n=new URLSearchParams(location.search).get("next")||"";return /^\.\.\/[\w\-\/]*\/?(\?m=[\w\-]+)?(#[\w.\-]*)?$/.test(n)?n:""};
function clearLocal(){try{Object.keys(localStorage).filter(k=>k.indexOf("course-")===0).forEach(k=>localStorage.removeItem(k))}catch(e){}}

