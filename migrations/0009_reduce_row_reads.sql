-- Reduce row reads on dashboard, product filters, cooldown checks, and refresh rotation.
-- Safe for SQLite/D1/Turso; no application code depends on these indexes existing.

CREATE INDEX IF NOT EXISTS idx_products_active_sku
ON products(active,sku);

CREATE INDEX IF NOT EXISTS idx_products_active_catalog
ON products(active,category,brand,nominal_value,sku);

CREATE INDEX IF NOT EXISTS idx_product_attention_candidate
ON product_attention(dirty,needs_attention,best_candidate_seller,sku);

CREATE INDEX IF NOT EXISTS idx_switch_history_success_lookup
ON switch_history(buyer_sku_code,status,created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quality_refresh_rotation
ON quality_refresh_state(last_attempt,next_retry_at,sku);
