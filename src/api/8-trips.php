case 'trip_apply':
    need_post();
    // ловушка для ботов: человек этого поля не видит и не заполнит (диагностика)
    if (isset($_GET["probe"])) out(["ok"=>true,"probe"=>(string)($_GET["probe"])]);
    if (trip_clean(arg('site'), 80) !== '') out(['ok' => true, 'saved' => true]);
    $since = time() - 3600;
    q('DELETE FROM inf_trips WHERE created < ?', [time() - 86400 * 400]);
    $ip = client_ip();
    $n = one('SELECT COUNT(*) AS n FROM inf_trips WHERE ip = ? AND created > ?', [$ip, $since]);
    if ((int)$n['n'] >= 5) fail('С этого устройства уже отправлено несколько заявок. Если нужно добавить ещё, напишите нам — контакт указан на странице.', 429);
    $kid = trip_clean(arg('surname'), 60) . ' ' . trip_clean(arg('name'), 60) . ' ' . trip_clean(arg('patronymic'), 60);
    $kid = trim(preg_replace('/\s+/u', ' ', $kid));
    if (mb_strlen($kid) < 3) fail('Напишите, пожалуйста, фамилию и имя ученика');
    $parent = trim(preg_replace('/\s+/u', ' ', trip_clean(arg('psurname'), 60) . ' ' . trip_clean(arg('pname'), 60)));
    if (mb_strlen($parent) < 3) fail('Напишите, пожалуйста, фамилию и имя родителя');
    $phone = trip_phone((string)arg('phone'));
    if ($phone === '') fail('Проверьте телефон: нужен российский номер, например +7 916 123-45-67');
    $grade = (int)arg('grade');
    if ($grade < 5 || $grade > 8) fail('Выберите класс ученика: с 5 по 8');
    $profile = trip_clean(arg('profile'), 16);
    if (!in_array($profile, ['science', 'pomory', 'later'], true)) fail('Выберите профиль программы');
    $note = trip_clean(arg('note'), 700);
    $agree = arg('agree') ? 1 : 0;
    if (!$agree) fail('Отметьте, пожалуйста, что вы ознакомились с программой и условиями');
    q('INSERT INTO inf_trips (kid, parent, phone, grade, profile, note, agree, created, ip)
       VALUES (?,?,?,?,?,?,?,?,?)',
      [$kid, $parent, $phone, $grade, $profile, $note, 1, time(), mb_substr($ip, 0, 64)]);
    out(['ok' => true, 'saved' => true, 'id' => (int)$pdo->lastInsertId()]);

case 'trips':
    need_teacher();
    $rows = q('SELECT id, kid, parent, phone, grade, profile, note, created FROM inf_trips ORDER BY created DESC')->fetchAll();
    foreach ($rows as &$r) { $r['id'] = (int)$r['id']; $r['grade'] = (int)$r['grade']; $r['created'] = (int)$r['created']; }
    out(['ok' => true, 'trips' => $rows]);

case 'trip_delete':
    need_post();
    need_teacher();
    $id = (int)arg('id');
    q('DELETE FROM inf_trips WHERE id = ?', [$id]);
    out(['ok' => true]);

default:
    fail('Неизвестное действие', 404);
}

function trip_clean($v, int $max): string {
    $v = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', (string)$v);
    return mb_substr(trim($v), 0, $max, 'UTF-8');
}
function trip_phone(string $p): string {
    $d = preg_replace('/\D+/', '', $p);
    if (strlen($d) === 11 && $d[0] === '8') $d = '7' . substr($d, 1);
    elseif (strlen($d) === 10) $d = '7' . $d;
    if (strlen($d) !== 11 || $d[0] !== '7') return '';
    return '+' . $d;
}
