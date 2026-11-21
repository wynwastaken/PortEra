CREATE DATABASE IF NOT EXISTS portera_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portera_db;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  public_id CHAR(32) NOT NULL,
  order_code VARCHAR(50) NOT NULL,
  package_id VARCHAR(30) NOT NULL,
  package_name VARCHAR(120) NOT NULL,
  customer_name VARCHAR(160) NOT NULL,
  customer_email VARCHAR(190) NOT NULL,
  customer_whatsapp VARCHAR(40) NOT NULL,
  university VARCHAR(190) NOT NULL,
  major VARCHAR(190) NOT NULL,
  subtotal INT UNSIGNED NOT NULL,
  discount_amount INT UNSIGNED NOT NULL DEFAULT 0,
  gateway_fee INT UNSIGNED NOT NULL DEFAULT 0,
  total_amount INT UNSIGNED NOT NULL,
  order_status ENUM('pending_payment','paid','processing','completed','cancelled','expired','failed') NOT NULL DEFAULT 'pending_payment',
  payment_status VARCHAR(40) NOT NULL DEFAULT 'unpaid',
  payment_method VARCHAR(60) NULL,
  midtrans_transaction_id VARCHAR(100) NULL,
  midtrans_token VARCHAR(120) NULL,
  midtrans_redirect_url TEXT NULL,
  paid_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_public_id (public_id),
  UNIQUE KEY uq_orders_order_code (order_code),
  KEY idx_orders_email (customer_email),
  KEY idx_orders_status (order_status),
  KEY idx_orders_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_addons (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  addon_id VARCHAR(40) NOT NULL,
  addon_name VARCHAR(120) NOT NULL,
  unit_price INT UNSIGNED NOT NULL,
  quantity SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  line_total INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_order_addon (order_id, addon_id),
  CONSTRAINT fk_order_addons_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_briefs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  graduation_status VARCHAR(50) NOT NULL,
  target_industry VARCHAR(190) NOT NULL,
  portfolio_language VARCHAR(20) NOT NULL DEFAULT 'id',
  visual_style VARCHAR(50) NOT NULL,
  color_palette VARCHAR(50) NOT NULL,
  cloud_link TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_order_brief (order_id),
  CONSTRAINT fk_order_briefs_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_files (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_size BIGINT UNSIGNED NOT NULL DEFAULT 0,
  storage_path TEXT NULL,
  upload_status ENUM('metadata_only','uploaded') NOT NULL DEFAULT 'metadata_only',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_order_files_order (order_id),
  CONSTRAINT fk_order_files_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
