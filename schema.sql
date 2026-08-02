DROP TABLE IF EXISTS links;
CREATE TABLE links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,      -- 短链码 (x参数)
  url TEXT NOT NULL,              -- 原始长链接
  visits INTEGER DEFAULT 0,       -- 访问次数
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);