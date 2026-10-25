-- Keep the action time separate from its eventual network delivery time.
ALTER TABLE events ADD COLUMN received_at INTEGER NOT NULL DEFAULT 0;
UPDATE events SET received_at = occurred_at WHERE received_at = 0;
