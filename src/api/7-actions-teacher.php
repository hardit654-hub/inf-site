/* ----- кабинет учителя ----- */
case 'students':
    need_teacher();
    $rows = q("SELECT u.id, u.login, u.name, u.note, u.cat, u.grade, u.courses, u.created_at, u.last_seen, COALESCE(c.s, 0) AS coins FROM inf_users u
               LEFT JOIN (SELECT user_id, SUM(amount) AS s FROM inf_coins GROUP BY user_id) c ON c.user_id = u.id
               WHERE u.role = 'student' ORDER BY u.name")->fetchAll();
    foreach ($rows as &$r) { foreach (['id','grade','created_at','last_seen','coins'] as $f) $r[$f] = (int)$r[$f]; $r['courses'] = courses_list($r['courses']); $r['info'] = info_of($r['id']); $r['info']['hw_prog'] = hw_progress($r['id'], $r['info']['hw_tasks']); }
    out(['ok' => true, 'students' => $rows]);

case 'student_create':
    need_post();
    need_teacher();
    $name = clean_name(arg('name'));
    $login = norm_login((string)arg('login'));
    if ($login === '') $login = make_login($name);
    elseif (!valid_login($login)) fail('Логин: латиница, цифры, точка, дефис; от 2 до 32 символов');
    elseif (one('SELECT id FROM inf_users WHERE login = ?', [$login])) fail('Такой логин уже занят');
    $note = mb_substr(trim((string)arg('note')), 0, 200, 'UTF-8');
    $cat = clean_cat(arg('cat'));
    $pass = make_password();
    q('INSERT INTO inf_users (login, name, role, pass_hash, note, cat, created_at) VALUES (?,?,?,?,?,?,?)',
        [$login, $name, 'student', password_hash($pass, PASSWORD_DEFAULT), $note, $cat, time()]);
    out(['ok' => true, 'student' => ['id' => (int)$pdo->lastInsertId(), 'login' => $login, 'name' => $name, 'note' => $note, 'cat' => $cat], 'password' => $pass]);

case 'coins_add':
    // Учитель вручную начисляет (или списывает) монетки ученику
    need_post();
    need_teacher();
    $id = (int)arg('id');
    $amount = (int)arg('amount');
    if (!one("SELECT id FROM inf_users WHERE id = ? AND role = 'student'", [$id])) fail('Ученик не найден', 404);
    if ($amount === 0 || abs($amount) > 1000) fail('Укажите число от −1000 до 1000, кроме нуля');
    $sid = 'b' . time() . bin2hex(random_bytes(4));
    q('INSERT INTO inf_coins (user_id, ckey, sid, amount, created) VALUES (?,?,?,?,?)', [$id, 'bonus', $sid, $amount, time()]);
    out(['ok' => true, 'coins' => coins_total($id)]);

case 'student_update':
    need_post();
    need_teacher();
    $id = (int)arg('id');
    if (!one("SELECT id FROM inf_users WHERE id = ? AND role = 'student'", [$id])) fail('Ученик не найден', 404);
    q('UPDATE inf_users SET name = ?, note = ? WHERE id = ?', [clean_name(arg('name')), mb_substr(trim((string)arg('note')), 0, 200, 'UTF-8'), $id]);
    global $IN;
    if (array_key_exists('cat', $IN)) q('UPDATE inf_users SET cat = ? WHERE id = ?', [clean_cat(arg('cat')), $id]);
    if (array_key_exists('grade', $IN)) q('UPDATE inf_users SET grade = ? WHERE id = ?', [clean_grade(arg('grade')), $id]);
    if (array_key_exists('courses', $IN)) q('UPDATE inf_users SET courses = ? WHERE id = ?', [clean_courses(arg('courses')), $id]);
    out(['ok' => true]);

case 'students_move':
    // Перенос учеников в категорию и/или класс. Меняет только эти два поля.
    need_post();
    need_teacher();
    global $IN;
    $ids = arg('ids', []);
    if (!is_array($ids) || !$ids) fail('Не выбраны ученики');
    $ids = array_slice(array_values(array_unique(array_map('intval', $ids))), 0, 300);
    $setCat = array_key_exists('cat', $IN); $setGrp = array_key_exists('note', $IN);
    if (!$setCat && !$setGrp) fail('Нечего менять');
    $cat = clean_cat(arg('cat')); $grp = mb_substr(trim((string)arg('note')), 0, 200, 'UTF-8');
    $n = 0;
    foreach ($ids as $id) {
        if (!one("SELECT id FROM inf_users WHERE id = ? AND role = 'student'", [$id])) continue;
        if ($setCat) q('UPDATE inf_users SET cat = ? WHERE id = ?', [$cat, $id]);
        if ($setGrp) q('UPDATE inf_users SET note = ? WHERE id = ?', [$grp, $id]);
        $n++;
    }
    out(['ok' => true, 'count' => $n]);

case 'student_reset':
    need_post();
    need_teacher();
    $id = (int)arg('id');
    $s = one("SELECT id, login FROM inf_users WHERE id = ? AND role = 'student'", [$id]);
    if (!$s) fail('Ученик не найден', 404);
    $pass = make_password();
    q('UPDATE inf_users SET pass_hash = ? WHERE id = ?', [password_hash($pass, PASSWORD_DEFAULT), $id]);
    q('DELETE FROM inf_sessions WHERE user_id = ?', [$id]);
    out(['ok' => true, 'login' => $s['login'], 'password' => $pass]);

case 'student_delete':
    need_post();
    need_teacher();
    $id = (int)arg('id');
    if (!one("SELECT id FROM inf_users WHERE id = ? AND role = 'student'", [$id])) fail('Ученик не найден', 404);
    q('DELETE FROM inf_progress WHERE user_id = ?', [$id]);
    q('DELETE FROM inf_coins WHERE user_id = ?', [$id]);
    q('DELETE FROM inf_student_info WHERE user_id = ?', [$id]);
    q('DELETE FROM inf_sessions WHERE user_id = ?', [$id]);
    q('DELETE FROM inf_users WHERE id = ?', [$id]);
    out(['ok' => true]);

case 'class_progress':
    need_teacher();
    $k = valid_key($_GET['key'] ?? '');
    $rows = q("SELECT p.user_id, p.data, p.updated, p.resets FROM inf_progress p JOIN inf_users u ON u.id = p.user_id
               WHERE p.ckey = ? AND u.role = 'student'", [$k])->fetchAll();
    $res = [];
    foreach ($rows as $r) $res[(string)$r['user_id']] = ['data' => json_decode($r['data']), 'updated' => (int)$r['updated'], 'resets' => (int)$r['resets']];
    out(['ok' => true, 'progress' => (object)$res]);


