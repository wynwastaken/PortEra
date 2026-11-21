<?php
require_once __DIR__ . '/common.php';
require_once __DIR__ . '/db.php';
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if($_SERVER['REQUEST_METHOD']!=='POST')portera_respond(405,['success'=>false,'message'=>'Method not allowed.']);
$cfgFile=__DIR__.'/config.php';
if(!is_file($cfgFile))portera_respond(500,['success'=>false,'message'=>'Konfigurasi Midtrans belum dibuat.']);
$cfg=require $cfgFile;$serverKey=trim((string)($cfg['server_key']??''));$production=(bool)($cfg['is_production']??false);
if($serverKey===''||str_contains($serverKey,'REPLACE_WITH'))portera_respond(500,['success'=>false,'message'=>'Server Key Midtrans belum diatur.']);
$publicId=trim((string)($_POST['order_id']??''));
if(!preg_match('/^[a-f0-9]{32}$/',$publicId))portera_respond(400,['success'=>false,'message'=>'Order ID tidak valid.']);
try{
 $pdo=portera_db();$q=$pdo->prepare("SELECT * FROM orders WHERE public_id=? LIMIT 1");$q->execute([$publicId]);$order=$q->fetch();
 if(!$order)portera_respond(404,['success'=>false,'message'=>'Pesanan tidak ditemukan.']);
 if($order['payment_status']==='paid'||$order['order_status']==='paid')portera_respond(409,['success'=>false,'message'=>'Pesanan ini sudah dibayar.']);
 $packagePrices=['pitch'=>100000,'website'=>200000,'bundle'=>250000];
 if(!isset($packagePrices[$order['package_id']]))portera_respond(500,['success'=>false,'message'=>'Paket pada pesanan tidak valid.']);
 $items=[['id'=>$order['package_id'],'price'=>$packagePrices[$order['package_id']],'quantity'=>1,'name'=>substr($order['package_name'],0,50)]];
 $a=$pdo->prepare("SELECT addon_id,addon_name,unit_price,quantity FROM order_addons WHERE order_id=?");$a->execute([(int)$order['id']]);
 foreach($a->fetchAll() as $addon)$items[]=['id'=>$addon['addon_id'],'price'=>(int)$addon['unit_price'],'quantity'=>(int)$addon['quantity'],'name'=>substr($addon['addon_name'],0,50)];
 $gross=(int)$order['total_amount'];
 $first=$order['customer_name'];$last='';$parts=preg_split('/\s+/',trim($first),2);if(count($parts)===2){$first=$parts[0];$last=$parts[1];}
 $payload=['transaction_details'=>['order_id'=>$order['order_code'],'gross_amount'=>$gross],'item_details'=>$items,
 'customer_details'=>['first_name'=>$first,'last_name'=>$last,'email'=>$order['customer_email'],'phone'=>$order['customer_whatsapp']]];
 $url=$production?'https://app.midtrans.com/snap/v1/transactions':'https://app.sandbox.midtrans.com/snap/v1/transactions';
 $ch=curl_init($url);curl_setopt_array($ch,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_POST=>true,CURLOPT_HTTPHEADER=>['Accept: application/json','Content-Type: application/json','Authorization: Basic '.base64_encode($serverKey.':')],CURLOPT_POSTFIELDS=>json_encode($payload),CURLOPT_TIMEOUT=>30]);
 $body=curl_exec($ch);$curlErr=curl_error($ch);$http=(int)curl_getinfo($ch,CURLINFO_HTTP_CODE);curl_close($ch);
 if($body===false||$curlErr){error_log('Midtrans cURL: '.$curlErr);portera_respond(502,['success'=>false,'message'=>'Tidak dapat terhubung ke Midtrans.']);}
 $mid=json_decode($body,true);
 if($http!==201||empty($mid['token'])){error_log('Midtrans HTTP '.$http.': '.$body);portera_respond(502,['success'=>false,'message'=>$mid['error_messages'][0]??'Midtrans gagal membuat token.']);}
 $u=$pdo->prepare("UPDATE orders SET midtrans_token=?,midtrans_redirect_url=? WHERE id=?");$u->execute([$mid['token'],$mid['redirect_url']??null,(int)$order['id']]);
 portera_respond(200,['success'=>true,'order_id'=>$order['order_code'],'public_order_id'=>$publicId,'token'=>$mid['token'],'redirect_url'=>$mid['redirect_url']??null]);
}catch(Throwable $e){error_log('token.php: '.$e->getMessage());portera_respond(500,['success'=>false,'message'=>'Gagal menyiapkan pembayaran. Periksa koneksi database.']);}
