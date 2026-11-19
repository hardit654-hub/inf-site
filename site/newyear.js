/* Новогоднее оформление: падающий снег, гирлянда сверху и Санта на санях на заднем плане.
   Подключается одной строкой на странице. Снег и Санту можно выключить кнопкой ❄ (запоминается на устройстве).
   Сам выключается после 15 января. Не мешает нажатиям: всё рисуется поверх страницы «насквозь». */
(function () {
  if (window.__newYear) return; window.__newYear = 1;
  var now = new Date();
  if (now > new Date(2027, 0, 15, 23, 59)) return;           // после праздников ничего не показываем
  var KEY = 'ny-snow-off', reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var off = false; try { off = localStorage.getItem(KEY) === '1'; } catch (e) {}
  var root = document.documentElement;
  var light = function () { return root.getAttribute('data-theme') === 'light'; };

  function ready(f) { document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', f) : f(); }
  ready(function () {
    var css = document.createElement('style');
    css.textContent =
      '.ny-garland{position:fixed;left:0;right:0;top:env(safe-area-inset-top,0px);height:16px;z-index:2147483000;pointer-events:none;overflow:hidden}' +
      '.ny-garland svg{display:block;width:100%;height:16px}' +
      '.ny-b{animation:nyBlink 2.4s ease-in-out infinite}' +
      '@keyframes nyBlink{0%,100%{opacity:1}50%{opacity:.35}}' +
      '.ny-snow{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147482999}' +
      '.ny-btn{position:fixed;bottom:max(14px,env(safe-area-inset-bottom,0px));right:max(14px,env(safe-area-inset-right,0px));z-index:2147483001;' +
      'width:34px;height:34px;border-radius:50%;border:1px solid rgba(127,160,200,.45);background:rgba(20,40,70,.55);color:#fff;font-size:17px;line-height:32px;' +
      'text-align:center;cursor:pointer;padding:0;opacity:.7;transition:opacity .2s,transform .2s;-webkit-tap-highlight-color:transparent}' +
      '.ny-btn:hover{opacity:1;transform:scale(1.08)}.ny-btn.off{opacity:.4}' +
      'html[data-theme="light"] .ny-btn{background:rgba(255,255,255,.8);color:#3b78c4}' +
      '@media (prefers-reduced-motion:reduce){.ny-b{animation:none}}';
    document.head.appendChild(css);

    // гирлянда: провод волной и разноцветные лампочки
    var g = document.createElement('div'); g.className = 'ny-garland'; g.setAttribute('aria-hidden', 'true');
    var colors = ['#ff4d4d', '#ffd23f', '#3ddc84', '#4da3ff', '#ff7ae0'], n = 60, step = 32, w = n * step, s = '';
    var wire = 'M0 3';
    for (var i = 0; i < n; i++) wire += ' Q' + (i * step + step / 2) + ' 9 ' + ((i + 1) * step) + ' 3';
    for (i = 0; i < n; i++) {
      var x = i * step + step / 2, c = colors[i % colors.length];
      s += '<g class="ny-b" style="animation-delay:' + ((i % 5) * 0.48) + 's"><rect x="' + (x - 1.5) + '" y="5" width="3" height="3" fill="#6b7a8c"/>' +
        '<ellipse cx="' + x + '" cy="11" rx="3" ry="4" fill="' + c + '"/><ellipse cx="' + x + '" cy="11" rx="6" ry="6" fill="' + c + '" opacity=".22"/></g>';
    }
    g.innerHTML = '<svg viewBox="0 0 ' + w + ' 16" preserveAspectRatio="xMinYMin slice"><path d="' + wire + '" stroke="#5d6b7c" stroke-width="1.2" fill="none"/>' + s + '</svg>';
    document.body.appendChild(g);

    // кнопка «снег вкл/выкл»; на главной справа внизу уже есть звёздочка — встаём левее
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'ny-btn'; btn.textContent = '❄';
    if (document.querySelector('script[src*="egg.js"]')) btn.style.right = 'calc(max(14px, env(safe-area-inset-right, 0px)) + 44px)';
    var label = function () { var t = off ? 'Включить снег и Санту' : 'Выключить снег и Санту'; btn.title = t; btn.setAttribute('aria-label', t); btn.classList.toggle('off', off); };
    label(); document.body.appendChild(btn);

    var cv = null, ctx, flakes = [], W, H, dpr, raf = 0, last = 0;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var want = Math.round(Math.min(140, W * H / 9000));
      while (flakes.length < want) flakes.push(flake(true));
      flakes.length = want;
    }
    function flake(anyY) {
      var r = Math.random() * 2.6 + 0.8;
      return { x: Math.random() * W, y: anyY ? Math.random() * H : -10, r: r, vy: 0.35 + r * 0.32 + Math.random() * 0.3,
        sway: Math.random() * 1.2 + 0.3, ph: Math.random() * 6.28, star: r > 2.6 && Math.random() < 0.6, rot: Math.random() * 6.28 };
    }
    function star(f) {                                           // крупные снежинки — шестилучевые
      ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.rot); ctx.beginPath();
      for (var k = 0; k < 6; k++) { ctx.moveTo(0, 0); ctx.lineTo(0, f.r * 1.9); ctx.rotate(Math.PI / 3); }
      ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
    }
    function frame(t) {
      raf = requestAnimationFrame(frame);
      var dt = Math.min(3, last ? (t - last) / 16.7 : 1); last = t;
      ctx.clearRect(0, 0, W, H);
      var col = light() ? 'rgba(110,160,220,.75)' : 'rgba(255,255,255,.85)';
      ctx.fillStyle = col; ctx.strokeStyle = col;
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        f.ph += 0.012 * dt; f.y += f.vy * dt; f.x += Math.sin(f.ph) * f.sway * 0.35 * dt; f.rot += 0.004 * dt;
        if (f.y > H + 10 || f.x < -20 || f.x > W + 20) { flakes[i] = flake(false); continue; }
        if (f.star) star(f); else { ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.283); ctx.fill(); }
      }
    }
    function start() {
      if (off || reduce || raf) return;
      if (!cv) { cv = document.createElement('canvas'); cv.className = 'ny-snow'; cv.setAttribute('aria-hidden', 'true'); ctx = cv.getContext('2d'); document.body.appendChild(cv); size(); addEventListener('resize', size); }
      cv.style.display = ''; last = 0; raf = requestAnimationFrame(frame);
    }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; if (cv) { ctx.clearRect(0, 0, W, H); cv.style.display = 'none'; } }
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    btn.addEventListener('click', function () {
      off = !off; try { localStorage.setItem(KEY, off ? '1' : '0'); } catch (e) {}
      label(); off ? stop() : start();
    });
    // Санта на санях с оленями пролетает в верхней части экрана раз в 25–45 секунд: под шапкой и окнами, полупрозрачный
    var santaCss = document.createElement('style');
    santaCss.textContent =
      '.ny-santa{position:fixed;left:0;top:0;width:min(300px,52vw);pointer-events:none;z-index:1;opacity:.85;will-change:transform}' +
      'html[data-theme="light"] .ny-santa{opacity:1}' +
      '.ny-santa svg{display:block;width:100%;height:auto;overflow:visible}' +
      '.ny-rd .lg{transform-box:fill-box;transform-origin:50% 0;animation:nyLeg .5s ease-in-out infinite alternate}' +
      '.ny-rd .lg.b{animation-delay:-.25s}@keyframes nyLeg{from{transform:rotate(28deg)}to{transform:rotate(-28deg)}}' +
      '.ny-sp{animation:nySp 1s linear infinite}@keyframes nySp{0%{opacity:0}30%{opacity:1}100%{opacity:0}}';
    document.head.appendChild(santaCss);
    function deer(x) {                                         // олень: тело, голова, рога, ноги в галопе
      return '<g class="ny-rd" transform="translate(' + x + ',0)" fill="#8a5a36" stroke="#8a5a36">' +
        '<ellipse cx="0" cy="40" rx="17" ry="8"/><path d="M12 36 L20 24 L26 25 L18 38 Z"/><ellipse cx="25" cy="23" rx="6" ry="4"/>' +
        '<circle cx="30" cy="23" r="2" fill="#e53935" stroke="none"/>' +
        '<path d="M22 19 L19 9 M20.5 13 L16 11 M24 19 L27 9 M25.5 13 L30 11" fill="none" stroke-width="1.6" stroke-linecap="round"/>' +
        '<path d="M-17 38 L-23 34" fill="none" stroke-width="2.5" stroke-linecap="round"/>' +
        '<g fill="none" stroke-width="2.6" stroke-linecap="round"><path class="lg" d="M10 45 L12 58"/><path class="lg b" d="M5 46 L6 58"/>' +
        '<path class="lg b" d="M-9 45 L-12 58"/><path class="lg" d="M-13 44 L-16 57"/></g></g>';
    }
    var sv = '<svg viewBox="0 0 300 80" aria-hidden="true">' +
      '<g fill="#ffe680"><circle class="ny-sp" cx="4" cy="58" r="1.6"/><circle class="ny-sp" style="animation-delay:.3s" cx="14" cy="52" r="1.2"/>' +
      '<circle class="ny-sp" style="animation-delay:.6s" cx="-6" cy="62" r="1.4"/></g>' +
      // сани
      '<path d="M22 66 Q16 66 18 58 L26 40 L78 40 L84 58 Q86 66 78 66 Z" fill="#c62828"/>' +
      '<path d="M26 40 L78 40 L80 45 L24 45 Z" fill="#e8b84a"/>' +
      '<path d="M12 72 L84 72 Q96 72 96 62" fill="none" stroke="#e8b84a" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M30 66 L30 72 M70 66 L70 72" stroke="#e8b84a" stroke-width="2.5"/>' +
      // мешок с подарками
      '<path d="M28 42 Q24 22 38 20 Q46 22 46 42 Z" fill="#7b4f2c"/><path d="M34 20 L40 16 L42 21" fill="none" stroke="#5c3a1f" stroke-width="2"/>' +
      // Санта
      '<path d="M50 42 Q50 26 60 25 Q70 26 70 42 Z" fill="#d32f2f"/><rect x="50" y="36" width="20" height="4" fill="#3a2a1a"/>' +
      '<circle cx="61" cy="19" r="6.5" fill="#f6c9a8"/><path d="M54.5 19 Q61 34 67.5 19 Q61 23 54.5 19 Z" fill="#fff"/>' +
      '<path d="M54 15 Q60 2 70 9 L67 15 Z" fill="#d32f2f"/><rect x="53" y="13.5" width="16" height="4" rx="2" fill="#fff"/><circle cx="71" cy="9" r="2.6" fill="#fff"/>' +
      '<path d="M68 30 Q78 30 86 36" fill="none" stroke="#d32f2f" stroke-width="4" stroke-linecap="round"/>' +
      // упряжь и олени
      '<path d="M86 36 Q140 30 196 38 Q236 34 268 38" fill="none" stroke="#5c3a1f" stroke-width="1.2"/>' +
      deer(150) + deer(195) + deer(245) + '</svg>';
    var santa = null, flying = false, timer = 0;
    function fly() {
      if (off || reduce || flying || document.hidden) { schedule(); return; }
      flying = true;
      if (!santa) { santa = document.createElement('div'); santa.className = 'ny-santa'; santa.innerHTML = sv; document.body.appendChild(santa); }
      santa.style.display = '';
      var ltr = Math.random() < 0.5, sw = santa.offsetWidth || 300, H0 = innerHeight * (0.12 + Math.random() * 0.25);
      var from = ltr ? -sw - 20 : innerWidth + 20, to = ltr ? innerWidth + 20 : -sw - 20, dur = 11000 + Math.random() * 5000, t0 = 0;
      santa.querySelector('svg').style.transform = ltr ? '' : 'scaleX(-1)';
      function step(t) {
        if (!t0) t0 = t;
        var p = (t - t0) / dur;
        if (p >= 1 || off) { santa.style.display = 'none'; flying = false; schedule(); return; }
        var x = from + (to - from) * p, y = H0 - Math.sin(p * Math.PI) * innerHeight * 0.08 + Math.sin(p * 18) * 6;
        santa.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + (Math.cos(p * 18) * 2 * (ltr ? -1 : 1)) + 'deg)';
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    function schedule(first) { clearTimeout(timer); timer = setTimeout(fly, first ? 3000 : 25000 + Math.random() * 20000); }
    btn.addEventListener('click', function () { if (!off && !flying) schedule(true); });

    if (reduce) btn.style.display = 'none';
    else schedule(true);
    start();
  });
})();
