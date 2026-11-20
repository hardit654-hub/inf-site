/* Цветные эмодзи для старых систем (Windows 7, старые Windows 10 и т.п.).
   Если браузер не умеет рисовать цветные эмодзи, они заменяются на картинки из папки emoji/
   (набор Twemoji, лицензия CC-BY 4.0, https://github.com/jdecked/twemoji).
   На остальных компьютерах ничего не меняется. Проверить замену на любом компьютере: добавить к адресу ?emoji=img.
   Подключается из newyear.js (он уже стоит на всех страницах) или строкой <script src="…emoji.js" defer>.
   Новый эмодзи на сайте: добавить его в sources/emoji-urls.txt и в список LIST ниже. */
(function () {
  if (window.__emoji) return; window.__emoji = 1;
  var LIST = ('1f609 1f4dd 1f525 2705 270d 2753 270f 1f3ac 1f4a1 2757 1f9d0 1f913 1f40d 1f60e 1f451 2b50 1f4af 1f9e0 1f4be 1f3af ' +
    '1f340 1f3c6 2744 1f4c5 1f642 274c 1f3b0 1f50a 1f508 1f34e 1f353 1f352 1f34b 1fad0 1f349 1f351 1f95d 1f347 1f308 1f947 ' +
    '1f948 1f949 1f5a4 1f433 1f478 1f366 1f4fa 1f61f 1f600 1f389 1fa99 1f44d 1f3c1 1f4da 1f4cc 1f680').split(' ');
  var HAVE = {}; LIST.forEach(function (c) { HAVE[c] = 1; });
  var src = (document.currentScript && document.currentScript.src) || '';
  var BASE = window.EMOJI_BASE || src.replace(/[^\/]*$/, '') + 'emoji/';

  function colorEmoji() {               // рисуем свежий эмодзи на холсте: есть ли цветные точки?
    try {
      var c = document.createElement('canvas'); c.width = c.height = 24;
      var x = c.getContext('2d'); x.textBaseline = 'top';
      x.font = '20px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
      x.fillText('🫐', 0, 0); // 🫐 (2020): старые системы его не знают
      var d = x.getImageData(0, 0, 24, 24).data;
      for (var i = 0; i < d.length; i += 4)
        if (d[i + 3] > 40 && (Math.abs(d[i] - d[i + 1]) > 40 || Math.abs(d[i + 1] - d[i + 2]) > 40)) return true;
      return false;
    } catch (e) { return true; }
  }
  var force = /[?&]emoji=img\b/.test(location.search);
  if (!force && colorEmoji()) return;

  var code = function (s) {
    var out = [];
    for (var i = 0; i < s.length; i++) {
      var cp = s.codePointAt(i); if (cp > 0xffff) i++;
      if (cp !== 0xfe0f) out.push(cp.toString(16));
    }
    return out.join('-');
  };
  var RE;
  try { RE = new RegExp('(?:\\p{Extended_Pictographic}|\\p{Emoji_Presentation})\\uFE0F?', 'gu'); }
  catch (e) { RE = /(?:[\uD83C-\uD83E][\uDC00-\uDFFF]|[☀-➿⭐])️?/g; }
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, OPTION: 1, INPUT: 1, TITLE: 1, NOSCRIPT: 1 };

  var st = document.createElement('style');
  st.textContent = 'img.emj{width:1em;height:1em;display:inline-block;vertical-align:-0.13em;margin:0 .04em;border:0;background:none;pointer-events:none}';
  (document.head || document.documentElement).appendChild(st);

  function fixText(node) {
    var t = node.nodeValue; if (!t) return;
    RE.lastIndex = 0; var m, last = 0, frag = null;
    while ((m = RE.exec(t))) {
      var c = code(m[0]); if (!HAVE[c]) continue;
      frag = frag || document.createDocumentFragment();
      if (m.index > last) frag.appendChild(document.createTextNode(t.slice(last, m.index)));
      var im = document.createElement('img'); im.className = 'emj'; im.alt = m[0]; im.draggable = false;
      im.src = BASE + c + '.svg'; frag.appendChild(im); last = m.index + m[0].length;
    }
    if (!frag) return;
    if (last < t.length) frag.appendChild(document.createTextNode(t.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (root.parentNode && !SKIP[root.parentNode.nodeName]) fixText(root); return; }
    if (root.nodeType !== 1 || SKIP[root.nodeName]) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return n.parentNode && SKIP[n.parentNode.nodeName] ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    }), list = [], n;
    while ((n = w.nextNode())) list.push(n);
    list.forEach(fixText);
  }

  /* для рисунков на холсте (змейка): картинка эмодзи или null */
  var cache = {};
  window.emojiImg = function (s) {
    var c = code(s); if (!HAVE[c]) return null;
    if (!cache[c]) { cache[c] = new Image(); cache[c].src = BASE + c + '.svg'; }
    return cache[c].complete && cache[c].naturalWidth ? cache[c] : null;
  };

  function start() {
    walk(document.body);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type === 'characterData') walk(m.target);
        else for (var i = 0; i < m.addedNodes.length; i++) walk(m.addedNodes[i]);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();
