CREATE TABLE IF NOT EXISTS seller_rejections (
  sku TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  seller_name TEXT,
  reason TEXT NOT NULL,
  rejected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  retry_after TEXT,
  permanent INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (sku,seller_id),
  FOREIGN KEY (sku) REFERENCES products(sku) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_seller_rejections_active
ON seller_rejections(sku,permanent,retry_after);
