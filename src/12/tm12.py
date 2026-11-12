"""Таблица программы МТ в HTML (в стиле Stepik)."""
SUB={'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄'}
def table_html(order,spec):
    """order: 'λ10'; spec: 'q0: λ>λLq1 | q1: ...' -> HTML-таблица в стиле Stepik"""
    rows={}
    for part in spec.split('|'):
        st,rest=part.split(':',1); st=st.strip(); rows[st]={}
        for c in rest.split(','):
            c=c.strip()
            if not c: continue
            sym,act=c.split('>'); act=act.strip()
            rows[st][sym.strip()]=f'{act[0]}, {act[1]}, q<sub>{act[3:]}</sub>'
    h='<table><thead><tr><td>&nbsp;</td>'+''.join(f'<td><strong>{s}</strong></td>' for s in order)+'</tr></thead><tbody>'
    for st,r in rows.items():
        h+=f'<tr><td><strong>q<sub>{st[1:]}</sub></strong></td>'+''.join(f'<td>{r.get(s,"&nbsp;")}</td>' for s in order)+'</tr>'
    return h+'</tbody></table>'

