CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seller_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scope_type TEXT NOT NULL,
  scope_value TEXT,
  min_rating REAL,
  max_price INTEGER,
  require_stock INTEGER NOT NULL DEFAULT 1,
  avoid_cutoff INTEGER NOT NULL DEFAULT 1,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seller_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seller_name TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('preferred','blocked')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (seller_name, mode)
);

CREATE TABLE IF NOT EXISTS product_locks (
  buyer_sku_code TEXT PRIMARY KEY,
  reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS price_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  buyer_sku_code TEXT NOT NULL,
  seller_name TEXT,
  price INTEGER NOT NULL,
  captured_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_price_history_sku_time
ON price_history (buyer_sku_code, captured_at DESC);

CREATE TABLE IF NOT EXISTS switch_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  buyer_sku_code TEXT NOT NULL,
  from_seller TEXT,
  to_seller TEXT NOT NULL,
  reason TEXT NOT NULL,
  previous_price INTEGER,
  new_price INTEGER,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_switch_history_sku_time
ON switch_history (buyer_sku_code, created_at DESC);
