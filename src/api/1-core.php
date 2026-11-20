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
    $pdo->exec("CREATE TABLE IF NOT EXISTS inf_student_info (
        user_id INT NOT NULL PRIMARY KEY, schedule TEXT, homework TEXT, hw_due VARCHAR(10) NOT NULL DEFAULT '',
        hw_set INT NOT NULL DEFAULT 0, hw_done INT NOT NULL DEFAULT 0, updated INT NOT NULL DEFAULT 0)$tail");
    try { $pdo->query('SELECT hw_tasks FROM inf_student_info LIMIT 0'); }
    catch (Exception $e) { $pdo->exec('ALTER TABLE inf_student_info ADD COLUMN hw_tasks TEXT'); }
    // отметки учителя по заданиям ЕГЭ 1–27: {"4":"g","12":"y","22":"r"}
    try { $pdo->query('SELECT skills FROM inf_student_info LIMIT 0'); }
    catch (Exception $e) { $pdo->exec('ALTER TABLE inf_student_info ADD COLUMN skills TEXT'); }
    // категория ученика: «Школа» / «Репетиторство» (новая колонка, по умолчанию пустая)
    try { $pdo->query('SELECT cat FROM inf_users LIMIT 0'); }
    catch (Exception $e) { $pdo->exec("ALTER TABLE inf_users ADD COLUMN cat VARCHAR(32) NOT NULL DEFAULT ''"); }
    // закрытые материалы (варианты СтатГрада и т. п.): видны только вошедшим
    $blob = $mysql ? 'MEDIUMBLOB' : 'BLOB';
    $pdo->exec("CREATE TABLE IF NOT EXISTS inf_materials (
        mid VARCHAR(40) NOT NULL PRIMARY KEY, title VARCHAR(200) NOT NULL, course $text NOT NULL, catalog $text NOT NULL,
        created INT NOT NULL, updated INT NOT NULL)$tail");
    $pdo->exec("CREATE TABLE IF NOT EXISTS inf_mfiles (
        mid VARCHAR(40) NOT NULL, name VARCHAR(190) NOT NULL, part INT NOT NULL, data $blob NOT NULL,
        PRIMARY KEY (mid, name, part))$tail");
    // «огоньки»: ученик отмечает задачу как сложную, видят все
    $pdo->exec("CREATE TABLE IF NOT EXISTS inf_fires (
        user_id INT NOT NULL, ckey VARCHAR(64) NOT NULL, sid VARCHAR(32) NOT NULL, created INT NOT NULL,
        PRIMARY KEY (user_id, ckey, sid))$tail");
    $pdo->exec("CREATE TABLE IF NOT EXISTS inf_attempts (
        id $ai, k VARCHAR(128) NOT NULL, ts INT NOT NULL)$tail");
    // чат сайта: сообщения живут сутки (старые удаляются при отправке нового)
    $pdo->exec("CREATE TABLE IF NOT EXISTS inf_chat (
        id $ai, user_id INT NOT NULL, text VARCHAR(800) NOT NULL, created INT NOT NULL)$tail");
}
schema($pdo, $MYSQL);

function q(string $sql, array $args = []) { global $pdo; $s = $pdo->prepare($sql); $s->execute($args); return $s; }
function one(string $sql, array $args = []) { $r = q($sql, $args)->fetch(); return $r === false ? null : $r; }

