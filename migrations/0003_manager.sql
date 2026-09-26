CREATE TABLE IF NOT EXISTS product_cache (
  id TEXT PRIMARY KEY,
  code TEXT,
  product TEXT NOT NULL,
  product_id TEXT NOT NULL,
  category_id TEXT,
  category_name TEXT,
  brand_id TEXT,
  type_id TEXT,
  max_price INTEGER,
  price INTEGER,
  seller TEXT,
  seller_sku_id TEXT,
  seller_sku_code TEXT,
  seller_connection_type TEXT,
  seller_sku_desc TEXT,
  stock INTEGER,
  unlimited_stock INTEGER NOT NULL DEFAULT 0,
  start_cut_off TEXT,
  end_cut_off TEXT,
  faktur INTEGER NOT NULL DEFAULT 0,
  multi INTEGER NOT NULL DEFAULT 0,
  multi_counter INTEGER,
  status INTEGER NOT NULL DEFAULT 0,
  status_sellerSku INTEGER,
  last_update TEXT,
  raw_json TEXT NOT NULL,
  synced_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_cache_category ON product_cache(category_id);
CREATE INDEX IF NOT EXISTS idx_product_cache_product_id ON product_cache(product_id);
CREATE INDEX IF NOT EXISTS idx_product_cache_status ON product_cache(status, status_sellerSku);

CREATE TABLE IF NOT EXISTS category_cache (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  synced_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seller_cache (
  seller_key TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  review_avg REAL,
  product_qty INTEGER,
  faktur_pajak INTEGER NOT NULL DEFAULT 0,
  is_seller_favorite INTEGER NOT NULL DEFAULT 0,
  last_seen TEXT,
  raw_json TEXT NOT NULL,
  synced_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS change_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  change_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  product_id TEXT,
  product_code TEXT,
  product_name TEXT,
  field_name TEXT,
  old_value TEXT,
  new_value TEXT,
  meta_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_change_log_time ON change_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_change_log_product ON change_log(product_id, created_at DESC);

CREATE TABLE IF NOT EXISTS monitor_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status TEXT NOT NULL,
  products_seen INTEGER NOT NULL DEFAULT 0,
  unhealthy_count INTEGER NOT NULL DEFAULT 0,
  switches_count INTEGER NOT NULL DEFAULT 0,
  better_seller_count INTEGER NOT NULL DEFAULT 0,
  error_text TEXT,
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at TEXT
);

CREATE TABLE IF NOT EXISTS product_seller_cache (
  product_id TEXT NOT NULL,
  seller_sku_id TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  price INTEGER,
  score REAL,
  raw_json TEXT NOT NULL,
  synced_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(product_id, seller_sku_id)
);

CREATE INDEX IF NOT EXISTS idx_product_seller_cache_product ON product_seller_cache(product_id, score DESC);

CREATE TABLE IF NOT EXISTS zone_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  patterns_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS zone_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  product_id TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS zone_assignments (
  buyer_product_id TEXT PRIMARY KEY,
  group_id INTEGER NOT NULL,
  zone_rule_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO app_settings(key,value,updated_at)
VALUES
  ('monitor_enabled','1',CURRENT_TIMESTAMP),
  ('auto_switch','0',CURRENT_TIMESTAMP),
  ('proactive_enabled','0',CURRENT_TIMESTAMP),
  ('max_price_increase_percent','10',CURRENT_TIMESTAMP),
  ('min_rating','0',CURRENT_TIMESTAMP),
  ('review_bonus_max','15',CURRENT_TIMESTAMP),
  ('preserve_max_price','1',CURRENT_TIMESTAMP),
  ('monitor_interval_minutes','5',CURRENT_TIMESTAMP),
  ('proactive_batch_size','5',CURRENT_TIMESTAMP),
  ('proactive_min_savings_percent','5',CURRENT_TIMESTAMP)
ON CONFLICT(key) DO NOTHING;
