/* ---------- прогресс: подсчёт ---------- */
function stats(course,data){
  const st=(data&&data.st)||{};let done=0,total=0;
  const lessons=course.lessons.map(l=>{let d=0,t=0;const cells=[];
    l.steps.forEach((s,i)=>{if(s!=="task")return;t++;const x=st[l.num+"/"+K(l,i)]||{};if(x.ok)d++;cells.push({n:i+1,x})});
    done+=d;total+=t;return{num:l.num,label:l.label,title:l.title,done:d,total:t,cells}});
  return{done,total,lessons,touched:Object.keys(st).length>0};
}
const pct=(a,b)=>b?Math.round(100*a/b):0;
/* результат варианта, пройденного в режиме экзамена (тестовый балл) */
const exRes=(pr,num)=>{const e=pr&&pr.data&&pr.data.ex&&pr.data.ex[num];return e&&e.fin&&typeof e.test==="number"?e:null};
function ago(ts){
  if(!ts)return"ещё не входил";
  const d=new Date(ts*1000),now=new Date(),t=d.toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"});
  const days=Math.floor((new Date(now.toDateString())-new Date(d.toDateString()))/864e5);
  if(days===0)return"сегодня, "+t;if(days===1)return"вчера, "+t;
  return d.toLocaleDateString("ru-RU",{day:"numeric",month:"short"})+(d.getFullYear()!==now.getFullYear()?" "+d.getFullYear():"");
}

/* ---------- задания ЕГЭ 1–27: учитель отмечает, как даётся каждое ---------- */
const EGE=["Графы и таблицы","Таблицы истинности","Базы данных","Кодирование, условие Фано","Анализ алгоритмов","Черепаха","Графика и звук","Комбинаторика","Электронные таблицы","Поиск в тексте","Объём информации","Машина Тьюринга","IP-адреса и маски","Системы счисления","Логические выражения","Рекурсия","Последовательности","Динамика в таблицах","Теория игр: 1 ход","Теория игр: 2 хода","Теория игр: стратегия","Параллельные процессы","Количество программ","Обработка строк","Делители и маски","Сортировка данных","Анализ данных"];
const SKW={g:"Хорошо получается",y:"Так себе",r:"Не пройдено"};
/* раздел курса для номера задания (ссылка с плитки) */
function skLinks(cat){const m={};(cat||[]).forEach(c=>{if(c.group!=="ЕГЭ"||(typeof closedCourse==="function"&&closedCourse(c.key)))return;const num=(c.key.match(/-s(\d+)$/)||[])[1];if(!num)return;const u=c.url+"?s="+num;
  const t=c.title.match(/№\s*(\d+)(?:[–-](\d+))?/);if(t){for(let k=+t[1];k<=+(t[2]||t[1]);k++)m[k]=u}else if(/Системы счисления/.test(c.title))m[14]=u});return m}
function skCounts(sk){const n={g:0,y:0,r:0,e:0};for(let k=1;k<=27;k++)n[sk[k]||"e"]++;return n}
function skillsCard(sk,cat){
  sk=sk||{};const n=skCounts(sk),L=skLinks(cat);
  return `<section class="card" id="skcard"><h2>Задания ЕГЭ</h2><p class="sub">Отметки учителя по занятиям: что уже получается, что стоит повторить и что ещё впереди.</p>
    <div class="sk-sum"><span><i class="sk-dot g"></i>хорошо <b>${n.g}</b></span><span><i class="sk-dot y"></i>так себе <b>${n.y}</b></span><span><i class="sk-dot r"></i>не пройдено <b>${n.r}</b></span>${n.e?`<span><i class="sk-dot"></i>без отметки <b>${n.e}</b></span>`:""}</div>
    <div class="sk-grid">${EGE.map((t,i)=>{const k=i+1,v=sk[k]||"",tag=L[k]?"a":"div";
      return `<${tag} class="sk-t ${v}"${L[k]?` href="${esc(L[k])}"`:""} title="${esc("№ "+k+" · "+t+(v?" — "+SKW[v]:" — пока без отметки"))}"><b>${k}</b><small>${esc(t)}</small>${L[k]?'<span class="lk">раздел курса →</span>':""}</${tag}>`}).join("")}</div></section>`;
}

