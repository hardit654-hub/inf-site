"""Общие функции переноса шагов Stepik в формат движка курсов."""
import re,html as H

def tex(h):
    def rpl(m):
        a=H.unescape(m.group(1)).strip()
        return '<span class="tex">'+H.escape(a,quote=False)+'</span>'
    return re.sub(r'<math><semantics>.*?<annotation>(.*?)</annotation></semantics></math>',rpl,h,flags=re.S)

def tidy(h):
    h=tex(h)
    h=re.sub(r'</?span>','',h)
    h=re.sub(r'<p>(?:&nbsp;|\s)*</p>','',h)
    h=h.replace('<strong>&nbsp;</strong>','&nbsp;')
    # таблицы-«рамки» (одна ячейка) делаем выносками, таблицы программ — с прокруткой
    def wrap(m):
        t=m.group(0)
        top=re.sub(r'<table data-ok>.*?</table data-ok>','',t[7:-8],flags=re.S)
        if top.count('<td')==1: return '<div class="cond">'+re.sub(r'^<table><tbody><tr><td>|</td></tr></tbody></table>$','',t)+'</div>'
        return '<div class="tw">'+t+'</div>'
    # вложенные таблицы: сначала внутренние
    for _ in range(3):
        h=re.sub(r'<table>(?:(?!<table>).)*?</table>',lambda m:wrap(m).replace('<table>','<table data-ok>').replace('</table>','</table data-ok>'),h,flags=re.S)
    h=h.replace('<table data-ok>','<table>').replace('</table data-ok>','</table>')
    return h.strip()

def split_code(h):
    """html -> блоки: html и code (для <pre><code>)."""
    out=[];pos=0
    for m in re.finditer(r'<pre>(?:<code>)?(.*?)(?:</code>)?</pre>',h,flags=re.S):
        if m.start()>pos: out.append({'t':'html','v':h[pos:m.start()]})
        code=H.unescape(re.sub(r'<br\s*/?>','\n',m.group(1))); code=re.sub(r'<[^>]+>','',code)
        out.append({'t':'code','v':code.rstrip()})
        pos=m.end()
    if pos<len(h): out.append({'t':'html','v':h[pos:]})
    return [b for b in out if b['t']=='code' or re.sub(r'<[^>]+>|\s|&nbsp;','',b['v'])]

def to_blocks(h):
    h=tidy(h)
    blocks=[]; pos=0
    for m in re.finditer(r'<details><summary>(.*?)</summary>(.*?)</details>',h,flags=re.S):
        blocks+=split_code(h[pos:m.start()])
        title=H.unescape(re.sub(r'<[^>]+>','',m.group(1))).strip()
        blocks.append({'t':'details','title':title,'v':split_code(m.group(2))})
        pos=m.end()
    blocks+=split_code(h[pos:])
    return blocks

