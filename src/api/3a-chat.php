/* ---------- чат сайта: настройки, имена, теги, фильтр грубых слов ---------- */
const CHAT_TTL = 86400;   // сообщения живут сутки
const CHAT_MAX = 200;     // символов в сообщении
const CHAT_GAP = 3;       // секунд между сообщениями одного человека

function chat_short(string $name): string {           // «Имя Ф.», как в рейтинге
    $p = preg_split('/\s+/u', trim($name));
    return $p[0] . (isset($p[1]) ? ' ' . mb_substr($p[1], 0, 1, 'UTF-8') . '.' : '');
}
function chat_places(): array {                      // id ученика → место в топ-7 по монеткам (тег)
    $rows = q("SELECT u.id, SUM(c.amount) AS coins, MAX(c.created) AS last FROM inf_coins c
               JOIN inf_users u ON u.id = c.user_id WHERE u.role = 'student'
               GROUP BY u.id HAVING SUM(c.amount) > 0 ORDER BY coins DESC, last ASC LIMIT 7")->fetchAll();
    $m = [];
    foreach ($rows as $i => $r) $m[(int)$r['id']] = $i + 1;
    return $m;
}
function chat_bad_word(string $w): bool {
    $l = mb_strtolower($w, 'UTF-8');
    // латиница транслитом и английские ругательства
    if (preg_match('/^(?:blya|blja|bliat|huy|hui|xuy|xui|pizd|pidor|pidar|pidr|eba[tln]|zaeb|nahu[iy]|mudak|gandon|suka$)|fuck|shit|bitch/', $l)) return true;
    // похожие латинские буквы и цифры → кириллица, ё → е
    $c = strtr($l, ['ё' => 'е', 'a' => 'а', 'c' => 'с', 'e' => 'е', 'o' => 'о', 'p' => 'р', 'x' => 'х', 'y' => 'у', 'k' => 'к', 'm' => 'м',
        't' => 'т', 'h' => 'н', 'b' => 'в', '0' => 'о', '3' => 'з', '6' => 'б']);
    if (preg_match('/пизд|бляд|пид[оа]р|пидр|г[ао]ндон|залуп|шлюх|ублюд|муда[кч]|мудил|мудозв|хуесос|хуепл/u', $c)) return true;
    $pre = '(?:за|на|по|от|отъ|у|вы|до|из|изъ|раз|разъ|рас|при|про|пере|недо|объ|съ|подъ|долбо|вз|взъ|о|ни|под)?';
    return (bool)preg_match('/^(?:' . $pre . 'еб(?:[аеиклнорстуцыщ]|$)|' . $pre . 'ху[йеяюи]|бля(?!х)|сук(?:а|и|у|е|ой)$|сучар|педик|педер|(?:за|по|на|от|вы)?дроч)/u', $c);
}
function chat_text($s): string {                     // чистка: пробелы, длина, грубые слова → звёздочки
    if (!is_string($s)) fail('Пустое сообщение');
    $s = preg_replace('/[\x00-\x1F\x7F\x{200B}-\x{200F}\x{202A}-\x{202E}\x{2060}-\x{206F}\x{FEFF}]+/u', ' ', $s);
    $s = trim(preg_replace('/\s+/u', ' ', (string)$s));
    if ($s === '') fail('Пустое сообщение');
    if (mb_strlen($s, 'UTF-8') > CHAT_MAX) fail('Слишком длинно: не больше ' . CHAT_MAX . ' символов');
    return preg_replace_callback('/[\p{L}\p{N}]+/u', function ($m) {
        return chat_bad_word($m[0]) ? str_repeat('*', mb_strlen($m[0], 'UTF-8')) : $m[0];
    }, $s);
}

