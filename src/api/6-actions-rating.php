case 'leaderboard':
    // Топ-7 учеников по монеткам. Ученикам — имя и первая буква фамилии, учителю — полностью.
    $u = need_user();
    $teacher = $u['role'] === 'teacher';
    $rows = q("SELECT u.id, u.name, SUM(c.amount) AS coins, MAX(c.created) AS last FROM inf_coins c
               JOIN inf_users u ON u.id = c.user_id WHERE u.role = 'student'
               GROUP BY u.id, u.name HAVING SUM(c.amount) > 0 ORDER BY coins DESC, last ASC")->fetchAll();
    $short = function ($name) {
        $p = preg_split('/\s+/u', trim($name));
        return $p[0] . (isset($p[1]) ? ' ' . mb_substr($p[1], 0, 1, 'UTF-8') . '.' : '');
    };
    $list = []; $me = null;
    foreach ($rows as $i => $r) {
        $item = ['place' => $i + 1, 'name' => $teacher ? $r['name'] : $short($r['name']), 'coins' => (int)$r['coins'], 'me' => (int)$r['id'] === (int)$u['id']];
        if ($i < 7) $list[] = $item;
        if ($item['me']) $me = $item;
    }
    if (!$me && !$teacher) $me = ['place' => null, 'name' => $short($u['name']), 'coins' => coins_total((int)$u['id']), 'me' => true];
    out(['ok' => true, 'top' => $list, 'me' => $me, 'total' => count($rows)]);

