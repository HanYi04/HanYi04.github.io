-- ============================================================
--  留言板数据库结构（Cloudflare D1 / SQLite）
--  执行方式：
--    本地  npx wrangler d1 execute guestbook --local  --file=./schema.sql
--    线上  npx wrangler d1 execute guestbook --remote --file=./schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  -- 显示用的名字，允许匿名（空则前端显示「匿名」）
  name        TEXT    NOT NULL DEFAULT '',
  -- 留言正文（纯文本，前端用 textContent 渲染，不解析 HTML）
  content     TEXT    NOT NULL,
  -- 附件信息（可选）。文件本体存在 R2，这里只存元数据
  file_key    TEXT,
  file_name   TEXT,
  file_size   INTEGER,
  -- 留言时间，ISO 8601 UTC
  created_at  TEXT    NOT NULL,
  -- 发贴者 IP 的哈希（不可逆），仅用于限流和删贴溯源
  ip_hash     TEXT
);

-- 列表按时间倒序查，给 created_at 建索引
CREATE INDEX IF NOT EXISTS idx_messages_created
  ON messages (created_at DESC);

-- 限流用：同一 ip_hash 在时间窗内的留言数
CREATE INDEX IF NOT EXISTS idx_messages_ip_time
  ON messages (ip_hash, created_at DESC);
