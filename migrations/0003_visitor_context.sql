-- Optional request context. Older visits remain explicitly unknown.
ALTER TABLE visits ADD COLUMN city TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE visits ADD COLUMN browser_language TEXT NOT NULL DEFAULT 'unknown';
