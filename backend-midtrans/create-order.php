<?php
require_once __DIR__ . '/common.php';
require_once __DIR__ . '/db.php';
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    portera_respond(405, [
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') portera_respond(405, ['success'=>false,'message'=>'Method not allowed.']);
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) portera_respond(400, ['success'=>false,'message'=>'Payload pesanan tidak valid.']);

$packages = [
 'pitch'=>['name'=>'Pitch Deck - Slide Presentasi','price'=>100000],
 'website'=>['name'=>'Website Portfolio','price'=>200000],
 'bundle'=>['name'=>'Bundle Deck + Website','price'=>250000],
];
$addons = [
 'express'=>['name'=>'Ekspres 24 Jam (Fast-track)','price'=>30000],
 'ats'=>['name'=>'Review CV ATS-Friendly','price'=>20000],
];
$packageId = (string)($input['packageId'] ?? '');
if (!isset($packages[$packageId])) portera_respond(422,['success'=>false,'message'=>'Paket tidak valid.']);
$c = $input['customer'] ?? []; $b = $input['brief'] ?? [];
$name=trim((string)($c['fullname']??'')); $email=trim((string)($c['email']??''));
$phone=trim((string)($c['whatsapp']??'')); $university=trim((string)($c['university']??''));
$major=trim((string)($c['major']??''));
if ($name==='' || !filter_var($email,FILTER_VALIDATE_EMAIL) || $phone==='' || $university==='' || $major==='') {
 portera_respond(422,['success'=>false,'message'=>'Lengkapi nama, email valid, WhatsApp, universitas, dan program studi.']);
}
$graduation=(string)($b['graduation']??''); $industry=trim((string)($b['industry']??''));
$language=(string)($b['language']??'id'); $style=(string)($b['visualStyle']??''); $palette=(string)($b['palette']??'');
if (!in_array($graduation,['fresh','active','final','other'],true) || $industry==='' ||
 !in_array($language,['id','en'],true) || !in_array($style,['corporate','modern','creative','academic'],true) ||
 !in_array($palette,['navy','emerald','slate','crimson'],true)) {
 portera_respond(422,['success'=>false,'message'=>'Data brief tidak lengkap atau tidak valid.']);
}
$selected = $input['addons'] ?? [];
if (!is_array($selected)) $selected=[];
$selected=array_values(array_unique(array_map('strval',$selected)));
foreach($selected as $id) if(!isset($addons[$id])) portera_respond(422,['success'=>false,'message'=>'Add-on tidak valid.']);
$subtotal=(int)$packages[$packageId]['price'];
foreach($selected as $id) $subtotal+=(int)$addons[$id]['price'];

try {
 $pdo=portera_db(); $pdo->beginTransaction();
 $publicId=bin2hex(random_bytes(16));
 $orderCode='PORTERA-'.date('YmdHis').'-'.strtoupper(bin2hex(random_bytes(3)));
 $editOrderId = trim((string)($input['order_id'] ?? ''));

if ($editOrderId !== '') {

    if (!preg_match('/^[a-f0-9]{32}$/', $editOrderId)) {
        $pdo->rollBack();
        portera_respond(400, [
            'success' => false,
            'message' => 'ID pesanan tidak valid.'
        ]);
    }

    $find = $pdo->prepare(
        "SELECT id,order_code, payment_status, order_status
         FROM orders
         WHERE public_id = ?
         LIMIT 1
         FOR UPDATE"
    );

    $find->execute([$editOrderId]);
    $existing = $find->fetch();

    if (!$existing) {
        $pdo->rollBack();
        portera_respond(404, [
            'success' => false,
            'message' => 'Pesanan tidak ditemukan.'
        ]);
    }

    if (
        $existing['payment_status'] === 'paid' ||
        $existing['order_status'] === 'paid'
    ) {
        $pdo->rollBack();
        portera_respond(409, [
            'success' => false,
            'message' => 'Pesanan yang sudah dibayar tidak dapat diubah.'
        ]);
    }

    $id = (int)$existing['id'];
    $publicId = $editOrderId;

    $stmt = $pdo->prepare(
        "UPDATE orders SET
            package_id = ?,
            package_name = ?,
            customer_name = ?,
            customer_email = ?,
            customer_whatsapp = ?,
            university = ?,
            major = ?,
            subtotal = ?,
            total_amount = ?,
            midtrans_token = NULL,
            midtrans_redirect_url = NULL
         WHERE id = ?"
    );

    $stmt->execute([
        $packageId,
        $packages[$packageId]['name'],
        $name,
        $email,
        $phone,
        $university,
        $major,
        $subtotal,
        $subtotal,
        $id
    ]);

    // Perbarui add-on
    $deleteAddons = $pdo->prepare(
        "DELETE FROM order_addons WHERE order_id = ?"
    );
    $deleteAddons->execute([$id]);

    $a = $pdo->prepare(
        "INSERT INTO order_addons
        (order_id, addon_id, addon_name, unit_price, quantity, line_total)
        VALUES (?, ?, ?, ?, 1, ?)"
    );

    foreach ($selected as $addonId) {
        $price = (int)$addons[$addonId]['price'];

        $a->execute([
            $id,
            $addonId,
            $addons[$addonId]['name'],
            $price,
            $price
        ]);
    }

    // Perbarui brief
    $brief = $pdo->prepare(
        "UPDATE order_briefs SET
            graduation_status = ?,
            target_industry = ?,
            portfolio_language = ?,
            visual_style = ?,
            color_palette = ?,
            cloud_link = ?
         WHERE order_id = ?"
    );

    $brief->execute([
        $graduation,
        $industry,
        $language,
        $style,
        $palette,
        trim((string)($b['cloudLink'] ?? '')),
        $id
    ]);

    // Jika brief belum memiliki record, buat record baru
    if ($brief->rowCount() === 0) {
        $check = $pdo->prepare(
            "SELECT id FROM order_briefs WHERE order_id = ?"
        );
        $check->execute([$id]);

        if (!$check->fetch()) {
            $insertBrief = $pdo->prepare(
                "INSERT INTO order_briefs
                (order_id, graduation_status, target_industry,
                 portfolio_language, visual_style, color_palette, cloud_link)
                VALUES (?, ?, ?, ?, ?, ?, ?)"
            );

            $insertBrief->execute([
                $id,
                $graduation,
                $industry,
                $language,
                $style,
                $palette,
                trim((string)($b['cloudLink'] ?? ''))
            ]);
        }
    }

    // Pertahankan file lama jika pengguna tidak memilih file baru
    $newFiles = $input['uploadedFiles'] ?? [];

    if (is_array($newFiles) && count($newFiles) > 0) {
        $deleteFiles = $pdo->prepare(
            "DELETE FROM order_files WHERE order_id = ?"
        );
        $deleteFiles->execute([$id]);

        $f = $pdo->prepare(
            "INSERT INTO order_files
            (order_id, original_name, file_size, upload_status)
            VALUES (?, ?, ?, 'metadata_only')"
        );

        foreach ($newFiles as $file) {
            if (!is_array($file)) continue;

            $fn = trim((string)($file['name'] ?? ''));

            if ($fn !== '') {
                $f->execute([
                    $id,
                    substr($fn, 0, 255),
                    max(0, (int)($file['size'] ?? 0))
                ]);
            }
        }
    }

} else {

    // Buat pesanan baru
    $publicId = bin2hex(random_bytes(16));

    $orderCode = 'PORTERA-' . date('YmdHis') . '-' .
        strtoupper(bin2hex(random_bytes(3)));

    $stmt = $pdo->prepare(
        "INSERT INTO orders
        (public_id, order_code, package_id, package_name,
         customer_name, customer_email, customer_whatsapp,
         university, major, subtotal, total_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $stmt->execute([
        $publicId,
        $orderCode,
        $packageId,
        $packages[$packageId]['name'],
        $name,
        $email,
        $phone,
        $university,
        $major,
        $subtotal,
        $subtotal
    ]);

    $id = (int)$pdo->lastInsertId();

    $a = $pdo->prepare(
        "INSERT INTO order_addons
        (order_id, addon_id, addon_name, unit_price, quantity, line_total)
        VALUES (?, ?, ?, ?, 1, ?)"
    );

    foreach ($selected as $addonId) {
        $price = (int)$addons[$addonId]['price'];

        $a->execute([
            $id,
            $addonId,
            $addons[$addonId]['name'],
            $price,
            $price
        ]);
    }

    $brief = $pdo->prepare(
        "INSERT INTO order_briefs
        (order_id, graduation_status, target_industry,
         portfolio_language, visual_style, color_palette, cloud_link)
        VALUES (?, ?, ?, ?, ?, ?, ?)"
    );

    $brief->execute([
        $id,
        $graduation,
        $industry,
        $language,
        $style,
        $palette,
        trim((string)($b['cloudLink'] ?? ''))
    ]);

    $f = $pdo->prepare(
        "INSERT INTO order_files
        (order_id, original_name, file_size, upload_status)
        VALUES (?, ?, ?, 'metadata_only')"
    );

    foreach (($input['uploadedFiles'] ?? []) as $file) {
        if (!is_array($file)) continue;

        $fn = trim((string)($file['name'] ?? ''));

        if ($fn !== '') {
            $f->execute([
                $id,
                substr($fn, 0, 255),
                max(0, (int)($file['size'] ?? 0))
            ]);
        }
    }
}

$pdo->commit();

portera_respond(201, [
    'success' => true,
    'order_id' => $publicId,
    'order_code' => $orderCode ?? ($existing['order_code'] ?? ''),
    'message' => 'Pesanan berhasil disimpan.'
]);
} catch(Throwable $e) {
 if(isset($pdo)&&$pdo instanceof PDO&&$pdo->inTransaction())$pdo->rollBack();
 error_log('create-order: '.$e->getMessage());
 portera_respond(500,['success'=>false,'message'=>'Gagal menyimpan pesanan ke database. Periksa konfigurasi database.']);
}
