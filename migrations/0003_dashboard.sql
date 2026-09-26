CREATE TABLE IF NOT EXISTS products (
  sku TEXT PRIMARY KEY,
  product_id TEXT,
  name TEXT NOT NULL,
  category TEXT,
  brand TEXT,
  product_type TEXT,
  seller_id TEXT,
  seller_name TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  max_price INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 0,
  seller_active INTEGER NOT NULL DEFAULT 0,
  stock INTEGER,
  unlimited_stock INTEGER NOT NULL DEFAULT 0,
  end_cut_off TEXT,
  raw TEXT NOT NULL,
  last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category,brand);
CREATE TABLE IF NOT EXISTS sellers (
  seller_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rating REAL,
  review_count INTEGER,
  product_count INTEGER,
  invoice INTEGER,
  raw TEXT NOT NULL,
  last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS scan_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at TEXT,
  status TEXT NOT NULL DEFAULT 'running',
  total INTEGER NOT NULL DEFAULT 0,
  issues INTEGER NOT NULL DEFAULT 0,
  message TEXT
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level TEXT NOT NULL,
  kind TEXT NOT NULL,
  sku TEXT,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_events_time ON events(id DESC);
CREATE TABLE IF NOT EXISTS zones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  product_id TEXT NOT NULL,
  patterns TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS zone_assignments (
  sku TEXT PRIMARY KEY,
  zone_id INTEGER NOT NULL REFERENCES zones(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS seller_options (
  sku TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  rating REAL,
  stock INTEGER,
  unlimited_stock INTEGER NOT NULL DEFAULT 0,
  connection TEXT,
  sla TEXT,
  description TEXT,
  raw TEXT NOT NULL,
  last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (sku, seller_id)
);
