<?php
require_once __DIR__ . '/common.php';
require_once __DIR__ . '/db.php';
portera_cors();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') portera_respond(405,['success'=>false,'message'=>'Method not allowed.']);
$publicId=trim((string)($_GET['order_id']??''));
if(!preg_match('/^[a-f0-9]{32}$/',$publicId))portera_respond(400,['success'=>false,'message'=>'Order ID tidak valid.']);
try{
 $pdo=portera_db();
 $q=$pdo->prepare("SELECT o.*,b.graduation_status,b.target_industry,b.portfolio_language,b.visual_style,b.color_palette,b.cloud_link FROM orders o LEFT JOIN order_briefs b ON b.order_id=o.id WHERE o.public_id=? LIMIT 1");
 $q->execute([$publicId]);$r=$q->fetch();
 if(!$r)portera_respond(404,['success'=>false,'message'=>'Pesanan tidak ditemukan.']);
 $a=$pdo->prepare("SELECT addon_id FROM order_addons WHERE order_id=? ORDER BY id");$a->execute([(int)$r['id']]);
 $f=$pdo->prepare("SELECT original_name AS name,file_size AS size FROM order_files WHERE order_id=? ORDER BY id");$f->execute([(int)$r['id']]);
 portera_respond(200,['success'=>true,'order'=>[
  'order_id'=>$r['public_id'],'order_code'=>$r['order_code'],'packageId'=>$r['package_id'],'addons'=>array_column($a->fetchAll(),'addon_id'),
  'customer'=>['fullname'=>$r['customer_name'],'email'=>$r['customer_email'],'whatsapp'=>$r['customer_whatsapp'],'university'=>$r['university'],'major'=>$r['major']],
  'brief'=>['graduation'=>$r['graduation_status'],'industry'=>$r['target_industry'],'language'=>$r['portfolio_language'],'visualStyle'=>$r['visual_style'],'palette'=>$r['color_palette'],'cloudLink'=>$r['cloud_link']],
  'uploadedFiles'=>$f->fetchAll(),'subtotal'=>(int)$r['subtotal'],'total'=>(int)$r['total_amount'],
  'order_status'=>$r['order_status'],'payment_status'=>$r['payment_status'],'created_at'=>$r['created_at']
 ]]);
}catch(Throwable $e){error_log('get-order: '.$e->getMessage());portera_respond(500,['success'=>false,'message'=>'Gagal mengambil pesanan dari database.']);}
