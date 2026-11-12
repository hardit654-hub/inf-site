<?php
/*
 * API личных кабинетов: вход, прогресс по курсам, кабинет учителя.
 * Настройки базы берутся из config.php рядом (его пишет автозагрузка из секретов GitHub,
 * в репозитории его нет). Таблицы создаются сами при первом запросе.
 * Совместимо с PHP 7.2+ и MySQL 5.7+/8 (локально для проверки — SQLite).
 */
declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

const SESSION_DAYS = 180;
const COOKIE = 'inf_sid';
const MAX_DATA = 400000;

function out($data, int $code = 200) { http_response_code($code); echo json_encode($data, JSON_UNESCAPED_UNICODE); exit; }
function fail(string $msg, int $code = 400) { out(['ok' => false, 'error' => $msg], $code); }

set_exception_handler(function ($e) {
    error_log('inf api: ' . $e->getMessage());
    fail('Ошибка сервера. Попробуйте ещё раз чуть позже.', 500);
});

$cfgFile = __DIR__ . '/config.php';
if (!is_file($cfgFile)) fail('Сервер не настроен (нет config.php)', 500);
$CFG = require $cfgFile;

$pdo = new PDO($CFG['dsn'], $CFG['user'] ?? null, $CFG['pass'] ?? null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
]);
$MYSQL = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql';

function schema(PDO $pdo, bool $mysql) {
    $ai = $mysql ? 'INT AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
    $tail = $mysql ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' : '';
    $text = $mysql ? 'MEDIUMTEXT' : 'TEXT';
    $pdo->exec("CREATE TABLE IF NOT EXISTS inf_users (
        id $ai, login VARCHAR(64) NOT NULL UNIQUE, name VARCHAR(128) NOT NULL, role VARCHAR(16) NOT NULL,
        pass_hash VARCHAR(255) NOT NULL, note VARCHAR(255) NOT NULL DEFAULT '',
        created_at INT NOT NULL, last_seen INT NOT NULL DEFAULT 0)$tail");
    $pdo->exec("CREATE TABLE IF NOT EXISTS inf_sessions (
        token CHAR(64) NOT NULL PRIMARY KEY, user_id INT NOT NULL, created_at INT NOT NULL, expires INT NOT NULL)$tail");
    $pdo->exec("CREATE TABLE IF NOT EXISTS inf_progress (
        user_id INT NOT NULL, ckey VARCHAR(64) NOT NULL, data $text NOT NULL, updated INT NOT NULL,
        resets INT NOT NULL DEFAULT 0, PRIMARY KEY (user_id, ckey))$tail");
    $pdo->exec("CREATE TABLE IF NOT EXISTS inf_coins (
        user_id INT NOT NULL, ckey VARCHAR(64) NOT NULL, sid VARCHAR(32) NOT NULL, amount INT NOT NULL, created INT NOT NULL,
        PRIMARY KEY (user_id, ckey, sid))$tail");
    $pdo->exec("CREATE TABLE IF NOT EXISTS inf_attempts (
        id $ai, k VARCHAR(128) NOT NULL, ts INT NOT NULL)$tail");
}
schema($pdo, $MYSQL);

function q(string $sql, array $args = []) { global $pdo; $s = $pdo->prepare($sql); $s->execute($args); return $s; }
function one(string $sql, array $args = []) { $r = q($sql, $args)->fetch(); return $r === false ? null : $r; }

/* ---------- запрос ---------- */
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = (string)($_GET['action'] ?? '');
$IN = [];
if ($method === 'POST') {
    // Защита от подделки запросов с чужих сайтов: обычная форма не может поставить этот заголовок.
    if (($_SERVER['HTTP_X_INF'] ?? '') !== '1') fail('Неверный запрос', 403);
    $raw = file_get_contents('php://input');
    if (strlen((string)$raw) > MAX_DATA + 10000) fail('Слишком большой запрос', 413);
    $IN = json_decode((string)$raw, true);
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
function merge_state($old, $new) {
    if (!is_array($old) || !isset($old['st']) || !is_array($old['st'])) return $new;
    $r = $new;
    $st = is_array($new['st'] ?? null) ? $new['st'] : [];
    foreach ($old['st'] as $k => $v) $st[$k] = isset($st[$k]) ? merge_rec($v, $st[$k]) : $v;
    $r['st'] = (object)$st;
    return $r;
}
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
    out(['ok' => true, 'data' => $r ? json_decode($r['data']) : null, 'updated' => $r ? (int)$r['updated'] : 0, 'coins' => coins_total((int)$u['id'])]);

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
    $json = json_encode($merged, JSON_UNESCAPED_UNICODE);
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

case 'leaderboard':
    // Топ-5 учеников по монеткам. Ученикам — имя и первая буква фамилии, учителю — полностью.
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
        if ($i < 5) $list[] = $item;
        if ($item['me']) $me = $item;
    }
    if (!$me && !$teacher) $me = ['place' => null, 'name' => $short($u['name']), 'coins' => coins_total((int)$u['id']), 'me' => true];
    out(['ok' => true, 'top' => $list, 'me' => $me, 'total' => count($rows)]);

/* ----- кабинет учителя ----- */
case 'students':
    need_teacher();
    $rows = q("SELECT u.id, u.login, u.name, u.note, u.created_at, u.last_seen, COALESCE(c.s, 0) AS coins FROM inf_users u
               LEFT JOIN (SELECT user_id, SUM(amount) AS s FROM inf_coins GROUP BY user_id) c ON c.user_id = u.id
               WHERE u.role = 'student' ORDER BY u.name")->fetchAll();
    foreach ($rows as &$r) { foreach (['id','created_at','last_seen','coins'] as $f) $r[$f] = (int)$r[$f]; }
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
    $pass = make_password();
    q('INSERT INTO inf_users (login, name, role, pass_hash, note, created_at) VALUES (?,?,?,?,?,?)',
        [$login, $name, 'student', password_hash($pass, PASSWORD_DEFAULT), $note, time()]);
    out(['ok' => true, 'student' => ['id' => (int)$pdo->lastInsertId(), 'login' => $login, 'name' => $name, 'note' => $note], 'password' => $pass]);

case 'student_update':
    need_post();
    need_teacher();
    $id = (int)arg('id');
    if (!one("SELECT id FROM inf_users WHERE id = ? AND role = 'student'", [$id])) fail('Ученик не найден', 404);
    q('UPDATE inf_users SET name = ?, note = ? WHERE id = ?', [clean_name(arg('name')), mb_substr(trim((string)arg('note')), 0, 200, 'UTF-8'), $id]);
    out(['ok' => true]);

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

default:
    fail('Неизвестное действие', 404);
}
