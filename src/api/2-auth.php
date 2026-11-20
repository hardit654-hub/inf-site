/* ---------- запрос ---------- */
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = (string)($_GET['action'] ?? '');
$IN = [];
if ($method === 'POST') {
    // Защита от подделки запросов с чужих сайтов: обычная форма не может поставить этот заголовок.
    if (($_SERVER['HTTP_X_INF'] ?? '') !== '1') fail('Неверный запрос', 403);
    $raw = file_get_contents('php://input');
    $big = in_array($action, ['material_put', 'mfile_put'], true);  // загрузка материалов учителем
    if (strlen((string)$raw) > ($big ? 3000000 : MAX_DATA + 10000)) fail('Слишком большой запрос', 413);
    $IN = $action === 'mfile_put' ? [] : json_decode((string)$raw, true);
    if (!is_array($IN)) $IN = [];
}
function arg(string $k, $def = '') { global $IN; return array_key_exists($k, $IN) ? $IN[$k] : $def; }
function need_post() { global $method; if ($method !== 'POST') fail('Нужен POST', 405); }

/* ---------- сессии ---------- */
function cookie_path(): string {
    $p = dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/api/index.php'));
    $p = str_replace('\\', '/', $p);
    return rtrim($p, '/') . '/';
}
function https(): bool {
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
        || (($_SERVER['SERVER_PORT'] ?? '') === '443');
}
function set_cookie(string $val, int $expires) {
    $c = COOKIE . '=' . $val . '; Path=' . cookie_path() . '; HttpOnly; SameSite=Lax';
    $c .= $expires > 0 ? '; Expires=' . gmdate('D, d M Y H:i:s', $expires) . ' GMT; Max-Age=' . max(0, $expires - time()) : '; Max-Age=0';
    if (https()) $c .= '; Secure';
    header('Set-Cookie: ' . $c, false);
}
function token_hash(string $t): string { return hash('sha256', $t); }
function start_session(int $uid) {
    $t = bin2hex(random_bytes(32));
    $exp = time() + SESSION_DAYS * 86400;
    q('INSERT INTO inf_sessions (token, user_id, created_at, expires) VALUES (?,?,?,?)', [token_hash($t), $uid, time(), $exp]);
    set_cookie($t, $exp);
}
function current_user() {
    static $u = false;
    if ($u !== false) return $u;
    $u = null;
    $t = $_COOKIE[COOKIE] ?? '';
    if (!preg_match('/^[0-9a-f]{64}$/', $t)) return null;
    $r = one('SELECT u.id, u.login, u.name, u.role, u.last_seen FROM inf_sessions s JOIN inf_users u ON u.id = s.user_id
              WHERE s.token = ? AND s.expires > ?', [token_hash($t), time()]);
    if ($r) {
        $r['id'] = (int)$r['id'];
        if ((int)$r['last_seen'] < time() - 60) q('UPDATE inf_users SET last_seen = ? WHERE id = ?', [time(), $r['id']]);
        unset($r['last_seen']);
        $u = $r;
    }
    return $u;
}
function need_user() { $u = current_user(); if (!$u) fail('Нужно войти', 401); return $u; }
function need_teacher() { $u = need_user(); if ($u['role'] !== 'teacher') fail('Только для учителя', 403); return $u; }
function public_user($u) { return $u ? ['id' => (int)$u['id'], 'login' => $u['login'], 'name' => $u['name'], 'role' => $u['role']] : null; }

/* ---------- защита от подбора пароля ---------- */
function client_ip(): string { return substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 64); }
function throttle(string $login) {
    $since = time() - 900;
    q('DELETE FROM inf_attempts WHERE ts < ?', [time() - 86400]);
    $ip = one('SELECT COUNT(*) AS n FROM inf_attempts WHERE k = ? AND ts > ?', ['ip:' . client_ip(), $since]);
    $lg = one('SELECT COUNT(*) AS n FROM inf_attempts WHERE k = ? AND ts > ?', ['login:' . $login, $since]);
    if ((int)$ip['n'] >= 30 || (int)$lg['n'] >= 10) fail('Слишком много неудачных попыток. Подождите 15 минут.', 429);
}
function attempt_failed(string $login) {
    q('INSERT INTO inf_attempts (k, ts) VALUES (?, ?)', ['ip:' . client_ip(), time()]);
    q('INSERT INTO inf_attempts (k, ts) VALUES (?, ?)', ['login:' . $login, time()]);
}

/* ---------- логины и пароли ---------- */
function norm_login(string $s): string { return strtolower(trim($s)); }
function valid_login(string $s): bool { return (bool)preg_match('/^[a-z0-9][a-z0-9._-]{1,31}$/', $s); }
function translit(string $s): string {
    $map = ['а'=>'a','б'=>'b','в'=>'v','г'=>'g','д'=>'d','е'=>'e','ё'=>'e','ж'=>'zh','з'=>'z','и'=>'i','й'=>'y','к'=>'k','л'=>'l','м'=>'m',
        'н'=>'n','о'=>'o','п'=>'p','р'=>'r','с'=>'s','т'=>'t','у'=>'u','ф'=>'f','х'=>'h','ц'=>'ts','ч'=>'ch','ш'=>'sh','щ'=>'sch','ъ'=>'',
        'ы'=>'y','ь'=>'','э'=>'e','ю'=>'yu','я'=>'ya'];
    $s = mb_strtolower($s, 'UTF-8');
    $r = '';
    foreach (preg_split('//u', $s, -1, PREG_SPLIT_NO_EMPTY) as $ch) $r .= $map[$ch] ?? $ch;
    return $r;
}
function make_login(string $name): string {
    $parts = preg_split('/\s+/u', trim($name));
    $base = preg_replace('/[^a-z0-9]/', '', translit($parts[0] ?? ''));
    if (isset($parts[1])) $base .= '.' . preg_replace('/[^a-z0-9]/', '', translit($parts[1]));
    $base = trim(substr($base, 0, 24), '.');
    if (strlen($base) < 2) $base = 'uchenik';
    $login = $base;
    for ($i = 2; one('SELECT id FROM inf_users WHERE login = ?', [$login]); $i++) $login = $base . $i;
    return $login;
}
function make_password(): string {
    $abc = 'abcdefghjkmnpqrstuvwxyz23456789';
    $p = '';
    // 4 символа без похожих (0/o, 1/l): около 900 тысяч вариантов; подбор упирается в лимит 10 попыток за 15 минут
    for ($i = 0; $i < 4; $i++) $p .= $abc[random_int(0, strlen($abc) - 1)];
    return $p;
}
function clean_name($s): string {
    $s = trim(preg_replace('/\s+/u', ' ', (string)$s));
    if ($s === '' || mb_strlen($s, 'UTF-8') > 80) fail('Укажите имя (до 80 символов)');
    return $s;
}

