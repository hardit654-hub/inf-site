/* ---------- вход ---------- */
function viewLogin(teacherExists){
  if(!teacherExists)return viewSetup();
  app.innerHTML=`<div class="card narrow"><h2>Вход</h2><p class="sub">Логин и пароль выдаёт преподаватель.</p>
   <form id="f" autocomplete="on">
    <div class="field"><label for="l">Логин</label><input id="l" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" required></div>
    <div class="field"><label for="p">Пароль</label><input id="p" type="password" name="password" autocomplete="current-password" required></div>
    <button class="btn wide" id="go">Войти</button><div id="m" hidden></div>
   </form><p class="hint">Забыли пароль? Напишите преподавателю — он выдаст новый.</p></div>`;
  const f=document.getElementById("f"),m=document.getElementById("m"),go=document.getElementById("go");
  document.getElementById("l").focus();
  f.onsubmit=async e=>{e.preventDefault();msg(m,"");setBusy(go,true,"Входим…");
    try{const j=await api("login",{login:f.l.value,password:f.p.value});ME=j.user;CAT=null;clearLocalIfOther();const n=nextUrl();if(n){location.href=n;return}route()}
    catch(err){msg(m,err.message);setBusy(go,false)}};
}
function clearLocalIfOther(){
  // На общем компьютере не смешиваем прогресс разных учеников: чужой локальный прогресс убираем.
  try{Object.keys(localStorage).filter(k=>k.indexOf("course-")===0).forEach(k=>{const x=JSON.parse(localStorage.getItem(k)||"null");if(x&&x.uid&&x.uid!==ME.id)localStorage.removeItem(k)})}catch(e){}
}
function viewSetup(){
  app.innerHTML=`<div class="card narrow"><h2>Первая настройка</h2><p class="sub">Создайте учётную запись учителя. Это можно сделать один раз; потом форма исчезнет.</p>
   <form id="f">
    <div class="field"><label for="c">Код настройки</label><input id="c" type="password" autocomplete="off" required><p class="note">Это пароль базы данных, который вы сохранили в секрете DB_PASSWORD на GitHub.</p></div>
    <div class="field"><label for="n">Имя</label><input id="n" value="Артём Свинченко" required></div>
    <div class="field"><label for="l">Логин учителя</label><input id="l" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="например, artem" required></div>
    <div class="field"><label for="p">Пароль (не короче 8 символов)</label><input id="p" type="password" autocomplete="new-password" minlength="8" required></div>
    <div class="field"><label for="p2">Пароль ещё раз</label><input id="p2" type="password" autocomplete="new-password" required></div>
    <button class="btn wide" id="go">Создать и войти</button><div id="m" hidden></div>
   </form></div>`;
  const f=document.getElementById("f"),m=document.getElementById("m"),go=document.getElementById("go");
  f.onsubmit=async e=>{e.preventDefault();msg(m,"");
    if(f.p.value!==f.p2.value){msg(m,"Пароли не совпадают");return}
    setBusy(go,true,"Создаём…");
    try{const j=await api("setup",{code:f.c.value,name:f.n.value,login:f.l.value,password:f.p.value});ME=j.user;route()}
    catch(err){msg(m,err.message);setBusy(go,false)}};
}

/* номер урока для показа (внутренний номер остаётся ключом прогресса) */
const LN=l=>l.label||l.num;
/* ключ шага (i — позиция с 0) и позиция шага по ключу */
const K=(l,i)=>l.keys?l.keys[i]:String(i+1);
const P=(l,k)=>l.keys?l.keys.indexOf(String(k))+1:+k;
