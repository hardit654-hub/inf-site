/* Новогоднее оформление: падающий снег и гирлянда сверху страницы.
   Подключается одной строкой на странице. Снег можно выключить кнопкой ❄ (запоминается на устройстве).
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
    var label = function () { var t = off ? 'Включить снег' : 'Выключить снег'; btn.title = t; btn.setAttribute('aria-label', t); btn.classList.toggle('off', off); };
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
    if (reduce) btn.style.display = 'none';
    start();
  });
})();
