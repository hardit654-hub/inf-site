/* ---------- чат сайта: пишут и читают только вошедшие, сообщения живут сутки ---------- */
case 'chat':
    // Новые сообщения после ?after=<id>; без after — последние 20 за сутки.
    $u = need_user();
    $after = max(0, (int)($_GET['after'] ?? 0));
    $since = time() - CHAT_TTL;
    $sel = 'SELECT c.id, c.user_id, c.text, c.created, u.name, u.role FROM inf_chat c JOIN inf_users u ON u.id = c.user_id';
    $rows = $after > 0
        ? q("$sel WHERE c.id > ? AND c.created > ? ORDER BY c.id ASC LIMIT 50", [$after, $since])->fetchAll()
        : array_reverse(q("$sel WHERE c.created > ? ORDER BY c.id DESC LIMIT 20", [$since])->fetchAll());
    $places = $rows ? chat_places() : [];
    $msgs = [];
    foreach ($rows as $r) {
        $uid = (int)$r['user_id']; $t = $r['role'] === 'teacher';
        $msgs[] = ['id' => (int)$r['id'], 'name' => $t ? $r['name'] : chat_short($r['name']), 'tag' => $t ? 'teacher' : ($places[$uid] ?? 0),
            'text' => $r['text'], 'ts' => (int)$r['created'], 'me' => $uid === (int)$u['id']];
    }
    out(['ok' => true, 'msgs' => $msgs, 'now' => time()]);

case 'chat_send':
    need_post();
    $u = need_user();
    $text = chat_text(arg('text'));
    $last = one('SELECT created, text FROM inf_chat WHERE user_id = ? ORDER BY id DESC LIMIT 1', [$u['id']]);
    if ($last && (int)$last['created'] > time() - CHAT_GAP) fail('Не так быстро: подожди пару секунд', 429);
    if ($last && $last['text'] === $text && (int)$last['created'] > time() - 60) fail('Это сообщение уже отправлено', 429);
    q('DELETE FROM inf_chat WHERE created < ?', [time() - CHAT_TTL]);
    q('INSERT INTO inf_chat (user_id, text, created) VALUES (?,?,?)', [$u['id'], $text, time()]);
    out(['ok' => true, 'id' => (int)$pdo->lastInsertId()]);

