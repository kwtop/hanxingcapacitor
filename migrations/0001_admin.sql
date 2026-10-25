PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS visitors (
  id TEXT PRIMARY KEY,
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY,
  visitor_id TEXT NOT NULL REFERENCES visitors(id),
  started_at INTEGER NOT NULL,
  last_seen INTEGER NOT NULL,
  entry_page TEXT NOT NULL,
  source TEXT NOT NULL,
  channel TEXT NOT NULL,
  referrer_host TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT 'unknown',
  device TEXT NOT NULL DEFAULT 'unknown',
  language TEXT NOT NULL DEFAULT 'unknown',
  is_internal INTEGER NOT NULL DEFAULT 0,
  is_bot INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS visits_visitor_time ON visits(visitor_id, started_at);
CREATE INDEX IF NOT EXISTS visits_time ON visits(started_at);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL,
  products TEXT NOT NULL,
  message TEXT NOT NULL,
  context TEXT NOT NULL DEFAULT '',
  submission_page TEXT NOT NULL,
  source_page TEXT NOT NULL,
  language TEXT NOT NULL,
  source TEXT NOT NULL,
  channel TEXT NOT NULL,
  visitor_id TEXT REFERENCES visitors(id),
  visit_id TEXT REFERENCES visits(id),
  is_internal INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','following','completed','spam')),
  read_at INTEGER,
  version INTEGER NOT NULL DEFAULT 1,
  idempotency_hash TEXT NOT NULL UNIQUE,
  payload_hash TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS inquiries_created ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_status_created ON inquiries(status,created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_visitor ON inquiries(visitor_id,created_at);
CREATE INDEX IF NOT EXISTS inquiries_payload ON inquiries(payload_hash,created_at);
CREATE TABLE IF NOT EXISTS inquiry_dedupes (
  fingerprint TEXT PRIMARY KEY,
  inquiry_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS inquiry_notes (
  id TEXT PRIMARY KEY,
  inquiry_id TEXT NOT NULL REFERENCES inquiries(id),
  created_at INTEGER NOT NULL,
  author TEXT NOT NULL,
  note TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS notes_inquiry ON inquiry_notes(inquiry_id,created_at);
CREATE TABLE IF NOT EXISTS inquiry_activity (
  id TEXT PRIMARY KEY,
  inquiry_id TEXT NOT NULL REFERENCES inquiries(id),
  created_at INTEGER NOT NULL,
  author TEXT NOT NULL,
  action TEXT NOT NULL,
  value TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS activity_inquiry ON inquiry_activity(inquiry_id,created_at);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  occurred_at INTEGER NOT NULL,
  visitor_id TEXT NOT NULL REFERENCES visitors(id),
  visit_id TEXT NOT NULL REFERENCES visits(id),
  type TEXT NOT NULL CHECK(type IN ('page_view','product_view','spec_expand','image_view','download_click','inquiry_click','whatsapp_click','email_click','form_start','form_failure','inquiry_success')),
  page TEXT NOT NULL,
  product TEXT NOT NULL DEFAULT 'unknown',
  language TEXT NOT NULL DEFAULT 'unknown',
  position TEXT NOT NULL DEFAULT 'unknown',
  target TEXT NOT NULL DEFAULT '',
  failure_code TEXT NOT NULL DEFAULT '',
  inquiry_id TEXT REFERENCES inquiries(id),
  source TEXT NOT NULL,
  channel TEXT NOT NULL,
  country TEXT NOT NULL,
  device TEXT NOT NULL,
  is_internal INTEGER NOT NULL DEFAULT 0,
  is_bot INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS events_time ON events(occurred_at,type);
CREATE INDEX IF NOT EXISTS events_visitor_time ON events(visitor_id,occurred_at,id);
CREATE INDEX IF NOT EXISTS events_visit ON events(visit_id,occurred_at);
CREATE INDEX IF NOT EXISTS events_product_time ON events(product,occurred_at);
CREATE INDEX IF NOT EXISTS events_source_time ON events(source,occurred_at);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  csrf TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_sessions_expiry ON admin_sessions(expires_at);
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS rate_limits_expiry ON rate_limits(expires_at);
