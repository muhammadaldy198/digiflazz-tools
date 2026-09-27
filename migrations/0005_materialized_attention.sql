ALTER TABLE products ADD COLUMN nominal_value REAL;

CREATE TABLE IF NOT EXISTS product_attention (
  sku TEXT PRIMARY KEY,
  needs_attention INTEGER NOT NULL DEFAULT 0,
  reasons_json TEXT NOT NULL DEFAULT '[]',
  operational_issue INTEGER NOT NULL DEFAULT 0,
  quality_issue INTEGER NOT NULL DEFAULT 0,
  price_issue INTEGER NOT NULL DEFAULT 0,
  pending_issue INTEGER NOT NULL DEFAULT 0,
  current_rating REAL,
  current_sla TEXT,
  best_candidate_seller TEXT,
  best_candidate_price INTEGER,
  best_candidate_rating REAL,
  best_candidate_sla INTEGER,
  option_count INTEGER NOT NULL DEFAULT 0,
  locked INTEGER NOT NULL DEFAULT 0,
  operation_status TEXT,
  dirty INTEGER NOT NULL DEFAULT 1,
  evaluated_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sku) REFERENCES products(sku) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_product_attention_state
ON product_attention(dirty,needs_attention,sku);

CREATE INDEX IF NOT EXISTS idx_products_nominal
ON products(brand,nominal_value,name,sku);

INSERT OR IGNORE INTO product_attention(sku,dirty)
SELECT sku,1 FROM products;
