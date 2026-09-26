CREATE TABLE IF NOT EXISTS digiflazz_connections (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  encrypted_payload TEXT NOT NULL,
  iv TEXT NOT NULL,
  source_host TEXT NOT NULL,
  last_test_status INTEGER,
  last_test_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
