/* Мини-игра «Базука» (новогодняя): кнопка слева внизу на главной и в кабинете.
   Базука от первого лица внизу экрана. Тянешь назад и отпускаешь (как в Angry Birds): направление и сила — от рывка,
   прицела нет. Ракета летит по баллистике. Попал в сани — взрыв, и Дед Мороз рассыпается подарками.
   Попал в оленя — он отцепляется и падает, а сани идут в пике: один олень — плавно, два и больше — круто, как подбитый самолёт;
   у земли сани разбиваются на подарки, а уцелевшие олени убегают.
   Подключается из newyear.js (после 15.01.2027 вместе с ним выключается). Проверка на любой странице: ?bazooka */
(function () {
  if (window.__bazooka) return; window.__bazooka = 1;
  if (!/\/inf\/(kabinet\/)?(index\.html)?$/.test(location.pathname) && !/[?&]bazooka\b/.test(location.search)) return;

  function ready(f) { document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', f) : f(); }

  /* ---------- картинки: Дед Мороз с оленями и одни олени ---------- */
  function deer(x) {
    return '<g transform="translate(' + x + ',0)" fill="#8a5a36" stroke="#8a5a36">' +
      '<ellipse cx="0" cy="40" rx="17" ry="8"/><path d="M12 36 L20 24 L26 25 L18 38 Z"/><ellipse cx="25" cy="23" rx="6" ry="4"/>' +
      '<circle cx="30" cy="23" r="2" fill="#e53935" stroke="none"/>' +
      '<path d="M22 19 L19 9 M20.5 13 L16 11 M24 19 L27 9 M25.5 13 L30 11" fill="none" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path d="M-17 38 L-23 34" fill="none" stroke-width="2.5" stroke-linecap="round"/>' +
      '<g fill="none" stroke-width="2.6" stroke-linecap="round"><path d="M10 45 L14 57"/><path d="M5 46 L3 58"/>' +
      '<path d="M-9 45 L-6 57"/><path d="M-13 44 L-18 56"/></g></g>';
  }
  var SLEIGH =
    '<path d="M22 66 Q16 66 18 58 L26 40 L78 40 L84 58 Q86 66 78 66 Z" fill="#c62828"/>' +
    '<path d="M26 40 L78 40 L80 45 L24 45 Z" fill="#e8b84a"/>' +
    '<path d="M12 72 L84 72 Q96 72 96 62" fill="none" stroke="#e8b84a" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M30 66 L30 72 M70 66 L70 72" stroke="#e8b84a" stroke-width="2.5"/>' +
    '<path d="M28 42 Q24 22 38 20 Q46 22 46 42 Z" fill="#7b4f2c"/><path d="M34 20 L40 16 L42 21" fill="none" stroke="#5c3a1f" stroke-width="2"/>' +
    '<path d="M50 42 Q50 26 60 25 Q70 26 70 42 Z" fill="#d32f2f"/><rect x="50" y="36" width="20" height="4" fill="#3a2a1a"/>' +
    '<circle cx="61" cy="19" r="6.5" fill="#f6c9a8"/><path d="M54.5 19 Q61 34 67.5 19 Q61 23 54.5 19 Z" fill="#fff"/>' +
    '<path d="M54 15 Q60 2 70 9 L67 15 Z" fill="#d32f2f"/><rect x="53" y="13.5" width="16" height="4" rx="2" fill="#fff"/><circle cx="71" cy="9" r="2.6" fill="#fff"/>' +
    '<path d="M68 30 Q78 30 86 36" fill="none" stroke="#d32f2f" stroke-width="4" stroke-linecap="round"/>';
  var DX = [150, 195, 245];                                       // где олени на рисунке (в единицах 300×80)
  function img(body) {
    var i = new Image();
    i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" width="600" height="160">' + body + '</svg>');
    return i;
  }
  var IMG_SLEIGH = img(SLEIGH), IMG_D = DX.map(function (x) { return img(deer(x)); });

  ready(function () {
    var css = document.createElement('style');
    css.textContent =
      '.bz-btn{position:fixed;left:max(14px,env(safe-area-inset-left,0px));bottom:max(14px,env(safe-area-inset-bottom,0px));z-index:2147483001;' +
      'width:44px;height:44px;border-radius:50%;border:1px solid #ffffff38;background:#16181cd9;color:#fff;cursor:pointer;padding:0;' +
      'display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px #0004;transition:transform .15s}' +
      '.bz-btn:hover{transform:scale(1.08)}.bz-btn svg{width:28px;height:28px}' +
      '.bz-wrap{position:fixed;inset:0;z-index:2147483002;touch-action:none;user-select:none;-webkit-user-select:none;cursor:crosshair}' +
      '.bz-wrap canvas{position:absolute;inset:0;width:100%;height:100%;display:block}' +
      '.bz-hud{position:absolute;left:14px;top:12px;color:#fff;font:600 15px/1.35 "Golos Text",system-ui,sans-serif;text-shadow:0 1px 3px #000a;pointer-events:none}' +
      '.bz-hud b{color:#ffd54a}' +
      '.bz-hint{position:absolute;left:50%;top:18%;transform:translateX(-50%);width:min(92vw,520px);text-align:center;color:#fff;' +
      'font:600 17px/1.4 "Golos Text",system-ui,sans-serif;background:#0008;border-radius:14px;padding:12px 16px;pointer-events:none;transition:opacity .6s}' +
      '.bz-x{position:absolute;right:14px;top:12px;width:40px;height:40px;border-radius:50%;border:1px solid #ffffff55;background:#0007;color:#fff;' +
      'font:600 20px/1 system-ui,sans-serif;cursor:pointer}';
    document.head.appendChild(css);

    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'bz-btn'; btn.title = 'Базука: попади в Деда Мороза'; btn.setAttribute('aria-label', btn.title);
    btn.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><g transform="rotate(-35 16 16)">' +
      '<rect x="3" y="12" width="24" height="8" rx="2" fill="#5d6b38"/><rect x="25" y="10.5" width="4" height="11" rx="1" fill="#39421f"/>' +
      '<rect x="11" y="12" width="3" height="8" fill="#e8b84a"/><rect x="9" y="20" width="3" height="5" rx="1" fill="#39421f"/>' +
      '<path d="M29 16 L31.5 14.5 L31.5 17.5 Z" fill="#ff7043"/></g></svg>';
    document.body.appendChild(btn);
    btn.addEventListener('click', open);

    var wrap, cv, ctx, hud, hint, W, H, DPR, raf = 0, last = 0, running = false;
    var aim = -Math.PI / 2, power = 0, drag = null;
    var rockets = [], parts = [], gifts = [], texts = [], runners = [], santa = null, nextSanta = 0, hits = 0, shots = 0, best = 0;
    try { best = +localStorage.getItem('bz-best') || 0; } catch (e) {}

    function open() {
      if (running) return;
      wrap = document.createElement('div'); wrap.className = 'bz-wrap';
      wrap.innerHTML = '<canvas></canvas><div class="bz-hud"></div><div class="bz-hint">Потяни назад и отпусти — ракета полетит по дуге.<br>Чем дальше тянешь, тем сильнее выстрел. Попади в Деда Мороза!<br>Подбитые олени — и сани уходят в пике.</div>' +
        '<button type="button" class="bz-x" aria-label="Закрыть игру" title="Закрыть (Esc)">✕</button>';
      document.body.appendChild(wrap);
      cv = wrap.querySelector('canvas'); ctx = cv.getContext('2d'); hud = wrap.querySelector('.bz-hud'); hint = wrap.querySelector('.bz-hint');
      wrap.querySelector('.bz-x').addEventListener('click', close);
      wrap.addEventListener('pointerdown', down); wrap.addEventListener('pointermove', move);
      wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', function () { drag = null; power = 0; });
      document.addEventListener('keydown', key); window.addEventListener('resize', size);
      document.documentElement.style.overflow = 'hidden';
      size(); rockets = []; parts = []; gifts = []; texts = []; runners = []; santa = null; nextSanta = 0.6; hits = 0; shots = 0;
      running = true; btn.style.display = 'none'; score(); last = 0; raf = requestAnimationFrame(frame);
    }
    function close() {
      running = false; cancelAnimationFrame(raf);
      document.removeEventListener('keydown', key); window.removeEventListener('resize', size);
      document.documentElement.style.overflow = '';
      if (wrap) wrap.remove(); wrap = null; btn.style.display = '';
    }
    function key(e) { if (e.key === 'Escape') close(); }
    function size() {
      DPR = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
      cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    function score() {
      hud.innerHTML = 'Попаданий: <b>' + hits + '</b> · выстрелов: ' + shots + (best ? ' · рекорд: ' + best : '');
    }

    /* ---------- базука и управление ---------- */
    var G = function () { return H * 1.15; };                    // гравитация, пикс/с²
    var VMAX = function () { return Math.sqrt(2 * G() * H) * 1.08; };
    function pivot() { return { x: W / 2, y: H + 24 }; }
    function tubeLen() { return Math.max(110, Math.min(190, H * 0.24)); }
    function muzzle() { var p = pivot(), L = tubeLen(); return { x: p.x + Math.cos(aim) * L, y: p.y + Math.sin(aim) * L }; }
    function pos(e) { var r = wrap.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function down(e) {
      if (e.target.closest('.bz-x')) return;
      drag = pos(e); power = 0; try { wrap.setPointerCapture(e.pointerId); } catch (x) {}
      if (hint) hint.style.opacity = '0';
    }
    function move(e) {
      if (!drag) return;
      var p = pos(e), dx = drag.x - p.x, dy = drag.y - p.y, d = Math.hypot(dx, dy);
      if (d < 6) return;
      var a = Math.atan2(dy, dx);                                 // тянем назад — летит вперёд
      if (a > 0) a = a > Math.PI / 2 ? -Math.PI + 0.12 : -0.12;    // только вверх
      aim = Math.max(-Math.PI + 0.12, Math.min(-0.12, a));
      power = Math.min(1, d / Math.max(140, Math.min(W, H) * 0.42));
    }
    function up() {
      if (!drag) return;
      drag = null;
      if (power < 0.08) { power = 0; return; }
      var m = muzzle(), v = VMAX() * (0.25 + 0.75 * power);
      rockets.push({ x: m.x, y: m.y, vx: Math.cos(aim) * v, vy: Math.sin(aim) * v, t: 0 });
      for (var i = 0; i < 14; i++) puff(m.x, m.y, Math.cos(aim) * 80 + rnd(-90, 90), Math.sin(aim) * 80 + rnd(-90, 90), 'smoke');
      shots++; power = 0; score();
    }

    /* ---------- Дед Мороз ---------- */
    function spawn() {
      var ltr = Math.random() < 0.5, sw = Math.max(170, Math.min(300, W * 0.42)), sh = sw * 80 / 300;
      var speed = W * (0.11 + Math.random() * 0.09) * (1 + Math.min(hits, 10) * 0.05);
      santa = { ltr: ltr, w: sw, h: sh, x: ltr ? -sw : W, y0: H * (0.1 + Math.random() * 0.28), vx: ltr ? speed : -speed, t: 0, ph: Math.random() * 6,
        att: [true, true, true], lost: 0, dive: 0, vy: 0, ang: 0, bobk: 1 };
    }
    function santaY(s) { return s.y0 + Math.sin(s.t * 2.6 + s.ph) * Math.min(18, H * 0.025) * s.bobk; }
    /* точка рисунка (единицы 300×80) → экран; сани с оленями поворачиваются вокруг саней (угол пике s.ang) */
    function toScreen(s, lx, ly) {
      var k = s.w / 300, u = lx * k - 55 * k, v = ly * k - 42 * k, c = Math.cos(s.ang), n = Math.sin(s.ang);
      var u2 = 55 * k + u * c - v * n, v2 = 42 * k + u * n + v * c;
      return { x: s.ltr ? s.x + u2 : s.x + s.w - u2, y: santaY(s) + v2 };
    }
    function sleighCenter(s) {                                    // сани с Дедом Морозом — в первых 100 единицах рисунка
      var k = s.w / 300, c = toScreen(s, 55, 42);
      return { x: c.x, y: c.y, rx: 48 * k + 8, ry: 34 * k + 8 };
    }
    function deerAt(s, i) { return toScreen(s, DX[i] + 5, 34); }   // середина оленя
    function runner(s, i, p, fly) {                               // отцепившийся олень: падает, потом убегает по снегу
      runners.push({ i: i, k: s.w / 300, w: s.w, h: s.h, x: p.x, y: p.y, vx: fly ? s.vx * 0.5 : 0, vy: fly ? -140 + s.vy * 0.4 : 0,
        a: fly ? s.ang * (s.ltr ? 1 : -1) : 0, va: fly ? rnd(-7, 7) : 0, ltr: s.ltr, run: !fly, t: 0 });
      if (!fly) runners[runners.length - 1].vx = (s.ltr ? 1 : -1) * rnd(220, 320);
    }
    function detach(s, i) {
      s.att[i] = false; s.lost++; runner(s, i, deerAt(s, i), true);
      var was = s.dive; s.dive = s.lost >= 2 ? 2 : 1;
      if (s.dive === 2 && was !== 2) { s.vy = Math.max(s.vy, 90); s.vx *= 0.85; }
    }
    function crash(s) {                                           // сани долетели до земли
      var c = sleighCenter(s), gy = Math.min(c.y, H - 30);
      for (var i = 0; i < 3; i++) if (s.att[i]) { var p = deerAt(s, i); p.y = H - 6 - 24 * s.w / 300; runner(s, i, p, false); }
      boom(c.x, gy, ['Сбит! Подарки!', 'Посадка с подарками!', 'Бабах об сугроб!'][hits % 3]);
      for (var k = 0; k < 16; k++) puff(c.x, H - 6, rnd(-220, 220), rnd(-260, -60), 'smoke');
      hits++; if (hits > best) { best = hits; try { localStorage.setItem('bz-best', best); } catch (e) {} }
      score(); santa = null; nextSanta = 1 + Math.random() * 1.2;
    }

    /* ---------- частицы, подарки, надписи ---------- */
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function puff(x, y, vx, vy, kind) {
      parts.push({ x: x, y: y, vx: vx, vy: vy, t: 0, life: kind === 'fire' ? rnd(0.4, 0.9) : rnd(0.6, 1.3), kind: kind, r: kind === 'fire' ? rnd(3, 7) : rnd(5, 12) });
    }
    var COLORS = [['#e53935', '#ffd54a'], ['#43a047', '#fff'], ['#1e88e5', '#ffd54a'], ['#8e24aa', '#fff'], ['#fb8c00', '#fff'], ['#ffd54a', '#e53935'], ['#00acc1', '#fff']];
    function boom(x, y, txt) {
      parts.push({ x: x, y: y, t: 0, life: 0.45, kind: 'flash', r: 0 });
      for (var i = 0; i < 46; i++) { var a = rnd(0, 6.28), v = rnd(80, 420); puff(x, y, Math.cos(a) * v, Math.sin(a) * v, i % 3 ? 'fire' : 'smoke'); }
      var n = 12 + Math.floor(Math.random() * 6);
      for (var j = 0; j < n; j++) {
        var c = COLORS[j % COLORS.length], s = rnd(16, 30);
        gifts.push({ x: x + rnd(-20, 20), y: y + rnd(-14, 14), vx: rnd(-260, 260), vy: rnd(-560, -160), a: rnd(0, 6.28), va: rnd(-7, 7), s: s, c: c[0], r: c[1], t: 0, rest: 0 });
      }
      texts.push({ x: x, y: y - 30, t: 0, s: txt || ['Бабах! Подарки!', 'В яблочко!', 'Точно в сани!', 'С Новым годом!'][hits % 4] });
    }
    function smallBoom(x, y, txt) {                               // попадание в оленя: вспышка без подарков
      parts.push({ x: x, y: y, t: 0, life: 0.3, kind: 'flash', r: 0 });
      for (var i = 0; i < 22; i++) { var a = rnd(0, 6.28), v = rnd(60, 260); puff(x, y, Math.cos(a) * v, Math.sin(a) * v, i % 3 ? 'fire' : 'smoke'); }
      texts.push({ x: x, y: y - 24, t: 0, s: txt });
    }

    /* ---------- кадр ---------- */
    function frame(now) {
      if (!running) return;
      var dt = last ? Math.min(0.033, (now - last) / 1000) : 0.016; last = now;
      update(dt); draw();
      raf = requestAnimationFrame(frame);
    }
    function update(dt) {
      var g = G();
      if (!santa) { nextSanta -= dt; if (nextSanta <= 0) spawn(); }
      if (santa) {
        var s = santa; s.t += dt; s.x += s.vx * dt;
        if (s.dead) {                                             // олени без саней удирают и выравниваются
          s.vx *= 1 + dt * 1.2; s.vy += (-60 - s.vy) * Math.min(1, dt * 2); s.y0 += s.vy * dt; s.ang *= 1 - Math.min(1, dt * 3);
        } else if (s.dive) {                                      // пике: 1 олень потерян — плавно, 2 и больше — круто
          s.vy += (s.dive === 1 ? g * 0.1 : g * 0.8) * dt; s.y0 += s.vy * dt; s.bobk = Math.max(0, s.bobk - dt * 2);
          var aim2 = Math.atan2(s.vy, Math.abs(s.vx)) + (s.dive === 2 ? Math.sin(s.t * 26) * 0.05 : 0);
          s.ang += (aim2 - s.ang) * Math.min(1, dt * (s.dive === 2 ? 5 : 3));
          var sc = sleighCenter(s);
          if (Math.random() < (s.dive === 2 ? 1 : 0.35)) puff(sc.x, sc.y, rnd(-40, 40), rnd(-60, 0), s.dive === 2 && Math.random() < 0.45 ? 'fire' : 'smoke');
          var low = sc.y + sc.ry * 0.6;
          for (var di = 0; di < 3; di++) if (s.att[di]) low = Math.max(low, deerAt(s, di).y + 18 * s.w / 300);
          if (low >= H - 6) { crash(s); s = null; }
        }
        if (s && (s.x > W + 40 || s.x < -s.w - 40 || santaY(s) < -s.h * 3)) { santa = null; nextSanta = 0.8 + Math.random() * 1.2; }
      }
      for (var i = rockets.length - 1; i >= 0; i--) {
        var r = rockets[i]; r.t += dt; r.vy += g * dt; r.x += r.vx * dt; r.y += r.vy * dt;
        if (Math.random() < 0.9) puff(r.x - r.vx * 0.02, r.y - r.vy * 0.02, rnd(-30, 30), rnd(-30, 30), Math.random() < 0.35 ? 'fire' : 'smoke');
        var hit = false, deerHit = -1;
        if (santa && !santa.dead) {
          var c = sleighCenter(santa), dx = (r.x - c.x) / c.rx, dy = (r.y - c.y) / c.ry;
          if (dx * dx + dy * dy <= 1) hit = true;
        }
        if (santa && !hit) {                                     // олени (и с санями, и убегающие)
          var kk = santa.w / 300;
          for (var di = 0; di < 3; di++) if (santa.att[di]) {
            var dp = deerAt(santa, di), ex = (r.x - dp.x) / (26 * kk + 6), ey = (r.y - dp.y) / (22 * kk + 6);
            if (ex * ex + ey * ey <= 1) { deerHit = di; break; }
          }
        }
        if (deerHit >= 0) {
          var s1 = santa, n0 = s1.lost;
          for (di = 0; di < 3; di++) if (s1.att[di]) {          // взрыв задевает и соседа, если попал между оленями
            var q2 = deerAt(s1, di);
            if (di === deerHit || Math.hypot(r.x - q2.x, r.y - q2.y) < 34 * kk + 6) {
              if (s1.dead) { s1.att[di] = false; runner(s1, di, q2, true); } else detach(s1, di);
            }
          }
          var n = s1.lost - n0;
          smallBoom(r.x, r.y, s1.dead ? 'Олень сбит!' : n >= 2 || s1.lost >= 2 ? 'Пике!' : 'Олень отцепился!');
          if (s1.dead && !s1.att.some(Boolean)) { santa = null; nextSanta = 0.8 + Math.random(); }
          rockets.splice(i, 1); continue;
        }
        if (hit) {
          boom(r.x, r.y); santa.dead = true; santa.dive = 0; hits++;
          if (hits > best) { best = hits; try { localStorage.setItem('bz-best', best); } catch (e) {} }
          score(); rockets.splice(i, 1); continue;
        }
        if (r.y > H + 60 || r.x < -200 || r.x > W + 200) {
          if (r.y > H - 4 && r.x > 0 && r.x < W) for (var k = 0; k < 10; k++) puff(r.x, H - 4, rnd(-120, 120), rnd(-200, -40), 'smoke');
          rockets.splice(i, 1);
        }
      }
      for (i = parts.length - 1; i >= 0; i--) {
        var p = parts[i]; p.t += dt;
        if (p.t > p.life) { parts.splice(i, 1); continue; }
        if (p.kind !== 'flash') { p.vx *= 1 - dt * 2.2; p.vy *= 1 - dt * 2.2; p.vy -= (p.kind === 'smoke' ? 40 : -60) * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
      }
      var floor = H - 6;
      for (i = gifts.length - 1; i >= 0; i--) {
        var q = gifts[i]; q.t += dt;
        if (q.t > 7) { gifts.splice(i, 1); continue; }
        q.vy += g * 0.8 * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.a += q.va * dt;
        if (q.y > floor - q.s / 2) { q.y = floor - q.s / 2; q.vy *= -0.42; q.vx *= 0.7; q.va *= 0.6; if (Math.abs(q.vy) < 40) { q.vy = 0; q.va *= 0.8; } }
        if (q.x < q.s / 2 || q.x > W - q.s / 2) { q.vx *= -0.6; q.x = Math.max(q.s / 2, Math.min(W - q.s / 2, q.x)); }
      }
      for (i = runners.length - 1; i >= 0; i--) {
        var u = runners[i], gy0 = floor - 24 * u.k; u.t += dt;
        if (!u.run) {
          u.vy += g * 0.8 * dt; u.x += u.vx * dt; u.y += u.vy * dt; u.a += u.va * dt;
          if (u.y >= gy0) {                                       // приземлился — встаёт и убегает
            u.y = gy0; u.run = true; u.a = 0; u.vx = (Math.random() < 0.5 ? 1 : -1) * rnd(220, 320);
            for (var sn = 0; sn < 10; sn++) puff(u.x, floor, rnd(-120, 120), rnd(-160, -30), 'smoke');
          }
        } else { u.x += u.vx * dt; u.y = gy0 - Math.abs(Math.sin(u.t * 14)) * 6; }
        if (u.x < -u.w || u.x > W + u.w || u.t > 14) runners.splice(i, 1);
      }
      for (i = texts.length - 1; i >= 0; i--) { texts[i].t += dt; texts[i].y -= 30 * dt; if (texts[i].t > 1.6) texts.splice(i, 1); }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, 'rgba(8,14,40,.72)'); bg.addColorStop(1, 'rgba(10,20,30,.55)');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fillRect(0, H - 6, W, 6);       // снег внизу

      if (santa) drawSanta(santa);
      for (var ri = 0; ri < runners.length; ri++) drawRunner(runners[ri]);
      for (var i = 0; i < gifts.length; i++) drawGift(gifts[i]);
      for (i = 0; i < parts.length; i++) {
        var p = parts[i], k = p.t / p.life;
        if (p.kind === 'flash') {
          ctx.globalAlpha = 1 - k; ctx.fillStyle = '#fff3c4';
          ctx.beginPath(); ctx.arc(p.x, p.y, 20 + 110 * k, 0, 6.29); ctx.fill();
        } else if (p.kind === 'fire') {
          ctx.globalAlpha = 1 - k; ctx.fillStyle = k < 0.4 ? '#ffd54a' : '#ff7043';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 - k * 0.5), 0, 6.29); ctx.fill();
        } else {
          ctx.globalAlpha = 0.45 * (1 - k); ctx.fillStyle = '#cfd4dc';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.6 + k), 0, 6.29); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      for (i = 0; i < rockets.length; i++) drawRocket(rockets[i]);
      for (i = 0; i < texts.length; i++) {
        var t = texts[i];
        ctx.globalAlpha = Math.max(0, 1 - t.t / 1.6); ctx.fillStyle = '#ffd54a'; ctx.strokeStyle = '#7a3b00'; ctx.lineWidth = 4;
        ctx.font = '800 26px "Golos Text",system-ui,sans-serif'; ctx.textAlign = 'center';
        ctx.strokeText(t.s, t.x, t.y); ctx.fillText(t.s, t.x, t.y);
      }
      ctx.globalAlpha = 1;
      drawBazooka();
    }
    function drawSanta(s) {
      var k = s.w / 300, y = santaY(s);
      ctx.save();
      ctx.translate(s.ltr ? s.x : s.x + s.w, y); if (!s.ltr) ctx.scale(-1, 1);   // олени впереди по ходу
      ctx.translate(55 * k, 42 * k); ctx.rotate(s.ang); ctx.translate(-55 * k, -42 * k);
      if (!s.dead) {                                              // упряжь от саней через оставшихся оленей
        ctx.strokeStyle = '#5c3a1f'; ctx.lineWidth = Math.max(1, 1.2 * k); ctx.beginPath(); ctx.moveTo(86 * k, 36 * k);
        for (var i = 0; i < 3; i++) if (s.att[i]) ctx.lineTo((DX[i] + 12) * k, 37 * k);
        ctx.stroke();
        if (IMG_SLEIGH.complete) ctx.drawImage(IMG_SLEIGH, 0, 0, s.w, s.h);
      }
      for (i = 0; i < 3; i++) if (s.att[i] && IMG_D[i].complete) ctx.drawImage(IMG_D[i], 0, 0, s.w, s.h);
      ctx.restore();
    }
    function drawRunner(u) {
      var im = IMG_D[u.i]; if (!im.complete) return;
      ctx.save(); ctx.translate(u.x, u.y); ctx.rotate(u.a);
      if (u.run ? u.vx < 0 : !u.ltr) ctx.scale(-1, 1);
      ctx.drawImage(im, -(DX[u.i] + 5) * u.k, -34 * u.k, u.w, u.h);
      ctx.restore();
    }
    function drawRocket(r) {
      var a = Math.atan2(r.vy, r.vx);
      ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(a);
      ctx.fillStyle = Math.random() < 0.5 ? '#ffd54a' : '#ff7043';
      ctx.beginPath(); ctx.moveTo(-13, -4); ctx.lineTo(-24 - Math.random() * 10, 0); ctx.lineTo(-13, 4); ctx.fill();
      ctx.fillStyle = '#b0bec5'; ctx.fillRect(-14, -4.5, 22, 9);
      ctx.fillStyle = '#e53935'; ctx.beginPath(); ctx.moveTo(8, -4.5); ctx.lineTo(17, 0); ctx.lineTo(8, 4.5); ctx.fill();
      ctx.fillStyle = '#546e7a'; ctx.beginPath(); ctx.moveTo(-14, -4.5); ctx.lineTo(-19, -10); ctx.lineTo(-9, -4.5); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-14, 4.5); ctx.lineTo(-19, 10); ctx.lineTo(-9, 4.5); ctx.fill();
      ctx.restore();
    }
    function drawGift(q) {
      var s = q.s, h = s / 2, alpha = q.t > 6 ? 7 - q.t : 1;
      ctx.save(); ctx.globalAlpha = Math.max(0, alpha); ctx.translate(q.x, q.y); ctx.rotate(q.a);
      ctx.fillStyle = q.c; ctx.fillRect(-h, -h, s, s);
      ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(-h, h - s * 0.18, s, s * 0.18);
      ctx.fillStyle = q.r; ctx.fillRect(-s * 0.09, -h, s * 0.18, s); ctx.fillRect(-h, -s * 0.09, s, s * 0.18);
      ctx.beginPath(); ctx.ellipse(-s * 0.16, -h - s * 0.08, s * 0.16, s * 0.1, -0.5, 0, 6.29); ctx.ellipse(s * 0.16, -h - s * 0.08, s * 0.16, s * 0.1, 0.5, 0, 6.29); ctx.fill();
      ctx.restore();
    }
    function drawBazooka() {
      var p = pivot(), L = tubeLen(), T = Math.max(30, Math.min(44, L * 0.24));
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(aim);
      ctx.fillStyle = '#4e5b2c'; ctx.fillRect(-60, -T / 2, L + 60, T);                // труба
      ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(-60, -T / 2 + 3, L + 60, T * 0.22);
      ctx.fillStyle = '#e8b84a'; ctx.fillRect(L * 0.45, -T / 2, 10, T);               // жёлтая полоса
      ctx.fillStyle = '#2f3818'; ctx.fillRect(L - 16, -T / 2 - 5, 20, T + 10);         // дуло
      ctx.fillStyle = '#11140a'; ctx.beginPath(); ctx.ellipse(L + 4, 0, 4, T / 2 + 2, 0, 0, 6.29); ctx.fill();
      ctx.fillStyle = '#2f3818'; ctx.fillRect(L * 0.3, -T / 2 - 9, 26, 9);              // планка сверху
      function mitten(x, y) {
        ctx.fillStyle = '#d32f2f'; ctx.beginPath(); ctx.ellipse(x, y, 17, 13, 0, 0, 6.29); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.fillRect(x - 24, y - 11, 9, 22);
      }
      mitten(L * 0.18, T / 2 + 6); mitten(L * 0.62, -T / 2 - 4);
      ctx.restore();
      if (drag && power > 0) {                                                     // сила выстрела (без прицела)
        var bx = Math.min(W - 26, p.x + 120), by = H - 30, bh = Math.min(150, H * 0.25);
        ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(bx - 8, by - bh - 4, 16, bh + 8);
        ctx.fillStyle = power < 0.5 ? '#66cc66' : power < 0.8 ? '#ffd54a' : '#ff5252';
        ctx.fillRect(bx - 5, by - bh * power, 10, bh * power);
      }
    }
  });
})();
