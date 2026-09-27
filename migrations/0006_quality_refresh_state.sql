CREATE TABLE IF NOT EXISTS quality_refresh_state (
  sku TEXT PRIMARY KEY,
  last_attempt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_result TEXT NOT NULL DEFAULT 'unknown',
  empty_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at TEXT,
  FOREIGN KEY (sku) REFERENCES products(sku) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quality_refresh_retry
ON quality_refresh_state(next_retry_at,sku);
