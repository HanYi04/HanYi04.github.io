// ============================================================
//  GET  /api/messages   取留言列表（倒序，游标分页）
//  POST /api/messages   发留言（可选带一个附件）
//
//  安全要点：
//   - 全部使用 prepared statement，杜绝 SQL 注入
//   - 内容只存纯文本，前端用 textContent 渲染，杜绝 XSS
//   - 同 IP 60 秒内只能发一条，防止刷屏
//   - 附件上限 20MB，存 R2 不占数据库
// ============================================================

const MAX_CONTENT = 2000;   // 正文字符上限
const MAX_NAME = 30;        // 昵称字符上限
const MAX_FILE = 20 * 1024 * 1024;  // 附件 20MB

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// 把用户上传的文件名清洗成安全形式（保留中文），并限长
function safeFileName(name) {
  return String(name || 'file')
    .replace(/[\/\\:*?"<>|\x00-\x1f]/g, '_')
    .replace(/^\.+/, '')
    .slice(0, 80) || 'file';
}

export const onRequestGet = async ({ env, request }) => {
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10) || 20, 50);
  const before = url.searchParams.get('before');

  const sql = before
    ? `SELECT id, name, content, file_key, file_name, file_size, created_at
         FROM messages WHERE created_at < ?
        ORDER BY created_at DESC LIMIT ?`
    : `SELECT id, name, content, file_key, file_name, file_size, created_at
         FROM messages
        ORDER BY created_at DESC LIMIT ?`;

  const stmt = env.DB.prepare(sql);
  const { results } = before
    ? await stmt.bind(before, limit).all()
    : await stmt.bind(limit).all();

  return json({ ok: true, messages: results || [] });
};

export const onRequestPost = async ({ env, request }) => {
  // ---- 1. 解析请求体（同时兼容表单提交和 JSON）----
  let name = '';
  let content = '';
  let file = null;

  const ct = request.headers.get('content-type') || '';
  try {
    if (ct.includes('multipart/form-data')) {
      const form = await request.formData();
      name = String(form.get('name') || '').trim();
      content = String(form.get('content') || '').trim();
      const f = form.get('file');
      if (f && typeof f === 'object' && 'size' in f && f.size > 0) file = f;
    } else {
      const body = await request.json();
      name = String(body.name || '').trim();
      content = String(body.content || '').trim();
    }
  } catch {
    return json({ ok: false, error: '请求格式无法解析' }, 400);
  }

  // ---- 2. 校验 ----
  if (!content) return json({ ok: false, error: '留言内容不能为空' }, 400);
  if (content.length > MAX_CONTENT) {
    return json({ ok: false, error: `留言最多 ${MAX_CONTENT} 字` }, 400);
  }
  if (name.length > MAX_NAME) {
    return json({ ok: false, error: `昵称最多 ${MAX_NAME} 字` }, 400);
  }
  if (file && !env.FILES) {
    return json({ ok: false, error: '本站暂未开放附件上传，请把文件传到网盘后在留言里贴链接' }, 400);
  }
  if (file && file.size > MAX_FILE) {
    return json({ ok: false, error: '附件不能超过 20MB' }, 413);
  }

  // ---- 3. 限流：同一 IP 60 秒内只能发一条 ----
  const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
  const ipHash = await sha256(ip + (env.IP_SALT || 'guestbook'));
  const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();

  const { results: recent } = await env.DB
    .prepare('SELECT COUNT(*) AS c FROM messages WHERE ip_hash = ? AND created_at > ?')
    .bind(ipHash, oneMinuteAgo)
    .all();

  if ((recent?.[0]?.c || 0) >= 1) {
    return json({ ok: false, error: '发得太快了，请一分钟后再试' }, 429);
  }

  // ---- 4. 附件写入 R2 ----
  let fileKey = null;
  let fileName = null;
  let fileSize = null;

  if (file) {
    const clean = safeFileName(file.name);
    fileKey = `uploads/${crypto.randomUUID()}-${clean}`;
    try {
      await env.FILES.put(fileKey, file.stream(), {
        httpMetadata: { contentType: file.type || 'application/octet-stream' },
      });
      fileName = file.name.slice(0, 120);
      fileSize = file.size;
    } catch {
      return json({ ok: false, error: '附件保存失败，请重试' }, 500);
    }
  }

  // ---- 5. 写数据库 ----
  const createdAt = new Date().toISOString();
  try {
    await env.DB
      .prepare(`INSERT INTO messages
                  (name, content, file_key, file_name, file_size, created_at, ip_hash)
                VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .bind(name, content, fileKey, fileName, fileSize, createdAt, ipHash)
      .run();
  } catch {
    // 数据库失败时把已上传的附件清掉，避免留孤儿文件
    if (fileKey) {
      try { await env.FILES.delete(fileKey); } catch { /* 忽略 */ }
    }
    return json({ ok: false, error: '保存失败，请稍后重试' }, 500);
  }

  return json({
    ok: true,
    message: {
      name, content, created_at: createdAt,
      file_key: fileKey, file_name: fileName, file_size: fileSize,
    },
  }, 201);
};
