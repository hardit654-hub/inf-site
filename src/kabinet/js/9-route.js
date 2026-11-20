/* ---------- маршрут ---------- */
async function route(){
  header();
  try{
    if(!ME){const h=await api("health");viewLogin(h.teacher);return}
    ME.role==="teacher"?await viewTeacher():await viewStudent();
  }catch(e){app.innerHTML=`<div class="card narrow"><div class="msg">${esc(e.message)}</div><p class="hint"><a href="">Обновить страницу</a></p></div>`}
}
document.getElementById("logout").onclick=async()=>{try{await api("logout",{})}catch(e){}ME=null;clearLocal();route()};

/* тема */
(function(){const b=document.getElementById("theme"),root=document.documentElement;
  const sun='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>';
  const moon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  const isDark=()=>root.dataset.theme?root.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;
  const paint=()=>{b.innerHTML=isDark()?sun:moon};paint();
  b.onclick=()=>{const t=isDark()?"light":"dark";root.dataset.theme=t;try{localStorage.setItem("theme",t)}catch(e){}paint()};
})();

(async()=>{try{ME=(await api("me")).user;if(ME&&nextUrl()){location.replace(nextUrl());return}}catch(e){app.innerHTML=`<div class="card narrow"><div class="msg">${esc(e.message)}</div></div>`;return}route()})();
})();
