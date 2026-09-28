CREATE UNIQUE INDEX IF NOT EXISTS idx_scan_runs_single_running
ON scan_runs(status)
WHERE status='running';
