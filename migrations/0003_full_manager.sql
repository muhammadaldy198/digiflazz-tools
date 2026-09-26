CREATE TABLE IF NOT EXISTS product_cache (
  id TEXT PRIMARY KEY,
  code TEXT,
  product_id TEXT,
  product TEXT NOT NULL,
  category_id TEXT,
  category_name TEXT,
  max_price INTEGER NOT NULL DEFAULT 0,
  price INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  start_cut_off TEXT,
  end_cut_off TEXT,
  unlimited_stock INTEGER NOT NULL DEFAULT 0,
  seller TEXT,
  seller_sku_id TEXT,
  seller_sku_code TEXT,
  seller_connection_type TEXT,
  seller_sku_desc TEXT,
  status INTEGER NOT NULL DEFAULT 0,
  status_seller_sku INTEGER NOT NULL DEFAULT 0,
  issue TEXT,
  last_update TEXT,
  raw_json TEXT NOT NULL,
  last_proactive_at TEXT,
  synced_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_product_cache_code ON product_cache(code);
CREATE INDEX IF NOT EXISTS idx_product_cache_category ON product_cache(category_id);
CREATE INDEX IF NOT EXISTS idx_product_cache_issue ON product_cache(issue);
CREATE INDEX IF NOT EXISTS idx_product_cache_seller ON product_cache(seller);

CREATE TABLE IF NOT EXISTS seller_global_cache (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  payload_json TEXT NOT NULL,
  captured_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS change_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id TEXT,
  product_name TEXT,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  field TEXT,
  old_value TEXT,
  new_value TEXT,
  meta_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_change_events_time ON change_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_change_events_product ON change_events(product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_change_events_type ON change_events(type, created_at DESC);

CREATE TABLE IF NOT EXISTS monitor_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total_products INTEGER NOT NULL DEFAULT 0,
  issue_products INTEGER NOT NULL DEFAULT 0,
  switched_products INTEGER NOT NULL DEFAULT 0,
  proactive_findings INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_monitor_runs_time ON monitor_runs(created_at DESC);
