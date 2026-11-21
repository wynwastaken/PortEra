<?php
function portera_db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $file = __DIR__ . '/database.php';
    if (!is_file($file)) throw new RuntimeException('Salin database.php.example menjadi database.php dan isi kredensial MySQL.');
    $c = require $file;
    $dsn = 'mysql:host=' . ($c['host'] ?? '127.0.0.1') . ';port=' . (int)($c['port'] ?? 3306) .
        ';dbname=' . ($c['database'] ?? 'portera_db') . ';charset=' . ($c['charset'] ?? 'utf8mb4');
    $pdo = new PDO($dsn, (string)($c['username'] ?? ''), (string)($c['password'] ?? ''), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}
