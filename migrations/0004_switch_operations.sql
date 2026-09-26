-- One in-flight/uncertain save per product. An uncertain request is never repeated automatically.
CREATE TABLE IF NOT EXISTS switch_operations (
  sku TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('pending','success','error','unknown')),
  target_seller_id TEXT NOT NULL,
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
