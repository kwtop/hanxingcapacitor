-- Keep existing attribution unchanged. New fields are unavailable for old visits.
ALTER TABLE visits ADD COLUMN referrer_url TEXT NOT NULL DEFAULT '';
ALTER TABLE visits ADD COLUMN utm_medium TEXT NOT NULL DEFAULT '';
ALTER TABLE visits ADD COLUMN utm_campaign TEXT NOT NULL DEFAULT '';

-- SQLite CHECK constraints require rebuilding the table to add wechat_click.
-- No table references events; preserve every existing column and primary key.
CREATE TABLE events_with_wechat (
  id TEXT PRIMARY KEY,
  occurred_at INTEGER NOT NULL,
  visitor_id TEXT NOT NULL REFERENCES visitors(id),
  visit_id TEXT NOT NULL REFERENCES visits(id),
  type TEXT NOT NULL CHECK(type IN ('page_view','product_view','spec_expand','image_view','download_click','inquiry_click','whatsapp_click','email_click','wechat_click','form_start','form_failure','inquiry_success')),
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
  is_bot INTEGER NOT NULL DEFAULT 0,
  received_at INTEGER NOT NULL DEFAULT 0
);
INSERT INTO events_with_wechat SELECT id,occurred_at,visitor_id,visit_id,type,page,product,language,position,target,failure_code,inquiry_id,source,channel,country,device,is_internal,is_bot,received_at FROM events;
DROP TABLE events;
ALTER TABLE events_with_wechat RENAME TO events;
CREATE INDEX events_time ON events(occurred_at,type);
CREATE INDEX events_visitor_time ON events(visitor_id,occurred_at,id);
CREATE INDEX events_visit ON events(visit_id,occurred_at);
CREATE INDEX events_product_time ON events(product,occurred_at);
CREATE INDEX events_source_time ON events(source,occurred_at);
CREATE INDEX events_channel_time ON events(channel,occurred_at);
