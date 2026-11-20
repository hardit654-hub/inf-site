/* ---------- действия ---------- */
switch ($action) {

case 'health':
    $t = one("SELECT COUNT(*) AS n FROM inf_users WHERE role = 'teacher'");
    out(['ok' => true, 'php' => PHP_VERSION, 'db' => $MYSQL ? 'mysql' : 'sqlite', 'teacher' => (int)$t['n'] > 0, 'time' => time()]);

case 'me':
    $u = current_user();
    out(['ok' => true, 'user' => public_user($u), 'coins' => $u ? coins_total((int)$u['id']) : 0]);

case 'setup':
    // Первый вход учителя. Работает, только пока в базе нет ни одного учителя.
    need_post();
    $t = one("SELECT COUNT(*) AS n FROM inf_users WHERE role = 'teacher'");
    if ((int)$t['n'] > 0) fail('Учитель уже создан', 403);
    throttle('setup');
    $code = (string)arg('code');
    if (empty($CFG['setup_code']) || !hash_equals((string)$CFG['setup_code'], $code)) { attempt_failed('setup'); fail('Неверный код настройки', 403); }
    $login = norm_login((string)arg('login'));
    if (!valid_login($login)) fail('Логин: латиница, цифры, точка, дефис; от 2 до 32 символов');
    $pass = (string)arg('password');
    if (strlen($pass) < 8) fail('Пароль — не короче 8 символов');
    $name = clean_name(arg('name'));
    q('INSERT INTO inf_users (login, name, role, pass_hash, created_at) VALUES (?,?,?,?,?)',
        [$login, $name, 'teacher', password_hash($pass, PASSWORD_DEFAULT), time()]);
    $id = (int)$pdo->lastInsertId();
    start_session($id);
    out(['ok' => true, 'user' => ['id' => $id, 'login' => $login, 'name' => $name, 'role' => 'teacher']]);

case 'login':
    need_post();
    $login = norm_login((string)arg('login'));
    $pass = (string)arg('password');
    if ($login === '' || $pass === '') fail('Введите логин и пароль');
    throttle($login);
    $u = one('SELECT * FROM inf_users WHERE login = ?', [$login]);
    if (!$u || !password_verify($pass, $u['pass_hash'])) { attempt_failed($login); fail('Неверный логин или пароль', 401); }
    if (password_needs_rehash($u['pass_hash'], PASSWORD_DEFAULT))
        q('UPDATE inf_users SET pass_hash = ? WHERE id = ?', [password_hash($pass, PASSWORD_DEFAULT), $u['id']]);
    q('DELETE FROM inf_sessions WHERE expires < ?', [time()]);
    q('UPDATE inf_users SET last_seen = ? WHERE id = ?', [time(), $u['id']]);
    start_session((int)$u['id']);
    out(['ok' => true, 'user' => public_user($u)]);

case 'logout':
    need_post();
    $t = $_COOKIE[COOKIE] ?? '';
    if ($t !== '') q('DELETE FROM inf_sessions WHERE token = ?', [token_hash((string)$t)]);
    set_cookie('', 0);
    out(['ok' => true]);

case 'password':
    need_post();
    $u = need_user();
    $row = one('SELECT pass_hash FROM inf_users WHERE id = ?', [$u['id']]);
    throttle('pw' . $u['id']);
    if (!password_verify((string)arg('old'), $row['pass_hash'])) { attempt_failed('pw' . $u['id']); fail('Старый пароль неверный', 403); }
    $new = (string)arg('new');
    $min = $u['role'] === 'teacher' ? 8 : 4;
    if (strlen($new) < $min) fail('Новый пароль — не короче ' . $min . ' символов');
    q('UPDATE inf_users SET pass_hash = ? WHERE id = ?', [password_hash($new, PASSWORD_DEFAULT), $u['id']]);
    out(['ok' => true]);

case 'progress_get':
    $u = need_user();
    $k = valid_key($_GET['key'] ?? '');
    $r = one('SELECT data, updated FROM inf_progress WHERE user_id = ? AND ckey = ?', [$u['id'], $k]);
    if ($r) award_coins((int)$u['id'], $k, json_decode($r['data'], true));
    out(['ok' => true, 'data' => $r ? obj_state(json_decode($r['data'], true)) : null, 'updated' => $r ? (int)$r['updated'] : 0, 'coins' => coins_total((int)$u['id'])]);

case 'progress_put':
    need_post();
    $u = need_user();
    $k = valid_key(arg('key'));
    $data = arg('data', null);
    if (!is_array($data)) fail('Нет данных');
    $reset = !empty($IN['reset']);
    $pdo->beginTransaction();
    $r = one('SELECT data, resets FROM inf_progress WHERE user_id = ? AND ckey = ?' . ($MYSQL ? ' FOR UPDATE' : ''), [$u['id'], $k]);
    $merged = ($r && !$reset) ? merge_state(json_decode($r['data'], true), $data) : $data;
    if (isset($merged['st']) && is_array($merged['st']) && !$merged['st']) $merged['st'] = new stdClass();
    $json = json_encode(obj_state($merged), JSON_UNESCAPED_UNICODE);
    if (strlen($json) > MAX_DATA) { $pdo->rollBack(); fail('Слишком много данных', 413); }
    if ($r) q('UPDATE inf_progress SET data = ?, updated = ?, resets = resets + ? WHERE user_id = ? AND ckey = ?', [$json, time(), $reset ? 1 : 0, $u['id'], $k]);
    else q('INSERT INTO inf_progress (user_id, ckey, data, updated, resets) VALUES (?,?,?,?,?)', [$u['id'], $k, $json, time(), $reset ? 1 : 0]);
    $gained = award_coins((int)$u['id'], $k, json_decode($json, true));
    $pdo->commit();
    out(['ok' => true, 'data' => json_decode($json), 'updated' => time(), 'gained' => $gained, 'coins' => coins_total((int)$u['id'])]);

case 'my_progress':
    $u = need_user();
    $rows = q('SELECT ckey, data, updated FROM inf_progress WHERE user_id = ?', [$u['id']])->fetchAll();
    $res = [];
    foreach ($rows as $r) {
        award_coins((int)$u['id'], $r['ckey'], json_decode($r['data'], true));  // прогресс, решённый до появления монеток
        $res[$r['ckey']] = ['data' => json_decode($r['data']), 'updated' => (int)$r['updated']];
    }
    $by = [];
    foreach (q('SELECT ckey, SUM(amount) AS s FROM inf_coins WHERE user_id = ? GROUP BY ckey', [$u['id']])->fetchAll() as $r) $by[$r['ckey']] = (int)$r['s'];
    out(['ok' => true, 'progress' => (object)$res, 'coins' => coins_total((int)$u['id']), 'coins_by' => (object)$by]);

case 'info_get':
    $u = need_user();
    out(['ok' => true] + info_of((int)$u['id']));

case 'hw_done':
    need_post();
    $u = need_user();
    $i = info_of((int)$u['id']);
    if ($i['homework'] === '' && !$i['hw_tasks']) fail('Домашнее задание не задано');
    q('UPDATE inf_student_info SET hw_done = ? WHERE user_id = ?', [arg('done', false) ? time() : 0, $u['id']]);
    out(['ok' => true] + info_of((int)$u['id']));

case 'info_set':
    // Учитель задаёт расписание и домашку ученику
    need_post();
    need_teacher();
    $id = (int)arg('id');
    if (!one("SELECT id FROM inf_users WHERE id = ? AND role = 'student'", [$id])) fail('Ученик не найден', 404);
    [$hw, $tasks, $due] = clean_hw_input();
    save_info($id, $hw, $tasks, $due, clean_schedule(arg('schedule', [])));
    out(['ok' => true] + info_of($id));

case 'skills_set':
    // Учитель отмечает, как ученику даётся задание ЕГЭ: g — хорошо, y — так себе, r — не пройдено, '' — снять отметку
    need_post();
    need_teacher();
    $id = (int)arg('id');
    if (!one("SELECT id FROM inf_users WHERE id = ? AND role = 'student'", [$id])) fail('Ученик не найден', 404);
    $n = (int)arg('n');
    $v = (string)arg('v');
    if ($n < 1 || $n > 27 || !in_array($v, ['', 'g', 'y', 'r'], true)) fail('Неверная отметка');
    $pdo->beginTransaction();
    $r = one('SELECT skills FROM inf_student_info WHERE user_id = ?' . ($MYSQL ? ' FOR UPDATE' : ''), [$id]);
    $sk = $r && $r['skills'] ? (json_decode($r['skills'], true) ?: []) : [];
    if ($v === '') unset($sk[(string)$n]); else $sk[(string)$n] = $v;
    $j = json_encode((object)$sk);
    if ($r) q('UPDATE inf_student_info SET skills = ? WHERE user_id = ?', [$j, $id]);
    else q('INSERT INTO inf_student_info (user_id, skills, updated) VALUES (?,?,?)', [$id, $j, time()]);
    $pdo->commit();
    out(['ok' => true, 'skills' => (object)$sk]);

case 'fires':
    // сколько учеников отметили задачи огоньком (видно всем) и какие отметил сам вошедший
    $keys = array_values(array_unique(array_filter(explode(',', (string)($_GET['keys'] ?? '')))));
    if (!$keys || count($keys) > 30) fail('Неверные ключи');
    foreach ($keys as $k) valid_key($k);
    $in = implode(',', array_fill(0, count($keys), '?'));
    $counts = [];
    foreach (q("SELECT f.ckey, f.sid, COUNT(*) AS n FROM inf_fires f JOIN inf_users u ON u.id = f.user_id AND u.role = 'student'
                WHERE f.ckey IN ($in) GROUP BY f.ckey, f.sid", $keys)->fetchAll() as $r) $counts[$r['ckey']][$r['sid']] = (int)$r['n'];
    $mine = [];
    $u = current_user();
    if ($u) foreach (q("SELECT ckey, sid FROM inf_fires WHERE user_id = ? AND ckey IN ($in)", array_merge([$u['id']], $keys))->fetchAll() as $r) $mine[$r['ckey']][] = $r['sid'];
    foreach ($counts as $ck => $a) $counts[$ck] = (object)$a;
    out(['ok' => true, 'counts' => (object)$counts, 'mine' => (object)$mine]);

case 'fire_set':
    need_post();
    $u = need_user();
    if ($u['role'] !== 'student') fail('Огоньки ставят ученики', 403);
    $k = valid_key(arg('key'));
    $sid = (string)arg('sid');
    if (!preg_match('/^[0-9a-z.]{1,16}\/[a-z0-9]{1,8}$/', $sid)) fail('Неверная задача');
    if (arg('on', false)) q(($MYSQL ? 'INSERT IGNORE' : 'INSERT OR IGNORE') . ' INTO inf_fires (user_id, ckey, sid, created) VALUES (?,?,?,?)', [$u['id'], $k, $sid, time()]);
    else q('DELETE FROM inf_fires WHERE user_id = ? AND ckey = ? AND sid = ?', [$u['id'], $k, $sid]);
    $n = one("SELECT COUNT(*) AS n FROM inf_fires f JOIN inf_users u ON u.id = f.user_id AND u.role = 'student' WHERE f.ckey = ? AND f.sid = ?", [$k, $sid]);
    out(['ok' => true, 'n' => (int)$n['n'], 'on' => (bool)arg('on', false)]);

case 'fires_top':
    // учителю: какие задачи ученики отметили сложными и кто именно
    need_teacher();
    $rows = q("SELECT f.ckey, f.sid, f.user_id, f.created FROM inf_fires f JOIN inf_users u ON u.id = f.user_id AND u.role = 'student' ORDER BY f.created DESC")->fetchAll();
    $agg = [];
    foreach ($rows as $r) {
        $id = $r['ckey'] . '|' . $r['sid'];
        if (!isset($agg[$id])) $agg[$id] = ['ckey' => $r['ckey'], 'sid' => $r['sid'], 'users' => [], 'last' => (int)$r['created']];
        $agg[$id]['users'][] = (int)$r['user_id'];
    }
    out(['ok' => true, 'fires' => array_values($agg)]);

case 'hw_assign':
    // Учитель выдаёт одну домашку сразу нескольким ученикам (группе). Расписание и ответы учеников не трогаются.
    need_post();
    need_teacher();
    $ids = arg('ids', []);
    if (!is_array($ids)) fail('Не выбраны ученики');
    $ids = array_values(array_unique(array_map('intval', $ids)));
    if (!$ids) fail('Выберите хотя бы одного ученика');
    if (count($ids) > 300) fail('Слишком много учеников за раз');
    [$hw, $tasks, $due] = clean_hw_input();
    $add = arg('mode') === 'add';
    if (!$add && $hw === '' && !$tasks) fail('Выберите задачи или напишите задание словами');
    $done = 0;
    foreach ($ids as $id) {
        if (!one("SELECT id FROM inf_users WHERE id = ? AND role = 'student'", [$id])) continue;
        if ($add) {
            // добавить к текущей домашке: задачи объединяются, текст дописывается с новой строки
            $o = info_of($id);
            $t = clean_tasks(array_merge($o['hw_tasks'], $tasks));
            $x = $o['homework'] === '' ? $hw : ($hw === '' || strpos($o['homework'], $hw) !== false ? $o['homework'] : $o['homework'] . "\n\n" . $hw);
            if (mb_strlen($x, 'UTF-8') > 5000) $x = mb_substr($x, 0, 5000, 'UTF-8');
            save_info($id, $x, $t, $due !== '' ? $due : $o['hw_due'], null);
        } else save_info($id, $hw, $tasks, $due, null);
        $done++;
    }
    out(['ok' => true, 'count' => $done]);

