/* ---------- прогресс ----------
 * Состояние курса: {pos, last, st: {"36.1/3": {v, ok, att, rev, last, seen}}}.
 * Сервер не теряет достигнутое: решённое остаётся решённым, попытки и «показать ответ» не обнуляются,
 * даже если данные пришли со старой вкладки или второго устройства. Обнулить может только «Начать заново».
 */
function merge_rec($a, $b) {
    if (!is_array($a)) return is_array($b) ? $b : $a;
    if (!is_array($b)) return $a;
    $src = (!empty($a['ok']) && empty($b['ok'])) ? $a : $b;
    $oth = $src === $a ? $b : $a;
    $r = [];
    if (array_key_exists('v', $src)) $r['v'] = $src['v']; elseif (array_key_exists('v', $oth)) $r['v'] = $oth['v'];
    if (array_key_exists('last', $src)) $r['last'] = $src['last']; elseif (array_key_exists('last', $oth)) $r['last'] = $oth['last'];
    $att = max((int)($a['att'] ?? 0), (int)($b['att'] ?? 0));
    if ($att) $r['att'] = $att;
    foreach (['ok', 'rev', 'seen'] as $k) if (!empty($a[$k]) || !empty($b[$k])) $r[$k] = true;
    if (isset($a['okAt']) || isset($b['okAt'])) $r['okAt'] = min((int)($a['okAt'] ?? PHP_INT_MAX), (int)($b['okAt'] ?? PHP_INT_MAX));
    return $r;
}
/* PHP превращает пустой объект {} в массив [] — а в браузере у массива теряются поля ok/v/att.
   Поэтому каждую запись задачи отдаём и храним как объект. */
function obj_state($m) {
    if (is_object($m)) $m = (array)$m;
    if (!is_array($m) || !isset($m['st'])) return $m;
    $o = new stdClass();
    foreach ((array)$m['st'] as $k => $v) $o->{$k} = is_array($v) ? (object)$v : $v;
    $m['st'] = $o;
    return $m;
}
function merge_state($old, $new) {
    if (!is_array($old) || !isset($old['st']) || !is_array($old['st'])) return $new;
    $r = $new;
    $st = is_array($new['st'] ?? null) ? $new['st'] : [];
    foreach ($old['st'] as $k => $v) $st[$k] = isset($st[$k]) ? merge_rec($v, $st[$k]) : $v;
    $r['st'] = (object)$st;
    return $r;
}
function valid_mid($m): string {
    $m = (string)$m;
    if (!preg_match('/^[a-z0-9][a-z0-9-]{0,39}$/', $m)) fail('Неверный номер варианта');
    return $m;
}
function valid_mname(string $f): bool { return (bool)preg_match('/^(img|files)\/[\w][\w.\-]{0,120}$/u', $f) && strpos($f, '..') === false; }
function valid_key($k): string {
    $k = (string)$k;
    if (!preg_match('/^[a-z0-9-]{1,64}$/', $k)) fail('Неверный ключ курса');
    return $k;
}

/* ---------- монетки ----------
 * За каждую решённую задачу — 3 монетки минус по одной за каждую неверную попытку (не меньше 0).
 * Если перед решением смотрели ответ — 0. Каждая задача оплачивается один раз навсегда:
 * «Начать заново» и повторное решение монеток не добавляют.
 */
const COINS_MAX = 3;
function coin_amount($rec) {
    if (!empty($rec['rev'])) return 0;
    return max(0, COINS_MAX - (int)($rec['att'] ?? 0));
}
function award_coins(int $uid, string $ckey, $state): int {
    global $MYSQL;
    if (!is_array($state) || !isset($state['st']) || !is_array($state['st'])) return 0;
    $have = [];
    foreach (q('SELECT sid FROM inf_coins WHERE user_id = ? AND ckey = ?', [$uid, $ckey])->fetchAll() as $r) $have[$r['sid']] = true;
    $gained = 0;
    $ins = ($MYSQL ? 'INSERT IGNORE' : 'INSERT OR IGNORE') . ' INTO inf_coins (user_id, ckey, sid, amount, created) VALUES (?,?,?,?,?)';
    foreach ($state['st'] as $sid => $rec) {
        $sid = (string)$sid;
        if (isset($have[$sid]) || !is_array($rec) || empty($rec['ok']) || strlen($sid) > 32) continue;
        $a = coin_amount($rec);
        if (q($ins, [$uid, $ckey, $sid, $a, time()])->rowCount() > 0) $gained += $a;
    }
    return $gained;
}
function coins_total(int $uid): int {
    $r = one('SELECT COALESCE(SUM(amount), 0) AS s FROM inf_coins WHERE user_id = ?', [$uid]);
    return (int)$r['s'];
}

