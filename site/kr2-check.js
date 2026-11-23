/* Проверка ответов контрольной № 2. Данные (KEY, CAND, MULTI, SALT, h) приходят из страницы. */
var KR2=function(deps){
  const KEY=deps.KEY, CAND=deps.CAND, MULTI=deps.MULTI, SALT=deps.SALT, h=deps.h;

  /* число из строки: "0,4" → 0.4, "4/3" → 1.333, "3,6e1" → 36, "0,4 рад/с" → 0.4 */
  function val(raw){
    var s=String(raw==null?"":raw);
    s=s.split("\u00a0").join("");
    s=s.split("\u2009").join("");
    s=s.split(" ").join("");
    s=s.split("\t").join("");
    s=s.split("\u00b2").join("2");
    s=s.split("/с2").join("");
    s=s.split("/c2").join("");
    s=s.split("/с").join("");
    s=s.split("/c").join("");
    s=s.split("рад").join("");
    s=s.split("\u03c0").join("*3.14159265");   // π в ответе
    s=s.split("pi").join("*3.14159265");
    s=s.split("см").join("");
    s=s.split("cм").join("");
    s=s.split("\u043c").join("");   // буква «м» в единицах м/с, м/с2
    s=s.split("\u043a\u043c").join("");
    s=s.split("\u043e\u0431").join("");
    if(!s) return NaN;
    var m=/^(-?\d+([.,]\d+)?)\/(-?\d+([.,]\d+)?)$/.exec(s);
    if(m){
      var a=Number(m[1].replace(",",".")), b=Number(m[3].replace(",","."));
      return b? a/b : NaN;
    }
    var k=/^(-?\d+([.,]\d+)?)\*(\d+([.,]\d+)?)$/.exec(s);   // 320*3,14
    if(k) return Number(k[1].replace(",","."))*Number(k[3].replace(",","."));
    if(/^-?\d+([.,]\d+)?(e-?[\d]+)?$/.test(s)) return Number(s.replace(",","."));
    return NaN;
  }

  /* приведение к единому виду: регистр, неразрывные пробелы, ё→е */
  function norm(raw){
    var s=String(raw==null?"":raw).toLowerCase();
    s=s.split("\u00a0").join("").split("\u2009").join("");
    s=s.split("ё").join("е");
    s=s.replace(/\s+/g,"");
    return s;
  }

  /* две величины: разделитель — `;`, пробел, либо запятая между двумя целыми числами
     (в задаче с двумя величинами ответы целые, поэтому «13,24» читается как два числа,
     а «0,4» в одиночной задаче остаётся десятичной дробью) */
  function splitMulti(s){
    var i;
    if(s.indexOf(";")>=0){
      return s.split(";").filter(function(p){return p!==""});
    }
    if(/^-?\d+$/.test(s)) return [s];
    for(i=0;i<s.length;i++){
      if(s.charAt(i)===" "){ return s.split(" ").filter(function(p){return p!==""}); }
    }
    var parts=s.split(",");
    if(parts.length===2 && /^-?\d+$/.test(parts[0]) && /^-?\d+$/.test(parts[1])) return parts;
    return [s];
  }

  function close(x,y,rel,abs){return Math.abs(x-y)<=Math.abs(y)*rel+abs}

  function fit(x,lst){
    for(var i=0;i<lst.length;i++){ if(close(x,lst[i][0],lst[i][1],lst[i][2])) return true; }
    return false;
  }

  function answerOK(v,n,raw){
    var a=norm(raw);
    if(!a) return false;
    if(h(SALT+"|"+v+"|"+n+"|"+a)===KEY[v][n]) return true;      // точная запись ответа
    var rules=CAND[v][n];
    /* сырая строка без неразрывных пробелов — для разбора единиц и разделителей */
    var s=String(raw==null?"":raw).split("\u00a0").join(" ").split("\u2009").join(" ").trim();
    if(MULTI[n]){                                               // две величины в любом порядке
      var xs=splitMulti(s).map(val);
      if(xs.length!==2) return false;
      if(!isFinite(xs[0])||!isFinite(xs[1])) return false;
      return (fit(xs[0],rules[1])&&fit(xs[1],rules[2]))||(fit(xs[1],rules[1])&&fit(xs[0],rules[2]));
    }
    var x=val(s);
    if(!isFinite(x)) return false;
    return fit(x,rules[1]);
  }

  return {answerOK:answerOK, norm:norm, val:val, splitMulti:splitMulti};
};