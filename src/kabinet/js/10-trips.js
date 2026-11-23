/* ---------- заявки на поездку (форма gsvv.ru/forms) ---------- */
const TRIP_PROF={science:"Естествознание",pomory:"Поморский",later:"Не выбрали"};
async function paneTrips(){
  const pane=document.getElementById("pane");
  pane.innerHTML='<div class="loading">Загрузка заявок…</div>';
  let T;
  try{T=(await api("trips")).trips}catch(e){pane.innerHTML=`<div class="msg">${esc(e.message)}</div>`;return}
  const byGrade={},byProf={};
  T.forEach(t=>{byGrade[t.grade]=(byGrade[t.grade]||0)+1;byProf[t.profile||"later"]=(byProf[t.profile||"later"]||0)+1});
  const stats=[`всего <b>${T.length}</b>`]
    .concat([5,6,7,8].map(g=>`${g} класс — <b>${byGrade[g]||0}</b>`))
    .concat(!T.length?[]:[`Естествознание — <b>${byProf.science||0}</b>`, `Поморский — <b>${byProf.pomory||0}</b>`]
      .concat(byProf.later?[`не выбрали — <b>${byProf.later}</b>`]:[]));
  const csvq=v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"';
  const csv="\uFEFF"+["Дата","Ученик","Родитель","Телефон","Класс","Профиль","Комментарий"].map(csvq).join(";")+"\n"
    +T.map(t=>[new Date(t.created*1000).toLocaleString("ru-RU"),t.kid,t.parent,t.phone,t.grade,TRIP_PROF[t.profile]||t.profile,t.note].map(csvq).join(";")).join("\n");
  pane.innerHTML=`<div class="card"><h2>Заявки на поездку «Масленица на Севере»</h2>
    <p class="hint">${stats.join(" · ")}</p>
    <p class="hint">Это предварительные заявки: каждая — только запрос места, участие подтверждается отдельно. Форма: <a href="../forms/" target="_blank" rel="noopener">gsvv.ru/forms</a></p>
    <div class="bulk"><span class="bn">Для таблицы Excel: скачайте CSV и откройте в Excel или Google-таблицах.</span>
      <span class="bacts"><button class="btn small" type="button" id="tripcsv" ${T.length?"":"disabled"}>Скачать CSV</button>
      <a class="btn small" href="../forms/" target="_blank" rel="noopener">Открыть форму</a></span></div>
    ${T.length?`<div style="overflow:auto"><table class="pt"><thead><tr><th>Дата</th><th>Ученик</th><th>Родитель</th><th>Телефон</th><th>Класс</th><th>Профиль</th><th>Комментарий</th><th></th></tr></thead><tbody>
      ${T.map(t=>`<tr><td style="white-space:nowrap">${esc(new Date(t.created*1000).toLocaleString("ru-RU",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}))}</td>
        <td>${esc(t.kid)}</td><td>${esc(t.parent)}</td><td style="white-space:nowrap"><a href="tel:${esc(t.phone)}">${esc(t.phone)}</a></td>
        <td>${t.grade||"—"}</td><td>${esc(TRIP_PROF[t.profile]||t.profile||"—")}</td><td style="max-width:280px">${esc(t.note)||"—"}</td>
        <td><button class="btn small" type="button" data-tripdel="${t.id}" title="Удалить заявку">✕</button></td></tr>`).join("")}
      </tbody></table></div>`:'<div class="msg">Пока заявок нет. Как только родитель заполнит форму, заявка появится здесь.</div>'}
    </div>`;
  const b=pane.querySelector("#tripcsv");
  if(b)b.onclick=()=>{const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    a.download="заявки-масленица.csv";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),3000)};
  pane.querySelectorAll("[data-tripdel]").forEach(b=>b.onclick=async()=>{
    if(!confirm("Удалить заявку безвозвратно?"))return;
    try{await api("trip_delete",{id:+b.dataset.tripdel});paneTrips()}catch(e){alert(e.message)}});
}