/* ---------- расписание и домашка ---------- */
function info_of(int $uid): array {
    $r = one('SELECT schedule, homework, hw_tasks, hw_due, hw_set, hw_done, skills, updated FROM inf_student_info WHERE user_id = ?', [$uid]);
    return [
        'skills' => (object)($r && $r['skills'] ? (json_decode($r['skills'], true) ?: []) : []),
        'hw_tasks' => $r && $r['hw_tasks'] ? json_decode($r['hw_tasks'], true) : [],
        'schedule' => $r && $r['schedule'] ? json_decode($r['schedule'], true) : [],
        'homework' => $r ? (string)$r['homework'] : '',
        'hw_due' => $r ? (string)$r['hw_due'] : '',
        'hw_set' => $r ? (int)$r['hw_set'] : 0,
        'hw_done' => $r ? (int)$r['hw_done'] : 0,
    ];
}
function clean_tasks($a): array {
    // задачи домашки: ["course-ege-inf-s42|42.4/6", ...]
    $out = [];
    if (!is_array($a)) return $out;
    foreach ($a as $x) {
        $x = (string)$x;
        if (preg_match('/^[a-z0-9-]{1,64}\|[0-9.]{1,12}\/[a-z0-9]{1,8}$/', $x) && !in_array($x, $out, true)) $out[] = $x;
        if (count($out) >= 200) break;
    }
    return $out;
}
function hw_progress(int $uid, array $tasks): array {
    // сколько задач из домашки ученик уже решил
    $byKey = [];
    foreach ($tasks as $t) { [$k, $sid] = explode('|', $t, 2); $byKey[$k][] = $sid; }
    $solved = 0;
    foreach ($byKey as $k => $sids) {
        $r = one('SELECT data FROM inf_progress WHERE user_id = ? AND ckey = ?', [$uid, $k]);
        $st = $r ? (json_decode($r['data'], true)['st'] ?? []) : [];
        foreach ($sids as $sid) if (!empty($st[$sid]['ok'])) $solved++;
    }
    return ['total' => count($tasks), 'solved' => $solved];
}
function hw_unsolved(int $uid, array $tasks): array {
    // задачи домашки, которые ученик ещё не решил (порядок сохраняется)
    $st = [];
    $out = [];
    foreach ($tasks as $t) {
        [$k, $sid] = explode('|', $t, 2);
        if (!isset($st[$k])) { $r = one('SELECT data FROM inf_progress WHERE user_id = ? AND ckey = ?', [$uid, $k]); $st[$k] = $r ? (json_decode($r['data'], true)['st'] ?? []) : []; }
        if (empty($st[$k][$sid]['ok'])) $out[] = $t;
    }
    return $out;
}
function clean_cat($c): string { return mb_substr(trim((string)$c), 0, 32, 'UTF-8'); }
function clean_hw_input(): array {
    $hw = trim(str_replace("\r", '', (string)arg('homework')));
    if (mb_strlen($hw, 'UTF-8') > 5000) fail('Домашнее задание слишком длинное (до 5000 символов)');
    $due = (string)arg('hw_due');
    if ($due !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $due)) fail('Неверная дата');
    return [$hw, clean_tasks(arg('hw_tasks', [])), $due];
}
function save_info(int $id, string $hw, array $tasks, string $due, ?array $sched): void {
    // $sched === null — расписание не трогаем. Прогресс и ответы ученика здесь не меняются никогда.
    $old = info_of($id);
    $changed = $hw !== $old['homework'] || $due !== $old['hw_due'] || $tasks !== $old['hw_tasks'];
    $hwSet = $changed ? (($hw === '' && !$tasks) ? 0 : time()) : $old['hw_set'];
    $hwDone = $changed ? 0 : $old['hw_done'];
    $j = json_encode($sched ?? $old['schedule'], JSON_UNESCAPED_UNICODE);
    if (one('SELECT user_id FROM inf_student_info WHERE user_id = ?', [$id]))
        q('UPDATE inf_student_info SET schedule = ?, homework = ?, hw_tasks = ?, hw_due = ?, hw_set = ?, hw_done = ?, updated = ? WHERE user_id = ?', [$j, $hw, json_encode($tasks), $due, $hwSet, $hwDone, time(), $id]);
    else
        q('INSERT INTO inf_student_info (user_id, schedule, homework, hw_tasks, hw_due, hw_set, hw_done, updated) VALUES (?,?,?,?,?,?,?,?)', [$id, $j, $hw, json_encode($tasks), $due, $hwSet, $hwDone, time()]);
}
function clean_schedule($s): array {
    $out = [];
    if (!is_array($s)) return $out;
    foreach (array_slice($s, 0, 14) as $x) {
        $d = (int)($x['day'] ?? 0); $tm = (string)($x['time'] ?? '');
        $dur = (int)($x['dur'] ?? 60);
        if ($d < 1 || $d > 7 || !preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $tm)) continue;
        $out[] = ['day' => $d, 'time' => $tm, 'dur' => max(15, min(240, $dur))];
    }
    usort($out, function ($a, $b) { return [$a['day'], $a['time']] <=> [$b['day'], $b['time']]; });
    return $out;
}

