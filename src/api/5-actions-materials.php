/* ----- закрытые материалы ----- */
case 'materials':
    // список вариантов для кабинета и выбора домашки
    need_user();
    $list = [];
    foreach (q('SELECT mid, catalog FROM inf_materials ORDER BY created DESC')->fetchAll() as $r) {
        $c = json_decode($r['catalog'], true); if (!$c) continue;
        $c['mid'] = $r['mid']; $list[] = $c;
    }
    out(['ok' => true, 'materials' => $list]);

case 'material':
    need_user();
    $m = valid_mid($_GET['m'] ?? '');
    $r = one('SELECT course FROM inf_materials WHERE mid = ?', [$m]);
    if (!$r) fail('Вариант не найден', 404);
    header('Content-Type: application/json; charset=utf-8');
    echo '{"ok":true,"course":' . $r['course'] . '}'; exit;

case 'mfile':
    // файл или картинка варианта; отдаётся только вошедшим
    need_user();
    $m = valid_mid($_GET['m'] ?? '');
    $f = (string)($_GET['f'] ?? '');
    if (!valid_mname($f)) fail('Неверное имя файла', 400);
    $parts = q('SELECT part FROM inf_mfiles WHERE mid = ? AND name = ? ORDER BY part', [$m, $f])->fetchAll();
    if (!$parts) fail('Файл не найден', 404);
    $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
    $types = ['png' => 'image/png', 'jpg' => 'image/jpeg', 'txt' => 'text/plain; charset=utf-8', 'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
              'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xls' => 'application/vnd.ms-excel', 'csv' => 'text/csv',
              'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pdf' => 'application/pdf', 'odt' => 'application/vnd.oasis.opendocument.text'];
    header('Content-Type: ' . ($types[$ext] ?? 'application/octet-stream'));
    header('Cache-Control: private, max-age=86400');
    $dn = (string)($_GET['n'] ?? '');  // имя файла при скачивании (например, 24.txt вместо v1-24.txt)
    if (!preg_match('/^[\w][\w.\-]{0,60}$/u', $dn) || strtolower(pathinfo($dn, PATHINFO_EXTENSION)) !== $ext) $dn = basename($f);
    if (strpos($f, 'files/') === 0) header("Content-Disposition: attachment; filename*=UTF-8''" . rawurlencode($dn));
    while (ob_get_level()) ob_end_clean();
    foreach ($parts as $p) { $r = one('SELECT data FROM inf_mfiles WHERE mid = ? AND name = ? AND part = ?', [$m, $f, (int)$p['part']]); echo $r['data']; flush(); }
    exit;

case 'material_put':
    // учитель загружает вариант: manifest.json из папки, собранной tools/variant_bundle.py
    need_post();
    need_teacher();
    $m = valid_mid(arg('mid'));
    $title = mb_substr(trim((string)arg('title')), 0, 200, 'UTF-8');
    $course = arg('course', null); $cat = arg('catalog', null);
    if ($title === '' || !is_array($course) || !is_array($cat) || empty($cat['key'])) fail('Неверный файл manifest.json');
    valid_key(substr((string)$cat['key'], 0, 64));
    $cj = json_encode($course, JSON_UNESCAPED_UNICODE); $kj = json_encode($cat, JSON_UNESCAPED_UNICODE);
    if (one('SELECT mid FROM inf_materials WHERE mid = ?', [$m]))
        q('UPDATE inf_materials SET title = ?, course = ?, catalog = ?, updated = ? WHERE mid = ?', [$title, $cj, $kj, time(), $m]);
    else
        q('INSERT INTO inf_materials (mid, title, course, catalog, created, updated) VALUES (?,?,?,?,?,?)', [$m, $title, $cj, $kj, time(), time()]);
    out(['ok' => true]);

case 'mfile_put':
    // кусок файла варианта (тело запроса — байты файла)
    need_post();
    need_teacher();
    $m = valid_mid($_GET['m'] ?? '');
    $f = (string)($_GET['f'] ?? '');
    $part = (int)($_GET['part'] ?? -1);
    if (!valid_mname($f) || $part < 0 || $part > 500) fail('Неверное имя файла');
    if (!one('SELECT mid FROM inf_materials WHERE mid = ?', [$m])) fail('Сначала загрузите manifest.json', 404);
    if ($part === 0) q('DELETE FROM inf_mfiles WHERE mid = ? AND name = ?', [$m, $f]);
    $s = $pdo->prepare('INSERT INTO inf_mfiles (mid, name, part, data) VALUES (?,?,?,?)');
    $s->bindValue(1, $m); $s->bindValue(2, $f); $s->bindValue(3, $part, PDO::PARAM_INT); $s->bindValue(4, (string)$raw, PDO::PARAM_LOB);
    $s->execute();
    out(['ok' => true, 'bytes' => strlen((string)$raw)]);

case 'material_delete':
    need_post();
    need_teacher();
    $m = valid_mid(arg('mid'));
    q('DELETE FROM inf_mfiles WHERE mid = ?', [$m]);
    q('DELETE FROM inf_materials WHERE mid = ?', [$m]);
    out(['ok' => true]);

