# PortEra — Database Order + Midtrans Checkout

## Flow
1. Form `/pemesanan` POSTs the form to `create-order.php`.
2. PHP validates fields, calculates prices server-side, then inserts order, add-ons, brief, and selected-file metadata into MySQL.
3. PHP returns an opaque 32-character `order_id`.
4. Browser opens `/checkout?order_id=<public_id>`.
5. Checkout calls `get-order.php?order_id=...` and renders the database record.
6. **Bayar Sekarang** POSTs only `order_id` to `token.php`.
7. `token.php` reads the saved order from MySQL and requests a Midtrans Snap token.

## Import SQL
Import `database/portera_orders.sql` using phpMyAdmin. It creates `portera_db` and tables `orders`, `order_addons`, `order_briefs`, and `order_files`.

## PHP backend
Copy `backend-midtrans/` to the PHP server directory, e.g. `C:/xampp/htdocs/portera-api/`.
Copy `database.php.example` to `database.php`, then set DB credentials.
Copy `config.php.example` to `config.php`, then set Midtrans Server Key and `allowed_origins`.
Keep both config files private and outside Next.js `public/`. Enable PHP PDO MySQL (`pdo_mysql`) and cURL.

## Next.js .env.local
Copy `.env.local.example` to `.env.local` and set:
- `NEXT_PUBLIC_PORTERA_API_URL=http://localhost/portera-api`
- `NEXT_PUBLIC_MIDTRANS_TOKEN_URL=http://localhost/portera-api/token.php`
- `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=...`
- `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false`
- `NEXT_PUBLIC_PORTERA_WHATSAPP_NUMBER=628...`

Use the exact Next.js origin in PHP `allowed_origins`, e.g. `http://localhost:3000`. Restart Next.js after editing env values.

## Notes
- Prices are calculated in PHP and never trusted from the browser.
- Selected files are currently saved as filename/size metadata only; the actual files are not uploaded.
- The voucher field is currently a UI-only prototype and does not change the stored total.
- Add a Midtrans notification/webhook endpoint before production. It must verify Midtrans notifications server-side and update `payment_status`, `order_status`, `paid_at`, and `midtrans_transaction_id`. Do not mark an order paid based only on browser callbacks.
- `get-order.php` returns an order to anyone with its unguessable public ID. Add authentication/authorization if customer accounts are introduced.
