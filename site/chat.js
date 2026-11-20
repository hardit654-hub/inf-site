/* Чат сайта: кнопка справа внизу (над ❄ и ★), есть на всех страницах.
   Пишут и читают только вошедшие в личный кабинет: видно ник («Имя Ф.», у учителя — полностью) и тег места в рейтинге.
   Новые сообщения всплывают над кнопкой, старые уходят вверх, размываются и тают; в открытом чате видны последние 5.
   Сообщения хранятся на сервере сутки, грубые слова заменяются звёздочками (src/api/3a-chat.php, 6a-actions-chat.php).
   Подключается из newyear.js (эта часть не выключается после праздников). */
(function () {
  if (window.__chat) return; window.__chat = 1;
  var me = document.currentScript, src = (me && me.src) || location.origin + '/inf/chat.js';
  var ROOT = src.replace(/chat\.js(\?.*)?$/, ''), API = ROOT + 'api/index.php';
  var TAGS = ['👑 Чемпион', '🖤 Тёмный принц', '🐳 Дипсик-мастер', '👸 Принцесса', '🍦 Воздушный рожок', '🚀 Ракета', '🍀 Счастливая семёрка'];
  var SHOW = 5, FLOAT_MS = 20000, POLL_OPEN = 3000, POLL_CLOSED = 10000;

  function ready(f) { document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', f) : f(); }
  ready(function () {
    var css = document.createElement('style');
    css.textContent =
      '.ch-btn{position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:calc(max(14px,env(safe-area-inset-bottom,0px)) + 46px);z-index:2147483001;' +
      'width:44px;height:44px;border-radius:50%;border:1px solid #ffffff38;background:#16181cd9;color:#fff;cursor:pointer;padding:0;' +
      'display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px #0004;transition:transform .15s;-webkit-tap-highlight-color:transparent}' +
      '.ch-btn:hover{transform:scale(1.08)}.ch-btn svg{width:22px;height:22px}' +
      '.ch-btn.on{background:#2f7d43;border-color:#5fd27a}' +
      '.ch-dot{position:absolute;top:-2px;right:-2px;min-width:18px;height:18px;border-radius:9px;background:#e53935;color:#fff;font:700 11px/18px system-ui,sans-serif;text-align:center;padding:0 4px;box-sizing:border-box;display:none}' +
      '.ch-wrap{position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:calc(max(14px,env(safe-area-inset-bottom,0px)) + 100px);z-index:2147483001;' +
      'width:min(340px,calc(100vw - 28px));display:flex;flex-direction:column;align-items:flex-end;gap:6px;pointer-events:none;' +
      'font:400 14px/1.35 "Golos Text",system-ui,-apple-system,"Segoe UI",sans-serif}' +
      '.ch-feed{display:flex;flex-direction:column;align-items:flex-end;gap:6px;width:100%}' +
      '.ch-m{max-width:100%;box-sizing:border-box;padding:7px 11px 8px;border-radius:14px;color:#fff;background:rgba(22,26,34,.62);border:1px solid rgba(255,255,255,.14);' +
      '-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 4px 16px rgba(0,0,0,.25);word-wrap:break-word;overflow-wrap:anywhere;' +
      'transition:opacity .5s,filter .5s,transform .45s cubic-bezier(.2,.8,.3,1);animation:chIn .4s cubic-bezier(.2,.8,.3,1)}' +
      '.ch-m.mine{background:rgba(32,92,52,.66);border-color:rgba(120,220,140,.3)}' +
      '.ch-m.out{opacity:0!important;filter:blur(6px)!important;transform:translateY(-24px) scale(.96)!important}' +
      '@keyframes chIn{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}' +
      '.ch-h{display:flex;align-items:center;flex-wrap:wrap;gap:5px;margin-bottom:2px}' +
      '.ch-n{font-weight:700;color:#ffd54a}.ch-m.mine .ch-n{color:#a5f0b5}.ch-t{margin-left:auto;font-size:11px;opacity:.6}' +
      '.ch-g{font:700 11px/1 system-ui,sans-serif;display:inline-flex;align-items:center;gap:3px;padding:3px 7px;border-radius:999px;white-space:nowrap;border:1px solid}' +
      '.ch-g1{background:#fff3c4;color:#5c3a00;border-color:#e0ac1f}.ch-g2{background:#2a2140;color:#f0e8ff;border-color:#7a66b8}' +
      '.ch-g3{background:#e3f0ff;color:#0f3466;border-color:#6f9fdc}.ch-g4{background:#ffe3f1;color:#7a0f4c;border-color:#e57fb3}' +
      '.ch-g5{background:#fbecd6;color:#5e3610;border-color:#d39a55}.ch-g6{background:#ffe6dc;color:#8a2a08;border-color:#f0956f}' +
      '.ch-g7{background:#e2f6e2;color:#1d5c1d;border-color:#7cc47c}.ch-gt{background:#1d3b2a;color:#c9f7d4;border-color:#4caf6a}' +
      '.ch-g .emj{width:1em;height:1em}' +
      '.ch-form{display:none;width:100%;pointer-events:auto;gap:6px;padding:6px;box-sizing:border-box;border-radius:16px;background:rgba(22,26,34,.82);' +
      'border:1px solid rgba(255,255,255,.16);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 6px 22px rgba(0,0,0,.3)}' +
      '.ch-wrap.open .ch-form{display:flex}' +
      '.ch-in{flex:1;min-width:0;border:0;outline:0;border-radius:11px;padding:9px 11px;background:rgba(255,255,255,.1);color:#fff;font:inherit}' +
      '.ch-in::placeholder{color:rgba(255,255,255,.55)}' +
      '.ch-send{flex:none;width:40px;border:0;border-radius:11px;background:#2f9e50;color:#fff;font-size:17px;cursor:pointer}.ch-send:disabled{opacity:.5}' +
      '.ch-note{display:none;width:100%;box-sizing:border-box;pointer-events:auto;padding:9px 12px;border-radius:14px;background:rgba(22,26,34,.85);color:#fff;' +
      'border:1px solid rgba(255,255,255,.16);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}' +
      '.ch-note a{color:#7ee08f;font-weight:700}' +
      '.ch-err{color:#ffb4a8;font-size:12px;width:100%;text-align:right;text-shadow:0 1px 2px #000}' +
      '.ch-empty{color:#fff;opacity:.75;font-size:13px;text-shadow:0 1px 3px #000}' +
      'html[data-theme="light"] .ch-m{background:rgba(255,255,255,.72);color:#1b1d22;border-color:rgba(0,0,0,.1)}' +
      'html[data-theme="light"] .ch-m.mine{background:rgba(220,246,226,.82)}' +
      'html[data-theme="light"] .ch-n{color:#8a5a00}html[data-theme="light"] .ch-m.mine .ch-n{color:#1d6b32}' +
      'html[data-theme="light"] .ch-empty{color:#1b1d22;text-shadow:none}' +
      '@media (prefers-reduced-motion:reduce){.ch-m{animation:none;transition:none}}';
    document.head.appendChild(css);

    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'ch-btn'; btn.title = 'Чат'; btn.setAttribute('aria-label', 'Чат');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 5.5h16v10H10l-4.5 3.5v-3.5H4z"/><path d="M8 9.5h8M8 12.5h5"/></svg><span class="ch-dot"></span>';
    var wrap = document.createElement('div'); wrap.className = 'ch-wrap';
    wrap.innerHTML = '<div class="ch-feed" aria-live="polite"></div>' +
      '<div class="ch-note">Чат — для учеников. <a href="' + ROOT + 'kabinet/">Войди в личный кабинет</a>, чтобы читать и писать.</div>' +
      '<form class="ch-form" autocomplete="off"><input class="ch-in" maxlength="200" placeholder="Сообщение…" aria-label="Сообщение">' +
      '<button class="ch-send" type="submit" aria-label="Отправить">➤</button></form>';
    document.body.appendChild(wrap); document.body.appendChild(btn);
    var feed = wrap.querySelector('.ch-feed'), form = wrap.querySelector('.ch-form'), inp = wrap.querySelector('.ch-in'),
      send = wrap.querySelector('.ch-send'), note = wrap.querySelector('.ch-note'), dot = btn.querySelector('.ch-dot');

    var open = false, guest = false, lastId = 0, hist = [], els = {}, unread = 0, timer = 0, busy = false, first = true;

    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function hhmm(ts) { var d = new Date(ts * 1000); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
    function tagHtml(t) {
      if (t === 'teacher') return '<span class="ch-g ch-gt">📚 Учитель</span>';
      return t >= 1 && t <= TAGS.length ? '<span class="ch-g ch-g' + t + '">' + TAGS[t - 1] + '</span>' : '';
    }
    function node(m) {
      var d = document.createElement('div');
      d.className = 'ch-m' + (m.me ? ' mine' : '');
      d.innerHTML = '<div class="ch-h"><span class="ch-n">' + esc(m.name) + '</span>' + tagHtml(m.tag) + '<span class="ch-t">' + hhmm(m.ts) + '</span></div>' +
        '<div class="ch-x"></div>';
      d.querySelector('.ch-x').textContent = m.text;
      return d;
    }

    /* что показывать: в открытом чате — последние 5, в закрытом — только свежие (всплывают и тают) */
    function render() {
      var now = Date.now();
      var list = (open ? hist : hist.filter(function (m) { return m.until > now; })).slice(-SHOW);
      var keep = {};
      list.forEach(function (m) { keep[m.id] = 1; });
      Object.keys(els).forEach(function (id) {
        if (keep[id]) return;
        var e = els[id]; delete els[id];
        e.classList.add('out'); setTimeout(function () { e.remove(); }, 500);
      });
      list.forEach(function (m) { if (!els[m.id]) { els[m.id] = node(m); feed.appendChild(els[m.id]); } });
      var empty = feed.querySelector('.ch-empty');
      if (open && !guest && !list.length) { if (!empty) { empty = document.createElement('div'); empty.className = 'ch-empty'; empty.textContent = 'Пока тихо. Напиши первым!'; feed.appendChild(empty); } }
      else if (empty) empty.remove();
      for (var i = 0; i < list.length; i++) {                 // чем выше (старше), тем прозрачнее и размытее
        var k = list.length - 1 - i, e = els[list[i].id];
        e.style.opacity = [1, 0.93, 0.78, 0.58, 0.38][k];
        e.style.filter = k >= 2 ? 'blur(' + [0, 0, 0.6, 1.2, 2][k] + 'px)' : '';
      }
    }
    setInterval(function () { if (!open && Object.keys(els).length) render(); }, 1000);

    function setDot() { dot.style.display = unread ? 'block' : 'none'; dot.textContent = unread > 9 ? '9+' : unread; }

    function poll() {
      clearTimeout(timer);
      if (guest) return;
      if (document.hidden && !first) { timer = setTimeout(poll, POLL_CLOSED); return; }
      fetch(API + '?action=chat&after=' + lastId, { credentials: 'same-origin', cache: 'no-store' })
        .then(function (r) { return r.json().then(function (j) { return { st: r.status, j: j }; }); })
        .then(function (res) {
          if (res.st === 401) { guest = true; if (open) showGuest(); return; }
          if (!res.j || !res.j.ok) return;
          var now = Date.now(), skew = now - res.j.now * 1000;
          res.j.msgs.forEach(function (m) {
            if (m.id <= lastId) return;
            lastId = m.id;
            var age = now - (m.ts * 1000 + skew);                // при первой загрузке всплывают только сообщения последней минуты
            m.until = first && age > 60000 ? 0 : now + FLOAT_MS;
            hist.push(m);
            if (!open && !m.me && m.until) unread++;
          });
          if (hist.length > 60) hist = hist.slice(-60);
          first = false; setDot(); render();
        })
        .catch(function () {})
        .then(function () { if (!guest) timer = setTimeout(poll, open ? POLL_OPEN : POLL_CLOSED); });
    }
    function showGuest() { note.style.display = 'block'; wrap.classList.remove('open'); }

    function toggle(v) {
      open = v === undefined ? !open : v;
      btn.classList.toggle('on', open); btn.title = open ? 'Свернуть чат' : 'Чат';
      if (open) {
        unread = 0; setDot();
        if (guest) showGuest(); else { wrap.classList.add('open'); setTimeout(function () { inp.focus(); }, 30); poll(); }
      } else {
        wrap.classList.remove('open'); note.style.display = 'none';
        var now = Date.now(); hist.forEach(function (m) { m.until = Math.min(m.until, now); });   // свернул — сообщения тают
      }
      render();
    }
    btn.addEventListener('click', function () { toggle(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) toggle(false); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden && !guest) poll(); });

    var errEl = null;
    function err(msg) {
      if (errEl) errEl.remove();
      errEl = document.createElement('div'); errEl.className = 'ch-err'; errEl.textContent = msg;
      wrap.insertBefore(errEl, form); var e = errEl;
      setTimeout(function () { e.remove(); if (errEl === e) errEl = null; }, 3500);
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = inp.value.trim();
      if (!text || busy) return;
      busy = true; send.disabled = true;
      fetch(API + '?action=chat_send', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-Inf': '1' }, body: JSON.stringify({ text: text }) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.ok) { inp.value = ''; poll(); }
          else if (j && j.error === 'Нужно войти') { guest = true; showGuest(); }
          else err((j && j.error) || 'Не отправилось, попробуй ещё раз');
        })
        .catch(function () { err('Нет связи с сервером'); })
        .then(function () { busy = false; send.disabled = false; inp.focus(); });
    });

    poll();
  });
})();
